import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import postsSlice from './slices/postsSlice';

// Configurazione del store Redux
export const store = configureStore({
    reducer: {
        auth: authSlice,      // Gestisce autenticazione utenti
        posts: postsSlice,    // Gestisce i post del blog
    },
    // Middleware per gestire azioni asincrone
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
    // Abilita Redux DevTools in sviluppo
    devTools: process.env.NODE_ENV !== 'production',
});


console.log('🏪 Redux Store configurato correttamente!');
