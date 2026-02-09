import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles, Target, ChevronRight,
    Layers, Zap, BrainCircuit, Rocket
} from 'lucide-react';
import { useRoadmapStore } from '../store/useRoadmapStore';

const Roadmap = () => {
    const { roadmap, fetchRoadmap, generateRoadmap, loading } = useRoadmapStore();

    useEffect(() => {
        fetchRoadmap();
    }, [fetchRoadmap]);

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
                {/* Header */}
                <header className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
                    >
                        <BrainCircuit className="w-4 h-4" />
                        AI Powered Learning Path
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Your Personal <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Roadmap</span>
                    </h1>
                    <p className="text-base-content/60 max-w-2xl mx-auto mb-8">
                        We analyze your performance to craft the optimal learning path for your career goals.
                    </p>

                    <button
                        onClick={generateRoadmap}
                        disabled={loading}
                        className={`btn btn-primary gap-2 ${loading ? 'loading' : ''}`}
                    >
                        {!loading && <Zap className="w-5 h-5" />}
                        {roadmap ? 'Regenerate Path' : 'Generate My Roadmap'}
                    </button>
                </header>

                {!roadmap && !loading && (
                    <div className="bg-base-100 rounded-2xl border border-base-200 p-12 text-center max-w-lg mx-auto">
                        <div className="w-16 h-16 bg-base-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Target className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No Roadmap Yet</h2>
                        <p className="text-base-content/50 text-sm">
                            Click the button above to let AI analyze your data and build your personalized path.
                        </p>
                    </div>
                )}

                {roadmap && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Progress Sidebar */}
                        <div className="md:col-span-1 space-y-4">
                            <div className="bg-base-100 rounded-2xl border border-base-200 p-5">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/40 mb-4 text-center">Current Level</h3>
                                <div className="relative w-24 h-24 mx-auto mb-4">
                                    <div className="absolute inset-0 rounded-full border-4 border-base-200" />
                                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold">72</span>
                                        <span className="text-[10px] text-base-content/40">PROGRESS</span>
                                    </div>
                                </div>
                                <p className="text-xs text-center text-base-content/50 italic">
                                    "{roadmap.content.assessment}"
                                </p>
                            </div>

                            <div className="bg-base-100 rounded-2xl border border-base-200 p-5">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/40 mb-3">Recommended</h3>
                                <div className="flex flex-wrap gap-2">
                                    {roadmap.content.recommendedCategories?.map(cat => (
                                        <span key={cat} className="badge badge-ghost text-xs">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Roadmap Timeline */}
                        <div className="md:col-span-3 space-y-6">
                            {roadmap.content.milestones.map((milestone, idx) => (
                                <motion.div
                                    key={milestone.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-base-100 rounded-2xl border border-base-200 p-6 hover:border-primary/30 transition-colors"
                                >
                                    <div className="flex justify-between items-start gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-primary text-xs font-medium">Milestone #{idx + 1}</span>
                                                <span className="text-xs bg-base-200 px-2 py-0.5 rounded text-base-content/50">
                                                    {milestone.difficultyRecommendation}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold">{milestone.title}</h3>
                                        </div>
                                        <div className="flex gap-1">
                                            {milestone.focusTags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-xs bg-base-200 px-2 py-1 rounded-lg">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-base-content/60 text-sm mb-4">{milestone.description}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-base-200">
                                        <div className="flex items-center gap-2 text-xs text-base-content/40">
                                            <Layers className="w-4 h-4" />
                                            ~12 Problems
                                        </div>
                                        <button className="btn btn-ghost btn-xs gap-1">
                                            Go to Track
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            <div className="bg-gradient-to-r from-primary/10 to-transparent p-5 rounded-2xl border border-primary/20 flex items-center gap-4">
                                <div className="p-2 rounded-full bg-primary">
                                    <Rocket className="w-4 h-4 text-primary-content" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-primary">Interview Ready Phase</p>
                                    <p className="text-xs text-base-content/50">Complete milestones to unlock mock interviews.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {loading && !roadmap && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-t-4 border-primary animate-spin" />
                            <BrainCircuit className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-1">Architecting Your Path...</h3>
                            <p className="text-sm text-base-content/40">Consulting Gemini AI</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Roadmap;
