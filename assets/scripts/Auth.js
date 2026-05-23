/**
 * Tortuga Burg — auth.js
 * Módulo de autenticação frontend (mock).
 *
 * ─── COMO FUNCIONA ───────────────────────────────────────────────
 * • Credenciais ficam aqui só para demonstração.
 *   Em produção: substituir validateCredentials() por
 *   POST /api/auth/login  →  recebe JWT  →  salva no sessionStorage.
 *
 * • Sessão fica em sessionStorage (expira ao fechar a aba).
 *   Em produção: usar httpOnly cookie + refresh token.
 *
 * • Guard executa no topo de admin.html ANTES do DOMContentLoaded,
 *   redirecionando imediatamente se não autenticado.
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

const Auth = (() => {

  /* ── Configuração ─────────────────────────────────────────── */
  const SESSION_KEY  = 'tortugaburg_admin_session';
  const SESSION_TTL  = 8 * 60 * 60 * 1000; // 8 horas em ms

  /**
   * Credenciais permitidas (mock).
   * Em produção: NUNCA expor credenciais no frontend.
   * Usar hash bcrypt no servidor e comparar lá.
   */
  const ADMIN_USERS = [
    {
      id:       'adm-001',
      name:     'Administrador',
      email:    'admin@tortugaburg.com',
      password: 'tortuga@2025',   // ← trocar por hash bcrypt em produção
      role:     'admin',
      avatar:   '👨‍🍳',
    },
    {
      id:       'adm-002',
      name:     'Gerente Cozinha',
      email:    'cozinha@tortugaburg.com',
      password: 'cozinha@123',
      role:     'kitchen',          // role diferente: acesso restrito
      avatar:   '🧑‍🍳',
    },
  ];

  /* ── Utilitários internos ─────────────────────────────────── */

  /** Cria um token de sessão simples (mock de JWT payload) */
  const _createSession = (user) => ({
    userId:    user.id,
    name:      user.name,
    email:     user.email,
    role:      user.role,
    avatar:    user.avatar,
    issuedAt:  Date.now(),
    expiresAt: Date.now() + SESSION_TTL,
  });

  /** Salva sessão serializada */
  const _saveSession = (session) => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('[Auth] Falha ao salvar sessão:', e);
    }
  };

  /* ── API Pública ──────────────────────────────────────────── */

  /**
   * Valida credenciais e inicia sessão.
   * @returns {{ ok: boolean, error?: string, session?: object }}
   *
   * Em produção: async, chama POST /api/auth/login
   */
  const login = (email, password) => {
    const trimEmail = String(email).trim().toLowerCase();
    const trimPass  = String(password);

    if (!trimEmail || !trimPass) {
      return { ok: false, error: 'Preencha e-mail e senha.' };
    }

    const user = ADMIN_USERS.find(
      u => u.email.toLowerCase() === trimEmail && u.password === trimPass
    );

    if (!user) {
      return { ok: false, error: 'E-mail ou senha incorretos.' };
    }

    const session = _createSession(user);
    _saveSession(session);

    return { ok: true, session };
  };

  /**
   * Encerra a sessão atual.
   */
  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
  };

  /**
   * Retorna a sessão ativa ou null se inválida/expirada.
   */
  const getSession = () => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;

      const session = JSON.parse(raw);

      // Verifica expiração
      if (Date.now() > session.expiresAt) {
        logout();
        return null;
      }

      return session;
    } catch {
      return null;
    }
  };

  /**
   * Verifica se há sessão admin válida.
   */
  const isAuthenticated = () => getSession() !== null;

  /**
   * Guard de rota — redireciona para login se não autenticado.
   * Chamar no topo do admin.html, ANTES do DOMContentLoaded.
   * Usa window.location.href (não replace) para garantir compatibilidade
   * com GitHub Pages e ambientes com subpastas.
   */
 const guard = (loginPath = 'login.html') => {
  if (!isAuthenticated()) {
    window.location.href = new URL(
      loginPath,
      window.location.href
    ).href;
  }
};


  /**
   * Redireciona para destino pós-login (fallback absoluto).
   * Mantido para compatibilidade, mas login.html usa resolveAdminPath().
   */
const redirectAfterLogin = (fallback = 'admin.html') => {
  window.location.href = new URL(
    fallback,
    window.location.href
  ).href;
};

  return { login, logout, getSession, isAuthenticated, guard, redirectAfterLogin };

})();