import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { Plane, Map, Wallet, Compass, BookOpen, Sparkles, Umbrella } from 'lucide-react';
import ThemeSettings from './ThemeSettings';

export default function Layout() {
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const navItems = [
        { name: 'Plan Trip', path: '/plan', icon: <Map className="w-5 h-5" /> },
        { name: 'Discover', path: '/recommendations', icon: <Sparkles className="w-5 h-5" /> },
        { name: 'Dashboard', path: '/dashboard', icon: <BookOpen className="w-5 h-5" /> },
        { name: 'Itinerary', path: '/itinerary', icon: <Compass className="w-5 h-5" /> },
        { name: 'Budget', path: '/budget', icon: <Wallet className="w-5 h-5" /> },
        { name: 'Packing List', path: '/packing-list', icon: <Umbrella className="w-5 h-5" /> },
    ];

    return (
        <div className="min-h-screen relative flex flex-col font-sans text-vintage-ink">
            {/* Vintage Header */}
            <header className="border-b-2 border-vintage-brass/40 bg-vintage-paper shadow-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">

                        <div className="flex items-center space-x-3">
                            <div className="p-2 border border-vintage-leather/30 rounded-full bg-white/70 shadow-sm">
                                <Plane className="w-6 h-6 text-vintage-accent transform -rotate-45" />
                            </div>
                            <div>
                                <Link to="/plan" className="text-2xl font-bold font-serif tracking-tight text-vintage-leather hover:text-vintage-ink transition-colors">
                                    TravelSphere
                                </Link>
                                <div className="text-xs text-vintage-ink/70 font-mono tracking-widest hidden sm:block">
                                    AROUND THE WORLD
                                </div>
                            </div>
                        </div>

                        <nav className="flex space-x-1 md:space-x-4">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path ||
                                    (item.path !== '/plan' && location.pathname.startsWith(item.path));

                                const tripId = searchParams.get('id');
                                const targetPath = (item.path !== '/plan' && tripId) ? `${item.path}?id=${tripId}` : item.path;

                                return (
                                    <Link
                                        key={item.name}
                                        to={targetPath}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-300 ${isActive
                                            ? 'bg-vintage-leather text-vintage-paper shadow-inner border border-vintage-ink/20'
                                            : 'text-vintage-leather/80 hover:bg-vintage-ink/10 hover:text-vintage-ink'
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="font-serif font-medium hidden sm:block">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="ml-4 flex items-center">
                            <ThemeSettings />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-vintage-brass/30 bg-vintage-paper py-6 text-center">
                <p className="text-vintage-ink/60 font-mono text-sm">
                    &copy; 1872 - {new Date().getFullYear()} TravelSphere Explorers Society
                </p>
            </footer>
        </div>
    );
}
