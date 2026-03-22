import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { getStoredToken, getStoredUser, setAuthSession, clearAuthSession, fetchCurrentUser } from "../services/api";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getStoredToken());
    const [user, setUser] = useState(getStoredUser());
    const authorizationToken = `Bearer ${token}`;

    //Store token in local storage
    const storeTokenInLS = (serverToken) => {
        setToken(serverToken);
        setAuthSession({ token: serverToken });
    };
    //Store user data in local storage
    const storeUserInLS = (serverUser) => {
        setUser(serverUser);
        setAuthSession({ user: serverUser });
    };

    let isLoggedIn = !!token; //if token is present then true else false
    console.log("isLoggedIn : ", isLoggedIn);

    //Tackling the Logout functionality
    const logout = () => {
        clearAuthSession();
        setToken(null);
        setUser(null);
    };

    //JWT Authentication - to get the currently loggedIn user data
    const userAuthentication = async () => {
        try {
            if (!token) return;

            const userData = await fetchCurrentUser();
            setUser(userData);
            console.log("Authenticated user data : ", userData);
        } catch (error) {
            console.error("Error in fetching user data : ", error);
            logout();
        }
    }

    useEffect(() => {
        userAuthentication();
    }, [token])

    return (
        <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, storeUserInLS, user, authorizationToken, logout}                                                                                                                                                                                                                                                                                                                 }>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    
    if(!authContextValue){
        throw new Error(" useAuth used outside of the Provider");
    }

    return authContextValue;
};

