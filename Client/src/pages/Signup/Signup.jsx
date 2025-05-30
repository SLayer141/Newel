import { useState } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';
import "./Signup.css";

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      navigate('/', { replace: true });
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" placeholder="Enter your name" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="Enter your email" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Enter your password" onChange={handleChange} required />
          </div>
          <button type="submit" className="login-button">Register</button>
          <div className="register-link">
            Already have an account? <a href="/">Login here</a>
          </div>
        </form>
      </div>
    </div>
  );
}
