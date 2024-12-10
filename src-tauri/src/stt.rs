use crate::file::Model;

use whisper_rs::{FullParams, SamplingStrategy, WhisperContext, WhisperContextParameters};

// https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin
#[tauri::command]
#[specta::specta]
pub async fn start_stt() {}
