<template>
  <div class="admin-tickets-container">
    <header class="admin-header">
      <router-link to="/admin" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Admin
      </router-link>
      <h1>Ticket Management</h1>
    </header>

    <main class="admin-main">
      <div class="filters">
        <select v-model="statusFilter" class="input select">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
      </div>

      <div v-else class="tickets-list">
        <div v-for="ticket in filteredTickets" :key="ticket.id" class="ticket-card">
          <div class="ticket-header">
            <span class="ticket-status" :class="ticket.status">{{ ticket.status }}</span>
            <span class="ticket-creator">{{ ticket.players?.display_name }}</span>
            <span class="ticket-date">{{ formatDate(ticket.created_at) }}</span>
          </div>

          <div v-if="ticket.games" class="ticket-games-count">
            {{ ticket.games?.length || 0 }} game(s)
          </div>

          <div class="ticket-actions">
            <router-link :to="`/tickets/${ticket.id}`" class="btn btn-secondary btn-sm">View</router-link>
            
            <template v-if="ticket.status === 'pending'">
              <button @click="handleApprove(ticket.id)" class="btn btn-success btn-sm">Approve</button>
              <button @click="showRejectModal(ticket.id)" class="btn btn-danger btn-sm">Reject</button>
            </template>
          </div>
        </div>
      </div>

      <div v-if="rejectingTicket" class="modal-overlay" @click="rejectingTicket = null">
        <div class="modal" @click.stop>
          <h2>Reject Ticket</h2>
          <div class="form-group">
            <label>Reason</label>
            <select v-model="rejectReason" class="input select">
              <option value="">Select reason</option>
              <option v-for="reason in rejectionReasons" :key="reason.id" :value="reason.id">
                {{ reason.label }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Details (optional)</label>
            <textarea v-model="rejectDetail" class="input" rows="3"></textarea>
          </div>
          <div class="modal-actions">
            <button @click="rejectingTicket = null" class="btn btn-secondary">Cancel</button>
            <button @click="handleReject" class="btn btn-danger" :disabled="!rejectReason">Reject</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuthToken, logout } from '../composables/useAuth.js'

const router = useRouter()
const loading = ref(true)
const tickets = ref([])
const rejectionReasons = ref([])
const statusFilter = ref('')
const rejectingTicket = ref(null)
const rejectReason = ref('')
const rejectDetail = ref('')

const filteredTickets = computed(() => {
  if (!statusFilter.value) return tickets.value
  return tickets.value.filter(t => t.status === statusFilter.value)
})

const fetchData = async () => {
  loading.value = true
  const token = await getAuthToken()

  try {
    const [ticketsRes, reasonsRes] = await Promise.all([
      fetch('/api/tickets/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json()),
      fetch('/api/admin/rejection-reasons', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json())
    ])

    tickets.value = ticketsRes || []
    rejectionReasons.value = reasonsRes || []
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
}

const handleApprove = async (ticketId) => {
  const token = await getAuthToken()
  await fetch(`/api/tickets/admin/${ticketId}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  })
  fetchData()
}

const showRejectModal = (ticketId) => {
  rejectingTicket.value = ticketId
  rejectReason.value = ''
  rejectDetail.value = ''
}

const handleReject = async () => {
  if (!rejectReason.value) return
  
  const token = await getAuthToken()
  await fetch(`/api/tickets/admin/${rejectingTicket.value}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      rejection_reason_id: rejectReason.value,
      rejection_detail: rejectDetail.value
    })
  })
  
  rejectingTicket.value = null
  fetchData()
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const handleLogout = async () => {
  await logout()
  router.push('/')
}

onMounted(fetchData)
</script>

<style scoped>
.admin-tickets-container {
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.filters {
  margin-bottom: 1.5rem;
}

.filters .select {
  max-width: 200px;
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

.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ticket-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ticket-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.ticket-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.ticket-status.pending { background: var(--warning-soft); color: var(--warning); }
.ticket-status.approved { background: var(--success-soft); color: var(--success); }
.ticket-status.rejected { background: var(--error-soft); color: var(--error); }

.ticket-creator {
  font-weight: 600;
  color: var(--text-primary);
}

.ticket-date {
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.ticket-games-count {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.ticket-actions {
  display: flex;
  gap: 0.5rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--bg-elevated);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-xl);
}

.modal h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
</style>
