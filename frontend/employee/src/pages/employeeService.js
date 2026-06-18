import axios from "axios";

// base URL pointing to our Spring Boot backend
const API = "http://localhost:8083/employees";

// get all employees
export const getAllEmployees = () =>
  axios.get(API);

// add new employee
export const addEmployee = (data) =>
  axios.post(API, data);

// update employee by id
export const updateEmployee = (id, data) =>
  axios.put(`${API}/${id}`, data);

// delete employee by id
export const deleteEmployee = (id) =>
  axios.delete(`${API}/${id}`);

// search employees by name
export const searchByName = (name) =>
  axios.get(`${API}/search?name=${name}`);

// filter employees by department
export const filterByDepartment = (dept) =>
  axios.get(`${API}/filter?department=${dept}`);
