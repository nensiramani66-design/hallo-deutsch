import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const config = window.HALLO_AUTH_CONFIG || {};
const configured = Boolean(config.supabaseUrl && config.supabaseAnonKey);
const client = configured ? createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
}) : null;
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
}
function friendlyError(error) {
  return error?.message || "Something went wrong. Please try again.";
}
function showPanel(name) {
  const isLogin = name === "login";
  loginTab.setAttribute("aria-selected", String(isLogin));
  registerTab.setAttribute("aria-selected", String(!isLogin));
  loginPanel.hidden = !isLogin;
  registerPanel.hidden = isLogin;
  switchLine.innerHTML = isLogin
    ? 'New to Hallo Deutsch? <button class="text-button" type="button" data-show="register">Create an account</button>'
    : 'Already have an account? <button class="text-button" type="button" data-show="login">Log in</button>';
  announce(configured ? "Your sign-in is secure. Choose a method to continue." : "Sign-in setup is not complete yet. Add your project URL and public key in auth-config.js, then configure provider redirects.", configured ? "" : "notice");
}
function setBusy(form, busy) {
  form.querySelectorAll("button").forEach(button => { button.disabled = busy; });
}
async function withForm(form, task) {
  if (!form.reportValidity()) return;
  if (!client) {
    announce("Account access is not connected yet. Add the auth project settings and provider callback URLs first.", "notice");
    return;
  }
  setBusy(form, true);
  try {
    await task();
  } catch (error) {
    announce(friendlyError(error), "error");
  } finally {
    setBusy(form, false);
  }
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
  withForm(form, async () => {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const { data } = await client.auth.getUser();
    announce("Welcome back" + (data.user?.email ? ", " + data.user.email : "") + ". You are signed in.");
  });
});

document.getElementById("register-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.elements.email.value.trim();
  const name = form.elements.name.value.trim();
  const password = form.elements.password.value;
  if (password !== form.elements.confirmPassword.value) {
    announce("Those passwords do not match. Please check them and try again.", "error");
    form.elements.confirmPassword.focus();
    return;
  }
  withForm(form, async () => {
    const { data, error } = await client.auth.signUp({
      email, password,
      options: { data: { full_name: name }, emailRedirectTo: callbackUrl }
    });
    if (error) throw error;
    announce(data.session ? "Your account is ready. Welcome to Hallo Deutsch!" : "Check your email for a confirmation link to finish creating your account.");
  });
});

document.querySelectorAll("[data-provider]").forEach(button => {
  button.addEventListener("click", async () => {
    if (!client) {
      announce("Connect your auth project and add the provider callback URLs to enable " + (button.dataset.provider === "google" ? "Google" : "Apple") + " sign-in.", "notice");
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
  if (!client) {
    announce("Password recovery will be ready once the auth project and redirect settings are connected.", "notice");
    return;
  }
  const email = document.getElementById("login-email").value.trim();
  if (!email) {
    announce("Enter your email address first, then choose “Forgot password?”.", "notice");
    document.getElementById("login-email").focus();
    return;
  }
  try {
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: callbackUrl });
    if (error) throw error;
    announce("If an account exists for that address, a password reset email is on its way.");
  } catch (error) {
    announce(friendlyError(error), "error");
  }
});

if (client) {
  client.auth.getSession().then(({ data, error }) => {
    if (error) announce(friendlyError(error), "error");
    else if (data.session?.user?.email) announce("Welcome back, " + data.session.user.email + ". Your account is signed in.");
    else announce("Your account access is ready. Log in or create an account to continue.");
  });
} else {
  announce("Sign-in setup is not complete yet. Add your project URL and public key in auth-config.js, then configure provider redirects.", "notice");
}
