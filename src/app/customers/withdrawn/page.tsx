'use client';

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export default function WithdrawnList() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex h-[48px] shrink-0 items-center justify-between bg-white dark:bg-slate-800 px-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm card-depth">
        <div className="flex items-center gap-3">
          <div className="text-[14px] font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">
            탈퇴 이력 <span className="ml-2 text-[11px] font-bold text-gray-400 dark:text-slate-500 italic">TOTAL 128</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select className="h-[30px] w-32 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-[11px] font-black text-gray-600 dark:text-slate-400 outline-none focus:border-blue-400 transition-all cursor-pointer">
            <option>전체 회사</option>
            <option>LG전자</option>
          </select>
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400 dark:text-slate-500" size={13} />
            <input
              type="text"
              placeholder="이름 검색"
              className="h-[30px] w-32 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-8 text-[12px] font-medium text-gray-900 dark:text-slate-100 transition-all focus:w-48 focus:border-blue-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-[10px] overflow-x-auto flex flex-col">
        <table className="w-full text-left border-collapse flex-1">
          <thead className="hidden md:table-header-group">
            <tr className="bg-[#FAFAFA] dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">이름</th>
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">이메일</th>
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">소속 회사</th>
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">탈퇴 일시</th>
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">탈퇴 사유</th>
            </tr>
          </thead>
          <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
            {[
              { name: '오현규', email: 'hyunkyu.oh@lge.com', company: 'LG전자', date: '2026.03.18 14:02:11', reason: '퇴사로 인한 계정 삭제 요청' },
              { name: '장수연', email: 'sooyeon.jang@kakao.com', company: 'Kakao', date: '2026.03.14 09:21:40', reason: '프로젝트 종료 및 인력 교체' },
              { name: '이민수', email: 'mslee@upstage.ai', company: 'Upstage', date: '2026.03.10 11:45:00', reason: '개인정보 처리방침 변경 거부' },
              { name: '김정훈', email: 'jhkim123@naver.com', company: 'Naver', date: '2026.03.01 16:55:22', reason: '장기 미접속(1년 이상) 자동 탈퇴 처리' },
            ].map((row, i) => (
              <tr key={i} className="flex flex-col border border-gray-200 dark:border-slate-700 rounded-xl p-4 shadow-sm card-depth bg-white dark:bg-slate-800 md:table-row md:border-0 md:border-b md:border-[#F3F4F6] md:rounded-none md:p-0 md:shadow-none hover:bg-[#F9FAFB] transition-all mb-1 md:mb-0">
                <td className="px-0 py-1 md:px-[14px] md:py-[12px] font-black text-[14px] md:text-[13px] text-blue-600 md:text-gray-900 dark:text-slate-100 border-b border-gray-50 dark:border-slate-700/50 mb-2 pb-2 md:border-0 md:mb-0 md:pb-0 flex justify-between items-center md:display-table-cell">
                  <div className="flex flex-col">
                    <span className="md:hidden text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase mb-0.5">이름</span>
                    {row.name}
                  </div>
                  <span className="md:hidden bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[10px] font-bold text-gray-500 dark:text-slate-300">{row.company}</span>
                </td>
                
                <td className="px-0 py-1 md:px-[14px] md:py-[12px]">
                   <span className="md:hidden text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase mb-0.5 block">계정 정보 / 탈퇴 일시</span>
                   <div className="flex flex-col gap-1 md:display-contents">
                      <span className="text-[12px] md:text-[13px] text-gray-600 dark:text-slate-300 font-medium truncate">{row.email}</span>
                      <span className="md:hidden font-mono text-[11px] text-gray-400 dark:text-slate-500 italic">{row.date}</span>
                   </div>
                </td>

                <td className="hidden md:table-cell px-[14px] py-[12px]">
                   <span className="bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[11px] font-bold text-gray-600 dark:text-slate-200">{row.company}</span>
                </td>
                
                <td className="hidden md:table-cell px-[14px] py-[12px]">
                   <span className="font-mono text-[12px] text-gray-500 dark:text-slate-400">{row.date}</span>
                </td>

                <td className="px-0 py-1 md:px-[14px] md:py-[12px]">
                  <span className="md:hidden text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase mb-0.5 block">탈퇴 사유</span>
                  <span className="text-[12px] md:text-[13px] text-gray-600 dark:text-slate-400 leading-snug">{row.reason}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination mock */}
        <div className="h-[60px] border-t border-gray-100 dark:border-slate-700 flex justify-center items-center gap-1 bg-[#FAFAFA] dark:bg-slate-900/50 shrink-0">
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-500">&lt;</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-primary-500 bg-primary-500 text-white font-semibold">1</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-[#F9FAFB]">2</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-[#F9FAFB]">3</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-[#F9FAFB]">4</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-[#F9FAFB]">&gt;</button>
        </div>
      </div>
    </div>
  );
}
