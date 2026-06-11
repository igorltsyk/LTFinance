-- Ativar a extensão de UUID
create extension if not exists "uuid-ossp";

-- Criação da tabela de Transações (Ganhos e Gastos)
create table public.transactions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    amount decimal(12,2) not null,
    category text not null,
    type text check (type in ('income', 'expense')) not null,
    date timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criação da tabela de Faturas e Gastos Recorrentes
create table public.recurring_transactions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    amount decimal(12,2) not null,
    category text not null,
    due_date date not null,
    is_paid boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Segurança: Habilitar Row Level Security (RLS)
alter table public.transactions enable row level security;
alter table public.recurring_transactions enable row level security;

-- Políticas para Transactions: O usuário só pode ver, inserir, atualizar e deletar os próprios dados
create policy "Users can view their own transactions"
    on public.transactions for select
    using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
    on public.transactions for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
    on public.transactions for update
    using (auth.uid() = user_id);

create policy "Users can delete their own transactions"
    on public.transactions for delete
    using (auth.uid() = user_id);

-- Políticas para Recurring Transactions
create policy "Users can view their own recurring transactions"
    on public.recurring_transactions for select
    using (auth.uid() = user_id);

create policy "Users can insert their own recurring transactions"
    on public.recurring_transactions for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own recurring transactions"
    on public.recurring_transactions for update
    using (auth.uid() = user_id);

create policy "Users can delete their own recurring transactions"
    on public.recurring_transactions for delete
    using (auth.uid() = user_id);
