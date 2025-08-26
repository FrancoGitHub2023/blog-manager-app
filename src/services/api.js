// src/services/api.js
import axios from 'axios';

// Configurazione base di Axios
export const api = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 10000, // 10 secondi di timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor per le richieste (aggiungi token se necessario)
api.interceptors.request.use(
    (config) => {
        // Puoi aggiungere qui il token di autenticazione se ne avessi uno
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            // config.headers.Authorization = `Bearer ${userData.token}`;
        }

        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Interceptor per le risposte (gestisce errori globali)
api.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('❌ Response Error:', error.response?.status, error.message);

        // Gestione errori globali
        if (error.response?.status === 401) {
            // Token scaduto o non valido
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// ========== API ENDPOINTS ==========

// Posts API
export const postsAPI = {
    // Fetch tutti i posts con paginazione
    getAll: (page = 1, limit = 10) =>
        api.get(`/posts?_page=${page}&_limit=${limit}`),

    // Fetch singolo post
    getById: (id) =>
        api.get(`/posts/${id}`),

    // Crea nuovo post
    create: (postData) =>
        api.post('/posts', postData),

    // Aggiorna post
    update: (id, postData) =>
        api.put(`/posts/${id}`, postData),

    // Elimina post
    delete: (id) =>
        api.delete(`/posts/${id}`),

    // Fetch posts per utente
    getByUserId: (userId) =>
        api.get(`/posts?userId=${userId}`),
};

// Users API
export const usersAPI = {
    // Fetch tutti gli utenti
    getAll: () =>
        api.get('/users'),

    // Fetch singolo utente
    getById: (id) =>
        api.get(`/users/${id}`),
};

// Comments API
export const commentsAPI = {
    // Fetch commenti per post
    getByPostId: (postId) =>
        api.get(`/comments?postId=${postId}`),

    // Crea nuovo commento
    create: (commentData) =>
        api.post('/comments', commentData),

    // Elimina commento
    delete: (id) =>
        api.delete(`/comments/${id}`),
};

// ========== UTILITY FUNCTIONS ==========

// Funzione per gestire gli errori delle API in modo consistente
export const handleApiError = (error) => {
    if (error.response) {
        // Il server ha risposto con un codice di errore
        return {
            message: error.response.data?.message || 'Errore del server',
            status: error.response.status,
            data: error.response.data,
        };
    } else if (error.request) {
        // La richiesta è stata fatta ma non c'è stata risposta
        return {
            message: 'Nessuna risposta dal server. Controlla la connessione.',
            status: 0,
            data: null,
        };
    } else {
        // Errore nella configurazione della richiesta
        return {
            message: error.message || 'Errore inaspettato',
            status: 0,
            data: null,
        };
    }
};

// Funzione per simulare delay nelle API (utile per testing)
export const simulateDelay = (ms = 1000) =>
    new Promise(resolve => setTimeout(resolve, ms));

// Health check dell'API
export const checkApiHealth = async () => {
    try {
        const response = await api.get('/posts/1');
        return response.status === 200;
    } catch (error) {
        console.error('API Health Check failed:', error);
        return false;
    }
};

export default api;