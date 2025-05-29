import { useNavigate } from 'react-router-dom';
import './List.css';

export default function List() {
  const navigate = useNavigate();

  return (
    <div className="list-container">
      <div className="list-header">
        <span className="list-title">List Page</span>
        <button className="add-new-btn" onClick={() => navigate('/form')}>Add New</button>
      </div>
      <div className="search-section">
        <label htmlFor="search-input" className="search-label">Search List:</label>
        <input id="search-input" className="search-input" placeholder="" />
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
          <tr>
            <td>ABC</td>
            <td>IT</td>
            <td>01-04-2024</td>
            <td>
              <span className="action-icon" title="View">👁️</span>
              <span className="action-icon" title="Edit">✏️</span>
              <span className="action-icon" title="Delete">🗑️</span>
            </td>
          </tr>
          <tr>
            <td>PQR</td>
            <td>Sales</td>
            <td>08-08-2016</td>
            <td>
              <span className="action-icon" title="View">👁️</span>
              <span className="action-icon" title="Edit">✏️</span>
              <span className="action-icon" title="Delete">🗑️</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
    