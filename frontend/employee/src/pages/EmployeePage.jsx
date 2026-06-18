import { useState, useEffect } from "react";
import {
  getAllEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  searchByName,
  filterByDepartment,
} from "./employeeService";

// empty form template - reused for add and edit
const emptyForm = {
  name: "",
  email: "",
  department: "",
  role: "",
  phone: "",
};

export default function EmployeePage() {

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  // editId holds the id of the employee being edited
  // null means we are in "add" mode
  const [editId, setEditId] = useState(null);

  // filter/search input
  const [searchName, setSearchName] = useState("");
  const [filterDept, setFilterDept] = useState("");

  // load all employees when page opens
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await getAllEmployees();
      setEmployees(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load employees");
    }
  };

  // update form state when user types
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // submit form - either add or update
  const handleSubmit = async () => {

    // simple validation
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.department.trim() ||
      !form.role.trim() ||
      !form.phone.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      if (editId !== null) {
        // update mode
        const res = await updateEmployee(editId, form);
        alert(res.data);
        setEditId(null);
      } else {
        // add mode
        const res = await addEmployee(form);
        alert(res.data);
      }

      setForm(emptyForm);
      loadEmployees();

    } catch (error) {
      console.log(error);
      alert(error?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }

  };

  // clicking Edit fills the form with that employee's data
  const handleEdit = (emp) => {
    setEditId(emp.id);
    setForm({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      role: emp.role,
      phone: emp.phone,
    });
    // scroll to top so user sees the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // cancel edit - go back to add mode
  const handleCancelEdit = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  // delete employee
  const handleDelete = async (id) => {

    const confirm = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirm) return;

    try {
      const res = await deleteEmployee(id);
      alert(res.data);
      loadEmployees();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }

  };

  // search by name
  const handleSearch = async () => {

    if (!searchName.trim()) {
      loadEmployees();
      return;
    }

    try {
      const res = await searchByName(searchName);
      setEmployees(res.data);
    } catch (error) {
      console.log(error);
    }

  };

  // filter by department
  const handleFilter = async () => {

    if (!filterDept.trim()) {
      loadEmployees();
      return;
    }

    try {
      const res = await filterByDepartment(filterDept);
      setEmployees(res.data);
    } catch (error) {
      console.log(error);
    }

  };

  // reset all filters and reload
  const handleReset = () => {
    setSearchName("");
    setFilterDept("");
    loadEmployees();
  };

  // ---- styles ----

  const styles = {

    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg,#1E3A8A,#3B82F6)",
      fontFamily: "Inter, sans-serif",
      padding: "30px 20px",
    },

    container: {
      maxWidth: "1100px",
      margin: "0 auto",
    },

    heading: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#fff",
      marginBottom: "24px",
      textAlign: "center",
    },

    card: {
      background: "#fff",
      borderRadius: "20px",
      padding: "30px",
      marginBottom: "24px",
      boxShadow: "0 10px 40px rgba(0,0,0,.12)",
    },

    cardTitle: {
      fontSize: "20px",
      fontWeight: "700",
      marginBottom: "20px",
      color: "#333",
    },

    // form grid - 3 columns
    formGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "16px",
      marginBottom: "20px",
    },

    input: {
      width: "100%",
      height: "50px",
      padding: "0 16px",
      border: "1px solid #ddd",
      borderRadius: "12px",
      fontSize: "15px",
      boxSizing: "border-box",
    },

    buttonRow: {
      display: "flex",
      gap: "12px",
    },

    btnPrimary: {
      height: "50px",
      padding: "0 30px",
      background: "#1D4ED8",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
    },

    btnSecondary: {
      height: "50px",
      padding: "0 30px",
      background: "#eee",
      color: "#333",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
    },

    // filter row
    filterRow: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      alignItems: "center",
    },

    filterInput: {
      height: "46px",
      padding: "0 16px",
      border: "1px solid #ddd",
      borderRadius: "12px",
      fontSize: "15px",
      flex: "1",
      minWidth: "180px",
    },

    btnFilter: {
      height: "46px",
      padding: "0 22px",
      background: "#1D4ED8",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
    },

    btnReset: {
      height: "46px",
      padding: "0 22px",
      background: "#555",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
    },

    // table
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "14px",
    },

    th: {
      background: "#1D4ED8",
      color: "#fff",
      padding: "14px 16px",
      textAlign: "left",
      fontWeight: "700",
    },

    td: {
      padding: "12px 16px",
      borderBottom: "1px solid #f0f0f0",
      color: "#444",
    },

    trEven: {
      background: "#fafafa",
    },

    btnEdit: {
      padding: "6px 16px",
      background: "#3B82F6",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      marginRight: "8px",
      fontWeight: "600",
      fontSize: "13px",
    },

    btnDelete: {
      padding: "6px 16px",
      background: "#EF4444",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "13px",
    },

    noData: {
      textAlign: "center",
      padding: "30px",
      color: "#999",
      fontSize: "16px",
    },

  };

  return (

    <div style={styles.page}>

      <div style={styles.container}>

        <h1 style={styles.heading}>
          Employee Management
        </h1>

        {/* ---- Registration / Edit Form ---- */}
        <div style={styles.card}>

          <p style={styles.cardTitle}>
            {editId !== null
              ? "✏️ Edit Employee"
              : "➕ Register New Employee"}
          </p>

          <div style={styles.formGrid}>

            <input
              style={styles.input}
              name="name"
              value={form.name}
              placeholder="Full Name"
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="email"
              value={form.email}
              placeholder="Email"
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="phone"
              value={form.phone}
              placeholder="Phone"
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="department"
              value={form.department}
              placeholder="Department (e.g. HR, IT, Finance)"
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="role"
              value={form.role}
              placeholder="Role (e.g. Manager, Developer)"
              onChange={handleChange}
            />

          </div>

          <div style={styles.buttonRow}>

            <button
              style={styles.btnPrimary}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editId !== null
                ? "Update Employee"
                : "Add Employee"}
            </button>

            {/* show Cancel button only in edit mode */}
            {editId !== null && (
              <button
                style={styles.btnSecondary}
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}

          </div>

        </div>

        {/* ---- Filter / Search Bar ---- */}
        <div style={styles.card}>

          <p style={styles.cardTitle}>
            🔍 Search & Filter
          </p>

          <div style={styles.filterRow}>

            <input
              style={styles.filterInput}
              value={searchName}
              placeholder="Search by Name"
              onChange={(e) =>
                setSearchName(e.target.value)
              }
            />

            <button
              style={styles.btnFilter}
              onClick={handleSearch}
            >
              Search
            </button>

            <input
              style={styles.filterInput}
              value={filterDept}
              placeholder="Filter by Department"
              onChange={(e) =>
                setFilterDept(e.target.value)
              }
            />

            <button
              style={styles.btnFilter}
              onClick={handleFilter}
            >
              Filter
            </button>

            <button
              style={styles.btnReset}
              onClick={handleReset}
            >
              Reset
            </button>

          </div>

        </div>

        {/* ---- Employee Table ---- */}
        <div style={styles.card}>

          <p style={styles.cardTitle}>
            👥 Employee List ({employees.length})
          </p>

          {employees.length === 0 ? (

            <p style={styles.noData}>
              No employees found.
            </p>

          ) : (

            <table style={styles.table}>

              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((emp, index) => (

                  <tr
                    key={emp.id}
                    style={
                      index % 2 === 0
                        ? {}
                        : styles.trEven
                    }
                  >

                    <td style={styles.td}>
                      {index + 1}
                    </td>

                    <td style={styles.td}>
                      {emp.name}
                    </td>

                    <td style={styles.td}>
                      {emp.email}
                    </td>

                    <td style={styles.td}>
                      {emp.phone}
                    </td>

                    <td style={styles.td}>
                      {emp.department}
                    </td>

                    <td style={styles.td}>
                      {emp.role}
                    </td>

                    <td style={styles.td}>

                      <button
                        style={styles.btnEdit}
                        onClick={() => handleEdit(emp)}
                      >
                        Edit
                      </button>

                      <button
                        style={styles.btnDelete}
                        onClick={() =>
                          handleDelete(emp.id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}
              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>

  );

}
