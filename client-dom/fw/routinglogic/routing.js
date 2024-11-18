import Framework from "../runner/framework.js";

/**
 * Class representing a router for handling client-side routing.
 */
export default class Router {
    /**
     * Create a Router.
     * @param {Framework} app - The framework instance.
     */
    constructor(app) {
        this.app = app;
        this.routes = {};
        window.addEventListener('popstate', async (event) => {
            event.preventDefault();
            this.loadInitialRoute();
        });
    }

    /**
     * Initialize the router with given routes.
     * @param {Array} routes - Array of routes to be initialized.
     */
    init(routes) {
        routes.forEach(([path, callback, component]) => {
            this.routes[path] = {
                path: path,
                callback: callback || ((params) => this.app.renderPage(this.routes[path].generatePage())),
            };
            this.bindLink(component, path);
        });

        this.loadInitialRoute();
    }

    /**
     * Get the current URL path.
     * @returns {string} The current URL path.
     * @private
     */
    getCurrentURL() {
        const urlPath = window.location.pathname || '/';
        return urlPath;
    }

    /**
     * Split the path into segments.
     * @param {string} path - The URL path.
     * @returns {Array} The path segments.
     * @private
     */
    getPathSegments(path) {
        return path.split('/').filter(segment => segment.length > 0);
    }

    /**
     * Match the URL segments to a route.
     * @param {Array} urlSegs - The URL segments.
     * @returns {Object} The matched route.
     * @private
     */
    matchUrlToRoute(urlSegs) {
        for (const route of Object.values(this.routes)) {
            const routeSegs = this.getPathSegments(route.path);
            if (routeSegs.length !== urlSegs.length) continue;

            const params = {};
            const match = routeSegs.every((routeSeg, index) => {
                if (routeSeg.startsWith(':')) {
                    params[routeSeg.slice(1)] = urlSegs[index];
                    return true;
                }
                return routeSeg === urlSegs[index];
            });

            if (match) {
                return { ...route, params };
            }
        }

        this.navigateTo('/');
    }

    /**
     * Bind a link to a component.
     * @param {HTMLElement} component - The component to bind.
     * @param {string} href - The href attribute of the link.
     */
    bindLink(component, href) {
        component.addEventListener('click', (event) => {
            event.preventDefault();
            this.navigateTo(href);
        });
    }

    /**
     * Load the initial route on page load or URL change.
     * @private
     */
    loadInitialRoute() {
        const pathSegments = this.getPathSegments(this.getCurrentURL());
        this.loadRoute(pathSegments);
    }

    /**
     * Load the route based on the URL segments.
     * @param {Array} urlSegs - The URL segments.
     */
    loadRoute(urlSegs) {
        const matchedRoute = this.matchUrlToRoute(urlSegs);
        if (!matchedRoute) {
            throw new Error(`Route not found for ${urlSegs.join('/')}`);
        }
        matchedRoute.callback(matchedRoute.params);
    }

    /**
     * Navigate to a specific path.
     * @param {string} path - The path to navigate to.
     */
    navigateTo(path) {
        console.log("Navigating to", path);
        history.pushState({}, '', path);
        const pathSegments = this.getPathSegments(path);
        this.loadRoute(pathSegments);
    }
}
