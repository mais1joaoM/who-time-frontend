import "./styles.css";

import { useState } from "react";

import whoTimeLogo from "../../assets/who-time-logo.png";

function Login() {

  /* ESTADOS */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* LOGIN */
  const handleLogin = async () => {

    try {

      const response = await fetch(
        "http://localhost:3000/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (response.ok) {

        localStorage.setItem(
          "token",
          data.token
        );

        alert("Login realizado!");

      } else {

        alert(data.message || "Erro no login");
      }

    } catch (error) {

      console.error(error);

      alert("Erro ao conectar com API");
    }
  };

  return (
    <div className="container">

      <div className="background-shape top"></div>
      <div className="background-shape bottom"></div>

      <div className="login-box">

        <div className="logo-container">

          <img
            src={whoTimeLogo}
            alt="who-time"
            className="who-image"
          />

        </div>

        <div className="input-group">

          <input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

        </div>

        <div className="input-group">

          <input
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

        </div>

        <button onClick={handleLogin}>
          LOGIN
        </button>

        <span className="forgot-password">
          Forgot password?
        </span>

      </div>
    </div>
  );
}

export default Login;