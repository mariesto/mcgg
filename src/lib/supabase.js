import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gxcrniljttutprksqkmp.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'sb_publishable_bonRx2PCje5xscbzycz_Ng_rrXWFOwu'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const signUp = async (email, password, displayName) => {
  let registerPayload = null
  try {
    const registerResponse = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        displayName,
      }),
    })

    registerPayload = await registerResponse.json().catch(() => null)

    if (!registerResponse.ok) {
      return {
        data: null,
        error: {
          message: registerPayload?.error || 'Failed to create account',
        },
      }
    }
  } catch {
    return {
      data: null,
      error: {
        message: 'Unable to reach server. Please try again.',
      },
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      data: registerPayload,
      error: {
        message: 'Account created, but automatic sign-in failed. Please login manually.',
      },
    }
  }

  return { data, error: null }
}

export const signInWithEmail = async (identifier, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        data: null,
        error: {
          message: payload?.error || 'Invalid credentials',
        },
      }
    }

    if (payload.session) {
      await supabase.auth.setSession({
        access_token: payload.session.access_token,
        refresh_token: payload.session.refresh_token,
      })
    }

    return { data: payload, error: null }
  } catch {
    return {
      data: null,
      error: {
        message: 'Unable to reach server. Please try again.',
      },
    }
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}

export const getAccessToken = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || null
}

export const getPlayerProfile = async (userId) => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}
