import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  User as UserIcon, 
  Lock, 
  Activity, 
  Utensils, 
  Dumbbell, 
  LogOut, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles,
  Menu,
  X,
  ChevronRight,
  Users,
  LayoutDashboard,
  ShieldCheck,
  Home,
  Zap,
  Trophy,
  Camera,
  Edit,
  TrendingDown,
  TrendingUp,
  Crown,
  Instagram,
  Mail,
  Megaphone,
  ArrowRight
} from 'lucide-react';
import { ActivityLevel, Plan, PlanType, User, UserProfile, PlanItem, WeightEntry, CompetitionScores } from './types';
import { calculateCaloriesAndAnalysis, generatePlanTemplate, analyzeDietPlan, generateLandingImage } from './services/geminiService';

// --- MOCK DATA INITIALIZATION ---
const MOCK_ADMIN: User = {
  id: 'admin-1',
  name: 'Adminisztrátor',
  email: 'admin@neonfit.hu',
  role: 'admin',
  registeredAt: new Date()
};

// --- COMPONENT: GLASS CARD WRAPPER ---
const GlassCard: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`glass-panel rounded-2xl p-6 text-gray-100 relative overflow-hidden ${className}`}>
    {/* Decorative gradient glow */}
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

// --- COMPONENT: BUTTON ---
const NeonButton = ({ onClick, children, variant = 'primary', className = '', disabled = false, ...props }: any) => {
  const baseStyle = "px-6 py-3 rounded-lg font-rajdhani font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] border border-cyan-400/30",
    secondary: "bg-purple-600 hover:bg-purple-500 text-white hover:shadow-[0_0_20px_rgba(217,70,239,0.6)] border border-purple-400/30",
    outline: "bg-transparent border border-gray-500 hover:border-white text-gray-300 hover:text-white hover:bg-white/5",
    danger: "bg-red-600/80 hover:bg-red-500 text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]",
    ghost: "bg-transparent hover:text-cyan-400 text-gray-400 hover:bg-cyan-900/20",
    gold: "bg-yellow-600 hover:bg-yellow-500 text-white hover:shadow-[0_0_20px_rgba(234,179,8,0.6)] border border-yellow-400/30"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- LANDING PAGE COMPONENT (NEW) ---
const LandingPage = ({ onEnter }: { onEnter: () => void }) => {
    const [bgImage, setBgImage] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadBg = async () => {
            // Try to fetch generated image
            const img = await generateLandingImage();
            if (img) {
                setBgImage(img);
            }
        };
        loadBg();
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        // Calculate percentage from center
        const x = (clientX - innerWidth / 2) / 50; // dampening factor
        const y = (clientY - innerHeight / 2) / 50;
        setMousePos({ x, y });
    };

    return (
        <div 
            ref={containerRef}
            className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center"
            onMouseMove={handleMouseMove}
        >
            {/* Parallax Background Layer */}
            <div 
                className="absolute inset-[-50px] bg-cover bg-center transition-transform duration-100 ease-out"
                style={{ 
                    backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                    backgroundColor: '#050505',
                    transform: `translate(${-mousePos.x}px, ${-mousePos.y}px) scale(1.05)`,
                    opacity: bgImage ? 1 : 1
                }}
            >
                 {!bgImage && (
                     // Fallback gradient if generating
                     <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900" />
                 )}
                 {/* Overlay for readability */}
                 <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center animate-in fade-in zoom-in duration-1000">
                <div className="mb-2 inline-block px-4 py-1 border border-pink-500/50 rounded-full bg-pink-900/20 text-pink-400 text-sm font-bold tracking-widest uppercase backdrop-blur-md shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                    TRAINWITHBLOOD
                </div>
                
                <h1 className="text-7xl md:text-9xl font-rajdhani font-bold text-white leading-none tracking-tighter mb-4 drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                    ARIZE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 neon-text-cyan">CHALLENGE</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-300 font-light tracking-[0.2em] uppercase mb-8 max-w-3xl mx-auto border-y border-white/10 py-4">
                    6 Hét. <span className="text-pink-500 font-bold">Tiszta Vér.</span> Új Én.
                </p>

                <div className="max-w-2xl mx-auto mb-12 text-gray-400 leading-relaxed backdrop-blur-sm bg-black/30 p-6 rounded-xl border border-white/5">
                    <p className="mb-4">
                        Ez nem egy szépségverseny. Itt nem a genetika dönt, hanem az akarat.
                        A kihívás végén kisorsoljuk a fődíjat, de a szabály egyszerű:
                    </p>
                    <p className="text-white font-bold text-lg mb-4">
                        "Nem a legjobban kinéző nyer, hanem aki a legtöbbet fejlődik."
                    </p>
                    <p className="text-sm italic text-gray-500">
                        Készülj fel. Feszegesd a határaidat. Sok sikert mindenkinek.
                    </p>
                </div>

                <button 
                    onClick={onEnter}
                    className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-lg border-2 border-white text-white font-rajdhani font-bold text-xl tracking-wider uppercase transition-all hover:text-black hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                >
                    <div className="absolute inset-0 w-0 bg-cyan-400 transition-all duration-[250ms] ease-out group-hover:w-full opacity-100"></div>
                    <span className="relative flex items-center gap-3">
                        Kihívás Elfogadása <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
                    </span>
                </button>

                {!bgImage && (
                    <div className="mt-4 text-xs text-gray-600 animate-pulse flex items-center gap-2">
                        <Sparkles size={10}/> Háttér generálása...
                    </div>
                )}
            </div>
        </div>
    );
};

// --- GLOBAL HEADER ---
const GlobalHeader = ({ 
  user, 
  onLogout, 
  currentTab, 
  setTab, 
  onAdminLoginClick, 
  onHomeClick 
}: { 
  user: User | null, 
  onLogout: () => void, 
  currentTab: string, 
  setTab: (t: string) => void,
  onAdminLoginClick: () => void,
  onHomeClick: () => void
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-cyan-500/20 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={onHomeClick}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-purple-800 rounded flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(219,39,119,0.5)] border border-pink-500/30">
            TWB
          </div>
          <span className="text-2xl font-rajdhani font-bold tracking-wider text-white hidden sm:block group-hover:neon-text-magenta transition-all">
            TRAINWITH<span className="text-pink-500">BLOOD</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-4">
          {!user ? (
            // Logged Out Nav
            <>
              <button 
                onClick={onHomeClick}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all font-medium flex items-center gap-2"
              >
                <Home size={18} /> <span className="hidden sm:inline">Főoldal</span>
              </button>
              <NeonButton 
                variant="outline" 
                onClick={onAdminLoginClick}
                className="!py-2 !px-4 !text-xs sm:!text-sm border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/20 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              >
                <ShieldCheck size={16} /> Admin Belépés
              </NeonButton>
            </>
          ) : user.role === 'admin' ? (
            // Admin Nav
            <>
               <button 
                onClick={() => setTab('users')}
                className={`px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${currentTab === 'users' ? 'text-cyan-400 bg-cyan-900/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-gray-400 hover:text-white'}`}
              >
                <Users size={18} /> <span className="hidden sm:inline">Felhasználók</span>
              </button>
              <button 
                onClick={() => setTab('plans')}
                className={`px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${currentTab === 'plans' ? 'text-purple-400 bg-purple-900/20 shadow-[0_0_10px_rgba(217,70,239,0.2)]' : 'text-gray-400 hover:text-white'}`}
              >
                <LayoutDashboard size={18} /> <span className="hidden sm:inline">Tervek</span>
              </button>
              <button 
                onClick={() => setTab('competition')}
                className={`px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${currentTab === 'competition' ? 'text-yellow-400 bg-yellow-900/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'text-gray-400 hover:text-white'}`}
              >
                <Trophy size={18} /> <span className="hidden sm:inline">Verseny</span>
              </button>
            </>
          ) : (
            // User Nav
            <>
               <button 
                onClick={() => setTab('dashboard')}
                className={`px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${currentTab === 'dashboard' ? 'text-cyan-400 bg-cyan-900/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-gray-400 hover:text-white'}`}
              >
                <Activity size={18} /> <span className="hidden sm:inline">Főoldal</span>
              </button>
              <button 
                onClick={() => setTab('profile')}
                className={`px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${currentTab === 'profile' ? 'text-purple-400 bg-purple-900/20 shadow-[0_0_10px_rgba(217,70,239,0.2)]' : 'text-gray-400 hover:text-white'}`}
              >
                <UserIcon size={18} /> <span className="hidden sm:inline">Profilom</span>
              </button>
            </>
          )}

          {user && (
            <div className="h-8 w-px bg-gray-700 mx-2" />
          )}

          {user && (
            <button 
                onClick={onLogout}
                className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/20 transition-all"
                title="Kijelentkezés"
            >
                <LogOut size={20} />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  // --- STATE MANAGEMENT ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([MOCK_ADMIN]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  const [showLandingPage, setShowLandingPage] = useState(true);

  // Global setting for the challenge phase (simulated)
  const [isAfterPhotoEnabled, setIsAfterPhotoEnabled] = useState(false);

  // Editing Plan State
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  // Derived state for winner
  const currentWinner = users.find(u => u.isWinner);


  // --- AUTH HANDLERS ---
  const handleLogin = (email: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      if (user.role === 'admin') {
          alert("Admin fiókba csak az Admin Belépés felületen lehet bejelentkezni!");
          return;
      }
      setCurrentUser(user);
      setActiveTab('dashboard');
      setShowAdminLogin(false);
    } else {
      alert("Nincs ilyen felhasználó!");
    }
  };

  const handleAdminLogin = (username: string, pass: string) => {
      if (username === 'admin' && pass === 'admin') {
          setCurrentUser(MOCK_ADMIN);
          setActiveTab('users');
          setShowAdminLogin(false);
      } else {
          alert("Hibás admin adatok!");
      }
  }

  const handleRegister = (name: string, email: string) => {
    if (users.find(u => u.email === email)) {
      alert("Ez az email cím már regisztrálva van!");
      return;
    }
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: 'user',
      registeredAt: new Date()
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setActiveTab('profile'); // Go straight to profile to fill details
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    setShowAdminLogin(false);
    setIsRegistering(false);
    setShowLandingPage(true); // Return to landing page on logout
  };

  // --- USER DATA HANDLERS ---
  const handleUpdateProfile = async (profileData: UserProfile) => {
    if (!currentUser) return;
    
    // Lock stats if this is the first full save
    const isFirstSave = !currentUser.profile?.isLocked;
    
    const updatedProfile: UserProfile = {
        ...profileData,
        isLocked: true // Lock it
    };

    let result = { calories: profileData.calculatedCalories || 0, analysis: profileData.aiAnalysis || "" };
    
    // Only recalculate if it's the first time (since it's locked after)
    if (isFirstSave) {
        result = await calculateCaloriesAndAnalysis(updatedProfile);
        updatedProfile.calculatedCalories = result.calories;
        updatedProfile.aiAnalysis = result.analysis;
        updatedProfile.startWeight = updatedProfile.weight; // Set start weight
        updatedProfile.weightHistory = [{ date: new Date().toISOString().split('T')[0], weight: updatedProfile.weight }];
    }

    const updatedUser = { ...currentUser, profile: updatedProfile };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    alert(isFirstSave ? "Profil mentve és zárolva! Most már láthatod a dashboardot." : "Súly naplózva!");
    if(isFirstSave) setActiveTab('dashboard');
  };

  const handleAddWeightLog = (weight: number) => {
    if (!currentUser || !currentUser.profile) return;
    
    const newEntry: WeightEntry = { date: new Date().toISOString().split('T')[0], weight };
    const updatedProfile = { 
        ...currentUser.profile, 
        weight: weight, // Update current weight
        weightHistory: [...currentUser.profile.weightHistory, newEntry] 
    };

    const updatedUser = { ...currentUser, profile: updatedProfile };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const handlePhotoUpload = (type: 'before' | 'after', base64: string) => {
      if (!currentUser || !currentUser.profile) return;
      const updatedProfile = {
          ...currentUser.profile,
          photos: { ...currentUser.profile.photos, [type]: base64 }
      };
      const updatedUser = { ...currentUser, profile: updatedProfile };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  // --- ADMIN HANDLERS ---
  const handleCreateOrUpdatePlan = (planData: Plan) => {
    if (editingPlanId) {
        // Update existing
        setPlans(plans.map(p => p.id === editingPlanId ? planData : p));
        setEditingPlanId(null);
    } else {
        // Create new
        setPlans([...plans, planData]);
    }
  };

  const handleEditPlan = (planId: string) => {
      setEditingPlanId(planId);
      // Scroll to top or focus happens via rendering
  };

  const handleAssignPlan = (userId: string, planId: string, type: PlanType) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return type === PlanType.DIET 
          ? { ...u, assignedDietId: planId } 
          : { ...u, assignedWorkoutId: planId };
      }
      return u;
    }));
  };

  const handleScoreUser = (userId: string, scores: CompetitionScores) => {
      setUsers(users.map(u => u.id === userId ? { ...u, competitionScores: scores } : u));
  };

  const handleDeclareWinner = (userId: string) => {
      if (confirm("Biztosan kihirdeted ezt a felhasználót győztesként? Ez az összes felhasználónál meg fog jelenni.")) {
          setUsers(users.map(u => ({
              ...u,
              isWinner: u.id === userId
          })));
      }
  }

  // --- RENDER ---
  
  // If in landing page mode, show only the Landing Page
  if (showLandingPage) {
      return <LandingPage onEnter={() => setShowLandingPage(false)} />;
  }

  return (
    <div className="min-h-screen relative bg-[#050505] text-white selection:bg-pink-500 selection:text-black pt-20">
      {/* Background Ambient Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] animate-drift" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] animate-drift" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-pink-500/20 to-transparent -translate-x-1/2 rotate-45" />
      </div>

      <GlobalHeader 
        user={currentUser} 
        onLogout={handleLogout}
        currentTab={activeTab}
        setTab={setActiveTab}
        onAdminLoginClick={() => { setShowAdminLogin(true); setIsRegistering(false); }}
        onHomeClick={() => { setShowAdminLogin(false); setIsRegistering(false); setShowLandingPage(true); }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* --- NOT LOGGED IN STATES --- */}
        {!currentUser && (
          <AuthScreen 
            isRegistering={isRegistering} 
            setIsRegistering={setIsRegistering} 
            onLogin={handleLogin} 
            onRegister={handleRegister} 
            isAdminMode={showAdminLogin}
            onAdminLogin={handleAdminLogin}
            onCancelAdmin={() => setShowAdminLogin(false)}
          />
        )}

        {/* --- LOGGED IN: ADMIN STATES --- */}
        {currentUser?.role === 'admin' && (
          <>
            {activeTab === 'users' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <h2 className="text-3xl font-rajdhani font-bold mb-6 text-cyan-400">Felhasználók Kezelése</h2>
                 <AdminUserList 
                    users={users} 
                    plans={plans} 
                    onAssignPlan={handleAssignPlan} 
                 />
              </div>
            )}
            {activeTab === 'plans' && (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 xl:grid-cols-2 gap-8">
                 <div>
                    <h2 className="text-3xl font-rajdhani font-bold mb-6 text-purple-400">
                        {editingPlanId ? 'Terv Szerkesztése' : 'Új Terv Létrehozása'}
                    </h2>
                    <PlanCreator 
                        onCreate={handleCreateOrUpdatePlan} 
                        initialPlan={plans.find(p => p.id === editingPlanId)}
                        onCancelEdit={() => setEditingPlanId(null)}
                    />
                 </div>
                 <div>
                    <h2 className="text-3xl font-rajdhani font-bold mb-6 text-gray-400">Meglévő Tervek</h2>
                    <div className="space-y-4">
                        {plans.length === 0 && <p className="text-gray-500">Még nincsenek tervek létrehozva.</p>}
                        {plans.map(p => (
                            <GlassCard key={p.id} className="flex justify-between items-center group hover:bg-white/5 transition-colors">
                                <div>
                                    <h4 className="font-bold text-lg flex items-center gap-2">
                                        {p.type === PlanType.DIET ? <Utensils size={16} className="text-green-400"/> : <Dumbbell size={16} className="text-blue-400"/>}
                                        {p.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">{p.items.length} elem</p>
                                </div>
                                <NeonButton variant="ghost" onClick={() => handleEditPlan(p.id)} className="!p-2">
                                    <Edit size={18} />
                                </NeonButton>
                            </GlassCard>
                        ))}
                    </div>
                 </div>
               </div>
            )}
            {activeTab === 'competition' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-rajdhani font-bold text-yellow-400">Arize Verseny Értékelés</h2>
                        <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-full border border-gray-700">
                            <span className="text-sm text-gray-400">Utána képek feltöltése:</span>
                            <button 
                                onClick={() => setIsAfterPhotoEnabled(!isAfterPhotoEnabled)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${isAfterPhotoEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isAfterPhotoEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                    <AdminCompetition 
                        users={users} 
                        onScore={handleScoreUser} 
                        onDeclareWinner={handleDeclareWinner} 
                    />
                </div>
            )}
          </>
        )}

        {/* --- LOGGED IN: USER STATES --- */}
        {currentUser?.role === 'user' && (
          <>
             {activeTab === 'dashboard' && (
               <UserDashboard 
                  user={currentUser} 
                  allPlans={plans} 
                  onAddWeight={handleAddWeightLog}
                  onPhotoUpload={handlePhotoUpload}
                  isAfterPhotoEnabled={isAfterPhotoEnabled}
                  currentWinner={currentWinner}
               />
             )}
             {activeTab === 'profile' && (
               <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <h2 className="text-3xl font-rajdhani font-bold mb-6 text-white text-center">
                     {currentUser.profile?.isLocked ? 'Testsúly Naplózás' : 'Profil Beállítása'}
                 </h2>
                 <GlassCard>
                    <ProfileForm 
                      initialData={currentUser.profile} 
                      onSave={handleUpdateProfile} 
                    />
                 </GlassCard>
               </div>
             )}
          </>
        )}
      </div>
    </div>
  );
}

// --- AUTH COMPONENT ---
function AuthScreen({ 
    isRegistering, 
    setIsRegistering, 
    onLogin, 
    onRegister, 
    isAdminMode,
    onAdminLogin,
    onCancelAdmin
}: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminMode) {
        onAdminLogin(adminUser, adminPass);
    } else if (isRegistering) {
      onRegister(name, email);
    } else {
      onLogin(email);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-bold font-rajdhani text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-gray-400 neon-text-cyan mb-2 tracking-tighter">
          TRAINWITH<span className="text-pink-500 neon-text-magenta">BLOOD</span>
        </h1>
        <p className="text-xl text-pink-500 tracking-[0.3em] uppercase font-bold">
            {isAdminMode ? 'Adminisztrációs Felület' : 'Arize Challenge'}
        </p>
      </div>

      <GlassCard className={`w-full max-w-md border-t shadow-[0_0_30px_rgba(6,182,212,0.15)] ${isAdminMode ? 'border-red-500/50 shadow-[0_0_30px_rgba(220,38,38,0.15)]' : 'border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.15)]'}`}>
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          {isAdminMode ? <><Lock className="text-red-500" /> Admin Belépés</> : (isRegistering ? 'Csatlakozás az Arize-hoz' : 'Belépés')}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isAdminMode ? (
              <>
                <div>
                    <label className="block text-sm text-red-300 mb-1">Felhasználónév</label>
                    <input 
                        type="text" 
                        value={adminUser}
                        onChange={(e) => setAdminUser(e.target.value)}
                        className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none focus:shadow-[0_0_10px_rgba(220,38,38,0.3)] transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-red-300 mb-1">Jelszó</label>
                    <input 
                        type="password" 
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none focus:shadow-[0_0_10px_rgba(220,38,38,0.3)] transition-all"
                        required
                    />
                </div>
                <NeonButton type="submit" variant="danger" className="w-full mt-6">
                    Belépés
                </NeonButton>
                <button type="button" onClick={onCancelAdmin} className="w-full text-center text-sm text-gray-500 hover:text-white mt-4">
                    Vissza a felhasználói belépéshez
                </button>
              </>
          ) : (
              <>
                {isRegistering && (
                    <div>
                    <label className="block text-sm text-pink-300 mb-1">Teljes Név</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-pink-500 focus:outline-none focus:shadow-[0_0_10px_rgba(236,72,153,0.3)] transition-all"
                        required
                    />
                    </div>
                )}
                <div>
                    <label className="block text-sm text-pink-300 mb-1">Email Cím</label>
                    <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-pink-500 focus:outline-none focus:shadow-[0_0_10px_rgba(236,72,153,0.3)] transition-all"
                    required
                    />
                </div>

                <NeonButton type="submit" className="w-full mt-6 !bg-pink-600 hover:!bg-pink-500 !border-pink-400/30 hover:!shadow-[0_0_20px_rgba(236,72,153,0.6)]">
                    {isRegistering ? 'Regisztráció' : 'Belépés'} <ChevronRight size={20} />
                </NeonButton>

                <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                    <button 
                        type="button"
                        className="flex items-center justify-center w-full gap-2 bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                        onClick={() => !isRegistering ? onLogin("google_user@example.com") : alert("Google login szimuláció: Használd a sima belépést.")}
                    >
                        Google Fiók
                    </button>
                </div>

                <p className="mt-4 text-center text-sm text-gray-400">
                    {isRegistering ? 'Már van fiókod?' : 'Még nincs fiókod?'}
                    <button 
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)} 
                    className="ml-2 text-pink-400 hover:text-pink-300 underline decoration-pink-500/30 underline-offset-4 cursor-pointer"
                    >
                    {isRegistering ? 'Belépés' : 'Regisztráció'}
                    </button>
                </p>
              </>
          )}
        </form>
      </GlassCard>
    </div>
  );
}

// --- WEIGHT CHART COMPONENT ---
const WeightChart = ({ history }: { history: WeightEntry[] }) => {
    if (!history || history.length < 2) return <div className="h-40 flex items-center justify-center text-gray-500 text-sm italic">Még nincs elég adat a grafikonhoz (min. 2 mérés)</div>;

    const weights = history.map(h => h.weight);
    const maxW = Math.max(...weights);
    const minW = Math.min(...weights);
    const range = maxW - minW || 1;
    
    // Normalization
    const points = history.map((h, i) => {
        const x = (i / (history.length - 1)) * 100;
        const y = 100 - ((h.weight - minW) / range) * 80 - 10; // Leave top/bottom padding
        return `${x},${y}`;
    }).join(" ");

    return (
        <div className="h-48 w-full relative mt-4 group">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                {/* Grid lines */}
                <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2" />
                <line x1="0" y1="90" x2="100" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2" />
                
                {/* The line */}
                <polyline 
                    fill="none" 
                    stroke="#06b6d4" 
                    strokeWidth="2" 
                    points={points} 
                    className="drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]"
                />
                
                {/* Dots */}
                {history.map((h, i) => {
                     const x = (i / (history.length - 1)) * 100;
                     const y = 100 - ((h.weight - minW) / range) * 80 - 10;
                     return (
                         <g key={i} className="group/dot hover:cursor-pointer">
                             <circle cx={x} cy={y} r="2" fill="white" className="transition-all duration-300 hover:r-4" />
                             {/* Tooltip on hover */}
                             <g className="opacity-0 group-hover/dot:opacity-100 transition-opacity">
                                <rect x={Math.min(x, 80)} y={y - 15} width="20" height="10" rx="2" fill="rgba(0,0,0,0.8)" />
                                <text x={Math.min(x + 10, 90)} y={y - 8} fontSize="5" fill="white" textAnchor="middle">{h.weight}</text>
                             </g>
                         </g>
                     )
                })}
            </svg>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Start: {history[0].weight}kg</span>
                <span>Jelenlegi: {history[history.length-1].weight}kg</span>
            </div>
        </div>
    )
}

// --- PHOTO UPLOAD COMPONENT ---
const ImageUploader = ({ label, currentImage, onUpload, disabled = false }: { label: string, currentImage?: string, onUpload: (base64: string) => void, disabled?: boolean }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    onUpload(ev.target.result as string);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 uppercase tracking-wider font-bold">{label}</label>
            <div 
                className={`relative h-48 rounded-lg border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all
                ${currentImage ? 'border-cyan-500/50 bg-black' : 'border-gray-700 bg-white/5 hover:bg-white/10'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                onClick={() => !disabled && inputRef.current?.click()}
            >
                {currentImage ? (
                    <>
                        <img src={currentImage} alt="Uploaded" className="w-full h-full object-cover opacity-80" />
                        {!disabled && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-white text-sm flex items-center gap-1"><Edit size={14}/> Módosítás</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center text-gray-500">
                        {disabled ? <Lock className="mx-auto mb-2" size={24} /> : <Camera className="mx-auto mb-2" size={24} />}
                        <span className="text-xs">{disabled ? 'Jelenleg zárolva' : 'Kattints a feltöltéshez'}</span>
                    </div>
                )}
                <input 
                    type="file" 
                    ref={inputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                    disabled={disabled}
                />
            </div>
        </div>
    )
}

// --- WINNER ANNOUNCEMENT COMPONENTS ---

const WinnerCelebration = () => (
    <div className="col-span-1 lg:col-span-3 mb-6">
        <GlassCard className="border border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] bg-gradient-to-br from-yellow-900/20 to-black">
            <div className="text-center py-6 relative">
                <Crown className="w-24 h-24 text-yellow-400 mx-auto mb-4 animate-pulse" />
                <h1 className="text-5xl font-bold font-rajdhani text-yellow-400 neon-text-yellow mb-2">GRATULÁLUNK!</h1>
                <p className="text-2xl text-white font-bold mb-6">TE VAGY AZ ARIZE CHALLENGE GYŐZTESE! 🏆</p>
                
                <div className="max-w-xl mx-auto bg-black/40 p-6 rounded-xl border border-yellow-500/30">
                    <p className="text-gray-300 mb-4">
                        Hatalmas teljesítményt értél el! A nyereményed átvételéhez kérlek vedd fel velünk a kapcsolatot az alábbi elérhetőségek egyikén:
                    </p>
                    <div className="flex justify-center gap-6">
                        <a href="#" className="flex items-center gap-2 text-yellow-400 hover:text-yellow-200 transition-colors font-bold">
                            <Mail size={20} /> admin@trainwithblood.hu
                        </a>
                        <a href="#" className="flex items-center gap-2 text-pink-500 hover:text-pink-300 transition-colors font-bold">
                            <Instagram size={20} /> @trainwithblood
                        </a>
                    </div>
                </div>
            </div>
        </GlassCard>
    </div>
);

const GlobalWinnerShowcase = ({ winner }: { winner: User }) => {
    if (!winner.profile?.photos.before && !winner.profile?.photos.after) return null;

    return (
        <div className="col-span-1 lg:col-span-3 mb-8 animate-in slide-in-from-top-4 duration-700">
            <GlassCard className="border-t-4 border-yellow-500 relative">
                 <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-1 rounded-full font-bold uppercase text-sm shadow-lg flex items-center gap-2">
                    <Trophy size={16} /> Az Arize Challenge Győztese
                 </div>
                 <div className="flex flex-col md:flex-row items-center gap-8 pt-4">
                     <div className="text-center md:text-left">
                         <h2 className="text-3xl font-bold font-rajdhani text-white mb-1">{winner.name}</h2>
                         <p className="text-yellow-400 font-bold text-lg mb-4">Elképesztő Transzformáció</p>
                         <div className="bg-white/5 p-4 rounded-lg border border-white/10 inline-block">
                            <p className="text-sm text-gray-400 uppercase mb-1">Fogyás</p>
                            <p className="text-2xl font-bold text-white">
                                {(winner.profile?.startWeight || 0) - (winner.profile?.weight || 0)} kg
                            </p>
                         </div>
                     </div>
                     
                     <div className="flex-1 grid grid-cols-2 gap-4 w-full max-w-2xl">
                        <div className="relative rounded-lg overflow-hidden h-64 border-2 border-gray-700 bg-black/50">
                             {winner.profile?.photos.before ? (
                                 <img src={winner.profile.photos.before} alt="Before" className="w-full h-full object-cover" />
                             ) : <div className="w-full h-full flex items-center justify-center text-gray-600">Nincs kép</div>}
                             <div className="absolute bottom-0 left-0 w-full bg-black/70 text-white text-center py-2 text-xs font-bold uppercase">Start</div>
                        </div>
                        <div className="relative rounded-lg overflow-hidden h-64 border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] bg-black/50">
                             {winner.profile?.photos.after ? (
                                 <img src={winner.profile.photos.after} alt="After" className="w-full h-full object-cover" />
                             ) : <div className="w-full h-full flex items-center justify-center text-gray-600">Nincs kép</div>}
                             <div className="absolute bottom-0 left-0 w-full bg-yellow-500 text-black text-center py-2 text-xs font-bold uppercase">Eredmény</div>
                        </div>
                     </div>
                 </div>
            </GlassCard>
        </div>
    );
}

// --- USER DASHBOARD ---
function UserDashboard({ user, allPlans, onAddWeight, onPhotoUpload, isAfterPhotoEnabled, currentWinner }: { user: User, allPlans: Plan[], onAddWeight: (w: number) => void, onPhotoUpload: (t: 'before'|'after', d: string) => void, isAfterPhotoEnabled: boolean, currentWinner?: User }) {
  const assignedDiet = allPlans.find(p => p.id === user.assignedDietId);
  const assignedWorkout = allPlans.find(p => p.id === user.assignedWorkoutId);
  const [newWeight, setNewWeight] = useState<string>('');

  if (!user.profile?.isLocked) {
      return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <AlertCircle size={48} className="text-pink-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Profil beállítása szükséges</h2>
              <p className="text-gray-400 mb-4">Kérlek töltsd ki az adataidat a Profil menüpont alatt a challenge megkezdéséhez!</p>
          </div>
      )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
      
      {/* --- WINNER SECTIONS --- */}
      {user.isWinner && <WinnerCelebration />}
      {currentWinner && !user.isWinner && <GlobalWinnerShowcase winner={currentWinner} />}
      
      {/* Left Column: Stats & Progress */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Calorie Goal */}
        <GlassCard className="border-l-4 border-purple-500 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-xl font-bold font-rajdhani mb-2 flex items-center gap-2">
                <Activity className="text-purple-400" /> Napi Cél
              </h2>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-bold text-white neon-text-magenta">
                  {user.profile.calculatedCalories}
                </span>
                <span className="text-purple-300 mb-2">kcal</span>
              </div>
              <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/20 text-xs text-purple-100 leading-relaxed">
                <Sparkles size={12} className="inline mr-1 text-yellow-300" />
                {user.profile.aiAnalysis}
              </div>
            </div>
        </GlassCard>

        {/* Weight Tracker */}
        <GlassCard className="border-l-4 border-cyan-500">
          <h2 className="text-xl font-bold font-rajdhani flex items-center gap-2 mb-4">
             <TrendingUp className="text-cyan-400" /> Súlykövetés
          </h2>
          
          <div className="flex items-center gap-2 mb-4">
              <input 
                type="number" 
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Új súly (kg)"
                className="bg-black/30 border border-gray-600 rounded px-3 py-2 text-sm w-full focus:border-cyan-500 outline-none"
              />
              <NeonButton 
                variant="primary" 
                className="!py-2 !px-4"
                onClick={() => {
                    if(newWeight) {
                        onAddWeight(Number(newWeight));
                        setNewWeight('');
                    }
                }}
              >
                  <Plus size={16} />
              </NeonButton>
          </div>

          {user.profile.weightHistory && <WeightChart history={user.profile.weightHistory} />}
        </GlassCard>

        {/* Photos */}
        <GlassCard>
            <h2 className="text-xl font-bold font-rajdhani flex items-center gap-2 mb-4">
                <Camera className="text-gray-400" /> Transzformáció
            </h2>
            <div className="space-y-4">
                <ImageUploader 
                    label="Előtte Kép" 
                    currentImage={user.profile.photos.before} 
                    onUpload={(data) => onPhotoUpload('before', data)}
                />
                <ImageUploader 
                    label="Utána Kép" 
                    currentImage={user.profile.photos.after} 
                    onUpload={(data) => onPhotoUpload('after', data)}
                    disabled={!isAfterPhotoEnabled}
                />
                {!isAfterPhotoEnabled && <p className="text-xs text-gray-500 text-center italic">Az "Utána" kép feltöltése a challenge végén nyílik meg.</p>}
            </div>
        </GlassCard>
      </div>

      {/* Right Column: Plans */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-3xl font-rajdhani font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
          Arize Challenge Terveim
        </h2>

        {!assignedDiet && !assignedWorkout && (
            <div className="p-12 border-2 border-dashed border-gray-800 rounded-2xl text-center bg-black/20">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                    <Lock size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">A Tervek Zárolva</h3>
                <p className="text-gray-500">Az edződ hamarosan elkészíti a személyre szabott tervedet.</p>
            </div>
        )}

        {assignedDiet && (
          <GlassCard className="border-t border-green-500/50">
            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
              <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                <Utensils size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">{assignedDiet.name}</h3>
                <p className="text-xs text-gray-400">Aktív étrend</p>
              </div>
            </div>
            <PlanTable items={assignedDiet.items} type="diet" />
            {assignedDiet.calculatedStats && (
                <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-xs flex flex-col sm:flex-row justify-between items-center gap-2">
                    <span className="text-green-400 font-bold">Összesen: {assignedDiet.calculatedStats.totalCalories} kcal</span>
                    <span className="text-gray-400">{assignedDiet.calculatedStats.macros}</span>
                </div>
            )}
          </GlassCard>
        )}

        {assignedWorkout && (
          <GlassCard className="border-t border-blue-500/50">
            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                <Dumbbell size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">{assignedWorkout.name}</h3>
                <p className="text-xs text-gray-400">Aktív edzésterv</p>
              </div>
            </div>
            <PlanTable items={assignedWorkout.items} type="workout" />
          </GlassCard>
        )}
      </div>
    </div>
  );
}

// --- ADMIN COMPONENT: COMPETITION ---
function AdminCompetition({ users, onScore, onDeclareWinner }: { users: User[], onScore: (uid: string, scores: CompetitionScores) => void, onDeclareWinner: (uid: string) => void }) {
    // Filter out admin and users without full profiles
    const participants = users
        .filter(u => u.role !== 'admin' && u.profile)
        .sort((a, b) => (b.competitionScores?.total || 0) - (a.competitionScores?.total || 0));

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [scores, setScores] = useState<CompetitionScores>({ leanness: 5, muscle: 5, weightLoss: 5, total: 15 });

    const handleSaveScore = () => {
        if(selectedUser) {
            const total = Number(scores.leanness) + Number(scores.muscle) + Number(scores.weightLoss);
            onScore(selectedUser.id, { ...scores, total });
            setSelectedUser(null);
        }
    };

    const openScoring = (user: User) => {
        setSelectedUser(user);
        setScores(user.competitionScores || { leanness: 5, muscle: 5, weightLoss: 5, total: 15 });
    }

    if (selectedUser && selectedUser.profile) {
        const startW = selectedUser.profile.startWeight;
        const currW = selectedUser.profile.weight;
        const change = (currW - startW).toFixed(1);

        return (
            <div className="animate-in fade-in zoom-in duration-300">
                 <button onClick={() => setSelectedUser(null)} className="mb-4 text-gray-400 hover:text-white flex items-center gap-2"><ChevronRight className="rotate-180" size={16}/> Vissza a listához</button>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Photos */}
                    <GlassCard>
                        <div className="grid grid-cols-2 gap-4 h-[400px]">
                             <div className="h-full bg-black/30 rounded-lg overflow-hidden relative border border-gray-700">
                                 {selectedUser.profile.photos.before ? (
                                     <img src={selectedUser.profile.photos.before} className="w-full h-full object-cover" alt="Before" />
                                 ) : <div className="w-full h-full flex items-center justify-center text-gray-600">Nincs 'Előtte' kép</div>}
                                 <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-center py-1 text-xs font-bold uppercase">Előtte</div>
                             </div>
                             <div className="h-full bg-black/30 rounded-lg overflow-hidden relative border border-gray-700">
                                 {selectedUser.profile.photos.after ? (
                                     <img src={selectedUser.profile.photos.after} className="w-full h-full object-cover" alt="After" />
                                 ) : <div className="w-full h-full flex items-center justify-center text-gray-600">Nincs 'Utána' kép</div>}
                                 <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-center py-1 text-xs font-bold uppercase">Utána</div>
                             </div>
                        </div>
                    </GlassCard>
                    
                    {/* Stats & Scoring */}
                    <div className="space-y-6">
                         <GlassCard className="border-l-4 border-yellow-500">
                             <div className="flex justify-between items-center mb-4">
                                 <h2 className="text-2xl font-bold">{selectedUser.name} Eredményei</h2>
                                 {selectedUser.isWinner && (
                                     <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                         <Trophy size={14}/> JELENLEGI GYŐZTES
                                     </div>
                                 )}
                             </div>
                             
                             <div className="grid grid-cols-3 gap-4 text-center mb-6">
                                 <div>
                                     <div className="text-gray-400 text-xs uppercase">Start</div>
                                     <div className="text-xl font-bold">{startW} kg</div>
                                 </div>
                                 <div>
                                     <div className="text-gray-400 text-xs uppercase">Jelenlegi</div>
                                     <div className="text-xl font-bold">{currW} kg</div>
                                 </div>
                                 <div>
                                     <div className="text-gray-400 text-xs uppercase">Változás</div>
                                     <div className={`text-xl font-bold ${Number(change) <= 0 ? 'text-green-400' : 'text-red-400'}`}>{change} kg</div>
                                 </div>
                             </div>
                             
                             <h3 className="text-lg font-bold text-yellow-400 mb-3 border-b border-white/10 pb-2">Pontozás (1-10)</h3>
                             <div className="space-y-4">
                                 <div>
                                     <label className="flex justify-between text-sm mb-1">
                                         <span>Szálkásság</span>
                                         <span className="text-yellow-300 font-bold">{scores.leanness}</span>
                                     </label>
                                     <input type="range" min="1" max="10" value={scores.leanness} onChange={e => setScores({...scores, leanness: Number(e.target.value)})} className="w-full accent-yellow-500" />
                                 </div>
                                 <div>
                                     <label className="flex justify-between text-sm mb-1">
                                         <span>Izomtömeg Növekedés</span>
                                         <span className="text-yellow-300 font-bold">{scores.muscle}</span>
                                     </label>
                                     <input type="range" min="1" max="10" value={scores.muscle} onChange={e => setScores({...scores, muscle: Number(e.target.value)})} className="w-full accent-yellow-500" />
                                 </div>
                                 <div>
                                     <label className="flex justify-between text-sm mb-1">
                                         <span>Fogyás Mértéke</span>
                                         <span className="text-yellow-300 font-bold">{scores.weightLoss}</span>
                                     </label>
                                     <input type="range" min="1" max="10" value={scores.weightLoss} onChange={e => setScores({...scores, weightLoss: Number(e.target.value)})} className="w-full accent-yellow-500" />
                                 </div>
                             </div>
                             
                             <div className="mt-6 flex justify-between items-center gap-4">
                                 <div className="text-2xl font-bold font-rajdhani whitespace-nowrap">Össz: <span className="text-yellow-400">{Number(scores.leanness) + Number(scores.muscle) + Number(scores.weightLoss)}</span> pont</div>
                                 <div className="flex gap-2">
                                     {!selectedUser.isWinner ? (
                                        <NeonButton variant="gold" className="!py-2 !px-3 text-xs" onClick={() => onDeclareWinner(selectedUser.id)}>
                                            <Trophy size={16} /> Hirdetés Győztesként
                                        </NeonButton>
                                     ) : (
                                         <div className="text-yellow-500 text-xs font-bold border border-yellow-500 rounded px-3 py-2">
                                             <Megaphone size={16} className="inline mr-1"/> KIHIRDETVE
                                         </div>
                                     )}
                                     <NeonButton variant="secondary" className="!py-2 !px-3" onClick={handleSaveScore}>Mentés</NeonButton>
                                 </div>
                             </div>
                         </GlassCard>
                    </div>
                 </div>
            </div>
        )
    }

    return (
        <div className="grid gap-4">
            {participants.map((u, idx) => (
                <GlassCard key={u.id} className={`flex items-center justify-between hover:bg-white/5 transition-colors group ${u.isWinner ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : ''}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${u.isWinner ? 'bg-yellow-500 text-black shadow-[0_0_15px_gold]' : idx === 0 ? 'bg-yellow-500/20 text-yellow-400' : idx === 1 ? 'bg-gray-400 text-black' : idx === 2 ? 'bg-orange-700 text-white' : 'bg-gray-800 text-gray-500'}`}>
                            {u.isWinner ? <Crown size={20}/> : `#${idx + 1}`}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                {u.name}
                                {u.isWinner && <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded font-bold uppercase">Győztes</span>}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {u.profile?.startWeight}kg <ChevronRight className="inline w-3 h-3"/> {u.profile?.weight}kg
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <div className="text-xs text-gray-500 uppercase">Pontszám</div>
                            <div className="text-2xl font-bold text-yellow-400 font-rajdhani">{u.competitionScores?.total || 0}</div>
                        </div>
                        <NeonButton variant="outline" className="!py-2" onClick={() => openScoring(u)}>
                             Értékelés
                        </NeonButton>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}

// --- ADMIN COMPONENT: USER LIST ---
function AdminUserList({ users, plans, onAssignPlan }: { users: User[], plans: Plan[], onAssignPlan: (uid: string, pid: string, type: PlanType) => void }) {
    return (
        <div className="grid gap-4">
          {users.filter((u: User) => u.role !== 'admin').map((user: User) => (
            <GlassCard key={user.id} className="flex flex-col lg:flex-row justify-between gap-6 hover:bg-white/5 transition-colors border-l-4 border-transparent hover:border-cyan-500">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center font-bold text-xl text-gray-400 border border-gray-700">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-bold text-xl leading-tight">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>
                
                <div className="flex gap-4 mt-4 ml-1">
                   <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${user.assignedDietId ? 'text-green-400 bg-green-900/20 border-green-500/20' : 'text-gray-500 border-gray-700'}`}>
                      <Utensils size={12} /> {user.assignedDietId ? 'Étrend Rendben' : 'Nincs étrend'}
                   </span>
                   <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${user.assignedWorkoutId ? 'text-blue-400 bg-blue-900/20 border-blue-500/20' : 'text-gray-500 border-gray-700'}`}>
                      <Dumbbell size={12} /> {user.assignedWorkoutId ? 'Edzés Rendben' : 'Nincs edzés'}
                   </span>
                </div>
              </div>

              {/* Calorie Need Badge - Centered for Admin to see immediately */}
              <div className="flex flex-col items-center justify-center px-6 py-2 bg-black/30 rounded-xl border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] min-w-[150px]">
                  <span className="text-xs text-purple-400 uppercase tracking-wider font-bold mb-1">Szükséglet</span>
                  {!user.profile ? (
                     <span className="text-red-400 text-sm flex items-center gap-1"><AlertCircle size={14}/> Hiányos</span>
                  ) : (
                      <>
                        <span className="text-3xl font-bold font-rajdhani text-white neon-text-magenta">
                            {user.profile.calculatedCalories}
                        </span>
                        <span className="text-xs text-gray-400">kcal / nap</span>
                      </>
                  )}
              </div>

              <div className="flex flex-col justify-center gap-3 min-w-[300px]">
                <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Étrend kiválasztása</label>
                    <select 
                    className="w-full bg-black/40 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 focus:border-cyan-500 outline-none hover:border-gray-500 transition-colors"
                    onChange={(e) => onAssignPlan(user.id, e.target.value, PlanType.DIET)}
                    value={user.assignedDietId || ""}
                    >
                    <option value="">-- Válassz --</option>
                    {plans.filter((p: Plan) => p.type === PlanType.DIET).map((p: Plan) => (
                        <option key={p.id} value={p.id}>{p.name} {p.calculatedStats ? `(${p.calculatedStats.totalCalories} kcal)` : ''}</option>
                    ))}
                    </select>
                </div>

                <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Edzésterv kiválasztása</label>
                    <select 
                    className="w-full bg-black/40 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 focus:border-cyan-500 outline-none hover:border-gray-500 transition-colors"
                    onChange={(e) => onAssignPlan(user.id, e.target.value, PlanType.WORKOUT)}
                    value={user.assignedWorkoutId || ""}
                    >
                    <option value="">-- Válassz --</option>
                    {plans.filter((p: Plan) => p.type === PlanType.WORKOUT).map((p: Plan) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                    </select>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
    );
}

// --- PLAN CREATOR COMPONENT ---
function PlanCreator({ onCreate, initialPlan, onCancelEdit }: { onCreate: (p: Plan) => void, initialPlan?: Plan, onCancelEdit?: () => void }) {
    const [name, setName] = useState('');
    const [type, setType] = useState<PlanType>(PlanType.DIET);
    const [items, setItems] = useState<PlanItem[]>([{ day: '', content: '', details: '', sets: '', reps: '' }]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [dietStats, setDietStats] = useState<{totalCalories: number, macros: string} | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if (initialPlan) {
            setName(initialPlan.name);
            setType(initialPlan.type);
            setItems(initialPlan.items);
            if (initialPlan.calculatedStats) {
                setDietStats(initialPlan.calculatedStats);
            }
        } else {
            // Reset
            setName('');
            setType(PlanType.DIET);
            setItems([{ day: '', content: '', details: '', sets: '', reps: '' }]);
            setDietStats(null);
        }
    }, [initialPlan]);
  
    const handleAddItem = () => {
      setItems([...items, { day: '', content: '', details: '', sets: '', reps: '' }]);
    };
  
    const handleChangeItem = (index: number, field: keyof PlanItem, value: string) => {
      const newItems = [...items];
      newItems[index][field] = value;
      setItems(newItems);
    };

    const handleGenerate = async () => {
        if(!name) { alert("Adj meg egy nevet a generáláshoz!"); return; }
        setIsGenerating(true);
        const generatedItems = await generatePlanTemplate(type, name);
        if (generatedItems.length > 0) {
            setItems(generatedItems);
        } else {
            alert("Nem sikerült generálni. Ellenőrizd az API kulcsot.");
        }
        setIsGenerating(false);
    }

    const handleAnalyzeDiet = async () => {
        setIsAnalyzing(true);
        const stats = await analyzeDietPlan(items);
        setDietStats(stats);
        setIsAnalyzing(false);
    }
  
    const handleSave = () => {
      if (!name || items.some(i => !i.day || !i.content)) {
        alert("Minden mezőt tölts ki!");
        return;
      }
      const newPlan: Plan = {
        id: initialPlan ? initialPlan.id : Math.random().toString(36).substr(2, 9),
        name,
        type,
        items,
        description: `Létrehozva: ${new Date().toLocaleDateString()}`,
        calculatedStats: dietStats || undefined
      };
      onCreate(newPlan);
      if (!initialPlan) {
        setName('');
        setItems([{ day: '', content: '', details: '', sets: '', reps: '' }]);
        setDietStats(null);
        alert("Terv sikeresen létrehozva!");
      } else {
          alert("Terv sikeresen módosítva!");
      }
    };
  
    return (
      <GlassCard>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{initialPlan ? 'Terv Szerkesztése' : 'Új Sablon Létrehozása'}</h3>
            <div className="flex gap-2">
                {initialPlan && (
                    <button onClick={onCancelEdit} className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded transition-colors">Mégse</button>
                )}
                <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="text-xs flex items-center gap-1 text-cyan-300 hover:text-cyan-100 bg-cyan-900/30 px-3 py-2 rounded border border-cyan-500/30 disabled:opacity-50 transition-all"
                >
                    <Sparkles size={14} /> {isGenerating ? 'Generálás folyamatban...' : 'AI Sablon Generálás'}
                </button>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-4 bg-black/20 rounded-xl border border-white/5">
            <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Terv Neve</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    placeholder={type === PlanType.DIET ? "pl. 2500kcal Szálkásító" : "pl. 3 Napos Kezdő Heti Terv"}
                    className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.2)] outline-none transition-all"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Típus</label>
                <select 
                    value={type} 
                    onChange={e => { setType(e.target.value as PlanType); setItems([{ day: '', content: '', details: '', sets: '', reps: '' }]); }}
                    disabled={!!initialPlan}
                    className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 focus:border-purple-500 outline-none transition-all disabled:opacity-50"
                >
                    <option value={PlanType.DIET}>Étrend</option>
                    <option value={PlanType.WORKOUT}>Edzésterv</option>
                </select>
            </div>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 uppercase tracking-wider mb-2 px-2">
             <div className="col-span-2">{type === PlanType.DIET ? "Időpont/Nap" : "Nap/Csoport"}</div>
             <div className={type === PlanType.DIET ? "col-span-5" : "col-span-4"}>{type === PlanType.DIET ? "Étel Megnevezés" : "Gyakorlat"}</div>
             {type === PlanType.WORKOUT && <div className="col-span-2">Szett (Pl. 1-3)</div>}
             {type === PlanType.WORKOUT && <div className="col-span-2">Ismétlés (Pl. 8-12)</div>}
             <div className={type === PlanType.DIET ? "col-span-4" : "col-span-2"}>{type === PlanType.DIET ? "Részletek (Kcal, adag)" : "Megjegyzés"}</div>
             <div className="col-span-1"></div>
        </div>

        <div className="space-y-2 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-start animate-in fade-in duration-300 group">
               <input 
                 value={item.day}
                 onChange={e => handleChangeItem(idx, 'day', e.target.value)}
                 className="col-span-2 bg-white/5 rounded p-2 text-sm border border-transparent focus:border-gray-500 outline-none focus:bg-white/10 transition-colors"
                 placeholder="..."
               />
               <input 
                 value={item.content}
                 onChange={e => handleChangeItem(idx, 'content', e.target.value)}
                 className={`${type === PlanType.DIET ? "col-span-5" : "col-span-4"} bg-white/5 rounded p-2 text-sm border border-transparent focus:border-gray-500 outline-none focus:bg-white/10 transition-colors`}
                 placeholder="..."
               />
               
               {type === PlanType.WORKOUT && (
                   <>
                    <input 
                        value={item.sets || ''}
                        onChange={e => handleChangeItem(idx, 'sets', e.target.value)}
                        className="col-span-2 bg-white/5 rounded p-2 text-sm border border-transparent focus:border-gray-500 outline-none focus:bg-white/10 transition-colors"
                        placeholder="Sets"
                    />
                    <input 
                        value={item.reps || ''}
                        onChange={e => handleChangeItem(idx, 'reps', e.target.value)}
                        className="col-span-2 bg-white/5 rounded p-2 text-sm border border-transparent focus:border-gray-500 outline-none focus:bg-white/10 transition-colors"
                        placeholder="Reps"
                    />
                   </>
               )}

               <input 
                 value={item.details}
                 onChange={e => handleChangeItem(idx, 'details', e.target.value)}
                 className={`${type === PlanType.DIET ? "col-span-4" : "col-span-1"} bg-white/5 rounded p-2 text-sm border border-transparent focus:border-gray-500 outline-none focus:bg-white/10 transition-colors`}
                 placeholder="..."
               />

               <button 
                 onClick={() => {
                     const newItems = items.filter((_, i) => i !== idx);
                     setItems(newItems.length ? newItems : [{ day: '', content: '', details: '', sets: '', reps: '' }]);
                 }}
                 className="col-span-1 flex items-center justify-center h-full text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
               >
                 <Trash2 size={16} />
               </button>
            </div>
          ))}
        </div>

        {/* Stats Display for Diet */}
        {type === PlanType.DIET && (
            <div className="mb-6">
                {dietStats ? (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4 animate-in zoom-in duration-300">
                        <div>
                            <div className="text-xs text-green-400 uppercase font-bold mb-1">AI Becsült Értékek</div>
                            <div className="text-xl font-bold text-white">{dietStats.totalCalories} kcal</div>
                            <div className="text-sm text-gray-300">{dietStats.macros}</div>
                        </div>
                        <button onClick={() => setDietStats(null)} className="text-xs text-gray-500 hover:text-white">Újraszámolás</button>
                    </div>
                ) : (
                    <NeonButton 
                        variant="ghost" 
                        onClick={handleAnalyzeDiet} 
                        disabled={isAnalyzing || items.length < 2}
                        className="w-full border border-dashed border-green-500/30 text-green-400 hover:bg-green-900/20"
                    >
                       {isAnalyzing ? <Sparkles className="animate-spin" size={16}/> : <Zap size={16} />} 
                       {isAnalyzing ? 'Számítás...' : 'AI Tápérték Elemzés & Összesítés'}
                    </NeonButton>
                )}
            </div>
        )}
  
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <NeonButton variant="ghost" onClick={handleAddItem} className="flex-1 border border-dashed border-gray-700 hover:border-cyan-500">
            <Plus size={16} /> Sor Hozzáadása
          </NeonButton>
          <NeonButton variant="secondary" onClick={handleSave} className="flex-1">
            <Save size={16} /> {initialPlan ? 'Frissítés' : 'Mentés'}
          </NeonButton>
        </div>
      </GlassCard>
    );
  }

// --- HELPER COMPONENTS ---

function ProfileForm({ initialData, onSave }: { initialData?: UserProfile, onSave: (data: UserProfile) => void }) {
  const [formData, setFormData] = useState<UserProfile>(initialData || {
    age: 25,
    weight: 70,
    startWeight: 70,
    height: 175,
    gender: 'male',
    activityLevel: ActivityLevel.MODERATELY_ACTIVE,
    goal: 'lose_weight',
    daysAvailable: 3,
    weightHistory: [],
    photos: {}
  });

  const isLocked = formData.isLocked;

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-400 mb-1">Kor (év)</label>
                <input 
                    type="number" 
                    value={formData.age} 
                    onChange={e => handleChange('age', Number(e.target.value))} 
                    disabled={isLocked}
                    className={`w-full bg-white/5 rounded p-3 outline-none border border-transparent transition-all ${isLocked ? 'opacity-50 cursor-not-allowed text-gray-500' : 'focus:border-cyan-500 focus:bg-black/40'}`} 
                />
            </div>
            <div>
                <label className="block text-gray-400 mb-1">Nem</label>
                <select 
                    value={formData.gender} 
                    onChange={e => handleChange('gender', e.target.value)} 
                    disabled={isLocked}
                    className={`w-full bg-white/5 rounded p-3 outline-none border border-transparent transition-all ${isLocked ? 'opacity-50 cursor-not-allowed text-gray-500' : 'focus:border-cyan-500 focus:bg-black/40'}`}
                >
                    <option value="male">Férfi</option>
                    <option value="female">Nő</option>
                </select>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-400 mb-1">Súly (kg) {isLocked && '(Kezdő)'}</label>
                <input 
                    type="number" 
                    value={formData.weight} 
                    onChange={e => handleChange('weight', Number(e.target.value))} 
                    disabled={isLocked}
                    className={`w-full bg-white/5 rounded p-3 outline-none border border-transparent transition-all ${isLocked ? 'opacity-50 cursor-not-allowed text-gray-500' : 'focus:border-cyan-500 focus:bg-black/40'}`}
                />
            </div>
            <div>
                <label className="block text-gray-400 mb-1">Magasság (cm)</label>
                <input 
                    type="number" 
                    value={formData.height} 
                    onChange={e => handleChange('height', Number(e.target.value))} 
                    disabled={isLocked}
                    className={`w-full bg-white/5 rounded p-3 outline-none border border-transparent transition-all ${isLocked ? 'opacity-50 cursor-not-allowed text-gray-500' : 'focus:border-cyan-500 focus:bg-black/40'}`}
                />
            </div>
        </div>
        <div>
            <label className="block text-gray-400 mb-1">Aktivitási Szint</label>
            <select 
                value={formData.activityLevel} 
                onChange={e => handleChange('activityLevel', e.target.value)} 
                disabled={isLocked}
                className={`w-full bg-white/5 rounded p-3 outline-none border border-transparent transition-all ${isLocked ? 'opacity-50 cursor-not-allowed text-gray-500' : 'focus:border-cyan-500 focus:bg-black/40'}`}
            >
                {Object.values(ActivityLevel).map(level => (
                    <option key={level} value={level}>{level}</option>
                ))}
            </select>
        </div>
        <div>
            <label className="block text-gray-400 mb-1">Fő Cél</label>
            <select 
                value={formData.goal} 
                onChange={e => handleChange('goal', e.target.value)} 
                disabled={isLocked}
                className={`w-full bg-white/5 rounded p-3 outline-none border border-transparent transition-all ${isLocked ? 'opacity-50 cursor-not-allowed text-gray-500' : 'focus:border-cyan-500 focus:bg-black/40'}`}
            >
                <option value="lose_weight">Fogyás</option>
                <option value="muscle_gain">Izomépítés</option>
                <option value="maintenance">Szintentartás</option>
            </select>
        </div>
        
        {!isLocked ? (
             <NeonButton type="submit" variant="primary" className="w-full mt-4">Számítás & Rögzítés</NeonButton>
        ) : (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-2 text-red-300 text-xs">
                <Lock size={16} className="mt-0.5 shrink-0"/>
                <span>A profilod alapadatai zárolva vannak a Challenge idejére. Súlyt a Főoldalon tudsz naplózni.</span>
            </div>
        )}
    </form>
  );
}

function PlanTable({ items, type }: { items: PlanItem[], type: 'diet' | 'workout' }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                        <th className="py-2 px-3">{type === 'diet' ? 'Időpont' : 'Nap'}</th>
                        <th className="py-2 px-3">{type === 'diet' ? 'Étel' : 'Gyakorlat'}</th>
                        {type === 'workout' && <th className="py-2 px-3 text-center">Szett</th>}
                        {type === 'workout' && <th className="py-2 px-3 text-center">Ismétlés</th>}
                        <th className="py-2 px-3 text-right">{type === 'diet' ? 'Részletek' : 'Megjegyzés'}</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 px-3 font-semibold text-cyan-100">{item.day}</td>
                            <td className="py-3 px-3">{item.content}</td>
                            {type === 'workout' && <td className="py-3 px-3 text-center font-mono text-cyan-300">{item.sets}</td>}
                            {type === 'workout' && <td className="py-3 px-3 text-center font-mono text-purple-300">{item.reps}</td>}
                            <td className="py-3 px-3 text-sm text-gray-400 text-right">{item.details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}