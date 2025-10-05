import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Eye, EyeOff, Target, Trophy, Flame, Mail, User, Lock } from 'lucide-react';
import Constants from '../../utils/constants';
import { callSignupApi } from '../../services/apiServices';
import endpoints from '../../utils/endpoints';
import { useNavigate } from 'react-router-dom';

interface SignUpProps {
    onSignUp: (userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }) => void;
    onBackToLogin?: () => void;
}

export function SignUp() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!Constants.EMAIL_REGEX.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        // if (formData.password !== formData.confirmPassword) {
        //     newErrors.confirmPassword = 'Passwords do not match';
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSignUp = async (payload) => {
        try {
            // Call your sign-up API here
            const response = await callSignupApi(`${endpoints.SIGNUP}`, payload);
            console.log('Sign up successful:', response);
            // Handle successful sign-up (e.g., redirect to login or dashboard)
            navigate('/login');
        } catch (error) {
            console.error('Sign up failed:', error);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSignUp({
                firstName: formData.firstName,
                lastName: formData.lastName,
                emailId: formData.email,
                password: formData.password
            });
        }
    };

    const onBackToLogin = () => {
        navigate('/login')
    }
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
                        <h2 className="text-2xl font-semibold">Start Your Journey</h2>
                        <p className="text-muted-foreground">Join thousands building better habits every day</p>
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

                {/* Sign Up Form */}
                <Card className="bg-card/50 border-orange-primary/20">
                    <CardHeader>
                        <CardTitle className="text-center">Create Your Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-orange-primary" />
                                        First Name
                                    </Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        placeholder="John"
                                        className={`bg-input border-orange-primary/20 focus:border-orange-primary ${errors.firstName ? 'border-red-500' : ''
                                            }`}
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-400 text-sm">{errors.firstName}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        placeholder="Doe"
                                        className={`bg-input border-orange-primary/20 focus:border-orange-primary ${errors.lastName ? 'border-red-500' : ''
                                            }`}
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-400 text-sm">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-orange-primary" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
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
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="Create a strong password"
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

                            {/* Confirm Password Field */}
                            {/* <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        placeholder="Confirm your password"
                                        className={`bg-input border-orange-primary/20 focus:border-orange-primary pr-10 ${errors.confirmPassword ? 'border-red-500' : ''
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
                                )}
                            </div> */}

                            {/* Password Strength Indicator */}
                            <div className="space-y-2">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded-full ${formData.password.length >= level * 2
                                                ? level <= 2
                                                    ? 'bg-red-500'
                                                    : level === 3
                                                        ? 'bg-yellow-500'
                                                        : 'bg-green-500'
                                                : 'bg-muted'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Password strength: {
                                        formData.password.length < 4 ? 'Weak' :
                                            formData.password.length < 6 ? 'Fair' :
                                                formData.password.length < 8 ? 'Good' : 'Strong'
                                    }
                                </p>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-orange-primary hover:bg-orange-secondary"
                            >
                                <Trophy className="h-4 w-4 mr-2" />
                                Start Your Quest
                            </Button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <button
                                    onClick={onBackToLogin}
                                    className="cursor-pointer text-orange-primary hover:text-orange-secondary transition-colors"
                                >
                                    Sign in here
                                </button>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Benefits */}
                <Card className="bg-gradient-to-r from-orange-primary/10 to-orange-secondary/10 border-orange-primary/30">
                    <CardContent className="p-4">
                        <div className="text-center space-y-2">
                            <h3 className="font-semibold">Why Join HabitQuest?</h3>
                            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                                <span>📈 Track Progress</span>
                                <span>🎯 Build Streaks</span>
                                <span>🏆 Earn Rewards</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}