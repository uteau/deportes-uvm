import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Claves con la que guardamos el token y el rol
const TOKEN_KEY = 'accesToken';
const ROL_KEY = 'rol';

const AuthContext = createContext(null);

export function AuthProvider ({children}) {
    const [token, setToken] = useState(null);
    const [rol, setRol] = useState(null);
    // loading: true mientras leemos SecureStore al arrancar la app
    // Evita mostrar la pantalla de login un instante antes de saber si hay sesión
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarSesion = async () => {
            const tokenGuardado = await SecureStore.getItemAsync(TOKEN_KEY);
            const rolGuardado = await SecureStore.getItemAsync(ROL_KEY);
            if (tokenGuardado && rolGuardado) {
                setToken(tokenGuardado);
                setRol(rolGuardado);
            }
            // con el token y rol cargados, salimos del login
            setLoading(false);
        };
        cargarSesion();
    }, []);

    const iniciarSesion = async (nuevoToken, nuevoRol) => {
        await SecureStore.setItemAsync(TOKEN_KEY, nuevoToken);
        await SecureStore.setItemAsync(ROL_KEY, nuevoRol);
        setToken(nuevoToken);
        setRol(nuevoRol);
    };

    const cerrarSesion = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(ROL_KEY);
        setToken(null);
        setRol(null);
    };

    return (
        <AuthContext.Provider value={{token, rol, loading, iniciarSesion, cerrarSesion}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}