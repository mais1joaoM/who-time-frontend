// pages/CompaniesContracts/index.tsx

import "./styles.css";

import Navbar from "../../components/Navbar";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Select from "react-select";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiBriefcase,
  FiSearch,
} from "react-icons/fi";

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

function CompaniesContracts() {
  const [companies, setCompanies] =
    useState<Company[]>([]);

  const [expandedCompany, setExpandedCompany] =
    useState<number | null>(null);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showCompanyModal, setShowCompanyModal] =
    useState(false);

  const [showContractModal, setShowContractModal] =
    useState(false);

  const [editingCompany, setEditingCompany] =
    useState<Company | null>(null);

  const [companyName, setCompanyName] =
    useState("");

  const [companyCnpj, setCompanyCnpj] =
    useState("");

  const [selectedCompany, setSelectedCompany] =
    useState<SelectOption | null>(null);

  const [contractName, setContractName] =
    useState("");

  const [contractStartDate, setContractStartDate] =
    useState("");

  const [contractEndDate, setContractEndDate] =
    useState("");

  const [contractHoursLimit, setContractHoursLimit] =
    useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);

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

      setCompanies(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetCompanyModal = () => {
    setEditingCompany(null);
    setCompanyName("");
    setCompanyCnpj("");
    setShowCompanyModal(false);
  };

  const openCreateCompanyModal = () => {
    setEditingCompany(null);
    setCompanyName("");
    setCompanyCnpj("");
    setShowCompanyModal(true);
  };

  const openEditCompanyModal = (
    company: Company
  ) => {
    setEditingCompany(company);
    setCompanyName(company.name);
    setCompanyCnpj(company.cnpj);
    setShowCompanyModal(true);
  };

  const handleCreateCompany =
    async () => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/companies`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              name: companyName,
              cnpj: companyCnpj,
            }),
          }
        );

        const data =
          await response.json();

        if (response.ok) {
          alert(
            "Empresa criada com sucesso!"
          );

          resetCompanyModal();

          fetchCompanies();
        } else {
          alert(
            data.message ||
            "Erro ao criar empresa"
          );
        }
      } catch (error) {
        console.error(error);

        alert(
          "Erro ao conectar com API"
        );
      }
    };

  const handleUpdateCompany =
    async () => {
      if (!editingCompany) return;

      try {
        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/companies/${editingCompany.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              name: companyName,
              cnpj: companyCnpj,
            }),
          }
        );

        const data =
          await response.json();

        if (response.ok) {
          alert(
            "Empresa atualizada com sucesso!"
          );

          resetCompanyModal();

          fetchCompanies();
        } else {
          alert(
            data.message ||
            "Erro ao atualizar empresa"
          );
        }
      } catch (error) {
        console.error(error);

        alert(
          "Erro ao conectar com API"
        );
      }
    };

  const handleDeleteCompany =
    async (companyId: number) => {
      const confirmDelete =
        confirm(
          "Deseja realmente excluir esta empresa?"
        );

      if (!confirmDelete) return;

      try {
        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/companies/${companyId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json().catch(
            () => null
          );

        if (response.ok) {
          alert(
            "Empresa excluída com sucesso!"
          );

          setCompanies((prev) =>
            prev.filter(
              (company) =>
                company.id !== companyId
            )
          );

          if (
            expandedCompany === companyId
          ) {
            setExpandedCompany(null);
          }
        } else {
          alert(
            data?.message ||
            "Erro ao excluir empresa"
          );
        }
      } catch (error) {
        console.error(error);

        alert(
          "Erro ao conectar com API"
        );
      }
    };

  const handleCreateContract =
    async () => {
      if (!selectedCompany) {
        alert("Selecione uma empresa");
        return;
      }

      if (!contractName) {
        alert("Informe o nome do contrato");
        return;
      }

      if (!contractStartDate) {
        alert("Informe a data de início");
        return;
      }

      if (!contractEndDate) {
        alert("Informe a data final");
        return;
      }

      if (!contractHoursLimit) {
        alert("Informe o limite de horas");
        return;
      }

      try {
        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/contracts`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              company_id:
                selectedCompany.value,

              name:
                contractName,

              start_date:
                contractStartDate,

              end_date:
                contractEndDate,

              hours_limit:
                Number(contractHoursLimit),
            }),
          }
        );

        const data =
          await response.json();

        if (response.ok) {
          alert(
            "Contrato criado com sucesso!"
          );

          setSelectedCompany(null);
          setContractName("");
          setContractStartDate("");
          setContractEndDate("");
          setContractHoursLimit("");
          setShowContractModal(false);

          fetchCompanies();
        } else {
          alert(
            data.message ||
            "Erro ao criar contrato"
          );
        }
      } catch (error) {
        console.error(error);

        alert(
          "Erro ao conectar com API"
        );
      }
    };

  const companyOptions =
    companies.map((company) => ({
      value: company.id,
      label: company.name,
    }));

  const customSelectStyles = {
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 99999,
    }),

    control: (base: any, state: any) => ({
      ...base,

      minHeight: 56,

      borderRadius: 16,

      background: "#f8fbff",

      border: state.isFocused
        ? "1px solid #2d56e8"
        : "1px solid #dbe2f0",

      boxShadow: state.isFocused
        ? "0 0 0 4px rgba(45,86,232,0.08)"
        : "none",

      cursor: "pointer",
    }),

    menu: (base: any) => ({
      ...base,
      borderRadius: 16,
      overflow: "hidden",
      zIndex: 99999,
    }),

    option: (
      base: any,
      state: any
    ) => ({
      ...base,

      backgroundColor:
        state.isFocused
          ? "#eef4ff"
          : "#ffffff",

      color: "#1f2937",

      cursor: "pointer",
    }),

    placeholder: (base: any) => ({
      ...base,
      color: "#94a3b8",
    }),

    singleValue: (base: any) => ({
      ...base,
      color: "#1f2937",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  const filteredCompanies =
    useMemo(() => {
      return companies.filter(
        (company) => {
          const searchLower =
            search.toLowerCase();

          return (
            company.name
              .toLowerCase()
              .includes(searchLower) ||
            company.cnpj
              ?.toLowerCase()
              .includes(searchLower)
          );
        }
      );
    }, [companies, search]);

  const formatDate = (
    date?: string
  ) => {
    if (!date) return "-";

    return new Date(date)
      .toLocaleDateString("pt-BR");
  };

  return (
    <div className="companies-page">
      <Navbar />

      <main className="companies-content">
        <div className="companies-header">
          <div>
            <span className="companies-badge">
              MANAGEMENT
            </span>

            <h1>
              Empresas & Contratos
            </h1>

            <p>
              Gerencie empresas e contratos vinculados.
            </p>
          </div>

          <div className="header-actions">
            <button
              className="new-company-button"
              onClick={openCreateCompanyModal}
            >
              <FiPlus />
              Nova Empresa
            </button>

            <button
              className="new-contract-button"
              onClick={() =>
                setShowContractModal(true)
              }
            >
              <FiPlus />
              Novo Contrato
            </button>
          </div>
        </div>

        <div className="search-wrapper">
          <FiSearch />

          <input
            type="text"
            placeholder="Buscar por empresa ou CNPJ..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {loading && (
          <div className="empty-state">
            Carregando empresas...
          </div>
        )}

        {!loading &&
          filteredCompanies.length === 0 && (
            <div className="empty-state">
              Nenhuma empresa encontrada.
            </div>
          )}

        <div className="companies-grid">
          {filteredCompanies.map(
            (company) => (
              <motion.div
                key={company.id}
                layout
                className="company-card"
              >
                <div className="company-top">
                  <div className="company-info">
                    <div className="company-icon">
                      <FiBriefcase />
                    </div>

                    <div>
                      <h2>
                        {company.name}
                      </h2>

                      <div className="company-meta">
                        <span>
                          CNPJ: {company.cnpj}
                        </span>

                        <span>
                          Criada em:{" "}
                          {
                            formatDate(
                              company.created_at
                            )
                          }
                        </span>

                        <span>
                          {
                            company.contracts
                              ?.length || 0
                          } contrato(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="company-actions">
                    <button
                      title="Editar empresa"
                      onClick={() =>
                        openEditCompanyModal(
                          company
                        )
                      }
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      title="Excluir empresa"
                      onClick={() =>
                        handleDeleteCompany(
                          company.id
                        )
                      }
                    >
                      <FiTrash2 />
                    </button>

                    <button
                      title="Expandir contratos"
                      onClick={() =>
                        setExpandedCompany(
                          expandedCompany ===
                          company.id
                            ? null
                            : company.id
                        )
                      }
                    >
                      {expandedCompany ===
                      company.id ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedCompany ===
                    company.id && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      className="contracts-wrapper"
                    >
                      {!company.contracts ||
                      company.contracts
                        .length === 0 ? (
                        <div className="no-contracts">
                          Nenhum contrato associado.
                        </div>
                      ) : (
                        company.contracts.map(
                          (contract) => (
                            <div
                              key={contract.id}
                              className="contract-card"
                            >
                              <div className="contract-top">
                                <div>
                                  <h3>
                                    {contract.name}
                                  </h3>

                                  <span>
                                    Limite contratado:{" "}
                                    {
                                      contract.hours_limit
                                    }h
                                  </span>
                                </div>

                                <div className="contract-actions">
                                  <button title="Editar contrato">
                                    <FiEdit2 />
                                  </button>

                                  <button title="Excluir contrato">
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </div>

                              <div className="contract-details">
                                <div>
                                  <strong>
                                    ID:
                                  </strong>{" "}
                                  {contract.id}
                                </div>

                                <div>
                                  <strong>
                                    Início:
                                  </strong>{" "}
                                  {
                                    formatDate(
                                      contract.start_date
                                    )
                                  }
                                </div>

                                <div>
                                  <strong>
                                    Fim:
                                  </strong>{" "}
                                  {
                                    formatDate(
                                      contract.end_date
                                    )
                                  }
                                </div>
                              </div>
                            </div>
                          )
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          )}
        </div>
      </main>

      <AnimatePresence>
        {showCompanyModal && (
          <motion.div
            className="modal-overlay"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <motion.div
              className="modal-content"
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
              }}
            >
              <h2>
                {editingCompany
                  ? "Editar Empresa"
                  : "Nova Empresa"}
              </h2>

              <div className="modal-group">
                <label>
                  Nome da empresa
                </label>

                <input
                  type="text"
                  placeholder="Ex: Who Time"
                  value={companyName}
                  onChange={(e) =>
                    setCompanyName(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="modal-group">
                <label>
                  CNPJ
                </label>

                <input
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={companyCnpj}
                  onChange={(e) =>
                    setCompanyCnpj(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={resetCompanyModal}
                >
                  Cancelar
                </button>

                <button
                  className="save-button"
                  onClick={
                    editingCompany
                      ? handleUpdateCompany
                      : handleCreateCompany
                  }
                >
                  {editingCompany
                    ? "Salvar Alterações"
                    : "Criar Empresa"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContractModal && (
          <motion.div
            className="modal-overlay"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <motion.div
              className="modal-content"
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
              }}
            >
              <h2>
                Novo Contrato
              </h2>

              <div className="modal-group">
                <label>
                  Empresa
                </label>

                <Select
                  options={companyOptions}
                  value={selectedCompany}
                  placeholder="Selecione uma empresa"
                  onChange={(option) =>
                    setSelectedCompany(
                      option
                    )
                  }
                  styles={customSelectStyles}
                  menuPortalTarget={
                    document.body
                  }
                  menuPosition="fixed"
                />
              </div>

              <div className="modal-group">
                <label>
                  Nome do contrato
                </label>

                <input
                  type="text"
                  placeholder="Ex: RPA - Blue Prism"
                  value={contractName}
                  onChange={(e) =>
                    setContractName(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="modal-row">
                <div className="modal-group">
                  <label>
                    Data inicial
                  </label>

                  <input
                    type="date"
                    value={contractStartDate}
                    onChange={(e) =>
                      setContractStartDate(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="modal-group">
                  <label>
                    Data final
                  </label>

                  <input
                    type="date"
                    value={contractEndDate}
                    onChange={(e) =>
                      setContractEndDate(
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="modal-group">
                <label>
                  Limite de horas
                </label>

                <input
                  type="number"
                  placeholder="Ex: 100"
                  value={contractHoursLimit}
                  onChange={(e) =>
                    setContractHoursLimit(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() =>
                    setShowContractModal(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  className="save-button"
                  onClick={
                    handleCreateContract
                  }
                >
                  Criar Contrato
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CompaniesContracts;