import { useState } from 'react';
import { BookOpen, Code, Cpu, Loader2, CheckCircle, ExternalLink, Clock, Layers, Terminal, ClipboardCheck, Clipboard, Award, Sparkles } from 'lucide-react';

function App() {
    const [goal, setGoal] = useState('');
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

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

    const copyToClipboard = () => {
        const text = JSON.stringify(plan, null, 2);
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
                        Your personal AI curriculum architect. Powered by Pydantic AI & DuckDuckGo Search.
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
                    <div className="space-y-8 animate-fade-in pb-20">
                        {/* Overview Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                                    title="Copy Data"
                                >
                                    {copied ? <ClipboardCheck className="w-5 h-5 text-emerald-400" /> : <Clipboard className="w-5 h-5" />}
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-indigo-400" />
                                        <h2 className="text-3xl font-bold text-white">{plan.goal}</h2>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full border border-indigo-500/20">
                                            {plan.difficulty_level.toUpperCase()}
                                        </span>
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {plan.total_estimated_weeks} WEEKS
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="md:col-span-2">
                                    <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Motivation</h4>
                                    <p className="text-slate-300 leading-relaxed italic border-l-2 border-indigo-500 pl-4 bg-indigo-500/5 py-2 rounded-r-lg">
                                        "{plan.summary_motivation}"
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Award className="w-4 h-4" /> Prerequisites
                                    </h4>
                                    <ul className="space-y-1">
                                        {plan.prerequisites.map((item, i) => (
                                            <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Modules timeline */}
                        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                            {plan.modules.map((module, index) => (
                                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                    {/* Icon */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                        <span className="text-xs font-bold">{index + 1}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/40 transition-all hover:bg-slate-900 shadow-xl group-hover:scale-[1.02]">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-white text-lg">{module.title}</h3>
                                            <time className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                                                {module.estimated_hours}h
                                            </time>
                                        </div>
                                        <p className="text-slate-400 text-sm mb-4">{module.description}</p>

                                        <div className="space-y-4">
                                            {/* Key Topics */}
                                            <div className="flex flex-wrap gap-2">
                                                {module.key_topics.map((topic, i) => (
                                                    <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Project Idea */}
                                            {module.project_idea && (
                                                <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Mini Project</span>
                                                    </div>
                                                    <p className="text-xs text-slate-300 leading-snug">{module.project_idea}</p>
                                                </div>
                                            )}

                                            {/* Resources */}
                                            <div className="pt-2 border-t border-slate-800">
                                                <div className="flex items-center gap-2 mb-2 text-slate-500">
                                                    <BookOpen className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-bold uppercase">Resources</span>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    {module.resources.map((res, i) => (
                                                        <a
                                                            key={i}
                                                            href={res.url.startsWith('http') ? res.url : `https://www.google.com/search?q=${res.url}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex items-center justify-between group/link bg-slate-950/50 p-2 rounded-lg hover:bg-indigo-500/10 transition-colors"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-[11px] text-slate-200 font-medium group-hover/link:text-indigo-300">{res.title}</span>
                                                                <span className="text-[9px] text-slate-500 uppercase">{res.type}</span>
                                                            </div>
                                                            <ExternalLink className="w-3 h-3 text-slate-600 group-hover/link:text-indigo-400" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
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
