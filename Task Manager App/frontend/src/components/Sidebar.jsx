import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">TaskFlow</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => 
          `sidebar-link ${isActive ? 'active' : ''}`
        }>
          <span className="nav-icon">📊</span>
          Dashboard
        </NavLink>
        
        <NavLink to="/tasks" className={({ isActive }) => 
          `sidebar-link ${isActive ? 'active' : ''}`
        }>
          <span className="nav-icon">📋</span>
          All Tasks
        </NavLink>
        
        <NavLink to="/tasks/new" className={({ isActive }) => 
          `sidebar-link ${isActive ? 'active' : ''}`
        }>
          <span className="nav-icon">➕</span>
          New Task
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-email">{user?.email || ''}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;