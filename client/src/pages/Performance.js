import { useEffect, useState } from "react";
import "../styles/performance.css";

function Performance() {
  const [attempts, setAttempts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [displayedStats, setDisplayedStats] = useState({
    total: 0,
    avg: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/attempts")
      .then((res) => res.json())
      .then((data) => setAttempts(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredAttempts =
    filter === "all"
      ? attempts
      : attempts.filter((a) => a.type === filter);

  const totalAttempts = filteredAttempts.length;

  const averageScore =
    totalAttempts > 0
      ? (
          filteredAttempts.reduce((sum, a) => sum + a.score, 0) /
          totalAttempts
        ).toFixed(1)
      : 0;

  const bestScore =
    totalAttempts > 0
      ? Math.max(...filteredAttempts.map((a) => a.score))
      : 0;

  // Animated stats
  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count >= totalAttempts) {
        clearInterval(interval);
      }
      setDisplayedStats({
        total: Math.min(count, totalAttempts),
        avg: averageScore,
      });
    }, 50);

    return () => clearInterval(interval);
  }, [totalAttempts, averageScore]);

  const getScoreColor = (score) => {
    if (score >= 8) return "green";
    if (score >= 5) return "orange";
    return "red";
  };

  return (
    <div className="performance-page">
      <h2>My Interview Performance 📊</h2>

      {/* FILTER */}
      <div className="filter-buttons">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "hr" ? "active" : ""}
          onClick={() => setFilter("hr")}
        >
          HR
        </button>
        <button
          className={filter === "tech" ? "active" : ""}
          onClick={() => setFilter("tech")}
        >
          Technical
        </button>
      </div>

      {/* STATS */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>{displayedStats.total}</h3>
          <p>Total Attempts</p>
        </div>

        <div className="stat-card">
          <h3>{displayedStats.avg}</h3>
          <p>Average Score</p>
        </div>

        <div className="stat-card best">
          <h3>{bestScore}</h3>
          <p>Best Score 🏆</p>
        </div>
      </div>

      {/* TABLE */}
      {totalAttempts === 0 ? (
        <p className="empty-state">No attempts found.</p>
      ) : (
        <div className="table-container fade-in">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Question</th>
                <th>Score</th>
                <th>Progress</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttempts.map((a, i) => (
                <tr key={a._id}>
                  <td>{i + 1}</td>
                  <td>{a.type || "General"}</td>
                  <td>{a.question}</td>

                  <td className={getScoreColor(a.score)}>
                    {a.score}/10
                  </td>

                  <td>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${getScoreColor(a.score)}`}
                        style={{ width: `${a.score * 10}%` }}
                      ></div>
                    </div>
                  </td>

                  <td>
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Performance;
