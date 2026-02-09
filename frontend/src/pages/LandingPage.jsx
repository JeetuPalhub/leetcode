import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Code2,
    Terminal,
    Trophy,
    BookOpen,
    Zap,
    Users,
    CheckCircle2,
    Star,
    Sparkles,
    Brain,
    Target,
    Rocket,
    Github,
    Twitter,
    Linkedin,
    Mail,
    Play,
    ChevronRight,
    Globe,
    Shield,
    Clock,
    TrendingUp,
    Award
} from "lucide-react";

const LandingPage = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const stagger = {
        visible: { transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="min-h-screen bg-base-100 overflow-hidden">
            {/* Grid Background Pattern */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            {/* Spotlight Effect */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Hero Section */}
            <section className="relative pt-8 pb-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="max-w-4xl mx-auto text-center"
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                    >
                        {/* Badge */}
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">New: AI-Powered Hints Available</span>
                            <ChevronRight className="w-4 h-4 text-primary" />
                        </motion.div>

                        {/* Headline */}
                        <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                            Master Coding with
                            <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                LeetLab
                            </span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p variants={fadeIn} className="text-lg text-base-content/60 max-w-2xl mx-auto mb-8">
                            A modern platform to help you prepare for coding interviews
                            and sharpen your problem-solving skills with 100+ curated problems.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link to="/signup" className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25">
                                <Rocket className="w-5 h-5" />
                                Start Practicing Free
                            </Link>
                            <Link to="/login" className="btn btn-outline btn-lg gap-2">
                                <Play className="w-5 h-5" />
                                Watch Demo
                            </Link>
                        </motion.div>

                        {/* Stats Row */}
                        <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-8 md:gap-16">
                            {[
                                { value: "100+", label: "Problems" },
                                { value: "3", label: "Languages" },
                                { value: "1000+", label: "Users" },
                                { value: "24/7", label: "Available" }
                            ].map((stat, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-base-content">{stat.value}</div>
                                    <div className="text-sm text-base-content/50">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Bento Grid */}
            <section id="features" className="py-20 bg-base-200/30">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
                        <p className="text-base-content/60 max-w-xl mx-auto">Powerful features to accelerate your coding journey</p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                        {/* Large Feature Card */}
                        <motion.div
                            className="md:col-span-2 lg:col-span-2 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 p-8"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                            <Terminal className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-2">Multi-Language Code Editor</h3>
                            <p className="text-base-content/60 mb-4">Write code in JavaScript, Python, or Java with syntax highlighting, auto-completion, and real-time error detection.</p>
                            <div className="flex gap-2">
                                <span className="badge badge-primary badge-outline">JavaScript</span>
                                <span className="badge badge-secondary badge-outline">Python</span>
                                <span className="badge badge-accent badge-outline">Java</span>
                            </div>
                        </motion.div>

                        {/* Small Feature Cards */}
                        {[
                            { icon: <Zap className="w-6 h-6" />, title: "Instant Execution", desc: "Run code instantly with real-time results" },
                            { icon: <Brain className="w-6 h-6" />, title: "AI Hints", desc: "Get smart hints when you're stuck" },
                            { icon: <Trophy className="w-6 h-6" />, title: "Leaderboard", desc: "Compete with developers worldwide" },
                            { icon: <BookOpen className="w-6 h-6" />, title: "Curated Problems", desc: "100+ handpicked DSA problems" },
                            { icon: <TrendingUp className="w-6 h-6" />, title: "Progress Tracking", desc: "Monitor your improvement over time" },
                            { icon: <Shield className="w-6 h-6" />, title: "Secure Platform", desc: "Your data is safe with us" },
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                className="group relative overflow-hidden rounded-2xl bg-base-100 border border-base-200 p-6 hover:border-primary/30 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-primary mb-3">{feature.icon}</div>
                                <h3 className="font-semibold mb-1">{feature.title}</h3>
                                <p className="text-sm text-base-content/60">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Problems Preview */}
            <section id="problems" className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Solving Today</h2>
                        <p className="text-base-content/60 max-w-xl mx-auto">Curated problems across all difficulty levels</p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="rounded-2xl border border-base-200 overflow-hidden bg-base-100">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-base-200/50 text-sm font-medium text-base-content/70">
                                <div className="col-span-1">Status</div>
                                <div className="col-span-6">Title</div>
                                <div className="col-span-2">Difficulty</div>
                                <div className="col-span-3">Acceptance</div>
                            </div>

                            {/* Table Rows */}
                            {[
                                { solved: true, title: "Two Sum", difficulty: "Easy", acceptance: "49.1%" },
                                { solved: true, title: "Add Two Numbers", difficulty: "Medium", acceptance: "40.3%" },
                                { solved: false, title: "Longest Substring", difficulty: "Medium", acceptance: "33.8%" },
                                { solved: false, title: "Median of Two Arrays", difficulty: "Hard", acceptance: "36.1%" },
                                { solved: true, title: "Palindromic Substring", difficulty: "Medium", acceptance: "32.4%" },
                            ].map((problem, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 border-t border-base-200 hover:bg-base-200/30 transition-colors cursor-pointer">
                                    <div className="col-span-1">
                                        {problem.solved ? <CheckCircle2 className="w-5 h-5 text-success" /> : <div className="w-5 h-5" />}
                                    </div>
                                    <div className="col-span-6 font-medium hover:text-primary transition-colors">
                                        {idx + 1}. {problem.title}
                                    </div>
                                    <div className="col-span-2">
                                        <span className={`badge badge-sm ${problem.difficulty === 'Easy' ? 'badge-success' :
                                            problem.difficulty === 'Medium' ? 'badge-warning' : 'badge-error'
                                            }`}>
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                    <div className="col-span-3 text-base-content/60">{problem.acceptance}</div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-6">
                            <Link to="/signup" className="btn btn-primary gap-2">
                                View All Problems <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-20 bg-base-200/30">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Developers</h2>
                        <p className="text-base-content/60">See what others are saying about LeetLab</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            { name: "Rahul S.", role: "SDE @ Google", quote: "LeetLab helped me crack my Google interview. The problem curation is exactly what I needed." },
                            { name: "Priya K.", role: "SDE @ Amazon", quote: "Clean interface, great problems, and the AI hints are incredibly helpful when I'm stuck." },
                            { name: "Amit P.", role: "Full Stack Dev", quote: "Best DSA platform I've used. The multi-language support is a game changer." }
                        ].map((testimonial, idx) => (
                            <motion.div
                                key={idx}
                                className="bg-base-100 rounded-2xl border border-base-200 p-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                                    ))}
                                </div>
                                <p className="text-base-content/70 mb-4 italic">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-base-content/50">{testimonial.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-secondary p-12 text-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        {/* Background decoration */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl" />
                        </div>

                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold text-primary-content mb-4">
                                Ready to Level Up?
                            </h2>
                            <p className="text-lg text-primary-content/80 mb-8 max-w-xl mx-auto">
                                Join thousands of developers who are sharpening their skills with LeetLab.
                            </p>
                            <Link to="/signup" className="btn btn-lg bg-white text-primary hover:bg-white/90 gap-2">
                                Get Started Free <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-base-200 bg-base-200/30">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        {/* Brand */}
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                    <Code2 className="w-4 h-4 text-primary-content" />
                                </div>
                                <span className="font-bold text-lg">LeetLab</span>
                            </div>
                            <p className="text-sm text-base-content/60 mb-4">
                                Master coding interviews with our curated problems and AI-powered learning.
                            </p>
                            <div className="flex gap-3">
                                <a href="#" className="btn btn-ghost btn-sm btn-circle"><Github className="w-4 h-4" /></a>
                                <a href="#" className="btn btn-ghost btn-sm btn-circle"><Twitter className="w-4 h-4" /></a>
                                <a href="#" className="btn btn-ghost btn-sm btn-circle"><Linkedin className="w-4 h-4" /></a>
                            </div>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-base-content/60">
                                <li><a href="#" className="hover:text-primary transition-colors">Problems</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Contests</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Leaderboard</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Roadmap</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm text-base-content/60">
                                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-base-content/60">
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-base-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-base-content/50">
                            © 2024 LeetLab. All rights reserved.
                        </p>
                        <p className="text-sm text-base-content/50">
                            Built with ❤️ for developers
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
