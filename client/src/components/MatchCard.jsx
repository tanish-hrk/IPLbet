"use client"

import { useState } from "react"
import { FaCalendarAlt, FaMapMarkerAlt, FaExclamationTriangle, FaRobot } from "react-icons/fa"
import axios from "axios"
import { API_URL } from "../config"

function MatchCard({ match, room, currentUser }) {
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [hasBet, setHasBet] = useState(!!match.bets?.find((bet) => bet.userId === currentUser?._id))
  const [loading, setLoading] = useState(false)
  const [aiPrediction, setAiPrediction] = useState(null)
  const [showAiPrediction, setShowAiPrediction] = useState(false)

  const team1 = room.teams.find((team) => team.id === match.team1)
  const team2 = room.teams.find((team) => team.id === match.team2)

  const matchDate = new Date(match.date)
  const formattedDate = matchDate.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
  const formattedTime = matchDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

  const isMatchStarted = new Date() > matchDate
  const isUsersFavoriteTeamPlaying =
    currentUser?.favoriteTeam === match.team1 || currentUser?.favoriteTeam === match.team2
  const isUsersTurnToBet = room.currentBettor === currentUser?._id

  const placeBet = async (teamId) => {
    try {
      setLoading(true)

      await axios.post(`${API_URL}/api/bets`, {
        roomId: room._id,
        matchId: match._id,
        userId: currentUser._id,
        teamId: teamId,
      })

      setSelectedTeam(teamId)
      setHasBet(true)
      setLoading(false)
    } catch (err) {
      console.error("Error placing bet:", err)
      setLoading(false)
    }
  }

  const getAiPrediction = async () => {
    try {
      setLoading(true)

      const response = await axios.get(`${API_URL}/api/prediction`, {
        params: {
          matchId: match._id,
          team1: match.team1,
          team2: match.team2,
          venue: match.venue,
        },
      })

      setAiPrediction(response.data)
      setShowAiPrediction(true)
      setLoading(false)
    } catch (err) {
      console.error("Error getting AI prediction:", err)
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">
          {team1?.shortName} vs {team2?.shortName}
        </h3>
        {isUsersFavoriteTeamPlaying && <div className="badge badge-accent">Your Team</div>}
      </div>

      <div className="text-sm text-muted mb-2 flex items-center gap-1">
        <FaCalendarAlt /> {formattedDate} at {formattedTime}
      </div>

      <div className="text-sm text-muted mb-4 flex items-center gap-1">
        <FaMapMarkerAlt /> {match.venue}
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-800 mx-auto mb-2">
            {team1?.shortName}
          </div>
          <div className="text-sm font-bold">{match.prediction?.team1 || 50}%</div>
        </div>

        <div className="text-center">
          <div className="text-sm font-bold text-muted">VS</div>
          <div className="text-xs text-muted mt-1">Prediction</div>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-800 mx-auto mb-2">
            {team2?.shortName}
          </div>
          <div className="text-sm font-bold">{match.prediction?.team2 || 50}%</div>
        </div>
      </div>

      {showAiPrediction && aiPrediction && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <FaRobot /> AI Prediction
          </h4>
          <p className="text-sm">{aiPrediction.message}</p>
          <div className="flex justify-between mt-2">
            <div className="text-sm">
              <span className="font-bold">{team1?.shortName}:</span> {aiPrediction.team1Probability}%
            </div>
            <div className="text-sm">
              <span className="font-bold">{team2?.shortName}:</span> {aiPrediction.team2Probability}%
            </div>
          </div>
          <div className="text-xs text-muted mt-1">
            Factors: Pitch conditions, team form, head-to-head record, weather
          </div>
        </div>
      )}

      {isUsersFavoriteTeamPlaying && isUsersTurnToBet && !hasBet && !isMatchStarted && (
        <div className="p-3 bg-amber-50 rounded-md mb-4 flex items-center gap-2">
          <FaExclamationTriangle className="text-amber-500" />
          <span className="text-sm">It's your turn to bet on this match!</span>
        </div>
      )}

      <div className="flex gap-2">
        {!hasBet && !isMatchStarted ? (
          <>
            {!showAiPrediction && (
              <button className="btn btn-secondary flex-1" onClick={getAiPrediction} disabled={loading}>
                <FaRobot className="mr-1" /> AI Prediction
              </button>
            )}

            <button
              className="btn btn-primary flex-1"
              style={{ backgroundColor: "#1e40af" }}
              onClick={() => placeBet(match.team1)}
              disabled={loading || !isUsersTurnToBet || !isUsersFavoriteTeamPlaying}
            >
              Bet on {team1?.shortName}
            </button>

            <button
              className="btn btn-primary flex-1"
              style={{ backgroundColor: "#dc2626" }}
              onClick={() => placeBet(match.team2)}
              disabled={loading || !isUsersTurnToBet || !isUsersFavoriteTeamPlaying}
            >
              Bet on {team2?.shortName}
            </button>
          </>
        ) : (
          <div className="w-full p-3 bg-green-50 text-center rounded-md text-green-800 font-bold">
            {hasBet
              ? `You bet on ${selectedTeam ? room.teams.find((t) => t.id === selectedTeam)?.name : "a team"}`
              : isMatchStarted
                ? "Match has started"
                : "Not your turn to bet"}
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchCard

