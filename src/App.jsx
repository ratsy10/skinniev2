import React, { useState, useEffect, createContext } from 'react'
import styled from 'styled-components'
import kawaiiCharacter from './assets/kawaii-skin-character.svg'
import { supabase } from './lib/supabase'

// Components
import Navigation from './components/Navigation'

// Screen Components
import HomeScreen from './screens/HomeScreen'
import CameraScreen from './screens/CameraScreen'
import JournalScreen from './screens/JournalScreen'
import InsightsScreen from './screens/InsightsScreen'
import ProfileScreen from './screens/ProfileScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import AuthScreen from './screens/AuthScreen'

// Create AuthContext
const defaultAuthContext = {
  isAuthenticated: false,
  user: null,
  login: () => Promise.resolve({ data: null, error: new Error('Not implemented') }),
  logout: () => Promise.resolve({ error: new Error('Not implemented') }),
  signup: () => Promise.resolve({ data: null, error: new Error('Not implemented') })
};

export const AuthContext = createContext(defaultAuthContext);

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  background-color: var(--soft-cream);
  padding-bottom: 70px; /* Space for navigation */
`

const PageContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--soft-cream);
  padding: 20px;
  text-align: center;
`

const CharacterImage = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`

const AppTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--deep-rose-red);
  margin-bottom: 10px;
  font-weight: bold;
`

const AppTagline = styled.p`
  font-size: 1.2rem;
  color: var(--dark-maroon);
  margin-bottom: 30px;
`

const StartButton = styled.button`
  background-color: var(--deep-rose-red);
  color: var(--off-white);
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(178, 58, 72, 0.3);
  
  &:hover {
    background-color: var(--dark-maroon);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(178, 58, 72, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(178, 58, 72, 0.3);
  }
`

const Sparkle = styled.span`
  margin-right: 5px;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: var(--deep-rose-red);
`

function App() {
  const [appState, setAppState] = useState('welcome');
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      if (session) {
        setAppState('main');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      if (session) {
        setAppState('main');
      } else {
        setAppState('auth');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStart = () => {
    setAppState('auth');
  };
  
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      setUser(data.user);
      setIsAuthenticated(true);
      setAppState('main');
      return { data, error: null };
    } catch (error) {
      console.error('Error logging in:', error.message);
      return { data: null, error };
    }
  };
  
  const signup = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      // Don't automatically set as authenticated for signup
      // User needs to verify email first
      return { data, error: null };
    } catch (error) {
      console.error('Error signing up:', error.message);
      return { data: null, error };
    }
  };
  
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAuthenticated(false);
      setAppState('auth');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const authContextValue = {
    isAuthenticated,
    user,
    login,
    logout,
    signup
  };

  if (loading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {appState === 'welcome' && (
        <WelcomeContainer>
          <CharacterImage src={kawaiiCharacter} alt="AuraSkin Kawaii Character" />
          <AppTitle>AuraSkin</AppTitle>
          <AppTagline>Understand your skin, one day at a time.</AppTagline>
          <StartButton onClick={handleStart}>
            <Sparkle>✨</Sparkle> Start Journey
          </StartButton>
        </WelcomeContainer>
      )}

      {appState === 'auth' && <AuthScreen />}

      {appState === 'onboarding' && <OnboardingScreen onComplete={() => setAppState('main')} />}

      {appState === 'main' && (
        <AppContainer>
          <PageContainer>
            {(() => {
              switch (activeTab) {
                case 'home':
                  return <HomeScreen />;
                case 'camera':
                  return <CameraScreen />;
                case 'journal':
                  return <JournalScreen />;
                case 'insights':
                  return <InsightsScreen />;
                case 'profile':
                  return <ProfileScreen />;
                default:
                  return <div>Screen not found</div>;
              }
            })()}
          </PageContainer>
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </AppContainer>
      )}
    </AuthContext.Provider>
  );
}

export default App;
