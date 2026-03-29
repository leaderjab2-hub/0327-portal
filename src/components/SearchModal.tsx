'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Users, CreditCard, HelpCircle, FileText, Loader2, Command } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SearchResult {
  id: string;
  type: 'tenant' | 'subtenant' | 'member' | 'notice' | 'ticket';
  title: string;
  subtitle?: string;
  href: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        handleNavigate(results[selectedIndex].href);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        // Fetch from multiple APIs
        const [tenants, subtenants, members, notices, tickets] = await Promise.all([
          fetch(`/api/tenants?query=${query}`).then(res => res.json()),
          fetch(`/api/subtenants?query=${query}`).then(res => res.json()),
          fetch(`/api/members?query=${query}`).then(res => res.json()),
          fetch(`/api/notices?query=${query}`).then(res => res.json()),
          fetch(`/api/tickets?query=${query}`).then(res => res.json()),
        ]);

        const formattedResults: SearchResult[] = [
          ...(tenants.data || []).map((t: any) => ({
            id: t.id,
            type: 'tenant',
            title: t.name,
            subtitle: t.managerEmail,
            href: `/customers/contracts?id=${t.id}`
          })),
          ...(subtenants.data || []).map((s: any) => ({
            id: s.id,
            type: 'subtenant',
            title: s.name,
            subtitle: '서브테넌트',
            href: `/customers/contracts?subId=${s.id}`
          })),
          ...(members.data || []).map((m: any) => ({
            id: m.id,
            type: 'member',
            title: m.name,
            subtitle: m.email,
            href: `/customers/list?id=${m.id}`
          })),
          ...(notices.data || []).map((n: any) => ({
            id: n.id,
            type: 'notice',
            title: n.title,
            subtitle: n.type,
            href: `/support/notices?id=${n.id}`
          })),
          ...(tickets.data || []).map((t: any) => ({
            id: t.id,
            type: 'ticket',
            title: t.title,
            subtitle: t.ticket_number,
            href: `/support/tickets?id=${t.id}`
          }))
        ];

        setResults(formattedResults);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  if (!isOpen) return null;

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) acc[result.type] = [];
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const typeLabels = {
    tenant: '테넌트',
    subtenant: '서브테넌트',
    member: '구성원',
    notice: '공지사항',
    ticket: '티켓'
  };

  const typeIcons = {
    tenant: CreditCard,
    subtenant: CreditCard,
    member: Users,
    notice: FileText,
    ticket: HelpCircle
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-800 dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700 dark:border-slate-700 animate-in fade-in zoom-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-gray-100 dark:border-slate-700 dark:border-slate-700">
          <Search className="w-5 h-5 text-gray-400 dark:text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 px-4 py-5 bg-transparent border-none focus:outline-none text-gray-900 dark:text-slate-100 dark:text-slate-100 placeholder-gray-400"
            placeholder="Search everything... (Tenants, Members, Notices, Tickets)"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 border border-gray-200 dark:border-slate-700 dark:border-slate-600 rounded px-1.5 py-0.5">ESC</span>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                <X className="w-4 h-4 text-gray-400 dark:text-slate-500" />
              </button>
            </div>
          )}
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2 scrollbar-hide">
          {query.trim() === '' ? (
            <div className="p-8 text-center">
              <Command className="w-12 h-12 text-gray-200 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-slate-400 dark:text-slate-400 text-sm">실시간 통합 검색을 시작해보세요</p>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-slate-400 dark:text-slate-400 text-sm">
              검색 결과가 없습니다.
            </div>
          ) : (
            Object.entries(groupedResults).map(([type, items]) => (
              <div key={type} className="mb-2 last:mb-0">
                <h3 className="px-3 py-2 text-[11px] font-bold text-gray-400 dark:text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                  {typeLabels[type as keyof typeof typeLabels]}
                </h3>
                {items.map((item, idx) => {
                  const Icon = typeIcons[item.type as keyof typeof typeIcons];
                  const absIndex = results.indexOf(item);
                  const isSelected = absIndex === selectedIndex;
                  
                  return (
                    <button
                      key={item.id}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                        isSelected 
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                          : 'hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 dark:hover:bg-slate-700/50 text-gray-700 dark:text-slate-300 dark:text-slate-300'
                      }`}
                      onClick={() => handleNavigate(item.href)}
                      onMouseEnter={() => setSelectedIndex(absIndex)}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600' : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500'}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-bold truncate">{item.title}</div>
                        {item.subtitle && <div className={`text-[11px] truncate ${isSelected ? 'text-primary-600/70' : 'text-gray-400 dark:text-slate-500'}`}>{item.subtitle}</div>}
                      </div>
                      {isSelected && <span className="text-[10px] font-bold text-primary-400">Enter</span>}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
