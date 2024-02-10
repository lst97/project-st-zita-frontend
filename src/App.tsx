import { BrowserRouter } from 'react-router-dom';
import { useJwtInterceptor } from './api/interceptors/request/JwtInterceptor';
import { AuthProvider } from './context/AuthContext';
import Routes from './pages/Routes';
import { SnackbarProvider } from './context/SnackbarContext';
import { AppSnackbar } from './components/common/Snackbar';

const App: React.FC = () => {
    useJwtInterceptor();
    return (
        <SnackbarProvider>
            <AppSnackbar />
            <BrowserRouter>
                <AuthProvider>
                    <Routes />
                </AuthProvider>
            </BrowserRouter>
        </SnackbarProvider>
    );
};

export default App;
