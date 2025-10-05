import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/dashboard/Dashboard';
import { HabitCreator } from './components/create-habit/HabitCreator';
import { HabitJourney } from './components/habit-journey/HabitRoadmap';
import { RewardManager } from './components/reward-manager/RewardManager';
import { Toaster } from './components/ui/sonner';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AppRouter from './AppRouting';

// interface Habit {
//   id: string;
//   name: string;
//   category: string;
//   description: string;
//   difficulty: number;
//   pointsPerDay: number;
//   totalDays: number;
//   completedDays: number;
//   streak: number;
//   isActive: boolean;
//   reward: string;
//   frequency: string;
//   createdDate: Date;
//   lastCompletedDate?: Date;
// }

// interface Reward {
//   id: string;
//   name: string;
//   description: string;
//   pointsCost: number;
//   category: string;
//   isRedeemed: boolean;
//   redeemedDate?: Date;
//   habitName?: string;
// }

// type ViewState = 'dashboard' | 'create-habit' | 'roadmap' | 'rewards';

// const difficultyPoints: { [key: number]: number } = {
//   1: 5,   // Easy
//   2: 10,  // Medium
//   3: 15,  // Hard
//   4: 25   // Expert
// };

export default function App() {
  // const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  // const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  
  // // Initialize with some sample data
  // const [habits, setHabits] = useState<Habit[]>([
  //   {
  //     id: '1',
  //     name: 'Morning Workout',
  //     category: 'Health & Fitness',
  //     description: 'Start the day with 30 minutes of exercise',
  //     difficulty: 2,
  //     pointsPerDay: 10,
  //     totalDays: 30,
  //     completedDays: 7,
  //     streak: 3,
  //     isActive: true,
  //     reward: 'New fitness gear',
  //     frequency: 'daily',
  //     createdDate: new Date(),
  //     lastCompletedDate: new Date()
  //   },
  //   {
  //     id: '2',
  //     name: 'Read 30 Minutes',
  //     category: 'Learning & Education',
  //     description: 'Daily reading for personal growth',
  //     difficulty: 1,
  //     pointsPerDay: 5,
  //     totalDays: 21,
  //     completedDays: 14,
  //     streak: 5,
  //     isActive: true,
  //     reward: 'Buy 3 new books',
  //     frequency: 'daily',
  //     createdDate: new Date()
  //   }
  // ]);

  // const [rewards, setRewards] = useState<Reward[]>([
  //   {
  //     id: '1',
  //     name: 'Favorite Coffee',
  //     description: 'Treat yourself to that expensive coffee you love',
  //     pointsCost: 25,
  //     category: 'Food & Treats',
  //     isRedeemed: false
  //   },
  //   {
  //     id: '2',
  //     name: 'Movie Night',
  //     description: 'Watch that movie you\'ve been wanting to see',
  //     pointsCost: 50,
  //     category: 'Entertainment',
  //     isRedeemed: false
  //   },
  //   {
  //     id: '3',
  //     name: 'Spa Day',
  //     description: 'Relaxing spa treatment',
  //     pointsCost: 150,
  //     category: 'Self Care',
  //     isRedeemed: true,
  //     redeemedDate: new Date()
  //   }
  // ]);

  // const totalPoints = habits.reduce((sum, habit) => sum + (habit.completedDays * habit.pointsPerDay), 0);

  // const handleCreateHabit = (habitData: {
  //   name: string;
  //   category: string;
  //   description: string;
  //   duration: number;
  //   frequency: string;
  //   difficulty: number;
  //   reward: string;
  // }) => {
  //   const newHabit: Habit = {
  //     id: Date.now().toString(),
  //     name: habitData.name,
  //     category: habitData.category,
  //     description: habitData.description,
  //     difficulty: habitData.difficulty,
  //     pointsPerDay: difficultyPoints[habitData.difficulty],
  //     totalDays: habitData.duration,
  //     completedDays: 0,
  //     streak: 0,
  //     isActive: true,
  //     reward: habitData.reward,
  //     frequency: habitData.frequency,
  //     createdDate: new Date()
  //   };

  //   // Also add the reward to the rewards list
  //   const newReward: Reward = {
  //     id: Date.now().toString() + '_reward',
  //     name: habitData.reward,
  //     description: `Reward for completing ${habitData.name}`,
  //     pointsCost: habitData.duration * difficultyPoints[habitData.difficulty],
  //     category: 'Other',
  //     isRedeemed: false,
  //     habitName: habitData.name
  //   };

  //   setHabits(prev => [...prev, newHabit]);
  //   setRewards(prev => [...prev, newReward]);
  //   setCurrentView('dashboard');
    
  //   toast.success(`Habit "${habitData.name}" created successfully! 🎉`, {
  //     description: `You'll earn ${difficultyPoints[habitData.difficulty]} points per day for ${habitData.duration} days.`
  //   });
  // };

  // const handleToggleDay = (habitId: string, day: number) => {
  //   setHabits(prev => prev.map(habit => {
  //     if (habit.id === habitId) {
  //       const isCompleting = day === habit.completedDays + 1;
  //       const isUncompleting = day === habit.completedDays;
        
  //       if (isCompleting) {
  //         const newCompletedDays = habit.completedDays + 1;
  //         const newStreak = habit.streak + 1;
  //         const pointsEarned = habit.pointsPerDay;
          
  //         toast.success(`Day ${day} completed! +${pointsEarned} points 🎉`, {
  //           description: `${habit.totalDays - newCompletedDays} days to go!`
  //         });

  //         // Check if habit is completed
  //         if (newCompletedDays >= habit.totalDays) {
  //           toast.success(`🎉 Habit "${habit.name}" completed! 🎉`, {
  //             description: `You can now claim your reward: ${habit.reward}`
  //           });
  //         }
          
  //         return {
  //           ...habit,
  //           completedDays: newCompletedDays,
  //           streak: newStreak,
  //           lastCompletedDate: new Date(),
  //           isActive: newCompletedDays < habit.totalDays
  //         };
  //       } else if (isUncompleting) {
  //         const newCompletedDays = habit.completedDays - 1;
  //         const newStreak = Math.max(0, habit.streak - 1);
          
  //         toast.info(`Day ${day} unmarked`, {
  //           description: `Progress updated`
  //         });
          
  //         return {
  //           ...habit,
  //           completedDays: newCompletedDays,
  //           streak: newStreak,
  //           isActive: true
  //         };
  //       }
  //     }
  //     return habit;
  //   }));
  // };

  // const handleRedeemReward = (rewardId: string) => {
  //   const reward = rewards.find(r => r.id === rewardId);
  //   if (!reward || totalPoints < reward.pointsCost) {
  //     toast.error("Not enough points to redeem this reward!");
  //     return;
  //   }

  //   setRewards(prev => prev.map(r => 
  //     r.id === rewardId 
  //       ? { ...r, isRedeemed: true, redeemedDate: new Date() }
  //       : r
  //   ));

  //   toast.success(`🎉 Reward redeemed: ${reward.name}!`, {
  //     description: "Enjoy your well-earned reward!"
  //   });
  // };

  // const handleAddReward = (rewardData: {
  //   name: string;
  //   description: string;
  //   pointsCost: number;
  //   category: string;
  // }) => {
  //   const newReward: Reward = {
  //     id: Date.now().toString(),
  //     ...rewardData,
  //     isRedeemed: false
  //   };

  //   setRewards(prev => [...prev, newReward]);
  //   toast.success(`Reward "${rewardData.name}" added!`);
  // };

  // const handleClaimReward = () => {
  //   if (selectedHabitId) {
  //     const habit = habits.find(h => h.id === selectedHabitId);
  //     if (habit && habit.completedDays >= habit.totalDays) {
  //       toast.success(`🎉 Congratulations! You've earned: ${habit.reward}!`, {
  //         description: "You've successfully completed your habit journey!"
  //       });
  //     }
  //   }
  // };

  // const selectedHabit = selectedHabitId ? habits.find(h => h.id === selectedHabitId) : null;

  return (
    <div className="dark min-h-screen bg-background">
      <Router>
        <Toaster position="top-right" />
        <AppRouter />
      </Router>
      {/* {currentView === 'dashboard' && (
        <Dashboard
          habits={habits}
          totalPoints={totalPoints}
          onCreateHabit={() => setCurrentView('create-habit')}
          onViewRoadmap={(habitId) => {
            setSelectedHabitId(habitId);
            setCurrentView('roadmap');
          }}
          onViewRewards={() => setCurrentView('rewards')}
        />
      )}

      {currentView === 'create-habit' && (
        <HabitCreator
          onBack={() => setCurrentView('dashboard')}
          onCreateHabit={handleCreateHabit}
        />
      )}

      {currentView === 'roadmap' && selectedHabit && (
        <HabitRoadmap
          habit={selectedHabit}
          onBack={() => setCurrentView('dashboard')}
          onToggleDay={(day) => handleToggleDay(selectedHabit.id, day)}
          onClaimReward={handleClaimReward}
        />
      )}

      {currentView === 'rewards' && (
        <RewardManager
          rewards={rewards}
          totalPoints={totalPoints}
          onBack={() => setCurrentView('dashboard')}
          onRedeemReward={handleRedeemReward}
          onAddReward={handleAddReward}
        />
      )} */}
    </div>
  );
}