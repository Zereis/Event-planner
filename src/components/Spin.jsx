import { useState, useEffect, useRef } from "react";
import activities from "../data/data";
import { parseISO, isSameDay, isAfter, isBefore, endOfWeek, startOfDay } from "date-fns";
import "../styles/spin.css";
import EditTask from "./edittask";
import SoundManager from "./SoundManagerSpin";  // sound manager component 
// importing sound manager component


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

  // sound effects
  const [playSpinButton, setPlaySpinButton] = useState(false); // play spin button sound
  const [playSpinning, setPlaySpinning] = useState(false); // play spinning sound


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

  if (includeChores && weeklyChores.length) {
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
  
  // adjust the degree of the wheel to the number of items
  // in css: responsive design for mobile and tablet?
  // add instructions for the wheel
  // click on activity -- open edit event page
  // add sound!!

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

    // sound effects
    setPlaySpinButton(true); // play the spin button sound
    setPlaySpinning(true); // play the spinning sound
       // reset the sound flags after a short delay to allow them to play
    setTimeout(() => setPlaySpinButton(false), 30); // short delay for button sound
    setTimeout(() => setPlaySpinning(false), 2000); // assuming spinning sound lasts 2s

    // Pick the activity FIRST so we can align spin to it
    const itemCount = allFiltered.length;
    const degreePerItem = 360 / itemCount;
    const selectedActivity = availableForSpin[Math.floor(Math.random() * availableForSpin.length)];
    const randomIndex = allFiltered.findIndex(act => act.id === selectedActivity.id); // get correct index in full list

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
    <div className="page-container">
      <SoundManager playSpinButton={playSpinButton} playSpinning={playSpinning} />
      <h2>spin planner</h2>
      <h4>let fate help you structure your day!<br/>using the buttons below, you can choose to include your weekly chores, things from your fun and / or your bucket list. when your activities appear in your daily wheel of fortune, spin it to see what to do now.<br/>if the chosen actifity doesn't fit your schedule or clashes with your mood, you can decide to maybe take care of it later by clicking on the 'maybe later' butoon. then spin again!<br/>have fun!</h4>
      <button className="later-button" onClick={pass} disabled={!selectedActivityId}>maybe later</button>

      <div>
        <div className="wheel-container">
          <div className="pointer"></div>
          <ul 
          ref={wheelRef}
          className={`wheel-of-fortune ${isSingleItem ? "single" : ""}`}
          style={{
            "--_items": isSingleItem ? 1 : allFiltered.length,
          }}
          >
            {isSingleItem ? (
              <li className="full-wedge" key={allFiltered[0].id} style={{
                background: categoryColors[allFiltered[0].category.toLowerCase()],
                fontWeight: "bold",
              }}>
                all you need to do today is<br />
                {allFiltered[0].title.toLowerCase()}
              </li>
            ) : (
              allFiltered.map((act, idx) => {
                const isSelected = act.id === selectedActivityId;
                const isUsed = usedActivityIds.includes(act.id);
                const bgColor = categoryColors[act.category.toLowerCase()];
                return (
                  <li
                    className="wedge"
                    key={act.id}
                    style={{
                      "--_idx": idx + 1,
                      "--_items": allFiltered.length,
                      background: isUsed ? "rgb(241, 162, 178)" : bgColor,
                      fontWeight: isSelected ? "bold" : "normal",
                    }}
                  >
                    {act.title.toLowerCase()}
                  </li>
                );
              })
            )}

          </ul>
          <button 
          className="spin-button" 
          onClick={handleSpin}
          hidden={isSingleItem || allFiltered.length === 0}
          >spin!
          </button>
        </div>
      </div>
<div className="toggle-buttons">
  <label className={includeFun ? "toggle active" : "toggle"}>
    <input
      type="checkbox"
      checked={includeFun}
      onChange={() => setIncludeFun(!includeFun)}
    />
    include fun
  </label>

  <label className={includeBucket ? "toggle active" : "toggle"}>
    <input
      type="checkbox"
      checked={includeBucket}
      onChange={() => setIncludeBucket(!includeBucket)}
    />
    include bucket
  </label>

  <label className={includeChores ? "toggle active" : "toggle"}>
    <input
      type="checkbox"
      checked={includeChores}
      onChange={() => setIncludeChores(!includeChores)}
    />
    include chores
  </label>
</div>

    </div>
  );
}

export default Spin;