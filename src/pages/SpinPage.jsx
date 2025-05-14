import Spin from '../components/Spin'

function SpinPage() {
  
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
        <BubbleButton
        label="Later"
        ariaLabel="Later"
        toggle={false}
        zoom="1"
        defaultColor="transparent"
        flyAway="true"
        top="40%"
        left="80%"
      />
      </div>
<div className="toggle-buttons">

       <BubbleButton 
        label="Fun"
        ariaLabel="This bubble adds Fun Actitivites to the list"
        toggle={true}
        zoom="0.4"
        toggleColor="rgba(0, 0, 255, 0.1)"
        defaultColor="transparent"
        onToggleChange={(state) => console.log("Toggled?", state)}
      />

      <BubbleButton
        label="Bucket"
        ariaLabel="This bubble adds Bucket activities to the list"
        toggle={true}
        zoom="1.5"
        toggleColor="rgba(255, 0, 0, 0.1)"
        defaultColor="transparent"
        onToggleChange={(state) => console.log("Toggled?", state)}
      />

      <BubbleButton
        label="Chores"
        ariaLabel="This bubble adds Chores to the list"
        toggle={true}
        zoom="1"
        toggleColor="rgba(255, 20, 147, 0.1)"
        defaultColor="transparent"
      />

  <label className={includeFun ? "toggle active" : "toggle"}>
    <input
      type="checkbox"
      checked={includeFun}
      onChange={() => setIncludeFun(!includeFun)}
    />
    fun
  </label>

  <label className={includeBucket ? "toggle active" : "toggle"}>
    <input
      type="checkbox"
      checked={includeBucket}
      onChange={() => setIncludeBucket(!includeBucket)}
    />
    bucket
  </label>

  <label className={includeChores ? "toggle active" : "toggle"}>
    <input
      type="checkbox"
      checked={includeChores}
      onChange={() => setIncludeChores(!includeChores)}
    />
    chores
  </label>
</div>

    </div>
  );
}

export default SpinPage;