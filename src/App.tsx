import { BrowserRouter } from 'react-router-dom';
import { useJwtInterceptor } from './api/interceptors/request/JwtInterceptor';
import { AuthProvider } from './context/AuthContext';
import Routes from './pages/Routes';
import { SnackbarProvider } from './context/SnackbarContext';
import AppSnackbar from './components/common/Snackbar';
import { LoadingIndicatorProvider } from './context/LoadingIndicatorContext';
import ApiResultIndicator from './components/common/indicators/ApiResultIndicator';

const App: React.FC = () => {
    useJwtInterceptor();
    return (
        <SnackbarProvider>
            <LoadingIndicatorProvider>
                <AppSnackbar />
                <ApiResultIndicator />
                <BrowserRouter>
                    <AuthProvider>
                        <Routes />
                    </AuthProvider>
                </BrowserRouter>
            </LoadingIndicatorProvider>
        </SnackbarProvider>
    );
};

export default App;
