interface Habit {
  name: string;
  category: string;
  description: string;
  duration: number;
  frequency: string;
  startDate: Date | null;
  difficulty: number;
  rewardName: string;
  rewardCategory: string;
  rewardLink: string;
  rewardCost: number;
}

interface DashboardData {
  activeHabits: number,
  completedHabits: number,
  bestStreak: number,
  totalPoints: number;
  habits: Habit[];
}


export { Habit, DashboardData };