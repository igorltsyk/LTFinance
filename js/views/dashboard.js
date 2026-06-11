import { Store } from '../store.js';
import { Formatters } from '../utils/formatters.js';

export default {
  render() {
    const stats = Store.getDashboardStats();
    const transactions = Store.getTransactions().slice(0, 3); // Ultimas 3

    // Pegar fatura do mes atual
    const today = new Date();
    const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const futureInstallments = Store.getFutureInstallments();
    
    let currentMonthCreditBill = 0;
    const currentMonthData = futureInstallments.find(m => m.key === currentMonthKey);
    if (currentMonthData) {
      currentMonthCreditBill = Math.abs(currentMonthData.total);
    }
    
    const saldoPrevisto = stats.balance - currentMonthCreditBill;
    
    let rawPercent = stats.balance > 0 ? (currentMonthCreditBill / stats.balance) * 100 : 0;
    if (stats.balance <= 0 && currentMonthCreditBill > 0) rawPercent = 100;
    const progressPercent = Math.min(100, Math.max(0, rawPercent)).toFixed(1);

    let transactionsHtml = transactions.map(t => {
      const isIncome = t.type === 'income';
      const icon = isIncome ? 'ph-arrow-up-right' : 'ph-arrow-down-left';
      const iconClass = isIncome ? 'icon-income' : 'icon-expense';
      const amountClass = isIncome ? 'text-success' : 'text-danger';
      const sign = isIncome ? '+' : '-';

      return `
        <div class="transaction-item">
          <div class="transaction-icon ${iconClass}">
            <i class="ph ${icon}"></i>
          </div>
          <div class="transaction-details">
            <div class="transaction-title">${t.category}</div>
            <div class="transaction-date">${Formatters.date(t.date)}</div>
          </div>
          <div class="transaction-amount ${amountClass}">
            ${sign} ${Formatters.currency(Math.abs(t.amount))}
          </div>
        </div>
      `;
    }).join('');

    if (transactions.length === 0) {
      transactionsHtml = `<div class="text-center text-secondary py-4">Nenhuma transação recente.</div>`;
    }

    return `
      <div class="header">
        <p>Olá, ${Store.data.user?.name || 'Usuário'} 👋</p>
        <h1>Visão Geral</h1>
      </div>

      <div class="mb-4">
        <h2 class="fs-md text-secondary mb-2 px-1">Resumo Financeiro</h2>
        
        <div class="card card-primary mb-3">
          <div class="text-secondary mb-1">Saldo Atual (Conta)</div>
          <div class="fs-3xl fw-bold mb-1">${Formatters.currency(stats.balance)}</div>
          <div class="fs-sm" style="color: rgba(255, 255, 255, 0.6); margin-bottom: 24px;">Saldo Previsto: ${Formatters.currency(saldoPrevisto)}</div>
          
          <div class="d-flex justify-between">
            <div>
              <div class="text-secondary fs-sm mb-1"><i class="ph ph-arrow-up-right text-success"></i> Receitas</div>
              <div class="fw-semibold">${Formatters.currency(stats.income)}</div>
            </div>
            <div class="text-right">
              <div class="text-secondary fs-sm mb-1"><i class="ph ph-arrow-down-left text-danger"></i> Despesas</div>
              <div class="fw-semibold">${Formatters.currency(stats.expense)}</div>
            </div>
          </div>
        </div>

        <div class="card" style="border-left: 4px solid var(--danger-color);">
          <div class="d-flex justify-between align-center mb-3">
            <div class="d-flex align-center gap-2">
              <i class="ph ph-credit-card text-primary fs-xl"></i>
              <span class="fw-bold">Fatura Atual</span>
            </div>
            <div class="fw-bold text-danger">${Formatters.currency(currentMonthCreditBill)}</div>
          </div>
          
          <div style="width: 100%; height: 6px; background: var(--bg-background); border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
            <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, var(--danger-color), #f43f5e); border-radius: 4px; transition: width 0.5s ease-out;"></div>
          </div>
          <div class="fs-sm text-secondary d-flex justify-between">
            <span>Progresso de consumo</span>
            <span class="fw-semibold">${progressPercent}% do saldo</span>
          </div>
        </div>
      </div>

      <div class="d-flex justify-between align-center mb-3">
        <h2 class="fs-lg fw-semibold">Transações Recentes</h2>
        <a href="#/historico" class="text-accent fs-sm">Ver todas</a>
      </div>

      <div class="transaction-list mb-5">
        ${transactionsHtml}
      </div>

      <a href="#/cartoes" class="card mb-4 d-flex align-center justify-between" style="display: flex; text-decoration: none;">
        <div class="d-flex align-center gap-3">
          <div style="width: 48px; height: 48px; background: rgba(139, 92, 246, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <i class="ph ph-credit-card text-primary fs-xl" style="color: #8B5CF6;"></i>
          </div>
          <div>
            <div class="fw-bold text-primary">Faturas Futuras</div>
            <div class="fs-sm text-secondary">Controle de parcelas</div>
          </div>
        </div>
        <i class="ph ph-caret-right text-secondary"></i>
      </a>

      <div class="card mb-4" style="background: linear-gradient(135deg, #1E1E1E 0%, #2a2a2a 100%);">
        <div class="d-flex justify-between align-center">
          <div>
            <div class="text-secondary fs-sm mb-1">Total Investido</div>
            <div class="fs-xl fw-bold text-accent">${Formatters.currency(stats.invested)}</div>
          </div>
          <div style="width: 48px; height: 48px; background: rgba(16, 185, 129, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <i class="ph ph-trend-up text-accent fs-xl"></i>
          </div>
        </div>
      </div>
    `;
  },

  afterRender() {
    // Ação do FAB será global no app.js, mas podemos adicionar ações locais se necessário.
  }
};
