<template>
  <div class="app-container">
    <!-- Background decoration -->
    <div class="bg-decoration">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- Navigation -->
    <nav class="top-nav">
      <div class="nav-brand">
        <div class="brand-icon">
          <img src="/mcgg logo.png" alt="Magic Chess Go Go Logo" />
        </div>
        <span class="brand-name">Magic Chess Go Go</span>
      </div>
      
      <div class="nav-actions">
        <template v-if="isLoggedIn">
          <span class="user-greeting">
            <svg class="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span class="user-name">{{ player?.display_name || 'Player' }}</span>
          </span>
          <router-link to="/dashboard" class="nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Dashboard</span>
          </router-link>
          <button type="button" @click="handleLogout" class="nav-link logout-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Logout</span>
          </button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Login</span>
          </router-link>
        </template>
        <router-link to="/admin" class="nav-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span>Admin</span>
        </router-link>
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
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <span class="hero-tag">Leaderboard</span>
          <h1 class="hero-title">
            Player <span class="gradient-text">Rankings</span>
          </h1>
          <p class="hero-subtitle">
            Track performance, analyze statistics, and celebrate victories
          </p>
        </div>
        <div class="hero-date">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>{{ currentDate }}</span>
        </div>
      </section>

      <!-- Story Cards - The 5 Legends -->
      <section class="stats-section">
        <div class="stats-grid">
          <!-- 1. The Executioner -->
          <div class="stat-card executioner">
            <div class="stat-glow"></div>
            <div class="stat-content">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-label">The Executioner</span>
                <p class="stat-tagline">{{ statistics.executioner?.tagline || 'Waiting for a king to fall...' }}</p>
                <h3 class="stat-value">{{ statistics.executioner?.name || '—' }}</h3>
                <div class="stat-badge" v-if="statistics.executioner">
                  <span class="badge-value">{{ statistics.executioner.championKills }}</span>
                  <span class="badge-label">kings slain</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. The Phoenix -->
          <div class="stat-card phoenix">
            <div class="stat-glow"></div>
            <div class="stat-content">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 22h20L12 2z"/>
                  <path d="M12 22v-8"/>
                  <path d="M12 6l-3 6h6l-3-6z"/>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-label">The Phoenix</span>
                <p class="stat-tagline">{{ statistics.phoenix?.tagline || 'Rising from the ashes...' }}</p>
                <h3 class="stat-value">{{ statistics.phoenix?.name || '—' }}</h3>
                <div class="stat-badge" v-if="statistics.phoenix">
                  <span class="badge-value">{{ statistics.phoenix.phoenixWins }}</span>
                  <span class="badge-label">comeback wins</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Rival Alert -->
          <div class="stat-card rival">
            <div class="stat-glow"></div>
            <div class="stat-content">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-label">Rival Alert</span>
                <p class="stat-tagline">{{ statistics.rivalAlert?.tagline || 'Waiting for titans to clash...' }}</p>
                <h3 class="stat-value multiline" v-if="statistics.rivalAlert">
                  <span class="player-name-line">{{ statistics.rivalAlert.player1 }}</span>
                  <span class="vs-text">VS</span>
                  <span class="player-name-line">{{ statistics.rivalAlert.player2 }}</span>
                </h3>
                <h3 class="stat-value" v-else>—</h3>
                <div class="stat-badge" v-if="statistics.rivalAlert">
                  <span class="badge-value">{{ statistics.rivalAlert.matches }}</span>
                  <span class="badge-label">battles</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. The Gatekeeper -->
          <div class="stat-card gatekeeper">
            <div class="stat-glow"></div>
            <div class="stat-content">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-label">The Gatekeeper</span>
                <p class="stat-tagline">{{ statistics.gatekeeper?.tagline || 'Standing at the threshold...' }}</p>
                <h3 class="stat-value">{{ statistics.gatekeeper?.name || '—' }}</h3>
                <div class="stat-badge" v-if="statistics.gatekeeper">
                  <span class="badge-value">{{ statistics.gatekeeper.fourthPlaces }}</span>
                  <span class="badge-label">near misses</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. The Underdog -->
          <div class="stat-card underdog">
            <div class="stat-glow"></div>
            <div class="stat-content">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-label">The Underdog</span>
                <p class="stat-tagline">{{ statistics.underdog?.tagline || 'Always the underdog, never the surprise' }}</p>
                <h3 class="stat-value">{{ statistics.underdog?.name || '—' }}</h3>
                <div class="stat-badge" v-if="statistics.underdog">
                  <span class="badge-value">{{ statistics.underdog.bottomFinishes }}</span>
                  <span class="badge-label">bottom finishes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Player Rankings -->
      <section class="rankings-section">
        <div class="section-card">
          <div class="section-header">
            <div class="section-title">
              <div class="title-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                  <path d="M4 22h16"/>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                  <path d="M12 2v13"/>
                </svg>
              </div>
              <div>
                <h2>Player Rankings</h2>
                <p>Performance overview and statistics</p>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" @click="exportStats">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export
            </button>
          </div>
          
          <div class="table-container">
            <table class="rankings-table">
              <thead>
                <tr>
                  <th class="rank-col">#</th>
                  <th>Player</th>
                  <th class="numeric">Wins</th>
                  <th class="numeric">Losses</th>
                  <th class="rate-col">Win Rate</th>
                  <th class="numeric">Matches</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(user, index) in sortedUsers" 
                  :key="user.id"
                  :class="{ 'top-three': index < 3 }"
                  :style="{ animationDelay: `${index * 60}ms` }"
                  class="player-row"
                >
                  <td class="rank-col">
                    <span class="rank-badge" :class="`rank-${index + 1}`">
                      {{ index + 1 }}
                    </span>
                  </td>
                  <td>
                    <div class="player-info">
                      <span class="player-name">{{ user.name }}</span>
                    </div>
                  </td>
                  <td class="numeric">
                    <span class="win-count">{{ user.wins }}</span>
                  </td>
                  <td class="numeric">
                    <span class="loss-count">{{ user.losses }}</span>
                  </td>
                  <td class="rate-col">
                    <div class="rate-bar">
                      <div class="rate-progress" :style="{ width: `${calculateWinRate(user)}%` }"></div>
                      <span class="rate-value">{{ calculateWinRate(user) }}%</span>
                    </div>
                  </td>
                  <td class="numeric">
                    <span class="match-count">{{ user.wins + user.losses }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Game History -->
      <section class="history-section">
        <div class="section-card">
          <div class="section-header">
            <div class="section-title">
              <div class="title-icon secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <h2>Game History</h2>
                <p>Match results by position</p>
              </div>
            </div>
            <select v-model="selectedDate" @change="loadGameHistory" class="input select date-filter">
              <option value="">All Games</option>
              <option v-for="date in allGameDates" :key="date" :value="date">
                {{ date }}
              </option>
            </select>
          </div>
          
          <div class="table-container">
            <table class="history-table">
              <thead>
                <tr>
                  <th class="date-col">Date</th>
                  <th class="match-col">Match</th>
                  <th>Player</th>
                  <th class="position-col">Position</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(dateEntry, dateIndex) in gameHistory" :key="dateEntry.date">
                  <template v-for="(match, matchIndex) in dateEntry.histories" :key="`${dateEntry.date}-${match.matchId}`">
                    <tr 
                      v-for="(player, playerIndex) in match.players" 
                      :key="`${dateEntry.date}-${match.matchId}-${player.name}`"
                      class="history-row"
                      :class="{ 
                        'first-match-row': playerIndex === 0,
                        'first-date-row': matchIndex === 0 && playerIndex === 0
                      }"
                      :style="{ animationDelay: `${((dateIndex * 10) + (matchIndex * 5) + playerIndex) * 20}ms` }"
                    >
                      <td class="date-col" v-if="matchIndex === 0 && playerIndex === 0" :rowspan="getTotalPlayersForDate(dateEntry)">
                        <div class="game-date-badge">
                          <span class="date-day">{{ formatDay(dateEntry.date) }}</span>
                          <span class="date-month">{{ formatMonth(dateEntry.date) }}</span>
                        </div>
                      </td>
                      <td class="match-col" v-if="playerIndex === 0" :rowspan="match.players.length">
                        <span class="match-badge">Match #{{ match.matchId }}</span>
                      </td>
                      <td>
                        <span class="player-name">{{ player.name }}</span>
                      </td>
                      <td class="position-col">
                        <span class="position-badge" :class="`position-${player.position}`">
                          {{ player.position }}
                        </span>
                      </td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { playersApi, gameHistoryApi, statisticsApi } from '../lib/api.js';
import { isAuthenticated, logout, currentPlayer } from '../composables/useAuth.js';

const router = useRouter();
const isDarkMode = ref(false);
const isLoggedIn = computed(() => isAuthenticated.value);
const player = currentPlayer;
const statistics = ref({
  // The 5 Story Cards
  executioner: null,
  phoenix: null,
  rivalAlert: null,
  gatekeeper: null,
  underdog: null,
  totalUsers: 0
});
const users = ref([]);
const allGameDates = ref([]);
const selectedDate = ref('');
const gameHistory = ref([]);
const currentDate = ref('');

const sortedUsers = computed(() => {
  return [...users.value].sort((a, b) => {
    const rateA = calculateWinRate(a);
    const rateB = calculateWinRate(b);
    return rateB - rateA || b.wins - a.wins;
  });
});

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

const handleLogout = async () => {
  await logout();
  router.push('/');
};

const calculateWinRate = (user) => {
  const matches = user.wins + user.losses;
  return matches === 0 ? 0 : Math.round((user.wins / matches) * 100);
};

const formatDay = (dateStr) => {
  const date = new Date(dateStr);
  return date.getDate();
};

const formatMonth = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short' });
};

const getTotalPlayersForDate = (dateEntry) => {
  return dateEntry.histories.reduce((total, match) => total + match.players.length, 0);
};

const loadStatistics = async () => {
  try {
    const data = await statisticsApi.getAll();
    statistics.value = {
      // The 5 Story Cards
      executioner: data.executioner || null,
      phoenix: data.phoenix || null,
      rivalAlert: data.rivalAlert || null,
      gatekeeper: data.gatekeeper || null,
      underdog: data.underdog || null,
      totalUsers: data.totalUsers
    };
    // Update users with calculated stats
    users.value = data.users;
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
};

const loadUsers = async () => {
  try {
    const data = await playersApi.getAll();
    users.value = data;
  } catch (error) {
    console.error('Error loading users:', error);
  }
};

const loadAllGameDates = async () => {
  try {
    const data = await gameHistoryApi.getDates();
    allGameDates.value = data;
  } catch (error) {
    console.error('Error loading game dates:', error);
  }
};

const loadGameHistory = async () => {
  try {
    const data = await gameHistoryApi.getAll(selectedDate.value || null);
    gameHistory.value = data;
  } catch (error) {
    console.error('Error loading game history:', error);
  }
};

const exportStats = () => {
  const csv = sortedUsers.value.map(user => ({
    Player: user.name,
    Wins: user.wins,
    Losses: user.losses,
    Matches: user.wins + user.losses,
    'Win Rate': `${calculateWinRate(user)}%`
  }));
  
  let csvContent = "data:text/csv;charset=utf-8," 
    + "Player,Wins,Losses,Matches,Win Rate\n"
    + csv.map(e => Object.values(e).join(',')).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "player_stats.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  isDarkMode.value = savedTheme === 'dark' || (!savedTheme && systemDark);
  document.documentElement.classList.toggle('dark', isDarkMode.value);
  
  currentDate.value = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  loadStatistics(); // This also loads users
  loadAllGameDates();
  loadGameHistory();
});
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Background Decorations */
.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.blob-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.2));
  top: -200px;
  right: -200px;
  animation: float 20s ease-in-out infinite;
}

.blob-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(251, 146, 60, 0.15));
  bottom: -150px;
  left: -150px;
  animation: float 25s ease-in-out infinite reverse;
}

.blob-3 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.15));
  top: 40%;
  left: 30%;
  animation: float 30s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.05);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.95);
  }
}

/* Navigation */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3rem;
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.brand-icon {
  width: 44px;
  height: 44px;
  background: transparent;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.brand-icon svg {
  width: 24px;
  height: 24px;
}

.brand-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.brand-name {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
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

.user-greeting {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.9375rem;
}

.user-icon {
  width: 18px;
  height: 18px;
  color: var(--primary-500);
}

.user-name {
  color: var(--text-primary);
}

.logout-link {
  border-color: var(--border-color);
}

.logout-link:hover {
  border-color: var(--border-strong);
  background: var(--bg-elevated);
}

.nav-link-primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white !important;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.25);
}

.nav-link-primary:hover {
  background: linear-gradient(135deg, var(--primary-400), var(--primary-500));
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.35);
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

/* Main Content */
.main-content {
  position: relative;
  z-index: 1;
  padding: 120px 3rem 3rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Hero Section */
.hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
}

.hero-content {
  max-width: 500px;
}

.hero-tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--primary-100);
  color: var(--primary-700);
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 9999px;
  margin-bottom: 1rem;
}

:root.dark .hero-tag {
  background: rgba(99, 102, 241, 0.2);
  color: var(--primary-300);
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
  margin-bottom: 0.75rem;
  letter-spacing: -1.5px;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

.hero-date {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 1.5rem;
  background: var(--bg-glass);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.9375rem;
}

.hero-date svg {
  width: 20px;
  height: 20px;
  color: var(--primary-500);
}

/* Stats Section */
.stats-section {
  margin-bottom: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

.stat-card {
  position: relative;
  padding: 1.75rem;
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  overflow: hidden;
  transition: all var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--border-strong);
}

.stat-card.winner {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
  border-color: rgba(16, 185, 129, 0.2);
}

.stat-card.loser {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05));
  border-color: rgba(245, 158, 11, 0.2);
}

.stat-card.rival {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(79, 70, 229, 0.05));
  border-color: rgba(99, 102, 241, 0.2);
}

.stat-card.consistent {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(2, 132, 199, 0.05));
  border-color: rgba(14, 165, 233, 0.2);
}

.stat-card.executioner {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
  border-color: rgba(239, 68, 68, 0.2);
}

.stat-card.phoenix {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.05));
  border-color: rgba(249, 115, 22, 0.2);
}

.stat-card.gatekeeper {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.05));
  border-color: rgba(168, 85, 247, 0.2);
}

.stat-card.underdog {
  background: linear-gradient(135deg, rgba(100, 116, 139, 0.1), rgba(71, 85, 105, 0.05));
  border-color: rgba(100, 116, 139, 0.2);
}

.stat-glow {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  pointer-events: none;
}

.stat-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card.winner .stat-icon {
  background: var(--success-soft);
  color: var(--success);
}

.stat-card.loser .stat-icon {
  background: var(--warning-soft);
  color: #d97706;
}

.stat-card.neutral .stat-icon {
  background: var(--bg-secondary);
  color: var(--primary-500);
}

.stat-card.rival .stat-icon {
  background: rgba(99, 102, 241, 0.15);
  color: #6366f1;
}

.stat-card.executioner .stat-icon {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.stat-card.phoenix .stat-icon {
  background: rgba(249, 115, 22, 0.15);
  color: #f97316;
}

.stat-card.gatekeeper .stat-icon {
  background: rgba(168, 85, 247, 0.15);
  color: #a855f7;
}

.stat-card.underdog .stat-icon {
  background: rgba(100, 116, 139, 0.15);
  color: #64748b;
}

.stat-card.consistent .stat-icon {
  background: rgba(14, 165, 233, 0.15);
  color: #0ea5e9;
}

.stat-icon svg {
  width: 26px;
  height: 26px;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.stat-tagline {
  font-size: 0.75rem;
  font-style: italic;
  color: var(--text-tertiary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
  min-height: 1.05rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-value.multiline {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 1.25rem;
}

.player-name-line {
  display: block;
  line-height: 1.3;
}

.stat-badge {
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
}

.badge-value {
  font-size: 1.125rem;
  font-weight: 800;
}

.stat-card.winner .badge-value {
  color: var(--success);
}

.stat-card.loser .badge-value {
  color: #d97706;
}

.stat-card.rival .badge-value {
  color: #6366f1;
}

.stat-card.consistent .badge-value {
  color: #0ea5e9;
}

.stat-card.executioner .badge-value {
  color: #ef4444;
}

.stat-card.phoenix .badge-value {
  color: #f97316;
}

.stat-card.gatekeeper .badge-value {
  color: #a855f7;
}

.stat-card.underdog .badge-value {
  color: #64748b;
}

.vs-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-align: center;
  padding: 0.125rem 0;
}

.badge-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-tertiary);
}

.stat-sublabel {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-tertiary);
}

/* Rankings Section */
.rankings-section {
  margin-bottom: 3rem;
}

.section-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.75rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.title-icon.secondary {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.title-icon svg {
  width: 24px;
  height: 24px;
}

.section-title h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.125rem 0;
}

.section-title p {
  font-size: 0.9375rem;
  color: var(--text-tertiary);
  margin: 0;
}

.table-container {
  overflow-x: auto;
  padding: 0.5rem;
}

.rankings-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.rankings-table th {
  text-align: left;
  padding: 1.25rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  background: transparent;
  border-bottom: 2px solid var(--border-color);
}

.rankings-table th.numeric,
.rankings-table th.rank-col,
.rankings-table th.rate-col {
  text-align: center;
}

.rankings-table td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-weight: 500;
}

.player-row {
  animation: fadeInUp 0.5s var(--transition-spring) forwards;
  opacity: 0;
  transition: all var(--transition-fast);
}

.player-row:hover {
  background: rgba(99, 102, 241, 0.03);
}

.player-row.top-three {
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.05), transparent);
}

.rank-col {
  width: 80px;
  text-align: center;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--bg-secondary);
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--text-muted);
}

.rank-badge.rank-1 {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
}

.rank-badge.rank-2 {
  background: linear-gradient(135deg, #e5e7eb, #9ca3af);
  color: white;
  box-shadow: 0 4px 12px rgba(156, 163, 175, 0.4);
}

.rank-badge.rank-3 {
  background: linear-gradient(135deg, #fdba74, #ea580c);
  color: white;
  box-shadow: 0 4px 12px rgba(251, 146, 60, 0.4);
}

.player-name {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1rem;
}

.numeric {
  text-align: center;
}

.win-count {
  color: var(--success);
  font-weight: 700;
  font-size: 1.0625rem;
}

.loss-count {
  color: var(--error);
  font-weight: 700;
  font-size: 1.0625rem;
}

.match-count {
  color: var(--text-tertiary);
  font-weight: 600;
}

.rate-col {
  width: 160px;
}

.rate-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.rate-progress {
  flex: 1;
  height: 8px;
  background: linear-gradient(90deg, var(--primary-500), var(--primary-400));
  border-radius: 100px;
  transition: width 0.6s ease;
}

.rate-value {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.9375rem;
  min-width: 42px;
}

/* History Section */
.history-section {
  margin-bottom: 2rem;
}

.date-filter {
  width: auto;
  min-width: 180px;
}

/* History Table */
.history-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.history-table th {
  text-align: left;
  padding: 1.25rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  background: transparent;
  border-bottom: 2px solid var(--border-color);
}

.history-table th.date-col,
.history-table th.position-col,
.history-table th.match-col {
  text-align: center;
}

.history-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-weight: 500;
}

.history-row {
  animation: fadeInUp 0.5s var(--transition-spring) forwards;
  opacity: 0;
  transition: all var(--transition-fast);
}

.history-row:hover {
  background: rgba(99, 102, 241, 0.03);
}

.history-row.first-date-row {
  border-top: 2px solid var(--border-color);
}

.history-row.first-match-row {
  border-top: 1px solid var(--border-light);
}

.match-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.875rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.date-col {
  width: 100px;
  text-align: center;
  vertical-align: middle;
}

.match-col {
  width: 100px;
  text-align: center;
  vertical-align: middle;
}

.game-date-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: 14px;
  color: white;
  margin: 0 auto;
}

.date-day {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
}

.date-month {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.position-col {
  width: 100px;
  text-align: center;
}

.position-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--bg-secondary);
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--text-muted);
}

.position-badge.position-1 {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
}

.position-badge.position-2 {
  background: linear-gradient(135deg, #e5e7eb, #9ca3af);
  color: white;
  box-shadow: 0 4px 12px rgba(156, 163, 175, 0.4);
}

.position-badge.position-3 {
  background: linear-gradient(135deg, #fdba74, #ea580c);
  color: white;
  box-shadow: 0 4px 12px rgba(251, 146, 60, 0.4);
}

.position-badge.position-4,
.position-badge.position-5,
.position-badge.position-6,
.position-badge.position-7,
.position-badge.position-8 {
  background: var(--bg-tertiary);
  color: var(--text-muted);
  border: 1px solid var(--border-color);
}

.history-table .player-name {
  font-weight: 700;
  color: var(--text-primary);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 1400px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .top-nav {
    padding: 0 1.5rem;
    height: 70px;
  }

  .brand-name {
    display: none;
  }

  .main-content {
    padding: 100px 1.5rem 2rem;
  }

  .hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .hero-title {
    font-size: 2.25rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .rankings-table th:nth-child(n+4),
  .rankings-table td:nth-child(n+4) {
    display: none;
  }
}
</style>
