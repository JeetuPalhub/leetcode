import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useProblemStore } from "../store/useProblemStore";
import ProblemsTable from "../components/ProblemTable";
import {
  Loader,
  Sparkles,
  Trophy,
  Target,
  BookOpen,
  TrendingUp,
  Code2,
  Brain,
  Swords,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  const easyProblems = problems.filter(p => p.difficulty === 'EASY').length;
  const mediumProblems = problems.filter(p => p.difficulty === 'MEDIUM').length;
  const hardProblems = problems.filter(p => p.difficulty === 'HARD').length;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects - Same as Landing Page */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-8 pb-16">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Welcome back, {authUser?.name || 'Developer'}!</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Ready to solve some
                <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  problems today?
                </span>
              </h1>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-10">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-base-content">{problems.length}</div>
                  <div className="text-sm text-base-content/50">Total Problems</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-success">{easyProblems}</div>
                  <div className="text-sm text-base-content/50">Easy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-warning">{mediumProblems}</div>
                  <div className="text-sm text-base-content/50">Medium</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-error">{hardProblems}</div>
                  <div className="text-sm text-base-content/50">Hard</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="pb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/roadmap"
                  className="group flex items-center justify-between p-4 rounded-2xl bg-base-200/50 border border-base-200 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Brain className="w-5 h-5" />
                    </div>
                    <span className="font-medium">AI Roadmap</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-base-content/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/contests"
                  className="group flex items-center justify-between p-4 rounded-2xl bg-base-200/50 border border-base-200 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Swords className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Contests</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-base-content/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/leaderboard"
                  className="group flex items-center justify-between p-4 rounded-2xl bg-base-200/50 border border-base-200 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Leaderboard</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-base-content/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Problems Section */}
        <section className="pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">All Problems</h2>
                <p className="text-base-content/60">{problems.length} problems available to solve</p>
              </div>

              {problems.length > 0 ? (
                <div className="rounded-2xl border border-base-200 overflow-hidden bg-base-100">
                  <ProblemsTable problems={problems} />
                </div>
              ) : (
                <div className="text-center py-16 bg-base-200/50 rounded-2xl border border-base-200">
                  <BookOpen className="w-12 h-12 text-base-content/20 mx-auto mb-4" />
                  <p className="text-base-content/60">No problems found. Check back soon!</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
