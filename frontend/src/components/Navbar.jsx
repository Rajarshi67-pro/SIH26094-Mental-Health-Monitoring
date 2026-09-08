import React from 'react';
import { useAuth } from '../context/useAuth.js';

export default function Navbar({ currentView, onToggleView }) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const isObserver = user && user.role && user.role.includes('observer');

  return (
    <header className="app-header">
      <div className="nav-container">
        <div className="brand" onClick={() => onToggleView('assessment')}>
          <span className="brand-icon">🧠</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="brand-title">Mental Health Monitoring & Distress Prediction</span>
              <span className="brand-badge">AI Health System</span>
            </div>
            <div className="brand-subtitle">
              Dynamic Psychological Assessment & Crisis Monitoring
            </div>
          </div>
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <div className="user-badge">
                <span>👤 {isObserver ? (user.district ? `${user.district} Observer` : 'Health Observer') : 'Client Session'}</span>
                <span className={`role-pill ${isObserver ? 'observer' : 'victim'}`}>
                  {isObserver ? (user.role || 'Observer') : 'Citizen'}
                </span>
              </div>

              {isObserver && (
                <button
                  className="btn btn-outline"
                  onClick={() => onToggleView(currentView === 'assessment' ? 'observer' : 'assessment')}
                  style={{ fontSize: '0.85rem' }}
                >
                  {currentView === 'assessment' ? '📊 Observer Caseload' : '📋 Assessment Form'}
                </button>
              )}

              <button
                className="btn btn-danger"
                onClick={logout}
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => openAuthModal('login')}>
                Sign In
              </button>
              <button className="btn btn-primary" onClick={() => openAuthModal('register')}>
                Register Account
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
