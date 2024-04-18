import { Routes as Router, Route, Navigate, Outlet } from 'react-router-dom';
import SignInSide from './AuthPages/SignInPage';
import HomePage from './HomePage/HomePage';
import SharedSchedulePage from './SharedSchedulePage/SharedSchedulePage';
import { ReactTokenServiceInstance } from '@lst97/common-services';

type Props = {};

interface RouteObject {
    path: string;
    element: React.ReactNode;
    private?: boolean;
    children?: RouteObject[];
}

const PrivateRoutes = () => {
    if (!ReactTokenServiceInstance().getToken('accessToken'))
        return <Navigate to="/signin" replace />;

    return <Outlet />;
};

// Route configuration array
const routesConfig: RouteObject[] = [
    {
        path: '/signin',
        element: <SignInSide />,
        private: false
    },
    {
        path: '/',
        element: <PrivateRoutes />,
        private: true,
        children: [
            {
                path: '/',
                element: <HomePage />
            }
            // Add more nested private routes here
        ]
    },
    {
        path: '/scheduler/share/:linkId',
        element: <SharedSchedulePage />,
        private: false
    }
];

const RenderRoutes = () => {
    return (
        <Router>
            {routesConfig.map((route, index) => {
                if (route.private) {
                    // Possibly including authentication checks
                    return (
                        <Route
                            key={'private-' + index}
                            path={route.path}
                            element={route.element}
                        >
                            {route.children &&
                                route.children.map((childRoute, childIndex) => (
                                    <Route
                                        key={`${index}-${childIndex}`}
                                        path={childRoute.path}
                                        element={childRoute.element}
                                    />
                                ))}
                        </Route>
                    );
                } else {
                    // Public route
                    return (
                        <Route
                            key={'public-' + index}
                            path={route.path}
                            element={route.element}
                        />
                    );
                }
            })}
        </Router>
    );
};

export default RenderRoutes;
