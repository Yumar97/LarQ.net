/**
 * Sistema de Transiciones entre Páginas
 * (Sin efectos de fade in/fade out)
 */

class PageTransitions {
    constructor() {
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.interceptNavigationLinks();
        this.handleBrowserNavigation();
    }

    interceptNavigationLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            const href = link.getAttribute('href');
            if (this.isInternalLink(href) && !this.isTransitioning) {
                e.preventDefault();
                window.location.href = href;
            }
        });
    }

    isInternalLink(href) {
        if (!href) return false;
        if (href.startsWith('http://') || 
            href.startsWith('https://') || 
            href.startsWith('mailto:') || 
            href.startsWith('tel:') ||
            href.startsWith('#')) {
            return false;
        }
        return href.endsWith('.html') || href === '/' || href.startsWith('./') || href.startsWith('../');
    }

    handleBrowserNavigation() {
        window.addEventListener('popstate', () => {});
        window.addEventListener('beforeunload', () => {});
    }

    static navigateTo(url) {
        window.location.href = url;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.pageTransitions = new PageTransitions();
});
window.PageTransitions = PageTransitions;
