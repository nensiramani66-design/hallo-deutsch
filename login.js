const config = window.HALLO_AUTH_CONFIG || {};
const configured = Boolean(config.supabaseUrl && config.supabaseAnonKey);
let clientPromise;
async function getClient() {
  if (!configured) return null;
  if (!clientPromise) {
    clientPromise = import("https://esm.sh/@supabase/supabase-js@2")
      .then(({ createClient }) => createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      }));
  }
  return clientPromise;
}
const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");
const loginPanel = document.getElementById("login-panel");
const registerPanel = document.getElementById("register-panel");
const status = document.getElementById("auth-status");
const switchLine = document.getElementById("auth-switch");
const callbackUrl = new URL("./login.html", window.location.href).toString();

function announce(message, state = "") {
  status.textContent = message;
  status.dataset.state = state;
  status.hidden = false;
}
function friendlyError(error) { return error?.message || "Something went wrong. Please try again."; }
function showPanel(name) {
  const isLogin = name === "login";
  loginTab.setAttribute("aria-selected", String(isLogin));
  registerTab.setAttribute("aria-selected", String(!isLogin));
  loginPanel.hidden = !isLogin;
  registerPanel.hidden = isLogin;
  switchLine.innerHTML = isLogin
    ? 'New to Hallo Deutsch? <button class="text-button" type="button" data-show="register">Create account</button>'
    : 'Already have an account? <button class="text-button" type="button" data-show="login">Log in</button>';
}
function setBusy(form, busy) {
  form.querySelectorAll("button").forEach(button => { button.disabled = busy; });
}
async function withForm(form, task) {
  if (!form.reportValidity()) return;
  const client = await getClient();
  if (!client) {
    announce("Account sign-in is not connected yet.", "notice");
    return;
  }
  setBusy(form, true);
  try { await task(client); }
  catch (error) { announce(friendlyError(error), "error"); }
  finally { setBusy(form, false); }
}

loginTab.addEventListener("click", () => showPanel("login"));
registerTab.addEventListener("click", () => showPanel("register"));
document.addEventListener("click", event => {
  const switchButton = event.target.closest("[data-show]");
  if (switchButton) showPanel(switchButton.dataset.show);
});
document.getElementById("login-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.elements.email.value.trim();
  const password = form.elements.password.value;
  withForm(form, async client => {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const { data } = await client.auth.getUser();
    announce("Signed in" + (data.user?.email ? " as " + data.user.email : "") + ".");
  });
});
document.getElementById("register-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.elements.email.value.trim();
  const name = form.elements.name.value.trim();
  const password = form.elements.password.value;
  if (password !== form.elements.confirmPassword.value) {
    announce("Those passwords do not match.", "error");
    form.elements.confirmPassword.focus();
    return;
  }
  withForm(form, async client => {
    const { data, error } = await client.auth.signUp({ email, password, options: { data: { full_name: name }, emailRedirectTo: callbackUrl } });
    if (error) throw error;
    announce(data.session ? "Account created. Welcome to Hallo Deutsch!" : "Check your email to confirm your account.");
  });
});
document.querySelectorAll("[data-provider]").forEach(button => {
  button.addEventListener("click", async () => {
    const client = await getClient();
    if (!client) {
      announce("Account sign-in is not connected yet.", "notice");
      return;
    }
    document.querySelectorAll("[data-provider]").forEach(item => { item.disabled = true; });
    try {
      const provider = button.dataset.provider;
      const { error } = await client.auth.signInWithOAuth({
        provider,
        options: { redirectTo: callbackUrl, ...(provider === "apple" ? { scopes: "email" } : {}) }
      });
      if (error) throw error;
    } catch (error) {
      announce(friendlyError(error), "error");
      document.querySelectorAll("[data-provider]").forEach(item => { item.disabled = false; });
    }
  });
});
document.getElementById("forgot-password").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value.trim();
  if (!email) {
    announce("Enter your email first, then request a password reset.", "notice");
    document.getElementById("login-email").focus();
    return;
  }
  const client = await getClient();
  if (!client) {
    announce("Password recovery is not connected yet.", "notice");
    return;
  }
  try {
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: callbackUrl });
    if (error) throw error;
    announce("If an account exists for that email, a reset link has been sent.");
  } catch (error) { announce(friendlyError(error), "error"); }
});
if (configured) {
  getClient().then(client => client.auth.getSession()).then(({ data, error }) => {
    if (error) announce(friendlyError(error), "error");
    else if (data.session?.user?.email) announce("Signed in as " + data.session.user.email + ".");
  }).catch(error => announce(friendlyError(error), "error"));
}
