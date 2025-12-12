import React, { useState, useEffect, useRef } from 'react';

// --- Types ---
export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface TagProps {
  text: string;
  type?: "default" | "primary" | "danger" | "success" | "warning";
}

// --- Components ---

export const Section: React.FC<SectionProps> = ({ children, className = "", id = "" }) => (
  <section id={id} className={`min-h-screen flex flex-col justify-center px-6 py-24 relative ${className}`}>
    {children}
  </section>
);

export const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setIsVisible(true);
          // Optional: Disconnect after revealing to save resources
          if (ref.current) observer.unobserve(ref.current);
        }
      }, 
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} 
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-slate-200 p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col ${className}`}>
    {children}
  </div>
);

export const Tag: React.FC<TagProps> = ({ text, type = "default" }) => {
  const styles = {
    default: "bg-slate-100 text-slate-600 border-slate-200",
    primary: "bg-indigo-50 text-indigo-600 border-indigo-100",
    danger: "bg-rose-50 text-rose-600 border-rose-100",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide border ${styles[type]} inline-flex items-center gap-1`}>
      {text}
    </span>
  );
};