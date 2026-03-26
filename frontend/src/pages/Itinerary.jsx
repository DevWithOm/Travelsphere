import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Map, MapPin, Clock, AlertCircle, Star, Navigation, ExternalLink, Route } from 'lucide-react';
import { getTrip } from '../api';
import { AnimatedSection, StaggeredList, PageTransition, Shimmer } from '../components/AnimatedUI';
import ItineraryChatbot from '../components/ItineraryChatbot';

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

    const handleItineraryUpdate = (updatedItinerary) => {
        setTrip(prev => ({ ...prev, itinerary: updatedItinerary }));
    };

    if (loading) {
        return (
            <PageTransition>
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="vintage-card bg-vintage-leather/80 p-8">
                        <Shimmer height="16px" width="120px" className="mb-2" />
                        <Shimmer height="44px" width="300px" />
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="vintage-card p-6 space-y-4">
                            <Shimmer height="48px" width="80px" />
                            <Shimmer height="20px" width="90%" />
                            <Shimmer height="16px" width="60%" />
                        </div>
                    ))}
                </div>
            </PageTransition>
        );
    }

    if (error || !tripId) {
        return (
            <PageTransition>
                <AnimatedSection animation="scaleUp">
                    <div className="vintage-card max-w-2xl mx-auto text-center py-12">
                        <div className="icon-bounce inline-block mb-4">
                            <AlertCircle className="w-16 h-16 text-vintage-accent" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-vintage-ink mb-2">Record Not Found</h2>
                        <p className="text-vintage-ink/70 font-mono mb-6 pb-6 border-b border-vintage-brass/20">
                            {error || "It appears no trip identifier was provided to the clerk."}
                        </p>
                        <button onClick={() => navigate('/')} className="vintage-button submit-btn-3d">
                            Return to Planning Desk
                        </button>
                    </div>
                </AnimatedSection>
            </PageTransition>
        );
    }

    const renderActivity = (activityData, label, key) => {
        if (!activityData) return null;

        const isLegacy = typeof activityData === 'string';
        const description = isLegacy ? activityData : activityData.description;
        const time = isLegacy ? null : (activityData.time_slot || activityData.time);
        const location = isLegacy ? null : activityData.location;
        const reviews = isLegacy ? null : activityData.reviews_summary;
        const distance = isLegacy ? null : activityData.distance_to_next;
        const travelRec = isLegacy ? null : activityData.travel_recommendation;

        const openInMaps = (loc) => {
            if (!loc) return;
            const query = encodeURIComponent(`${loc}, ${trip.destination}`);
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
        };

        return (
            <div className="flex flex-col pb-6 border-l-2 border-vintage-brass/20 ml-[11px] pl-6 relative last:pb-0" key={key}>
                {/* Timeline Node */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border border-vintage-brass/40 bg-vintage-paper flex items-center justify-center timeline-dot">
                    <div className="w-1.5 h-1.5 rounded-full bg-vintage-brass/50"></div>
                </div>

                <div className="w-full bg-vintage-paper/50 rounded-lg p-4 border border-vintage-brass/10 hover:border-vintage-leather/30 transition-colors shadow-sm relative group">
                    <div className="flex justify-between items-start mb-2">
                        <p className="font-serif text-vintage-ink font-bold text-lg">{label}</p>
                        {time && (
                            <div className="flex items-center text-vintage-ink/70 font-mono text-xs bg-vintage-paper/60 px-2 py-1 rounded shadow-sm">
                                <Clock className="w-3 h-3 mr-1" /> {time}
                            </div>
                        )}
                    </div>

                    <p className="font-sans text-vintage-ink/90 text-sm mb-3">{description}</p>
                    
                    {(!isLegacy && location) && (
                        <div className="space-y-2 mt-4 pt-3 border-t border-vintage-brass/10">
                            {/* Location & Maps Button */}
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center text-vintage-leather/90 font-mono text-xs font-bold">
                                    <MapPin className="w-4 h-4 mr-1.5" /> 
                                    {location}
                                </div>
                                <button 
                                    onClick={() => openInMaps(location)}
                                    className="flex items-center text-[10px] uppercase tracking-widest bg-vintage-sky/10 text-vintage-sky hover:bg-vintage-sky hover:text-white transition-colors px-2 py-1 rounded border border-vintage-sky/20"
                                >
                                    <ExternalLink className="w-3 h-3 mr-1" /> Google Maps
                                </button>
                            </div>

                            {/* Dynamic Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                {reviews && reviews !== 'N/A' && (
                                    <div className="flex items-start text-xs font-mono text-vintage-accent bg-vintage-accent/10 p-2 rounded">
                                        <Star className="w-3.5 h-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
                                        <span>{reviews}</span>
                                    </div>
                                )}
                                
                                {(distance || travelRec) && (distance !== 'N/A' || travelRec !== 'N/A') && (
                                    <div className="flex flex-col text-xs font-mono text-vintage-sky bg-vintage-sky/10 p-2 rounded">
                                        {distance && distance !== 'N/A' && (
                                            <span className="flex items-center mb-1">
                                                <Route className="w-3.5 h-3.5 mr-1.5" /> Next: {distance}
                                            </span>
                                        )}
                                        {travelRec && travelRec !== 'N/A' && (
                                            <span className="flex items-start mt-0.5">
                                                <Navigation className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 mt-0.5" /> {travelRec}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <AnimatedSection animation="fadeUp">
                    <div className="vintage-card relative overflow-hidden bg-vintage-leather text-vintage-paper border-none border-0 hover-glow">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-vintage-ink/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-vintage-accent/5 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end p-2 gap-4">
                            <div>
                                <span className="font-mono text-xs tracking-widest uppercase opacity-70 mb-1 block">Expedition Locale</span>
                                <h1 className="text-4xl md:text-5xl font-serif font-bold text-vintage-paper">{trip.destination}</h1>
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
                </AnimatedSection>

                {/* Itinerary Timeline */}
                <div className="space-y-6 pt-4">
                    <h2 className="text-2xl font-serif font-bold text-vintage-ink border-b-2 border-vintage-brass/30 pb-2 inline-flex items-center">
                        <Map className="mr-2 w-6 h-6 text-vintage-leather" /> Detailed Chronology
                    </h2>

                    <StaggeredList className="space-y-4" staggerMs={150} animation="slideRight">
                        {trip.itinerary && Array.isArray(trip.itinerary) && trip.itinerary.map((dayPlan, idx) => (
                            <div key={idx} className="vintage-card flex flex-col sm:flex-row gap-6 p-6 group hover-glow timeline-card">
                                {/* Animated timeline connector */}
                                <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-start justify-between sm:justify-start sm:w-28 pb-4 sm:pb-0 sm:pr-4">
                                    <div className="bg-vintage-ink text-vintage-paper font-serif font-bold w-16 h-12 flex items-center justify-center rounded-sm shadow-sm opacity-90 group-hover:bg-vintage-leather group-hover:scale-110 transition-all duration-300 text-sm text-center">
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
                    </StaggeredList>
                </div>

                {trip && <ItineraryChatbot trip={trip} onItineraryUpdate={handleItineraryUpdate} />}
            </div>
        </PageTransition>
    );
}
