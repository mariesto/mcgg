<template>
  <div class="detail-container">
    <header class="detail-header">
      <router-link to="/tickets" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Tickets
      </router-link>
    </header>

    <main class="detail-main">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
      </div>

      <template v-else-if="ticket">
        <div class="ticket-header-card">
          <div class="ticket-info">
            <span class="ticket-status" :class="ticket.status">{{ ticket.status }}</span>
            <h1>Ticket Details</h1>
            <p class="ticket-meta">
              Created {{ formatDate(ticket.created_at) }} by 
              <strong>{{ ticket.players?.display_name || 'Unknown' }}</strong>
            </p>
          </div>
          <div v-if="ticket.status === 'pending' && isCreator" class="ticket-actions">
            <router-link :to="`/tickets/${ticket.id}/edit`" class="btn btn-secondary btn-sm">Edit</router-link>
          </div>
        </div>

        <div v-if="ticket.status === 'rejected'" class="rejection-card">
          <h3>Rejection Reason</h3>
          <p class="rejection-label">{{ ticket.rejection_reasons?.label || 'Unknown' }}</p>
          <p v-if="ticket.rejection_detail" class="rejection-detail">{{ ticket.rejection_detail }}</p>
        </div>

        <div class="games-section">
          <h2>Games</h2>
          <div class="games-list">
            <div v-for="(game, index) in sortedGames" :key="game.id" class="game-card">
              <div class="game-header">
                <span class="game-number">Game {{ index + 1 }}</span>
                <span class="game-mode">{{ game.game_mode }}</span>
                <span class="game-date">{{ formatDate(game.played_at) }}</span>
              </div>
              <div class="rankings-list">
                <div v-for="ranking in game.game_rankings" :key="ranking.id" class="ranking-item">
                  <span class="ranking-rank" :class="getRankClass(ranking.rank)">{{ ranking.rank }}</span>
                  <span class="ranking-player">{{ ranking.players?.display_name || 'Unknown' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="ticket.ticket_approvals?.length > 0" class="approvals-section">
          <h2>Participant Approvals</h2>
          <div class="approvals-list">
            <div v-for="approval in ticket.ticket_approvals" :key="approval.id" class="approval-item">
              <div class="approval-player">
                <span class="player-name">{{ approval.players?.display_name || 'Unknown' }}</span>
              </div>
              <span class="approval-status" :class="approval.status">{{ approval.status }}</span>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="error-state">
        <p>Ticket not found</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { currentPlayer } from '../composables/useAuth.js'
import { supabase } from '../lib/supabase.js'

const route = useRoute()
const loading = ref(true)
const ticket = ref(null)
const player = currentPlayer

const ticketId = route.params.id

const isCreator = computed(() => {
  return ticket.value?.players?.id === player.value?.id
})

const sortedGames = computed(() => {
  if (!ticket.value?.games) return []
  return [...ticket.value.games].sort((a, b) => a.position - b.position)
})

const fetchTicket = async () => {
  loading.value = true

  const { data, error: fetchError } = await supabase
    .from('tickets')
    .select(`
      *,
      players (id, display_name),
      rejection_reasons (code, label),
      games (
        id,
        game_mode,
        played_at,
        position,
        game_rankings (
          id,
          player_id,
          rank,
          players (id, display_name)
        )
      ),
      ticket_approvals (
        id,
        player_id,
        status,
        players (id, display_name)
      )
    `)
    .eq('id', ticketId)
    .single()

  if (!fetchError && data) {
    ticket.value = data
  }

  loading.value = false
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getRankClass = (rank) => {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return ''
}

onMounted(fetchTicket)
</script>

<style scoped>
.detail-container {
  min-height: 100vh;
  background: var(--bg-primary);
}

.detail-header {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 2rem;
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

.detail-main {
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

.ticket-header-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.ticket-status {
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  display: inline-block;
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

.ticket-info h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.ticket-meta {
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.rejection-card {
  background: var(--error-soft);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.rejection-card h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--error);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.rejection-label {
  font-weight: 600;
  color: var(--text-primary);
}

.rejection-detail {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.games-section {
  margin-bottom: 1.5rem;
}

.games-section h2 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.game-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
}

.game-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.game-number {
  font-weight: 700;
  color: var(--text-primary);
}

.game-mode {
  background: var(--primary-500);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.game-date {
  color: var(--text-tertiary);
  font-size: 0.875rem;
  margin-left: auto;
}

.rankings-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.ranking-rank {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.ranking-rank.gold {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
}

.ranking-rank.silver {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  color: white;
}

.ranking-rank.bronze {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
}

.ranking-player {
  font-weight: 500;
  color: var(--text-primary);
}

.approvals-section h2 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.approvals-list {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.approval-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.approval-item:last-child {
  border-bottom: none;
}

.player-name {
  font-weight: 500;
  color: var(--text-primary);
}

.approval-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.approval-status.pending {
  background: var(--warning-soft);
  color: var(--warning);
}

.approval-status.approved {
  background: var(--success-soft);
  color: var(--success);
}

.approval-status.rejected {
  background: var(--error-soft);
  color: var(--error);
}

.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-tertiary);
}
</style>
