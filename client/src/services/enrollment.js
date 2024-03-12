import axios from 'axios'
import { getAuthHeader } from './config'

export const baseURL = '/enrollments'
export const start = 'http://localhost:5000'

const getEnrollments = async (courseId) => {
  const response = await axios.get(`${start}/${courseId}${baseURL}`, getAuthHeader())

  return response.data
}

const updateEnrollment = async (courseId, enrollmentId, enrolledAs) => {
  const response = await axios.post(
    `${start}/${courseId}${baseURL}`,
    {
      enrollmentId,
      enrolledAs
    },
    getAuthHeader()
  )
  return response.data
}

const enrollmentsService = {
  getEnrollments,
  updateEnrollment
}
export default enrollmentsService
