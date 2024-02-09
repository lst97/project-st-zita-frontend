import React, { ReactElement, createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
    children?: React.ReactNode;
};

type IAuthContext = {
    auth: boolean;
    setAuth: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialAuthContext: IAuthContext = {
    auth: false,
    setAuth: () => {}
};

const AuthContext = createContext<IAuthContext>(initialAuthContext);

const AuthProvider = ({ children }: Props): ReactElement => {
    const [auth, setAuth] = useState(initialAuthContext.auth);

    const navigate = useNavigate();

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
