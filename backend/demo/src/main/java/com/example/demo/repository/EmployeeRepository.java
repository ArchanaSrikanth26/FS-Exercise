package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Employee;

public interface EmployeeRepository
extends JpaRepository<Employee, Long> {

    // find employees by department (for filter)
    List<Employee> findByDepartmentContainingIgnoreCase(String department);

    // find employees by name (for search)
    List<Employee> findByNameContainingIgnoreCase(String name);

}
