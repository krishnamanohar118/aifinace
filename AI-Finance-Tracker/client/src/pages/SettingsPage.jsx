import { useState } from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

export default function SettingsPage() {
  const { user, setUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user.name);
  const [currency, setCurrency] = useState(user.currency);
  const [message, setMessage] = useState("");

  const save = async (e) => {
    e.preventDefault();

    try {
      const r = await api.put("/profile", {
        name,
        currency,
        theme,
      });

      setUser(r.data.user);
      setMessage("Profile saved.");
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <>
      <PageHeader
        title="Profile & settings"
        description="Manage your profile and preferences."
      />

      <form className="card settings-form" onSubmit={save}>
        <h2>Profile</h2>

        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input value={user.email} disabled />
        </label>

        <label>
          Currency
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </label>

        <h2>Appearance</h2>

        <button
          type="button"
          className="button button-secondary"
          onClick={toggleTheme}
        >
          Switch to {theme === "light" ? "dark" : "light"} mode
        </button>

        <h2>Security</h2>

        <p className="muted">
          Use a strong password and keep your device secure.
        </p>

        {message && <p className="form-error">{message}</p>}

        <div className="modal-actions">
          <button className="button button-primary" type="submit">
            Save changes
          </button>

          <button
            type="button"
            className="button button-secondary"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </form>
    </>
  );
}
