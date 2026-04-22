/**
 * Student Form Component
 * 
 * WHY a single form for Add/Edit?
 * - DRY (Don't Repeat Yourself): The fields are identical for both operations.
 * - Logic Consolidation: Validation rules are defined once.
 * - Local State: Uses `useState` to track input values before submission.
 */

import React, { useState, useEffect } from 'react';
import { User, Mail, GraduationCap, Calendar, Save, X } from 'lucide-react';
import Button from './Button';

const StudentForm = ({ initialData = null, onSubmit, onCancel, isSubmitting }) => {
  // 1. useState: Local state for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    course: '',
  });

  const [errors, setErrors] = useState({});

  // 2. useEffect: Populate form if editing existing student
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        age: initialData.age || '',
        course: initialData.course || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // 3. Closures: This handler 'closes over' setFormData
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 18 || formData.age > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }
    if (!formData.course.trim()) newErrors.course = 'Course is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Ensure numeric fields are correctly typed for the backend
      const submittedData = {
        ...formData,
        age: parseInt(formData.age, 10)
      };
      onSubmit(submittedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <User size={16} className="text-slate-400" />
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Mail size={16} className="text-slate-400" />
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
        </div>

        {/* Age Field */}
        <div className="space-y-2">
          <label htmlFor="age" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Calendar size={16} className="text-slate-400" />
            Age
          </label>
          <input
            id="age"
            name="age"
            type="number"
            className={`input ${errors.age ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g. 21"
            value={formData.age}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.age && <p className="text-xs text-red-500 font-medium">{errors.age}</p>}
        </div>

        {/* Course Field */}
        <div className="space-y-2">
          <label htmlFor="course" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <GraduationCap size={16} className="text-slate-400" />
            Course Name
          </label>
          <input
            id="course"
            name="course"
            type="text"
            className={`input ${errors.course ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g. Computer Science"
            value={formData.course}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.course && <p className="text-xs text-red-500 font-medium">{errors.course}</p>}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-slate-100">
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={isSubmitting}
          icon={Save}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Student' : 'Add Student'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={onCancel}
          disabled={isSubmitting}
          icon={X}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;
