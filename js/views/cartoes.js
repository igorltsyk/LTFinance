import { Store } from '../store.js';
import { Formatters } from '../utils/formatters.js';

export default {
  render() {
    const futureMonths = Store.getFutureInstallments();

    // Filtra para remover meses que não têm faturas
    const validMonths = futureMonths.filter(m => m.total < 0); // Gastos são negativos

    let monthsHtml = '';

    if (validMonths.length === 0) {
      monthsHtml = `
        <div class="text-center text-secondary py-6 mt-6">
          <i class="ph ph-credit-card fs-3xl mb-2"></i>
          <p>Você não possui parcelas futuras.</p>
        </div>
      `;
    } else {
      monthsHtml = validMonths.map(month => {
        let cardsHtml = '';
        
        for (const [cardName, cardData] of Object.entries(month.cards)) {
          let itemsHtml = cardData.items.map(item => `
            <div class="d-flex justify-between align-center mb-2 fs-sm">
              <div class="text-secondary">${item.name} (${item.installmentNumber}/${item.totalInstallments})</div>
              <div>${Formatters.currency(Math.abs(item.amount))}</div>
            </div>
          `).join('');

          // Lógica de cores baseada no nome do cartão (opcional)
          let cardColor = 'var(--text-secondary)';
          if (cardName === 'nubank') cardColor = '#8B5CF6';
          if (cardName === 'itau') cardColor = '#F97316';
          if (cardName === 'inter') cardColor = '#F59E0B';
          if (cardName === 'sicredi') cardColor = '#10B981';

          let cardLabel = cardName.charAt(0).toUpperCase() + cardName.slice(1);

          cardsHtml += `
            <div class="mb-4">
              <div class="d-flex justify-between align-center mb-2 pb-1" style="border-bottom: 1px solid var(--border-color);">
                <div class="fw-semibold d-flex align-center gap-2">
                  <i class="ph ph-credit-card" style="color: ${cardColor}"></i>
                  ${cardLabel}
                </div>
                <div class="fw-semibold text-danger">${Formatters.currency(Math.abs(cardData.total))}</div>
              </div>
              <div class="pl-2">
                ${itemsHtml}
              </div>
            </div>
          `;
        }

        // Capitaliza a primeira letra do mes
        let labelCapitalized = month.label.charAt(0).toUpperCase() + month.label.slice(1);

        return `
          <div class="card mb-4">
            <div class="d-flex justify-between align-center mb-4">
              <h2 class="fs-lg fw-bold text-primary">${labelCapitalized}</h2>
              <div class="fs-md fw-bold text-danger">Total: ${Formatters.currency(Math.abs(month.total))}</div>
            </div>
            ${cardsHtml}
          </div>
        `;
      }).join('');
    }

    return `
      <div class="header d-flex align-center gap-3">
        <a href="#/" class="text-primary" style="font-size: 24px;">
          <i class="ph ph-arrow-left"></i>
        </a>
        <div>
          <h1>Faturas</h1>
          <p>Suas parcelas futuras</p>
        </div>
      </div>

      <div class="pb-4">
        ${monthsHtml}
      </div>
    `;
  },

  afterRender() {
    // Esconder bottom nav ao entrar aqui, opcional.
    // Vamos manter a nav oculta para focar na leitura, igual o AddView.
  }
};
