import React, { useState, useEffect } from "react";
import { useInterviewStore } from "../store/useInterviewStore";
import {
    Trophy,
    Timer,
    Brain,
    Building2,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    ArrowRight,
    ShieldCheck,
    Zap,
    MessageSquare,
    Send,
    Bot,
    User,
    Lightbulb
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MockInterviewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        currentSession,
        isLoading,
        startInterview,
        getSession,
        submitInterview,
    } = useInterviewStore();

    const [config, setConfig] = useState({
        difficulty: "ALL",
        company: "ALL",
        duration: 60,
    });

    const [timeLeft, setTimeLeft] = useState(null);
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I am your AI interviewer. Need a hint? Just ask!' }
    ]);
    const [isThinking, setIsThinking] = useState(false);
    const [activeProblemId, setActiveProblemId] = useState(null);

    useEffect(() => {
        if (id) {
            getSession(id);
        }
    }, [id, getSession]);

    useEffect(() => {
        if (currentSession?.status === "IN_PROGRESS" && currentSession.startTime) {
            const start = new Date(currentSession.startTime).getTime();
            const end = start + currentSession.duration * 60 * 1000;

            const timer = setInterval(() => {
                const now = new Date().getTime();
                const diff = end - now;
                if (diff <= 0) {
                    clearInterval(timer);
                    setTimeLeft(0);
                    handleFinish();
                } else {
                    setTimeLeft(Math.floor(diff / 1000));
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [currentSession]);

    const handleStart = async () => {
        const sessionId = await startInterview(config);
        if (sessionId) {
            navigate(`/mock-interview/${sessionId}`);
        }
    };

    const handleFinish = async () => {
        if (currentSession?.id) {
            await submitInterview(currentSession.id);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleGetHint = async (problem) => {
        if (isThinking) return;

        setActiveProblemId(problem.id);
        setIsThinking(true);

        // Add user request to chat
        setMessages(prev => [...prev, { role: 'user', content: `Can I get a hint for "${problem.title}"?` }]);

        try {
            const { getHint } = useInterviewStore.getState();
            // In a real scenario, we'd pass the actual code. For now passing empty string.
            const hint = await getHint(currentSession.id, problem.id, "");

            if (hint) {
                setMessages(prev => [...prev, { role: 'ai', content: hint }]);
            }
        } catch (error) {
            console.error("Hint Error:", error);
        } finally {
            setIsThinking(false);
        }
    };

    // 1. SETUP VIEW
    if (!id) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-6 border border-primary/20">
                        <Brain className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-5xl font-black mb-4">Mock <span className="text-primary italic">Interview</span></h1>
                    <p className="text-xl text-base-content/60">Simulate a real-time coding assessment from top companies.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="card bg-base-200 border border-white/5 p-6 space-y-3">
                        <ShieldCheck className="w-8 h-8 text-success" />
                        <h3 className="font-bold text-lg">Timed Environment</h3>
                        <p className="text-xs opacity-60">Practice solving under pressure with a strict countdown timer.</p>
                    </div>
                    <div className="card bg-base-200 border border-white/5 p-6 space-y-3">
                        <Zap className="w-8 h-8 text-warning" />
                        <h3 className="font-bold text-lg">3 Challenges</h3>
                        <p className="text-xs opacity-60">Complete three problems of varying difficulty in one sitting.</p>
                    </div>
                    <div className="card bg-base-200 border border-white/5 p-6 space-y-3">
                        <Trophy className="w-8 h-8 text-secondary" />
                        <h3 className="font-bold text-lg">Performance Report</h3>
                        <p className="text-xs opacity-60">Detailed feedback and score evaluation once you finish.</p>
                    </div>
                </div>

                <div className="card bg-base-100 border border-white/5 shadow-2xl">
                    <div className="card-body p-8">
                        <h2 className="card-title text-2xl mb-6">Configure Your Session</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase opacity-60">Difficulty Focus</label>
                                <select
                                    className="select select-bordered select-lg"
                                    value={config.difficulty}
                                    onChange={e => setConfig({ ...config, difficulty: e.target.value })}
                                >
                                    <option value="ALL">Mixed Difficulty</option>
                                    <option value="EASY">Easy Focused</option>
                                    <option value="MEDIUM">Medium Focused</option>
                                    <option value="HARD">Hard Only (Pro)</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label font-bold text-xs uppercase opacity-60">Duration (Minutes)</label>
                                <select
                                    className="select select-bordered select-lg"
                                    value={config.duration}
                                    onChange={e => setConfig({ ...config, duration: parseInt(e.target.value) })}
                                >
                                    <option value={30}>30 Minutes</option>
                                    <option value={60}>60 Minutes (Standard)</option>
                                    <option value={90}>90 Minutes (Intensive)</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                className={`btn btn-primary btn-lg gap-3 px-8 rounded-2xl ${isLoading ? 'btn-disabled' : ''}`}
                                onClick={handleStart}
                            >
                                {isLoading ? <span className="loading loading-spinner"></span> : <><Zap className="w-5 h-5" /> Start Interview</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. ACTIVE VIEW
    if (currentSession?.status === "IN_PROGRESS") {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-center bg-base-300 border border-white/5 p-6 rounded-3xl mb-8 shadow-xl sticky top-20 z-50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                            <Timer className={`w-6 h-6 ${timeLeft < 300 ? 'text-error animate-pulse' : 'text-primary'}`} />
                        </div>
                        <div>
                            <div className="text-3xl font-black font-mono">
                                {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
                            </div>
                            <div className="text-[10px] uppercase font-bold opacity-40">Time Remaining</div>
                        </div>
                    </div>

                    <div className="hidden md:flex gap-4 items-center">
                        <div className="text-right">
                            <p className="text-sm font-bold">Interview Session</p>
                            <p className="text-[10px] opacity-40 uppercase">ID: {id.slice(-8)}</p>
                        </div>
                        <button
                            className="btn btn-error btn-sm rounded-xl px-4"
                            onClick={() => {
                                if (confirm("Are you sure you want to finish the interview early?")) {
                                    handleFinish();
                                }
                            }}
                        >
                            Finish Assessment
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                            <ChevronRight className="w-6 h-6 text-primary" />
                            Selected Problems
                        </h2>

                        {currentSession.problems.map((problem, index) => (
                            <div key={problem.id} className="card bg-base-100 border border-white/5 hover:border-primary/30 transition-all p-6 shadow-xl group">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full border-2 border-base-300 flex items-center justify-center font-black text-primary">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{problem.title}</h3>
                                            <div className="flex gap-2 items-center mt-1">
                                                <span className={`badge badge-sm font-bold ${problem.difficulty === 'EASY' ? 'badge-success' :
                                                    problem.difficulty === 'MEDIUM' ? 'badge-warning' : 'badge-error'
                                                    }`}>
                                                    {problem.difficulty}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {!problem.solved && (
                                            <button
                                                className={`btn btn-ghost btn-sm gap-2 text-warning ${isThinking && activeProblemId === problem.id ? 'loading' : ''}`}
                                                onClick={() => handleGetHint(problem)}
                                                disabled={isThinking}
                                            >
                                                <Lightbulb className="w-4 h-4" />
                                                Need Hint?
                                            </button>
                                        )}
                                        {problem.solved ? (
                                            <div className="flex items-center gap-2 text-success font-bold text-sm">
                                                <CheckCircle2 className="w-5 h-5" />
                                                Solved
                                            </div>
                                        ) : (
                                            <Link
                                                to={`/problem/${problem.id}?mode=mock`}
                                                className="btn btn-primary rounded-xl gap-2 px-6"
                                            >
                                                Solve Problem <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="mt-8 p-6 bg-info/5 border border-info/20 rounded-2xl flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-info shrink-0" />
                            <p className="text-xs text-info/70 leading-relaxed font-medium">
                                Pro-tip: Focus on the easier problems first to build momentum. The AI Assistant on the right can provide intelligent hints if you get stuck!
                            </p>
                        </div>
                    </div>

                    {/* AI ASSISTANT SIDEBAR */}
                    <div className="lg:col-span-1">
                        <div className="card bg-base-300 border border-white/5 shadow-2xl h-full flex flex-col max-h-[600px] overflow-hidden">
                            <div className="p-4 border-b border-white/5 bg-base-200 flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/10">
                                    <Bot className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Interview Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                        <span className="text-[10px] uppercase font-black opacity-40">AI Online</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                                <AnimatePresence mode="popLayout">
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${msg.role === 'user'
                                                    ? 'bg-primary text-primary-content rounded-br-none shadow-lg'
                                                    : 'bg-base-100 border border-white/5 rounded-bl-none shadow-sm'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isThinking && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex justify-start"
                                        >
                                            <div className="bg-base-100 border border-white/5 p-3 rounded-2xl rounded-bl-none">
                                                <span className="loading loading-dots loading-xs"></span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="p-4 bg-base-200 border-t border-white/5">
                                <p className="text-[10px] text-center opacity-40 italic font-medium">
                                    Click "Need Hint?" on a problem to get AI assistance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 3. REPORT/COMPLETED VIEW
    if (currentSession?.status === "COMPLETED") {
        return (
            <div className="container mx-auto px-4 py-12 max-w-4xl animate-in zoom-in-95 duration-700">
                <div className="card bg-base-100 shadow-2xl border border-white/5 overflow-hidden">
                    <div className="bg-primary/10 py-12 px-8 text-center border-b border-primary/10">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary text-primary-content mb-6 shadow-[0_0_30px_rgba(var(--p),0.3)]">
                            <Trophy className="w-12 h-12" />
                        </div>
                        <h1 className="text-4xl font-black mb-2">Assessment <span className="text-primary italic">Results</span></h1>
                        <p className="opacity-60 text-lg">Interview performance evaluation generated by LeetLab AI</p>
                    </div>

                    <div className="card-body p-8 space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold uppercase opacity-60">Mock Score</span>
                                    <span className="text-5xl font-black text-primary">{currentSession.score}</span>
                                </div>
                                <div className="h-4 w-full bg-base-300 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, (currentSession.score / 170) * 100)}%` }} />
                                </div>
                                <p className="text-xs opacity-50 text-center">Calculated based on difficulty and time efficiency.</p>
                            </div>

                            <div className="p-6 rounded-2xl bg-base-200 border border-white/5 space-y-2">
                                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-primary" />
                                    AI Insights
                                </h4>
                                <p className="text-sm italic leading-relaxed opacity-80">
                                    "{currentSession.feedback?.summary}"
                                </p>
                                <p className="text-sm font-bold text-primary mt-4">
                                    Recommendation: {currentSession.feedback?.recommendation}
                                </p>
                            </div>
                        </div>

                        <div className="divider">Experience Breakdown</div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h5 className="font-bold text-sm uppercase text-success opacity-80">Strengths</h5>
                                {currentSession.feedback?.strengths.map((s, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-success" />
                                        {s}
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                <h5 className="font-bold text-sm uppercase text-warning opacity-80">Areas for Improvement</h5>
                                {currentSession.feedback?.improvements.map((im, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <AlertCircle className="w-4 h-4 text-warning" />
                                        {im}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center gap-4">
                            <Link to="/" className="btn btn-ghost rounded-xl px-8">Return Home</Link>
                            <button
                                className="btn btn-primary rounded-xl px-8"
                                onClick={() => navigate('/mock-interview')}
                            >
                                Try Another
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[500px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );
};

export default MockInterviewPage;
