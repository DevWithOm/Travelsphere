import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

export default function ThemeSettings() {
    const { isDark, toggleDark, theme, setTheme, availableThemes } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative z-50">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 border border-vintage-leather/30 rounded-full bg-white/70 dark:bg-vintage-ink/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-vintage-leather transition-all hover:bg-vintage-paper dark:hover:bg-vintage-ink"
                title="Personalize Journey"
                aria-label="Theme Settings"
            >
                <Palette className="w-5 h-5 text-vintage-leather dark:text-vintage-paper" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-vintage-paper/95 dark:bg-vintage-ink/95 backdrop-blur-md border border-vintage-brass/40 rounded-lg shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center mb-4 border-b border-vintage-brass/20 pb-2">
                        <h3 className="font-serif font-bold text-vintage-ink dark:text-vintage-paper">Personalization</h3>
                        
                        <button 
                            onClick={toggleDark}
                            className="p-1.5 rounded-full hover:bg-vintage-leather/10 dark:hover:bg-vintage-paper/10 transition-colors"
                            title={isDark ? "Switch to Day Light" : "Switch to Night Light"}
                            aria-label="Toggle Dark Mode"
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5 text-vintage-paper" />
                            ) : (
                                <Moon className="w-5 h-5 text-vintage-ink" />
                            )}
                        </button>
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs font-mono uppercase tracking-widest text-vintage-ink/60 dark:text-vintage-paper/60 mb-2">
                            Select Atmosphere
                        </p>
                        
                        {availableThemes.map(t => (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setTheme(t.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded font-sans text-sm transition-colors flex items-center group
                                    ${theme === t.id 
                                        ? 'bg-vintage-leather text-vintage-paper shadow-inner border border-vintage-leather/40 font-bold' 
                                        : 'hover:bg-vintage-leather/10 dark:hover:bg-vintage-paper/10 text-vintage-ink dark:text-vintage-paper border border-transparent'
                                    }`}
                            >
                                <div className={`w-3 h-3 rounded-full mr-3 border border-vintage-ink/10 shadow-sm ${
                                    t.id === 'vintage' ? 'bg-[#f4ecd8]' : 
                                    t.id === 'oceanic' ? 'bg-[#f0f9ff]' : 
                                    'bg-[#f0fdf4]'
                                }`}></div>
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
