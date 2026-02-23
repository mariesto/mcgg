<template>
  <div class="admin-reasons-container">
    <header class="admin-header">
      <router-link to="/admin" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Admin
      </router-link>
      <h1>Rejection Reasons</h1>
    </header>

    <main class="admin-main">
      <p class="subtitle">Manage predefined rejection reasons for ticket reviews.</p>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
      </div>

      <div v-else>
        <div class="add-form">
          <input v-model="newCode" class="input" placeholder="Code (e.g., INVALID_DATA)" />
          <input v-model="newLabel" class="input" placeholder="Label (e.g., Invalid data provided)" />
          <button @click="addReason" class="btn btn-primary" :disabled="!newCode || !newLabel">
            Add Reason
          </button>
        </div>

        <div class="reasons-list">
          <div v-for="reason in reasons" :key="reason.id" class="reason-card">
            <div class="reason-info">
              <span class="reason-code">{{ reason.code }}</span>
              <span class="reason-label">{{ reason.label }}</span>
            </div>
            <span class="reason-status" :class="reason.is_active ? 'active' : 'inactive'">
              {{ reason.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuthToken } from '../composables/useAuth.js'

const loading = ref(true)
const reasons = ref([])
const newCode = ref('')
const newLabel = ref('')

const fetchReasons = async () => {
  loading.value = true
  const token = await getAuthToken()

  try {
    const response = await fetch('/api/admin/rejection-reasons', {
      headers: { Authorization: `Bearer ${token}` }
    })
    reasons.value = await response.json() || []
  } catch (error) {
    console.error('Failed to fetch reasons:', error)
  } finally {
    loading.value = false
  }
}

const addReason = async () => {
  if (!newCode.value || !newLabel.value) return

  const token = await getAuthToken()
  
  try {
    await fetch('/api/admin/rejection-reasons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        code: newCode.value.toUpperCase().replace(/\s+/g, '_'),
        label: newLabel.value
      })
    })

    newCode.value = ''
    newLabel.value = ''
    fetchReasons()
  } catch (error) {
    console.error('Failed to add reason:', error)
  }
}

onMounted(fetchReasons)
</script>

<style scoped>
.admin-reasons-container {
  min-height: 100vh;
  background: var(--bg-primary);
}

.admin-header {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 600;
}

.back-btn svg {
  width: 20px;
  height: 20px;
}

.admin-header h1 {
  font-size: 1.5rem;
  font-weight: 800;
}

.admin-main {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.subtitle {
  color: var(--text-tertiary);
  margin-bottom: 2rem;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 4rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.add-form {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.add-form .input {
  flex: 1;
}

.reasons-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reason-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reason-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.reason-code {
  font-family: monospace;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-500);
}

.reason-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.reason-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.reason-status.active {
  background: var(--success-soft);
  color: var(--success);
}

.reason-status.inactive {
  background: var(--error-soft);
  color: var(--error);
}
</style>
