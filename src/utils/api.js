import axios from 'axios'
import i18n from '../i18n.js'

const API_BASE = '/api'
const lang = () => i18n.language === 'hi' ? 'hi' : 'en'

export const getSchemes = () =>
  axios.get(`${API_BASE}/schemes?lang=${lang()}`).then(r => r.data.data)

export const checkEligibility = (profile) =>
  axios.post(`${API_BASE}/checkEligibility`, { ...profile, lang: lang() }).then(r => r.data.data)

export const sendChatMessage = (message, history, l = 'en') =>
  axios.post(`${API_BASE}/chatbot`, { message, history, lang: l }).then(r => r.data.reply)

export const getAnalytics = () =>
  axios.get(`${API_BASE}/analytics`).then(r => r.data.data)

export const getDeadlines = () =>
  axios.get(`${API_BASE}/deadlines`).then(r => r.data.data)