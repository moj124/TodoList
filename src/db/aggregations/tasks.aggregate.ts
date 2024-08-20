const taskswithProjectsDueTodayAggregate = [
  {
    $match: {
      deadlineAt: {
        $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)), // Start of today
        $lt: new Date(new Date().setUTCHours(24, 0, 0, 0)) // Start of tomorrow
      }
    }
  },
  {
    $unwind: "$tasks"
  },
];
export default taskswithProjectsDueTodayAggregate;