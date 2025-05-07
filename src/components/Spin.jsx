import { useState, useEffect } from "react";
import activities from "../data/data";
import { parseISO, isSameDay, isAfter, isBefore, endOfWeek, startOfDay } from "date-fns";


function Spin() {
  const [includeFun, setIncludeFun] = useState(false);
  const [includeBucket, setIncludeBucket] = useState(false);
  const [includeChores, setIncludeChores] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [usedActivityIds, setUsedActivityIds] = useState([]);
  const [randomFunActivity, setRandomFunActivity] = useState(null);  // prevent randomization at render time
  const [randomBucketActivity, setRandomBucketActivity] = useState(null);  // prevent randomization at render time


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

  const funActivities = activities.filter(
    (act) => act.type.toLowerCase() === "fun"
  );

  const bucketActivities = activities.filter(
    (act) => act.type.toLowerCase() === "bucket"
  );

  const weeklyChores = includeChores
  ? activities.filter((activity) => 
    activity.category.toLowerCase() === "chores" &&
    activity.deadline &&
    !isSameDay(today, weekEnd) && // if it's sunday, exclude it
    isAfter(parseISO(activity.deadline), todayStart) &&
    isBefore(parseISO(activity.deadline), weekEnd)
  )
  : [];

  // choose fun or bucket depending on chore inclusion
  let optionalActivities = [];
  // useEffect prevents randomization at render time
  // if chores are included, randomize fun and bucket activities and fix them in optionalActivities for rendering
  useEffect(() => {
    if (includeChores) {
      if (includeFun && !randomFunActivity && funActivities.length) {
        const picked = funActivities[Math.floor(Math.random() * funActivities.length)];
        setRandomFunActivity(picked);
      }
      if (includeBucket && !randomBucketActivity && bucketActivities.length) {
        const picked = bucketActivities[Math.floor(Math.random() * bucketActivities.length)];
        setRandomBucketActivity(picked);
      }
      else if (!includeFun && randomFunActivity) {
        setRandomFunActivity(null);
      }
      else if (!includeBucket && randomBucketActivity) {
        setRandomBucketActivity(null);
      }
    } else {
      // reset if chores are off
      setRandomFunActivity(null);
      setRandomBucketActivity(null);
    }
  }, [includeChores, includeFun, includeBucket, funActivities, bucketActivities]);

  if (includeChores) {
  optionalActivities = [
    ...weeklyChores,
    ...(randomFunActivity ? [randomFunActivity] : []),
    ...(randomBucketActivity ? [randomBucketActivity] : []),
  ];
  } else {
    if (includeFun) optionalActivities.push(...funActivities);
    if (includeBucket) optionalActivities.push(...bucketActivities);
  }

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

  // ADD PASS to do the same activity
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