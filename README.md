# React + TypeScript + Vite

# Family Vault Web


Front-end SPA (Single Page Application) para o sistema **Family Vault**, desenvolvido em **React + TypeScript + Vite**. A aplicação é responsável pela interface do usuário para gerenciar transações financeiras, usuários, categorias e relatórios.


---


## 🛠 Tecnologias


- **Framework e Biblioteca**
  - React 19
  - TypeScript
  - Vite
  - React Router DOM
  - Zustand (state management)
- **Formulários**
  - react-hook-form
  - zod (validação)
  - @hookform/resolvers
- **Estilo**
  - Tailwind CSS 4
  - tailwind-merge
  - lucide-react (ícones)
  - tailwind-animate / tw-animate-css
- **Data Fetching**
  - Axios
  - React Query (@tanstack/react-query)
- **Autenticação**
  - JWT via Axios
  - jwt-decode
- **Utilitários**
  - clsx
  - class-variance-authority


---


## ⚡ Estrutura do Projeto



src/
├─ api/ # Configuração do Axios e interceptors
├─ components/ # Componentes reutilizáveis
├─ components/ # Funcionalidades específicas (Ex: listagem, formulario)
├─ schemas/ # Schemas zod para validação de formulários
├─ services/ # Chamadas à API (Transactions, Users, etc.)
├─ types/ # Tipagens TypeScript
├─ App.tsx # Componente principal
├─ main.tsx # Entry point do Vite



- **State Management:** Zustand é usado para gerenciar estados globais.
- **Formulários:** react-hook-form + zod para validação tipada e confiável.
- **API Requests:** Axios + React Query para caching e revalidação de dados.


---

📥 Dependências

react, react-dom

react-router-dom

axios, @tanstack/react-query

react-hook-form, zod, @hookform/resolvers

zustand

tailwindcss, tailwind-merge, tailwind-animate, tw-animate-css

lucide-react, clsx, class-variance-authority

jwt-decode


💻 Requisitos

Node.js >= 20

NPM ou Yarn
