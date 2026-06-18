package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Employee;
import com.example.demo.service.EmployeeService;

@RestController
@RequestMapping("/employees")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
    }
)
public class EmployeeController {

    @Autowired
    private EmployeeService service;

    // GET all employees
    @GetMapping
    public List<Employee> getAll() {
        return service.getAll();
    }

    // POST add employee
    @PostMapping
    public String addEmployee(
        @RequestBody Employee emp
    ) {
        return service.addEmployee(emp);
    }

    // PUT update employee
    @PutMapping("/{id}")
    public String updateEmployee(
        @PathVariable Long id,
        @RequestBody Employee emp
    ) {
        return service.updateEmployee(id, emp);
    }

    // DELETE employee
    @DeleteMapping("/{id}")
    public String deleteEmployee(
        @PathVariable Long id
    ) {
        return service.deleteEmployee(id);
    }

    // GET search by name
    @GetMapping("/search")
    public List<Employee> searchByName(
        @RequestParam String name
    ) {
        return service.searchByName(name);
    }

    // GET filter by department
    @GetMapping("/filter")
    public List<Employee> filterByDepartment(
        @RequestParam String department
    ) {
        return service.filterByDepartment(department);
    }

}
