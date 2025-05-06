import { useState } from "react";
import activities from "../data/data";
import { format, parseISO } from "date-fns";


function Spin() {
  const [includeFun, setIncludeFun] = useState(false);
  const [includeBucket, setIncludeBucket] = useState(false);

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
  const allFiltered = [...todaysActivities, ...optionalActivities].filter(
    (item, index, self) => self.findIndex(a => a.id === item.id) === index
  );

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
      <div>
        <h4>filtered activities ({allFiltered.length}):</h4>
        <ul>
          {allFiltered.map((act) => (
            <li key={act.id}>
              {act.title} - {act.description} - {act.type} - ({act.category})
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

}

export default Spin;