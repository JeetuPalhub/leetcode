import React, { useEffect } from "react";
import { useLeaderboardStore } from "../store/useLeaderboardStore";
import { Award, Trophy, Medal, Star } from "lucide-react";
import { Link } from "react-router-dom";

const LeaderboardPage = () => {
    const { leaderboard, myRank, getLeaderboard, getMyRank, isLoading } = useLeaderboardStore();

    useEffect(() => {
        getLeaderboard();
        getMyRank();
    }, []);

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
            case 2: return <Medal className="w-5 h-5 text-slate-400" />;
            case 3: return <Medal className="w-5 h-5 text-amber-700" />;
            default: return <span className="text-sm font-medium text-base-content/50">#{rank}</span>;
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-2.5 bg-primary/10 rounded-xl mb-4">
                        <Award className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Global <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Leaderboard</span>
                    </h1>
                    <p className="text-base-content/60 max-w-lg mx-auto">
                        Compete with the best developers worldwide. Solve problems and climb the ranks!
                    </p>
                </div>

                {/* My Rank Card */}
                {myRank && (
                    <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl p-6 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Star className="w-24 h-24 rotate-12" />
                        </div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-primary-content/60 text-xs font-medium uppercase tracking-wider mb-1">Your Standing</p>
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    Ranked <span className="bg-white/20 px-3 py-1 rounded-lg">#{myRank.rank}</span>
                                </h2>
                            </div>
                            <div className="text-right">
                                <p className="text-primary-content/60 text-xs font-medium uppercase tracking-wider mb-1">Total Points</p>
                                <p className="text-3xl font-bold">{myRank.points} <span className="text-sm opacity-70">pts</span></p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Leaderboard Table */}
                <div className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-base-200/50 text-xs uppercase tracking-wider text-base-content/50">
                                <th className="font-semibold">Rank</th>
                                <th className="font-semibold">Developer</th>
                                <th className="font-semibold">Success</th>
                                <th className="font-semibold">Points</th>
                                <th className="font-semibold">Solved</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td><div className="h-4 w-8 bg-base-200 rounded"></div></td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-base-200 rounded-xl"></div>
                                                <div className="h-4 w-24 bg-base-200 rounded"></div>
                                            </div>
                                        </td>
                                        <td><div className="h-4 w-12 bg-base-200 rounded"></div></td>
                                        <td><div className="h-4 w-10 bg-base-200 rounded"></div></td>
                                        <td><div className="h-4 w-8 bg-base-200 rounded"></div></td>
                                    </tr>
                                ))
                            ) : (
                                leaderboard.map((user) => (
                                    <tr
                                        key={user.id}
                                        className={`hover:bg-base-200/50 transition-colors ${user.id === myRank?.id ? 'bg-primary/5' : ''}`}
                                    >
                                        <td className="font-medium">{getRankIcon(user.rank)}</td>
                                        <td>
                                            <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-base-200">
                                                    {user.image ? (
                                                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-base-content/40 font-bold">
                                                            {user.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-xs text-base-content/50">@{user.name?.toLowerCase().replace(/\s/g, '')}</p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-base-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-success rounded-full"
                                                        style={{ width: `${user.successRate || 0}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-base-content/50">{user.successRate || 0}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="font-semibold text-primary">{user.points}</span>
                                        </td>
                                        <td>
                                            <span className="text-base-content/70">{user.problemsSolved}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {!isLoading && leaderboard.length === 0 && (
                        <div className="text-center py-12">
                            <Trophy className="w-12 h-12 text-base-content/20 mx-auto mb-3" />
                            <p className="text-base-content/50">No rankings yet. Be the first to solve problems!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
