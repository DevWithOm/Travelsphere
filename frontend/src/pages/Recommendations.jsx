import { useState } from 'react';
import { Palmtree, DollarSign, Search, MapPin } from 'lucide-react';
import { getRuleBasedRecommendations } from '../api';

export default function Recommendations() {
    const [formData, setFormData] = useState({
        budget: 1000,
        currency: 'USD',
        interest: ''
    });
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const availableInterests = ['beach', 'mountains', 'adventure', 'city', 'culture', 'nature'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setRecommendations(null);

        try {
            const { data } = await getRuleBasedRecommendations(formData);
            setRecommendations(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch recommendations');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold font-serif text-vintage-leather tracking-tight border-b-2 border-vintage-brass/30 pb-4 flex items-center">
                <Palmtree className="mr-3 w-8 h-8" /> Destination Oracle
            </h1>

            <p className="text-lg text-vintage-ink/80 font-serif leading-relaxed">
                Unsure where your budget and passions might lead you? Consult our proprietary telegraphic oracle. Input your financial constraints and primary interest to reveal curated locales.
            </p>

            <form onSubmit={handleSubmit} className="vintage-card space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold tracking-widest text-vintage-leather/80 uppercase">Available Funds</label>
                        <div className="relative flex items-center">
                            <span className="absolute left-3 font-mono font-bold text-vintage-ink/40">{formData.currency}</span>
                            <input
                                type="number"
                                required
                                min="100"
                                value={formData.budget}
                                onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                                className="vintage-input pl-14 pr-2 !rounded-r-none"
                            />
                            <select
                                value={formData.currency}
                                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                className="bg-vintage-paper/70 border border-l-0 border-vintage-brass/40 rounded-r py-3 px-2 focus:outline-none focus:ring-2 focus:ring-vintage-leather font-mono text-vintage-ink font-bold"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="INR">INR</option>
                                <option value="CAD">CAD</option>
                                <option value="AUD">AUD</option>
                                <option value="JPY">JPY</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold tracking-widest text-vintage-leather/80 uppercase">Primary Interest</label>
                        <select
                            required
                            value={formData.interest}
                            onChange={e => setFormData({ ...formData, interest: e.target.value })}
                            className="vintage-input capitalize"
                        >
                            <option value="" disabled>Select an interest...</option>
                            {availableInterests.map(interest => (
                                <option key={interest} value={interest}>{interest}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="pt-4 border-t border-vintage-brass/20">
                    <button
                        type="submit"
                        disabled={loading || !formData.interest}
                        className={`w-full vintage-button py-4 text-lg bg-vintage-leather hover:bg-vintage-ink transition-colors flex justify-center items-center ${loading || !formData.interest ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <span className="flex items-center space-x-2">
                                <span className="w-5 h-5 border-t-2 border-white/80 rounded-full animate-spin"></span>
                                <span>Consulting Oracle...</span>
                            </span>
                        ) : (
                            <span><Search className="w-5 h-5 inline mr-2" /> Seek Destinations</span>
                        )}
                    </button>
                </div>
            </form>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
                    Error consulting oracle: {error}
                </div>
            )}

            {recommendations && (
                <div className="space-y-6 mt-8 animate-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-bold font-serif text-vintage-ink flex items-center">
                        <MapPin className="mr-2 w-6 h-6 text-vintage-leather" /> Discovered Locales
                    </h2>
                    <p className="text-sm text-vintage-ink/60 font-mono">
                        Category: <span className="text-vintage-leather font-bold">{recommendations.recommendation_category}</span> · 
                        Budget: {new Intl.NumberFormat('en-US', { style: 'currency', currency: recommendations.input_currency || 'USD' }).format(recommendations.input_budget)} · 
                        Interest: <span className="capitalize">{recommendations.input_interest}</span>
                    </p>

                    {recommendations.recommended_destinations.length === 0 ? (
                        <p className="text-vintage-ink/70 italic font-serif">Alas, no destinations match these specific criteria.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {recommendations.recommended_destinations.map((dest, idx) => (
                                <div key={idx} className="vintage-card p-0 overflow-hidden flex flex-col hover:shadow-xl transition-shadow group">
                                    <div className="h-48 overflow-hidden relative">
                                        <img 
                                            src={dest.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'} 
                                            alt={dest.name} 
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.onerror = null; 
                                                e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800';
                                            }}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[10%] group-hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-vintage-leather/40 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4">
                                            <h3 className="text-2xl font-bold font-serif text-white drop-shadow-md">{dest.name}</h3>
                                        </div>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <div className="space-y-1">
                                            <span className="block text-[10px] uppercase font-bold tracking-[0.2em] text-vintage-leather/60">Famous For</span>
                                            <p className="font-serif text-vintage-ink leading-relaxed italic">{dest.famous_for}</p>
                                        </div>
                                        <div className="pt-4 flex items-center justify-between border-t border-vintage-brass/20">
                                            <span className="text-[10px] font-mono uppercase tracking-widest text-vintage-ink/40">
                                                {recommendations.input_interest} · {recommendations.recommendation_category}
                                            </span>
                                            <a 
                                                href={`https://www.google.com/search?q=${encodeURIComponent(dest.name + ' travel guide ' + recommendations.input_interest)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs font-bold text-vintage-leather hover:text-vintage-accent transition-colors flex items-center gap-1 group/btn"
                                            >
                                                Explore Guide <Search className="w-3 h-3 group-hover/btn:scale-110" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
