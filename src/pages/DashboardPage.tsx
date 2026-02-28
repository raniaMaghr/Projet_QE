/**
 * Page d'accueil / Dashboard
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleHomePage } from '../components/SimpleHomePage';

export function DashboardPage() {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    switch(page) {
      case 'login':
        navigate('/login');
        break;
      case 'dashboard':
        navigate('/DashboardPage');
        break;
      case 'qcm':
        navigate('/qcm');
        break;
      case 'stats':
        navigate('/stats');
        break;
      default:
        navigate(`/${page}`);
    }
  };

  return (
    <>
      {/* ✅ Bouton flottant insertion question */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
        <button
          onClick={() => navigate('/insert-question')}
          style={{
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
            fontFamily: 'sans-serif',
          }}
        >
          ➕ Insérer une question
        </button>
      </div>

      <SimpleHomePage onNavigate={handleNavigate} />
    </>
  );
}