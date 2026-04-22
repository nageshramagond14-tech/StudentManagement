/**
 * Form Page Wrapper
 * 
 * WHY a separate page for the form?
 * - Contextual Clarity: Gives the user a focused space to enter data.
 * - Routing: Allows direct navigation to /add or /edit/:id.
 * - Navigation: Uses `useLocation` to handle state passed from the Dashboard (editing).
 */

import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, UserPlus, UserRoundPen } from 'lucide-react';
import { studentService } from '../services/studentService';
import StudentForm from '../components/StudentForm';
import Button from '../components/Button';
import Loader from '../components/Loader';

const FormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Check if we are editing (passed from Dashboard) or just adding
  const studentToEdit = location.state?.student || null;
  // Support both 'id' and '_id' from MongoDB
  const editId = id || studentToEdit?.id || studentToEdit?._id;
  const isEditing = !!editId && !!studentToEdit;

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (isEditing) {
        await studentService.update(editId, formData);
      } else {
        await studentService.create(formData);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission failed:', error);
      setSubmitError(error.message || 'Failed to save student. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          icon={ArrowLeft}
        >
          Back
        </Button>
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
          <span>Directory</span>
          <span>/</span>
          <span className="text-slate-900">{isEditing ? 'Edit' : 'Add'} Student</span>
        </div>
      </div>

      <div className="card shadow-xl border-t-4 border-t-primary-600">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
              {isEditing ? <UserRoundPen size={24} /> : <UserPlus size={24} />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isEditing ? 'Update Profile' : 'New Enrollment'}
              </h1>
              <p className="text-slate-500 text-sm">
                {isEditing 
                  ? 'Update the student information below.' 
                  : 'Enter the details of the new student to enroll.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* API Error Banner */}
        {submitError && (
          <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
            ⚠️ {submitError}
          </div>
        )}

        <div className="p-8">
          <StudentForm 
            initialData={studentToEdit}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/dashboard')}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {isSubmitting && <Loader fullPage text="Syncing with database..." />}
    </div>
  );
};

export default FormPage;
