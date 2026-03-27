'use client';

import React, { useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';

export default function Activities() {
  const [activeTab, setActiveTab] = useState('사용자');

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="bg-white border text-left border-gray-200 rounded-[10px] overflow-x-auto flex flex-col">
        <div className="h-[52px] border-b border-gray-200 flex items-center px-4 bg-[#FAFAFA]">
          <div className="flex h-full">
            {['사용자', '관리자'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 h-full font-semibold text-[13px] flex items-center border-b-[2px] ${
                  activeTab === tab 
                    ? 'border-primary-500 text-primary-600 bg-white' 
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-[#F9FAFB]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 gap-4">
          <div className="flex items-center justify-between md:border-r md:border-gray-200 md:pr-5">
            <div className="text-[14px] font-bold text-gray-900">활동 내역 <span className="text-gray-400 font-normal ml-2">Total 842</span></div>
          </div>
          
          <div className="flex-1 md:px-5 flex flex-col lg:flex-row items-stretch md:items-center gap-3">
            <div className="grid grid-cols-2 gap-2 flex-1">
              <select className="h-[36px] border border-gray-200 rounded-[8px] text-[13px] px-3 focus:outline-none focus:border-primary-500 bg-white cursor-pointer transition-all">
                <option>전체 회사</option>
                <option>LG전자</option>
                <option>Upstage</option>
              </select>
              <select className="h-[36px] border border-gray-200 rounded-[8px] text-[13px] px-3 focus:outline-none focus:border-primary-500 bg-white cursor-pointer transition-all">
                <option>전체 유형</option>
                <option>접속</option>
                <option>권한 변경</option>
                <option>계정 관리</option>
              </select>
            </div>
            <div className="relative flex-1 lg:max-w-[280px]">
              <input type="text" placeholder="호출 계정 검색 (이메일)" className="w-full h-[36px] border border-gray-200 rounded-[8px] text-[13px] px-3 pl-8 focus:outline-none focus:border-primary-500 bg-white transition-all" />
              <Search size={14} className="absolute left-3 top-[11px] text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 md:pt-0 border-t border-gray-50 md:border-none">
            <button className="h-[36px] w-[36px] flex items-center justify-center border border-gray-200 rounded-[8px] text-gray-400 hover:bg-gray-50 transition-colors">
              <RotateCcw size={14} />
            </button>
            <button className="flex-1 sm:flex-none h-[36px] px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold text-[13px] rounded-[8px] flex items-center justify-center transition-all active:scale-[0.98]">
              검색
            </button>
          </div>
        </div>

        <table className="w-full text-left border-collapse flex-1">
          <thead className="hidden md:table-header-group">
            <tr className="bg-[#FAFAFA] border-b border-gray-200">
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 uppercase tracking-wide">회사명</th>
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 uppercase tracking-wide">유형</th>
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 uppercase tracking-wide">내용</th>
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 uppercase tracking-wide">호출 계정</th>
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 uppercase tracking-wide">발생 일시</th>
            </tr>
          </thead>
          <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
            {[
              { company: 'LG전자', type: '접속', message: '사용자 로그인 성공', account: 'dongjoo.kim@lge.com', date: '2026.03.19 14:22:01', color: 'bg-[#ECFDF5] text-[#059669]' },
              { company: 'LG전자', type: '권한 변경', message: 'Project A 프로젝트 매니저 권한 부여', account: 'admin@lge.com', date: '2026.03.19 13:10:45', color: 'bg-[#EFF6FF] text-[#2563EB]' },
              { company: 'Upstage', type: '계정 관리', message: '신규 사용자 초대 토큰 발송', account: 'mslee@upstage.ai', date: '2026.03.18 18:05:12', color: 'bg-[#F5F3FF] text-[#7C3AED]' },
              { company: 'Kakao', type: '접속', message: '비밀번호 5회 오류로 계정 잠금', account: 'unknown@kakao.com', date: '2026.03.18 16:20:00', color: 'bg-[#FEF2F2] text-[#DC2626]' },
              { company: 'Naver', type: '접속', message: '사용자 로그아웃', account: 'jhkim123@naver.com', date: '2026.03.18 11:45:30', color: 'bg-[#F3F4F6] text-gray-600' },
            ].map((row, i) => (
              <tr key={i} className="flex flex-col border border-gray-200 rounded-xl p-5 shadow-sm bg-white md:table-row md:border-0 md:border-b md:border-[#F3F4F6] md:rounded-none md:p-0 md:shadow-none hover:bg-[#F9FAFB] transition-colors relative">
                <td className="px-0 py-1 md:px-[14px] md:py-[12px] font-bold text-primary-600 border-b border-gray-50 mb-3 pb-2 md:border-0 md:mb-0 md:pb-0 md:text-gray-900">
                  <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">회사명</span>
                  {row.company}
                  <div className="absolute top-5 right-5 md:static md:inline-block md:ml-2">
                    <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${row.color}`}>{row.type}</span>
                  </div>
                </td>
                <td className="hidden md:table-cell px-[14px] py-[12px]">
                   {/* PC 전용 (유형은 위에서 처리) */}
                </td>
                <td className="px-0 py-1 md:px-[14px] md:py-[12px] text-gray-800 md:text-gray-600 text-[14px] md:text-[13px] leading-relaxed">
                  <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">상세 내용</span>
                  {row.message}
                </td>
                <td className="px-0 py-1 md:px-[14px] md:py-[12px] font-mono text-[13px] md:text-[13px] text-gray-600">
                  <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">호출 계정</span>
                  {row.account}
                </td>
                <td className="px-0 py-1 md:px-[14px] md:py-[12px] font-mono text-[12px] text-gray-400">
                  <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">발생 일시</span>
                  {row.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="h-[60px] border-t border-gray-100 flex justify-center items-center gap-1 bg-[#FAFAFA] shrink-0">
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 bg-white text-gray-400">&lt;</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-primary-500 bg-primary-500 text-white font-semibold">1</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-[#F9FAFB]">2</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-[#F9FAFB]">3</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 bg-white text-gray-600 border-none">...</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-[#F9FAFB]">85</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-[#F9FAFB]">&gt;</button>
        </div>
      </div>
    </div>
  );
}
