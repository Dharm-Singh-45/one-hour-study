'use client';

import Head from 'next/head';
import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { getAllTeachers, getAllStudents, getAllRequests, updateRequestStatus, createAllocation, getAllocations, User, AllocationRequest, extractId } from '@/lib/utils';
import { generateMetadata } from '@/lib/seo';

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: true,
  loading: () => <LoadingSpinner />,
});

export default function Admin() {
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [requests, setRequests] = useState<AllocationRequest[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'requests'>('requests');
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AllocationRequest | null>(null);
  const [allocationFormData, setAllocationFormData] = useState({
    fees: '',
    time: '',
    days: [] as string[],
  });

  useEffect(() => {
    const loadData = async () => {
      if (typeof window !== 'undefined') {
        const allStudents = await getAllStudents();
        const allTeachers = await getAllTeachers();
        const allRequests = await getAllRequests();
        setStudents(allStudents);
        setTeachers(allTeachers);
        setRequests(allRequests);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleApproveRequest = async (requestId: string | undefined) => {
    if (!requestId) {
      toast.error('Request ID not found');
      return;
    }
    
    const result = await updateRequestStatus(requestId, 'approved');
    if (result.success) {
      const allRequests = await getAllRequests();
      setRequests(allRequests);
      toast.success('Request approved successfully!');
    } else {
      toast.error(result.message || 'Failed to approve request.');
    }
  };

  const handleRejectRequest = async (requestId: string | undefined) => {
    if (!requestId) {
      toast.error('Request ID not found');
      return;
    }
    
    if (confirm('Are you sure you want to reject this request?')) {
      const result = await updateRequestStatus(requestId, 'rejected');
      if (result.success) {
        const allRequests = await getAllRequests();
        setRequests(allRequests);
        toast.success('Request rejected');
      } else {
        toast.error(result.message || 'Failed to reject request.');
      }
    }
  };

  const handleOpenAllocationModal = (request: AllocationRequest) => {
    setSelectedRequest(request);
    setShowAllocationModal(true);
  };

  const handleCreateAllocation = async () => {
    if (!selectedRequest) return;

    if (!allocationFormData.fees || !allocationFormData.time || allocationFormData.days.length === 0) {
      toast.error('Please fill all fields');
      return;
    }

    const requesterId = extractId(selectedRequest.requesterId);
    const targetId = extractId(selectedRequest.targetId);

    const student = students.find(s => {
      const sId = s.id || s._id;
      return selectedRequest.requesterType === 'student' ? sId === requesterId : sId === targetId;
    });
    const teacher = teachers.find(t => {
      const tId = t.id || t._id;
      return selectedRequest.requesterType === 'teacher' ? tId === requesterId : tId === targetId;
    });

    if (!student || !teacher) {
      toast.error('Student or teacher not found');
      return;
    }

    const allocationResult = await createAllocation({
      studentId: student.id || student._id,
      teacherId: teacher.id || teacher._id,
      studentName: student.name,
      teacherName: teacher.name,
      subjects: selectedRequest.subjects,
      fees: parseInt(allocationFormData.fees),
      time: allocationFormData.time,
      days: allocationFormData.days,
      startDate: new Date().toISOString(),
      status: 'active',
    });

    if (allocationResult.success && allocationResult.allocation) {
      const allocationId = allocationResult.allocation._id || allocationResult.allocation.id;
      const requestId = selectedRequest.id || selectedRequest._id;
      
      if (!requestId) {
        toast.error('Request ID not found');
        return;
      }
      
      await updateRequestStatus(requestId, 'allocated', allocationId);
      const allRequests = await getAllRequests();
      setRequests(allRequests);
      setShowAllocationModal(false);
      setSelectedRequest(null);
      setAllocationFormData({ fees: '', time: '', days: [] });
      toast.success('Teacher allocated successfully!');
    } else {
      toast.error(allocationResult.message || 'Failed to create allocation.');
    }
  };

  const handleDayChange = (day: string) => {
    setAllocationFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const allocatedRequests = requests.filter(r => r.status === 'allocated');

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const metadata = generateMetadata('home');

  return (
    <>
      <Head>
        <title>Admin Dashboard - OneHourStudy</title>
        <meta name="description" content="Admin dashboard to view all registered students and teachers" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Navbar />

      <section className="min-h-[calc(100vh-200px)] py-16 bg-gradient-hero relative">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-primary/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-primary"></div>

              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
                  <span className="fas fa-user-shield text-primary" aria-hidden="true"></span>
                  Admin Dashboard
                </h2>
                <p className="text-slate-600 mt-4">View all registered students and teachers</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl p-6 border-2 border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-semibold mb-1">Total Students</p>
                      <p className="text-3xl font-bold text-primary">{students.length}</p>
                    </div>
                    <span className="fas fa-user-graduate text-4xl text-primary opacity-50" aria-hidden="true"></span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-secondary/10 to-purple-500/10 rounded-2xl p-6 border-2 border-secondary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-semibold mb-1">Total Teachers</p>
                      <p className="text-3xl font-bold text-secondary">{teachers.length}</p>
                    </div>
                    <span className="fas fa-chalkboard-teacher text-4xl text-secondary opacity-50" aria-hidden="true"></span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl flex-wrap">
                  <button
                    type="button"
                    onClick={() => setActiveTab('requests')}
                    className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      activeTab === 'requests'
                        ? 'bg-gradient-primary text-white shadow-md'
                        : 'text-slate-700 hover:text-primary'
                    }`}
                  >
                    <span className="fas fa-paper-plane mr-2" aria-hidden="true"></span>
                    Requests ({pendingRequests.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('students')}
                    className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      activeTab === 'students'
                        ? 'bg-gradient-primary text-white shadow-md'
                        : 'text-slate-700 hover:text-primary'
                    }`}
                  >
                    <span className="fas fa-user-graduate mr-2" aria-hidden="true"></span>
                    Students ({students.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('teachers')}
                    className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      activeTab === 'teachers'
                        ? 'bg-gradient-primary text-white shadow-md'
                        : 'text-slate-700 hover:text-primary'
                    }`}
                  >
                    <span className="fas fa-chalkboard-teacher mr-2" aria-hidden="true"></span>
                    Teachers ({teachers.length})
                  </button>
                </div>
              </div>

              {/* Content */}
              {isLoading ? (
                <div className="text-center py-12">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {activeTab === 'requests' ? (
                    <div>
                      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                          <p className="text-sm text-yellow-700 font-semibold mb-1">Pending Requests</p>
                          <p className="text-2xl font-bold text-yellow-700">{pendingRequests.length}</p>
                        </div>
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                          <p className="text-sm text-blue-700 font-semibold mb-1">Approved Requests</p>
                          <p className="text-2xl font-bold text-blue-700">{approvedRequests.length}</p>
                        </div>
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                          <p className="text-sm text-green-700 font-semibold mb-1">Allocated</p>
                          <p className="text-2xl font-bold text-green-700">{allocatedRequests.length}</p>
                        </div>
                      </div>

                      {pendingRequests.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-xl">
                          <span className="fas fa-check-circle text-5xl text-slate-300 mb-4 block" aria-hidden="true"></span>
                          <p className="text-slate-600 text-lg">No pending requests</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {pendingRequests.map((request) => {
                            const requestId = request.id || request._id;
                            const requesterId = extractId(request.requesterId);
                            const targetId = extractId(request.targetId);
                            
                            const requester = request.requesterType === 'student' 
                              ? students.find(s => {
                                  const sId = s.id || s._id;
                                  return sId === requesterId;
                                })
                              : teachers.find(t => {
                                  const tId = t.id || t._id;
                                  return tId === requesterId;
                                });
                            const target = request.targetType === 'student'
                              ? students.find(s => {
                                  const sId = s.id || s._id;
                                  return sId === targetId;
                                })
                              : teachers.find(t => {
                                  const tId = t.id || t._id;
                                  return tId === targetId;
                                });
                            
                            return (
                              <div key={requestId} className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className={`fas ${request.requesterType === 'student' ? 'fa-user-graduate' : 'fa-chalkboard-teacher'} text-primary text-xl`} aria-hidden="true"></span>
                                      <div>
                                        <h3 className="font-bold text-slate-800 text-lg">
                                          {request.requesterName} → {request.targetName}
                                        </h3>
                                        <p className="text-sm text-slate-600">
                                          {request.requesterType === 'student' ? 'Student' : 'Teacher'} requesting {request.targetType === 'student' ? 'Student' : 'Teacher'}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="ml-8 space-y-2">
                                      <p className="text-sm text-slate-700">
                                        <strong>Requester:</strong> {requester?.email || 'N/A'}
                                      </p>
                                      <p className="text-sm text-slate-700">
                                        <strong>Target:</strong> {target?.email || 'N/A'}
                                      </p>
                                      <p className="text-sm text-slate-700">
                                        <strong>Subjects:</strong> {request.subjects.join(', ')}
                                      </p>
                                      {request.message && (
                                        <p className="text-sm text-slate-600">
                                          <strong>Message:</strong> {request.message}
                                        </p>
                                      )}
                                      <p className="text-xs text-slate-500">
                                        Requested: {formatDate(request.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <button
                                      onClick={() => handleApproveRequest(requestId)}
                                      className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleOpenAllocationModal(request)}
                                      className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-colored transition-all"
                                    >
                                      Allocate
                                    </button>
                                    <button
                                      onClick={() => handleRejectRequest(requestId)}
                                      className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : activeTab === 'students' ? (
                    <div>
                      {students.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-xl">
                          <span className="fas fa-user-graduate text-5xl text-slate-300 mb-4 block" aria-hidden="true"></span>
                          <p className="text-slate-600 text-lg">No students registered yet</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gradient-primary text-white">
                                <th className="px-4 py-3 text-left rounded-tl-xl">Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Phone</th>
                                <th className="px-4 py-3 text-left">Class</th>
                                <th className="px-4 py-3 text-left">Subjects</th>
                                <th className="px-4 py-3 text-left">City</th>
                                <th className="px-4 py-3 text-left rounded-tr-xl">Registered</th>
                              </tr>
                            </thead>
                            <tbody>
                              {students.map((student) => {
                                const studentId = student.id || student._id;
                                return (
                                  <tr
                                    key={studentId}
                                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                                  >
                                    <td className="px-4 py-4 font-semibold text-slate-800">{student.name || 'N/A'}</td>
                                    <td className="px-4 py-4 text-slate-700">{student.email || 'N/A'}</td>
                                    <td className="px-4 py-4 text-slate-700">{student.phone || 'N/A'}</td>
                                    <td className="px-4 py-4 text-slate-700">
                                      {student.class ? `Class ${student.class}` : 'N/A'}
                                    </td>
                                    <td className="px-4 py-4 text-slate-700">
                                      <div className="flex flex-wrap gap-1">
                                        {student.subjects && Array.isArray(student.subjects) && student.subjects.length > 0 ? (
                                          student.subjects.slice(0, 2).map((subject: string, idx: number) => (
                                            <span
                                              key={idx}
                                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                            >
                                              {subject}
                                            </span>
                                          ))
                                        ) : (
                                          <span className="text-slate-400">No subjects</span>
                                        )}
                                        {student.subjects && Array.isArray(student.subjects) && student.subjects.length > 2 && (
                                          <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-full">
                                            +{student.subjects.length - 2}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-700">{student.city || 'N/A'}</td>
                                    <td className="px-4 py-4 text-slate-600 text-sm">
                                      {student.createdAt ? formatDate(student.createdAt) : 'N/A'}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {teachers.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-xl">
                          <span className="fas fa-chalkboard-teacher text-5xl text-slate-300 mb-4 block" aria-hidden="true"></span>
                          <p className="text-slate-600 text-lg">No teachers registered yet</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gradient-primary text-white">
                                <th className="px-4 py-3 text-left rounded-tl-xl">Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Phone</th>
                                <th className="px-4 py-3 text-left">Qualification</th>
                                <th className="px-4 py-3 text-left">Experience</th>
                                <th className="px-4 py-3 text-left">Subjects</th>
                                <th className="px-4 py-3 text-left">City</th>
                                <th className="px-4 py-3 text-left rounded-tr-xl">Registered</th>
                              </tr>
                            </thead>
                            <tbody>
                              {teachers.map((teacher) => {
                                const teacherId = teacher.id || teacher._id;
                                return (
                                  <tr
                                    key={teacherId}
                                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                                  >
                                    <td className="px-4 py-4 font-semibold text-slate-800">{teacher.name || 'N/A'}</td>
                                    <td className="px-4 py-4 text-slate-700">{teacher.email || 'N/A'}</td>
                                    <td className="px-4 py-4 text-slate-700">{teacher.phone || 'N/A'}</td>
                                    <td className="px-4 py-4 text-slate-700">{teacher.qualification || 'N/A'}</td>
                                    <td className="px-4 py-4 text-slate-700">
                                      {teacher.experience ? `${teacher.experience} years` : 'N/A'}
                                    </td>
                                    <td className="px-4 py-4 text-slate-700">
                                      <div className="flex flex-wrap gap-1">
                                        {teacher.subjects && Array.isArray(teacher.subjects) && teacher.subjects.length > 0 ? (
                                          teacher.subjects.slice(0, 2).map((subject: string, idx: number) => (
                                            <span
                                              key={idx}
                                              className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full"
                                            >
                                              {subject}
                                            </span>
                                          ))
                                        ) : (
                                          <span className="text-slate-400">No subjects</span>
                                        )}
                                        {teacher.subjects && Array.isArray(teacher.subjects) && teacher.subjects.length > 2 && (
                                          <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-full">
                                            +{teacher.subjects.length - 2}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-700">{teacher.city || 'N/A'}</td>
                                    <td className="px-4 py-4 text-slate-600 text-sm">
                                      {teacher.createdAt ? formatDate(teacher.createdAt) : 'N/A'}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Allocation Modal */}
      {showAllocationModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Create Allocation</h3>
              <button
                onClick={() => {
                  setShowAllocationModal(false);
                  setSelectedRequest(null);
                  setAllocationFormData({ fees: '', time: '', days: [] });
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="fas fa-times text-xl" aria-hidden="true"></span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>Student:</strong> {selectedRequest.requesterType === 'student' ? selectedRequest.requesterName : selectedRequest.targetName}
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Teacher:</strong> {selectedRequest.requesterType === 'teacher' ? selectedRequest.requesterName : selectedRequest.targetName}
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Subjects:</strong> {selectedRequest.subjects.join(', ')}
                </p>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Fees per Hour (₹)</label>
                <input
                  type="number"
                  value={allocationFormData.fees}
                  onChange={(e) => setAllocationFormData(prev => ({ ...prev, fees: e.target.value }))}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Enter fees"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Time</label>
                <input
                  type="text"
                  value={allocationFormData.time}
                  onChange={(e) => setAllocationFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="e.g., 4:00 PM - 5:00 PM"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Select Days</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <label key={day} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allocationFormData.days.includes(day)}
                        onChange={() => handleDayChange(day)}
                        className="w-5 h-5 text-primary rounded"
                      />
                      <span className="text-slate-700 text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateAllocation}
                  className="flex-1 bg-gradient-primary text-white py-3 px-6 rounded-lg font-semibold hover:shadow-colored transition-all"
                >
                  Create Allocation
                </button>
                <button
                  onClick={() => {
                    setShowAllocationModal(false);
                    setSelectedRequest(null);
                    setAllocationFormData({ fees: '', time: '', days: [] });
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

