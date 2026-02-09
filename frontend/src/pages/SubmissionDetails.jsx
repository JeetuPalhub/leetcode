import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSubmissionStore } from "../store/useSubmissionStore";
import {
    CheckCircle2,
    XCircle,
    Clock,
    Cpu,
    ChevronLeft,
    Code2,
    ChevronRight,
    Share2,
    Calendar
} from "lucide-react";
import Editor from "@monaco-editor/react";
import BellCurve from "../components/BellCurve";

const SubmissionDetails = () => {
    const { id } = useParams();
    const { submission, benchmarking, getSubmissionDetails, isLoading } = useSubmissionStore();

    useEffect(() => {
        getSubmissionDetails(id);
    }, [id, getSubmissionDetails]);

    if (isLoading && !submission) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!submission) return <div className="text-center py-20">Submission not found.</div>;

    const isAccepted = submission.status === "Accepted";

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Back & Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Link to={`/problem/${submission.problemId}`} className="btn btn-ghost btn-sm gap-2 mb-2 p-0 hover:bg-transparent">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Problem
                    </Link>
                    <h1 className="text-3xl font-black flex items-center gap-3">
                        {submission.problem.title}
                        <span className={`badge badge-lg font-bold border-none ${submission.problem.difficulty === 'EASY' ? 'bg-success/10 text-success' :
                            submission.problem.difficulty === 'MEDIUM' ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                            }`}>
                            {submission.problem.difficulty}
                        </span>
                    </h1>
                    <div className="flex items-center gap-4 mt-2 text-sm text-base-content/60">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(submission.createdAt).toLocaleDateString()} at {new Date(submission.createdAt).toLocaleTimeString()}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm gap-2">
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Result & Code */}
                <div className="lg:col-span-2 space-y-6">
                    <div className={`card overflow-hidden transition-all border ${isAccepted ? 'bg-success/5 border-success/20' : 'bg-error/5 border-error/20'
                        }`}>
                        <div className="card-body p-6">
                            <div className="flex items-center gap-4">
                                {isAccepted ? (
                                    <CheckCircle2 className="w-12 h-12 text-success" />
                                ) : (
                                    <XCircle className="w-12 h-12 text-error" />
                                )}
                                <div>
                                    <h2 className={`text-2xl font-black uppercase ${isAccepted ? 'text-success' : 'text-error'}`}>
                                        {submission.status}
                                    </h2>
                                    <p className="text-sm opacity-60">Submitted in {submission.language}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-300 border border-white/5 overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-base-200">
                            <div className="flex items-center gap-2">
                                <Code2 className="w-5 h-5 text-primary" />
                                <span className="font-bold text-sm">Source Code</span>
                            </div>
                            <div className="badge badge-outline font-mono text-xs uppercase opacity-60">
                                {submission.language}
                            </div>
                        </div>
                        <div className="h-[500px]">
                            <Editor
                                height="100%"
                                language={submission.language.toLowerCase()}
                                value={typeof submission.sourceCode === 'string' ? submission.sourceCode : JSON.stringify(submission.sourceCode, null, 2)}
                                theme="vs-dark"
                                options={{
                                    readOnly: true,
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    scrollBeyondLastLine: false,
                                    padding: { top: 20, bottom: 20 }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Performance & Benchmarking */}
                <div className="space-y-6">
                    <div className="card bg-base-100 border border-white/5 shadow-xl">
                        <div className="card-body">
                            <h3 className="card-title text-xl mb-4">Runtime Details</h3>

                            <div className="space-y-6">
                                {/* Runtime */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="flex items-center gap-2 text-base-content/60">
                                            <Clock className="w-4 h-4" />
                                            <span>Runtime</span>
                                        </div>
                                        <div className="text-2xl font-black">{submission.time || '0'} ms</div>
                                    </div>
                                    {benchmarking && (
                                        <div className="mt-4 space-y-4">
                                            <BellCurve
                                                percentile={benchmarking.timePercentile}
                                                color="#22c55e"
                                                label="Runtime"
                                            />
                                            <p className="text-[11px] text-success font-bold text-center">
                                                Beats {benchmarking.timePercentile}% of users with {submission.language}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Memory */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="flex items-center gap-2 text-base-content/60">
                                            <Cpu className="w-4 h-4" />
                                            <span>Memory</span>
                                        </div>
                                        <div className="text-2xl font-black">{submission.memory || '0'} KB</div>
                                    </div>
                                    {benchmarking && (
                                        <div className="mt-4 space-y-4">
                                            <BellCurve
                                                percentile={benchmarking.memoryPercentile}
                                                color="#3b82f6"
                                                label="Memory"
                                            />
                                            <p className="text-[11px] text-secondary font-bold text-center">
                                                Beats {benchmarking.memoryPercentile}% of users with {submission.language}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {benchmarking && (
                                <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10 text-xs text-center leading-relaxed italic opacity-80">
                                    "Your solution is highly efficient compared to {benchmarking.totalAccepted} successful submissions for this problem."
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Test Cases Results */}
                    <div className="card bg-base-100 border border-white/5 shadow-xl">
                        <div className="card-body">
                            <h3 className="card-title text-xl mb-4">Test Cases</h3>
                            <div className="space-y-3">
                                {submission.testCases?.map((tc, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-base-200 border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${tc.passed ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-error shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
                                            <span className="text-xs font-bold">Case {idx + 1}</span>
                                        </div>
                                        <div className={`text-[10px] font-black uppercase ${tc.passed ? 'text-success' : 'text-error'}`}>
                                            {tc.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionDetails;
