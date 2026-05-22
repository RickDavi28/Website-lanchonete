# 🍔 SnapBurg — Sistema de Pedidos Online

> Site completo de lanchonete delivery com cardápio interativo, carrinho, checkout simulado e painel administrativo.

---

## 📁 Estrutura do Projeto

```
snapburg/
├── index.html                  # Página principal (cliente)
├── admin.html                  # Painel administrativo
├── README.md                   # Esta documentação
└── assets/
    ├── styles/
    │   └── style.css           # Toda a estilização (CSS variables, componentes, responsivo)
    └── scripts/
        └── script.js           # Lógica completa (módulos: Navbar, Menu, Cart, Checkout, Toast)
```

---

## ✅ Funcionalidades implementadas

### 🛍️ Cardápio
- 22 produtos em 5 categorias (Burgers, Hot Dogs, Porções, Bebidas, Combos)
- Filtros por categoria com tabs
- Busca em tempo real com debounce
- Cards com badge de destaque (Hot, Novo, Oferta, Combo)
- Controle de quantidade direto no card

### 🛒 Carrinho
- Adicionar / remover / alterar quantidade
- Animação de entrada/saída de itens
- Cálculo automático (subtotal, entrega, desconto)
- Frete grátis acima de R$ 80
- Cupons de desconto (SNAP10, SNAP5, PRIMEIR)
- Desconto extra de 5% no PIX

### 💳 Checkout (3 etapas)
1. Informações de entrega (com formatação automática de CEP e telefone)
2. Forma de pagamento (PIX com chave copiável, Cartão, Dinheiro com troco)
3. Resumo completo do pedido
- Validação de campos obrigatórios
- Modal de confirmação com ID do pedido

### 🖥️ Painel Admin
- KPIs em tempo real (pedidos, receita, pendentes, concluídos)
- Tabela completa de pedidos com expansão de detalhes
- Troca de status: Pendente → Preparando → Em Entrega → Concluído
- Cancelamento de pedidos
- Filtros por status + busca
- Dashboard com gráfico de vendas por hora
- Estatísticas por categoria
- Top 5 produtos
- Simulação automática de novos pedidos (a cada 45s)
- Relógio em tempo real

### 🎨 Design
- Dark mode profissional com paleta laranja
- Totalmente responsivo (mobile, tablet, desktop)
- Animações com CSS e IntersectionObserver
- Toast notifications
- Botão flutuante WhatsApp
- HTML semântico + ARIA

---

## 🚀 Como rodar

1. Baixe os arquivos e abra `index.html` em qualquer navegador moderno.  
   Não requer servidor, build ou instalação — **zero dependências**.

2. Para testar o admin, abra `admin.html` ou clique no link "Admin" na navbar.

---

## 🔮 Roadmap de evolução

### Etapa 1 — Separar frontend com React

```bash
npx create-react-app snapburg-frontend
# ou
npm create vite@latest snapburg-frontend -- --template react
```

**Reorganização sugerida:**
```
src/
├── components/
│   ├── Navbar/
│   ├── ProductCard/
│   ├── Cart/
│   └── Checkout/
├── context/
│   └── CartContext.jsx      # substitui STATE global
├── hooks/
│   ├── useCart.js
│   └── useProducts.js
├── pages/
│   ├── Home.jsx
│   └── Admin.jsx
└── services/
    └── api.js               # fetch wrapper para o backend
```

O `STATE` centralizado do `script.js` migra naturalmente para **React Context + useReducer** ou **Zustand**.

---

### Etapa 2 — Backend com Node.js + Express

```bash
mkdir snapburg-api && cd snapburg-api
npm init -y
npm install express cors helmet dotenv express-validator morgan
npm install -D nodemon
```

**Estrutura da API:**
```
snapburg-api/
├── src/
│   ├── routes/
│   │   ├── products.js      # GET /api/products
│   │   ├── orders.js        # POST /api/orders, GET /api/orders
│   │   └── coupons.js       # POST /api/coupons/validate
│   ├── controllers/
│   ├── middlewares/
│   │   ├── auth.js          # JWT para admin
│   │   └── validate.js
│   ├── models/              # Queries PostgreSQL
│   └── app.js
├── .env
└── server.js
```

**Endpoints principais:**
```
GET    /api/products              → lista cardápio
GET    /api/products/:id          → produto específico
POST   /api/orders                → criar pedido
GET    /api/orders                → listar pedidos (admin)
PATCH  /api/orders/:id/status     → atualizar status
POST   /api/coupons/validate      → validar cupom
POST   /api/contact               → formulário de contato
```

---

### Etapa 3 — Banco de dados PostgreSQL

```bash
npm install pg knex
```

**Schema principal:**
```sql
-- Produtos
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL,
  category    VARCHAR(50),
  emoji       VARCHAR(10),
  available   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Pedidos
CREATE TABLE orders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status      VARCHAR(20) DEFAULT 'pending',
  customer    JSONB NOT NULL,
  payment     VARCHAR(20),
  total       NUMERIC(10,2),
  discount    NUMERIC(10,2) DEFAULT 0,
  delivery    NUMERIC(10,2) DEFAULT 5,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Itens do pedido
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id),
  name        VARCHAR(100),
  price       NUMERIC(10,2),
  quantity    INTEGER DEFAULT 1
);

-- Cupons
CREATE TABLE coupons (
  code        VARCHAR(20) PRIMARY KEY,
  type        VARCHAR(10),       -- 'percent' | 'fixed'
  value       NUMERIC(10,2),
  active      BOOLEAN DEFAULT true,
  expires_at  TIMESTAMPTZ
);
```

---

### Etapa 4 — Integração Mercado Pago

```bash
npm install mercadopago
```

**Fluxo PIX:**
```js
import MercadoPago from 'mercadopago';
const client = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN });

// Criar preferência de pagamento PIX
const payment = await client.payment.create({
  transaction_amount: order.total,
  description: `Pedido SnapBurg ${order.id}`,
  payment_method_id: 'pix',
  payer: { email: customer.email },
});

// Retorna qr_code e qr_code_base64 para exibir no checkout
```

**Webhook para confirmação:**
```
POST /api/webhooks/mercadopago
→ Recebe notificação de pagamento aprovado
→ Atualiza status do pedido para 'preparing'
→ Dispara WebSocket para admin em tempo real
```

---

### Etapa 5 — Painel admin em tempo real com WebSocket

```bash
npm install socket.io
```

**No servidor:**
```js
io.on('connection', (socket) => {
  socket.join('admin');
});

// Ao criar pedido:
io.to('admin').emit('new_order', order);

// Ao atualizar status:
io.to('admin').emit('order_updated', { id, status });
```

**No React (admin):**
```js
import { io } from 'socket.io-client';
const socket = io(process.env.REACT_APP_API_URL);

socket.on('new_order', (order) => {
  setOrders(prev => [order, ...prev]);
  playNotificationSound();
  showToast(`Novo pedido ${order.id}!`);
});
```

---

## 🧱 Stack final sugerida

| Camada       | Tecnologia                              |
|--------------|-----------------------------------------|
| Frontend     | React + Vite + Tailwind CSS             |
| Estado       | Zustand ou React Context                |
| Backend      | Node.js + Express + Socket.IO           |
| Banco        | PostgreSQL + Knex.js (query builder)    |
| Auth         | JWT + bcrypt                            |
| Pagamento    | Mercado Pago SDK                        |
| Deploy       | Vercel (frontend) + Railway (backend)   |
| Imagens      | Cloudinary                              |
| CI/CD        | GitHub Actions                          |

---

## 📝 Licença

MIT — livre para uso comercial e educacional.

---

Desenvolvido com ❤️ para o projeto SnapBurg.
