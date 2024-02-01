import { useJwtInterceptor } from './api/interceptors/request/JwtInterceptor';
import HomePage from './pages/HomePage/HomePage';

function App() {
    useJwtInterceptor();
    return (
        <div>
            <HomePage></HomePage>
        </div>
    );
}

export default App;
