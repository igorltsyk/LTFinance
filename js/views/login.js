import { Store } from '../store.js';

export default {
  render() {
    return `
      <div class="d-flex flex-column justify-center align-center" style="min-height: 80vh;">
        <div class="text-center mb-6">
          <div style="width: 80px; height: 80px; background: var(--primary-color); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
            <i class="ph ph-wallet text-primary" style="font-size: 40px; color: white;"></i>
          </div>
          <h1 class="fs-3xl fw-bold">LTFinance</h1>
          <p class="text-secondary mt-2">O controle do seu dinheiro na palma da mão.</p>
        </div>
        
        <form id="login-form" class="card" style="width: 100%; max-width: 400px;">
          <div class="input-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" class="input-control" placeholder="seu@email.com" required value="demo@ltfinance.com">
          </div>
          
          <div class="input-group mb-5">
            <label for="password">Senha</label>
            <input type="password" id="password" class="input-control" placeholder="••••••••" required>
          </div>
          
          <button type="submit" id="btn-login" class="btn btn-primary mb-3">
            Acessar
          </button>
          <button type="button" id="btn-register" class="btn btn-outline" style="width: 100%;">
            Criar Conta
          </button>
        </form>
      </div>
    `;
  },

  afterRender() {
    const form = document.getElementById('login-form');
    const btnRegister = document.getElementById('btn-register');
    
    // Login
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        await Store.login(email, password);
        window.appRouter.navigate('/');
      } catch (err) {
        alert('Erro ao fazer login: ' + err.message);
      }
    });

    // Registro
    btnRegister.addEventListener('click', async () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      if (!email || !password) {
        return alert('Preencha e-mail e senha para criar a conta.');
      }

      try {
        await Store.register(email, password);
        alert('Conta criada com sucesso! Você já pode fazer o login.');
      } catch (err) {
        alert('Erro ao criar conta: ' + err.message);
      }
    });
  }
};
