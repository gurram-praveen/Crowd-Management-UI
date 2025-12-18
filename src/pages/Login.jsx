import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Don't clear error immediately - let user see it
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login({
                email: formData.email,
                password: formData.password
            });

            navigate('/dashboard');
        } catch (err) {
            setError(err || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-background"></div>

            <div className="login-content">
                <div className="login-text">
                    <h1>Welcome to the</h1>
                    <h1>Crowd Management System</h1>
                </div>

                <div className="login-card">
                    <div className="login-header">
                        <div className="logo">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <circle cx="16" cy="16" r="16" fill="#2D8B8A" />
                                <path d="M16 8L20 12L16 16L12 12L16 8Z" fill="white" />
                                <path d="M16 16L20 20L16 24L12 20L16 16Z" fill="white" opacity="0.7" />
                            </svg>
                            <span className="logo-text">kloudspot</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="input-group">
                            <label htmlFor="email" className="input-label">
                                Log In <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                className="input"
                                placeholder="Parking_solutions"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password" className="input-label">
                                Password <span className="required">*</span>
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className="input"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary login-button" disabled={loading}>
                            {loading ? (
                                <div className="spinner"></div>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
