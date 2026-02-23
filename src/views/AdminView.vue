<template>
  <div class="app-container">
    <!-- Background decoration -->
    <div class="bg-decoration">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <!-- Navigation -->
    <nav class="top-nav">
      <div class="nav-brand">
        <div class="brand-icon">
          <img src="/mcgg logo.png" alt="Magic Chess Go Go Logo"/>
        </div>
        <span class="brand-name">Magic Chess Go Go</span>
      </div>

      <div class="nav-actions">
        <router-link to="/" class="nav-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span>Dashboard</span>
        </router-link>
        <button class="nav-link logout-btn" @click="handleLogout">
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
            <path
                d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <section class="hero">
        <div class="hero-content">
          <span class="hero-tag admin">Administration</span>
          <h1 class="hero-title">
            Manage <span class="gradient-text">Everything</span>
          </h1>
          <p class="hero-subtitle">
            Control users and organize games
          </p>
        </div>
      </section>

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- User Management -->
        <section class="content-card">
          <div class="card-header">
            <div class="header-title">
              <div class="header-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <h2>Players</h2>
                <p>Manage participant accounts</p>
              </div>
            </div>
          </div>

          <div class="card-body">
            <!-- Add User Form -->
            <div class="form-section">
              <label class="form-label">Add New Player</label>
              <div class="input-group">
                <input
                    v-model="newUserName"
                    @keyup.enter="addUser"
                    placeholder="Enter player name..."
                    class="input"
                />
                <button @click="addUser" class="btn btn-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add
                </button>
              </div>
            </div>

            <!-- Users List -->
            <div class="list-container">
              <div v-if="users.length === 0" class="empty-state">
                <div class="empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3>No players yet</h3>
                <p>Add your first player to get started</p>
              </div>

              <div v-else class="users-list">
                <div
                    v-for="(user, index) in users"
                    :key="user.id"
                    class="user-item"
                    :style="{ animationDelay: `${index * 50}ms` }"
                >
                  <div class="user-avatar" :style="{ background: getAvatarColor(user.name) }">
                    {{ getInitials(user.name) }}
                  </div>
                  <div class="user-info">
                    <h4>{{ user.name }}</h4>
                    <div class="user-stats">
                      <span class="stat-pill wins">{{ user.wins }}W</span>
                      <span class="stat-pill losses">{{ user.losses }}L</span>
                      <span class="stat-pill score">{{ user.score }}pts</span>
                    </div>
                  </div>
                  <div class="user-actions">
                    <button @click="editUser(user)" class="action-btn" title="Edit">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button @click="deleteUser(user.id)" class="action-btn danger" title="Delete">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Game History Management -->
        <section class="content-card">
          <div class="card-header">
            <div class="header-title">
              <div class="header-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <h2>Game History</h2>
                <p>Record match results with positions</p>
              </div>
            </div>
          </div>

          <div class="card-body">
            <!-- Add Match Form -->
            <div class="form-section">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Match Date</label>
                  <input v-model="matchDate" type="date" class="input"/>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Description (Optional)</label>
                <input
                    v-model="matchDescription"
                    type="text"
                    class="input"
                    placeholder="Enter match description..."
                />
              </div>

              <div class="form-group">
                <label class="form-label">Match Results</label>
                <div class="match-players-list">
                  <div v-for="(player, index) in matchPlayers" :key="index" class="match-player-row">
                    <select v-model="player.name" class="input player-select">
                      <option value="">Select player</option>
                      <option v-for="user in users" :key="user.id" :value="user.name">{{ user.name }}</option>
                    </select>
                    <select v-model.number="player.position" class="input position-select">
                      <option value="">Pos</option>
                      <option v-for="pos in 8" :key="pos" :value="pos">{{ pos }}</option>
                    </select>
                    <button
                        v-if="matchPlayers.length > 1"
                        @click="removeMatchPlayer(index)"
                        class="action-btn danger"
                        type="button"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="button-row">
                  <button @click="addMatchPlayer" class="btn btn-secondary btn-compact" type="button">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add Player
                  </button>
                  <button @click="createMatch" class="btn btn-success btn-compact" :disabled="!canCreateMatch">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Record Match
                  </button>
                </div>
              </div>

              <!-- Recent Matches List -->
              <div class="list-container">
                <div v-if="gameHistory.length === 0" class="empty-state">
                  <div class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <h3>No matches recorded</h3>
                  <p>Add your first match result above</p>
                </div>

                <div v-else class="matches-list">
                  <div
                      v-for="(dateEntry) in gameHistory"
                      :key="dateEntry.date"
                      class="date-group"
                  >
                    <div class="date-header">{{ dateEntry.date }}</div>
                    <div
                        v-for="match in dateEntry.histories"
                        :key="match.matchId"
                        class="match-item"
                    >
                      <div class="match-header">
                        <div class="match-title">
                          <span class="match-id">Match #{{ match.matchId }}</span>
                          <span v-if="match.description" class="match-description">{{ match.description }}</span>
                        </div>
                        <button @click="deleteMatch(dateEntry.date, match.matchId)" class="action-btn danger"
                                title="Delete Match">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                      <div class="match-players">
                        <div v-for="player in match.players" :key="player.name" class="match-player">
                          <span class="player-position">#{{ player.position }}</span>
                          <span class="player-name">{{ player.name }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>

    <!-- Edit User Modal -->
    <div v-if="editingUser" class="modal-overlay" @click="closeEditModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Edit Player</h2>
          <button @click="closeEditModal" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Name</label>
            <input v-model="editingUser.name" class="input"/>
          </div>

          <div class="form-row two-col">
            <div class="form-group">
              <label class="form-label">Score</label>
              <input v-model.number="editingUser.score" type="number" class="input"/>
            </div>
          </div>

          <div class="calculated-stats-note">
            <div class="stats-preview">
              <div class="stat-item">
                <span class="stat-label-note">Wins (Auto-calculated)</span>
                <span class="stat-value-note win">{{ editingUser?.wins || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label-note">Losses (Auto-calculated)</span>
                <span class="stat-value-note loss">{{ editingUser?.losses || 0 }}</span>
              </div>
            </div>
            <p class="stats-info">Wins and losses are automatically calculated from game history. Positions 1-3 = Win,
              Positions 4-8 = Loss.</p>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeEditModal" class="btn btn-secondary">Cancel</button>
          <button @click="saveUserEdit" class="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="showToast" class="toast" :class="toastType">
        <div class="toast-icon">
          <svg v-if="toastType === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {gameHistoryApi, playersApi} from '../lib/api.js';
import {logout} from '../composables/useAuth.js';

const router = useRouter();

const isDarkMode = ref(false);
const users = ref([]);
const newUserName = ref('');
const editingUser = ref(null);
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

// Game History management
const gameHistory = ref([]);
const matchDate = ref(new Date().toISOString().split('T')[0]);
const matchDescription = ref('');
const matchPlayers = ref([{name: '', position: ''}]);

const canCreateMatch = computed(() => {
  return matchDate.value &&
      matchPlayers.value.some(p => p.name && p.position);
});

const avatarColors = [
  'linear-gradient(135deg, #6366f1, #4f46e5)',
  'linear-gradient(135deg, #ec4899, #db2777)',
  'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  'linear-gradient(135deg, #06b6d4, #0891b2)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f43f5e, #e11d48)',
  'linear-gradient(135deg, #84cc16, #65a30d)',
];

const getAvatarColor = (name) => {
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
};

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const loadUsers = async () => {
  try {
    const data = await playersApi.getAll();
    users.value = data;
  } catch (error) {
    console.error('Error loading users:', error);
    showToastMessage('Failed to load users', 'error');
  }
};

const addUser = async () => {
  if (!newUserName.value.trim()) {
    showToastMessage('Please enter a user name', 'error');
    return;
  }

  try {
    const data = await playersApi.create(newUserName.value.trim());
    users.value.push(data);
    newUserName.value = '';
    showToastMessage('User added successfully!');
  } catch (error) {
    if (error.message?.includes('already exists')) {
      showToastMessage('User already exists', 'error');
    } else {
      console.error('Error adding user:', error);
      showToastMessage('Failed to add user', 'error');
    }
  }
};

const deleteUser = async (id) => {
  if (!confirm('Are you sure you want to delete this user?')) {
    return;
  }

  try {
    await playersApi.delete(id);
    users.value = users.value.filter(u => u.id !== id);
    showToastMessage('User deleted successfully!');
  } catch (error) {
    console.error('Error deleting user:', error);
    showToastMessage('Failed to delete user', 'error');
  }
};

const editUser = (user) => {
  editingUser.value = {...user};
};

const closeEditModal = () => {
  editingUser.value = null;
};

const saveUserEdit = async () => {
  try {
    // Only send editable fields (name and score)
    const updateData = {
      name: editingUser.value.name,
      score: editingUser.value.score
    };
    await playersApi.update(editingUser.value.id, updateData);
    const index = users.value.findIndex(u => u.id === editingUser.value.id);
    if (index !== -1) {
      users.value[index] = {...editingUser.value};
    }
    closeEditModal();
    showToastMessage('User updated successfully!');
  } catch (error) {
    console.error('Error updating user:', error);
    showToastMessage('Failed to update user', 'error');
  }
};

const handleLogout = async () => {
  const result = await logout();
  if (result.success) {
    router.push('/');
  }
};

// Game History methods
const loadGameHistory = async () => {
  try {
    gameHistory.value = await gameHistoryApi.getAll();
  } catch (error) {
    console.error('Error loading game history:', error);
  }
};

const addMatchPlayer = () => {
  matchPlayers.value.push({name: '', position: ''});
};

const removeMatchPlayer = (index) => {
  if (matchPlayers.value.length > 1) {
    matchPlayers.value.splice(index, 1);
  }
};

const createMatch = async () => {
  if (!matchDate.value) {
    showToastMessage('Please select a date', 'error');
    return;
  }

  const validPlayers = matchPlayers.value.filter(p => p.name && p.position);
  if (validPlayers.length === 0) {
    showToastMessage('Please add at least one player with position', 'error');
    return;
  }

  try {
    await gameHistoryApi.create(matchDate.value, validPlayers, matchDescription.value || null);
    await loadGameHistory();
    await loadUsers(); // Reload users to get updated stats
    matchPlayers.value = [{name: '', position: ''}];
    matchDescription.value = '';
    showToastMessage('Match recorded successfully!');
  } catch (error) {
    console.error('Error creating match:', error);
    showToastMessage('Failed to record match', 'error');
  }
};

const deleteMatch = async (date, matchId) => {
  if (!confirm(`Are you sure you want to delete match #${matchId}?`)) {
    return;
  }

  try {
    await gameHistoryApi.deleteMatch(date, matchId);
    await loadGameHistory();
    await loadUsers(); // Reload users to get updated stats
    showToastMessage('Match deleted successfully!');
  } catch (error) {
    console.error('Error deleting match:', error);
    showToastMessage('Failed to delete match', 'error');
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  isDarkMode.value = savedTheme === 'dark' || (!savedTheme && systemDark);
  document.documentElement.classList.toggle('dark', isDarkMode.value);

  loadUsers();
  loadGameHistory();
});
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Background */
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

.nav-link:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.nav-link svg {
  width: 18px;
  height: 18px;
}

.logout-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.logout-btn:hover {
  background: var(--error-soft);
  color: var(--error);
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

/* Hero */
.hero {
  margin-bottom: 3rem;
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

.hero-tag.admin {
  background: rgba(139, 92, 246, 0.15);
  color: #8b5cf6;
}

:root.dark .hero-tag.admin {
  background: rgba(139, 92, 246, 0.25);
  color: #a78bfa;
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

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.content-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.card-header {
  padding: 1.75rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-icon.blue {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35);
}

.header-icon.purple {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.35);
}

.header-icon.orange {
  background: linear-gradient(135deg, #f97316, #ea580c);
  box-shadow: 0 8px 20px rgba(249, 115, 22, 0.35);
}

.header-icon svg {
  width: 24px;
  height: 24px;
}

.header-title h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.125rem 0;
}

.header-title p {
  font-size: 0.9375rem;
  color: var(--text-tertiary);
  margin: 0;
}

.card-body {
  padding: 1.5rem 2rem 2rem;
}

/* Form Styles */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.button-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-compact {
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  border-radius: 10px;
}

.form-row {
  display: grid;
  gap: 1rem;
}

.form-row.three-col {
  grid-template-columns: repeat(3, 1fr);
}

.form-row.two-col {
  grid-template-columns: repeat(2, 1fr);
}

.form-row.two-col .form-group:last-child:nth-child(odd) {
  grid-column: 1 / -1;
  max-width: 50%;
}

.input-group {
  display: flex;
  gap: 0.75rem;
}

.input-group .input {
  flex: 1;
}

/* Calculated Stats Note */
.calculated-stats-note {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 0.5rem;
}

.stats-preview {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.75rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label-note {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
}

.stat-value-note {
  font-size: 1.5rem;
  font-weight: 800;
}

.stat-value-note.win {
  color: var(--success);
}

.stat-value-note.loss {
  color: var(--error);
}

.stats-info {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  margin: 0;
  line-height: 1.5;
}

/* Lists */
.list-container {
  max-height: 400px;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  background: var(--bg-secondary);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.empty-icon svg {
  width: 32px;
  height: 32px;
  color: var(--text-muted);
}

.empty-state h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.empty-state p {
  font-size: 0.9375rem;
  color: var(--text-tertiary);
  margin: 0;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  animation: fadeInUp 0.5s var(--transition-spring) forwards;
  opacity: 0;
  transition: all var(--transition-fast);
}

.user-item:hover {
  background: var(--bg-elevated);
  border-color: var(--border-strong);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-info h4 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.375rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-stats {
  display: flex;
  gap: 0.5rem;
}

.stat-pill {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
}

.stat-pill.wins {
  background: var(--success-soft);
  color: var(--success);
}

.stat-pill.losses {
  background: var(--error-soft);
  color: var(--error);
}

.stat-pill.score {
  background: var(--info-soft);
  color: var(--info);
}

.user-actions {
  display: flex;
  gap: 0.25rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.action-btn.danger:hover {
  background: var(--error-soft);
  color: var(--error);
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

/* Match Management */
.match-players-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.match-player-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.player-select {
  flex: 1;
}

.position-select {
  width: 80px;
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.date-group {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.date-header {
  background: var(--bg-secondary);
  padding: 0.75rem 1rem;
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.match-item {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-elevated);
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.match-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.match-id {
  font-weight: 700;
  color: var(--primary-600);
  font-size: 0.9375rem;
}

.match-description {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-style: italic;
}

.match-players {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.match-player {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.8125rem;
}

.player-position {
  font-weight: 700;
  color: var(--primary-500);
}

.player-name {
  color: var(--text-primary);
  font-weight: 600;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  padding: 1.5rem;
}

.modal {
  background: var(--bg-elevated);
  border-radius: 24px;
  width: 100%;
  max-width: 480px;
  box-shadow: var(--shadow-xl);
  animation: modalIn 0.3s ease-out;
  border: 1px solid var(--border-color);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem 1.5rem;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.5rem;
  border-radius: 16px;
  font-weight: 600;
  box-shadow: var(--shadow-xl);
  z-index: 1001;
  animation: slideInRight 0.4s var(--transition-spring);
}

.toast.success {
  background: var(--success);
  color: white;
}

.toast.error {
  background: var(--error);
  color: white;
}

.toast-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-icon svg {
  width: 20px;
  height: 20px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

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

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
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

  .hero-title {
    font-size: 2.25rem;
  }

  .form-row.three-col,
  .form-row.two-col {
    grid-template-columns: 1fr;
  }

  .form-row.two-col .form-group:last-child:nth-child(odd) {
    max-width: 100%;
  }

  .stats-preview {
    flex-direction: column;
    gap: 1rem;
  }

  .input-group {
    flex-direction: column;
  }
}
</style>
