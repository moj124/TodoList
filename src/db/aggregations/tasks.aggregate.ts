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
    $lookup: {
      from: "tasks",
      localField: "tasks",
      foreignField: "_id",
      as: "tasksDetails"
    }
  },
  {
    $unwind: "$tasksDetails"
  },
  {
    $replaceRoot: { newRoot: "$tasksDetails" }
  },
  {
    $project: {
      _id: 1,
      name: 1,
      deadlineAt: 1
    }
  }
];
export default taskswithProjectsDueTodayAggregate;