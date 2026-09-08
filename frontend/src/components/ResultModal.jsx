import React from 'react';

export default function ResultModal({ result, onClose }) {
  if (!result) return null;

  const score = Number(result.distress_score || 0).toFixed(1);
  const severity = (result.severity_level || 'LOW').toLowerCase();
  const isAmbulanceDispatched = result.ambulance_108_dispatched;

  const getSeverityEmoji = (sev) => {
    switch (sev) {
      case 'low': return '🟢';
      case 'moderate': return '🟡';
      case 'high': return '🟠';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" style={{ maxWidth: '580px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="score-display-card">
          <h2>Distress Prediction Report</h2>

          {/* Distress Score Gauge with Black Text */}
          <div className={`score-circle ${severity}`}>
            <span className="score-number">{score}</span>
            <span className="score-label">Distress / 100</span>
          </div>

          <div className={`severity-pill-large ${severity}`}>
            <span>{getSeverityEmoji(severity)}</span>
            <span>{result.severity_level || 'LOW'} SEVERITY</span>
          </div>

          {isAmbulanceDispatched && (
            <div className="emergency-dispatch-banner">
              <span className="emergency-icon">🚨</span>
              <div>
                <div className="emergency-title">Emergency 108 Ambulance Protocol Triggered</div>
                <div className="emergency-desc">
                  Crisis markers exceeded threshold. Emergency services have been notified for priority response.
                </div>
              </div>
            </div>
          )}

          {/* SHAP Explainability */}
          {result.shap_explainability && (
            <div style={{ marginTop: '1.25rem', textAlign: 'left' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.35rem', color: '#000000' }}>
                AI Feature Explainability (SHAP Values)
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#000000', marginBottom: '0.5rem' }}>
                Primary Driver: {result.shap_explainability.primary_driver || 'Clinical Screening'}
              </div>
              <ul className="shap-list">
                {(result.shap_explainability.features || []).map((f, i) => (
                  <li key={i} className="shap-item">
                    <span>{f.feature}</span>
                    <span className="shap-val">{f.impact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actionable Recommendations */}
          {result.recommendations && (
            <div style={{ marginTop: '1.25rem', textAlign: 'left' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.5rem', color: '#000000' }}>
                Actionable Support Services
              </div>

              {result.recommendations.counselling && (
                <div className="recommendation-card">
                  <strong>{result.recommendations.counselling.service}:</strong> {result.recommendations.counselling.contact}
                </div>
              )}

              {result.recommendations.legal_aid && (
                <div className="recommendation-card">
                  <strong>Legal Aid:</strong> {result.recommendations.legal_aid.scheme} (Helpline: {result.recommendations.legal_aid.helpline})
                </div>
              )}

              {result.recommendations.financial_aid && (
                <div className="recommendation-card">
                  <strong>Relief Assistance:</strong> {result.recommendations.financial_aid.scheme}
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem' }}
            onClick={onClose}
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
