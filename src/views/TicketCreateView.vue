<template>
  <div class="create-container">
    <header class="create-header">
      <router-link to="/tickets" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Tickets
      </router-link>
    </header>

    <main class="create-main">
      <h1>Submit Game History</h1>
      <p class="subtitle">Record your game results. All participants will need to confirm.</p>

      <form @submit.prevent="handleSubmit" class="create-form">
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
            {{ submitting ? 'Submitting...' : 'Submit Ticket' }}
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuthToken } from '../composables/useAuth.js'
import { supabase } from '../lib/supabase.js'

const router = useRouter()
const submitting = ref(false)
const error = ref('')
const availablePlayers = ref([])

const games = ref([
  {
    game_mode: '',
    played_at: '',
    rankings: [{ player_id: '', rank: 1 }]
  }
])

const fetchPlayers = async () => {
  const { data } = await supabase
    .from('players')
    .select('id, display_name')
    .eq('is_active', true)
    .order('display_name')
  availablePlayers.value = data || []
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
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ games: games.value })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit ticket')
    }

    router.push('/tickets')
  } catch (err) {
    error.value = err.message
  } finally {
    submitting.value = false
  }
}

onMounted(fetchPlayers)
</script>

<style scoped>
.create-container {
  min-height: 100vh;
  background: var(--bg-primary);
}

.create-header {
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

.create-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.create-main h1 {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-tertiary);
  margin-bottom: 2rem;
}

.create-form {
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
