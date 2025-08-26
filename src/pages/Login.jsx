// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError, selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../store/slices/authSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux state
    const isLoading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    // Redirect se già autenticato
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // Clear errors quando il componente si monta
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Gestione input form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error quando l'utente inizia a digitare
        if (error) {
            dispatch(clearError());
        }
    };

    // Submit del form
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            return;
        }

        dispatch(loginUser(formData));
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="card-content">
                    {/* Header */}
                    <div className="login-header">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                        <h1>Accesso</h1>
                        <p>Accedi al tuo account Blog Manager</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        {/* Email Field */}
                        <div className="form-group">
                            <label htmlFor="email">
                                <span className="label-icon">📧</span>
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Inserisci la tua email"
                                className="form-control"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <label htmlFor="password">
                                <span className="label-icon">🔒</span>
                                Password:
                            </label>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Inserisci la tua password"
                                    className="form-control"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="password-toggle-btn"
                                    aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="error-message">
                                <span className="error-icon">❌</span>
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading || !formData.email || !formData.password}
                            style={{ width: '100%', marginTop: '1rem' }}
                        >
                            {isLoading ? (
                                <>
                                    <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>
                                    Accesso in corso...
                                </>
                            ) : (
                                <>
                                    🔐 Accedi
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="login-footer">
                        <Link to="/" className="back-link">
                            ← Torna alla Home
                        </Link>
                        <p className="demo-note">
                            💡 Questa è una demo. Usa le credenziali di test appropriate.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;