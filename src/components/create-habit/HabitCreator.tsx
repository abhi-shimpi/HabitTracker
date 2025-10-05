import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Badge } from '../ui/badge';
import { ArrowLeft, Target, Calendar, Award, Zap, } from 'lucide-react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
// import { categories, difficultyLevels, frequencies } from '../../utils/dummyData';
import endpoints from '../../utils/endpoints';
import { callGetApi, callPostApi } from '../../services/apiServices';
import { ApiLoader } from '../ui/loader';
import { SmartDatePicker } from '../ui/date-picker';
import { Habit } from '../../utils/interfaces';
import Constants from '../../utils/constants';
import { toast } from 'sonner';



export function HabitCreator() {
  const [categories, setCategories] = useState();
  const [difficultyLevels, setDifficultyLevels] = useState();
  const [frequencies, setFrequencies] = useState();
  const [selectedDifficulty, setDifficulty] = useState(null);
  const [rewardCategories, setRewardCategory] = useState(null);
  const [isDataLoaded, setIsDataLoad] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    duration: 30,
    frequency: 'daily',
    startDate: null,
    difficulty: 'easy',
    reward: '',
    rewardCategory: '',
    rewardLink: '',
    rewardCost: 1
  });

  useEffect(() => {
    geSetHabitMetadata();

    return () => {

    };
  }, []);

  useEffect(() => {
    if (startDate) {
      setFormData(prev => ({ ...prev, startDate: startDate }));
    }
  }, [startDate]);

  const createHabitPayload = (habitData: Habit) => {
    const newHabit = {
      habitName: habitData.name,
      category: habitData.category,
      habitDescription: habitData.description,
      difficulty: habitData.difficulty,
      startDate: habitData.startDate,
      totalDays: habitData.duration,
      frequency: habitData.frequency,
      rewardName: habitData.rewardName,
      rewardCategory: habitData.rewardCategory,
      rewardLink: habitData.rewardLink,
      costPrice: habitData.rewardCost,
      dailyPoints: Constants.difficultyToPointsMap[habitData.difficulty],
      finalPointsToEarn: habitData.duration ?? Constants.difficultyToPointsMap[habitData.difficulty] * habitData.duration
    };
    return newHabit;
  }

  const geSetHabitMetadata = async () => {
    setIsDataLoad(true);
    try {
      const metaData = await callGetApi(endpoints.GET_HABIT_METADATA, {});
      setIsDataLoad(false);
      console.log(metaData.data);
      setCategories(metaData?.data?.habitCategory);
      setDifficultyLevels(metaData?.data?.difficulty);
      setFrequencies(metaData?.data?.frequency);
      setRewardCategory(metaData?.data?.rewardCategory);

      // Set default values if needed 
      if (metaData?.data?.habitCategory?.length > 0) {
        setFormData(prev => ({ ...prev, category: metaData?.data?.habitCategory[0].value }));
      }
      if (metaData?.data?.difficulty?.length > 0) {
        setFormData(prev => ({ ...prev, difficulty: metaData?.data?.difficulty[0].value }));
      }
      if (metaData?.data?.frequency?.length > 0) {
        setFormData(prev => ({ ...prev, frequency: metaData?.data?.frequency[0].value }));
      }
      if (metaData?.data?.rewardCategory?.length > 0) {
        setFormData(prev => ({ ...prev, rewardCategory: metaData?.data?.rewardCategory[0].value }));
      }
      console.log(JSON.parse(JSON.stringify(formData)));
    }
    catch (error) {
      setIsDataLoad(false);
      console.error(error)
    }

  }

  const isFormDataValid = (): boolean => {
    if (!formData.name || formData.name.trim() === '') return false;
    if (!formData.category || formData.category.trim() === '') return false;
    if (!formData.duration || formData.duration <= 0) return false;
    if (!formData.frequency || formData.frequency.trim() === '') return false;
    if (!formData.startDate || formData.startDate === '') return false;
    if (!formData.difficulty || formData.difficulty.trim() === '') return false;
    if (!formData.rewardName || formData.rewardName.trim() === '') return false;
    if (!formData.rewardCost || formData.rewardCost <= 0) return false;
    return true;
  }

  const createHabit = async () => {
    const payload = createHabitPayload(formData);

    const url = `${endpoints.CREATE_HABIT}`;
    setIsDataLoad(true);
    try {
      const response = await callPostApi(url, payload);
      toast.success("Successfully created habit!");
      navigate('/dashboard');
      console.log(response);
      setIsDataLoad(false);
    } catch (error) {
      console.error(error);
      setIsDataLoad(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormDataValid()) {
      createHabit();
    }
  };

  const onBack = () => {
    navigate(-1); // Navigate back to the previous page
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {
        isDataLoaded ? (
          <ApiLoader message="Loading habit creator..." fullScreen={true} showLoader={true} />
        ) :
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
                  <Select value={formData.category} onValueChange={(value) => {
                    console.log(value);
                    setFormData({ ...formData, category: value })
                  }}>
                    <SelectTrigger className="bg-input border-orange-primary/20 focus:border-orange-primary">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category, index: number) => (
                        <SelectItem key={index} value={category?.value}>
                          {category?.text}
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
                    onValueChange={(value) => {
                      console.log(value);
                      setFormData({ ...formData, frequency: value })
                    }}
                  >
                    {
                      frequencies?.map((frequency: any, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={frequency?.value} id={frequency?.value} />
                          <Label htmlFor={frequency?.value}>{frequency?.text}</Label>
                        </div>
                      ))
                    }
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <SmartDatePicker
                    value={startDate}
                    onChange={setStartDate}
                    type={formData.frequency} // or "weekend" or "all"
                    label="Select a date"
                    placeholder="Pick a date"
                  />
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
                  {difficultyLevels?.map((level, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.difficulty === level?.value
                        ? 'border-orange-primary bg-orange-primary/10'
                        : 'border-gray-600 hover:border-orange-primary/50'
                        }`}
                      onClick={() => setFormData({ ...formData, difficulty: level?.value })}
                    >
                      <div className={`w-4 h-4 rounded-full ${level?.color} mb-2`}></div>
                      <p className="font-semibold">{level?.text}</p>
                      <p className="text-sm text-muted-foreground">{level?.points} pts/day</p>
                    </div>
                  ))}
                </div>

                {
                  difficultyLevels?.length && (
                    <div className="p-3 bg-orange-primary/10 rounded-lg">
                      <p className="text-sm">
                        You'll earn <strong>{Constants.difficultyToPointsMap[formData.difficulty]} points</strong> for each completed day!
                      </p>
                    </div>
                  )
                }
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
                    value={formData.rewardName}
                    onChange={(e) => setFormData({ ...formData, rewardName: e.target.value })}
                    placeholder="e.g., New book, Movie night, Favorite meal"
                    className="bg-input border-orange-primary/20 focus:border-orange-primary"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    This reward will be unlocked when you complete your {formData.duration}-day journey!
                  </p>
                </div>

                {
                  difficultyLevels?.length && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-sm text-green-400">
                        <strong>Total Points:</strong> You'll earn up to {formData.duration * Constants.difficultyToPointsMap[formData.difficulty]} points
                        for completing this habit!
                      </p>
                    </div>
                  )
                }

                <div className="space-y-2">
                  <Label htmlFor="category">Reward category</Label>
                  <Select value={formData.rewardCategory} onValueChange={(value) => {
                    console.log(value);
                    setFormData({ ...formData, rewardCategory: value })
                  }}>
                    <SelectTrigger className="bg-input border-orange-primary/20 focus:border-orange-primary">
                      <SelectValue placeholder="Select a Reward category" />
                    </SelectTrigger>
                    <SelectContent>
                      {rewardCategories?.map((rewardCategory, index: number) => (
                        <SelectItem key={index} value={rewardCategory?.value}>
                          {rewardCategory?.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reward-cost">Reward cost price</Label>
                  <Input
                    required
                    id="reward-cost"
                    type="number"
                    min="1"
                    value={formData.rewardCost}
                    onChange={(e) => setFormData({ ...formData, rewardCost: parseInt(e.target.value) || 1 })}
                    placeholder="e.g., 200 (in Rs)"
                    className="bg-input border-orange-primary/20 focus:border-orange-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reward-link">Provide a reward link(Optional)</Label>
                  <Input
                    id="reward-link"
                    type="url"
                    value={formData.rewardLink}
                    onChange={(e) => setFormData({ ...formData, rewardLink: e.target.value })}
                    placeholder="e.g., Amazon link, Restaurant website"
                    className="bg-input border-orange-primary/20 focus:border-orange-primary"
                  />
                </div>

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
      }
    </div>
  );
}