import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    selectPosts,
    selectPostsLoading,
    selectPostsError
} from '../store/slices/postsSlice';
import { selectUser, selectIsAdmin } from '../store/slices/authSlice';

const AdminPanel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state
    const user = useSelector(selectUser);
    const isAdmin = useSelector(selectIsAdmin);
    const posts = useSelector(selectPosts);
    const isLoading = useSelector(selectPostsLoading);
    const error = useSelector(selectPostsError);

    // Local state
    const [activeTab, setActiveTab] = useState('posts');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        userId: 1
    });

    // Redirect se non admin
    useEffect(() => {
        if (!isAdmin) {
            navigate('/dashboard');
        }
    }, [isAdmin, navigate]);

    // Carica posts all'avvio
    useEffect(() => {
        if (posts.length === 0) {
            dispatch(fetchPosts({ page: 1, limit: 100 })); // Carica tutti i posts per admin
        }
    }, [dispatch, posts.length]);

    // Reset form
    const resetForm = () => {
        setFormData({
            title: '',
            body: '',
            userId: 1
        });
        setShowCreateForm(false);
        setEditingPost(null);
    };

    // Handle form input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Create post
    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.body) return;

        try {
            await dispatch(createPost({
                ...formData,
                id: Date.now() // ID temporaneo per la demo
            })).unwrap();
            resetForm();
        } catch (error) {
            console.error('Errore nella creazione:', error);
        }
    };

    // Edit post
    const handleEditPost = (post) => {
        setFormData({
            title: post.title,
            body: post.body,
            userId: post.userId
        });
        setEditingPost(post);
        setShowCreateForm(true);
    };

    // Update post
    const handleUpdatePost = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.body || !editingPost) return;

        try {
            await dispatch(updatePost({
                id: editingPost.id,
                ...formData
            })).unwrap();
            resetForm();
        } catch (error) {
            console.error('Errore nell\'aggiornamento:', error);
        }
    };

    // Delete post
    const handleDeletePost = async (postId) => {
        if (window.confirm('Sei sicuro di voler eliminare questo post?')) {
            try {
                await dispatch(deletePost(postId)).unwrap();
            } catch (error) {
                console.error('Errore nell\'eliminazione:', error);
            }
        }
    };

    // Filter posts
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.body.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats
    const stats = {
        totalPosts: posts.length,
        myPosts: posts.filter(p => p.userId === user?.id).length,
        recentPosts: posts.filter(p => p.id > 90).length
    };

    if (!isAdmin) {
        return (
            <div className="container">
                <div className="access-denied">
                    <h1>🚫 Accesso Negato</h1>
                    <p>Solo gli amministratori possono accedere a questa sezione.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Header */}
            <div className="admin-header">
                <div className="admin-title">
                    <h1>⚙️ Admin Panel</h1>
                    <p>Gestione completa del Blog Manager</p>
                </div>
                <div className="admin-user">
                    <span className="admin-badge">👑 ADMIN</span>
                    <span className="admin-name">{user?.name}</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📄</div>
                    <div className="stat-content">
                        <h3>{stats.totalPosts}</h3>
                        <p>Posts Totali</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👤</div>
                    <div className="stat-content">
                        <h3>{stats.myPosts}</h3>
                        <p>I Miei Posts</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🆕</div>
                    <div className="stat-content">
                        <h3>{stats.recentPosts}</h3>
                        <p>Posts Recenti</p>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    📄 Gestione Posts
                </button>
                <button
                    className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    👥 Utenti
                </button>
                <button
                    className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    ⚙️ Impostazioni
                </button>
            </div>

            {/* Posts Management Tab */}
            {activeTab === 'posts' && (
                <div className="admin-content">
                    <div className="admin-toolbar">
                        <div className="toolbar-left">
                            <input
                                type="text"
                                placeholder="🔍 Cerca posts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="admin-search"
                            />
                        </div>
                        <div className="toolbar-right">
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="btn btn-primary"
                            >
                                ➕ Nuovo Post
                            </button>
                        </div>
                    </div>

                    {/* Create/Edit Form */}
                    {showCreateForm && (
                        <div className="admin-form-container">
                            <div className="admin-form-card">
                                <div className="form-header">
                                    <h3>
                                        {editingPost ? '✏️ Modifica Post' : '➕ Nuovo Post'}
                                    </h3>
                                    <button
                                        onClick={resetForm}
                                        className="close-btn"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost}>
                                    <div className="form-group">
                                        <label htmlFor="title">
                                            📝 Titolo:
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Inserisci il titolo del post"
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="body">
                                            📄 Contenuto:
                                        </label>
                                        <textarea
                                            id="body"
                                            name="body"
                                            value={formData.body}
                                            onChange={handleInputChange}
                                            placeholder="Scrivi il contenuto del post..."
                                            className="form-control"
                                            rows="6"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="userId">
                                            👤 Autore:
                                        </label>
                                        <select
                                            id="userId"
                                            name="userId"
                                            value={formData.userId}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        >
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    Utente {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-actions">
                                        <button type="button" onClick={resetForm} className="btn btn-secondary">
                                            🚫 Annulla
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? '⏳ Salvando...' : (editingPost ? '💾 Aggiorna' : '➕ Crea Post')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Posts Table */}
                    <div className="admin-table-container">
                        <div className="admin-table-card">
                            <div className="table-header">
                                <h3>📋 Lista Posts ({filteredPosts.length})</h3>
                            </div>

                            {isLoading && posts.length === 0 ? (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Caricamento posts...</p>
                                </div>
                            ) : error ? (
                                <div className="error-container">
                                    <p>❌ {error}</p>
                                </div>
                            ) : (
                                <div className="posts-table">
                                    {filteredPosts.length > 0 ? (
                                        filteredPosts.map(post => (
                                            <div key={post.id} className="post-row">
                                                <div className="post-info">
                                                    <div className="post-id">#{post.id}</div>
                                                    <div className="post-details">
                                                        <h4 className="post-row-title">{post.title}</h4>
                                                        <p className="post-row-excerpt">
                                                            {post.body.length > 100 ?
                                                                `${post.body.substring(0, 100)}...` :
                                                                post.body
                                                            }
                                                        </p>
                                                        <div className="post-meta">
                                                            👤 Utente {post.userId} • 📄 {post.body.length} caratteri
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="post-actions">
                                                    <button
                                                        onClick={() => handleEditPost(post)}
                                                        className="btn-icon edit"
                                                        title="Modifica"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePost(post.id)}
                                                        className="btn-icon delete"
                                                        title="Elimina"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-posts">
                                            <p>📭 Nessun post trovato</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="admin-content">
                    <div className="admin-placeholder">
                        <h3>👥 Gestione Utenti</h3>
                        <p>Funzionalità in arrivo...</p>
                        <div className="users-preview">
                            <div className="user-card">
                                <div className="user-avatar">👑</div>
                                <div className="user-info">
                                    <h4>Admin User</h4>
                                    <p>admin@blog.com</p>
                                    <span className="user-role admin">Amministratore</span>
                                </div>
                            </div>
                            <div className="user-card">
                                <div className="user-avatar">👤</div>
                                <div className="user-info">
                                    <h4>Normal User</h4>
                                    <p>user@blog.com</p>
                                    <span className="user-role user">Utente</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="admin-content">
                    <div className="admin-placeholder">
                        <h3>⚙️ Impostazioni Sistema</h3>
                        <p>Configurazioni dell'applicazione...</p>
                        <div className="settings-grid">
                            <div className="setting-item">
                                <h4>🔧 Configurazione API</h4>
                                <p>JSONPlaceholder: Attiva</p>
                            </div>
                            <div className="setting-item">
                                <h4>💾 Cache</h4>
                                <p>Redis: Non configurato</p>
                            </div>
                            <div className="setting-item">
                                <h4>📧 Email</h4>
                                <p>SMTP: Non configurato</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default AdminPanel;
