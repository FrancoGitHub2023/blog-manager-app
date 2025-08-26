// src/pages/PostDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchPostById,
    selectCurrentPost,
    selectPostsLoading,
    selectPostsError
} from '../store/slices/postsSlice';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const post = useSelector(selectCurrentPost);
    const isLoading = useSelector(selectPostsLoading);
    const error = useSelector(selectPostsError);

    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (id) {
            dispatch(fetchPostById(id));
            // Carica commenti direttamente
            fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
                .then(res => res.json())
                .then(setComments);
        }
    }, [dispatch, id]);

    if (isLoading) return <div>Caricamento...</div>;
    if (error) return <div>Errore: {error}</div>;
    if (!post) return <div>Post non trovato</div>;

    return (
        <div className="container">
            <Link to="/posts">← Torna ai posts</Link>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
            <h3>Commenti ({comments.length})</h3>
            {comments.map(comment => (
                <div key={comment.id}>
                    <h4>{comment.name}</h4>
                    <p>{comment.body}</p>
                </div>
            ))}
        </div>
    );
};

export default PostDetail;