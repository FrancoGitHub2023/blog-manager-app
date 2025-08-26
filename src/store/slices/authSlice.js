// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Utenti di test per la simulazione
const TEST_USERS = [
    {
        id: 1,
        email: 'admin@blog.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
    },
    {
        id: 2,
        email: 'user@blog.com',
        password: 'user123',
        name: 'Normal User',
        role: 'user'
    }
];

// Thunk per il login simulato
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            // Simula un delay di rete
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Trova l'utente nelle credenziali di test
            const user = TEST_USERS.find(
                u => u.email === email && u.password === password
            );

            if (!user) {
                return rejectWithValue('Credenziali non valide');
            }

            // Salva nel localStorage per persistenza
            const userData = { ...user };
            delete userData.password; // Non salvare la password
            localStorage.setItem('blogUser', JSON.stringify(userData));

            return userData;
        } catch (error) {
            return rejectWithValue('Errore durante il login');
        }
    }
);

// Thunk per il logout
export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            localStorage.removeItem('blogUser');
            return true;
        } catch (error) {
            return rejectWithValue('Errore durante il logout');
        }
    }
);

// Thunk per controllare lo stato di autenticazione
export const checkAuthStatus = createAsyncThunk(
    'auth/checkAuthStatus',
    async (_, { rejectWithValue }) => {
        try {
            const userData = localStorage.getItem('blogUser');
            if (userData) {
                return JSON.parse(userData);
            }
            return null;
        } catch (error) {
            localStorage.removeItem('blogUser');
            return rejectWithValue('Dati di autenticazione non validi');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload;
            })

            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Check Auth Status
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload;
                    state.isAuthenticated = true;
                } else {
                    state.user = null;
                    state.isAuthenticated = false;
                }
            })
            .addCase(checkAuthStatus.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            });
    }
});

// Actions
export const { clearError, setUser } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;