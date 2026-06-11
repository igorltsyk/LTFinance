# LTFinance

Um aplicativo de Controle Financeiro Pessoal focado em mobile, projetado como um PWA (Progressive Web App) de alto desempenho. O LTFinance oferece uma experiência premium e nativa (especialmente no iOS), sem precisar de frameworks pesados, utilizando JavaScript e CSS puro, e potencializado por **Supabase** no backend.

## Funcionalidades

- **Gerenciamento de Transações**: Controle detalhado de receitas e despesas com categorização inteligente.
- **Gestão de Faturas**: Acompanhamento de gastos no cartão de crédito com barra de progresso em tempo real que deduz do seu saldo previsto.
- **Autenticação Segura**: Sistema de Login e Criação de Conta nativo.
- **Sincronização em Nuvem (Real-time)**: Todos os seus dados são salvos na nuvem via Supabase.
- **Privacidade Total**: O banco de dados utiliza RLS (Row Level Security), garantindo que apenas você tem acesso aos seus registros.
- **100% PWA**: Pode ser instalado direto na tela inicial do celular. Funciona em "Standalone Mode", escondendo as barras do navegador para imitar um app nativo baixado da loja.
- **Design Premium**: *Dark mode* moderno, com micro-interações, gradientes suaves e respeito total as "Safe Areas" do iPhone (Notch e Home Indicator).

## Tecnologias Utilizadas

- **Frontend**: HTML5, Vanilla CSS (com uso avançado de variáveis e Flexbox) e Vanilla JavaScript (ES6+ Modules). Sem uso de frameworks como React ou Angular, garantindo máxima performance.
- **Backend / BaaS**: [Supabase](https://supabase.com/) (PostgreSQL + Auth API).
- **Ícones**: Phosphor Icons.

## Como Executar o Projeto

Como a aplicação é estática e roda 100% no lado do cliente, rodar o projeto é extremamente simples:

1. Clone o repositório:
   ```bash
   git clone https://github.com/igorltsyk/LTFinance.git
   ```

2. Abra o diretório do projeto:
   ```bash
   cd LTFinance
   ```

3. Configure o Supabase:
   - Crie um projeto no Supabase.
   - Rode os scripts de banco de dados (schema.sql e schema_auth.sql).
   - Atualize as chaves supabaseUrl e supabaseKey no arquivo js/supabase.js.

4. Inicie a aplicação:
   - Você pode usar qualquer servidor estático simples. Se estiver usando o VS Code, basta iniciar via extensão Live Server.
   - Ou via terminal com Python: python -m http.server 8000

## Dica de Uso (iOS/Safari)

Para ter a melhor experiência possível:
1. Abra o site no Safari.
2. Toque em "Compartilhar".
3. Escolha "Adicionar à Tela de Início".
4. Abra o app pelo ícone criado na sua área de trabalho para desfrutar da interface sem barras de navegação do browser.

---
Feito com foco em simplicidade, segurança e uma interface limpa.
