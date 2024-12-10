use crate::file::Model;

use llama_cpp_2::llama_backend::LlamaBackend;
use llama_cpp_2::model::LlamaModel;
use llama_cpp_2::sampling::LlamaSampler;

// pub const MODELS: &[Model] = &[
//     Model::new("Qwen2-1.5B-Instruct-Q4-GGUF", "", "https://huggingface.co/Qwen/Qwen2-1.5B-Instruct-GGUF/resolve/main/qwen2-1_5b-instruct-q4_0.gguf"),
// ];

// https://github.com/utilityai/llama-cpp-rs/blob/main/examples/usage.rs
#[tauri::command]
#[specta::specta]
pub async fn start_llm() {
    let backend = LlamaBackend::init().unwrap();

    let mut decoder = encoding_rs::UTF_8.new_decoder();
    let mut sampler =
        LlamaSampler::chain_simple([LlamaSampler::dist(1234), LlamaSampler::greedy()]);
}
