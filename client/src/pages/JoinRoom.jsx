"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"
import axios from "axios"
import { API_URL } from "../config"

function JoinRoom() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [favoriteTeam, setFavoriteTeam] = useState("")
  const [roomKey, setRoomKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // IPL teams data
  const iplTeams = [
    { id: "csk", name: "Chennai Super Kings" },
    { id: "mi", name: "Mumbai Indians" },
    { id: "rcb", name: "Royal Challengers Bangalore" },
    { id: "dc", name: "Delhi Capitals" },
    { id: "kkr", name: "Kolkata Knight Riders" },
    { id: "srh", name: "Sunrisers Hyderabad" },
    { id: "rr", name: "Rajasthan Royals" },
    { id: "pbks", name: "Punjab Kings" },
    { id: "gt", name: "Gujarat Titans" },
    { id: "lsg", name: "Lucknow Super Giants" },
  ]

  const handleJoinRoom = async (e) => {
    e.preventDefault()

    // Validate form
    if (!name || !favoriteTeam || !roomKey) {
      setError("Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      setError("")

      // Join room via API
      await axios.post(`${API_URL}/api/rooms/${roomKey}/join`, {
        name,
        favoriteTeam,
      })

      setLoading(false)
      navigate(`/dashboard/${roomKey}`)
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "Failed to join room. Please check the room key and try again.")
    }
  }

  return (
    <div className="container">
      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "2rem 0" }}>
        <Link to="/" className="flex items-center gap-2 mb-4 text-muted">
          <FaArrowLeft /> Back to Home
        </Link>

        <div className="card">
          <h1 className="text-2xl font-bold mb-4">Join a Betting Room</h1>
          <p className="text-muted mb-4">Enter the room key shared by your friend to join their betting room</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleJoinRoom}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="team">
                Favorite IPL Team
              </label>
              <select
                id="team"
                className="form-select"
                value={favoriteTeam}
                onChange={(e) => setFavoriteTeam(e.target.value)}
                required
              >
                <option value="">Select your favorite team</option>
                {iplTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="roomKey">
                Room Key
              </label>
              <input
                id="roomKey"
                type="text"
                className="form-input"
                value={roomKey}
                onChange={(e) => setRoomKey(e.target.value.toUpperCase())}
                placeholder="Enter room key (e.g., ABC123)"
                style={{ textTransform: "uppercase" }}
                required
              />
              <p className="mt-2 text-sm text-muted">The room key is case-insensitive</p>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Joining..." : "Join Room"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default JoinRoom

