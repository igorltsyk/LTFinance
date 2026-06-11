import { Store } from '../store.js';
import { Formatters } from '../utils/formatters.js';

export default {
  render() {
    const stats = Store.getDashboardStats();
    const investments = Store.data.investments || [];
    
    const colors = ['#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#14B8A6'];
    const total = stats.invested || 1;
    let gradientStops = [];
    let currentPercentage = 0;
    
    investments.forEach((inv, index) => {
      const p = (inv.amount / total) * 100;
      const color = colors[index % colors.length];
      gradientStops.push(`${color} ${currentPercentage}% ${currentPercentage + p}%`);
      currentPercentage += p;
    });
    
    const conicBg = investments.length > 0 ? gradientStops.join(', ') : 'var(--bg-background) 0% 100%';

    const chartMock = `
      <div style="position: relative; width: 180px; height: 180px; margin: 30px auto 10px; border-radius: 50%; background: conic-gradient(${conicBg}); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);">
        <div style="position: absolute; top: 18px; left: 18px; right: 18px; bottom: 18px; background: var(--bg-surface); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: inset 0 2px 10px rgba(0,0,0,0.3);">
          <i class="ph ph-wallet text-secondary fs-xl mb-1"></i>
          <span class="fs-sm text-secondary">Ativos</span>
          <span class="fw-bold fs-md">${investments.length}</span>
        </div>
      </div>
    `;

    let investmentsHtml = investments.map((inv, index) => {
      const color = colors[index % colors.length];
      const p = ((inv.amount / total) * 100).toFixed(1);
      
      return `
      <div class="transaction-item" style="border-left: 3px solid ${color}; border-radius: 8px; margin-bottom: 12px; padding-left: 12px; background: var(--bg-background);">
        <div class="transaction-details flex-1 py-2">
          <div class="transaction-title fw-bold">${inv.name}</div>
          <div class="fs-xs text-secondary d-flex align-center gap-1 mt-1">
             <div style="width:8px; height:8px; border-radius:50%; background:${color};"></div>
             ${inv.type || 'Geral'} • ${p}% da carteira
          </div>
        </div>
        <div class="transaction-amount py-2 fw-semibold">
          ${Formatters.currency(inv.amount)}
        </div>
      </div>
    `}).join('');

    if (investments.length === 0) {
      investmentsHtml = `<div class="text-center text-secondary py-4">Nenhum investimento cadastrado ainda.</div>`;
    }

    return `
      <div class="header">
        <h1>Investimentos</h1>
        <p>Seu patrimônio acumulado</p>
      </div>

      <div class="card mb-4 text-center">
        <div class="text-secondary mb-1">Patrimônio Total</div>
        <div class="fs-3xl fw-bold text-primary mb-2">${Formatters.currency(stats.invested)}</div>
        ${investments.length > 0 ? `
          ${chartMock}
        ` : ''}
      </div>

      <h2 class="fs-lg fw-semibold mb-3">Seus Ativos</h2>
      
      <div class="transaction-list mb-4">
        ${investmentsHtml}
      </div>
      
      <div id="add-investment-container" style="display: none;" class="card mb-4">
        <h3 class="fs-md fw-semibold mb-3">Adicionar Novo Aporte</h3>
        <form id="add-investment-form">
          <div class="input-group mb-3">
            <label>Nome do Ativo (ex: Tesouro Selic)</label>
            <input type="text" id="inv-name" class="input-control" required>
          </div>
          <div class="input-group mb-3">
            <label>Tipo (ex: Renda Fixa, Ações)</label>
            <input type="text" id="inv-type" class="input-control" required>
          </div>
          <div class="input-group mb-4">
            <label>Valor (R$)</label>
            <input type="number" id="inv-amount" class="input-control" step="0.01" min="0.01" required>
          </div>
          <div class="d-flex gap-2">
            <button type="button" id="btn-cancel-inv" class="btn btn-outline flex-1">Cancelar</button>
            <button type="submit" class="btn btn-primary flex-1">Salvar</button>
          </div>
        </form>
      </div>

      <button id="btn-new-investment" class="btn btn-primary w-100 mb-4">
        <i class="ph ph-plus mr-2"></i> Novo Aporte
      </button>
    `;
  },

  afterRender() {
    const btnNew = document.getElementById('btn-new-investment');
    const container = document.getElementById('add-investment-container');
    const btnCancel = document.getElementById('btn-cancel-inv');
    const form = document.getElementById('add-investment-form');

    btnNew.addEventListener('click', () => {
      container.style.display = 'block';
      btnNew.style.display = 'none';
    });

    btnCancel.addEventListener('click', () => {
      container.style.display = 'none';
      btnNew.style.display = 'block';
      form.reset();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('inv-name').value;
      const type = document.getElementById('inv-type').value;
      const amount = parseFloat(document.getElementById('inv-amount').value);

      try {
        btnNew.innerHTML = 'Salvando...';
        await Store.addInvestment({ name, type, amount });
        window.appRouter.renderView(); // Re-render the view
      } catch (err) {
        alert('Erro ao salvar investimento: ' + err.message);
      }
    });
  }
};
