'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Cpu,
  Package,
  Search,
  Server,
  Trash2,
  X,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { compareNodeIds, formatNodeRanges, toNodeChipLabel } from '@/lib/nodeAllocations';
import type { Json } from '@/types/database';

type TenantRecord = {
  id: string;
  name: string;
  contract: Json | null;
};

type SubtenantRecord = {
  id: string;
  tenant_id: string | null;
  name: string;
  status: string | null;
  products: Json | null;
};

type AllocationNode = {
  id: string;
  label: string;
  status: 'ok' | 'warn' | 'err';
};

type AllocationRecord = {
  id: number;
  tenant_id: string | null;
  subtenant_id: string | null;
  node_id: string;
  allocated_at: string | null;
  node?: AllocationNode | null;
};

type AvailableNode = {
  id: string;
  label: string;
  status: 'ok' | 'warn' | 'err';
};

type TenantView = {
  id: string;
  name: string;
  contractCount: number;
};

type SubtenantView = {
  id: string;
  tenantId: string;
  name: string;
  status: string;
  products: string[];
};

type NodeChoice = {
  id: string;
  label: string;
};

type RangeModalProps = {
  isOpen: boolean;
  title: string;
  confirmLabel: string;
  saving: boolean;
  nodeChoices: NodeChoice[];
  onClose: () => void;
  onSubmit: (input: { startNodeId: string; endNodeId: string }) => Promise<void>;
  tone?: 'primary' | 'emerald';
};

type ResourcesPageClientProps = {
  initialTenantRecords?: TenantRecord[];
  initialSubtenantRecords?: SubtenantRecord[];
  initialAllocationRecords?: AllocationRecord[];
};

type ReclaimModalProps = {
  isOpen: boolean;
  title: string;
  allocations: AllocationRecord[];
  saving: boolean;
  onClose: () => void;
  onSubmitSelected: (allocationIds: number[]) => Promise<void>;
  onSubmitAll: () => Promise<void>;
};

function parseContractGpuQuantity(contract: Json | null) {
  if (!contract || Array.isArray(contract) || typeof contract !== 'object') {
    return 0;
  }
  const gpu = 'gpu' in contract ? contract.gpu : null;
  if (!gpu || Array.isArray(gpu) || typeof gpu !== 'object') {
    return 0;
  }
  const quantity = 'quantity' in gpu ? gpu.quantity : 0;
  return typeof quantity === 'number' ? quantity : 0;
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? '요청을 처리하지 못했습니다.');
  }
  return payload;
}

function getRangeNodeIds(nodeChoices: NodeChoice[], startNodeId: string, endNodeId: string) {
  const sorted = [...nodeChoices].sort((left, right) => compareNodeIds(left.id, right.id));
  const startIndex = sorted.findIndex((node) => node.id === startNodeId);
  const endIndex = sorted.findIndex((node) => node.id === endNodeId);
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    return [];
  }
  return sorted.slice(startIndex, endIndex + 1).map((node) => node.id);
}

function RangeModal({
  isOpen,
  title,
  confirmLabel,
  saving,
  nodeChoices,
  onClose,
  onSubmit,
  tone = 'primary',
}: RangeModalProps) {
  const [startNodeId, setStartNodeId] = useState('');
  const [endNodeId, setEndNodeId] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && nodeChoices.length > 0) {
      if (!startNodeId) setStartNodeId(nodeChoices[0].id);
      if (!endNodeId) setEndNodeId(nodeChoices[0].id);
    }
  }, [isOpen, nodeChoices, startNodeId, endNodeId]);

  if (!isOpen) return null;

  const safeStartNodeId = nodeChoices.some((node) => node.id === startNodeId) ? startNodeId : (nodeChoices[0]?.id ?? '');
  const safeEndNodeId = nodeChoices.some((node) => node.id === endNodeId) ? endNodeId : (nodeChoices[0]?.id ?? '');
  const selectedNodeIds = getRangeNodeIds(nodeChoices, safeStartNodeId, safeEndNodeId);
  const disabled = saving || selectedNodeIds.length === 0;
  
  const isEmerald = tone === 'emerald';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">시작 노드</label>
              <select 
                className="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors" 
                value={safeStartNodeId} 
                onChange={(event) => setStartNodeId(event.target.value)}
              >
                {nodeChoices.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">종료 노드</label>
              <select 
                className="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors" 
                value={safeEndNodeId} 
                onChange={(event) => setEndNodeId(event.target.value)}
              >
                {nodeChoices.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
            <div className="mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">선택된 리소스 범위</div>
            <div className="text-sm font-bold text-gray-900">
              {selectedNodeIds.length > 0
                ? `${toNodeChipLabel(safeStartNodeId)} ~ ${toNodeChipLabel(safeEndNodeId)} (총 ${selectedNodeIds.length}대)`
                : '올바른 구간을 선택해 주세요.'}
            </div>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-100 rounded-lg p-3">
              <p className="text-xs font-medium text-red-600">{error}</p>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 bg-gray-50 border-t border-gray-100 px-6 py-4">
          <button 
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-white transition-colors" 
            onClick={onClose} 
            type="button"
          >
            취소
          </button>
          <button
            className={`px-6 py-2.5 rounded-lg text-sm font-black uppercase tracking-wider text-white shadow-sm transition-all disabled:bg-gray-300 ${
              isEmerald ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={disabled}
            onClick={async () => {
              setError(null);
              try {
                await onSubmit({ startNodeId: safeStartNodeId, endNodeId: safeEndNodeId });
              } catch (submitError) {
                setError(submitError instanceof Error ? submitError.message : '처리에 실패했습니다.');
              }
            }}
            type="button"
          >
            {saving ? '저장 중...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReclaimModal({
  isOpen,
  title,
  allocations,
  saving,
  onClose,
  onSubmitSelected,
  onSubmitAll,
}: ReclaimModalProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [startNodeId, setStartNodeId] = useState('');
  const [endNodeId, setEndNodeId] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && allocations.length > 0) {
      if (!startNodeId) setStartNodeId(allocations[0].node_id);
      if (!endNodeId) setEndNodeId(allocations[0].node_id);
    }
  }, [isOpen, allocations, startNodeId, endNodeId]);

  if (!isOpen) return null;

  const sortedAllocations = [...allocations].sort((left, right) => compareNodeIds(left.node_id, right.node_id));
  const safeStartNodeId = sortedAllocations.some((allocation) => allocation.node_id === startNodeId) ? startNodeId : (sortedAllocations[0]?.node_id ?? '');
  const safeEndNodeId = sortedAllocations.some((allocation) => allocation.node_id === endNodeId) ? endNodeId : (sortedAllocations[0]?.node_id ?? '');

  const toggleAllocation = (allocationId: number) => {
    setSelectedIds((prev) =>
      prev.includes(allocationId) ? prev.filter((id) => id !== allocationId) : [...prev, allocationId],
    );
  };

  const selectRange = () => {
    const rangeNodeIds = getRangeNodeIds(
      sortedAllocations.map((allocation) => ({
        id: allocation.node_id,
        label: toNodeChipLabel(allocation.node_id),
      })),
      safeStartNodeId,
      safeEndNodeId,
    );
    const rangeIds = sortedAllocations
      .filter((allocation) => rangeNodeIds.includes(allocation.node_id))
      .map((allocation) => allocation.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...rangeIds])));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">시작 노드</label>
              <select className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm" value={safeStartNodeId} onChange={(event) => setStartNodeId(event.target.value)}>
                {sortedAllocations.map((allocation) => (
                  <option key={allocation.id} value={allocation.node_id}>
                    {toNodeChipLabel(allocation.node_id)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">종료 노드</label>
              <select className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm" value={safeEndNodeId} onChange={(event) => setEndNodeId(event.target.value)}>
                {sortedAllocations.map((allocation) => (
                  <option key={allocation.id} value={allocation.node_id}>
                    {toNodeChipLabel(allocation.node_id)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button 
                className="h-10 px-4 rounded-lg bg-gray-100 text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors" 
                onClick={selectRange} 
                type="button"
              >
                범위 추가
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">회수 대상 노드 목록</div>
              <div className="text-xs font-bold text-red-500">{selectedIds.length}대 선택됨</div>
            </div>
            <div className="grid max-h-[250px] gap-2 overflow-y-auto sm:grid-cols-2 p-1">
              {sortedAllocations.map((allocation) => (
                <label key={allocation.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                  selectedIds.includes(allocation.id) ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100 hover:border-gray-200'
                }`}>
                  <input 
                    checked={selectedIds.includes(allocation.id)} 
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" 
                    onChange={() => toggleAllocation(allocation.id)} 
                    type="checkbox" 
                  />
                  <span className="font-mono text-[13px] font-bold text-gray-900">{toNodeChipLabel(allocation.node_id)}</span>
                </label>
              ))}
            </div>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-100 rounded-lg p-3">
              <p className="text-xs font-medium text-red-600">{error}</p>
            </div>
          ) : null}
        </div>

        <div className="flex justify-between gap-3 bg-gray-50 border-t border-gray-100 px-6 py-4">
          <button
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
            disabled={saving || allocations.length === 0}
            onClick={async () => {
              if (confirm('전체 노드를 회수하시겠습니까?')) {
                try { await onSubmitAll(); } catch (err) { setError(err instanceof Error ? err.message : '실패'); }
              }
            }}
            type="button"
          >
            전체 회수
          </button>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-white" onClick={onClose} type="button">
              취소
            </button>
            <button
              className="px-6 py-2.5 rounded-lg bg-red-600 text-sm font-black uppercase tracking-wider text-white shadow-sm hover:bg-red-700 disabled:opacity-40 transition-all"
              disabled={saving || selectedIds.length === 0}
              onClick={async () => {
                setError(null);
                try { await onSubmitSelected(selectedIds); } catch (err) { setError(err instanceof Error ? err.message : '실패'); }
              }}
              type="button"
            >
              {saving ? '처리 중...' : '선택 회수'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResourcesPageClient({
  initialTenantRecords = [],
  initialSubtenantRecords = [],
  initialAllocationRecords = [],
}: ResourcesPageClientProps) {
  const { currentUser } = useAuth();
  
  const initialTenants = useMemo(
    () => initialTenantRecords.map((t) => ({
      id: t.id,
      name: t.name,
      contractCount: parseContractGpuQuantity(t.contract),
    })),
    [initialTenantRecords]
  );

  const initialSubtenants = useMemo(
    () => initialSubtenantRecords.map((s) => ({
      id: s.id,
      tenantId: s.tenant_id ?? '',
      name: s.name,
      status: s.status ?? '대기',
      products: Array.isArray(s.products) ? s.products.filter((p): p is string => typeof p === 'string') : [],
    })),
    [initialSubtenantRecords]
  );

  const [selectedTenantIndex, setSelectedTenantIndex] = useState(0);
  const [tenants, setTenants] = useState<TenantView[]>(initialTenants);
  const [subtenants, setSubtenants] = useState<SubtenantView[]>(initialSubtenants);
  const [allocations, setAllocations] = useState<AllocationRecord[]>(initialAllocationRecords);
  const [loading, setLoading] = useState(initialTenants.length === 0 && initialSubtenants.length === 0 && initialAllocationRecords.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [tenantModalTarget, setTenantModalTarget] = useState<TenantView | null>(null);
  const [subtenantModalTarget, setSubtenantModalTarget] = useState<SubtenantView | null>(null);
  const [tenantReclaimTarget, setTenantReclaimTarget] = useState<TenantView | null>(null);
  const [subtenantReclaimTarget, setSubtenantReclaimTarget] = useState<SubtenantView | null>(null);
  const [tenantAvailableNodes, setTenantAvailableNodes] = useState<NodeChoice[]>([]);
  const [subtenantAvailableNodes, setSubtenantAvailableNodes] = useState<NodeChoice[]>([]);

  const isAdmin = currentUser?.role === 'admin';
  const canManageSubtenant = currentUser?.role === 'admin' || currentUser?.role === 'tenant_admin';

  const companies = useMemo(() => [
    { id: 'overview', name: '전체 (Overview)', subCount: subtenants.length },
    ...tenants.map((t) => ({
      id: t.id,
      name: t.name,
      subCount: subtenants.filter((s) => s.tenantId === t.id).length,
    })),
  ], [subtenants, tenants]);

  const filteredCompanies = useMemo(() => {
    if (!searchTerm) return companies;
    return [
      companies[0],
      ...companies.slice(1).filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    ];
  }, [companies, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tenantsPayload, subtenantsPayload, allocationsPayload] = await Promise.all([
        readJson<{ data: TenantRecord[] }>(await fetch('/api/tenants', { cache: 'no-store' })),
        readJson<{ data: SubtenantRecord[] }>(await fetch('/api/subtenants', { cache: 'no-store' })),
        readJson<{ data: AllocationRecord[] }>(await fetch('/api/node-allocations', { cache: 'no-store' })),
      ]);

      setTenants((tenantsPayload.data ?? []).map(t => ({
        id: t.id,
        name: t.name,
        contractCount: parseContractGpuQuantity(t.contract),
      })));

      setSubtenants((subtenantsPayload.data ?? []).map(s => ({
        id: s.id,
        tenantId: s.tenant_id ?? '',
        name: s.name,
        status: s.status ?? '대기',
        products: Array.isArray(s.products) ? s.products.filter((p): p is string => typeof p === 'string') : [],
      })));

      setAllocations(allocationsPayload.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTenants.length === 0 && initialSubtenants.length === 0) {
      loadData();
    }
  }, []);

  const totalNodes = 127;
  const totalAllocated = allocations.length;
  const selectedTenant = selectedTenantIndex === 0 ? null : tenants[selectedTenantIndex - 1] ?? null;

  const overviewRows = useMemo(() => tenants.map((tenant) => {
    const tenantAllocations = allocations.filter((a) => a.tenant_id === tenant.id);
    return {
      ...tenant,
      assignedCount: tenantAllocations.length,
      rangeText: formatNodeRanges(tenantAllocations.map(a => a.node_id)),
    };
  }), [allocations, tenants]);

  const tenantDetail = useMemo(() => {
    if (!selectedTenant) return null;
    const tenantAllocations = allocations.filter(a => a.tenant_id === selectedTenant.id);
    const tenantPoolAllocations = tenantAllocations.filter(a => !a.subtenant_id);
    const distributedAllocations = tenantAllocations.filter(a => Boolean(a.subtenant_id));
    const tenantSubtenants = subtenants.filter(s => s.tenantId === selectedTenant.id);

    return {
      ...selectedTenant,
      allocations: tenantAllocations,
      tenantPoolAllocations,
      distributedCount: distributedAllocations.length,
      poolCount: tenantPoolAllocations.length,
      tenantRangeText: formatNodeRanges(tenantAllocations.map(a => a.node_id)),
      poolRangeText: formatNodeRanges(tenantPoolAllocations.map(a => a.node_id)),
      subtenants: tenantSubtenants.map(sub => {
        const subtenantAllocations = tenantAllocations.filter(a => a.subtenant_id === sub.id);
        const usageRatio = tenantAllocations.length > 0 ? (subtenantAllocations.length / tenantAllocations.length) * 100 : 0;
        return {
          ...sub,
          allocationIds: subtenantAllocations.map(a => a.id),
          count: subtenantAllocations.length,
          rangeText: formatNodeRanges(subtenantAllocations.map(a => a.node_id)),
          usageRatio,
        };
      }),
    };
  }, [allocations, selectedTenant, subtenants]);

  const fetchGlobalAvailableNodes = async () => {
    const payload = await readJson<{ data: AvailableNode[] }>(await fetch('/api/node-allocations/available', { cache: 'no-store' }));
    setTenantAvailableNodes((payload.data ?? []).map(n => ({ id: n.id, label: toNodeChipLabel(n.id) })).sort((a,b) => compareNodeIds(a.id, b.id)));
  };

  const fetchTenantPoolNodes = async (tenantId: string) => {
    const payload = await readJson<{ data: AllocationRecord[] }>(await fetch(`/api/node-allocations/available?tenantId=${tenantId}`, { cache: 'no-store' }));
    setSubtenantAvailableNodes((payload.data ?? []).map(a => ({ id: a.node_id, label: toNodeChipLabel(a.node_id) })).sort((a,b) => compareNodeIds(a.id, b.id)));
  };

  const allocateNodes = async (nodeIds: string[], tenantId: string, subtenantId?: string) => {
    for (const nodeId of nodeIds) {
      await fetch('/api/node-allocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId, tenantId, subtenantId: subtenantId ?? null }),
      });
    }
  };

  const reclaimManyAllocations = async (ids: number[]) => {
    for (const id of ids) await fetch(`/api/node-allocations/${id}`, { method: 'DELETE' });
  };

  const reclaimManyTenantAllocations = async (ids: number[]) => {
    for (const id of ids) await fetch(`/api/node-allocations/${id}?scope=tenant`, { method: 'DELETE' });
  };

  return (
    <div className="flex h-full flex-col bg-[#F8FAFC]">
      <div className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-8 space-y-6">
          
          <div className="flex h-[48px] shrink-0 items-center justify-between bg-white px-4 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 min-w-0 flex-1">
              {filteredCompanies.map((c, idx) => {
                const originalIdx = companies.findIndex(comp => comp.id === c.id);
                const isSelected = selectedTenantIndex === originalIdx;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedTenantIndex(originalIdx)}
                    className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
                      isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
            <div className="hidden md:flex items-center gap-4 pl-4 shrink-0">
              <div className="h-4 w-px bg-gray-200 shrink-0" />
              <div className="relative shrink-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                <input
                  className="h-[30px] w-36 rounded-full border border-gray-200 bg-white pl-8 pr-4 text-[12px] transition-all focus:w-48 focus:border-blue-300 focus:outline-none"
                  placeholder="Tenant 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <RangeModal
            confirmLabel="배정 실행"
            isOpen={Boolean(tenantModalTarget)}
            nodeChoices={tenantAvailableNodes}
            onClose={() => setTenantModalTarget(null)}
            onSubmit={async ({ startNodeId, endNodeId }) => {
              setSaving(true);
              try {
                const nodeIds = getRangeNodeIds(tenantAvailableNodes, startNodeId, endNodeId);
                await allocateNodes(nodeIds, tenantModalTarget!.id);
                await loadData();
                setTenantModalTarget(null);
              } finally { setSaving(false); }
            }}
            saving={saving}
            title={`${tenantModalTarget?.name} - 인스턴스 할당`}
          />

          <RangeModal
            confirmLabel="분배 실행"
            isOpen={Boolean(subtenantModalTarget)}
            nodeChoices={subtenantAvailableNodes}
            onClose={() => setSubtenantModalTarget(null)}
            onSubmit={async ({ startNodeId, endNodeId }) => {
              setSaving(true);
              try {
                const nodeIds = getRangeNodeIds(subtenantAvailableNodes, startNodeId, endNodeId);
                await allocateNodes(nodeIds, subtenantModalTarget!.tenantId, subtenantModalTarget!.id);
                await loadData();
                setSubtenantModalTarget(null);
              } finally { setSaving(false); }
            }}
            saving={saving}
            title={`${subtenantModalTarget?.name} - 리소스 분배`}
            tone="emerald"
          />

          <ReclaimModal
            allocations={tenantDetail?.allocations || []}
            isOpen={Boolean(tenantReclaimTarget)}
            onClose={() => setTenantReclaimTarget(null)}
            onSubmitAll={async () => {
              setSaving(true);
              try {
                await reclaimManyTenantAllocations(tenantDetail!.allocations.map(a => a.id));
                await loadData();
                setTenantReclaimTarget(null);
              } finally { setSaving(false); }
            }}
            onSubmitSelected={async (ids) => {
              setSaving(true);
              try {
                await reclaimManyTenantAllocations(ids);
                await loadData();
                setTenantReclaimTarget(null);
              } finally { setSaving(false); }
            }}
            saving={saving}
            title={`${tenantReclaimTarget?.name} - 할당 리소스 회수`}
          />

          <ReclaimModal
            allocations={allocations.filter(a => a.subtenant_id === subtenantReclaimTarget?.id)}
            isOpen={Boolean(subtenantReclaimTarget)}
            onClose={() => setSubtenantReclaimTarget(null)}
            onSubmitAll={async () => {
              setSaving(true);
              try {
                const targets = allocations.filter(a => a.subtenant_id === subtenantReclaimTarget!.id);
                await reclaimManyAllocations(targets.map(a => a.id));
                await loadData();
                setSubtenantReclaimTarget(null);
              } finally { setSaving(false); }
            }}
            onSubmitSelected={async (ids) => {
              setSaving(true);
              try {
                await reclaimManyAllocations(ids);
                await loadData();
                setSubtenantReclaimTarget(null);
              } finally { setSaving(false); }
            }}
            saving={saving}
            title={`${subtenantReclaimTarget?.name} - 분배 리소스 회수`}
          />

          {loading ? (
            <div className="flex h-[400px] items-center justify-center text-sm text-gray-400 italic">로딩 중...</div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {selectedTenant ? (
                  <>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Package size={16} className="text-blue-500" />
                        </div>
                        <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">계약 수량</span>
                      </div>
                      <p className="text-2xl font-black text-gray-900 tabular-nums">{selectedTenant.contractCount}<span className="text-sm ml-1 text-gray-400">대</span></p>
                      <p className="text-xs text-gray-400 mt-1">데이터센터 → Tenant 배정 목표</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Cpu size={16} className="text-emerald-500" />
                        </div>
                        <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">분배 완료</span>
                      </div>
                      <p className="text-2xl font-black text-emerald-600 tabular-nums">{tenantDetail?.distributedCount ?? 0}<span className="text-sm ml-1 text-gray-400">대</span></p>
                      <p className="text-xs text-gray-400 mt-1">산하 프로젝트에 지급 완료된 자원</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                          <Server size={16} className="text-amber-500" />
                        </div>
                        <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">잔여 Pool</span>
                      </div>
                      <p className="text-2xl font-black text-amber-600 tabular-nums">{tenantDetail?.poolCount ?? 0}<span className="text-sm ml-1 text-gray-400">대</span></p>
                      <p className="text-xs text-gray-400 mt-1">추가 분배 가능한 유휴 자원</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Building2 size={16} className="text-blue-500" />
                        </div>
                        <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">전체 인프라</span>
                      </div>
                      <p className="text-2xl font-black text-gray-900 tabular-nums">{totalNodes}<span className="text-sm ml-1 text-gray-400">대</span></p>
                      <p className="text-xs text-gray-400 mt-1">데이터센터 전체 관리 상한</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Cpu size={16} className="text-blue-500" />
                        </div>
                        <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">Tenant 할당</span>
                      </div>
                      <p className="text-2xl font-black text-blue-600 tabular-nums">{totalAllocated}<span className="text-sm ml-1 text-gray-400">대</span></p>
                      <p className="text-xs text-gray-400 mt-1">Tenant에 배분 완료된 누적 자원</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                          <Server size={16} className="text-amber-500" />
                        </div>
                        <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">공용 잔여 풀</span>
                      </div>
                      <p className="text-2xl font-black text-amber-600 tabular-nums">{totalNodes - totalAllocated}<span className="text-sm ml-1 text-gray-400">대</span></p>
                      <p className="text-xs text-gray-400 mt-1">할당 가능한 여유 리소스</p>
                    </div>
                  </>
                )}
              </div>

              {selectedTenant && (
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Building2 size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-gray-900">{selectedTenant.name} 상세</h2>
                      <div className="flex items-center gap-4 mt-0.5">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> 할당 범위: <span className="text-gray-600 font-mono tracking-normal">{tenantDetail?.tenantRangeText || '없음'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <button
                        onClick={async () => { await fetchGlobalAvailableNodes(); setTenantModalTarget(selectedTenant); }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-blue-700 transition-all active:scale-[0.98]"
                      >
                        <Server size={14} /> 할당 추가
                      </button>
                    )}
                    {isAdmin && (tenantDetail?.allocations.length || 0) > 0 && (
                      <button
                        onClick={() => setTenantReclaimTarget(selectedTenant)}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 rounded-lg text-xs font-black uppercase tracking-wider text-red-600 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={14} /> 자원 회수
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    {selectedTenant ? <Package size={16} className="text-blue-500" /> : <Server size={16} className="text-gray-500" />}
                    {selectedTenant ? 'Subtenant 배분 현황' : 'Tenant별 할당 현황'}
                  </h3>
                  {selectedTenant && (
                     <div className="px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-black text-amber-700 uppercase">
                       Tenant Pool: {tenantDetail?.poolCount}대 ( {tenantDetail?.poolRangeText} )
                     </div>
                  )}
                </div>
                <div className="overflow-x-auto w-full">
                   <div className="md:hidden space-y-3 p-4 bg-gray-50/50">
                      {selectedTenant ? (
                        (tenantDetail?.subtenants.length || 0) === 0 ? (
                          <div className="py-12 text-center text-sm text-gray-400 italic">등록된 하위 프로젝트가 없습니다.</div>
                        ) : (
                          tenantDetail?.subtenants.map(sub => (
                            <div key={sub.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-black text-gray-900">{sub.name}</p>
                                {sub.count > 0 ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-100">{sub.count}대</span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 text-[10px] font-black tracking-tight uppercase">0 Node</span>
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">인스턴스 구간</p>
                                <p className="font-mono text-xs text-gray-600">{sub.rangeText || '-'}</p>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1">
                                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[100px]">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${sub.usageRatio}%` }} />
                                  </div>
                                  <span className="text-[10px] font-black text-gray-400 tabular-nums">{Math.round(sub.usageRatio)}%</span>
                                </div>
                                <div className="flex gap-1">
                                  {canManageSubtenant && (
                                    <button onClick={async () => { await fetchTenantPoolNodes(tenantDetail!.id); setSubtenantModalTarget(sub); }} className="px-3 py-1.5 rounded-lg text-[10px] font-black text-blue-600 bg-blue-50">분배</button>
                                  )}
                                  {canManageSubtenant && sub.count > 0 && (
                                    <button onClick={() => setSubtenantReclaimTarget(sub)} className="px-3 py-1.5 rounded-lg text-[10px] font-black text-red-600 bg-red-50">회수</button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )
                      ) : (
                        overviewRows.map((tenant, idx) => (
                          <div key={tenant.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4" onClick={() => setSelectedTenantIndex(idx + 1)}>
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-black text-gray-900">{tenant.name}</p>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${tenant.assignedCount >= tenant.contractCount ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{tenant.assignedCount >= tenant.contractCount ? 'Fulfilled' : 'Pending'}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">할당/계약</p>
                                <p className="text-xs font-bold text-gray-900">{tenant.assignedCount} / {tenant.contractCount}대</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">인스턴스 구간</p>
                                <p className="font-mono text-[10px] text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">{tenant.rangeText || '-'}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={(e) => { e.stopPropagation(); setSelectedTenantIndex(idx + 1); }} className="flex-1 py-2 bg-gray-50 rounded-lg text-[10px] font-black text-gray-600">DETAIL</button>
                              {isAdmin && (
                                <button onClick={async (e) => { e.stopPropagation(); await fetchGlobalAvailableNodes(); setSelectedTenantIndex(idx+1); setTenantModalTarget(tenant); }} className="flex-1 py-2 bg-blue-50 rounded-lg text-[10px] font-black text-blue-600">MANAGE</button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                   </div>
                   <table className="hidden md:table w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-left bg-gray-50/50">
                            {selectedTenant ? 'Subtenant 명' : 'Tenant 명'}
                          </th>
                          <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center bg-gray-50/50">
                            {selectedTenant ? '분계 (대)' : '계약/할당'}
                          </th>
                          <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-left bg-gray-50/50">인스턴스 구간</th>
                          {selectedTenant ? (
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-left bg-gray-50/50">비율</th>
                          ) : (
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-left bg-gray-50/50">상태</th>
                          )}
                          <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right bg-gray-50/50">관리</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedTenant ? (
                          (tenantDetail?.subtenants.length || 0) === 0 ? (
                            <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400 italic">등록된 하위 프로젝트가 없습니다.</td></tr>
                          ) : (
                            tenantDetail?.subtenants.map(sub => (
                              <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900 text-sm">{sub.name}</td>
                                <td className="px-6 text-center tabular-nums">
                                  {sub.count > 0 ? (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">{sub.count}대</span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 text-xs font-bold">0대</span>
                                  )}
                                </td>
                                <td className="px-6 font-mono text-[11px] text-gray-500">{sub.rangeText || '-'}</td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[100px]">
                                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${sub.usageRatio}%` }} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 tabular-nums">{Math.round(sub.usageRatio)}%</span>
                                  </div>
                                </td>
                                <td className="px-6 py-3 text-right">
                                  <div className="flex justify-end gap-2">
                                    {canManageSubtenant && (
                                      <button 
                                        onClick={async () => { await fetchTenantPoolNodes(tenantDetail!.id); setSubtenantModalTarget(sub); }} 
                                        className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all font-black"
                                      >
                                        분배
                                      </button>
                                    )}
                                    {canManageSubtenant && sub.count > 0 && (
                                      <button 
                                        onClick={() => setSubtenantReclaimTarget(sub)}
                                        className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all font-black"
                                      >
                                        회수
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )
                        ) : (
                          overviewRows.map((tenant, idx) => (
                            <tr key={tenant.id} className="hover:bg-gray-50/50 transition-colors">
                              <td 
                                onClick={() => setSelectedTenantIndex(idx + 1)}
                                className="px-6 py-4 font-bold text-gray-900 text-sm hover:text-blue-600 cursor-pointer"
                              >
                                {tenant.name}
                              </td>
                              <td className="px-6 text-center tabular-nums">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-gray-900">{tenant.assignedCount}대</span>
                                  <span className="text-[10px] text-gray-400">계약: {tenant.contractCount}대</span>
                                </div>
                              </td>
                              <td className="px-6 font-mono text-[11px] text-gray-500">{tenant.rangeText || '-'}</td>
                              <td className="px-6">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                                  tenant.assignedCount >= tenant.contractCount 
                                    ? 'bg-blue-50 text-blue-700 border-blue-100' 
                                    : 'bg-amber-50 text-amber-700 border-amber-100'
                                }`}>
                                  {tenant.assignedCount >= tenant.contractCount ? 'Fulfilled' : 'Pending'}
                                </span>
                              </td>
                              <td className="px-6 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => setSelectedTenantIndex(idx + 1)}
                                    className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider text-gray-600 hover:bg-gray-100 transition-all font-black"
                                  >
                                    Detail
                                  </button>
                                  {isAdmin && (
                                    <button 
                                      onClick={async () => { await fetchGlobalAvailableNodes(); setSelectedTenantIndex(idx + 1); setTenantModalTarget(tenant); }}
                                      className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all font-black"
                                    >
                                      Manage
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                   </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
