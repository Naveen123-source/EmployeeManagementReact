const apiBase = "https://localhost:7046/api/Employees";

export async function fetchAll() {
    debugger
  const res = await fetch(apiBase)
  if (!res.ok) throw new Error("Failed to fetch employees")
  return await res.json()
}

export async function fetchById(id) {
  const res = await fetch(`${apiBase}/${id}`)
  if (!res.ok) throw new Error("Failed to fetch employee")
  return await res.json()
}

export async function createEmployee(payload) {
    debugger
  const res = await fetch(apiBase, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error("Failed to create employee")
  return await res.json()
}

export async function updateEmployee(id, payload) {
  const res = await fetch(`${apiBase}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error("Failed to update employee")
  return await res.json()
}

export async function emailExists(email, id) {
  const list = await fetchAll()
  const found = list.find((e) => e.email.toLowerCase() === email.toLowerCase())
  if (!found) return false
  if (id && found.employeeId === id) return false
  return true
}
