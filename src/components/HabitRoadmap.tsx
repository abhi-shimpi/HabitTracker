import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Check, X, Calendar, Trophy, Flame, Target, Award } from 'lucide-react';

interface RoadmapDay {
  day: number;
  completed: boolean;
  date: Date;
  points: number;
}

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

export function HabitRoadmap({ habit, onBack, onToggleDay, onClaimReward }: HabitRoadmapProps) {
  const generateRoadmapDays = (): RoadmapDay[] => {
    const days: RoadmapDay[] = [];
    const startDate = new Date();
    
    for (let i = 1; i <= habit.totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i - 1);
      
      days.push({
        day: i,
        completed: i <= habit.completedDays,
        date,
        points: habit.pointsPerDay
      });
    }
    
    return days;
  };

  const roadmapDays = generateRoadmapDays();
  const progressPercentage = (habit.completedDays / habit.totalDays) * 100;
  const isCompleted = habit.completedDays >= habit.totalDays;
  const totalPointsEarned = habit.completedDays * habit.pointsPerDay;

  const RoadmapNode = ({ day, isCompleted, isNext, onClick }: {
    day: RoadmapDay;
    isCompleted: boolean;
    isNext: boolean;
    onClick: () => void;
  }) => {
    const nodeClasses = `
      roadmap-node w-16 h-16 rounded-full border-4 flex items-center justify-center cursor-pointer
      ${isCompleted 
        ? 'bg-orange-primary border-orange-primary text-white' 
        : isNext 
          ? 'bg-card border-orange-primary text-orange-primary animate-pulse' 
          : 'bg-card/50 border-gray-600 text-muted-foreground'
      }
    `;

    return (
      <div className="flex flex-col items-center space-y-2">
        <div className={nodeClasses} onClick={onClick}>
          {isCompleted ? (
            <Check className="h-6 w-6" />
          ) : (
            <span className="font-bold">{day.day}</span>
          )}
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
          <p className="text-xs text-orange-primary">+{day.points}</p>
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
            <h1 className="text-2xl font-bold">{habit.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-orange-primary/20 text-orange-primary">
                {habit.category}
              </Badge>
              <Badge variant="outline" className="border-orange-primary text-orange-primary">
                {habit.frequency}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-orange-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-primary/20 rounded-lg">
                  <Target className="h-5 w-5 text-orange-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-xl font-bold">{habit.completedDays}/{habit.totalDays}</p>
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
                  <p className="text-sm text-muted-foreground">Streak</p>
                  <p className="text-xl font-bold">{habit.streak} days</p>
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
                  <p className="text-sm text-muted-foreground">Points Earned</p>
                  <p className="text-xl font-bold">{totalPointsEarned}</p>
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
                  <p className="text-sm text-muted-foreground">Completion</p>
                  <p className="text-xl font-bold">{Math.round(progressPercentage)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="bg-card/50 border-orange-primary/20">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Overall Progress</h3>
                <span className="text-sm text-muted-foreground">{habit.completedDays} of {habit.totalDays} days</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              {isCompleted && (
                <div className="text-center space-y-2">
                  <p className="text-green-400 font-semibold">🎉 Habit Completed! 🎉</p>
                  <Button onClick={onClaimReward} className="bg-green-500 hover:bg-green-600">
                    <Award className="h-4 w-4 mr-2" />
                    Claim Your Reward: {habit.reward}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Roadmap */}
        <Card className="bg-card/50 border-orange-primary/20">
          <CardHeader>
            <CardTitle>Your Journey</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative">
              {/* Roadmap Path */}
              <div className="absolute top-8 left-8 right-8 h-1 bg-gradient-to-r from-orange-primary via-orange-secondary to-orange-light rounded-full opacity-30"></div>
              
              {/* Progress Path */}
              <div 
                className="absolute top-8 left-8 h-1 bg-gradient-to-r from-orange-primary to-orange-secondary rounded-full transition-all duration-500"
                style={{ width: `${Math.max(0, (progressPercentage / 100) * (100 - 12))}%` }}
              ></div>

              {/* Roadmap Days */}
              <div className="grid grid-cols-7 gap-4 md:gap-6 lg:gap-8">
                {roadmapDays.map((day, index) => {
                  const isCompleted = day.completed;
                  const isNext = !isCompleted && index === habit.completedDays;
                  
                  return (
                    <RoadmapNode
                      key={day.day}
                      day={day}
                      isCompleted={isCompleted}
                      isNext={isNext}
                      onClick={() => onToggleDay(day.day)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-primary"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-orange-primary bg-card"></div>
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-600 bg-card/50"></div>
                  <span>Upcoming</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reward Preview */}
        <Card className="bg-gradient-to-r from-orange-primary/10 to-orange-secondary/10 border-orange-primary/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-primary/20 rounded-lg">
                <Award className="h-6 w-6 text-orange-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Your Reward</h3>
                <p className="text-muted-foreground">{habit.reward}</p>
                <p className="text-sm text-orange-primary mt-1">
                  {isCompleted ? "🎉 Ready to claim!" : `${habit.totalDays - habit.completedDays} days to go!`}
                </p>
              </div>
              {!isCompleted && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Potential Points</p>
                  <p className="text-xl font-bold text-orange-primary">
                    {(habit.totalDays - habit.completedDays) * habit.pointsPerDay}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}