import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Routes from './pages/Routes';
import {
    SnackbarProvider,
    LoadingIndicatorProvider
} from '@lst97/react-common-accessories';
import AppSnackbar from './components/common/Snackbar';
import ApiResultIndicator from './components/common/indicators/ApiResultIndicator';
import {
    useJwtInterceptor,
    useResponseStructureValidationInterceptor
} from '@lst97/react-common-interceptors';
import {
    ResponseSchemas,
    Config as ResponseStructureConfig
} from '@lst97/common-response-structure';
import { ApiServiceInstance } from '@lst97/common-restful';
import { ApiConfig } from './api/config';

const ProjectName = 'stzita';

const App: React.FC = () => {
    // Configurations
    ApiConfig.instance.init({
        host: '127.0.0.1',
        port: 1168,
        projectName: ProjectName,
        protocol: 'http',
        apiVersion: 'v1'
    });
    ResponseStructureConfig.instance.idIdentifier = ProjectName;
    useJwtInterceptor(ApiServiceInstance().axiosInstance);
    useResponseStructureValidationInterceptor(
        ApiServiceInstance().axiosInstance,
        ResponseSchemas.joiSchema()
    );

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
