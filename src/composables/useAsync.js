import { ref } from 'vue'

export const useAsync = () => {
  const loading = ref(false)
  const error = ref(null)

  const execute = async (asyncFn) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await asyncFn()
      return { success: true, data: result }
    } catch (err) {
      error.value = err.message || 'An error occurred'
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    loading,
    error,
    execute,
    clearError
  }
}

export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred'
  
  if (typeof error === 'string') return error
  
  if (error.message) return error.message
  
  if (error.error_description) return error.error_description
  
  if (error.details) return error.details
  
  return 'An error occurred. Please try again.'
}

export const handleApiError = (error) => {
  console.error('API Error:', error)
  
  const message = getErrorMessage(error)
  
  if (error.status === 401) {
    return 'Your session has expired. Please log in again.'
  }
  
  if (error.status === 403) {
    return 'You do not have permission to perform this action.'
  }
  
  if (error.status === 404) {
    return 'The requested resource was not found.'
  }
  
  if (error.status >= 500) {
    return 'A server error occurred. Please try again later.'
  }
  
  return message
}
