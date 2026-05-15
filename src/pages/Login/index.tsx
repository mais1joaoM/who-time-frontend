import "./styles.css";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import whoTimeIcon from "../../assets/favz.svg";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:3000/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {

        localStorage.setItem(
          "token",
          data.token
        );

        navigate("/dashboard");

      } else {

        alert(
          data.message ||
          "Erro no login"
        );
      }

    } catch (error) {

      console.error(error);

      alert(
        "Erro ao conectar com API"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>

      <div className="brand-section">

        <div className="brand-logo-wrapper">

          <img
            src={whoTimeIcon}
            alt="Who Time"
            className="brand-logo"
          />

        </div>

        <div className="brand-info">

          <h1>
            Who Time
          </h1>

        </div>

      </div>

      <div className="login-card">

        <div className="login-header">

          <span className="login-badge">
            LOGIN
          </span>

          <h2>
            Entrar
          </h2>

        </div>

        <div className="input-group">

          <label>
            E-mail
          </label>

          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

        </div>

        <div className="input-group">

          <label>
            Senha
          </label>

          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

        </div>

        <div className="login-footer">

          <label className="remember-me">

            <input type="checkbox" />

            <span>
              Lembrar de mim
            </span>

          </label>

          <span className="forgot-password">
            Esqueceu a senha?
          </span>

        </div>

        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading
            ? "Entrando..."
            : "Entrar"}
        </button>

      </div>

    </div>
  );
}

export default Login;