'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Cpu,
  Package,
  Server,
  Trash2,
  X,
} from 'lucide-react';
import CompanyListPanel from '@/components/CompanyListPanel';
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

  if (!isOpen) {
    return null;
  }

  const safeStartNodeId =
    nodeChoices.some((node) => node.id === startNodeId) ? startNodeId : (nodeChoices[0]?.id ?? '');
  const safeEndNodeId =
    nodeChoices.some((node) => node.id === endNodeId) ? endNodeId : (nodeChoices[0]?.id ?? '');
  const selectedNodeIds = getRangeNodeIds(nodeChoices, safeStartNodeId, safeEndNodeId);
  const disabled = saving || selectedNodeIds.length === 0;
  const buttonClassName =
    tone === 'emerald'
      ? 'bg-emerald-600 hover:bg-emerald-700'
      : 'bg-primary-600 hover:bg-primary-700';

  return (
    <div className="fixed inset-0 z-50 mx-4 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm">
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-[18px] border border-gray-200 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.22)]">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-[17px] font-bold text-gray-900">{title}</h2>
          <button
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">시작 노드</span>
              <select
                className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]"
                value={safeStartNodeId}
                onChange={(event) => setStartNodeId(event.target.value)}
              >
                {nodeChoices.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">종료 노드</span>
              <select
                className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]"
                value={safeEndNodeId}
                onChange={(event) => setEndNodeId(event.target.value)}
              >
                {nodeChoices.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-[14px] border border-gray-200 bg-[#FAFBFC] p-4">
            <div className="mb-2 text-[13px] font-bold text-gray-700">선택 결과</div>
            <div className="text-[14px] font-semibold text-gray-900">
              {selectedNodeIds.length > 0
                ? `${toNodeChipLabel(safeStartNodeId)} ~ ${toNodeChipLabel(safeEndNodeId)} / 총 ${selectedNodeIds.length}대`
                : '올바른 구간을 선택해 주세요.'}
            </div>
          </div>

          {error ? <p className="text-[13px] font-medium text-rose-600">{error}</p> : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            className="rounded-[10px] border border-gray-200 px-5 py-2.5 text-[14px] font-semibold text-gray-700"
            onClick={onClose}
            type="button"
          >
            취소
          </button>
          <button
            className={`rounded-[10px] px-5 py-2.5 text-[14px] font-semibold text-white disabled:bg-gray-400 ${buttonClassName}`}
            disabled={disabled}
            onClick={async () => {
              setError(null);

              try {
                await onSubmit({ startNodeId: safeStartNodeId, endNodeId: safeEndNodeId });
                setError(null);
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

  if (!isOpen) {
    return null;
  }

  const sortedAllocations = [...allocations].sort((left, right) => compareNodeIds(left.node_id, right.node_id));
  const safeStartNodeId =
    sortedAllocations.some((allocation) => allocation.node_id === startNodeId)
      ? startNodeId
      : (sortedAllocations[0]?.node_id ?? '');
  const safeEndNodeId =
    sortedAllocations.some((allocation) => allocation.node_id === endNodeId)
      ? endNodeId
      : (sortedAllocations[0]?.node_id ?? '');

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
    <div className="fixed inset-0 z-50 mx-4 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm">
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-[18px] border border-gray-200 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.22)]">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-[17px] font-bold text-gray-900">{title}</h2>
          <button
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">시작 노드</span>
              <select
                className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]"
                value={safeStartNodeId}
                onChange={(event) => setStartNodeId(event.target.value)}
              >
                {sortedAllocations.map((allocation) => (
                  <option key={allocation.id} value={allocation.node_id}>
                    {toNodeChipLabel(allocation.node_id)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">종료 노드</span>
              <select
                className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]"
                value={safeEndNodeId}
                onChange={(event) => setEndNodeId(event.target.value)}
              >
                {sortedAllocations.map((allocation) => (
                  <option key={allocation.id} value={allocation.node_id}>
                    {toNodeChipLabel(allocation.node_id)}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button
                className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[13px] font-semibold text-gray-700 hover:bg-gray-50"
                onClick={selectRange}
                type="button"
              >
                범위 추가
              </button>
            </div>
          </div>

          <div className="rounded-[14px] border border-gray-200 bg-[#FAFBFC] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[13px] font-bold text-gray-700">회수 대상 노드 목록</div>
              <div className="text-[12px] font-semibold text-gray-500">{selectedIds.length}대 선택됨</div>
            </div>
            <div className="grid max-h-[280px] gap-2 overflow-y-auto sm:grid-cols-2">
              {sortedAllocations.map((allocation) => (
                <label
                  key={allocation.id}
                  className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-gray-200 bg-white px-3 py-2"
                >
                  <input
                    checked={selectedIds.includes(allocation.id)}
                    className="h-4 w-4 rounded border-gray-300"
                    onChange={() => toggleAllocation(allocation.id)}
                    type="checkbox"
                  />
                  <span className="font-mono text-[13px] font-semibold text-gray-900">{toNodeChipLabel(allocation.node_id)}</span>
                </label>
              ))}
            </div>
          </div>

          {error ? <p className="text-[13px] font-medium text-rose-600">{error}</p> : null}
        </div>

        <div className="flex justify-between gap-3 border-t border-gray-200 px-6 py-4">
          <button
            className="rounded-[10px] border border-rose-200 px-5 py-2.5 text-[14px] font-semibold text-rose-600 hover:bg-rose-50"
            disabled={saving || allocations.length === 0}
            onClick={async () => {
              setError(null);

              try {
                await onSubmitAll();
              } catch (submitError) {
                setError(submitError instanceof Error ? submitError.message : '전체 회수에 실패했습니다.');
              }
            }}
            type="button"
          >
            전체 회수
          </button>
          <div className="flex gap-3">
            <button
              className="rounded-[10px] border border-gray-200 px-5 py-2.5 text-[14px] font-semibold text-gray-700"
              onClick={onClose}
              type="button"
            >
              취소
            </button>
            <button
              className="rounded-[10px] bg-rose-600 px-5 py-2.5 text-[14px] font-semibold text-white disabled:bg-gray-400"
              disabled={saving || selectedIds.length === 0}
              onClick={async () => {
                setError(null);

                try {
                  await onSubmitSelected(selectedIds);
                } catch (submitError) {
                  setError(submitError instanceof Error ? submitError.message : '선택 회수에 실패했습니다.');
                }
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
    () =>
      initialTenantRecords.map((tenant) => ({
        id: tenant.id,
        name: tenant.name,
        contractCount: parseContractGpuQuantity(tenant.contract),
      })),
    [initialTenantRecords],
  );
  const initialSubtenants = useMemo(
    () =>
      initialSubtenantRecords.map((subtenant) => ({
        id: subtenant.id,
        tenantId: subtenant.tenant_id ?? '',
        name: subtenant.name,
        status: subtenant.status ?? '대기',
        products: Array.isArray(subtenant.products)
          ? subtenant.products.filter((product): product is string => typeof product === 'string')
          : [],
      })),
    [initialSubtenantRecords],
  );
  const [selectedTenantIndex, setSelectedTenantIndex] = useState(0);
  const [tenants, setTenants] = useState<TenantView[]>(initialTenants);
  const [subtenants, setSubtenants] = useState<SubtenantView[]>(initialSubtenants);
  const [allocations, setAllocations] = useState<AllocationRecord[]>(initialAllocationRecords);
  const [loading, setLoading] = useState(
    initialTenants.length === 0 && initialSubtenants.length === 0 && initialAllocationRecords.length === 0,
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [tenantModalTarget, setTenantModalTarget] = useState<TenantView | null>(null);
  const [subtenantModalTarget, setSubtenantModalTarget] = useState<SubtenantView | null>(null);
  const [tenantReclaimTarget, setTenantReclaimTarget] = useState<TenantView | null>(null);
  const [subtenantReclaimTarget, setSubtenantReclaimTarget] = useState<SubtenantView | null>(null);
  const [tenantAvailableNodes, setTenantAvailableNodes] = useState<NodeChoice[]>([]);
  const [subtenantAvailableNodes, setSubtenantAvailableNodes] = useState<NodeChoice[]>([]);

  const isAdmin = currentUser?.role === 'admin';
  const canManageSubtenant = currentUser?.role === 'admin' || currentUser?.role === 'tenant_admin';

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [tenantsPayload, subtenantsPayload, allocationsPayload] = await Promise.all([
        readJson<{ data: TenantRecord[] }>(await fetch('/api/tenants', { cache: 'no-store' })),
        readJson<{ data: SubtenantRecord[] }>(await fetch('/api/subtenants', { cache: 'no-store' })),
        readJson<{ data: AllocationRecord[] }>(await fetch('/api/node-allocations', { cache: 'no-store' })),
      ]);

      setTenants(
        (tenantsPayload.data ?? []).map((tenant) => ({
          id: tenant.id,
          name: tenant.name,
          contractCount: parseContractGpuQuantity(tenant.contract),
        })),
      );

      setSubtenants(
        (subtenantsPayload.data ?? []).map((subtenant) => ({
          id: subtenant.id,
          tenantId: subtenant.tenant_id ?? '',
          name: subtenant.name,
          status: subtenant.status ?? '대기',
          products: Array.isArray(subtenant.products)
            ? subtenant.products.filter((product): product is string => typeof product === 'string')
            : [],
        })),
      );

      setAllocations(allocationsPayload.data ?? []);
      setSelectedTenantIndex((prev) => {
        const maxIndex = (tenantsPayload.data ?? []).length;
        return prev > maxIndex ? 0 : prev;
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '리소스 할당 정보를 불러오지 못했습니다.');
      setTenants([]);
      setSubtenants([]);
      setAllocations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTenants.length > 0 || initialSubtenants.length > 0 || initialAllocationRecords.length > 0) {
      return;
    }

    void loadData();
  }, [initialAllocationRecords.length, initialSubtenants.length, initialTenants.length]);

  const companies = useMemo(
    () => [
      { id: 'overview', name: '전체 (Overview)', subCount: subtenants.length },
      ...tenants.map((tenant) => ({
        id: tenant.id,
        name: tenant.name,
        subCount: subtenants.filter((subtenant) => subtenant.tenantId === tenant.id).length,
      })),
    ],
    [subtenants, tenants],
  );

  const totalNodes = 127;
  const selectedTenant = selectedTenantIndex === 0 ? null : tenants[selectedTenantIndex - 1] ?? null;
  const overviewRows = useMemo(
    () =>
      tenants.map((tenant) => {
        const tenantAllocations = allocations.filter((allocation) => allocation.tenant_id === tenant.id);
        return {
          ...tenant,
          assignedCount: tenantAllocations.length,
          rangeText: formatNodeRanges(tenantAllocations.map((allocation) => allocation.node_id)),
        };
      }),
    [allocations, tenants],
  );

  const tenantDetail = useMemo(() => {
    if (!selectedTenant) {
      return null;
    }

    const tenantAllocations = allocations.filter((allocation) => allocation.tenant_id === selectedTenant.id);
    const tenantPoolAllocations = tenantAllocations.filter((allocation) => !allocation.subtenant_id);
    const distributedAllocations = tenantAllocations.filter((allocation) => Boolean(allocation.subtenant_id));
    const tenantSubtenants = subtenants.filter((subtenant) => subtenant.tenantId === selectedTenant.id);

    return {
      ...selectedTenant,
      allocations: tenantAllocations,
      tenantPoolAllocations,
      distributedCount: distributedAllocations.length,
      poolCount: tenantPoolAllocations.length,
      tenantRangeText: formatNodeRanges(tenantAllocations.map((allocation) => allocation.node_id)),
      poolRangeText: formatNodeRanges(tenantPoolAllocations.map((allocation) => allocation.node_id)),
      subtenants: tenantSubtenants.map((subtenant) => {
        const subtenantAllocations = tenantAllocations.filter((allocation) => allocation.subtenant_id === subtenant.id);
        const usageRatio = tenantAllocations.length > 0 ? (subtenantAllocations.length / tenantAllocations.length) * 100 : 0;

        return {
          ...subtenant,
          allocationIds: subtenantAllocations.map((allocation) => allocation.id),
          count: subtenantAllocations.length,
          rangeText: formatNodeRanges(subtenantAllocations.map((allocation) => allocation.node_id)),
          usageRatio,
        };
      }),
    };
  }, [allocations, selectedTenant, subtenants]);

  const totalAllocated = allocations.length;

  const fetchGlobalAvailableNodes = async () => {
    const payload = await readJson<{ data: AvailableNode[] }>(
      await fetch('/api/node-allocations/available', { cache: 'no-store' }),
    );

    setTenantAvailableNodes(
      (payload.data ?? [])
        .map((node) => ({
          id: node.id,
          label: toNodeChipLabel(node.id),
        }))
        .sort((left, right) => compareNodeIds(left.id, right.id)),
    );
  };

  const fetchTenantPoolNodes = async (tenantId: string) => {
    const payload = await readJson<{ data: AllocationRecord[] }>(
      await fetch(`/api/node-allocations/available?tenantId=${tenantId}`, { cache: 'no-store' }),
    );

    setSubtenantAvailableNodes(
      (payload.data ?? [])
        .map((allocation) => ({
          id: allocation.node_id,
          label: toNodeChipLabel(allocation.node_id),
        }))
        .sort((left, right) => compareNodeIds(left.id, right.id)),
    );
  };

  const allocateNodes = async (nodeIds: string[], tenantId: string, subtenantId?: string) => {
    for (const nodeId of nodeIds) {
      const response = await fetch('/api/node-allocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeId,
          tenantId,
          subtenantId: subtenantId ?? null,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? '노드 할당에 실패했습니다.');
      }
    }
  };

  const reclaimAllocation = async (allocationId: number) => {
    const response = await fetch(`/api/node-allocations/${allocationId}`, {
      method: 'DELETE',
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      throw new Error(payload.error ?? '노드 회수에 실패했습니다.');
    }
  };

  const reclaimManyAllocations = async (allocationIds: number[]) => {
    for (const allocationId of allocationIds) {
      await reclaimAllocation(allocationId);
    }
  };

  const reclaimTenantAllocation = async (allocationId: number) => {
    const response = await fetch(`/api/node-allocations/${allocationId}?scope=tenant`, {
      method: 'DELETE',
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      throw new Error(payload.error ?? 'Tenant 노드 회수에 실패했습니다.');
    }
  };

  const reclaimManyTenantAllocations = async (allocationIds: number[]) => {
    for (const allocationId of allocationIds) {
      await reclaimTenantAllocation(allocationId);
    }
  };

  const content = loading ? (
    <div className="flex h-full items-center justify-center text-[14px] font-medium text-gray-400">
      리소스 할당 정보를 불러오는 중입니다.
    </div>
  ) : error ? (
    <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">{error}</div>
  ) : (
    <>
      <div className="flex-none shrink-0">
        {selectedTenant ? (
          <div className="flex flex-col gap-5 lg:gap-6">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <h1 className="flex items-center gap-2 text-[18px] font-extrabold">
                <Building2 className="h-5 w-5 text-primary-500" />
                {selectedTenant.name} 상세 현황
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[12px] font-extrabold text-gray-600 shadow-sm">
                  <Cpu size={14} />
                  전체 할당 인스턴스:
                  <span className="font-mono text-[14px] text-gray-900">총 {tenantDetail?.allocations.length ?? 0}대</span>
                </div>
                {isAdmin ? (
                  <button
                    className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-primary-700"
                    onClick={async () => {
                      setSaving(false);
                      await fetchGlobalAvailableNodes();
                      setTenantModalTarget(selectedTenant);
                    }}
                    type="button"
                  >
                    <Server size={14} />
                    Tenant 노드 할당
                  </button>
                ) : null}
                {isAdmin && (tenantDetail?.allocations.length ?? 0) > 0 ? (
                  <button
                    className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-4 py-2 text-[13px] font-bold text-rose-600 transition-colors hover:bg-rose-50"
                    onClick={() => {
                      setTenantReclaimTarget(selectedTenant);
                    }}
                    type="button"
                  >
                    <Trash2 size={14} />
                    Tenant 노드 회수
                  </button>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
              <div className="rounded-[10px] border border-gray-200 bg-white p-5 text-left shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] lg:rounded-[12px] lg:p-6 lg:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.18)]">
                <div className="mb-2 text-sm font-bold text-gray-500">계약 수량</div>
                <div className="mt-1 font-mono text-[26px] font-extrabold tracking-tight text-gray-900">{selectedTenant.contractCount}대</div>
                <div className="mt-2 text-[12px] font-semibold text-gray-400">데이터센터 → Tenant 배정 목표치</div>
              </div>
              <div className="rounded-[10px] border border-gray-200 bg-white p-5 text-left shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] lg:rounded-[12px] lg:p-6 lg:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.18)]">
                <div className="mb-2 text-sm font-bold text-gray-500">Subtenant 분배 완료</div>
                <div className="mt-1 font-mono text-[26px] font-extrabold tracking-tight text-emerald-600">{tenantDetail?.distributedCount ?? 0}대</div>
                <div className="mt-2 text-[12px] font-semibold text-gray-400">산하 프로젝트에 지급 완료된 서버</div>
              </div>
              <div className="rounded-[10px] border border-gray-200 bg-gradient-to-br from-white to-amber-50/20 p-5 text-left shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] lg:rounded-[12px] lg:p-6 lg:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.18)]">
                <div className="mb-2 text-sm font-bold text-amber-700">미분배 (Tenant Pool)</div>
                <div className="mt-1 font-mono text-[26px] font-extrabold tracking-tight text-amber-500">{tenantDetail?.poolCount ?? 0}대</div>
                <div className="mt-2 text-[12px] font-semibold text-amber-600/60">추가로 분배 가능한 잔여 유휴 자원</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5 lg:gap-6">
            <h1 className="flex items-center gap-2 text-[18px] font-extrabold">
              <Building2 className="h-5 w-5 text-primary-500" />
              리소스 할당 현황
            </h1>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
              <div className="rounded-[10px] border border-gray-200 bg-white p-5 text-left shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] lg:rounded-[12px] lg:p-6 lg:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.18)]">
                <div className="mb-2 text-sm font-bold text-gray-500">데이터센터 전체 노드</div>
                <div className="mt-1 font-mono text-[26px] font-extrabold tracking-tight text-gray-900">{totalNodes}대</div>
                <div className="mt-2 text-[12px] font-semibold text-gray-400">Total Infrastructure Capacity</div>
              </div>
              <div className="rounded-[10px] border border-gray-200 bg-white p-5 text-left shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] lg:rounded-[12px] lg:p-6 lg:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.18)]">
                <div className="mb-2 text-sm font-bold text-gray-500">Tenant 할당 완료</div>
                <div className="mt-1 font-mono text-[26px] font-extrabold tracking-tight text-primary-600">{totalAllocated}대</div>
                <div className="mt-2 text-[12px] font-semibold text-gray-400">Tenant에 지급 완료된 노드 누계</div>
              </div>
              <div className="rounded-[10px] border border-gray-200 bg-white p-5 text-left shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] lg:rounded-[12px] lg:p-6 lg:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.18)]">
                <div className="mb-2 text-sm font-bold text-gray-500">미할당 공용 풀</div>
                <div className="mt-1 font-mono text-[26px] font-extrabold tracking-tight text-amber-500">{totalNodes - totalAllocated}대</div>
                <div className="mt-2 text-[12px] font-semibold text-gray-400">추가 할당이 가능한 유휴 자원</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] lg:rounded-[12px] lg:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/50 p-5">
          <h3 className="flex items-center gap-1.5 text-[14px] font-extrabold text-gray-900">
            {selectedTenant ? <Package className="text-emerald-500" size={16} /> : <Server className="text-gray-600" size={16} />}
            {selectedTenant ? 'Subtenant(프로젝트) 하위 분배 테이블' : '전체 Tenant 배정 테이블'}
          </h3>
        </div>

        <div className="h-full overflow-x-auto overflow-y-auto">
          {selectedTenant ? (
            <table className="w-full min-w-[1080px] text-left">
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-gray-200 bg-[#FAFAFA]">
                  <th className="min-w-[120px] px-6 py-[12px] text-[12px] font-extrabold text-gray-500 whitespace-nowrap">Subtenant 명</th>
                  <th className="min-w-[80px] px-6 py-[12px] text-[12px] font-extrabold text-gray-500 text-center whitespace-nowrap">분배 수량 (대)</th>
                  <th className="min-w-[160px] px-6 py-[12px] text-[12px] font-extrabold text-gray-500 whitespace-nowrap">인스턴스 구간 내역</th>
                  <th className="min-w-[120px] px-6 py-[12px] text-[12px] font-extrabold text-gray-500 whitespace-nowrap">비율 (Tenant 대비)</th>
                  <th className="min-w-[120px] px-6 py-[12px] text-[12px] font-extrabold text-gray-500 text-right whitespace-nowrap">분배 관리</th>
                </tr>
              </thead>
              <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
                {(tenantDetail?.subtenants.length ?? 0) === 0 ? (
                  <tr className="md:table-row">
                    <td className="border-b-0 py-12 text-center text-[13px] font-medium text-gray-400 md:table-cell" colSpan={5}>
                      등록된 Subtenant(프로젝트)가 없습니다.
                    </td>
                  </tr>
                ) : (
                  tenantDetail?.subtenants.map((subtenant) => (
                    <tr
                      key={subtenant.id}
                      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:bg-gray-50/50 md:table-row md:rounded-none md:border-0 md:border-b md:border-gray-100 md:p-0 md:shadow-none"
                    >
                      <td className="mb-3 border-b border-gray-50 px-0 py-1 pb-2 text-[15px] font-bold text-gray-800 md:mb-0 md:border-0 md:px-6 md:py-[14px] md:pb-[14px] md:text-[13px]">
                        <span className="mb-0.5 block text-[10px] font-normal text-gray-400 md:hidden">Subtenant 명</span>
                        {subtenant.name}
                      </td>
                      <td className="px-0 py-1 text-left font-mono text-[13px] md:px-6 md:text-center">
                        <span className="mb-0.5 block text-[10px] font-normal text-gray-500 md:hidden">분배 수량 (대)</span>
                        {subtenant.count > 0 ? (
                          <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 md:inline-block">
                            {subtenant.count}대
                          </span>
                        ) : (
                          <span className="rounded border border-gray-200 bg-gray-100 px-2 py-0.5 font-bold text-gray-400 md:inline-block">미분배</span>
                        )}
                      </td>
                      <td className="px-0 py-1 font-mono text-[12px] font-medium text-gray-500 md:px-6">
                        <span className="mb-0.5 block text-[10px] font-normal text-gray-500 md:hidden">인스턴스 구간 내역</span>
                        {subtenant.rangeText}
                      </td>
                      <td className="px-0 py-1 md:px-6">
                        <span className="mb-0.5 block text-[10px] font-normal text-gray-500 md:hidden">비율 (Tenant 대비)</span>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-emerald-400" style={{ width: `${subtenant.usageRatio}%` }} />
                          </div>
                          <span className="w-8 font-mono text-[11px] font-bold text-gray-500">{Math.round(subtenant.usageRatio)}%</span>
                        </div>
                      </td>
                      <td className="mt-2 px-0 py-2 text-right md:mt-0 md:px-6">
                        <div className="flex justify-end gap-2">
                          {canManageSubtenant ? (
                            <button
                              className="rounded border border-gray-200 bg-white px-3 py-2 text-[12px] font-bold text-gray-600 shadow-sm outline-none hover:text-gray-900 whitespace-nowrap md:py-1.5"
                              onClick={async () => {
                                if (!tenantDetail) {
                                  return;
                                }

                                await fetchTenantPoolNodes(tenantDetail.id);
                                setSubtenantModalTarget(subtenant);
                              }}
                              type="button"
                            >
                              분배
                            </button>
                          ) : null}
                          {canManageSubtenant && subtenant.allocationIds.length > 0 ? (
                            <button
                              className="rounded border border-rose-200 bg-white px-3 py-2 text-[12px] font-bold text-rose-600 shadow-sm outline-none hover:bg-rose-50 whitespace-nowrap md:py-1.5"
                              onClick={() => {
                                setSubtenantReclaimTarget(subtenant);
                              }}
                              type="button"
                            >
                              회수
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[1080px] text-left">
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-gray-200 bg-[#FAFAFA]">
                  <th className="min-w-[120px] px-6 py-[12px] text-[12px] font-extrabold text-gray-500 whitespace-nowrap">Tenant 명</th>
                  <th className="min-w-[80px] px-6 py-[12px] text-[12px] font-extrabold text-gray-500 text-center whitespace-nowrap">계약 대수</th>
                  <th className="min-w-[80px] px-6 py-[12px] text-[12px] font-extrabold text-gray-500 text-center whitespace-nowrap">현재 할당 대수</th>
                  <th className="min-w-[160px] px-6 py-[12px] text-[12px] font-extrabold text-gray-500 whitespace-nowrap">인스턴스 구간 내역</th>
                  <th className="min-w-[120px] px-6 py-[12px] text-[12px] font-extrabold text-gray-500 text-right whitespace-nowrap">관리 액션</th>
                </tr>
              </thead>
              <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
                {overviewRows.map((tenant, index) => (
                  <tr
                    key={tenant.id}
                    className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:bg-gray-50/50 md:table-row md:rounded-none md:border-0 md:border-b md:border-gray-100 md:p-0 md:shadow-none"
                  >
                    <td
                      className="mb-3 cursor-pointer border-b border-gray-50 px-0 py-1 pb-2 text-[15px] font-bold text-primary-600 hover:underline md:mb-0 md:border-0 md:px-6 md:py-[14px] md:pb-[14px] md:text-[14px] md:text-gray-900"
                      onClick={() => setSelectedTenantIndex(index + 1)}
                    >
                      <span className="mb-0.5 block text-[10px] font-normal text-gray-400 md:hidden">Tenant 명</span>
                      {tenant.name}
                    </td>
                    <td className="px-0 py-1 font-mono text-[13px] font-bold text-gray-600 md:px-6 md:text-center">
                      <span className="mb-0.5 block text-[10px] font-normal text-gray-500 md:hidden">계약 대수</span>
                      {tenant.contractCount}대
                    </td>
                    <td className="px-0 py-1 font-mono text-[13px] md:px-6 md:text-center">
                      <span className="mb-0.5 block text-[10px] font-normal text-gray-500 md:hidden">현재 할당 대수</span>
                      {tenant.assignedCount > 0 ? (
                        <span className="rounded border border-primary-200 bg-primary-50 px-2 py-0.5 font-bold text-primary-700 md:inline-block">
                          {tenant.assignedCount}대
                        </span>
                      ) : (
                        <span className="rounded border border-gray-200 bg-gray-100 px-2 py-0.5 font-bold text-gray-400 md:inline-block">0대</span>
                      )}
                    </td>
                    <td className="px-0 py-1 font-mono text-[12px] font-medium text-gray-500 md:px-6">
                      <span className="mb-0.5 block text-[10px] font-normal text-gray-500 md:hidden">인스턴스 구간 내역</span>
                      {tenant.rangeText}
                    </td>
                    <td className="mt-2 px-0 py-2 text-right md:mt-0 md:px-6">
                      <div className="flex justify-end gap-2">
                        <button
                          className="rounded border border-gray-200 bg-white px-3 py-2 text-[12px] font-bold text-gray-600 shadow-sm outline-none hover:text-gray-900 whitespace-nowrap md:py-1.5"
                          onClick={() => setSelectedTenantIndex(index + 1)}
                          type="button"
                        >
                          상세 보기
                        </button>
                        {isAdmin ? (
                          <button
                            className="rounded border border-gray-200 bg-white px-3 py-2 text-[12px] font-bold text-gray-600 shadow-sm outline-none hover:text-gray-900 whitespace-nowrap md:py-1.5"
                            onClick={async () => {
                              await fetchGlobalAvailableNodes();
                              setSelectedTenantIndex(index + 1);
                              setTenantModalTarget(tenant);
                            }}
                            type="button"
                          >
                            할당 관리
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-auto min-h-0 flex-col gap-6 pb-2 text-gray-900 md:flex-row md:h-[calc(100vh-112px)]">
      <CompanyListPanel companies={companies} activeIndex={selectedTenantIndex} onCompanyClick={setSelectedTenantIndex} />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {content}
      </div>

      <RangeModal
        confirmLabel="Tenant 노드 할당"
        isOpen={Boolean(tenantModalTarget)}
        nodeChoices={tenantAvailableNodes}
        onClose={() => setTenantModalTarget(null)}
        onSubmit={async ({ startNodeId, endNodeId }) => {
          if (!tenantModalTarget) {
            throw new Error('Tenant가 선택되지 않았습니다.');
          }

          const nodeIds = getRangeNodeIds(tenantAvailableNodes, startNodeId, endNodeId);

          setSaving(true);
          try {
            await allocateNodes(nodeIds, tenantModalTarget.id);
            setTenantModalTarget(null);
            await loadData();
          } finally {
            setSaving(false);
          }
        }}
        saving={saving}
        title={tenantModalTarget ? `${tenantModalTarget.name} Tenant 노드 할당` : 'Tenant 노드 할당'}
      />

      <RangeModal
        confirmLabel="Subtenant 노드 분배"
        isOpen={Boolean(subtenantModalTarget)}
        nodeChoices={subtenantAvailableNodes}
        onClose={() => setSubtenantModalTarget(null)}
        onSubmit={async ({ startNodeId, endNodeId }) => {
          if (!selectedTenant || !subtenantModalTarget) {
            throw new Error('Subtenant가 선택되지 않았습니다.');
          }

          const nodeIds = getRangeNodeIds(subtenantAvailableNodes, startNodeId, endNodeId);

          setSaving(true);
          try {
            await allocateNodes(nodeIds, selectedTenant.id, subtenantModalTarget.id);
            setSubtenantModalTarget(null);
            await loadData();
          } finally {
            setSaving(false);
          }
        }}
        saving={saving}
        title={subtenantModalTarget ? `${subtenantModalTarget.name} 노드 분배` : 'Subtenant 노드 분배'}
        tone="emerald"
      />

      {tenantReclaimTarget ? (
      <ReclaimModal
        key={`tenant-${tenantReclaimTarget.id}`}
        allocations={
          allocations.filter((allocation) => allocation.tenant_id === tenantReclaimTarget.id)
        }
        isOpen
        onClose={() => setTenantReclaimTarget(null)}
        onSubmitAll={async () => {
          if (!tenantReclaimTarget) {
            throw new Error('Tenant가 선택되지 않았습니다.');
          }

          const targetAllocations = allocations.filter((allocation) => allocation.tenant_id === tenantReclaimTarget.id);

          if (!window.confirm(`${tenantReclaimTarget.name}의 모든 노드를 회수하시겠습니까?`)) {
            return;
          }

          setSaving(true);
          try {
            await reclaimManyTenantAllocations(targetAllocations.map((allocation) => allocation.id));
            setTenantReclaimTarget(null);
            await loadData();
          } finally {
            setSaving(false);
          }
        }}
        onSubmitSelected={async (allocationIds) => {
          setSaving(true);
          try {
            await reclaimManyTenantAllocations(allocationIds);
            setTenantReclaimTarget(null);
            await loadData();
          } finally {
            setSaving(false);
          }
        }}
        saving={saving}
        title={tenantReclaimTarget ? `${tenantReclaimTarget.name} Tenant 노드 회수` : 'Tenant 노드 회수'}
      />
      ) : null}

      {subtenantReclaimTarget ? (
      <ReclaimModal
        key={`subtenant-${subtenantReclaimTarget.id}`}
        allocations={
          allocations.filter((allocation) => allocation.subtenant_id === subtenantReclaimTarget.id)
        }
        isOpen
        onClose={() => setSubtenantReclaimTarget(null)}
        onSubmitAll={async () => {
          if (!subtenantReclaimTarget) {
            throw new Error('Subtenant가 선택되지 않았습니다.');
          }

          const targetAllocations = allocations.filter((allocation) => allocation.subtenant_id === subtenantReclaimTarget.id);

          if (!window.confirm(`${subtenantReclaimTarget.name}의 모든 노드를 회수하시겠습니까?`)) {
            return;
          }

          setSaving(true);
          try {
            await reclaimManyAllocations(targetAllocations.map((allocation) => allocation.id));
            setSubtenantReclaimTarget(null);
            await loadData();
          } finally {
            setSaving(false);
          }
        }}
        onSubmitSelected={async (allocationIds) => {
          setSaving(true);
          try {
            await reclaimManyAllocations(allocationIds);
            setSubtenantReclaimTarget(null);
            await loadData();
          } finally {
            setSaving(false);
          }
        }}
        saving={saving}
        title={subtenantReclaimTarget ? `${subtenantReclaimTarget.name} 노드 회수` : 'Subtenant 노드 회수'}
      />
      ) : null}
    </div>
  );
}
