/**
 * Dashboard Page Component
 * 
 * WHY the central hub?
 * - State Management: Holds the master list of students.
 * - API Orchestration: Calls the studentService and handles loading/error states.
 * - User Interaction: Handles Delete and Search logic.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, RefreshCcw } from 'lucide-react';
import { studentService } from '../services/studentService';
import Button from '../components/Button';
import StudentTable from '../components/StudentTable';
import StudentCard from '../components/StudentCard';
import Loader from '../components/Loader';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // 1. useState: Management of data, loading, and UI state
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // 2. useEffect: Initial data load (Simulated API call)
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setError(err.message || 'Could not load students. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    setDeletingId(studentId);
    try {
      await studentService.delete(studentId);
      // Optimistic UI: Remove instantly without re-fetching
      setStudents(prev => prev.filter(s => (s.id || s._id) !== studentId));
    } catch (err) {
      setError(err.message || 'Failed to delete student. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (student) => {
    const studentId = student.id || student._id;
    navigate(`/edit/${studentId}`, { state: { student } });
  };

  // Filter logic (Search)
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Student Directory</h1>
          <p className="text-slate-500 mt-1">Manage and track all enrolled students.</p>
        </div>
        <Button 
          onClick={() => navigate('/add')}
          icon={Plus}
          className="shadow-md"
        >
          Add New Student
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name, email or course..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="secondary" icon={Filter} className="flex-1 sm:flex-none">
            Filter
          </Button>
          <Button 
            variant="secondary" 
            icon={RefreshCcw} 
            onClick={fetchStudents}
            disabled={loading}
            className="flex-1 sm:flex-none"
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between">
          <p className="font-medium">{error}</p>
          <Button variant="secondary" size="sm" onClick={fetchStudents} className="!bg-white !text-red-700 !border-red-200">
            Retry
          </Button>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="card h-64 flex items-center justify-center">
          <Loader text="Fetching student records..." />
        </div>
      ) : filteredStudents.length > 0 ? (
        <div className="space-y-4">
          <StudentTable 
            students={filteredStudents} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
          <StudentCard 
            students={filteredStudents} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
          
          <div className="text-sm text-slate-500 text-center py-4">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="card p-12 text-center flex flex-col items-center gap-4 bg-slate-50/50">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-300">
            <Search size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">No students found</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
              We couldn't find any student matching "{searchTerm}". Try adjusting your search or add a new record.
            </p>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => setSearchTerm('')}
            className="mt-2"
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Global Deleting Overlay */}
      {deletingId && <Loader fullPage text="Deleting record..." />}
    </main>
  );
};

export default Dashboard;
