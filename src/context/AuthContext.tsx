import { ReactTokenServiceInstance } from '@lst97/common-services';
import React, { ReactElement, createContext, useState } from 'react';

type Props = {
    children?: React.ReactNode;
};

type IAuthContext = {
    auth: boolean;
    setAuth: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialAuthContext: IAuthContext = {
    auth: !ReactTokenServiceInstance().getToken('accessToken'),
    setAuth: () => {}
};

const AuthContext = createContext<IAuthContext>(initialAuthContext);

const AuthProvider = ({ children }: Props): ReactElement => {
    const [auth, setAuth] = useState(initialAuthContext.auth);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
