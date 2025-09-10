import React, { useEffect, useState } from "react"
import { createEmployee, updateEmployee, emailExists } from "../api"

const initialModel = { firstName: "", lastName: "", email: "", dateOfBirth: "", isActive: true }

export default function EmployeeForm({ employee, onCancel, onSaved }) {
  const [model, setModel] = useState(initialModel)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [serverError, setServerError] = useState("")

  useEffect(() => {
    debugger
    if (employee) {
      setModel({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split("T")[0] : "",
        isActive: employee.isActive === true
      })
    } else {
      setModel(initialModel)
      setErrors({})
      setServerError("")
    }
  }, [employee])

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
        if (employee?.employeeId > 0) {
            setUpdating(true)
        }
        else {
            setSaving(true)
        }
      const exists = await emailExists(model.email, employee?.employeeId)
      if (exists) {
        setErrors({ email: "Email already exists" })
        return
      }

      const payload = {
        firstName: model.firstName,
        lastName: model.lastName,
        email: model.email,
        dateOfBirth: model.dateOfBirth || null,
        isActive: model.isActive
      }

      if (employee?.employeeId) await updateEmployee(employee.employeeId, payload)
      else await createEmployee(payload)

      onSaved()
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Unable to save employee"
      )
    } finally {
     if (employee?.employeeId > 0) {
            setUpdating(true)
        }
        else {
            setSaving(true)
        }
    }
  }

  function setField(field, value) {
    setModel((m) => ({ ...m, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <div className="container mt-4">
      <form onSubmit={handleSave} noValidate>
        <h2 className="mb-4">{employee ? "Edit Employee" : "Add Employee"}</h2>

        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
            value={model.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
            maxLength="50"
          />
          {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
            value={model.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
            maxLength="50"
          />
          {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={model.email}
            onChange={(e) => setField("email", e.target.value)}
            maxLength="100"
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className="form-control"
            value={model.dateOfBirth}
            onChange={(e) => setField("dateOfBirth", e.target.value)}
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="isActive"
            checked={model.isActive}
            onChange={(e) => setField("isActive", e.target.checked)}
          />
          <label className="form-check-label" htmlFor="isActive">
            Is Active
          </label>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onCancel()}
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
           {employee?.employeeId > 0 ? updating ? "Updating..." : "Update"  :saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  )
}
