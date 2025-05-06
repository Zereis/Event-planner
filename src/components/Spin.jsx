import { useState } from "react";
import activities from "../data/data";
import { parseISO, isSameDay } from "date-fns";


function Spin() {
  const [includeFun, setIncludeFun] = useState(false);
  const [includeBucket, setIncludeBucket] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [usedActivityIds, setUsedActivityIds] = useState([]);

  const today = new Date();

  // filter: always include today's Daily
  const todaysActivities = activities.filter((activity) => {
    if (activity.type === "Daily" && activity.date) {
      return isSameDay(parseISO(activity.date), today);
    }
    return false;
  });

  // filter: optionally include Fun and / or Bucket
  const optionalActivities = activities.filter((activity) => {
    if (includeFun && activity.type === "Fun") return true;
    if (includeBucket && activity.type === "Bucket") return true;
    return false;
  });

  // combine the two filtered arrays
  // add weekly & monthly activities
  const allFiltered = [...todaysActivities, ...optionalActivities].filter(
    (item, index, self) => self.findIndex(a => a.id === item.id) === index
  );

  // exclude previously picked activities
  const availableForSpin = allFiltered.filter(
    (act) => !usedActivityIds.includes(act.id) && act.id !== selectedActivityId
  );

  // pick a random activity from the available ones
  // ADD PASS functionality to do the same activity later
  // randomly choose one bucket and one fun if Daily is chosen
  // make Daily optional

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
      </div>

      <button onClick={handleSpin}>spin!</button>

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