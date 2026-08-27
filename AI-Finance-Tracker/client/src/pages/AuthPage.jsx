import { ArrowRight, LockKeyhole } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Brand from "../components/Brand";
export default function AuthPage({ mode }) {
  const isLogin = mode === "login",
    location = useLocation(),
    navigate = useNavigate(),
    { login, register } = useAuth();
  const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const target = isLogin ? "/register" : "/login";
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isLogin && form.password !== form.confirmPassword)
      return setError("Passwords do not match.");
    setBusy(true);
    try {
      await (isLogin ? login : register)(form);
      navigate(location.state?.from?.pathname || "/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <Brand />
        <div>
          <p className="eyebrow">
            <LockKeyhole size={15} /> Secure personal finance
          </p>
          <h1>{isLogin ? "Welcome back." : "Create your workspace."}</h1>
          <p>
            {isLogin
              ? "Log in to see your financial picture."
              : "Start tracking your money with more clarity."}
          </p>
        </div>
        <form onSubmit={submit}>
          {!isLogin && (
            <label>
              Full name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Your name"
              />
            </label>
          )}
          <label>
            Email address
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength="8"
              placeholder="At least 8 characters"
            />
          </label>
          {!isLogin && (
            <label>
              Confirm password
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                required
                placeholder="Repeat your password"
              />
            </label>
          )}
          {error && <p className="form-error">{error}</p>}
          <button className="button button-primary" disabled={busy}>
            {busy ? "Please wait…" : isLogin ? "Log in" : "Create account"}{" "}
            <ArrowRight size={16} />
          </button>
        </form>
        <p className="auth-switch">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <Link to={target}>{isLogin ? "Get started" : "Log in"}</Link>
        </p>
        <Link className="back-home" to="/">
          ← Back to home
        </Link>
      </div>
      <aside>
        <p className="eyebrow">A quiet place for your financial life</p>
        <h2>Small decisions add up to a clearer future.</h2>
      </aside>
    </div>
  );
}
