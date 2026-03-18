import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, User, ShieldCheck } from 'lucide-react';
import ThemeSettings from '../components/ThemeSettings';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Mocking auth
        setTimeout(() => {
            navigate('/plan');
        }, 800);
    };

    return (
        <div className="min-h-screen bg-vintage-paper font-sans text-vintage-ink flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] relative">
            <div className="absolute inset-0 z-0 bg-vintage-paper/80 dark:bg-vintage-ink/80 transition-colors"></div>

            <div className="absolute top-6 right-6 z-50">
                <ThemeSettings />
            </div>

            <div className="z-10 w-full max-w-md bg-white/80 dark:bg-vintage-ink/50 backdrop-blur border-2 border-vintage-brass/40 p-8 rounded shadow-2xl animate-in zoom-in-95 duration-500">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-block p-3 border border-vintage-leather/30 rounded-full bg-vintage-paper shadow-inner mb-4">
                        <ShieldCheck className="w-8 h-8 text-vintage-accent" />
                    </Link>
                    <h2 className="text-3xl font-bold font-serif text-vintage-leather tracking-tight">
                        {isLogin ? "Admittance Credentials" : "Registry of Members"}
                    </h2>
                    <p className="text-sm font-mono text-vintage-ink/60 mt-2 uppercase tracking-widest border-b border-vintage-brass/30 pb-4">
                        TravelSphere Explorers Society
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="block text-xs font-bold tracking-widest text-vintage-leather/80 uppercase">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-vintage-ink/40 w-5 h-5" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Phileas Fogg"
                                    className="w-full bg-white/50 border border-vintage-brass/40 rounded py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-vintage-leather font-mono text-vintage-ink placeholder-vintage-ink/30 transition-shadow"
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="block text-xs font-bold tracking-widest text-vintage-leather/80 uppercase">Telegraphic Address (Email)</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-vintage-ink/40 w-5 h-5" />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="explorer@travelsphere.co"
                                className="w-full bg-white/50 border border-vintage-brass/40 rounded py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-vintage-leather font-mono text-vintage-ink placeholder-vintage-ink/30 transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold tracking-widest text-vintage-leather/80 uppercase">Secret Cipher (Password)</label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-3.5 text-vintage-ink/40 w-5 h-5" />
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full bg-white/50 border border-vintage-brass/40 rounded py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-vintage-leather font-mono text-vintage-ink placeholder-vintage-ink/30 transition-shadow"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full vintage-button py-4 text-lg bg-vintage-leather text-vintage-paper hover:bg-vintage-ink active:scale-95 transition-all flex justify-center items-center shadow-md font-serif font-bold uppercase tracking-wider ${loading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {loading 
                            ? (isLogin ? "Authenticating..." : "Enclosing...")
                            : (isLogin ? "Authenticate" : "Enroll")}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm font-mono text-vintage-leather/80 hover:text-vintage-ink transition-colors underline decoration-vintage-brass decoration-2 underline-offset-4"
                    >
                        {isLogin 
                            ? "Not a member? Apply for society admittance here." 
                            : "Already holding credentials? Proceed to admittance."}
                    </button>
                </div>
            </div>
        </div>
    );
}
