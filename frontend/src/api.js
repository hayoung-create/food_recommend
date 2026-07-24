const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    const message = detail.detail || `요청 실패 (${res.status})`
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message))
  }
  return res.json()
}

export async function checkHealth() {
  return request('/health')
}

export async function fetchGoals() {
  return request('/api/goals')
}

export async function fetchCategories() {
  return request('/api/categories')
}

export async function fetchRecommendations(goal, category, options = {}) {
  const params = new URLSearchParams({ goal })
  if (category) params.set('category', category)
  if (options.page) params.set('page', String(options.page))
  if (options.pageSize) params.set('pageSize', String(options.pageSize))
  return request(`/api/recommendations?${params}`)
}

export async function fetchProduct(id, goal, category) {
  const params = new URLSearchParams({ goal: goal || 'diet' })
  if (category) params.set('category', category)
  return request(`/api/products/${id}?${params}`)
}

export async function searchProducts(q, category) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (category) params.set('category', category)
  return request(`/api/search?${params}`)
}
