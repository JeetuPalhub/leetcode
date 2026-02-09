import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Users, Clock, ChevronRight,
    BookOpen, BarChart2, Hash, CheckCircle2,
    Timer, AlertCircle
} from 'lucide-react';
import { useContestStore } from '../store/useContestStore';
import { useSocket } from '../hooks/useSocket';

const ContestDetails = () => {
    const { id } = useParams();
    const { currentContest, fetchContestById, registerForContest, leaderboard, fetchLeaderboard, loading } = useContestStore();
    const [timeLeft, setTimeLeft] = useState('');
    const [activeTab, setActiveTab] = useState('problems');

    // Join socket room for real-time leaderboard updates
    const { subscribeToEvent } = useSocket(`contest_${id}`);

    useEffect(() => {
        fetchContestById(id);
        fetchLeaderboard(id);

        // Listen for real-time score updates
        subscribeToEvent('leaderboard_update', () => {
            fetchLeaderboard(id);
        });
    }, [id, fetchContestById, fetchLeaderboard, subscribeToEvent]);

    // Timer Logic
    useEffect(() => {
        if (!currentContest) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(currentContest.endTime).getTime();
            const start = new Date(currentContest.startTime).getTime();

            let target = end;
            let prefix = 'Ends in: ';

            if (now < start) {
                target = start;
                prefix = 'Starts in: ';
            } else if (now > end) {
                setTimeLeft('Contest Ended');
                clearInterval(timer);
                return;
            }

            const diff = target - now;
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${prefix}${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, [currentContest]);

    if (loading && !currentContest) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <span className="loading loading-bars loading-lg text-primary"></span>
                <p className="text-xl font-bold animate-pulse">Initializing Contest Environment...</p>
            </div>
        );
    }

    if (!currentContest) return null;

    const isLive = new Date() >= new Date(currentContest.startTime) && new Date() <= new Date(currentContest.endTime);
    const isFinished = new Date() > new Date(currentContest.endTime);

    return (
        <div className="min-h-screen bg-base-300">
            {/* Header */}
            <div className="bg-base-200 border-b border-white/5 py-8">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Link to="/contests" className="btn btn-ghost btn-sm px-2 opacity-50 hover:opacity-100">
                                    <ChevronRight className="w-4 h-4 rotate-180" />
                                    Back to Contests
                                </Link>
                                <span className="badge badge-primary badge-outline font-bold">Round #{currentContest.id.slice(0, 4)}</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tight">{currentContest.title}</h1>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border font-mono font-black text-xl shadow-xl ${isLive ? 'bg-success/10 border-success/30 text-success' : 'bg-primary/10 border-primary/30 text-primary'}`}>
                                <Timer className={`w-6 h-6 ${isLive ? 'animate-spin-slow' : ''}`} />
                                {timeLeft}
                            </div>
                            {!currentContest.isRegistered && isLive && (
                                <button
                                    onClick={() => registerForContest(id)}
                                    className="btn btn-primary btn-sm px-8"
                                >
                                    Register Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Navigation & Info */}
                    <div className="space-y-6">
                        <div className="card bg-base-200 border border-white/5 p-2 overflow-hidden">
                            <button
                                onClick={() => setActiveTab('problems')}
                                className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all ${activeTab === 'problems' ? 'bg-primary text-primary-content shadow-lg' : 'hover:bg-white/5'}`}
                            >
                                <BookOpen className="w-5 h-5" />
                                <span className="font-bold">Problems</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('leaderboard')}
                                className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all ${activeTab === 'leaderboard' ? 'bg-primary text-primary-content shadow-lg' : 'hover:bg-white/5'}`}
                            >
                                <BarChart2 className="w-5 h-5" />
                                <span className="font-bold">Leaderboard</span>
                                {isLive && <div className="ml-auto w-2 h-2 rounded-full bg-base-100 animate-pulse" />}
                            </button>
                        </div>

                        <div className="card bg-base-200 border border-white/5 p-6">
                            <h3 className="text-sm font-black uppercase opacity-30 mb-4 tracking-widest">Contest Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 opacity-60">
                                        <Users className="w-4 h-4" /> Participants
                                    </div>
                                    <span className="font-bold">{currentContest._count?.registrations}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 opacity-60">
                                        <Clock className="w-4 h-4" /> Duration
                                    </div>
                                    <span className="font-bold">
                                        {Math.round((new Date(currentContest.endTime) - new Date(currentContest.startTime)) / (1000 * 60 * 60))} Hours
                                    </span>
                                </div>
                            </div>
                        </div>

                        {!currentContest.isRegistered && !isFinished && (
                            <div className="alert alert-warning rounded-2xl border-none shadow-xl">
                                <AlertCircle className="w-6 h-6" />
                                <div>
                                    <h4 className="font-bold">Not Registered!</h4>
                                    <p className="text-xs">You must register to have your submissions counted for the leaderboard.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Main Content */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {activeTab === 'problems' ? (
                                <motion.div
                                    key="problems"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    {currentContest.problems?.map((p, idx) => (
                                        <Link
                                            key={p.id}
                                            to={isLive || isFinished ? `/problem/${p.problem.id}?contestId=${id}` : '#'}
                                            className={`card group bg-base-200 border border-white/5 hover:border-primary/50 p-6 flex flex-row items-center gap-6 transition-all ${(!isLive && !isFinished) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-base-300 flex items-center justify-center text-2xl font-black group-hover:bg-primary group-hover:text-primary-content transition-colors">
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-xl font-bold">{p.problem.title}</h3>
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${p.problem.difficulty === 'EASY' ? 'bg-success/20 text-success' : p.problem.difficulty === 'MEDIUM' ? 'bg-warning/20 text-warning' : 'bg-error/20 text-error'}`}>
                                                        {p.problem.difficulty}
                                                    </span>
                                                </div>
                                                <p className="text-xs opacity-50 font-bold uppercase tracking-wider">
                                                    Worth {p.points} Points
                                                </p>
                                            </div>
                                            {(isLive || isFinished) && <ChevronRight className="w-6 h-6 opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all" />}
                                        </Link>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="leaderboard"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="card bg-base-200 border border-white/5 overflow-hidden"
                                >
                                    <table className="table w-full">
                                        <thead>
                                            <tr className="bg-base-300">
                                                <th className="font-black uppercase text-[10px] tracking-widest text-center">Rank</th>
                                                <th className="font-black uppercase text-[10px] tracking-widest">User</th>
                                                <th className="font-black uppercase text-[10px] tracking-widest text-center">Solved</th>
                                                <th className="font-black uppercase text-[10px] tracking-widest text-right">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leaderboard.map((entry, idx) => (
                                                <tr key={entry.user.id} className="hover:bg-white/5 border-white/5">
                                                    <td className="text-center font-bold">
                                                        <div className="flex justify-center">
                                                            {idx === 0 ? <Trophy className="w-5 h-5 text-yellow-500" /> :
                                                                idx === 1 ? <Trophy className="w-5 h-5 text-gray-400" /> :
                                                                    idx === 2 ? <Trophy className="w-5 h-5 text-amber-600" /> :
                                                                        <span className="opacity-40">{idx + 1}</span>}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center gap-3">
                                                            <div className="avatar">
                                                                <div className="w-8 rounded-full border border-primary/20">
                                                                    <img src={entry.user.image || "https://avatar.iran.liara.run/public/boy"} />
                                                                </div>
                                                            </div>
                                                            <div className="font-bold">{entry.user.name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="flex justify-center gap-1">
                                                            {entry.solvedProblems.map((p, i) => (
                                                                <div key={i} className="w-2 h-2 rounded-full bg-success" title="Solved" />
                                                            ))}
                                                            {Array.from({ length: (currentContest.problems?.length || 0) - entry.solvedCount }).map((_, i) => (
                                                                <div key={i} className="w-2 h-2 rounded-full bg-base-300" title="Not Solved" />
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="text-right">
                                                        <span className="font-black text-primary text-lg">{entry.totalScore}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {leaderboard.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-20 opacity-30 italic">
                                                        Waiting for the first brave legend...
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContestDetails;
