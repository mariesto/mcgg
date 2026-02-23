<template>
  <div class="compare-container">
    <header class="compare-header">
      <router-link to="/dashboard" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Dashboard
      </router-link>
    </header>

    <main class="compare-main">
      <h1>Compare Players</h1>

      <div class="player-select">
        <label>Select opponent:</label>
        <select v-model="selectedPlayerId" @change="fetchComparison" class="input select">
          <option value="">Choose a player</option>
          <option v-for="player in players" :key="player.id" :value="player.id">
            {{ player.display_name }}
          </option>
        </select>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
      </div>

      <div v-else-if="comparison" class="comparison-grid">
        <div class="player-card me">
          <h3>You</h3>
          <div class="stat-row">
            <span class="stat-label">Points</span>
            <span class="stat-value">{{ comparison.me.points }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Games</span>
            <span class="stat-value">{{ comparison.me.gamesPlayed }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Wins</span>
            <span class="stat-value">{{ comparison.me.wins }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Top 3 Rate</span>
            <span class="stat-value">{{ comparison.me.topThreeRate }}%</span>
          </div>
        </div>

        <div class="vs-section">
          <div class="vs-badge">VS</div>
          <div v-if="comparison.headToHead.gamesTogether > 0" class="head-to-head">
            <h4>Head-to-Head</h4>
            <p class="games-together">{{ comparison.headToHead.gamesTogether }} games together</p>
            <div class="h2h-bars">
              <div class="h2h-bar">
                <span class="bar-label">You ranked higher</span>
                <div class="bar-container">
                  <div class="bar-fill me-bar" :style="{ width: h2hMePercent + '%' }"></div>
                </div>
                <span class="bar-value">{{ comparison.headToHead.iRankedHigher }}</span>
              </div>
              <div class="h2h-bar">
                <span class="bar-label">They ranked higher</span>
                <div class="bar-container">
                  <div class="bar-fill them-bar" :style="{ width: h2hThemPercent + '%' }"></div>
                </div>
                <span class="bar-value">{{ comparison.headToHead.theyRankedHigher }}</span>
              </div>
            </div>
          </div>
          <div v-else class="no-games">
            <p>No games played together yet</p>
          </div>
        </div>

        <div class="player-card them">
          <h3>{{ comparison.them.display_name }}</h3>
          <div class="stat-row">
            <span class="stat-label">Points</span>
            <span class="stat-value">{{ comparison.them.points }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Games</span>
            <span class="stat-value">{{ comparison.them.gamesPlayed }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Wins</span>
            <span class="stat-value">{{ comparison.them.wins }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Top 3 Rate</span>
            <span class="stat-value">{{ comparison.them.topThreeRate }}%</span>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>Select a player to compare stats</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAuthToken, currentPlayer } from '../composables/useAuth.js'
import { supabase } from '../lib/supabase.js'

const players = ref([])
const selectedPlayerId = ref('')
const comparison = ref(null)
const loading = ref(false)
const player = currentPlayer

const h2hMePercent = computed(() => {
  if (!comparison.value) return 0
  const total = comparison.value.headToHead.iRankedHigher + comparison.value.headToHead.theyRankedHigher
  return total > 0 ? (comparison.value.headToHead.iRankedHigher / total) * 100 : 0
})

const h2hThemPercent = computed(() => {
  if (!comparison.value) return 0
  const total = comparison.value.headToHead.iRankedHigher + comparison.value.headToHead.theyRankedHigher
  return total > 0 ? (comparison.value.headToHead.theyRankedHigher / total) * 100 : 0
})

const fetchPlayers = async () => {
  const { data } = await supabase
    .from('players')
    .select('id, display_name')
    .eq('is_active', true)
    .neq('id', player.value?.id)
    .order('display_name')
  players.value = data || []
}

const fetchComparison = async () => {
  if (!selectedPlayerId.value) {
    comparison.value = null
    return
  }

  loading.value = true
  const token = await getAuthToken()

  try {
    const response = await fetch(`/api/players/${selectedPlayerId.value}/compare`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    comparison.value = await response.json()
  } catch (error) {
    console.error('Failed to fetch comparison:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchPlayers)
</script>

<style scoped>
.compare-container {
  min-height: 100vh;
  background: var(--bg-primary);
}

.compare-header {
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

.compare-main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.compare-main h1 {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.player-select {
  margin-bottom: 2rem;
}

.player-select label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.player-select .select {
  max-width: 300px;
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

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1.5rem;
  align-items: start;
}

.player-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
}

.player-card.me {
  border-left: 4px solid var(--primary-500);
}

.player-card.them {
  border-right: 4px solid var(--accent);
}

.player-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-label {
  color: var(--text-tertiary);
}

.stat-value {
  font-weight: 700;
  color: var(--text-primary);
}

.vs-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
}

.vs-badge {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-500), var(--accent));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.head-to-head {
  text-align: center;
  width: 200px;
}

.head-to-head h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.games-together {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.h2h-bars {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.h2h-bar {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.bar-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.bar-container {
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.me-bar {
  background: var(--primary-500);
}

.them-bar {
  background: var(--accent);
}

.bar-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.no-games {
  text-align: center;
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-glass);
  border-radius: 16px;
  border: 1px dashed var(--border-color);
  color: var(--text-tertiary);
}

@media (max-width: 768px) {
  .comparison-grid {
    grid-template-columns: 1fr;
  }

  .vs-section {
    order: -1;
    padding-top: 0;
  }
}
</style>
