import { Link } from 'react-router-dom';
import { Compass, Map, Clock, Globe } from 'lucide-react';
import ThemeSettings from '../components/ThemeSettings';

export default function Landing() {
    return (
        <div className="min-h-screen bg-vintage-paper font-sans text-vintage-ink selection:bg-vintage-accent/30 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-5 dark:opacity-10"
                 style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-map.png")' }}>
            </div>

            {/* Theme Specific Background Effects */}
            <div className="oceanic-waterfall z-0">
                {[...Array(20)].map((_, i) => (
                    <div 
                        key={i} 
                        className="water-drop" 
                        style={{ 
                            left: `${Math.random() * 100}%`, 
                            animationDuration: `${Math.random() * 2 + 1}s`,
                            animationDelay: `${Math.random() * 5}s`
                        }} 
                    />
                ))}
            </div>

            <div className="emerald-floating z-0">
                {[...Array(15)].map((_, i) => (
                    <div 
                        key={i} 
                        className="leaf" 
                        style={{ 
                            left: `${Math.random() * 100}%`, 
                            top: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 5 + 5}s`,
                            animationDelay: `${Math.random() * 5}s`
                        }} 
                    />
                ))}
            </div>
            
            <div className="absolute top-6 right-6 z-50">
                <ThemeSettings />
            </div>
            
            <div className="z-10 max-w-4xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Hero */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center p-4 border-2 border-vintage-leather/30 rounded-full bg-white/50 shadow-md mb-6 transform rotate-12 transition-transform hover:rotate-45 duration-700">
                        <Globe className="w-16 h-16 text-vintage-accent" />
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold font-serif text-vintage-leather tracking-tighter mix-blend-multiply">
                        TravelSphere
                    </h1>
                    <p className="text-xl md:text-2xl text-vintage-ink/80 font-serif max-w-2xl mx-auto leading-relaxed italic">
                        "Around the world in eighty days..."
                    </p>
                    <p className="text-lg text-vintage-ink/60 font-mono max-w-xl mx-auto uppercase tracking-widest border-y border-vintage-brass/30 py-4">
                        The Premier Dispatch System for the Modern Explorer
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
                    <div className="bg-white/40 p-6 rounded border border-vintage-brass/30 text-center hover:bg-white/60 transition-colors shadow-sm">
                        <Map className="w-10 h-10 mx-auto text-vintage-leather mb-4" />
                        <h3 className="font-bold font-serif text-xl mb-2 text-vintage-ink">Bespoke Itineraries</h3>
                        <p className="text-sm font-mono text-vintage-ink/70">Curated routes mapping every juncture of your global expedition.</p>
                    </div>
                    <div className="bg-white/40 p-6 rounded border border-vintage-brass/30 text-center hover:bg-white/60 transition-colors shadow-sm transform md:-translate-y-4">
                        <Compass className="w-10 h-10 mx-auto text-vintage-leather mb-4" />
                        <h3 className="font-bold font-serif text-xl mb-2 text-vintage-ink">Intelligent Guidance</h3>
                        <p className="text-sm font-mono text-vintage-ink/70">Mechanical precision tailored to your distinctive predilections.</p>
                    </div>
                    <div className="bg-white/40 p-6 rounded border border-vintage-brass/30 text-center hover:bg-white/60 transition-colors shadow-sm">
                        <Clock className="w-10 h-10 mx-auto text-vintage-leather mb-4" />
                        <h3 className="font-bold font-serif text-xl mb-2 text-vintage-ink">Timely Execution</h3>
                        <p className="text-sm font-mono text-vintage-ink/70">Punctual ledgers and budget manifests for the disciplined traveler.</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                    <Link to="/auth" className="w-full sm:w-auto px-8 py-4 bg-vintage-leather text-vintage-paper font-bold font-serif text-xl rounded shadow-lg hover:bg-vintage-ink hover:text-vintage-paper transition-all transform hover:-translate-y-1 text-center border-2 border-transparent">
                        Commence Journey
                    </Link>
                    <Link to="/plan" className="w-full sm:w-auto px-8 py-4 bg-transparent text-vintage-leather font-bold font-serif text-xl rounded hover:bg-vintage-leather/10 transition-all border-2 border-vintage-leather text-center">
                        Guest Telegraph
                    </Link>
                </div>
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 text-center text-vintage-ink/40 font-mono text-xs uppercase tracking-widest z-0">
                Est. 1872 • London • Paris • Bombay • Yokohama • New York
            </div>
        </div>
    );
}
