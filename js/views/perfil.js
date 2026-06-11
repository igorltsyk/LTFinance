import { Store } from '../store.js';

export default {
  render() {
    const user = Store.data.user;

    return `
      <div class="header text-center pt-4">
        <div style="width: 80px; height: 80px; background: var(--bg-surface-elevated); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 32px; color: var(--primary-color);">
          <i class="ph ph-user"></i>
        </div>
        <h1>${user?.name || 'Usuário'}</h1>
        <p>${user?.email || 'email@exemplo.com'}</p>
      </div>

      <div class="card p-0 mb-4 overflow-hidden">
        <ul class="profile-menu">
          <li class="p-4 border-b border-color d-flex justify-between align-center">
            <div class="d-flex align-center gap-3">
              <i class="ph ph-gear fs-xl text-secondary"></i>
              <span>Configurações</span>
            </div>
            <i class="ph ph-caret-right text-secondary"></i>
          </li>
          <li class="p-4 border-b border-color d-flex justify-between align-center">
            <div class="d-flex align-center gap-3">
              <i class="ph ph-bell fs-xl text-secondary"></i>
              <span>Notificações</span>
            </div>
            <i class="ph ph-caret-right text-secondary"></i>
          </li>
          <li class="p-4 d-flex justify-between align-center">
            <div class="d-flex align-center gap-3">
              <i class="ph ph-shield-check fs-xl text-secondary"></i>
              <span>Segurança</span>
            </div>
            <i class="ph ph-caret-right text-secondary"></i>
          </li>
        </ul>
      </div>

      <button id="btn-logout" class="btn btn-outline w-100 text-danger" style="border-color: var(--danger-color);">
        <i class="ph ph-sign-out mr-2"></i> Sair da Conta
      </button>

      <div class="text-center mt-6 text-secondary fs-sm">
        <p>LTFinance v1.0.0</p>
      </div>
    `;
  },

  afterRender() {
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        Store.logout();
        window.appRouter.navigate('/login');
      });
    }
  }
};
