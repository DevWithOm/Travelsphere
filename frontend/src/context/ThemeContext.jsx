import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('travelsphere-theme') || 'vintage';
    });
    
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('travelsphere-dark');
        if (saved !== null) {
            return saved === 'true';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        localStorage.setItem('travelsphere-theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('travelsphere-dark', isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const toggleDark = () => setIsDark(prev => !prev);

    const availableThemes = [
        { id: 'vintage', name: 'Classic Vintage' },
        { id: 'oceanic', name: 'Deep Oceanic' },
        { id: 'emerald', name: 'Lush Emerald' }
    ];

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isDark, toggleDark, availableThemes }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
