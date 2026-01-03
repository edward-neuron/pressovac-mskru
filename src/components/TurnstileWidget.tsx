import { useEffect, useRef, useCallback } from 'react';

// Turnstile Site Key (public)
const TURNSTILE_SITE_KEY = '0x4AAAAAACJi5lv0CIzB4A2H';

// Check if we're in a preview/sandbox environment
const isPreviewEnvironment = () => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname.includes('lovableproject.com') || 
         hostname.includes('localhost') || 
         hostname.includes('127.0.0.1');
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

interface TurnstileOptions {
  sitekey: string;
  callback: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

const TurnstileWidget = ({ onVerify, onError, onExpire }: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const scriptLoadedRef = useRef(false);
  const errorCountRef = useRef(0);

  // In preview environment, auto-verify with a dummy token
  useEffect(() => {
    if (isPreviewEnvironment()) {
      // Delay to simulate widget loading
      const timer = setTimeout(() => {
        onVerify('preview-bypass-token');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [onVerify]);

  const handleError = useCallback(() => {
    errorCountRef.current += 1;
    // Only call onError after multiple failures and not in preview
    if (errorCountRef.current >= 3 && !isPreviewEnvironment()) {
      onError?.();
    }
  }, [onError]);

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile || isPreviewEnvironment()) return;
    
    // Remove existing widget if any
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch (e) {
        // Widget might already be removed
      }
      widgetIdRef.current = null;
    }

    // Clear the container
    containerRef.current.innerHTML = '';

    // Render new widget
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: onVerify,
      'error-callback': handleError,
      'expired-callback': onExpire,
      theme: 'auto',
      language: 'ru',
    });
  }, [onVerify, handleError, onExpire]);

  useEffect(() => {
    // Skip loading Turnstile in preview environment
    if (isPreviewEnvironment()) {
      return;
    }

    // Check if script is already loaded
    if (window.turnstile) {
      renderWidget();
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="turnstile"]');
    if (existingScript && !scriptLoadedRef.current) {
      // Script exists but Turnstile not ready yet, wait for it
      const checkInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkInterval);
          renderWidget();
        }
      }, 100);
      
      return () => clearInterval(checkInterval);
    }

    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    // Load Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Small delay to ensure Turnstile is fully initialized
      setTimeout(renderWidget, 100);
    };

    document.head.appendChild(script);

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Widget might already be removed
        }
      }
    };
  }, [renderWidget]);

  // In preview environment, show a placeholder
  if (isPreviewEnvironment()) {
    return (
      <div 
        className="flex justify-center my-4"
        style={{ minHeight: '65px' }}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span>Проверка безопасности (preview)</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="flex justify-center my-4"
      style={{ minHeight: '65px' }}
    />
  );
};

export default TurnstileWidget;
