interface Habit {
  name: string;
  category: string;
  description: string;
  duration: number;
  frequency: string;
  customDays?: number[];
  startDate: Date | null;
  difficulty: string;
  rewardName: string;
  rewardCategory: string;
  rewardLink: string;
  rewardCost: number;
}

interface Reward {
  id: string;
  name: string;
  rewardLink?: string;
  rewardCost: number;
  productImageUrl?: string;
  rewardPoints: number;
  rewardCategory: string;
  isRedeemed: boolean;
  redeemedDate?: Date;
  habitName?: string;
}

interface HabitCard {
  id: string,
  category: string,
  completedDays: number,
  currentStreak: number,
  habitName: number,
  progress: number,
  rewardName: string,
  totalDays: number,
  totalHabitPointsEarned: number
}

interface HabitDetails {
  habitName: string,
  completedDays: number;
  totalDays: number;
  currentStreak: number;
  highestStreak: number;
  totalHabitPointsEarned: number;
  progress: number;
  frequency: 'daily' | 'weekdays'
  category: string;
  rewardId: string;
  rewardName: string;
  finalPointsToEarn: string;
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

interface JourneyData {
  day: number;
  date: string;
  formatedDate?: string;
  dailyPoints: number;
  isTaskCompleted: boolean;
  isUpdateAllowed: boolean;
}

export { Habit, Reward, DashboardData, HabitCard, HabitDetails, JourneyData };