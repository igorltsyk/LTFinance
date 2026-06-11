import { Store } from './store.js';

import LoginView from './views/login.js';
import DashboardView from './views/dashboard.js';
import HistoricoView from './views/historico.js';
import PerfilView from './views/perfil.js';
import AddView from './views/add.js';
import CartoesView from './views/cartoes.js';

const routes = {
  '/login': LoginView,
  '/': DashboardView,
  '/historico': HistoricoView,
  '/perfil': PerfilView,
  '/add': AddView,
  '/cartoes': CartoesView
};

export const Router = {
  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  navigate(path) {
    window.location.hash = path;
  },

  handleRoute() {
    let path = window.location.hash.replace('#', '') || '/';
    
    // Auth Guard
    if (!Store.isLoggedIn() && path !== '/login') {
      this.navigate('/login');
      return;
    }

    if (Store.isLoggedIn() && path === '/login') {
      this.navigate('/');
      return;
    }

    const view = routes[path] || routes['/'];
    this.renderView(view, path);
    this.updateBottomNav(path);
  },

  renderView(viewComponent, path) {
    const appContainer = document.getElementById('app');
    
    // Remove view class for animation reset
    appContainer.innerHTML = '';
    
    const viewWrapper = document.createElement('div');
    viewWrapper.className = 'view';
    viewWrapper.innerHTML = viewComponent.render();
    appContainer.appendChild(viewWrapper);

    // Call after render logic if exists
    if (viewComponent.afterRender) {
      viewComponent.afterRender();
    }
  },

  updateBottomNav(path) {
    const bottomNav = document.getElementById('bottom-nav');
    const fab = document.getElementById('fab-add');

    // Esconde nav e fab no login e na tela de adicionar ou faturas
    if (path === '/login' || path === '/add' || path === '/cartoes') {
      bottomNav.classList.add('hidden');
      fab.classList.add('hidden');
      return;
    }

    bottomNav.classList.remove('hidden');
    fab.classList.remove('hidden');

    // Update active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.route === path) {
        item.classList.add('active');
      }
    });
  }
};
