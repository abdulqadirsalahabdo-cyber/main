import React, { useState } from 'react';
import {
  ShieldCheck,
  FileSearch,
  FilePlus,
  Scale,
  Sparkles,
  GitCompare,
  BookOpen,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  Globe,
  ExternalLink,
  Award,
} from 'lucide-react';

interface HomeLandingProps {
  language: 'ar' | 'en';
  onSelectTab: (tab: 'analyzer' | 'generator' | 'diff' | 'assistant' | 'glossary') => void;
  onShowToast: (msg: string) => void;
}

export const HomeLanding: React.FC<HomeLandingProps> = ({ language, onSelectTab, onShowToast }) => {
  const isRtl = language === 'ar';
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    onShowToast(isRtl ? 'تم نسخ رابط الموقع الإلكتروني بنجاح!' : 'Website link copied successfully!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const faqs = [
    {
      qAr: 'هل هذه منصة موقع إلكتروني تعمل مباشرة على المتصفح عبر الرابط؟',
      qEn: 'Is this a full web platform accessible directly via web link in any browser?',
      aAr: 'نعم، هذه منصة موقع إلكتروني (Web Platform) سحابية 100% تعمل على جميع المتصفحات والأجهزة (كمبيوتر، هاتف ذكي، تابلت) دون الحاجة لتثبيت أي برامج أو تطبيقات، ويمكن لأي شخص زيارتها واستخدامها مباشرة عبر الرابط الخاص بك.',
      aEn: 'Yes, this is a 100% cloud web platform that runs directly in all modern web browsers across desktops, smartphones, and tablets without requiring any app installation.',
    },
    {
      qAr: 'كيف تحمي المنصة حقوق أطراف عقد الإيجار وفق القانون 4 لسنة 1996؟',
      qEn: 'How does the platform protect lease parties under Egyptian Law 4/1996?',
      aAr: 'تفحص المنصة بنود الإخلاء والصيانة والفسخ، وتضمن صياغة "الشرط الفاسخ الصريح" الذي يسلب القاضي سلطته التقديرية (م 158 مدني)، مع التوصية بوضع الصيغة التنفيذية بالشهر العقاري (قانون 137 لسنة 2006) للتمكن من الإخلاء المباشر دون دعاوى قضائية مطولة.',
      aEn: 'It audits eviction, maintenance, and termination clauses, ensuring an explicit rescission formula that divests judicial delay discretion (Art. 158), and incorporating the executive formula under Law 137/2006 for immediate non-judicial enforcement.',
    },
    {
      qAr: 'ما هي معايير فحص عقود العمل طبقاً لقانون العمل المصري رقم 12 لسنة 2003؟',
      qEn: 'What are the Egyptian Labor Law 12/2003 audit criteria?',
      aAr: 'ترصد المنصة بطلان فترات الاختبار التي تتجاوز 3 أشهر (المادة 31 عمال)، وتبطل شروط عدم المنافسة التعسفية الفضفاضة استناداً لأحكام محكمة النقض العمالية، وتضمن حقوق العامل وصاحب العمل في الإخطار ومكافأة نهاية الخدمة.',
      aEn: 'It detects invalid probationary periods exceeding 3 months (Art. 31), restricts abusive non-compete covenants pursuant to Cassation rulings, and balances notice and severance liabilities.',
    },
    {
      qAr: 'هل يمكن تصدير العقود المنشأة بصيغة Word (.docx) و PDF رسمية؟',
      qEn: 'Can generated contracts be exported to Word (.docx) and official PDF?',
      aAr: 'نعم، تتيح المنصة بضغطة زر تصدير العقد إلى مستند Microsoft Word (.docx) قابل للتعديل الكامل مع ضبط الاتجاه العربي RTL، بالإضافة إلى خيار التصدير والطباعة كـ PDF رسمي يحمل ترويسة جمهورية مصر العربية وأماكن التوقيعات القانونية.',
      aEn: 'Yes, with one click you can export the full agreement into an editable Microsoft Word (.docx) file with proper RTL styling, or print/export as an official formatted legal PDF with signature blocks.',
    },
  ];

  return (
    <div className="space-y-12 pb-8">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 lg:p-12 shadow-sm">
        
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 end-0 -mt-12 -me-12 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Trust Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-xs font-semibold text-amber-900 dark:text-amber-200">
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>
              {isRtl
                ? 'المنصة الرقمية المتخصصة في القانون المصري وأحكام محكمة النقض'
                : 'Premier Digital Platform for Egyptian Law & Court of Cassation Standards'}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {isRtl ? (
              <>
                منصة فحص وصياغة <span className="text-amber-600 dark:text-amber-400">العقود القانونية الذكية</span>
              </>
            ) : (
              <>
                The Intelligent Platform for <span className="text-amber-600 dark:text-amber-400">Egyptian Legal Contracts</span>
              </>
            )}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isRtl
              ? 'موقع إلكتروني متكامل يعمل سحابياً على جميع الأجهزة دون الحاجة لتثبيت أي تطبيقات. افحص عقود الإيجار، العمل، التوريد، والشركات واكشف الثغرات والالتزامات المجحفة بدقة متناهية.'
              : 'A full-fledged cloud web platform accessible from any browser without installing apps. Audit leases, employment, supply, and corporate agreements, uncover legal gaps, and formulate airtight contracts.'}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onSelectTab('analyzer')}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileSearch className="w-4 h-4" />
              <span>{isRtl ? 'بدء فحص عقد الآن' : 'Start Contract Audit'}</span>
            </button>

            <button
              onClick={() => onSelectTab('generator')}
              className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <FilePlus className="w-4 h-4 text-amber-500" />
              <span>{isRtl ? 'صياغة عقد جديد بالمعالج' : 'Build Custom Contract'}</span>
            </button>

            <button
              onClick={handleShareLink}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
              title={isRtl ? 'مشاركة رابط الموقع' : 'Share website link'}
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? (isRtl ? 'تم نسخ الرابط!' : 'Link Copied!') : (isRtl ? 'مشاركة رابط المنصة' : 'Share Website Link')}</span>
            </button>
          </div>

          {/* Web Access Guarantee */}
          <div className="pt-4 flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>{isRtl ? 'منصة ويب 100% عبر أي متصفح' : '100% Web Platform in any browser'}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>{isRtl ? 'تشفير وحماية تامة للبيانات' : 'Confidential & Secure'}</span>
            </div>
          </div>

        </div>

        {/* Live Metrics Counter Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums block">
              +18,400
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
              {isRtl ? 'عقد تم فحصه وتدقيقه' : 'Contracts Audited'}
            </span>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums block">
              99.4%
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
              {isRtl ? 'دقة كشف الثغرات والعيوب' : 'Vulnerability Detection Accuracy'}
            </span>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono tabular-nums block">
              100%
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
              {isRtl ? 'توافق مع القانون المصري والنقض' : 'Egyptian Law Compliance'}
            </span>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums block">
              0 sec
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
              {isRtl ? 'تحليل فوري وتصدير Word/PDF' : 'Instant Results & Export'}
            </span>
          </div>
        </div>

      </section>

      {/* Core Platform Features Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
            {isRtl ? 'أقسام وخدمات المنصة الإلكترونية' : 'Platform Features & Core Services'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isRtl ? 'كل ما تحتاجه لإدارة وتدقيق وصياغة العقود في مكان واحد عبر الويب' : 'Everything you need to audit, formulate, and compare contracts online'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Analyzer */}
          <div
            onClick={() => onSelectTab('analyzer')}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-xl p-6 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileSearch className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                {isRtl ? '1. فحص العقود وكشف الثغرات' : '1. Contract Audit & Loopholes'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                {isRtl
                  ? 'رفع ملفات Word و PDF وكشف البنود المجحفة وتحديد الصياغة المقترحة لسد الثغرات وفقاً لأحكام محكمة النقض المصرية.'
                  : 'Upload Word & PDF files to detect one-sided liabilities and extract airtight revisions grounded in Egyptian jurisprudence.'}
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 inline-flex items-center gap-1 group-hover:underline">
              <span>{isRtl ? 'فتح أداة الفحص' : 'Open Audit Tool'}</span>
              <span>→</span>
            </span>
          </div>

          {/* Card 2: Generator */}
          <div
            onClick={() => onSelectTab('generator')}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-xl p-6 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FilePlus className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                {isRtl ? '2. منشئ العقود المصري الذكي' : '2. Smart Contract Generator'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                {isRtl
                  ? 'معالج تفاعلي لصياغة عقود الإيجار والعمل والبيع والسرية، مع تضمين الشرط الفاسخ الصريح والشرط الجزائي والتحكيم والتصدير لـ Word و PDF.'
                  : 'Guided wizard generating leases, employment, sales, and NDAs with automatic rescission clauses, penal terms, and Word/PDF export.'}
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 inline-flex items-center gap-1 group-hover:underline">
              <span>{isRtl ? 'فتح منشئ العقود' : 'Open Contract Builder'}</span>
              <span>→</span>
            </span>
          </div>

          {/* Card 3: AI Legal Assistant */}
          <div
            onClick={() => onSelectTab('assistant')}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-xl p-6 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                {isRtl ? '3. المستشار القانوني الذكي AI' : '3. Legal AI Consultant'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                {isRtl
                  ? 'إجابات فورية مؤصلة بنصوص مواد القانون المدني والتجاري والعمل، مع اقتراحات استباقية للخطوات التالية وأزرار نسخ فورية.'
                  : 'Instant legal guidance citing exact statutory articles and Court of Cassation standards with proactive next steps.'}
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 inline-flex items-center gap-1 group-hover:underline">
              <span>{isRtl ? 'بدء استشارة قانونية' : 'Start Consultation'}</span>
              <span>→</span>
            </span>
          </div>

          {/* Card 4: Diff View */}
          <div
            onClick={() => onSelectTab('diff')}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-xl p-6 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <GitCompare className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                {isRtl ? '4. مقارنة المسودات (Diff View)' : '4. Contract Diff Comparison'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                {isRtl
                  ? 'مقارنة بصرية دقيقة جنباً إلى جنب بين مسودة العقد الأصلية والنسخة المحصنة لرصد كل كلمة تم تعديلها أو إضافتها.'
                  : 'Side-by-side visual difference tool highlighting additions, deletions, and protective clause replacements.'}
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 inline-flex items-center gap-1 group-hover:underline">
              <span>{isRtl ? 'فتح أداة المقارنة' : 'Open Diff Tool'}</span>
              <span>→</span>
            </span>
          </div>

          {/* Card 5: Legal Glossary */}
          <div
            onClick={() => onSelectTab('glossary')}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-xl p-6 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between md:col-span-2"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                {isRtl ? '5. معجم القوانين والأعراف التجارية المصرية' : '5. Egyptian Legal Doctrines & Commercial Customs'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                {isRtl
                  ? 'دليل عملي يشرح المصطلحات المعقدة (الشرط الفاسخ الصريح، العربون، الدفع بعدم التنفيذ، غرامة التهديد، الصورية، السند التنفيذي) مع نصائح تطبيقية للتفاوض والصياغة.'
                  : 'Comprehensive practical handbook explaining core doctrines with statutory grounds and negotiation tips for commercial contracts.'}
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 inline-flex items-center gap-1 group-hover:underline">
              <span>{isRtl ? 'تصفح المعجم القانوني' : 'Explore Legal Glossary'}</span>
              <span>→</span>
            </span>
          </div>

        </div>
      </section>

      {/* Egyptian Law FAQ Accordion Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            {isRtl ? 'الأسئلة الشائعة حول المنصة وتطبيق القوانين المصرية' : 'Frequently Asked Questions & Egyptian Legal Framework'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isRtl ? 'إجابات واضحة حول الوصول للموقع واستخدام أدواته وأحكام القانون المدني' : 'Clear answers regarding online platform access, features, and Egyptian Civil Code application'}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-start bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <span>{isRtl ? faq.qAr : faq.qEn}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-amber-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              {openFaq === idx && (
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-legal text-sm">
                  {isRtl ? faq.aAr : faq.aEn}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
