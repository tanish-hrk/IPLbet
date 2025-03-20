import { Link } from "react-router-dom"
// import { GiCricketBat } from "react-icons/fa6"

function Home() {
  return (
    <div className="container">
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 0" }}>
        <div className="text-center mb-4">
          <div className="logo" style={{ justifyContent: "center", fontSize: "2rem", marginBottom: "1rem" }}>
            {/* <GiCricketBat className="logo-icon" /> */}
            <span>CricketBets</span>
          </div>
          <p className="mb-4">
            Create betting rooms with friends, bet on your favorite IPL teams, and track your winnings in real-time.
          </p>
        </div>

        <div className="grid grid-cols-2" style={{ marginBottom: "2rem" }}>
          <div className="card">
            <h2 className="text-xl font-bold mb-2">Create a Room</h2>
            <p className="text-sm text-muted mb-4">Set up a new betting room and invite your friends</p>
            <Link to="/create-room" className="btn btn-primary btn-block">
              Create Room
            </Link>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-2">Join a Room</h2>
            <p className="text-sm text-muted mb-4">Join an existing betting room with a room key</p>
            <Link to="/join-room" className="btn btn-secondary btn-block">
              Join Room
            </Link>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-center">How It Works</h2>
        <div className="grid grid-cols-3">
          <div className="card">
            <h3 className="text-lg font-bold mb-2">Create or Join</h3>
            <p className="text-sm text-muted">Create a room or join with a unique room key shared by friends.</p>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-2">Place Bets</h3>
            <p className="text-sm text-muted">Take turns placing bets on IPL matches with your favorite teams.</p>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-2">Track Winnings</h3>
            <p className="text-sm text-muted">View live leaderboards and track your betting performance.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

