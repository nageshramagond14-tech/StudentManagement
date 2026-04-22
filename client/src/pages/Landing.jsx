/**
 * Landing Page Component
 * 
 * WHY a separate landing page?
 * - First Impression: Marketing-focused page to explain the application's value.
 * - UX Flow: Introduces the user to the app before jumping into data management.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ShieldCheck, Zap, Database, ArrowRight } from 'lucide-react';
import Button from '../components/Button';

const Landing = () => {
  const features = [
    {
      title: 'Full CRUD Operations',
      description: 'Easily Create, Read, Update, and Delete student records with an intuitive interface.',
      icon: Database,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Real-time Validation',
      description: 'Built-in form validation ensures data integrity before it even reaches the server.',
      icon: ShieldCheck,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Responsive Design',
      description: 'Access the management system from any device - desktop, tablet, or smartphone.',
      icon: Zap,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-bold border border-primary-100">
                <Zap size={14} />
                <span>v1.0 Now Live</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                Modern Student <br />
                <span className="text-primary-600">Management</span> Simplified.
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                A production-ready dashboard to manage your student database with ease. Built with React, Tailwind CSS, and clean architectural principles.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto px-8" icon={ArrowRight}>
                    Go to Dashboard
                  </Button>
                </Link>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  View Source Code
                </Button>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute -inset-4 bg-primary-100/50 rounded-full blur-3xl opacity-50"></div>
              <div className="relative card p-4 rotate-3 bg-white/40 backdrop-blur shadow-2xl">
                <div className="bg-slate-900 rounded-lg aspect-video flex items-center justify-center overflow-hidden">
                   <div className="text-primary-400 font-mono text-sm p-6 text-left w-full h-full">
                      <p>// Simulating data loading...</p>
                      <p className="text-white mt-2">const [students, setStudents] = useState([]);</p>
                      <p className="text-slate-400">useEffect(() =&gt; &#123;</p>
                      <p className="text-slate-400">&nbsp;&nbsp;fetchData().then(data =&gt; setStudents(data));</p>
                      <p className="text-slate-400">&#125;, []);</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">Why choose our platform?</h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Everything you need to manage educational data efficiently, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="card p-8 group hover:border-primary-200 hover:shadow-md transition-all">
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 StudentPortal. Built for learning purposes.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
