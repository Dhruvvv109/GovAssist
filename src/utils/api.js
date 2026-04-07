import axios from 'axios'

const API_BASE = '/api'

export const getSchemes = () =>
  axios.get(`${API_BASE}/schemes`).then(r => r.data.data)

export const checkEligibility = (profile) =>
  axios.post(`${API_BASE}/checkEligibility`, profile).then(r => r.data.data)

export const sendChatMessage = (message, history, lang = 'en') =>
  axios.post(`${API_BASE}/chatbot`, { message, history, lang }).then(r => r.data.reply)

export const getAnalytics = () =>
  axios.get(`${API_BASE}/analytics`).then(r => r.data.data)

export const getDeadlines = () =>
  axios.get(`${API_BASE}/deadlines`).then(r => r.data.data)