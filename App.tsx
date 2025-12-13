

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ChallengesView } from './components/Marketplace';
import { LearningTrackView } from './components/LearningTrackView';
import { BootcampsView } from './components/BootcampsView';
import { CredentialsList } from './components/CredentialsList';
import { Assessment } from './components/Assessment';
import { ResultView } from './components/ResultView';
import { ProfileView } from './components/ProfileView';
import { JobsView } from './components/JobsView';
import { InterviewPrep } from './components/InterviewPrep';
import { ChatAssistant } from './components/ChatAssistant';
import { CommunityView } from './components/CommunityView';
import { MessagesView } from './components/MessagesView';
import { WalletDrawer } from './components/WalletDrawer';
import { ToastContainer, ToastMessage, ToastType } from './components/Toast';
import { ShareLayer } from './components/ShareLayer';
import { AdminLaunchDashboard } from './components/AdminLaunchDashboard';
import { PricingView } from './components/PricingView';
import { EmployerDashboard } from './components/EmployerDashboard'; // New Import
import { AppState, Credential, VerificationResult, Challenge, UserProfile, WalletState } from './types';

// Mock Initial Credentials
const initialCredentials: Credential[] = [
  { 
    id: '1', title: 'React Performance Optimization', issuer: 'VeritasPathAi', 
    date: '2023-10-15', score: 92, securityScore: 85, complexityScore: 95, performanceScore: 96,
    hash: '0x71C...9A2', status: 'verified',
    chainData: {
       network: 'Polygon Amoy',
       txHash: '0x32a...4b1',
       blockNumber: 1629384,
       tokenId: '4021',
       contractAddress: '0x4A1...9B2',
       ipfsHash: 'QmX...yZ2',
       gasUsed: '0.002 MATIC',
       mintedAt: '2023-10-15'
    }
  },
  { 
    id: '2', title: 'Secure API Design', issuer: 'VeritasPathAi', 
    date: '2023-11-02', score: 88, securityScore: 98, complexityScore: 82, performanceScore: 84,
    hash: '0x3B2...1F9', status: 'verified' 
  }
];

// Mock User Profile
const initialProfile: UserProfile = {
  name: 'Kevin Balcom',
  role: 'Senior Full Stack Developer',
  bio: 'Passionate developer specializing in scalable web architectures and secure blockchain implementations. Proven track record in building React applications and Node.js microservices.',
  location: 'San Francisco, CA',
  email: 'kevin@veritaspath.ai',
  githubUrl: 'github.com/kevinbalcom',
  linkedinUrl: 'linkedin.com/in/kevinbalcom',
  discord: {
    isConnected: false,
    username: null,
    discriminator: null,
    id: null
  },
  experiences: [
    {
      id: '1',
      role: 'Senior Frontend Engineer',
      company: 'TechFlow Solutions',
      duration: '2021 - Present',
      description: 'Led the migration of a legacy monolith to a Next.js micro-frontend architecture, improving load times by 40%.'
    },
    {
      id: '2',
      role: 'Software Developer',
      company: 'DataStream Inc.',
      duration: '2019 - 2021',
      description: 'Developed real-time data visualization dashboards using D3.js and WebSockets for enterprise clients.'
    }
  ],
  education: [
    {
      id: '1',
      degree: 'B.S. Computer Science',
      school: 'University of California, Berkeley',
      year: '2019'
    }
  ],
  privacy: {
    profileVisibility: 'public',
    showBio: true,
    showCredentials: true,
    showExperience: true,
    showEducation: true
  },
  plan: 'verified_pro', // Updated to match new PlanType
  
  // Gamification Stats
  xp: 12500,
  level: 14,
  streak: 12,
  seasonPoints: 4500,
  
  // Customization
  equippedFrame: 'gold',
  unlockedFrames: ['default', 'gold', 'neon'],

  // Admin Flag (Simulated)
  isSuperAdmin: true,
  isEmployer: true // Simulated for demo access
};

export default function App() {
  const [view, setView] = useState<AppState>(AppState.DASHBOARD);
  const [credentials, setCredentials] = useState<Credential[]>(initialCredentials);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [lastResult, setLastResult] = useState<VerificationResult | null>(null);
  
  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Share State
  const [shareData, setShareData] = useState({
    isOpen: false,
    title: '',
    subtitle: '',
    url: ''
  });

  const handleShare = (title: string, subtitle: string, url: string) => {
    setShareData({
      isOpen: true,
      title,
      subtitle,
      url
    });
  };

  const addToast = (title: string, message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Wallet State
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: '',
    network: 'Polygon Amoy',
    tokens: [],
    transactions: [],
    nfts: []
  });
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // Default challenge context
  const [activeChallenge, setActiveChallenge] = useState<Challenge>({
    id: '1',
    title: 'Secure Data Processing',
    description: 'Implement a function to mask sensitive PII data while maintaining log integrity.',
    category: 'Security',
    difficulty: 'Intermediate',
    time: '15 min',
    xp: 500,
    isLocked: false
  });

  const startAssessment = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setView(AppState.ASSESSMENT_CODE);
  };

  const handleAssessmentComplete = (result: VerificationResult) => {
    setLastResult(result);
    
    // If passed, add to credentials
    if (result.score >= 70) {
      addToast('Assessment Passed!', 'Your skill has been verified and recorded.', 'success');
      const newCred: Credential = {
        id: Date.now().toString(),
        title: activeChallenge.title, 
        issuer: 'VeritasPathAi',
        date: new Date().toISOString().split('T')[0],
        score: result.score,
        securityScore: result.securityScore,
        complexityScore: result.complexityScore,
        performanceScore: result.performanceScore,
        hash: '0x' + Math.random().toString(16).substr(2, 40), 
        status: 'verified'
      };
      setCredentials([newCred, ...credentials]);
    } else {
      addToast('Assessment Failed', 'Your score did not meet the verification threshold.', 'error');
    }
    
    setView(AppState.ASSESSMENT_RESULT);
  };

  const handleBackToDashboard = () => {
    setView(AppState.DASHBOARD);
    setLastResult(null);
  };

  const handleNavigate = (targetView: AppState) => {
    setView(targetView);
  }

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile({ ...userProfile, ...updated });
    addToast('Profile Updated', 'Changes have been saved successfully.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Conditionally Render Navbar unless in Launch Dashboard mode to keep it isolated */}
      {view !== AppState.LAUNCH_DASHBOARD && (
        <Navbar 
          onNavigate={handleNavigate} 
          currentView={view} 
          wallet={wallet}
          onWalletUpdate={setWallet}
          onOpenWallet={() => setIsWalletOpen(true)}
          userProfile={userProfile}
          onShare={handleShare}
        />
      )}
      
      <WalletDrawer 
        isOpen={isWalletOpen} 
        onClose={() => setIsWalletOpen(false)} 
        wallet={wallet}
        onDisconnect={() => {
           setWallet({ isConnected: false, address: null, balance: '', network: wallet.network, tokens: [], transactions: [], nfts: [] });
           setIsWalletOpen(false);
           addToast('Wallet Disconnected', 'Your session has been closed.', 'info');
        }}
        onNetworkSwitch={(network) => {
           setWallet(prev => ({ 
             ...prev, 
             network, 
             balance: network === 'Polygon Amoy' ? '145.2 MATIC' : '1.42 ETH' 
           }));
           addToast('Network Switched', `Connected to ${network}`, 'success');
        }}
      />
      
      <main className={view !== AppState.LAUNCH_DASHBOARD ? "pb-24 pt-4" : ""}>
        {view === AppState.DASHBOARD && (
          <Dashboard 
            startAssessment={() => startAssessment(activeChallenge)} 
            credentials={credentials} 
            onNavigate={handleNavigate}
            userProfile={userProfile}
            onShare={handleShare}
          />
        )}

        {view === AppState.CREDENTIALS && (
          <CredentialsList 
            credentials={credentials} 
            onShare={handleShare}
          />
        )}

        {view === AppState.CHALLENGES && (
          <ChallengesView 
            onStartAssessment={startAssessment}
            userProfile={userProfile}
          />
        )}

        {view === AppState.LEARNING && (
          <LearningTrackView />
        )}

        {view === AppState.BOOTCAMPS && (
          <BootcampsView userProfile={userProfile} />
        )}

        {view === AppState.JOBS && (
          <JobsView 
            credentials={credentials}
            userProfile={userProfile}
          />
        )}

        {view === AppState.COMMUNITY && (
          <CommunityView userProfile={userProfile} />
        )}

        {view === AppState.MESSAGES && (
          <MessagesView userProfile={userProfile} />
        )}

        {view === AppState.INTERVIEW && (
          <InterviewPrep 
            userProfile={userProfile}
          />
        )}
        
        {view === AppState.PROFILE && (
          <ProfileView 
            profile={userProfile}
            credentials={credentials}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {view === AppState.PRICING && (
          <PricingView />
        )}

        {view === AppState.EMPLOYER_DASHBOARD && (
          <EmployerDashboard userProfile={userProfile} />
        )}

        {(view === AppState.ASSESSMENT_CODE || 
          view === AppState.ASSESSMENT_VIDEO || 
          view === AppState.ASSESSMENT_PROCESSING) && (
          <Assessment 
            challenge={activeChallenge}
            onComplete={handleAssessmentComplete}
            onCancel={handleBackToDashboard}
          />
        )}

        {view === AppState.ASSESSMENT_RESULT && lastResult && (
          <ResultView 
            result={lastResult} 
            onClose={handleBackToDashboard}
            wallet={wallet} 
          />
        )}

        {view === AppState.LAUNCH_DASHBOARD && (
          <AdminLaunchDashboard />
        )}
      </main>

      {/* Global Overlays */}
      {view !== AppState.LAUNCH_DASHBOARD && <ChatAssistant />}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ShareLayer 
        isOpen={shareData.isOpen} 
        onClose={() => setShareData(prev => ({ ...prev, isOpen: false }))} 
        data={shareData}
      />
      
      {/* Dev/Admin Shortcut */}
      {(userProfile.isSuperAdmin || userProfile.isEmployer) && view !== AppState.LAUNCH_DASHBOARD && (
        <div className="fixed bottom-4 right-4 z-50 flex gap-2">
          {userProfile.isEmployer && (
             <button 
               onClick={() => setView(AppState.EMPLOYER_DASHBOARD)}
               className="bg-emerald-800 text-emerald-200 text-[10px] px-2 py-1 rounded border border-emerald-600 hover:text-white hover:bg-emerald-700 transition-colors"
             >
               Employer Dash
             </button>
          )}
          <button 
            onClick={() => setView(AppState.PRICING)}
            className="bg-slate-800 text-slate-500 text-[10px] px-2 py-1 rounded border border-slate-700 hover:text-white hover:border-slate-500 transition-colors"
          >
            Pricing Preview
          </button>
          {userProfile.isSuperAdmin && (
            <button 
              onClick={() => setView(AppState.LAUNCH_DASHBOARD)}
              className="bg-slate-800 text-slate-500 text-[10px] px-2 py-1 rounded border border-slate-700 hover:text-white hover:border-slate-500 transition-colors"
            >
              Admin Console
            </button>
          )}
        </div>
      )}
      {view === AppState.LAUNCH_DASHBOARD && (
         <div className="fixed top-4 left-4 z-[60]">
            <button 
              onClick={() => setView(AppState.DASHBOARD)}
              className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-full border border-slate-600 hover:bg-white hover:text-slate-900 transition-colors font-bold shadow-xl"
            >
              Exit Console
            </button>
         </div>
      )}
    </div>
  );
}