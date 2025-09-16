import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { ArrowLeft, Target, Calendar, Award, Zap } from 'lucide-react';

interface HabitCreatorProps {
  onBack: () => void;
  onCreateHabit: (habit: {
    name: string;
    category: string;
    description: string;
    duration: number;
    frequency: string;
    difficulty: number;
    reward: string;
  }) => void;
}

const categories = [
  'Health & Fitness',
  'Learning & Education',
  'Productivity',
  'Mindfulness',
  'Social',
  'Creative',
  'Finance',
  'Other'
];

const difficultyLevels = [
  { level: 1, name: 'Easy', points: 10, color: 'bg-green-500' },
  { level: 2, name: 'Medium', points: 20, color: 'bg-yellow-500' },
  { level: 3, name: 'Hard', points: 30, color: 'bg-orange-500' },
  { level: 4, name: 'Expert', points: 40, color: 'bg-red-500' }
];

export function HabitCreator({ onBack, onCreateHabit }: HabitCreatorProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    duration: 30,
    frequency: 'daily',
    difficulty: 1,
    reward: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.category && formData.reward) {
      onCreateHabit(formData);
    }
  };

  const selectedDifficulty = difficultyLevels.find(d => d.level === formData.difficulty);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="border-orange-primary text-orange-primary hover:bg-orange-primary/10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-orange-primary">Create New Habit</h1>
            <p className="text-muted-foreground">Design your habit roadmap to success</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-card/50 border-orange-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Habit Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Morning Workout, Read 30 minutes"
                  className="bg-input border-orange-primary/20 focus:border-orange-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="bg-input border-orange-primary/20 focus:border-orange-primary">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your habit and what it means to you..."
                  className="bg-input border-orange-primary/20 focus:border-orange-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Duration & Frequency */}
          <Card className="bg-card/50 border-orange-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-primary" />
                Duration & Frequency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Days)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="365"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                  className="bg-input border-orange-primary/20 focus:border-orange-primary"
                />
                <p className="text-sm text-muted-foreground">How many days do you want to maintain this habit?</p>
              </div>

              <div className="space-y-3">
                <Label>Frequency</Label>
                <RadioGroup 
                  value={formData.frequency} 
                  onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alternate" id="alternate" />
                    <Label htmlFor="alternate">Every other day</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekdays" id="weekdays" />
                    <Label htmlFor="weekdays">Weekdays only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekends" id="weekends" />
                    <Label htmlFor="weekends">Weekends only</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Difficulty & Points */}
          <Card className="bg-card/50 border-orange-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-primary" />
                Difficulty Level
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {difficultyLevels.map((level) => (
                  <div
                    key={level.level}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.difficulty === level.level
                        ? 'border-orange-primary bg-orange-primary/10'
                        : 'border-gray-600 hover:border-orange-primary/50'
                    }`}
                    onClick={() => setFormData({ ...formData, difficulty: level.level })}
                  >
                    <div className={`w-4 h-4 rounded-full ${level.color} mb-2`}></div>
                    <p className="font-semibold">{level.name}</p>
                    <p className="text-sm text-muted-foreground">{level.points} pts/day</p>
                  </div>
                ))}
              </div>
              
              {selectedDifficulty && (
                <div className="p-3 bg-orange-primary/10 rounded-lg">
                  <p className="text-sm">
                    <strong>Selected:</strong> {selectedDifficulty.name} - 
                    You'll earn <strong>{selectedDifficulty.points} points</strong> for each completed day!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reward */}
          <Card className="bg-card/50 border-orange-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-primary" />
                Reward
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reward">What's your reward for completing this habit?</Label>
                <Input
                  id="reward"
                  value={formData.reward}
                  onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                  placeholder="e.g., New book, Movie night, Favorite meal"
                  className="bg-input border-orange-primary/20 focus:border-orange-primary"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  This reward will be unlocked when you complete your {formData.duration}-day journey!
                </p>
              </div>

              {selectedDifficulty && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-green-400">
                    <strong>Total Points:</strong> You'll earn up to {formData.duration * selectedDifficulty.points} points 
                    for completing this habit!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1 bg-orange-primary hover:bg-orange-secondary">
              Create Habit Roadmap
            </Button>
            <Button type="button" variant="outline" onClick={onBack} 
                    className="border-orange-primary text-orange-primary hover:bg-orange-primary/10">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}