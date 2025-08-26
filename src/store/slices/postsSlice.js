// src/store/slices/postsSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL per JSONPlaceholder API
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Thunk per caricare tutti i posts
export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async ({ page = 1, limit = 10, userId = null }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                _page: page,
                _limit: limit
            });

            if (userId) {
                params.append('userId', userId);
            }

            const response = await axios.get(`${API_BASE_URL}/posts?${params}`);

            return {
                posts: response.data,
                totalCount: parseInt(response.headers['x-total-count']) || response.data.length * 10,
                currentPage: page
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Errore nel caricamento posts');
        }
    }
);

// Thunk per caricare un singolo post
export const fetchPostById = createAsyncThunk(
    'posts/fetchPostById',
    async (postId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Errore nel caricamento del post');
        }
    }
);

// Thunk per creare un nuovo post
export const createPost = createAsyncThunk(
    'posts/createPost',
    async (postData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/posts`, postData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Errore nella creazione del post');
        }
    }
);

// Thunk per aggiornare un post
export const updatePost = createAsyncThunk(
    'posts/updatePost',
    async ({ id, ...postData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/posts/${id}`, postData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Errore nell\'aggiornamento del post');
        }
    }
);

// Thunk per eliminare un post
export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async (postId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE_URL}/posts/${postId}`);
            return postId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Errore nell\'eliminazione del post');
        }
    }
);

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        // Lista posts
        posts: [],
        isLoading: false,
        error: null,

        // Post singolo
        currentPost: null,
        isLoadingPost: false,
        postError: null,

        // Paginazione
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,

        // Filtri
        filters: {
            search: '',
            userId: null
        }
    },
    reducers: {
        // Gestione filtri
        setSearchFilter: (state, action) => {
            state.filters.search = action.payload;
        },
        setUserFilter: (state, action) => {
            state.filters.userId = action.payload;
        },
        clearFilters: (state) => {
            state.filters = {
                search: '',
                userId: null
            };
            state.currentPage = 1;
        },

        // Gestione paginazione
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },

        // Reset errori
        clearErrors: (state) => {
            state.error = null;
            state.postError = null;
        },

        // Reset post corrente
        clearCurrentPost: (state) => {
            state.currentPost = null;
            state.postError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Posts
            .addCase(fetchPosts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = action.payload.posts;
                state.totalCount = action.payload.totalCount;
                state.currentPage = action.payload.currentPage;
                state.totalPages = Math.ceil(action.payload.totalCount / 10);
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Fetch Post by ID
            .addCase(fetchPostById.pending, (state) => {
                state.isLoadingPost = true;
                state.postError = null;
            })
            .addCase(fetchPostById.fulfilled, (state, action) => {
                state.isLoadingPost = false;
                state.currentPost = action.payload;
            })
            .addCase(fetchPostById.rejected, (state, action) => {
                state.isLoadingPost = false;
                state.postError = action.payload;
            })

            // Create Post
            .addCase(createPost.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts.unshift(action.payload);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Update Post
            .addCase(updatePost.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.posts.findIndex(post => post.id === action.payload.id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
                if (state.currentPost && state.currentPost.id === action.payload.id) {
                    state.currentPost = action.payload;
                }
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Delete Post
            .addCase(deletePost.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = state.posts.filter(post => post.id !== action.payload);
                if (state.currentPost && state.currentPost.id === action.payload) {
                    state.currentPost = null;
                }
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

// Actions
export const {
    setSearchFilter,
    setUserFilter,
    clearFilters,
    setCurrentPage,
    clearErrors,
    clearCurrentPost
} = postsSlice.actions;

// Selectors di base
const selectPostsState = (state) => state.posts;

// Selectors semplici
export const selectPosts = (state) => state.posts.posts;
export const selectPostsLoading = (state) => state.posts.isLoading;
export const selectPostsError = (state) => state.posts.error;
export const selectCurrentPost = (state) => state.posts.currentPost;
export const selectPostsFilters = (state) => state.posts.filters;
export const selectCurrentPage = (state) => state.posts.currentPage;
export const selectTotalPages = (state) => state.posts.totalPages;
export const selectTotal = (state) => state.posts.totalCount;

// Selector memoizzato per paginazione
export const selectPostsPagination = createSelector(
    [selectCurrentPage, selectTotalPages, selectTotal],
    (currentPage, totalPages, total) => ({
        currentPage,
        totalPages,
        total
    })
);

export default postsSlice.reducer;