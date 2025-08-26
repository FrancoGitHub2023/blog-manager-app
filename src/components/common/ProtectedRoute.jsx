// src/components/common/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectIsAdmin } from '../../store/slices/authSlice';

// Route protetta per utenti autenticati
export const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect al login con lo stato della pagina corrente
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

// Route protetta solo per amministratori
export const AdminRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isAdmin = useSelector(selectIsAdmin);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        return (
            <div className="container">
                <div className="access-denied">
                    <h1>🚫 Accesso Negato</h1>
                    <p>Solo gli amministratori possono accedere a questa sezione.</p>
                    <p>
                        <strong>Il tuo ruolo:</strong> Utente normale
                    </p>
                </div>
            </div>
        );
    }

    return children;
};

// Route pubblica - redirect se già autenticato (es. login page)
export const PublicRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const location = useLocation();

    if (isAuthenticated) {
        // Se l'utente è già loggato, redirect alla dashboard o alla pagina da cui veniva
        const from = location.state?.from?.pathname || '/dashboard';
        return <Navigate to={from} replace />;
    }

    return children;
};

// Export default per compatibilità
export default ProtectedRoute;