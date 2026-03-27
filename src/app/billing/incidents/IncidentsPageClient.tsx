'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Plus, RotateCcw, Server, Settings, Trash2, X } from 'lucide-react';
import CompanyListPanel from '@/components/CompanyListPanel';
import { calculateCreditAmount, calculateDurationMinutes } from '@/lib/creditMath';
import { useAuth } from '@/contexts/AuthContext';

type Tenant = {
  id: string;
  name: string;
};

type Subtenant = {
  id: string;
  tenant_id: string | null;
  name: string;
};

type AllocationNode = {
  id: string;
  label: string;
};

type Allocation = {
  id: number;
  tenant_id: string | null;
  subtenant_id: string | null;
  node_id: string;
  node?: AllocationNode | null;
};

type IncidentCustomer = {
  id: number;
  tenantId: string | null;
  subtenantId: string | null;
  gpuCount: number;
  creditAmount: number;
};

type IncidentRecord = {
  id: number;
  type: string | null;
  occurredAt: string | null;
  recoveredAt: string | null;
  durationMinutes: number;
  nodeType: string | null;
  nodeId: string | null;
  instanceName: string | null;
  registeredBy: string | null;
  memo: string | null;
  recoveryNote: string | null;
  createdAt: string | null;
  customers: IncidentCustomer[];
  totalCreditAmount: number;
};

type CreditItem = {
  id: number;
  amount: number;
  createdAt: string | null;
};

type FormState = {
  type: 'incident' | 'urgent_pm' | 'regular_pm';
  occurredAt: string;
  recoveredAt: string;
  nodeType: string;
  nodeId: string;
  memo: string;
  recoveryNote: string;
};

function formatDate(value: string | null) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(minutes: number) {
  if (!minutes) {
    return '0분';
  }

  const hours = Math.floor(minutes / 60);
  const remains = minutes % 60;

  if (hours === 0) {
    return `${remains}분`;
  }

  if (remains === 0) {
    return `${hours}시간`;
  }

  return `${hours}시간 ${remains}분`;
}

function getTypeLabel(type: string | null) {
  if (type === 'urgent_pm') {
    return '긴급 PM';
  }

  if (type === 'regular_pm') {
    return '정기 PM';
  }

  return '장애';
}

function getTypeBadgeClass(type: string | null) {
  if (type === 'urgent_pm') {
    return 'bg-amber-50 text-amber-600 border border-amber-200';
  }

  if (type === 'regular_pm') {
    return 'bg-primary-50 text-primary-600 border border-primary-200';
  }

  return 'bg-rose-50 text-rose-600 border border-rose-200';
}

function IncidentModal({
  isOpen,
  form,
  allocations,
  tenantId,
  subtenantNameById,
  saving,
  onClose,
  onChange,
  onSubmit,
}: {
  isOpen: boolean;
  form: FormState;
  allocations: Allocation[];
  tenantId: string;
  subtenantNameById: Record<string, string>;
  saving: boolean;
  onClose: () => void;
  onChange: (next: Partial<FormState>) => void;
  onSubmit: () => Promise<void>;
}) {
  if (!isOpen) {
    return null;
  }

  const selectedAllocation = allocations.find((allocation) => allocation.node_id === form.nodeId) ?? null;
  const mappedCustomer =
    selectedAllocation?.subtenant_id
      ? {
          tenantId,
          subtenantId: selectedAllocation.subtenant_id,
          gpuCount: 1,
          subtenantName: subtenantNameById[selectedAllocation.subtenant_id] ?? selectedAllocation.subtenant_id,
        }
      : null;

  let durationMinutes = 0;
  let durationText = '자동 계산';
  let expectedCredit = 0;
  let hasDurationError = false;

  if (form.occurredAt && form.recoveredAt) {
    try {
      durationMinutes = calculateDurationMinutes(form.occurredAt, form.recoveredAt);
      durationText = formatDuration(durationMinutes);
      expectedCredit = mappedCustomer
        ? calculateCreditAmount(form.type, durationMinutes, mappedCustomer.gpuCount)
        : 0;
    } catch {
      hasDurationError = true;
      durationText = '시간 범위를 확인해 주세요';
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[16px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-6">
          <h2 className="flex items-center gap-2 text-[18px] font-extrabold text-gray-900 sm:text-[20px]">
            <AlertTriangle size={20} className="text-red-500" />
            장애/PM 등록
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-7 lg:p-7">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-gray-700">구분</label>
              <select
                value={form.type}
                onChange={(event) => onChange({ type: event.target.value as FormState['type'] })}
                className="w-full rounded-[10px] border border-gray-200 p-3 text-[13px] font-medium text-gray-900 focus:border-primary-500 focus:outline-none"
              >
                <option value="incident">장애</option>
                <option value="urgent_pm">긴급 PM</option>
                <option value="regular_pm">정기 PM</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-gray-700">노드 유형</label>
              <select
                value={form.nodeType}
                onChange={(event) => onChange({ nodeType: event.target.value })}
                className="w-full rounded-[10px] border border-gray-200 p-3 text-[13px] font-medium text-gray-900 focus:border-primary-500 focus:outline-none"
              >
                <option value="GPU">GPU</option>
                <option value="CPU">CPU</option>
                <option value="Storage">Storage</option>
                <option value="NW">NW</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-gray-700">발생 시간</label>
              <input
                type="datetime-local"
                value={form.occurredAt}
                onChange={(event) => onChange({ occurredAt: event.target.value })}
                className="w-full rounded-[10px] border border-gray-200 p-3 text-[13px] font-medium text-gray-900 focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-gray-700">복구 시간</label>
              <input
                type="datetime-local"
                value={form.recoveredAt}
                onChange={(event) => onChange({ recoveredAt: event.target.value })}
                className="w-full rounded-[10px] border border-gray-200 p-3 text-[13px] font-medium text-gray-900 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-gray-700">인스턴스 선택</label>
              <select
                value={form.nodeId}
                onChange={(event) => onChange({ nodeId: event.target.value })}
                className="w-full rounded-[10px] border border-gray-200 p-3 text-[13px] font-medium text-gray-900 focus:border-primary-500 focus:outline-none"
              >
                <option value="">인스턴스 선택</option>
                {allocations.map((allocation) => (
                  <option key={allocation.id} value={allocation.node_id}>
                    {allocation.node?.label ?? allocation.node_id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-gray-700">소요 시간</label>
              <div
                className={`rounded-[10px] border p-3 text-[13px] font-bold ${
                  hasDurationError ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              >
                {durationText}
              </div>
            </div>
          </div>

          <div className="rounded-[12px] border border-gray-200 bg-gray-50 p-4 lg:p-5">
            <div className="mb-2 text-[13px] font-bold text-gray-700">고객사 자동 매핑</div>
            {mappedCustomer ? (
              <div className="flex items-center justify-between gap-3 rounded-[10px] border border-primary-100 bg-white px-4 py-3">
                <div>
                  <div className="text-[13px] font-bold text-primary-700">{mappedCustomer.subtenantName}</div>
                  <div className="text-[12px] text-gray-500">GPU {mappedCustomer.gpuCount}대 자동 매핑</div>
                </div>
                <div className="text-[12px] font-mono text-gray-400">{selectedAllocation?.node_id}</div>
              </div>
            ) : (
              <div className="rounded-[10px] border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-[13px] text-gray-400">
                선택한 노드의 고객사 매핑 정보가 없습니다.
              </div>
            )}
          </div>

          <div className="rounded-[12px] border border-emerald-100 bg-emerald-50 p-4 lg:p-5">
            <div className="mb-1 text-[13px] font-bold text-emerald-800">크레딧 산출액 (예상)</div>
            <div className="font-mono text-[24px] font-extrabold text-emerald-600 sm:text-[28px]">+₩ {expectedCredit.toLocaleString()}</div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-gray-700">메모</label>
              <textarea
                value={form.memo}
                onChange={(event) => onChange({ memo: event.target.value })}
                className="h-[90px] w-full resize-none rounded-[10px] border border-gray-200 p-3 text-[13px] text-gray-900 focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-gray-700">복구 메모</label>
              <textarea
                value={form.recoveryNote}
                onChange={(event) => onChange({ recoveryNote: event.target.value })}
                className="h-[90px] w-full resize-none rounded-[10px] border border-gray-200 p-3 text-[13px] text-gray-900 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 p-4 sm:flex-row sm:p-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-[10px] border border-gray-200 px-5 py-3 text-[14px] font-bold text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={() => void onSubmit()}
            disabled={!mappedCustomer || !form.occurredAt || !form.recoveredAt || !form.nodeId || saving || hasDurationError}
            className="flex-1 rounded-[10px] bg-red-500 px-5 py-3 text-[14px] font-extrabold text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {saving ? '등록 중...' : '등록 완료'}
          </button>
        </div>
      </div>
    </div>
  );
}

type IncidentsPageClientProps = {
  initialTenants?: Tenant[];
  initialSubtenants?: Subtenant[];
  initialIncidents?: IncidentRecord[];
  initialCredits?: CreditItem[];
  initialAllocations?: Allocation[];
  initialTenantId?: string | null;
};

export default function IncidentsPageClient({
  initialTenants = [],
  initialSubtenants = [],
  initialIncidents = [],
  initialCredits = [],
  initialAllocations = [],
  initialTenantId = null,
}: IncidentsPageClientProps) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [activeTenantIdx, setActiveTenantIdx] = useState(
    Math.max(0, initialTenants.findIndex((tenant) => tenant.id === initialTenantId)),
  );
  const [subtenants, setSubtenants] = useState<Subtenant[]>(initialSubtenants);
  const [incidents, setIncidents] = useState<IncidentRecord[]>(initialIncidents);
  const [credits, setCredits] = useState<CreditItem[]>(initialCredits);
  const [allocations, setAllocations] = useState<Allocation[]>(initialAllocations);
  const [loading, setLoading] = useState(initialTenants.length === 0 && initialIncidents.length === 0);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    type: 'incident',
    occurredAt: '',
    recoveredAt: '',
    nodeType: 'GPU',
    nodeId: '',
    memo: '',
    recoveryNote: '',
  });

  const activeTenant = tenants[activeTenantIdx] ?? null;

  const loadTenants = useCallback(async () => {
    const response = await fetch('/api/tenants');
    const payload = (await response.json()) as { data?: Tenant[]; error?: string };

    if (!response.ok) {
      throw new Error(payload.error ?? '회사 목록을 불러오지 못했습니다.');
    }

    const items = payload.data ?? [];
    setTenants(items);
  }, []);

  const loadTenantData = useCallback(async (tenantId: string) => {
    const [subtenantsResponse, incidentsResponse, creditsResponse, allocationsResponse] = await Promise.all([
      fetch(`/api/subtenants?tenantId=${tenantId}`),
      fetch(`/api/incidents?tenantId=${tenantId}`),
      fetch(`/api/credits?tenantId=${tenantId}`),
      fetch(`/api/node-allocations?tenantId=${tenantId}`),
    ]);

    const [subtenantsPayload, incidentsPayload, creditsPayload, allocationsPayload] = await Promise.all([
      subtenantsResponse.json() as Promise<{ data?: Subtenant[]; error?: string }>,
      incidentsResponse.json() as Promise<{ data?: IncidentRecord[]; error?: string }>,
      creditsResponse.json() as Promise<{ data?: { items?: CreditItem[] }; error?: string }>,
      allocationsResponse.json() as Promise<{ data?: Allocation[]; error?: string }>,
    ]);

    if (!subtenantsResponse.ok) {
      throw new Error(subtenantsPayload.error ?? '프로젝트 목록을 불러오지 못했습니다.');
    }

    if (!incidentsResponse.ok) {
      throw new Error(incidentsPayload.error ?? '장애 목록을 불러오지 못했습니다.');
    }

    if (!creditsResponse.ok) {
      throw new Error(creditsPayload.error ?? '크레딧 내역을 불러오지 못했습니다.');
    }

    if (!allocationsResponse.ok) {
      throw new Error(allocationsPayload.error ?? '노드 목록을 불러오지 못했습니다.');
    }

    setSubtenants(subtenantsPayload.data ?? []);
    setIncidents(incidentsPayload.data ?? []);
    setCredits(creditsPayload.data?.items ?? []);
    setAllocations((allocationsPayload.data ?? []).filter((allocation) => Boolean(allocation.subtenant_id)));
  }, []);

  useEffect(() => {
    if (initialTenants.length > 0) {
      return;
    }

    const bootstrap = async () => {
      setLoading(true);

      try {
        await loadTenants();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '회사 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    void bootstrap()
      .catch((error: unknown) => {
        setErrorMessage(error instanceof Error ? error.message : '회사 목록을 불러오지 못했습니다.');
      });
  }, [initialTenants.length, loadTenants]);

  useEffect(() => {
    if (!activeTenant?.id) {
      return;
    }

    if (activeTenant.id === initialTenantId && (initialIncidents.length > 0 || initialSubtenants.length > 0 || initialAllocations.length > 0)) {
      return;
    }

    const bootstrap = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        await loadTenantData(activeTenant.id);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '데이터를 불러오지 못했습니다.');
        setIncidents([]);
        setCredits([]);
        setAllocations([]);
        setSubtenants([]);
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, [
    activeTenant?.id,
    initialAllocations.length,
    initialIncidents.length,
    initialSubtenants.length,
    initialTenantId,
    loadTenantData,
  ]);

  const subtenantNameById = useMemo(
    () =>
      subtenants.reduce<Record<string, string>>((acc, subtenant) => {
        acc[subtenant.id] = subtenant.name;
        return acc;
      }, {}),
    [subtenants],
  );

  const summary = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);

    return {
      totalCount: incidents.length,
      incidentCount: incidents.filter((incident) => incident.type === 'incident').length,
      pmCount: incidents.filter((incident) => incident.type === 'urgent_pm' || incident.type === 'regular_pm').length,
      totalCredit: credits.filter((credit) => credit.amount > 0).reduce((sum, credit) => sum + credit.amount, 0),
      monthlyCount: incidents.filter((incident) => (incident.occurredAt ?? '').startsWith(currentMonth)).length,
    };
  }, [credits, incidents]);

  const resetForm = () => {
    setForm({
      type: 'incident',
      occurredAt: '',
      recoveredAt: '',
      nodeType: 'GPU',
      nodeId: '',
      memo: '',
      recoveryNote: '',
    });
  };

  const handleCreate = async () => {
    if (!activeTenant?.id) {
      return;
    }

    const selectedAllocation = allocations.find((allocation) => allocation.node_id === form.nodeId);

    if (!selectedAllocation?.subtenant_id) {
      setErrorMessage('선택한 노드의 고객사 매핑 정보를 찾지 못했습니다.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type,
          occurredAt: form.occurredAt,
          recoveredAt: form.recoveredAt,
          nodeType: form.nodeType,
          nodeId: form.nodeId,
          instanceName: selectedAllocation.node?.label ?? selectedAllocation.node_id,
          customers: [
            {
              tenantId: activeTenant.id,
              subtenantId: selectedAllocation.subtenant_id,
              gpuCount: 1,
            },
          ],
          memo: form.memo,
          recoveryNote: form.recoveryNote,
        }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? '등록에 실패했습니다.');
      }

      await loadTenantData(activeTenant.id);
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '등록에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (incidentId: number) => {
    if (!isAdmin || !activeTenant?.id) {
      return;
    }

    if (!window.confirm('이 항목을 삭제할까요? 연관 크레딧도 함께 삭제됩니다.')) {
      return;
    }

    try {
      const response = await fetch(`/api/incidents/${incidentId}`, { method: 'DELETE' });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? '삭제에 실패했습니다.');
      }

      await loadTenantData(activeTenant.id);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '삭제에 실패했습니다.');
    }
  };

  return (
    <div className="flex h-auto min-h-0 flex-col gap-6 text-gray-900 md:h-[calc(100vh-112px)] md:flex-row lg:gap-7">
      <IncidentModal
        isOpen={isModalOpen}
        form={form}
        allocations={allocations}
        tenantId={activeTenant?.id ?? ''}
        subtenantNameById={subtenantNameById}
        saving={saving}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        onChange={(next) => setForm((previous) => ({ ...previous, ...next }))}
        onSubmit={handleCreate}
      />

      <CompanyListPanel
        companies={tenants.map((tenant) => ({ id: tenant.id, name: tenant.name, subCount: subtenants.length }))}
        activeIndex={activeTenantIdx}
        onCompanyClick={setActiveTenantIdx}
      />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="mb-5 flex-none space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-2 text-[14px] font-semibold text-gray-600">{activeTenant?.name ?? '고객사'} 전체 등록 건수</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-gray-900">{summary.totalCount}</span>
                <span className="text-sm text-gray-500">건</span>
              </div>
              <div className="mt-4 flex items-center gap-3 text-[12px] font-medium text-gray-500">
                <span className="flex items-center gap-1.5 rounded-md border border-gray-100 bg-gray-50 px-2 py-1">
                  <AlertTriangle size={12} className="text-red-500" />
                  장애 {summary.incidentCount}건
                </span>
                <span className="flex items-center gap-1.5 rounded-md border border-gray-100 bg-gray-50 px-2 py-1">
                  <Settings size={12} className="text-blue-500" />
                  PM {summary.pmCount}건
                </span>
              </div>
            </div>
            <div className="rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-2 text-[14px] font-semibold text-gray-600">총 크레딧 산출액</div>
              <div className="mt-1 text-3xl font-bold tracking-tight text-emerald-600">+₩ {summary.totalCredit.toLocaleString()}</div>
              <div className="mt-4 text-[12px] font-medium text-gray-400">credits 테이블 누적 발생액 기준</div>
            </div>
            <div className="rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-2 text-[14px] font-semibold text-gray-600">이번 달 신규 등록</div>
              <div className="mt-1 text-3xl font-bold tracking-tight text-emerald-600">
                {summary.monthlyCount} <span className="text-sm font-medium text-gray-500">건</span>
              </div>
              <div className="mt-4 text-[12px] font-medium text-gray-400">이번 달 발생 시간 기준</div>
            </div>
          </div>

          <div className="rounded-[14px] border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center justify-between md:border-r md:border-gray-200 md:pr-5">
                <div className="text-[14px] font-bold text-gray-900">장애/PM 등록 및 조회</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (activeTenant?.id) {
                      void loadTenantData(activeTenant.id);
                    }
                  }}
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-gray-200 text-gray-500 hover:bg-gray-50"
                >
                  <RotateCcw size={14} />
                </button>
                {isAdmin ? (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex h-[36px] items-center justify-center gap-1.5 rounded-[8px] bg-red-500 px-4 text-[13px] font-bold text-white hover:bg-red-600"
                  >
                    <AlertTriangle size={14} />
                    <Plus size={14} />
                    등록
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {errorMessage ? (
          <div className="mb-4 rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-600">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex-1 overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
          <div className="h-full overflow-x-auto overflow-y-auto">
            <table className="min-w-[920px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-[#FAFAFA]">
                  <th className="px-5 py-[14px] text-[12px] font-bold uppercase text-gray-500 whitespace-nowrap">구분</th>
                  <th className="px-5 py-[14px] text-[12px] font-bold uppercase text-gray-500 whitespace-nowrap">발생 시간</th>
                  <th className="px-5 py-[14px] text-[12px] font-bold uppercase text-gray-500 whitespace-nowrap">소요 시간</th>
                  <th className="px-5 py-[14px] text-[12px] font-bold uppercase text-gray-500 whitespace-nowrap">노드</th>
                  <th className="px-5 py-[14px] text-[12px] font-bold uppercase text-gray-500 whitespace-nowrap">고객사</th>
                  <th className="px-5 py-[14px] text-[12px] font-bold uppercase text-gray-500 text-right whitespace-nowrap">크레딧 산출액</th>
                  <th className="px-5 py-[14px] text-[12px] font-bold uppercase text-gray-500 whitespace-nowrap">등록자</th>
                  {isAdmin ? <th className="px-5 py-[14px] text-[12px] font-bold uppercase text-gray-500 whitespace-nowrap">관리</th> : null}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 7} className="px-6 py-14 text-center text-[13px] text-gray-400">
                      데이터를 불러오는 중입니다.
                    </td>
                  </tr>
                ) : incidents.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 7} className="px-6 py-14 text-center text-[13px] text-gray-400">
                      등록된 장애/PM 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  incidents.map((incident) => (
                    <tr key={incident.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                      <td className="px-5 py-[14px]">
                        <span className={`inline-flex rounded-[6px] px-2.5 py-1 text-[11px] font-bold ${getTypeBadgeClass(incident.type)}`}>
                          {getTypeLabel(incident.type)}
                        </span>
                      </td>
                      <td className="px-5 py-[14px] font-mono text-[12px] text-gray-500 whitespace-nowrap">
                        {formatDate(incident.occurredAt)}
                      </td>
                      <td className="px-5 py-[14px] text-[13px] font-medium text-gray-600 whitespace-nowrap">
                        {formatDuration(incident.durationMinutes)}
                      </td>
                      <td className="px-5 py-[14px]">
                        <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-gray-200 bg-[#F8FAFC] px-2.5 py-1 text-[12px] font-medium text-gray-600">
                          <Server size={12} className="text-gray-400" />
                          {incident.instanceName ?? incident.nodeId ?? '-'}
                        </span>
                      </td>
                      <td className="px-5 py-[14px] text-[13px] font-medium text-gray-700 whitespace-nowrap">
                        {incident.customers.map((customer) => subtenantNameById[customer.subtenantId ?? ''] ?? customer.subtenantId ?? '-').join(', ')}
                      </td>
                      <td className="px-5 py-[14px] text-right font-mono text-[13px] font-bold text-emerald-600 whitespace-nowrap">
                        +₩ {incident.totalCreditAmount.toLocaleString()}
                      </td>
                      <td className="px-5 py-[14px] text-[13px] font-medium text-gray-600 whitespace-nowrap">
                        {incident.registeredBy ?? '-'}
                      </td>
                      {isAdmin ? (
                        <td className="px-5 py-[14px]">
                          <button onClick={() => void handleDelete(incident.id)} className="text-rose-500 hover:text-rose-700">
                            <Trash2 size={15} />
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
