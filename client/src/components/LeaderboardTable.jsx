function LeaderboardTable({ members }) {
  // Sort members by balance (highest first)
  const sortedMembers = [...members].sort((a, b) => b.balance - a.balance)

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Rank</th>
            <th className="text-left p-2">Member</th>
            <th className="text-left p-2">Favorite Team</th>
            <th className="text-right p-2">Balance</th>
          </tr>
        </thead>
        <tbody>
          {sortedMembers.map((member, index) => (
            <tr key={member._id} className="border-b">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{member.name}</td>
              <td className="p-2">
                <span className="badge badge-outline">{member.favoriteTeam}</span>
              </td>
              <td className={`p-2 text-right font-bold ${member.balance >= 0 ? "text-success" : "text-error"}`}>
                ₹{member.balance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LeaderboardTable

