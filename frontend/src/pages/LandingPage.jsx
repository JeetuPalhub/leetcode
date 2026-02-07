import React from "react";
import { Link } from "react-router-dom";
import {
    Code2,
    Trophy,
    Users,
    Zap,
    BookOpen,
    Terminal,
    CheckCircle,
    ArrowRight,
    Github,
    Star
} from "lucide-react";

const LandingPage = () => {
    const features = [
        {
            icon: <Code2 className="w-8 h-8" />,
            title: "Multi-Language Support",
            description: "Write and execute code in JavaScript, Python, and Java with syntax highlighting."
        },
        {
            icon: <Terminal className="w-8 h-8" />,
            title: "Real-time Execution",
            description: "Run your code instantly against test cases and see results in real-time."
        },
        {
            icon: <Trophy className="w-8 h-8" />,
            title: "Track Progress",
            description: "Monitor your submissions, solved problems, and improvement over time."
        },
        {
            icon: <BookOpen className="w-8 h-8" />,
            title: "Curated Problems",
            description: "Practice with carefully crafted problems across Easy, Medium, and Hard difficulty levels."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Playlists",
            description: "Organize problems into custom playlists for focused practice sessions."
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Instant Feedback",
            description: "Get immediate feedback on your solutions with detailed test case results."
        }
    ];

    const stats = [
        { value: "100+", label: "Problems" },
        { value: "3", label: "Languages" },
        { value: "1000+", label: "Submissions" },
        { value: "24/7", label: "Available" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-300 via-base-200 to-base-300">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Glow Effects */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 py-20 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6">
                            <Star className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Practice Coding Like Never Before</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
                            Master Coding with{" "}
                            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                LeetLab
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl md:text-2xl text-base-content/70 mb-10 max-w-2xl mx-auto">
                            A modern platform inspired by LeetCode to help you prepare for coding interviews
                            and sharpen your problem-solving skills.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/signup"
                                className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/login"
                                className="btn btn-outline btn-lg gap-2"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>

                    {/* Code Preview Mockup */}
                    <div className="mt-20 max-w-4xl mx-auto">
                        <div className="mockup-code bg-neutral text-neutral-content shadow-2xl">
                            <pre data-prefix="1"><code className="text-success">{"// Two Sum - Easy"}</code></pre>
                            <pre data-prefix="2"><code>{"function twoSum(nums, target) {"}</code></pre>
                            <pre data-prefix="3"><code>{"  const map = new Map();"}</code></pre>
                            <pre data-prefix="4"><code>{"  for (let i = 0; i < nums.length; i++) {"}</code></pre>
                            <pre data-prefix="5"><code>{"    const complement = target - nums[i];"}</code></pre>
                            <pre data-prefix="6"><code>{"    if (map.has(complement)) {"}</code></pre>
                            <pre data-prefix="7" className="text-warning"><code>{"      return [map.get(complement), i];"}</code></pre>
                            <pre data-prefix="8"><code>{"    }"}</code></pre>
                            <pre data-prefix="9"><code>{"    map.set(nums[i], i);"}</code></pre>
                            <pre data-prefix="10"><code>{"  }"}</code></pre>
                            <pre data-prefix="11"><code>{"}"}</code></pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-base-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                                <div className="text-base-content/70">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
                        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                            Powerful features to help you become a better programmer
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="card-body">
                                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="card-title text-xl">{feature.title}</h3>
                                    <p className="text-base-content/70">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-base-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-xl text-base-content/70">Start coding in three simple steps</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            { step: "1", title: "Sign Up", desc: "Create your free account in seconds" },
                            { step: "2", title: "Choose a Problem", desc: "Browse problems by difficulty or topic" },
                            { step: "3", title: "Start Coding", desc: "Write, run, and submit your solution" }
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-content text-2xl font-bold mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-base-content/70">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content">
                        <div className="card-body text-center py-16">
                            <h2 className="text-4xl font-bold mb-4">Ready to Level Up Your Coding Skills?</h2>
                            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                                Join thousands of developers who are improving their skills every day.
                            </p>
                            <div className="flex justify-center">
                                <Link to="/signup" className="btn btn-lg bg-white text-primary hover:bg-gray-100 gap-2">
                                    Start Practicing Now
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 bg-base-300">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Code2 className="w-6 h-6 text-primary" />
                            <span className="font-bold text-xl">LeetLab</span>
                        </div>
                        <div className="text-base-content/70 text-sm">
                            © 2024 LeetLab. Built with ❤️ for developers.
                        </div>
                        <div className="flex gap-4">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
