// src/Components/GlobalActionsDropdown.jsx
export default function GlobalActionsDropdown({ onClearAll, onBulkDelete, onExport, onImport }) {
    return (
      <details>
        <summary>🛠️ Task Utilities</summary>
        <button onClick={onClearAll}>🗑️ Clear All Tasks</button><br />
        <button onClick={onBulkDelete}>🗑️ Bulk Delete Tasks</button><br />
        <button onClick={onExport}>⬇️ Export Tasks</button><br />
        <label>
          📂 Import Tasks:
          <input type="file" accept=".json" onChange={onImport} />
        </label>
      </details>
    );
  }
  