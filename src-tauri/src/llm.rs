use std::path::PathBuf;

use candle_core::quantized::gguf_file;
use candle_core::Device;
use candle_core::Tensor;
use candle_examples::token_output_stream::TokenOutputStream;
use candle_transformers::generation::{LogitsProcessor, Sampling};
use candle_transformers::models::quantized_qwen2::ModelWeights as Qwen2;
// TODO: in prod, we need some kind of CDN for this downloads.

// https://github.com/huggingface/candle/blob/main/candle-examples/examples/quantized-qwen2-instruct/main.rs
#[tauri::command]
#[specta::specta]
pub async fn start_llm() -> anyhow::Result<String> {
    let tokenizer_path = "/Users/yujonglee/dev/company/hypr/src-tauri/tmp/tokenizer.json";
    let tokenizer = tokenizers::Tokenizer::from_file(tokenizer_path).map_err(anyhow::Error::msg)?;

    let model_path = PathBuf::from(
        "/Users/yujonglee/dev/company/hypr/src-tauri/tmp/qwen2-0.5b-instruct-q4_0.gguf",
    );
    let mut file = std::fs::File::open(&model_path)?;

    let device = Device::new_metal(0)?;

    let mut model = {
        let model = gguf_file::Content::read(&mut file).map_err(|e| e.with_path(model_path))?;
        Qwen2::from_gguf(model, &mut file, &device)?
    };

    let mut tos = TokenOutputStream::new(tokenizer);
    let prompt_str = "hello".to_string();
    let prompt_str = format!(
        "<|im_start|>user\n{}<|im_end|>\n<|im_start|>assistant\n",
        prompt_str
    );

    let tokens = tos
        .tokenizer()
        .encode(prompt_str, true)
        .map_err(anyhow::Error::msg)?;
    let tokens = tokens.get_ids();

    // Define default generation parameters
    let temperature = 0.8;
    let sample_len: usize = 1000;
    let repeat_penalty = 1.1;
    let repeat_last_n = 64;
    let seed = 299792458;

    let mut all_tokens = vec![];
    let mut logits_processor = {
        let sampling = if temperature <= 0. {
            Sampling::ArgMax
        } else {
            Sampling::All { temperature }
        };
        LogitsProcessor::from_sampling(seed, sampling)
    };

    // Process the initial prompt
    let input = Tensor::new(tokens, &device)?.unsqueeze(0)?;
    let logits = model.forward(&input, 0)?;
    let logits = logits.squeeze(0)?;
    let mut next_token = logits_processor.sample(&logits)?;

    all_tokens.push(next_token);
    let mut generated_text = String::new();
    if let Some(t) = tos.next_token(next_token)? {
        generated_text.push_str(&t);
    }

    // Generate the rest of the tokens
    let eos_token = *tos.tokenizer().get_vocab(true).get("<|im_end|>").unwrap();
    let to_sample = sample_len.saturating_sub(1);

    for index in 0..to_sample {
        let input = Tensor::new(&[next_token], &device)?.unsqueeze(0)?;
        let logits = model.forward(&input, tokens.len() + index)?;
        let logits = logits.squeeze(0)?;

        let logits = if repeat_penalty == 1. {
            logits
        } else {
            let start_at = all_tokens.len().saturating_sub(repeat_last_n);
            candle_transformers::utils::apply_repeat_penalty(
                &logits,
                repeat_penalty,
                &all_tokens[start_at..],
            )?
        };

        next_token = logits_processor.sample(&logits)?;
        all_tokens.push(next_token);

        if let Some(t) = tos.next_token(next_token)? {
            generated_text.push_str(&t);
        }

        if next_token == eos_token {
            break;
        }
    }

    if let Some(rest) = tos.decode_rest().map_err(candle_core::Error::msg)? {
        generated_text.push_str(&rest);
    }

    Ok(generated_text)
}

#[cfg(test)]
mod tests {
    use super::*;
    use tokio;

    #[tokio::test]
    async fn test_start_llm() {
        let result = start_llm().await;
        println!("{:?}", result);
    }
}
