import { NavTab, UserProfile } from '../types';
import { Sun, Moon, Globe, User, Shield, Share2 } from 'lucide-react';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language: 'ar' | 'en';
  onToggleLanguage: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onShareLink: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
  darkMode,
  onToggleDarkMode,
  user,
  onOpenAuth,
  onOpenProfile,
  onShareLink,
}) => {
  const isRtl = language === 'ar';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8 px-4 sm:px-6 h-16">
        
        {/* Zone 1: Single text element wordmark with emblem */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-500/30 shadow-xs flex items-center justify-center bg-slate-900">
            <img
              src="/src/assets/images/legal_scales_emblem_1791963064267.jpg"
              alt="Seal"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback icon
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <Shield className="w-4 h-4 text-amber-500 hidden" />
          </div>
          <button
            onClick={() => onSelectTab('home')}
            className="text-start whitespace-nowrap shrink-0 group cursor-pointer"
          >
            <span className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors block leading-tight">
              {isRtl ? 'محلل العقود الذكي' : 'Smart Contract Analyzer'}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
              {isRtl ? 'المنصة الرقمية للقانون المصري' : 'Egyptian Law Digital Platform'}
            </span>
          </button>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold">
          <button
            onClick={() => onSelectTab('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'home'
                ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isRtl ? 'الرئيسية' : 'Home'}
          </button>

          <button
            onClick={() => onSelectTab('analyzer')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'analyzer'
                ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isRtl ? 'فحص وتحليل العقود' : 'Contract Analyzer'}
          </button>

          <button
            onClick={() => onSelectTab('generator')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'generator'
                ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isRtl ? 'منشئ العقود الذكي' : 'Contract Generator'}
          </button>

          <button
            onClick={() => onSelectTab('diff')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'diff'
                ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isRtl ? 'مقارنة المسودات (Diff)' : 'Compare Drafts'}
          </button>

          <button
            onClick={() => onSelectTab('assistant')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'assistant'
                ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isRtl ? 'المستشار القانوني AI' : 'Legal AI Chat'}
          </button>

          <button
            onClick={() => onSelectTab('glossary')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'glossary'
                ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isRtl ? 'المعجم القانوني' : 'Legal Glossary'}
          </button>
        </nav>

        {/* Zone 3: 1 primary action area (Share link, Language toggle, Dark mode, User auth) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Share Web Link Button */}
          <button
            onClick={onShareLink}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={isRtl ? 'نسخ ومشاركة رابط الموقع' : 'Share website link'}
          >
            <Share2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          </button>

          {/* Language Toggle (AR / EN) */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={isRtl ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{isRtl ? 'English 🇬🇧' : 'العربية 🇪🇬'}</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Profile or Login CTA */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 ps-2 pe-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-amber-500/50 transition-colors cursor-pointer"
            >
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-6 h-6 rounded-full object-cover border border-amber-500/30"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate hidden sm:inline">
                {user.fullName}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
            >
              {isRtl ? 'تسجيل الدخول' : 'Sign In'}
            </button>
          )}

        </div>

      </div>

      {/* Mobile Navigation bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-2 overflow-x-auto text-[11px] font-medium">
        <button
          onClick={() => onSelectTab('home')}
          className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${currentTab === 'home' ? 'text-amber-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          {isRtl ? 'الرئيسية' : 'Home'}
        </button>
        <button
          onClick={() => onSelectTab('analyzer')}
          className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${currentTab === 'analyzer' ? 'text-amber-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          {isRtl ? 'الفحص' : 'Analyzer'}
        </button>
        <button
          onClick={() => onSelectTab('generator')}
          className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${currentTab === 'generator' ? 'text-amber-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          {isRtl ? 'المنشئ' : 'Generator'}
        </button>
        <button
          onClick={() => onSelectTab('diff')}
          className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${currentTab === 'diff' ? 'text-amber-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          {isRtl ? 'المقارنة' : 'Diff'}
        </button>
        <button
          onClick={() => onSelectTab('assistant')}
          className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${currentTab === 'assistant' ? 'text-amber-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          {isRtl ? 'المستشار' : 'Chat'}
        </button>
        <button
          onClick={() => onSelectTab('glossary')}
          className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${currentTab === 'glossary' ? 'text-amber-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          {isRtl ? 'المعجم' : 'Glossary'}
        </button>
      </div>
    </header>
  );
};
