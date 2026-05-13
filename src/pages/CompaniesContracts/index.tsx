// pages/CompaniesContracts/index.tsx

import "./styles.css";

import Navbar from "../../components/Navbar";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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

interface Contract {
  id: number;
  name: string;
  total_hours: number;
  used_hours: number;
  percentual?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
}

interface Company {
  company: string;
  contracts: Contract[];
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

  const [companyName, setCompanyName] =
    useState("");

  const [companyCnpj, setCompanyCnpj] =
    useState("");

  /* BUSCAR EMPRESAS + CONTRATOS */
  useEffect(() => {

    fetchCompanies();

  }, []);

  const fetchCompanies = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/company-contracts",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      /*
        EXEMPLO ESPERADO:
        [
          {
            company: "Who Time",
            contracts: [...]
          }
        ]
      */

      setCompanies(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  /* CRIAR EMPRESA */
  const handleCreateCompany =
    async () => {

      try {

        const token =
          localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3000/companies",
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

          setCompanyName("");
          setCompanyCnpj("");

          setShowCompanyModal(false);

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

  /* FILTRO */
  const filteredCompanies =
    useMemo(() => {

      return companies.filter(
        (company) =>
          company.company
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [companies, search]);

  const getProgressColor =
    (percentual: number = 0) => {

      if (percentual >= 95)
        return "#ef4444";

      if (percentual >= 80)
        return "#f59e0b";

      return "#22c55e";
    };

  return (
    <div className="companies-page">

      <Navbar />

      <main className="companies-content">

        {/* HEADER */}
        <div className="companies-header">

          <div>

            <span className="companies-badge">
              MANAGEMENT
            </span>

            <h1>
              Companies & Contracts
            </h1>

            <p>
              Gerencie empresas e contratos vinculados.
            </p>

          </div>

          <button
            className="new-company-button"
            onClick={() =>
              setShowCompanyModal(true)
            }
          >

            <FiPlus />

            Nova Empresa

          </button>

        </div>

        {/* SEARCH */}
        <div className="search-wrapper">

          <FiSearch />

          <input
            type="text"
            placeholder="Buscar empresas..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        {/* LOADING */}
        {loading && (
          <div className="empty-state">
            Carregando empresas...
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          filteredCompanies.length === 0 && (
            <div className="empty-state">
              Nenhuma empresa encontrada.
            </div>
          )}

        {/* LISTA */}
        <div className="companies-grid">

          {filteredCompanies.map(
            (company, index) => (

              <motion.div
                key={index}
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
                        {company.company}
                      </h2>

                      <span>
                        {
                          company.contracts
                            ?.length || 0
                        } contrato(s)
                      </span>

                    </div>

                  </div>

                  <div className="company-actions">

                    <button>
                      <FiEdit2 />
                    </button>

                    <button>
                      <FiTrash2 />
                    </button>

                    <button
                      onClick={() =>
                        setExpandedCompany(
                          expandedCompany ===
                          index
                            ? null
                            : index
                        )
                      }
                    >

                      {expandedCompany ===
                      index ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}

                    </button>

                  </div>

                </div>

                <AnimatePresence>

                  {expandedCompany ===
                    index && (

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
                          Nenhum contrato
                          associado.
                        </div>

                      ) : (

                        company.contracts.map(
                          (contract) => (

                            <div
                              key={
                                contract.id
                              }
                              className="contract-card"
                            >

                              <div className="contract-top">

                                <div>

                                  <h3>
                                    {
                                      contract.name
                                    }
                                  </h3>

                                  <span>
                                    {
                                      contract.used_hours || 0
                                    }
                                    h /
                                    {
                                      contract.total_hours || 0
                                    }
                                    h
                                  </span>

                                </div>

                                <div className="contract-actions">

                                  <button>
                                    <FiEdit2 />
                                  </button>

                                  <button>
                                    <FiTrash2 />
                                  </button>

                                </div>

                              </div>

                              <div className="progress-wrapper">

                                <div
                                  className="progress-bar"
                                >

                                  <div
                                    className="progress-fill"
                                    style={{
                                      width:
                                        `${contract.percentual || 0}%`,
                                      background:
                                        getProgressColor(
                                          contract.percentual
                                        ),
                                    }}
                                  />

                                </div>

                                <span>
                                  {
                                    contract.percentual || 0
                                  }
                                  %
                                </span>

                              </div>

                              <div className="contract-footer">

                                <div>
                                  <strong>
                                    Início:
                                  </strong>{" "}
                                  {
                                    contract.start_date ||
                                    "-"
                                  }
                                </div>

                                <div>
                                  <strong>
                                    Fim:
                                  </strong>{" "}
                                  {
                                    contract.end_date ||
                                    "-"
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

      {/* MODAL */}
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
                Nova Empresa
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
                  onClick={() =>
                    setShowCompanyModal(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  className="save-button"
                  onClick={
                    handleCreateCompany
                  }
                >
                  Criar Empresa
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