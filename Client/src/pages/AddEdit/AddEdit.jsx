import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './AddEdit.css';

export default function AddEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    department: '',
    dateOfJoining: '',
    hobbies: [],
    gender: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch item data if editing
  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/list/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          const item = response.data.data;
          setFormData({
            name: item.name,
            address: item.address,
            department: item.department,
            dateOfJoining: new Date(item.dateOfJoining).toISOString().split('T')[0],
            hobbies: item.hobbies,
            gender: item.gender
          });
        } catch (err) {
          console.error('Error fetching item:', err);
          setError('Failed to fetch item data');
        }
      };
      fetchItem();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const hobbies = [...formData.hobbies];
      if (checked) {
        hobbies.push(value);
      } else {
        const index = hobbies.indexOf(value);
        if (index > -1) {
          hobbies.splice(index, 1);
        }
      }
      setFormData(prev => ({ ...prev, hobbies }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check for token
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to submit this form');
      setLoading(false);
      return;
    }

    // Validate form data
    if (!formData.name || !formData.address || !formData.department || !formData.dateOfJoining || !formData.gender) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const url = id 
        ? `http://localhost:5000/api/list/${id}`
        : 'http://localhost:5000/api/list';
      
      const method = id ? 'put' : 'post';
      
      // Format the data before sending
      const formattedData = {
        ...formData,
        dateOfJoining: new Date(formData.dateOfJoining).toISOString()
      };
      
      console.log('Submitting form data:', formattedData);
      console.log('Using token:', token);
      
      const response = await axios[method](url, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Server response:', response.data);

      if (response.data.success) {
        navigate('/list', { replace: true });
      } else {
        setError(response.data.error || 'Failed to save item');
      }
    } catch (err) {
      console.error('Error saving item:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        // Optionally redirect to login
        // navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to save item');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addedit-container">
      <div className="addedit-header">{id ? 'Edit Item' : 'Add New Item'}</div>
      {error && <div className="error-message">{error}</div>}
      <form className="addedit-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-col">
            <label className="form-label" htmlFor="name">Name:</label>
            <input 
              className="form-input" 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-col">
            <label className="form-label" htmlFor="address">Address:</label>
            <textarea 
              className="form-textarea" 
              id="address" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>
        <div className="form-row">
          <div className="form-col">
            <label className="form-label" htmlFor="department">Department:</label>
            <select 
              className="form-input" 
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
          <div className="form-col">
            <label className="form-label" htmlFor="dateOfJoining">Date of Joining:</label>
            <input 
              className="form-input" 
              id="dateOfJoining" 
              name="dateOfJoining"
              type="date" 
              value={formData.dateOfJoining}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-col">
            <label className="form-label">Hobbies:</label>
            <div className="checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  value="Reading"
                  checked={formData.hobbies.includes('Reading')}
                  onChange={handleChange}
                /> Reading
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="Swimming"
                  checked={formData.hobbies.includes('Swimming')}
                  onChange={handleChange}
                /> Swimming
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="Playing"
                  checked={formData.hobbies.includes('Playing')}
                  onChange={handleChange}
                /> Playing
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="Singing"
                  checked={formData.hobbies.includes('Singing')}
                  onChange={handleChange}
                /> Singing
              </label>
            </div>
          </div>
          <div className="form-col">
            <label className="form-label">Gender:</label>
            <div className="radio-group">
              <label>
                <input 
                  type="radio" 
                  name="gender" 
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleChange}
                /> Male
              </label>
              <label>
                <input 
                  type="radio" 
                  name="gender" 
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleChange}
                /> Female
              </label>
            </div>
          </div>
        </div>
        <div className="form-row form-actions">
          <button 
            type="submit" 
            className="form-btn btn-green"
            disabled={loading}
          >
            {loading ? 'Saving...' : (id ? 'Update' : 'Save')}
          </button>
          <button 
            type="button" 
            className="form-btn btn-pink" 
            onClick={() => navigate('/list')}
            disabled={loading}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
