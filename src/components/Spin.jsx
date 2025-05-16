import { useState, useMemo, useContext, React, useEffect } from "react";
import { parseISO, isSameDay, isWithinInterval, endOfWeek, startOfDay } from "date-fns";
import { Wheel } from 'react-custom-roulette'
import "../styles/spin.css";
import SoundManager from "./SoundManagerSpin";  // sound manager component
import BubbleButton from './BubbleButton'
import { useNavigate } from "react-router"; // For navigation to Add.jsx
import { TaskContext } from "./TaskContext"; // Import TaskContext
import { bulkDelete } from "./TaskHandlers"; // Import handlers


function Spin() {
  const [includeFun, setIncludeFun] = useState(false);  // for fun act inclusion
  const [includeBucket, setIncludeBucket] = useState(false);  // for bucket inclusion
  const [includeChores, setIncludeChores] = useState(false);  // for chore inclusion
  const [selectedActivityId, setSelectedActivityId] = useState(null);   // keep track of the 'winner'
  const [usedActivityIds, setUsedActivityIds] = useState([]);   // for visually distinguishing already used activities
  const [mustSpin, setMustSpin] = useState(false);  // react custom roulette
  const [prizeNumber, setPrizeNumber] = useState(0);  
  const [showDropdown, setShowDropdown] = useState(false);  // for task list to edit

  const [hasSpun, setHasSpun] = useState(false); // track if wheel has spun and stopped
  const [triggerFlyAway, setTriggerFlyAway] = useState(false); // control fly-away animation
  const [test, setTest] = useState(false); // manage the `test` variable dynamically

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

  const todaysActivities = useMemo(() => {
    return tasks.filter((task) => {
      if (task.type.toLowerCase() !== "daily") return false;

      const taskDateRaw = task.date || task.dateTime;  // Support both
      if (!taskDateRaw) return false;

      const taskDate = typeof taskDateRaw === 'string' ? parseISO(taskDateRaw) : taskDateRaw;

      return isSameDay(startOfDay(taskDate), todayStart);
    });
  }, [tasks, todayStart]);

  // debug
  useEffect(() => {
    console.log("spin received today's:", todaysActivities);
  }, [todaysActivities]);

  // filter: optionally include Fun and / or Bucket
  // add weekly chores, and make them optional
  // randomly choose only one bucket and only one fun if chores are chosen

  const funActivities = tasks.filter(
    (task) => task.type.toLowerCase() === "fun"
  );

  const bucketActivities = tasks.filter(
    (task) => task.type.toLowerCase() === "bucket"
  );

  const weeklyChores = useMemo(() => {
    if (!includeChores) return [];

    return tasks.filter((task) => {
      if (task.category?.toLowerCase() !== "chores") return false;

      const deadlineRaw = task.deadline;
      if (!deadlineRaw) return false;

      const deadlineDate = typeof deadlineRaw === 'string' ? parseISO(deadlineRaw) : deadlineRaw;

      return isWithinInterval(deadlineDate, {
        start: todayStart,
        end: weekEnd,
      });
    });
  }, [includeChores, tasks, todayStart, weekEnd]);

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
  const allFiltered = useMemo(() => {

    return [...todaysActivities, ...optionalActivities].filter(
      (item, index, self) => self.findIndex(a => a.id === item.id) === index
    );
  }, [todaysActivities, optionalActivities]);

  // debug
  useEffect(() => {
    console.log("spin received all filtered:", allFiltered);
  }, [allFiltered]);

  // exclude previously picked activities
const availableForSpin = useMemo(() => {
  return allFiltered.filter(
    (act) => !usedActivityIds.includes(act.id) && act.id !== selectedActivityId
  );
}, [allFiltered, usedActivityIds, selectedActivityId]);

  // ADD PASS to do the same activity
  const passActivityId = (id) => {
    setUsedActivityIds((prev) => prev.filter((usedId) => usedId !== id));
  }

const pass = () => {
  if (selectedActivityId !== null) {
    setTriggerFlyAway(true); // Trigger fly-away animation
    setTimeout(() => {
      passActivityId(selectedActivityId); // Remove the activity from usedActivityIds
      setSelectedActivityId(null); // Reset selected activity
      setTriggerFlyAway(false); // Reset the fly-away state
      setHasSpun(false); // Reset the "Later" button visibility
    }, 2000); // Match the animation duration
  }
};
  
  // Filtered task list for dropdown
  const filteredTasks = useMemo(() => {
    const result = [...todaysActivities]; // Always include today's tasks

    // Add singleFun if both chores and fun are checked
    if (singleFun) {
      result.push(singleFun);
    }

    // Add singleBucket if both chores and bucket are checked
    if (singleBucket) {
      result.push(singleBucket);
    }

    // Add weekly chores if chores are enabled
    if (includeChores) {
      result.push(...weeklyChores);
    }

    // add all bucket
    if (includeBucket && !singleBucket) {
      result.push(...bucketActivities);
    }

    // add all fun
    if (includeFun && !singleFun) {
      result.push(...funActivities);
    }

    // Remove duplicates by task ID
    const uniqueTasks = [...new Map(result.map(task => [task.id, task])).values()];
    
    // Sort alphabetically by title
    const sortedTasks = uniqueTasks.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    return sortedTasks;
  }, [
    todaysActivities,
    singleFun,
    singleBucket,
    includeChores,
    includeBucket,
    includeFun,
    funActivities,
    bucketActivities,
    weeklyChores
  ]);

  // Handle clicking on an existing event
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

// setup for special display for only one thing to do
const isSingleItem = allFiltered.length === 1;

// category colors for dynamic wheel wedge coloring
const categoryColors = {
  chores: "#f2d9d7",      // soft grey-pink
  sport: "#baf2bf",       // light green
  music: "#c5c8f2",       // lavender
  social: "#ffd59e",      // orange-ish
  visual: "#ffedb4",      // soft yellow
  adventure: "#9efaff",   // turquoise
  };

// custom roulette required array
const data = Array.isArray(allFiltered)
  ? allFiltered.map((act) => {
      if (!act || !act.title || !act.category) {
        console.warn("invalid activity found:", act);
        return { option: "unknown", style: { backgroundColor: "#ccc", textColor: "black" } };
      }
      const isUsed = usedActivityIds.includes(act.id);
      const bgColor = categoryColors[act.category.toLowerCase()] || "#ccc";

      return {
        option: act.title.toLowerCase(),
        style: {
          backgroundColor: isUsed ? "#ccc" : bgColor,
          textColor: "black", fontWeight: "normal",
        },
      };
    })
  : [];

  // actual wheel spinning
  const handleSpinClick = () => {
    if (availableForSpin.length === 0) {
      alert("No activities available to spin!");
      return;
    }

    setHasSpun(false); // Reset the "Later" button visibility

    if(!setHasSpun)
    {

    }
    setTriggerFlyAway(false); // Ensure the "Later" button is reset

    const randomIndex = Math.floor(Math.random() * availableForSpin.length);
    setPrizeNumber(randomIndex);
    setMustSpin(true);
    setPlaySpinButton(true); // Play spin button sound
    setPlaySpinning(true);

    setTimeout(() => {
      setMustSpin(false);
      setHasSpun(true); // Make the "Later" button visible again
      setSelectedActivityId(availableForSpin[randomIndex].id); // Set the selected activity
    }, 2000); // Match the spin duration
  };

return (
  <div className="page-container">
    <SoundManager playSpinButton={playSpinButton} playSpinning={playSpinning} />
    <h2>spin planner</h2>
    <h4>
      let fate help you structure your day!<br />
      using the buttons below, you can choose to include your weekly chores,
      things from your fun and / or your bucket list. when your activities
      appear in your daily wheel of fortune, spin it to see what to do now.<br />
      if the chosen activity doesn't fit your schedule or clashes with your mood,
      you can decide to maybe take care of it later by clicking on the 'maybe later'
      button. then spin again!<br />
      have fun!
    </h4>

    {test && (
  <div className="div-later-button" data-has-spun={hasSpun}>
    <BubbleButton
      className="later-button"
      onClick={() => {
        setTriggerFlyAway(true);
        pass();
        
          setTimeout(() => {
          setTest(false); // Set `test` to false after the animation completes
          setTriggerFlyAway(false); // Reset the fly-away state
        }, 2000); // Match the duration of the fly-away animation
        
      }}
      label="later"
      ariaLabel="Later"
      toggle={false}
      zoom="0.6"
      defaultColor="transparent"
      flyAway={true}
    />
  </div>
)}

    <div className="edit-dropdown">
      <BubbleButton
        label="edit"
        className={showDropdown ? "toggle active" : "toggle"}
        ariaLabel="edit tasks"
        toggle={true}
        zoom="0.5"
        toggleColor="rgba(0, 0, 255, 0.1)"
        onToggleChange={(state) => setShowDropdown(state)}
        checked={showDropdown}
        defaultColor="pink"
      />
      {showDropdown && (
        <ul className="dropdown-list">
          {filteredTasks.map((task) => (
            <li key={task.id} onClick={() => handleEventClick(task)}>
              {task.title.toLowerCase()}
            </li>
          ))}
          {filteredTasks.length === 0 && <li style={{ opacity: 0.6 }}>no tasks to edit</li>}
        </ul>
      )}
    </div>

    <div className="wheel-container">
      <div className="wheel-of-fortune">
        {allFiltered.length === 0 && (
          <div className="wheel-of-fortune empty">
            <div
              className="placeholder-text"
              style={{
                fontWeight: "bold",
              }}
            >
              add activities to spin
            </div>
          </div>
        )}
        {isSingleItem ? (
          <ul className="wheel-of-fortune single" style={{ "--_items": 1 }}>
            <li
              className="full-wedge"
              key={allFiltered[0].id}
              style={{
                background: categoryColors[allFiltered[0].category.toLowerCase()],
                fontWeight: "bold",
              }}
            >
              all you need to do today is<br />
              {allFiltered[0].title.toLowerCase()}
            </li>
          </ul>
        ) : (
          data.length > 0 &&
          prizeNumber >= 0 && (
            <>
              <div className="wheel-wrapper">
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={data}
                  outerBorderColor="pink"
                  outerBorderWidth={3}
                  radiusLineColor="lightgrey"
                  radiusLineWidth={0.5}
                  textDistance={57}
                  fontFamily="Fredoka"
                  fontSize={15}
                  spinDuration={0.17}
                  width={800}
                  height={800}
                  pointerProps={{
                    style: {
                      width: "3rem",
                      height: "3rem",
                      top: "3rem",
                      left: "calc(50% + 8rem)",
                    },
                  }}
                  onStopSpinning={() => {
                    setMustSpin(false);
                    setHasSpun(true); // Show the "Later" button
                    setTest(true); // Set `test` to true when the spin is done spinning
                  }}
                />
              </div>
            </>
          )
        )}
      </div>
    </div>

    <div>
      {allFiltered.length > 1 && (
        <div className="spin-button">
          <BubbleButton
            label="spin!"
            onClick={handleSpinClick}
            toggle={false}
            zoom="0.6"
            defaultColor="pink"
          />
        </div>
      )}
    </div>

    <div className="toggle-buttons">
      <BubbleButton
        label="fun"
        className={includeFun ? "toggle active" : "toggle"}
        ariaLabel="this bubble adds fun activities to the list"
        toggle={true}
        zoom="0.6"
        toggleColor="rgba(0, 0, 255, 0.1)"
        defaultColor="transparent"
        onToggleChange={(state) => setIncludeFun(state)}
        checked={includeFun}
      />
      <BubbleButton
        label="bucket"
        className={includeBucket ? "toggle active" : "toggle"}
        ariaLabel="this bubble adds bucket activities to the list"
        toggle={true}
        zoom="0.6"
        toggleColor="rgba(255, 0, 0, 0.1)"
        defaultColor="transparent"
        onToggleChange={(state) => setIncludeBucket(state)}
        checked={includeBucket}
      />
      <BubbleButton
        label="chores"
        className={includeChores ? "toggle active" : "toggle"}
        ariaLabel="this bubble adds chores to the list"
        toggle={true}
        zoom="0.6"
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
