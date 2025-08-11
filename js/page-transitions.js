/**
 * Sistema de Transiciones entre Páginas
 * Con efectos de fade in y fade out
 */

class PageTransitions {
    constructor() {
        this.isTransitioning = false;
        this.transitionDuration = 600; // Duración más larga para suavidad
        this.init();
    }

    init() {
        this.createTransitionOverlay();
        this.interceptNavigationLinks();
        this.handleBrowserNavigation();
        this.fadeInPage();
    }

    createTransitionOverlay() {
        // Crear overlay para transiciones - Solo sobre el contenido principal, no sobre el header
        const overlay = document.createElement('div');
        overlay.id = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 120px;
            left: 0;
            width: 100%;
            height: calc(100vh - 120px);
            background-color: #f8f9fa;
            z-index: 1500;
            opacity: 0;
            visibility: hidden;
            transition: opacity ${this.transitionDuration}ms ease-in-out, visibility ${this.transitionDuration}ms ease-in-out;
            pointer-events: none;
        `;
        document.body.appendChild(overlay);
        this.overlay = overlay;
    }

    fadeInPage() {
        // Fade in inicial solo del contenido principal
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            // Asegurar que empiece invisible
            mainContent.style.opacity = '0';
            
            // Pequeño delay para asegurar que el contenido esté listo y crear transición suave
            setTimeout(() => {
                requestAnimationFrame(() => {
                    // Usar transición CSS suave
                    mainContent.style.opacity = '1';
                    mainContent.classList.add('loaded');
                });
            }, 200); // 200ms de delay para suavizar la aparición
        }
    }

    interceptNavigationLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (this.isInternalLink(href) && !this.isTransitioning) {
                e.preventDefault();
                this.navigateWithTransition(href);
            }
        });
    }

    async navigateWithTransition(url) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        try {
            // Fade out actual
            await this.fadeOut();
            
            // Navegar a la nueva página
            window.location.href = url;
        } catch (error) {
            console.error('Error en transición:', error);
            // Fallback: navegación normal
            window.location.href = url;
        }
    }

    fadeOut() {
        return new Promise((resolve) => {
            // Fade out solo del contenido principal
            const mainContent = document.querySelector('.main-content');
            
            if (mainContent) {
                mainContent.style.opacity = '0';
            }
            
            // Mostrar overlay solo sobre el contenido
            this.overlay.style.visibility = 'visible';
            this.overlay.style.pointerEvents = 'all';
            
            requestAnimationFrame(() => {
                this.overlay.style.opacity = '1';
                
                setTimeout(() => {
                    resolve();
                }, this.transitionDuration);
            });
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
        // Manejar navegación del navegador (botones atrás/adelante)
        window.addEventListener('popstate', () => {
            this.fadeInPage();
        });

        // Preparar fade in cuando se carga la página
        window.addEventListener('beforeunload', () => {
            if (this.overlay) {
                this.overlay.style.opacity = '1';
                this.overlay.style.visibility = 'visible';
            }
        });
    }

    static navigateTo(url) {
        if (window.pageTransitions) {
            window.pageTransitions.navigateWithTransition(url);
        } else {
            window.location.href = url;
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.pageTransitions = new PageTransitions();
});

// Hacer disponible globalmente
window.PageTransitions = PageTransitions;
