import React, { useState } from 'react';
import './TravelForm.css';

const TravelForm = () => {
  const [formData, setFormData] = useState({
    duration: '',
    destination: '',
    adults: 1,
    children: 0,
    infants: 0,
    startDate: '',
    budgetCategory: 'Budget Friendly (£1000–1500/day)',
    interests: {
      heritage: false,
      nature: false,
      adventure: false,
      cuisine: false
    },
    shopping: {
      spiritual: false,
      art: false,
      photography: false
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = Math.max(0, parseInt(value) || 0);
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const [category, field] = name.split('.');
    
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: checked
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="travel-form-container">
      <h1>MERA BHARAT YATRA</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Destination Section */}
        <div className="form-section">
          <h2>Destination</h2>
          <div className="input-group">
            <label>
              <span className="icon">📞</span> Duration (days)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              placeholder="Enter duration"
            />
          </div>
          <div className="input-group">
            <label>
              <span className="icon">📞</span> Joinour, Rajosthan
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter destination"
            />
          </div>
        </div>

        {/* Travelers Section */}
        <div className="form-section">
          <div className="travelers-group">
            <div className="traveler-type">
              <label>
                <span className="icon">🌟</span> Adults (12+ years)
              </label>
              <input
                type="number"
                name="adults"
                value={formData.adults}
                onChange={handleNumberChange}
                min="1"
              />
            </div>
            <div className="traveler-type">
              <label>
                <span className="icon">🌟</span> Children (2–11 years)
              </label>
              <input
                type="number"
                name="children"
                value={formData.children}
                onChange={handleNumberChange}
                min="0"
              />
            </div>
            <div className="traveler-type">
              <label>
                <span className="icon">🌟</span> Infants (0–2 years)
              </label>
              <input
                type="number"
                name="infants"
                value={formData.infants}
                onChange={handleNumberChange}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Start Date Section */}
        <div className="form-section">
          <h2>Start Date</h2>
          <div className="input-group">
            <input
              type="text"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              placeholder="dd-mm-yyyy"
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => (e.target.type = 'text')}
            />
          </div>
          <div className="input-group">
            <label>
              <span className="icon">📞</span> Budget Category
            </label>
            <select
              name="budgetCategory"
              value={formData.budgetCategory}
              onChange={handleChange}
            >
              <option>Budget Friendly (£1000–1500/day)</option>
              <option>Standard (£1500–2000/day)</option>
              <option>Premium (£2000+/day)</option>
            </select>
          </div>
        </div>

        {/* Travel Interests Section */}
        <div className="form-section">
          <h2>Travel Interests</h2>
          <div className="checkbox-group">
            {[
              { name: 'interests.heritage', label: 'Heritage Sites' },
              { name: 'interests.nature', label: 'Nature & Wildlife' },
              { name: 'interests.adventure', label: 'Adventure Sports' },
              { name: 'interests.cuisine', label: 'Local Cuisine' }
            ].map((item) => (
              <label key={item.name} className="checkbox-label">
                <input
                  type="checkbox"
                  name={item.name}
                  checked={formData.interests[item.name.split('.')[1]]}
                  onChange={handleCheckboxChange}
                />
                <span className="icon">📞</span> {item.label}
              </label>
            ))}
          </div>
        </div>

        {/* Shopping Section */}
        <div className="form-section">
          <h2>Shopping</h2>
          <div className="checkbox-group">
            {[
              { name: 'shopping.spiritual', label: 'Spiritual' },
              { name: 'shopping.art', label: 'Art & Culture' },
              { name: 'shopping.photography', label: 'Photography' }
            ].map((item) => (
              <label key={item.name} className="checkbox-label">
                <input
                  type="checkbox"
                  name={item.name}
                  checked={formData.shopping[item.name.split('.')[1]]}
                  onChange={handleCheckboxChange}
                />
                <span className="icon">📞</span> {item.label}
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Create My Yatra Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default TravelForm;