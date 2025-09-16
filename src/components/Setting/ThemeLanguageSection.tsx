import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeLanguageSectionProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: string;
  setLanguage: (value: string) => void;
}

const ThemeLanguageSection: React.FC<ThemeLanguageSectionProps> = ({
  darkMode,
  setDarkMode,
  language,
  setLanguage
}) => {
  return (
    <section className={`rounded-lg p-5 transition-all duration-200 ${
      darkMode ? 'bg-gray-800 shadow-gray-900/20' : 'bg-white shadow-gray-100/50'
    }`}>
      <h2 className={`text-lg font-medium mb-4 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Giao diện & Ngôn ngữ
      </h2>
      
      <div className="space-y-4">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-yellow-500" />}
            <div>
              <span className={`font-medium text-sm transition-colors ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Chế độ {darkMode ? 'tối' : 'sáng'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
              darkMode ? 'bg-blue-600' : 'bg-gray-300'
            } ${darkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm ${
              darkMode ? 'transform translate-x-5' : ''
            }`} />
          </button>
        </div>

        {/* Language Dropdown */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm">🌐</span>
            <div>
              <span className={`font-medium text-sm transition-colors ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Ngôn ngữ hiển thị
              </span>
            </div>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[120px] ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default ThemeLanguageSection;