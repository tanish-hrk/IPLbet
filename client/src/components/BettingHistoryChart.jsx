"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

function BettingHistoryChart({ members }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!members || members.length === 0) return

    // Generate mock historical data for the chart
    const generateMockData = () => {
      const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"]
      const datasets = members.map((member, index) => {
        // Generate random balance changes for demo purposes
        const data = days.map((_, i) => {
          const baseValue = 500
          const randomChange = Math.floor(Math.random() * 200) - 100
          return baseValue + randomChange * (i + 1)
        })

        // Generate a unique color for each member
        const colors = [
          "rgba(37, 99, 235, 0.7)",
          "rgba(220, 38, 38, 0.7)",
          "rgba(22, 163, 74, 0.7)",
          "rgba(147, 51, 234, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(8, 145, 178, 0.7)",
        ]

        return {
          label: member.name,
          data: data,
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length].replace("0.7", "0.1"),
          tension: 0.3,
        }
      })

      return { labels: days, datasets }
    }

    const data = generateMockData()

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d")
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: "Balance (₹)",
            },
          },
        },
      },
    })

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [members])

  return (
    <div style={{ height: "300px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

export default BettingHistoryChart

