import React, { useState, useRef } from 'react';
import { UserProfile, ActivityItem } from '../types';
import { User, Mail, Calendar, ShieldCheck, Camera, FileText, Trash2, ArrowUpRight, X, Check } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  activityHistory: ActivityItem[];
  onSelectActivity: (item: ActivityItem) => void;
  onDeleteActivity: (id: string) => void;
  language: 'ar' | 'en';
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  activityHistory,
  onSelectActivity,
  onDeleteActivity,
  language,
}) => {
  const isRtl = language === 'ar';
  const [fullName, setFullName] = useState(user.fullName);
  const [age, setAge] = useState(user.age || 32);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      fullName,
      age: Number(age),
      avatarUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isRtl ? 'الملف الشخصي وسجل العمليات' : 'User Profile & Activity Log'}
              </h3>
              <p className="text-xs text-slate-500">
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-amber-500 text-slate-900 dark:text-slate-100'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {isRtl ? 'بيانات الحساب' : 'Account Details'}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-amber-500 text-slate-900 dark:text-slate-100'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <span>{isRtl ? 'سجل العمليات والتقارير' : 'Activity & History'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 tabular-nums font-mono">
              {activityHistory.length}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Profile Photo with Upload & Crop Preview */}
              <div className="flex items-center gap-5">
                <div className="relative group">
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-amber-500/30 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-950/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                    title={isRtl ? 'تغيير الصورة' : 'Change photo'}
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {fullName || user.email}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isRtl ? 'مستشار قانوني موثق · جمهورية مصر العربية' : 'Verified Legal Practitioner · Egypt'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-amber-600 dark:text-amber-400 font-medium hover:underline mt-2 inline-block cursor-pointer"
                  >
                    {isRtl ? 'رفع صورة جديدة' : 'Upload new photo'}
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'العمر' : 'Age'}
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    min={18}
                    max={100}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 tabular-nums"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'البريد الإلكتروني الموثق' : 'Verified Email'}
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 cursor-not-allowed font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                {savedSuccess ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <Check className="w-4 h-4" />
                    <span>{isRtl ? 'تم حفظ التعديلات بنجاح' : 'Changes saved successfully'}</span>
                  </span>
                ) : (
                  <span />
                )}

                <button
                  type="submit"
                  className="py-2 px-5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {isRtl ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
              </div>

            </form>
          ) : (
            <div className="space-y-3">
              {activityHistory.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <FileText className="w-10 h-10 mx-auto text-slate-400 mb-3 stroke-[1.5]" />
                  <p className="text-xs">
                    {isRtl
                      ? 'لا توجد عمليات مسجلة حتى الآن. ابدأ بتحليل عقد أو إنشاء مسودة جديدة.'
                      : 'No activity records found yet. Begin by analyzing a contract or drafting a template.'}
                  </p>
                </div>
              ) : (
                activityHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          {item.type === 'analysis' ? (isRtl ? 'فحص عقد' : 'Analysis') : (isRtl ? 'مسودة منشأة' : 'Draft')}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="text-[11px] text-slate-400 tabular-nums">
                          {new Date(item.date).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}
                        </span>
                        {item.riskScore !== undefined && (
                          <>
                            <span className="text-slate-300 dark:text-slate-700">·</span>
                            <span className="text-[11px] font-mono tabular-nums text-slate-500">
                              {isRtl ? `نسبة الأمان: ${100 - item.riskScore}%` : `Safety: ${100 - item.riskScore}%`}
                            </span>
                          </>
                        )}
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.previewSnippet}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onSelectActivity(item);
                          onClose();
                        }}
                        className="p-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                        title={isRtl ? 'فتح التقرير' : 'Open report'}
                      >
                        <span>{isRtl ? 'عرض' : 'View'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteActivity(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        title={isRtl ? 'حذف من السجل' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
