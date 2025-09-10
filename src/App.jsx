import React, { useState } from "react"
import EmployeeList from "./components/EmployeeList"
import EmployeeForm from "./components/EmployeeForm"
export default function App() {
  const [mode, setMode] = useState("list")
  const [editEmployee, setEditEmployee] = useState(null)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Employee Management</h1>
      </header>
      <main className="app-main">
        {mode === "list" && (
          <EmployeeList
            onAdd={() => {
              setEditEmployee(null)
              setMode("form")
            }}
            onEdit={(employee) => {      // receive full employee object
              setEditEmployee(employee)
              setMode("form")
            }}
          />
        )}
        {mode === "form" && (
          <EmployeeForm
            employee={editEmployee}   // pass the full object
            onCancel={() => setMode("list")}
            onSaved={() => setMode("list")}
          />
        )}
      </main>
    </div>
  )
}

