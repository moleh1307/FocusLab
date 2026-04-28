#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![load_state, save_state])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

fn database_path() -> Result<std::path::PathBuf, String> {
  let base = dirs::data_dir().ok_or_else(|| "Could not locate application data directory".to_string())?;
  Ok(base.join("FocusLab").join("focuslab.sqlite"))
}

fn open_database() -> Result<rusqlite::Connection, String> {
  let path = database_path()?;

  if let Some(parent) = path.parent() {
    std::fs::create_dir_all(parent).map_err(|err| err.to_string())?;
  }

  let connection = rusqlite::Connection::open(path).map_err(|err| err.to_string())?;
  connection
    .execute(
      "CREATE TABLE IF NOT EXISTS app_state (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )",
      [],
    )
    .map_err(|err| err.to_string())?;

  Ok(connection)
}

#[tauri::command]
fn load_state() -> Result<Option<String>, String> {
  let connection = open_database()?;
  let mut statement = connection
    .prepare("SELECT value FROM app_state WHERE key = 'focuslab.v1.sprint'")
    .map_err(|err| err.to_string())?;
  let mut rows = statement.query([]).map_err(|err| err.to_string())?;

  match rows.next().map_err(|err| err.to_string())? {
    Some(row) => row.get(0).map(Some).map_err(|err| err.to_string()),
    None => Ok(None),
  }
}

#[tauri::command]
fn save_state(state: String) -> Result<(), String> {
  let connection = open_database()?;
  connection
    .execute(
      "INSERT INTO app_state (key, value, updated_at)
       VALUES ('focuslab.v1.sprint', ?1, CURRENT_TIMESTAMP)
       ON CONFLICT(key) DO UPDATE SET
         value = excluded.value,
         updated_at = CURRENT_TIMESTAMP",
      [state],
    )
    .map_err(|err| err.to_string())?;

  Ok(())
}
