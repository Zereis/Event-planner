import { useState, useEffect, useRef } from "react";
import activities from "../data/data";
import { parseISO, isSameDay, isAfter, isBefore, endOfWeek, startOfDay } from "date-fns";
import "../styles/spin.css";


function Spin() {
  const wheelRef = useRef(null);  // for wheel rotation
  const [previousEndDegree, setPreviousEndDegree] = useState(0);  // for wheel rotation
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
    
    // Pick the activity FIRST so we can align spin to it
    const itemCount = allFiltered.length;
    const randomIndex = Math.floor(Math.random() * itemCount);
    const degreePerItem = 360 / itemCount;
    const selectedActivity = allFiltered[randomIndex];

    const targetPosition = 0; // 12h postion
    // rotate to that wedge -- in the center of the slice
    const selectedDegree = randomIndex * degreePerItem + degreePerItem / 2;
    const spins = 3; // full spins before stopping
    const offset = (360 + targetPosition - selectedDegree) % 360; // how much to rotate to bring that slice to top
    const newEndDegree = previousEndDegree + spins * 360 + offset; // total rotation

    // animate
    if (wheelRef.current) {
      wheelRef.current.animate([
        { transform: `rotate(${previousEndDegree}deg)` },
        { transform: `rotate(${newEndDegree}deg)` },
      ], {
        duration: 2000,
        direction: "normal",
        easing: "cubic-bezier(0.440, -0.205, 0.000, 1.130)",
        fill: "forwards",
        iterations: 1,
      });
      setPreviousEndDegree(newEndDegree);  // save the end degree for next spin
    }
    // set after delay to simulate result after spin
    setTimeout(() => {
      setSelectedActivityId(selectedActivity.id);  // select the activity after spin
    }, 2000);  // same as animation duration
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

  const isSingleItem = allFiltered.length === 1;


  const categoryColors = {
    chores: "#f8d7da",      // soft red
    sport: "#d1ecf1",       // light blue
    music: "#e2e3f3",       // lavender
    social: "#d4edda",      // mint green
    visual: "#fff3cd",      // soft yellow
    adventure: "#fde2e4",   // pinkish
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

      <button onClick={pass} disabled={!selectedActivityId}>pass</button>

      <div>
        <h4>filtered activities ({allFiltered.length}):</h4>
        <div className="wheel-container">
          <div className="pointer"></div>
          <ul 
          ref={wheelRef}
          className={`wheel-of-fortune ${isSingleItem ? "single" : ""}`}
          style={{
            "--_items": isSingleItem ? 1 : allFiltered.length,
          }}
          >
            {allFiltered.map((act, idx) => {
              const isSelected = act.id === selectedActivityId;
              const isUsed = usedActivityIds.includes(act.id);
              const bgColor = categoryColors[act.category.toLowerCase()];

              return (
                <li
                className={`wedge ${isSingleItem ? "full-wedge" : ""}`}
                key={act.id}
                style= {{
                  "--_idx": idx + 1,
                  background: isUsed ? "gold" : bgColor,
                  fontWeight: isSelected ? "bold" : "normal",
                }}
                >
                  {act.title.toLowerCase()}
                </li>
              );
            })}
          </ul>
          <button className="spin-button" onClick={handleSpin}>spin!</button>
        </div>
      </div>
    </div>
  );
}

export default Spin;