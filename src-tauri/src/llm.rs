use llama_cpp_2::llama_backend::LlamaBackend;
use llama_cpp_2::model::LlamaModel;

// https://github.com/utilityai/llama-cpp-rs/blob/main/examples/usage.rs

#[tauri::command]
#[specta::specta]
pub async fn start_llm() {
    let backend = LlamaBackend::init()?;

    let mut decoder = encoding_rs::UTF_8.new_decoder();
    let mut sampler = LlamaSampler::chain_simple([
        LlamaSampler::dist(seed.unwrap_or(1234)),
        LlamaSampler::greedy(),
    ]);
}
