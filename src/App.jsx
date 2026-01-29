import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Home, 
  BookOpen, 
  ClipboardList, 
  Mic, 
  Flame, 
  TrendingUp, 
  Check,
  PlayCircle,
  Signal,
  Wifi,
  Battery,
  ArrowLeft,
  AlertCircle,
  Lock,
  Zap,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Headphones,
  PenTool,
  Award,
  StopCircle,
  X,
  Target,
  Users,
  Globe,
  Trophy,
  Star
} from 'lucide-react';

export default function App() {
  // --- STATE MANAGEMENT ---
  const [currentTab, setCurrentTab] = useState('home'); 
  const [overlayView, setOverlayView] = useState(null); 
  const [showControls, setShowControls] = useState(true); 
  
  const [score, setScore] = useState(5.4);
  const [isDecayed, setIsDecayed] = useState(false);
  const [streak, setStreak] = useState(28);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiMsg, setConfettiMsg] = useState({ title: '', sub: '' });
  const [weaknesses, setWeaknesses] = useState([]); 

  // --- ACTIONS ---

  const triggerDecay = () => {
    setIsDecayed(true);
    setScore(5.35);
  };

  const triggerMockTest = () => {
    setOverlayView('feedback');
    setScore(4.5);
    setIsDecayed(false);
    setWeaknesses([
        { id: 1, topic: 'Match Headings', type: 'Reading', impact: 'High' },
        { id: 2, topic: 'Map Labelling', type: 'Listening', impact: 'Medium' }
    ]);
  };

  const startRepair = (topic) => {
    setOverlayView('repair');
    setTimeout(() => {
        finishAction(0.1, `${topic || 'Weakness'} Cleared`);
        setWeaknesses(prev => prev.filter(w => w.topic !== topic));
    }, 2500);
  };

  const startDailyMix = (type) => {
    setOverlayView('repair'); 
    setTimeout(() => {
        finishAction(0.05, `${type} Completed`);
    }, 2000);
  };

  const finishAction = (boost, msg) => {
    setScore(prev => parseFloat((prev + boost).toFixed(2)));
    setOverlayView(null);
    setIsDecayed(false);
    setConfettiMsg({ title: `+${boost} Band`, sub: msg });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  return (
    // Outer Container: Mobile = Full Screen, Desktop = Centered Presentation
    <div className="w-full h-[100dvh] lg:min-h-screen lg:bg-gray-50 lg:flex lg:items-center lg:justify-center font-sans text-slate-800 bg-[#f5f5f7]">
        
        {/* Phone Frame: Only applies styling on Large Screens (lg:) */}
        <div className="w-full h-full lg:w-[400px] lg:h-[860px] bg-[#f5f5f7] lg:rounded-[3.5rem] lg:ring-[14px] lg:ring-black lg:shadow-2xl overflow-hidden relative flex flex-col select-none">
            
            {/* --- STATUS BAR --- */}
            <div className="h-[44px] w-full bg-[#1e1b4b] flex items-end justify-between px-6 pb-2 text-white z-40 shrink-0 select-none">
                <span className="text-[13px] font-semibold ml-2">9:41</span>
                <div className="flex gap-1.5 mr-2 items-center">
                    <Signal size={15} fill="currentColor" />
                    <Wifi size={15} />
                    <Battery size={20} fill="currentColor" />
                </div>
            </div>

            {/* --- APP HEADER --- */}
            <div className="bg-[#1e1b4b] px-5 pb-5 pt-2 flex items-center justify-between shrink-0 shadow-lg z-30 relative">
                <div className="flex items-center gap-3">
                    {overlayView ? (
                        <button onClick={() => setOverlayView(null)} className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition-colors">
                            <ArrowLeft size={18} />
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white border border-white/10 shadow-inner">
                                <span className="text-xs font-bold">ST</span>
                            </div>
                            <div>
                                <span className="text-white/60 text-[10px] font-medium block leading-none mb-0.5">Welcome back,</span>
                                <span className="text-white text-sm font-bold block leading-none">Shreyansh Tripathi</span>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white">
                        <Settings className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* --- MAIN CONTENT SWITCHER --- */}
            <div className="flex-1 overflow-y-auto bg-[#f5f5f7] scrollbar-hide pb-28 relative">
                
                {!overlayView && (
                    <>
                        {currentTab === 'home' && (
                            <HomeView 
                                score={score} 
                                isDecayed={isDecayed} 
                                streak={streak} 
                                weaknesses={weaknesses}
                                onVocabClick={() => startDailyMix('Vocab')}
                                onDailyClick={startDailyMix}
                                onRepairClick={startRepair}
                            />
                        )}
                        {currentTab === 'lessons' && <LessonsView />}
                        {currentTab === 'tests' && <MockTestsView />}
                        {currentTab === 'speak' && <SpeakView onRecord={() => setOverlayView('recording')} />}
                    </>
                )}

                {/* OVERLAYS */}
                {overlayView === 'feedback' && (
                    <FeedbackView onRepair={() => startRepair('Match Headings')} onClose={() => setOverlayView(null)} />
                )}

                {overlayView === 'repair' && (
                    <RepairView title="Updating Score..." subtitle="Analyzing performance..." />
                )}

                {overlayView === 'recording' && (
                    <RecordingView onFinish={() => finishAction(0.15, 'Speaking Score Updated')} />
                )}

                {/* Confetti Overlay */}
                {showConfetti && <ConfettiOverlay title={confettiMsg.title} sub={confettiMsg.sub} />}

            </div>

            {/* --- DEMO CONTROLS (Floating) --- */}
            {showControls ? (
                <div className="absolute bottom-24 right-4 z-50 flex flex-col gap-2 animate-in slide-in-from-right duration-300">
                    <div className="bg-black/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-2xl w-[150px]">
                        <div className="flex justify-between items-center mb-3 px-1 border-b border-white/10 pb-2">
                            <p className="text-[10px] text-white/60 font-bold uppercase tracking-wide">Simulator</p>
                            <button onClick={() => setShowControls(false)} className="text-white/50 hover:text-white transition-colors"><X size={14}/></button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={triggerDecay} className="bg-red-500/10 text-red-200 text-[11px] px-3 py-2 rounded-lg border border-red-500/20 font-semibold hover:bg-red-500/20 transition-colors text-left flex items-center gap-2">
                                <TrendingUp size={14} className="rotate-180"/> Trigger Decay
                            </button>
                            <button onClick={triggerMockTest} className="bg-blue-500/10 text-blue-200 text-[11px] px-3 py-2 rounded-lg border border-blue-500/20 font-semibold hover:bg-blue-500/30 transition-colors text-left flex items-center gap-2">
                                <AlertCircle size={14}/> Mock Fail
                            </button>
                            <button onClick={() => {setScore(6.5); setIsDecayed(false); setWeaknesses([])}} className="bg-white/5 text-slate-200 text-[11px] px-3 py-2 rounded-lg border border-white/10 font-semibold hover:bg-white/10 transition-colors text-left flex items-center gap-2">
                                <RefreshCw size={14}/> Reset App
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => setShowControls(true)}
                    className="absolute bottom-24 right-4 z-50 bg-black/90 text-white p-3 rounded-full border border-white/20 shadow-xl hover:scale-110 transition-transform"
                >
                    <Settings size={20} />
                </button>
            )}

            {/* --- BOTTOM NAV --- */}
            <div className="absolute bottom-0 w-full bg-white border-t border-slate-200 px-6 pt-3 pb-[34px] flex justify-between items-end shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
                <NavButton active={currentTab === 'home' && !overlayView} icon={Home} label="Home" onClick={() => {setCurrentTab('home'); setOverlayView(null)}} />
                <NavButton active={currentTab === 'lessons' && !overlayView} icon={BookOpen} label="Lesson Plan" onClick={() => {setCurrentTab('lessons'); setOverlayView(null)}} />
                <NavButton active={currentTab === 'tests' && !overlayView} icon={ClipboardList} label="Mock Tests" onClick={() => {setCurrentTab('tests'); setOverlayView(null)}} />
                <NavButton active={currentTab === 'speak' && !overlayView} icon={Mic} label="Speak" onClick={() => {setCurrentTab('speak'); setOverlayView(null)}} />
            </div>
            
            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-black/20 rounded-full z-50 pointer-events-none"></div>
        
        </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavButton({ active, icon: Icon, label, onClick }) {
    return (
        <button onClick={onClick} className={`flex flex-col items-center gap-1 min-w-[60px] transition-colors ${active ? 'text-[#1e1b4b]' : 'text-slate-400 hover:text-slate-600'}`}>
            <div className={`w-12 h-8 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-[#1e1b4b]/10' : 'bg-transparent'}`}>
                <Icon size={24} strokeWidth={active ? 2.5 : 2} className={active ? 'text-[#1e1b4b]' : 'text-slate-400'} />
            </div>
            <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
        </button>
    )
}

function HomeView({ score, isDecayed, streak, weaknesses, onVocabClick, onDailyClick, onRepairClick }) {
    return (
        <div className="pb-4">
             {/* Live Band Prediction Card */}
             <div className="mx-4 mt-5 mb-4 animate-in slide-in-from-bottom-4 duration-700">
                <div className={`p-5 rounded-3xl transition-all duration-500 relative overflow-hidden ring-1 ring-white/10 shadow-xl ${
                    isDecayed 
                    ? 'bg-gradient-to-br from-red-900 to-red-950 shadow-red-900/20' 
                    : 'bg-gradient-to-br from-[#1e1b4b] to-[#312e81] shadow-indigo-900/10'
                }`}>
                    <div className={`absolute top-[-50%] right-[-10%] w-40 h-40 rounded-full blur-2xl transition-colors duration-500 ${isDecayed ? 'bg-red-500/20' : 'bg-blue-500/20'}`}></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                             <div>
                                <h2 className={`text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${isDecayed ? 'text-red-200 animate-pulse' : 'text-blue-200'}`}>
                                    {isDecayed ? <AlertCircle size={12}/> : <TrendingUp size={12} />} 
                                    {isDecayed ? 'Score At Risk' : 'Live Prediction'}
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1"></span>
                                </h2>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[3.5rem] leading-none font-bold text-white tracking-tight">{score.toFixed(2)}</span>
                                    {isDecayed ? (
                                         <span className="flex items-center gap-1 bg-red-500/20 text-red-300 px-2 py-0.5 rounded-md text-[11px] font-bold border border-red-500/20">-0.05</span>
                                    ) : (
                                        <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md text-[11px] font-bold border border-emerald-500/20">+0.1</span>
                                    )}
                                </div>
                             </div>
                             <div className="text-center">
                                <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#fbbf24]/50 flex items-center justify-center bg-[#fbbf24]/10 mb-1">
                                    <span className="text-[#fbbf24] font-bold text-lg">7.5</span>
                                </div>
                                <span className={`text-[9px] uppercase font-bold tracking-wider ${isDecayed ? 'text-red-200' : 'text-blue-200'}`}>Goal</span>
                             </div>
                        </div>

                        <div className="mt-3">
                             <div className="flex justify-between items-end mb-1.5">
                                <span className={`text-[10px] font-medium ${isDecayed ? 'text-red-200' : 'text-blue-200'}`}>
                                    {isDecayed ? 'Action Required: Repair Score' : 'Progress to Band 7.5'}
                                </span>
                                <span className="text-[10px] text-white font-bold">{(score/7.5 * 100).toFixed(0)}%</span>
                             </div>
                             <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full w-[86%] rounded-full transition-all duration-1000 ${
                                        isDecayed 
                                        ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                                        : 'bg-gradient-to-r from-blue-400 to-[#fbbf24] shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                                    }`}
                                    style={{width: `${(score/7.5 * 100)}%`}}
                                ></div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Social Competition Widget --- */}
            <div className="mx-4 mb-6 animate-in slide-in-from-bottom-5 duration-700 delay-100">
                <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-blue-600">JP</div>
                            <div className="w-7 h-7 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-amber-600">AS</div>
                            <div className="w-7 h-7 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-emerald-600">RK</div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-[#1e1b4b] flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                1,420 Students Online
                            </span>
                            <span className="text-[9px] text-slate-400">Practicing Reading right now</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        <Trophy size={12} className="text-[#fbbf24]" />
                        <span className="text-[10px] font-bold text-slate-600">Top 15%</span>
                    </div>
                </div>
            </div>

            {/* --- WEAKNESS WIDGET (Dynamic) --- */}
            {weaknesses.length > 0 && (
                <div className="mx-4 mb-6 animate-in slide-in-from-bottom duration-500">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-[14px] font-bold text-rose-600 flex items-center gap-2">
                            <AlertCircle size={16} /> Recent Mistakes
                        </h3>
                        <span className="text-[10px] font-medium text-slate-400">From last mock</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {weaknesses.map((w) => (
                            <button key={w.id} onClick={() => onRepairClick(w.topic)} className="bg-white p-3 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between active:scale-98 transition-transform group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                                        {w.type === 'Reading' ? <BookOpen size={18}/> : <Headphones size={18}/>}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-slate-800 text-[13px]">{w.topic}</h4>
                                        <p className="text-[10px] text-slate-400">{w.type} • {w.impact} Impact</p>
                                    </div>
                                </div>
                                <div className="bg-[#1e1b4b] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg group-hover:bg-[#312e81] transition-colors">
                                    Fix Now
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Play Daily Quizzes Section */}
            <div className="mx-4 mb-6 animate-in slide-in-from-bottom-6 duration-700 delay-200">
                <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Play Daily Quizzes</h3>
                
                <button onClick={onVocabClick} className="w-full h-[88px] bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-indigo-900/10 relative overflow-hidden group active:scale-[0.98] transition-all mb-4">
                    <div className="absolute top-0 right-0 bg-[#e0e7ff] text-[#312e81] text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">New</div>
                    <div className="text-left z-10 pt-1">
                        <p className="text-[10px] text-white/70 font-medium mb-1">Boost Vocabulary Daily</p>
                        <h3 className="text-[19px] font-bold text-white leading-tight">Play Words of<br/>the Day</h3>
                    </div>
                    <div className="w-9 h-9 bg-[#fbbf24] rounded-full flex items-center justify-center text-[#240046] shadow-md z-10 mt-4 group-hover:scale-110 transition-transform">
                        <ArrowLeft size={20} className="rotate-180" strokeWidth={3} />
                    </div>
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute right-[-20px] bottom-[-40px] w-32 h-32 rounded-full border-[10px] border-white/10"></div>
                        <div className="absolute right-[40px] bottom-[-60px] w-40 h-40 rounded-full border-[10px] border-white/5"></div>
                    </div>
                </button>

                {/* Heading: Your Streak */}
                <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Your Streak</h3>

                {/* Streak Section */}
                <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100 shadow-sm">
                           <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-[14px] font-bold text-[#1e1b4b] leading-tight">{streak} Days Streak</h3>
                            <p className="text-[10px] text-slate-500 font-medium leading-tight">You're on fire!</p>
                        </div>
                     </div>
                     <div className="flex gap-1.5">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                            <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] transition-all ${
                                i < 5 
                                ? 'bg-[#fbbf24] text-[#1e1b4b] font-bold shadow-sm scale-100' 
                                : i === 5 
                                    ? 'bg-white border-2 border-[#fbbf24] text-orange-500 scale-110' 
                                    : 'bg-slate-100 text-slate-300' 
                            }`}>
                                {i < 5 ? <Check size={12} strokeWidth={4} /> : i === 5 ? <Flame size={10} fill="currentColor" /> : day}
                            </div>
                        ))}
                     </div>
                </div>

                {/* Heading: Daily Practice Mix */}
                <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1 mt-6">Daily Practice Mix</h3>

                {/* Grid Layout: 2 items top, 1 item bottom */}
                <div className="grid grid-cols-2 gap-3 px-1">
                    <button onClick={() => onDailyClick('Reading')} className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-between h-[150px] active:scale-95 transition-transform text-left relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-6 -mt-6 opacity-60 group-hover:scale-110 transition-transform"></div>
                        <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 relative z-10 shadow-sm"><BookOpen size={22}/></div>
                        <div className="relative z-10">
                            <h4 className="font-bold text-[#1e1b4b] text-[15px] leading-tight mb-1">Reading<br/>Task</h4>
                            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">5 mins • <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">+0.05</span></p>
                        </div>
                    </button>

                    <button onClick={() => onDailyClick('Speaking')} className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-between h-[150px] active:scale-95 transition-transform text-left relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full -mr-6 -mt-6 opacity-60 group-hover:scale-110 transition-transform"></div>
                        <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100 relative z-10 shadow-sm"><Mic size={22}/></div>
                        <div className="relative z-10">
                            <h4 className="font-bold text-[#1e1b4b] text-[15px] leading-tight mb-1">Speaking<br/>Drill</h4>
                            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">3 mins • <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">+0.05</span></p>
                        </div>
                    </button>

                     <button onClick={() => onDailyClick('Listening')} className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-between h-[150px] active:scale-95 transition-transform text-left relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-full -mr-6 -mt-6 opacity-60 group-hover:scale-110 transition-transform"></div>
                        <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 relative z-10 shadow-sm"><Headphones size={22}/></div>
                        <div className="relative z-10">
                            <h4 className="font-bold text-[#1e1b4b] text-[15px] leading-tight mb-1">Listening<br/>Quiz</h4>
                            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">4 mins • <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">+0.05</span></p>
                        </div>
                    </button>
                 </div>
            </div>
        </div>
    );
}

function SpeakView({ onRecord }) {
    return (
        <div className="px-4 py-6 animate-in slide-in-from-right duration-300">
             <h2 className="text-[18px] font-bold text-[#1e1b4b] mb-4">Speaking Tests</h2>

             <div className="flex flex-col gap-4">
                 <div className="bg-[#f0f9ff] p-4 rounded-xl shadow-sm border border-blue-100 relative overflow-hidden group active:scale-[0.99] transition-transform cursor-pointer" onClick={onRecord}>
                     <div className="absolute top-3 right-3">
                        <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">New</span>
                     </div>
                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mb-3 shadow-lg">
                        <Mic size={20} />
                     </div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">FULL LENGTH EVALUATION</p>
                     <h3 className="text-[16px] font-bold text-[#1e1b4b] mb-1">AI Speaking Evaluation</h3>
                     
                     <div className="flex items-center text-blue-600 text-[11px] font-semibold mt-3">
                        Get instant feedback for entire speaking module <ChevronRight size={14} className="ml-1"/>
                     </div>
                 </div>

                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 active:scale-[0.99] transition-transform">
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">SPEAKING PART-1</p>
                     <div className="flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1e1b4b]">
                                <Zap size={24} fill="currentColor" className="text-indigo-900" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1e1b4b] text-[15px]">Instant Evaluation & Practice</h4>
                            </div>
                        </div>
                     </div>
                     <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                        <p className="text-[11px] text-slate-400">Practice from 100+ Speaking Topics</p>
                        <ChevronRight size={16} className="text-slate-300" />
                     </div>
                 </div>

                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 active:scale-[0.99] transition-transform">
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">SPEAKING PART-2</p>
                     <div className="flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1e1b4b]">
                                <ClipboardList size={24} className="text-indigo-900" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1e1b4b] text-[15px]">Cue Card Practice</h4>
                            </div>
                        </div>
                     </div>
                     <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                        <p className="text-[11px] text-slate-400">Practice from 100+ Cue Card Topics</p>
                        <ChevronRight size={16} className="text-slate-300" />
                     </div>
                 </div>
             </div>
        </div>
    )
}

function LessonsView() {
    return (
        <div className="px-4 py-6 animate-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold text-[#1e1b4b] mb-6">Lesson Plan</h2>
            <div className="flex flex-col gap-3">
                {['Reading Module', 'Writing Module', 'Listening Module', 'Speaking Module'].map((mod, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between active:scale-[0.98] transition-transform">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                i === 0 ? 'bg-rose-50 text-rose-500' : 
                                i === 1 ? 'bg-emerald-50 text-emerald-500' :
                                i === 2 ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                            }`}>
                                {i === 0 ? <BookOpen size={20}/> : i === 1 ? <PenTool size={20}/> : i === 2 ? <Headphones size={20}/> : <Mic size={20}/>}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">{mod}</h4>
                                <div className="h-1 w-24 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-[#1e1b4b]" style={{width: `${(4-i)*20}%`}}></div>
                                </div>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-300" />
                    </div>
                ))}
            </div>
        </div>
    )
}

function MockTestsView() {
    return (
        <div className="px-4 py-6 animate-in slide-in-from-right duration-300">
             <h2 className="text-2xl font-bold text-[#1e1b4b] mb-6">Mock Tests</h2>
             <div className="grid grid-cols-2 gap-3">
                 {['Reading', 'Listening', 'Writing', 'Speaking'].map((test, i) => (
                     <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                         <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                             {i === 0 ? <BookOpen size={20}/> : i === 1 ? <Headphones size={20}/> : i === 2 ? <PenTool size={20}/> : <Mic size={20}/>}
                         </div>
                         <div>
                             <h4 className="font-bold text-slate-800 text-sm">{test} Test</h4>
                             <p className="text-xs text-slate-400">5-10 mins</p>
                         </div>
                         <button className="w-full py-2 rounded-lg bg-slate-50 text-[#1e1b4b] text-xs font-bold hover:bg-[#1e1b4b] hover:text-white transition-colors">
                             Start
                         </button>
                     </div>
                 ))}
             </div>
        </div>
    )
}

function RecordingView({ onFinish }) {
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(timer);
                    onFinish();
                    return 100;
                }
                return p + 1.5;
            });
        }, 50);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 z-50 bg-[#1e1b4b] flex flex-col items-center justify-center text-white p-8 animate-in fade-in duration-300">
            <div className="w-32 h-32 rounded-full bg-blue-500/20 flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping"></div>
                <Mic size={40} className="text-blue-300" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Listening...</h2>
            <p className="text-white/60 text-center text-sm mb-12">Describe your favorite holiday destination.</p>
            
            <div className="w-full bg-white/10 h-14 rounded-2xl overflow-hidden flex items-center px-2 gap-1">
                 {[...Array(20)].map((_, i) => (
                     <div key={i} className="flex-1 bg-blue-400 rounded-full animate-pulse" style={{
                         height: `${Math.random() * 100}%`,
                         animationDelay: `${i * 0.05}s`
                     }}></div>
                 ))}
            </div>
            
            <button onClick={onFinish} className="mt-8 flex items-center gap-2 text-sm font-bold text-red-300 hover:text-red-200">
                <StopCircle /> Stop Recording
            </button>
        </div>
    )
}

function RepairView({ title, subtitle }) {
    return (
        <div className="absolute inset-0 z-50 bg-[#1e1b4b] flex flex-col items-center justify-center text-white p-8 animate-in fade-in duration-300">
             <div className="w-24 h-24 rounded-full border-4 border-white/20 border-t-[#fbbf24] animate-spin mb-8"></div>
             <h2 className="text-2xl font-bold mb-2">{title}</h2>
             <p className="text-white/60 text-center text-sm mb-8">{subtitle}</p>
        </div>
    )
}

function FeedbackView({ onRepair, onClose }) {
    return (
        <div className="h-full flex flex-col relative bg-[#f8fafc] animate-in slide-in-from-right duration-300">
            
            <button onClick={onClose} className="absolute top-4 left-4 z-50 bg-white/20 p-2 rounded-full text-[#1e1b4b] hover:bg-white/40 transition-colors">
                <ArrowLeft size={20} />
            </button>

            {/* Scrollable Container covering whole feedback view */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                
                {/* Header Area */}
                <div className="bg-white px-5 pt-12 pb-6 rounded-b-[2rem] shadow-sm z-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-[#1e1b4b] pl-10">Test Results</h2>
                    </div>

                    <div className="flex gap-4 mb-6">
                        {/* Donut Chart */}
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="transform -rotate-90 w-full h-full">
                                <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                                <circle cx="48" cy="48" r="40" stroke="#6366f1" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="220" strokeLinecap="round" />
                            </svg>
                            <div className="absolute text-center">
                                <span className="text-xl font-bold text-[#6366f1]">1</span>
                                <span className="text-sm text-slate-400">/8</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex-1 flex flex-col justify-center gap-2">
                            <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-green-700">Correct</span>
                                <span className="text-xs font-bold text-green-700">1</span>
                            </div>
                            <div className="bg-red-50 px-3 py-2 rounded-lg border border-red-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-red-700">Incorrect</span>
                                <span className="text-xs font-bold text-red-700">7</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-400 via-orange-300 to-green-400 h-3 rounded-full w-full mb-2 relative">
                        <div className="absolute top-0 left-[40%] w-1 h-5 bg-[#1e1b4b] -mt-1"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-4">
                        <span>Band 4.0</span>
                        <span className="text-[#1e1b4b]">Your Score: 4.5</span>
                        <span>Band 9.0</span>
                    </div>

                    <button className="w-full bg-[#6366f1] text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 active:scale-95 transition-transform hover:bg-[#4f46e5]">
                        Review Answers
                    </button>
                </div>

                {/* Areas of Improvement */}
                <div className="px-5 pt-6 pb-32">
                    <h3 className="text-[#1e1b4b] font-bold text-md mb-4 flex items-center gap-2">
                        <Target size={18} className="text-rose-500" />
                        Areas of Improvement
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="border border-red-200 text-red-600 bg-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">Match Heading</span>
                        <span className="border border-red-200 text-red-600 bg-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">True/False/Not Given</span>
                        <span className="border border-red-200 text-red-600 bg-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">Single Correct Answer</span>
                    </div>

                    {/* Repair Call to Action */}
                    <div className="bg-white p-5 rounded-2xl border border-indigo-50 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fbbf24]"></div>
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Recommended Action</p>
                                <h4 className="text-sm font-bold text-[#1e1b4b] mb-1">Fix "Match Headings"</h4>
                                <div className="flex items-center gap-1.5 bg-emerald-50 w-fit px-2 py-0.5 rounded-md">
                                    <TrendingUp size={12} className="text-emerald-600" />
                                    <span className="text-[10px] font-bold text-emerald-600">Boost score by +0.1</span>
                                </div>
                            </div>
                            <button onClick={onRepair} className="bg-[#1e1b4b] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-900/20 active:scale-95 transition-all hover:bg-[#312e81]">
                                Start Repair
                            </button>
                        </div>
                        {/* Decoration */}
                        <div className="absolute right-0 top-0 w-16 h-16 bg-[#fbbf24]/10 rounded-bl-full -mr-4 -mt-4"></div>
                    </div>

                    {/* Additional Practice Items (to demonstrate scroll) */}
                    <div className="mt-4 space-y-3">
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between opacity-60">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><BookOpen size={16}/></div>
                                <div>
                                    <h4 className="font-bold text-slate-700 text-xs">Vocabulary Drills</h4>
                                    <p className="text-[10px] text-slate-400">Locked until repair complete</p>
                                </div>
                            </div>
                            <Lock size={14} className="text-slate-300" />
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between opacity-60">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><Headphones size={16}/></div>
                                <div>
                                    <h4 className="font-bold text-slate-700 text-xs">Listening Section 2</h4>
                                    <p className="text-[10px] text-slate-400">Locked until repair complete</p>
                                </div>
                            </div>
                            <Lock size={14} className="text-slate-300" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ConfettiOverlay({ title, sub }) {
    return (
        <div className="absolute inset-0 pointer-events-none z-[60] flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl p-8 shadow-2xl text-center scale-up-center animate-in zoom-in-50 duration-300">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 animate-bounce">
                        <Award size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-[#1e1b4b] mb-1">{title}</h2>
                    <p className="text-slate-500 text-xs font-medium">{sub}</p>
                </div>
            </div>
        </div>
    )
}