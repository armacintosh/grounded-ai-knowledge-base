import { Landmark, Search, Moon } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'colleges' | 'applicants' | 'chat';
  onTabChange: (tab: 'colleges' | 'applicants' | 'chat') => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="font-mono text-sm font-bold tracking-tighter uppercase flex items-center text-slate-900">
            <Landmark className="w-4 h-4 text-sage-600 mr-2" />
            Academic Explorer <span className="ml-2 font-normal opacity-50 text-slate-500">v2.0.0</span>
          </h1>
          <div className="flex space-x-1">
            <button
              onClick={() => onTabChange('colleges')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'colleges'
                  ? 'border-b-2 border-sage-600 text-sage-600'
                  : 'text-gray-500 hover:text-sage-600'
                }`}
            >
              Colleges
            </button>
            <button
              onClick={() => onTabChange('applicants')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'applicants'
                  ? 'border-b-2 border-sage-600 text-sage-600'
                  : 'text-gray-500 hover:text-sage-600'
                }`}
            >
              Applicants
            </button>
            <button
              onClick={() => onTabChange('chat')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'chat'
                  ? 'border-b-2 border-sage-600 text-sage-600'
                  : 'text-gray-500 hover:text-sage-600'
                }`}
            >
              Chat
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              className="pl-10 pr-4 py-1.5 text-xs font-mono bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-sage-600 focus:border-sage-600 w-64 outline-none"
              placeholder="QUERY DATABASE..."
              type="text"
            />
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <Moon className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </nav>
  );
}