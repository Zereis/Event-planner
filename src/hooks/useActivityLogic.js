import { useMemo, useEffect } from "react";
import { startOfDay, endOfWeek, isSameDay, parseISO, isWithinInterval } from "date-fns";

export const useActivityLogic = (tasks, includeChores, includeFun, includeBucket) => {
  const today = new Date();
  const todayStart = startOfDay(today);
  const weekEnd = endOfWeek(todayStart, { weekStartsOn: 1 });

  const todaysActivities = useMemo(() => {
    return tasks.filter((task) => {
      if (task.type.toLowerCase() !== "daily") return false;
      const taskDateRaw = task.date || task.dateTime;
      if (!taskDateRaw) return false;

      const taskDate = typeof taskDateRaw === 'string' ? parseISO(taskDateRaw) : taskDateRaw;
      return isSameDay(startOfDay(taskDate), todayStart);
    });
  }, [tasks, todayStart]);

  useEffect(() => {
    console.log("Today's activities:", todaysActivities);
  }, [todaysActivities]);

  const funActivities = tasks.filter(task => task.type.toLowerCase() === "fun");
  const bucketActivities = tasks.filter(task => task.type.toLowerCase() === "bucket");

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

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const singleFun = useMemo(() => {
    return includeChores && includeFun ? pickRandom(funActivities) : null;
  }, [includeChores, includeFun]);

  const singleBucket = useMemo(() => {
    return includeChores && includeBucket ? pickRandom(bucketActivities) : null;
  }, [includeChores, includeBucket]);

  const optionalActivities = useMemo(() => {
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
  }, [
    includeChores,
    includeFun,
    includeBucket,
    weeklyChores,
    funActivities,
    bucketActivities,
    singleFun,
    singleBucket,
  ]);

  const allFiltered = useMemo(() => {
    return [...todaysActivities, ...optionalActivities].filter(
      (item, index, self) => self.findIndex(a => a.id === item.id) === index
    );
  }, [todaysActivities, optionalActivities]);

  useEffect(() => {
    console.log("All filtered tasks:", allFiltered);
  }, [allFiltered]);

  return {
    todayStart,
    todaysActivities,
    weeklyChores,
    funActivities,
    bucketActivities,
    singleFun,
    singleBucket,
    allFiltered,
  };
};
