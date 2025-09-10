import React, { useEffect, useState } from "react"
import { createEmployee, updateEmployee, fetchById, emailExists } from "../api"
const initialModel = { firstName: "", lastName: "", email: "", dateOfBirth: "", isActive: true }
export default function EmployeeForm({ id, onCancel, onSaved }) {
  const [model, setModel] = useState(initialModel)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState("")
  useEffect(() => {
    if (id) load()
    else {
      setModel(initialModel)
      setErrors({})
      setServerError("")
    }
  }, [id])
  async function load() {
    try {
      const data = await fetchById(id)
      setModel({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
        isActive: data.isActive === true
      })
    } catch (e) {
      setServerError("Unable to load employee")
    }
  }
  function validateFields() {
    const e = {}
    if (!model.firstName) e.firstName = "First name is required"
    else if (model.firstName.length > 50) e.firstName = "Max length 50"
    if (!model.lastName) e.lastName = "Last name is required"
    else if (model.lastName.length > 50) e.lastName = "Max length 50"
    if (!model.email) e.email = "Email is required"
    else {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!re.test(model.email)) e.email = "Invalid email format"
      else if (model.email.length > 100) e.email = "Max length 100"
    }
    return e
  }
  async function handleSave(ev) {
    ev.preventDefault()
    setServerError("")
    const e = validateFields()
    setErrors(e)
    if (Object.keys(e).length > 0) return
    try {
      setSaving(true)
      const exists = await emailExists(model.email, id)
      if (exists) {
        setErrors({ email: "Email already exists" })
        return
      }
      const payload = {
        firstName: model.firstName,
        lastName: model.lastName,
        email: model.email,
        dateOfBirth: model.dateOfBirth ? model.dateOfBirth : null,
        isActive: model.isActive
      }
      if (id) await updateEmployee(id, payload)
      else await createEmployee(payload)
      onSaved()
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) setServerError(err.response.data.message)
      else setServerError("Unable to save employee")
    } finally {
      setSaving(false)
    }
  }
  function setField(field, value) {
    setModel((m) => ({ ...m, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }
  return (
    <div className="container">
      <form className="form" onSubmit={handleSave} noValidate>
        <h2>{id ? "Edit Employee" : "Add Employee"}</h2>
        {serverError && <div className="error">{serverError}</div>}
        <div className="form-row">
          <label>First Name</label>
          <input value={model.firstName} onChange={(e) => setField("firstName", e.target.value)} maxLength="50" />
          {errors.firstName && <div className="field-error">{errors.firstName}</div>}
        </div>
        <div className="form-row">
          <label>Last Name</label>
          <input value={model.lastName} onChange={(e) => setField("lastName", e.target.value)} maxLength="50" />
          {errors.lastName && <div className="field-error">{errors.lastName}</div>}
        </div>
        <div className="form-row">
          <label>Email</label>
          <input value={model.email} onChange={(e) => setField("email", e.target.value)} maxLength="100" />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>
        <div className="form-row">
          <label>Date of Birth</label>
          <input type="date" value={model.dateOfBirth} onChange={(e) => setField("dateOfBirth", e.target.value)} />
        </div>
        <div className="form-row checkbox-row">
          <label>
            <input type="checkbox" checked={model.isActive} onChange={(e) => setField("isActive", e.target.checked)} />
            Is Active
          </label>
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={() => onCancel()} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  )
}
