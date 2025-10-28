import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/login/LoginComponent';
import { Dashboard } from './components/dashboard/Dashboard';
import { HabitCreator } from './components/create-habit/HabitCreator';
import { RewardManager } from './components/reward-manager/RewardManager';
import { HabitJourney } from './components/habit-journey/HabitRoadmap';
import { SignUp } from './components/sign-up/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import { PublicRoute } from './PublicRoute';

const AppRouter = () => {
	return (
		<Routes>
			{/* Public Routes */}
			<Route path="/" element={<PublicRoute><LoginComponent /></PublicRoute>} />
			<Route path="/login" element={<PublicRoute><LoginComponent /></PublicRoute>} />
			<Route path="/sign-up" element={<PublicRoute><SignUp /></PublicRoute>} />

			{/* Protected Routes */}
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
						<Dashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/create-habit"
				element={
					<ProtectedRoute>
						<HabitCreator />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/habit-journey/:habitId"
				element={
					<ProtectedRoute>
						<HabitJourney />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/rewards"
				element={
					<ProtectedRoute>
						<RewardManager />
					</ProtectedRoute>
				}
			/>
		</Routes>
	)
}

export default AppRouter;