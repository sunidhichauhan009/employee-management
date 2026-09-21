import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
}

@Component({
  imports: [FormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private http = inject(HttpClient);

  employees: Employee[] = [];

  employeeName = '';
  employeeEmail = '';
  employeeDepartment = '';
  employeeSalary = 0;

  ngOnInit() {
    this.loadEmployees();
  }
  
  loadEmployees() {
    this.http.get<Employee[]>(
      'http://localhost:8082/api/employees'
    ).subscribe({
      next: (data) => {
        console.log('Employees from API:', data);
        this.employees = data;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  addEmployee() {
    
    const employee = {
      name: this.employeeName,
      email: this.employeeEmail,
      department: this.employeeDepartment,
      salary: this.employeeSalary
    };

    
    
    this.http.post('http://localhost:8082/api/employees', employee)
      .subscribe({
        next: (response) => {
          console.log('Employee added:', response);
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
  }
  deletingIds = new Set<number>();
  deleteEmployee(id: number) {

    // Same employee ke liye duplicate request rok do
    if (this.deletingIds.has(id)) {
      return;
    }

    this.deletingIds.add(id);

    this.http.delete(
      `http://localhost:8082/api/employees/${id}`
    ).subscribe({
      next: () => {

        // UI se employee turant remove
        this.employees = this.employees.filter(
          employee => employee.id !== id
        );

        console.log('Employee deleted:', id);
      },

      error: (error) => {
        console.error('Delete error:', error);
      }
    });
  }
}
