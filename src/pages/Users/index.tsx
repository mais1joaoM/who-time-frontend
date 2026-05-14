import "./styles.css";

import Navbar from "../../components/Navbar";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Select from "react-select";

import {
  FiPlus,
  FiUser,
  FiBriefcase,
  FiLink,
  FiMail,
  FiLock,
  FiEdit2,
  FiTrash2,
  FiX,
  FiUserMinus,
} from "react-icons/fi";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

interface Company {
  id: number;
  name: string;
  cnpj: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  created_at?: string;
}

interface SelectOption {
  value: number;
  label: string;
}

function Users() {
  const [companies, setCompanies] =
    useState<Company[]>([]);

  const [users, setUsers] =
    useState<User[]>([]);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [selectedUser, setSelectedUser] =
    useState<SelectOption | null>(null);

  const [selectedCompany, setSelectedCompany] =
    useState<SelectOption | null>(null);

  const [removeSelectedUser, setRemoveSelectedUser] =
    useState<SelectOption | null>(null);

  const [removeSelectedCompany, setRemoveSelectedCompany] =
    useState<SelectOption | null>(null);

  const [loadingUser, setLoadingUser] =
    useState(false);

  const [loadingUsers, setLoadingUsers] =
    useState(false);

  const [loadingAssociation, setLoadingAssociation] =
    useState(false);

  const [loadingRemoveAssociation, setLoadingRemoveAssociation] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState<User | null>(null);

  const [editName, setEditName] =
    useState("");

  const [editEmail, setEditEmail] =
    useState("");

  const [editRole, setEditRole] =
    useState("");

  const [showEditModal, setShowEditModal] =
    useState(false);

  useEffect(() => {
    fetchCompanies();
    fetchUsers();
  }, []);

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

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/users`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      setUsers(data);
    } catch (error) {
      console.error(error);

      alert("Erro ao buscar usuários");
    } finally {
      setLoadingUsers(false);
    }
  };

  const companyOptions =
    companies.map((company) => ({
      value: company.id,
      label: company.name,
    }));

  const userOptions =
    useMemo(() => {
      return users.map((user) => ({
        value: user.id,
        label: `${user.name} - ${user.email}`,
      }));
    }, [users]);

  const roleOptions = [
    {
      value: "user",
      label: "User",
    },
    {
      value: "manager",
      label: "Manager",
    },
    {
      value: "admin",
      label: "Admin",
    },
  ];

  const customSelectStyles = {
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 99999,
    }),

    control: (base: any, state: any) => ({
      ...base,
      minHeight: 58,
      borderRadius: 18,
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
      borderRadius: 18,
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
      padding: "14px 16px",
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

  const handleCreateUser = async () => {
    if (!name || !email || !password) {
      alert("Preencha nome, e-mail e senha");
      return;
    }

    try {
      setLoadingUser(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        alert("Usuário cadastrado com sucesso!");

        setName("");
        setEmail("");
        setPassword("");

        fetchUsers();
      } else {
        alert(
          data.message ||
          "Erro ao cadastrar usuário"
        );
      }
    } catch (error) {
      console.error(error);

      alert("Erro ao conectar com API");
    } finally {
      setLoadingUser(false);
    }
  };

  const handleAssociateUserCompany = async () => {
    if (!selectedUser) {
      alert("Selecione um usuário");
      return;
    }

    if (!selectedCompany) {
      alert("Selecione uma empresa");
      return;
    }

    try {
      setLoadingAssociation(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/user-companies`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            user_id: selectedUser.value,
            company_id: selectedCompany.value,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        alert("Usuário associado à empresa!");

        setSelectedUser(null);
        setSelectedCompany(null);
      } else {
        alert(
          data.message ||
          "Erro ao associar usuário"
        );
      }
    } catch (error) {
      console.error(error);

      alert("Erro ao conectar com API");
    } finally {
      setLoadingAssociation(false);
    }
  };

  const handleRemoveUserCompany = async () => {
    if (!removeSelectedUser) {
      alert("Selecione um usuário");
      return;
    }

    if (!removeSelectedCompany) {
      alert("Selecione uma empresa");
      return;
    }

    const confirmRemove =
      confirm(
        "Deseja remover este usuário desta empresa?"
      );

    if (!confirmRemove) return;

    try {
      setLoadingRemoveAssociation(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/user-companies`,
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            user_id:
              removeSelectedUser.value,

            company_id:
              removeSelectedCompany.value,
          }),
        }
      );

      const data =
        await response.json().catch(
          () => null
        );

      if (response.ok) {
        alert(
          "Associação removida com sucesso!"
        );

        setRemoveSelectedUser(null);
        setRemoveSelectedCompany(null);
      } else {
        alert(
          data?.message ||
          "Erro ao remover associação"
        );
      }
    } catch (error) {
      console.error(error);

      alert("Erro ao conectar com API");
    } finally {
      setLoadingRemoveAssociation(false);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditName("");
    setEditEmail("");
    setEditRole("");
    setShowEditModal(false);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    if (!editName || !editEmail || !editRole) {
      alert("Preencha nome, e-mail e perfil");
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/users/${editingUser.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: editName,
            email: editEmail,
            role: editRole,
          }),
        }
      );

      const data =
        await response.json().catch(
          () => null
        );

      if (response.ok) {
        alert("Usuário atualizado com sucesso!");

        closeEditModal();
        fetchUsers();
      } else {
        alert(
          data?.message ||
          "Erro ao atualizar usuário"
        );
      }
    } catch (error) {
      console.error(error);

      alert("Erro ao conectar com API");
    }
  };

  const handleDeleteUser = async (
    userId: number
  ) => {
    const confirmDelete =
      confirm(
        "Deseja realmente deletar este usuário?"
      );

    if (!confirmDelete) return;

    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/users/${userId}`,
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
        alert("Usuário deletado com sucesso!");

        setUsers((prev) =>
          prev.filter(
            (user) =>
              user.id !== userId
          )
        );
      } else {
        alert(
          data?.message ||
          "Erro ao deletar usuário"
        );
      }
    } catch (error) {
      console.error(error);

      alert("Erro ao conectar com API");
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date)
      .toLocaleDateString("pt-BR");
  };

  return (
    <div className="users-page">

      <Navbar />

      <main className="users-content">

        <div className="users-header">

          <div>

            <span className="users-badge">
              MANAGEMENT
            </span>

            <h1>
              Usuários
            </h1>

            <p>
              Cadastre, edite, remova usuários e gerencie vínculos com empresas.
            </p>

          </div>

        </div>

        <div className="users-grid users-grid-3">

          <section className="users-card">

            <div className="card-title">

              <div className="card-icon">
                <FiUser />
              </div>

              <div>
                <h2>
                  Novo usuário
                </h2>

                <span>
                  Cadastre um novo usuário no sistema.
                </span>
              </div>

            </div>

            <div className="form-group">

              <label>
                Nome
              </label>

              <div className="input-wrapper">
                <FiUser />

                <input
                  type="text"
                  placeholder="Ex: Marcos"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              </div>

            </div>

            <div className="form-group">

              <label>
                E-mail
              </label>

              <div className="input-wrapper">
                <FiMail />

                <input
                  type="email"
                  placeholder="marcos@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

            </div>

            <div className="form-group">

              <label>
                Senha
              </label>

              <div className="input-wrapper">
                <FiLock />

                <input
                  type="password"
                  placeholder="Digite uma senha"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />
              </div>

            </div>

            <button
              className="primary-button"
              onClick={handleCreateUser}
              disabled={loadingUser}
            >
              <FiPlus />

              {loadingUser
                ? "Cadastrando..."
                : "Cadastrar usuário"}
            </button>

          </section>

          <section className="users-card">

            <div className="card-title">

              <div className="card-icon green">
                <FiLink />
              </div>

              <div>
                <h2>
                  Associar empresa
                </h2>

                <span>
                  Vincule um usuário cadastrado a uma empresa.
                </span>
              </div>

            </div>

            <div className="form-group">

              <label>
                Usuário
              </label>

              <Select
                options={userOptions}
                value={selectedUser}
                placeholder="Selecione um usuário"
                onChange={(option) =>
                  setSelectedUser(option)
                }
                styles={customSelectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />

            </div>

            <div className="form-group">

              <label>
                Empresa
              </label>

              <Select
                options={companyOptions}
                value={selectedCompany}
                placeholder="Selecione uma empresa"
                onChange={(option) =>
                  setSelectedCompany(option)
                }
                styles={customSelectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />

            </div>

            <button
              className="secondary-button"
              onClick={handleAssociateUserCompany}
              disabled={loadingAssociation}
            >
              <FiBriefcase />

              {loadingAssociation
                ? "Associando..."
                : "Associar usuário"}
            </button>

          </section>

          <section className="users-card">

            <div className="card-title">

              <div className="card-icon red">
                <FiUserMinus />
              </div>

              <div>
                <h2>
                  Remover associação
                </h2>

                <span>
                  Remova o vínculo entre usuário e empresa.
                </span>
              </div>

            </div>

            <div className="form-group">

              <label>
                Usuário
              </label>

              <Select
                options={userOptions}
                value={removeSelectedUser}
                placeholder="Selecione um usuário"
                onChange={(option) =>
                  setRemoveSelectedUser(option)
                }
                styles={customSelectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />

            </div>

            <div className="form-group">

              <label>
                Empresa
              </label>

              <Select
                options={companyOptions}
                value={removeSelectedCompany}
                placeholder="Selecione uma empresa"
                onChange={(option) =>
                  setRemoveSelectedCompany(option)
                }
                styles={customSelectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />

            </div>

            <button
              className="danger-button"
              onClick={handleRemoveUserCompany}
              disabled={loadingRemoveAssociation}
            >
              <FiUserMinus />

              {loadingRemoveAssociation
                ? "Removendo..."
                : "Remover associação"}
            </button>

          </section>

        </div>

        <section className="users-list-card">

          <div className="list-header">

            <div>

              <h2>
                Usuários cadastrados
              </h2>

              <p>
                Lista completa dos usuários retornados pela API.
              </p>

            </div>

          </div>

          {loadingUsers ? (

            <div className="empty-state">
              Carregando usuários...
            </div>

          ) : users.length === 0 ? (

            <div className="empty-state">
              Nenhum usuário encontrado.
            </div>

          ) : (

            <div className="users-table-container">

              <table className="users-table">

                <thead>

                  <tr>
                    <th>
                      Usuário
                    </th>

                    <th>
                      E-mail
                    </th>

                    <th>
                      Perfil
                    </th>

                    <th>
                      Criado em
                    </th>

                    <th>
                      Ações
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {users.map((user) => (

                    <tr key={user.id}>

                      <td>

                        <div className="user-cell">

                          <div className="user-avatar">
                            {user.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h3>
                              {user.name}
                            </h3>

                            <span>
                              ID #{user.id}
                            </span>
                          </div>

                        </div>

                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>

                        <span
                          className={`role-pill role-${user.role}`}
                        >
                          {user.role}
                        </span>

                      </td>

                      <td>
                        {formatDate(
                          user.created_at
                        )}
                      </td>

                      <td>

                        <div className="table-actions">

                          <button
                            className="edit-action"
                            onClick={() =>
                              openEditModal(user)
                            }
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            className="delete-action"
                            onClick={() =>
                              handleDeleteUser(
                                user.id
                              )
                            }
                          >
                            <FiTrash2 />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </main>

      {showEditModal && editingUser && (

        <div className="user-modal-overlay">

          <div className="user-modal">

            <div className="user-modal-header">

              <div>

                <span className="users-badge">
                  EDITAR
                </span>

                <h2>
                  Editar usuário
                </h2>

              </div>

              <button
                className="modal-close-button"
                onClick={closeEditModal}
              >
                <FiX />
              </button>

            </div>

            <div className="form-group">

              <label>
                Nome
              </label>

              <div className="input-wrapper">
                <FiUser />

                <input
                  type="text"
                  value={editName}
                  onChange={(e) =>
                    setEditName(
                      e.target.value
                    )
                  }
                />
              </div>

            </div>

            <div className="form-group">

              <label>
                E-mail
              </label>

              <div className="input-wrapper">
                <FiMail />

                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) =>
                    setEditEmail(
                      e.target.value
                    )
                  }
                />
              </div>

            </div>

            <div className="form-group">

              <label>
                Perfil
              </label>

              <Select
                options={roleOptions}
                value={
                  roleOptions.find(
                    (role) =>
                      role.value ===
                      editRole
                  ) || null
                }
                placeholder="Selecione o perfil"
                onChange={(option) =>
                  setEditRole(
                    option?.value || ""
                  )
                }
                styles={customSelectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />

            </div>

            <div className="modal-actions">

              <button
                className="cancel-button"
                onClick={closeEditModal}
              >
                Cancelar
              </button>

              <button
                className="save-button"
                onClick={handleUpdateUser}
              >
                Salvar alterações
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Users;