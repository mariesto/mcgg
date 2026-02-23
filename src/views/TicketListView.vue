<template>
  <div class="tickets-container">
    <header class="tickets-header">
      <div class="header-content">
        <router-link to="/dashboard" class="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Dashboard
        </router-link>
        <router-link to="/tickets/create" class="nav-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>Submit New Game</span>
        </router-link>
      </div>
    </header>

    <main class="tickets-main">
      <h1>My Tickets</h1>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
      </div>

      <div v-else-if="tickets.length === 0" class="empty-state">
        <p>You haven't submitted any games yet.</p>
      </div>

      <div v-else class="tickets-list">
        <div v-for="ticket in tickets" :key="ticket.id" class="ticket-card">
          <div class="ticket-header">
            <span class="ticket-status" :class="ticket.status">{{ ticket.status }}</span>
            <span class="ticket-date">{{ formatDate(ticket.created_at) }}</span>
          </div>
          <div class="ticket-games">
            <div v-for="game in ticket.games" :key="game.id" class="game-preview">
              <span class="game-mode">{{ game.game_mode }}</span>
              <span class="game-date">{{ formatDate(game.played_at) }}</span>
              <span class="game-players">{{ game.game_rankings?.length || 0 }} players</span>
            </div>
          </div>
          <div v-if="ticket.status === 'pending'" class="ticket-actions">
            <router-link :to="`/tickets/${ticket.id}/edit`" class="btn btn-secondary btn-sm">Edit</router-link>
            <button @click="handleDelete(ticket.id)" class="btn btn-danger btn-sm">Cancel</button>
          </div>
          <div v-if="ticket.status === 'rejected'" class="rejection-info">
            <strong>Reason:</strong> {{ ticket.rejection_reasons?.label || 'Unknown' }}
            <span v-if="ticket.rejection_detail">- {{ ticket.rejection_detail }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuthToken } from '../composables/useAuth.js'

const router = useRouter()
const loading = ref(true)
const tickets = ref([])

const fetchTickets = async () => {
  loading.value = true
  const token = await getAuthToken()
  
  try {
    const response = await fetch('/api/tickets', {
      headers: { Authorization: `Bearer ${token}` }
    })
    tickets.value = await response.json()
  } catch (error) {
    console.error('Failed to fetch tickets:', error)
  } finally {
    loading.value = false
  }
}

const handleDelete = async (ticketId) => {
  if (!confirm('Are you sure you want to cancel this ticket?')) return
  
  const token = await getAuthToken()
  await fetch(`/api/tickets/${ticketId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  fetchTickets()
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

onMounted(fetchTickets)
</script>

<style scoped>
.tickets-container {
  min-height: 100vh;
  background: var(--bg-primary);
}

.tickets-header {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: 12px;
  transition: all var(--transition-fast);
}

.nav-link:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.nav-link svg {
  width: 18px;
  height: 18px;
}

.tickets-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.tickets-main h1 {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
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

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-glass);
  border-radius: 16px;
  border: 1px dashed var(--border-color);
}

.empty-state p {
  color: var(--text-tertiary);
  margin-bottom: 1.5rem;
}

.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ticket-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ticket-status {
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.ticket-status.pending {
  background: var(--warning-soft);
  color: var(--warning);
}

.ticket-status.approved {
  background: var(--success-soft);
  color: var(--success);
}

.ticket-status.rejected {
  background: var(--error-soft);
  color: var(--error);
}

.ticket-date {
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.ticket-games {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.game-preview {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  font-size: 0.875rem;
}

.game-mode {
  font-weight: 600;
  color: var(--text-primary);
}

.game-date, .game-players {
  color: var(--text-tertiary);
}

.ticket-actions {
  display: flex;
  gap: 0.5rem;
}

.rejection-info {
  padding: 0.75rem;
  background: var(--error-soft);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--error);
}
</style>
