import { Link } from 'react-router-dom';
import { Compass, Map, Clock, Globe, ChevronDown, Sparkles } from 'lucide-react';
import ThemeSettings from '../components/ThemeSettings';
import Globe3D from '../components/Globe3D';
import FloatingIcons3D from '../components/FloatingIcons3D';
import TiltCard3D from '../components/TiltCard3D';
import { useParallaxMouse, useScrollReveal3D } from '../hooks/use3DEffects';
import { useEffect, useRef, useState } from 'react';

export default function Landing() {
    const parallaxRef = useParallaxMouse(30);
    const featuresRevealRef = useScrollReveal3D({ threshold: 0.2 });
    const actionsRevealRef = useScrollReveal3D({ threshold: 0.3 });
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-[200vh] bg-vintage-paper font-sans text-vintage-ink selection:bg-vintage-accent/30 relative overflow-hidden">
            {/* Background Texture */}
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

            {/* Floating Icons 3D Background */}
            <FloatingIcons3D />
            
            {/* Theme Settings */}
            <div className="absolute top-6 right-6 z-50">
                <ThemeSettings />
            </div>

            {/* ===== HERO SECTION ===== */}
            <section 
                ref={parallaxRef}
                className="min-h-screen flex flex-col items-center justify-center p-6 relative"
                style={{ perspective: '1200px' }}
            >
                {/* Animated gradient orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div 
                        className="gradient-orb gradient-orb-1" 
                        data-parallax-depth="3"
                        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                    />
                    <div 
                        className="gradient-orb gradient-orb-2" 
                        data-parallax-depth="2"
                        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
                    />
                    <div 
                        className="gradient-orb gradient-orb-3" 
                        data-parallax-depth="1.5"
                        style={{ transform: `translateY(${scrollY * 0.05}px)` }}
                    />
                </div>

                <div className="z-10 max-w-5xl w-full flex flex-col items-center hero-entrance">
                    {/* 3D Globe */}
                    <div 
                        className="mb-8 globe-float"
                        data-parallax-depth="2"
                        style={{
                            transform: `translateY(${scrollY * -0.2}px) rotateX(${scrollY * 0.02}deg)`,
                        }}
                    >
                        <Globe3D size={280} />
                    </div>

                    {/* Title with 3D depth */}
                    <div 
                        className="text-center space-y-6"
                        data-parallax-depth="0.5"
                        style={{
                            transform: `translateY(${scrollY * -0.1}px)`,
                        }}
                    >
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold font-serif text-vintage-leather tracking-tighter mix-blend-multiply hero-title-3d">
                            <span className="inline-block title-char-anim" style={{ animationDelay: '0.1s' }}>T</span>
                            <span className="inline-block title-char-anim" style={{ animationDelay: '0.15s' }}>r</span>
                            <span className="inline-block title-char-anim" style={{ animationDelay: '0.2s' }}>a</span>
                            <span className="inline-block title-char-anim" style={{ animationDelay: '0.25s' }}>v</span>
                            <span className="inline-block title-char-anim" style={{ animationDelay: '0.3s' }}>e</span>
                            <span className="inline-block title-char-anim" style={{ animationDelay: '0.35s' }}>l</span>
                            <span className="inline-block title-char-anim" style={{ animationDelay: '0.4s' }}>S</span>
                            <span className="inline-block title-char-anim" style={{ animationDelay: '0.45s' }}>p</span>
                            <span className="inline-block title-char-anim" style={{ animationDelay: '0.5s' }}>h</span>
                            <span className="inline-block title-char-anim" style={{ animationDelay: '0.55s' }}>e</span>
                            <span className="inline-block title-char-anim" style={{ animationDelay: '0.6s' }}>r</span>
                            <span className="inline-block title-char-anim" style={{ animationDelay: '0.65s' }}>e</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-vintage-ink/80 font-serif max-w-2xl mx-auto leading-relaxed italic opacity-0 hero-subtitle-anim">
                            "Around the world in eighty days..."
                        </p>
                        <p className="text-lg text-vintage-ink/60 font-mono max-w-xl mx-auto uppercase tracking-widest border-y border-vintage-brass/30 py-4 opacity-0 hero-tagline-anim">
                            The Premier Dispatch System for the Modern Explorer
                        </p>
                    </div>

                    {/* CTA Buttons with 3D effect */}
                    <div 
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12 opacity-0 hero-cta-anim"
                        data-parallax-depth="0.3"
                    >
                        <Link 
                            to="/auth" 
                            className="group relative w-full sm:w-auto px-10 py-5 bg-vintage-leather text-vintage-paper font-bold font-serif text-xl rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 text-center border-2 border-transparent overflow-hidden cta-3d-button"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                                Commence Journey
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-vintage-accent to-vintage-leather opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </Link>
                        <Link 
                            to="/plan" 
                            className="w-full sm:w-auto px-10 py-5 bg-transparent text-vintage-leather font-bold font-serif text-xl rounded-lg hover:bg-vintage-leather/10 transition-all border-2 border-vintage-leather text-center backdrop-blur-sm cta-3d-button"
                        >
                            Guest Telegraph
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div 
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator"
                    style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
                >
                    <div className="flex flex-col items-center gap-2 text-vintage-ink/40 font-mono text-xs uppercase tracking-widest">
                        <span>Scroll to explore</span>
                        <ChevronDown className="w-5 h-5 animate-bounce" />
                    </div>
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section 
                ref={featuresRevealRef}
                className="min-h-screen flex items-center justify-center px-6 py-20 relative scroll-reveal-3d"
                style={{ perspective: '1200px' }}
            >
                <div className="max-w-5xl w-full space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold font-serif text-vintage-leather reveal-item" style={{ '--reveal-delay': '0s' }}>
                            Your Journey, Reimagined
                        </h2>
                        <p className="text-lg text-vintage-ink/60 font-mono max-w-2xl mx-auto reveal-item" style={{ '--reveal-delay': '0.15s' }}>
                            Experience travel planning with intelligence and elegance
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
                        <TiltCard3D className="bg-white/40 dark:bg-white/5 p-8 rounded-xl border border-vintage-brass/30 text-center shadow-lg backdrop-blur-sm reveal-item" maxTilt={15}>
                            <div className="feature-icon-wrapper mx-auto mb-6">
                                <Map className="w-12 h-12 text-vintage-leather feature-icon" />
                            </div>
                            <h3 className="font-bold font-serif text-xl mb-3 text-vintage-ink">Bespoke Itineraries</h3>
                            <p className="text-sm font-mono text-vintage-ink/70 leading-relaxed">Curated routes mapping every juncture of your global expedition with AI precision.</p>
                        </TiltCard3D>

                        <TiltCard3D className="bg-white/40 dark:bg-white/5 p-8 rounded-xl border border-vintage-brass/30 text-center shadow-lg backdrop-blur-sm reveal-item md:-translate-y-6" maxTilt={15}>
                            <div className="feature-icon-wrapper mx-auto mb-6">
                                <Compass className="w-12 h-12 text-vintage-leather feature-icon" />
                            </div>
                            <h3 className="font-bold font-serif text-xl mb-3 text-vintage-ink">Intelligent Guidance</h3>
                            <p className="text-sm font-mono text-vintage-ink/70 leading-relaxed">Mechanical precision tailored to your distinctive predilections and desires.</p>
                        </TiltCard3D>

                        <TiltCard3D className="bg-white/40 dark:bg-white/5 p-8 rounded-xl border border-vintage-brass/30 text-center shadow-lg backdrop-blur-sm reveal-item" maxTilt={15}>
                            <div className="feature-icon-wrapper mx-auto mb-6">
                                <Clock className="w-12 h-12 text-vintage-leather feature-icon" />
                            </div>
                            <h3 className="font-bold font-serif text-xl mb-3 text-vintage-ink">Timely Execution</h3>
                            <p className="text-sm font-mono text-vintage-ink/70 leading-relaxed">Punctual ledgers and budget manifests for the disciplined traveler.</p>
                        </TiltCard3D>
                    </div>
                </div>
            </section>

            {/* ===== STATS / BOTTOM SECTION ===== */}
            <section 
                ref={actionsRevealRef}
                className="flex items-center justify-center px-6 py-20 relative scroll-reveal-3d"
            >
                <div className="max-w-4xl w-full">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: '150+', label: 'Destinations', delay: '0s' },
                            { value: '50K+', label: 'Explorers', delay: '0.1s' },
                            { value: '1872', label: 'Established', delay: '0.2s' },
                            { value: '∞', label: 'Adventures', delay: '0.3s' },
                        ].map((stat) => (
                            <TiltCard3D 
                                key={stat.label}
                                className="bg-white/30 dark:bg-white/5 p-6 rounded-xl border border-vintage-brass/20 text-center backdrop-blur-sm reveal-item" 
                                maxTilt={12}
                            >
                                <div className="text-3xl md:text-4xl font-bold font-serif text-vintage-accent mb-2 stat-counter">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-mono text-vintage-ink/60 uppercase tracking-widest">
                                    {stat.label}
                                </div>
                            </TiltCard3D>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <div className="text-center text-vintage-ink/40 font-mono text-xs uppercase tracking-widest z-0 pb-8">
                Est. 1872 • London • Paris • Bombay • Yokohama • New York
            </div>
        </div>
    );
}
