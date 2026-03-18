import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Map, MapPin, Clock, AlertCircle } from 'lucide-react';
import { getTrip } from '../api';

export default function Itinerary() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const tripId = searchParams.get('id');

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!tripId) {
            setTimeout(() => setLoading(false), 0);
            return;
        }

        getTrip(tripId)
            .then(res => {
                setTrip(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.response?.data?.detail || 'Expedition details missing from archives.');
                setLoading(false);
            });
    }, [tripId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-vintage-leather">
                <div className="w-12 h-12 border-4 border-vintage-brass/30 border-t-vintage-leather rounded-full animate-spin mb-4"></div>
                <p className="font-mono text-lg animate-pulse">Retrieving chroniques...</p>
            </div>
        );
    }

    if (error || !tripId) {
        return (
            <div className="vintage-card max-w-2xl mx-auto text-center py-12">
                <AlertCircle className="w-16 h-16 text-vintage-accent mx-auto mb-4" />
                <h2 className="text-3xl font-serif font-bold text-vintage-ink mb-2">Record Not Found</h2>
                <p className="text-vintage-ink/70 font-mono mb-6 pb-6 border-b border-vintage-brass/20">
                    {error || "It appears no trip identifier was provided to the clerk."}
                </p>
                <button onClick={() => navigate('/')} className="vintage-button">
                    Return to Planning Desk
                </button>
            </div>
        );
    }

    const renderActivity = (activityData, label, key) => {
        if (!activityData) return null;

        const isLegacy = typeof activityData === 'string';
        const description = isLegacy ? activityData : activityData.description;
        const time = isLegacy ? null : (activityData.time_slot || activityData.time);
        const location = isLegacy ? null : activityData.location;

        return (
            <div className="flex items-start pb-4 border-b border-vintage-brass/10 last:border-b-0 last:pb-0" key={key}>
                <div className="mt-1 mr-4 flex-shrink-0">
                    <div className="w-6 h-6 rounded-full border border-vintage-brass/40 bg-transparent flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-vintage-brass/20"></div>
                    </div>
                </div>
                <div className="w-full pt-0.5">
                    <p className="font-sans text-vintage-ink text-lg mb-1.5">{description || label}</p>
                    
                    {(!isLegacy && (time || location)) && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-vintage-ink/70 font-mono text-sm ml-1">
                            {time && (
                                <div className="flex items-center">
                                    <Clock className="w-3.5 h-3.5 mr-1.5 opacity-70 border border-vintage-ink/20 rounded-sm p-0.5" /> 
                                    {time}
                                </div>
                            )}
                            {location && (
                                <div className="flex items-center text-vintage-leather/90">
                                    <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-70" /> 
                                    {location}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">

            {/* Header */}
            <div className="vintage-card relative overflow-hidden bg-vintage-leather text-vintage-paper border-none border-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-vintage-ink/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end p-2 gap-4">
                    <div>
                        <span className="font-mono text-xs tracking-widest uppercase opacity-70 mb-1 block">Expedition Locale</span>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold">{trip.destination}</h1>
                    </div>
                    <div className="flex gap-4 font-mono text-sm opacity-90 border-t md:border-t-0 md:border-l border-vintage-paper/20 pt-4 md:pt-0 md:pl-4 w-full md:w-auto">
                        <div>
                            <span className="block text-[10px] uppercase tracking-widest opacity-70">Duration</span>
                            <span className="font-bold text-lg">{trip.days} Days</span>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase tracking-widest opacity-70">Budget Cap</span>
                            <span className="font-bold text-lg text-vintage-brass">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: trip.currency || 'USD' }).format(trip.budget)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Itinerary Timeline */}
            <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-vintage-ink border-b-2 border-vintage-brass/30 pb-2 inline-flex items-center">
                    <Map className="mr-2 w-6 h-6 text-vintage-leather" /> Detailed Chronology
                </h2>

                <div className="space-y-4">
                    {trip.itinerary && Array.isArray(trip.itinerary) && trip.itinerary.map((dayPlan, idx) => (
                        <div key={idx} className="vintage-card flex flex-col sm:flex-row gap-6 p-6 group">

                            <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-start justify-between sm:justify-start sm:w-28 border-b sm:border-b-0 sm:border-r border-vintage-brass/20 pb-4 sm:pb-0 sm:pr-4">
                                <div className="bg-vintage-ink text-vintage-paper font-serif font-bold w-16 h-12 flex items-center justify-center rounded-sm shadow-sm opacity-90 group-hover:bg-vintage-leather transition-colors text-sm text-center">
                                    {dayPlan.day}
                                </div>
                                <div className="flex items-center text-vintage-ink/50 sm:mt-4 font-mono text-xs">
                                    <Clock className="w-4 h-4 mr-1" /> Agenda
                                </div>
                            </div>

                            <div className="flex-grow space-y-4 pt-1 sm:pt-0 pb-2">
                                {dayPlan.activities && Array.isArray(dayPlan.activities) ? (
                                    dayPlan.activities.map((act, i) => {
                                        return renderActivity(act, act.label || `Activity ${i + 1}`, i);
                                    })
                                ) : (
                                    <>
                                        {renderActivity(dayPlan.morning_activity, 'Morning', 0)}
                                        {renderActivity(dayPlan.afternoon_activity, 'Afternoon', 1)}
                                        {renderActivity(dayPlan.evening_activity, 'Evening', 2)}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
