const dummyHabitData = [
  {
    id: '1',
    name: 'Morning Workout',
    category: 'Health & Fitness',
    description: 'Start the day with 30 minutes of exercise',
    difficulty: 2,
    pointsPerDay: 10,
    totalDays: 30,
    completedDays: 7,
    streak: 3,
    isActive: true,
    reward: 'New fitness gear',
    frequency: 'daily',
    createdDate: new Date(),
    lastCompletedDate: new Date()
  },
  {
    id: '2',
    name: 'Read 30 Minutes',
    category: 'Learning & Education',
    description: 'Daily reading for personal growth',
    difficulty: 1,
    pointsPerDay: 5,
    totalDays: 21,
    completedDays: 14,
    streak: 5,
    isActive: true,
    reward: 'Buy 3 new books',
    frequency: 'daily',
    createdDate: new Date()
  }
];

const categories = [
  { text: "Health & Fitness", value: "health-fitness" },
  { text: "Learning & Education", value: "learning-education" },
  { text: "Productivity", value: "productivity" },
  { text: "Mindfulness", value: "mindfulness" },
  { text: "Social", value: "social" },
  { text: "Creative", value: "creative" },
  { text: "Finance", value: "finance" },
  { text: "Other", value: "other" }
];

const difficultyLevels = [
  { level: 1, name: 'Easy', points: 10, color: 'bg-green-500' },
  { level: 2, name: 'Medium', points: 20, color: 'bg-yellow-500' },
  { level: 3, name: 'Hard', points: 30, color: 'bg-orange-500' },
  { level: 4, name: 'Expert', points: 40, color: 'bg-red-500' }
];

const frequencies = [
  { text: "Daily", value: "daily" },
  { text: "Every other day", value: "every-other-day" },
  { text: "Weekdays only", value: "weekdays-only" },
  { text: "Weekends only", value: "weekends-only" }
];

const dummyRewardData = [
  {
    id: '1',
    name: 'Favorite Coffee',
    description: 'Treat yourself to that expensive coffee you love',
    pointsCost: 25,
    category: 'Food & Treats',
    isRedeemed: false
  },
  {
    id: '2',
    name: 'Movie Night',
    description: 'Watch that movie you\'ve been wanting to see',
    pointsCost: 50,
    category: 'Entertainment',
    isRedeemed: false
  },
  {
    id: '3',
    name: 'Spa Day',
    description: 'Relaxing spa treatment',
    pointsCost: 150,
    category: 'Self Care',
    isRedeemed: true,
    redeemedDate: new Date()
  }
]
export { dummyHabitData, categories, difficultyLevels, frequencies ,dummyRewardData};