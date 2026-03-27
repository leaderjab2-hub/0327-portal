'use client';

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export default function WithdrawnList() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="bg-white border text-left border-gray-200 rounded-[14px] p-4 flex flex-col md:flex-row md:items-center justify-between shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] gap-4">
        <div className="flex items-center justify-between md:border-r md:border-gray-200 md:pr-5">
          <div className="text-[14px] font-bold text-gray-900">탈퇴 이력 <span className="text-gray-400 font-normal ml-2">Total 128</span></div>
        </div>
        
        <div className="flex-1 md:px-5 flex flex-col sm:flex-row items-stretch md:items-center gap-3">
          <select className="h-[36px] sm:w-[160px] border border-gray-200 rounded-[8px] text-[13px] px-3 focus:outline-none focus:border-primary-500 bg-white cursor-pointer transition-all">
            <option>전체 회사</option>
            <option>LG전자</option>
          </select>
          <div className="relative flex-1 sm:max-w-[240px]">
            <input type="text" placeholder="이름 검색" className="w-full h-[36px] border border-gray-200 rounded-[8px] text-[13px] px-3 pl-8 focus:outline-none focus:border-primary-500 bg-white transition-all" />
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

      <div className="flex-1 bg-white border border-gray-200 rounded-[10px] overflow-x-auto flex flex-col">
        <table className="w-full text-left border-collapse flex-1">
          <thead className="hidden md:table-header-group">
            <tr className="bg-[#FAFAFA] border-b border-gray-200">
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 uppercase tracking-wide">이름</th>
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 uppercase tracking-wide">이메일</th>
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 uppercase tracking-wide">소속 회사</th>
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 uppercase tracking-wide">탈퇴 일시</th>
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 uppercase tracking-wide">탈퇴 사유</th>
            </tr>
          </thead>
          <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
            {[
              { name: '오현규', email: 'hyunkyu.oh@lge.com', company: 'LG전자', date: '2026.03.18 14:02:11', reason: '퇴사로 인한 계정 삭제 요청' },
              { name: '장수연', email: 'sooyeon.jang@kakao.com', company: 'Kakao', date: '2026.03.14 09:21:40', reason: '프로젝트 종료 및 인력 교체' },
              { name: '이민수', email: 'mslee@upstage.ai', company: 'Upstage', date: '2026.03.10 11:45:00', reason: '개인정보 처리방침 변경 거부' },
              { name: '김정훈', email: 'jhkim123@naver.com', company: 'Naver', date: '2026.03.01 16:55:22', reason: '장기 미접속(1년 이상) 자동 탈퇴 처리' },
            ].map((row, i) => (
              <tr key={i} className="flex flex-col border border-gray-200 rounded-xl p-5 shadow-sm bg-white md:table-row md:border-0 md:border-b md:border-[#F3F4F6] md:rounded-none md:p-0 md:shadow-none hover:bg-[#F9FAFB] transition-colors">
                <td className="px-0 py-1 md:px-[14px] md:py-[12px] font-bold text-[15px] md:text-[13px] text-primary-600 md:text-gray-900 border-b border-gray-50 mb-2 pb-2 md:border-0 md:mb-0 md:pb-0">
                  <span className="md:hidden text-[11px] text-gray-400 font-normal block mb-1">이름</span>
                  {row.name}
                </td>
                <td className="px-0 py-1 md:px-[14px] md:py-[12px]">
                  <span className="md:hidden text-[11px] text-gray-400 font-normal block mb-1">이메일</span>
                  <span className="text-gray-600 font-medium">{row.email}</span>
                </td>
                <td className="px-0 py-1 md:px-[14px] md:py-[12px]">
                  <span className="md:hidden text-[11px] text-gray-400 font-normal block mb-1">소속 회사</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-bold md:bg-transparent md:p-0 md:text-[13px] md:font-semibold">{row.company}</span>
                </td>
                <td className="px-0 py-1 md:px-[14px] md:py-[12px]">
                  <span className="md:hidden text-[11px] text-gray-400 font-normal block mb-1">탈퇴 일시</span>
                  <span className="font-mono text-[12px] text-gray-500">{row.date}</span>
                </td>
                <td className="px-0 py-1 md:px-[14px] md:py-[12px]">
                  <span className="md:hidden text-[11px] text-gray-400 font-normal block mb-1">탈퇴 사유</span>
                  <span className="text-gray-600 leading-relaxed">{row.reason}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination mock */}
        <div className="h-[60px] border-t border-gray-100 flex justify-center items-center gap-1 bg-[#FAFAFA] shrink-0">
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 bg-white text-gray-400">&lt;</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-primary-500 bg-primary-500 text-white font-semibold">1</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-[#F9FAFB]">2</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-[#F9FAFB]">3</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-[#F9FAFB]">4</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-[#F9FAFB]">&gt;</button>
        </div>
      </div>
    </div>
  );
}
