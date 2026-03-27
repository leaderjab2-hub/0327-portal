'use client';

import React, { useState } from 'react';
import { Search, RotateCcw, ChevronRight } from 'lucide-react';

export interface CompanyItem {
  id: string;
  name: string;
  subCount: number;
}

interface CompanyListPanelProps {
  companies: CompanyItem[];
  activeIndex: number;
  onCompanyClick: (idx: number) => void;
  title?: string;
}

export default function CompanyListPanel({ companies, activeIndex, onCompanyClick, title = '회사 목록' }: CompanyListPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* ── Mobile: horizontal scrollable tab strip (hidden on md+) ── */}
      <div className="md:hidden w-full bg-white border border-gray-200 rounded-[10px] overflow-hidden mb-3 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
        <div className="flex overflow-x-auto gap-2 p-3 scrollbar-none">
          {companies.map((c, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={c.id}
                onClick={() => onCompanyClick(idx)}
                className={`shrink-0 px-3 py-2 rounded-[8px] text-[12px] font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Desktop: vertical panel (hidden below md) ── */}
      <div className="hidden md:flex w-[260px] bg-white border border-gray-200 rounded-[10px] flex-col overflow-hidden h-full shrink-0 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
        <div className="p-4 border-b border-gray-100 flex flex-col gap-3 flex-none">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-[14px] font-semibold text-gray-900">{title}</h2>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="회사 명 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[34px] border border-gray-200 rounded-[7px] text-[13px] px-3 pl-8 focus:outline-none focus:border-primary-500 bg-white"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={() => setSearchTerm('')}
              className="flex items-center justify-center p-2 rounded-[7px] border border-gray-200 text-gray-600 hover:bg-[#F9FAFB] h-[34px] w-[34px] transition-colors"
              title="검색어 초기화"
            >
              <RotateCcw size={14} />
            </button>
            <button className="flex-1 h-[34px] bg-primary-500 hover:bg-primary-600 text-white font-semibold text-[13px] rounded-[7px] transition-colors">
              검색
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((c) => {
              const originalIndex = companies.findIndex(orig => orig.id === c.id);
              const isActive = originalIndex === activeIndex;
              return (
                <div
                  key={c.id}
                  onClick={() => onCompanyClick(originalIndex)}
                  className={`flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    isActive ? 'bg-primary-50 border-l-[3px] border-l-primary-500' : 'hover:bg-[#F9FAFB] border-l-[3px] border-l-transparent'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className={`text-[13px] font-bold ${isActive ? 'text-primary-600' : 'text-gray-700'}`}>{c.name}</span>
                    <span className="text-[11px] font-medium text-gray-400 mt-0.5">서브테넌트 {c.subCount}개</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-900 outline-none">
                    <ChevronRight size={16} className={isActive ? 'text-primary-500' : ''} />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-sm text-gray-400">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
