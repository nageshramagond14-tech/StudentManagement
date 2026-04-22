/**
 * Student Table (Desktop View)
 * 
 * WHY a separate table component?
 * - Conditional Rendering: We can switch between Table (Desktop) and Cards (Mobile).
 * - Props: Receives student list and callback functions (edit/delete) from the parent Dashboard.
 */

import React from 'react';
import { Edit, Trash2, Mail, GraduationCap } from 'lucide-react';
import Button from './Button';

const StudentTable = ({ students, onEdit, onDelete }) => {
  return (
    <div className="hidden md:block overflow-x-auto card">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Name & Email</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Course</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Age</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Enrolled</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900">{student.name}</span>
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Mail size={14} /> {student.email}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100">
                  <GraduationCap size={14} />
                  {student.course}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-600 font-medium">{student.age}</td>
              <td className="px-6 py-4 text-slate-500 text-sm">{student.enrolledAt}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(student)}
                    className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(student.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
