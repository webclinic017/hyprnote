pub struct Model {
    pub name: String,
    pub local_path: String,
    pub remote_url: String,
}

impl Model {
    pub fn new(name: &str, local_path: &str, remote_url: &str) -> Self {
        Self {
            name: name.to_string(),
            local_path: local_path.to_string(),
            remote_url: remote_url.to_string(),
        }
    }

    pub fn exists(&self) -> bool {
        Path::new(&self.local_path).exists()
    }
}

#[tauri::command]
#[specta::specta]
pub async fn download_model(model: Model, window: tauri::Window) {
    let (tx, mut rx) = tauri::async_runtime::channel::<String>(100);

    tauri::async_runtime::spawn(async move {
        while let Some(progress) = rx.recv().await {
            window.emit("download-progress", progress).unwrap();
        }
    });

    match reqwest::get(&model.remote_url).await {
        Ok(response) => {
            if response.status().is_success() {
                let total_size = response.content_length().unwrap_or(0);
                let mut downloaded: u64 = 0;
                let mut stream = response.bytes_stream();

                while let Some(chunk) = stream.next().await {
                    match chunk {
                        Ok(bytes) => {
                            downloaded += bytes.len() as u64;
                            let percent = (downloaded as f64 / total_size as f64) * 100.0;
                            let progress = format!(
                                "Downloaded: {} / {} bytes ({:.2}%)",
                                downloaded, total_size, percent
                            );
                            tx.send(progress).await.unwrap();
                        }
                        Err(e) => {
                            eprintln!("Error while downloading: {}", e);
                            break;
                        }
                    }
                }

                // Send a final progress update
                tx.send("Download complete".to_string()).await.unwrap();
                // Process the content, e.g., save to local_path
            } else {
                eprintln!("Failed to download model: {}", response.status());
            }
        }
        Err(e) => {
            eprintln!("Request error: {}", e);
        }
    }
}
