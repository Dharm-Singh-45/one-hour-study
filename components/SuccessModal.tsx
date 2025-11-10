'use client';

import { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function SuccessModal({ isOpen, onClose, title = 'Registration Successful!', message = 'Thank you for registering with OneHourStudy. Your account has been created successfully.' }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      data-testid="success-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.3s ease-in-out' }}
    >
      <div
        className="bg-white rounded-3xl p-8 md:p-10 max-w-md w-11/12 text-center shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-primary"></div>
        <div
          className="text-6xl text-secondary mb-4"
          style={{ animation: 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <span className="fas fa-check-circle" aria-hidden="true"></span>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-600 mb-6 leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-gradient-primary text-white py-3 px-6 rounded-full font-bold hover:shadow-colored transition-all duration-300 hover:-translate-y-1"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

