'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCurrentUser, isAuthenticated, getAllStudents, getAllocations, createAllocation } from '@/lib/utils';

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }
      
      const currentUser = getCurrentUser();
      if (!currentUser || currentUser.type !== 'teacher') {
        router.push('/login');
        return;
      }
      
      setUser(currentUser);
      setStudents(getAllStudents());
      setAllocations(getAllocations(currentUser.id, 'teacher'));
    }
  }, [router]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || student.subjects?.some((s: string) => 
      user.subjects?.includes(s)
    );
    const matchesClass = !selectedClass || student.class === selectedClass;
    return matchesSearch && matchesSubject && matchesClass;
  });

  const allSubjects = Array.from(new Set(students.flatMap(s => s.subjects || [])));
  const allClasses = Array.from(new Set(students.map(s => s.class).filter(Boolean))).sort((a, b) => Number(a) - Number(b));

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></div>
          <p className="text-slate-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Teacher Dashboard - OneHourStudy</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Navbar />

      <section className="min-h-[calc(100vh-200px)] py-16 bg-gradient-hero relative">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-container mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                Welcome, {user.name}!
              </h1>
              <p className="text-slate-700">Manage your students and grow your tutoring business</p>
            </div>

            {/* Allocated Students Section */}
            {allocations.length > 0 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-primary/10 mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="fas fa-user-graduate text-primary" aria-hidden="true"></span>
                  My Allocated Students
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allocations.map((allocation) => {
                    const student = students.find(s => s.id === allocation.studentId);
                    return (
                      <div key={allocation.id} className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl p-6 border border-primary/20 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">{allocation.studentName}</h3>
                            <p className="text-sm text-slate-600">{student?.email}</p>
                            <p className="text-sm text-slate-600">{student?.city}</p>
                            {student?.class && (
                              <p className="text-sm text-slate-600">Class {student.class}</p>
                            )}
                          </div>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-slate-700">
                            <span className="fas fa-book text-primary w-5" aria-hidden="true"></span>
                            <span className="text-sm"><strong>Subjects:</strong> {allocation.subjects.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-700">
                            <span className="fas fa-clock text-primary w-5" aria-hidden="true"></span>
                            <span className="text-sm"><strong>Time:</strong> {allocation.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-700">
                            <span className="fas fa-calendar text-primary w-5" aria-hidden="true"></span>
                            <span className="text-sm"><strong>Days:</strong> {allocation.days.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-700">
                            <span className="fas fa-rupee-sign text-primary w-5" aria-hidden="true"></span>
                            <span className="text-sm"><strong>Fees:</strong> ₹{allocation.fees}/hour</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Students Section */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-primary/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="fas fa-search text-primary" aria-hidden="true"></span>
                  Available Students
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Search by name, email, or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none"
                  >
                    <option value="">All Subjects</option>
                    {allSubjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none"
                  >
                    <option value="">All Classes</option>
                    {allClasses.map(cls => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <span className="fas fa-user-slash text-4xl text-slate-400 mb-4" aria-hidden="true"></span>
                  <p className="text-slate-600">No students found matching your criteria</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.map((student) => {
                    const isAllocated = allocations.some(a => a.studentId === student.id);
                    return (
                      <div key={student.id} className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-primary transition-all hover:shadow-lg">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">{student.name}</h3>
                            <p className="text-sm text-slate-600">{student.email}</p>
                            <p className="text-sm text-slate-600 flex items-center gap-1">
                              <span className="fas fa-map-marker-alt text-primary" aria-hidden="true"></span>
                              {student.city}
                            </p>
                            {student.class && (
                              <p className="text-sm text-slate-600">
                                <strong>Class:</strong> {student.class}
                              </p>
                            )}
                          </div>
                          {isAllocated && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                              Allocated
                            </span>
                          )}
                        </div>
                        <div className="mb-4">
                          <p className="text-sm text-slate-700 mb-2"><strong>Subjects:</strong></p>
                          <div className="flex flex-wrap gap-2">
                            {student.subjects?.slice(0, 3).map((subject: string) => (
                              <span key={subject} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                                {subject}
                              </span>
                            ))}
                            {student.subjects?.length > 3 && (
                              <span className="text-slate-500 text-xs">+{student.subjects.length - 3} more</span>
                            )}
                          </div>
                        </div>
                        {isAllocated ? (
                          <div className="text-center">
                            <p className="text-sm text-green-600 font-semibold">✓ Already Allocated</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-sm text-slate-500 mb-2">Waiting for student allocation</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

