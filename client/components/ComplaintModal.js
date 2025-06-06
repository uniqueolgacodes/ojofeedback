import { useState } from 'react';
import { successBar, errorBar } from '../utils/utils'

export default function ComplaintModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: '',
    title: '',
    complaint: '',
    email: '',
    level: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const submitComplaint = async (e) => {
  e.preventDefault();

  // Validation checks
  if (form.title === "") return errorBar("You didn't enter Complaint Title");
  if (form.complaint === "") return errorBar("You didn't enter Complaint");

  // Prepare the data payload
  const details = {
    name: form.name || '', // Ensure empty string if undefined
    title: form.title,
    complaint: form.complaint,
    email: form.email || '',
    level: form.level || '',
    date: new Date().toLocaleDateString()
  };

  try {
    const response = await fetch('http://localhost:5000/api/complaints/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      credentials: 'include',
      body: JSON.stringify(details),
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Server responded with ${response.status}`);
    }

    const result = await response.json();

    // Successful submission
    if (result.code === 201) {
      successBar(result.message || "Complaint submitted successfully!");
      setTimeout(() => {
        onClose();
        // Optional: Reset form after submission
        setForm({
          name: '',
          title: '',
          complaint: '',
          email: '',
          level: ''
        });
      }, 2000);
      return;
    }

    // Handle other success codes if needed
    throw new Error(result.message || "Unexpected response from server");

  } catch (err) {
    console.error('Complaint submission error:', err);
    errorBar(err.message || "Failed to submit complaint. Please try again.");
  }
};
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={submitComplaint}>
            <div className="modal-header">
              <h5 className="modal-title">Drop a Complaint</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <input name="name" placeholder="Name (optional)" className="form-control mb-2" onChange={handleChange} />
              <input name="title" placeholder="Complaint Title *" className="form-control mb-2" required onChange={handleChange} />
              <textarea name="complaint" placeholder="Complaint *" className="form-control mb-2" required onChange={handleChange} />
              <input name="email" placeholder="Email (optional)" type="email" className="form-control mb-2" onChange={handleChange} />
              <input name="level" placeholder="Level (optional)" className="form-control mb-2" onChange={handleChange} />
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">Submit</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}