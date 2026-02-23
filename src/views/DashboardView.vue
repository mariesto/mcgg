<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="header-content">
        <div class="logo-section">
          <router-link to="/" class="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </router-link>
          <h1>Player Dashboard</h1>
        </div>
        <div class="user-section">
          <span class="welcome">
            <svg class="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {{ player?.display_name || 'Player' }}
          </span>
          <button type="button" @click="handleLogout" class="nav-link logout-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Logout</span>
          </button>
          <button class="theme-toggle" @click="toggleTheme">
            <svg v-if="isDarkMode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading your stats...</p>
      </div>

      <template v-else>
        <div class="title-section" v-if="title">
          <div class="title-card">
            <span class="title-badge">{{ title.title }}</span>
            <p class="title-description">{{ title.description }}</p>
          </div>
        </div>

        <div class="quick-actions">
          <router-link to="/compare" class="quick-action-card">
            <div class="quick-action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 20V10M12 20V4M6 20v-6"/>
              </svg>
            </div>
            <div class="quick-action-content">
              <span class="quick-action-title">Compare Stats</span>
              <span class="quick-action-desc">Head-to-head comparison</span>
            </div>
          </router-link>

          <router-link to="/tickets" class="quick-action-card">
            <div class="quick-action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div class="quick-action-content">
              <span class="quick-action-title">My Tickets</span>
              <span class="quick-action-desc">View your submissions</span>
            </div>
          </router-link>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon points">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats.totalPoints }}</span>
              <span class="stat-label">Total Points</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon games">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats.gamesPlayed }}</span>
              <span class="stat-label">Games Played</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon wins">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats.wins }}</span>
              <span class="stat-label">Wins (Top 3)</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon rate">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats.winRate }}%</span>
              <span class="stat-label">Win Rate</span>
            </div>
          </div>
        </div>

        <div class="features-grid">
          <div class="feature-card streak-card" v-if="streak.currentStreak > 0">
            <h3>Current Streak</h3>
            <div class="streak-display">
              <span class="streak-fire" v-for="n in Math.min(streak.currentStreak, 10)" :key="n">🔥</span>
            </div>
            <p class="streak-text">{{ streak.currentStreak }} games in Top 3!</p>
            <p class="streak-best">Best: {{ streak.bestStreak }}</p>
          </div>

          <div class="feature-card crown-card" v-if="crownChase">
            <h3>Crown Chase</h3>
            <div v-if="crownChase.myRank === 1" class="you-are-king">
              <span class="crown-emoji">👑</span>
              <p>You are the King!</p>
            </div>
            <div v-else class="chase-progress">
              <p class="king-info">Current King: <strong>{{ crownChase.king?.display_name }}</strong></p>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progressWidth }"></div>
              </div>
              <p class="points-behind">{{ crownChase.pointsBehind }} points behind</p>
            </div>
          </div>

          <div class="feature-card rivalry-card" v-if="rivalries">
            <h3>Rivalries</h3>
            <div v-if="rivalries.nemesis" class="rivalry-item nemesis">
              <span class="rivalry-label">Your Nemesis</span>
              <span class="rivalry-name">{{ rivalries.nemesis.name }}</span>
              <span class="rivalry-stat">They beat you {{ Math.round(rivalries.nemesis.theyWon / rivalries.nemesis.gamesTogether * 100) }}% of the time</span>
            </div>
            <div v-if="rivalries.prey" class="rivalry-item prey">
              <span class="rivalry-label">Your Prey</span>
              <span class="rivalry-name">{{ rivalries.prey.name }}</span>
              <span class="rivalry-stat">You beat them {{ Math.round(rivalries.prey.iWon / rivalries.prey.gamesTogether * 100) }}% of the time</span>
            </div>
            <div v-if="!rivalries.nemesis && !rivalries.prey" class="no-rivalry">
              <p>Play more games to build rivalries!</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Game History</h2>
          <div class="history-list" v-if="history.length > 0">
            <div v-for="game in history" :key="game.id" class="history-item">
              <div class="history-rank" :class="getRankClass(game.rank)">
                {{ game.rank }}
              </div>
              <div class="history-details">
                <span class="history-mode">{{ game.games?.game_mode }}</span>
                <span class="history-date">{{ formatDate(game.games?.played_at) }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No games recorded yet.</p>
          </div>
        </div>

        <div class="section" v-if="pendingApprovals.length > 0">
          <h2>Pending Confirmations</h2>
          <div class="approvals-list">
            <div v-for="approval in pendingApprovals" :key="approval.id" class="approval-item">
              <div class="approval-info">
                <span class="approval-creator">{{ approval.tickets?.players?.display_name }} submitted a game</span>
                <span class="approval-games">{{ approval.tickets?.games?.length || 1 }} game(s)</span>
              </div>
              <div class="approval-actions">
                <button @click="handleApprove(approval.tickets?.id)" class="btn btn-success btn-xs">Approve</button>
                <button @click="handleReject(approval.tickets?.id)" class="btn btn-danger btn-xs">Reject</button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logout, currentPlayer, getAuthToken } from '../composables/useAuth.js'
import { supabase } from '../lib/supabase.js'

const router = useRouter()
const loading = ref(true)
const player = currentPlayer

const stats = ref({
  totalPoints: 0,
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  winRate: 0,
  firstPlaces: 0,
  topThreeFinishes: 0,
})

const streak = ref({ currentStreak: 0, bestStreak: 0 })
const rivalries = ref(null)
const title = ref(null)
const crownChase = ref(null)
const history = ref([])
const pendingApprovals = ref([])
const isDarkMode = ref(false)

const progressWidth = computed(() => {
  if (!crownChase.value || !crownChase.value.king) return '0%'
  const myPoints = crownChase.value.myPoints
  const kingPoints = crownChase.value.king.points
  return `${Math.round((myPoints / kingPoints) * 100)}%`
})

const fetchDashboardData = async () => {
  loading.value = true
  const token = await getAuthToken()

  try {
    const [statsRes, streakRes, rivalriesRes, titleRes, crownRes, historyRes, approvalsRes] = await Promise.all([
      fetch('/api/players/me/stats', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/players/me/streak', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/players/me/rivalries', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/players/me/title', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/players/me/crown-chase', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/players/me/history', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/tickets/pending-approvals', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ])

    stats.value = statsRes
    streak.value = streakRes
    rivalries.value = rivalriesRes
    title.value = titleRes
    crownChase.value = crownRes
    history.value = historyRes || []
    pendingApprovals.value = approvalsRes || []
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  await logout()
  router.push('/')
}

const handleApprove = async (ticketId) => {
  const token = await getAuthToken()
  await fetch(`/api/tickets/${ticketId}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  fetchDashboardData()
}

const handleReject = async (ticketId) => {
  const token = await getAuthToken()
  await fetch(`/api/tickets/${ticketId}/reject`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  fetchDashboardData()
}

const getRankClass = (rank) => {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return ''
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDarkMode.value = savedTheme === 'dark' || (!savedTheme && systemDark)
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  fetchDashboardData()
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: var(--bg-primary);
}

.dashboard-header {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
}

.logo svg {
  width: 24px;
  height: 24px;
}

.logo-section h1 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome {
  color: var(--text-secondary);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.welcome .user-icon {
  width: 18px;
  height: 18px;
  color: var(--primary-500);
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

button.nav-link {
  background: transparent;
  border: 1px solid transparent;
  font-family: inherit;
  cursor: pointer;
}

.nav-link:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.nav-link svg {
  width: 18px;
  height: 18px;
}

.logout-link {
  border-color: var(--border-color);
}

.logout-link:hover {
  border-color: var(--border-strong);
  background: var(--bg-elevated);
}

.theme-toggle {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border-color: var(--border-strong);
}

.theme-toggle svg {
  width: 20px;
  height: 20px;
}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
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

.title-section {
  margin-bottom: 2rem;
}

.title-card {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  color: white;
}

.title-badge {
  font-size: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.title-description {
  margin-top: 0.5rem;
  opacity: 0.9;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.quick-action-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  transition: all var(--transition-base);
}

.quick-action-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.quick-action-card.primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border: none;
  color: white;
}

.quick-action-card.primary:hover {
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.4);
}

.quick-action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-action-card.primary .quick-action-icon {
  background: rgba(255, 255, 255, 0.2);
}

.quick-action-icon svg {
  width: 24px;
  height: 24px;
  color: var(--primary-500);
}

.quick-action-card.primary .quick-action-icon svg {
  color: white;
}

.quick-action-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.quick-action-title {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-primary);
}

.quick-action-card.primary .quick-action-title {
  color: white;
}

.quick-action-desc {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.quick-action-card.primary .quick-action-desc {
  color: rgba(255, 255, 255, 0.8);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-icon.points {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
}

.stat-icon.games {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
}

.stat-icon.wins {
  background: linear-gradient(135deg, #34d399, #10b981);
  color: white;
}

.stat-icon.rate {
  background: linear-gradient(135deg, #a78bfa, #8b5cf6);
  color: white;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.feature-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
}

.feature-card h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

.streak-display {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.streak-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.streak-best {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin-top: 0.25rem;
}

.you-are-king {
  text-align: center;
}

.crown-emoji {
  font-size: 3rem;
}

.you-are-king p {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 0.5rem;
}

.king-info {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.progress-bar {
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: 4px;
  transition: width 0.5s ease;
}

.points-behind {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin-top: 0.5rem;
  text-align: right;
}

.rivalry-item {
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.rivalry-item.nemesis {
  background: var(--error-soft);
  border-left: 3px solid var(--error);
}

.rivalry-item.prey {
  background: var(--success-soft);
  border-left: 3px solid var(--success);
}

.rivalry-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-tertiary);
  display: block;
}

.rivalry-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  display: block;
  margin: 0.25rem 0;
}

.rivalry-stat {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.no-rivalry {
  color: var(--text-tertiary);
  text-align: center;
  padding: 1rem;
}

.section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-item {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.history-rank {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--text-secondary);
}

.history-rank.gold {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
}

.history-rank.silver {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  color: white;
}

.history-rank.bronze {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
}

.history-details {
  display: flex;
  flex-direction: column;
}

.history-mode {
  font-weight: 600;
  color: var(--text-primary);
}

.history-date {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-tertiary);
  background: var(--bg-glass);
  border-radius: 16px;
  border: 1px dashed var(--border-color);
}

.approvals-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.approval-item {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.approval-info {
  display: flex;
  flex-direction: column;
}

.approval-creator {
  font-weight: 600;
  color: var(--text-primary);
}

.approval-games {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.approval-actions {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 900px) {
  .user-section {
    gap: 0.625rem;
  }

  .submit-game-cta--header {
    padding: 0.45rem 0.75rem;
  }

  .submit-game-cta--header .submit-game-cta__label {
    font-size: 0.8125rem;
  }
}

@media (max-width: 640px) {
  .dashboard-header {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .user-section {
    width: 100%;
    justify-content: space-between;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
