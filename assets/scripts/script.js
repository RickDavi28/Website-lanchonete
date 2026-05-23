'use strict';

/* ============================================================
   SNAPBURG — SCRIPT.JS (FIXED VERSION)
   ============================================================ */

/* ============================================================
   1. DADOS
   ============================================================ */

const PRODUCTS = [
  {
    id: 'b01',
    category: 'burgers',
    name: 'SnapClassic',
    emoji: '🍔',
    price: 32.9,
    desc: 'Blend artesanal 180g, queijo cheddar, alface, tomate e molho especial.',
    tags: ['Mais Pedido'],
    rating: 4.9,
    available: true
  },
  {
    id: 'd01',
    category: 'drinks',
    name: 'Coca-Cola',
    emoji: '🥤',
    price: 7.9,
    desc: 'Coca-Cola 350ml.',
    tags: ['Gelado'],
    rating: 4.8,
    available: true
  }
];

const COUPONS = {
  SNAP10: { type: 'percent', value: 10 },
  SNAP5: { type: 'fixed', value: 5 }
};

/* ============================================================
   2. ESTADO
   ============================================================ */

const STATE = {
  cart: JSON.parse(localStorage.getItem('snapburg_cart') || '[]'),
  activeCategory: 'all',
  searchQuery: '',
  appliedCoupon: null,
  paymentMethod: null,
  deliveryFee: 5
};

/* ============================================================
   3. UTILITÁRIOS
   ============================================================ */

const $ = (selector) => document.querySelector(selector);

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);

const sanitize = (str = '') =>
  String(str).replace(/[<>&"]/g, (c) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;'
  }[c]));

const saveCart = () => {
  localStorage.setItem('snapburg_cart', JSON.stringify(STATE.cart));
};

const getProduct = (id) => PRODUCTS.find(p => p.id === id);

/* ============================================================
   4. TOAST
   ============================================================ */

const ToastModule = (() => {

  const container = $('#toastContainer');

  const show = (message, type = 'success') => {

    if (!container) return;

    const toast = document.createElement('div');

    toast.className = `toast toast--${type}`;

    toast.innerHTML = `
      <span>${sanitize(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  return { show };

})();

/* ============================================================
   5. MENU
   ============================================================ */

const MenuModule = (() => {

  const grid = $('#productsGrid');

  const getFiltered = () => {

    return PRODUCTS.filter(product => {

      const matchCategory =
        STATE.activeCategory === 'all' ||
        product.category === STATE.activeCategory;

      const q = STATE.searchQuery.toLowerCase();

      const matchSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.desc.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });
  };

  const render = () => {

    if (!grid) return;

    grid.innerHTML = '';

    const products = getFiltered();

    products.forEach(product => {

      const item = STATE.cart.find(i => i.id === product.id);

      const qty = item ? item.qty : 0;

      const card = document.createElement('div');

      card.className = 'product-card';

      card.innerHTML = `
        <div class="product-card__img">
          ${product.emoji}
        </div>

        <h3>${sanitize(product.name)}</h3>

        <p>${sanitize(product.desc)}</p>

        <strong>${formatCurrency(product.price)}</strong>

        ${
          qty > 0
            ? `
              <div class="qty-control">
                <button class="dec">-</button>
                <span>${qty}</span>
                <button class="inc">+</button>
              </div>
            `
            : `
              <button class="add-btn">
                Adicionar
              </button>
            `
        }
      `;

      if (qty > 0) {

        card.querySelector('.inc')
          .addEventListener('click', () => {
            CartModule.addItem(product.id);
          });

        card.querySelector('.dec')
          .addEventListener('click', () => {
            CartModule.decreaseItem(product.id);
          });

      } else {

        card.querySelector('.add-btn')
          .addEventListener('click', () => {
            CartModule.addItem(product.id);
          });
      }

      grid.appendChild(card);

    });

  };

  return {
    render
  };

})();

/* ============================================================
   6. CARRINHO
   ============================================================ */

const CartModule = (() => {

  const cartItems = $('#cartItems');
  const cartTotal = $('#cartTotal');
  const cartBadge = $('#cartBadge');

  const addItem = (productId) => {

    const existing = STATE.cart.find(i => i.id === productId);

    if (existing) {
      existing.qty++;
    } else {
      STATE.cart.push({
        id: productId,
        qty: 1
      });
    }

    saveCart();

    update();

    MenuModule.render();

    const product = getProduct(productId);

    ToastModule.show(`${product.name} adicionado`);
  };

  const decreaseItem = (productId) => {

    const item = STATE.cart.find(i => i.id === productId);

    if (!item) return;

    item.qty--;

    if (item.qty <= 0) {
      STATE.cart = STATE.cart.filter(i => i.id !== productId);
    }

    saveCart();

    update();

    MenuModule.render();
  };

  const calculateTotal = () => {

    let subtotal = 0;

    STATE.cart.forEach(item => {

      const product = getProduct(item.id);

      if (!product) return;

      subtotal += product.price * item.qty;
    });

    let discount = 0;

    if (STATE.appliedCoupon) {

      const coupon = STATE.appliedCoupon;

      if (coupon.type === 'percent') {
        discount = subtotal * (coupon.value / 100);
      } else {
        discount = coupon.value;
      }
    }

    if (STATE.paymentMethod === 'pix') {
      discount += subtotal * 0.05;
    }

    const total = subtotal - discount + STATE.deliveryFee;

    return Math.max(total, 0);
  };

  const renderItems = () => {

    if (!cartItems) return;

    cartItems.innerHTML = '';

    STATE.cart.forEach(item => {

      const product = getProduct(item.id);

      if (!product) return;

      const div = document.createElement('div');

      div.className = 'cart-item';

      div.innerHTML = `
        <span>${product.emoji}</span>

        <div>
          <strong>${sanitize(product.name)}</strong>
          <p>${item.qty}x</p>
        </div>

        <span>
          ${formatCurrency(product.price * item.qty)}
        </span>
      `;

      cartItems.appendChild(div);
    });
  };

  const update = () => {

    renderItems();

    if (cartTotal) {
      cartTotal.textContent = formatCurrency(calculateTotal());
    }

    if (cartBadge) {

      const totalQty = STATE.cart.reduce(
        (acc, item) => acc + item.qty,
        0
      );

      cartBadge.textContent = totalQty;
    }
  };

  return {
    addItem,
    decreaseItem,
    update
  };

})();

/* ============================================================
   7. CHECKOUT
   ============================================================ */

const CheckoutModule = (() => {

  const placeOrder = () => {

    if (STATE.cart.length === 0) {
      ToastModule.show('Carrinho vazio', 'error');
      return;
    }

    const order = {
      id: `#${Date.now()}`,
      items: STATE.cart,
      total: CartModule.calculateTotal?.() || 0,
      createdAt: new Date().toISOString()
    };

    const orders = JSON.parse(
      localStorage.getItem('snapburg_orders') || '[]'
    );

    orders.unshift(order);

    localStorage.setItem(
      'snapburg_orders',
      JSON.stringify(orders)
    );

    STATE.cart = [];

    saveCart();

    CartModule.update();

    MenuModule.render();

    ToastModule.show('Pedido realizado!');
  };

  return {
    placeOrder
  };

})();

/* ============================================================
   8. ADMIN FIX
   ============================================================ */

/*
  ESSA PARTE RESOLVE TEU ERRO:
  "MOCK_ORDERS is not defined"
*/

window.MOCK_ORDERS = JSON.parse(
  localStorage.getItem('snapburg_orders') || '[]'
);

/* ============================================================
   9. INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  MenuModule.render();

  CartModule.update();

  console.log(
    '%c🍔 SnapBurg ONLINE',
    'background:#f97316;color:white;padding:6px;font-weight:bold'
  );

});