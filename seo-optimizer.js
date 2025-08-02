// SEO Optimizer - אופטימיזציה למנועי חיפוש
class SEOOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupMetaTags();
        this.setupStructuredData();
        this.setupSitemap();
        this.setupRobotsTxt();
        this.setupOpenGraph();
        this.setupTwitterCards();
        this.setupBreadcrumbs();
        this.setupCanonicalUrls();
    }

    // Meta Tags
    setupMetaTags() {
        const metaTags = [
            { name: 'description', content: 'מערכת ניהול משימות מתקדמת - צור, שתף ונהל משימות בקלות. תמיכה מלאה בעברית עם ממשק יוקרתי ונוח.' },
            { name: 'keywords', content: 'ניהול משימות, רשימת מטלות, checklist, task management, עברית, מערכת ניהול' },
            { name: 'author', content: 'Checklist App Team' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover' },
            { name: 'theme-color', content: '#667eea' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
            { name: 'apple-mobile-web-app-title', content: 'מנהל המשימות' },
            { name: 'mobile-web-app-capable', content: 'yes' },
            { name: 'format-detection', content: 'telephone=no' },
            { name: 'msapplication-TileColor', content: '#667eea' },
            { name: 'msapplication-config', content: '/browserconfig.xml' }
        ];

        metaTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    // Structured Data (JSON-LD)
    setupStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "מנהל המשימות",
            "description": "מערכת ניהול משימות מתקדמת עם תמיכה מלאה בעברית",
            "url": window.location.origin,
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "Web Browser",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "ILS"
            },
            "author": {
                "@type": "Organization",
                "name": "Checklist App Team"
            },
            "featureList": [
                "ניהול משימות",
                "שיתוף רשימות",
                "ממשק עברית",
                "תמיכה במובייל",
                "עבודה אופליין"
            ]
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    // Sitemap
    setupSitemap() {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${window.location.origin}/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${window.location.origin}/welcome.html</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>${window.location.origin}/login.html</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${window.location.origin}/register.html</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>`;

        // Create sitemap link
        const sitemapLink = document.createElement('link');
        sitemapLink.rel = 'sitemap';
        sitemapLink.type = 'application/xml';
        sitemapLink.href = '/sitemap.xml';
        document.head.appendChild(sitemapLink);
    }

    // Robots.txt
    setupRobotsTxt() {
        const robotsContent = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /debug.html
Disallow: /setup-test-data.html

Sitemap: ${window.location.origin}/sitemap.xml`;

        // Note: In a real deployment, this should be served as a static file
        console.log('Robots.txt content:', robotsContent);
    }

    // Open Graph
    setupOpenGraph() {
        const ogTags = [
            { property: 'og:title', content: 'מנהל המשימות - מערכת ניהול משימות מתקדמת' },
            { property: 'og:description', content: 'צור, שתף ונהל משימות בקלות עם מערכת ניהול משימות מתקדמת בעברית' },
            { property: 'og:type', content: 'website' },
            { property: 'og:url', content: window.location.href },
            { property: 'og:image', content: `${window.location.origin}/icons/icon-512.png` },
            { property: 'og:image:width', content: '512' },
            { property: 'og:image:height', content: '512' },
            { property: 'og:locale', content: 'he_IL' },
            { property: 'og:site_name', content: 'מנהל המשימות' }
        ];

        ogTags.forEach(tag => {
            if (!document.querySelector(`meta[property="${tag.property}"]`)) {
                const meta = document.createElement('meta');
                meta.setAttribute('property', tag.property);
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    // Twitter Cards
    setupTwitterCards() {
        const twitterTags = [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: 'מנהל המשימות - מערכת ניהול משימות מתקדמת' },
            { name: 'twitter:description', content: 'צור, שתף ונהל משימות בקלות עם מערכת ניהול משימות מתקדמת בעברית' },
            { name: 'twitter:image', content: `${window.location.origin}/icons/icon-512.png` },
            { name: 'twitter:site', content: '@checklistapp' },
            { name: 'twitter:creator', content: '@checklistapp' }
        ];

        twitterTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    // Breadcrumbs
    setupBreadcrumbs() {
        const breadcrumbs = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "בית",
                    "item": window.location.origin
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "מנהל המשימות",
                    "item": window.location.href
                }
            ]
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbs);
        document.head.appendChild(script);
    }

    // Canonical URLs
    setupCanonicalUrls() {
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = window.location.href.split('?')[0]; // Remove query parameters
        document.head.appendChild(canonical);
    }

    // Page Title Optimization
    optimizePageTitle() {
        const currentPage = this.getCurrentPage();
        const titles = {
            'welcome': 'ברוכים הבאים - מנהל המשימות',
            'login': 'התחברות - מנהל המשימות',
            'register': 'הרשמה - מנהל המשימות',
            'manager': 'לוח בקרה מנהל - מנהל המשימות',
            'worker': 'לוח בקרה עובד - מנהל המשימות',
            'admin': 'לוח בקרה מנהל מערכת - מנהל המשימות'
        };

        const title = titles[currentPage] || 'מנהל המשימות';
        document.title = title;
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('welcome')) return 'welcome';
        if (path.includes('login')) return 'login';
        if (path.includes('register')) return 'register';
        if (path.includes('manager')) return 'manager';
        if (path.includes('worker')) return 'worker';
        if (path.includes('admin')) return 'admin';
        return 'home';
    }

    // Analytics Setup
    setupAnalytics() {
        // Google Analytics (if configured)
        if (window.gtag) {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href,
                custom_map: {
                    'custom_dimension1': 'user_type',
                    'custom_dimension2': 'page_type'
                }
            });
        }
    }
}

// Initialize SEO optimizer
const seoOptimizer = new SEOOptimizer(); 