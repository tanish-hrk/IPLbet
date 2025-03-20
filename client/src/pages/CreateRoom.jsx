"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaCopy } from "react-icons/fa"
import axios from "axios"
import { API_URL } from "../config"

function CreateRoom() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [favoriteTeam, setFavoriteTeam] = useState("")
  const [betAmount, setBetAmount] = useState("")
  const [participants, setParticipants] = useState("")
  const [roomKey, setRoomKey] = useState("")
  const [isCreated, setIsCreated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)

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

  const handleCreateRoom = async (e) => {
    e.preventDefault()

    // Validate form
    if (!name || !favoriteTeam || !betAmount || !participants) {
      setError("Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      setError("")

      // Create room via API
      const response = await axios.post(`${API_URL}/api/rooms`, {
        hostName: name,
        favoriteTeam,
        betAmount: Number.parseFloat(betAmount),
        maxParticipants: Number.parseInt(participants),
      })

      setRoomKey(response.data.roomKey)
      setIsCreated(true)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "Failed to create room. Please try again.")
    }
  }

  const copyRoomKey = () => {
    navigator.clipboard.writeText(roomKey)
    setCopySuccess(true)

    // Reset the "Copied" message after 2 seconds
    setTimeout(() => {
      setCopySuccess(false)
    }, 2000)
  }

  const goToDashboard = () => {
    navigate(`/dashboard/${roomKey}`)
  }

  return (
    <div className="container">
      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "2rem 0" }}>
        <Link to="/" className="flex items-center gap-2 mb-4 text-muted">
          <FaArrowLeft /> Back to Home
        </Link>

        <div className="card">
          <h1 className="text-2xl font-bold mb-4">Create a Betting Room</h1>
          <p className="text-muted mb-4">Set up a new room and invite your friends to join</p>

          {error && <div className="alert alert-error">{error}</div>}

          {!isCreated ? (
            <form onSubmit={handleCreateRoom}>
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
                <label className="form-label" htmlFor="betAmount">
                  Bet Amount (₹ per match)
                </label>
                <input
                  id="betAmount"
                  type="number"
                  className="form-input"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="Enter amount in ₹"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="participants">
                  Number of Participants
                </label>
                <input
                  id="participants"
                  type="number"
                  className="form-input"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="Enter number of participants"
                  min="2"
                  max="10"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? "Creating..." : "Create Room"}
              </button>
            </form>
          ) : (
            <div>
              <div className="card" style={{ backgroundColor: "#f8fafc" }}>
                <p className="mb-2 font-bold">Your Room Key:</p>
                <div className="flex items-center justify-between p-3 bg-white border rounded">
                  <code className="text-lg font-bold">{roomKey}</code>
                  <button onClick={copyRoomKey} className="btn btn-secondary" style={{ padding: "0.5rem" }}>
                    {copySuccess ? "Copied!" : <FaCopy />}
                  </button>
                </div>
                <p className="mt-2 text-sm text-muted">Share this key with your friends so they can join your room</p>
              </div>

              <div className="card mt-4" style={{ backgroundColor: "#f8fafc" }}>
                <p className="mb-2 font-bold">Room Details:</p>
                <ul className="text-sm">
                  <li className="mb-2">
                    <span className="font-bold">Host:</span> {name}
                  </li>
                  <li className="mb-2">
                    <span className="font-bold">Favorite Team:</span>{" "}
                    {iplTeams.find((team) => team.id === favoriteTeam)?.name}
                  </li>
                  <li className="mb-2">
                    <span className="font-bold">Bet Amount:</span> ₹{betAmount} per match
                  </li>
                  <li>
                    <span className="font-bold">Participants:</span> {participants}
                  </li>
                </ul>
              </div>

              <button onClick={goToDashboard} className="btn btn-primary btn-block mt-4">
                Go to Room Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateRoom

