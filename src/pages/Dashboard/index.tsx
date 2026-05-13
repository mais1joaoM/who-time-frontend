import "./styles.css";

import Navbar from "../../components/Navbar";

import { useEffect, useState } from "react";

import Select from "react-select";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { FiCalendar } from "react-icons/fi";

interface Contract {
  id: number;
  name: string;
}

interface CompanyContracts {
  company: string;
  contracts: Contract[];
}

interface SelectOption {
  value: number;
  label: string;
}

function Dashboard() {

  /* EMPRESAS + CONTRATOS */
  const [companyData, setCompanyData] =
    useState<CompanyContracts[]>([]);

  /* CONTRATO SELECIONADO GLOBAL */
  const [selectedContract, setSelectedContract] =
    useState<SelectOption | null>(null);

  /* FORM */
  const [contractId, setContractId] =
    useState("");

  const [selectedCompanyId, setSelectedCompanyId] =
    useState<number | null>(null);

  const [description, setDescription] =
    useState("");

  const [hours, setHours] =
    useState("");

  const [workDate, setWorkDate] =
    useState<Date | null>(null);

  /* ESTILO SELECT */
  const customSelectStyles = {

    control: (provided: any) => ({
      ...provided,

      background:
        "rgba(255,255,255,0.10)",

      border:
        "1px solid rgba(255,255,255,0.12)",

      borderRadius: "18px",

      minHeight: "64px",

      boxShadow: "none",

      backdropFilter: "blur(12px)",

      paddingLeft: "8px",

      cursor: "pointer",
    }),

    menu: (provided: any) => ({
      ...provided,

      background: "#ffffff",

      borderRadius: "18px",

      overflow: "hidden",

      padding: "8px",

      border: "none",

      boxShadow:
        "0 12px 40px rgba(0,0,0,0.18)",

      zIndex: 9999,
    }),

    menuList: (provided: any) => ({
      ...provided,

      padding: 0,

      maxHeight: "220px",

      overflowY: "auto",
    }),

    option: (
      provided: any,
      state: any
    ) => ({
      ...provided,

      background: state.isFocused
        ? "#edf2ff"
        : "white",

      color: "#1f2937",

      padding: "16px",

      borderRadius: "12px",

      marginBottom: "4px",

      cursor: "pointer",

      transition: "0.2s",
    }),

    singleValue: (provided: any) => ({
      ...provided,

      color: "white",

      fontWeight: 500,
    }),

    placeholder: (provided: any) => ({
      ...provided,

      color:
        "rgba(255,255,255,0.7)",
    }),

    dropdownIndicator: (
      provided: any
    ) => ({
      ...provided,

      color: "white",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  /* BUSCA EMPRESAS + CONTRATOS */
  useEffect(() => {

    const fetchCompanyContracts =
      async () => {

        try {

          const token =
            localStorage.getItem("token");

          const response = await fetch(
            "http://localhost:3000/company-contracts",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data =
            await response.json();

          setCompanyData(data);

        } catch (error) {

          console.error(error);
        }
      };

    fetchCompanyContracts();

  }, []);

  /* ENVIAR APONTAMENTO */
  const handleSubmit = async () => {

    try {

      const token =
        localStorage.getItem("token");

      if (!contractId) {

        alert("Selecione um contrato");

        return;
      }

      const payload = {
        company_id: selectedCompanyId,

        contract_id:
          Number(contractId),

        work_date: workDate
          ? workDate
              .toISOString()
              .split("T")[0]
          : "",

        hours: Number(hours),

        description,

        status: "pending",
      };

      const response = await fetch(
        "http://localhost:3000/time-entries",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify(payload),
        }
      );

      const data =
        await response.json();

      if (response.ok) {

        alert(
          "Apontamento enviado com sucesso!"
        );

        setDescription("");
        setHours("");
        setWorkDate(null);

      } else {

        alert(
          data.message ||
          "Erro ao enviar apontamento"
        );
      }

    } catch (error) {

      console.error(error);

      alert("Erro ao conectar com API");
    }
  };

  /* LOGOUT 
  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  */

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <span className="sidebar-title">
          EMPRESAS
        </span>

        <div className="sidebar-scroll">

          {companyData.map(
            (company, index) => (

              <div
                key={index}
                className="company-block"
              >

                {/* EMPRESA */}
                <div className="sidebar-company">

                  <h2>
                    {company.company}
                  </h2>

                </div>

                {/* CONTRATOS */}
                <div className="sidebar-contracts">

                  <Select
                    options={
                      company.contracts.map(
                        (contract) => ({
                          value: contract.id,
                          label: contract.name,
                        })
                      )
                    }

                    value={
                      company.contracts.some(
                        (contract) =>
                          contract.id ===
                          selectedContract?.value
                      )
                        ? selectedContract
                        : null
                    }

                    placeholder="Selecione um contrato"

                    onChange={(selectedOption) => {

                      const option =
                        selectedOption as SelectOption;

                      setSelectedContract(option);

                      setContractId(
                        String(option?.value)
                      );

                      setSelectedCompanyId(
                        index + 1
                      );
                    }}

                    styles={customSelectStyles}
                  />

                </div>

              </div>
            )
          )}

        </div>
{/** 
        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
*/}

      </aside>

      <Navbar />

      {/* CONTEÚDO */}
      <main className="content">

        <div className="form-card">

          <h1>
            Novo apontamento
          </h1>

          {/* DATA */}
          <div className="form-group">

            <label>
              Dia trabalhado
            </label>

            <div className="date-picker-wrapper">

              <FiCalendar className="calendar-icon" />

              <DatePicker
                selected={workDate}

                onChange={(date: Date | null) =>
                  setWorkDate(date)
                }

                dateFormat="dd/MM/yyyy"

                placeholderText="Selecione uma data"

                className="custom-date-picker"

                calendarClassName="custom-calendar"

                dayClassName={() =>
                  "custom-day"
                }

                popperClassName="custom-popper"
              />

            </div>

          </div>

          {/* HORAS */}
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
                setHours(
                  e.target.value
                )
              }
            />

          </div>

          {/* DESCRIÇÃO */}
          <div className="form-group">

            <label>
              Descrição
            </label>

            <textarea
              placeholder="Descreva o que foi feito..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />

          </div>

          {/* BOTÃO */}
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