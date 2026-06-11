import { Store } from './store.js';
import { Router } from './router.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize state (espera carregar sessão do supabase)
  await Store.init();

  // Initialize Router
  Router.init();

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }

  // Setup FAB global
  document.getElementById('fab-add').addEventListener('click', () => {
    Router.navigate('/add');
  });
});

// Global expose for views to trigger navigation if needed
window.appRouter = Router;
