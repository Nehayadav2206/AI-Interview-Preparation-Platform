import "../styles/practice.css";
import { useEffect, useState, useCallback } from "react";

function Practice() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [type, setType] = useState("hr");

  // ---------- LOAD QUESTION ----------
  const loadQuestion = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/questions/question?type=${type}`
      );
      const data = await res.json();
      setQuestion(data.question);
      setAnswer("");
      setFeedback("");
    } catch (error) {
      console.error("Error loading question", error);
    }
  }, [type]);

  // ---------- EFFECT ----------
  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  // ---------- SUBMIT ANSWER ----------
  const submitAnswer = async () => {
    if (!answer.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question || "General Interview Question",
          answer: answer,
        }),
      });

      const data = await res.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error("Error submitting answer", error);
    }
  };

  return (
    <div className="practice">
      <h2>AI Interview Practice 🤖</h2>

      {/* Interview Type Toggle */}
      <div className="toggle">
        <button onClick={() => setType("hr")}>HR</button>
        <button onClick={() => setType("tech")}>Technical</button>
      </div>

      {/* Question */}
      <div className="question-box">
        <p>
          <b>Question:</b> {question}
        </p>
      </div>

      {/* Answer */}
      <textarea
        placeholder="Type your answer here..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <button onClick={submitAnswer}>Submit Answer</button>

      {/* Feedback */}
      {feedback && (
        <div className="question-box">
          <pre>{feedback}</pre>
        </div>
      )}

      {/* Next Question */}
      <button onClick={loadQuestion} className="next-btn">
        Next Question
      </button>
    </div>
  );
}

export default Practice;
