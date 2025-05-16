import { useMemo} from "react";

export const useDropdownEditList = ({
  todaysActivities,
  singleFun,
  singleBucket,
  includeChores,
  includeBucket,
  includeFun,
  funActivities,
  bucketActivities,
  weeklyChores,
  tasks,
  updateTasks,
  navigate,
  bulkDelete,
}) => {

  const filteredTasks = useMemo(() => {
    const result = [...todaysActivities];

    if (singleFun) result.push(singleFun);
    if (singleBucket) result.push(singleBucket);
    if (includeChores) result.push(...weeklyChores);
    if (includeBucket && !singleBucket) result.push(...bucketActivities);
    if (includeFun && !singleFun) result.push(...funActivities);

    const uniqueTasks = [...new Map(result.map(task => [task.id, task])).values()];
    return uniqueTasks.sort((a, b) => a.title.localeCompare(b.title));
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

  const handleEventClick = ({ id, title }) => {
    const action = prompt(
      `you clicked on "${title}".\nchoose an action:\n1: edit task (default)\n2: delete task\n3: bulk delete`
    );
    if (action === null) return;

    if (action === "1" || action === "") {
      navigate(`/edit?taskId=${id}`);
    } else if (action === "2") {
      const confirmed = window.confirm(`are you sure you want to delete "${title}"?`);
      if (confirmed) {
        const updatedTasks = tasks.filter(task => task.id !== id);
        updateTasks(updatedTasks);
      }
    } else if (action === "3") {
      const updatedTasks = bulkDelete(tasks);
      updateTasks(updatedTasks);
    }
  };

  return {
    filteredTasks,
    handleEventClick
  };
};
