import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './View.css';

export default function View() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (location.state?.item) {
          setItem(location.state.item);
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/list/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setItem(response.data.data);
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to fetch item data');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, location.state]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!item) return <div className="error">Item not found</div>;

  return (
    <div className="view-container">
      <div className="view-header">
        <span className="view-title">View Details</span>
        <button className="back-btn" onClick={() => navigate('/list')}>Back to List</button>
      </div>
      <div className="view-content">
        <div className="view-section">
          <h3>Personal Information</h3>
          <div className="view-row">
            <div className="view-label">Name:</div>
            <div className="view-value">{item.name}</div>
          </div>
          <div className="view-row">
            <div className="view-label">Gender:</div>
            <div className="view-value">{item.gender}</div>
          </div>
          <div className="view-row">
            <div className="view-label">Address:</div>
            <div className="view-value">{item.address}</div>
          </div>
        </div>
        <div className="view-section">
          <h3>Professional Information</h3>
          <div className="view-row">
            <div className="view-label">Department:</div>
            <div className="view-value">{item.department}</div>
          </div>
          <div className="view-row">
            <div className="view-label">Date of Joining:</div>
            <div className="view-value">{new Date(item.dateOfJoining).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="view-section">
          <h3>Hobbies</h3>
          <div className="view-hobbies">
            {item.hobbies.length > 0 ? (
              item.hobbies.map((hobby, index) => (
                <span key={index} className="hobby-tag">{hobby}</span>
              ))
            ) : (
              <span className="no-hobbies">No hobbies listed</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 