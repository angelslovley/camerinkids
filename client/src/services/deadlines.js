import axios from 'axios'
import { getAuthHeader } from './config'

export const baseURL = 'http://localhost:5000/deadlines'

const getDeadLines = async () => {
  const response = await axios.get(`${baseURL}`, getAuthHeader())
  return response.data
}

const getDeadLinesCalendar = async () => {
  const response = await axios.get(`${baseURL}/calendar`, getAuthHeader())
  return response.data
}

const deadlinesService = {
  getDeadLines,
  getDeadLinesCalendar
}
export default deadlinesService
