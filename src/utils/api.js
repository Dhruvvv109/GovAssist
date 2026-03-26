import axios from 'axios'

const API_BASE = '/api'

export const getSchemes = () =>
  axios.get(`${API_BASE}/schemes`).then(r => r.data.data)

export const checkEligibility = (profile) =>
  axios.post(`${API_BASE}/checkEligibility`, profile).then(r => r.data.data)

export const sendChatMessage = (message, history) =>
  axios.post(`${API_BASE}/chatbot`, { message, history }).then(r => r.data.reply)
