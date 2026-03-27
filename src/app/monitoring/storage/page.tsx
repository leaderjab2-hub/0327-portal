'use client';

import React, { useMemo } from 'react';
import { Search, RotateCcw, Calendar, MoreVertical, ToggleRight } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';

type Config = {
  cap: [number, number];
  bwWS: [number, number]; bwWb: number;
  bwRS: [number, number]; bwRb: number;
  opWS: [number, number]; opWb: number;
  opRS: [number, number]; opRb: number;
  laWS: [number, number]; laWb: number;
  laRS: [number, number]; laRb: [number, number];
};

const lgConfig: Config = {
  cap: [1.7, 1.9],
  bwWS: [40, 50], bwWb: 5,
  bwRS: [10, 20], bwRb: 2,
  opWS: [80, 120], opWb: 5,
  opRS: [30, 50], opRb: 2,
  laWS: [12, 16], laWb: 1.5,
  laRS: [7.5, 8.5], laRb: [3, 2]
};

const upstageConfig: Config = {
  cap: [1.3, 1.5],
  bwWS: [60, 90], bwWb: 10,
  bwRS: [40, 80], bwRb: 10,
  opWS: [150, 220], opWb: 10,
  opRS: [80, 120], opRb: 5,
  laWS: [10, 14], laWb: 2,
  laRS: [7, 9], laRb: [3, 1]
};

const generateData = (config: Config) => {
  return Array.from({length: 23}).map((_, i) => {
    const hour = (11 + i) % 24;
    const day = (11 + i) < 24 ? 18 : 19;
    const time = `03-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:00`;
    
    const isSpike = Math.random() > 0.8;
    const isSmallSpike = !isSpike && Math.random() > 0.9;
    
    return {
      time,
      capacity: Number((config.cap[0] + Math.random() * (config.cap[1]-config.cap[0])).toFixed(2)),
      bwWrite: isSpike ? config.bwWS[0] + Math.random()*(config.bwWS[1]-config.bwWS[0]) : Math.random() * config.bwWb,
      bwRead: isSpike || isSmallSpike ? config.bwRS[0] + Math.random()*(config.bwRS[1]-config.bwRS[0]) : Math.random() * config.bwRb,
      iopsWrite: isSpike ? config.opWS[0] + Math.random()*(config.opWS[1]-config.opWS[0]) : Math.random() * config.opWb,
      iopsRead: isSpike || isSmallSpike ? config.opRS[0] + Math.random()*(config.opRS[1]-config.opRS[0]) : Math.random() * config.opRb,
      latWrite: isSpike ? config.laWS[0] + Math.random()*(config.laWS[1]-config.laWS[0]) : Math.random() * config.laWb,
      latRead: isSpike || isSmallSpike ? config.laRS[0] + Math.random()*(config.laRS[1]-config.laRS[0]) : config.laRb[0] + Math.random() * config.laRb[1],
    };
  });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-3 rounded-[8px] shadow-sm text-[12px] font-semibold text-gray-900">
        <p className="mb-2 text-gray-500 font-mono text-[11px] font-normal">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-mono">{Number(entry.value).toFixed(1)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function StorageMonitoring() {
  const lgData = useMemo(() => generateData(lgConfig), []);
  const upstageData = useMemo(() => generateData(upstageConfig), []);

  const companies = [
    {
      name: 'LG전자',
      storageId: 'LG-AILAB',
      usage: '1.9 PB',
      quota: '2.0 PB',
      percent: '95%',
      percentColor: 'text-[#DC2626] bg-[#FEF2F2]', // High priority 95%
      data: lgData,
      domains: {
        cap: [0, 2.1], bw: [0, 53], iops: [0, 130], lat: [0, 20]
      }
    },
    {
      name: 'Upstage',
      storageId: 'upstage',
      usage: '1.52 PB',
      quota: '2.0 PB',
      percent: '76%',
      percentColor: 'text-primary-600 bg-primary-50', // Normal 76%
      data: upstageData,
      domains: {
        cap: [0, 1.7], bw: [0, 100], iops: [0, 253], lat: [0, 17]
      }
    }
  ];

  return (
    <div className="flex flex-col gap-6 h-full w-full min-w-0">
      <div className="bg-white border text-left border-gray-200 rounded-[10px] p-4 flex items-center justify-between">
        <div className="text-[14px] font-semibold text-gray-900 border-r border-gray-200 pr-5">Total 2</div>
        <div className="flex-1 px-5 flex items-center gap-3">
          <select className="h-[34px] w-[200px] border border-gray-200 rounded-[7px] text-[13px] px-3 focus:outline-none focus:border-primary-500 bg-white">
            <option>전체 회사</option>
            <option>LG전자</option>
            <option>Upstage</option>
          </select>
          <div className="flex items-center gap-2 border border-gray-200 rounded-[7px] px-3 h-[34px] bg-white w-[200px]">
            <Calendar size={14} className="text-gray-400" />
            <span className="text-[12px] font-mono text-gray-600">2026.03.18 - 2026.03.19</span>
          </div>
          <button className="h-[34px] w-[34px] flex items-center justify-center border border-gray-200 rounded-[7px] text-gray-600 hover:bg-gray-50">
            <RotateCcw size={14} />
          </button>
        </div>
        <div>
          <button className="h-[34px] w-[80px] bg-primary-500 hover:bg-primary-600 text-white font-semibold text-[13px] rounded-[7px] flex items-center justify-center gap-1">
            <Search size={14} /> <span>검색</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full min-w-0 flex flex-col gap-6 pr-1">
        {companies.map((comp, idx) => (
          <div key={idx} className="bg-white border text-left border-gray-200 rounded-[10px] overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#FAFAFA]">
              <div className="flex items-center gap-4">
                <h2 className="text-[16px] font-bold text-gray-900">{comp.name}</h2>
                <span className="text-[13px] text-gray-600 font-mono">{comp.storageId}</span>
              </div>
              <div className="flex items-center gap-4 border border-gray-200 rounded-[7px] px-4 py-1.5 bg-white">
                <span className="text-[12px] text-gray-400 font-semibold tracking-wide uppercase">사용량</span>
                <span className="text-[14px] font-mono font-bold text-gray-900">{comp.usage} / {comp.quota}</span>
                <span className={`px-2 py-0.5 rounded-[4px] text-[11px] font-bold font-mono ${comp.percentColor}`}>{comp.percent}</span>
                <div className="w-px h-4 bg-gray-200 mx-2" />
                <ToggleRight size={24} className="text-[#10B981]" />
                <span className="text-[12px] font-semibold text-[#10B981]">활성</span>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[13px] font-semibold text-gray-900">Capacity (PB/TB)</h3>
                  <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
                </div>
                <div className="h-[140px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={comp.data} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} dy={5} minTickGap={30} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickFormatter={(val) => `${val} PB`} domain={comp.domains.cap} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="capacity" name="Used" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-[13px] font-semibold text-gray-900">Tenants BW (GB/s)</h3>
                    <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
                  </div>
                  <div className="h-[180px] w-full min-w-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comp.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} dy={5} minTickGap={40}/>
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={comp.domains.bw} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Bar dataKey="bwWrite" name="Write" fill="#3B82F6" radius={[2,2,0,0]} maxBarSize={15} />
                        <Bar dataKey="bwRead" name="Read" fill="#10B981" radius={[2,2,0,0]} maxBarSize={15} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-[13px] font-semibold text-gray-900">IOPS (K)</h3>
                    <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
                  </div>
                  <div className="h-[180px] w-full min-w-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comp.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} dy={5} minTickGap={40}/>
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={comp.domains.iops} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Bar dataKey="iopsWrite" name="Write" fill="#3B82F6" radius={[2,2,0,0]} maxBarSize={15} />
                        <Bar dataKey="iopsRead" name="Read" fill="#10B981" radius={[2,2,0,0]} maxBarSize={15} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-[13px] font-semibold text-gray-900">Latency (ms/μs)</h3>
                      <div className="flex gap-2">
                        <span className="flex items-center gap-1 text-[10px] text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></div>Write</span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>Read</span>
                      </div>
                    </div>
                    <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
                  </div>
                  <div className="h-[180px] w-full min-w-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={comp.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} dy={5} minTickGap={40}/>
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={comp.domains.lat} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="latWrite" name="Write" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        <Line type="monotone" dataKey="latRead" name="Read" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
