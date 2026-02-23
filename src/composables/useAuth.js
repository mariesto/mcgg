import { computed, ref } from 'vue'
import { 
  getCurrentUser, 
  onAuthStateChange, 
  signInWithEmail, 
  signOut,
  signUp,
  getPlayerProfile,
  getAccessToken
} from '../lib/supabase.js'
import { supabase } from '../lib/supabase.js'

const user = ref(null)
const player = ref(null)
const isAdminUser = ref(false)
const loading = ref(true)
const error = ref(null)

export const initAuth = async () => {
  loading.value = true
  try {
    user.value = await getCurrentUser()
    if (user.value) {
      const { data } = await getPlayerProfile(user.value.id)
      player.value = data
      await checkAdminStatus()
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }

  onAuthStateChange(async (event, session) => {
    user.value = session?.user || null
    if (user.value) {
      const { data } = await getPlayerProfile(user.value.id)
      player.value = data
      await checkAdminStatus()
    } else {
      player.value = null
      isAdminUser.value = false
    }
    loading.value = false
  })
}

const checkAdminStatus = async () => {
  if (!user.value) {
    isAdminUser.value = false
    return
  }
  
  try {
    const { data } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.value.id)
      .single()
    
    isAdminUser.value = !!data
  } catch {
    isAdminUser.value = false
  }
}

export const register = async (email, password, displayName) => {
  error.value = null
  loading.value = true

  try {
    const { data, error: authError } = await signUp(email, password, displayName)

    if (authError) {
      throw authError
    }

    user.value = data.user
    if (data.user) {
      const { data: playerData } = await getPlayerProfile(data.user.id)
      player.value = playerData
    }
    
    return { success: true }
  } catch (err) {
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    loading.value = false
  }
}

export const login = async (identifier, password) => {
  error.value = null
  loading.value = true

  try {
    const { data, error: authError } = await signInWithEmail(identifier, password)

    if (authError) {
      throw authError
    }

    user.value = data.user
    if (data.user) {
      const { data: playerData } = await getPlayerProfile(data.user.id)
      player.value = playerData
      await checkAdminStatus()
    }
    
    return { success: true, isAdmin: isAdminUser.value }
  } catch (err) {
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    loading.value = false
  }
}

export const logout = async () => {
  error.value = null
  try {
    const { error: authError } = await signOut()
    if (authError) throw authError

    user.value = null
    player.value = null
    return { success: true }
  } catch (err) {
    error.value = err.message
    return { success: false, error: err.message }
  }
}

export const getAuthToken = async () => {
  return await getAccessToken()
}

export const refreshPlayer = async () => {
  if (user.value) {
    const { data } = await getPlayerProfile(user.value.id)
    player.value = data
  }
}

export const isAuthenticated = computed(() => !!user.value)
export const isLoading = computed(() => loading.value)
export const authError = computed(() => error.value)
export const currentUser = computed(() => user.value)
export const currentPlayer = computed(() => player.value)
export const isAdmin = computed(() => isAdminUser.value)

export const clearError = () => {
  error.value = null
}
