use candle_transformers::models::whisper::{self as m, audio, Config};

// https://github.com/huggingface/candle/blob/main/candle-examples/examples/whisper/main.rs
// https://github.com/huggingface/candle/blob/main/candle-examples/examples/whisper-microphone/main.rs
#[tauri::command]
#[specta::specta]
pub async fn start_stt() {}

#[cfg(test)]
mod tests {
    use super::*;
    use tokio;

    #[tokio::test]
    async fn test_start_stt() {
        let result = start_stt().await;
        println!("{:?}", result);
    }
}
