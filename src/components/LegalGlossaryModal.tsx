import React, { useState } from 'react';
import { EGYPTIAN_LEGAL_GLOSSARY, EGYPTIAN_CUSTOMARY_PRACTICES } from '../data/egyptianLawData';
import { BookOpen, Search, Scale, Sparkles, HelpCircle } from 'lucide-react';

interface LegalGlossaryModalProps {
  language: 'ar' | 'en';
}

export const LegalGlossaryModal: React.FC<LegalGlossaryModalProps> = ({ language }) => {
  const isRtl = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'statutory' | 'customary'>('all');

  const filteredTerms = EGYPTIAN_LEGAL_GLOSSARY.filter((term) => {
    const q = searchQuery.toLowerCase();
    return (
      term.termAr.toLowerCase().includes(q) ||
      term.termEn.toLowerCase().includes(q) ||
      term.definitionAr.toLowerCase().includes(q) ||
      term.definitionEn.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {isRtl ? 'المعجم القانوني والأعراف التجارية المصرية' : 'Egyptian Legal & Commercial Custom Glossary'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isRtl
                  ? 'دليل عملي شامل لشرح المصطلحات المعقدة، أسانيدها القانونية، وضوابط صياغتها العملية.'
                  : 'Comprehensive practical handbook explaining doctrines, statutory references, and drafting tips.'}
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'ابحث في المصطلحات والبنود...' : 'Search legal terms...'}
              className="w-full ps-9 pe-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
            <Search className="absolute start-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-900 dark:bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {isRtl ? 'جميع المصطلحات والأعراف' : 'All Terms & Customs'}
          </button>
          <button
            onClick={() => setActiveCategory('statutory')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeCategory === 'statutory'
                ? 'bg-slate-900 dark:bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {isRtl ? 'نصوص القانون المدني والتجاري' : 'Statutory Provisions'}
          </button>
          <button
            onClick={() => setActiveCategory('customary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeCategory === 'customary'
                ? 'bg-slate-900 dark:bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {isRtl ? 'الأعراف التجارية المعمول بها' : 'Commercial Custom'}
          </button>
        </div>
      </div>

      {/* Grid of Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(activeCategory === 'all' || activeCategory === 'statutory') &&
          filteredTerms.map((term, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{isRtl ? term.termAr : term.termEn}</span>
                  </h3>
                  <span className="text-[11px] font-medium text-slate-400 shrink-0">
                    {isRtl ? term.termEn : term.termAr}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {isRtl ? term.definitionAr : term.definitionEn}
                </p>

                {/* Legal Citation */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-3 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                    {isRtl ? 'السند التشريعي:' : 'Statutory Citation:'}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {term.legalReference}
                  </span>
                </div>
              </div>

              {/* Practical Tip */}
              <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 text-xs">
                <span className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'نصيحة الصياغة العملية:' : 'Practical Drafting Tip:'}</span>
                </span>
                <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                  {isRtl ? term.practicalTipAr : term.practicalTipEn}
                </p>
              </div>
            </div>
          ))}

        {/* Customary Practices */}
        {(activeCategory === 'all' || activeCategory === 'customary') &&
          EGYPTIAN_CUSTOMARY_PRACTICES.map((cp, idx) => (
            <div
              key={'cp-' + idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {isRtl ? cp.titleAr : cp.titleEn}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {cp.descriptionAr}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/30 text-xs text-emerald-800 dark:text-emerald-300">
                <span className="font-semibold block mb-0.5">
                  {isRtl ? 'الأثر القانوني والعرفي:' : 'Legal & Customary Impact:'}
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  {cp.legalImpact}
                </span>
              </div>
            </div>
          ))}
      </div>

    </div>
  );
};
