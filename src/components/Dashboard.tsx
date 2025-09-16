import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Trophy, Target, Calendar, Award, Plus, Flame } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  category: string;
  difficulty: number;
  points: number;
  totalDays: number;
  completedDays: number;
  streak: number;
  isActive: boolean;
  reward: string;
}

interface DashboardProps {
  habits: Habit[];
  totalPoints: number;
  onCreateHabit: () => void;
  onViewRoadmap: (habitId: string) => void;
  onViewRewards: () => void;
}

export function Dashboard({ habits, totalPoints, onCreateHabit, onViewRoadmap, onViewRewards }: DashboardProps) {
  const activeHabits = habits.filter(h => h.isActive);
  const completedHabits = habits.filter(h => h.completedDays >= h.totalDays);

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orange-primary">HabitQuest</h1>
          <p className="text-muted-foreground">Level up your life, one habit at a time</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-card p-3 rounded-lg border border-orange-primary/20">
            <Trophy className="h-5 w-5 text-orange-primary" />
            <span className="font-semibold">{totalPoints} Points</span>
          </div>
        </div>
      </div>

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
                <p className="text-2xl font-bold">{activeHabits.length}</p>
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
                <p className="text-2xl font-bold">{completedHabits.length}</p>
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
                <p className="text-2xl font-bold">{Math.max(...habits.map(h => h.streak), 0)}</p>
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
                <p className="text-2xl font-bold">{totalPoints}</p>
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
        <Button variant="outline" onClick={onViewRewards} className="border-orange-primary text-orange-primary hover:bg-orange-primary/10">
          <Award className="h-4 w-4 mr-2" />
          View Rewards
        </Button>
      </div>

      {/* Active Habits */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Habits</h2>
        {activeHabits.length === 0 ? (
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
            {activeHabits.map((habit) => (
              <Card key={habit.id} className="bg-card/50 border-orange-primary/20 hover:border-orange-primary/40 transition-colors cursor-pointer" 
                    onClick={() => onViewRoadmap(habit.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{habit.name}</CardTitle>
                    <Badge variant="secondary" className="bg-orange-primary/20 text-orange-primary">
                      {habit.category}
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
                      <span className="text-sm">{habit.streak} day streak</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-orange-primary" />
                      <span className="text-sm">{habit.points} pts</span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <strong>Reward:</strong> {habit.reward}
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