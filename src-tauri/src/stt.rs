use whisper_rs::{FullParams, SamplingStrategy, WhisperContext, WhisperContextParameters};

#[tauri::command]
#[specta::specta]
pub async fn start_stt() {
    let whisper = Whisper::new();
}
