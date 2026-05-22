/**
 * SnapBurg — script.js
 * Autor: SnapBurg Dev Team | Versão: 1.0.0
 *
 * Módulos:
 *  1. Dados do Cardápio (mock — substituir por API)
 *  2. Estado da Aplicação
 *  3. Utilitários
 *  4. Módulo: Navbar
 *  5. Módulo: Cardápio (render + filtros + busca)
 *  6. Módulo: Carrinho
 *  7. Módulo: Checkout
 *  8. Módulo: Contato
 *  9. Módulo: Toast
 * 10. Inicialização
 */

'use strict';

/* ============================================================
   1. DADOS DO CARDÁPIO (mock — ready for REST API)
   Estrutura preparada para endpoint GET /api/products
   ============================================================ */
const PRODUCTS = [
  // ── Burgers ──────────────────────────────────────────────
  {
    id: 'b01', category: 'burgers', name: 'SnapClassic',
    emoji: '🍔', price: 32.90, originalPrice: null,
    desc: 'Blend artesanal 180g, queijo cheddar, alface, tomate e molho especial da casa.',
    tags: ['Mais Pedido'], badge: 'Hot', badgeType: 'hot',
    rating: 4.9, available: true
  },
  {
    id: 'b02', category: 'burgers', name: 'SnapDouble',
    emoji: '🍔', price: 44.90, originalPrice: 49.90,
    desc: 'Dois blends 150g, queijo duplo, bacon crocante e cebola caramelizada.',
    tags: ['Bacon', 'Duplo'], badge: 'Oferta', badgeType: 'promo',
    rating: 4.8, available: true
  },
  {
    id: 'b03', category: 'burgers', name: 'SnapCrispy',
    emoji: '🍗', price: 29.90, originalPrice: null,
    desc: 'Frango empanado crocante, maionese de alho, pepino em conserva e pão de brioche.',
    tags: ['Frango', 'Crocante'], badge: null, badgeType: null,
    rating: 4.7, available: true
  },
  {
    id: 'b04', category: 'burgers', name: 'SnapVerde',
    emoji: '🥬', price: 31.90, originalPrice: null,
    desc: 'Burger de grão-de-bico, cream cheese de ervas, rúcula, tomate seco e pão integral.',
    tags: ['Vegano', 'Saudável'], badge: 'Novo', badgeType: 'new',
    rating: 4.6, available: true
  },
  {
    id: 'b05', category: 'burgers', name: 'SnapSmash',
    emoji: '🔥', price: 38.90, originalPrice: null,
    desc: 'Smash burger duplo, queijo americano derretido, picles e mostarda amarela.',
    tags: ['Smash', 'Especial'], badge: null, badgeType: null,
    rating: 4.8, available: true
  },
  {
    id: 'b06', category: 'burgers', name: 'SnapBBQ',
    emoji: '🥩', price: 42.90, originalPrice: null,
    desc: 'Blend 200g, molho barbecue defumado, onion rings, queijo gouda e bacon em tiras.',
    tags: ['BBQ', 'Premium'], badge: null, badgeType: null,
    rating: 4.9, available: true
  },

  // ── Hot Dogs ─────────────────────────────────────────────
  {
    id: 'h01', category: 'hotdogs', name: 'Dog Tradicional',
    emoji: '🌭', price: 18.90, originalPrice: null,
    desc: 'Salsicha grelhada, ketchup, mostarda, maionese e batata palha.',
    tags: ['Clássico'], badge: null, badgeType: null,
    rating: 4.5, available: true
  },
  {
    id: 'h02', category: 'hotdogs', name: 'Dog Supremo',
    emoji: '🌭', price: 24.90, originalPrice: null,
    desc: 'Salsicha dupla, cheddar, catupiry, bacon bits, vinagrete e batata palha.',
    tags: ['Duplo', 'Especial'], badge: 'Hot', badgeType: 'hot',
    rating: 4.7, available: true
  },
  {
    id: 'h03', category: 'hotdogs', name: 'Dog Italiano',
    emoji: '🌭', price: 22.90, originalPrice: null,
    desc: 'Salsicha italiana, molho de tomate caseiro, mussarela derretida e azeitona.',
    tags: ['Italiano'], badge: 'Novo', badgeType: 'new',
    rating: 4.6, available: true
  },

  // ── Porções / Fries ──────────────────────────────────────
  {
    id: 'f01', category: 'fries', name: 'Batata Frita P',
    emoji: '🍟', price: 14.90, originalPrice: null,
    desc: 'Batatas fritas crocantes temperadas. Porção individual.',
    tags: ['Individual'], badge: null, badgeType: null,
    rating: 4.6, available: true
  },
  {
    id: 'f02', category: 'fries', name: 'Batata Frita G',
    emoji: '🍟', price: 22.90, originalPrice: null,
    desc: 'Porção grande de fritas crocantes para dividir com alguém especial.',
    tags: ['Compartilhar'], badge: null, badgeType: null,
    rating: 4.7, available: true
  },
  {
    id: 'f03', category: 'fries', name: 'Batata Cheddar',
    emoji: '🧀', price: 26.90, originalPrice: null,
    desc: 'Fritas cobertas com cheddar cremoso quente e bacon crocante.',
    tags: ['Cheddar', 'Bacon'], badge: 'Favorito', badgeType: 'hot',
    rating: 4.9, available: true
  },
  {
    id: 'f04', category: 'fries', name: 'Onion Rings',
    emoji: '🧅', price: 19.90, originalPrice: null,
    desc: 'Anéis de cebola empanados, crocantes por fora e macios por dentro.',
    tags: ['Crocante'], badge: null, badgeType: null,
    rating: 4.5, available: true
  },
  {
    id: 'f05', category: 'fries', name: 'Nuggets (10un)',
    emoji: '🍗', price: 21.90, originalPrice: null,
    desc: '10 nuggets de frango crocantes com molho barbecue ou mostarda-mel.',
    tags: ['Frango', '10un'], badge: null, badgeType: null,
    rating: 4.6, available: true
  },

  // ── Bebidas ──────────────────────────────────────────────
  {
    id: 'd01', category: 'drinks', name: 'Coca-Cola Lata',
    emoji: '🥤', price: 7.90, originalPrice: null,
    desc: 'Coca-Cola gelada 350ml.',
    tags: ['350ml', 'Gelado'], badge: null, badgeType: null,
    rating: 4.8, available: true
  },
  {
    id: 'd02', category: 'drinks', name: 'Suco Natural',
    emoji: '🍊', price: 12.90, originalPrice: null,
    desc: 'Suco natural 400ml. Sabores: laranja, limão, morango ou abacaxi.',
    tags: ['Natural', '400ml'], badge: null, badgeType: null,
    rating: 4.7, available: true
  },
  {
    id: 'd03', category: 'drinks', name: 'Milk Shake',
    emoji: '🥛', price: 19.90, originalPrice: null,
    desc: 'Shake cremoso 500ml. Sabores: chocolate, morango, baunilha ou nutella.',
    tags: ['500ml', 'Cremoso'], badge: 'Novo', badgeType: 'new',
    rating: 4.9, available: true
  },
  {
    id: 'd04', category: 'drinks', name: 'Água Mineral',
    emoji: '💧', price: 4.90, originalPrice: null,
    desc: 'Água mineral sem gás 500ml.',
    tags: ['500ml'], badge: null, badgeType: null,
    rating: 4.5, available: true
  },

  // ── Combos ───────────────────────────────────────────────
  {
    id: 'c01', category: 'combos', name: 'Combo Classic',
    emoji: '🎯', price: 49.90, originalPrice: 57.70,
    desc: 'SnapClassic + Batata Frita G + Coca-Cola Lata. Economia garantida!',
    tags: ['Combo', 'Econômico'], badge: 'Combo', badgeType: 'combo',
    rating: 4.9, available: true
  },
  {
    id: 'c02', category: 'combos', name: 'Combo Double',
    emoji: '🎯', price: 62.90, originalPrice: 74.70,
    desc: 'SnapDouble + Batata Cheddar + Milk Shake. O combo dos campeões!',
    tags: ['Combo', 'Premium'], badge: 'Combo', badgeType: 'combo',
    rating: 4.8, available: true
  },
  {
    id: 'c03', category: 'combos', name: 'Combo Família',
    emoji: '👨‍👩‍👧', price: 119.90, originalPrice: 149.50,
    desc: '2x SnapClassic + 1x SnapCrispy + Batata Frita G (2un) + 4 Bebidas.',
    tags: ['Família', 'Econômico'], badge: 'Combo', badgeType: 'combo',
    rating: 4.9, available: true
  }
];

/** Cupons de desconto (mock — substituir por GET /api/coupons) */
const COUPONS = {
  'SNAP10':  { type: 'percent', value: 10,  label: '10% de desconto' },
  'SNAP5':   { type: 'fixed',   value: 5,   label: 'R$ 5,00 de desconto' },
  'PRIMEIR': { type: 'percent', value: 15,  label: '15% de desconto (primeiro pedido)' }
};

/* ============================================================
   2. ESTADO GLOBAL DA APLICAÇÃO
   Centralizado para facilitar migração para React/Vuex/Redux
   ============================================================ */
const STATE = {
  cart:            [],       // itens no carrinho
  activeCategory:  'all',   // categoria selecionada
  searchQuery:     '',       // texto de busca
  appliedCoupon:   null,     // cupom ativo
  deliveryFee:     5.00,    // taxa de entrega (R$)
  orderCounter:    1000,    // contador de pedidos (simula ID sequencial)
  checkoutStep:    1,        // etapa atual do checkout
  paymentMethod:   null,     // método de pagamento selecionado
};

/* ============================================================
   3. UTILITÁRIOS
   ============================================================ */

/** Formata número como moeda brasileira */
const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

/** Formata horário HH:MM */
const formatTime = (date = new Date()) =>
  date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

/** Debounce simples */
const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
};

/** Gera ID de pedido formatado */
const genOrderId = () => `#${(++STATE.orderCounter).toString().padStart(4, '0')}`;

/** Sanitiza string para exibição segura (XSS básico) */
const sanitize = (str) => String(str).replace(/[<>&"]/g, (c) =>
  ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;' }[c]));

/* ============================================================
   4. MÓDULO: NAVBAR
   ============================================================ */
const NavbarModule = (() => {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  /** Adiciona classe .scrolled quando usuário rola a página */
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Destaca o link de navegação ativo com base na seção visível
    const sections = document.querySelectorAll('section[id], div[id="hero"]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    document.querySelectorAll('.navbar__link').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };

  /** Toggle do menu hambúrguer no mobile */
  const toggleMenu = () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  /** Fecha o menu ao clicar em um link */
  const closeMenu = () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const init = () => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    hamburger.addEventListener('click', toggleMenu);
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    // Atalho: links do rodapé com data-filter ativam categoria do cardápio
    document.querySelectorAll('[data-filter]').forEach(link => {
      link.addEventListener('click', (e) => {
        const cat = link.dataset.filter;
        if (cat) {
          e.preventDefault();
          MenuModule.setCategory(cat);
          document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  };

  return { init };
})();

/* ============================================================
   5. MÓDULO: CARDÁPIO
   ============================================================ */
const MenuModule = (() => {
  const grid        = document.getElementById('productsGrid');
  const emptyState  = document.getElementById('emptyState');
  const emptyQuery  = document.getElementById('emptyQuery');
  const searchInput = document.getElementById('menuSearch');
  const searchClear = document.getElementById('searchClear');
  const catTabs     = document.querySelectorAll('.category-tab');

  /** Retorna produtos filtrados por categoria e busca */
  const getFiltered = () => {
    const query = STATE.searchQuery.toLowerCase().trim();
    return PRODUCTS.filter(p => {
      const matchCat  = STATE.activeCategory === 'all' || p.category === STATE.activeCategory;
      const matchText = !query
        || p.name.toLowerCase().includes(query)
        || p.desc.toLowerCase().includes(query)
        || p.tags.some(t => t.toLowerCase().includes(query));
      return matchCat && matchText && p.available;
    });
  };

  /** Cria o HTML de um card de produto */
  const renderCard = (product) => {
    const cartItem = STATE.cart.find(i => i.id === product.id);
    const qty      = cartItem ? cartItem.qty : 0;
    const badgeMap = { hot: 'hot', new: 'new', combo: 'combo', promo: '' };

    const badgeHtml = product.badge
      ? `<span class="product-card__badge product-card__badge--${badgeMap[product.badgeType] || ''}">${sanitize(product.badge)}</span>`
      : '';

    const originalHtml = product.originalPrice
      ? `<span class="product-card__price-original">${formatCurrency(product.originalPrice)}</span>`
      : '';

    const tagsHtml = product.tags
      .map(t => `<span class="product-tag">${sanitize(t)}</span>`).join('');

    const qtyControls = qty > 0
      ? `<div class="qty-control" role="group" aria-label="Quantidade">
           <button class="qty-btn" data-action="dec" data-id="${product.id}" aria-label="Diminuir">−</button>
           <span class="qty-display" aria-live="polite">${qty}</span>
           <button class="qty-btn" data-action="inc" data-id="${product.id}" aria-label="Aumentar">+</button>
         </div>`
      : `<button class="add-btn" data-id="${product.id}" aria-label="Adicionar ${sanitize(product.name)} ao carrinho">+</button>`;

    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('role', 'listitem');
    card.dataset.productId = product.id;
    card.innerHTML = `
      ${badgeHtml}
      <div class="product-card__img" aria-hidden="true">${product.emoji}</div>
      <div class="product-card__body">
        <h3 class="product-card__name">${sanitize(product.name)}</h3>
        <p class="product-card__desc">${sanitize(product.desc)}</p>
        <div class="product-card__tags">${tagsHtml}</div>
      </div>
      <div class="product-card__footer">
        <div class="product-card__price">
          ${originalHtml}
          <span class="product-card__price-current">${formatCurrency(product.price)}</span>
        </div>
        ${qtyControls}
      </div>`;

    // Eventos dos botões do card
    const addBtn = card.querySelector('.add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => CartModule.addItem(product.id));
    }

    card.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'inc') CartModule.addItem(product.id);
        if (action === 'dec') CartModule.decreaseItem(product.id);
      });
    });

    return card;
  };

  /** Renderiza a grade completa */
  const render = () => {
    const filtered = getFiltered();

    grid.innerHTML = '';
    emptyState.style.display = 'none';

    if (filtered.length === 0) {
      emptyState.style.display = 'flex';
      if (emptyQuery) emptyQuery.textContent = STATE.searchQuery;
      return;
    }

    const fragment = document.createDocumentFragment();
    filtered.forEach((p, i) => {
      const card = renderCard(p);
      card.style.animationDelay = `${i * 40}ms`;
      fragment.appendChild(card);
    });
    grid.appendChild(fragment);
  };

  /** Atualiza somente o controle de quantidade de um card específico (sem re-render total) */
  const updateCardQty = (productId) => {
    const card = grid.querySelector(`[data-product-id="${productId}"]`);
    if (!card) return;
    const product  = PRODUCTS.find(p => p.id === productId);
    const cartItem = STATE.cart.find(i => i.id === productId);
    const qty      = cartItem ? cartItem.qty : 0;
    const footer   = card.querySelector('.product-card__footer');
    const priceEl  = footer.querySelector('.product-card__price').outerHTML;

    const newControls = qty > 0
      ? `<div class="qty-control" role="group" aria-label="Quantidade">
           <button class="qty-btn" data-action="dec" data-id="${productId}" aria-label="Diminuir">−</button>
           <span class="qty-display" aria-live="polite">${qty}</span>
           <button class="qty-btn" data-action="inc" data-id="${productId}" aria-label="Aumentar">+</button>
         </div>`
      : `<button class="add-btn" data-id="${productId}" aria-label="Adicionar ${sanitize(product.name)} ao carrinho">+</button>`;

    footer.innerHTML = priceEl + newControls;

    // Re-bind events
    const addBtn = footer.querySelector('.add-btn');
    if (addBtn) addBtn.addEventListener('click', () => CartModule.addItem(productId));
    footer.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.action === 'inc') CartModule.addItem(productId);
        if (btn.dataset.action === 'dec') CartModule.decreaseItem(productId);
      });
    });
  };

  /** Ativa uma categoria */
  const setCategory = (category) => {
    STATE.activeCategory = category;
    catTabs.forEach(tab => {
      const isActive = tab.dataset.category === category;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive);
    });
    render();
  };

  const init = () => {
    // Filtros de categoria
    catTabs.forEach(tab => {
      tab.addEventListener('click', () => setCategory(tab.dataset.category));
    });

    // Campo de busca com debounce
    const handleSearch = debounce((val) => {
      STATE.searchQuery = val;
      searchClear.style.display = val ? 'flex' : 'none';
      render();
    }, 280);

    searchInput.addEventListener('input', (e) => handleSearch(e.target.value));

    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      STATE.searchQuery = '';
      searchClear.style.display = 'none';
      render();
      searchInput.focus();
    });

    render();
  };

  return { init, render, updateCardQty, setCategory };
})();

/* ============================================================
   6. MÓDULO: CARRINHO
   ============================================================ */
const CartModule = (() => {
  // Elementos DOM do carrinho
  const cartBtn      = document.getElementById('cartBtn');
  const cartBadge    = document.getElementById('cartBadge');
  const cartOverlay  = document.getElementById('cartOverlay');
  const cartSidebar  = document.getElementById('cartSidebar');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartEmpty    = document.getElementById('cartEmpty');
  const cartItems    = document.getElementById('cartItems');
  const cartFooter   = document.getElementById('cartFooter');
  const cartGoMenu   = document.getElementById('cartGoToMenu');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const checkoutBtn  = document.getElementById('checkoutBtn');

  // Totais
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartDelivery = document.getElementById('cartDelivery');
  const cartDiscount = document.getElementById('cartDiscount');
  const cartTotal    = document.getElementById('cartTotal');

  // Cupom
  const couponInput    = document.getElementById('couponInput');
  const couponApplyBtn = document.getElementById('couponApplyBtn');

  /** Abre o carrinho */
  const open = () => {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
    cartOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    cartCloseBtn.focus();
  };

  /** Fecha o carrinho */
  const close = () => {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
    cartOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    cartBtn.focus();
  };

  /** Adiciona ou incrementa item */
  const addItem = (productId) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = STATE.cart.find(i => i.id === productId);
    if (existing) {
      existing.qty++;
    } else {
      STATE.cart.push({ id: productId, qty: 1, price: product.price, name: product.name, emoji: product.emoji });
    }

    update();
    MenuModule.updateCardQty(productId);
    ToastModule.show(`${product.emoji} ${product.name} adicionado!`, 'success');

    // Animação no badge
    cartBadge.classList.remove('pop');
    void cartBadge.offsetWidth; // reflow
    cartBadge.classList.add('pop');
  };

  /** Decrementa ou remove item */
  const decreaseItem = (productId) => {
    const idx = STATE.cart.findIndex(i => i.id === productId);
    if (idx === -1) return;
    if (STATE.cart[idx].qty > 1) {
      STATE.cart[idx].qty--;
    } else {
      STATE.cart.splice(idx, 1);
    }
    update();
    MenuModule.updateCardQty(productId);
  };

  /** Remove completamente um item */
  const removeItem = (productId, animate = true) => {
    const itemEl = cartItems.querySelector(`[data-cart-id="${productId}"]`);
    const doRemove = () => {
      STATE.cart = STATE.cart.filter(i => i.id !== productId);
      update();
      MenuModule.updateCardQty(productId);
    };

    if (animate && itemEl) {
      itemEl.classList.add('removing');
      itemEl.addEventListener('animationend', doRemove, { once: true });
    } else {
      doRemove();
    }
  };

  /** Limpa o carrinho inteiro */
  const clearCart = () => {
    if (STATE.cart.length === 0) return;
    // Atualiza cards do menu antes de limpar
    const ids = STATE.cart.map(i => i.id);
    STATE.cart = [];
    STATE.appliedCoupon = null;
    couponInput.value = '';
    ids.forEach(id => MenuModule.updateCardQty(id));
    update();
    ToastModule.show('Carrinho esvaziado.', 'info');
  };

  /** Calcula totais com cupom */
  const calculateTotals = () => {
    const subtotal = STATE.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    let discount   = 0;

    if (STATE.appliedCoupon) {
      const c = STATE.appliedCoupon;
      discount = c.type === 'percent' ? subtotal * (c.value / 100) : c.value;
      discount = Math.min(discount, subtotal);
    }

    // PIX dá 5% extra de desconto
    if (STATE.paymentMethod === 'pix') {
      discount += (subtotal - discount) * 0.05;
    }

    const delivery = subtotal >= 80 ? 0 : STATE.deliveryFee;
    const total    = Math.max(0, subtotal - discount + delivery);

    return { subtotal, discount, delivery, total };
  };

  /** Renderiza a lista de itens no painel lateral */
  const renderItems = () => {
    cartItems.innerHTML = '';
    const fragment = document.createDocumentFragment();

    STATE.cart.forEach(item => {
      const product  = PRODUCTS.find(p => p.id === item.id);
      const subtotal = item.price * item.qty;

      const li = document.createElement('div');
      li.className = 'cart-item';
      li.setAttribute('role', 'listitem');
      li.dataset.cartId = item.id;
      li.innerHTML = `
        <div class="cart-item__emoji" aria-hidden="true">${item.emoji}</div>
        <div class="cart-item__info">
          <p class="cart-item__name">${sanitize(item.name)}</p>
          <p class="cart-item__price">${formatCurrency(item.price)} cada</p>
          <p class="cart-item__subtotal">${formatCurrency(subtotal)}</p>
          <div class="cart-item__controls">
            <button class="cart-item__qty-btn cart-item__qty-btn--remove" data-action="dec" aria-label="Diminuir quantidade">−</button>
            <span class="cart-item__qty" aria-live="polite">${item.qty}</span>
            <button class="cart-item__qty-btn" data-action="inc" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>
        <button class="cart-item__delete" aria-label="Remover ${sanitize(item.name)}">
          <i class="fas fa-trash" aria-hidden="true"></i>
        </button>`;

      // Events
      li.querySelector('[data-action="inc"]').addEventListener('click', () => addItem(item.id));
      li.querySelector('[data-action="dec"]').addEventListener('click', () => decreaseItem(item.id));
      li.querySelector('.cart-item__delete').addEventListener('click', () => removeItem(item.id));

      fragment.appendChild(li);
    });

    cartItems.appendChild(fragment);
  };

  /** Atualiza badge, totais e visibilidade dos elementos */
  const update = () => {
    const totalQty = STATE.cart.reduce((s, i) => s + i.qty, 0);
    cartBadge.textContent = totalQty;

    const isEmpty = STATE.cart.length === 0;
    cartEmpty.style.display  = isEmpty ? 'flex' : 'none';
    cartItems.style.display  = isEmpty ? 'none' : 'flex';
    cartFooter.style.display = isEmpty ? 'none' : 'flex';

    if (!isEmpty) {
      renderItems();
      const { subtotal, discount, delivery, total } = calculateTotals();

      cartSubtotal.textContent = formatCurrency(subtotal);
      cartDelivery.textContent = delivery === 0 ? '🎉 Grátis' : formatCurrency(delivery);
      cartDiscount.textContent = discount > 0 ? `— ${formatCurrency(discount)}` : '—';
      cartTotal.textContent    = formatCurrency(total);
    }
  };

  /** Aplica cupom de desconto */
  const applyCoupon = () => {
    const code = couponInput.value.trim().toUpperCase();
    if (!code) { ToastModule.show('Digite um código de cupom.', 'error'); return; }

    const coupon = COUPONS[code];
    if (!coupon) {
      ToastModule.show('Cupom inválido ou expirado.', 'error');
      return;
    }

    STATE.appliedCoupon = coupon;
    update();
    ToastModule.show(`✅ Cupom "${code}" aplicado! ${coupon.label}`, 'success');
  };

  const init = () => {
    cartBtn.addEventListener('click', open);
    cartCloseBtn.addEventListener('click', close);
    cartOverlay.addEventListener('click', close);
    if (cartGoMenu) cartGoMenu.addEventListener('click', close);
    clearCartBtn.addEventListener('click', clearCart);
    couponApplyBtn.addEventListener('click', applyCoupon);
    couponInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyCoupon(); });

    // Checkout → abre modal
    checkoutBtn.addEventListener('click', () => {
      if (STATE.cart.length === 0) { ToastModule.show('Seu carrinho está vazio.', 'error'); return; }
      close();
      CheckoutModule.open();
    });

    // Foco trap no carrinho
    cartSidebar.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    update();
  };

  return { init, open, close, addItem, decreaseItem, removeItem, clearCart, calculateTotals, update };
})();

/* ============================================================
   7. MÓDULO: CHECKOUT
   ============================================================ */
const CheckoutModule = (() => {
  const overlay       = document.getElementById('checkoutOverlay');
  const modal         = document.getElementById('checkoutModal');
  const closeBtn      = document.getElementById('checkoutCloseBtn');
  const backBtn       = document.getElementById('checkoutBackBtn');
  const placeOrderBtn = document.getElementById('placeOrderBtn');

  // Etapas
  const steps         = document.querySelectorAll('.checkout-step');
  const progressSteps = document.querySelectorAll('.checkout-progress__step');
  const progressLines = document.querySelectorAll('.checkout-progress__line');

  // Pagamento
  const paymentMethods = document.querySelectorAll('.payment-method input[type="radio"]');
  const pixDetails     = document.getElementById('pixDetails');
  const cashDetails    = document.getElementById('cashDetails');
  const copyPixBtn     = document.getElementById('copyPixBtn');

  // Resumo
  const checkoutItemsList = document.getElementById('checkoutItemsList');
  const checkoutSubtotal  = document.getElementById('checkoutSubtotal');
  const checkoutDiscount  = document.getElementById('checkoutDiscount');
  const checkoutTotalFinal = document.getElementById('checkoutTotalFinal');

  // Modal de sucesso
  const successOverlay = document.getElementById('successOverlay');
  const successOrderId = document.getElementById('successOrderId');
  const successCloseBtn = document.getElementById('successCloseBtn');

  /** Mostra a etapa correta */
  const showStep = (step) => {
    STATE.checkoutStep = step;

    steps.forEach(s => {
      s.classList.toggle('active', parseInt(s.id.replace('checkoutStep', '')) === step);
    });

    progressSteps.forEach((ps, idx) => {
      const n = idx + 1;
      ps.classList.toggle('active', n === step);
      ps.classList.toggle('done', n < step);
    });

    progressLines.forEach((line, idx) => {
      line.classList.toggle('filled', idx + 1 < step);
    });

    // No passo 3 (resumo), atualiza os valores
    if (step === 3) renderSummary();

    // Atualiza label do botão principal
    placeOrderBtn.innerHTML = step < 3
      ? 'Continuar <i class="fas fa-arrow-right" aria-hidden="true"></i>'
      : '<i class="fas fa-check-circle" aria-hidden="true"></i> Confirmar Pedido';
  };

  /** Valida o passo 1 (entrega) */
  const validateStep1 = () => {
    const fields = ['checkoutName', 'checkoutPhone', 'checkoutCep', 'checkoutAddress'];
    let valid = true;
    fields.forEach(id => {
      const el = document.getElementById(id);
      const empty = !el.value.trim();
      el.classList.toggle('invalid', empty);
      if (empty) valid = false;
    });
    if (!valid) ToastModule.show('Preencha todos os campos obrigatórios.', 'error');
    return valid;
  };

  /** Valida o passo 2 (pagamento) */
  const validateStep2 = () => {
    const selected = document.querySelector('input[name="payment"]:checked');
    if (!selected) {
      ToastModule.show('Selecione uma forma de pagamento.', 'error');
      return false;
    }
    STATE.paymentMethod = selected.value;
    CartModule.update(); // recalcula com possível desconto PIX
    return true;
  };

  /** Renderiza o resumo do pedido (passo 3) */
  const renderSummary = () => {
    checkoutItemsList.innerHTML = '';
    const fragment = document.createDocumentFragment();

    STATE.cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'checkout-item';
      div.innerHTML = `
        <div class="checkout-item__left">
          <span class="checkout-item__emoji" aria-hidden="true">${item.emoji}</span>
          <div>
            <p class="checkout-item__name">${sanitize(item.name)}</p>
            <p class="checkout-item__qty">${item.qty}x ${formatCurrency(item.price)}</p>
          </div>
        </div>
        <span class="checkout-item__price">${formatCurrency(item.price * item.qty)}</span>`;
      fragment.appendChild(div);
    });

    checkoutItemsList.appendChild(fragment);

    const { subtotal, discount, delivery, total } = CartModule.calculateTotals();
    checkoutSubtotal.textContent  = formatCurrency(subtotal);
    checkoutDiscount.textContent  = discount > 0 ? `— ${formatCurrency(discount)}` : '—';
    checkoutTotalFinal.textContent = formatCurrency(total);

    // Nota de entrega grátis
    if (delivery === 0) {
      const note = document.createElement('p');
      note.style.cssText = 'color:var(--color-success);font-size:.82rem;font-weight:700;margin-top:8px;';
      note.innerHTML = '🎉 Parabéns! Você ganhou frete grátis.';
      checkoutItemsList.after(note);
    }
  };

  /** Confirma e "envia" o pedido */
  const placeOrder = () => {
    const orderId = genOrderId();

    // Prepara payload (estrutura pronta para POST /api/orders)
    const payload = {
      id:       orderId,
      customer: {
        name:         document.getElementById('checkoutName').value,
        phone:        document.getElementById('checkoutPhone').value,
        address:      document.getElementById('checkoutAddress').value,
        neighborhood: document.getElementById('checkoutNeighborhood').value,
        cep:          document.getElementById('checkoutCep').value,
        notes:        document.getElementById('checkoutObs').value,
      },
      payment:   STATE.paymentMethod,
      items:     STATE.cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
      totals:    CartModule.calculateTotals(),
      createdAt: new Date().toISOString(),
      status:    'pending'
    };

    // Salva no localStorage (mock de persistência — substituir por POST /api/orders)
    const orders = JSON.parse(localStorage.getItem('snapburg_orders') || '[]');
    orders.unshift(payload);
    localStorage.setItem('snapburg_orders', JSON.stringify(orders));

    console.info('[SnapBurg] Pedido criado:', payload);

    // Limpa estado
    CartModule.clearCart();
    STATE.appliedCoupon = null;
    STATE.paymentMethod = null;

    // Fecha checkout → abre sucesso
    close();
    openSuccess(orderId);
  };

  const open = () => {
    showStep(1);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('input')?.focus();
  };

  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  const openSuccess = (orderId) => {
    successOrderId.textContent = orderId;
    successOverlay.classList.add('open');
  };

  const closeSuccess = () => {
    successOverlay.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const init = () => {
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    backBtn.addEventListener('click', () => {
      if (STATE.checkoutStep > 1) showStep(STATE.checkoutStep - 1);
      else { close(); CartModule.open(); }
    });

    placeOrderBtn.addEventListener('click', () => {
      if (STATE.checkoutStep === 1) { if (validateStep1()) showStep(2); }
      else if (STATE.checkoutStep === 2) { if (validateStep2()) showStep(3); }
      else if (STATE.checkoutStep === 3) placeOrder();
    });

    // Formas de pagamento
    paymentMethods.forEach(radio => {
      radio.addEventListener('change', () => {
        STATE.paymentMethod = radio.value;
        pixDetails.style.display  = radio.value === 'pix'  ? 'flex' : 'none';
        cashDetails.style.display = radio.value === 'cash' ? 'flex' : 'none';
        document.querySelectorAll('.payment-method').forEach(m =>
          m.classList.toggle('selected', m.dataset.method === radio.value)
        );
        CartModule.update(); // recalcula desconto PIX
      });
    });

    // Copiar chave PIX
    if (copyPixBtn) {
      copyPixBtn.addEventListener('click', () => {
        const key = document.getElementById('pixKey').textContent;
        navigator.clipboard.writeText(key).then(() => {
          ToastModule.show('Chave PIX copiada!', 'success');
          copyPixBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
          setTimeout(() => { copyPixBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar'; }, 2000);
        });
      });
    }

    // CEP: formata automaticamente
    const cepInput = document.getElementById('checkoutCep');
    if (cepInput) {
      cepInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 8);
        if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5);
        e.target.value = v;
      });
    }

    // Telefone: formata automaticamente
    const phoneInput = document.getElementById('checkoutPhone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
        else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
        e.target.value = v;
      });
    }

    // Escape fecha modais
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (overlay.classList.contains('open')) close();
        if (successOverlay.classList.contains('open')) closeSuccess();
      }
    });

    successCloseBtn.addEventListener('click', closeSuccess);
    successOverlay.addEventListener('click', (e) => { if (e.target === successOverlay) closeSuccess(); });
  };

  return { init, open, close };
})();

/* ============================================================
   8. MÓDULO: CONTATO
   ============================================================ */
const ContactModule = (() => {
  const form = document.getElementById('contactForm');

  /** Valida e "envia" o formulário (mock) */
  const handleSubmit = (e) => {
    e.preventDefault();

    const name    = document.getElementById('contactName');
    const email   = document.getElementById('contactEmail');
    const subject = document.getElementById('contactSubject');
    const msg     = document.getElementById('contactMsg');

    let valid = true;
    [name, email, subject, msg].forEach(el => {
      const empty = !el.value.trim();
      el.classList.toggle('invalid', empty);
      if (empty) valid = false;
    });

    if (!valid) { ToastModule.show('Preencha todos os campos obrigatórios.', 'error'); return; }

    // Simula envio (substituir por POST /api/contact)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    setTimeout(() => {
      ToastModule.show('✅ Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
      form.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
    }, 1500);
  };

  const init = () => {
    if (form) form.addEventListener('submit', handleSubmit);
  };

  return { init };
})();

/* ============================================================
   9. MÓDULO: TOAST
   ============================================================ */
const ToastModule = (() => {
  const container = document.getElementById('toastContainer');

  /**
   * Exibe um toast
   * @param {string} message - Texto da notificação
   * @param {'success'|'error'|'info'} type - Tipo visual
   * @param {number} duration - Duração em ms
   */
  const show = (message, type = 'success', duration = 3000) => {
    const iconMap = { success: '✅', error: '❌', info: 'ℹ️' };

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<span class="toast__icon" aria-hidden="true">${iconMap[type]}</span><span>${sanitize(message)}</span>`;

    container.appendChild(toast);

    const remove = () => {
      toast.classList.add('toast--out');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    // Auto-remove após duração
    const timer = setTimeout(remove, duration);

    // Clique para fechar manualmente
    toast.addEventListener('click', () => { clearTimeout(timer); remove(); });
  };

  return { show };
})();

/* ============================================================
   10. INICIALIZAÇÃO
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  NavbarModule.init();
  MenuModule.init();
  CartModule.init();
  CheckoutModule.init();
  ContactModule.init();

  // Lazy reveal via IntersectionObserver (melhora performance)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.contact-card, .kpi-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      observer.observe(el);
    });

    // Polyfill simples: aplica 'visible' ao intersection
    const styleTag = document.createElement('style');
    styleTag.textContent = '.visible { opacity: 1 !important; transform: none !important; }';
    document.head.appendChild(styleTag);
  }

  console.info(
    '%c🍔 SnapBurg %cv1.0.0',
    'background:#f97316;color:#fff;font-weight:900;padding:4px 8px;border-radius:4px 0 0 4px;',
    'background:#1a1a1a;color:#f97316;font-weight:700;padding:4px 8px;border-radius:0 4px 4px 0;'
  );
  console.info('Preparado para: Node.js + PostgreSQL + Mercado Pago + WebSocket');
});
