import { useState } from 'react';
import { IngredientList } from './components/IngredientList';
import { RecipeList } from './components/RecipeList';
import { BatchList } from './components/BatchList';
import { Dashboard } from './components/Dashboard';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { LogOut } from 'lucide-react';
import mandaziImg from './assets/mandazi.png';

type View = 'dashboard' | 'ingredients' | 'recipes' | 'production';

function AppContent() {
  const { user, logout, loading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | undefined>();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return authView === 'login'
      ? <Login onSwitchToSignup={() => setAuthView('signup')} />
      : <Signup onSwitchToLogin={() => setAuthView('login')} />;
  }

  const handleStartProduction = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setCurrentView('production');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <div className="w-8 h-8">
              <img src={mandaziImg} alt="mandazi" width="32" height="32" className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Mandazi Pro</span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="flex gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`${currentView === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'hover:text-gray-900 dark:hover:text-gray-200'} transition-colors`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('ingredients')}
                className={`${currentView === 'ingredients' ? 'text-indigo-600 dark:text-indigo-400' : 'hover:text-gray-900 dark:hover:text-gray-200'} transition-colors`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setCurrentView('recipes')}
                className={`${currentView === 'recipes' ? 'text-indigo-600 dark:text-indigo-400' : 'hover:text-gray-900 dark:hover:text-gray-200'} transition-colors`}
              >
                Recipes
              </button>
              <button
                onClick={() => setCurrentView('production')}
                className={`${currentView === 'production' ? 'text-indigo-600 dark:text-indigo-400' : 'hover:text-gray-900 dark:hover:text-gray-200'} transition-colors`}
              >
                Production
              </button>
            </nav>
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200 dark:border-gray-700">
              <ThemeToggle />
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="py-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'ingredients' && <IngredientList />}
        {currentView === 'recipes' && <RecipeList onStartProduction={handleStartProduction} />}
        {currentView === 'production' && <BatchList initialRecipeId={selectedRecipeId} />}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
