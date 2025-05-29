import './AddEdit.css';

export default function AddEdit() {
  return (
    <div className="addedit-container">
      <div className="addedit-header">Add-Edit Page</div>
      <form className="addedit-form">
        <div className="form-row">
          <div className="form-col">
            <label className="form-label" htmlFor="name">Name:</label>
            <input className="form-input" id="name" placeholder="" />
          </div>
          <div className="form-col">
            <label className="form-label" htmlFor="address">Address:</label>
            <textarea className="form-textarea" id="address" placeholder=""></textarea>
          </div>
        </div>
        <div className="form-row">
          <div className="form-col">
            <label className="form-label" htmlFor="department">Department:</label>
            <select className="form-input" id="department">
              <option>Select Department</option>
              <option>IT</option>
              <option>Sales</option>
            </select>
          </div>
          <div className="form-col">
            <label className="form-label" htmlFor="date">Date of Joining:</label>
            <input className="form-input" id="date" type="date" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-col">
            <label className="form-label">Hobbies:</label>
            <div className="checkbox-group">
              <label><input type="checkbox" /> Reading</label>
              <label><input type="checkbox" /> Swimming</label>
              <label><input type="checkbox" /> Playing</label>
              <label><input type="checkbox" /> Singing</label>
            </div>
          </div>
          <div className="form-col">
            <label className="form-label">Gender:</label>
            <div className="radio-group">
              <label><input type="radio" name="gender" /> Male</label>
              <label><input type="radio" name="gender" /> Female</label>
            </div>
          </div>
        </div>
        <div className="form-row form-actions">
          <button type="button" className="form-btn btn-blue">Update</button>
          <button type="submit" className="form-btn btn-green">Save</button>
          <button type="button" className="form-btn btn-pink">Back</button>
        </div>
      </form>
    </div>
  );
}
