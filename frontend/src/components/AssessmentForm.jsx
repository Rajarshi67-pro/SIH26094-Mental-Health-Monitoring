import React, { useState } from 'react';
import { assessmentService } from '../services/assessment.service.js';

export default function AssessmentForm({ onAssessmentComplete }) {
  const [madrs, setMadrs] = useState({ 0: 0, 1: 0, 2: 0 });
  const [phq9, setPhq9] = useState({ 0: 0, 1: 0 });
  const [gad7, setGad7] = useState({ 0: 0 });
  const [narrative, setNarrative] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        touchpoint_type: 'web_portal',
        language: 'en',
        madrs: { answers: Object.values(madrs) },
        phq9: { answers: Object.values(phq9) },
        gad7: { answers: Object.values(gad7) },
        text_content: narrative,
        context_score: 50.0,
      };

      const result = await assessmentService.submitAssessment(payload);
      onAssessmentComplete(result);
    } catch (err) {
      alert(`Assessment submission failed: ${err.message || 'Server error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmergencyTrigger = () => {
    if (confirm('Initiate Crisis 108 Emergency Ambulance Protocol? This will immediately connect to emergency dispatch.')) {
      window.open('tel:108', '_self');
    }
  };

  return (
    <div>
      {/* Streamlined Minimal Hero */}
      <div className="hero-banner">
        <div className="hero-text">
          <h1>Clinical Distress Assessment</h1>
          <p>Multi-modal screening combining validated psychiatric metrics and NLP sentiment indicators.</p>
          <div className="hero-badges">
            <span className="hero-pill">📋 MADRS Scale</span>
            <span className="hero-pill">🧠 PHQ-9 Core</span>
            <span className="hero-pill">⚡ GAD-7 Anxiety</span>
            <span className="hero-pill">🤖 Emotion NLP</span>
          </div>
        </div>

        {/* Prominent Quick Triggers Button in Hero */}
        <button
          type="button"
          className="btn-trigger"
          onClick={handleEmergencyTrigger}
          title="Instant 108 Emergency Medical Assistance"
        >
          <span className="trigger-icon">🚨</span>
          <span>Emergency 108 Trigger</span>
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Main Assessment Form */}
        <div className="content-card">
          <div className="content-card-title">
            <span>📝 Clinical Screening Form</span>
          </div>
          <div className="content-card-subtitle">
            Select the options matching recent emotional and physical state.
          </div>

          <form onSubmit={handleSubmit}>
            {/* Section 1: MADRS */}
            <div className="form-section-group">
              <div className="form-section-title">
                <span>1. Depression Rating (MADRS)</span>
              </div>

              <div className="question-item">
                <div className="question-text">Apparent sadness and mood state:</div>
                <div className="options-group">
                  {[
                    { val: 0, label: '0 - None' },
                    { val: 2, label: '2 - Mild Sadness' },
                    { val: 4, label: '4 - Marked Despair' },
                    { val: 6, label: '6 - Extreme Despondency' },
                  ].map((opt) => (
                    <label key={opt.val} className={`option-label ${madrs[0] === opt.val ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="madrs_0"
                        value={opt.val}
                        checked={madrs[0] === opt.val}
                        onChange={() => setMadrs({ ...madrs, 0: opt.val })}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="question-item">
                <div className="question-text">Inner tension and dread:</div>
                <div className="options-group">
                  {[
                    { val: 0, label: '0 - Calm' },
                    { val: 2, label: '2 - Fleeting Ill-ease' },
                    { val: 4, label: '4 - Continuous Dread' },
                    { val: 6, label: '6 - Unbearable Panic' },
                  ].map((opt) => (
                    <label key={opt.val} className={`option-label ${madrs[1] === opt.val ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="madrs_1"
                        value={opt.val}
                        checked={madrs[1] === opt.val}
                        onChange={() => setMadrs({ ...madrs, 1: opt.val })}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="question-item">
                <div className="question-text">Suicidal or pessimistic thoughts:</div>
                <div className="options-group">
                  {[
                    { val: 0, label: '0 - Enjoys Life' },
                    { val: 2, label: '2 - Weary of Life' },
                    { val: 4, label: '4 - Thoughts of Harm' },
                    { val: 6, label: '6 - Explicit Distress' },
                  ].map((opt) => (
                    <label key={opt.val} className={`option-label ${madrs[2] === opt.val ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="madrs_2"
                        value={opt.val}
                        checked={madrs[2] === opt.val}
                        onChange={() => setMadrs({ ...madrs, 2: opt.val })}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: PHQ-9 */}
            <div className="form-section-group">
              <div className="form-section-title">
                <span>2. Depressive Indicators (PHQ-9)</span>
              </div>

              <div className="question-item">
                <div className="question-text">Diminished interest or pleasure:</div>
                <div className="options-group">
                  {[
                    { val: 0, label: '0 - Not at all' },
                    { val: 1, label: '1 - Several days' },
                    { val: 2, label: '2 - Half the days' },
                    { val: 3, label: '3 - Daily' },
                  ].map((opt) => (
                    <label key={opt.val} className={`option-label ${phq9[0] === opt.val ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="phq9_0"
                        value={opt.val}
                        checked={phq9[0] === opt.val}
                        onChange={() => setPhq9({ ...phq9, 0: opt.val })}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="question-item">
                <div className="question-text">Feeling down or hopeless:</div>
                <div className="options-group">
                  {[
                    { val: 0, label: '0 - Not at all' },
                    { val: 1, label: '1 - Several days' },
                    { val: 2, label: '2 - Half the days' },
                    { val: 3, label: '3 - Daily' },
                  ].map((opt) => (
                    <label key={opt.val} className={`option-label ${phq9[1] === opt.val ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="phq9_1"
                        value={opt.val}
                        checked={phq9[1] === opt.val}
                        onChange={() => setPhq9({ ...phq9, 1: opt.val })}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: GAD-7 */}
            <div className="form-section-group">
              <div className="form-section-title">
                <span>3. Generalized Anxiety (GAD-7)</span>
              </div>

              <div className="question-item">
                <div className="question-text">Feeling anxious, nervous, or on edge:</div>
                <div className="options-group">
                  {[
                    { val: 0, label: '0 - Not at all' },
                    { val: 1, label: '1 - Several days' },
                    { val: 2, label: '2 - Half the days' },
                    { val: 3, label: '3 - Daily' },
                  ].map((opt) => (
                    <label key={opt.val} className={`option-label ${gad7[0] === opt.val ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="gad7_0"
                        value={opt.val}
                        checked={gad7[0] === opt.val}
                        onChange={() => setGad7({ ...gad7, 0: opt.val })}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Narrative Description */}
            <div className="form-section-group">
              <div className="form-section-title">
                <span>4. Free-Text Incident & Sentiment (NLP)</span>
              </div>
              <textarea
                className="narrative-textarea"
                placeholder="Describe current thoughts, emotions, and distressing symptoms..."
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
              />
            </div>

            {/* Redesigned Triggers Evaluation Button */}
            <div className="assessment-trigger-container">
              <button
                type="submit"
                className="trigger-primary-action"
                disabled={isSubmitting}
              >
                <span style={{ fontSize: '1.4rem' }}>⚡</span>
                <span>
                  {isSubmitting ? 'Evaluating Assessment Markers...' : 'Trigger AI Distress Evaluation'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar: Emergency Assistance */}
        <div>
          <div className="crisis-trigger-card">
            <div className="crisis-trigger-header">
              <span className="crisis-trigger-icon">🚨</span>
              <span className="crisis-trigger-title">Crisis Assistance</span>
            </div>

            <div className="helpline-item">
              <strong>National Tele-MANAS</strong>
              <span>📞 14416 / 1800-891-4416</span>
            </div>

            <div className="helpline-item">
              <strong>Emergency Services</strong>
              <span>🚑 108 Ambulance Dispatch</span>
            </div>

            <button
              type="button"
              className="crisis-dispatch-btn"
              onClick={handleEmergencyTrigger}
            >
              <span>🚨</span>
              <span>Trigger Immediate 108 Dispatch</span>
            </button>
          </div>

          <div className="content-card">
            <div className="content-card-title">
              <span>🔒 Privacy & Clinical Safeguards</span>
            </div>
            <div className="helpline-item">
              <strong>End-to-End Encryption</strong>
              <span>Submissions are strictly confidential and protected.</span>
            </div>
            <div className="helpline-item">
              <strong>Observer Triage</strong>
              <span>High distress predictions notify clinical responders.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
