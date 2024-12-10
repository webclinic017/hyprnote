use ort::{execution_providers::CoreMLExecutionProvider, session::Session};

const MODEL_BYTES: &[u8] = include_bytes!("../models/segmentation.onnx");

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
