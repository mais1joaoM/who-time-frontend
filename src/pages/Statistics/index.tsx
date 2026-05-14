import "./styles.css";

import Navbar from "../../components/Navbar";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

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
  LabelList,
} from "recharts";

import * as XLSX from "xlsx";

import { FiDownload } from "react-icons/fi";

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
    useState<Company[]>([]);

  const [selectedContract, setSelectedContract] =
    useState<SelectOption | null>(null);

  const [selectedMonth, setSelectedMonth] =
    useState<SelectOption | null>(null);

  const [history, setHistory] =
    useState<HistoryItem[]>([]);

  const customSelectStyles = {
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),

    menu: (base: any) => ({
      ...base,
      zIndex: 9999,
      borderRadius: 18,
      overflow: "hidden",
      marginTop: 6,
    }),

    control: (base: any, state: any) => ({
      ...base,
      minHeight: 58,
      borderRadius: 18,
      border: state.isFocused
        ? "1px solid #2d56e8"
        : "1px solid #dbe4ff",
      boxShadow: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",

      "&:hover": {
        border: "1px solid #2d56e8",
      },
    }),

    placeholder: (base: any) => ({
      ...base,
      color: "#94a3b8",
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
      color: "#111827",
      cursor: "pointer",
      padding: "14px 16px",
    }),

    valueContainer: (base: any) => ({
      ...base,
      padding: "2px 14px",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    dropdownIndicator: (base: any) => ({
      ...base,
      color: "#64748b",
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

        setCompanies(data);

      } catch (error) {

        console.error(error);
      }
    };

    fetchCompanies();

  }, []);

  useEffect(() => {

    const fetchHistory = async () => {

      if (!selectedContract)
        return;

      try {

        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/contracts/${selectedContract.value}/history`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        setHistory(data);

        setSelectedMonth(null);

      } catch (error) {

        console.error(error);
      }
    };

    fetchHistory();

  }, [selectedContract]);

  const contractOptions =
    companies.flatMap(
      (company) =>
        company.contracts.map(
          (contract) => ({
            value: contract.id,
            label:
              `${company.name} - ${contract.name}`,
          })
        )
    );

  const monthOptions =
    history.map((item) => ({
      value: item.mes,
      label: item.mes,
    }));

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

  const exportExcel = () => {

    if (!selectedData)
      return;

    const excelData: any[] = [];

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

    excelData.push({});

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

  const progress =
    selectedData
      ? selectedData.percentual
      : 0;

  const progressBlocks =
    Math.round(progress / 5);

  const progressText =
    "█".repeat(progressBlocks) +
    "░".repeat(
      20 - progressBlocks
    );

  const getStatusColor =
    () => {

      if (progress >= 95)
        return "danger";

      if (progress >= 80)
        return "warning";

      return "success";
    };

  const getStatusText =
    () => {

      if (progress >= 95)
        return "CRÍTICO";

      if (progress >= 80)
        return "ATENÇÃO";

      return "SAUDÁVEL";
    };

  const chartData =
    selectedData
      ? [
          {
            name: "Usadas",
            value: selectedData.gasto,
            label: `Usadas: ${selectedData.gasto}h`,
          },
          {
            name: "Restantes",
            value:
              selectedData.total -
              selectedData.gasto,
            label:
              `Restantes: ${
                selectedData.total -
                selectedData.gasto
              }h`,
          },
        ]
      : [];

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
                  setSelectedContract(option)
                }
                styles={customSelectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
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
                  setSelectedMonth(option)
                }
                styles={customSelectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                isDisabled={!selectedContract}
              />

            </div>

          </div>

          {selectedData && (

            <>

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
                    {selectedData.percentual}%
                  </h2>
                </div>

              </div>

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
                    data={chartData}
                    margin={{
                      top: 35,
                      right: 30,
                      left: 20,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip
                      formatter={(value: any) =>
                        [`${value}h`, "Horas"]
                      }
                    />

                    <Bar
                      dataKey="value"
                      radius={[
                        14,
                        14,
                        0,
                        0,
                      ]}
                    >

                      <LabelList
                        dataKey="label"
                        position="top"
                        fill="#111827"
                        fontSize={15}
                        fontWeight={700}
                      />

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