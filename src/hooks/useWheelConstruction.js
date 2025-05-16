export const useWheelConstruction = ({
  allFiltered,
  usedActivityIds,
  availableForSpin,
  setPlaySpinButton,
  setPlaySpinning,
  setPrizeNumber,
  setMustSpin,
  mustSpin,
  setSelectedActivityId
}) => {

  const isSingleItem = allFiltered.length === 1;

  const categoryColors = {
    chores: "#f2d9d7",
    sport: "#baf2bf",
    music: "#c5c8f2",
    social: "#ffd59e",
    visual: "#ffedb4",
    adventure: "#9efaff",
  };

  const data = Array.isArray(allFiltered)
    ? allFiltered.map((act) => {
        if (!act || !act.title || !act.category) {
          return { option: "unknown", style: { backgroundColor: "#ccc", textColor: "black" } };
        }

        const isUsed = usedActivityIds.includes(act.id);
        const bgColor = categoryColors[act.category.toLowerCase()] || "#ccc";

        return {
          option: act.title.toLowerCase(),
          style: {
            backgroundColor: isUsed ? "#ccc" : bgColor,
            textColor: "black", fontWeight: "normal"
          },
        };
      })
    : [];

  const handleSpinClick = () => {
    setPlaySpinButton(true);
    setPlaySpinning(true);

    setTimeout(() => setPlaySpinButton(false), 30);
    setTimeout(() => setPlaySpinning(false), 2000);

    if (!mustSpin && availableForSpin.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableForSpin.length);
      const selectedId = availableForSpin[randomIndex].id;

      const prizeIdx = allFiltered.findIndex((act) => act.id === selectedId);
      if (prizeIdx === -1) return;

      setPrizeNumber(prizeIdx);
      setMustSpin(true);
    } else if (availableForSpin.length === 0) {
      setSelectedActivityId(null);
      alert("you have done everything for the day!");
    }
  };

  return {
    isSingleItem,
    data,
    handleSpinClick
  };
};
