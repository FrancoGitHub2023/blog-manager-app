import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRoutes from './AppRoutes';
import Header from './components/common/Header';
import './styles/global.css';

function App() {
    return (
        <Provider store={store}>
            <Router>
                <div className="app">
                    <Header />
                    <main className="main-content">
                        <AppRoutes />
                    </main>
                </div>
            </Router>
        </Provider>
    );
}

export default App;