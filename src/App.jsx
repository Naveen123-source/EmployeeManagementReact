import React, { useState } from "react"
import EmployeeList from "./components/EmployeeList"
import EmployeeForm from "./components/EmployeeForm"
export default function App() {
  const [mode, setMode] = useState("list")
  const [editId, setEditId] = useState(null)
  return (
    <div className="app">
      <header className="app-header">
        <h1>Employee Management</h1>
      </header>
      <main className="app-main">
        {mode === "list" && (
          <EmployeeList
            onAdd={() => {
              setEditId(null)
              setMode("form")
            }}
            onEdit={(id) => {
              setEditId(id)
              setMode("form")
            }}
          />
        )}
        {mode === "form" && (
          <EmployeeForm
            id={editId}
            onCancel={() => setMode("list")}
            onSaved={() => setMode("list")}
          />
        )}
      </main>
    </div>
  )
}
