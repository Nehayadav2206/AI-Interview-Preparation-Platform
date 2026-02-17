import { useState } from "react";
import "../styles/resume.css";

function Resume() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState([]);

  const handleUpload = async () => {
    if (!file) return alert("Upload a PDF resume");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      // Resume + JD Analysis
      const res = await fetch("http://localhost:5000/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setResult({
        score: data.score,
        strengths: data.strengths,
        improvements: data.improvements,
        matchPercentage: data.matchPercentage,
        missingSkills: data.missingSkills,
      });

      // Generate Questions From Resume
      const qRes = await fetch(
        "http://localhost:5000/api/resume-questions/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText: data.resumeText }),
        }
      );

      const qData = await qRes.json();
      setQuestions(qData.questions);

    } catch (err) {
      alert("Resume analysis failed.");
    }
  };

  const atsPercentage = result ? result.score * 10 : 0;

  return (
    <div className="resume-page">
      <h2>Resume Analyzer 🚀</h2>

      {/* Upload Section */}
      <div
        className="upload-box"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setFile(e.dataTransfer.files[0]);
        }}
      >
        <p>{file ? file.name : "Drag & Drop Resume PDF Here"}</p>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <textarea
          placeholder="Paste Job Description here (optional for matching)"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="jd-box"
        />

        <button onClick={handleUpload}>Analyze Resume</button>
      </div>

      {result && (
        <div className="result-wrapper">

          {/* Score Circle */}
          <div className="circle-container">
            <div
              className="circle"
              style={{
                background: `conic-gradient(#6c63ff ${
                  atsPercentage * 3.6
                }deg, #eee 0deg)`,
              }}
            >
              <div className="inner-circle">
                <h1>{result.score}</h1>
                <span>/10</span>
              </div>
            </div>
            <p className="ats-text">
              ATS Compatibility: {atsPercentage}%
            </p>
          </div>

          {/* JD Match Section */}
          {jobDescription && (
            <div className="jd-match-section">
              <h3>Job Description Match</h3>
              <p className="match-percentage">
                Match: {result.matchPercentage}%
              </p>

              <div className="missing-skills">
                <h4>Missing Skills</h4>
                {result.missingSkills.length === 0 ? (
                  <p>Great! No major missing keywords 🎉</p>
                ) : (
                  <ul>
                    {result.missingSkills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Strengths */}
          <div className="card-section">
            <h3>Strengths</h3>
            <div className="card-grid">
              {result.strengths.map((item, i) => (
                <div key={i} className="strength-card">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div className="card-section">
            <h3>Areas of Improvement</h3>
            <div className="card-grid">
              {result.improvements.map((item, i) => (
                <div key={i} className="improvement-card">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Generated Questions */}
          {questions.length > 0 && (
            <div className="card-section">
              <h3>AI Interview Questions From Your Resume</h3>
              <div className="card-grid">
                {questions.map((q, i) => (
                  <div key={i} className="question-card">
                    {q}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default Resume;
