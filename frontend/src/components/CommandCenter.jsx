import React, { useState, useEffect } from "react";
import { Command } from "cmdk";
import {
    Search, Code, Trophy, User,
    Home, Zap, Layout, Settings,
    Hash, ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";

const CommandCenter = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { problems, fetchProblems } = useProblemStore();

    useEffect(() => {
        fetchProblems();

        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [fetchProblems]);

    const runCommand = (command) => {
        setOpen(false);
        command();
    };

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Center"
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] p-4 bg-black/60 backdrop-blur-sm"
        >
            <div className="w-full max-w-[640px] bg-base-200 border border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center px-6 py-4 border-b border-white/5 bg-base-300">
                    <Search className="w-5 h-5 opacity-40 mr-4" />
                    <Command.Input
                        placeholder="Search problems, contests, or navigate..."
                        className="w-full bg-transparent border-none outline-none text-lg placeholder:opacity-30"
                    />
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/10 ml-4">
                        <span className="text-[10px] font-black opacity-30 tracking-widest">ESC</span>
                    </div>
                </div>

                <Command.List className="max-h-[400px] overflow-y-auto p-4 space-y-2">
                    <Command.Empty className="py-12 text-center opacity-30 italic">
                        No matching results found.
                    </Command.Empty>

                    <Command.Group heading={<span className="text-[10px] font-black uppercase tracking-[.2em] opacity-30 ml-2 mb-2 block">Quick Navigation</span>}>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/"))}
                            className="flex items-center gap-4 p-3 rounded-xl cursor-pointer aria-selected:bg-primary aria-selected:text-primary-content transition-all group"
                        >
                            <div className="p-2 rounded-lg bg-white/5 group-aria-selected:bg-white/20">
                                <Home className="w-4 h-4" />
                            </div>
                            <span className="font-bold flex-1">Home</span>
                            <span className="text-[10px] opacity-30 font-mono">/</span>
                        </Command.Item>

                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/contests"))}
                            className="flex items-center gap-4 p-3 rounded-xl cursor-pointer aria-selected:bg-primary aria-selected:text-primary-content transition-all group"
                        >
                            <div className="p-2 rounded-lg bg-white/5 group-aria-selected:bg-white/20">
                                <Trophy className="w-4 h-4" />
                            </div>
                            <span className="font-bold flex-1">Contests</span>
                            <span className="text-[10px] opacity-30 font-mono">/contests</span>
                        </Command.Item>

                        <Command.Item
                            onSelect={() => runCommand(() => navigate("/roadmap"))}
                            className="flex items-center gap-4 p-3 rounded-xl cursor-pointer aria-selected:bg-primary aria-selected:text-primary-content transition-all group"
                        >
                            <div className="p-2 rounded-lg bg-white/5 group-aria-selected:bg-white/20">
                                <Zap className="w-4 h-4" />
                            </div>
                            <span className="font-bold flex-1">AI Roadmap</span>
                            <span className="text-[10px] opacity-30 font-mono">/roadmap</span>
                        </Command.Item>
                    </Command.Group>

                    <Command.Group heading={<span className="text-[10px] font-black uppercase tracking-[.2em] opacity-30 ml-2 mt-4 mb-2 block">Available Problems</span>}>
                        {problems?.slice(0, 10).map((problem) => (
                            <Command.Item
                                key={problem.id}
                                onSelect={() => runCommand(() => navigate(`/problem/${problem.id}`))}
                                className="flex items-center gap-4 p-3 rounded-xl cursor-pointer aria-selected:bg-primary aria-selected:text-primary-content transition-all group"
                            >
                                <div className="p-2 rounded-lg bg-white/5 group-aria-selected:bg-white/20">
                                    <Hash className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <span className="font-bold block">{problem.title}</span>
                                    <span className="text-[10px] opacity-50 uppercase font-black">{problem.difficulty}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 opacity-0 group-aria-selected:opacity-100 transition-opacity" />
                            </Command.Item>
                        ))}
                    </Command.Group>
                </Command.List>

                <div className="px-6 py-3 border-t border-white/5 bg-base-300/50 flex items-center justify-between">
                    <div className="flex items-center gap-4 opacity-40">
                        <div className="flex items-center gap-1 text-[10px] font-bold">
                            <span className="px-1.5 py-0.5 bg-white/10 rounded">↑↓</span>
                            Navigate
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold">
                            <span className="px-1.5 py-0.5 bg-white/10 rounded">ENTER</span>
                            Select
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-primary animate-pulse tracking-widest uppercase">COMMAND CENTER</span>
                </div>
            </div>
        </Command.Dialog>
    );
};

export default CommandCenter;
