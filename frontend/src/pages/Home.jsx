import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaneTakeoff, MapPin, Calendar, DollarSign, Tag, Navigation, Calculator } from 'lucide-react';
import { planTrip, estimateBudget } from '../api';

export default function Home() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        destination: '',
        budget: 1000,
        currency: 'USD',
        days: 7,
        interests: []
    });
    const [userOrigin, setUserOrigin] = useState('');
    const [estimatingBudget, setEstimatingBudget] = useState(false);
    const [trackingLocation, setTrackingLocation] = useState(false);

    const handleTrackLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }
        setTrackingLocation(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await res.json();
                const city = data.address.city || data.address.town || data.address.village || data.address.county || '';
                const country = data.address.country || '';
                const locationString = [city, country].filter(Boolean).join(', ');
                setUserOrigin(locationString || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
            } catch (err) {
                console.error("Failed to reverse geocode:", err);
                setUserOrigin(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            } finally {
                setTrackingLocation(false);
            }
        }, () => {
            alert('Unable to retrieve your location');
            setTrackingLocation(false);
        });
    };

    const handleEstimateBudget = async () => {
        if (!formData.destination || !userOrigin || !formData.days) {
            alert("Please provide the Destination, Origin, and Duration to calculate an estimate.");
            return;
        }
        setEstimatingBudget(true);
        try {
            const res = await estimateBudget({
                destination: formData.destination,
                origin: userOrigin,
                days: formData.days,
                currency: formData.currency
            });
            if (res.data?.estimated_budget) {
                setFormData(prev => ({ ...prev, budget: res.data.estimated_budget }));
            }
        } catch (error) {
            console.error("Failed to estimate budget:", error);
            alert("Failed to estimate budget. The clerk might be overwhelmed.");
        } finally {
            setEstimatingBudget(false);
        }
    };

    const availableInterests = ['History', 'Food', 'Nature', 'Culture', 'Adventure', 'Relaxation'];

    const handleInterestToggle = (interest) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: trip } = await planTrip(formData);
            const tripId = trip?.id || trip?._id;
            if (tripId) {
                navigate(`/itinerary?id=${tripId}`);
            }
        } catch (error) {
            console.error("Failed to plan trip:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700">

            {/* Hero Section */}
            <section className="text-center space-y-4 max-w-3xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold font-serif text-vintage-leather tracking-tight">
                    Where will your next <br /><span className="text-vintage-accent italic">Expedition</span> take you?
                </h1>
                <p className="text-lg text-vintage-ink/80 font-serif max-w-2xl mx-auto leading-relaxed">
                    Chart your course across the globe. Our intelligent telegraphic system will curate a bespoke journey tailored to your distinct predilections and financial bounds.
                </p>
            </section>

            {/* Form Section */}
            <section className="vintage-card max-w-2xl mx-auto">
                <div className="absolute -top-4 -right-4 bg-vintage-accent text-vintage-paper rounded-full w-12 h-12 flex items-center justify-center shadow-lg transform rotate-12 border-2 border-vintage-paper">
                    <PlaneTakeoff className="w-6 h-6" />
                </div>

                <h2 className="text-2xl font-bold font-serif mb-6 text-vintage-ink flex items-center">
                    <MapPin className="mr-2 text-vintage-leather w-6 h-6" /> Manifest your Voyage
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold tracking-widest text-vintage-leather/80 uppercase">Destination</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={formData.destination}
                                    onChange={e => setFormData({ ...formData, destination: e.target.value })}
                                    placeholder="e.g. Paris, Kyoto"
                                    className="vintage-input"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-bold tracking-widest text-vintage-leather/80 uppercase">Origin</label>
                                <button type="button" onClick={handleTrackLocation} disabled={trackingLocation} className={`text-xs font-bold font-mono py-0.5 px-2 rounded tracking-wider flex items-center transition-colors ${trackingLocation ? 'text-vintage-brass/50 bg-vintage-brass/10 border border-vintage-brass/20' : 'text-vintage-sky/80 bg-vintage-sky/10 border border-vintage-sky/30 hover:bg-vintage-sky hover:text-white'}`}>
                                    <Navigation className={`w-3 h-3 mr-1 ${trackingLocation ? 'animate-spin' : ''}`} />
                                    {trackingLocation ? 'Tracking...' : 'Live Location'}
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={userOrigin}
                                    onChange={e => setUserOrigin(e.target.value)}
                                    placeholder="e.g. New York, USA"
                                    className="vintage-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold tracking-widest text-vintage-leather/80 uppercase">Budget ($)</label>
                            <div className="relative flex items-center">
                                <DollarSign className="absolute left-3 text-vintage-ink/40 w-5 h-5" />
                                <input
                                    type="number"
                                    required
                                    min="100"
                                    value={formData.budget}
                                    onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                                    className="vintage-input pl-10 pr-2 !rounded-r-none"
                                />
                                <select
                                    value={formData.currency}
                                    onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                    className="bg-vintage-paper/70 border border-l-0 border-vintage-brass/40 rounded-r py-3 px-2 focus:outline-none focus:ring-2 focus:ring-vintage-leather font-mono text-vintage-ink font-bold hover:bg-vintage-paper transition-colors"
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
                            <button type="button" onClick={handleEstimateBudget} disabled={estimatingBudget} className={`mt-2 w-full text-xs font-bold font-mono py-1.5 px-3 rounded tracking-wider flex items-center justify-center transition-colors border ${estimatingBudget ? 'text-vintage-brass/50 bg-vintage-brass/10 border-vintage-brass/20 cursor-wait' : 'text-vintage-leather/80 bg-vintage-leather/10 border-vintage-leather/30 hover:bg-vintage-leather hover:text-white'}`}>
                                <Calculator className="w-3.5 h-3.5 mr-1" />
                                {estimatingBudget ? 'Calculating Estimates...' : 'AI Budget Estimator'}
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold tracking-widest text-vintage-leather/80 uppercase">Duration (Days)</label>
                            <div className="relative flex items-center">
                                <Calendar className="absolute left-3 text-vintage-ink/40 w-5 h-5" />
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="80"
                                    value={formData.days}
                                    onChange={e => setFormData({ ...formData, days: Number(e.target.value) })}
                                    className="vintage-input pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-bold tracking-widest text-vintage-leather/80 uppercase flex items-center">
                            <Tag className="w-4 h-4 mr-1" /> Purviews of Interest
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableInterests.map(interest => (
                                <button
                                    key={interest}
                                    type="button"
                                    onClick={() => handleInterestToggle(interest)}
                                    className={`px-4 py-2 rounded border transition-all duration-200 font-serif text-sm ${formData.interests.includes(interest)
                                            ? 'bg-vintage-sky text-white border-vintage-sky shadow-inner'
                                            : 'bg-white/40 border-vintage-brass/30 text-vintage-ink/70 hover:bg-white/70 hover:border-vintage-leather/40'
                                        }`}
                                >
                                    {interest}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-vintage-brass/20">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full vintage-button py-4 text-lg bg-vintage-leather hover:bg-vintage-ink transition-colors flex justify-center items-center ${loading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center space-x-2">
                                    <span className="w-5 h-5 border-t-2 border-white/80 rounded-full animate-spin"></span>
                                    <span>Telegraphing Central Intelligence...</span>
                                </span>
                            ) : (
                                <span>Commence Planning</span>
                            )}
                        </button>
                    </div>
                </form>
            </section>

        </div>
    );
}
