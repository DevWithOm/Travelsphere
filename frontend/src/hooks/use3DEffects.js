import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for 3D tilt card effect on mouse move
 */
export function useTilt3D(options = {}) {
    const { maxTilt = 15, scale = 1.05, speed = 400, glare = true } = options;
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
        el.style.transformStyle = 'preserve-3d';

        const handleMouseMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (maxTilt * (0.5 - y)).toFixed(2);
            const tiltY = (maxTilt * (x - 0.5)).toFixed(2);

            el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;

            // Update glare
            if (glare) {
                const glareEl = el.querySelector('.tilt-glare');
                if (glareEl) {
                    const angle = Math.atan2(e.clientX - (rect.left + rect.width / 2), -(e.clientY - (rect.top + rect.height / 2))) * (180 / Math.PI);
                    glareEl.style.transform = `rotate(${angle}deg) translate(-50%, -50%)`;
                    glareEl.style.opacity = ((x > 0.5 ? x : 1 - x) * 0.4).toFixed(2);
                }
            }
        };

        const handleMouseLeave = () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            if (glare) {
                const glareEl = el.querySelector('.tilt-glare');
                if (glareEl) glareEl.style.opacity = '0';
            }
        };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            el.removeEventListener('mousemove', handleMouseMove);
            el.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [maxTilt, scale, speed, glare]);

    return ref;
}

/**
 * Hook for parallax mouse-tracking on the entire container
 */
export function useParallaxMouse(strength = 20) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const layers = container.querySelectorAll('[data-parallax-depth]');

        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            layers.forEach((layer) => {
                const depth = parseFloat(layer.dataset.parallaxDepth) || 1;
                const moveX = x * strength * depth;
                const moveY = y * strength * depth;
                layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            });
        };

        const handleMouseLeave = () => {
            layers.forEach((layer) => {
                layer.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                layer.style.transform = 'translate3d(0, 0, 0)';
                setTimeout(() => { layer.style.transition = ''; }, 600);
            });
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [strength]);

    return containerRef;
}

/**
 * Hook for scroll-triggered 3D reveal animations
 */
export function useScrollReveal3D(options = {}) {
    const { threshold = 0.15, rootMargin = '0px', once = true } = options;
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('revealed-3d');
                    if (once) observer.unobserve(el);
                } else if (!once) {
                    el.classList.remove('revealed-3d');
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return ref;
}

/**
 * Hook to combine multiple refs
 */
export function useCombinedRefs(...refs) {
    const targetRef = useRef(null);

    useEffect(() => {
        refs.forEach((ref) => {
            if (!ref) return;
            if (typeof ref === 'function') {
                ref(targetRef.current);
            } else {
                ref.current = targetRef.current;
            }
        });
    }, [refs]);

    return targetRef;
}
