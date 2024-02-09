import { Routes as Router, Route, Navigate, Outlet } from 'react-router-dom';
import SignInSide from './SignInPage/SignInPage';
import HomePage from './HomePage/HomePage';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

type Props = {};

interface RouteObject {
    path: string;
    element: React.ReactNode;
    private?: boolean;
    children?: RouteObject[];
}

const PrivateRoutes = () => {
    const { auth } = useContext(AuthContext);

    if (!auth) return <Navigate to="/signin" replace />;

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
    }
];

const RenderRoutes = (props: Props) => {
    return (
        <Router>
            {routesConfig.map((route, index) => {
                if (route.private) {
                    // Possibly including authentication checks
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={route.element}
                        >
                            {route.children &&
                                route.children.map((childRoute, childIndex) => (
                                    <Route
                                        key={childIndex}
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
                            key={index}
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
