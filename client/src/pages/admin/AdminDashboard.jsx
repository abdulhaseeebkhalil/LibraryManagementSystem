import { useEffect, useState } from "react";
import { getAllUsers, getAllBooks, getAllBorrows, addBook, registerNewAdmin } from "../../api/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, books: 0, activeLoans: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data payload states
  const [allUsers, setAllUsers] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [allBorrows, setAllBorrows] = useState([]);

  // Action Modals state
  const [showAddBook, setShowAddBook] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // List View Modals state
  const [showUsersList, setShowUsersList] = useState(false);
  const [showBooksList, setShowBooksList] = useState(false);
  const [showLoansList, setShowLoansList] = useState(false);

  // Forms state
  const [bookForm, setBookForm] = useState({ title: '', author: '', description: '', price: '', isbn: '', genre: '', publishedDate: '', quantity: '', coverImage: '' });
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, booksRes, borrowsRes] = await Promise.all([
        getAllUsers(),
        getAllBooks(),
        getAllBorrows()
      ]);

      const fetchedUsers = usersRes.data.users || [];
      const fetchedBooks = booksRes.data.books || [];
      const fetchedBorrows = borrowsRes.data.borrowedBooks || [];

      setAllUsers(fetchedUsers);
      setAllBooks(fetchedBooks);
      setAllBorrows(fetchedBorrows);

      setStats({
        users: usersRes.data.count || 0,
        books: fetchedBooks.length,
        activeLoans: fetchedBorrows.length
      });

      // Map recent borrows to activity table
      const activity = fetchedBorrows.slice(0, 5).map(b => ({
        name: b.user?.name || "Unknown User",
        action: `Borrowed '${b.bookTitle}'`,
        time: new Date(b.borrowedDate).toLocaleDateString(),
        status: b.returned ? "Returned" : "Active",
        color: b.returned ? "green" : "orange"
      }));
      setRecentActivity(activity.length ? activity : [
        { name: "System", action: "Dashboard initialized", time: "Just now", status: "Success", color: "green" }
      ]);

    } catch (error) {
      console.error("Failed to fetch admin stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addBook(bookForm);
      alert("Book added successfully!");
      setShowAddBook(false);
      setBookForm({ title: '', author: '', description: '', price: '', isbn: '', genre: '', publishedDate: '', quantity: '', coverImage: '' });
      fetchDashboardData(); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add book");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await registerNewAdmin(adminForm);
      alert("Admin created successfully!");
      setShowAddAdmin(false);
      setAdminForm({ name: '', email: '', password: '' });
      fetchDashboardData(); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center pt-8 relative pb-20">
      <div className="w-full max-w-6xl animate-fade-in-up px-4 sm:px-0">
        
        {/* Admin Header */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider rounded-lg">Admin View</span>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Control Center
              </h1>
            </div>
            <p className="text-gray-500">System overview and management tools.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowAddAdmin(true)}
              className="bg-white border-2 border-rose-100 text-rose-600 px-5 py-2.5 rounded-full font-medium hover:bg-rose-50 hover:border-rose-200 transition shadow-sm flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>🛡️</span> Add Admin
            </button>
            <button 
              onClick={() => setShowAddBook(true)}
              className="bg-gray-900 text-white px-5 py-2.5 rounded-full font-medium hover:bg-gray-800 transition shadow-md hover:shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Add New Book
            </button>
          </div>
        </div>

        {/* Admin Stats Cards */}
        {loading ? (
           <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
           </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              
              {/* Users Stat Card */}
              <div onClick={() => setShowUsersList(true)} className="cursor-pointer bg-white/70 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">👥</div>
                </div>
                <div>
                  <h3 className="text-gray-500 font-medium text-sm mb-1 flex items-center gap-1">Total Users <span className="text-[10px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full ml-1">View</span></h3>
                  <p className="text-3xl font-black text-gray-900">{stats.users}</p>
                </div>
              </div>

              {/* Books Stat Card */}
              <div onClick={() => setShowBooksList(true)} className="cursor-pointer bg-white/70 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">📚</div>
                </div>
                <div>
                  <h3 className="text-gray-500 font-medium text-sm mb-1 flex items-center gap-1">Total Books <span className="text-[10px] text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full ml-1">View</span></h3>
                  <p className="text-3xl font-black text-gray-900">{stats.books}</p>
                </div>
              </div>

              {/* Loans Stat Card */}
              <div onClick={() => setShowLoansList(true)} className="cursor-pointer bg-white/70 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg">🔄</div>
                </div>
                <div>
                  <h3 className="text-gray-500 font-medium text-sm mb-1 flex items-center gap-1">Active Loans <span className="text-[10px] text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full ml-1">View</span></h3>
                  <p className="text-3xl font-black text-gray-900">{stats.activeLoans}</p>
                </div>
              </div>

              {/* Overdue Stat Card */}
              <div className="bg-white/70 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-lg">⚠️</div>
                </div>
                <div>
                  <h3 className="text-gray-500 font-medium text-sm mb-1 text-rose-500">Overdue Status</h3>
                  <p className="text-3xl font-black text-gray-900">0</p>
                </div>
              </div>

            </div>

            {/* Recent Activity Table */}
            <div className="bg-white/70 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent System Activity</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-sm font-semibold text-gray-500 pb-4">User</th>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-500 pb-4">Action</th>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-500 pb-4">Time</th>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-500 pb-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4 font-medium text-gray-900">{row.name}</td>
                        <td className="py-4 px-4 text-gray-600">{row.action}</td>
                        <td className="py-4 px-4 text-gray-500 text-sm">{row.time}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 bg-${row.color}-100 text-${row.color}-700 text-xs font-bold rounded-full`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- ADD BOOK MODAL --- */}
      {showAddBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowAddBook(false)}></div>
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl relative z-10 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">📚</span> Add New Book
            </h2>
            <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" placeholder="Title" required value={bookForm.title} onChange={e => setBookForm({...bookForm, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition" />
              <input type="text" placeholder="Author" required value={bookForm.author} onChange={e => setBookForm({...bookForm, author: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition" />
              <input type="text" placeholder="Genre" required value={bookForm.genre} onChange={e => setBookForm({...bookForm, genre: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition" />
              <input type="text" placeholder="ISBN" required value={bookForm.isbn} onChange={e => setBookForm({...bookForm, isbn: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition" />
              <input type="number" placeholder="Price" required value={bookForm.price} onChange={e => setBookForm({...bookForm, price: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition" />
              <input type="number" placeholder="Quantity" required value={bookForm.quantity} onChange={e => setBookForm({...bookForm, quantity: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition" />
              <div className="md:col-span-2">
                <input type="url" placeholder="Cover Image URL" required value={bookForm.coverImage} onChange={e => setBookForm({...bookForm, coverImage: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition" />
              </div>
              <div className="md:col-span-2">
                <textarea placeholder="Description" required rows="3" value={bookForm.description} onChange={e => setBookForm({...bookForm, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition"></textarea>
              </div>
              <div className="md:col-span-2">
                <input type="date" required value={bookForm.publishedDate} onChange={e => setBookForm({...bookForm, publishedDate: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition text-gray-500" />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowAddBook(false)} className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900 transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-md disabled:opacity-70 disabled:cursor-wait">
                  {isSubmitting ? "Adding..." : "Add Book Database"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD ADMIN MODAL --- */}
      {showAddAdmin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowAddAdmin(false)}></div>
          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-2xl">🛡️</span> Add Administrator
            </h2>
            <p className="text-gray-500 mb-6 text-sm">Create a new user with full system privileges.</p>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <input type="text" placeholder="Full Name" required value={adminForm.name} onChange={e => setAdminForm({...adminForm, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition" />
              <input type="email" placeholder="Admin Email" required value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition" />
              <input type="password" placeholder="Secure Password" required minLength="8" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition" />
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowAddAdmin(false)} className="px-5 py-3 font-medium text-gray-600 hover:text-gray-900 transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition shadow-md disabled:opacity-70 disabled:cursor-wait">
                  {isSubmitting ? "Creating..." : "Create Admin Route"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ALL USERS LIST MODAL --- */}
      {showUsersList && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowUsersList(false)}></div>
          <div className="bg-white rounded-3xl p-8 w-full max-w-4xl relative z-10 shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>👥</span> All Registered Users
              </h2>
              <button onClick={() => setShowUsersList(false)} className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors">&times;</button>
            </div>
            
            <div className="overflow-x-auto overflow-y-auto w-full pr-2">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <th className="py-3 px-4 font-semibold text-gray-600 rounded-tl-lg">Name</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Email</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Role</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 rounded-tr-lg">Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-6 text-gray-500">No users found.</td></tr>
                  ) : allUsers.map((u, i) => (
                    <tr key={u._id || i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-900">{u.name}</td>
                      <td className="py-4 px-4 text-gray-600">{u.email}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${u.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-700'}`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {u.accountVerified ? (
                          <span className="text-green-500 font-bold bg-green-50 px-2 py-1 rounded-md text-xs">✓ Yes</span>
                        ) : (
                          <span className="text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded-md text-xs">✗ No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- ALL BOOKS LIST MODAL --- */}
      {showBooksList && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowBooksList(false)}></div>
          <div className="bg-white rounded-3xl p-8 w-full max-w-5xl relative z-10 shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>📚</span> Library Catalog
              </h2>
              <button onClick={() => setShowBooksList(false)} className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors">&times;</button>
            </div>
            
            <div className="overflow-x-auto overflow-y-auto w-full pr-2">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <th className="py-3 px-4 font-semibold text-gray-600 rounded-tl-lg">Title</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Author</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Genre</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Qty</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 rounded-tr-lg">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {allBooks.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-6 text-gray-500">No books found in database.</td></tr>
                  ) : allBooks.map((b, i) => (
                    <tr key={b._id || i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-900">{b.title}</td>
                      <td className="py-4 px-4 text-gray-600">{b.author}</td>
                      <td className="py-4 px-4 text-gray-500">
                        <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider">{b.genre}</span>
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-700">{b.quantity}</td>
                      <td className="py-4 px-4 font-medium text-green-600">${b.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- ALL LOANS LIST MODAL --- */}
      {showLoansList && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowLoansList(false)}></div>
          <div className="bg-white rounded-3xl p-8 w-full max-w-5xl relative z-10 shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>🔄</span> Active Borrowing Records
              </h2>
              <button onClick={() => setShowLoansList(false)} className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors">&times;</button>
            </div>
            
            <div className="overflow-x-auto overflow-y-auto w-full pr-2">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <th className="py-3 px-4 font-semibold text-gray-600 rounded-tl-lg">User</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Book Title</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Borrow Date</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allBorrows.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-6 text-gray-500">No active loans found.</td></tr>
                  ) : allBorrows.map((b, i) => (
                    <tr key={b._id || i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-900">{b.user?.name || "Unknown"}</td>
                      <td className="py-4 px-4 text-indigo-600 font-semibold">{b.bookTitle}</td>
                      <td className="py-4 px-4 text-gray-500">{new Date(b.borrowedDate).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md ${b.returned ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                          {b.returned ? 'Returned' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
