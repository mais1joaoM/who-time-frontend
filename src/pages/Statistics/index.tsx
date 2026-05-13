import "./styles.css";

import Navbar from "../../components/Navbar";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Select from "react-select";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

import * as XLSX from "xlsx";

import { FiDownload } from "react-icons/fi";

interface Contract {
  id: number;
  name: string;
}

interface CompanyContracts {
  company: string;
  contracts: Contract[];
}

interface TimeEntry {
  work_date: string;
  description: string;
  hours: number;
}

interface HistoryItem {
  mes: string;
  total: number;
  gasto: number;
  percentual: number;
  time_entries: TimeEntry[];
}

interface SelectOption {
  value: number | string;
  label: string;
}

function Statistics() {

  const [companies, setCompanies] =
    useState<CompanyContracts[]>([]);

  const [selectedContract, setSelectedContract] =
    useState<SelectOption | null>(null);

  const [selectedMonth, setSelectedMonth] =
    useState<SelectOption | null>(null);

  const [history, setHistory] =
    useState<HistoryItem[]>([]);

  /* BUSCA CONTRATOS */
  useEffect(() => {

    const fetchContracts = async () => {

      try {

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

        setCompanies(data);

      } catch (error) {

        console.error(error);
      }
    };

    fetchContracts();

  }, []);

  /* BUSCA HISTÓRICO */
  useEffect(() => {

    const fetchHistory = async () => {

      if (!selectedContract) return;

      try {

        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:3000/contracts/${selectedContract.value}/history`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        console.log(data);

        setHistory(data);

      } catch (error) {

        console.error(error);
      }
    };

    fetchHistory();

  }, [selectedContract]);

  /* CONTRATOS */
  const contractOptions =
    companies.flatMap((company) =>
      company.contracts.map(
        (contract) => ({
          value: contract.id,
          label:
            `${company.company} - ${contract.name}`,
        })
      )
    );

  /* MESES */
  const monthOptions =
    history.map((item) => ({
      value: item.mes,
      label: item.mes,
    }));

  /* DADO DO MÊS */
  const selectedData =
    useMemo(() => {

      if (!selectedMonth)
        return null;

      return history.find(
        (item) =>
          item.mes ===
          selectedMonth.value
      );

    }, [
      selectedMonth,
      history,
    ]);

  /* EXPORTAR EXCEL */
  const exportExcel = () => {

    if (!selectedData) return;

    const excelData: any[] = [];

    /*
      RESUMO
    */

    excelData.push({
      Mês:
        selectedData.mes,

      Total_Contrato:
        selectedData.total,

      Horas_Gastas:
        selectedData.gasto,

      Horas_Restantes:
        selectedData.total -
        selectedData.gasto,

      Percentual:
        `${selectedData.percentual}%`,

      Data_Lançamento: "",

      Descrição: "",

      Horas: "",
    });

    /*
      LINHA VAZIA
    */

    excelData.push({});

    /*
      TIME ENTRIES
    */

    if (
      selectedData.time_entries &&
      selectedData.time_entries.length > 0
    ) {

      selectedData.time_entries.forEach(
        (entry) => {

          excelData.push({

            Mês:
              selectedData.mes,

            Total_Contrato: "",

            Horas_Gastas: "",

            Horas_Restantes: "",

            Percentual: "",

            Data_Lançamento:
              new Date(
                entry.work_date
              ).toLocaleDateString(
                "pt-BR"
              ),

            Descrição:
              entry.description,

            Horas:
              `${entry.hours}h`,
          });
        }
      );
    }

    const worksheet =
      XLSX.utils.json_to_sheet(
        excelData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Relatório"
    );

    XLSX.writeFile(
      workbook,
      `relatorio-${selectedData.mes}.xlsx`
    );
  };

  /* PROGRESSO */
  const progress =
    selectedData
      ? selectedData.percentual
      : 0;

  const progressBlocks =
    Math.round(progress / 5);

  const progressText =
    "█".repeat(progressBlocks) +
    "░".repeat(20 - progressBlocks);

  /* STATUS */
  const getStatusColor = () => {

    if (progress >= 95)
      return "danger";

    if (progress >= 80)
      return "warning";

    return "success";
  };

  const getStatusText = () => {

    if (progress >= 95)
      return "CRÍTICO";

    if (progress >= 80)
      return "ATENÇÃO";

    return "SAUDÁVEL";
  };

  return (
    <div className="statistics-container">

      <Navbar />

      <main className="statistics-content">

        <div className="statistics-card">

          <div className="statistics-header">

            <div>

              <span className="statistics-badge">
                ANALYTICS
              </span>

              <h1>
                Estatísticas
              </h1>

            </div>

            <button
              className="export-button"
              onClick={exportExcel}
              disabled={!selectedData}
            >

              <FiDownload />

              Exportar Excel

            </button>

          </div>

          {/* FILTROS */}
          <div className="filters">

            <div className="filter-item">

              <label>
                Contrato
              </label>

              <Select
                options={contractOptions}

                placeholder="Selecione contrato"

                value={selectedContract}

                onChange={(option) =>
                  setSelectedContract(
                    option
                  )
                }
              />

            </div>

            <div className="filter-item">

              <label>
                Mês
              </label>

              <Select
                options={monthOptions}

                placeholder="Selecione mês"

                value={selectedMonth}

                onChange={(option) =>
                  setSelectedMonth(
                    option
                  )
                }
              />

            </div>

          </div>

          {selectedData && (

            <>
              {/* CARDS */}
              <div className="summary-grid">

                <div className="summary-card">

                  <span>
                    Total contratado
                  </span>

                  <h2>
                    {selectedData.total}h
                  </h2>

                </div>

                <div className="summary-card">

                  <span>
                    Horas usadas
                  </span>

                  <h2>
                    {selectedData.gasto}h
                  </h2>

                </div>

                <div className="summary-card">

                  <span>
                    Horas restantes
                  </span>

                  <h2>
                    {
                      selectedData.total -
                      selectedData.gasto
                    }h
                  </h2>

                </div>

                <div
                  className={`summary-card ${getStatusColor()}`}
                >

                  <span>
                    Consumo
                  </span>

                  <h2>
                    {
                      selectedData.percentual
                    }%
                  </h2>

                </div>

              </div>

              {/* PROGRESS */}
              <div className="progress-card">

                <div className="progress-top">

                  <h3>
                    Consumo mensal
                  </h3>

                  <span
                    className={`status-pill ${getStatusColor()}`}
                  >
                    {getStatusText()}
                  </span>

                </div>

                <div className="progress-percent">
                  {selectedData.percentual}%
                  consumido
                </div>

                <pre className="progress-bar-text">
                  {progressText}
                </pre>

              </div>

              {/* GRÁFICO */}
              <div className="chart-card">

                <div className="chart-header">

                  <h3>
                    Horas do mês
                  </h3>

                </div>

                <ResponsiveContainer
                  width="100%"
                  height={350}
                >

                  <BarChart
                    data={[
                      {
                        name: "Usadas",
                        value:
                          selectedData.gasto,
                      },
                      {
                        name: "Restantes",
                        value:
                          selectedData.total -
                          selectedData.gasto,
                      },
                    ]}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      radius={[
                        14,
                        14,
                        0,
                        0,
                      ]}
                    >

                      <Cell fill="#2d56e8" />

                      <Cell fill="#cbd5e1" />

                    </Bar>

                  </BarChart>

                </ResponsiveContainer>

              </div>
            </>
          )}

        </div>

      </main>

    </div>
  );
}

export default Statistics;