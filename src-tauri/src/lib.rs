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
  ensure_schema(&connection)?;

  Ok(connection)
}

fn ensure_schema(connection: &rusqlite::Connection) -> Result<(), String> {
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

  Ok(())
}

fn load_state_from_connection(connection: &rusqlite::Connection) -> Result<Option<String>, String> {
  ensure_schema(connection)?;
  let mut statement = connection
    .prepare("SELECT value FROM app_state WHERE key = 'focuslab.v1.sprint'")
    .map_err(|err| err.to_string())?;
  let mut rows = statement.query([]).map_err(|err| err.to_string())?;

  match rows.next().map_err(|err| err.to_string())? {
    Some(row) => row.get(0).map(Some).map_err(|err| err.to_string()),
    None => Ok(None),
  }
}

fn save_state_to_connection(connection: &rusqlite::Connection, state: &str) -> Result<(), String> {
  ensure_schema(connection)?;
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

#[tauri::command]
fn load_state() -> Result<Option<String>, String> {
  let connection = open_database()?;
  load_state_from_connection(&connection)
}

#[tauri::command]
fn save_state(state: String) -> Result<(), String> {
  let connection = open_database()?;
  save_state_to_connection(&connection, &state)
}

#[cfg(test)]
mod tests {
  use super::*;

  fn memory_connection() -> rusqlite::Connection {
    rusqlite::Connection::open_in_memory().expect("in-memory SQLite should open")
  }

  #[test]
  fn load_state_returns_none_when_no_state_is_saved() {
    let connection = memory_connection();

    assert_eq!(load_state_from_connection(&connection).unwrap(), None);
  }

  #[test]
  fn save_and_load_state_round_trip() {
    let connection = memory_connection();
    let state = r#"{"sprint":{"title":"Persisted sprint"},"tasks":[]}"#;

    save_state_to_connection(&connection, state).unwrap();

    assert_eq!(load_state_from_connection(&connection).unwrap(), Some(state.to_string()));
  }

  #[test]
  fn save_state_overwrites_existing_snapshot() {
    let connection = memory_connection();

    save_state_to_connection(&connection, r#"{"version":1}"#).unwrap();
    save_state_to_connection(&connection, r#"{"version":2}"#).unwrap();

    assert_eq!(load_state_from_connection(&connection).unwrap(), Some(r#"{"version":2}"#.to_string()));
  }

  #[test]
  fn schema_creation_is_idempotent() {
    let connection = memory_connection();

    ensure_schema(&connection).unwrap();
    ensure_schema(&connection).unwrap();

    let table_count: i64 = connection
      .query_row(
        "SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name = 'app_state'",
        [],
        |row| row.get(0),
      )
      .unwrap();

    assert_eq!(table_count, 1);
  }
}
