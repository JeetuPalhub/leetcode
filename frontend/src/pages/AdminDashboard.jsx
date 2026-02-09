import React, { useEffect } from "react";
import { useAdminStore } from "../store/useAdminStore";
import {
    Users,
    BookOpen,
    Terminal,
    Trophy,
    TrendingUp,
    Activity,
    CheckCircle2,
    BarChart3,
    ChevronRight,
    Plus
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    const { stats, getStats, isLoading } = useAdminStore();

    useEffect(() => {
        getStats();
    }, [getStats]);

    if (isLoading && !stats) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!stats) return <div className="text-center py-20">Failed to load platform stats.</div>;

    const { counts, successRate, trend, popularProblems, recentSubmissions } = stats;

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Platform Analytics
                    </h1>
                    <p className="text-base-content/60 mt-1">Real-time overview of LeetCode Clone's health and growth.</p>
                </div>
                <Link to="/add-problem" className="btn btn-primary gap-2 shadow-lg shadow-primary/20">
                    <Plus className="w-5 h-5" />
                    Create Problem
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Users className="w-6 h-6" />}
                    title="Total Users"
                    value={counts.users}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={<BookOpen className="w-6 h-6" />}
                    title="Problems"
                    value={counts.problems}
                    color="bg-purple-500"
                />
                <StatCard
                    icon={<Terminal className="w-6 h-6" />}
                    title="Submissions"
                    value={counts.submissions}
                    color="bg-orange-500"
                />
                <StatCard
                    icon={<Trophy className="w-6 h-6" />}
                    title="Success Rate"
                    value={`${successRate}%`}
                    color="bg-emerald-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Submissions Trend Chart (CSS based) */}
                <div className="lg:col-span-2 card bg-base-100 shadow-xl border border-white/5">
                    <div className="card-body">
                        <h3 className="card-title text-xl mb-6 flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-primary" />
                            Submission Trend (Last 7 Days)
                        </h3>

                        <div className="flex items-end justify-between h-64 gap-2 pt-10">
                            {trend.map((day, idx) => {
                                const max = Math.max(...trend.map(d => d.count), 1);
                                const height = (day.count / max) * 100;
                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="relative w-full flex flex-col items-center">
                                            <div
                                                className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-lg transition-all duration-500 relative"
                                                style={{ height: `${height}%` }}
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-base-300 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    {day.count} subs
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] md:text-xs text-base-content/40 font-mono">
                                            {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Popular Problems */}
                <div className="card bg-base-100 shadow-xl border border-white/5">
                    <div className="card-body p-0 overflow-hidden">
                        <div className="p-6 pb-0">
                            <h3 className="card-title text-xl mb-1 flex items-center gap-2">
                                <TrendingUp className="w-6 h-6 text-secondary" />
                                Hot Problems
                            </h3>
                            <p className="text-xs text-base-content/40 mb-6">Most attempts this week</p>
                        </div>

                        <div className="divide-y divide-white/5">
                            {popularProblems.map((prob, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 hover:bg-base-200 transition-colors">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-yellow-500 text-black' : 'bg-base-300'
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold truncate text-sm">{prob.title}</p>
                                        <span className={`text-[10px] font-bold uppercase ${prob.difficulty === 'EASY' ? 'text-success' :
                                                prob.difficulty === 'MEDIUM' ? 'text-warning' : 'text-error'
                                            }`}>
                                            {prob.difficulty}
                                        </span>
                                    </div>
                                    <div className="text-xs font-black opacity-40">
                                        {prob.count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Submissions Feed */}
            <div className="card bg-base-100 shadow-xl border border-white/5">
                <div className="card-body">
                    <h3 className="card-title text-xl mb-6 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-orange-500" />
                        Recent Activity
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Problem</th>
                                    <th>Status</th>
                                    <th>Time</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSubmissions.map((sub, idx) => (
                                    <tr key={idx} className="hover">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-8 h-8">
                                                        <img src={sub.user.image || "https://avatar.iran.liara.run/public/boy"} alt={sub.user.name} />
                                                    </div>
                                                </div>
                                                <span className="font-bold text-sm">{sub.user.name}</span>
                                            </div>
                                        </td>
                                        <td><span className="text-sm">{sub.problem.title}</span></td>
                                        <td>
                                            <div className={`badge badge-sm font-bold ${sub.status === 'Accepted' ? 'badge-success' : 'badge-error'
                                                }`}>
                                                {sub.status}
                                            </div>
                                        </td>
                                        <td className="text-xs opacity-60">
                                            {new Date(sub.createdAt).toLocaleTimeString()}
                                        </td>
                                        <td>
                                            <button className="btn btn-ghost btn-xs">View Code</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, color }) => (
    <div className="card bg-base-100 shadow-xl border border-white/5 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-all group-hover:scale-150 ${color}`}></div>
        <div className="card-body p-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg ${color}`}>
                {icon}
            </div>
            <p className="text-xs font-bold text-base-content/40 uppercase tracking-wider">{title}</p>
            <h2 className="text-4xl font-black mt-1">{value}</h2>
        </div>
    </div>
);

export default AdminDashboard;
