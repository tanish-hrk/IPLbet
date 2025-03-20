"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
// import { FaCricket, FaHome, FaTrophy, FaUsers } from "react-icons/fa"
import axios from "axios"
import { API_URL } from "../config"
import MatchCard from "../components/MatchCard"
import LeaderboardTable from "../components/LeaderboardTable"
import BettingHistoryChart from "../components/BettingHistoryChart"

function Dashboard() {
  const { roomId } = useParams()
  const [activeTab, setActiveTab] = useState("matches")
  const [room, setRoom] = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true)

        // Fetch room data
        const roomResponse = await axios.get(`${API_URL}/api/rooms/${roomId}`)
        setRoom(roomResponse.data)

        // Get current user from local storage or session
        const userId = localStorage.getItem("userId")
        if (userId) {
          const currentMember = roomResponse.data.members.find((m) => m._id === userId)
          if (currentMember) {
            setCurrentUser(currentMember)
          }
        }

        // Fetch upcoming matches
        const matchesResponse = await axios.get(`${API_URL}/api/matches`)
        setMatches(matchesResponse.data)

        setLoading(false)
      } catch (err) {
        setLoading(false)
        setError("Failed to load room data. Please try again.")
        console.error(err)
      }
    }

    fetchRoomData()
  }, [roomId])

  if (loading) {
    return (
      <div className="container text-center" style={{ padding: "5rem 0" }}>
        <div className="spinner"></div>
        <p>Loading room data...</p>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="container text-center" style={{ padding: "5rem 0" }}>
        <div className="alert alert-error">{error || "Room not found"}</div>
        <Link to="/" className="btn btn-primary mt-4">
          Go Back Home
        </Link>
      </div>
    )
  }

  return (
    <div>
      <header className="header">
        <div className="logo">
          {/* <FaCricket className="logo-icon" /> */}
          <span>CricketBets</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="btn btn-secondary" style={{ padding: "0.5rem 1rem" }}>
            {/* <FaHome /> */}
          </Link>
          <div className="badge badge-outline">{currentUser?.name || "Guest"}</div>
        </div>
      </header>

      <div className="container">
        <div className="flex justify-between items-center mb-4" style={{ flexWrap: "wrap" }}>
          <div>
            <h1 className="text-2xl font-bold">Room Dashboard</h1>
            <p className="text-muted">
              Room Key:{" "}
              <span className="font-bold" style={{ fontFamily: "monospace" }}>
                {roomId}
              </span>
            </p>
          </div>
          <div className="flex gap-2 mt-2" style={{ flexWrap: "wrap" }}>
            <div className="badge badge-outline">Bet Amount: ₹{room.betAmount}</div>
            <div className="badge badge-outline">
              Participants: {room.members.length}/{room.maxParticipants}
            </div>
            <div className="badge badge-primary">
              Current Bettor:{" "}
              {room.currentBettor ? room.members.find((m) => m._id === room.currentBettor)?.name : "None"}
            </div>
          </div>
        </div>

        <div className="tabs">
          <div className={`tab ${activeTab === "matches" ? "active" : ""}`} onClick={() => setActiveTab("matches")}>
            Upcoming Matches
          </div>
          <div
            className={`tab ${activeTab === "leaderboard" ? "active" : ""}`}
            onClick={() => setActiveTab("leaderboard")}
          >
            Leaderboard
          </div>
          <div className={`tab ${activeTab === "members" ? "active" : ""}`} onClick={() => setActiveTab("members")}>
            Room Members
          </div>
        </div>

        <div className={`tab-content ${activeTab === "matches" ? "active" : ""}`}>
          <div className="grid grid-cols-2">
            {matches.map((match) => (
              <MatchCard key={match._id} match={match} room={room} currentUser={currentUser} />
            ))}
          </div>
        </div>

        <div className={`tab-content ${activeTab === "leaderboard" ? "active" : ""}`}>
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              {/* <FaTrophy /> */}
              Betting Performance
            </h2>
            <div className="mb-4">
              <BettingHistoryChart members={room.members} />
            </div>
            <LeaderboardTable members={room.members} />
          </div>
        </div>

        <div className={`tab-content ${activeTab === "members" ? "active" : ""}`}>
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              {/* <FaUsers /> */}
              Room Members
            </h2>
            <div className="space-y-4">
              {room.members.map((member) => {
                const team = room.teams.find((t) => t.id === member.favoriteTeam)
                return (
                  <div key={member._id} className="flex justify-between items-center p-4 border rounded">
                    <div>
                      <p className="font-bold">{member.name}</p>
                      <p className="text-sm text-muted">Favorite Team: {team?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">Balance</p>
                      <p className={member.balance >= 0 ? "text-success" : "text-error"}>₹{member.balance}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

