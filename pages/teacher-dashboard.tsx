'use client';

import Head from 'next/head';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { getCurrentUser, isAuthenticated, getAllStudents, getAllocations, createRequest, getRequestsByUser, AllocationRequest, extractId } from '@/lib/utils';
import { sendPaymentReminder, sendPaymentReminderWithTemplate } from '@/lib/whatsapp';

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: true,
  loading: () => <LoadingSpinner />,
});

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [requests, setRequests] = useState<AllocationRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [requestData, setRequestData] = useState({
    subjects: [] as string[],
    message: '',
  });
  const [sendingMessage, setSendingMessage] = useState<string | null>(null); // Track which allocation is sending
  const [messageStatus, setMessageStatus] = useState<Record<string, { type: 'success' | 'error'; message: string }>>({});

  useEffect(() => {
    const loadData = async () => {
      if (typeof window !== 'undefined') {
        if (!isAuthenticated()) {
          router.push('/login');
          return;
        }
        
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.type !== 'teacher') {
          router.push('/login');
          return;
        }
        
        setUser(currentUser);
        const studentsData = await getAllStudents();
        setStudents(studentsData);
        const allocationsData = await getAllocations(currentUser.id || currentUser._id, 'teacher');
        setAllocations(allocationsData);
        const requestsData = await getRequestsByUser(currentUser.id || currentUser._id, 'teacher');
        setRequests(requestsData);
      }
    };
    
    loadData();
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

  const handleSendPaymentReminder = async (allocation: any) => {
    const studentId = allocation.studentId?._id || allocation.studentId;
    const student = students.find(s => {
      const sId = s.id || s._id;
      return sId === studentId;
    });
    
    if (!student) {
      toast.error('Student information not found');
      return;
    }
    
    if (!student.phone) {
      toast.error('Student phone number is not available');
      return;
    }

    const allocationId = allocation.id || allocation._id;
    setSendingMessage(allocationId);
    setMessageStatus(prev => ({
      ...prev,
      [allocationId]: { type: 'success', message: '' },
    }));

    try {
      // Check if content template SID is available (from environment variable)
      // You can set TWILIO_WHATSAPP_CONTENT_SID in .env.local to use templates
      const contentSid = process.env.NEXT_PUBLIC_TWILIO_WHATSAPP_CONTENT_SID;
      
      let result;
      
      if (contentSid) {
        // Use content template (production method)
        // Adjust contentVariables based on your template structure
        // Example: {"1": "studentName", "2": "amount", "3": "subject"}
        result = await sendPaymentReminderWithTemplate(
          {
            studentName: allocation.studentName,
            studentPhone: student.phone,
            teacherName: user.name,
            amount: allocation.fees,
            subject: allocation.subjects.join(', '),
            allocationId: allocation.id,
          },
          contentSid,
          {
            "1": allocation.studentName,
            "2": `₹${allocation.fees}`,
            "3": allocation.subjects.join(', '),
          }
        );
      } else {
        // Use plain text message (sandbox/testing method)
        result = await sendPaymentReminder({
          studentName: allocation.studentName,
          studentPhone: student.phone,
          teacherName: user.name,
          amount: allocation.fees,
          subject: allocation.subjects.join(', '),
          allocationId: allocation.id,
        });
      }

      if (result.success) {
        setMessageStatus(prev => ({
          ...prev,
          [allocationId]: { type: 'success', message: 'Payment reminder sent successfully!' },
        }));
        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessageStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[allocationId];
            return newStatus;
          });
        }, 3000);
      } else {
        setMessageStatus(prev => ({
          ...prev,
          [allocationId]: { type: 'error', message: result.message || 'Failed to send reminder' },
        }));
      }
    } catch (error: any) {
      setMessageStatus(prev => ({
        ...prev,
        [allocationId]: { type: 'error', message: error.message || 'Failed to send payment reminder' },
      }));
    } finally {
      setSendingMessage(null);
    }
  };

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

            {/* My Requests Section */}
            {requests.length > 0 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-primary/10 mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="fas fa-paper-plane text-primary" aria-hidden="true"></span>
                  My Requests
                </h2>
                <div className="space-y-4">
                  {requests.map((request) => {
                    const requestId = request.id || request._id;
                    const targetId = extractId(request.targetId);
                    const student = students.find(s => {
                      const studentId = s.id || s._id;
                      return studentId === targetId;
                    });
                    const statusColors = {
                      pending: 'bg-yellow-100 text-yellow-700',
                      approved: 'bg-blue-100 text-blue-700',
                      rejected: 'bg-red-100 text-red-700',
                      allocated: 'bg-green-100 text-green-700',
                    };
                    return (
                      <div key={requestId} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-800">{request.targetName}</h3>
                            <p className="text-sm text-slate-600">{student?.email}</p>
                            {student?.class && (
                              <p className="text-sm text-slate-600">Class {student.class}</p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[request.status]}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-slate-700">
                            <strong>Subjects:</strong> {request.subjects.join(', ')}
                          </p>
                          {request.message && (
                            <p className="text-sm text-slate-600 mt-1">
                              <strong>Message:</strong> {request.message}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 mt-2">
                            Requested: {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Allocated Students Section */}
            {allocations.length > 0 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-primary/10 mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="fas fa-user-graduate text-primary" aria-hidden="true"></span>
                  My Allocated Students
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allocations.map((allocation) => {
                    const allocationId = allocation.id || allocation._id;
                    const studentId = allocation.studentId?._id || allocation.studentId;
                    const student = students.find(s => {
                      const sId = s.id || s._id;
                      return sId === studentId;
                    });
                    return (
                      <div key={allocationId} className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl p-6 border border-primary/20 hover:shadow-lg transition-all">
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
                        <div className="mt-4 pt-4 border-t border-primary/20">
                          {messageStatus[allocationId] && (
                            <div className={`mb-3 p-2 rounded-lg text-sm ${
                              messageStatus[allocationId].type === 'success'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {messageStatus[allocationId].message}
                            </div>
                          )}
                          <button
                            onClick={() => handleSendPaymentReminder(allocation)}
                            disabled={sendingMessage === allocationId || !student?.phone}
                            className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                              sendingMessage === allocationId
                                ? 'bg-slate-400 text-white cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                            }`}
                            aria-label={`Send payment reminder to ${allocation.studentName}`}
                          >
                            {sendingMessage === allocationId ? (
                              <>
                                <span className="fas fa-spinner fa-spin" aria-hidden="true"></span>
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <span className="fab fa-whatsapp" aria-hidden="true"></span>
                                <span>Send Payment Reminder</span>
                              </>
                            )}
                          </button>
                          {!student?.phone && (
                            <p className="text-xs text-red-600 mt-2 text-center">
                              Phone number not available
                            </p>
                          )}
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
                    const studentId = student.id || student._id;
                    const isAllocated = allocations.some(a => {
                      const allocStudentId = a.studentId?._id || a.studentId;
                      return allocStudentId === studentId;
                    });
                    return (
                      <div key={studentId} className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-primary transition-all hover:shadow-lg">
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
                        {(() => {
                          const hasPendingRequest = requests.some(r => {
                            const reqTargetId = extractId(r.targetId);
                            return reqTargetId === studentId && r.status === 'pending';
                          });
                          const isAllocated = allocations.some(a => {
                            const allocStudentId = a.studentId?._id || a.studentId;
                            return allocStudentId === studentId;
                          });
                          
                          if (isAllocated) {
                            return (
                              <span className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg font-semibold text-center block">
                                ✓ Allocated
                              </span>
                            );
                          } else if (hasPendingRequest) {
                            return (
                              <span className="w-full bg-yellow-100 text-yellow-700 py-2 px-4 rounded-lg font-semibold text-center block">
                                Request Pending
                              </span>
                            );
                          } else {
                            return (
                              <button
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setShowRequestForm(true);
                                }}
                                className="w-full bg-gradient-primary text-white py-2 px-4 rounded-lg font-semibold hover:shadow-colored transition-all"
                              >
                                Request Student
                              </button>
                            );
                          }
                        })()}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Request Form Modal */}
      {showRequestForm && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Request Student: {selectedStudent.name}</h3>
              <button
                onClick={() => {
                  setShowRequestForm(false);
                  setSelectedStudent(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="fas fa-times text-xl" aria-hidden="true"></span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Select Subjects</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-4">
                  {selectedStudent.subjects?.filter((subject: string) => 
                    user.subjects?.includes(subject)
                  ).map((subject: string) => (
                    <label key={subject} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requestData.subjects.includes(subject)}
                        onChange={() => {
                          setRequestData(prev => ({
                            ...prev,
                            subjects: prev.subjects.includes(subject)
                              ? prev.subjects.filter(s => s !== subject)
                              : [...prev.subjects, subject],
                          }));
                        }}
                        className="w-5 h-5 text-primary rounded"
                      />
                      <span className="text-slate-700 text-sm">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Message (Optional)</label>
                <textarea
                  value={requestData.message}
                  onChange={(e) => setRequestData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Add any additional information..."
                  rows={4}
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <span className="fas fa-info-circle mr-2" aria-hidden="true"></span>
                  Your request will be reviewed by admin. Once approved, the student will be allocated to you.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={async () => {
                    if (requestData.subjects.length === 0) {
                      toast.error('Please select at least one subject');
                      return;
                    }

                    const result = await createRequest({
                      requesterId: user.id || user._id,
                      requesterType: 'teacher',
                      requesterName: user.name,
                      targetId: selectedStudent.id || selectedStudent._id,
                      targetType: 'student',
                      targetName: selectedStudent.name,
                      subjects: requestData.subjects,
                      message: requestData.message,
                    });

                    if (result.success) {
                      toast.success('Request sent successfully! Admin will review and allocate the student.');
                      setShowRequestForm(false);
                      const requestsData = await getRequestsByUser(user.id || user._id, 'teacher');
                      setRequests(requestsData);
                      setRequestData({ subjects: [], message: '' });
                      setSelectedStudent(null);
                    } else {
                      toast.error(result.message || 'Failed to send request. Please try again.');
                    }
                  }}
                  className="flex-1 bg-gradient-primary text-white py-3 px-6 rounded-lg font-semibold hover:shadow-colored transition-all"
                >
                  Send Request
                </button>
                <button
                  onClick={() => {
                    setShowRequestForm(false);
                    setSelectedStudent(null);
                    setRequestData({ subjects: [], message: '' });
                  }}
                  className="flex-1 bg-slate-200 text-slate-700 py-3 px-6 rounded-lg font-semibold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<LoadingSpinner />}>
        <Footer />
      </Suspense>
    </>
  );
}

