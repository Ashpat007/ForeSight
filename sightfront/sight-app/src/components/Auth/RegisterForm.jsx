
import React, { useState } from 'react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.email.includes('@')) errs.email = 'Invalid email';
    if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        setApiError(errorResponse.message || 'Registration failed');
      } else {
        alert('Registration successful!');
      }
    } catch (err) {
      setApiError('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      <div>{errors.email}</div>

      <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
      <div>{errors.password}</div>

      <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
      <div>{errors.confirmPassword}</div>

      <button type="submit">Register</button>
      <div style={{ color: 'red' }}>{apiError}</div>
    </form>
  );
};

export default RegisterForm;
