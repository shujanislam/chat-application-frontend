// src/AppRouter.tsx
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Dashboard from './components/Dashboard';  // Import the dashboard page

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
};

export default AppRouter;


