import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
      calculateStats(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (taskList) => {
    const total = taskList.length;
    const pending = taskList.filter(t => t.status === 'pending').length;
    const inProgress = taskList.filter(t => t.status === 'in-progress').length;
    const completed = taskList.filter(t => t.status === 'completed').length;
    
    setStats({ total, pending, inProgress, completed });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'in-progress': return 'status-progress';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      low: '🟢',
      medium: '🟡',
      high: '🔴'
    };
    return colors[priority] || '⚪';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <div>
          <h1>📊 Dashboard</h1>
          <p className="text-muted">Welcome back! Here's your task overview</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => navigate('/tasks/new')}
        >
          + New Task
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeftColor: '#667eea' }}>
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">📋 Total Tasks</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#f6ad55' }}>
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">⏳ Pending</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#4299e1' }}>
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">🔄 In Progress</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#48bb78' }}>
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">✅ Completed</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>📌 Recent Tasks</h3>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/tasks')}
          >
            View All →
          </button>
        </div>
        
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No tasks yet</h3>
            <p>Create your first task to get started!</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/tasks/new')}
              style={{ marginTop: '16px' }}
            >
              Create Task
            </button>
          </div>
        ) : (
          <div className="task-list">
            {tasks.slice(0, 5).map((task) => (
              <div key={task._id} className="task-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span>{getPriorityBadge(task.priority)}</span>
                  <div>
                    <div className="task-title">{task.title}</div>
                    <small className="text-muted">
                      {task.description?.slice(0, 50) || 'No description'}
                    </small>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`task-status ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <button 
                    className="btn-secondary"
                    style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                    onClick={() => navigate(`/tasks/edit/${task._id}`)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;