import { useState } from 'react';
import { Sparkles, Umbrella, Shield, MonitorSmartphone, Shirt } from 'lucide-react';
import { getAIPackingList } from '../api';

export default function PackingList() {
    const [formData, setFormData] = useState({ destination: '', days: 1, weather: 'sunny' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [packingList, setPackingList] = useState(null);

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPackingList(null);

        try {
            const { data } = await getAIPackingList(formData.destination, formData.days, formData.weather);
            setPackingList(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate packing list.');
        } finally {
            setLoading(false);
        }
    };

    const CategoryCard = ({ title, items, icon: Icon, colorClass }) => (
        <div className="vintage-card bg-white/60">
            <h3 className={`text-lg font-serif font-bold mb-4 flex items-center border-b pb-2 ${colorClass}`}>
                <Icon className="w-5 h-5 mr-2" /> {title}
            </h3>
            {items && items.length > 0 ? (
                <ul className="space-y-2">
                    {items.map((item, idx) => (
                        <li key={idx} className="flex items-start font-mono text-sm text-vintage-ink/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-vintage-brass mt-1.5 mr-2 flex-shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="font-mono text-sm text-vintage-ink/50 italic">No items identified.</p>
            )}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
                <h1 className="text-4xl font-serif font-bold text-vintage-ink mb-4">AI Packing List Generator</h1>
                <p className="text-lg text-vintage-leather/80 font-mono">
                    Ensure your trunk is optimally packed for any expedition. Let our AI curator build a bespoke list based on your plans.
                </p>
            </div>

            <div className="vintage-card max-w-3xl mx-auto bg-gradient-to-br from-white/80 to-vintage-brass/10 mb-12">
                <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold tracking-widest text-vintage-leather/80 uppercase mb-2">Destination</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Paris"
                            value={formData.destination}
                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            className="vintage-input"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold tracking-widest text-vintage-leather/80 uppercase mb-2">Duration (Days)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={formData.days}
                            onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) || '' })}
                            className="vintage-input"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold tracking-widest text-vintage-leather/80 uppercase mb-2">Weather</label>
                        <select
                            value={formData.weather}
                            onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                            className="vintage-input appearance-none"
                        >
                            <option value="sunny">Sunny / Hot</option>
                            <option value="cold">Cold / Snow</option>
                            <option value="rainy">Rainy / Wet</option>
                            <option value="mild">Mild / Temperate</option>
                        </select>
                    </div>
                    <div className="md:col-span-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full vintage-button shadow-md flex justify-center items-center py-3 text-lg transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                        >
                            {loading ? (
                                <><div className="w-5 h-5 border-2 border-vintage-paper/30 border-t-vintage-paper rounded-full animate-spin mr-3"></div> Generating...</>
                            ) : (
                                <><Sparkles className="mr-2 w-5 h-5" /> Generate Packing List</>
                            )}
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-600 mt-4 text-center font-mono text-sm">{error}</p>}
            </div>

            {packingList && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
                    <CategoryCard title="Clothes" items={packingList.clothes} icon={Shirt} colorClass="text-indigo-700 border-indigo-200" />
                    <CategoryCard title="Electronics" items={packingList.electronics} icon={MonitorSmartphone} colorClass="text-emerald-700 border-emerald-200" />
                    <CategoryCard title="Essentials" items={packingList.essentials} icon={Umbrella} colorClass="text-amber-700 border-amber-200" />
                    <CategoryCard title="Documents" items={packingList.documents} icon={Shield} colorClass="text-rose-700 border-rose-200" />
                </div>
            )}
        </div>
    );
}
