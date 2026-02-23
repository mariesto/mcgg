<template>
  <div class="edit-container">
    <header class="edit-header">
      <router-link to="/tickets" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Tickets
      </router-link>
    </header>

    <main class="edit-main">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
      </div>

      <template v-else>
        <h1>Edit Ticket</h1>
        <p class="subtitle">Modify your pending ticket. This will reset participant approvals.</p>

        <form @submit.prevent="handleSubmit" class="edit-form">
          <div v-for="(game, gameIndex) in games" :key="gameIndex" class="game-section">
            <div class="game-header">
              <h3>Game {{ gameIndex + 1 }}</h3>
              <button v-if="games.length > 1" type="button" @click="removeGame(gameIndex)" class="btn btn-ghost btn-xs">
                Remove
              </button>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Game Mode</label>
                <select v-model="game.game_mode" class="input select" required>
                  <option value="">Select mode</option>
                  <option value="RANKED">Ranked</option>
                  <option value="CLASSIC">Classic</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>

              <div class="form-group">
                <label>Date & Time</label>
                <input v-model="game.played_at" type="datetime-local" class="input" required />
              </div>
            </div>

            <div class="rankings-section">
              <label>Player Rankings</label>
              <div v-for="(ranking, rankIndex) in game.rankings" :key="rankIndex" class="ranking-row">
                <select v-model="ranking.player_id" class="input select" required>
                  <option value="">Select player</option>
                  <option v-for="player in availablePlayers" :key="player.id" :value="player.id">
                    {{ player.display_name }}
                  </option>
                </select>
                <input v-model.number="ranking.rank" type="number" min="1" max="8" class="input rank-input" placeholder="Rank" required />
                <button type="button" @click="removeRanking(gameIndex, rankIndex)" class="btn btn-ghost btn-xs">✕</button>
              </div>
              <button type="button" @click="addRanking(gameIndex)" class="btn btn-secondary btn-sm">
                + Add Player
              </button>
            </div>
          </div>

          <button type="button" @click="addGame" class="btn btn-secondary">
            + Add Another Game
          </button>

          <div v-if="error" class="error-message">{{ error }}</div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              {{ submitting ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAuthToken } from '../composables/useAuth.js'
import { supabase } from '../lib/supabase.js'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const availablePlayers = ref([])

const games = ref([])

const ticketId = route.params.id

const fetchPlayers = async () => {
  const { data } = await supabase
    .from('players')
    .select('id, display_name')
    .eq('is_active', true)
    .order('display_name')
  availablePlayers.value = data || []
}

const fetchTicket = async () => {
  loading.value = true
  
  const { data, error: fetchError } = await supabase
    .from('tickets')
    .select(`
      id,
      status,
      games (
        id,
        game_mode,
        played_at,
        position,
        game_rankings (
          player_id,
          rank
        )
      )
    `)
    .eq('id', ticketId)
    .single()

  if (fetchError || !data) {
    error.value = 'Ticket not found'
    loading.value = false
    return
  }

  if (data.status !== 'pending') {
    error.value = 'Can only edit pending tickets'
    loading.value = false
    return
  }

  games.value = data.games
    .sort((a, b) => a.position - b.position)
    .map(game => ({
      id: game.id,
      game_mode: game.game_mode,
      played_at: game.played_at.slice(0, 16),
      rankings: game.game_rankings.map(r => ({
        player_id: r.player_id,
        rank: r.rank
      }))
    }))

  loading.value = false
}

const addGame = () => {
  games.value.push({
    game_mode: '',
    played_at: '',
    rankings: [{ player_id: '', rank: 1 }]
  })
}

const removeGame = (index) => {
  games.value.splice(index, 1)
}

const addRanking = (gameIndex) => {
  games.value[gameIndex].rankings.push({ player_id: '', rank: games.value[gameIndex].rankings.length + 1 })
}

const removeRanking = (gameIndex, rankIndex) => {
  if (games.value[gameIndex].rankings.length > 1) {
    games.value[gameIndex].rankings.splice(rankIndex, 1)
  }
}

const handleSubmit = async () => {
  error.value = ''
  submitting.value = true

  const token = await getAuthToken()

  try {
    const response = await fetch(`/api/tickets/${ticketId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ games: games.value })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update ticket')
    }

    router.push('/tickets')
  } catch (err) {
    error.value = err.message
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await fetchPlayers()
  await fetchTicket()
})
</script>

<style scoped>
.edit-container {
  min-height: 100vh;
  background: var(--bg-primary);
}

.edit-header {
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

.edit-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.edit-main h1 {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
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

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.game-section {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.game-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
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

.rankings-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rankings-section > label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.ranking-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.ranking-row .select {
  flex: 1;
}

.rank-input {
  width: 80px;
}

.error-message {
  padding: 0.75rem 1rem;
  background: var(--error-soft);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  color: var(--error);
  font-size: 0.875rem;
}

.form-actions {
  padding-top: 1rem;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
