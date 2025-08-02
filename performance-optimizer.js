// Performance Optimizer - אופטימיזציה לביצועים
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.optimizeFonts();
        this.optimizeAnimations();
        this.setupLazyLoading();
        this.optimizeStorage();
        this.setupErrorHandling();
    }

    // אופטימיזציה לתמונות
    optimizeImages() {
        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // אופטימיזציה לפונטים
    optimizeFonts() {
        // Preload critical fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }

    // אופטימיזציה לאנימציות
    optimizeAnimations() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.1s');
        }

        // Optimize animations for better performance
        const style = document.createElement('style');
        style.textContent = `
            * {
                will-change: auto;
            }
            .animated {
                will-change: transform, opacity;
            }
        `;
        document.head.appendChild(style);
    }

    // Lazy loading
    setupLazyLoading() {
        // Lazy load non-critical resources
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.loadNonCriticalResources();
            }, 1000);
        });
    }

    loadNonCriticalResources() {
        // Load additional resources after page load
        const resources = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-solid-900.woff2'
        ];

        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    // אופטימיזציה לאחסון
    optimizeStorage() {
        // Clean up old data periodically
        setInterval(() => {
            this.cleanupOldData();
        }, 24 * 60 * 60 * 1000); // Once per day
    }

    cleanupOldData() {
        try {
            const keys = Object.keys(localStorage);
            const now = Date.now();
            const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

            keys.forEach(key => {
                if (key.startsWith('temp_') || key.startsWith('cache_')) {
                    const item = localStorage.getItem(key);
                    if (item) {
                        try {
                            const data = JSON.parse(item);
                            if (data.timestamp && (now - data.timestamp) > maxAge) {
                                localStorage.removeItem(key);
                            }
                        } catch (e) {
                            // Remove invalid data
                            localStorage.removeItem(key);
                        }
                    }
                }
            });
        } catch (e) {
            console.warn('Storage cleanup failed:', e);
        }
    }

    // טיפול בשגיאות
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.reportError(event.error);
        });

        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.reportError(event.reason);
        });
    }

    reportError(error) {
        // Send error to analytics (if configured)
        if (window.gtag) {
            gtag('event', 'exception', {
                description: error.message,
                fatal: false
            });
        }
    }

    // מדידת ביצועים
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart);
                    console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
                }, 0);
            });
        }
    }
}

// Initialize performance optimizer
const performanceOptimizer = new PerformanceOptimizer(); 