import axios from "axios"
const apiBase = "https://localhost:7046/api/Employees"
export async function fetchAll() {
  const res = await axios.get(apiBase)
  return res.data
}
export async function fetchById(id) {
  const res = await axios.get(`${apiBase}/${id}`)
  return res.data
}
export async function createEmployee(payload) {
  const res = await axios.post(apiBase, payload)
  return res.data
}
export async function updateEmployee(id, payload) {
  const res = await axios.put(`${apiBase}/${id}`, payload)
  return res.data
}
export async function emailExists(email, id) {
  const list = await fetchAll()
  const found = list.find((e) => e.email.toLowerCase() === email.toLowerCase())
  if (!found) return false
  if (id && found.employeeId === id) return false
  return true
}
