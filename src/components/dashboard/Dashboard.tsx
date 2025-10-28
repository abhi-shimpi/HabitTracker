import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Trophy, Target, Award, Plus, Flame } from 'lucide-react';
import { HabitCard } from '../../utils/interfaces';
import HeaderComponent from '../Header/HeaderComponent';
import { useNavigate } from 'react-router-dom';
import { callGetApi } from '../../services/apiServices';
import endpoints from '../../utils/endpoints';
import { ApiLoader } from '../ui/loader';
import { useDispatch } from 'react-redux';
import { clearLoader, setLoader } from '../../store/loaderSlice';
import { makeHabitCategoryText } from '../../services/commanService';

export function Dashboard() {
  const [habitAnalytics, setHabitAnalytics] = useState({
    totalPoints: 0,
    completedHabits: 0,
    bestStreak: 0,
    activeHabits: 0
  })
  const [habits, setHabits] = useState<HabitCard[]>([])
  // const [loader, setLoader] = useState<boolean>(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getHabitAnalytics();
    getActiveHabits();

    return () => {

    };
  }, []);

  const getHabitAnalytics = async () => {
    dispatch(setLoader({
      loading: true,
      message: 'Loading your dashboard data...'
    }));

    try {
      const response = await callGetApi(`${endpoints.GET_HABIT_ANALYTICS}`, {});
      if (response?.data) {
        setHabitAnalytics({
          totalPoints: response.data.totalPoints,
          activeHabits: response.data.activeHabits,
          completedHabits: response.data.completedHabits,
          bestStreak: response.data.bestStreak
        })
      }
      dispatch(clearLoader());
      console.log(response);
    } catch (error) {
      console.error(error);
      dispatch(clearLoader());
    }
  }

  const getActiveHabits = async () => {
    dispatch(setLoader({
      loading: true,
      message: 'Loading your active habits...'
    }));

    try {
      const response = await callGetApi(`${endpoints.GET_HABITS}`, { isActive: true });
      setHabitData(response?.data);
      dispatch(clearLoader());
      console.log(response);
    } catch (error) {
      console.error(error);
      dispatch(clearLoader());
    }
  }

  const setHabitData = (response: any) => {
    if (response) {
      const habitData: any = [];

      response.forEach((habit: any) => {
        const data: HabitCard = {
          id: habit._id,
          category: habit.category,
          completedDays: habit.completedDays,
          currentStreak: habit.currentStreak,
          habitName: habit.habitName,
          progress: habit.progress,
          rewardName: habit.rewardName,
          totalDays: habit.totalDays,
          totalHabitPointsEarned: habit.totalHabitPointsEarned
        }
        habitData.push(data);
      })
      setHabits(habitData)
    }
  }
  function onCreateHabit() {
    navigate('/create-habit')
  }

  function onViewRoadmap(habitId) {
    navigate(`/habit-journey/${habitId}`)
  }

  function onViewRewards() {
    navigate('/rewards')
  }


  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <HeaderComponent totalPoints={habitAnalytics.totalPoints}></HeaderComponent>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-orange-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-primary/20 rounded-lg">
                <Target className="h-5 w-5 text-orange-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Habits</p>
                <p className="text-2xl font-bold">{habitAnalytics.activeHabits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-orange-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Award className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{habitAnalytics.completedHabits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-orange-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Flame className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Best Streak</p>
                <p className="text-2xl font-bold">{habitAnalytics.bestStreak}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-orange-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-primary/20 rounded-lg">
                <Trophy className="h-5 w-5 text-orange-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">{habitAnalytics.totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={onCreateHabit} className="bg-orange-primary hover:bg-orange-secondary">
          <Plus className="h-4 w-4 mr-2" />
          Create New Habit
        </Button>
        <Button variant="outline" onClick={onViewRewards} className="cursor-pointer border-orange-primary text-orange-primary hover:bg-orange-primary/10">
          <Award className="h-4 w-4 mr-2" />
          View Rewards
        </Button>
      </div>

      {/* Active Habits */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Habits</h2>
        {habits?.length === 0 ? (
          <Card className="bg-card/50 border-dashed border-orange-primary/30">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-orange-primary/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No active habits yet</h3>
              <p className="text-muted-foreground mb-4">Create your first habit to start your journey!</p>
              <Button onClick={onCreateHabit} className="bg-orange-primary hover:bg-orange-secondary">
                <Plus className="h-4 w-4 mr-2" />
                Create Habit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits?.map((habit) => (
              <Card key={habit.id} className="bg-card/50 border-orange-primary/20 hover:border-orange-primary/40 transition-colors cursor-pointer"
                onClick={() => onViewRoadmap(habit.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{habit.habitName}</CardTitle>
                    <Badge variant="secondary" className="bg-orange-primary/20 text-orange-primary">
                      {habit.category ? makeHabitCategoryText(habit.category) : 'NA'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{habit.completedDays}/{habit.totalDays} days</span>
                    </div>
                    <Progress
                      value={(habit.completedDays / habit.totalDays) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-red-500" />
                      <span className="text-sm">{habit.currentStreak} day streak</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-orange-primary" />
                      <span className="text-sm">{habit.totalHabitPointsEarned} pts</span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <strong>Reward:</strong> {habit.rewardName}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}