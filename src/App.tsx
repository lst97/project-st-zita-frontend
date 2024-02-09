import { BrowserRouter } from 'react-router-dom';
import { useJwtInterceptor } from './api/interceptors/request/JwtInterceptor';
import { AuthProvider } from './context/AuthContext';
import Routes from './pages/Routes';

const App: React.FC = () => {
    useJwtInterceptor();
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes />
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
