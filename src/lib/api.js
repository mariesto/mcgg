import { supabase } from '../lib/supabase.js'

// Players API
export const playersApi = {
  // Get all players
  async getAll() {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  // Create new player
  async create(name) {
    const { data, error } = await supabase
      .from('players')
      .insert([{ name }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update player
  async update(id, updates) {
    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete player
  async delete(id) {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

// Game History API
export const gameHistoryApi = {
  // Get game history (optionally filtered by date)
  async getAll(dateFilter = null) {
    let query = supabase
      .from('game_histories')
      .select(`
        id,
        position,
        date,
        created_at,
        description,
        players:player_id (id, name)
      `)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (dateFilter) {
      query = query.eq('date', dateFilter)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    // Transform data to match expected format
    const groupedByDate = {}
    
    data.forEach(record => {
      if (!groupedByDate[record.date]) {
        groupedByDate[record.date] = {
          date: record.date,
          histories: []
        }
      }
      
      // Group by match (using a simple heuristic: entries with same created_at timestamp)
      const existingMatch = groupedByDate[record.date].histories.find(
        h => Math.abs(new Date(h.created_at) - new Date(record.created_at)) < 1000
      )
      
      if (existingMatch) {
        existingMatch.players.push({
          name: record.players.name,
          position: record.position
        })
      } else {
        groupedByDate[record.date].histories.push({
          matchId: groupedByDate[record.date].histories.length + 1,
          created_at: record.created_at,
          description: record.description,
          players: [{
            name: record.players.name,
            position: record.position
          }]
        })
      }
    })
    
    return Object.values(groupedByDate)
  },

  // Create new match
  async create(date, players, description = null) {
    // Get player IDs first
    const { data: playersData } = await supabase
      .from('players')
      .select('id, name')
      .in('name', players.map(p => p.name))
    
    const playerMap = {}
    playersData.forEach(p => {
      playerMap[p.name] = p.id
    })
    
    // Insert records for each player
    const inserts = players.map(p => ({
      player_id: playerMap[p.name],
      position: p.position,
      date,
      description
    }))
    
    const { data, error } = await supabase
      .from('game_histories')
      .insert(inserts)
      .select()
    
    if (error) throw error
    return data
  },

  // Delete match (delete all records for a specific date and approximate time)
  async deleteMatch(date, matchIndex) {
    // This is simplified - in reality you'd need a match_id column
    // For now, we'll delete by date and player positions
    const { error } = await supabase
      .from('game_histories')
      .delete()
      .eq('date', date)
    
    if (error) throw error
    return true
  },

  // Get all unique dates
  async getDates() {
    const { data, error } = await supabase
      .from('game_histories')
      .select('date')
      .order('date', { ascending: false })
    
    if (error) throw error
    
    // Return unique dates
    return [...new Set(data.map(d => d.date))]
  }
}

// Statistics API
export const statisticsApi = {
  // Get statistics calculated from game history
  async getAll() {
    // Get all players
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('id, name, total_win, total_lose')
    
    if (playersError) throw playersError
    
    // Calculate stats from game history
    const { data: gameHistory, error: historyError } = await supabase
      .from('game_histories')
      .select('player_id, position')
    
    if (historyError) throw historyError
    
    const stats = {}
    
    // Initialize all players
    players.forEach(player => {
      stats[player.id] = {
        id: player.id,
        name: player.name,
        wins: 0,
        losses: 0
      }
    })
    
    // Calculate from game history
    gameHistory.forEach(record => {
      if (stats[record.player_id]) {
        if (record.position >= 1 && record.position <= 3) {
          stats[record.player_id].wins++
        } else if (record.position >= 4 && record.position <= 8) {
          stats[record.player_id].losses++
        }
      }
    })
    
    // Find most wins (for "Top Performer" card)
    let mostWinsUser = null
    let maxWins = -1
    
    Object.values(stats).forEach(user => {
      if (user.wins > maxWins) {
        maxWins = user.wins
        mostWinsUser = user
      }
    })
    
    // Find "Needs Practice" - player(s) with most matches AND most losses (ranking 4-8)
    // Filter players with losses (played at least one match with ranking 4-8)
    const losersWithMatches = Object.values(stats).filter(user => user.losses > 0)

    let needsPracticeUsers = []
    if (losersWithMatches.length > 0) {
      // Calculate total matches for each player
      losersWithMatches.forEach(user => {
        user.totalMatches = user.wins + user.losses
      })

      // Find max total matches among losers
      const maxMatches = Math.max(...losersWithMatches.map(u => u.totalMatches))

      // Filter to those with max matches
      const withMostMatches = losersWithMatches.filter(u => u.totalMatches === maxMatches)

      // Among those, find max losses
      const maxLossesAmongTop = Math.max(...withMostMatches.map(u => u.losses))

      // Get all players tied for most losses
      needsPracticeUsers = withMostMatches.filter(u => u.losses === maxLossesAmongTop)
    }

    // Find "Rival Alert" - two players who faced each other most often
    // Group game history by date/time to identify matches
    const { data: allGameHistory, error: allHistoryError } = await supabase
      .from('game_histories')
      .select('player_id, position, date, created_at')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (allHistoryError) throw allHistoryError

    // Group records into matches (same date and within 1 second of created_at)
    const matches = []
    const groupedByTime = {}

    allGameHistory.forEach(record => {
      const timeKey = `${record.date}_${Math.floor(new Date(record.created_at).getTime() / 1000)}`
      if (!groupedByTime[timeKey]) {
        groupedByTime[timeKey] = []
      }
      groupedByTime[timeKey].push(record)
    })

    Object.values(groupedByTime).forEach(matchPlayers => {
      if (matchPlayers.length >= 2) {
        matches.push(matchPlayers.map(p => p.player_id))
      }
    })

    // Count how many times each pair faced each other
    const rivalPairs = {}
    matches.forEach(match => {
      // Get all pairs in this match
      for (let i = 0; i < match.length; i++) {
        for (let j = i + 1; j < match.length; j++) {
          const pair = [match[i], match[j]].sort().join('_')
          if (!rivalPairs[pair]) {
            rivalPairs[pair] = { count: 0, players: [match[i], match[j]] }
          }
          rivalPairs[pair].count++
        }
      }
    })

    // Find top rival pair
    let topRivalPair = null
    let maxRivalMatches = 0
    Object.values(rivalPairs).forEach(pair => {
      if (pair.count > maxRivalMatches) {
        maxRivalMatches = pair.count
        topRivalPair = pair
      }
    })

    let rivalAlert = null
    if (topRivalPair && maxRivalMatches >= 2) {
      const player1 = players.find(p => p.id === topRivalPair.players[0])
      const player2 = players.find(p => p.id === topRivalPair.players[1])
      if (player1 && player2) {
        rivalAlert = {
          player1: player1.name,
          player2: player2.name,
          matches: maxRivalMatches
        }
      }
    }

    // ========== THE 5 STORY CARDS ==========
    
    // Build player positions map for story cards
    const playerPositions = {}
    allGameHistory.forEach(record => {
      if (!playerPositions[record.player_id]) {
        playerPositions[record.player_id] = []
      }
      playerPositions[record.player_id].push(record.position)
    })

    // 1. THE UNDERDOG THAT NEVER WINS
    // Most bottom-half finishes (positions 5-8), zero comeback wins
    let underdog = null
    let maxBottomFinishes = 0

    Object.entries(playerPositions).forEach(([playerId, positions]) => {
      if (positions.length >= 3) {
        const bottomFinishes = positions.filter(pos => pos >= 5 && pos <= 8).length
        const comebackWins = positions.filter((pos, idx) => {
          // Check if they went from bottom 3 to top 3 in consecutive matches
          if (idx > 0) {
            return positions[idx - 1] >= 6 && pos <= 3
          }
          return false
        }).length

        // Must have bottom finishes AND no comeback wins
        if (bottomFinishes > maxBottomFinishes && comebackWins === 0) {
          maxBottomFinishes = bottomFinishes
          const player = players.find(p => p.id === parseInt(playerId))
          if (player) {
            underdog = {
              name: player.name,
              bottomFinishes: bottomFinishes,
              totalGames: positions.length,
              tagline: "Always the underdog, never the surprise"
            }
          }
        }
      }
    })

    // 2. THE EXECUTIONER
    // Most wins where they beat at least one previous #1 finisher
    // Track who finished #1 in each match
    const matchResults = []
    Object.values(groupedByTime).forEach(matchPlayers => {
      if (matchPlayers.length >= 2) {
        const winner = matchPlayers.find(p => p.position === 1)
        if (winner) {
          matchResults.push({
            date: matchPlayers[0].date,
            winnerId: winner.player_id,
            allPlayers: matchPlayers.map(p => p.player_id)
          })
        }
      }
    })

    // Track #1 finishers (players who have won at least once)
    const champions = new Set(matchResults.map(m => m.winnerId))

    // Count champion kills per player
    const championKills = {}
    matchResults.forEach(match => {
      const winnerId = match.winnerId
      // Check if winner beat any previous champion
      const defeatedChampions = match.allPlayers.filter(pid => {
        return pid !== winnerId && champions.has(pid)
      }).length

      if (defeatedChampions > 0) {
        championKills[winnerId] = (championKills[winnerId] || 0) + 1
      }
    })

    // Find executioner (most champion kills)
    let executioner = null
    let maxChampionKills = 0
    Object.entries(championKills).forEach(([playerId, kills]) => {
      if (kills > maxChampionKills) {
        maxChampionKills = kills
        const player = players.find(p => p.id === parseInt(playerId))
        if (player) {
          executioner = {
            name: player.name,
            championKills: kills,
            tagline: "Kings fall when they step into the arena"
          }
        }
      }
    })

    // 3. THE GATEKEEPER
    // Most 4th place finishes (so close to glory)
    let gatekeeper = null
    let maxFourthPlaces = 0

    Object.entries(playerPositions).forEach(([playerId, positions]) => {
      const fourthPlaces = positions.filter(pos => pos === 4).length
      if (fourthPlaces > maxFourthPlaces && positions.length >= 3) {
        maxFourthPlaces = fourthPlaces
        const player = players.find(p => p.id === parseInt(playerId))
        if (player) {
          gatekeeper = {
            name: player.name,
            fourthPlaces: fourthPlaces,
            totalGames: positions.length,
            tagline: "So close to glory, yet forever distant"
          }
        }
      }
    })

    // 4. THE PHOENIX
    // Most wins after finishing bottom 3 (positions 6-8) in previous match
    let phoenix = null
    let maxPhoenixWins = 0

    Object.entries(playerPositions).forEach(([playerId, positions]) => {
      const playerMatches = allGameHistory
        .filter(r => r.player_id === parseInt(playerId))
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      
      let phoenixWins = 0
      for (let i = 1; i < playerMatches.length; i++) {
        const prevMatch = playerMatches[i - 1]
        const currentMatch = playerMatches[i]
        // Previous was bottom 3 (6-8), current is win (1-3)
        if (prevMatch.position >= 6 && currentMatch.position <= 3) {
          phoenixWins++
        }
      }

      if (phoenixWins > maxPhoenixWins && playerMatches.length >= 3) {
        maxPhoenixWins = phoenixWins
        const player = players.find(p => p.id === parseInt(playerId))
        if (player) {
          phoenix = {
            name: player.name,
            phoenixWins: phoenixWins,
            tagline: "From the ashes of defeat, they rise again"
          }
        }
      }
    })

    // 5. RIVAL ALERT (already calculated above)
    // Add tagline
    if (rivalAlert) {
      rivalAlert.tagline = "When titans collide, everyone watches"
    }

    return {
      totalUsers: players.length,
      users: Object.values(stats),
      // The 5 Story Cards
      underdog: underdog,
      rivalAlert: rivalAlert,
      executioner: executioner,
      gatekeeper: gatekeeper,
      phoenix: phoenix
    }
  }
}
