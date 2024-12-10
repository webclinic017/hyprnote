use std::sync::RwLock;
use tauri::Manager;

mod audio;
mod permissions;

#[derive(specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct App {}

#[tauri::command]
#[specta::specta]
fn list_devices() -> Vec<String> {
    vec!["Device 1".to_string(), "Device 2".to_string()]
}

#[tauri::command]
#[specta::specta]
fn start_recording() {
    audio::AppSounds::StartRecording.play();
}

#[tauri::command]
#[specta::specta]
fn stop_recording() {
    audio::AppSounds::StopRecording.play();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let specta_builder = tauri_specta::Builder::new()
        .commands(tauri_specta::collect_commands![
            list_devices,
            start_recording,
            stop_recording,
            permissions::open_permission_settings,
        ])
        .events(tauri_specta::collect_events![]);

    #[cfg(debug_assertions)]
    specta_builder
        .export(
            specta_typescript::Typescript::default(),
            "../src/utils/tauri.ts",
        )
        .expect("Failed to export typescript bindings");

    let mut builder = tauri::Builder::default().plugin(tauri_plugin_positioner::init());

    // https://v2.tauri.app/plugin/single-instance/#focusing-on-new-instance
    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }));
    }

    #[cfg(not(debug_assertions))]
    {
        builder = builder.plugin(
            tauri_plugin_keygen_rs2::Builder::new(
                dotenvy_macro::dotenv!("KEYGEN_ACCOUNT"),
                dotenvy_macro::dotenv!("KEYGEN_PRODUCT"),
                dotenvy_macro::dotenv!("KEYGEN_PUBLIC_KEY"),
            )
            .api_url(dotenvy_macro::dotenv!("KEYGEN_API_URL"))
            .build(),
        );
    }

    builder
        .plugin(tauri_plugin_shell::init())
        // TODO: https://v2.tauri.app/plugin/updater/#building
        // .plugin(tauri_plugin_updater::Builder::new().build())
        .manage(RwLock::new(App {}))
        .invoke_handler({
            let handler = specta_builder.invoke_handler();
            move |invoke| handler(invoke)
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
