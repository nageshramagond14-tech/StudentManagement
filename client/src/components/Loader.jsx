/**
 * Loader Component
 * 
 * WHY a dedicated loader?
 * - User Experience (UX): Informs the user that an action is in progress.
 * - Reduced Frustration: Prevents users from clicking buttons multiple times.
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullPage = false, text = 'Loading data...' }) => {
  const containerStyles = fullPage 
    ? "fixed inset-0 bg-white/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center"
    : "flex flex-col items-center justify-center p-8";

  return (
    <div className={containerStyles}>
      <Loader2 className="text-primary-600 animate-spin" size={fullPage ? 48 : 32} />
      {text && (
        <p className={`mt-4 font-medium ${fullPage ? 'text-lg text-slate-700' : 'text-slate-500'}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
