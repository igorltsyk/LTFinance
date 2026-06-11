import { Store } from '../store.js';
import { Formatters } from '../utils/formatters.js';

export default {
  render() {
    const transactions = Store.getTransactions();

    let transactionsHtml = transactions.map(t => {
      const isIncome = t.type === 'income';
      const icon = isIncome ? 'ph-arrow-up-right' : 'ph-arrow-down-left';
      const iconClass = isIncome ? 'icon-income' : 'icon-expense';
      const amountClass = isIncome ? 'text-success' : 'text-danger';
      const sign = isIncome ? '+' : '-';

      return `
        <div class="transaction-item mb-2" data-type="${t.type}">
          <div class="transaction-icon ${iconClass}">
            <i class="ph ${icon}"></i>
          </div>
          <div class="transaction-details">
            <div class="transaction-title">${t.category}</div>
            <div class="transaction-date">${Formatters.date(t.date)} às ${Formatters.time(t.date)}</div>
          </div>
          <div class="transaction-amount ${amountClass}">
            ${sign} ${Formatters.currency(Math.abs(t.amount))}
          </div>
        </div>
      `;
    }).join('');

    if (transactions.length === 0) {
      transactionsHtml = `
        <div class="text-center text-secondary py-6 mt-6">
          <i class="ph ph-receipt fs-3xl mb-2"></i>
          <p>Nenhuma transação encontrada.</p>
        </div>
      `;
    }

    return `
      <div class="header">
        <h1>Histórico</h1>
        <p>Todas as suas movimentações</p>
      </div>

      <div class="d-flex gap-2 mb-4">
        <button id="filter-all" class="btn btn-primary" style="flex: 1; padding: 8px; min-height: 40px; font-size: 14px;">Tudo</button>
        <button id="filter-income" class="btn btn-outline" style="flex: 1; padding: 8px; min-height: 40px; font-size: 14px; border-color: var(--border-color);">Ganhos</button>
        <button id="filter-expense" class="btn btn-outline" style="flex: 1; padding: 8px; min-height: 40px; font-size: 14px; border-color: var(--border-color);">Gastos</button>
      </div>

      <div class="transaction-list pb-4">
        ${transactionsHtml}
      </div>
    `;
  },

  afterRender() {
    const btnAll = document.getElementById('filter-all');
    const btnIncome = document.getElementById('filter-income');
    const btnExpense = document.getElementById('filter-expense');
    const items = document.querySelectorAll('.transaction-item');

    const setActive = (btn) => {
      [btnAll, btnIncome, btnExpense].forEach(b => {
        b.className = 'btn btn-outline';
        b.style.borderColor = 'var(--border-color)';
      });
      btn.className = 'btn btn-primary';
      btn.style.borderColor = 'transparent';
    };

    btnAll.addEventListener('click', () => {
      setActive(btnAll);
      items.forEach(item => item.style.display = 'flex');
    });

    btnIncome.addEventListener('click', () => {
      setActive(btnIncome);
      items.forEach(item => {
        item.style.display = item.dataset.type === 'income' ? 'flex' : 'none';
      });
    });

    btnExpense.addEventListener('click', () => {
      setActive(btnExpense);
      items.forEach(item => {
        item.style.display = item.dataset.type === 'expense' ? 'flex' : 'none';
      });
    });
  }
};
