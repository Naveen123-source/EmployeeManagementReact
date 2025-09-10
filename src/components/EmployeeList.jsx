import React, { useEffect, useState } from "react"
import { fetchAll } from "../api"
export default function EmployeeList(props) {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  useEffect(() => {
    load()
  }, [])
  async function load() {
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
  return (
    <div className="container">
      <div className="toolbar">
        <h2>Employees</h2>
        <div>
          <button className="btn" onClick={() => props.onAdd()}>
            Add Employee
          </button>
          <button className="btn" onClick={() => load()}>
            Refresh
          </button>
        </div>
      </div>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && (
        <table className="table">
          <thead>
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
            {employees.length === 0 && (
              <tr>
                <td colSpan="6" className="empty">
                  No employees found
                </td>
              </tr>
            )}
            {employees.map((e) => (
              <tr key={e.employeeId}>
                <td>{e.firstName}</td>
                <td>{e.lastName}</td>
                <td>{e.email}</td>
                <td>{e.dateOfBirth ? new Date(e.dateOfBirth).toLocaleDateString() : ""}</td>
                <td>{e.isActive ? "Yes" : "No"}</td>
                <td>
                  <button className="btn small" onClick={() => props.onEdit(e.employeeId)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
