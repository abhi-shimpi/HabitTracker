import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/login/LoginComponent';
import { Dashboard } from './components/dashboard/Dashboard';
import { HabitCreator } from './components/create-habit/HabitCreator';
import { RewardManager } from './components/reward-manager/RewardManager';
import { HabitJourney } from './components/habit-journey/HabitRoadmap';
import { SignUp } from './components/sign-up/SignUp';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={
				<SignUp />
			} />

            <Route path="/login" element={
				<LoginComponent />
			} />
			
			<Route path="/sign-up" element={
				<SignUp />
			} />

            <Route path="/dashboard" element={
				<Dashboard />
			} />

            <Route path="/create-habit" element={
				<HabitCreator />
			} />

            <Route path="/habit-journey" element={
				< HabitJourney />
			} />

            <Route path="/rewards" element={
				<RewardManager />
			} />
        </Routes>
    )
}

export default AppRouter;