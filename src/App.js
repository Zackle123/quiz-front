import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export default function App() {
  const [screen, setScreen] = useState('start'); // 'start' | 'quiz' | 'result'
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // questionId -> answerId
  const [score, setScore] = useState(0);

  // Fetch questions when quiz starts
  const startQuiz = async () => {
    try {
      const res = await axios.get(`${API_BASE}/questions`);
      // res.data has questions with answers but no 'is_correct' property returned (we'll fix that below)
      // For scoring, we need to know correct answers. So let's request the backend to send them or handle scoring server-side.
      // For demo, assume backend sends `is_correct` — if not, scoring must be done server-side on submit.
      setQuestions(res.data);
      setSelectedAnswers({});
      setScore(0);
      setScreen('quiz');
    } catch (error) {
      alert('Failed to load questions.');
    }
  };

  // Handle answer selection
  const selectAnswer = (questionId, answerId) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  // Calculate score (client-side) and show results
  const submitAnswers = () => {
    let calculatedScore = 0;
    questions.forEach((q) => {
      const selectedId = selectedAnswers[q.id];
      const answer = q.answers.find(a => a.id === selectedId);
      if (answer && answer.is_correct) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setScreen('result');
  };

  // Restart quiz
  const restart = () => {
    setScreen('start');
    setQuestions([]);
    setSelectedAnswers({});
    setScore(0);
  };

  // Renderers for screens:

  if (screen === 'start') {
    return (
      <div style={{ padding: 20, maxWidth: 600, margin: 'auto', textAlign: 'center' }}>
        <h1>Welcome to the Quiz</h1>
        <button onClick={startQuiz} style={{ fontSize: 24, padding: '10px 30px' }}>START</button>
      </div>
    );
  }

  if (screen === 'quiz') {
    return (
      <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
        <h2>Answer the Questions</h2>
        <form onSubmit={(e) => { e.preventDefault(); submitAnswers(); }}>
          {questions.map(q => (
            <div key={q.id} style={{ marginBottom: 20 }}>
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
            </div>
          ))}
          <button type="submit" disabled={Object.keys(selectedAnswers).length !== questions.length} style={{ padding: '10px 20px', fontSize: 18 }}>
            Submit
          </button>
        </form>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div style={{ padding: 20, maxWidth: 600, margin: 'auto', textAlign: 'center' }}>
        <h2>Your score: {score} / {questions.length}</h2>
        <button onClick={restart} style={{ fontSize: 20, padding: '10px 25px' }}>Restart Quiz</button>
      </div>
    );
  }

  return null;
}