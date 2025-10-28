import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Trophy, Target, Award, Plus, Flame, MoreVertical, Edit, EyeOff, Trash2, RotateCcw } from 'lucide-react';
import { HabitCard } from '../../utils/interfaces';
import HeaderComponent from '../Header/HeaderComponent';
import { useNavigate } from 'react-router-dom';
import { callDeleteApi, callGetApi, callPatchApi } from '../../services/apiServices';
import endpoints from '../../utils/endpoints';
import { ApiLoader } from '../ui/loader';
import { useDispatch } from 'react-redux';
import { clearLoader, setLoader } from '../../store/loaderSlice';
import { makeHabitCategoryText } from '../../services/commanService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';

export function Dashboard() {
  const [habitAnalytics, setHabitAnalytics] = useState({
    totalPoints: 0,
    completedHabits: 0,
    bestStreak: 0,
    activeHabits: 0
  })
  const [habits, setHabits] = useState<HabitCard[]>([])
  const [inactiveHabits, setInactiveHabits] = useState<HabitCard[]>([])
  const [activeTab, setActiveTab] = useState('active')
  // const [loader, setLoader] = useState<boolean>(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getHabitAnalytics();
    getActiveHabits();
    getInactiveHabits();

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

  const getInactiveHabits = async () => {
    try {
      const response = await callGetApi(`${endpoints.GET_HABITS}`, { isActive: false });
      setHabitData(response?.data, false);
      console.log('Inactive habits:', response);
    } catch (error) {
      console.error('Error fetching inactive habits:', error);
    }
  }

  const setHabitData = (response: any, isActive: boolean = true) => {
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
      isActive ? setHabits(habitData) : setInactiveHabits(habitData)
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

  function onEditHabit(habitId: string, event: React.MouseEvent) {
    event.stopPropagation(); // Prevent card click
    console.log('Edit habit:', habitId);
    // TODO: Implement edit habit functionality
  }

  async function onInactiveHabit(habitId: string, event: React.MouseEvent) {
    event.stopPropagation(); // Prevent card click
    console.log('Make habit inactive:', habitId);
    // TODO: Implement inactive habit functionality
    dispatch(setLoader({
      loading: true,
      message: 'Making habit inactive...'
    }));
    try {
      const response = await callPatchApi(`${endpoints.MAKE_HABIT_INACTIVE}`, { habitId: habitId });
      if (response?.data) {
        toast.success('Habit made inactive successfully');
        getActiveHabits();
        getInactiveHabits();
      }
    } catch (error) {
      console.error(error);
      dispatch(clearLoader());
      toast.error('Failed to make habit inactive');
    }
  }

  async function onDeleteHabit(habitId: string, event: React.MouseEvent) {
    event.stopPropagation(); // Prevent card click
    console.log('Delete habit:', habitId);
    dispatch(setLoader({
      loading: true,
      message: 'Deleting habit...'
    }));
    try {
      const response = await callDeleteApi(`${endpoints.DELETE_HABIT}`, { habitId: habitId });
      if (response?.data) {
        toast.success('Habit deleted successfully');
        getActiveHabits();
        getInactiveHabits();
      }
    } catch (error) {
      console.error(error);
      dispatch(clearLoader());
      toast.error('Failed to delete habit');
    }
  }

  async function onReactivateHabit(habitId: string, event: React.MouseEvent) {
    event.stopPropagation(); // Prevent card click
    console.log('Reactivate habit:', habitId);
    dispatch(setLoader({
      loading: true,
      message: 'Reactivating habit...'
    }));
    try {
      const response = await callPatchApi(`${endpoints.MAKE_HABIT_INACTIVE}`, { habitId: habitId });
      if (response?.data) {
        toast.success('Habit reactivated successfully');
        getActiveHabits();
        getInactiveHabits();
      }
    } catch (error) {
      console.error(error);
      dispatch(clearLoader());
      toast.error('Failed to reactivate habit');
    }
  }


  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <HeaderComponent totalPoints={habitAnalytics.totalPoints}></HeaderComponent>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {
          activeTab === 'active' ? (<Card className="bg-card/50 border-orange-primary/20">
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
          </Card>) : (
            <Card className="bg-card/50 border-gray-300/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-300/20 rounded-lg">
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Inactive Habits</p>
                    <p className="text-2xl font-bold">{inactiveHabits?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        }



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

      {/* Habits Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[40%] space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="active"
            className={`flex items-center gap-2 transition-colors ${activeTab === 'active'
              ? 'bg-orange-primary text-white border-orange-primary'
              : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
          >
            <Target className="h-4 w-4" />
            Active Habits ({habits?.length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="inactive"
            className={`flex items-center gap-2 transition-colors ${activeTab === 'inactive'
              ? 'bg-orange-primary text-white border-gray-500'
              : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
          >
            <EyeOff className="h-4 w-4" />
            Inactive Habits ({inactiveHabits?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
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
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-orange-primary/20 text-orange-primary">
                          {habit.category ? makeHabitCategoryText(habit.category) : 'NA'}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={(e) => onEditHabit(habit.id, e)}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Habit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => onInactiveHabit(habit.id, e)}
                              className="cursor-pointer"
                            >
                              <EyeOff className="mr-2 h-4 w-4" />
                              Make Inactive
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => onDeleteHabit(habit.id, e)}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              variant="destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Habit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {inactiveHabits?.length === 0 ? (
            <Card className="bg-card/50 border-dashed border-gray-300/30">
              <CardContent className="p-8 text-center">
                <EyeOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-600">No inactive habits</h3>
                <p className="text-muted-foreground mb-4">All your habits are currently active!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inactiveHabits?.map((habit) => (
                <Card key={habit.id} className="bg-card/30 border-gray-300/20 hover:border-gray-400/40 transition-colors cursor-pointer opacity-75"
                  onClick={() => onViewRoadmap(habit.id)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-600">{habit.habitName}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-gray-200 text-gray-600">
                          {habit.category ? makeHabitCategoryText(habit.category) : 'NA'}
                        </Badge>
                        <Badge variant="outline" className="text-gray-500 border-gray-300">
                          Inactive
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={(e) => onReactivateHabit(habit.id, e)}
                              className="cursor-pointer text-green-600 focus:text-green-600"
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Reactivate Habit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => onDeleteHabit(habit.id, e)}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              variant="destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Habit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-500">
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
                        <Flame className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{habit.currentStreak} day streak</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{habit.totalHabitPointsEarned} pts</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      <strong>Reward:</strong> {habit.rewardName}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}