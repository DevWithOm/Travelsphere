import { useEffect, useRef, useState } from 'react';

/**
 * AnimatedSection: Wraps children in scroll-triggered animation
 */
export function AnimatedSection({ children, className = '', animation = 'fadeUp', delay = 0, threshold = 0.1 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
            { threshold, rootMargin: '0px 0px -40px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    const animClass = visible ? `anim-visible anim-${animation}` : `anim-hidden anim-${animation}`;

    return (
        <div ref={ref} className={`${animClass} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    );
}

/**
 * StaggeredList: Animates children one by one
 */
export function StaggeredList({ children, className = '', staggerMs = 80, animation = 'fadeUp' }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
            { threshold: 0.05 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={className}>
            {Array.isArray(children) ? children.map((child, i) => (
                <div
                    key={i}
                    className={visible ? `anim-visible anim-${animation}` : `anim-hidden anim-${animation}`}
                    style={{ transitionDelay: `${i * staggerMs}ms` }}
                >
                    {child}
                </div>
            )) : children}
        </div>
    );
}

/**
 * AnimatedCounter: Counts up from 0 to target value
 */
export function AnimatedCounter({ value, duration = 1500, prefix = '', suffix = '', className = '' }) {
    const ref = useRef(null);
    const [display, setDisplay] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.unobserve(el); } },
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!started) return;
        const numericVal = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
        if (isNaN(numericVal)) { setDisplay(value); return; }

        let start = 0;
        const startTime = performance.now();
        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(numericVal * eased));
            if (progress < 1) requestAnimationFrame(animate);
            else setDisplay(numericVal);
        };
        requestAnimationFrame(animate);
    }, [started, value, duration]);

    return (
        <span ref={ref} className={`tabular-nums ${className}`}>
            {prefix}{typeof display === 'number' ? display.toLocaleString() : display}{suffix}
        </span>
    );
}

/**
 * ParticleField: Ambient particles in background
 */
export function ParticleField({ count = 30, color = 'vintage-brass' }) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {Array.from({ length: count }, (_, i) => (
                <div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full bg-${color}/20 particle-drift`}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 10}s`,
                        animationDuration: `${15 + Math.random() * 20}s`,
                    }}
                />
            ))}
        </div>
    );
}

/**
 * MagneticButton: Button that follows cursor magnetically
 */
export function MagneticButton({ children, className = '', strength = 0.3, ...props }) {
    const ref = useRef(null);

    const handleMouseMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
    };

    const handleMouseLeave = () => {
        const el = ref.current;
        if (el) el.style.transform = 'translate(0, 0)';
    };

    return (
        <button
            ref={ref}
            className={`transition-transform duration-300 ease-out ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {children}
        </button>
    );
}

/**
 * Shimmer loading skeleton
 */
export function Shimmer({ className = '', width = '100%', height = '20px' }) {
    return (
        <div
            className={`shimmer-loading rounded ${className}`}
            style={{ width, height }}
        />
    );
}

/**
 * PageTransition: Wraps page content with entry animation
 */
export function PageTransition({ children, className = '' }) {
    return (
        <div className={`page-transition-enter ${className}`}>
            {children}
        </div>
    );
}
