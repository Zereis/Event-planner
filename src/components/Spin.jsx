import { useState, useMemo, useContext, useRef } from "react";
import { parseISO, isSameDay, isAfter, isBefore, endOfWeek, startOfDay } from "date-fns";
import "../styles/spin.css";
import EditTask from "../components/EditTask";
import SoundManager from "./SoundManagerSpin";  // sound manager component 
// importing sound manager component
import BubbleButton from '../components/BubbleButton'
import { useNavigate } from "react-router"; // For navigation to Add.jsx
import { TaskContext } from "../components/TaskContext"; // Import TaskContext
import { bulkDelete } from "../Components/TaskHandlers"; // Import handlers


function Spin() {
  const wheelRef = useRef(null);  // for wheel rotation
  const [previousEndDegree, setPreviousEndDegree] = useState(0);  // for wheel rotation
  const [includeFun, setIncludeFun] = useState(false);  // for fun act inclusion
  const [includeBucket, setIncludeBucket] = useState(false);  // for bucket inclusion
  const [includeChores, setIncludeChores] = useState(false);  // for chore inclusion
  const [selectedActivityId, setSelectedActivityId] = useState(null);   // keep track of the 'winner'
  const [usedActivityIds, setUsedActivityIds] = useState([]);   // for visually distinguishing already used activities

  // sound effects
  const [playSpinButton, setPlaySpinButton] = useState(false); // play spin button sound
  const [playSpinning, setPlaySpinning] = useState(false); // play spinning sound

  // task editing setup
  const { tasks, updateTasks } = useContext(TaskContext); // access tasks from TaskContext
  const navigate = useNavigate(); // for navigation

  // handle daily activities and weekly chores
  const today = new Date();
  const todayStart = startOfDay(today);
  const weekEnd = endOfWeek(todayStart, { weekStartsOn: 1 });  // week ends on sunday

  // filter: always include today's Daily
  const todaysActivities = tasks.filter((task) => {
    if (task.type.toLowerCase() === "daily" && task.date && task.category.toLowerCase() !== "chores") {
      return isSameDay(parseISO(task.date), today);
    }
    return false;
  });

  // filter: optionally include Fun and / or Bucket
  // add weekly chores, and make them optional
  // randomly choose only one bucket and only one fun if chores are chosen

  const funActivities = tasks.filter(
    (task) => task.type.toLowerCase() === "fun"
  );

  const bucketActivities = tasks.filter(
    (task) => task.type.toLowerCase() === "bucket"
  );

  const weeklyChores = includeChores
  ? tasks.filter((task) => 
    task.category.toLowerCase() === "chores" &&
    task.deadline &&
    !isSameDay(today, weekEnd) && // if it's sunday, exclude it
    isAfter(parseISO(task.deadline), todayStart) &&
    isBefore(parseISO(task.deadline), weekEnd)
  )
  : [];

  // choose fun or bucket depending on chore inclusion
  // if chores are included, randomize fun and bucket activities and fix them in optionalActivities for rendering
  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const singleFun = useMemo(() => {
    return includeChores && includeFun ? pickRandom(funActivities) : null;
  }, [includeChores, includeFun]);

  const singleBucket = useMemo(() => {
    return includeChores && includeBucket ? pickRandom(bucketActivities) : null;
  }, [includeChores, includeBucket]);


  const optionalActivities = (() => {
      if (includeChores && weeklyChores.length) {
        return [
          ...weeklyChores,
          ...(includeFun && singleFun ? [singleFun] : []),
          ...(includeBucket && singleBucket ? [singleBucket] : []),
        ];
      } else {
        return [
          ...(includeFun ? funActivities : []),
          ...(includeBucket ? bucketActivities : []),
        ];
      }
    })();

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

    // rotate to that wedge -- in the center of the slice
    const selectedDegree = randomIndex * degreePerItem + degreePerItem / 2;

    const spins = 3; // full spins before stopping
    const offset = (360 - selectedDegree) % 360; // how much to rotate to bring that slice to top
    const newEndDegree = previousEndDegree + spins * 360 + offset; // total rotation

    // animate
    if (wheelRef.current) {
      wheelRef.current.animate([
        { transform: `rotate(${previousEndDegree}deg)` },
        { transform: `rotate(${newEndDegree}deg)` },
      ], {
        duration: 2200,
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
  
  const handleEventClick = ({ id, title }) => {
  const action = prompt(
    `you clicked on "${title}".\nchoose an action:\n1: edit task (default)\n2: delete task\n3: bulk delete`
  );

  if (action === null) return;

  if (action === "1" || action === "") {
    navigate(`/edit?taskId=${id}`);
  } else if (action === "2") {
    const confirmed = window.confirm(
      `are you sure you want to delete the task "${title}"?`
    );
    if (confirmed) {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      updateTasks(updatedTasks);
    }
  } else if (action === "3") {
    const updatedTasks = bulkDelete(tasks);
    updateTasks(updatedTasks);
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
      <h4>let fate help you structure your day!<br/>using the buttons below, you can choose to include your weekly chores, things from your fun and / or your bucket list. when your activities appear in your daily wheel of fortune, spin it to see what to do now.<br/>if the chosen activity doesn't fit your schedule or clashes with your mood, you can decide to maybe take care of it later by clicking on the 'maybe later' butoon. then spin again!<br/>have fun!</h4>

      <BubbleButton
      className="later-button" onClick={pass} disabled={!selectedActivityId}
      label="later"
      ariaLabel="Later"
      toggle={false}
      zoom="0.8"
      defaultColor="transparent"
      />
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
                    onClick={() => handleEventClick({ id: act.id, title: act.title })}
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
        <BubbleButton 
          label="fun"
          className={includeFun ? "toggle active" : "toggle"}
          ariaLabel="This bubble adds Fun Activities to the list"
          toggle={true}
          zoom="0.8"
          toggleColor="rgba(0, 0, 255, 0.1)"
          defaultColor="transparent"
          onToggleChange={(state) => setIncludeFun(state)} // This is key
          checked={includeFun}
        />
        <BubbleButton
        label="bucket"
        className={includeBucket ? "toggle active" : "toggle"}
        ariaLabel="This bubble adds Bucket activities to the list"
        toggle={true}
        zoom="0.8"
        toggleColor="rgba(255, 0, 0, 0.1)"
        defaultColor="transparent"
        onToggleChange={(state) => setIncludeBucket(state)}
        checked={includeBucket}
        />
        <BubbleButton
        label="chores"
        className={includeChores ? "toggle active" : "toggle"}
        ariaLabel="This bubble adds Chores to the list"
        toggle={true}
        zoom="0.8"
        toggleColor="rgba(255, 20, 147, 0.1)"
        defaultColor="transparent"
        onToggleChange={(state) => setIncludeChores(state)}
        checked={includeChores}
        />
      </div>

    </div>
  );
}

export default Spin;