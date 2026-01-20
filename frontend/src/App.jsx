import { useState } from 'react';
import { BookOpen, Code, Cpu, Loader2, CheckCircle, ExternalLink, Clock, Layers } from 'lucide-react';

function App() {
    const [goal, setGoal] = useState('');
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!goal.trim()) return;

        setLoading(true);
        setError('');
        setPlan(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/generate-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goal }),
            });

            if (!response.ok) throw new Error('Failed to generate plan');
            const data = await response.json();
            setPlan(data);
        } catch (err) {
            setError('Something went wrong. Please check the backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
            <div className="max-w-4xl mx-auto px-6 py-12">

                {/* Header */}
                <header className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-4 ring-1 ring-indigo-500/20">
                        <Cpu className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                        Skill Forge AI
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">
                        Your personal AI curriculum architect. Enter a skill, and we'll engineer the perfect learning path using Pydantic AI.
                    </p>
                </header>

                {/* Input Section */}
                <div className="relative max-w-2xl mx-auto mb-20">
                    <form onSubmit={handleSubmit} className="relative z-10">
                        <div className="relative flex items-center group">
                            <input
                                type="text"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                placeholder="e.g., Learn Rust for Systems Programming..."
                                className="w-full bg-slate-900/50 border border-slate-700/50 text-white px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 shadow-xl"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !goal}
                                className="absolute right-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Forge Plan'}
                            </button>
                        </div>
                    </form>
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center mb-8">
                        {error}
                    </div>
                )}

                {/* Results Section */}
                {plan && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Overview Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{plan.goal}</h2>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-medium rounded-full border border-indigo-500/20">
                                            {plan.difficulty_level}
                                        </span>
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                                            AI Generated
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-slate-300 leading-relaxed border-l-2 border-indigo-500 pl-4">
                                {plan.summary_motivation}
                            </p>
                        </div>

                        {/* Modules Timeline */}
                        <div className="space-y-6">
                            {plan.modules.map((module, index) => (
                                <div key={index} className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors">
                                    <div className="absolute -left-3 top-8 w-6 h-6 bg-slate-950 border-4 border-indigo-900 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                    </div>

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                            <span className="text-indigo-500 font-mono">0{index + 1}.</span> {module.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                                            <Clock className="w-4 h-4" />
                                            <span>{module.estimated_hours} Hours</span>
                                        </div>
                                    </div>

                                    <p className="text-slate-400 mb-6">{module.description}</p>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                                            <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                                <Layers className="w-4 h-4 text-indigo-400" /> Key Topics
                                            </h4>
                                            <ul className="space-y-2">
                                                {module.key_topics.map((topic, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                                        <CheckCircle className="w-4 h-4 text-emerald-500/50 mt-0.5 shrink-0" />
                                                        {topic}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                                            <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-indigo-400" /> Resources
                                            </h4>
                                            <ul className="space-y-2">
                                                {module.resources.map((res, i) => (
                                                    <li key={i} className="flex items-center justify-between text-sm group/link">
                                                        <span className="text-slate-400">{res.title}</span>
                                                        <a href={`https://www.google.com/search?q=${res.url}`} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 opacity-0 group-hover/link:opacity-100 transition-opacity">
                                                            <span className="text-xs">{res.type}</span>
                                                            <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
