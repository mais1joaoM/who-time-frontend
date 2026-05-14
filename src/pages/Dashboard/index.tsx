import "./styles.css";

import Navbar from "../../components/Navbar";

import { useEffect, useMemo, useState } from "react";

import Select from "react-select";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { FiCalendar } from "react-icons/fi";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

interface Contract {
  id: number;
  company_id: number;
  name: string;
  start_date?: string;
  end_date?: string;
  hours_limit: number;
}

interface Company {
  id: number;
  name: string;
  cnpj: string;
  created_at?: string;
  contracts: Contract[];
}

interface SelectOption {
  value: number;
  label: string;
}

function Dashboard() {
  const [companyData, setCompanyData] =
    useState<Company[]>([]);

  const [selectedCompany, setSelectedCompany] =
    useState<SelectOption | null>(null);

  const [selectedContract, setSelectedContract] =
    useState<SelectOption | null>(null);

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

  const companyOptions =
    companyData.map((company) => ({
      value: company.id,
      label: company.name,
    }));

  const contractOptions =
    useMemo(() => {
      if (!selectedCompany) return [];

      const company =
        companyData.find(
          (item) =>
            item.id === selectedCompany.value
        );

      return (
        company?.contracts.map((contract) => ({
          value: contract.id,
          label: `${contract.name} - ${contract.hours_limit}h`,
        })) || []
      );
    }, [selectedCompany, companyData]);

  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      background: "#f9fbff",
      border: state.isFocused
        ? "1px solid #2d56e8"
        : "1px solid #dbe2f0",
      borderRadius: "16px",
      minHeight: "58px",
      boxShadow: state.isFocused
        ? "0 0 0 4px rgba(45,86,232,0.08)"
        : "none",
      paddingLeft: "8px",
      cursor: "pointer",
      transition: "0.2s",
    }),

    menuPortal: (base: any) => ({
      ...base,
      zIndex: 99999,
    }),

    menu: (provided: any) => ({
      ...provided,
      background: "#ffffff",
      borderRadius: "18px",
      overflow: "hidden",
      padding: "8px",
      border: "none",
      boxShadow:
        "0 12px 40px rgba(0,0,0,0.14)",
      zIndex: 99999,
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
      padding: "14px 16px",
      borderRadius: "12px",
      marginBottom: "4px",
      cursor: "pointer",
      transition: "0.2s",
    }),

    singleValue: (provided: any) => ({
      ...provided,
      color: "#1f2937",
      fontWeight: 500,
    }),

    placeholder: (provided: any) => ({
      ...provided,
      color: "#64748b",
    }),

    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "#64748b",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/companies`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
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

    fetchCompanies();
  }, []);

  const handleSubmit = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!selectedCompanyId) {
        alert("Selecione uma empresa");
        return;
      }

      if (!contractId) {
        alert("Selecione um contrato");
        return;
      }

      if (!workDate) {
        alert("Selecione uma data");
        return;
      }

      const payload = {
        company_id: selectedCompanyId,
        contract_id: Number(contractId),
        work_date: workDate
          .toISOString()
          .split("T")[0],
        hours: Number(hours),
        description,
        status: "pending",
      };

      const response = await fetch(
        `${API_URL}/time-entries`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        alert("Apontamento enviado com sucesso!");

        setSelectedCompany(null);
        setSelectedContract(null);
        setSelectedCompanyId(null);
        setContractId("");
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

  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="content">
        <div className="form-card">
          <h1>
            Novo apontamento
          </h1>

          <div className="form-row">
            <div className="form-group">
              <label>
                Empresa
              </label>

              <Select
                options={companyOptions}
                value={selectedCompany}
                placeholder="Selecione uma empresa"
                onChange={(option) => {
                  setSelectedCompany(option);
                  setSelectedCompanyId(
                    option?.value || null
                  );

                  setSelectedContract(null);
                  setContractId("");
                }}
                styles={customSelectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>

            <div className="form-group">
              <label>
                Contrato
              </label>

              <Select
                options={contractOptions}
                value={selectedContract}
                placeholder="Selecione um contrato"
                isDisabled={!selectedCompany}
                onChange={(option) => {
                  setSelectedContract(option);

                  setContractId(
                    option
                      ? String(option.value)
                      : ""
                  );
                }}
                styles={customSelectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>
          </div>

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
                dayClassName={() => "custom-day"}
                popperClassName="custom-popper"
              />
            </div>
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