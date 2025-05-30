import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './List.css';

export default function List() {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch items from API
  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to view this page');
        navigate('/login');
        return;
      }

      console.log('Fetching items with token:', token);
      
      const response = await axios.get('http://localhost:5000/api/list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Items fetched successfully:', response.data);
      setItems(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching items:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to fetch items');
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/list/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchItems(); // Refresh the list
      } catch (err) {
        console.error('Error deleting item:', err);
        alert('Failed to delete item');
      }
    }
  };

  // Edit item
  const handleEdit = (id) => {
    const item = items.find(item => item._id === id);
    navigate(`/form/${id}`, { state: { item } });
  };

  // View item details
  const handleView = (id) => {
    const item = items.find(item => item._id === id);
    navigate(`/view/${id}`, { state: { item } });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch items on component mount and route change
  useEffect(() => {
    fetchItems();
  }, [location.pathname]); // Refresh when route changes

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="list-container">
      <div className="list-header">
        <span className="list-title">List Page</span>
        <div className="list-actions">
          <button className="add-new-btn" onClick={() => navigate('/form')}>Add New</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="search-section">
        <label htmlFor="search-input" className="search-label">Search List:</label>
        <input 
          id="search-input" 
          className="search-input" 
          placeholder="Search by name or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn" title="Search">
          <span role="img" aria-label="search">🔍</span>
        </button>
      </div>
      <div className="search-table-label">Search List Table:</div>
      <table className="list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Date of Joining</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.department}</td>
              <td>{new Date(item.dateOfJoining).toLocaleDateString()}</td>
              <td>
                <span 
                  className="action-icon" 
                  title="View" 
                  onClick={() => handleView(item._id)}
                >👁️</span>
                <span 
                  className="action-icon" 
                  title="Edit" 
                  onClick={() => handleEdit(item._id)}
                >✏️</span>
                <span 
                  className="action-icon" 
                  title="Delete" 
                  onClick={() => handleDelete(item._id)}
                >🗑️</span>
              </td>
            </tr>
          ))}
          {filteredItems.length === 0 && (
            <tr>
              <td colSpan="4" className="no-data">No items found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
    