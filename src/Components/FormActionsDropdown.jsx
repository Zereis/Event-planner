// src/Components/FormActionsDropdown.jsx
export default function FormActionsDropdown({ onClear, onReuse }) {
    return (
      <details>
        <summary>⚙️ Form Actions</summary>
        <button type="button" onClick={onClear}>🧹 Clear Form</button><br />
        <button type="button" onClick={onReuse}>♻️ Reuse Last Task</button>
      </details>
    );
  }
  