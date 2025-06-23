import React, { useState } from 'react';


const QuestionAdd = () => {
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState([
    { text: '', is_correct: false },
    { text: '', is_correct: false },
    { text: '', is_correct: false },
    { text: '', is_correct: false }
  ]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleAnswerChange = (index, text) => {
    const updated = [...answers];
    updated[index].text = text;
    setAnswers(updated);
  };

  const handleCorrectChange = (index) => {
    const updated = answers.map((a, i) => ({
      ...a,
      is_correct: i === index
    }));
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    const correctCount = answers.filter(a => a.is_correct).length;

    if (!questionText.trim() || correctCount !== 1 || answers.some(a => !a.text.trim())) {
      setError("Please fill out all fields and select exactly one correct answer.");
      return;
    }

    const payload = {
      text: questionText,
      answers
    };
    const API_BASE = process.env.REACT_APP_API_BASE ?? 'http://localhost:3000';
    try {
      const response = await fetch(`${API_BASE}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit question.');
      }

      const result = await response.json();
      setSuccess('Question submitted successfully!');
      setQuestionText('');
      setAnswers([
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false }
      ]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="question-form-container">
      <h2>Create a Question</h2>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="question-form">
        <label>
          Question Text:
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your question"
            required
          />
        </label>

        <div className="answers-section">
          {answers.map((answer, index) => (
            <div key={index} className="answer-input">
              <input
                type="text"
                value={answer.text}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder={`Answer ${index + 1}`}
                required
              />
              <label className="radio-label">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={answer.is_correct}
                  onChange={() => handleCorrectChange(index)}
                />
                Correct
              </label>
            </div>
          ))}
        </div>

        <button type="submit">Submit Question</button>
      </form>
    </div>
  );
};

export default QuestionAdd;
