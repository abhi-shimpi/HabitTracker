import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { DaySelector } from '../ui/day-selector';
import { ArrowLeft, Target, Calendar, Award, Zap, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import endpoints from '../../utils/endpoints';
import { callGetApi, callPostApi } from '../../services/apiServices';
import { DateFilterType, SmartDatePicker } from '../ui/date-picker';
import { Habit } from '../../utils/interfaces';
import Constants from '../../utils/constants';
import { toast } from 'sonner';
import { clearLoader, setLoader } from '../../store/loaderSlice';
import { useDispatch } from 'react-redux';



export function HabitCreator() {
  const [categories, setCategories] = useState<any>([]);
  const [difficultyLevels, setDifficultyLevels] = useState<any>([]);
  const [frequencies, setFrequencies] = useState<any>([]);
  const [rewardCategories, setRewardCategory] = useState<any>([]);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const navigate = useNavigate();
  const [formData, setFormData] = useState<Habit>({
    name: '',
    category: '',
    description: '',
    duration: 1,
    frequency: '',
    customDays: [],
    startDate: null,
    difficulty: '',
    rewardName: '',
    rewardCategory: '',
    rewardLink: '',
    rewardCost: 1
  });
  const [errors, setErrors] = useState<any>({
    name: '',
    category: '',
    description: '',
    duration: '',
    frequency: '',
    customDays: '',
    startDate: '',
    difficulty: '',
    rewardName: '',
    rewardCategory: '',
    rewardLink: '',
    rewardCost: ''
  });

  const [touchedFields, setTouchedFields] = useState<any>({
    name: false,
    category: false,
    duration: false,
    frequency: false,
    customDays: false,
    startDate: false,
    rewardName: false,
    rewardCategory: false,
    rewardCost: false,
  });

  const handleFieldTouch = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  }

  useEffect(() => {
    geSetHabitMetadata();

    return () => {

    };
  }, []);

  useEffect(() => {
    if (startDate) {
      setFormData(prev => ({ ...prev, startDate: new Date(getLocalDateString(startDate as Date)) }));
    } else {
      setFormData(prev => ({ ...prev, startDate: null }));
    }
  }, [startDate]);

  const getLocalDateString = (startDate: Date) => {
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    const day = String(startDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // Helper function to handle day selection
  const handleDayToggle = (dayValue: number) => {
    setSelectedDays(prev => {
      const newSelectedDays = prev.includes(dayValue)
        ? prev.filter(day => day !== dayValue)
        : [...prev, dayValue];

      setFormData(prev => ({ ...prev, customDays: newSelectedDays }));
      handleFieldTouch('customDays');
      if (touchedFields.customDays) {
        if (formData.duration < newSelectedDays.length) {
          setErrors(prevErrors => ({ ...prevErrors, customDays: `Please select at most ${formData.duration} days for your custom frequency.` }));
        }
        else {
          setErrors(prevErrors => ({ ...prevErrors, customDays: '' }));
        }
      }
      return newSelectedDays;
    });
  };

  // Helper function to get selected day names
  const getSelectedDayNames = () => {
    const DAYS_OF_WEEK_NAMES = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    return selectedDays
      .sort((a, b) => a - b)
      .map(dayValue => DAYS_OF_WEEK_NAMES[dayValue])
      .filter(Boolean);
  };

  const createHabitPayload = (habitData: Habit) => {
    const newHabit: any = {
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

    if (habitData.frequency === 'custom') {
      newHabit.customDays = habitData.customDays;
    }
    return newHabit;
  }

  const geSetHabitMetadata = async () => {
    dispatch(setLoader({
      loading: true,
      message: 'Loading habit metadata...'
    }));
    try {
      const metaData = await callGetApi(endpoints.GET_HABIT_METADATA, {});
      dispatch(clearLoader());
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
    }
    catch (error) {
      dispatch(clearLoader());
      console.error(error);
      toast.error('Failed to load habit metadata. Please refresh the page.');
    }

  }

  const checkFormFieldValidity = (field: any, value: any) => {
    if (!value || value.length === 0) {
      setErrors(prevErrors => ({ ...prevErrors, [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is required field` }));
      return false;
    } else {
      setErrors(prevErrors => ({ ...prevErrors, [field]: '' }));
      return true;
    }
  }

  const isFormDataValid = (): boolean => {
    let isValid = true;

    Object.keys(formData).forEach(field => {
      if (field !== 'rewardLink' && field !== 'description' && field !== 'customDays' && !checkFormFieldValidity(field, formData[field])) {
        isValid = false;
      } else if (field === 'customDays' && formData.frequency === 'custom') {
        if (formData.duration < selectedDays.length) {
          setErrors(prevErrors => ({ ...prevErrors, customDays: `Please select at most ${formData.duration} days for your custom frequency.` }));
          isValid = false;
        }
        else {
          setErrors(prevErrors => ({ ...prevErrors, customDays: '' }));
        }
      }
    });
    return isValid;
  }

  const createHabit = async () => {
    const payload = createHabitPayload(formData);

    const url = `${endpoints.CREATE_HABIT}`;
    dispatch(setLoader({
      loading: true,
      message: 'Creating habit...'
    }));
    try {
      const response = await callPostApi(url, payload);
      toast.success("Successfully created habit!");
      navigate('/dashboard');
      dispatch(clearLoader());
    } catch (error) {
      console.error(error);
      dispatch(clearLoader());
      toast.error('Failed to create habit. Please try again.');
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormDataValid()) {
      createHabit();
    }
  }

  const onBack = () => {
    navigate(-1); // Navigate back to the previous page
  }

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

        <form className="space-y-6">
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
                <Label htmlFor="name">Habit Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    handleFieldTouch('name');
                    if (touchedFields.name) {
                      checkFormFieldValidity('name', e.target.value);
                    }
                  }}
                  placeholder="e.g., Morning Workout, Read 30 minutes"
                  className="bg-input border-orange-primary/20 focus:border-orange-primary"
                  required
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => {
                  setFormData({ ...formData, category: value });
                  handleFieldTouch('category');
                  if (touchedFields.category) {
                    checkFormFieldValidity('category', value);
                  }
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
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    handleFieldTouch('description');
                    if (touchedFields.description) {
                      checkFormFieldValidity('description', e.target.value);
                    }
                  }}
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
                <Label htmlFor="duration">Duration (Days) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="365"
                  value={formData.duration}
                  onChange={(e) => {
                    setFormData({ ...formData, duration: parseInt(e.target.value) });
                    handleFieldTouch('duration');
                    if (touchedFields.duration) {
                      checkFormFieldValidity('duration', parseInt(e.target.value));
                    }
                  }}
                  className="bg-input border-orange-primary/20 focus:border-orange-primary"
                />
                <p className="text-sm text-muted-foreground">How many days do you want to maintain this habit?</p>
                {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
              </div>

              <div className="space-y-3">
                <Label>Frequency</Label>
                <RadioGroup
                  value={formData.frequency}
                  onValueChange={(value) => {
                    setFormData({ ...formData, frequency: value });
                    handleFieldTouch('frequency');
                    if (touchedFields.frequency) {
                      checkFormFieldValidity('frequency', value);
                    }
                    // Clear selected days when switching away from custom
                    if (value !== 'custom') {
                      setSelectedDays([]);
                      setFormData(prev => ({ ...prev, customDays: [] }));
                      setErrors(prevErrors => ({ ...prevErrors, customDays: '' }));
                    }
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
                {errors.frequency && <p className="text-red-500 text-sm">{errors.frequency}</p>}
                {/* Custom Day Selector */}
                {formData.frequency === 'custom' && (
                  <div className="space-y-3 mt-4 p-4 border border-orange-primary/20 rounded-lg bg-orange-primary/5">
                    <Label>Select Days of the Week</Label>
                    <DaySelector
                      selectedDays={selectedDays}
                      onDayToggle={
                        (dayValue: number) => {
                          handleDayToggle(dayValue);
                        }}
                    />

                    {/* Dynamic note showing selected days */}
                    {selectedDays.length > 0 && (
                      <div className="p-3 bg-orange-primary/10 border border-orange-primary/20 rounded-lg">
                        <p className="text-sm text-orange-primary">
                          <strong>Habit will repeat every {getSelectedDayNames().join(', ')} of a week.</strong>
                        </p>
                      </div>
                    )}

                    {selectedDays.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Please select at least one day for your custom frequency.
                      </p>
                    )}
                  </div>
                )}
                {errors.customDays && <p className="text-red-500 text-sm">{errors.customDays}</p>}
              </div>

              <div className="space-y-2">
                <SmartDatePicker
                  value={startDate as Date}
                  onChange={(date) => {
                    setStartDate(date ?? null);
                    handleFieldTouch('startDate');
                    if (touchedFields.startDate) {
                      checkFormFieldValidity('startDate', date ?? null);
                    }
                  }}
                  type={formData.frequency === 'custom' ? 'daily' : formData.frequency as DateFilterType}
                  label="Start Date *"
                  placeholder="Pick a start date"
                />
              </div>
              {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
            </CardContent>
          </Card>

          {/* Difficulty & Points */}
          <Card className="bg-card/50 border-orange-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-primary" />
                Difficulty Level *
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
                    onClick={() => {
                      setFormData({ ...formData, difficulty: level?.value });
                      handleFieldTouch('difficulty');
                      if (touchedFields.difficulty) {
                        checkFormFieldValidity('difficulty', level?.value);
                      }
                    }}
                  >
                    <div className={`w-4 h-4 rounded-full ${level?.color} mb-2`}></div>
                    <p className="font-semibold">{level?.text}</p>
                    <p className="text-sm text-muted-foreground">{level?.points} pts/day</p>
                  </div>
                ))}
                {errors.difficulty && <p className="text-red-500 text-sm">{errors.difficulty}</p>}
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
                Reward *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reward">What's your reward for completing this habit?</Label>
                <Input
                  id="reward"
                  value={formData.rewardName}
                  onChange={(e) => {
                    setFormData({ ...formData, rewardName: e.target.value });
                    handleFieldTouch('rewardName');
                    if (touchedFields.rewardName) {
                      checkFormFieldValidity('rewardName', e.target.value);
                    }
                  }}
                  placeholder="e.g., New book, Movie night, Favorite meal"
                  className="bg-input border-orange-primary/20 focus:border-orange-primary"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  This reward will be unlocked when you complete your {formData.duration}-day journey!
                </p>
                {errors.rewardName && <p className="text-red-500 text-sm">{errors.rewardName}</p>}
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
                <Label htmlFor="category">Reward category *</Label>
                <Select value={formData.rewardCategory} onValueChange={(value) => {
                  setFormData({ ...formData, rewardCategory: value });
                  handleFieldTouch('rewardCategory');
                  if (touchedFields.rewardCategory) {
                    checkFormFieldValidity('rewardCategory', value);
                  }
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
                {errors.rewardCategory && <p className="text-red-500 text-sm">{errors.rewardCategory}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward-cost">Reward cost price *</Label>
                <Input
                  required
                  id="reward-cost"
                  type="number"
                  min="1"
                  value={formData.rewardCost}
                  onChange={(e) => {
                    setFormData({ ...formData, rewardCost: parseInt(e.target.value) });
                    handleFieldTouch('rewardCost');
                    if (touchedFields.rewardCost) {
                      checkFormFieldValidity('rewardCost', parseInt(e.target.value));
                    }
                  }}
                  placeholder="e.g., 200 (in Rs)"
                  className="bg-input border-orange-primary/20 focus:border-orange-primary"
                />
                {errors.rewardCost && <p className="text-red-500 text-sm">{errors.rewardCost}</p>}
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
            <Button type="submit" className="flex-1 bg-orange-primary hover:bg-orange-secondary" onClick={handleSubmit}>
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