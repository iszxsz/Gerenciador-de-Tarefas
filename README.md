# Gerenciador de Tarefas
Aplicação full stack para gerenciamento de tarefas no estilo Kanban, com funcionalidades de criação, edição, exclusão e movimentação entre colunas por meio de drag and drop

O projeto foi desenvolvido utilizando Laravel no backend e Next.js no frontend, com comunicação via API REST

## Tecnologias utilizadas
### Backend
* PHP 8.2+
* Laravel 12
* SQLite
* API RESTful

### Frontend
* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS

## Funcionalidades
* Criação de tarefas
* Edição de tarefas
* Exclusão com confirmação
* Organização por status:
    * Pending
    * In Progress
    * Completed
* Movimentação de tarefas entre colunas via drag and drop
* Interface responsiva

## Arquitetura
O projeto está dividido em duas aplicações independentes:

```
task-manager/
 ├── backend/   → API Laravel
 └── frontend/  → Aplicação Next.js
```
O frontend consome a API do backend via requisições HTTP

### Fluxo:
```
Frontend (Next.js)
    ↓
Requisição HTTP
    ↓
API Laravel
    ↓
Banco SQLite
    ↓
Resposta JSON
    ↓
Renderização no React
```

## Como Executar o Projeto
1. Clonar o repositório
```
git clone https://github.com/seu-usuario/task-manager.git
cd task-manager
```
### Backend (Laravel)
1. Acessar a pasta
```
cd backend
```
2. Instalar dependências
```
composer install
```
3. Criar arquivo .env
```
cp .env.example .env
```

4. Gerar chave da aplicação
```
php artisan key:generate
```
5. Criar banco SQLite
```
touch database/database.sqlite
```

No arquivo .env, configure:
```
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```
6. Rodar migrations
```
php artisan migrate
```
7. Iniciar servidor
```
php artisan serve
```

O backend estará disponível em:
```
http://127.0.0.1:8000
```

### Frontend (Next.js)
1. Acessar a pasta

Em outro terminal:
```
cd frontend
```
2. Instalar dependências
```
npm install
```
3. Iniciar aplicação
```
npm run dev
```
O frontend estará disponível em:
```
http://localhost:3000
```

## Endpoints da API

Base URL:
```
http://127.0.0.1:8000/api
```
### Listar tarefas

GET /tasks

### Criar tarefa

POST /tasks

### Body JSON:
```
{
  "title": "Nova tarefa",
  "description": "Descrição da tarefa",
  "status": "pending",
  "priority": "medium"
}
```
### Atualizar tarefa

PUT /tasks/{id}

### Deletar tarefa

DELETE /tasks/{id}

## Conceitos Aplicados
* Separação entre frontend e backend
* Arquitetura baseada em API REST
* Validação de dados no backend
* Client Components no Next.js
* Gerenciamento de estado com useState
* useEffect para carregamento inicial
* Componentização (TaskCard)

## Melhorias Futuras

* Autenticação de usuários
* Filtros e busca
* Paginação no frontend
* Deploy em ambiente de produção
* Testes automatizados