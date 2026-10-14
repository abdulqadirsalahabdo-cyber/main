import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle2, Shield, ArrowRight, ArrowLeft, RefreshCw, X, Copy, ExternalLink } from 'lucide-react';
import { UserProfile } from '../types';
import { sendOtp, verifyOtp } from '../services/apiService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  language: 'ar' | 'en';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, language }) => {
  const isRtl = language === 'ar';
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('bdalqadrslahbdalqadrmhmdqabyl@gmail.com');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false);
  const [emailPayload, setEmailPayload] = useState<{ code: string; emailHtml: string; emailSubject: string } | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, resendCountdown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setError(isRtl ? 'يرجى إدخال عنوان بريد إلكتروني صحيح' : 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await sendOtp(email);

      if (!data.success) {
        throw new Error(isRtl ? 'فشل إرسال رمز التحقق' : 'Failed to send verification code');
      }

      setEmailPayload({
        code: data.code || '123456',
        emailHtml: data.emailHtml || '',
        emailSubject: isRtl ? 'رمز التحقق الخاص بك' : 'Your Verification Code',
      });
      setStep('otp');
      setResendCountdown(60);
      setEmailPreviewOpen(true); // Open simulated Gmail notification drawer for effortless testing!

      // Focus first input box
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    } catch (err: any) {
      setError(err.message || 'Error sending code');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste of full 6-digit code
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto focus next box
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const finalCode = codeToVerify || otp.join('');
    if (finalCode.length !== 6) {
      setError(isRtl ? 'يرجى إدخال الرمز المكون من 6 أرقام كاملاً' : 'Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await verifyOtp(email, finalCode);

      if (!result.success) {
        throw new Error(isRtl ? 'رمز التحقق غير صحيح' : 'Invalid verification code');
      }

      const user: UserProfile = {
        id: 'user-' + Date.now(),
        email: email,
        fullName: email.split('@')[0].replace(/[\._]/g, ' '),
        age: 32,
        avatarUrl: '/src/assets/images/profile_avatar_user_1791963064840.jpg',
        role: isRtl ? 'مستشار قانوني معتمد' : 'Verified Legal Consultant',
        isVerified: true,
        createdAt: new Date().toISOString(),
      };

      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || (isRtl ? 'رمز التحقق غير صحيح' : 'Invalid code'));
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFillCode = () => {
    if (emailPayload?.code) {
      const digits = emailPayload.code.split('');
      setOtp(digits);
      handleVerifyOtp(emailPayload.code);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {step === 'email' 
                ? (isRtl ? 'تسجيل الدخول بالتحقق السريع' : 'Fast Email Sign In')
                : (isRtl ? 'أدخل رمز التحقق (OTP)' : 'Enter Verification Code')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isRtl ? 'منظومة حماية العقود الذكية' : 'Smart Contract Security Shield'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {isRtl ? 'البريد الإلكتروني للوصول الموثق' : 'Email Address for Secure Access'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full ps-10 pe-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                />
                <Mail className="absolute start-3 top-3 w-4 h-4 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                {isRtl 
                  ? 'سنرسل لك رمز تحقق فريد من 6 أرقام لتأمين مستنداتك وتاريخ تحليلاتك.'
                  : 'We will send a unique 6-digit code to safeguard your contracts.'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{isRtl ? 'جارٍ إرسال الرمز...' : 'Sending code...'}</span>
                </>
              ) : (
                <>
                  <span>{isRtl ? 'إرسال رمز التحقق' : 'Send Verification Code'}</span>
                  {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                {isRtl ? 'تم إرسال رمز الأمان المكون من 6 أرقام إلى:' : '6-digit verification code sent to:'}
              </p>
              <div className="flex items-center justify-between text-xs font-mono font-medium text-slate-900 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/60 p-2 rounded-lg">
                <span className="truncate">{email}</span>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-amber-600 dark:text-amber-400 hover:underline ms-2 shrink-0 text-[11px]"
                >
                  {isRtl ? 'تغيير' : 'Change'}
                </button>
              </div>
            </div>

            {/* 6-box OTP input */}
            <div className="flex justify-between items-center gap-2" dir="ltr">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-13 text-center text-xl font-bold font-mono bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-xs"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleVerifyOtp()}
              disabled={loading || otp.join('').length !== 6}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{isRtl ? 'جارٍ التحقق...' : 'Verifying...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تأكيد الرمز والدخول' : 'Confirm Code & Enter'}</span>
                </>
              )}
            </button>

            {/* Resend Timer */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              {resendCountdown > 0 ? (
                <span className="tabular-nums">
                  {isRtl ? `إعادة الإرسال بعد ${resendCountdown} ثانية` : `Resend available in ${resendCountdown}s`}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  className="text-amber-600 dark:text-amber-400 font-medium hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{isRtl ? 'إعادة إرسال الرمز الآن' : 'Resend Code Now'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setEmailPreviewOpen(!emailPreviewOpen)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline text-[11px]"
              >
                {emailPreviewOpen ? (isRtl ? 'إخفاء معاينة الإيميل' : 'Hide Email') : (isRtl ? 'عرض الإيميل المستلم' : 'View Email Preview')}
              </button>
            </div>

            {/* Live Interactive Branded Gmail Notification Drawer */}
            {emailPreviewOpen && emailPayload && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-red-500" />
                    <span>Gmail Inbox Notification</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Just now</span>
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {emailPayload.emailSubject}
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{isRtl ? 'رمز التحقق:' : 'OTP Code:'}</span>
                    <span className="font-mono text-base font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                      {emailPayload.code}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillCode}
                    className="px-2.5 py-1 text-[11px] font-medium bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors inline-flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{isRtl ? 'تعبئة تلقائية' : 'Auto-fill'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
