import { useState } from 'react';
import { IngredientList } from './components/IngredientList';
import { RecipeList } from './components/RecipeList';

import { BatchList } from './components/BatchList';
import { Dashboard } from './components/Dashboard';

type View = 'dashboard' | 'ingredients' | 'recipes' | 'production';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              M
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">Mandazi Pro</span>
          </div>
          <nav className="flex gap-6 text-sm font-medium text-gray-500">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`${currentView === 'dashboard' ? 'text-indigo-600' : 'hover:text-gray-900'} transition-colors`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('ingredients')}
              className={`${currentView === 'ingredients' ? 'text-indigo-600' : 'hover:text-gray-900'} transition-colors`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setCurrentView('recipes')}
              className={`${currentView === 'recipes' ? 'text-indigo-600' : 'hover:text-gray-900'} transition-colors`}
            >
              Recipes
            </button>
            <button
              onClick={() => setCurrentView('production')}
              className={`${currentView === 'production' ? 'text-indigo-600' : 'hover:text-gray-900'} transition-colors`}
            >
              Production
            </button>
          </nav>
        </div>
      </header>

      <main className="py-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'ingredients' && <IngredientList />}
        {currentView === 'recipes' && <RecipeList />}
        {currentView === 'production' && <BatchList />}
      </main>
    </div>
  );
}

export default App;
