import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/attempts")
      .then(res => res.json())
      .then(data => {
        setAttempts(data.slice(0, 5)); // only latest 5
      });
  }, []);

  const getScoreColor = (score) => {
    if (score >= 8) return "green";
    if (score >= 6) return "orange";
    return "red";
  };

  return (
    <div className="dashboard">
      <h1>Hello Neha 🌸</h1>
      <p className="dash-sub">
        Let’s prepare you for your next interview 🚀
      </p>

      {/* ORIGINAL CARDS */}
      <div className="cards">
        <div className="card" onClick={() => navigate("/practice")}>
          HR Interview
        </div>

        <div className="card" onClick={() => navigate("/practice")}>
          Technical Interview
        </div>

        <div className="card" onClick={() => navigate("/practice")}>
          Mock Interview
        </div>

        <div className="card" onClick={() => navigate("/performance")}>
          Performance Dashboard 📊
        </div>
      </div>

      {/* NEW RECENT ACTIVITY SECTION */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>

        {attempts.length === 0 ? (
          <p className="no-data">
            No attempts yet. Start practicing!
          </p>
        ) : (
          attempts.map((a, index) => (
            <div key={index} className="recent-item">
              <div>
                <p className="recent-question">
                  {a.question || "General Question"}
                </p>
                <span className="recent-date">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>

              <span className={`recent-score ${getScoreColor(a.score)}`}>
                {a.score}/10
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
