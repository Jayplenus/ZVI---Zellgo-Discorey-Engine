// Configurações do Supabase (Substitua pelas suas chaves do painel Project Settings -> API)
const SUPABASE_URL = 'https://grlhcovgtyvteylwflws.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdybGhjb3ZndHl2dGV5bHdmbHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MjIxMzQsImV4cCI6MjEwMjE5ODEzNH0.cADNmBZWfHOnM2sxhRpc6d5CDg5PJ3hdjb4shqYjqwU';

// Inicializa o cliente do Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Elementos da UI
const authContainer = document.getElementById('auth-container');
const appContent = document.getElementById('app-content');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const btnLogout = document.getElementById('btn-logout');

// Verifica sessão ativa ao carregar a página
async function checkSession() {
  const { data: { session }, error } = await supabaseClient.auth.getSession();
  
  if (session) {
    showApp();
  } else {
    showLogin();
  }
}

// Manipula o envio do formulário de login
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const btnSubmit = loginForm.querySelector('button[type="submit"]');
    
    // UI Loading state
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = 'Autenticando...';
    loginError.style.display = 'none';

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      loginError.textContent = 'Credenciais inválidas. Tente novamente.';
      loginError.style.display = 'block';
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = 'Acessar Motores ZVI';
    } else {
      // Sucesso
      document.getElementById('auth-email').value = '';
      document.getElementById('auth-password').value = '';
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = 'Acessar Motores ZVI';
      showApp();
    }
  });
}

// Manipula o logout
if (btnLogout) {
  btnLogout.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    showLogin();
  });
}

// Funções de transição de UI
function showApp() {
  if (authContainer) authContainer.style.display = 'none';
  if (appContent) appContent.style.display = 'block';
}

function showLogin() {
  if (authContainer) authContainer.style.display = 'flex';
  if (appContent) appContent.style.display = 'none';
}

function updateUserName(session) {
  if (!session || !session.user) return;
  const el = document.getElementById('user-display-name');
  if (!el) return;
  const meta = session.user.user_metadata || {};
  let name = meta.full_name || meta.name || session.user.email.split('@')[0];
  if (!name) return;
  name = name.charAt(0).toUpperCase() + name.slice(1);
  const firstName = name.split(' ')[0];
  el.textContent = firstName;
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  checkSession();
  
  // Ouve mudanças de estado de autenticação (ex: token expirou)
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || !session) {
      showLogin();
    } else if (session) {
      updateUserName(session);
    }
  });
});
