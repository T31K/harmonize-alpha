use std::fs;
use std::io::{Error};

fn create_folder_and_files() -> Result<(), Error> {
    let home_dir = std::env::var("HOME").expect("Failed to get home directory");
    let folder_name = "com.harmonize";
    let app_file_name = "app.conf";
    let hash_file_name = "hash.conf";
    let app_support_path = format!("{}/Library/Application Support", home_dir);
    let path = std::path::Path::new(&app_support_path).join(folder_name);

    // create folder if it doesn't exist
    if !path.exists() {
        fs::create_dir_all(&path)?;
    }

    // create app.conf file if it doesn't exist
    let app_file_path = path.join(app_file_name);
    if !app_file_path.exists() {
        fs::File::create(&app_file_path)?;
    }

    // create hash.conf file if it doesn't exist
    let hash_file_path = path.join(hash_file_name);
    if !hash_file_path.exists() {
        fs::File::create(&hash_file_path)?;
    }
    Ok(())
}


fn main() {
  if let Err(e) = create_folder_and_files() {
      eprintln!("Failed to create folder and file: {}", e);
      return;
  }

  let context = tauri::generate_context!();
  tauri::Builder::default()
      .menu(if cfg!(target_os = "macos") {
          tauri::Menu::os_default(&context.package_info().name)
      } else {
          tauri::Menu::default()
      })
      .run(context)
      .expect("error while running tauri application");
}
