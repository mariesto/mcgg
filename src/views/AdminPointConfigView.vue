<template>
  <div class="admin-config-container">
    <header class="admin-header">
      <router-link to="/admin" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Admin
      </router-link>
      <h1>Point Configuration</h1>
    </header>

    <main class="admin-main">
      <p class="subtitle">Configure how points are awarded based on rank positions.</p>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
      </div>

      <div v-else class="tiers-list">
        <div v-for="(tier, index) in tiers" :key="tier.id" class="tier-card">
          <div class="tier-header">
            <h3>Tier {{ index + 1 }}</h3>
            <label class="toggle">
              <input type="checkbox" v-model="tier.is_active" />
              <span class="toggle-slider"></span>
              Active
            </label>
          </div>
          
          <div class="tier-form">
            <div class="form-group">
              <label>Name</label>
              <input v-model="tier.tier_name" class="input" placeholder="e.g., Top Tier" />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Rank Start</label>
                <input v-model.number="tier.rank_start" type="number" min="1" max="8" class="input" />
              </div>
              <div class="form-group">
                <label>Rank End</label>
                <input v-model.number="tier.rank_end" type="number" min="1" max="8" class="input" />
              </div>
              <div class="form-group">
                <label>Points</label>
                <input v-model.number="tier.points" type="number" min="0" class="input" />
              </div>
            </div>
          </div>
        </div>

        <button @click="addTier" class="btn btn-secondary">
          + Add New Tier
        </button>

        <div class="form-actions">
          <button @click="saveConfig" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Configuration' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuthToken } from '../composables/useAuth.js'

const loading = ref(true)
const saving = ref(false)
const tiers = ref([])

const fetchConfig = async () => {
  loading.value = true
  const token = await getAuthToken()

  try {
    const response = await fetch('/api/admin/point-config', {
      headers: { Authorization: `Bearer ${token}` }
    })
    tiers.value = await response.json() || []
  } catch (error) {
    console.error('Failed to fetch config:', error)
  } finally {
    loading.value = false
  }
}

const addTier = () => {
  tiers.value.push({
    id: null,
    tier_name: '',
    rank_start: 1,
    rank_end: 8,
    points: 1,
    is_active: true
  })
}

const saveConfig = async () => {
  saving.value = true
  const token = await getAuthToken()

  try {
    const response = await fetch('/api/admin/point-config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ tiers: tiers.value })
    })
    
    const result = await response.json()
    tiers.value = result || []
  } catch (error) {
    console.error('Failed to save config:', error)
  } finally {
    saving.value = false
  }
}

onMounted(fetchConfig)
</script>

<style scoped>
.admin-config-container {
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

.tiers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tier-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.tier-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tier-header h3 {
  font-size: 1rem;
  font-weight: 700;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.toggle input {
  display: none;
}

.toggle-slider {
  width: 40px;
  height: 22px;
  background: var(--bg-secondary);
  border-radius: 11px;
  position: relative;
  transition: background 0.2s;
}

.toggle-slider::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
}

.toggle input:checked + .toggle-slider {
  background: var(--success);
}

.toggle input:checked + .toggle-slider::after {
  transform: translateX(18px);
}

.tier-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.form-actions {
  padding-top: 1rem;
}
</style>
