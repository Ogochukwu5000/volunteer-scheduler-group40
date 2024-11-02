import React from "react";
import './UserProfileManagement.css';
const UserProfileManagement = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <h1>User Profile Management</h1>
      <form style={{ maxWidth: "600px" }}>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="fullName">Full Name (required)</label>
          <input type="text" id="fullName" name="fullName" maxLength="50" required style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} />
        </div>

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="address1">Address 1 (required)</label>
          <input type="text" id="address1" name="address1" maxLength="100" required style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} />
        </div>

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="address2">Address 2 (optional)</label>
          <input type="text" id="address2" name="address2" maxLength="100" style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} />
        </div>

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="city">City (required)</label>
          <input type="text" id="city" name="city" maxLength="100" required style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} />
        </div>

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="state">State (required)</label>
          <select id="state" name="state" required style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}>
            <option value="" disabled selected>
              Select your state
            </option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            {/* Add more states as needed */}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="zip">Zip Code (required)</label>
          <input type="text" id="zip" name="zip" maxLength="9" required pattern="\d{5}(-\d{4})?" style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} />
        </div>

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="skills">Skills (required)</label>
          <select id="skills" name="skills" multiple required style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}>
            <option value="skill1">Skill 1</option>
            <option value="skill2">Skill 2</option>
            <option value="skill3">Skill 3</option>
            {/* Add more skills as needed */}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="preferences">Preferences (optional)</label>
          <textarea id="preferences" name="preferences" rows="4" style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}></textarea>
        </div>

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="availability">Availability (required)</label>
          <input type="date" id="availability" name="availability" required style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} />
          <small>(Select multiple dates via calendar if supported)</small>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserProfileManagement;
