import React, { useState, useEffect } from 'react';
import { observerService } from '../services/observer.service.js';
import { useAuth } from '../context/useAuth.js';

export default function ObserverDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total_cases: 0, critical: 0, high: 0, active_108_dispatches: 0 });
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTriggerOnly, setFilterTriggerOnly] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await observerService.getDashboard({ limit: 50 });
      setStats(data.statistics || {});
      setCases(data.cases || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleIntervention = async (caseId) => {
    const notes = prompt('Enter Clinical Observer Notes / Telepsychiatry Assignment:', 'Assigned telepsychiatrist for urgent consultation.');
    if (notes === null) return;

    try {
      await observerService.updateIntervention(caseId, {
        status: 'INTERVENTION_ASSIGNED',
        observer_notes: notes,
      });
      alert('Case intervention successfully saved.');
      fetchDashboard();
    } catch (err) {
      alert(`Failed to update intervention: ${err.message}`);
    }
  };

  const displayedCases = filterTriggerOnly
    ? cases.filter((c) => c.alert_triggered || c.severity_level === 'CRITICAL')
    : cases;

  return (
    <div>
      {/* Header Banner */}
      <div className="hero-banner">
        <div className="hero-text">
          <h1>Health Observer Caseload Dashboard</h1>
          <p>
            Jurisdiction: {user?.district || 'All Districts'}, {user?.state || 'All States'} | Observer Session
          </p>
          <div className="hero-badges">
            <span className="hero-pill">📊 Real-Time Caseload</span>
            <span className="hero-pill">🚑 108 Dispatch Monitor</span>
            <span className="hero-pill">👨‍⚕️ Clinical Triage</span>
          </div>
        </div>

        {/* Prominent Triggers Button */}
        <button
          type="button"
          className={`btn-trigger ${filterTriggerOnly ? 'active-trigger' : ''}`}
          onClick={() => setFilterTriggerOnly(!filterTriggerOnly)}
          title="Filter and highlight crisis triggers"
        >
          <span className="trigger-icon">🚨</span>
          <span>{filterTriggerOnly ? 'Showing Active Triggers' : 'Filter Crisis Triggers'}</span>
        </button>
      </div>

      {/* Caseload Metrics Row */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Caseload</span>
            <span>📁</span>
          </div>
          <div className="metric-number">{stats.total_cases || 0}</div>
        </div>

        <div className="metric-card critical">
          <div className="metric-header">
            <span className="metric-label">Critical Severity</span>
            <span>🔴</span>
          </div>
          <div className="metric-number">{stats.critical || 0}</div>
        </div>

        <div className="metric-card high">
          <div className="metric-header">
            <span className="metric-label">High Severity</span>
            <span>🟠</span>
          </div>
          <div className="metric-number">{stats.high || 0}</div>
        </div>

        <div className="metric-card critical">
          <div className="metric-header">
            <span className="metric-label">108 Active Dispatches</span>
            <span>🚑</span>
          </div>
          <div className="metric-number">{stats.active_108_dispatches || 0}</div>
        </div>
      </div>

      {/* Cases Data Table */}
      <div className="content-card">
        <div className="observer-toolbar">
          <div>
            <div className="content-card-title">
              <span>📋 Monitored Assessment Registry</span>
            </div>
            <div className="content-card-subtitle" style={{ marginBottom: 0 }}>
              Live intake from Mobile app, Web portal, SMS, and Helplines.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              className="btn btn-outline"
              onClick={fetchDashboard}
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="data-table-wrapper" style={{ marginTop: '1rem' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Distress Score</th>
                <th>Severity Band</th>
                <th>Touchpoint</th>
                <th>Alert Status</th>
                <th>Case Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', fontWeight: 700 }}>
                    Loading caseload registry...
                  </td>
                </tr>
              ) : displayedCases.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', fontWeight: 700 }}>
                    {filterTriggerOnly ? 'No active crisis triggers at this moment.' : 'No assessments recorded yet.'}
                  </td>
                </tr>
              ) : (
                displayedCases.map((c) => {
                  const sev = String(c.severity_level || 'low').toLowerCase();
                  return (
                    <tr key={c.id}>
                      <td><strong><code>{c.session_id}</code></strong></td>
                      <td><strong>{Number(c.distress_score || 0).toFixed(1)} / 100</strong></td>
                      <td>
                        <span className={`status-tag ${sev}`}>
                          {c.severity_level || 'LOW'}
                        </span>
                      </td>
                      <td>{c.touchpoint || 'web_portal'}</td>
                      <td>
                        {c.alert_triggered ? (
                          <span className="status-tag critical">🚨 Alert Sent</span>
                        ) : (
                          <span className="status-tag low">Normal</span>
                        )}
                      </td>
                      <td>
                        <span className="role-pill">{c.status || 'PENDING'}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline"
                          onClick={() => handleIntervention(c.id)}
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 800 }}
                        >
                          Intervene
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
