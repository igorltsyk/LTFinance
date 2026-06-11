import { supabase } from './supabase.js';

export const Store = {
  data: {
    user: null,
    transactions: [],
    investments: [],
    recurringTransactions: []
  },

  async init() {
    // Verificar sessão ativa
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      this.data.user = { 
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.name || 'Usuário' 
      };
      await this.loadData();
      await this.migrateLocalData();
    }
  },

  async loadData() {
    if (!this.data.user) return;

    // Fetch transactions
    const { data: txs } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
      
    if (txs) this.data.transactions = txs;

    // Fetch recurring
    const { data: recs } = await supabase
      .from('recurring_transactions')
      .select('*');
      
    if (recs) this.data.recurringTransactions = recs;

    // Fetch investments
    const { data: invs } = await supabase
      .from('investments')
      .select('*');
      
    if (invs) this.data.investments = invs;

    await this.checkRecurring();
  },

  async migrateLocalData() {
    const savedData = localStorage.getItem('ltfinance_data');
    if (!savedData) return;

    try {
      const parsed = JSON.parse(savedData);
      
      // Migrate Transactions (exclude mocks with id 1 and 2)
      if (parsed.transactions && parsed.transactions.length > 0) {
        const toMigrate = parsed.transactions.filter(t => t.id !== 1 && t.id !== 2);
        for (const t of toMigrate) {
          await supabase.from('transactions').insert([{
            type: t.type,
            category: t.category,
            amount: t.amount,
            date: t.date,
            payment_method: t.paymentMethod || t.payment_method,
            card: t.card,
            installments: t.installments || 1,
            due_date: t.dueDate || t.due_date,
            user_id: this.data.user.id
          }]);
        }
      }

      // Migrate Recurring
      if (parsed.recurringTransactions && parsed.recurringTransactions.length > 0) {
        for (const rt of parsed.recurringTransactions) {
          await supabase.from('recurring_transactions').insert([{
            type: rt.type,
            category: rt.category,
            amount: rt.amount,
            payment_method: rt.paymentMethod || rt.payment_method,
            due_day: rt.dueDay || rt.due_day,
            last_processed_month: rt.lastProcessedMonth || rt.last_processed_month,
            user_id: this.data.user.id
          }]);
        }
      }

      // Migrate Investments
      if (parsed.investments && parsed.investments.length > 0) {
         for (const inv of parsed.investments) {
          await supabase.from('investments').insert([{
            name: inv.name,
            amount: inv.amount,
            type: inv.type,
            user_id: this.data.user.id
          }]);
        }
      }

      // Remove local storage to prevent double migration
      localStorage.removeItem('ltfinance_data');
      
      // Reload data to reflect migrations
      await this.loadData();
    } catch (e) {
      console.error('Migration failed:', e);
    }
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    this.data.user = { 
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || 'Usuário' 
    };
    await this.loadData();
    await this.migrateLocalData();
    return true;
  },
  
  async register(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return true; // Vai precisar fazer login ou se auto loga dependendo da config do Supabase
  },

  async logout() {
    await supabase.auth.signOut();
    this.data.user = null;
    this.data.transactions = [];
    this.data.investments = [];
    this.data.recurringTransactions = [];
  },

  isLoggedIn() {
    return !!this.data.user;
  },

  async addTransaction(transaction) {
    const payload = {
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date || new Date().toISOString(),
      payment_method: transaction.paymentMethod,
      card: transaction.card,
      installments: transaction.installments || 1,
      due_date: transaction.dueDate,
      user_id: this.data.user.id
    };

    const { data, error } = await supabase.from('transactions').insert([payload]).select();
    if (!error && data) {
      // Compatibility with local logic
      data[0].paymentMethod = data[0].payment_method;
      data[0].dueDate = data[0].due_date;
      this.data.transactions.unshift(data[0]);
      
      this.data.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },

  async addRecurringTransaction(recurring) {
    const payload = {
      type: recurring.type,
      category: recurring.category,
      amount: recurring.amount,
      payment_method: recurring.paymentMethod,
      due_day: recurring.dueDay,
      user_id: this.data.user.id
    };

    const { data, error } = await supabase.from('recurring_transactions').insert([payload]).select();
    if (!error && data) {
      data[0].paymentMethod = data[0].payment_method;
      data[0].dueDay = data[0].due_day;
      this.data.recurringTransactions.push(data[0]);
      await this.checkRecurring();
    }
  },

  async checkRecurring() {
    if (!this.data.recurringTransactions || this.data.recurringTransactions.length === 0) return;
    
    const today = new Date();
    const currentMonthStr = `${today.getFullYear()}-${today.getMonth()}`;
    const currentDay = today.getDate();

    let madeChanges = false;

    for (let rt of this.data.recurringTransactions) {
      if (rt.last_processed_month !== currentMonthStr && currentDay >= rt.due_day) {
        
        const simDate = new Date(today.getFullYear(), today.getMonth(), rt.due_day);
        
        // Insere transação no banco
        const { data: newTx } = await supabase.from('transactions').insert([{
          type: rt.type,
          category: `${rt.category} (Fixo)`,
          amount: rt.amount,
          date: simDate.toISOString(),
          payment_method: rt.payment_method,
          user_id: this.data.user.id
        }]).select();

        if (newTx) {
          // Atualiza last_processed_month no banco
          await supabase.from('recurring_transactions')
            .update({ last_processed_month: currentMonthStr })
            .eq('id', rt.id);

          rt.last_processed_month = currentMonthStr;
          
          newTx[0].paymentMethod = newTx[0].payment_method;
          this.data.transactions.unshift(newTx[0]);
          madeChanges = true;
        }
      }
    }

    if (madeChanges) {
      this.data.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },

  getTransactions() {
    // Normaliza os campos para a UI que ainda espera camelCase
    return this.data.transactions.map(t => ({
      ...t,
      paymentMethod: t.payment_method || t.paymentMethod,
      dueDate: t.due_date || t.dueDate,
      dueDay: t.due_day || t.dueDay,
      lastProcessedMonth: t.last_processed_month || t.lastProcessedMonth
    }));
  },

  getDashboardStats() {
    let income = 0;
    let expense = 0;
    
    this.data.transactions.forEach(t => {
      const pm = t.payment_method || t.paymentMethod;
      if (pm === 'credit') return;

      if (t.type === 'income') income += t.amount;
      else if (t.type === 'expense') expense += Math.abs(t.amount);
    });

    return {
      balance: income - expense,
      income,
      expense,
      invested: this.data.investments.reduce((acc, curr) => acc + curr.amount, 0)
    };
  },

  async addInvestment(investment) {
    const payload = {
      name: investment.name,
      amount: investment.amount,
      type: investment.type || 'Geral',
      user_id: this.data.user.id
    };

    const { data, error } = await supabase.from('investments').insert([payload]).select();
    if (!error && data) {
      this.data.investments.push(data[0]);
    }
  },

  getFutureInstallments() {
    const futureMonths = {};
    
    const creditTxs = this.data.transactions.filter(t => (t.payment_method || t.paymentMethod) === 'credit');

    creditTxs.forEach(t => {
      const installments = t.installments || 1;
      const amountPerInstallment = t.amount / installments;
      const dueDate = t.due_date || t.dueDate;
      const baseDate = dueDate ? new Date(dueDate) : new Date(t.date);

      for (let i = 0; i < installments; i++) {
        const d = new Date(baseDate);
        d.setMonth(d.getMonth() + i);
        
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

        if (!futureMonths[monthKey]) {
          futureMonths[monthKey] = { label: monthLabel, cards: {}, total: 0 };
        }

        const card = t.card || 'Outro';
        if (!futureMonths[monthKey].cards[card]) {
          futureMonths[monthKey].cards[card] = { total: 0, items: [] };
        }

        let cleanName = t.category.replace(/ \(\d+x\)$/, '');

        futureMonths[monthKey].cards[card].total += amountPerInstallment;
        futureMonths[monthKey].total += amountPerInstallment;
        
        futureMonths[monthKey].cards[card].items.push({
          name: cleanName,
          installmentNumber: i + 1,
          totalInstallments: installments,
          amount: amountPerInstallment
        });
      }
    });

    const sortedKeys = Object.keys(futureMonths).sort();
    return sortedKeys.map(k => ({
      key: k,
      ...futureMonths[k]
    }));
  }
};
