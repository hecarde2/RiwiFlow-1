import { router } from './router.js';

// Handle browser back/forward navigation
window.addEventListener('popstate', router);

// Boot the app
router();
