import "./styles.css";
import Navbar from "../../components/Navbar";

import { useEffect, useState } from "react";

interface Contract {
  id: number;
  name: string;
  company_id: number;
}

function Dashboard() {

  /* CONTRATOS */
  const [contracts, setContracts] = useState<Contract[]>([]);

  /* FORM */
  const [contractId, setContractId] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("");
  const [workDate, setWorkDate] = useState("");

  /* BUSCA CONTRATOS */
  useEffect(() => {

    const fetchContracts = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3000/contracts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setContracts(data);

      } catch (error) {

        console.error(error);
      }
    };

    fetchContracts();

  }, []);

  /* ENVIAR APONTAMENTO */
  const handleSubmit = async () => {

    try {

      const token = localStorage.getItem("token");

      const selectedContract =
        contracts.find(
          (contract) =>
            contract.id === Number(contractId)
        );

      const payload = {
        company_id: selectedContract?.company_id,
        contract_id: Number(contractId),
        work_date: workDate,
        hours: Number(hours),
        description,
        status: "pending",
      };

      console.log(payload);

      const response = await fetch(
        "http://localhost:3000/time-entries",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      console.log(data);

      if (response.ok) {

        alert("Apontamento enviado com sucesso!");

        /* LIMPA FORM */
        setDescription("");
        setHours("");
        setWorkDate("");

      } else {

        alert(data.message || "Erro ao enviar apontamento");
      }

    } catch (error) {

      console.error(error);

      alert("Erro ao conectar com API");
    }
  };

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <h2>
          Contratos
        </h2>

        <select
          value={contractId}
          onChange={(e) =>
            setContractId(e.target.value)
          }
        >
          <option value="">
            Selecione
          </option>

          {contracts.map((contract) => (
            <option
              key={contract.id}
              value={contract.id}
            >
              {contract.name}
            </option>
          ))}
        </select>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>

      <Navbar />

      {/* CONTEÚDO */}
      <main className="content">

        <div className="form-card">

          <h1>
            Novo apontamento
          </h1>

          <div className="form-group">

            <label>
              Dia trabalhado
            </label>

            <input
              type="date"
              value={workDate}
              onChange={(e) =>
                setWorkDate(e.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>
              Horas trabalhadas
            </label>

            <input
              type="number"
              step="0.5"
              placeholder="Ex: 4.5"
              value={hours}
              onChange={(e) =>
                setHours(e.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>
              Descrição
            </label>

            <textarea
              placeholder="Descreva o que foi feito..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

          </div>

          <button
            className="submit-button"
            onClick={handleSubmit}
          >
            Enviar apontamento
          </button>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;