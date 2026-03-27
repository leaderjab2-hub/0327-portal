'use client';

import React, { useState } from 'react';
import { Search, RotateCcw, Plus, MoreVertical, X } from 'lucide-react';

function CreateAdminModal({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: (data: any) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('관리자');

  if (!isOpen) return null;

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const emailError = email.length > 0 && !isValidEmail(email) ? '유효한 이메일 형식이 아닙니다.' : '';
  const isFormValid = name.trim().length > 0 && email.trim().length > 0 && isValidEmail(email) && role.length > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;
    
    // YYYY.MM.DD HH:mm:ss Format for Mock
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    onConfirm({
      name,
      email,
      role,
      roleBg: role === '관리자' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#F5F3FF] text-[#7C3AED]',
      date: dateStr,
    });
    
    setName('');
    setEmail('');
    setRole('관리자');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-[16px] w-full max-w-[500px] max-h-full shadow-2xl relative transition-all flex flex-col overflow-hidden">
        <div className="p-5 sm:p-8 shrink-0 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-[18px] sm:text-[20px] font-extrabold text-gray-900">관리자 계정 생성</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors"><X size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto min-h-0 p-5 sm:p-8">
          <div className="flex flex-col gap-4 sm:gap-5">
           <div>
              <label className="block text-[12px] sm:text-[13px] font-bold text-gray-700 mb-1.5">이름 <span className="text-red-500">*</span></label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="이름을 입력하세요" className="w-full border border-gray-200 rounded-[10px] p-2.5 sm:p-3 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium" />
           </div>
           <div>
              <label className="block text-[12px] sm:text-[13px] font-bold text-gray-700 mb-1.5">이메일 <span className="text-red-500">*</span></label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@skt.com" className={`w-full border rounded-[10px] p-2.5 sm:p-3 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all font-medium ${emailError ? 'border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'}`} />
              {emailError && <p className="text-red-500 text-[11px] mt-1.5 font-bold flex items-center gap-1.5"><X size={12}/> {emailError}</p>}
           </div>
           <div>
              <label className="block text-[12px] sm:text-[13px] font-bold text-gray-700 mb-1.5">권한 <span className="text-red-500">*</span></label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full border border-gray-200 rounded-[10px] p-2.5 sm:p-3 text-[13px] text-gray-900 font-bold focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 bg-white transition-all cursor-pointer">
                 <option value="관리자">관리자</option>
                 <option value="인프라 관리자">인프라 관리자</option>
              </select>
           </div>
          </div>
        </div>

        <div className="p-5 sm:p-8 flex justify-end gap-2.5 border-t border-gray-100 shrink-0 bg-gray-50/50">
           <button onClick={onClose} className="flex-1 sm:flex-none px-5 py-2.5 rounded-[10px] text-[13px] font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">취소</button>
           <button onClick={handleSubmit} disabled={!isFormValid} className={`flex-1 sm:flex-none px-6 py-2.5 rounded-[10px] text-[13px] font-extrabold transition-all outline-none ${isFormValid ? 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-black/10 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>확인</button>
        </div>
      </div>
    </div>
  );
}

export default function Admins() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [admins, setAdmins] = useState([
    { name: '김솔솔', email: 'solsol.kim@skt.com', role: '인프라 관리자', roleBg: 'bg-[#F5F3FF] text-[#7C3AED]', date: '2026.01.10 09:00:00' },
    { name: '이태현', email: 'thlee.dev@skt.com', role: '관리자', roleBg: 'bg-[#EFF6FF] text-[#2563EB]', date: '2026.01.12 14:30:22' },
    { name: '최윤진', email: 'yoonjin.choi@skt.com', role: '관리자', roleBg: 'bg-[#EFF6FF] text-[#2563EB]', date: '2026.01.15 10:15:40' },
    { name: '박태민', email: 'tm.park@skt.com', role: '인프라 관리자', roleBg: 'bg-[#F5F3FF] text-[#7C3AED]', date: '2026.02.01 16:40:12' },
  ]);

  const handleCreateAdmin = (newAdmin: any) => {
    setAdmins([...admins, newAdmin]);
  };

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <CreateAdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleCreateAdmin} />

      <div className="bg-white border text-left border-gray-200 rounded-[14px] p-4 flex flex-col md:flex-row md:items-center justify-between shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] gap-4">
        <div className="flex items-center justify-between md:border-r md:border-gray-200 md:pr-5">
           <div className="text-[14px] font-bold text-gray-900">플랫폼 관리자 <span className="text-gray-400 font-normal ml-2">Total {admins.length}</span></div>
        </div>
        
        <div className="flex-1 md:px-5 flex flex-col sm:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1 sm:max-w-[300px]">
            <input type="text" placeholder="관리자 명 검색" className="w-full h-[36px] border border-gray-200 rounded-[8px] text-[13px] px-3 pl-8 focus:outline-none focus:border-primary-500 bg-white transition-all shadow-sm" />
            <Search size={14} className="absolute left-3 top-[11px] text-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 md:pt-0 border-t border-gray-50 md:border-none">
          <button className="h-[36px] w-[36px] flex items-center justify-center border border-gray-200 rounded-[8px] text-gray-500 hover:bg-gray-50 transition-colors">
            <RotateCcw size={14} />
          </button>
          <button className="h-[36px] px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[13px] rounded-[8px] flex items-center justify-center transition-colors">
            검색
          </button>
          <div className="w-[1px] h-[16px] bg-gray-200 mx-1"></div>
          <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none h-[36px] px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-[13px] rounded-[8px] flex items-center justify-center gap-1.5 shadow-sm shadow-primary-500/10 transition-all active:scale-[0.98]">
            <Plus size={14} /> <span>생성</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[10px] overflow-x-auto overflow-y-auto flex flex-col shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] h-full scrollbar-thin">
        <table className="w-full min-w-[1000px] text-left border-collapse flex-1">
          <thead className="hidden md:table-header-group">
            <tr className="bg-[#FAFAFA] border-b border-gray-200">
              <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">관리자 명</th>
              <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">이메일</th>
              <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">권한</th>
              <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">등록 일시</th>
              <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide w-10"></th>
            </tr>
          </thead>
          <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
            {admins.map((row, i) => (
              <tr key={i} className="flex flex-col border border-gray-200 rounded-xl p-5 shadow-sm bg-white md:table-row md:border-0 md:border-b md:border-gray-100 md:rounded-none md:p-0 md:shadow-none hover:bg-gray-50/50 transition-colors relative">
                <td className="px-0 py-1 md:px-[20px] md:py-[14px] font-bold text-primary-600 border-b border-gray-50 mb-3 pb-2 md:border-0 md:mb-0 md:pb-0 md:text-gray-900 md:text-[13px] whitespace-nowrap">
                  <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">관리자 명</span>
                  {row.name}
                  <div className="absolute top-5 right-12 md:static md:inline-block md:ml-3">
                    <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${row.roleBg}`}>{row.role}</span>
                  </div>
                </td>
                <td className="px-0 py-1 md:px-[20px] md:py-[14px] whitespace-nowrap">
                  <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">이메일</span>
                  <span className="text-gray-600 font-medium md:text-[13px]">{row.email}</span>
                </td>
                <td className="hidden md:table-cell px-[20px]">
                   {/* PC 전용 (권한은 위에서 처리) */}
                </td>
                <td className="px-0 py-1 md:px-[20px] md:py-[14px] font-mono text-[12px] text-gray-500 md:text-[12px] whitespace-nowrap">
                  <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">등록 일시</span>
                  {row.date}
                </td>
                <td className="absolute top-5 right-5 md:static px-0 md:px-[20px] text-gray-400 hover:text-gray-900 cursor-pointer">
                  <MoreVertical size={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination mock */}
        <div className="h-[60px] border-t border-gray-100 flex justify-center items-center gap-1.5 bg-[#FAFAFA] shrink-0">
          <button className="w-[32px] h-[32px] rounded-[6px] border border-gray-200 bg-white text-gray-400 font-bold hover:bg-gray-50">&lt;</button>
          <button className="w-[32px] h-[32px] rounded-[6px] border border-primary-500 bg-primary-500 text-white font-bold">1</button>
          <button className="w-[32px] h-[32px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-bold">&gt;</button>
        </div>
      </div>
    </div>
  );
}
