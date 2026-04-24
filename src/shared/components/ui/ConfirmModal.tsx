import { useEffect, type ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = true
}: ConfirmModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => { 
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset'; 
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl shadow-black/50 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
              isDestructive ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"
            )}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="text-zinc-400 mt-2 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/50">
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            <Button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={isDestructive ? "bg-red-500 hover:bg-red-600 text-white border-transparent" : ""}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
