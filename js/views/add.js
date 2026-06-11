import { Store } from '../store.js';

export default {
  render() {
    return `
      <div class="header d-flex align-center justify-between">
        <div>
          <h1>Nova Transação</h1>
          <p>Adicione ganhos ou gastos</p>
        </div>
        <button id="btn-close" class="btn btn-outline" style="width: auto; padding: 8px; border-color: transparent; border-radius: 50%;">
          <i class="ph ph-x fs-2xl"></i>
        </button>
      </div>

      <div class="d-flex gap-2 mb-4">
        <button id="tab-expense" class="btn btn-primary" style="flex: 1; padding: 8px; min-height: 40px; font-size: 14px; background-color: var(--danger-color);">Gasto</button>
        <button id="tab-income" class="btn btn-outline" style="flex: 1; padding: 8px; min-height: 40px; font-size: 14px; border-color: var(--border-color);">Ganho</button>
      </div>

      <form id="form-transaction" class="card">
        <div class="input-group">
          <label>Valor (R$)</label>
          <input type="number" id="input-amount" class="input-control text-primary fs-2xl fw-bold" placeholder="0,00" step="0.01" required>
        </div>

        <div class="input-group">
          <label>Nome / Categoria</label>
          <input type="text" id="input-name" class="input-control" placeholder="Ex: Supermercado" required>
        </div>

        <div class="input-group">
          <label>Método de Pagamento</label>
          <select id="select-method" class="input-control">
            <option value="debit">Cartão de Débito</option>
            <option value="credit">Cartão de Crédito</option>
            <option value="cash">Dinheiro / Pix</option>
          </select>
        </div>

        <div id="recurring-wrapper" class="input-group d-flex align-center gap-2 mb-4" style="background: var(--bg-surface-elevated); padding: 12px; border-radius: var(--radius-sm);">
          <input type="checkbox" id="check-recurring" style="width: 20px; height: 20px; accent-color: var(--primary-color);">
          <label for="check-recurring" class="mb-0 fw-semibold" style="margin: 0; flex: 1;">Gasto Mensal Fixo</label>
        </div>

        <div id="recurring-fields" class="hidden mb-4">
          <div class="input-group">
            <label>Dia do Vencimento (1 a 31)</label>
            <input type="number" id="input-due-day" class="input-control" placeholder="Ex: 10" min="1" max="31">
          </div>
        </div>

        <!-- Campos de Cartão de Crédito (Escondidos por padrão) -->
        <div id="credit-fields" class="hidden">
          <div class="input-group">
            <label>Cartão de Crédito</label>
            <select id="select-card" class="input-control">
              <option value="nubank">Nubank</option>
              <option value="itau">Itaú</option>
              <option value="inter">Banco Inter</option>
              <option value="sicredi">Sicredi</option>
            </select>
          </div>

          <div class="d-flex gap-3">
            <div class="input-group" style="flex: 1;">
              <label>Parcelas</label>
              <select id="select-installments" class="input-control">
                <option value="1">1x (À vista)</option>
                <option value="2">2x</option>
                <option value="3">3x</option>
                <option value="4">4x</option>
                <option value="5">5x</option>
                <option value="6">6x</option>
                <option value="7">7x</option>
                <option value="8">8x</option>
                <option value="9">9x</option>
                <option value="10">10x</option>
                <option value="11">11x</option>
                <option value="12">12x</option>
              </select>
            </div>

            <div class="input-group" style="flex: 1;">
              <label>Vencimento Fatura</label>
              <input type="date" id="input-due-date" class="input-control">
            </div>
          </div>
        </div>

        <button type="submit" id="btn-save" class="btn btn-primary mt-4" style="background-color: var(--danger-color);">
          Adicionar Gasto
        </button>
      </form>
    `;
  },

  afterRender() {
    let type = 'expense';
    
    const tabExpense = document.getElementById('tab-expense');
    const tabIncome = document.getElementById('tab-income');
    const btnSave = document.getElementById('btn-save');
    const form = document.getElementById('form-transaction');
    const selectMethod = document.getElementById('select-method');
    const creditFields = document.getElementById('credit-fields');
    
    const checkRecurring = document.getElementById('check-recurring');
    const recurringFields = document.getElementById('recurring-fields');
    const recurringWrapper = document.getElementById('recurring-wrapper');

    // Fechar e voltar
    document.getElementById('btn-close').addEventListener('click', () => {
      window.history.back(); // Volta para a tela anterior
    });

    // Toggle Gasto Fixo
    checkRecurring.addEventListener('change', (e) => {
      if (e.target.checked) {
        recurringFields.classList.remove('hidden');
        document.getElementById('input-due-day').required = true;
      } else {
        recurringFields.classList.add('hidden');
        document.getElementById('input-due-day').required = false;
      }
    });

    // Alternar entre Gasto e Ganho
    const switchTab = (newType) => {
      type = newType;
      if (type === 'expense') {
        tabExpense.className = 'btn btn-primary';
        tabExpense.style.backgroundColor = 'var(--danger-color)';
        tabIncome.className = 'btn btn-outline';
        btnSave.style.backgroundColor = 'var(--danger-color)';
        btnSave.textContent = 'Adicionar Gasto';
        selectMethod.parentElement.classList.remove('hidden');
        recurringWrapper.classList.remove('hidden');
        if(selectMethod.value === 'credit') creditFields.classList.remove('hidden');
      } else {
        tabIncome.className = 'btn btn-primary';
        tabIncome.style.backgroundColor = 'var(--success-color)';
        tabExpense.className = 'btn btn-outline';
        btnSave.style.backgroundColor = 'var(--success-color)';
        btnSave.textContent = 'Adicionar Ganho';
        
        // Esconde campos específicos
        selectMethod.parentElement.classList.add('hidden');
        creditFields.classList.add('hidden');
        recurringWrapper.classList.add('hidden');
        recurringFields.classList.add('hidden');
        checkRecurring.checked = false;
        document.getElementById('input-due-day').required = false;
      }
    };

    tabExpense.addEventListener('click', () => switchTab('expense'));
    tabIncome.addEventListener('click', () => switchTab('income'));

    // Mostrar campos de cartão se for crédito
    selectMethod.addEventListener('change', (e) => {
      if (e.target.value === 'credit') {
        creditFields.classList.remove('hidden');
      } else {
        creditFields.classList.add('hidden');
      }
    });

    // Salvar transação
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const amount = parseFloat(document.getElementById('input-amount').value);
      const name = document.getElementById('input-name').value;
      const isRecurring = checkRecurring.checked;
      
      let finalAmount = type === 'expense' ? -amount : amount;

      if (isRecurring) {
        const dueDay = parseInt(document.getElementById('input-due-day').value);
        Store.addRecurringTransaction({
          type,
          category: name,
          amount: finalAmount,
          paymentMethod: selectMethod.value,
          dueDay: dueDay
        });
        alert('Gasto fixo configurado com sucesso!');
        window.history.back();
        return;
      }

      const transaction = {
        type,
        category: name,
        amount: finalAmount,
        date: new Date().toISOString()
      };

      // Adiciona detalhes de cartão se aplicável
      if (type === 'expense' && selectMethod.value === 'credit') {
        transaction.paymentMethod = 'credit';
        transaction.card = document.getElementById('select-card').value;
        transaction.installments = parseInt(document.getElementById('select-installments').value);
        transaction.dueDate = document.getElementById('input-due-date').value;
        
        if (transaction.installments > 1) {
          transaction.category = name + " (" + transaction.installments + "x)";
        }
      } else if (type === 'expense') {
        transaction.paymentMethod = selectMethod.value;
      }

      Store.addTransaction(transaction);
      
      alert('Transação adicionada com sucesso!');
      window.history.back();
    });
  }
};
