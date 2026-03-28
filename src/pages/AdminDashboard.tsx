import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle, Trash2, Users, FileText, Loader2, AlertTriangle, Megaphone, Plus } from 'lucide-react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo?: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function AdminDashboard() {
  const { role } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);

  useEffect(() => {
    if (role !== 'admin') return;

    const unsubApps = onSnapshot(collection(db, 'applications'), (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'applications');
    });

    const unsubAnnouncements = onSnapshot(collection(db, 'announcements'), (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'announcements');
    });

    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'users');
      }
    };
    fetchUsers();

    setLoading(false);
    return () => {
      unsubApps();
      unsubAnnouncements();
    };
  }, [role]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'applications', id), { status: newStatus });
    } catch (error) {
      setErrorMsg("Failed to update status.");
      handleFirestoreError(error, OperationType.UPDATE, `applications/${id}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'applications', id));
      setDeleteConfirmId(null);
    } catch (error) {
      setErrorMsg("Failed to delete application.");
      handleFirestoreError(error, OperationType.DELETE, `applications/${id}`);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    setIsAddingAnnouncement(true);
    try {
      await addDoc(collection(db, 'announcements'), {
        ...newAnnouncement,
        createdAt: serverTimestamp(),
      });
      setNewAnnouncement({ title: '', content: '' });
    } catch (error) {
      setErrorMsg("Failed to add announcement.");
      handleFirestoreError(error, OperationType.CREATE, 'announcements');
    } finally {
      setIsAddingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (error) {
      setErrorMsg("Failed to delete announcement.");
      handleFirestoreError(error, OperationType.DELETE, `announcements/${id}`);
    }
  };

  if (role !== 'admin') {
    return <div className="p-8 text-center text-red-500 font-bold">Access Denied. Admins only.</div>;
  }

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage users, loan applications, and CMS content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" />
              <p>{errorMsg}</p>
              <button onClick={() => setErrorMsg(null)} className="ml-auto text-rose-500 hover:text-rose-700">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Recent Applications
              </h2>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                {applications.length} Total
              </span>
            </div>
            <div className="divide-y divide-slate-200">
              {applications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No applications found.</div>
              ) : (
                applications.map(app => (
                  <div key={app.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-900">{app.name}</h3>
                        <p className="text-sm text-slate-500">{app.contact} • ₹{app.amount}</p>
                        <p className="text-xs text-slate-400 mt-1">Purpose: {app.purpose}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                          app.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {app.status}
                        </span>
                        
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdateStatus(app.id, 'approved')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleUpdateStatus(app.id, 'rejected')} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Reject">
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                        <button onClick={() => setDeleteConfirmId(app.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Registered Users
              </h2>
            </div>
            <div className="divide-y divide-slate-200 max-h-[400px] overflow-y-auto">
              {users.map(u => (
                <div key={u.id} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold shrink-0">
                    {u.displayName ? u.displayName.charAt(0) : (u.email ? u.email.charAt(0).toUpperCase() : 'U')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate">{u.displayName || 'No Name'}</p>
                    <p className="text-xs text-slate-500 truncate">{u.email}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CMS: Announcements */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-600" />
                Announcements (CMS)
              </h2>
            </div>
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <form onSubmit={handleAddAnnouncement} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Announcement Title" 
                  required
                  value={newAnnouncement.title}
                  onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none"
                />
                <textarea 
                  placeholder="Content..." 
                  required
                  rows={2}
                  value={newAnnouncement.content}
                  onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none resize-none"
                />
                <button 
                  type="submit"
                  disabled={isAddingAnnouncement}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isAddingAnnouncement ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add Announcement
                </button>
              </form>
            </div>
            <div className="divide-y divide-slate-200 max-h-[300px] overflow-y-auto">
              {announcements.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">No announcements.</div>
              ) : (
                announcements.map(ann => (
                  <div key={ann.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{ann.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ann.content}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Deletion</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to delete this application? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
