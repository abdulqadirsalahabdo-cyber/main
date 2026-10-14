import React, { useState, useEffect } from 'react';
import { UserProfile, ActivityItem, Language, NavTab } from './types';
import { Navbar } from './components/Navbar';
import { HomeLanding } from './components/HomeLanding';
import { ContractAnalyzer } from './components/ContractAnalyzer';
import { ContractGenerator } from './components/ContractGenerator';
import { ContractComparison } from './components/ContractComparison';
import { LegalChatAssistant } from './components/LegalChatAssistant';
import { LegalGlossaryModal } from './components/LegalGlossaryModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Toast } from './components/Toast';
import { SAMPLE_CONTRACTS } from './data/egyptianLawData';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  // Authenticated user state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sca_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default initial verified profile for instant experience
    return {
      id: 'user-default',
      email: 'bdalqadrslahbdalqadrmhmdqabyl@gmail.com',
      fullName: 'عبد القادر صلاح',
      age: 34,
      avatarUrl: '/src/assets/images/profile_avatar_user_1791963064840.jpg',
      role: 'مستشار قانوني معتمد · محكمة النقض',
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
  });

  // Activity History State
  const [activityHistory, setActivityHistory] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('sca_activity');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'act-1',
        type: 'analysis',
        title: 'عقد إيجار شقة سكنية (خاضع للقانون 4 لسنة 1996)',
        contractType: 'residential_lease',
        date: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
        riskScore: 75,
        previewSnippet: 'تم اكتشاف غياب صياغة الشرط الفاسخ الصريح وإلقاء كامل عبء الصيانة على المستأجر.',
        data: SAMPLE_CONTRACTS[0].content,
      },
    ];
  });

  // Diff comparison texts
  const [diffOriginal, setDiffOriginal] = useState<string>(SAMPLE_CONTRACTS[0].content);
  const [diffRevised, setDiffRevised] = useState<string>(
    SAMPLE_CONTRACTS[0].content
      .replace(
        'إذا تأخر المستأجر عن سداد الأجرة يحق للمؤجر فسخ العقد بعد إنذاره على يد محضر ومطالبته بالطرد والتعويض.',
        'إذا أخل المستأجر بسداد القيمة الإيجارية في ميعاد استحقاقها أو خالف أي التزام جوهري، يُعتبر هذا العقد مفسوخاً من تلقاء نفسه فوراً دون حاجة إلى تنبيه أو إعذار أو إنذار أو استصدار حكم قضائي، مع التزام المستأجر بإخلاء العين فوراً.'
      )
      .replace(
        'يلتزم المستأجر بجميع أعمال الصيانة للعين المؤجرة دون استثناء مهما بلغت تكلفتها أو سببها، ولا يحق له مطالبة المؤجر بأي مصاريف.',
        'يلتزم المستأجر بأعمال الصيانة الدورية الاستهلاكية الناتجة عن استعماله العادي فقط. أما الإصلاحات الهيكلية الجسيمة والضرورية وصيانة العقار الخارجية والمرافق الرئيسية فتكون على عاتق المؤجر وحده طبقاً للمادة 567 من القانون المدني.'
      )
  );

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync Language and Direction
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Sync Dark Mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save state
  useEffect(() => {
    if (user) {
      localStorage.setItem('sca_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sca_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sca_activity', JSON.stringify(activityHistory));
  }, [activityHistory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleSaveToActivity = (title: string, content: string, type: string, riskScore?: number) => {
    const newItem: ActivityItem = {
      id: 'act-' + Date.now(),
      type: type as any,
      title,
      contractType: type,
      date: new Date().toISOString(),
      riskScore,
      previewSnippet: content.slice(0, 120) + '...',
      data: content,
    };
    setActivityHistory((prev) => [newItem, ...prev]);
  };

  const handleOpenDiffView = (original: string, revised: string) => {
    setDiffOriginal(original);
    setDiffRevised(revised);
    setCurrentTab('diff');
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast(language === 'ar' ? 'تم نسخ رابط المنصة للمشاركة!' : 'Platform link copied for sharing!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onToggleLanguage={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onShareLink={handleShareLink}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentTab === 'home' && (
          <HomeLanding
            language={language}
            onSelectTab={setCurrentTab}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'analyzer' && (
          <ContractAnalyzer
            language={language}
            onShowToast={showToast}
            onSaveToActivity={handleSaveToActivity}
            onOpenDiffView={handleOpenDiffView}
            onOpenGlossary={() => setCurrentTab('glossary')}
          />
        )}

        {currentTab === 'generator' && (
          <ContractGenerator
            language={language}
            onShowToast={showToast}
            onSaveToActivity={handleSaveToActivity}
          />
        )}

        {currentTab === 'diff' && (
          <ContractComparison
            originalText={diffOriginal}
            revisedText={diffRevised}
            language={language}
            onCopyRevised={() => showToast(language === 'ar' ? 'تم نسخ المسودة المنقحة' : 'Revised draft copied')}
            onGoToAnalyzer={() => setCurrentTab('analyzer')}
          />
        )}

        {currentTab === 'assistant' && (
          <LegalChatAssistant
            language={language}
            onShowToast={showToast}
            onDraftRequest={(prompt) => {
              setCurrentTab('generator');
              showToast(language === 'ar' ? 'تم تحويلك إلى منشئ العقود' : 'Redirected to Contract Generator');
            }}
          />
        )}

        {currentTab === 'glossary' && (
          <LegalGlossaryModal language={language} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-4 sm:px-6 transition-colors no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {language === 'ar' ? 'محلل العقود الذكي' : 'Smart Contract Analyzer'}
            </span>
            <span>·</span>
            <span>{language === 'ar' ? 'جمهورية مصر العربية' : 'Arab Republic of Egypt'}</span>
          </div>

          <p className="text-[11px] text-center">
            {language === 'ar'
              ? 'منظومة الذكاء القانوني المتوافقة مع القانون المدني رقم 131 لسنة 1948 وقانون التجارة رقم 17 لسنة 1999 وأحكام محكمة النقض.'
              : 'Legal intelligence system compliant with Egyptian Civil Code, Commercial Code, and Court of Cassation standards.'}
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setCurrentTab('glossary')}
              className="hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
            >
              {language === 'ar' ? 'المعجم القانوني' : 'Legal Glossary'}
            </button>
            <span>·</span>
            <button
              onClick={() => setCurrentTab('assistant')}
              className="hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
            >
              {language === 'ar' ? 'المستشار AI' : 'Legal Assistant'}
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modal (Email OTP) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          showToast(language === 'ar' ? 'تم تسجيل الدخول بنجاح. أهلاً بك!' : 'Signed in successfully. Welcome!');
        }}
        language={language}
      />

      {/* User Profile & Activity Modal */}
      {user && (
        <UserProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          user={user}
          onUpdateUser={(updated) => {
            setUser(updated);
            showToast(language === 'ar' ? 'تم تحديث الملف الشخصي' : 'Profile updated');
          }}
          activityHistory={activityHistory}
          onSelectActivity={(item) => {
            if (item.type === 'analysis') {
              setCurrentTab('analyzer');
            } else {
              setCurrentTab('generator');
            }
          }}
          onDeleteActivity={(id) => {
            setActivityHistory((prev) => prev.filter((a) => a.id !== id));
            showToast(language === 'ar' ? 'تم حذف العنصر من السجل' : 'Item deleted from activity');
          }}
          language={language}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

    </div>
  );
}
