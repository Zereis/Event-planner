import { useState, useMemo, useContext, React } from "react";
import { parseISO, isSameDay, isWithinInterval, endOfWeek, startOfDay } from "date-fns";
import { Wheel } from 'react-custom-roulette'
import "../styles/spin.css";
import SoundManager from "./SoundManagerSpin";  // sound manager component 
// importing sound manager component
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
    isWithinInterval(parseISO(task.deadline), { start: todayStart, end: weekEnd })
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
  const allFiltered = useMemo(() => {
    return [...todaysActivities, ...optionalActivities].filter(
      (item, index, self) => self.findIndex(a => a.id === item.id) === index
    );
  }, [todaysActivities, optionalActivities]);

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
    // sound effects
    setPlaySpinButton(true); // play the spin button sound
    setPlaySpinning(true); // play the spinning sound
        // reset the sound flags after a short delay to allow them to play
    setTimeout(() => setPlaySpinButton(false), 30); // short delay for button sound
    setTimeout(() => setPlaySpinning(false), 2000); // assuming spinning sound lasts 2s

    if (!mustSpin && availableForSpin.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableForSpin.length);
      const selectedId = availableForSpin[randomIndex].id;

      const prizeIdx = allFiltered.findIndex((act) => act.id === selectedId);
      if (prizeIdx === -1) {
        console.warn("Invalid prize index", selectedId, allFiltered);
        return;
      }

      setPrizeNumber(prizeIdx);
      setMustSpin(true);
    }
    else if (availableForSpin.length === 0) {
      setSelectedActivityId(null);  // nothing left to select
      alert("you have done everything for the day!");
      return;
    }
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

      <BubbleButton
        className="later-button"
        onClick={pass}
        disabled={!selectedActivityId}
        label="later"
        ariaLabel="Later"
        toggle={false}
        zoom="0.6"
        defaultColor="transparent"
      />

      <div className="wheel-container">
        <div className="wheel-of-fortune">
          {allFiltered.length === 0 && (
            <div className="wheel-of-fortune empty">
              <div className="placeholder-text"
              style={{
                fontWeight: "bold",
              }}
              >add activities to spin</div>
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
                    width: '3rem',
                    height: '3rem',
                    top: '2.8rem',
                    left: 'calc(50% + 9rem)',
                  },
                }}
                onStopSpinning={() => {
                  setMustSpin(false);
                  const chosen = allFiltered[prizeNumber];
                  if (chosen) {
                    setUsedActivityIds((prev) => [...prev, chosen.id]);
                    setSelectedActivityId(chosen.id);
                  }
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
