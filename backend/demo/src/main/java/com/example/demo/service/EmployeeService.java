package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;

@Service
public class EmployeeService {

    @Autowired
    EmployeeRepository repo;

    // get all employees
    public List<Employee> getAll() {
        return repo.findAll();
    }

    // add new employee
    public String addEmployee(Employee emp) {
        repo.save(emp);
        return "Employee added successfully";
    }

    // update employee by id
    public String updateEmployee(Long id, Employee updated) {

        Optional<Employee> existing = repo.findById(id);

        if (existing.isEmpty()) {
            return "Employee not found";
        }

        Employee emp = existing.get();
        emp.setName(updated.getName());
        emp.setEmail(updated.getEmail());
        emp.setDepartment(updated.getDepartment());
        emp.setRole(updated.getRole());
        emp.setPhone(updated.getPhone());

        repo.save(emp);
        return "Employee updated successfully";
    }

    // delete employee by id
    public String deleteEmployee(Long id) {

        if (!repo.existsById(id)) {
            return "Employee not found";
        }

        repo.deleteById(id);
        return "Employee deleted successfully";
    }

    // search by name
    public List<Employee> searchByName(String name) {
        return repo.findByNameContainingIgnoreCase(name);
    }

    // filter by department
    public List<Employee> filterByDepartment(String department) {
        return repo.findByDepartmentContainingIgnoreCase(department);
    }

}
