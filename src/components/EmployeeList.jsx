import React, { useEffect, useState } from "react"
import { fetchAll, fetchById } from "../api"

export default function EmployeeList(props) {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadEmployees()
  }, [])

  async function loadEmployees() {
    try {
      setLoading(true)
      const data = await fetchAll()
      setEmployees(data)
    } catch (e) {
      setError("Unable to load employees")
    } finally {
      setLoading(false)
    }
  }

  async function handleEdit(id) {
    try {
        debugger
      setLoading(true)
      const employee = await fetchById(id) // fetch employee by ID
      props.onEdit(employee) // pass the full employee object to parent
    } catch (e) {
      setError("Unable to fetch employee details")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Employees</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={() => props.onAdd()}>
            Add Employee
          </button>
          <button className="btn btn-secondary" onClick={() => loadEmployees()}>
            Refresh
          </button>
        </div>
      </div>

      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Is Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {console.log(employees)}
            {employees.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((e) => (
                <tr key={e.employeeId}>
                  <td>{e.firstName}</td>
                  <td>{e.lastName}</td>
                  <td>{e.email}</td>
                  <td>{e.dateOfBirth ? new Date(e.dateOfBirth).toLocaleDateString() : ""}</td>
                  <td>{e.isActive ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(e.employeeId)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
