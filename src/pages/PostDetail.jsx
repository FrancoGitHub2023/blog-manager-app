
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchPostById,
    selectCurrentPost,
    selectPostsLoading,
    selectPostsError
} from '../store/slices/postsSlice';
import { selectIsAuthenticated, selectUser } from '../store/slices/authSlice';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux state
    const post = useSelector(selectCurrentPost);
    const isLoading = useSelector(selectPostsLoading);
    const error = useSelector(selectPostsError);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);

    // Local state per comments
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    // Form state per nuovo commento
    const [newComment, setNewComment] = useState({
        name: '',
        email: '',
        body: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentError, setCommentError] = useState(null);

    // Carica post e comments all'avvio
    useEffect(() => {
        if (id) {
            dispatch(fetchPostById(id));
            loadComments(id);
        }
    }, [dispatch, id]);

    // Pre-popola il form se l'utente è loggato
    useEffect(() => {
        if (isAuthenticated && user) {
            setNewComment(prev => ({
                ...prev,
                name: user.name,
                email: user.email
            }));
        }
    }, [isAuthenticated, user]);

    // Funzione per caricare i commenti
    const loadComments = async (postId) => {
        setLoadingComments(true);
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
            const commentsData = await response.json();
            setComments(commentsData);
        } catch (error) {
            console.error('Errore nel caricamento commenti:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    // Handle form input
    const handleCommentChange = (e) => {
        const { name, value } = e.target;
        setNewComment(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error quando l'utente digita
        if (commentError) {
            setCommentError(null);
        }
    };

    // Submit nuovo commento
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!newComment.body.trim()) {
            setCommentError('Il contenuto del commento è obbligatorio');
            return;
        }

        setIsSubmitting(true);
        setCommentError(null);

        try {
            // Simula invio a API (JSONPlaceholder accept POST ma non salva realmente)
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: parseInt(id),
                    name: newComment.name,
                    email: newComment.email,
                    body: newComment.body
                })
            });

            if (response.ok) {
                // Aggiungi il commento localmente per simulare il salvataggio
                const tempComment = {
                    id: Date.now(), // ID temporaneo
                    postId: parseInt(id),
                    name: newComment.name,
                    email: newComment.email,
                    body: newComment.body
                };

                setComments(prev => [...prev, tempComment]);

                // Reset form
                setNewComment(prev => ({
                    name: prev.name, // Mantieni nome e email
                    email: prev.email,
                    body: ''
                }));

                // Feedback positivo
                alert('Commento aggiunto con successo!');
            } else {
                throw new Error('Errore nell\'invio del commento');
            }
        } catch (error) {
            setCommentError('Errore nell\'invio del commento. Riprova.');
            console.error('Errore:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Caricamento post...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container">
                <div className="error-container">
                    <h2>Errore nel caricamento</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => navigate('/posts')}
                        className="btn btn-primary"
                    >
                        Torna alla lista
                    </button>
                </div>
            </div>
        );
    }

    // Post non trovato
    if (!post) {
        return (
            <div className="container">
                <div className="error-container">
                    <h2>Post non trovato</h2>
                    <p>Il post che stai cercando non esiste o è stato rimosso.</p>
                    <button
                        onClick={() => navigate('/posts')}
                        className="btn btn-primary"
                    >
                        Torna alla lista
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Breadcrumb Navigation */}
            <nav className="breadcrumb">
                <Link to="/" className="breadcrumb-link">Home</Link>
                <span className="breadcrumb-separator">→</span>
                <Link to="/posts" className="breadcrumb-link">Posts</Link>
                <span className="breadcrumb-separator">→</span>
                <span className="breadcrumb-current">Post #{id}</span>
            </nav>

            {/* Post Content */}
            <article className="post-detail">
                <div className="card">
                    <div className="card-content">
                        {/* Post Header */}
                        <header className="post-header">
                            <div className="post-meta">
                                <span className="post-id">Post #{post.id}</span>
                                <span className="post-author">Utente {post.userId}</span>
                            </div>
                            <h1 className="post-title">{post.title}</h1>
                        </header>

                        {/* Post Body */}
                        <div className="post-body">
                            <p>{post.body}</p>
                        </div>

                        {/* Post Actions */}
                        <div className="post-actions">
                            <button
                                onClick={() => navigate('/posts')}
                                className="btn btn-secondary"
                            >
                                Torna alla lista
                            </button>
                            <button
                                onClick={() => navigate(`/posts/${parseInt(id) - 1}`)}
                                className="btn btn-outline"
                                disabled={parseInt(id) <= 1}
                            >
                                Post precedente
                            </button>
                            <button
                                onClick={() => navigate(`/posts/${parseInt(id) + 1}`)}
                                className="btn btn-outline"
                                disabled={parseInt(id) >= 100}
                            >
                                Post successivo
                            </button>
                        </div>
                    </div>
                </div>
            </article>

            {/* Comments Section */}
            <section className="comments-section">
                <div className="card">
                    <div className="card-content">
                        <h2 className="comments-title">
                            Commenti ({comments.length})
                        </h2>

                        {loadingComments ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Caricamento commenti...</p>
                            </div>
                        ) : comments.length > 0 ? (
                            <div className="comments-list">
                                {comments.map(comment => (
                                    <div key={comment.id} className="comment">
                                        <div className="comment-header">
                                            <h4 className="comment-name">{comment.name}</h4>
                                            <span className="comment-email">{comment.email}</span>
                                        </div>
                                        <p className="comment-body">{comment.body}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-comments">Nessun commento disponibile per questo post.</p>
                        )}

                        {/* Comment Form - Solo per utenti autenticati */}
                        {isAuthenticated ? (
                            <div className="comment-form-section">
                                <h3 className="comment-form-title">Aggiungi un commento</h3>
                                <form onSubmit={handleCommentSubmit} className="comment-form">
                                    <div className="form-group">
                                        <label htmlFor="comment-name">Nome:</label>
                                        <input
                                            type="text"
                                            id="comment-name"
                                            name="name"
                                            value={newComment.name}
                                            onChange={handleCommentChange}
                                            className="form-control"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="comment-email">Email:</label>
                                        <input
                                            type="email"
                                            id="comment-email"
                                            name="email"
                                            value={newComment.email}
                                            onChange={handleCommentChange}
                                            className="form-control"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="comment-body">Commento:</label>
                                        <textarea
                                            id="comment-body"
                                            name="body"
                                            value={newComment.body}
                                            onChange={handleCommentChange}
                                            placeholder="Scrivi il tuo commento..."
                                            className="form-control"
                                            rows="4"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {commentError && (
                                        <div className="error-message">
                                            <span className="error-icon">❌</span>
                                            {commentError}
                                        </div>
                                    )}

                                    <div className="form-actions">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isSubmitting || !newComment.body.trim()}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>
                                                    Pubblicando...
                                                </>
                                            ) : (
                                                'Pubblica Commento'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="login-prompt">
                                <p>
                                    <Link to="/login" className="login-link">
                                        Effettua il login
                                    </Link> per aggiungere un commento.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Related Posts Preview */}
            <section className="related-posts">
                <div className="card">
                    <div className="card-content">
                        <h3>Altri post che potrebbero interessarti</h3>
                        <div className="related-links">
                            {[1, 2, 3].map(offset => {
                                const relatedId = parseInt(id) + offset;
                                if (relatedId <= 100) {
                                    return (
                                        <Link
                                            key={relatedId}
                                            to={`/posts/${relatedId}`}
                                            className="related-link"
                                        >
                                            Post #{relatedId}
                                        </Link>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PostDetail;

