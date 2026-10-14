import React, { useState, useRef } from 'react';
import { ContractAnalysisResult, LegalLoophole } from '../types';
import { SAMPLE_CONTRACTS } from '../data/egyptianLawData';
import { RiskGauge } from './RiskGauge';
import { exportContractToDocx, printOfficialDocument } from '../services/exportService';
import mammoth from 'mammoth';
import {
  UploadCloud,
  FileText,
  Search,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Download,
  Printer,
  Scale,
  RefreshCw,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface ContractAnalyzerProps {
  language: 'ar' | 'en';
  onShowToast: (msg: string) => void;
  onSaveToActivity: (title: string, content: string, type: string, riskScore?: number) => void;
  onOpenDiffView: (original: string, revised: string) => void;
  onOpenGlossary: () => void;
}

export const ContractAnalyzer: React.FC<ContractAnalyzerProps> = ({
  language,
  onShowToast,
  onSaveToActivity,
  onOpenDiffView,
  onOpenGlossary,
}) => {
  const isRtl = language === 'ar';
  const [activeInputTab, setActiveInputTab] = useState<'upload' | 'paste'>('upload');
  const [contractText, setContractText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ContractAnalysisResult | null>(null);
  const [copiedRevisionId, setCopiedRevisionId] = useState<string | null>(null);
  const [copiedRemediated, setCopiedRemediated] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File Upload Handler (Supports .docx, .txt, .pdf text extraction)
  const handleFileUpload = async (file: File) => {
    setFileName(file.name);
    if (file.name.endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer();
      try {
        const result = await mammoth.extractRawText({ arrayBuffer });
        setContractText(result.value);
        setActiveInputTab('paste');
        onShowToast(isRtl ? 'تم استخراج نص ملف Word بنجاح' : 'Word text extracted successfully');
      } catch (err) {
        onShowToast(isRtl ? 'فشل استخراج نص ملف Word' : 'Failed to extract docx text');
      }
    } else {
      // Plain text or standard text reader
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setContractText(e.target.result);
          setActiveInputTab('paste');
          onShowToast(isRtl ? 'تم تحميل ملف العقد بنجاح' : 'Contract loaded successfully');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_CONTRACTS.find((s) => s.id === sampleId);
    if (found) {
      setContractText(found.content);
      setFileName(isRtl ? found.titleAr : found.titleEn);
      setActiveInputTab('paste');
      onShowToast(isRtl ? 'تم تحميل العقد النموذجي' : 'Sample contract loaded');
    }
  };

  const handleAnalyze = async () => {
    if (!contractText || contractText.trim().length < 20) {
      onShowToast(isRtl ? 'يرجى إدخال أو رفع نص العقد أولاً' : 'Please input contract text first');
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/analyze-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractText, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze contract');

      setAnalysisResult(data);
      onShowToast(isRtl ? 'اكتمل الفحص والتدقيق القانوني بنجاح' : 'Legal analysis completed');
      onSaveToActivity(
        data.contractTitle || (isRtl ? 'فحص عقد' : 'Contract Audit'),
        data.rawText,
        'analysis',
        data.overallRiskScore
      );
    } catch (err: any) {
      onShowToast(err.message || 'Analysis error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyClause = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRevisionId(id);
    onShowToast(isRtl ? 'تم نسخ الصياغة المقترحة' : 'Suggested revision copied');
    setTimeout(() => setCopiedRevisionId(null), 2000);
  };

  const handleCopyFullRemediated = () => {
    if (analysisResult?.remediatedText) {
      navigator.clipboard.writeText(analysisResult.remediatedText);
      setCopiedRemediated(true);
      onShowToast(isRtl ? 'تم نسخ العقد المعدل كاملاً' : 'Remediated contract copied');
      setTimeout(() => setCopiedRemediated(false), 2000);
    }
  };

  const handleExportRemediatedDocx = async () => {
    if (analysisResult?.remediatedText) {
      await exportContractToDocx(
        isRtl ? `${analysisResult.contractTitle}_محصن_معتمد` : `${analysisResult.contractTitle}_Airtight`,
        analysisResult.remediatedText,
        language
      );
      onShowToast(isRtl ? 'تم تنزيل ملف Word (.docx)' : 'Word (.docx) downloaded');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Input Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl mb-6">
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
            {isRtl ? 'الفحص القانوني الذكي · جمهورية مصر العربية' : 'Egyptian Legal Intelligence Engine'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {isRtl ? 'فحص العقود وكشف الثغرات والالتزامات المجحفة' : 'Contract Audit & Legal Vulnerability Detection'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {isRtl
              ? 'ارفع ملف العقد (Word أو PDF) أو الصق النص لتحليل فوري يقارن بنوده بمواد القانون المدني المصري رقم 131 لسنة 1948، قانون التجارة، قانون العمل، وقواعد محكمة النقض المستقرة.'
              : 'Upload Word (.docx) or PDF documents or paste contract text for high-precision auditing grounded in Egyptian Civil, Commercial, and Labor laws and Court of Cassation standards.'}
          </p>
        </div>

        {/* Input Mode Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit mb-4">
          <button
            type="button"
            onClick={() => setActiveInputTab('upload')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 cursor-pointer ${
              activeInputTab === 'upload'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{isRtl ? 'رفع ملف (DOCX / PDF / TXT)' : 'Upload Document'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveInputTab('paste')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 cursor-pointer ${
              activeInputTab === 'paste'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isRtl ? 'لصق نص العقد مباشرة' : 'Paste Contract Text'}</span>
          </button>
        </div>

        {/* Upload Zone */}
        {activeInputTab === 'upload' ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const dropped = e.dataTransfer.files?.[0];
              if (dropped) handleFileUpload(dropped);
            }}
            className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-xl p-8 sm:p-12 text-center transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-800/20 group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {fileName ? fileName : (isRtl ? 'اضغط لاختيار ملف العقد أو اسحبه وأفلته هنا' : 'Click to select contract file or drag and drop')}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {isRtl ? 'يدعم مستندات Word (.docx)، الملفات النصية (.txt)، ومستندات PDF' : 'Supports Word (.docx), text files (.txt), and PDF files'}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.txt,.pdf"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f);
              }}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              placeholder={isRtl ? 'الصق نص العقد هنا للتحليل الدقيق وكشف الثغرات...' : 'Paste your contract text here for comprehensive audit...'}
              rows={8}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-legal leading-relaxed text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{contractText.length} {isRtl ? 'حرف' : 'characters'}</span>
              {fileName && <span className="truncate max-w-xs">{fileName}</span>}
            </div>
          </div>
        )}

        {/* Quick Egyptian Sample Presets */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 block mb-2">
            {isRtl ? 'أو اختبر فوراً عبر أحد العقود المصرية النموذجية المتضمنة ثغرات شائعة:' : 'Or immediately test with authentic Egyptian contract presets with loopholes:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_CONTRACTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectSample(s.id)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-500 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {isRtl ? s.titleAr : s.titleEn}
              </button>
            ))}
          </div>
        </div>

        {/* Analyze Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing || !contractText.trim()}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{isRtl ? 'جارٍ التدقيق والمقارنة بمواد القانون المصري وأحكام النقض...' : 'Auditing against Egyptian law and Cassation rulings...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isRtl ? 'بدء الفحص القانوني الشامل' : 'Start Legal Audit'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Risk Gauge & Summary Header */}
          <RiskGauge
            score={analysisResult.overallRiskScore}
            subScores={analysisResult.subScores}
            language={language}
          />

          {/* Classification & Legal Ground Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-[11px] font-medium text-slate-400 block mb-1">
                  {isRtl ? 'مسمى العقد وتصنيفه' : 'Contract Title & Type'}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {analysisResult.contractTitle}
                </h3>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1 block">
                  {analysisResult.contractType}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-medium text-slate-400 block mb-1">
                  {isRtl ? 'القانون الحاكم المعمول به' : 'Governing Legislation'}
                </span>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {analysisResult.governingLaw}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-medium text-slate-400 block mb-1">
                  {isRtl ? 'التكييف القانوني' : 'Legal Characterization'}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {analysisResult.classificationDetails}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                {isRtl ? 'الخلاصة التنفيذية للتقييم' : 'Executive Legal Summary'}
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {analysisResult.summary}
              </p>
            </div>
          </div>

          {/* Strengths & Weaknesses 2-Column Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>{isRtl ? 'نقاط القوة والبنود الإيجابية' : 'Contractual Strengths & Protections'}</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {analysisResult.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h3 className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4" />
                <span>{isRtl ? 'نقاط الضعف والمخاطر التشغيلية' : 'Weaknesses & Unbalanced Liabilities'}</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {analysisResult.weaknesses.map((wk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Critical Loopholes & Remediation Clauses */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>{isRtl ? 'الثغرات القانونية الحرجة وبدائل الصياغة المحصنة' : 'Critical Legal Loopholes & Airtight Revisions'}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isRtl ? 'بنود تمثل خطورة استناداً إلى نصوص القانون وأحكام محكمة النقض مع الصياغة المعالجة المقترحة.' : 'High-risk provisions analyzed against statutory articles and Cassation precedents.'}
                </p>
              </div>

              <button
                onClick={onOpenGlossary}
                className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isRtl ? 'فتح المعجم القانوني' : 'Legal Glossary'}</span>
              </button>
            </div>

            <div className="space-y-4 pt-2">
              {analysisResult.loopholes.map((loophole) => (
                <div
                  key={loophole.id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {loophole.clauseTitle}
                    </h4>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        loophole.riskLevel === 'high'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {loophole.riskLevel === 'high' ? (isRtl ? 'ثغرة حرجة' : 'Critical') : (isRtl ? 'مخاطرة متوسطة' : 'Moderate')}
                    </span>
                  </div>

                  {loophole.originalText && (
                    <div className="p-3 rounded-lg bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 text-xs font-legal text-rose-950 dark:text-rose-200">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-rose-600 block mb-1 font-sans">
                        {isRtl ? 'النص الأصلي (محل العيب القانوني):' : 'Original Risky Text:'}
                      </span>
                      <p>{loophole.originalText}</p>
                    </div>
                  )}

                  {/* Impact and Ground */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        {isRtl ? 'السند والأساس القانوني:' : 'Statutory Ground:'}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                        {loophole.legalGround}
                      </span>
                      {loophole.cassationPrecedent && (
                        <span className="text-amber-700 dark:text-amber-300 text-[11px] block mt-1.5 font-medium">
                          {loophole.cassationPrecedent}
                        </span>
                      )}
                    </div>

                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        {isRtl ? 'الأثر والمخاطر القضائية:' : 'Judicial Risk & Impact:'}
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        {loophole.impactAnalysis}
                      </p>
                    </div>
                  </div>

                  {/* Suggested Airtight Revision with Copy */}
                  <div className="p-3.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'الصياغة القانونية البديلة المقترحة (محصنة):' : 'Suggested Airtight Revision:'}</span>
                      </span>
                      <button
                        onClick={() => handleCopyClause(loophole.id, loophole.suggestedRevision)}
                        className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 inline-flex items-center gap-1 cursor-pointer"
                      >
                        {copiedRevisionId === loophole.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedRevisionId === loophole.id ? (isRtl ? 'تم النسخ' : 'Copied') : (isRtl ? 'نسخ البند' : 'Copy Clause')}</span>
                      </button>
                    </div>
                    <p className="text-xs font-legal text-emerald-950 dark:text-emerald-100 leading-relaxed">
                      {loophole.suggestedRevision}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customary Law & Actionable Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Customary Law Notes */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
                <Scale className="w-4 h-4 text-amber-500" />
                <span>{isRtl ? 'تطبيقات العرف التجاري والقانوني المصري' : 'Egyptian Commercial Custom Applications'}</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {analysisResult.customaryLawNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold shrink-0">▪</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Strategy */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>{isRtl ? 'خطة العمل والتفاوض المقترحة (خطوة بخطوة)' : 'Actionable Negotiation Strategy'}</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {analysisResult.actionableStrategy.map((strat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">→</span>
                    <span>{strat}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Full Remediated Contract Preview & Export Actions */}
          {analysisResult.remediatedText && (
            <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span>{isRtl ? 'النسخة المحصنة والمنقحة من العقد (جاهزة للتوقيع)' : 'Airtight Remediated Contract Draft'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isRtl ? 'تم سد كافة الثغرات القانونية المكتشفة وتضمين الشروط القاطعة المتوافقة مع النظام العام.' : 'All identified loopholes resolved with robust statutory formulations.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onOpenDiffView(analysisResult.rawText, analysisResult.remediatedText!)}
                    className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:border-amber-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{isRtl ? 'مقارنة التعديلات (Diff)' : 'Compare Diff'}</span>
                    {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={handleCopyFullRemediated}
                    className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:border-amber-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedRemediated ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRemediated ? (isRtl ? 'تم النسخ' : 'Copied') : (isRtl ? 'نسخ العقد كاملاً' : 'Copy Full Draft')}</span>
                  </button>

                  <button
                    onClick={handleExportRemediatedDocx}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تصدير Word (.docx)' : 'Export Word'}</span>
                  </button>

                  <button
                    onClick={() => printOfficialDocument()}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تصدير PDF / طباعة' : 'Export PDF'}</span>
                  </button>
                </div>
              </div>

              {/* Remediated Contract Text Box */}
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 font-legal text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line max-h-96 overflow-y-auto">
                {analysisResult.remediatedText}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
