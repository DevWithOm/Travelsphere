import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, DollarSign, MapPin } from 'lucide-react';
import { getAllTrips } from '../api';
import { AnimatedSection, StaggeredList, PageTransition, ParticleField, Shimmer } from '../components/AnimatedUI';

export default function Dashboard() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const { data } = await getAllTrips();
                setTrips(data);
            } catch (err) {
                setError(err.response?.data?.detail || 'Failed to fetch trips');
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    if (loading) {
        return (
            <PageTransition>
                <div className="space-y-8">
                    <Shimmer height="48px" width="350px" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="vintage-card space-y-4">
                                <Shimmer height="28px" width="70%" />
                                <Shimmer height="16px" width="40%" />
                                <Shimmer height="16px" width="50%" />
                                <div className="flex gap-2 pt-4 border-t border-vintage-brass/20">
                                    <Shimmer height="24px" width="60px" />
                                    <Shimmer height="24px" width="80px" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </PageTransition>
        );
    }

    if (error) {
        return (
            <PageTransition>
                <AnimatedSection animation="scaleUp">
                    <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
                        Error loading expeditions: {error}
                    </div>
                </AnimatedSection>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="space-y-8 relative">
                <ParticleField count={15} />

                <AnimatedSection animation="fadeUp">
                    <h1 className="text-4xl font-bold font-serif text-vintage-leather tracking-tight border-b-2 border-vintage-brass/30 pb-4 flex items-center">
                        <BookOpen className="mr-3 w-8 h-8" /> Your Expeditions
                    </h1>
                </AnimatedSection>

                {trips.length === 0 ? (
                    <AnimatedSection animation="scaleUp" delay={200}>
                        <div className="text-center py-12 vintage-card hover-glow">
                            <div className="w-20 h-20 rounded-full bg-vintage-brass/10 flex items-center justify-center mx-auto mb-6 icon-bounce">
                                <MapPin className="w-8 h-8 text-vintage-leather/50" />
                            </div>
                            <p className="text-vintage-ink/70 text-lg font-serif mb-4">No expeditions charted yet.</p>
                            <Link to="/" className="vintage-button inline-flex items-center submit-btn-3d">
                                <MapPin className="mr-2 w-5 h-5" /> Plan a New Voyage
                            </Link>
                        </div>
                    </AnimatedSection>
                ) : (
                    <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerMs={120}>
                        {trips.map((trip) => (
                            <Link 
                                key={trip.id || trip._id} 
                                to={`/itinerary?id=${trip.id || trip._id}`}
                                className="vintage-card hover:scale-[1.03] transition-all duration-500 cursor-pointer group hover-glow card-3d-hover"
                            >
                                <h2 className="text-2xl font-bold font-serif text-vintage-ink mb-2 group-hover:text-vintage-accent transition-colors">
                                    {trip.destination}
                                </h2>
                                <div className="space-y-2 text-vintage-ink/80 text-sm">
                                    <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {trip.days} Days</p>
                                    <p className="flex items-center"><DollarSign className="w-4 h-4 mr-2" /> {new Intl.NumberFormat('en-US', { style: 'currency', currency: trip.currency || 'USD' }).format(trip.budget)}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-vintage-brass/30 flex flex-wrap gap-1">
                                    {trip.interests?.map(i => (
                                        <span key={i} className="text-xs bg-vintage-brass/20 text-vintage-leather px-2 py-1 rounded font-mono">
                                            {i}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        ))}
                    </StaggeredList>
                )}
            </div>
        </PageTransition>
    );
}
