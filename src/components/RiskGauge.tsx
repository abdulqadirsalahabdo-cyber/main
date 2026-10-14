import React from 'react';
import { RiskSubScore } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface RiskGaugeProps {
  score: number; // 0 to 100 (where 0 is completely safe, 100 is critical risk)
  subScores?: RiskSubScore[];
  language: 'ar' | 'en';
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, subScores, language }) => {
  const isRtl = language === 'ar';
  const safetyScore = Math.max(0, Math.min(100, 100 - score));

  // Determine status color and label
  let statusColor = 'text-emerald-600 dark:text-emerald-400';
  let strokeColor = '#10b981';
  let bgColor = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  let statusText = isRtl ? 'عقد محكم وآمن قانونياً' : 'Legally Airtight & Safe';
  let Icon = ShieldCheck;

  if (score > 60) {
    statusColor = 'text-rose-600 dark:text-rose-400';
    strokeColor = '#f43f5e';
    bgColor = 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    statusText = isRtl ? 'ثغرات جسيمة ومخاطر عالية' : 'Critical Risk & Severe Loopholes';
    Icon = ShieldAlert;
  } else if (score > 30) {
    statusColor = 'text-amber-600 dark:text-amber-400';
    strokeColor = '#f59e0b';
    bgColor = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    statusText = isRtl ? 'مخاطر متوسطة تتطلب تنقيحاً' : 'Moderate Risks Requiring Edits';
    Icon = AlertTriangle;
  }

  // SVG Gauge Calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safetyScore / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
        
        {/* Circular Gauge Graphic */}
        <div className="flex items-center gap-6">
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={strokeColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
                {safetyScore}%
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                {isRtl ? 'نسبة الأمان' : 'Safety Score'}
              </span>
            </div>
          </div>

          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold border ${bgColor} mb-2`}>
              <Icon className="w-3.5 h-3.5" />
              <span>{statusText}</span>
            </div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {isRtl ? 'مؤشر السلامة والحماية القانونية' : 'Legal Safety & Risk Index'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm leading-relaxed">
              {isRtl
                ? 'تقييم شامل مستند إلى معايير القانون المدني والتجاري المصري وقوة الصياغة التنفيذية.'
                : 'Holistic evaluation grounded in Egyptian Civil & Commercial statutory enforceability standards.'}
            </p>
          </div>
        </div>

        {/* Sub-Scores Breakdown */}
        {subScores && subScores.length > 0 && (
          <div className="w-full md:w-80 space-y-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-s border-slate-200 dark:border-slate-800 md:ps-6">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {isRtl ? 'المعايير الفرعية للتقييم' : 'Sub-Metric Breakdown'}
            </span>
            {subScores.map((sub, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{sub.name}</span>
                  <span className="font-mono tabular-nums text-slate-500">{sub.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      sub.score > 70
                        ? 'bg-emerald-500'
                        : sub.score > 45
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${sub.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
