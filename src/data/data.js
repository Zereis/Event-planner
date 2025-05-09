const activities = [
    {
        id: Date.now(), 
        title:"Concert", 
        description: "See a concert at MSG", 
        date: "2025-05-06", 
        deadline: null, 
        category: "Music", 
        type: "Bucket"
    },
    {
        id: Date.now() + 1, 
        title:"Travel", 
        description: "Go to Hawaii", 
        date: "2025-05-07", 
        deadline: null, 
        category: "Adventure", 
        type: "Bucket"
    },
    {
        id: Date.now() + 2, 
        title:"Sport", 
        description: "Learn a new sport", 
        date: "2025-05-08", 
        deadline: null, 
        category: "Sport", 
        type: "Bucket"
    },
    {
        id: Date.now() + 3, 
        title:"Michelin Star Restaurant", 
        description: "Try a restaurant with a Michelin star", 
        date: "2025-05-09", 
        deadline: null, 
        category: "Social", 
        type: "bucket"
    },
    {
        id: Date.now() + 4, 
        title:"Adventure", 
        description: "go skydiving", 
        date: "2025-05-10", 
        deadline: null, 
        category: "Adventure", 
        type: "bucket"
    },
    {
        id: Date.now() + 5,
        title: "Wine tasting",
        description: "Visit a local vineyard for wine tasting",
        date: "2025-05-15T14:00",
        deadline: null,
        category: "Social",
        type: "bucket"
    },
    {
        id: Date.now() + 6,
        title: "Soccer game",
        description: "Go to a soccer game with friends",
        date: "2025-05-07T17:30",
        deadline: null,
        category: "Sport",
        type: "Fun"
    },
    {
        id: Date.now() + 7,
        title: "Movie night",
        description: "Watch the latest blockbuster with friends",
        date: "2025-05-08T18:00",
        deadline: null,
        category: "Visual",
        type: "Fun"
    },
    {
        id: Date.now() + 8,
        title: "Couples cooking class",
        description: "Learn to cook Italian cuisine",
        date: "2025-05-09T19:00",
        deadline: null,
        category: "Social",
        type: "Fun"
    },
    {
        id: Date.now() + 9,
        title: "Art exhibition",
        description: "Visit a local art gallery or exhibition",
        date: "2025-05-11T15:00",
        deadline: "2025-07-31T15:00",
        category: "Visual",
        type: "Fun"
    },
    {
        id: Date.now() + 10,
        title: "Beach day",
        description: "Spend a day at the beach with friends",
        date: "2025-05-12T10:00",
        deadline: null,
        category: "Social",
        type: "Fun"
    },
    {
        id: Date.now() + 11,
        title: "Camping trip",
        description: "Go camping in the mountains",
        date: "2025-05-13T09:00",
        deadline: "2025-08-30T09:00",
        category: "Adventure",
        type: "Fun"
    },
    {
        id: Date.now() + 12,
        title: "Game night",
        description: "Host a game night with friends",
        date: "2025-05-17T19:00",
        deadline: null,
        category: "Social",
        type: "Fun"
    },
    {
        id: Date.now() + 13,
        title: "Helicopter tour",
        description: "Take a helicopter tour of the city",
        date: "2025-05-18T18:00",
        deadline: null,
        category: "Adventure", 
        type: "Bucket"
    },
    {
        id: Date.now() + 14,
        title: "Basketball game",
        description: "Attend a basketball game with friends",
        date: "2025-05-19T14:00",
        deadline: "2025-08-31T14:00",
        category: "Sport",
        type: "Fun"
    },
    {
        id: Date.now() + 15,
        title: "Theater show",
        description: "See a live theater performance",
        date: "2025-05-20T18:00",
        deadline: null,
        category: "Visual",
        type: "Fun"
    },
    {
        id: Date.now() + 16,
        title: "Coachella",
        description: "Visit Coachella festival",
        date: "2025-05-21T19:00",
        deadline: null,
        category: "Music",
        type: "Bucket"
    },
    {
        id: Date.now() + 17,
        title: "Trash",
        description: "Take out the trash",
        date: "2025-05-06T18:00",
        deadline: "2025-05-09T18:00",
        category: "Adventure",
        type: "Daily"
    },
    {
        id: Date.now() + 18,
        title: "Buy groceries",
        description: "Go grocery shopping for the week",
        date: "2025-05-06T19:00",
        deadline: "2025-05-08",
        category: "Chores",
        type: "Daily"
    },
    {
        id: Date.now() + 19,
        title: "Rock climbing",
        description: "Go rock climbing",
        date: "2025-05-24T10:00",
        deadline: null,
        category: "Adventure",
        type: "Bucket"
    },
    {
        id: Date.now() + 20,
        title: "Visit a museum",
        description: "Explore a local museum",
        date: "2025-05-25T11:00",
        deadline: "2025-08-31T11:00",
        category: "Visual",
        type: "Fun"
    },
    {
        id: Date.now() + 21,
        title: "Go see penguins",
        description: "Visit a zoo to see penguins",
        date: "2025-05-26T15:00",
        deadline: null,
        category: "Adventure",
        type: "Fun"
    },
    {
        id: Date.now() + 22,
        title: "Wash dishes",
        description: "Clean dishes",
        date: "2025-05-09T13:00",
        deadline: "2025-05-09",
        category: "Chores",
        type: "Daily"
    },
    {
        id: Date.now() + 23,
        title: "Vacuum the house",
        description: "Vacuum carpets and floors in all rooms",
        date: "2025-05-09T10:00",
        deadline: "2025-05-09T10:00",
        category: "Chores",
        type: "Daily"
    },
    {
        id: Date.now() + 24,
        title: "Water plants",
        description: "Water indoor and balcony plants",
        date: "2025-05-09T09:00",
        deadline: "2025-05-10T11:00",
        category: "Chores",
        type: "Daily"
    },
    {
        id: Date.now() + 25,
        title: "Clean bathroom",
        description: "Clean the bathroom thoroughly",
        date: "2025-05-09T14:00",
        deadline: "2025-05-10T11:00",
        category: "Chores",
        type: "Daily"
    },
    {
        id: Date.now() + 26,
        title: "Organize closet",
        description: "Sort and organize clothes in the closet",
        date: "2025-05-09T11:00",
        deadline: "2025-05-11T11:00",
        category: "Chores",
        type: "Daily"
    },
    {
        id: Date.now() + 27,
        title: "See the Northen Lights",
        description: "Visit Iceland to see the Northern Lights",
        date: "2025-05-14T11:00",
        deadline: null,
        category: "Adventure",
        type: "Bucket"
    },

];

export default activities;