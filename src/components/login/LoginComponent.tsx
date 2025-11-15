import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff, Trophy, Target, Flame, Mail, Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { callPostApi, callSignupApi } from '../../services/apiServices';
import endpoints from '../../utils/endpoints';
import { toast } from 'sonner';
import { setDataToLocalStorage } from '../../services/localStorageService';
import { setAuthState } from '../../store/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/appStore';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [localLoader, setLocalLoader] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onLogin = async (email: string, password: string) => {
        const payload = { emailId: email, password: password };
        setLocalLoader(true);
        try {
            // Call your login API here
            const response = await callPostApi(`${endpoints.LOGIN}`, payload);
            setLocalLoader(false);

            // Set user data in Redux store
            setUserData(response?.data);

            toast.success(`Welcome back, ${response?.data?.firstName}! 🎉`, {
                description: "Ready to continue your habit journey?"
            });

            // Navigate to dashboard - the ProtectedRoute will handle auth verification
            navigate('/dashboard');
        } catch (error) {
            setLocalLoader(false);
            console.error('Sign In failed:', error);
            toast.error('Login failed. Please check your credentials and try again.');
        }
    };

    const setUserData = (data: any) => {
        if (data) {
            const userData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.emailId,
                joinedDate: data.createdAt
            }
            setDataToLocalStorage('userData', userData);
            // Also set user data in Redux store
            dispatch(setAuthState({ isAuthenticated: true, userData: userData }));
        }
    }

    const onGoToSignUp = () => {
        navigate('/sign-up');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onLogin(formData.email, formData.password);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                        <Trophy className="h-8 w-8 text-orange-primary" />
                        <h1 className="text-3xl font-bold text-orange-primary">HabitQuest</h1>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold">Welcome Back!</h2>
                        <p className="text-muted-foreground">Continue your journey to better habits</p>
                    </div>
                </div>

                {/* Motivation Cards */}
                <div className="grid grid-cols-3 gap-2">
                    <Card className="bg-card/50 border-orange-primary/20 p-3">
                        <div className="text-center">
                            <Target className="h-5 w-5 text-orange-primary mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">Track Goals</p>
                        </div>
                    </Card>
                    <Card className="bg-card/50 border-orange-primary/20 p-3">
                        <div className="text-center">
                            <Flame className="h-5 w-5 text-red-500 mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">Build Streaks</p>
                        </div>
                    </Card>
                    <Card className="bg-card/50 border-orange-primary/20 p-3">
                        <div className="text-center">
                            <Trophy className="h-5 w-5 text-orange-primary mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">Earn Rewards</p>
                        </div>
                    </Card>
                </div>

                {/* Login Form */}
                <Card className="bg-card/50 border-orange-primary/20">
                    <CardHeader>
                        <CardTitle className="text-center">Sign In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-orange-primary" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    disabled={localLoader}
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="john.doe@example.com"
                                    className={`bg-input border-orange-primary/20 focus:border-orange-primary ${errors.email ? 'border-red-500' : ''
                                        }`}
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-sm">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-orange-primary" />
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        disabled={localLoader}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="Enter your password"
                                        className={`bg-input border-orange-primary/20 focus:border-orange-primary pr-10 ${errors.password ? 'border-red-500' : ''
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-400 text-sm">{errors.password}</p>
                                )}
                            </div>

                            {/* Forgot Password Link */}
                            {/* <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-sm text-orange-primary hover:text-orange-secondary transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div> */}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={localLoader}
                                className="w-full bg-orange-primary hover:bg-orange-secondary"
                            >

                                {localLoader ? 'Authenticating...' : <>
                                    <LogIn className="h-4 w-4 mr-2" />
                                    Continue Your Quest
                                </>}
                            </Button>
                        </form>

                        {/* Sign Up Link */}
                        {onGoToSignUp && (
                            <div className="mt-4 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Don't have an account?{' '}
                                    <button
                                        onClick={onGoToSignUp}
                                        className="cursor-pointer text-orange-primary hover:text-orange-secondary transition-colors"
                                    >
                                        Sign up here
                                    </button>
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Welcome Back Message */}
                <Card className="bg-gradient-to-r from-orange-primary/10 to-orange-secondary/10 border-orange-primary/30">
                    <CardContent className="p-4">
                        <div className="text-center space-y-2">
                            <h3 className="font-semibold">Your Habits Are Waiting! 🚀</h3>
                            <p className="text-sm text-muted-foreground">
                                Pick up where you left off and keep building those streaks
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
