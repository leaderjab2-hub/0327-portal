"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  HardDrive,
  Package,
  Pencil,
  Plus,
  Search,
  Server,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Json } from "@/types/database";
import type { UserRole } from "@/types/auth";

type ContractResource = {
  quantity?: number;
  unitPrice?: number;
  capacity?: number;
  unit?: string;
  bandwidth?: number;
};

type TenantContract = {
  startDate?: string;
  endDate?: string;
  gpu?: ContractResource;
  cpu?: ContractResource;
  storage?: ContractResource;
  network?: ContractResource;
};

type TenantRecord = {
  id: string;
  name: string;
  contractor_email: string | null;
  manager_email: string | null;
  created_at: string | null;
  contract: Json | null;
};

type SubtenantRecord = {
  id: string;
  tenant_id: string | null;
  name: string;
  status: string | null;
  products: Json | null;
  start_date: string | null;
  end_date: string | null;
  pm: string | null;
  member_count: number | null;
  assigned_nodes: Json | null;
};

type TenantView = {
  id: string;
  name: string;
  contractorEmail: string;
  managerEmail: string;
  createdAt: string;
  contract: TenantContract;
  subtenants: SubtenantView[];
};

type SubtenantView = {
  id: string;
  tenantId: string;
  name: string;
  status: string;
  products: string[];
  startDate: string;
  endDate: string;
  pm: string;
  memberCount: number;
  assignedNodes: Json;
};

type TenantFormState = {
  id: string;
  name: string;
  contractorEmail: string;
  managerEmail: string;
  startDate: string;
  endDate: string;
  gpuQuantity: string;
  gpuUnitPrice: string;
  cpuQuantity: string;
  cpuUnitPrice: string;
  storageCapacity: string;
  storageUnit: string;
  storageUnitPrice: string;
  networkBandwidth: string;
  networkUnit: string;
  networkUnitPrice: string;
};

type SubtenantFormState = {
  id: string;
  name: string;
  status: string;
  products: string;
  startDate: string;
  endDate: string;
  pm: string;
};

type TenantModalProps = {
  isOpen: boolean;
  title: string;
  mode: "create" | "edit";
  form: TenantFormState;
  saving: boolean;
  onChange: (next: TenantFormState) => void;
  onClose: () => void;
  onSubmit: () => void;
};

type SubtenantModalProps = {
  isOpen: boolean;
  title: string;
  mode: "create" | "edit";
  form: SubtenantFormState;
  saving: boolean;
  onChange: (next: SubtenantFormState) => void;
  onClose: () => void;
  onSubmit: () => void;
};

const defaultTenantForm: TenantFormState = {
  id: "",
  name: "",
  contractorEmail: "",
  managerEmail: "",
  startDate: "",
  endDate: "",
  gpuQuantity: "",
  gpuUnitPrice: "",
  cpuQuantity: "",
  cpuUnitPrice: "",
  storageCapacity: "",
  storageUnit: "TB",
  storageUnitPrice: "",
  networkBandwidth: "",
  networkUnit: "Gbps",
  networkUnitPrice: "",
};

const defaultSubtenantForm: SubtenantFormState = {
  id: "",
  name: "",
  status: "대기",
  products: "",
  startDate: "",
  endDate: "",
  pm: "",
};

function parseContract(contract: Json | null): TenantContract {
  if (!contract || Array.isArray(contract) || typeof contract !== "object") {
    return {};
  }

  return contract as TenantContract;
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return value.slice(0, 10);
}

function normalizeSubtenantProducts(products: Json | null) {
  if (!Array.isArray(products)) {
    return [];
  }

  return products.filter((item): item is string => typeof item === "string");
}

function buildTenantView(tenants: TenantRecord[], subtenants: SubtenantRecord[]) {
  return tenants.map<TenantView>((tenant) => {
    const contract = parseContract(tenant.contract);
    const tenantSubtenants = subtenants
      .filter((subtenant) => subtenant.tenant_id === tenant.id)
      .map<SubtenantView>((subtenant) => ({
        id: subtenant.id,
        tenantId: subtenant.tenant_id ?? "",
        name: subtenant.name,
        status: subtenant.status ?? "대기",
        products: normalizeSubtenantProducts(subtenant.products),
        startDate: formatDate(subtenant.start_date),
        endDate: formatDate(subtenant.end_date),
        pm: subtenant.pm ?? "-",
        memberCount: subtenant.member_count ?? 0,
        assignedNodes: subtenant.assigned_nodes ?? [],
      }));

    return {
      id: tenant.id,
      name: tenant.name,
      contractorEmail: tenant.contractor_email ?? "",
      managerEmail: tenant.manager_email ?? "",
      createdAt: formatDate(tenant.created_at),
      contract,
      subtenants: tenantSubtenants,
    };
  });
}

function tenantToForm(tenant?: TenantView | null): TenantFormState {
  if (!tenant) {
    return defaultTenantForm;
  }

  return {
    id: tenant.id,
    name: tenant.name,
    contractorEmail: tenant.contractorEmail,
    managerEmail: tenant.managerEmail,
    startDate: tenant.contract.startDate ?? "",
    endDate: tenant.contract.endDate ?? "",
    gpuQuantity: String(tenant.contract.gpu?.quantity ?? ""),
    gpuUnitPrice: String(tenant.contract.gpu?.unitPrice ?? ""),
    cpuQuantity: String(tenant.contract.cpu?.quantity ?? ""),
    cpuUnitPrice: String(tenant.contract.cpu?.unitPrice ?? ""),
    storageCapacity: String(tenant.contract.storage?.capacity ?? ""),
    storageUnit: tenant.contract.storage?.unit ?? "TB",
    storageUnitPrice: String(tenant.contract.storage?.unitPrice ?? ""),
    networkBandwidth: String(tenant.contract.network?.bandwidth ?? ""),
    networkUnit: tenant.contract.network?.unit ?? "Gbps",
    networkUnitPrice: String(tenant.contract.network?.unitPrice ?? ""),
  };
}

function subtenantToForm(subtenant?: SubtenantView | null): SubtenantFormState {
  if (!subtenant) {
    return defaultSubtenantForm;
  }

  return {
    id: subtenant.id,
    name: subtenant.name,
    status: subtenant.status,
    products: subtenant.products.join(", "),
    startDate: subtenant.startDate === "-" ? "" : subtenant.startDate,
    endDate: subtenant.endDate === "-" ? "" : subtenant.endDate,
    pm: subtenant.pm === "-" ? "" : subtenant.pm,
  };
}

function buildTenantPayload(form: TenantFormState) {
  return {
    id: form.id,
    name: form.name,
    contractor_email: form.contractorEmail || null,
    manager_email: form.managerEmail || null,
    contract: {
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      gpu: {
        quantity: Number(form.gpuQuantity || 0),
        unitPrice: Number(form.gpuUnitPrice || 0),
      },
      cpu: {
        quantity: Number(form.cpuQuantity || 0),
        unitPrice: Number(form.cpuUnitPrice || 0),
      },
      storage: {
        capacity: Number(form.storageCapacity || 0),
        unit: form.storageUnit || "TB",
        unitPrice: Number(form.storageUnitPrice || 0),
      },
      network: {
        bandwidth: Number(form.networkBandwidth || 0),
        unit: form.networkUnit || "Gbps",
        unitPrice: Number(form.networkUnitPrice || 0),
      },
    },
  };
}

function buildSubtenantPayload(form: SubtenantFormState, tenantId: string) {
  return {
    id: form.id,
    tenant_id: tenantId,
    name: form.name,
    status: form.status,
    products: form.products
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    start_date: form.startDate || null,
    end_date: form.endDate || null,
    pm: form.pm || null,
    assigned_nodes: [],
  };
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as T & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed");
  }

  return payload;
}

function ModalFrame({
  children,
  title,
  onClose,
}: {
  children: ReactNode;
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-[18px] border border-gray-200 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.22)]">
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
        <div className="max-h-[80vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function TenantModal({
  isOpen,
  title,
  mode,
  form,
  saving,
  onChange,
  onClose,
  onSubmit,
}: TenantModalProps) {
  if (!isOpen) {
    return null;
  }

  const setField = (field: keyof TenantFormState, value: string) => {
    onChange({ ...form, [field]: value });
  };

  return (
    <ModalFrame onClose={onClose} title={title}>
      <div className="space-y-6">
        <section className="rounded-[14px] border border-gray-200 bg-[#FAFBFC] p-4">
          <h3 className="mb-4 text-[14px] font-bold text-gray-900">기본 정보</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">Tenant ID</span>
              <input
                className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]"
                disabled={mode === "edit"}
                value={form.id}
                onChange={(event) => setField("id", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">회사명</span>
              <input
                className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]"
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">계약자 이메일</span>
              <input
                className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]"
                value={form.contractorEmail}
                onChange={(event) => setField("contractorEmail", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">담당 관리자 이메일</span>
              <input
                className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]"
                value={form.managerEmail}
                onChange={(event) => setField("managerEmail", event.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="rounded-[14px] border border-gray-200 bg-[#FAFBFC] p-4">
          <h3 className="mb-4 text-[14px] font-bold text-gray-900">계약 기간</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">시작일</span>
              <input
                className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]"
                type="date"
                value={form.startDate}
                onChange={(event) => setField("startDate", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">종료일</span>
              <input
                className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]"
                type="date"
                value={form.endDate}
                onChange={(event) => setField("endDate", event.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="rounded-[14px] border border-gray-200 bg-[#FAFBFC] p-4">
          <h3 className="mb-4 text-[14px] font-bold text-gray-900">리소스 계약</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">GPU 수량</span>
              <input className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" value={form.gpuQuantity} onChange={(event) => setField("gpuQuantity", event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">GPU 월 단가</span>
              <input className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" value={form.gpuUnitPrice} onChange={(event) => setField("gpuUnitPrice", event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">CPU 수량</span>
              <input className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" value={form.cpuQuantity} onChange={(event) => setField("cpuQuantity", event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">CPU 월 단가</span>
              <input className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" value={form.cpuUnitPrice} onChange={(event) => setField("cpuUnitPrice", event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">스토리지 용량</span>
              <input className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" value={form.storageCapacity} onChange={(event) => setField("storageCapacity", event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">스토리지 단위</span>
              <select className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" value={form.storageUnit} onChange={(event) => setField("storageUnit", event.target.value)}>
                <option value="TB">TB</option>
                <option value="PB">PB</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">스토리지 월 단가</span>
              <input className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" value={form.storageUnitPrice} onChange={(event) => setField("storageUnitPrice", event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">네트워크 대역폭</span>
              <input className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" value={form.networkBandwidth} onChange={(event) => setField("networkBandwidth", event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">네트워크 단위</span>
              <select className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" value={form.networkUnit} onChange={(event) => setField("networkUnit", event.target.value)}>
                <option value="Gbps">Gbps</option>
                <option value="Mbps">Mbps</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">네트워크 월 단가</span>
              <input className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" value={form.networkUnitPrice} onChange={(event) => setField("networkUnitPrice", event.target.value)} />
            </label>
          </div>
        </section>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
          <button className="rounded-[10px] border border-gray-200 px-5 py-2.5 text-[14px] font-semibold text-gray-700" onClick={onClose} type="button">
            취소
          </button>
          <button className="rounded-[10px] bg-primary-600 px-5 py-2.5 text-[14px] font-semibold text-white disabled:opacity-60" disabled={saving} onClick={onSubmit} type="button">
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </ModalFrame>
  );
}

function SubtenantModal({
  isOpen,
  title,
  mode,
  form,
  saving,
  onChange,
  onClose,
  onSubmit,
}: SubtenantModalProps) {
  if (!isOpen) {
    return null;
  }

  const setField = (field: keyof SubtenantFormState, value: string) => {
    onChange({ ...form, [field]: value });
  };

  return (
    <ModalFrame onClose={onClose} title={title}>
      <div className="space-y-6">
        <section className="rounded-[14px] border border-gray-200 bg-[#FAFBFC] p-4">
          <h3 className="mb-4 text-[14px] font-bold text-gray-900">프로젝트 정보</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">Subtenant ID</span>
              <input className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" disabled={mode === "edit"} value={form.id} onChange={(event) => setField("id", event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">프로젝트명</span>
              <input className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" value={form.name} onChange={(event) => setField("name", event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">상태</span>
              <select className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" value={form.status} onChange={(event) => setField("status", event.target.value)}>
                <option value="활성">활성</option>
                <option value="대기">대기</option>
                <option value="종료">종료</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">PM 이메일</span>
              <input className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" value={form.pm} onChange={(event) => setField("pm", event.target.value)} />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">상품 목록</span>
              <input className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" placeholder="예: GPU 인프라, AI 스토리지" value={form.products} onChange={(event) => setField("products", event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">시작일</span>
              <input className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" type="date" value={form.startDate} onChange={(event) => setField("startDate", event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold text-gray-500">종료일</span>
              <input className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px]" type="date" value={form.endDate} onChange={(event) => setField("endDate", event.target.value)} />
            </label>
          </div>
        </section>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
          <button className="rounded-[10px] border border-gray-200 px-5 py-2.5 text-[14px] font-semibold text-gray-700" onClick={onClose} type="button">
            취소
          </button>
          <button className="rounded-[10px] bg-emerald-600 px-5 py-2.5 text-[14px] font-semibold text-white disabled:opacity-60" disabled={saving} onClick={onSubmit} type="button">
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </ModalFrame>
  );
}

function canEdit(role: UserRole | undefined) {
  return role === "admin" || role === "tenant_admin";
}

type ContractsPageClientProps = {
  initialTenantRecords?: TenantRecord[];
  initialSubtenantRecords?: SubtenantRecord[];
};

export default function ContractsPageClient({
  initialTenantRecords = [],
  initialSubtenantRecords = [],
}: ContractsPageClientProps) {
  const { currentUser } = useAuth();
  const initialTenants = useMemo(
    () => buildTenantView(initialTenantRecords, initialSubtenantRecords),
    [initialSubtenantRecords, initialTenantRecords],
  );
  const [tenants, setTenants] = useState<TenantView[]>(initialTenants);
  const [selectedTenantId, setSelectedTenantId] = useState<string>(initialTenants[0]?.id ?? "");
  const [tenantSearch, setTenantSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [loading, setLoading] = useState(initialTenants.length === 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tenantEditor, setTenantEditor] = useState<{
    open: boolean;
    mode: "create" | "edit";
    form: TenantFormState;
  }>({
    open: false,
    mode: "create",
    form: defaultTenantForm,
  });
  const [subtenantEditor, setSubtenantEditor] = useState<{
    open: boolean;
    mode: "create" | "edit";
    form: SubtenantFormState;
    targetId: string | null;
  }>({
    open: false,
    mode: "create",
    form: defaultSubtenantForm,
    targetId: null,
  });

  const loadContracts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [tenantsPayload, subtenantsPayload] = await Promise.all([
        readJson<{ data: TenantRecord[] }>(await fetch("/api/tenants", { cache: "no-store" })),
        readJson<{ data: SubtenantRecord[] }>(await fetch("/api/subtenants", { cache: "no-store" })),
      ]);

      const nextTenants = buildTenantView(tenantsPayload.data, subtenantsPayload.data);
      setTenants(nextTenants);
      setSelectedTenantId((prev) => {
        if (prev && nextTenants.some((tenant) => tenant.id === prev)) {
          return prev;
        }

        return nextTenants[0]?.id ?? "";
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialTenants.length > 0) {
      return;
    }

    void loadContracts();
  }, [initialTenants.length, loadContracts]);

  const filteredTenants = useMemo(() => {
    const keyword = tenantSearch.trim().toLowerCase();

    if (!keyword) {
      return tenants;
    }

    return tenants.filter((tenant) => {
      return tenant.name.toLowerCase().includes(keyword) || tenant.id.toLowerCase().includes(keyword);
    });
  }, [tenantSearch, tenants]);

  const selectedTenant = useMemo(() => {
    if (!selectedTenantId) {
      return filteredTenants[0] ?? tenants[0] ?? null;
    }

    return tenants.find((tenant) => tenant.id === selectedTenantId) ?? null;
  }, [filteredTenants, selectedTenantId, tenants]);

  const filteredSubtenants = useMemo(() => {
    const keyword = projectSearch.trim().toLowerCase();
    const subtenants = selectedTenant?.subtenants ?? [];

    if (!keyword) {
      return subtenants;
    }

    return subtenants.filter((subtenant) => {
      return (
        subtenant.name.toLowerCase().includes(keyword) ||
        subtenant.id.toLowerCase().includes(keyword) ||
        subtenant.pm.toLowerCase().includes(keyword)
      );
    });
  }, [projectSearch, selectedTenant]);

  const editable = canEdit(currentUser?.role);
  const isAdmin = currentUser?.role === "admin";

  const openTenantCreate = () => {
    setTenantEditor({ open: true, mode: "create", form: defaultTenantForm });
  };

  const openTenantEdit = () => {
    if (!selectedTenant) {
      return;
    }

    setTenantEditor({ open: true, mode: "edit", form: tenantToForm(selectedTenant) });
  };

  const openSubtenantCreate = () => {
    setSubtenantEditor({ open: true, mode: "create", form: defaultSubtenantForm, targetId: null });
  };

  const openSubtenantEdit = (subtenant: SubtenantView) => {
    setSubtenantEditor({
      open: true,
      mode: "edit",
      form: subtenantToForm(subtenant),
      targetId: subtenant.id,
    });
  };

  const saveTenant = async () => {
    setSaving(true);
    setError(null);

    try {
      const payload = buildTenantPayload(tenantEditor.form);
      const isCreate = tenantEditor.mode === "create";
      const endpoint = isCreate ? "/api/tenants" : `/api/tenants/${tenantEditor.form.id}`;
      const method = isCreate ? "POST" : "PUT";

      await readJson(
        await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );

      setTenantEditor({ open: false, mode: "create", form: defaultTenantForm });
      await loadContracts();
      setSelectedTenantId(payload.id);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Tenant 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const deleteTenant = async () => {
    if (!selectedTenant || !isAdmin) {
      return;
    }

    const confirmed = window.confirm(`${selectedTenant.name} Tenant를 삭제할까요?`);

    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await readJson(
        await fetch(`/api/tenants/${selectedTenant.id}`, {
          method: "DELETE",
        }),
      );

      await loadContracts();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Tenant 삭제에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const saveSubtenant = async () => {
    if (!selectedTenant) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = buildSubtenantPayload(subtenantEditor.form, selectedTenant.id);
      const isCreate = subtenantEditor.mode === "create";
      const endpoint = isCreate
        ? "/api/subtenants"
        : `/api/subtenants/${subtenantEditor.targetId ?? payload.id}`;
      const method = isCreate ? "POST" : "PUT";

      await readJson(
        await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );

      setSubtenantEditor({
        open: false,
        mode: "create",
        form: defaultSubtenantForm,
        targetId: null,
      });
      await loadContracts();
      setSelectedTenantId(selectedTenant.id);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "프로젝트 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const deleteSubtenant = async (subtenant: SubtenantView) => {
    const confirmed = window.confirm(`${subtenant.name} 프로젝트를 삭제할까요?`);

    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await readJson(
        await fetch(`/api/subtenants/${subtenant.id}`, {
          method: "DELETE",
        }),
      );

      await loadContracts();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "프로젝트 삭제에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const gpuQuantity = selectedTenant?.contract.gpu?.quantity ?? 0;
  const storageCapacity = selectedTenant?.contract.storage?.capacity ?? 0;
  const storageUnit = selectedTenant?.contract.storage?.unit ?? "TB";

  return (
    <div className="flex flex-col gap-6 pb-8 text-gray-900 lg:gap-7">
      <TenantModal
        form={tenantEditor.form}
        isOpen={tenantEditor.open}
        mode={tenantEditor.mode}
        onChange={(form) => setTenantEditor((prev) => ({ ...prev, form }))}
        onClose={() => setTenantEditor((prev) => ({ ...prev, open: false }))}
        onSubmit={saveTenant}
        saving={saving}
        title={tenantEditor.mode === "create" ? "Tenant 생성" : "Tenant 수정"}
      />
      <SubtenantModal
        form={subtenantEditor.form}
        isOpen={subtenantEditor.open}
        mode={subtenantEditor.mode}
        onChange={(form) => setSubtenantEditor((prev) => ({ ...prev, form }))}
        onClose={() =>
          setSubtenantEditor({
            open: false,
            mode: "create",
            form: defaultSubtenantForm,
            targetId: null,
          })
        }
        onSubmit={saveSubtenant}
        saving={saving}
        title={subtenantEditor.mode === "create" ? "프로젝트 생성" : "프로젝트 수정"}
      />

      {error ? (
        <div className="rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-[14px] text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[15rem_minmax(0,1fr)] lg:gap-7">
        <section className="overflow-hidden rounded-[18px] border border-gray-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)] lg:shadow-[0_14px_36px_-22px_rgba(15,23,42,0.2)]">
          <div className="border-b border-gray-200 px-5 py-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-gray-900">Tenant 관리</h2>
              <span className="rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                Total {filteredTenants.length}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <label className="relative block">
                <Search className="absolute left-3 top-3.5 text-gray-400" size={16} />
                <input
                  className="h-11 w-full rounded-[10px] border border-gray-200 bg-gray-50 pl-10 pr-4 text-[14px]"
                  placeholder="Tenant 검색"
                  value={tenantSearch}
                  onChange={(event) => setTenantSearch(event.target.value)}
                />
              </label>
              {editable ? (
                <button
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-gray-900 text-[14px] font-semibold text-white transition hover:bg-gray-800"
                  onClick={openTenantCreate}
                  type="button"
                >
                  <Plus size={16} />
                  Tenant 추가
                </button>
              ) : null}
            </div>
          </div>

          <div className="max-h-[780px] overflow-y-auto">
            {loading ? (
              <div className="px-5 py-8 text-[14px] text-gray-500">Tenant 목록을 불러오는 중입니다...</div>
            ) : filteredTenants.length === 0 ? (
              <div className="px-5 py-8 text-[14px] text-gray-400">조건에 맞는 Tenant가 없습니다.</div>
            ) : (
              filteredTenants.map((tenant) => {
                const active = tenant.id === selectedTenant?.id;

                return (
                  <button
                    key={tenant.id}
                    className={`flex w-full items-center justify-between border-b border-gray-100 px-5 py-4 text-left transition ${
                      active ? "bg-primary-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedTenantId(tenant.id)}
                    type="button"
                  >
                    <div className="min-w-0">
                      <div className={`truncate text-[15px] font-bold ${active ? "text-primary-700" : "text-gray-900"}`}>
                        {tenant.name}
                      </div>
                      <div className="mt-1 text-[12px] text-gray-500">
                        프로젝트 {tenant.subtenants.length}개
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-gray-400">{tenant.id}</div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <section className="space-y-5 lg:space-y-6">
          <div className="rounded-[18px] border border-gray-200 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] lg:p-7 lg:shadow-[0_14px_36px_-22px_rgba(15,23,42,0.2)]">
            {selectedTenant ? (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <h1 className="flex items-center gap-2 text-[28px] font-bold tracking-tight text-gray-900">
                      <Building2 className="shrink-0 text-gray-400" size={24} />
                      <span className="truncate">{selectedTenant.name}</span>
                    </h1>
                    <div className="mt-3 flex flex-wrap gap-2 text-[13px] text-gray-600">
                      <span className="rounded-full bg-gray-100 px-3 py-1.5">{selectedTenant.contractorEmail || "-"}</span>
                      <span className="rounded-full bg-gray-100 px-3 py-1.5">{selectedTenant.managerEmail || "-"}</span>
                      <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
                        {selectedTenant.contract.startDate ?? "-"} ~ {selectedTenant.contract.endDate ?? "-"}
                      </span>
                      <span className="rounded-full bg-gray-100 px-3 py-1.5">
                        생성일 {selectedTenant.createdAt}
                      </span>
                    </div>
                  </div>

                  {editable ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-[10px] border border-gray-200 px-4 py-2.5 text-[14px] font-semibold text-gray-700 transition hover:bg-gray-50"
                        onClick={openTenantEdit}
                        type="button"
                      >
                        <Pencil size={15} />
                        편집
                      </button>
                      {isAdmin ? (
                        <button
                          className="inline-flex items-center gap-2 whitespace-nowrap rounded-[10px] border border-rose-200 px-4 py-2.5 text-[14px] font-semibold text-rose-600 transition hover:bg-rose-50"
                          onClick={deleteTenant}
                          type="button"
                        >
                          <Trash2 size={15} />
                          삭제
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
                  <div className="rounded-[16px] border border-gray-200 bg-[#F8FAFC] p-4 lg:p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <Package size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-500">프로젝트 수</div>
                        <div className="text-[24px] font-bold text-gray-900">
                          {selectedTenant.subtenants.length}
                          <span className="ml-1 text-[14px] text-gray-400">개</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[16px] border border-gray-200 bg-[#F8FAFC] p-4 lg:p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Server size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-500">전체 할당 GPU</div>
                        <div className="text-[24px] font-bold text-gray-900">
                          {gpuQuantity}
                          <span className="ml-1 text-[14px] text-gray-400">장</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[16px] border border-gray-200 bg-[#F8FAFC] p-4 lg:p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                        <HardDrive size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-500">스토리지 계약</div>
                        <div className="text-[24px] font-bold text-gray-900">
                          {storageCapacity}
                          <span className="ml-1 text-[14px] text-gray-400">{storageUnit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-14 text-center text-[15px] text-gray-400">표시할 Tenant가 없습니다.</div>
            )}
          </div>

          <div className="overflow-hidden rounded-[18px] border border-gray-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)] lg:shadow-[0_14px_36px_-22px_rgba(15,23,42,0.2)]">
            <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-gray-900">프로젝트 목록</h3>
                <p className="mt-1 text-[13px] text-gray-500">선택한 Tenant에 속한 Subtenant 목록입니다.</p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <label className="relative block">
                  <Search className="absolute left-3 top-3.5 text-gray-400" size={16} />
                  <input
                    className="h-11 w-full rounded-[10px] border border-gray-200 bg-gray-50 pl-10 pr-4 text-[14px] md:max-w-[220px]"
                    placeholder="프로젝트 검색"
                    value={projectSearch}
                    onChange={(event) => setProjectSearch(event.target.value)}
                  />
                </label>
                {editable && selectedTenant ? (
                  <button
                    className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-emerald-600 px-4 text-[14px] font-semibold text-white transition hover:bg-emerald-700"
                    onClick={openSubtenantCreate}
                    type="button"
                  >
                    <Plus size={16} />
                    프로젝트 생성
                  </button>
                ) : null}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full text-left">
                <thead className="bg-[#FAFAFA]">
                  <tr className="border-b border-gray-200">
                    <th className="min-w-[120px] whitespace-nowrap px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-gray-500">프로젝트명</th>
                    <th className="min-w-[80px] whitespace-nowrap px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-gray-500">상태</th>
                    <th className="min-w-[120px] whitespace-nowrap px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-gray-500">프로젝트 ID</th>
                    <th className="min-w-[140px] whitespace-nowrap px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-gray-500">상품</th>
                    <th className="min-w-[120px] whitespace-nowrap px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-gray-500">기간</th>
                    <th className="min-w-[160px] whitespace-nowrap px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-gray-500">PM</th>
                    <th className="min-w-[80px] whitespace-nowrap px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-gray-500">멤버 수</th>
                    <th className="min-w-[120px] whitespace-nowrap px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-gray-500">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-5 py-12 text-center text-[14px] text-gray-400" colSpan={8}>
                        프로젝트 목록을 불러오는 중입니다...
                      </td>
                    </tr>
                  ) : filteredSubtenants.length === 0 ? (
                    <tr>
                      <td className="px-5 py-12 text-center text-[14px] text-gray-400" colSpan={8}>
                        등록된 프로젝트가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredSubtenants.map((subtenant) => (
                      <tr key={subtenant.id} className="border-b border-gray-100 align-top">
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="font-semibold text-gray-900">{subtenant.name}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              subtenant.status === "활성"
                                ? "bg-emerald-50 text-emerald-700"
                                : subtenant.status === "대기"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {subtenant.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-mono text-[12px] text-gray-500">{subtenant.id}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-[13px] text-gray-600">
                          {subtenant.products.length > 0 ? subtenant.products.join(", ") : "-"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-[13px] text-gray-600">
                          {subtenant.startDate} ~ {subtenant.endDate}
                        </td>
                        <td className="min-w-[160px] whitespace-nowrap px-5 py-4 text-[13px] text-gray-600">{subtenant.pm}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-[13px] text-gray-600">{subtenant.memberCount}명</td>
                        <td className="whitespace-nowrap px-5 py-4">
                          {editable ? (
                            <div className="flex gap-2">
                              <button
                                className="rounded-[8px] border border-gray-200 px-3 py-1.5 text-[12px] font-semibold text-gray-700 transition hover:bg-gray-50 whitespace-nowrap"
                                onClick={() => openSubtenantEdit(subtenant)}
                                type="button"
                              >
                                수정
                              </button>
                              <button
                                className="rounded-[8px] border border-rose-200 px-3 py-1.5 text-[12px] font-semibold text-rose-600 transition hover:bg-rose-50 whitespace-nowrap"
                                onClick={() => deleteSubtenant(subtenant)}
                                type="button"
                              >
                                삭제
                              </button>
                            </div>
                          ) : (
                            <span className="text-[12px] text-gray-400">읽기 전용</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
