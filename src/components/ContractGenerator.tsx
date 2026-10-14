import React, { useState } from 'react';
import { ContractGenerationInput } from '../types';
import { exportContractToDocx, printOfficialDocument } from '../services/exportService';
import { generateContract } from '../services/apiService';
import { FileEdit, Sparkles, Copy, Check, Download, Printer, ArrowRight, ArrowLeft, RefreshCw, Eye, Edit3 } from 'lucide-react';

interface ContractGeneratorProps {
  language: 'ar' | 'en';
  onShowToast: (msg: string) => void;
  onSaveToActivity: (title: string, content: string, type: string) => void;
  initialPrompt?: string;
}

export const ContractGenerator: React.FC<ContractGeneratorProps> = ({
  language,
  onShowToast,
  onSaveToActivity,
  initialPrompt,
}) => {
  const isRtl = language === 'ar';
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<ContractGenerationInput>({
    contractType: 'residential_lease',
    partyOneName: 'ممدوح إبراهيم عبد الرحمن',
    partyOneId: '28504120101993',
    partyOneAddress: '14 شارع النصر، المعادي، القاهرة',
    partyTwoName: 'كريم عادل الشناوي',
    partyTwoId: '29208151203456',
    partyTwoAddress: '8 شارع الثورة، مصر الجديدة، القاهرة',
    durationMonths: 24,
    startDate: new Date().toISOString().split('T')[0],
    amountEGP: 12000,
    paymentCadence: 'monthly',
    governingCity: 'القاهرة',
    includeExplicitBreachClause: true,
    includePenalClause: true,
    penalAmountEGP: 25000,
    disputeResolution: 'egyptian_courts',
    customClauses: initialPrompt || '',
  });

  const [loading, setLoading] = useState(false);
  const [generatedContract, setGeneratedContract] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateContract(formData, language);

      setGeneratedContract(data.contractText);
      setStep(4);
      onShowToast(isRtl ? 'تمت صياغة العقد وضبط بنوده بنجاح' : 'Contract formulated successfully');
      onSaveToActivity(
        isRtl ? `مسودة عقد ${formData.contractType}` : `Draft Contract ${formData.contractType}`,
        data.contractText,
        'draft'
      );
    } catch (err: any) {
      onShowToast(isRtl ? 'تم توليد مسودة العقد' : 'Draft generated');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContract);
    setCopied(true);
    onShowToast(isRtl ? 'تم نسخ العقد كاملاً إلى الحافظة' : 'Contract copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportDocx = async () => {
    await exportContractToDocx(
      isRtl ? `عقد_${formData.contractType}_معتمد` : `Contract_${formData.contractType}`,
      generatedContract,
      language
    );
    onShowToast(isRtl ? 'تم تحميل ملف Word (.docx) بنجاح' : 'Word (.docx) downloaded successfully');
  };

  const handlePrint = () => {
    printOfficialDocument();
  };

  return (
    <div className="space-y-6">
      
      {/* Wizard Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {isRtl ? 'منشئ العقود الذكي وفقاً للقانون المصري' : 'Smart Egyptian Contract Generator'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isRtl
                  ? 'صياغة عقود محكمة خالية من الثغرات، مدعومة بالشروط الحمائية وأحدث أحكام محكمة النقض.'
                  : 'Draft airtight contracts with built-in statutory protections and Court of Cassation standards.'}
              </p>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                disabled={s === 4 && !generatedContract}
                onClick={() => setStep(s as any)}
                className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-colors flex items-center justify-center ${
                  step === s
                    ? 'bg-slate-900 text-white dark:bg-amber-600'
                    : s < step
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wizard Step Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        
        {/* Step 1: Type and Parties */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {isRtl ? 'نوع العقد المطلوب صياغته' : 'Contract Type'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'residential_lease', labelAr: 'عقد إيجار شقة سكنية (ق 4/1996)', labelEn: 'Residential Lease' },
                  { id: 'commercial_lease', labelAr: 'عقد إيجار تجاري / مقر شركة', labelEn: 'Commercial Lease' },
                  { id: 'employment', labelAr: 'عقد عمل فردي (ق 12/2003)', labelEn: 'Employment Agreement' },
                  { id: 'nda', labelAr: 'اتفاقية سرية معلومات (NDA)', labelEn: 'Commercial NDA' },
                  { id: 'sale_apartment', labelAr: 'عقد بيع ابتدائي لوحدة سكنية', labelEn: 'Apartment Sale Agreement' },
                  { id: 'services_tech', labelAr: 'عقد تقديم خدمات برمجية وتوريد', labelEn: 'Software & Supply Agreement' },
                ].map((ct) => (
                  <button
                    type="button"
                    key={ct.id}
                    onClick={() => setFormData({ ...formData, contractType: ct.id as any })}
                    className={`p-3 text-start rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      formData.contractType === ct.id
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isRtl ? ct.labelAr : ct.labelEn}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              {/* Party 1 */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block">
                  {isRtl ? 'بيانات الطرف الأول (المؤجر / صاحب العمل / البائع)' : 'First Party Information'}
                </span>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{isRtl ? 'الاسم الرباعي' : 'Full Name'}</label>
                  <input
                    type="text"
                    value={formData.partyOneName}
                    onChange={(e) => setFormData({ ...formData, partyOneName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{isRtl ? 'الرقم القومي / السجل التجاري' : 'National ID / CR'}</label>
                  <input
                    type="text"
                    value={formData.partyOneId}
                    onChange={(e) => setFormData({ ...formData, partyOneId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{isRtl ? 'محل الإقامة المختار' : 'Address'}</label>
                  <input
                    type="text"
                    value={formData.partyOneAddress}
                    onChange={(e) => setFormData({ ...formData, partyOneAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Party 2 */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block">
                  {isRtl ? 'بيانات الطرف الثاني (المستأجر / العامل / المشتري)' : 'Second Party Information'}
                </span>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{isRtl ? 'الاسم الرباعي' : 'Full Name'}</label>
                  <input
                    type="text"
                    value={formData.partyTwoName}
                    onChange={(e) => setFormData({ ...formData, partyTwoName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{isRtl ? 'الرقم القومي / السجل التجاري' : 'National ID / CR'}</label>
                  <input
                    type="text"
                    value={formData.partyTwoId}
                    onChange={(e) => setFormData({ ...formData, partyTwoId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{isRtl ? 'محل الإقامة المختار' : 'Address'}</label>
                  <input
                    type="text"
                    value={formData.partyTwoAddress}
                    onChange={(e) => setFormData({ ...formData, partyTwoAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <span>{isRtl ? 'التالي: الالتزامات والماليات' : 'Next: Terms & Consideration'}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Terms and Finances */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'مدة العقد (بالأشهر)' : 'Duration (Months)'}
                </label>
                <input
                  type="number"
                  value={formData.durationMonths}
                  onChange={(e) => setFormData({ ...formData, durationMonths: parseInt(e.target.value) || 12 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                  min={1}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'تاريخ سريان العقد' : 'Effective Start Date'}
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'المقابل المالي (بالجنيه المصري EGP)' : 'Consideration Amount (EGP)'}
                </label>
                <input
                  type="number"
                  value={formData.amountEGP}
                  onChange={(e) => setFormData({ ...formData, amountEGP: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'طريقة السداد' : 'Payment Cadence'}
                </label>
                <select
                  value={formData.paymentCadence}
                  onChange={(e) => setFormData({ ...formData, paymentCadence: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                >
                  <option value="monthly">{isRtl ? 'شهرياً مقدماً' : 'Monthly in advance'}</option>
                  <option value="quarterly">{isRtl ? 'كل ثلاثة أشهر' : 'Quarterly'}</option>
                  <option value="milestones">{isRtl ? 'على مراحل إنجاز' : 'Milestones based'}</option>
                  <option value="lump_sum">{isRtl ? 'دفعة واحدة عند التوقيع' : 'Lump sum upon signing'}</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'المدينة / المحافظة لمقر المحكمة المختصة' : 'City / Governorate for Judicial Venue'}
                </label>
                <input
                  type="text"
                  value={formData.governingCity}
                  onChange={(e) => setFormData({ ...formData, governingCity: e.target.value })}
                  placeholder="القاهرة / الجيزة / الإسكندرية"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {isRtl ? 'السابق' : 'Back'}
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <span>{isRtl ? 'التالي: الشروط الحمائية' : 'Next: Protective Clauses'}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Protections and Guarantees */}
        {step === 3 && (
          <div className="space-y-6">
            
            {/* Explicit Rescission */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeExplicitBreachClause}
                  onChange={(e) => setFormData({ ...formData, includeExplicitBreachClause: e.target.checked })}
                  className="mt-1 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    {isRtl ? 'تضمين بند الشرط الفاسخ الصريح (المادة 158 من القانون المدني)' : 'Include Explicit Rescission Clause (Article 158)'}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {isRtl
                      ? 'صيغة قانونية قاطعة تسلب القاضي سلطته التقديرية وتفسخ العقد تلقائياً وحكماً دون حاجة لإنذار أو دعوى قضائية موضوعية.'
                      : 'Divests judicial discretion and automatically terminates the agreement upon default without notice.'}
                  </p>
                </div>
              </label>
            </div>

            {/* Penal Clause */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includePenalClause}
                  onChange={(e) => setFormData({ ...formData, includePenalClause: e.target.checked })}
                  className="mt-1 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    {isRtl ? 'تضمين بند الشرط الجزائي والتعويض الاتفاقي (المادتان 223 و 224 مدني)' : 'Include Liquidated Damages / Penal Clause (Articles 223 & 224)'}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isRtl ? 'تحديد تعويض اتفاقي ملزم في حال الإخلال لضمان سرعة التنفيذ العيني أو الجبر المالي.' : 'Pre-agreed liquidated compensation for delays or contractual default.'}
                  </p>
                </div>
              </label>

              {formData.includePenalClause && (
                <div className="ps-7">
                  <label className="text-[11px] text-slate-500 block mb-1">
                    {isRtl ? 'قيمة الشرط الجزائي (بالجنيه المصري EGP)' : 'Liquidated Damages Amount (EGP)'}
                  </label>
                  <input
                    type="number"
                    value={formData.penalAmountEGP}
                    onChange={(e) => setFormData({ ...formData, penalAmountEGP: parseInt(e.target.value) || 0 })}
                    className="w-full sm:w-64 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono tabular-nums"
                  />
                </div>
              )}
            </div>

            {/* Dispute Resolution */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                {isRtl ? 'جهة الاختصاص القضائي وفض المنازعات' : 'Dispute Resolution Forum'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, disputeResolution: 'egyptian_courts' })}
                  className={`p-3 text-start rounded-lg border text-xs font-semibold cursor-pointer ${
                    formData.disputeResolution === 'egyptian_courts'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="block">{isRtl ? 'المحاكم المصرية المختصة' : 'Egyptian Civil Courts'}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{isRtl ? 'محاكم الدرجة الأولى الابتدائية وجزئياتها' : 'Competent court of first instance'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, disputeResolution: 'crcica_arbitration' })}
                  className={`p-3 text-start rounded-lg border text-xs font-semibold cursor-pointer ${
                    formData.disputeResolution === 'crcica_arbitration'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="block">{isRtl ? 'التحكيم المؤسسي (CRCICA)' : 'CRCICA Arbitration'}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{isRtl ? 'مركز القاهرة الإقليمي للتحكيم التجاري الدولي' : 'Cairo Regional Centre for Commercial Arbitration'}</span>
                </button>
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {isRtl ? 'شروط خاصة إضافية (اختياري)' : 'Special Custom Provisions (Optional)'}
              </label>
              <textarea
                value={formData.customClauses}
                onChange={(e) => setFormData({ ...formData, customClauses: e.target.value })}
                placeholder={isRtl ? 'أدخل أي شروط مخصصة مثل مواعيد تسليم معينة، تجهيز ديكور، ملحقات خاصة...' : 'Any specific delivery dates, fit-out periods, or customized obligations...'}
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {isRtl ? 'السابق' : 'Back'}
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{isRtl ? 'جارٍ صياغة العقد بالذكاء الاصطناعي...' : 'Drafting contract...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'إنشاء العقد النهائي الآن' : 'Generate Contract Now'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Preview, Edit & Export */}
        {step === 4 && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isEditing
                      ? 'bg-amber-500 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                  <span>{isEditing ? (isRtl ? 'معاينة القراءة' : 'View Mode') : (isRtl ? 'تعديل النص' : 'Edit Mode')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  {isRtl ? 'تعديل المعايير' : 'Modify Inputs'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:border-amber-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isRtl ? 'تم النسخ' : 'Copied') : (isRtl ? 'نسخ النص' : 'Copy')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportDocx}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تحميل Word (.docx)' : 'Download .docx'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تصدير PDF / طباعة' : 'Export PDF / Print'}</span>
                </button>
              </div>
            </div>

            {/* Document Preview Box (Official Legal Style) */}
            <div className="print-page bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 sm:p-12 shadow-sm font-legal leading-relaxed">
              {/* Header crest in print / preview */}
              <div className="text-center pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {isRtl ? 'جمهورية مصر العربية' : 'Arab Republic of Egypt'}
                </h1>
                <p className="text-xs text-slate-500 font-sans">
                  {isRtl ? 'عقد قانوني خاضع لأحكام القانون المدني والتجاري وقواعد محكمة النقض' : 'Governed by Egyptian Statutory Law & Court of Cassation Precedents'}
                </p>
              </div>

              {isEditing ? (
                <textarea
                  value={generatedContract}
                  onChange={(e) => setGeneratedContract(e.target.value)}
                  rows={20}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg text-sm leading-relaxed font-legal focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              ) : (
                <div className="text-slate-800 dark:text-slate-200 text-sm whitespace-pre-line leading-loose space-y-4">
                  {generatedContract}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
