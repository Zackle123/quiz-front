import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE ?? 'http://localhost:3000';

export default function Quiz() {
  const [screen, setScreen] = useState('start'); // 'start' | 'quiz' | 'result'
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [name, setName] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  const startQuiz = async () => {
    try {
      const res = await axios.get(`${API_BASE}/questions`);
      setQuestions(res.data);
      setSelectedAnswers({});
      setScore(0);
      setCurrentIndex(0);
      setScreen('quiz');
    } catch (error) {
      alert('Failed to load questions.');
    }
  };

  const selectAnswer = (questionId, answerId) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const submitAnswers = async () => {
    const payload = {
      name: name || 'Anonymous',
      answers: Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
        questionId: parseInt(questionId),
        answerId
      }))
    };

    try {
      const res = await axios.post(`${API_BASE}/submit`, payload);
      setScore(res.data.score);
      fetchLeaderboard();
      setScreen('result');
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit answers.');
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(`${API_BASE}/leaderboard`);
      setLeaderboard(res.data);
    } catch {
      alert('Failed to load leaderboard');
    }
  };

  const restart = () => {
    setScreen('start');
    setQuestions([]);
    setSelectedAnswers({});
    setScore(0);
    setName('');
    setCurrentIndex(0);
  };

  const letters = ['A', 'B', 'C', 'D'];

  if (screen === 'start') {
    return (
      <div className="app-container">
        <div className="quiz-container">
          <h1>Welcome to the Quiz</h1>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="quiz-input"
              style={{ marginBottom: '1rem', padding: '0.5rem', fontSize: '1rem' }}
            />
            <button onClick={startQuiz} className="quiz-button">
              START
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'quiz') {
    const q = questions[currentIndex];

    return (
      <div className="app-container">
        <div className="quiz-container">
          <h2>Question {currentIndex + 1} of {questions.length}</h2>
          <div className="quiz-question">{q.text}</div>

          <div className="option-grid">
            {q.answers.map((a, index) => {
              const isSelected = selectedAnswers[q.id] === a.id;
              return (
                <button
                  key={a.id}
                  className={`option-button ${isSelected ? 'selected' : ''}`}
                  onClick={() => selectAnswer(q.id, a.id)}
                >
                  <span className="option-letter">{letters[index]}:</span>
                  {a.text}
                </button>
              );
            })}
          </div>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              disabled={!selectedAnswers[q.id]}
              className="quiz-button"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submitAnswers}
              disabled={Object.keys(selectedAnswers).length !== questions.length}
              className="quiz-button"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'result') {
        return (
          <div className="app-container">
            <div className="quiz-container">
              <h2>Your score: {score} / {questions.length}</h2>
              <h3>🏆 Leaderboard</h3>
              <table className="leaderboard-table" style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'black' }}>
                    <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Name</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Score</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.slice(0, Math.min(10, leaderboard.length)).map((entry, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>{entry.name}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>{entry.score}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                        {new Date(entry.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
      
              <button onClick={restart} className="quiz-button" style={{ marginTop: '1rem' }}>
                Restart Quiz
              </button>
            </div>
          </div>
        );
  }

  return null;
}
