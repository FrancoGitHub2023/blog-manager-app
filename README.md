# 📝 Blog Manager App

Un'applicazione didattica di base per la gestione di un blog, sviluppata con React.js. Lo scopo è dimostrare competenze in state management, routing, e integrazione API.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

## 🎯 Panoramica del Progetto

Blog Manager è un'applicazione web che permette la gestione di articoli di blog con sistema di autenticazione, ruoli utente differenziati e operazioni CRUD complete. L'applicazione dimostra l'implementazione di pattern moderni di sviluppo React e best practices per applicazioni scalabili.

### ✨ Caratteristiche Principali

- 🔐 **Sistema di Autenticazione** con ruoli utente (Admin/User)
- 📄 **Gestione Posts** con operazioni CRUD complete
- 🔍 **Ricerca e Filtri** avanzati
- 📱 **Design Responsive** mobile-first
- ⚡ **Performance Ottimizzate** con lazy loading
- 🛡️ **Route Protette** basate sui ruoli
- 🎨 **UI Moderna** e intuitiva

## 🚀 Istruzioni di Esecuzione

### Prerequisiti

Assicurati di avere installato:
- [Node.js](https://nodejs.org/) (versione 18 o superiore)
- [npm](https://www.npmjs.com/) (incluso con Node.js)

### Installazione

1. **Clona il repository**
   ```bash
   git clone [URL_REPOSITORY]
   cd blog-manager-app
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Avvia l'applicazione in modalità sviluppo**
   ```bash
   npm run dev
   ```

4. **Apri il browser**
   ```
   http://localhost:5173
   ```

### Comandi Disponibili

- `npm run dev` - Avvia il server di sviluppo
- `npm run build` - Crea la build di produzione
- `npm run preview` - Anteprima della build di produzione
- `npm run lint` - Esegue il linting del codice

## 👥 Credenziali di Test

### Amministratore
- **Email**: `admin@blog.com`
- **Password**: `admin123`
- **Accesso**: Tutte le funzionalità incluso Admin Panel

### Utente Normale
- **Email**: `user@blog.com`
- **Password**: `user123`
- **Accesso**: Visualizzazione e navigazione contenuti

## 🏗 Funzionalità Implementate

### 🔐 Sistema di Autenticazione
- Login/logout con credenziali simulate
- Gestione sessioni con localStorage
- Protezione route basata sui ruoli
- Redirect automatici intelligenti

### 📄 Gestione Posts
- **Visualizzazione**: Lista paginata con anteprima
- **Dettaglio**: Pagina completa con commenti
- **Ricerca**: Filtro per titolo e contenuto
- **Filtri**: Per autore specifico
- **CRUD Admin**: Creazione, modifica, eliminazione

### 🎛️ Admin Panel (Solo Amministratori)
- Dashboard con statistiche sistema
- Gestione completa posts
- Form di creazione/modifica
- Ricerca avanzata contenuti
- Interface moderna con tabs

### 📱 User Experience
- Design responsive per tutti i dispositivi
- Loading states e feedback utente
- Gestione errori elegante
- Navigazione intuitiva con breadcrumbs

## 🛠 Tecnologie Utilizzate

### Frontend Core
- **React 18** - Libreria UI con hooks moderni
- **Vite** - Build tool veloce e moderno
- **JavaScript ES6+** - Sintassi moderna

### State Management
- **Redux Toolkit** - Gestione stato globale semplificata
- **React Redux** - Integrazione React-Redux
- **Redux Thunk** - Gestione azioni asincrone

### Routing & Navigation
- **React Router DOM** - Routing client-side
- **Protected Routes** - Controllo accessi basato su ruoli

### HTTP & API
- **Axios** - Client HTTP per chiamate API
- **JSONPlaceholder** - API REST pubblica per testing

### Styling & UI
- **CSS3 Custom Properties** - Variabili CSS per design system
- **Flexbox & Grid** - Layout moderni
- **CSS Modules** - Styling modulare e scoped

### Development Tools
- **ESLint** - Linting e quality code
- **Vite HMR** - Hot Module Replacement
- **React DevTools** - Debugging React

## 📁 Struttura del Progetto

```
blog-manager-app/
├── public/                 # File statici
├── src/
│   ├── components/         # Componenti riutilizzabili
│   │   ├── common/        # Header, Layout
│   │   ├── forms/         # Form components
│   │   └── ui/            # UI components
│   ├── pages/             # Pagine dell'applicazione
│   │   ├── Home.jsx       # Homepage
│   │   ├── Login.jsx      # Autenticazione
│   │   ├── PostsList.jsx  # Lista posts
│   │   ├── PostDetail.jsx # Dettaglio post
│   │   ├── Dashboard.jsx  # Area utente
│   │   └── AdminPanel.jsx # Pannello admin
│   ├── store/             # Redux store
│   │   ├── index.js       # Configurazione store
│   │   └── slices/        # Redux slices
│   │       ├── authSlice.js   # Autenticazione
│   │       └── postsSlice.js  # Gestione posts
│   ├── services/          # API services
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   ├── styles/            # Stili globali
│   │   └── global.css     # CSS principale
│   ├── App.jsx            # Componente root
│   └── main.jsx           # Entry point
├── package.json           # Dipendenze e scripts
└── README.md             # Documentazione
```

## 🔄 Architettura e Patterns

### State Management Pattern
- **Redux Toolkit** per stato globale
- **Slices** per organizzazione modulare
- **Thunks** per operazioni asincrone
- **Selectors** per accesso ottimizzato ai dati

### Component Architecture
- **Functional Components** con hooks
- **Custom Hooks** per logica riutilizzabile
- **Compound Components** per UI complesse
- **Render Props** per condivisione logica

### API Integration
- **Service Layer** per separazione concerns
- **Error Handling** centralizzato
- **Loading States** per UX ottimale
- **Caching** con Redux store

## 📱 Pagine e Routing

### Pagine Pubbliche
- **`/`** - Homepage con introduzione
- **`/posts`** - Lista articoli con filtri
- **`/posts/:id`** - Dettaglio articolo specifico
- **`/login`** - Autenticazione utenti

### Pagine Protette
- **`/dashboard`** - Area personale utenti autenticati
- **`/admin`** - Pannello amministrazione (solo admin)

### Routing Avanzato
- **Protected Routes** - Controllo accessi automatico
- **Dynamic Routes** - Parametri URL per post ID
- **Redirect Logic** - Navigazione intelligente
- **404 Handling** - Gestione pagine non trovate

## 📋 Form e Validazione

### Form Implementati
1. **Login Form** - Autenticazione con email/password
2. **Create Post Form** - Creazione nuovi articoli
3. **Edit Post Form** - Modifica articoli esistenti
4. **Search/Filter Form** - Ricerca e filtri contenuti

### Validazione Features
- **Required Fields** - Campi obbligatori
- **Email Validation** - Formato email corretto
- **Real-time Feedback** - Validazione durante digitazione
- **Error Messages** - Messaggi di errore chiari

## 🌐 Integrazione API

### Endpoints Utilizzati
- **GET** `/posts` - Lista articoli con paginazione
- **GET** `/posts/:id` - Dettaglio articolo specifico
- **GET** `/posts/:id/comments` - Commenti articolo
- **POST** `/posts` - Creazione nuovo articolo
- **PUT** `/posts/:id` - Aggiornamento articolo
- **DELETE** `/posts/:id` - Eliminazione articolo

### Error Handling
- **Network Errors** - Gestione problemi connessione
- **HTTP Status Codes** - Handling risposta server
- **User Feedback** - Messaggi di errore user-friendly
- **Retry Logic** - Possibilità di riprovare operazioni

## 🎨 Design System

### Color Palette
- **Primary**: `#4A90E2` - Blu principale
- **Secondary**: `#6C757D` - Grigio secondario
- **Accent**: `#FF6B6B` - Rosso accento
- **Success**: `#51C878` - Verde successo
- **Warning**: `#FFD93D` - Giallo warning
- **Danger**: `#FF4757` - Rosso errore

### Typography
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Headings**: Font weight 600-700
- **Body Text**: Font weight 400-500
- **Line Height**: 1.6 per readability ottimale

### Spacing System
- **XS**: 0.25rem (4px)
- **SM**: 0.5rem (8px)
- **MD**: 1rem (16px)
- **LG**: 1.5rem (24px)
- **XL**: 2rem (32px)

## 📊 Performance e Ottimizzazioni

### Ottimizzazioni Implementate
- **Code Splitting** - Caricamento lazy dei componenti
- **Memoization** - React.memo e useCallback
- **Redux Selectors** - Prevenzione re-render non necessari
- **Image Optimization** - Formati ottimizzati
- **Bundle Optimization** - Tree shaking con Vite

### Best Practices
- **Pure Components** - Componenti funzionali puri
- **Immutable State** - Redux Toolkit con Immer
- **Error Boundaries** - Gestione errori React
- **Accessibility** - ARIA labels e semantic HTML

## 🧪 Testing e Quality Assurance

### Controlli Qualità
- **ESLint** - Linting automatico codice
- **Manual Testing** - Test funzionalità complete
- **Cross-browser** - Compatibilità browser moderni
- **Responsive Testing** - Test su dispositivi multipli

### Scenarios Testati
- ✅ Autenticazione utenti con diversi ruoli
- ✅ CRUD operations complete sui posts
- ✅ Navigazione tra tutte le pagine
- ✅ Filtri e ricerca funzionanti
- ✅ Responsive design su mobile/desktop
- ✅ Error handling e loading states

## 🚧 Possibili Miglioramenti Futuri

### Features Aggiuntive
- **Real Database** - Sostituzione API mock con database
- **File Upload** - Caricamento immagini per posts
- **Comments System** - Sistema commenti interattivo
- **User Profiles** - Gestione profili utente completa
- **Email Notifications** - Sistema notifiche

### Technical Improvements
- **TypeScript** - Typing statico per robustezza
- **Testing Suite** - Unit e integration tests
- **PWA Features** - Service workers e offline support
- **SSR/SSG** - Server-side rendering con Next.js
- **Docker** - Containerizzazione per deployment

## 👨‍💻 Informazioni Sviluppatore

**Progetto sviluppato per dimostrazione competenze React.js**

### Competenze Dimostrate
- ✅ **React Hooks** - useState, useEffect, custom hooks
- ✅ **Redux/RTK** - State management avanzato
- ✅ **React Router** - Routing e navigazione
- ✅ **API Integration** - REST API con Axios
- ✅ **Form Management** - Controlled components e validazione
- ✅ **Modern CSS** - Flexbox, Grid, Custom Properties
- ✅ **JavaScript ES6+** - Async/await, destructuring, modules

### Patterns Utilizzati
- **Container/Presentational** - Separazione logica/UI
- **Higher-Order Components** - Riutilizzo logica
- **Render Props** - Composizione componenti
- **Custom Hooks** - Logica riutilizzabile
- **Redux Toolkit** - Modern Redux patterns

## 📄 Licenza

Questo progetto è stato sviluppato per scopi educativi e dimostrativi.

---
