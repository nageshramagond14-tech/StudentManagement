/**
 * Student Card (Mobile View)
 * 
 * WHY a card layout?
 * - Mobile First: Tables are difficult to read on small screens. Cards stack vertically.
 * - Touch Targets: Buttons in cards are easier to tap than small table rows.
 */

import React from 'react';
import { Edit, Trash2, Mail, GraduationCap, Calendar } from 'lucide-react';
import Button from './Button';

const StudentCard = ({ students, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {students.map((student) => (
        <div key={student.id} className="card p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                <Mail size={14} /> {student.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onEdit(student)}
                className="!p-2"
              >
                <Edit size={16} />
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onDelete(student.id)}
                className="!p-2 text-red-600 border-red-100 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Course</span>
              <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <GraduationCap size={14} className="text-primary-500" />
                {student.course}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Enrolled</span>
              <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Calendar size={14} className="text-primary-500" />
                {student.enrolledAt}
              </span>
            </div>
          </div>
          
          <div className="pt-2">
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600">
              Age: {student.age}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentCard;
