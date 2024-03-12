export const getAuthHeader = () => {
    const token = JSON.parse(localStorage.getItem('elearning-user')).data
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  }
  
  export const getMultiPartAuthHeader = () => {
    const token = JSON.parse(localStorage.getItem('elearning-user')).data
    return {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    }
  }
  
  export const getS3Credintials = () => ({
    accessKeyId: '',
    secretAccessKey: ''
  })
  