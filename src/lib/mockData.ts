// ============================================================
// GPUaaS Operations Portal — 중앙 Mock 데이터
// /src/lib/mockData.ts
//
// 모든 페이지는 이 파일에서 import해서 사용.
// 개별 페이지에 하드코딩된 Mock 데이터 사용 금지.
//
// 데이터 참조 기준:
//   - 과금(미터링/빌링): contract 기준
//   - 모니터링/인스턴스 내비게이터: assignedNodes 기준
// ============================================================

// ── 타입 정의 ──────────────────────────────────────────────

export type Role = 'admin' | 'tenant_admin' | 'subtenant_member';
export type NodeStatus = 'ok' | 'warn' | 'err';
export type IncidentType = '장애' | '정기PM' | '긴급PM';
export type CreditType = '장애' | 'PM' | '긴급PM' | '정기PM' | '빌링 차감';

export interface NodeRange {
  start: string;       // 'gpu001'
  end: string | null;  // 'gpu032' or null (단일 노드)
}

export interface Contract {
  startDate: string;
  endDate: string;
  gpu:     { quantity: number; unitPrice: number };
  cpu:     { quantity: number; unitPrice: number };
  storage: { capacity: number; unit: 'TB' | 'PB'; unitPrice: number };
  network: { bandwidth: number; unit: 'Mbps' | 'Gbps'; unitPrice: number };
}

export interface Subtenant {
  id: string;
  name: string;
  tenantId: string;
  status: '활성' | '대기' | '종료';
  products: ('GPU 인프라' | 'AI 스토리지')[];
  startDate: string;
  endDate: string;
  pm: string;
  memberCount: number;
  assignedNodes: NodeRange[];  // 리소스 할당 — 모니터링 화면 필터 기준
}

export interface Tenant {
  id: string;
  name: string;
  contractorEmail: string;
  managerEmail: string;
  createdAt: string;
  contract: Contract;          // 계약 관리 — 과금 기준
  assignedNodes: NodeRange[];  // Tenant 할당 풀
  subtenants: Subtenant[];
}

export interface GpuNode {
  name: string;                // 'gsvp-msi-gpu001'
  tenantId: string | null;
  subtenantId: string | null;
  status: NodeStatus;
  gpuUsage: number;            // %
  memUsage: number;            // %
  temp: number;                // °C
  power: number;               // W
}

export interface User {
  id: string;
  name: string;
  email: string;
  subtenantId: string | null;
  tenantId: string;
  role: 'pm' | 'member';
  isContractor: boolean;
  lastLogin: string;
}

export interface Incident {
  id: string;
  type: IncidentType;
  startDatetime: string;
  endDatetime: string;
  duration: string;
  node: 'GPU' | 'CPU' | 'Storage' | 'NW';
  instance: string;
  affectedSubtenants: { subtenantId: string; gpuCount: number }[];
  creditAmount: number | null;
  recoveryMethod?: string;
  workContent?: string;
  memo: string;
  registeredBy: string;
}

export interface CreditHistory {
  id: string;
  subtenantId: string;
  type: CreditType;
  source: string;              // '장애 등록' | 'PM 등록' | '빌링 2026-02'
  datetime: string;
  duration: string | null;
  node: string | null;
  generated: number | null;    // 발생액 (양수)
  deducted: number | null;     // 차감액 (음수)
}

export interface BillingRecord {
  id: string;
  subtenantId: string;
  billingStart: string;
  billingEnd: string;
  gpu: number;
  cpu: number;
  storage: number;
  network: number;
  creditDeduction: number;
  totalAmount: number;
  registeredAt: string;
  invoiceFile: string | null;
  memo: string;
}

export interface Ticket {
  id: string;
  type: string;
  title: string;
  status: '대기중' | '처리중' | '완료';
  authorId: string;
  createdAt: string;
  commentCount: number;
}

// ── Tenant / Subtenant 데이터 ──────────────────────────────

export const tenants: Tenant[] = [
  {
    id: 'tenant-lg',
    name: 'LG그룹',
    contractorEmail: 'admin@lge.com',
    managerEmail: 'manager@skt.com',
    createdAt: '2026-01-15',
    contract: {
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      gpu:     { quantity: 64,  unitPrice: 1_800_000 },
      cpu:     { quantity: 512, unitPrice: 12_000 },
      storage: { capacity: 2, unit: 'PB', unitPrice: 850_000 },
      network: { bandwidth: 400, unit: 'Gbps', unitPrice: 9_500 },
    },
    assignedNodes: [{ start: 'gpu001', end: 'gpu064' }],
    subtenants: [
      {
        id: 'sub-lg-전자',
        name: 'LG전자',
        tenantId: 'tenant-lg',
        status: '활성',
        products: ['GPU 인프라', 'AI 스토리지'],
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        pm: 'pm_a@lge.com',
        memberCount: 4,
        assignedNodes: [{ start: 'gpu001', end: 'gpu032' }],
      },
      {
        id: 'sub-lg-생명',
        name: 'LG생명',
        tenantId: 'tenant-lg',
        status: '활성',
        products: ['GPU 인프라'],
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        pm: 'pm_b@lge.com',
        memberCount: 2,
        assignedNodes: [{ start: 'gpu033', end: 'gpu048' }],
      },
      {
        id: 'sub-lg-유플러스',
        name: 'LG유플러스',
        tenantId: 'tenant-lg',
        status: '대기',
        products: ['GPU 인프라'],
        startDate: '2026-03-01',
        endDate: '2026-12-31',
        pm: 'pm_c@lge.com',
        memberCount: 0,
        assignedNodes: [],  // 미할당
      },
    ],
  },
  {
    id: 'tenant-upstage',
    name: 'Upstage',
    contractorEmail: 'admin@upstage.ai',
    managerEmail: 'manager2@skt.com',
    createdAt: '2026-02-01',
    contract: {
      startDate: '2026-02-01',
      endDate: '2026-12-31',
      gpu:     { quantity: 48,  unitPrice: 1_800_000 },
      cpu:     { quantity: 256, unitPrice: 12_000 },
      storage: { capacity: 2, unit: 'PB', unitPrice: 850_000 },
      network: { bandwidth: 200, unit: 'Gbps', unitPrice: 9_500 },
    },
    assignedNodes: [{ start: 'gpu065', end: 'gpu112' }],
    subtenants: [
      {
        id: 'sub-upstage',
        name: 'upstage',
        tenantId: 'tenant-upstage',
        status: '활성',
        products: ['GPU 인프라', 'AI 스토리지'],
        startDate: '2026-02-01',
        endDate: '2026-12-31',
        pm: 'pm@upstage.ai',
        memberCount: 6,
        assignedNodes: [{ start: 'gpu065', end: 'gpu112' }],
      },
    ],
  },
  {
    id: 'tenant-samsung',
    name: 'Samsung',
    contractorEmail: 'admin@samsung.com',
    managerEmail: 'manager3@skt.com',
    createdAt: '2026-03-01',
    contract: {
      startDate: '2026-03-01',
      endDate: '2026-12-31',
      gpu:     { quantity: 16,  unitPrice: 1_800_000 },
      cpu:     { quantity: 128, unitPrice: 12_000 },
      storage: { capacity: 1, unit: 'PB', unitPrice: 850_000 },
      network: { bandwidth: 100, unit: 'Gbps', unitPrice: 9_500 },
    },
    assignedNodes: [],
    subtenants: [
      {
        id: 'sub-samsung-ai',
        name: 'Samsung AI',
        tenantId: 'tenant-samsung',
        status: '대기',
        products: ['GPU 인프라'],
        startDate: '2026-03-01',
        endDate: '2026-12-31',
        pm: 'pm@samsung.com',
        memberCount: 0,
        assignedNodes: [],  // 미할당
      },
    ],
  },
];

// ── 헬퍼 함수 ──────────────────────────────────────────────

export function getTenantById(id: string) {
  return tenants.find(t => t.id === id) ?? null;
}

export function getSubtenantById(id: string) {
  for (const t of tenants) {
    const s = t.subtenants.find(s => s.id === id);
    if (s) return s;
  }
  return null;
}

// ── GPU 노드 풀 (127대) ─────────────────────────────────────
// assignedNodes 기준으로 자동 생성

function nodeInRange(nodeNum: number, ranges: NodeRange[]): boolean {
  for (const r of ranges) {
    const start = parseInt(r.start.replace('gpu', ''));
    const end = r.end ? parseInt(r.end.replace('gpu', '')) : start;
    if (nodeNum >= start && nodeNum <= end) return true;
  }
  return false;
}

export const gpuNodes: GpuNode[] = Array.from({ length: 127 }, (_, i) => {
  const num = i + 1;
  const name = `gsvp-msi-gpu${String(num).padStart(3, '0')}`;

  let tenantId: string | null = null;
  let subtenantId: string | null = null;

  for (const t of tenants) {
    for (const s of t.subtenants) {
      if (nodeInRange(num, s.assignedNodes)) {
        tenantId = t.id;
        subtenantId = s.id;
        break;
      }
    }
    if (tenantId) break;
    // Tenant 자체에는 할당됐지만 Subtenant 미분배인 경우
    const allSubRanges = t.subtenants.flatMap(s => s.assignedNodes);
    const tenantRanges: NodeRange[] = t.assignedNodes;
    if (nodeInRange(num, tenantRanges) && !nodeInRange(num, allSubRanges)) {
      tenantId = t.id;
    }
  }

  const isAssigned = subtenantId !== null;
  const statusRoll = num % 17;
  const status: NodeStatus = statusRoll === 0 ? 'err' : statusRoll <= 2 ? 'warn' : 'ok';

  return {
    name,
    tenantId,
    subtenantId,
    status: isAssigned ? status : 'ok',
    gpuUsage: isAssigned ? Math.floor(70 + (num % 28)) : 0,
    memUsage: isAssigned ? Math.floor(55 + (num % 35)) : 0,
    temp:     isAssigned ? Math.floor(65 + (num % 13)) : 0,
    power:    isAssigned ? Math.floor(280 + (num % 40)) : 0,
  };
});

// ── 구성원 ──────────────────────────────────────────────────

export const users: User[] = [
  { id: 'u1', name: '김동주', email: 'dongjoo.kim@lge.com',   subtenantId: 'sub-lg-전자',    tenantId: 'tenant-lg',      role: 'pm',     isContractor: true,  lastLogin: '2026-03-19 14:22:01' },
  { id: 'u2', name: '이영희', email: 'younghee.lee@lge.com',  subtenantId: 'sub-lg-전자',    tenantId: 'tenant-lg',      role: 'member', isContractor: false, lastLogin: '2026-03-18 09:15:30' },
  { id: 'u3', name: '박민수', email: 'minsoo.park@lge.com',   subtenantId: 'sub-lg-생명',    tenantId: 'tenant-lg',      role: 'pm',     isContractor: false, lastLogin: '2026-03-17 18:40:11' },
  { id: 'u4', name: '최지훈', email: 'jihoon.choi@lge.com',   subtenantId: 'sub-lg-생명',    tenantId: 'tenant-lg',      role: 'member', isContractor: false, lastLogin: '2026-03-15 11:10:05' },
  { id: 'u5', name: '정수민', email: 'sumin@upstage.ai',      subtenantId: 'sub-upstage',    tenantId: 'tenant-upstage', role: 'pm',     isContractor: true,  lastLogin: '2026-03-19 10:05:44' },
  { id: 'u6', name: '홍길동', email: 'gildong@email.com',     subtenantId: null,             tenantId: 'tenant-lg',      role: 'member', isContractor: false, lastLogin: '2026-03-10 09:00:00' },
];

// ── 장애/PM 이력 ────────────────────────────────────────────

export const incidents: Incident[] = [
  {
    id: 'inc-001',
    type: '장애',
    startDatetime: '2026-03-18 14:02',
    endDatetime:   '2026-03-18 16:17',
    duration: '2h 15m',
    node: 'GPU',
    instance: 'gsvp-msi-gpu005',
    affectedSubtenants: [
      { subtenantId: 'sub-lg-전자', gpuCount: 8 },
      { subtenantId: 'sub-lg-생명', gpuCount: 4 },
    ],
    creditAmount: -14_500,
    recoveryMethod: '노드 재시작 후 정상화 확인',
    memo: '',
    registeredBy: '운영자1',
  },
  {
    id: 'inc-002',
    type: '긴급PM',
    startDatetime: '2026-03-10 02:00',
    endDatetime:   '2026-03-10 06:00',
    duration: '4h 00m',
    node: 'Storage',
    instance: 'gsvp-msi-gpu033',
    affectedSubtenants: [{ subtenantId: 'sub-lg-생명', gpuCount: 8 }],
    creditAmount: -8_000,
    workContent: '스토리지 펌웨어 긴급 업데이트',
    memo: '',
    registeredBy: '운영자2',
  },
  {
    id: 'inc-003',
    type: '정기PM',
    startDatetime: '2026-02-28 00:00',
    endDatetime:   '2026-02-28 06:30',
    duration: '6h 30m',
    node: 'NW',
    instance: 'SW-1',
    affectedSubtenants: [
      { subtenantId: 'sub-lg-전자',    gpuCount: 8 },
      { subtenantId: 'sub-lg-생명',    gpuCount: 8 },
      { subtenantId: 'sub-upstage',    gpuCount: 8 },
    ],
    creditAmount: null,
    workContent: '네트워크 스위치 정기 점검 및 펌웨어 업데이트',
    memo: '',
    registeredBy: '운영자1',
  },
];

// ── 크레딧 이력 ─────────────────────────────────────────────

export const creditHistory: CreditHistory[] = [
  {
    id: 'cr-001',
    subtenantId: 'sub-lg-전자',
    type: '장애',
    source: '장애 등록',
    datetime: '2026-03-18 16:17',
    duration: '2h 15m',
    node: 'GPU',
    generated: 14_500,
    deducted: null,
  },
  {
    id: 'cr-002',
    subtenantId: 'sub-lg-생명',
    type: '장애',
    source: '장애 등록',
    datetime: '2026-03-18 16:17',
    duration: '2h 15m',
    node: 'GPU',
    generated: 7_250,
    deducted: null,
  },
  {
    id: 'cr-003',
    subtenantId: 'sub-lg-생명',
    type: '긴급PM',
    source: 'PM 등록',
    datetime: '2026-03-10 06:00',
    duration: '4h 00m',
    node: 'Storage',
    generated: 8_000,
    deducted: null,
  },
  {
    id: 'cr-004',
    subtenantId: 'sub-lg-전자',
    type: '빌링 차감',
    source: '빌링 2026-02',
    datetime: '2026-03-05 00:00',
    duration: null,
    node: null,
    generated: null,
    deducted: -10_000,
  },
];

// ── 빌링 이력 ───────────────────────────────────────────────

export const billings: BillingRecord[] = [
  {
    id: 'bill-001',
    subtenantId: 'sub-lg-전자',
    billingStart: '2026-02-01',
    billingEnd:   '2026-02-28',
    gpu:     45_000_000,
    cpu:      3_200_000,
    storage:  1_800_000,
    network:    420_000,
    creditDeduction: -10_000,
    totalAmount: 50_410_000,
    registeredAt: '2026-03-05',
    invoiceFile: 'invoice_LG전자_202602.pdf',
    memo: '',
  },
  {
    id: 'bill-002',
    subtenantId: 'sub-lg-생명',
    billingStart: '2026-02-01',
    billingEnd:   '2026-02-28',
    gpu:     12_000_000,
    cpu:        800_000,
    storage:    420_000,
    network:    120_000,
    creditDeduction: 0,
    totalAmount: 13_340_000,
    registeredAt: '2026-03-05',
    invoiceFile: 'invoice_LG생명_202602.pdf',
    memo: '',
  },
  {
    id: 'bill-003',
    subtenantId: 'sub-upstage',
    billingStart: '2026-02-01',
    billingEnd:   '2026-02-28',
    gpu:     128_000_000,
    cpu:       8_400_000,
    storage:   5_200_000,
    network:   1_200_000,
    creditDeduction: 0,
    totalAmount: 142_800_000,
    registeredAt: '2026-03-05',
    invoiceFile: 'invoice_upstage_202602.pdf',
    memo: '',
  },
];

// ── 티켓 ────────────────────────────────────────────────────

export const tickets: Ticket[] = [
  {
    id: 'TKT-00142',
    type: '장애접수',
    title: 'H100 인스턴스 접속 불가 현상',
    status: '대기중',
    authorId: 'u1',
    createdAt: '2026-03-19 14:22:01',
    commentCount: 2,
  },
  {
    id: 'TKT-00141',
    type: '기술지원',
    title: 'PyTorch 노드 환경 설정 문의',
    status: '처리중',
    authorId: 'u2',
    createdAt: '2026-03-19 10:15:44',
    commentCount: 5,
  },
  {
    id: 'TKT-00139',
    type: '일반안내',
    title: '월간 크레딧 청구서 재발급 요청',
    status: '완료',
    authorId: 'u3',
    createdAt: '2026-03-18 16:40:22',
    commentCount: 3,
  },
];

// ── 공지사항 ────────────────────────────────────────────────

export const notices = [
  { id: 'n-001', type: '시스템 점검', title: '3월 정기 PM 안내 (2026-03-28 00:00~06:00)', author: '운영자1', createdAt: '2026-03-20 09:00:00' },
  { id: 'n-002', type: '업데이트',   title: 'GPUaaS 포털 v2.1 업데이트 안내',             author: '운영자2', createdAt: '2026-03-15 14:00:00' },
  { id: 'n-003', type: '일반',       title: '2026년 2분기 요금 정책 안내',                 author: '운영자1', createdAt: '2026-03-10 10:00:00' },
];
