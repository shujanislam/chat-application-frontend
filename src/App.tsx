import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:8000/auth/user', {
                    credentials: 'include', // Include session cookies
                });

                if (response.ok) {
                    navigate('/dashboard');  // Redirect to dashboard if authenticated
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/auth/google';
    };

    return (
        <div className="App">
            <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={handleGoogleLogin}
            >
                Sign Up with Google
            </button>
        </div>
    );
}

export default App;


