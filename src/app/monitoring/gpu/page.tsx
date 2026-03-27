'use client';

import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, MoreVertical, Calendar } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { tenants, gpuNodes } from '@/lib/mockData';

export default function GPUMonitoring() {
  const [activeTab, setActiveTab] = useState<'gpu' | 'cpu'>('gpu');
  const [selectedTenantId, setSelectedTenantId] = useState<string>(tenants[0].id);
  const [selectedSubtenantId, setSelectedSubtenantId] = useState<string>('all');
  const [selectedInstances, setSelectedInstances] = useState<string[]>([]);

  const toggleInstance = (id: string) => {
    setSelectedInstances(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const mockData = useMemo(() => {
    return Array.from({length: 24}).map((_, i) => {
      const h = (10 + i) % 24;
      const day = i < 14 ? 18 : 19;
      const time = `03-${day.toString().padStart(2, '0')} ${h.toString().padStart(2, '0')}:00`;
      
      const point: any = { time };
      for (let j = 1; j <= 8; j++) {
        point[`usage_${j}`] = Math.round((85 + Math.random() * 13) * 10) / 10;
        point[`mem_${j}`] = Math.round((60000 + Math.random() * 20000));
        point[`temp_${j}`] = Math.round((65 + Math.random() * 13) * 10) / 10;
        point[`power_${j}`] = Math.round((280 + Math.random() * 40));
      }
      return point;
    });
  }, []);

  const colorPalettes = {
    usage: ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#1d4ed8', '#bfdbfe', '#1e3a8a'],
    mem: ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#1d4ed8', '#bfdbfe', '#1e3a8a'],
    temp: ['#b45309', '#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#92400e', '#fde68a', '#78350f'],
    power: ['#047857', '#059669', '#10b981', '#34d399', '#6ee7b7', '#065f46', '#a7f3d0', '#064e3b'],
    cpu: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#71717a'],
    load: ['#64748b', '#475569', '#334155', '#1e293b', '#0f172a', '#3f3f46', '#27272a', '#18181b']
  };

  const gpuCharts = [
    { title: 'GPU 사용률 (%)', key: 'usage', colors: colorPalettes.usage, domain: [0, 100], unit: '%' },
    { title: 'GPU 메모리 사용량 (MB)', key: 'mem', colors: colorPalettes.mem, domain: [0, 85000], unit: 'MB' },
    { title: 'GPU 온도 (°C)', key: 'temp', colors: colorPalettes.temp, domain: [0, 100], unit: '°C' },
    { title: 'GPU 전력 사용량 (W)', key: 'power', colors: colorPalettes.power, domain: [0, 400], unit: 'W' }
  ];

  const cpuCharts = [
    { title: 'CPU 사용률 (%)', key: 'usage', colors: colorPalettes.cpu, domain: [0, 100], unit: '%' },
    { title: 'Load Average (1m)', key: 'temp', colors: colorPalettes.load, domain: [0, 50], unit: '' },
    { title: 'CPU 클럭 (MHz)', key: 'power', colors: colorPalettes.cpu, domain: [0, 4500], unit: 'MHz' },
    { title: 'CPU 온도 (°C)', key: 'temp', colors: colorPalettes.temp, domain: [0, 100], unit: '°C' }
  ];

  const charts = activeTab === 'gpu' ? gpuCharts : cpuCharts;

  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];
  const currentSubtenants = currentTenant.subtenants.filter(s => s.assignedNodes.length > 0);
  
  const filteredNodes = useMemo(() => {
    let nodes = gpuNodes.filter(n => n.tenantId === selectedTenantId);
    if (selectedSubtenantId !== 'all') {
      nodes = nodes.filter(n => n.subtenantId === selectedSubtenantId);
    }
    return nodes;
  }, [selectedTenantId, selectedSubtenantId]);

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[calc(100vh-112px)] gap-6">
      <div className="w-full md:w-[260px] bg-white border border-gray-200 rounded-[10px] flex flex-col overflow-hidden md:shrink-0">
        <div className="p-4 border-b border-gray-100 flex flex-col gap-3 flex-none">
          <select 
            value={selectedTenantId} 
            onChange={e => {
              setSelectedTenantId(e.target.value);
              setSelectedSubtenantId('all');
              setSelectedInstances([]);
            }} 
            className="w-full h-[34px] border border-gray-200 rounded-[7px] text-[13px] px-3 focus:outline-none focus:border-primary-500 bg-white"
          >
            {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select 
            value={selectedSubtenantId} 
            onChange={e => {
              setSelectedSubtenantId(e.target.value);
              setSelectedInstances([]);
            }}
            className="w-full h-[34px] border border-gray-200 rounded-[7px] text-[13px] px-3 focus:outline-none focus:border-primary-500 bg-white"
          >
            <option value="all">전체 프로젝트</option>
            {currentSubtenants.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <div className="flex justify-end gap-2 mt-1">
            <button className="flex items-center justify-center p-2 rounded-[7px] border border-gray-200 text-gray-600 hover:bg-gray-50 h-[34px] w-[34px]">
              <RotateCcw size={14} />
            </button>
            <button className="flex-1 h-[34px] bg-primary-500 hover:bg-primary-600 text-white font-semibold text-[13px] rounded-[7px]">
              검색
            </button>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center flex-none">
          <span className="text-[12px] font-semibold text-gray-900">Total {filteredNodes.length}</span>
          <span className="text-[12px] text-gray-600">{selectedInstances.length}개 선택됨</span>
        </div>
        <div className="flex-1 max-h-[40vh] md:max-h-none overflow-y-auto">
          {filteredNodes.map((n) => {
            const isSelected = selectedInstances.includes(n.name);
            const subName = currentSubtenants.find(s => s.id === n.subtenantId)?.name || '미배정 / 공용';
            return (
              <div 
                key={n.name} 
                onClick={() => toggleInstance(n.name)}
                className={`flex items-center gap-3 p-4 border-b border-gray-100 cursor-pointer ${isSelected ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
              >
                <input 
                  type="checkbox" 
                  className="rounded-[4px] border-gray-300 pointer-events-none" 
                  checked={isSelected} 
                  onChange={() => {}} 
                />
                <div className="flex-1 overflow-hidden pointer-events-none">
                  <div className="text-[11px] text-gray-400 mb-1 truncate">{subName}</div>
                  <div className="text-[13px] font-mono text-gray-900 font-semibold mb-0 leading-none">{n.name.split('-').pop()?.toUpperCase()}</div>
                </div>
                <div className="flex items-center gap-1.5 px-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${n.status === 'ok' ? 'bg-blue-600' : n.status === 'warn' ? 'bg-amber-500' : 'bg-red-600'}`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-[10px] flex flex-col overflow-hidden">
        <div className="flex flex-col md:flex-row md:h-[56px] shrink-0 border-b border-gray-200 bg-white">
          <div className="flex h-[48px] md:h-full border-b md:border-b-0 border-gray-100">
            <button 
              onClick={() => setActiveTab('gpu')}
              className={`flex-1 md:flex-none px-5 h-full ${activeTab === 'gpu' ? 'border-b-[3px] border-primary-500 text-primary-600 font-extrabold' : 'text-gray-500 font-bold'} text-[13px] flex items-center justify-center uppercase tracking-tight transition-all`}
            >
              GPU 모니터링
            </button>
            <button 
              onClick={() => setActiveTab('cpu')}
              className={`flex-1 md:flex-none px-5 h-full ${activeTab === 'cpu' ? 'border-b-[3px] border-primary-500 text-primary-600 font-extrabold' : 'text-gray-500 font-bold'} text-[13px] flex items-center justify-center hover:text-gray-900 transition-all uppercase tracking-tight`}
            >
              CPU 모니터링
            </button>
          </div>
          <div className="flex-1 hidden md:block" />
          <div className="p-3 md:p-0 flex flex-wrap items-center gap-2 md:pr-4">
            <div className="flex border border-gray-200 rounded-[8px] overflow-hidden text-[11px] bg-gray-50 h-[34px] shadow-sm">
              <button className="px-3 py-1 font-bold text-gray-500 hover:bg-white border-r border-gray-100 transition-colors">1D</button>
              <button className="px-3 py-1 font-bold text-gray-500 hover:bg-white border-r border-gray-100 transition-colors">3D</button>
              <button className="px-3 py-1 font-black text-primary-600 bg-white border-r border-gray-100">1W</button>
              <button className="px-3 py-1 font-bold text-gray-500 hover:bg-white transition-colors">1M</button>
            </div>
            <div className="flex flex-1 md:flex-none items-center gap-2 border border-gray-200 rounded-[8px] px-3 h-[34px] bg-white shadow-sm">
              <Calendar size={13} className="text-gray-400" />
              <span className="text-[11px] font-mono font-bold text-gray-600 truncate">2026.03.18 - 03.19</span>
            </div>
            <button className="h-[34px] w-[34px] flex items-center justify-center border border-gray-200 rounded-[8px] text-gray-500 hover:bg-gray-50 transition-all hover:rotate-180 duration-500 active:scale-90">
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 p-5 overflow-y-auto">
          {selectedInstances.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-[14px]">
              좌측에서 인스턴스를 1개 이상 선택해 주세요.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full min-h-[600px]">
              {charts.map((chart, idx) => (
                <div key={idx} className="border border-gray-200 rounded-[10px] p-5 flex flex-col bg-white">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[14px] font-semibold text-gray-900">{chart.title}</h3>
                    <button className="text-gray-400 hover:text-gray-900">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <div className="flex-1 w-full min-h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 11, fill: '#9CA3AF' }} 
                          dy={10} 
                          minTickGap={30}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 11, fill: '#9CA3AF' }} 
                          tickFormatter={(val) => `${val} ${chart.unit}`} 
                          domain={chart.domain}
                        />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: 600, color: '#111827' }} 
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        
                        {selectedInstances.map((instId, lineIdx) => {
                          const mockIdx = parseInt(instId.replace('gsvp-msi-gpu', ''), 10) % 8 || 8;
                          return (
                          <Line 
                            key={instId}
                            name={instId.split('-').pop()?.toUpperCase()}
                            type="monotone" 
                            dataKey={`${chart.key}_${mockIdx}`} 
                            stroke={chart.colors[lineIdx % 8]} 
                            strokeWidth={2} 
                            dot={false}
                            activeDot={{ r: 4 }}
                          />
                        )})}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
