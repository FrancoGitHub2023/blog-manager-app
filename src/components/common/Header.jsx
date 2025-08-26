import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectUser, logoutUser } from '../../store/slices/authSlice';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    // Funzione per evidenziare il link attivo
    const isActiveLink = (path) => {
        return location.pathname === path ? 'nav-link active' : 'nav-link';
    };

    return (
        <header className="header">
            <div className="container">
                {/* Logo e titolo */}
                <Link to="/" className="logo">
                    <h1>📝 Blog Manager</h1>
                </Link>

                {/* Navigazione principale */}
                <nav className="nav">
                    <Link to="/" className={isActiveLink('/')}>
                        🏠 Home
                    </Link>

                    <Link to="/posts" className={isActiveLink('/posts')}>
                        📄 Posts
                    </Link>

                    {/* Links per utenti autenticati */}
                    {isAuthenticated && (
                        <Link to="/dashboard" className={isActiveLink('/dashboard')}>
                            🎛️ Dashboard
                        </Link>
                    )}

                    {/* Links solo per admin */}
                    {isAuthenticated && user?.role === 'admin' && (
                        <Link to="/admin" className={isActiveLink('/admin')}>
                            ⚙️ Admin
                        </Link>
                    )}
                </nav>

                {/* Area utente */}
                <div className="user-area">
                    {isAuthenticated ? (
                        <div className="user-menu">
              <span className="welcome">
                👋 Ciao, <strong>{user.name}</strong>
                  {user.role === 'admin' && <span className="admin-badge">Admin</span>}
              </span>
                            <button onClick={handleLogout} className="btn btn-outline">
                                🚪 Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            🔐 Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};


export default Header;
