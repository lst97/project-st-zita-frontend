import React, { ReactElement, createContext, useState } from 'react';
import { AccessTokenService } from '../services/TokenService';

type Props = {
    children?: React.ReactNode;
};

type IAuthContext = {
    auth: boolean;
    setAuth: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialAuthContext: IAuthContext = {
    auth: !AccessTokenService.getToken(),
    setAuth: () => {}
};

const AuthContext = createContext<IAuthContext>(initialAuthContext);

const AuthProvider = ({ children }: Props): ReactElement => {
    const [auth, setAuth] = useState(initialAuthContext.auth);
    initialAuthContext.setAuth = setAuth;

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
