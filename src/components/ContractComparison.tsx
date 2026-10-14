import React, { useState } from 'react';
import { Columns, Split, Copy, Check, FileCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface ContractComparisonProps {
  originalText: string;
  revisedText: string;
  language: 'ar' | 'en';
  onCopyRevised: () => void;
  onGoToAnalyzer?: () => void;
}

export const ContractComparison: React.FC<ContractComparisonProps> = ({
  originalText,
  revisedText,
  language,
  onCopyRevised,
  onGoToAnalyzer,
}) => {
  const isRtl = language === 'ar';
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyRevised();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Clause-level diff parsing
  const originalLines = originalText.split('\n').filter((l) => l.trim().length > 0);
  const revisedLines = revisedText.split('\n').filter((l) => l.trim().length > 0);

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {isRtl ? 'مقارنة مسودات العقود ورصد التعديلات (Diff View)' : 'Contract Draft Comparison (Diff View)'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              {isRtl
                ? 'قارن بين الصياغة الأصلية والنسخة المحصنة لتتبع إزالة الثغرات والبنود المجحفة وإضافة الشروط الحمائية وفقاً للقانون المصري.'
                : 'Compare original clauses against AI-remediated drafts to review loophole eliminations and newly added statutory protections.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>{isRtl ? 'جنباً إلى جنب' : 'Side-by-Side'}</span>
              </button>
              <button
                onClick={() => setViewMode('unified')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'unified'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                <span>{isRtl ? 'عرض موحد' : 'Unified'}</span>
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isRtl ? 'تم النسخ' : 'Copied') : (isRtl ? 'نسخ النسخة المنقحة' : 'Copy Revised Draft')}</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">
              {isRtl ? 'نصوص وثغرات تم استبدالها أو حذفها' : 'Removed / Replaced Loopholes'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">
              {isRtl ? 'صياغات حمائية وبنود محكمة جديدة' : 'Airtight Protective Clauses Added'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">
              {isRtl ? 'بنود متطابقة وسليمة' : 'Unchanged Standard Clauses'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Diff Display */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Original Upload */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>{isRtl ? 'مسودة العقد الأصلية (قبل المعالجة)' : 'Original Draft (Before Remediation)'}</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                {originalLines.length} {isRtl ? 'فقرة' : 'clauses'}
              </span>
            </div>
            <div className="p-5 font-legal text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-3 overflow-y-auto max-h-[600px] whitespace-pre-line bg-rose-50/10 dark:bg-rose-950/5">
              {originalText ? (
                originalText
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <p>{isRtl ? 'لم يتم تحميل أي عقد أصلي بعد.' : 'No original contract loaded yet.'}</p>
                  {onGoToAnalyzer && (
                    <button
                      onClick={onGoToAnalyzer}
                      className="mt-3 text-xs text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{isRtl ? 'الانتقال إلى فاحص العقود' : 'Go to Contract Analyzer'}</span>
                      {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Revised Draft */}
          <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-emerald-500/20 rounded-xl overflow-hidden shadow-xs flex flex-col">
            <div className="px-5 py-3.5 bg-emerald-50/50 dark:bg-emerald-950/30 border-b border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{isRtl ? 'مسودة العقد المحصنة (بعد سد الثغرات)' : 'Airtight Revised Draft (Remediated)'}</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                {revisedLines.length} {isRtl ? 'فقرة' : 'clauses'}
              </span>
            </div>
            <div className="p-5 font-legal text-sm leading-relaxed text-slate-800 dark:text-slate-200 space-y-3 overflow-y-auto max-h-[600px] whitespace-pre-line bg-emerald-50/10 dark:bg-emerald-950/10">
              {revisedText ? (
                revisedText
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <p>{isRtl ? 'ابدأ بفحص عقد أولاً لإنشاء المسودة المحصنة.' : 'Analyze a contract first to generate the airtight revised draft.'}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* Unified Inline Diff View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {isRtl ? 'العرض الموحد مع تسليط الضوء على بنود التعديل' : 'Unified Line-by-Line Difference View'}
            </span>
          </div>

          <div className="p-6 font-legal text-sm leading-relaxed space-y-3">
            {revisedLines.map((line, idx) => {
              const matchingOrig = originalLines.find((ol) => ol.includes(line.slice(0, 20)) || line.includes(ol.slice(0, 20)));
              const isChanged = !matchingOrig || matchingOrig !== line;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg transition-colors ${
                    isChanged
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-100'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isChanged && (
                    <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                      <FileCheck className="w-3 h-3" />
                      <span>{isRtl ? 'بند محصن ومعدل قانونياً:' : 'Legally Remediated Clause:'}</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line">{line}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
