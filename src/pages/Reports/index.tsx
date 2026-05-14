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

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import {
  FiEdit2,
  FiTrash2,
  FiX,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

interface TimeEntry {
  id: number;
  company_id: number;
  contract_id: number;
  work_date: string;
  hours: string;
  description: string;
  status: string;
}

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

function Reports() {
  const [entries, setEntries] =
    useState<TimeEntry[]>([]);

  const [filteredEntries, setFilteredEntries] =
    useState<TimeEntry[]>([]);

  const [companies, setCompanies] =
    useState<Company[]>([]);

  const [selectedCompany, setSelectedCompany] =
    useState<string>("");

  const [selectedMonth, setSelectedMonth] =
    useState<string>("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingEntry, setEditingEntry] =
    useState<TimeEntry | null>(null);

  const [editDate, setEditDate] =
    useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const entriesResponse =
          await fetch(
            `${API_URL}/time-entries`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const entriesData =
          await entriesResponse.json();

        setEntries(entriesData);
        setFilteredEntries(entriesData);

        const companiesResponse =
          await fetch(
            `${API_URL}/companies`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const companiesData =
          await companiesResponse.json();

        setCompanies(companiesData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...entries];

    if (selectedCompany) {
      filtered = filtered.filter(
        (entry) =>
          String(entry.company_id) ===
          selectedCompany
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter(
        (entry) => {
          const month =
            new Date(entry.work_date)
              .getMonth() + 1;

          return (
            String(month)
              .padStart(2, "0") ===
            selectedMonth
          );
        }
      );
    }

    setFilteredEntries(filtered);
    setCurrentPage(1);
  }, [
    selectedCompany,
    selectedMonth,
    entries,
  ]);

  const totalPages =
    Math.ceil(
      filteredEntries.length /
      itemsPerPage
    );

  const paginatedEntries =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        itemsPerPage;

      const end =
        start + itemsPerPage;

      return filteredEntries.slice(
        start,
        end
      );
    }, [
      filteredEntries,
      currentPage,
    ]);

  const clearFilters = () => {
    setSelectedCompany("");
    setSelectedMonth("");
    setFilteredEntries(entries);
    setCurrentPage(1);
  };

  const openEditModal = (
    entry: TimeEntry
  ) => {
    setEditingEntry(entry);

    setEditDate(
      new Date(entry.work_date)
    );

    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingEntry) return;

    try {
      const token =
        localStorage.getItem("token");

      const payload = {
        hours:
          Number(editingEntry.hours),

        description:
          editingEntry.description,

        work_date:
          editDate
            ? editDate
                .toISOString()
                .split("T")[0]
            : "",
      };

      const response = await fetch(
        `${API_URL}/time-entries/${editingEntry.id}`,
        {
          method: "PUT",

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
          "Lançamento atualizado com sucesso!"
        );

        const updatedEntries =
          entries.map((entry) =>
            entry.id === editingEntry.id
              ? {
                  ...entry,
                  hours:
                    String(payload.hours),
                  description:
                    payload.description,
                  work_date:
                    payload.work_date,
                }
              : entry
          );

        setEntries(updatedEntries);
        setFilteredEntries(updatedEntries);
        setIsModalOpen(false);
      } else {
        alert(
          data.message ||
          "Erro ao atualizar lançamento"
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao conectar com API"
      );
    }
  };

  const handleDelete =
    async (id: number) => {
      const confirmDelete =
        confirm(
          "Deseja deletar este lançamento?"
        );

      if (!confirmDelete) return;

      try {
        const token =
          localStorage.getItem("token");

        const response =
          await fetch(
            `${API_URL}/time-entries/${id}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (response.ok) {
          const updatedEntries =
            entries.filter(
              (entry) =>
                entry.id !== id
            );

          setEntries(updatedEntries);
          setFilteredEntries(updatedEntries);

          alert(
            "Lançamento deletado!"
          );
        } else {
          alert(
            "Erro ao deletar"
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

  const companyOptions =
    companies.map((company) => ({
      value: String(company.id),
      label: company.name,
    }));

  const monthOptions = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  const getCompanyName = (
    companyId: number
  ) => {
    const company =
      companies.find(
        (item) =>
          item.id === companyId
      );

    return (
      company?.name ||
      `Empresa ${companyId}`
    );
  };

  return (
    <div className="reports-container">
      <Navbar />

      <main className="reports-content">
        <div className="reports-card">
          <div className="top-bar">
            <h1>
              Reports
            </h1>
          </div>

          <div className="filters">
            <div className="filter-item">
              <label>
                Empresa
              </label>

              <Select
                options={companyOptions}
                value={
                  companyOptions.find(
                    (option) =>
                      option.value ===
                      selectedCompany
                  ) || null
                }
                placeholder="Filtrar empresa"
                onChange={(option) =>
                  setSelectedCompany(
                    option?.value || ""
                  )
                }
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 99999,
                  }),
                }}
              />
            </div>

            <div className="filter-item">
              <label>
                Mês
              </label>

              <Select
                options={monthOptions}
                value={
                  monthOptions.find(
                    (option) =>
                      option.value ===
                      selectedMonth
                  ) || null
                }
                placeholder="Filtrar mês"
                onChange={(option) =>
                  setSelectedMonth(
                    option?.value || ""
                  )
                }
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 99999,
                  }),
                }}
              />
            </div>

            <div className="clear-filter-div">
              <button
                className="clear-filters-button"
                onClick={clearFilters}
              >
                Limpar filtros
              </button>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Empresa</th>
                  <th>Contrato</th>
                  <th>Horas</th>
                  <th>Status</th>
                  <th>Descrição</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {paginatedEntries.map(
                  (entry) => (
                    <tr key={entry.id}>
                      <td>
                        {new Date(
                          entry.work_date
                        ).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>

                      <td>
                        {getCompanyName(
                          entry.company_id
                        )}
                      </td>

                      <td>
                        {entry.contract_id}
                      </td>

                      <td>
                        {entry.hours}h
                      </td>

                      <td>
                        <span className="status">
                          {entry.status}
                        </span>
                      </td>

                      <td>
                        {entry.description}
                      </td>

                      <td>
                        <div className="actions">
                          <button
                            className="edit-button"
                            onClick={() =>
                              openEditModal(entry)
                            }
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDelete(
                                entry.id
                              )
                            }
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
              >
                <FiChevronLeft />
              </button>

              {Array.from({
                length: totalPages,
              }).map((_, index) => (
                <button
                  key={index}
                  className={`pagination-number ${
                    currentPage ===
                    index + 1
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setCurrentPage(
                      index + 1
                    )
                  }
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="pagination-button"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </main>

      {isModalOpen &&
        editingEntry && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <div>
                  <span className="modal-badge">
                    EDITAR
                  </span>

                  <h2>
                    Editar lançamento
                  </h2>
                </div>

                <button
                  className="close-button"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                >
                  <FiX />
                </button>
              </div>

              <div className="modal-form">
                <div className="modal-form-group">
                  <label>
                    Data trabalhada
                  </label>

                  <div className="date-picker-wrapper">
                    <FiCalendar className="calendar-icon" />

                    <DatePicker
                      selected={editDate}
                      onChange={(
                        date: Date | null
                      ) =>
                        setEditDate(date)
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

                <div className="modal-form-group">
                  <label>
                    Horas trabalhadas
                  </label>

                  <input
                    type="number"
                    step="0.5"
                    value={
                      editingEntry.hours
                    }
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        hours:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div className="modal-form-group">
                  <label>
                    Descrição
                  </label>

                  <textarea
                    value={
                      editingEntry.description
                    }
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        description:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div className="modal-buttons">
                  <button
                    className="cancel-button"
                    onClick={() =>
                      setIsModalOpen(false)
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    className="save-button"
                    onClick={handleUpdate}
                  >
                    Salvar alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default Reports;