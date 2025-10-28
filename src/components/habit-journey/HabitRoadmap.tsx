import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ArrowLeft, Check, X, Calendar, Trophy, Flame, Target, Award, Star, Zap, Crown, Gem, Sparkles, Gift, Rocket } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { dummyHabitData } from '../../utils/dummyData';
import { callGetApi, callPatchApi, callPostApi } from '../../services/apiServices';
import endpoints from '../../utils/endpoints';
import { HabitDetails, JourneyData } from '../../utils/interfaces';
import { getFormatedDate, makeHabitCategoryText } from '../../services/commanService';
import { ApiLoader } from '../ui/loader';
import { toast } from 'sonner';
import { clearLoader, setLoader } from '../../store/loaderSlice';
import { useDispatch } from 'react-redux';


interface Habit {
  id: string;
  name: string;
  category: string;
  difficulty: number;
  totalDays: number;
  completedDays: number;
  streak: number;
  reward: string;
  pointsPerDay: number;
  frequency: string;
}

interface HabitRoadmapProps {
  habit: Habit;
  onBack: () => void;
  onToggleDay: (day: number) => void;
  onClaimReward: () => void;
}

export function HabitJourney() {
  const [habitDetails, setHabitDetails] = useState<HabitDetails>({} as HabitDetails);
  const [habitJourney, setHabitJourney] = useState<JourneyData[]>([]);
  // const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const { habitId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    getHabitDetails();
    getHabitJourney();

    return () => {

    };
  }, []);

  const getHabitDetails = async () => {
    dispatch(setLoader({
      loading: true,
      message: 'Loading your habit journey data...'
    }));

    try {
      const response = await callGetApi(`${endpoints.VIEW_HABIT}`, { habitId: habitId });
      if (response?.data) setHabitAndRewardDetails(response.data);
      dispatch(clearLoader());
      console.log(response);
    } catch (error) {
      console.error(error);
      dispatch(clearLoader());
    }
  }

  const getHabitJourney = async () => {
    dispatch(setLoader({
      loading: true,
      message: 'Loading your habit journey data...'
    }));

    try {
      const response = await callGetApi(`${endpoints.GET_HABIT_JOURNEY}`, { habitId: habitId });
      if (response?.data?.journeyData) setHabitJourneyDetails(response.data.journeyData);
      dispatch(clearLoader());
      console.log(response);
    } catch (error) {
      console.error(error);
      dispatch(clearLoader());
    }
  }

  const setHabitAndRewardDetails = (response) => {
    console.log(response);
    const data: HabitDetails = {
      habitName: response?.habitName,
      completedDays: response?.completedDays,
      totalDays: response?.totalDays,
      currentStreak: response?.currentStreak,
      highestStreak: response?.highestStreak,
      totalHabitPointsEarned: response?.totalHabitPointsEarned,
      progress: response?.progress,
      frequency: response?.frequency,
      category: response?.category,
      rewardName: response?.rewardName,
      finalPointsToEarn: response?.finalPointsToEarn,
      rewardLink: response?.rewardLink,
      rewardCost: response?.rewardCost,
      rewardId: response?.reward_id
    }
    setHabitDetails(data);
  }

  const setHabitJourneyDetails = (response) => {
    const journeyData: JourneyData[] = [];

    response.forEach((journey: JourneyData) => {
      journeyData.push({
        day: journey?.day,
        date: journey?.date,
        formatedDate: getFormatedDate(journey?.date),
        dailyPoints: journey?.dailyPoints,
        isTaskCompleted: journey?.isTaskCompleted,
        isUpdateAllowed: journey?.isUpdateAllowed,
      })
    });

    setHabitJourney(journeyData)
  }
  console.log("habitJourney", habitJourney)
  const onBack = () => {
    // Navigate back to dashboard or previous view  
    navigate('/dashboard');
  }

  const handleToggleDay = async (date: any) => {
    const payload = {
      logDate: date,
      habitId: habitId
    };

    dispatch(setLoader({
      loading: true,
      message: 'Logging the habit...'
    }));
    try {
      const response = await callPostApi(`${endpoints.LOG_HABIT}`, payload);
      getHabitDetails();
      getHabitJourney();
      console.log(response);
      toast.success("Successfully logged the habit!");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
      dispatch(clearLoader());
    }
  }

  const handleClaimReward = async () => {
    dispatch(setLoader({
      loading: true,
      message: 'Claiming the reward...'
    }));
    try {
      const response = await callPatchApi(`${endpoints.CLAIM_REWARD}`, { habitId: habitId, rewardId: habitDetails.rewardId });
      if (response?.data) {
        toast.success("Successfully claimed the reward!");
        getHabitDetails();
        getHabitJourney();
      } else {
        toast.error("Failed to claim the reward!");
        dispatch(clearLoader());
      }
      dispatch(clearLoader());
    } catch (error) {
      console.error(error);
      toast.error("Failed to claim the reward!");
      dispatch(clearLoader());
    }
  };

  // Helper functions for motivational UI
  const getMotivationalMessage = () => {
    const progress = habitDetails.progress || 0;
    const streak = habitDetails.currentStreak || 0;

    if (progress >= 100) return "🎉 Amazing! You've conquered this habit! 🎉";
    if (progress >= 80) return "🔥 You're so close to victory! Keep pushing! 🔥";
    if (progress >= 60) return "💪 More than halfway there! You're unstoppable! 💪";
    if (progress >= 40) return "⭐ Great progress! You're building momentum! ⭐";
    if (progress >= 20) return "🚀 You're off to a fantastic start! 🚀";
    if (streak >= 7) return "🏆 7-day streak! You're on fire! 🏆";
    if (streak >= 3) return "✨ Nice streak! Keep the momentum going! ✨";
    return "🌟 Every journey begins with a single step! 🌟";
  };

  const getAchievementBadge = () => {
    const streak = habitDetails.currentStreak || 0;
    const progress = habitDetails.progress || 0;

    if (streak >= 30) return { icon: Crown, text: "Legend", color: "text-purple-500", bg: "bg-purple-500/20" };
    if (streak >= 21) return { icon: Gem, text: "Diamond", color: "text-blue-500", bg: "bg-blue-500/20" };
    if (streak >= 14) return { icon: Star, text: "Gold", color: "text-yellow-500", bg: "bg-yellow-500/20" };
    if (streak >= 7) return { icon: Zap, text: "Silver", color: "text-gray-500", bg: "bg-gray-500/20" };
    if (streak >= 3) return { icon: Flame, text: "Bronze", color: "text-orange-500", bg: "bg-orange-500/20" };
    return null;
  };

  const progressPercentage = (habitDetails.completedDays / habitDetails.totalDays) * 100;
  const isCompleted = habitDetails.completedDays >= habitDetails.totalDays;
  const achievement = getAchievementBadge();
  const RoadmapNode = ({ day, onClick }: { day: JourneyData; onClick: () => void }) => {
    const nodeClasses = `
      roadmap-node w-16 h-16 rounded-full border-4 flex items-center justify-center cursor-pointer
      transition-all duration-300 hover:scale-110 hover:shadow-lg
      ${day.isTaskCompleted
        ? 'bg-gradient-to-br from-orange-primary to-orange-secondary border-orange-primary text-white shadow-lg animate-bounce'
        : day.isUpdateAllowed
          ? 'bg-card border-orange-primary text-orange-primary animate-pulse hover:animate-none hover:bg-orange-primary/10'
          : 'bg-card/50 border-gray-600 text-muted-foreground hover:border-gray-500'
      }
    `;

    return (
      <div key={day.day} className="flex flex-col items-center space-y-2 relative group">
        {/* Sparkle effects for completed days */}
        {day.isTaskCompleted && (
          <div className="absolute -top-2 -right-2 animate-spin">
            <Sparkles className="h-4 w-4 text-yellow-400" />
          </div>
        )}

        <div className={nodeClasses} onClick={onClick}>
          {day.isTaskCompleted ? (
            <div className="relative">
              <Check className="h-6 w-6" />
              <div className="absolute inset-0 animate-ping">
                <Check className="h-6 w-6 opacity-30" />
              </div>
            </div>
          ) : (
            <span className="font-bold">{day.day}</span>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {day?.formatedDate}
          </p>
          <p className="text-xs text-orange-primary font-semibold">+{day?.dailyPoints}</p>
          {day.isTaskCompleted && (
            <div className="flex items-center justify-center mt-1">
              <Star className="h-3 w-3 text-yellow-400 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="border-orange-primary text-orange-primary hover:bg-orange-primary/10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{habitDetails.habitName}</h1>
              {achievement && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${achievement.bg}`}>
                  <achievement.icon className={`h-4 w-4 ${achievement.color}`} />
                  <span className={`text-xs font-semibold ${achievement.color}`}>{achievement.text}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-orange-primary/20 text-orange-primary">
                {makeHabitCategoryText(habitDetails.category)}
              </Badge>
              <Badge variant="outline" className="border-orange-primary text-orange-primary">
                {habitDetails.frequency}
              </Badge>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <Card className="bg-gradient-to-r from-orange-primary/5 to-orange-secondary/5 border-orange-primary/20">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-orange-primary animate-pulse">
                {getMotivationalMessage()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-orange-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-primary/20 rounded-lg">
                  <Target className="h-5 w-5 text-orange-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-xl font-bold text-orange-primary">{habitDetails.completedDays}/{habitDetails.totalDays}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-orange-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg animate-bounce">
                  <Flame className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Streak</p>
                  <p className="text-xl font-bold text-red-500">{habitDetails.currentStreak} days</p>
                  {habitDetails.currentStreak >= 7 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400 font-semibold">On Fire!</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-orange-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-primary/20 rounded-lg">
                  <Trophy className="h-5 w-5 text-orange-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Points Earned</p>
                  <p className="text-xl font-bold text-orange-primary">{habitDetails.totalHabitPointsEarned}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-orange-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${habitDetails.progress >= 100 ? 'bg-green-500/20 animate-bounce' : 'bg-green-500/20'}`}>
                  <Award className={`h-5 w-5 ${habitDetails.progress >= 100 ? 'text-green-500' : 'text-green-500'}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion</p>
                  <p className="text-xl font-bold text-green-500">{Math.round(habitDetails.progress)}%</p>
                  {habitDetails.progress >= 100 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Crown className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400 font-semibold">Complete!</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="bg-card/50 border-orange-primary/20 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Overall Progress</h3>
                <span className="text-sm text-muted-foreground">{habitDetails.completedDays} of {habitDetails.totalDays} days</span>
              </div>
              <div className="relative">
                <Progress value={habitDetails.progress} className="h-4" />
                {/* Animated progress overlay */}
                <div
                  className="absolute top-0 left-0 h-4 bg-gradient-to-r from-orange-primary to-orange-secondary rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${habitDetails.progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
              {isCompleted && (
                <div className="text-center space-y-4 animate-bounce">
                  <div className="flex items-center justify-center gap-2">
                    <Rocket className="h-6 w-6 text-yellow-400 animate-pulse" />
                    <p className="text-green-400 font-bold text-xl">🎉 Habit Completed! 🎉</p>
                    <Rocket className="h-6 w-6 text-yellow-400 animate-pulse" />
                  </div>
                  <Button
                    onClick={handleClaimReward}
                    className="cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Gift className="h-5 w-5 mr-2 animate-bounce" />
                    Claim Your Reward: {habitDetails.rewardName}
                    <Sparkles className="h-5 w-5 ml-2 animate-spin" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Roadmap */}
        <Card className="bg-card/50 border-orange-primary/20 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-orange-primary" />
              Your Journey
              <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative">
              {/* Roadmap Path */}
              <div className="absolute top-8 left-8 right-8 h-2 bg-gradient-to-r from-orange-primary via-orange-secondary to-orange-light rounded-full opacity-30 shadow-lg"></div>

              {/* Progress Path with animation */}
              <div
                className="absolute top-8 left-8 h-2 bg-gradient-to-r from-orange-primary to-orange-secondary rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${Math.max(0, (progressPercentage / 100) * (100 - 12))}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
              </div>

              {/* Roadmap Days */}
              <div className="grid grid-cols-7 gap-4 md:gap-6 lg:gap-8">
                {habitJourney.map((day) => {
                  return (
                    <div key={day.day}>
                      <RoadmapNode
                        day={day}
                        onClick={() => { if (day.isUpdateAllowed) handleToggleDay(day.date) }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Legend */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-6 text-sm bg-card/50 p-4 rounded-lg border border-orange-primary/20">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-primary to-orange-secondary shadow-lg animate-pulse"></div>
                  <span className="font-semibold">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-orange-primary bg-card animate-pulse"></div>
                  <span className="font-semibold">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-600 bg-card/50"></div>
                  <span className="font-semibold">Upcoming</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Reward Preview */}
        <Card className={`bg-gradient-to-r from-orange-primary/10 to-orange-secondary/10 border-orange-primary/30 hover:shadow-xl transition-all hover:scale-105 ${isCompleted ? 'border-green-500/50' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg transition-all duration-300 ${isCompleted ? 'bg-green-500/20 animate-bounce' : 'bg-orange-primary/20'}`}>
                {isCompleted ? (
                  <div className="relative">
                    <Gift className="h-6 w-6 text-green-500" />
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="h-3 w-3 text-yellow-400 animate-spin" />
                    </div>
                  </div>
                ) : (
                  <Award className="h-6 w-6 text-orange-primary" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold flex items-center gap-2">
                  Your Reward
                  {isCompleted && <Crown className="h-4 w-4 text-yellow-400" />}
                </h3>
                <p className="text-muted-foreground font-medium">{habitDetails.rewardName}</p>

                {/* Enhanced Reward Details */}
                <div className="mt-3 space-y-2">
                  {/* Reward Cost Display */}
                  {habitDetails.rewardCost && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
                        <Gem className="h-3 w-3 text-purple-500" />
                        <span className="text-xs font-semibold text-purple-600">Reward Cost: Rs {habitDetails.rewardCost} </span>
                      </div>
                    </div>
                  )}

                  {/* Reward Link Display */}
                  {habitDetails.rewardLink && (
                    <div className="flex items-center gap-2">
                      <a
                        href={habitDetails.rewardLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 rounded-full border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 group"
                      >
                        <Rocket className="h-3 w-3 text-blue-500 group-hover:animate-bounce" />
                        <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-700">View Reward</span>
                        <Sparkles className="h-3 w-3 text-cyan-400 group-hover:animate-spin" />
                      </a>
                    </div>
                  )}
                </div>

                <p className={`text-sm mt-2 font-semibold ${isCompleted ? 'text-green-500 animate-pulse' : 'text-orange-primary'}`}>
                  {isCompleted ? (
                    <span className="flex items-center gap-1">
                      🎉 Ready to claim! 🎉
                      <Rocket className="h-4 w-4 animate-bounce" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {habitDetails.totalDays - habitDetails.completedDays} days to go!
                    </span>
                  )}
                </p>
              </div>
              {!isCompleted && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Potential Points</p>
                  <p className="text-xl font-bold text-orange-primary">
                    {habitDetails.finalPointsToEarn}
                  </p>
                </div>
              )}
              {isCompleted && (
                <div className="text-right">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-bold text-green-500">Unlocked!</span>
                      <Star className="h-4 w-4 text-yellow-400" />
                    </div>
                    <Button
                      onClick={handleClaimReward}
                      className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <Gift className="h-4 w-4 mr-2 animate-bounce" />
                      Claim Now!
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}