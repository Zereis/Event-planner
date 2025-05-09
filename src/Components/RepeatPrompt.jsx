export default function RepeatPrompt({ task, onConfirm, onCancel }) {
    const createdTasks = [];
  
    const generateId = () => Date.now().toString();
    const formatLocalDateTime = (d) =>
      d.toLocaleString("sv-SE").replace(" ", "T").slice(0, 16);
  
    const repeatTask = (newDate) => {
      createdTasks.push({
        ...task,
        id: generateId(),
        dateTime: formatLocalDateTime(newDate),
      });
    };
  
    const handleRepeat = () => {
      createdTasks.push({ ...task, id: generateId() });
  
      const repeat = prompt(
        "Repeat task?\n1: Every day (next 6 days)\n2: Specific day range (10-20)\n3: Same day each month\n4: Repeat yearly until year\n(Leave blank to skip)"
      );
  
      try {
        if (repeat === "1") {
          for (let i = 1; i <= 6; i++) {
            const date = new Date(task.dateTime);
            date.setDate(date.getDate() + i);
            repeatTask(date);
          }
        } else if (repeat === "2") {
          const [startStr, endStr] = prompt("Enter range like 10-20:").split("-");
          const start = parseInt(startStr), end = parseInt(endStr);
          const base = new Date(task.dateTime);
          for (let d = start; d <= end; d++) {
            const newDate = new Date(base.getFullYear(), base.getMonth(), d, base.getHours(), base.getMinutes());
            repeatTask(newDate);
          }
        } else if (repeat === "3") {
          const day = parseInt(prompt("Day of month (1-31):"));
          const base = new Date(task.dateTime);
          for (let m = base.getMonth() + 1; m < 12; m++) {
            const newDate = new Date(base.getFullYear(), m, day, base.getHours(), base.getMinutes());
            if (newDate.getDate() === day) repeatTask(newDate);
          }
        } else if (repeat === "4") {
          const targetYear = parseInt(prompt("Repeat until year (e.g. 2028):"));
          const base = new Date(task.dateTime);
          for (let y = base.getFullYear() + 1; y <= targetYear; y++) {
            const newDate = new Date(y, base.getMonth(), base.getDate(), base.getHours(), base.getMinutes());
            repeatTask(newDate);
          }
        }
      } catch (err) {
        alert("❌ Invalid repeat settings");
      }
      console.log("Created Tasks:", createdTasks);  // 👈 Debug output
  
      onConfirm(createdTasks);
    };
  
    return (
      <div>
        <p>Confirming task: <strong>{task.title}</strong></p>
        <button onClick={handleRepeat}>✅ Confirm with Repeat</button>
        <button onClick={onCancel}>❌ Cancel</button>
      </div>
    );
  }
  