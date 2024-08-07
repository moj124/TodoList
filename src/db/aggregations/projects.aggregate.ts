const projectsWithTasksDueTodayAggregate = [
    {
      $match: {
        tasks: {
          $elemMatch: {
            deadlineAt: {
              $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)), // Start of today
              $lt: new Date(new Date().setUTCHours(24, 0, 0, 0)) // Start of tomorrow
            }
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        createdAt: 1,
        deadlineAt: 1,
        tasks: {
          $filter: {
            input: "$tasks",
            as: "task",
            cond: {
              $and: [
                { $gte: ["$$task.deadlineAt", new Date(new Date().setUTCHours(0, 0, 0, 0))] },
                { $lt: ["$$task.deadlineAt", new Date(new Date().setUTCHours(24, 0, 0, 0))] }
              ]
            }
          }
        }
      }
    }
  ];
export default projectsWithTasksDueTodayAggregate;