use ort::{execution_providers::CoreMLExecutionProvider, session::Session};

const MODEL_BYTES: &[u8] = include_bytes!("../models/segmentation.onnx");

// https://huggingface.co/onnx-community/pyannote-segmentation-3.0/blob/main/preprocessor_config.json
// https://github.com/huggingface/transformers.js/tree/14bf689/src/models/pyannote
pub fn segment(_: &[f32]) {
    let _ = Session::builder()
        .unwrap()
        .with_execution_providers([
            // https://ort.pyke.io/perf/execution-providers#coreml
            #[cfg(target_os = "macos")]
            CoreMLExecutionProvider::default().build(),
        ])
        .unwrap()
        .commit_from_memory(MODEL_BYTES)
        .unwrap();
}

#[cfg(test)]
mod tests {
    use super::*;

    use hound;
    use reqwest;

    // https://github.com/huggingface/transformers.js/blob/14bf689/src/utils/audio.js#L26
    async fn download_audio() -> anyhow::Result<Vec<f32>> {
        let bytes = reqwest::get(
            "https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/mlk.wav",
        )
        .await
        .expect("Failed to download audio")
        .bytes()
        .await
        .expect("Failed to read audio bytes");

        let cursor = std::io::Cursor::new(bytes);
        let mut reader = hound::WavReader::new(cursor).expect("Failed to read WAV file");

        let samples: Vec<f32> = match reader.spec().sample_format {
            hound::SampleFormat::Int => reader
                .samples::<i32>()
                .map(|s| s.unwrap() as f32 / i32::MAX as f32)
                .collect(),

            hound::SampleFormat::Float => reader.samples::<f32>().map(|s| s.unwrap()).collect(),
        };

        Ok(samples)
    }

    #[tokio::test]
    async fn test_segmentation() {
        let samples = download_audio().await.unwrap();
        assert!(samples.len() == 208000);
        segment(&samples);
    }
}
