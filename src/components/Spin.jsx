import { useState } from "react";
import activities from "../data/data";
import { parseISO, isSameDay, isAfter, isBefore, endOfWeek, startOfDay } from "date-fns";


function Spin() {
  const [includeFun, setIncludeFun] = useState(false);
  const [includeBucket, setIncludeBucket] = useState(false);
  const [includeChores, setIncludeChores] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [usedActivityIds, setUsedActivityIds] = useState([]);

  const today = new Date();
      const todayStart = startOfDay(today);
    const weekEnd = endOfWeek(todayStart, { weekStartsOn: 1 });  // week ends on sunday

  // filter: always include today's Daily
  const todaysActivities = activities.filter((activity) => {
    if (activity.type.toLowerCase() === "daily" && activity.date && activity.category.toLowerCase() !== "chores") {
      return isSameDay(parseISO(activity.date), today);
    }
    return false;
  });

  // filter: optionally include Fun and / or Bucket
  // add weekly chores, and make them optional
  // randomly choose only one bucket and only one fun if chores are chosen
  const optionalActivities = activities.filter((activity) => {
    if (includeFun && activity.type.toLowerCase() === "fun") return true;
    if (includeBucket && activity.type.toLowerCase() === "bucket") return true;
    if (includeChores && activity.category.toLowerCase() === "chores" &&
      activity.deadline &&
      !isSameDay(today, weekEnd) && // if it's sunday, exclude it
      isAfter(parseISO(activity.deadline), todayStart) &&
      isBefore(parseISO(activity.deadline), weekEnd)) return true;
    return false;
  });

  // combine the two filtered arrays
  const allFiltered = [...todaysActivities, ...optionalActivities].filter(
    (item, index, self) => self.findIndex(a => a.id === item.id) === index
  );

  // exclude previously picked activities
  const availableForSpin = allFiltered.filter(
    (act) => !usedActivityIds.includes(act.id) && act.id !== selectedActivityId
  );

  // pick a random activity from the available ones
  const handleSpin = () => {
    if (selectedActivityId !== null) {
      setUsedActivityIds((prev) => [...prev, selectedActivityId]);
    }

    if (availableForSpin.length === 0) {
      setSelectedActivityId(null);  // nothing left to select
      alert("you have done everything for the day!");
      return;
    }

    const random = availableForSpin[Math.floor(Math.random() * availableForSpin.length)];
    setSelectedActivityId(random.id);
  };

  // ADD PASS to do the same activity later

  const passActivityId = (id) => {
    setUsedActivityIds((prev) => prev.filter((usedId) => usedId !== id));
  }

  const pass = () => {
    if (selectedActivityId !== null) {
      passActivityId(selectedActivityId);  // remove selected activity from used
      setSelectedActivityId(null);  // deselect it
    }
  };

  return(
    <div>
      <h2>spin planner</h2>
      <div>
        <label>
          <input type="checkbox"
          checked={includeFun} 
          onChange={() => setIncludeFun(!includeFun)}
          />
          include fun
        </label>
        <label>
          <input type="checkbox" 
          checked={includeBucket}
          onChange={() => setIncludeBucket(!includeBucket)}
          />
          include bucket
        </label>
        <label>
          <input type="checkbox" 
          checked={includeChores}
          onChange={() => setIncludeChores(!includeChores)}
          />
          include chores
        </label>
      </div>

      <button onClick={handleSpin}>spin!</button>
      <button onClick={pass} disabled={!selectedActivityId}>pass</button>

      <div>
        <h4>filtered activities ({allFiltered.length}):</h4>
        <ul>
          {allFiltered.map((act) => {
            const isSelected = act.id === selectedActivityId;
            const isUsed = usedActivityIds.includes(act.id);

            return (
              <li
              key={act.id}
              style= {{
                fontWeight: isSelected ? "bold" : "normal",
                fontStyle: isUsed ? "italic" : "normal",
              }}
              >
                {act.title} - {act.description} - {act.category} - {act.type}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Spin;