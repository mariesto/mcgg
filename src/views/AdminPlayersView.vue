<template>
  <div class="admin-players-container">
    <header class="admin-header">
      <router-link to="/admin" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Admin
      </router-link>
      <h1>Player Management</h1>
    </header>

    <main class="admin-main">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
      </div>

      <div v-else class="players-list">
        <div v-for="player in players" :key="player.id" class="player-card">
          <div class="player-avatar" :style="{ background: getAvatarColor(player.display_name) }">
            {{ getInitials(player.display_name) }}
          </div>
          <div class="player-info">
            <h3>{{ player.display_name }}</h3>
            <span class="player-status" :class="player.is_active ? 'active' : 'inactive'">
              {{ player.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="player-date">
            Joined {{ formatDate(player.created_at) }}
          </div>
          <div class="player-actions">
            <button 
              v-if="player.is_active"
              @click="deactivatePlayer(player.id)" 
              class="btn btn-danger btn-sm"
            >
              Deactivate
            </button>
            <button 
              v-else
              @click="activatePlayer(player.id)" 
              class="btn btn-success btn-sm"
            >
              Activate
            </button>
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
const players = ref([])

const fetchPlayers = async () => {
  loading.value = true
  const token = await getAuthToken()

  try {
    const response = await fetch('/api/admin/players', {
      headers: { Authorization: `Bearer ${token}` }
    })
    players.value = await response.json() || []
  } catch (error) {
    console.error('Failed to fetch players:', error)
  } finally {
    loading.value = false
  }
}

const deactivatePlayer = async (playerId) => {
  const token = await getAuthToken()
  await fetch(`/api/admin/players/${playerId}/deactivate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  })
  fetchPlayers()
}

const activatePlayer = async (playerId) => {
  const token = await getAuthToken()
  await fetch(`/api/admin/players/${playerId}/activate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  })
  fetchPlayers()
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const getAvatarColor = (name) => {
  const colors = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #a8edea, #fed6e3)',
  ]
  const index = name ? name.charCodeAt(0) % colors.length : 0
  return colors[index]
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

onMounted(fetchPlayers)
</script>

<style scoped>
.admin-players-container {
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
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
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

.players-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.player-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.player-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
}

.player-info {
  flex: 1;
}

.player-info h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.player-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.player-status.active {
  background: var(--success-soft);
  color: var(--success);
}

.player-status.inactive {
  background: var(--error-soft);
  color: var(--error);
}

.player-date {
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.player-actions {
  margin-left: auto;
}
</style>
