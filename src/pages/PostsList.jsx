import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    fetchPosts,
    setSearchFilter,
    setUserFilter,
    clearFilters,
    selectPosts,
    selectPostsLoading,
    selectPostsError,
    selectPostsFilters,
    selectCurrentPage,
    selectTotalPages,
    selectTotal
} from '../store/slices/postsSlice';

const PostsList = () => {
    const dispatch = useDispatch();

    // Redux state
    const posts = useSelector(selectPosts);
    const isLoading = useSelector(selectPostsLoading);
    const error = useSelector(selectPostsError);
    const filters = useSelector(selectPostsFilters);

    // Paginazione con selectors individuali
    const currentPage = useSelector(selectCurrentPage);
    const totalPages = useSelector(selectTotalPages);
    const total = useSelector(selectTotal);

    // Local state per filtri UI
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);

    // Carica posts all'avvio
    useEffect(() => {
        // Carica posts solo se non ci sono già o se è la prima volta
        if (posts.length === 0 || !isLoading) {
            dispatch(fetchPosts({
                page: 1,
                limit: 10,
                userId: filters.userId
            }));
        }
    }, [dispatch, filters.userId, posts.length, isLoading]);

    // Gestione ricerca locale
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(setSearchFilter(searchTerm));
        }, 300); // Debounce di 300ms

        return () => clearTimeout(timeoutId);
    }, [searchTerm, dispatch]);

    // Gestione filtro utente
    const handleUserFilter = (userId) => {
        const userIdNum = userId ? parseInt(userId) : null;
        setSelectedUserId(userId);
        dispatch(setUserFilter(userIdNum));
        // Reset alla prima pagina quando cambiamo filtro
        dispatch(fetchPosts({
            page: 1,
            limit: 10,
            userId: userIdNum
        }));
    };

    // Posts filtrati per ricerca locale
    const filteredPosts = posts.filter(post => {
        if (!searchTerm) return true;
        return post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.body.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Reset tutti i filtri
    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedUserId(null);
        dispatch(clearFilters());
        dispatch(fetchPosts({
            page: 1,
            limit: 10,
            userId: null
        }));
    };

    // Navigazione pagine
    const handlePageChange = (newPage) => {
        dispatch(fetchPosts({
            page: newPage,
            limit: 10,
            userId: filters.userId
        }));
    };

    // Loading state
    if (isLoading && posts.length === 0) {
        return (
            <div className="container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Caricamento posts...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container">
                <div className="error-container">
                    <h2>❌ Errore nel caricamento</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => dispatch(fetchPosts({ page: 1, limit: 10 }))}
                        className="btn btn-primary"
                    >
                        🔄 Riprova
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Header Section */}
            <section className="posts-header">
                <h1>📄 Posts del Blog</h1>
                <p>Esplora tutti gli articoli disponibili</p>
            </section>

            {/* Filters Section */}
            <section className="filters-section">
                <div className="filters-card">
                    <div className="filters-row">
                        <div className="filter-group">
                            <label htmlFor="search">
                                🔍 Cerca nei posts
                            </label>
                            <input
                                id="search"
                                type="text"
                                placeholder="Cerca per titolo o contenuto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="filter-input"
                            />
                        </div>

                        <div className="filter-group">
                            <label htmlFor="authorFilter">
                                👤 Filtra per Autore
                            </label>
                            <select
                                id="authorFilter"
                                value={selectedUserId || ''}
                                onChange={(e) => handleUserFilter(e.target.value || null)}
                                className="filter-select"
                            >
                                <option value="">Tutti gli autori</option>
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        Utente {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={clearAllFilters}
                            className="clear-filters-btn"
                            disabled={!searchTerm && !selectedUserId}
                        >
                            🗑️ Reset
                        </button>
                    </div>
                </div>

                {/* Stats Info */}
                {filteredPosts.length !== posts.length && (
                    <div className="posts-stats">
                        <p>
                            📊 Mostrando {filteredPosts.length} di {posts.length} posts
                            {searchTerm && ` per "${searchTerm}"`}
                            {selectedUserId && ` dall'Utente ${selectedUserId}`}
                        </p>
                    </div>
                )}
            </section>

            {/* Posts Grid */}
            <section className="posts-content">
                {filteredPosts.length > 0 ? (
                    <div className="posts-grid">
                        {filteredPosts.map(post => (
                            <div className="post-card" key={post.id}>
                                <div className="post-card-content">
                                    <div className="post-meta">
                                        <span className="post-id">📄 #{post.id}</span>
                                        <span className="post-author">👤 Utente {post.userId}</span>
                                    </div>

                                    <h2 className="post-title">{post.title}</h2>

                                    <p className="post-excerpt">{post.body}</p>

                                    <div className="post-actions">
                                        <Link
                                            to={`/posts/${post.id}`}
                                            className="read-more-btn"
                                        >
                                            📖 Leggi di più
                                        </Link>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {post.body.length} caratteri
                    </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-posts">
                        <div className="card">
                            <div className="card-content" style={{ textAlign: 'center' }}>
                                <h3>🔍 Nessun post trovato</h3>
                                <p>Prova a modificare i filtri di ricerca</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="btn btn-primary"
                                    style={{ marginTop: '1rem' }}
                                >
                                    🗑️ Reset Filtri
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Paginazione */}
            {totalPages > 1 && (
                <section className="pagination-section">
                    <div className="card">
                        <div className="card-content">
                            <div className="pagination">
                                <div className="pagination-info">
                                    📄 Pagina {currentPage} di {totalPages} • {total} posts totali
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                    className="pagination-btn"
                                >
                                    ⬅️ Precedente
                                </button>

                                <span className="pagination-btn active">
                  {currentPage}
                </span>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                    className="pagination-btn"
                                >
                                    Successiva ➡️
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};


export default PostsList;
