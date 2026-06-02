import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, FolderKanban, Award, Trophy,
  ShieldCheck, Clock3, CheckCircle2, XCircle,
  ArrowRight, BarChart3, Search, Filter, UserCheck, UserX,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import { getAdminStats } from "../api/adminApi";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }),
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usersSearch, setUsersSearch] = useState("");

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader /></div></DashboardLayout>;

  const cards = [
    { label: "Total Users",          value: stats?.totalUsers                || 0, icon: Users,         color: "text-blue-400",   bg: "bg-blue-500/10"   },
    { label: "Total Projects",        value: stats?.totalProjects             || 0, icon: FolderKanban,  color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Certifications",        value: stats?.totalCertifications       || 0, icon: Award,         color: "text-green-400",  bg: "bg-green-500/10"  },
    { label: "Achievements",          value: stats?.totalAchievements         || 0, icon: Trophy,        color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Pending Verifications", value: stats?.pendingRequests           || 0, icon: Clock3,        color: "text-orange-400", bg: "bg-orange-500/10" },
    { label: "Approved",              value: stats?.approvedRequests          || 0, icon: CheckCircle2,  color: "text-emerald-400",bg: "bg-emerald-500/10"},
    { label: "Rejected",              value: stats?.rejectedRequests          || 0, icon: XCircle,       color: "text-red-400",    bg: "bg-red-500/10"    },
    { label: "Total Verifications",   value: stats?.totalVerificationRequests || 0, icon: ShieldCheck,   color: "text-cyan-400",   bg: "bg-cyan-500/10"   },
  ];

  const mockUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", verified: true, projects: 5, role: "user" },
    { id: 2, name: "Sarah Smith", email: "sarah@example.com", verified: false, projects: 3, role: "user" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", verified: true, projects: 8, role: "user" },
    { id: 4, name: "Emily Brown", email: "emily@example.com", verified: false, projects: 2, role: "user" },
  ];

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(usersSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(usersSearch.toLowerCase())
  );

  return (
    <DashboardLayout>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <BarChart3 size={24} className="text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <p className="text-slate-400">Platform-wide statistics and management overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i * 0.08}
              className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={18} className={card.color} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
              <div className="text-slate-500 text-xs">{card.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Pending Alert */}
      {(stats?.pendingRequests || 0) > 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.7}
          className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 mb-6 flex items-center justify-between hover:border-orange-500/40 transition-all duration-300">
          <div className="flex items-center gap-3">
            <Clock3 size={20} className="text-orange-400 animate-pulse" />
            <div>
              <p className="text-white font-semibold">{stats.pendingRequests} Pending Verification Request{stats.pendingRequests > 1 ? "s" : ""}</p>
              <p className="text-slate-400 text-sm">Review and approve or reject user submissions.</p>
            </div>
          </div>
          <Link to="/admin/verifications"
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all px-4 py-2 rounded-xl text-white text-sm font-semibold">
            Review <ArrowRight size={16} />
          </Link>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.8}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/admin/verifications"
            className="flex items-center justify-between bg-gradient-to-br from-slate-800 to-slate-900 hover:from-blue-900/30 hover:to-slate-900 hover:border-blue-500/20 transition-all rounded-xl p-4 border border-slate-800 hover:border-slate-700 group">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-white font-semibold text-sm">Manage Verifications</p>
                <p className="text-slate-500 text-xs">Review all verification requests</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-500 group-hover:text-blue-400 transition" />
          </Link>
          <Link to="/admin/users"
            className="flex items-center justify-between bg-gradient-to-br from-slate-800 to-slate-900 hover:from-purple-900/30 hover:to-slate-900 hover:border-purple-500/20 transition-all rounded-xl p-4 border border-slate-800 hover:border-slate-700 group">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-white font-semibold text-sm">Manage Users</p>
                <p className="text-slate-500 text-xs">View and manage all users</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-500 group-hover:text-purple-400 transition" />
          </Link>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.9}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users size={20} className="text-blue-400" />
            Recent Users
          </h2>
        </div>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={usersSearch}
            onChange={(e) => setUsersSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">User</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Email</th>
                <th className="text-center py-3 px-4 text-slate-400 font-semibold">Projects</th>
                <th className="text-center py-3 px-4 text-slate-400 font-semibold">Status</th>
                <th className="text-center py-3 px-4 text-slate-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4">
                      <span className="text-white font-medium">{user.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{user.email}</td>
                    <td className="py-3 px-4 text-center text-white font-semibold">{user.projects}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                        user.verified
                          ? "bg-green-500/15 border-green-500/20 text-green-400"
                          : "bg-yellow-500/15 border-yellow-500/20 text-yellow-400"
                      }`}>
                        {user.verified ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
                        {user.verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center flex items-center justify-center gap-2">
                      <button className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition">
                        <UserCheck size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition">
                        <UserX size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

