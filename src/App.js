import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE ?? 'http://localhost:3000';

export default function App() {
  const [screen, setScreen] = useState('start'); // 'start' | 'quiz' | 'result'
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [name, setName] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

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
      setScreen('result');
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit answers.');
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

  if (screen === 'start') {
    return (
      <div style={{ padding: 20, maxWidth: 600, margin: 'auto', textAlign: 'center' }}>
        <h1>Welcome to the Quiz</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 10, fontSize: 18, marginBottom: 20 }}
        />
        <br />
        <button onClick={startQuiz} style={{ fontSize: 24, padding: '10px 30px' }}>
          START
        </button>
      </div>
    );
  }

  if (screen === 'quiz') {
    const q = questions[currentIndex];

    return (
      <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
        <h2>Question {currentIndex + 1} of {questions.length}</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <h3>{q.text}</h3>
          {q.answers.map(a => (
            <label key={a.id} style={{ display: 'block', marginBottom: 6, cursor: 'pointer' }}>
              <input
                type="radio"
                name={`question-${q.id}`}
                value={a.id}
                checked={selectedAnswers[q.id] === a.id}
                onChange={() => selectAnswer(q.id, a.id)}
                required
              />
              {' '}
              {a.text}
            </label>
          ))}

          <div style={{ marginTop: 20 }}>
            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => prev + 1)}
                disabled={!selectedAnswers[q.id]}
                style={{ padding: '10px 20px', fontSize: 18 }}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={submitAnswers}
                disabled={Object.keys(selectedAnswers).length !== questions.length}
                style={{ padding: '10px 20px', fontSize: 18 }}
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div style={{ padding: 20, maxWidth: 600, margin: 'auto', textAlign: 'center' }}>
        <h2>Your score: {score} / {questions.length}</h2>
        <button onClick={restart} style={{ fontSize: 20, padding: '10px 25px' }}>
          Restart Quiz
        </button>
      </div>
    );
  }

  return null;
}
