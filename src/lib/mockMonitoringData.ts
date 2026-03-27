// ================================================================
// GPUaaS 모니터링 Mock 데이터
// GPU(127개) · CPU · 네트워크 · AI 스토리지 — 2주치 시계열
// tenant/subtenant 할당 정보 없음 → node_allocations DB에서 관리
// MSW 핸들러에서 import해서 사용
// ================================================================

export interface TimeSeriesPoint {
  timestamp: string; // 'MM/DD'
  value: number;
}

export interface NodeCurrent {
  gpuUsage: number;    // %
  memUsage: number;    // %
  temp: number;        // ℃
  power: number;       // W
  cpuUsage: number;    // %
  cpuMemUsage: number; // %
}

export interface NodeSpec {
  model: string;
  vramGB: number;
  tdpW: number;
  interconnect: string;
  cudaCores: number;
}

export interface GpuNode {
  id: string;
  label: string;
  spec: NodeSpec;
  status: 'ok' | 'warn' | 'err';
  current: NodeCurrent;
  series: {
    gpuUsage: TimeSeriesPoint[];
    memUsage: TimeSeriesPoint[];
    temp: TimeSeriesPoint[];
    power: TimeSeriesPoint[];
    cpuUsage: TimeSeriesPoint[];
    cpuMemUsage: TimeSeriesPoint[];
  };
}

export interface NetworkMetric {
  tenantId: string;
  currentOutboundGB: number;
  currentInboundGB: number;
  outbound: TimeSeriesPoint[];
  inbound: TimeSeriesPoint[];
}

export interface StorageMetric {
  tenantId: string;
  usageTB: number;
  totalTB: number;
  usagePercent: number;
  capacity: TimeSeriesPoint[]; // TB
  bw: TimeSeriesPoint[];       // Mbps
  iops: TimeSeriesPoint[];
  latency: TimeSeriesPoint[];  // ms
}

// 전체 노드 풀 (127개) — 할당 정보 없음
export const mockGpuNodes: GpuNode[] = [
  {
    "id": "gsvp-msi-gpu001",
    "label": "GPU-001",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 75,
      "memUsage": 67,
      "temp": 74,
      "power": 523,
      "cpuUsage": 62,
      "cpuMemUsage": 36
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 69.9
        },
        {
          "timestamp": "03/15",
          "value": 84.8
        },
        {
          "timestamp": "03/16",
          "value": 84.4
        },
        {
          "timestamp": "03/17",
          "value": 78.7
        },
        {
          "timestamp": "03/18",
          "value": 76.7
        },
        {
          "timestamp": "03/19",
          "value": 78.6
        },
        {
          "timestamp": "03/20",
          "value": 80.6
        },
        {
          "timestamp": "03/21",
          "value": 76.8
        },
        {
          "timestamp": "03/22",
          "value": 66.7
        },
        {
          "timestamp": "03/23",
          "value": 65.4
        },
        {
          "timestamp": "03/24",
          "value": 68.1
        },
        {
          "timestamp": "03/25",
          "value": 68.5
        },
        {
          "timestamp": "03/26",
          "value": 70.2
        },
        {
          "timestamp": "03/27",
          "value": 70.6
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 62.6
        },
        {
          "timestamp": "03/15",
          "value": 73.8
        },
        {
          "timestamp": "03/16",
          "value": 74.2
        },
        {
          "timestamp": "03/17",
          "value": 71
        },
        {
          "timestamp": "03/18",
          "value": 72.9
        },
        {
          "timestamp": "03/19",
          "value": 66.6
        },
        {
          "timestamp": "03/20",
          "value": 66.8
        },
        {
          "timestamp": "03/21",
          "value": 61.3
        },
        {
          "timestamp": "03/22",
          "value": 59.6
        },
        {
          "timestamp": "03/23",
          "value": 56.9
        },
        {
          "timestamp": "03/24",
          "value": 57.9
        },
        {
          "timestamp": "03/25",
          "value": 63.3
        },
        {
          "timestamp": "03/26",
          "value": 64.6
        },
        {
          "timestamp": "03/27",
          "value": 67.7
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 71.3
        },
        {
          "timestamp": "03/15",
          "value": 76.7
        },
        {
          "timestamp": "03/16",
          "value": 82.1
        },
        {
          "timestamp": "03/17",
          "value": 83.7
        },
        {
          "timestamp": "03/18",
          "value": 79.4
        },
        {
          "timestamp": "03/19",
          "value": 78.3
        },
        {
          "timestamp": "03/20",
          "value": 78
        },
        {
          "timestamp": "03/21",
          "value": 69.4
        },
        {
          "timestamp": "03/22",
          "value": 70.5
        },
        {
          "timestamp": "03/23",
          "value": 68.5
        },
        {
          "timestamp": "03/24",
          "value": 64.8
        },
        {
          "timestamp": "03/25",
          "value": 66.5
        },
        {
          "timestamp": "03/26",
          "value": 70.8
        },
        {
          "timestamp": "03/27",
          "value": 75.8
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 521.2
        },
        {
          "timestamp": "03/15",
          "value": 522.7
        },
        {
          "timestamp": "03/16",
          "value": 578.8
        },
        {
          "timestamp": "03/17",
          "value": 593.8
        },
        {
          "timestamp": "03/18",
          "value": 568.1
        },
        {
          "timestamp": "03/19",
          "value": 536.8
        },
        {
          "timestamp": "03/20",
          "value": 506
        },
        {
          "timestamp": "03/21",
          "value": 532.4
        },
        {
          "timestamp": "03/22",
          "value": 457.5
        },
        {
          "timestamp": "03/23",
          "value": 453.2
        },
        {
          "timestamp": "03/24",
          "value": 468.1
        },
        {
          "timestamp": "03/25",
          "value": 489.7
        },
        {
          "timestamp": "03/26",
          "value": 505.2
        },
        {
          "timestamp": "03/27",
          "value": 504.2
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 66.6
        },
        {
          "timestamp": "03/15",
          "value": 59.8
        },
        {
          "timestamp": "03/16",
          "value": 73.2
        },
        {
          "timestamp": "03/17",
          "value": 65.8
        },
        {
          "timestamp": "03/18",
          "value": 62.9
        },
        {
          "timestamp": "03/19",
          "value": 65.4
        },
        {
          "timestamp": "03/20",
          "value": 57.9
        },
        {
          "timestamp": "03/21",
          "value": 57.5
        },
        {
          "timestamp": "03/22",
          "value": 55.4
        },
        {
          "timestamp": "03/23",
          "value": 56.2
        },
        {
          "timestamp": "03/24",
          "value": 58
        },
        {
          "timestamp": "03/25",
          "value": 54.5
        },
        {
          "timestamp": "03/26",
          "value": 54.3
        },
        {
          "timestamp": "03/27",
          "value": 67.6
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 38.3
        },
        {
          "timestamp": "03/15",
          "value": 40.2
        },
        {
          "timestamp": "03/16",
          "value": 36.6
        },
        {
          "timestamp": "03/17",
          "value": 37.8
        },
        {
          "timestamp": "03/18",
          "value": 39.3
        },
        {
          "timestamp": "03/19",
          "value": 40.5
        },
        {
          "timestamp": "03/20",
          "value": 37.6
        },
        {
          "timestamp": "03/21",
          "value": 35
        },
        {
          "timestamp": "03/22",
          "value": 31.6
        },
        {
          "timestamp": "03/23",
          "value": 32.1
        },
        {
          "timestamp": "03/24",
          "value": 32.1
        },
        {
          "timestamp": "03/25",
          "value": 34
        },
        {
          "timestamp": "03/26",
          "value": 36.1
        },
        {
          "timestamp": "03/27",
          "value": 34.8
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu002",
    "label": "GPU-002",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 45,
      "memUsage": 57,
      "temp": 66,
      "power": 733,
      "cpuUsage": 58,
      "cpuMemUsage": 38
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 45.4
        },
        {
          "timestamp": "03/15",
          "value": 43.1
        },
        {
          "timestamp": "03/16",
          "value": 45.9
        },
        {
          "timestamp": "03/17",
          "value": 46.2
        },
        {
          "timestamp": "03/18",
          "value": 51.9
        },
        {
          "timestamp": "03/19",
          "value": 48.9
        },
        {
          "timestamp": "03/20",
          "value": 44.4
        },
        {
          "timestamp": "03/21",
          "value": 46.2
        },
        {
          "timestamp": "03/22",
          "value": 42
        },
        {
          "timestamp": "03/23",
          "value": 43.8
        },
        {
          "timestamp": "03/24",
          "value": 40.9
        },
        {
          "timestamp": "03/25",
          "value": 38.5
        },
        {
          "timestamp": "03/26",
          "value": 43.5
        },
        {
          "timestamp": "03/27",
          "value": 44.5
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 57.6
        },
        {
          "timestamp": "03/15",
          "value": 62.2
        },
        {
          "timestamp": "03/16",
          "value": 57.5
        },
        {
          "timestamp": "03/17",
          "value": 61.6
        },
        {
          "timestamp": "03/18",
          "value": 64
        },
        {
          "timestamp": "03/19",
          "value": 60.7
        },
        {
          "timestamp": "03/20",
          "value": 54.8
        },
        {
          "timestamp": "03/21",
          "value": 53.7
        },
        {
          "timestamp": "03/22",
          "value": 53.7
        },
        {
          "timestamp": "03/23",
          "value": 52.8
        },
        {
          "timestamp": "03/24",
          "value": 55.5
        },
        {
          "timestamp": "03/25",
          "value": 54.2
        },
        {
          "timestamp": "03/26",
          "value": 53.5
        },
        {
          "timestamp": "03/27",
          "value": 61.5
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 65.5
        },
        {
          "timestamp": "03/15",
          "value": 67.9
        },
        {
          "timestamp": "03/16",
          "value": 71.7
        },
        {
          "timestamp": "03/17",
          "value": 70.4
        },
        {
          "timestamp": "03/18",
          "value": 73.1
        },
        {
          "timestamp": "03/19",
          "value": 68.9
        },
        {
          "timestamp": "03/20",
          "value": 66.9
        },
        {
          "timestamp": "03/21",
          "value": 65.4
        },
        {
          "timestamp": "03/22",
          "value": 61.1
        },
        {
          "timestamp": "03/23",
          "value": 58.3
        },
        {
          "timestamp": "03/24",
          "value": 61.9
        },
        {
          "timestamp": "03/25",
          "value": 60.8
        },
        {
          "timestamp": "03/26",
          "value": 64.8
        },
        {
          "timestamp": "03/27",
          "value": 69.2
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 689.9
        },
        {
          "timestamp": "03/15",
          "value": 799
        },
        {
          "timestamp": "03/16",
          "value": 771.4
        },
        {
          "timestamp": "03/17",
          "value": 804
        },
        {
          "timestamp": "03/18",
          "value": 832.6
        },
        {
          "timestamp": "03/19",
          "value": 794.7
        },
        {
          "timestamp": "03/20",
          "value": 727.8
        },
        {
          "timestamp": "03/21",
          "value": 698.8
        },
        {
          "timestamp": "03/22",
          "value": 694.8
        },
        {
          "timestamp": "03/23",
          "value": 649.5
        },
        {
          "timestamp": "03/24",
          "value": 647.5
        },
        {
          "timestamp": "03/25",
          "value": 638.6
        },
        {
          "timestamp": "03/26",
          "value": 697.5
        },
        {
          "timestamp": "03/27",
          "value": 724.8
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 53.9
        },
        {
          "timestamp": "03/15",
          "value": 65.1
        },
        {
          "timestamp": "03/16",
          "value": 66.1
        },
        {
          "timestamp": "03/17",
          "value": 66.4
        },
        {
          "timestamp": "03/18",
          "value": 64.2
        },
        {
          "timestamp": "03/19",
          "value": 60.6
        },
        {
          "timestamp": "03/20",
          "value": 53.1
        },
        {
          "timestamp": "03/21",
          "value": 52.1
        },
        {
          "timestamp": "03/22",
          "value": 49.6
        },
        {
          "timestamp": "03/23",
          "value": 51.9
        },
        {
          "timestamp": "03/24",
          "value": 57.4
        },
        {
          "timestamp": "03/25",
          "value": 52
        },
        {
          "timestamp": "03/26",
          "value": 57.3
        },
        {
          "timestamp": "03/27",
          "value": 55.3
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 36.7
        },
        {
          "timestamp": "03/15",
          "value": 37.3
        },
        {
          "timestamp": "03/16",
          "value": 40.3
        },
        {
          "timestamp": "03/17",
          "value": 44.1
        },
        {
          "timestamp": "03/18",
          "value": 40.2
        },
        {
          "timestamp": "03/19",
          "value": 42.7
        },
        {
          "timestamp": "03/20",
          "value": 41.1
        },
        {
          "timestamp": "03/21",
          "value": 36.1
        },
        {
          "timestamp": "03/22",
          "value": 35.9
        },
        {
          "timestamp": "03/23",
          "value": 34.2
        },
        {
          "timestamp": "03/24",
          "value": 32.7
        },
        {
          "timestamp": "03/25",
          "value": 37.7
        },
        {
          "timestamp": "03/26",
          "value": 35.6
        },
        {
          "timestamp": "03/27",
          "value": 40.2
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu003",
    "label": "GPU-003",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 60,
      "memUsage": 65,
      "temp": 61,
      "power": 543,
      "cpuUsage": 70,
      "cpuMemUsage": 71
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 62.7
        },
        {
          "timestamp": "03/15",
          "value": 64.3
        },
        {
          "timestamp": "03/16",
          "value": 63.4
        },
        {
          "timestamp": "03/17",
          "value": 60.6
        },
        {
          "timestamp": "03/18",
          "value": 68.2
        },
        {
          "timestamp": "03/19",
          "value": 66.5
        },
        {
          "timestamp": "03/20",
          "value": 57.3
        },
        {
          "timestamp": "03/21",
          "value": 56
        },
        {
          "timestamp": "03/22",
          "value": 54.5
        },
        {
          "timestamp": "03/23",
          "value": 49.7
        },
        {
          "timestamp": "03/24",
          "value": 57
        },
        {
          "timestamp": "03/25",
          "value": 52.9
        },
        {
          "timestamp": "03/26",
          "value": 56.7
        },
        {
          "timestamp": "03/27",
          "value": 56.7
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 62.8
        },
        {
          "timestamp": "03/15",
          "value": 65.5
        },
        {
          "timestamp": "03/16",
          "value": 66.3
        },
        {
          "timestamp": "03/17",
          "value": 74
        },
        {
          "timestamp": "03/18",
          "value": 71.6
        },
        {
          "timestamp": "03/19",
          "value": 66.1
        },
        {
          "timestamp": "03/20",
          "value": 66.9
        },
        {
          "timestamp": "03/21",
          "value": 60.7
        },
        {
          "timestamp": "03/22",
          "value": 63.2
        },
        {
          "timestamp": "03/23",
          "value": 56.2
        },
        {
          "timestamp": "03/24",
          "value": 56.1
        },
        {
          "timestamp": "03/25",
          "value": 59.1
        },
        {
          "timestamp": "03/26",
          "value": 62.4
        },
        {
          "timestamp": "03/27",
          "value": 69.6
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 63.2
        },
        {
          "timestamp": "03/15",
          "value": 61.7
        },
        {
          "timestamp": "03/16",
          "value": 66.6
        },
        {
          "timestamp": "03/17",
          "value": 68.8
        },
        {
          "timestamp": "03/18",
          "value": 68.2
        },
        {
          "timestamp": "03/19",
          "value": 63.7
        },
        {
          "timestamp": "03/20",
          "value": 62.8
        },
        {
          "timestamp": "03/21",
          "value": 57.1
        },
        {
          "timestamp": "03/22",
          "value": 58.5
        },
        {
          "timestamp": "03/23",
          "value": 53.8
        },
        {
          "timestamp": "03/24",
          "value": 55.8
        },
        {
          "timestamp": "03/25",
          "value": 58.5
        },
        {
          "timestamp": "03/26",
          "value": 57.6
        },
        {
          "timestamp": "03/27",
          "value": 63.3
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 524.7
        },
        {
          "timestamp": "03/15",
          "value": 552.4
        },
        {
          "timestamp": "03/16",
          "value": 618.2
        },
        {
          "timestamp": "03/17",
          "value": 628.8
        },
        {
          "timestamp": "03/18",
          "value": 612.4
        },
        {
          "timestamp": "03/19",
          "value": 558.5
        },
        {
          "timestamp": "03/20",
          "value": 527.8
        },
        {
          "timestamp": "03/21",
          "value": 501.1
        },
        {
          "timestamp": "03/22",
          "value": 498.6
        },
        {
          "timestamp": "03/23",
          "value": 482.2
        },
        {
          "timestamp": "03/24",
          "value": 510.5
        },
        {
          "timestamp": "03/25",
          "value": 522.9
        },
        {
          "timestamp": "03/26",
          "value": 496.3
        },
        {
          "timestamp": "03/27",
          "value": 575.5
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 71.6
        },
        {
          "timestamp": "03/15",
          "value": 77.1
        },
        {
          "timestamp": "03/16",
          "value": 78.2
        },
        {
          "timestamp": "03/17",
          "value": 77.3
        },
        {
          "timestamp": "03/18",
          "value": 76.7
        },
        {
          "timestamp": "03/19",
          "value": 78.3
        },
        {
          "timestamp": "03/20",
          "value": 70.1
        },
        {
          "timestamp": "03/21",
          "value": 62.2
        },
        {
          "timestamp": "03/22",
          "value": 69.4
        },
        {
          "timestamp": "03/23",
          "value": 60.4
        },
        {
          "timestamp": "03/24",
          "value": 58
        },
        {
          "timestamp": "03/25",
          "value": 70.3
        },
        {
          "timestamp": "03/26",
          "value": 67.3
        },
        {
          "timestamp": "03/27",
          "value": 74.7
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 72
        },
        {
          "timestamp": "03/15",
          "value": 76.2
        },
        {
          "timestamp": "03/16",
          "value": 72.6
        },
        {
          "timestamp": "03/17",
          "value": 74.6
        },
        {
          "timestamp": "03/18",
          "value": 79.3
        },
        {
          "timestamp": "03/19",
          "value": 79
        },
        {
          "timestamp": "03/20",
          "value": 67.6
        },
        {
          "timestamp": "03/21",
          "value": 68.8
        },
        {
          "timestamp": "03/22",
          "value": 62.6
        },
        {
          "timestamp": "03/23",
          "value": 64.6
        },
        {
          "timestamp": "03/24",
          "value": 62.5
        },
        {
          "timestamp": "03/25",
          "value": 70.3
        },
        {
          "timestamp": "03/26",
          "value": 73.1
        },
        {
          "timestamp": "03/27",
          "value": 75
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu004",
    "label": "GPU-004",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 67,
      "memUsage": 66,
      "temp": 70,
      "power": 745,
      "cpuUsage": 45,
      "cpuMemUsage": 77
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 68.5
        },
        {
          "timestamp": "03/15",
          "value": 66.8
        },
        {
          "timestamp": "03/16",
          "value": 69.6
        },
        {
          "timestamp": "03/17",
          "value": 73.4
        },
        {
          "timestamp": "03/18",
          "value": 71.3
        },
        {
          "timestamp": "03/19",
          "value": 74.9
        },
        {
          "timestamp": "03/20",
          "value": 63.3
        },
        {
          "timestamp": "03/21",
          "value": 69.8
        },
        {
          "timestamp": "03/22",
          "value": 59.1
        },
        {
          "timestamp": "03/23",
          "value": 61.3
        },
        {
          "timestamp": "03/24",
          "value": 58.4
        },
        {
          "timestamp": "03/25",
          "value": 66.7
        },
        {
          "timestamp": "03/26",
          "value": 68.1
        },
        {
          "timestamp": "03/27",
          "value": 68.3
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 62.4
        },
        {
          "timestamp": "03/15",
          "value": 65.7
        },
        {
          "timestamp": "03/16",
          "value": 69.9
        },
        {
          "timestamp": "03/17",
          "value": 74.2
        },
        {
          "timestamp": "03/18",
          "value": 67.9
        },
        {
          "timestamp": "03/19",
          "value": 66.5
        },
        {
          "timestamp": "03/20",
          "value": 68
        },
        {
          "timestamp": "03/21",
          "value": 61
        },
        {
          "timestamp": "03/22",
          "value": 60.8
        },
        {
          "timestamp": "03/23",
          "value": 59.2
        },
        {
          "timestamp": "03/24",
          "value": 59
        },
        {
          "timestamp": "03/25",
          "value": 65.4
        },
        {
          "timestamp": "03/26",
          "value": 68.9
        },
        {
          "timestamp": "03/27",
          "value": 67.8
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 67.9
        },
        {
          "timestamp": "03/15",
          "value": 71.3
        },
        {
          "timestamp": "03/16",
          "value": 73.2
        },
        {
          "timestamp": "03/17",
          "value": 74.7
        },
        {
          "timestamp": "03/18",
          "value": 74.4
        },
        {
          "timestamp": "03/19",
          "value": 73.2
        },
        {
          "timestamp": "03/20",
          "value": 70.3
        },
        {
          "timestamp": "03/21",
          "value": 69.8
        },
        {
          "timestamp": "03/22",
          "value": 67.1
        },
        {
          "timestamp": "03/23",
          "value": 64.9
        },
        {
          "timestamp": "03/24",
          "value": 64.4
        },
        {
          "timestamp": "03/25",
          "value": 64
        },
        {
          "timestamp": "03/26",
          "value": 65.4
        },
        {
          "timestamp": "03/27",
          "value": 70.2
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 756
        },
        {
          "timestamp": "03/15",
          "value": 822.5
        },
        {
          "timestamp": "03/16",
          "value": 832.4
        },
        {
          "timestamp": "03/17",
          "value": 836.1
        },
        {
          "timestamp": "03/18",
          "value": 789.9
        },
        {
          "timestamp": "03/19",
          "value": 777
        },
        {
          "timestamp": "03/20",
          "value": 725
        },
        {
          "timestamp": "03/21",
          "value": 749.2
        },
        {
          "timestamp": "03/22",
          "value": 670.7
        },
        {
          "timestamp": "03/23",
          "value": 669.9
        },
        {
          "timestamp": "03/24",
          "value": 651.6
        },
        {
          "timestamp": "03/25",
          "value": 686.6
        },
        {
          "timestamp": "03/26",
          "value": 708.6
        },
        {
          "timestamp": "03/27",
          "value": 752.5
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 40.7
        },
        {
          "timestamp": "03/15",
          "value": 51.1
        },
        {
          "timestamp": "03/16",
          "value": 49.5
        },
        {
          "timestamp": "03/17",
          "value": 46.5
        },
        {
          "timestamp": "03/18",
          "value": 47.3
        },
        {
          "timestamp": "03/19",
          "value": 51
        },
        {
          "timestamp": "03/20",
          "value": 41.9
        },
        {
          "timestamp": "03/21",
          "value": 44.7
        },
        {
          "timestamp": "03/22",
          "value": 42.8
        },
        {
          "timestamp": "03/23",
          "value": 36.5
        },
        {
          "timestamp": "03/24",
          "value": 36.5
        },
        {
          "timestamp": "03/25",
          "value": 39.2
        },
        {
          "timestamp": "03/26",
          "value": 44.9
        },
        {
          "timestamp": "03/27",
          "value": 49.2
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 78.9
        },
        {
          "timestamp": "03/15",
          "value": 80.2
        },
        {
          "timestamp": "03/16",
          "value": 78.2
        },
        {
          "timestamp": "03/17",
          "value": 86.3
        },
        {
          "timestamp": "03/18",
          "value": 78.9
        },
        {
          "timestamp": "03/19",
          "value": 87
        },
        {
          "timestamp": "03/20",
          "value": 81.3
        },
        {
          "timestamp": "03/21",
          "value": 69
        },
        {
          "timestamp": "03/22",
          "value": 69.2
        },
        {
          "timestamp": "03/23",
          "value": 74.8
        },
        {
          "timestamp": "03/24",
          "value": 65.5
        },
        {
          "timestamp": "03/25",
          "value": 75.3
        },
        {
          "timestamp": "03/26",
          "value": 71.3
        },
        {
          "timestamp": "03/27",
          "value": 80.9
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu005",
    "label": "GPU-005",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "err",
    "current": {
      "gpuUsage": 0,
      "memUsage": 0,
      "temp": 0,
      "power": 0,
      "cpuUsage": 0,
      "cpuMemUsage": 0
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu006",
    "label": "GPU-006",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 72,
      "memUsage": 41,
      "temp": 70,
      "power": 794,
      "cpuUsage": 20,
      "cpuMemUsage": 46
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 75.5
        },
        {
          "timestamp": "03/15",
          "value": 72.7
        },
        {
          "timestamp": "03/16",
          "value": 78.9
        },
        {
          "timestamp": "03/17",
          "value": 76.5
        },
        {
          "timestamp": "03/18",
          "value": 80.7
        },
        {
          "timestamp": "03/19",
          "value": 75
        },
        {
          "timestamp": "03/20",
          "value": 73.9
        },
        {
          "timestamp": "03/21",
          "value": 63.6
        },
        {
          "timestamp": "03/22",
          "value": 68.3
        },
        {
          "timestamp": "03/23",
          "value": 71
        },
        {
          "timestamp": "03/24",
          "value": 63.3
        },
        {
          "timestamp": "03/25",
          "value": 60.8
        },
        {
          "timestamp": "03/26",
          "value": 64.5
        },
        {
          "timestamp": "03/27",
          "value": 67.5
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 43.9
        },
        {
          "timestamp": "03/15",
          "value": 45.9
        },
        {
          "timestamp": "03/16",
          "value": 44
        },
        {
          "timestamp": "03/17",
          "value": 42.4
        },
        {
          "timestamp": "03/18",
          "value": 42
        },
        {
          "timestamp": "03/19",
          "value": 45.9
        },
        {
          "timestamp": "03/20",
          "value": 40.3
        },
        {
          "timestamp": "03/21",
          "value": 38.1
        },
        {
          "timestamp": "03/22",
          "value": 36.4
        },
        {
          "timestamp": "03/23",
          "value": 34.6
        },
        {
          "timestamp": "03/24",
          "value": 39.5
        },
        {
          "timestamp": "03/25",
          "value": 40.7
        },
        {
          "timestamp": "03/26",
          "value": 38.2
        },
        {
          "timestamp": "03/27",
          "value": 39.8
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 68.7
        },
        {
          "timestamp": "03/15",
          "value": 73.5
        },
        {
          "timestamp": "03/16",
          "value": 77.2
        },
        {
          "timestamp": "03/17",
          "value": 75.4
        },
        {
          "timestamp": "03/18",
          "value": 78.1
        },
        {
          "timestamp": "03/19",
          "value": 73.3
        },
        {
          "timestamp": "03/20",
          "value": 69.5
        },
        {
          "timestamp": "03/21",
          "value": 66.1
        },
        {
          "timestamp": "03/22",
          "value": 62.2
        },
        {
          "timestamp": "03/23",
          "value": 65.1
        },
        {
          "timestamp": "03/24",
          "value": 64.7
        },
        {
          "timestamp": "03/25",
          "value": 64.5
        },
        {
          "timestamp": "03/26",
          "value": 66.2
        },
        {
          "timestamp": "03/27",
          "value": 73.6
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 786.8
        },
        {
          "timestamp": "03/15",
          "value": 849.2
        },
        {
          "timestamp": "03/16",
          "value": 813.7
        },
        {
          "timestamp": "03/17",
          "value": 884.5
        },
        {
          "timestamp": "03/18",
          "value": 837.4
        },
        {
          "timestamp": "03/19",
          "value": 798.4
        },
        {
          "timestamp": "03/20",
          "value": 772.9
        },
        {
          "timestamp": "03/21",
          "value": 732.7
        },
        {
          "timestamp": "03/22",
          "value": 753.8
        },
        {
          "timestamp": "03/23",
          "value": 716.9
        },
        {
          "timestamp": "03/24",
          "value": 683.8
        },
        {
          "timestamp": "03/25",
          "value": 693.2
        },
        {
          "timestamp": "03/26",
          "value": 770.2
        },
        {
          "timestamp": "03/27",
          "value": 780.2
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 21.7
        },
        {
          "timestamp": "03/15",
          "value": 21.7
        },
        {
          "timestamp": "03/16",
          "value": 21.6
        },
        {
          "timestamp": "03/17",
          "value": 20.7
        },
        {
          "timestamp": "03/18",
          "value": 22.5
        },
        {
          "timestamp": "03/19",
          "value": 21.4
        },
        {
          "timestamp": "03/20",
          "value": 18.4
        },
        {
          "timestamp": "03/21",
          "value": 20.4
        },
        {
          "timestamp": "03/22",
          "value": 17.8
        },
        {
          "timestamp": "03/23",
          "value": 19.4
        },
        {
          "timestamp": "03/24",
          "value": 19.3
        },
        {
          "timestamp": "03/25",
          "value": 18.7
        },
        {
          "timestamp": "03/26",
          "value": 20.8
        },
        {
          "timestamp": "03/27",
          "value": 20.1
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 44.1
        },
        {
          "timestamp": "03/15",
          "value": 47.5
        },
        {
          "timestamp": "03/16",
          "value": 51.6
        },
        {
          "timestamp": "03/17",
          "value": 51.5
        },
        {
          "timestamp": "03/18",
          "value": 48.9
        },
        {
          "timestamp": "03/19",
          "value": 47.6
        },
        {
          "timestamp": "03/20",
          "value": 43.8
        },
        {
          "timestamp": "03/21",
          "value": 42.3
        },
        {
          "timestamp": "03/22",
          "value": 45
        },
        {
          "timestamp": "03/23",
          "value": 41.8
        },
        {
          "timestamp": "03/24",
          "value": 41.8
        },
        {
          "timestamp": "03/25",
          "value": 43.2
        },
        {
          "timestamp": "03/26",
          "value": 44.3
        },
        {
          "timestamp": "03/27",
          "value": 47.7
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu007",
    "label": "GPU-007",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 37,
      "memUsage": 74,
      "temp": 61,
      "power": 370,
      "cpuUsage": 37,
      "cpuMemUsage": 53
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 36.5
        },
        {
          "timestamp": "03/15",
          "value": 40.2
        },
        {
          "timestamp": "03/16",
          "value": 40.6
        },
        {
          "timestamp": "03/17",
          "value": 41.4
        },
        {
          "timestamp": "03/18",
          "value": 41.9
        },
        {
          "timestamp": "03/19",
          "value": 36.4
        },
        {
          "timestamp": "03/20",
          "value": 39.6
        },
        {
          "timestamp": "03/21",
          "value": 34.5
        },
        {
          "timestamp": "03/22",
          "value": 31.7
        },
        {
          "timestamp": "03/23",
          "value": 34.6
        },
        {
          "timestamp": "03/24",
          "value": 34.3
        },
        {
          "timestamp": "03/25",
          "value": 34.2
        },
        {
          "timestamp": "03/26",
          "value": 38.2
        },
        {
          "timestamp": "03/27",
          "value": 35.1
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 68.8
        },
        {
          "timestamp": "03/15",
          "value": 79.1
        },
        {
          "timestamp": "03/16",
          "value": 75.1
        },
        {
          "timestamp": "03/17",
          "value": 78.4
        },
        {
          "timestamp": "03/18",
          "value": 80.2
        },
        {
          "timestamp": "03/19",
          "value": 79.6
        },
        {
          "timestamp": "03/20",
          "value": 75.8
        },
        {
          "timestamp": "03/21",
          "value": 74.1
        },
        {
          "timestamp": "03/22",
          "value": 70.2
        },
        {
          "timestamp": "03/23",
          "value": 70.9
        },
        {
          "timestamp": "03/24",
          "value": 62.6
        },
        {
          "timestamp": "03/25",
          "value": 71.3
        },
        {
          "timestamp": "03/26",
          "value": 70.5
        },
        {
          "timestamp": "03/27",
          "value": 80.2
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 62
        },
        {
          "timestamp": "03/15",
          "value": 61.8
        },
        {
          "timestamp": "03/16",
          "value": 66.5
        },
        {
          "timestamp": "03/17",
          "value": 66.9
        },
        {
          "timestamp": "03/18",
          "value": 69
        },
        {
          "timestamp": "03/19",
          "value": 65.8
        },
        {
          "timestamp": "03/20",
          "value": 64.1
        },
        {
          "timestamp": "03/21",
          "value": 57.7
        },
        {
          "timestamp": "03/22",
          "value": 55.2
        },
        {
          "timestamp": "03/23",
          "value": 56
        },
        {
          "timestamp": "03/24",
          "value": 56.2
        },
        {
          "timestamp": "03/25",
          "value": 57.9
        },
        {
          "timestamp": "03/26",
          "value": 57.7
        },
        {
          "timestamp": "03/27",
          "value": 62.6
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 353.3
        },
        {
          "timestamp": "03/15",
          "value": 400.6
        },
        {
          "timestamp": "03/16",
          "value": 392.1
        },
        {
          "timestamp": "03/17",
          "value": 422.6
        },
        {
          "timestamp": "03/18",
          "value": 387.8
        },
        {
          "timestamp": "03/19",
          "value": 413.8
        },
        {
          "timestamp": "03/20",
          "value": 362.5
        },
        {
          "timestamp": "03/21",
          "value": 341.2
        },
        {
          "timestamp": "03/22",
          "value": 333.2
        },
        {
          "timestamp": "03/23",
          "value": 346.8
        },
        {
          "timestamp": "03/24",
          "value": 353.7
        },
        {
          "timestamp": "03/25",
          "value": 333
        },
        {
          "timestamp": "03/26",
          "value": 381
        },
        {
          "timestamp": "03/27",
          "value": 398.9
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 40.1
        },
        {
          "timestamp": "03/15",
          "value": 40.3
        },
        {
          "timestamp": "03/16",
          "value": 39.4
        },
        {
          "timestamp": "03/17",
          "value": 41
        },
        {
          "timestamp": "03/18",
          "value": 38.6
        },
        {
          "timestamp": "03/19",
          "value": 41
        },
        {
          "timestamp": "03/20",
          "value": 39.8
        },
        {
          "timestamp": "03/21",
          "value": 33.8
        },
        {
          "timestamp": "03/22",
          "value": 35.9
        },
        {
          "timestamp": "03/23",
          "value": 32.8
        },
        {
          "timestamp": "03/24",
          "value": 36.2
        },
        {
          "timestamp": "03/25",
          "value": 32.6
        },
        {
          "timestamp": "03/26",
          "value": 34
        },
        {
          "timestamp": "03/27",
          "value": 38.2
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 52.7
        },
        {
          "timestamp": "03/15",
          "value": 52.1
        },
        {
          "timestamp": "03/16",
          "value": 54.5
        },
        {
          "timestamp": "03/17",
          "value": 59.5
        },
        {
          "timestamp": "03/18",
          "value": 61
        },
        {
          "timestamp": "03/19",
          "value": 57.6
        },
        {
          "timestamp": "03/20",
          "value": 50.2
        },
        {
          "timestamp": "03/21",
          "value": 48.1
        },
        {
          "timestamp": "03/22",
          "value": 47.4
        },
        {
          "timestamp": "03/23",
          "value": 46.9
        },
        {
          "timestamp": "03/24",
          "value": 46.5
        },
        {
          "timestamp": "03/25",
          "value": 48.8
        },
        {
          "timestamp": "03/26",
          "value": 54
        },
        {
          "timestamp": "03/27",
          "value": 55.7
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu008",
    "label": "GPU-008",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 64,
      "memUsage": 36,
      "temp": 58,
      "power": 533,
      "cpuUsage": 22,
      "cpuMemUsage": 60
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 62.9
        },
        {
          "timestamp": "03/15",
          "value": 72.6
        },
        {
          "timestamp": "03/16",
          "value": 65.1
        },
        {
          "timestamp": "03/17",
          "value": 65.7
        },
        {
          "timestamp": "03/18",
          "value": 64.9
        },
        {
          "timestamp": "03/19",
          "value": 63.8
        },
        {
          "timestamp": "03/20",
          "value": 66.7
        },
        {
          "timestamp": "03/21",
          "value": 65.6
        },
        {
          "timestamp": "03/22",
          "value": 56.8
        },
        {
          "timestamp": "03/23",
          "value": 58.9
        },
        {
          "timestamp": "03/24",
          "value": 54.2
        },
        {
          "timestamp": "03/25",
          "value": 60.9
        },
        {
          "timestamp": "03/26",
          "value": 67.6
        },
        {
          "timestamp": "03/27",
          "value": 64.3
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 33.4
        },
        {
          "timestamp": "03/15",
          "value": 37.3
        },
        {
          "timestamp": "03/16",
          "value": 40.1
        },
        {
          "timestamp": "03/17",
          "value": 41.1
        },
        {
          "timestamp": "03/18",
          "value": 37.5
        },
        {
          "timestamp": "03/19",
          "value": 36.7
        },
        {
          "timestamp": "03/20",
          "value": 35.7
        },
        {
          "timestamp": "03/21",
          "value": 35.4
        },
        {
          "timestamp": "03/22",
          "value": 31.2
        },
        {
          "timestamp": "03/23",
          "value": 32.5
        },
        {
          "timestamp": "03/24",
          "value": 34.3
        },
        {
          "timestamp": "03/25",
          "value": 33.6
        },
        {
          "timestamp": "03/26",
          "value": 36.6
        },
        {
          "timestamp": "03/27",
          "value": 39.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 57.7
        },
        {
          "timestamp": "03/15",
          "value": 62.9
        },
        {
          "timestamp": "03/16",
          "value": 63
        },
        {
          "timestamp": "03/17",
          "value": 62.6
        },
        {
          "timestamp": "03/18",
          "value": 63.4
        },
        {
          "timestamp": "03/19",
          "value": 62.3
        },
        {
          "timestamp": "03/20",
          "value": 58
        },
        {
          "timestamp": "03/21",
          "value": 57.5
        },
        {
          "timestamp": "03/22",
          "value": 54.4
        },
        {
          "timestamp": "03/23",
          "value": 50.1
        },
        {
          "timestamp": "03/24",
          "value": 51.7
        },
        {
          "timestamp": "03/25",
          "value": 54.3
        },
        {
          "timestamp": "03/26",
          "value": 54.7
        },
        {
          "timestamp": "03/27",
          "value": 58.3
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 532.5
        },
        {
          "timestamp": "03/15",
          "value": 528.6
        },
        {
          "timestamp": "03/16",
          "value": 547
        },
        {
          "timestamp": "03/17",
          "value": 588.1
        },
        {
          "timestamp": "03/18",
          "value": 564
        },
        {
          "timestamp": "03/19",
          "value": 563.3
        },
        {
          "timestamp": "03/20",
          "value": 523.8
        },
        {
          "timestamp": "03/21",
          "value": 517.4
        },
        {
          "timestamp": "03/22",
          "value": 522.3
        },
        {
          "timestamp": "03/23",
          "value": 509.3
        },
        {
          "timestamp": "03/24",
          "value": 497.2
        },
        {
          "timestamp": "03/25",
          "value": 491.6
        },
        {
          "timestamp": "03/26",
          "value": 505.6
        },
        {
          "timestamp": "03/27",
          "value": 575.4
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 19.9
        },
        {
          "timestamp": "03/15",
          "value": 22.2
        },
        {
          "timestamp": "03/16",
          "value": 24.1
        },
        {
          "timestamp": "03/17",
          "value": 23
        },
        {
          "timestamp": "03/18",
          "value": 25.4
        },
        {
          "timestamp": "03/19",
          "value": 21.3
        },
        {
          "timestamp": "03/20",
          "value": 21.6
        },
        {
          "timestamp": "03/21",
          "value": 20
        },
        {
          "timestamp": "03/22",
          "value": 20.9
        },
        {
          "timestamp": "03/23",
          "value": 18
        },
        {
          "timestamp": "03/24",
          "value": 20.3
        },
        {
          "timestamp": "03/25",
          "value": 18.8
        },
        {
          "timestamp": "03/26",
          "value": 23.5
        },
        {
          "timestamp": "03/27",
          "value": 21.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 57.2
        },
        {
          "timestamp": "03/15",
          "value": 66.7
        },
        {
          "timestamp": "03/16",
          "value": 65.3
        },
        {
          "timestamp": "03/17",
          "value": 64.1
        },
        {
          "timestamp": "03/18",
          "value": 63.7
        },
        {
          "timestamp": "03/19",
          "value": 60.5
        },
        {
          "timestamp": "03/20",
          "value": 60.9
        },
        {
          "timestamp": "03/21",
          "value": 59.4
        },
        {
          "timestamp": "03/22",
          "value": 54.6
        },
        {
          "timestamp": "03/23",
          "value": 58
        },
        {
          "timestamp": "03/24",
          "value": 55.9
        },
        {
          "timestamp": "03/25",
          "value": 53.5
        },
        {
          "timestamp": "03/26",
          "value": 60.3
        },
        {
          "timestamp": "03/27",
          "value": 61.2
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu009",
    "label": "GPU-009",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 54,
      "memUsage": 34,
      "temp": 58,
      "power": 512,
      "cpuUsage": 72,
      "cpuMemUsage": 74
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 56.7
        },
        {
          "timestamp": "03/15",
          "value": 57.2
        },
        {
          "timestamp": "03/16",
          "value": 55.4
        },
        {
          "timestamp": "03/17",
          "value": 60.8
        },
        {
          "timestamp": "03/18",
          "value": 58.6
        },
        {
          "timestamp": "03/19",
          "value": 59.9
        },
        {
          "timestamp": "03/20",
          "value": 55.4
        },
        {
          "timestamp": "03/21",
          "value": 52.8
        },
        {
          "timestamp": "03/22",
          "value": 51.8
        },
        {
          "timestamp": "03/23",
          "value": 48
        },
        {
          "timestamp": "03/24",
          "value": 48.6
        },
        {
          "timestamp": "03/25",
          "value": 52.6
        },
        {
          "timestamp": "03/26",
          "value": 49
        },
        {
          "timestamp": "03/27",
          "value": 55
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 33.7
        },
        {
          "timestamp": "03/15",
          "value": 34.9
        },
        {
          "timestamp": "03/16",
          "value": 38.4
        },
        {
          "timestamp": "03/17",
          "value": 35.5
        },
        {
          "timestamp": "03/18",
          "value": 37.4
        },
        {
          "timestamp": "03/19",
          "value": 34.6
        },
        {
          "timestamp": "03/20",
          "value": 34.8
        },
        {
          "timestamp": "03/21",
          "value": 32.9
        },
        {
          "timestamp": "03/22",
          "value": 30.2
        },
        {
          "timestamp": "03/23",
          "value": 29.5
        },
        {
          "timestamp": "03/24",
          "value": 29.7
        },
        {
          "timestamp": "03/25",
          "value": 33.1
        },
        {
          "timestamp": "03/26",
          "value": 34.8
        },
        {
          "timestamp": "03/27",
          "value": 33.4
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 59.1
        },
        {
          "timestamp": "03/15",
          "value": 59.3
        },
        {
          "timestamp": "03/16",
          "value": 61.3
        },
        {
          "timestamp": "03/17",
          "value": 62.3
        },
        {
          "timestamp": "03/18",
          "value": 65.5
        },
        {
          "timestamp": "03/19",
          "value": 63.2
        },
        {
          "timestamp": "03/20",
          "value": 56.9
        },
        {
          "timestamp": "03/21",
          "value": 53.8
        },
        {
          "timestamp": "03/22",
          "value": 55.3
        },
        {
          "timestamp": "03/23",
          "value": 53.5
        },
        {
          "timestamp": "03/24",
          "value": 53.8
        },
        {
          "timestamp": "03/25",
          "value": 52.1
        },
        {
          "timestamp": "03/26",
          "value": 54.2
        },
        {
          "timestamp": "03/27",
          "value": 57.3
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 505.4
        },
        {
          "timestamp": "03/15",
          "value": 551
        },
        {
          "timestamp": "03/16",
          "value": 533.5
        },
        {
          "timestamp": "03/17",
          "value": 547.7
        },
        {
          "timestamp": "03/18",
          "value": 547.4
        },
        {
          "timestamp": "03/19",
          "value": 569.4
        },
        {
          "timestamp": "03/20",
          "value": 542.9
        },
        {
          "timestamp": "03/21",
          "value": 504.2
        },
        {
          "timestamp": "03/22",
          "value": 448.1
        },
        {
          "timestamp": "03/23",
          "value": 465.4
        },
        {
          "timestamp": "03/24",
          "value": 461.9
        },
        {
          "timestamp": "03/25",
          "value": 463.4
        },
        {
          "timestamp": "03/26",
          "value": 485.9
        },
        {
          "timestamp": "03/27",
          "value": 548.4
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 76.9
        },
        {
          "timestamp": "03/15",
          "value": 78.6
        },
        {
          "timestamp": "03/16",
          "value": 76.6
        },
        {
          "timestamp": "03/17",
          "value": 78.5
        },
        {
          "timestamp": "03/18",
          "value": 82.9
        },
        {
          "timestamp": "03/19",
          "value": 70.4
        },
        {
          "timestamp": "03/20",
          "value": 73.8
        },
        {
          "timestamp": "03/21",
          "value": 72.1
        },
        {
          "timestamp": "03/22",
          "value": 62.7
        },
        {
          "timestamp": "03/23",
          "value": 69.7
        },
        {
          "timestamp": "03/24",
          "value": 60.8
        },
        {
          "timestamp": "03/25",
          "value": 60.5
        },
        {
          "timestamp": "03/26",
          "value": 77.2
        },
        {
          "timestamp": "03/27",
          "value": 70.2
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 72.2
        },
        {
          "timestamp": "03/15",
          "value": 76.9
        },
        {
          "timestamp": "03/16",
          "value": 84.9
        },
        {
          "timestamp": "03/17",
          "value": 83.1
        },
        {
          "timestamp": "03/18",
          "value": 85.1
        },
        {
          "timestamp": "03/19",
          "value": 73.3
        },
        {
          "timestamp": "03/20",
          "value": 72.6
        },
        {
          "timestamp": "03/21",
          "value": 75.4
        },
        {
          "timestamp": "03/22",
          "value": 68.8
        },
        {
          "timestamp": "03/23",
          "value": 62.6
        },
        {
          "timestamp": "03/24",
          "value": 62.2
        },
        {
          "timestamp": "03/25",
          "value": 68.5
        },
        {
          "timestamp": "03/26",
          "value": 76.6
        },
        {
          "timestamp": "03/27",
          "value": 77.3
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu010",
    "label": "GPU-010",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 75,
      "memUsage": 58,
      "temp": 63,
      "power": 449,
      "cpuUsage": 44,
      "cpuMemUsage": 44
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 79
        },
        {
          "timestamp": "03/15",
          "value": 77.7
        },
        {
          "timestamp": "03/16",
          "value": 85.2
        },
        {
          "timestamp": "03/17",
          "value": 85.2
        },
        {
          "timestamp": "03/18",
          "value": 84.3
        },
        {
          "timestamp": "03/19",
          "value": 80.1
        },
        {
          "timestamp": "03/20",
          "value": 74.8
        },
        {
          "timestamp": "03/21",
          "value": 68.2
        },
        {
          "timestamp": "03/22",
          "value": 65.5
        },
        {
          "timestamp": "03/23",
          "value": 69.4
        },
        {
          "timestamp": "03/24",
          "value": 63.5
        },
        {
          "timestamp": "03/25",
          "value": 69.9
        },
        {
          "timestamp": "03/26",
          "value": 77.6
        },
        {
          "timestamp": "03/27",
          "value": 78
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 58.6
        },
        {
          "timestamp": "03/15",
          "value": 60.8
        },
        {
          "timestamp": "03/16",
          "value": 62.2
        },
        {
          "timestamp": "03/17",
          "value": 64
        },
        {
          "timestamp": "03/18",
          "value": 60.8
        },
        {
          "timestamp": "03/19",
          "value": 63.5
        },
        {
          "timestamp": "03/20",
          "value": 56.8
        },
        {
          "timestamp": "03/21",
          "value": 52
        },
        {
          "timestamp": "03/22",
          "value": 52.4
        },
        {
          "timestamp": "03/23",
          "value": 50.4
        },
        {
          "timestamp": "03/24",
          "value": 51.1
        },
        {
          "timestamp": "03/25",
          "value": 51.2
        },
        {
          "timestamp": "03/26",
          "value": 55.5
        },
        {
          "timestamp": "03/27",
          "value": 62
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 63.7
        },
        {
          "timestamp": "03/15",
          "value": 64.9
        },
        {
          "timestamp": "03/16",
          "value": 69.9
        },
        {
          "timestamp": "03/17",
          "value": 68.9
        },
        {
          "timestamp": "03/18",
          "value": 67.4
        },
        {
          "timestamp": "03/19",
          "value": 67.8
        },
        {
          "timestamp": "03/20",
          "value": 64.7
        },
        {
          "timestamp": "03/21",
          "value": 62.8
        },
        {
          "timestamp": "03/22",
          "value": 60.3
        },
        {
          "timestamp": "03/23",
          "value": 57.3
        },
        {
          "timestamp": "03/24",
          "value": 55.3
        },
        {
          "timestamp": "03/25",
          "value": 59.5
        },
        {
          "timestamp": "03/26",
          "value": 62.9
        },
        {
          "timestamp": "03/27",
          "value": 65.3
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 443
        },
        {
          "timestamp": "03/15",
          "value": 448.4
        },
        {
          "timestamp": "03/16",
          "value": 482.5
        },
        {
          "timestamp": "03/17",
          "value": 480.2
        },
        {
          "timestamp": "03/18",
          "value": 516
        },
        {
          "timestamp": "03/19",
          "value": 497.7
        },
        {
          "timestamp": "03/20",
          "value": 469.5
        },
        {
          "timestamp": "03/21",
          "value": 429.4
        },
        {
          "timestamp": "03/22",
          "value": 438.4
        },
        {
          "timestamp": "03/23",
          "value": 401
        },
        {
          "timestamp": "03/24",
          "value": 383
        },
        {
          "timestamp": "03/25",
          "value": 416.4
        },
        {
          "timestamp": "03/26",
          "value": 428.7
        },
        {
          "timestamp": "03/27",
          "value": 455.7
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 46.6
        },
        {
          "timestamp": "03/15",
          "value": 48.2
        },
        {
          "timestamp": "03/16",
          "value": 48.3
        },
        {
          "timestamp": "03/17",
          "value": 52.8
        },
        {
          "timestamp": "03/18",
          "value": 50.1
        },
        {
          "timestamp": "03/19",
          "value": 50.1
        },
        {
          "timestamp": "03/20",
          "value": 46.3
        },
        {
          "timestamp": "03/21",
          "value": 38.7
        },
        {
          "timestamp": "03/22",
          "value": 45
        },
        {
          "timestamp": "03/23",
          "value": 39
        },
        {
          "timestamp": "03/24",
          "value": 40.8
        },
        {
          "timestamp": "03/25",
          "value": 39
        },
        {
          "timestamp": "03/26",
          "value": 47
        },
        {
          "timestamp": "03/27",
          "value": 43.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 43
        },
        {
          "timestamp": "03/15",
          "value": 47.7
        },
        {
          "timestamp": "03/16",
          "value": 46.7
        },
        {
          "timestamp": "03/17",
          "value": 46.6
        },
        {
          "timestamp": "03/18",
          "value": 46.3
        },
        {
          "timestamp": "03/19",
          "value": 45.1
        },
        {
          "timestamp": "03/20",
          "value": 44.2
        },
        {
          "timestamp": "03/21",
          "value": 40.1
        },
        {
          "timestamp": "03/22",
          "value": 41.6
        },
        {
          "timestamp": "03/23",
          "value": 42.6
        },
        {
          "timestamp": "03/24",
          "value": 40.4
        },
        {
          "timestamp": "03/25",
          "value": 37.9
        },
        {
          "timestamp": "03/26",
          "value": 43.2
        },
        {
          "timestamp": "03/27",
          "value": 45.9
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu011",
    "label": "GPU-011",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "err",
    "current": {
      "gpuUsage": 0,
      "memUsage": 0,
      "temp": 0,
      "power": 0,
      "cpuUsage": 0,
      "cpuMemUsage": 0
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu012",
    "label": "GPU-012",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 66,
      "memUsage": 39,
      "temp": 74,
      "power": 802,
      "cpuUsage": 42,
      "cpuMemUsage": 36
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 66.4
        },
        {
          "timestamp": "03/15",
          "value": 66.6
        },
        {
          "timestamp": "03/16",
          "value": 67.3
        },
        {
          "timestamp": "03/17",
          "value": 78.2
        },
        {
          "timestamp": "03/18",
          "value": 75.3
        },
        {
          "timestamp": "03/19",
          "value": 70.3
        },
        {
          "timestamp": "03/20",
          "value": 67.7
        },
        {
          "timestamp": "03/21",
          "value": 62.8
        },
        {
          "timestamp": "03/22",
          "value": 62.4
        },
        {
          "timestamp": "03/23",
          "value": 58.8
        },
        {
          "timestamp": "03/24",
          "value": 54
        },
        {
          "timestamp": "03/25",
          "value": 66.5
        },
        {
          "timestamp": "03/26",
          "value": 65.2
        },
        {
          "timestamp": "03/27",
          "value": 69.6
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 37.3
        },
        {
          "timestamp": "03/15",
          "value": 41.1
        },
        {
          "timestamp": "03/16",
          "value": 40.2
        },
        {
          "timestamp": "03/17",
          "value": 42.3
        },
        {
          "timestamp": "03/18",
          "value": 44.2
        },
        {
          "timestamp": "03/19",
          "value": 43
        },
        {
          "timestamp": "03/20",
          "value": 38.9
        },
        {
          "timestamp": "03/21",
          "value": 35.8
        },
        {
          "timestamp": "03/22",
          "value": 34.8
        },
        {
          "timestamp": "03/23",
          "value": 33.3
        },
        {
          "timestamp": "03/24",
          "value": 36.8
        },
        {
          "timestamp": "03/25",
          "value": 37.6
        },
        {
          "timestamp": "03/26",
          "value": 35.3
        },
        {
          "timestamp": "03/27",
          "value": 42.6
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 76.5
        },
        {
          "timestamp": "03/15",
          "value": 78.9
        },
        {
          "timestamp": "03/16",
          "value": 79.5
        },
        {
          "timestamp": "03/17",
          "value": 79.1
        },
        {
          "timestamp": "03/18",
          "value": 81.5
        },
        {
          "timestamp": "03/19",
          "value": 76.6
        },
        {
          "timestamp": "03/20",
          "value": 73.6
        },
        {
          "timestamp": "03/21",
          "value": 71.3
        },
        {
          "timestamp": "03/22",
          "value": 68.6
        },
        {
          "timestamp": "03/23",
          "value": 65.7
        },
        {
          "timestamp": "03/24",
          "value": 67.9
        },
        {
          "timestamp": "03/25",
          "value": 70.1
        },
        {
          "timestamp": "03/26",
          "value": 70.4
        },
        {
          "timestamp": "03/27",
          "value": 78.1
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 793.8
        },
        {
          "timestamp": "03/15",
          "value": 859.7
        },
        {
          "timestamp": "03/16",
          "value": 895.2
        },
        {
          "timestamp": "03/17",
          "value": 920.4
        },
        {
          "timestamp": "03/18",
          "value": 905.7
        },
        {
          "timestamp": "03/19",
          "value": 816.5
        },
        {
          "timestamp": "03/20",
          "value": 859.4
        },
        {
          "timestamp": "03/21",
          "value": 736.8
        },
        {
          "timestamp": "03/22",
          "value": 777.8
        },
        {
          "timestamp": "03/23",
          "value": 695.4
        },
        {
          "timestamp": "03/24",
          "value": 761.9
        },
        {
          "timestamp": "03/25",
          "value": 737.9
        },
        {
          "timestamp": "03/26",
          "value": 733.9
        },
        {
          "timestamp": "03/27",
          "value": 786.7
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 42.7
        },
        {
          "timestamp": "03/15",
          "value": 40.5
        },
        {
          "timestamp": "03/16",
          "value": 43.4
        },
        {
          "timestamp": "03/17",
          "value": 43.9
        },
        {
          "timestamp": "03/18",
          "value": 47.6
        },
        {
          "timestamp": "03/19",
          "value": 44.9
        },
        {
          "timestamp": "03/20",
          "value": 42.8
        },
        {
          "timestamp": "03/21",
          "value": 36.6
        },
        {
          "timestamp": "03/22",
          "value": 34.7
        },
        {
          "timestamp": "03/23",
          "value": 37
        },
        {
          "timestamp": "03/24",
          "value": 37
        },
        {
          "timestamp": "03/25",
          "value": 38.9
        },
        {
          "timestamp": "03/26",
          "value": 41
        },
        {
          "timestamp": "03/27",
          "value": 41.2
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 36.6
        },
        {
          "timestamp": "03/15",
          "value": 36.8
        },
        {
          "timestamp": "03/16",
          "value": 38.9
        },
        {
          "timestamp": "03/17",
          "value": 37.6
        },
        {
          "timestamp": "03/18",
          "value": 41.1
        },
        {
          "timestamp": "03/19",
          "value": 36.4
        },
        {
          "timestamp": "03/20",
          "value": 36.8
        },
        {
          "timestamp": "03/21",
          "value": 35.9
        },
        {
          "timestamp": "03/22",
          "value": 35.5
        },
        {
          "timestamp": "03/23",
          "value": 30.1
        },
        {
          "timestamp": "03/24",
          "value": 30.6
        },
        {
          "timestamp": "03/25",
          "value": 32.2
        },
        {
          "timestamp": "03/26",
          "value": 34.2
        },
        {
          "timestamp": "03/27",
          "value": 35.8
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu013",
    "label": "GPU-013",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 50,
      "memUsage": 29,
      "temp": 70,
      "power": 311,
      "cpuUsage": 45,
      "cpuMemUsage": 31
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 48.7
        },
        {
          "timestamp": "03/15",
          "value": 51.8
        },
        {
          "timestamp": "03/16",
          "value": 53.9
        },
        {
          "timestamp": "03/17",
          "value": 52.9
        },
        {
          "timestamp": "03/18",
          "value": 58.2
        },
        {
          "timestamp": "03/19",
          "value": 52
        },
        {
          "timestamp": "03/20",
          "value": 51.5
        },
        {
          "timestamp": "03/21",
          "value": 45.3
        },
        {
          "timestamp": "03/22",
          "value": 44.1
        },
        {
          "timestamp": "03/23",
          "value": 44.7
        },
        {
          "timestamp": "03/24",
          "value": 48.1
        },
        {
          "timestamp": "03/25",
          "value": 47.3
        },
        {
          "timestamp": "03/26",
          "value": 47.9
        },
        {
          "timestamp": "03/27",
          "value": 48
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 31.1
        },
        {
          "timestamp": "03/15",
          "value": 32.4
        },
        {
          "timestamp": "03/16",
          "value": 31.4
        },
        {
          "timestamp": "03/17",
          "value": 32.8
        },
        {
          "timestamp": "03/18",
          "value": 32.6
        },
        {
          "timestamp": "03/19",
          "value": 32.3
        },
        {
          "timestamp": "03/20",
          "value": 29.8
        },
        {
          "timestamp": "03/21",
          "value": 27.6
        },
        {
          "timestamp": "03/22",
          "value": 28.3
        },
        {
          "timestamp": "03/23",
          "value": 26.9
        },
        {
          "timestamp": "03/24",
          "value": 24.6
        },
        {
          "timestamp": "03/25",
          "value": 28.5
        },
        {
          "timestamp": "03/26",
          "value": 27.2
        },
        {
          "timestamp": "03/27",
          "value": 27.7
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 71.2
        },
        {
          "timestamp": "03/15",
          "value": 73.1
        },
        {
          "timestamp": "03/16",
          "value": 75.2
        },
        {
          "timestamp": "03/17",
          "value": 78.6
        },
        {
          "timestamp": "03/18",
          "value": 75.7
        },
        {
          "timestamp": "03/19",
          "value": 71.9
        },
        {
          "timestamp": "03/20",
          "value": 72
        },
        {
          "timestamp": "03/21",
          "value": 67.2
        },
        {
          "timestamp": "03/22",
          "value": 64.4
        },
        {
          "timestamp": "03/23",
          "value": 61.9
        },
        {
          "timestamp": "03/24",
          "value": 61.6
        },
        {
          "timestamp": "03/25",
          "value": 63
        },
        {
          "timestamp": "03/26",
          "value": 70
        },
        {
          "timestamp": "03/27",
          "value": 73.1
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 312
        },
        {
          "timestamp": "03/15",
          "value": 342.9
        },
        {
          "timestamp": "03/16",
          "value": 324.1
        },
        {
          "timestamp": "03/17",
          "value": 347.9
        },
        {
          "timestamp": "03/18",
          "value": 328.1
        },
        {
          "timestamp": "03/19",
          "value": 323.2
        },
        {
          "timestamp": "03/20",
          "value": 302.3
        },
        {
          "timestamp": "03/21",
          "value": 288.3
        },
        {
          "timestamp": "03/22",
          "value": 279.9
        },
        {
          "timestamp": "03/23",
          "value": 268.2
        },
        {
          "timestamp": "03/24",
          "value": 299.8
        },
        {
          "timestamp": "03/25",
          "value": 289.5
        },
        {
          "timestamp": "03/26",
          "value": 297.5
        },
        {
          "timestamp": "03/27",
          "value": 327.2
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 44.6
        },
        {
          "timestamp": "03/15",
          "value": 47.6
        },
        {
          "timestamp": "03/16",
          "value": 45.3
        },
        {
          "timestamp": "03/17",
          "value": 49.8
        },
        {
          "timestamp": "03/18",
          "value": 48.8
        },
        {
          "timestamp": "03/19",
          "value": 46.8
        },
        {
          "timestamp": "03/20",
          "value": 45.2
        },
        {
          "timestamp": "03/21",
          "value": 40.5
        },
        {
          "timestamp": "03/22",
          "value": 37.9
        },
        {
          "timestamp": "03/23",
          "value": 38.3
        },
        {
          "timestamp": "03/24",
          "value": 44.8
        },
        {
          "timestamp": "03/25",
          "value": 44.7
        },
        {
          "timestamp": "03/26",
          "value": 48.2
        },
        {
          "timestamp": "03/27",
          "value": 43.8
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 29.2
        },
        {
          "timestamp": "03/15",
          "value": 31.1
        },
        {
          "timestamp": "03/16",
          "value": 33.2
        },
        {
          "timestamp": "03/17",
          "value": 32.8
        },
        {
          "timestamp": "03/18",
          "value": 35.8
        },
        {
          "timestamp": "03/19",
          "value": 31.4
        },
        {
          "timestamp": "03/20",
          "value": 30.7
        },
        {
          "timestamp": "03/21",
          "value": 30.1
        },
        {
          "timestamp": "03/22",
          "value": 28.6
        },
        {
          "timestamp": "03/23",
          "value": 26
        },
        {
          "timestamp": "03/24",
          "value": 25.9
        },
        {
          "timestamp": "03/25",
          "value": 29.6
        },
        {
          "timestamp": "03/26",
          "value": 30.4
        },
        {
          "timestamp": "03/27",
          "value": 30.6
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu014",
    "label": "GPU-014",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "warn",
    "current": {
      "gpuUsage": 92,
      "memUsage": 80,
      "temp": 93,
      "power": 998,
      "cpuUsage": 68,
      "cpuMemUsage": 67
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 92.6
        },
        {
          "timestamp": "03/15",
          "value": 97.6
        },
        {
          "timestamp": "03/16",
          "value": 99.5
        },
        {
          "timestamp": "03/17",
          "value": 106.3
        },
        {
          "timestamp": "03/18",
          "value": 102
        },
        {
          "timestamp": "03/19",
          "value": 104.1
        },
        {
          "timestamp": "03/20",
          "value": 98.1
        },
        {
          "timestamp": "03/21",
          "value": 84
        },
        {
          "timestamp": "03/22",
          "value": 93.2
        },
        {
          "timestamp": "03/23",
          "value": 89.6
        },
        {
          "timestamp": "03/24",
          "value": 85.8
        },
        {
          "timestamp": "03/25",
          "value": 85.5
        },
        {
          "timestamp": "03/26",
          "value": 83
        },
        {
          "timestamp": "03/27",
          "value": 97.1
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 85.5
        },
        {
          "timestamp": "03/15",
          "value": 83.1
        },
        {
          "timestamp": "03/16",
          "value": 88.6
        },
        {
          "timestamp": "03/17",
          "value": 89.3
        },
        {
          "timestamp": "03/18",
          "value": 84.5
        },
        {
          "timestamp": "03/19",
          "value": 88.4
        },
        {
          "timestamp": "03/20",
          "value": 77.6
        },
        {
          "timestamp": "03/21",
          "value": 76.1
        },
        {
          "timestamp": "03/22",
          "value": 68.3
        },
        {
          "timestamp": "03/23",
          "value": 68
        },
        {
          "timestamp": "03/24",
          "value": 68.9
        },
        {
          "timestamp": "03/25",
          "value": 74.1
        },
        {
          "timestamp": "03/26",
          "value": 74.1
        },
        {
          "timestamp": "03/27",
          "value": 86.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 94.9
        },
        {
          "timestamp": "03/15",
          "value": 95.3
        },
        {
          "timestamp": "03/16",
          "value": 97.2
        },
        {
          "timestamp": "03/17",
          "value": 105.7
        },
        {
          "timestamp": "03/18",
          "value": 98.6
        },
        {
          "timestamp": "03/19",
          "value": 97.7
        },
        {
          "timestamp": "03/20",
          "value": 91.9
        },
        {
          "timestamp": "03/21",
          "value": 87.8
        },
        {
          "timestamp": "03/22",
          "value": 86
        },
        {
          "timestamp": "03/23",
          "value": 80.3
        },
        {
          "timestamp": "03/24",
          "value": 82.6
        },
        {
          "timestamp": "03/25",
          "value": 88.7
        },
        {
          "timestamp": "03/26",
          "value": 93.7
        },
        {
          "timestamp": "03/27",
          "value": 91.4
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 1013.6
        },
        {
          "timestamp": "03/15",
          "value": 1035.6
        },
        {
          "timestamp": "03/16",
          "value": 1039.1
        },
        {
          "timestamp": "03/17",
          "value": 1098.1
        },
        {
          "timestamp": "03/18",
          "value": 1133.1
        },
        {
          "timestamp": "03/19",
          "value": 1005.4
        },
        {
          "timestamp": "03/20",
          "value": 1008.2
        },
        {
          "timestamp": "03/21",
          "value": 1002.9
        },
        {
          "timestamp": "03/22",
          "value": 950.9
        },
        {
          "timestamp": "03/23",
          "value": 909
        },
        {
          "timestamp": "03/24",
          "value": 898.7
        },
        {
          "timestamp": "03/25",
          "value": 958.4
        },
        {
          "timestamp": "03/26",
          "value": 1027.6
        },
        {
          "timestamp": "03/27",
          "value": 1054.6
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 72.1
        },
        {
          "timestamp": "03/15",
          "value": 71.4
        },
        {
          "timestamp": "03/16",
          "value": 77.4
        },
        {
          "timestamp": "03/17",
          "value": 77.8
        },
        {
          "timestamp": "03/18",
          "value": 77.9
        },
        {
          "timestamp": "03/19",
          "value": 68.7
        },
        {
          "timestamp": "03/20",
          "value": 74
        },
        {
          "timestamp": "03/21",
          "value": 63.9
        },
        {
          "timestamp": "03/22",
          "value": 65
        },
        {
          "timestamp": "03/23",
          "value": 65.6
        },
        {
          "timestamp": "03/24",
          "value": 59.6
        },
        {
          "timestamp": "03/25",
          "value": 64.4
        },
        {
          "timestamp": "03/26",
          "value": 68.4
        },
        {
          "timestamp": "03/27",
          "value": 69.6
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 65.9
        },
        {
          "timestamp": "03/15",
          "value": 66
        },
        {
          "timestamp": "03/16",
          "value": 72.3
        },
        {
          "timestamp": "03/17",
          "value": 74
        },
        {
          "timestamp": "03/18",
          "value": 73
        },
        {
          "timestamp": "03/19",
          "value": 70.8
        },
        {
          "timestamp": "03/20",
          "value": 64
        },
        {
          "timestamp": "03/21",
          "value": 63.6
        },
        {
          "timestamp": "03/22",
          "value": 58.8
        },
        {
          "timestamp": "03/23",
          "value": 63
        },
        {
          "timestamp": "03/24",
          "value": 64.4
        },
        {
          "timestamp": "03/25",
          "value": 60.1
        },
        {
          "timestamp": "03/26",
          "value": 64.4
        },
        {
          "timestamp": "03/27",
          "value": 70.1
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu015",
    "label": "GPU-015",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 48,
      "memUsage": 69,
      "temp": 68,
      "power": 407,
      "cpuUsage": 34,
      "cpuMemUsage": 31
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 52.3
        },
        {
          "timestamp": "03/15",
          "value": 51.4
        },
        {
          "timestamp": "03/16",
          "value": 49.9
        },
        {
          "timestamp": "03/17",
          "value": 56.5
        },
        {
          "timestamp": "03/18",
          "value": 55.3
        },
        {
          "timestamp": "03/19",
          "value": 51.9
        },
        {
          "timestamp": "03/20",
          "value": 46
        },
        {
          "timestamp": "03/21",
          "value": 45.3
        },
        {
          "timestamp": "03/22",
          "value": 47.7
        },
        {
          "timestamp": "03/23",
          "value": 41.3
        },
        {
          "timestamp": "03/24",
          "value": 40.6
        },
        {
          "timestamp": "03/25",
          "value": 48.3
        },
        {
          "timestamp": "03/26",
          "value": 44.2
        },
        {
          "timestamp": "03/27",
          "value": 50.2
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 64.3
        },
        {
          "timestamp": "03/15",
          "value": 69.9
        },
        {
          "timestamp": "03/16",
          "value": 76.4
        },
        {
          "timestamp": "03/17",
          "value": 75.5
        },
        {
          "timestamp": "03/18",
          "value": 75.9
        },
        {
          "timestamp": "03/19",
          "value": 71.2
        },
        {
          "timestamp": "03/20",
          "value": 67.5
        },
        {
          "timestamp": "03/21",
          "value": 61.5
        },
        {
          "timestamp": "03/22",
          "value": 62.9
        },
        {
          "timestamp": "03/23",
          "value": 58.8
        },
        {
          "timestamp": "03/24",
          "value": 63.5
        },
        {
          "timestamp": "03/25",
          "value": 62.7
        },
        {
          "timestamp": "03/26",
          "value": 70.9
        },
        {
          "timestamp": "03/27",
          "value": 66.9
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 68.9
        },
        {
          "timestamp": "03/15",
          "value": 72.5
        },
        {
          "timestamp": "03/16",
          "value": 72.2
        },
        {
          "timestamp": "03/17",
          "value": 77.1
        },
        {
          "timestamp": "03/18",
          "value": 75.6
        },
        {
          "timestamp": "03/19",
          "value": 69.5
        },
        {
          "timestamp": "03/20",
          "value": 69.5
        },
        {
          "timestamp": "03/21",
          "value": 63.5
        },
        {
          "timestamp": "03/22",
          "value": 60.4
        },
        {
          "timestamp": "03/23",
          "value": 59.7
        },
        {
          "timestamp": "03/24",
          "value": 61.6
        },
        {
          "timestamp": "03/25",
          "value": 65.2
        },
        {
          "timestamp": "03/26",
          "value": 67.4
        },
        {
          "timestamp": "03/27",
          "value": 69
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 425
        },
        {
          "timestamp": "03/15",
          "value": 418.5
        },
        {
          "timestamp": "03/16",
          "value": 434
        },
        {
          "timestamp": "03/17",
          "value": 449.6
        },
        {
          "timestamp": "03/18",
          "value": 433
        },
        {
          "timestamp": "03/19",
          "value": 421.8
        },
        {
          "timestamp": "03/20",
          "value": 407.6
        },
        {
          "timestamp": "03/21",
          "value": 404.2
        },
        {
          "timestamp": "03/22",
          "value": 372.2
        },
        {
          "timestamp": "03/23",
          "value": 382.5
        },
        {
          "timestamp": "03/24",
          "value": 350.8
        },
        {
          "timestamp": "03/25",
          "value": 391.1
        },
        {
          "timestamp": "03/26",
          "value": 387.1
        },
        {
          "timestamp": "03/27",
          "value": 411.9
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 36.5
        },
        {
          "timestamp": "03/15",
          "value": 36.1
        },
        {
          "timestamp": "03/16",
          "value": 36.1
        },
        {
          "timestamp": "03/17",
          "value": 38.7
        },
        {
          "timestamp": "03/18",
          "value": 39.1
        },
        {
          "timestamp": "03/19",
          "value": 33.9
        },
        {
          "timestamp": "03/20",
          "value": 36.9
        },
        {
          "timestamp": "03/21",
          "value": 32.2
        },
        {
          "timestamp": "03/22",
          "value": 30.7
        },
        {
          "timestamp": "03/23",
          "value": 33
        },
        {
          "timestamp": "03/24",
          "value": 30.4
        },
        {
          "timestamp": "03/25",
          "value": 32.6
        },
        {
          "timestamp": "03/26",
          "value": 33.6
        },
        {
          "timestamp": "03/27",
          "value": 34.2
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 31.8
        },
        {
          "timestamp": "03/15",
          "value": 34.3
        },
        {
          "timestamp": "03/16",
          "value": 33.6
        },
        {
          "timestamp": "03/17",
          "value": 34.1
        },
        {
          "timestamp": "03/18",
          "value": 35.9
        },
        {
          "timestamp": "03/19",
          "value": 33.6
        },
        {
          "timestamp": "03/20",
          "value": 33.2
        },
        {
          "timestamp": "03/21",
          "value": 31.9
        },
        {
          "timestamp": "03/22",
          "value": 28.1
        },
        {
          "timestamp": "03/23",
          "value": 30.1
        },
        {
          "timestamp": "03/24",
          "value": 28.7
        },
        {
          "timestamp": "03/25",
          "value": 31
        },
        {
          "timestamp": "03/26",
          "value": 31.8
        },
        {
          "timestamp": "03/27",
          "value": 30.3
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu016",
    "label": "GPU-016",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "warn",
    "current": {
      "gpuUsage": 92,
      "memUsage": 93,
      "temp": 90,
      "power": 965,
      "cpuUsage": 54,
      "cpuMemUsage": 57
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 88.3
        },
        {
          "timestamp": "03/15",
          "value": 90.5
        },
        {
          "timestamp": "03/16",
          "value": 102
        },
        {
          "timestamp": "03/17",
          "value": 106.9
        },
        {
          "timestamp": "03/18",
          "value": 96
        },
        {
          "timestamp": "03/19",
          "value": 98.7
        },
        {
          "timestamp": "03/20",
          "value": 99.8
        },
        {
          "timestamp": "03/21",
          "value": 82.9
        },
        {
          "timestamp": "03/22",
          "value": 85.8
        },
        {
          "timestamp": "03/23",
          "value": 85.2
        },
        {
          "timestamp": "03/24",
          "value": 87.9
        },
        {
          "timestamp": "03/25",
          "value": 78.4
        },
        {
          "timestamp": "03/26",
          "value": 92.4
        },
        {
          "timestamp": "03/27",
          "value": 91.4
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 98
        },
        {
          "timestamp": "03/15",
          "value": 91.7
        },
        {
          "timestamp": "03/16",
          "value": 101.4
        },
        {
          "timestamp": "03/17",
          "value": 102.6
        },
        {
          "timestamp": "03/18",
          "value": 97.3
        },
        {
          "timestamp": "03/19",
          "value": 99.6
        },
        {
          "timestamp": "03/20",
          "value": 94.8
        },
        {
          "timestamp": "03/21",
          "value": 84.2
        },
        {
          "timestamp": "03/22",
          "value": 86.4
        },
        {
          "timestamp": "03/23",
          "value": 83.5
        },
        {
          "timestamp": "03/24",
          "value": 87.1
        },
        {
          "timestamp": "03/25",
          "value": 84.7
        },
        {
          "timestamp": "03/26",
          "value": 90.8
        },
        {
          "timestamp": "03/27",
          "value": 100.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 88
        },
        {
          "timestamp": "03/15",
          "value": 93.1
        },
        {
          "timestamp": "03/16",
          "value": 99.6
        },
        {
          "timestamp": "03/17",
          "value": 96.4
        },
        {
          "timestamp": "03/18",
          "value": 96.2
        },
        {
          "timestamp": "03/19",
          "value": 97
        },
        {
          "timestamp": "03/20",
          "value": 93
        },
        {
          "timestamp": "03/21",
          "value": 85.4
        },
        {
          "timestamp": "03/22",
          "value": 85.2
        },
        {
          "timestamp": "03/23",
          "value": 82.9
        },
        {
          "timestamp": "03/24",
          "value": 81.4
        },
        {
          "timestamp": "03/25",
          "value": 83.1
        },
        {
          "timestamp": "03/26",
          "value": 89
        },
        {
          "timestamp": "03/27",
          "value": 93.9
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 1015.7
        },
        {
          "timestamp": "03/15",
          "value": 995.3
        },
        {
          "timestamp": "03/16",
          "value": 1089.5
        },
        {
          "timestamp": "03/17",
          "value": 1099.8
        },
        {
          "timestamp": "03/18",
          "value": 1007.2
        },
        {
          "timestamp": "03/19",
          "value": 1037.6
        },
        {
          "timestamp": "03/20",
          "value": 941.4
        },
        {
          "timestamp": "03/21",
          "value": 952.9
        },
        {
          "timestamp": "03/22",
          "value": 910.2
        },
        {
          "timestamp": "03/23",
          "value": 812.9
        },
        {
          "timestamp": "03/24",
          "value": 818.1
        },
        {
          "timestamp": "03/25",
          "value": 954.2
        },
        {
          "timestamp": "03/26",
          "value": 954.7
        },
        {
          "timestamp": "03/27",
          "value": 1040.3
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 52.5
        },
        {
          "timestamp": "03/15",
          "value": 57.8
        },
        {
          "timestamp": "03/16",
          "value": 55.7
        },
        {
          "timestamp": "03/17",
          "value": 56.1
        },
        {
          "timestamp": "03/18",
          "value": 59.2
        },
        {
          "timestamp": "03/19",
          "value": 58.2
        },
        {
          "timestamp": "03/20",
          "value": 54.9
        },
        {
          "timestamp": "03/21",
          "value": 54.9
        },
        {
          "timestamp": "03/22",
          "value": 54
        },
        {
          "timestamp": "03/23",
          "value": 49.9
        },
        {
          "timestamp": "03/24",
          "value": 46.5
        },
        {
          "timestamp": "03/25",
          "value": 55.2
        },
        {
          "timestamp": "03/26",
          "value": 48
        },
        {
          "timestamp": "03/27",
          "value": 54.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 60.8
        },
        {
          "timestamp": "03/15",
          "value": 57.3
        },
        {
          "timestamp": "03/16",
          "value": 64.3
        },
        {
          "timestamp": "03/17",
          "value": 64.1
        },
        {
          "timestamp": "03/18",
          "value": 61.3
        },
        {
          "timestamp": "03/19",
          "value": 58.8
        },
        {
          "timestamp": "03/20",
          "value": 54.5
        },
        {
          "timestamp": "03/21",
          "value": 56.2
        },
        {
          "timestamp": "03/22",
          "value": 48.9
        },
        {
          "timestamp": "03/23",
          "value": 50.7
        },
        {
          "timestamp": "03/24",
          "value": 51.8
        },
        {
          "timestamp": "03/25",
          "value": 49.7
        },
        {
          "timestamp": "03/26",
          "value": 58.2
        },
        {
          "timestamp": "03/27",
          "value": 57
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu017",
    "label": "GPU-017",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 49,
      "memUsage": 38,
      "temp": 64,
      "power": 377,
      "cpuUsage": 61,
      "cpuMemUsage": 58
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 51.8
        },
        {
          "timestamp": "03/15",
          "value": 47.9
        },
        {
          "timestamp": "03/16",
          "value": 50.4
        },
        {
          "timestamp": "03/17",
          "value": 52.8
        },
        {
          "timestamp": "03/18",
          "value": 56.5
        },
        {
          "timestamp": "03/19",
          "value": 55.5
        },
        {
          "timestamp": "03/20",
          "value": 49.7
        },
        {
          "timestamp": "03/21",
          "value": 46.5
        },
        {
          "timestamp": "03/22",
          "value": 44.2
        },
        {
          "timestamp": "03/23",
          "value": 45.2
        },
        {
          "timestamp": "03/24",
          "value": 44.7
        },
        {
          "timestamp": "03/25",
          "value": 41.4
        },
        {
          "timestamp": "03/26",
          "value": 50.3
        },
        {
          "timestamp": "03/27",
          "value": 53.9
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 39.6
        },
        {
          "timestamp": "03/15",
          "value": 41.7
        },
        {
          "timestamp": "03/16",
          "value": 40
        },
        {
          "timestamp": "03/17",
          "value": 39.7
        },
        {
          "timestamp": "03/18",
          "value": 43.9
        },
        {
          "timestamp": "03/19",
          "value": 38.2
        },
        {
          "timestamp": "03/20",
          "value": 36.7
        },
        {
          "timestamp": "03/21",
          "value": 35.6
        },
        {
          "timestamp": "03/22",
          "value": 37.3
        },
        {
          "timestamp": "03/23",
          "value": 35
        },
        {
          "timestamp": "03/24",
          "value": 33.6
        },
        {
          "timestamp": "03/25",
          "value": 36.9
        },
        {
          "timestamp": "03/26",
          "value": 38.9
        },
        {
          "timestamp": "03/27",
          "value": 40
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 62.5
        },
        {
          "timestamp": "03/15",
          "value": 66.4
        },
        {
          "timestamp": "03/16",
          "value": 69.5
        },
        {
          "timestamp": "03/17",
          "value": 70.9
        },
        {
          "timestamp": "03/18",
          "value": 68.1
        },
        {
          "timestamp": "03/19",
          "value": 65.8
        },
        {
          "timestamp": "03/20",
          "value": 66.5
        },
        {
          "timestamp": "03/21",
          "value": 62.9
        },
        {
          "timestamp": "03/22",
          "value": 60.3
        },
        {
          "timestamp": "03/23",
          "value": 56.5
        },
        {
          "timestamp": "03/24",
          "value": 56.3
        },
        {
          "timestamp": "03/25",
          "value": 61.9
        },
        {
          "timestamp": "03/26",
          "value": 60.8
        },
        {
          "timestamp": "03/27",
          "value": 64.6
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 385.7
        },
        {
          "timestamp": "03/15",
          "value": 391.6
        },
        {
          "timestamp": "03/16",
          "value": 395.7
        },
        {
          "timestamp": "03/17",
          "value": 434.5
        },
        {
          "timestamp": "03/18",
          "value": 424.7
        },
        {
          "timestamp": "03/19",
          "value": 414.8
        },
        {
          "timestamp": "03/20",
          "value": 388.6
        },
        {
          "timestamp": "03/21",
          "value": 358.8
        },
        {
          "timestamp": "03/22",
          "value": 341.3
        },
        {
          "timestamp": "03/23",
          "value": 339.3
        },
        {
          "timestamp": "03/24",
          "value": 339.2
        },
        {
          "timestamp": "03/25",
          "value": 335.1
        },
        {
          "timestamp": "03/26",
          "value": 365.6
        },
        {
          "timestamp": "03/27",
          "value": 366.3
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 62.5
        },
        {
          "timestamp": "03/15",
          "value": 69.9
        },
        {
          "timestamp": "03/16",
          "value": 64.9
        },
        {
          "timestamp": "03/17",
          "value": 61.1
        },
        {
          "timestamp": "03/18",
          "value": 69.5
        },
        {
          "timestamp": "03/19",
          "value": 59.9
        },
        {
          "timestamp": "03/20",
          "value": 64.9
        },
        {
          "timestamp": "03/21",
          "value": 60.4
        },
        {
          "timestamp": "03/22",
          "value": 55.5
        },
        {
          "timestamp": "03/23",
          "value": 53.1
        },
        {
          "timestamp": "03/24",
          "value": 52.5
        },
        {
          "timestamp": "03/25",
          "value": 53.6
        },
        {
          "timestamp": "03/26",
          "value": 58.7
        },
        {
          "timestamp": "03/27",
          "value": 59.7
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 55.5
        },
        {
          "timestamp": "03/15",
          "value": 58.4
        },
        {
          "timestamp": "03/16",
          "value": 62
        },
        {
          "timestamp": "03/17",
          "value": 66.6
        },
        {
          "timestamp": "03/18",
          "value": 65.4
        },
        {
          "timestamp": "03/19",
          "value": 58.6
        },
        {
          "timestamp": "03/20",
          "value": 61.1
        },
        {
          "timestamp": "03/21",
          "value": 54.7
        },
        {
          "timestamp": "03/22",
          "value": 56.5
        },
        {
          "timestamp": "03/23",
          "value": 49.9
        },
        {
          "timestamp": "03/24",
          "value": 48.4
        },
        {
          "timestamp": "03/25",
          "value": 55.5
        },
        {
          "timestamp": "03/26",
          "value": 56.4
        },
        {
          "timestamp": "03/27",
          "value": 57.1
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu018",
    "label": "GPU-018",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 61,
      "memUsage": 31,
      "temp": 62,
      "power": 649,
      "cpuUsage": 37,
      "cpuMemUsage": 78
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 59.7
        },
        {
          "timestamp": "03/15",
          "value": 61
        },
        {
          "timestamp": "03/16",
          "value": 66.6
        },
        {
          "timestamp": "03/17",
          "value": 69.9
        },
        {
          "timestamp": "03/18",
          "value": 65.6
        },
        {
          "timestamp": "03/19",
          "value": 62.4
        },
        {
          "timestamp": "03/20",
          "value": 57.3
        },
        {
          "timestamp": "03/21",
          "value": 63.4
        },
        {
          "timestamp": "03/22",
          "value": 54.5
        },
        {
          "timestamp": "03/23",
          "value": 58.1
        },
        {
          "timestamp": "03/24",
          "value": 58.3
        },
        {
          "timestamp": "03/25",
          "value": 52.1
        },
        {
          "timestamp": "03/26",
          "value": 60.1
        },
        {
          "timestamp": "03/27",
          "value": 61.4
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 32.9
        },
        {
          "timestamp": "03/15",
          "value": 31.9
        },
        {
          "timestamp": "03/16",
          "value": 35.8
        },
        {
          "timestamp": "03/17",
          "value": 32.2
        },
        {
          "timestamp": "03/18",
          "value": 34.3
        },
        {
          "timestamp": "03/19",
          "value": 31.7
        },
        {
          "timestamp": "03/20",
          "value": 29.6
        },
        {
          "timestamp": "03/21",
          "value": 29
        },
        {
          "timestamp": "03/22",
          "value": 30.2
        },
        {
          "timestamp": "03/23",
          "value": 28.8
        },
        {
          "timestamp": "03/24",
          "value": 29
        },
        {
          "timestamp": "03/25",
          "value": 28.2
        },
        {
          "timestamp": "03/26",
          "value": 31.8
        },
        {
          "timestamp": "03/27",
          "value": 33.8
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 59.5
        },
        {
          "timestamp": "03/15",
          "value": 65.2
        },
        {
          "timestamp": "03/16",
          "value": 67.2
        },
        {
          "timestamp": "03/17",
          "value": 66.5
        },
        {
          "timestamp": "03/18",
          "value": 65.4
        },
        {
          "timestamp": "03/19",
          "value": 66.6
        },
        {
          "timestamp": "03/20",
          "value": 62.2
        },
        {
          "timestamp": "03/21",
          "value": 60.7
        },
        {
          "timestamp": "03/22",
          "value": 56.3
        },
        {
          "timestamp": "03/23",
          "value": 57
        },
        {
          "timestamp": "03/24",
          "value": 54.9
        },
        {
          "timestamp": "03/25",
          "value": 59.9
        },
        {
          "timestamp": "03/26",
          "value": 59.5
        },
        {
          "timestamp": "03/27",
          "value": 62.5
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 669.4
        },
        {
          "timestamp": "03/15",
          "value": 651.8
        },
        {
          "timestamp": "03/16",
          "value": 730.2
        },
        {
          "timestamp": "03/17",
          "value": 748.8
        },
        {
          "timestamp": "03/18",
          "value": 685.9
        },
        {
          "timestamp": "03/19",
          "value": 688.5
        },
        {
          "timestamp": "03/20",
          "value": 651.2
        },
        {
          "timestamp": "03/21",
          "value": 639.8
        },
        {
          "timestamp": "03/22",
          "value": 628.5
        },
        {
          "timestamp": "03/23",
          "value": 607
        },
        {
          "timestamp": "03/24",
          "value": 570.1
        },
        {
          "timestamp": "03/25",
          "value": 564.7
        },
        {
          "timestamp": "03/26",
          "value": 627.1
        },
        {
          "timestamp": "03/27",
          "value": 689
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 33.6
        },
        {
          "timestamp": "03/15",
          "value": 40.9
        },
        {
          "timestamp": "03/16",
          "value": 43.6
        },
        {
          "timestamp": "03/17",
          "value": 38.9
        },
        {
          "timestamp": "03/18",
          "value": 39.6
        },
        {
          "timestamp": "03/19",
          "value": 37.7
        },
        {
          "timestamp": "03/20",
          "value": 34.6
        },
        {
          "timestamp": "03/21",
          "value": 35.8
        },
        {
          "timestamp": "03/22",
          "value": 34.4
        },
        {
          "timestamp": "03/23",
          "value": 32.7
        },
        {
          "timestamp": "03/24",
          "value": 31.1
        },
        {
          "timestamp": "03/25",
          "value": 34.6
        },
        {
          "timestamp": "03/26",
          "value": 34.4
        },
        {
          "timestamp": "03/27",
          "value": 40.8
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 83.3
        },
        {
          "timestamp": "03/15",
          "value": 76.7
        },
        {
          "timestamp": "03/16",
          "value": 83.8
        },
        {
          "timestamp": "03/17",
          "value": 90
        },
        {
          "timestamp": "03/18",
          "value": 83.8
        },
        {
          "timestamp": "03/19",
          "value": 87.8
        },
        {
          "timestamp": "03/20",
          "value": 84
        },
        {
          "timestamp": "03/21",
          "value": 74.3
        },
        {
          "timestamp": "03/22",
          "value": 76.1
        },
        {
          "timestamp": "03/23",
          "value": 65.1
        },
        {
          "timestamp": "03/24",
          "value": 75.5
        },
        {
          "timestamp": "03/25",
          "value": 70.8
        },
        {
          "timestamp": "03/26",
          "value": 77.3
        },
        {
          "timestamp": "03/27",
          "value": 76.6
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu019",
    "label": "GPU-019",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 55,
      "memUsage": 74,
      "temp": 71,
      "power": 692,
      "cpuUsage": 23,
      "cpuMemUsage": 34
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 54.4
        },
        {
          "timestamp": "03/15",
          "value": 58
        },
        {
          "timestamp": "03/16",
          "value": 59.5
        },
        {
          "timestamp": "03/17",
          "value": 58.6
        },
        {
          "timestamp": "03/18",
          "value": 64.4
        },
        {
          "timestamp": "03/19",
          "value": 57
        },
        {
          "timestamp": "03/20",
          "value": 58.4
        },
        {
          "timestamp": "03/21",
          "value": 48.5
        },
        {
          "timestamp": "03/22",
          "value": 54.1
        },
        {
          "timestamp": "03/23",
          "value": 51.3
        },
        {
          "timestamp": "03/24",
          "value": 46.2
        },
        {
          "timestamp": "03/25",
          "value": 46.8
        },
        {
          "timestamp": "03/26",
          "value": 55.6
        },
        {
          "timestamp": "03/27",
          "value": 60.5
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 70.9
        },
        {
          "timestamp": "03/15",
          "value": 78
        },
        {
          "timestamp": "03/16",
          "value": 84.1
        },
        {
          "timestamp": "03/17",
          "value": 82.2
        },
        {
          "timestamp": "03/18",
          "value": 80.5
        },
        {
          "timestamp": "03/19",
          "value": 77
        },
        {
          "timestamp": "03/20",
          "value": 77.4
        },
        {
          "timestamp": "03/21",
          "value": 76.9
        },
        {
          "timestamp": "03/22",
          "value": 73.6
        },
        {
          "timestamp": "03/23",
          "value": 71.6
        },
        {
          "timestamp": "03/24",
          "value": 70.1
        },
        {
          "timestamp": "03/25",
          "value": 73.7
        },
        {
          "timestamp": "03/26",
          "value": 73.5
        },
        {
          "timestamp": "03/27",
          "value": 77.5
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 73.3
        },
        {
          "timestamp": "03/15",
          "value": 71.8
        },
        {
          "timestamp": "03/16",
          "value": 74.4
        },
        {
          "timestamp": "03/17",
          "value": 76.8
        },
        {
          "timestamp": "03/18",
          "value": 77.5
        },
        {
          "timestamp": "03/19",
          "value": 74.9
        },
        {
          "timestamp": "03/20",
          "value": 73.1
        },
        {
          "timestamp": "03/21",
          "value": 70.8
        },
        {
          "timestamp": "03/22",
          "value": 65
        },
        {
          "timestamp": "03/23",
          "value": 65.2
        },
        {
          "timestamp": "03/24",
          "value": 63.2
        },
        {
          "timestamp": "03/25",
          "value": 66.3
        },
        {
          "timestamp": "03/26",
          "value": 66.4
        },
        {
          "timestamp": "03/27",
          "value": 72.4
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 690.1
        },
        {
          "timestamp": "03/15",
          "value": 725.1
        },
        {
          "timestamp": "03/16",
          "value": 768.3
        },
        {
          "timestamp": "03/17",
          "value": 750.8
        },
        {
          "timestamp": "03/18",
          "value": 733.6
        },
        {
          "timestamp": "03/19",
          "value": 758.2
        },
        {
          "timestamp": "03/20",
          "value": 673.4
        },
        {
          "timestamp": "03/21",
          "value": 701.4
        },
        {
          "timestamp": "03/22",
          "value": 649
        },
        {
          "timestamp": "03/23",
          "value": 601.2
        },
        {
          "timestamp": "03/24",
          "value": 627.6
        },
        {
          "timestamp": "03/25",
          "value": 602.2
        },
        {
          "timestamp": "03/26",
          "value": 710.2
        },
        {
          "timestamp": "03/27",
          "value": 722.9
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 21.3
        },
        {
          "timestamp": "03/15",
          "value": 26.2
        },
        {
          "timestamp": "03/16",
          "value": 24.5
        },
        {
          "timestamp": "03/17",
          "value": 24.9
        },
        {
          "timestamp": "03/18",
          "value": 24.1
        },
        {
          "timestamp": "03/19",
          "value": 25
        },
        {
          "timestamp": "03/20",
          "value": 21.8
        },
        {
          "timestamp": "03/21",
          "value": 22.1
        },
        {
          "timestamp": "03/22",
          "value": 21.1
        },
        {
          "timestamp": "03/23",
          "value": 20.3
        },
        {
          "timestamp": "03/24",
          "value": 23
        },
        {
          "timestamp": "03/25",
          "value": 21.8
        },
        {
          "timestamp": "03/26",
          "value": 20.8
        },
        {
          "timestamp": "03/27",
          "value": 23.1
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 34.5
        },
        {
          "timestamp": "03/15",
          "value": 35.3
        },
        {
          "timestamp": "03/16",
          "value": 39.1
        },
        {
          "timestamp": "03/17",
          "value": 36.3
        },
        {
          "timestamp": "03/18",
          "value": 36.4
        },
        {
          "timestamp": "03/19",
          "value": 36.7
        },
        {
          "timestamp": "03/20",
          "value": 33.6
        },
        {
          "timestamp": "03/21",
          "value": 33.6
        },
        {
          "timestamp": "03/22",
          "value": 33
        },
        {
          "timestamp": "03/23",
          "value": 31.8
        },
        {
          "timestamp": "03/24",
          "value": 28.4
        },
        {
          "timestamp": "03/25",
          "value": 33.9
        },
        {
          "timestamp": "03/26",
          "value": 35
        },
        {
          "timestamp": "03/27",
          "value": 35.8
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu020",
    "label": "GPU-020",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 50,
      "memUsage": 46,
      "temp": 74,
      "power": 312,
      "cpuUsage": 27,
      "cpuMemUsage": 71
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 46.7
        },
        {
          "timestamp": "03/15",
          "value": 55.2
        },
        {
          "timestamp": "03/16",
          "value": 54.8
        },
        {
          "timestamp": "03/17",
          "value": 58.6
        },
        {
          "timestamp": "03/18",
          "value": 57.5
        },
        {
          "timestamp": "03/19",
          "value": 50.2
        },
        {
          "timestamp": "03/20",
          "value": 53
        },
        {
          "timestamp": "03/21",
          "value": 47.6
        },
        {
          "timestamp": "03/22",
          "value": 47
        },
        {
          "timestamp": "03/23",
          "value": 44.6
        },
        {
          "timestamp": "03/24",
          "value": 45.3
        },
        {
          "timestamp": "03/25",
          "value": 49.9
        },
        {
          "timestamp": "03/26",
          "value": 52.1
        },
        {
          "timestamp": "03/27",
          "value": 54
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 46.7
        },
        {
          "timestamp": "03/15",
          "value": 51
        },
        {
          "timestamp": "03/16",
          "value": 51.9
        },
        {
          "timestamp": "03/17",
          "value": 53.8
        },
        {
          "timestamp": "03/18",
          "value": 49.7
        },
        {
          "timestamp": "03/19",
          "value": 48.6
        },
        {
          "timestamp": "03/20",
          "value": 49.5
        },
        {
          "timestamp": "03/21",
          "value": 46.3
        },
        {
          "timestamp": "03/22",
          "value": 40.5
        },
        {
          "timestamp": "03/23",
          "value": 39.2
        },
        {
          "timestamp": "03/24",
          "value": 42
        },
        {
          "timestamp": "03/25",
          "value": 40.9
        },
        {
          "timestamp": "03/26",
          "value": 44.9
        },
        {
          "timestamp": "03/27",
          "value": 47.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 76.3
        },
        {
          "timestamp": "03/15",
          "value": 79.6
        },
        {
          "timestamp": "03/16",
          "value": 80.7
        },
        {
          "timestamp": "03/17",
          "value": 83.8
        },
        {
          "timestamp": "03/18",
          "value": 80.5
        },
        {
          "timestamp": "03/19",
          "value": 76.7
        },
        {
          "timestamp": "03/20",
          "value": 77.3
        },
        {
          "timestamp": "03/21",
          "value": 73.9
        },
        {
          "timestamp": "03/22",
          "value": 66.5
        },
        {
          "timestamp": "03/23",
          "value": 67.8
        },
        {
          "timestamp": "03/24",
          "value": 64.4
        },
        {
          "timestamp": "03/25",
          "value": 70.9
        },
        {
          "timestamp": "03/26",
          "value": 74.5
        },
        {
          "timestamp": "03/27",
          "value": 72.9
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 304.8
        },
        {
          "timestamp": "03/15",
          "value": 344.7
        },
        {
          "timestamp": "03/16",
          "value": 344.9
        },
        {
          "timestamp": "03/17",
          "value": 343.9
        },
        {
          "timestamp": "03/18",
          "value": 346.2
        },
        {
          "timestamp": "03/19",
          "value": 316.2
        },
        {
          "timestamp": "03/20",
          "value": 309
        },
        {
          "timestamp": "03/21",
          "value": 310.1
        },
        {
          "timestamp": "03/22",
          "value": 301.8
        },
        {
          "timestamp": "03/23",
          "value": 277
        },
        {
          "timestamp": "03/24",
          "value": 286.5
        },
        {
          "timestamp": "03/25",
          "value": 299.6
        },
        {
          "timestamp": "03/26",
          "value": 296.3
        },
        {
          "timestamp": "03/27",
          "value": 320.1
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 25.3
        },
        {
          "timestamp": "03/15",
          "value": 26.6
        },
        {
          "timestamp": "03/16",
          "value": 26.9
        },
        {
          "timestamp": "03/17",
          "value": 30.1
        },
        {
          "timestamp": "03/18",
          "value": 28.7
        },
        {
          "timestamp": "03/19",
          "value": 31
        },
        {
          "timestamp": "03/20",
          "value": 27.4
        },
        {
          "timestamp": "03/21",
          "value": 24.7
        },
        {
          "timestamp": "03/22",
          "value": 27.4
        },
        {
          "timestamp": "03/23",
          "value": 24.6
        },
        {
          "timestamp": "03/24",
          "value": 22.7
        },
        {
          "timestamp": "03/25",
          "value": 22.6
        },
        {
          "timestamp": "03/26",
          "value": 24.8
        },
        {
          "timestamp": "03/27",
          "value": 28.7
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 68.1
        },
        {
          "timestamp": "03/15",
          "value": 74.9
        },
        {
          "timestamp": "03/16",
          "value": 76
        },
        {
          "timestamp": "03/17",
          "value": 77.1
        },
        {
          "timestamp": "03/18",
          "value": 75
        },
        {
          "timestamp": "03/19",
          "value": 80.2
        },
        {
          "timestamp": "03/20",
          "value": 75
        },
        {
          "timestamp": "03/21",
          "value": 67.6
        },
        {
          "timestamp": "03/22",
          "value": 66
        },
        {
          "timestamp": "03/23",
          "value": 67.9
        },
        {
          "timestamp": "03/24",
          "value": 64.4
        },
        {
          "timestamp": "03/25",
          "value": 70.3
        },
        {
          "timestamp": "03/26",
          "value": 70.1
        },
        {
          "timestamp": "03/27",
          "value": 70.5
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu021",
    "label": "GPU-021",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 45,
      "memUsage": 49,
      "temp": 74,
      "power": 672,
      "cpuUsage": 26,
      "cpuMemUsage": 49
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 41.4
        },
        {
          "timestamp": "03/15",
          "value": 43.5
        },
        {
          "timestamp": "03/16",
          "value": 46
        },
        {
          "timestamp": "03/17",
          "value": 48.4
        },
        {
          "timestamp": "03/18",
          "value": 51.7
        },
        {
          "timestamp": "03/19",
          "value": 46.1
        },
        {
          "timestamp": "03/20",
          "value": 45.2
        },
        {
          "timestamp": "03/21",
          "value": 40.6
        },
        {
          "timestamp": "03/22",
          "value": 40.4
        },
        {
          "timestamp": "03/23",
          "value": 36.8
        },
        {
          "timestamp": "03/24",
          "value": 43.2
        },
        {
          "timestamp": "03/25",
          "value": 38.8
        },
        {
          "timestamp": "03/26",
          "value": 47.5
        },
        {
          "timestamp": "03/27",
          "value": 46.3
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 52.6
        },
        {
          "timestamp": "03/15",
          "value": 49
        },
        {
          "timestamp": "03/16",
          "value": 50.3
        },
        {
          "timestamp": "03/17",
          "value": 55.9
        },
        {
          "timestamp": "03/18",
          "value": 50.9
        },
        {
          "timestamp": "03/19",
          "value": 52.5
        },
        {
          "timestamp": "03/20",
          "value": 50.9
        },
        {
          "timestamp": "03/21",
          "value": 43.8
        },
        {
          "timestamp": "03/22",
          "value": 43.5
        },
        {
          "timestamp": "03/23",
          "value": 46.8
        },
        {
          "timestamp": "03/24",
          "value": 44.2
        },
        {
          "timestamp": "03/25",
          "value": 43.6
        },
        {
          "timestamp": "03/26",
          "value": 48.9
        },
        {
          "timestamp": "03/27",
          "value": 49.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 76.5
        },
        {
          "timestamp": "03/15",
          "value": 75.3
        },
        {
          "timestamp": "03/16",
          "value": 78.3
        },
        {
          "timestamp": "03/17",
          "value": 79.8
        },
        {
          "timestamp": "03/18",
          "value": 81.8
        },
        {
          "timestamp": "03/19",
          "value": 79.2
        },
        {
          "timestamp": "03/20",
          "value": 73.8
        },
        {
          "timestamp": "03/21",
          "value": 70.1
        },
        {
          "timestamp": "03/22",
          "value": 69.7
        },
        {
          "timestamp": "03/23",
          "value": 64.3
        },
        {
          "timestamp": "03/24",
          "value": 65.1
        },
        {
          "timestamp": "03/25",
          "value": 68.7
        },
        {
          "timestamp": "03/26",
          "value": 71.5
        },
        {
          "timestamp": "03/27",
          "value": 76.1
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 676.4
        },
        {
          "timestamp": "03/15",
          "value": 708.8
        },
        {
          "timestamp": "03/16",
          "value": 715.8
        },
        {
          "timestamp": "03/17",
          "value": 773.5
        },
        {
          "timestamp": "03/18",
          "value": 725.1
        },
        {
          "timestamp": "03/19",
          "value": 708.3
        },
        {
          "timestamp": "03/20",
          "value": 719.5
        },
        {
          "timestamp": "03/21",
          "value": 686.7
        },
        {
          "timestamp": "03/22",
          "value": 615.3
        },
        {
          "timestamp": "03/23",
          "value": 585.6
        },
        {
          "timestamp": "03/24",
          "value": 633.3
        },
        {
          "timestamp": "03/25",
          "value": 606
        },
        {
          "timestamp": "03/26",
          "value": 618.5
        },
        {
          "timestamp": "03/27",
          "value": 664.5
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 27.2
        },
        {
          "timestamp": "03/15",
          "value": 26.1
        },
        {
          "timestamp": "03/16",
          "value": 26.2
        },
        {
          "timestamp": "03/17",
          "value": 29.4
        },
        {
          "timestamp": "03/18",
          "value": 27.7
        },
        {
          "timestamp": "03/19",
          "value": 25.8
        },
        {
          "timestamp": "03/20",
          "value": 23.8
        },
        {
          "timestamp": "03/21",
          "value": 24.4
        },
        {
          "timestamp": "03/22",
          "value": 24
        },
        {
          "timestamp": "03/23",
          "value": 21.6
        },
        {
          "timestamp": "03/24",
          "value": 23.8
        },
        {
          "timestamp": "03/25",
          "value": 26.3
        },
        {
          "timestamp": "03/26",
          "value": 24.6
        },
        {
          "timestamp": "03/27",
          "value": 25.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 46.3
        },
        {
          "timestamp": "03/15",
          "value": 54.2
        },
        {
          "timestamp": "03/16",
          "value": 53.5
        },
        {
          "timestamp": "03/17",
          "value": 55.3
        },
        {
          "timestamp": "03/18",
          "value": 55.7
        },
        {
          "timestamp": "03/19",
          "value": 53.6
        },
        {
          "timestamp": "03/20",
          "value": 46.5
        },
        {
          "timestamp": "03/21",
          "value": 44.1
        },
        {
          "timestamp": "03/22",
          "value": 45.7
        },
        {
          "timestamp": "03/23",
          "value": 47.4
        },
        {
          "timestamp": "03/24",
          "value": 41.9
        },
        {
          "timestamp": "03/25",
          "value": 44.4
        },
        {
          "timestamp": "03/26",
          "value": 49.4
        },
        {
          "timestamp": "03/27",
          "value": 48.2
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu022",
    "label": "GPU-022",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 44,
      "memUsage": 37,
      "temp": 73,
      "power": 290,
      "cpuUsage": 25,
      "cpuMemUsage": 63
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 43
        },
        {
          "timestamp": "03/15",
          "value": 44
        },
        {
          "timestamp": "03/16",
          "value": 48.4
        },
        {
          "timestamp": "03/17",
          "value": 47.5
        },
        {
          "timestamp": "03/18",
          "value": 44.4
        },
        {
          "timestamp": "03/19",
          "value": 47.9
        },
        {
          "timestamp": "03/20",
          "value": 47.1
        },
        {
          "timestamp": "03/21",
          "value": 40.7
        },
        {
          "timestamp": "03/22",
          "value": 38.1
        },
        {
          "timestamp": "03/23",
          "value": 42.1
        },
        {
          "timestamp": "03/24",
          "value": 37.8
        },
        {
          "timestamp": "03/25",
          "value": 44.8
        },
        {
          "timestamp": "03/26",
          "value": 46.2
        },
        {
          "timestamp": "03/27",
          "value": 48.6
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 36
        },
        {
          "timestamp": "03/15",
          "value": 38.8
        },
        {
          "timestamp": "03/16",
          "value": 38.2
        },
        {
          "timestamp": "03/17",
          "value": 42
        },
        {
          "timestamp": "03/18",
          "value": 40.2
        },
        {
          "timestamp": "03/19",
          "value": 38.1
        },
        {
          "timestamp": "03/20",
          "value": 38.9
        },
        {
          "timestamp": "03/21",
          "value": 35.3
        },
        {
          "timestamp": "03/22",
          "value": 32.7
        },
        {
          "timestamp": "03/23",
          "value": 33.1
        },
        {
          "timestamp": "03/24",
          "value": 35.7
        },
        {
          "timestamp": "03/25",
          "value": 35.6
        },
        {
          "timestamp": "03/26",
          "value": 35.5
        },
        {
          "timestamp": "03/27",
          "value": 40.2
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 73.8
        },
        {
          "timestamp": "03/15",
          "value": 74.6
        },
        {
          "timestamp": "03/16",
          "value": 80.5
        },
        {
          "timestamp": "03/17",
          "value": 80.7
        },
        {
          "timestamp": "03/18",
          "value": 80.2
        },
        {
          "timestamp": "03/19",
          "value": 77.8
        },
        {
          "timestamp": "03/20",
          "value": 72.5
        },
        {
          "timestamp": "03/21",
          "value": 71
        },
        {
          "timestamp": "03/22",
          "value": 64.6
        },
        {
          "timestamp": "03/23",
          "value": 66.3
        },
        {
          "timestamp": "03/24",
          "value": 66
        },
        {
          "timestamp": "03/25",
          "value": 66.7
        },
        {
          "timestamp": "03/26",
          "value": 72.2
        },
        {
          "timestamp": "03/27",
          "value": 72.4
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 276.4
        },
        {
          "timestamp": "03/15",
          "value": 289.9
        },
        {
          "timestamp": "03/16",
          "value": 312.5
        },
        {
          "timestamp": "03/17",
          "value": 319.3
        },
        {
          "timestamp": "03/18",
          "value": 325.1
        },
        {
          "timestamp": "03/19",
          "value": 296
        },
        {
          "timestamp": "03/20",
          "value": 293.7
        },
        {
          "timestamp": "03/21",
          "value": 266.6
        },
        {
          "timestamp": "03/22",
          "value": 257.9
        },
        {
          "timestamp": "03/23",
          "value": 265.7
        },
        {
          "timestamp": "03/24",
          "value": 261
        },
        {
          "timestamp": "03/25",
          "value": 256.4
        },
        {
          "timestamp": "03/26",
          "value": 294.5
        },
        {
          "timestamp": "03/27",
          "value": 311.4
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 22.9
        },
        {
          "timestamp": "03/15",
          "value": 27.3
        },
        {
          "timestamp": "03/16",
          "value": 28.8
        },
        {
          "timestamp": "03/17",
          "value": 28.3
        },
        {
          "timestamp": "03/18",
          "value": 27
        },
        {
          "timestamp": "03/19",
          "value": 27.2
        },
        {
          "timestamp": "03/20",
          "value": 23.9
        },
        {
          "timestamp": "03/21",
          "value": 23.7
        },
        {
          "timestamp": "03/22",
          "value": 20.7
        },
        {
          "timestamp": "03/23",
          "value": 23.7
        },
        {
          "timestamp": "03/24",
          "value": 24.8
        },
        {
          "timestamp": "03/25",
          "value": 21.4
        },
        {
          "timestamp": "03/26",
          "value": 24.2
        },
        {
          "timestamp": "03/27",
          "value": 23.6
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 60.1
        },
        {
          "timestamp": "03/15",
          "value": 70.1
        },
        {
          "timestamp": "03/16",
          "value": 70.7
        },
        {
          "timestamp": "03/17",
          "value": 71.9
        },
        {
          "timestamp": "03/18",
          "value": 70.5
        },
        {
          "timestamp": "03/19",
          "value": 71.1
        },
        {
          "timestamp": "03/20",
          "value": 62.3
        },
        {
          "timestamp": "03/21",
          "value": 64.8
        },
        {
          "timestamp": "03/22",
          "value": 57
        },
        {
          "timestamp": "03/23",
          "value": 57.4
        },
        {
          "timestamp": "03/24",
          "value": 58.7
        },
        {
          "timestamp": "03/25",
          "value": 61.7
        },
        {
          "timestamp": "03/26",
          "value": 63.4
        },
        {
          "timestamp": "03/27",
          "value": 62.4
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu023",
    "label": "GPU-023",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 60,
      "memUsage": 41,
      "temp": 77,
      "power": 480,
      "cpuUsage": 38,
      "cpuMemUsage": 69
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 57.5
        },
        {
          "timestamp": "03/15",
          "value": 58.9
        },
        {
          "timestamp": "03/16",
          "value": 69.9
        },
        {
          "timestamp": "03/17",
          "value": 69.5
        },
        {
          "timestamp": "03/18",
          "value": 68
        },
        {
          "timestamp": "03/19",
          "value": 65.6
        },
        {
          "timestamp": "03/20",
          "value": 64.2
        },
        {
          "timestamp": "03/21",
          "value": 53.2
        },
        {
          "timestamp": "03/22",
          "value": 54.3
        },
        {
          "timestamp": "03/23",
          "value": 54.1
        },
        {
          "timestamp": "03/24",
          "value": 50.8
        },
        {
          "timestamp": "03/25",
          "value": 57.5
        },
        {
          "timestamp": "03/26",
          "value": 58.8
        },
        {
          "timestamp": "03/27",
          "value": 64
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 42.4
        },
        {
          "timestamp": "03/15",
          "value": 45
        },
        {
          "timestamp": "03/16",
          "value": 46.1
        },
        {
          "timestamp": "03/17",
          "value": 44
        },
        {
          "timestamp": "03/18",
          "value": 44.3
        },
        {
          "timestamp": "03/19",
          "value": 46.3
        },
        {
          "timestamp": "03/20",
          "value": 41.5
        },
        {
          "timestamp": "03/21",
          "value": 39.7
        },
        {
          "timestamp": "03/22",
          "value": 35.1
        },
        {
          "timestamp": "03/23",
          "value": 40
        },
        {
          "timestamp": "03/24",
          "value": 37.5
        },
        {
          "timestamp": "03/25",
          "value": 40.3
        },
        {
          "timestamp": "03/26",
          "value": 40
        },
        {
          "timestamp": "03/27",
          "value": 42.7
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 77.1
        },
        {
          "timestamp": "03/15",
          "value": 81.9
        },
        {
          "timestamp": "03/16",
          "value": 83.1
        },
        {
          "timestamp": "03/17",
          "value": 85.7
        },
        {
          "timestamp": "03/18",
          "value": 84.5
        },
        {
          "timestamp": "03/19",
          "value": 83.8
        },
        {
          "timestamp": "03/20",
          "value": 80
        },
        {
          "timestamp": "03/21",
          "value": 76.6
        },
        {
          "timestamp": "03/22",
          "value": 73.4
        },
        {
          "timestamp": "03/23",
          "value": 67.2
        },
        {
          "timestamp": "03/24",
          "value": 68.6
        },
        {
          "timestamp": "03/25",
          "value": 70.7
        },
        {
          "timestamp": "03/26",
          "value": 73.4
        },
        {
          "timestamp": "03/27",
          "value": 78.9
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 485
        },
        {
          "timestamp": "03/15",
          "value": 507.7
        },
        {
          "timestamp": "03/16",
          "value": 494.1
        },
        {
          "timestamp": "03/17",
          "value": 512.3
        },
        {
          "timestamp": "03/18",
          "value": 532.4
        },
        {
          "timestamp": "03/19",
          "value": 512.9
        },
        {
          "timestamp": "03/20",
          "value": 476
        },
        {
          "timestamp": "03/21",
          "value": 477.6
        },
        {
          "timestamp": "03/22",
          "value": 450.1
        },
        {
          "timestamp": "03/23",
          "value": 457.6
        },
        {
          "timestamp": "03/24",
          "value": 416.5
        },
        {
          "timestamp": "03/25",
          "value": 456
        },
        {
          "timestamp": "03/26",
          "value": 481.9
        },
        {
          "timestamp": "03/27",
          "value": 465.5
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 39.3
        },
        {
          "timestamp": "03/15",
          "value": 41.2
        },
        {
          "timestamp": "03/16",
          "value": 44.2
        },
        {
          "timestamp": "03/17",
          "value": 42.4
        },
        {
          "timestamp": "03/18",
          "value": 40.7
        },
        {
          "timestamp": "03/19",
          "value": 40.7
        },
        {
          "timestamp": "03/20",
          "value": 40.2
        },
        {
          "timestamp": "03/21",
          "value": 38.7
        },
        {
          "timestamp": "03/22",
          "value": 38.1
        },
        {
          "timestamp": "03/23",
          "value": 35.5
        },
        {
          "timestamp": "03/24",
          "value": 31.5
        },
        {
          "timestamp": "03/25",
          "value": 37.6
        },
        {
          "timestamp": "03/26",
          "value": 40.5
        },
        {
          "timestamp": "03/27",
          "value": 37.3
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 69.5
        },
        {
          "timestamp": "03/15",
          "value": 76.3
        },
        {
          "timestamp": "03/16",
          "value": 73.9
        },
        {
          "timestamp": "03/17",
          "value": 74.2
        },
        {
          "timestamp": "03/18",
          "value": 70.7
        },
        {
          "timestamp": "03/19",
          "value": 75.7
        },
        {
          "timestamp": "03/20",
          "value": 65.5
        },
        {
          "timestamp": "03/21",
          "value": 71
        },
        {
          "timestamp": "03/22",
          "value": 65.2
        },
        {
          "timestamp": "03/23",
          "value": 60.8
        },
        {
          "timestamp": "03/24",
          "value": 58.9
        },
        {
          "timestamp": "03/25",
          "value": 64.2
        },
        {
          "timestamp": "03/26",
          "value": 71.5
        },
        {
          "timestamp": "03/27",
          "value": 68.3
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu024",
    "label": "GPU-024",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 70,
      "memUsage": 42,
      "temp": 63,
      "power": 393,
      "cpuUsage": 72,
      "cpuMemUsage": 51
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 68.6
        },
        {
          "timestamp": "03/15",
          "value": 73.6
        },
        {
          "timestamp": "03/16",
          "value": 78.6
        },
        {
          "timestamp": "03/17",
          "value": 74.2
        },
        {
          "timestamp": "03/18",
          "value": 72
        },
        {
          "timestamp": "03/19",
          "value": 77.7
        },
        {
          "timestamp": "03/20",
          "value": 72.5
        },
        {
          "timestamp": "03/21",
          "value": 68.4
        },
        {
          "timestamp": "03/22",
          "value": 67.4
        },
        {
          "timestamp": "03/23",
          "value": 56.9
        },
        {
          "timestamp": "03/24",
          "value": 68.9
        },
        {
          "timestamp": "03/25",
          "value": 69.2
        },
        {
          "timestamp": "03/26",
          "value": 72.8
        },
        {
          "timestamp": "03/27",
          "value": 74.7
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 42.1
        },
        {
          "timestamp": "03/15",
          "value": 41.6
        },
        {
          "timestamp": "03/16",
          "value": 42.7
        },
        {
          "timestamp": "03/17",
          "value": 48.7
        },
        {
          "timestamp": "03/18",
          "value": 45.4
        },
        {
          "timestamp": "03/19",
          "value": 42.9
        },
        {
          "timestamp": "03/20",
          "value": 44.7
        },
        {
          "timestamp": "03/21",
          "value": 43.1
        },
        {
          "timestamp": "03/22",
          "value": 40.2
        },
        {
          "timestamp": "03/23",
          "value": 39.3
        },
        {
          "timestamp": "03/24",
          "value": 34.9
        },
        {
          "timestamp": "03/25",
          "value": 36.2
        },
        {
          "timestamp": "03/26",
          "value": 42.5
        },
        {
          "timestamp": "03/27",
          "value": 40.9
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 60.8
        },
        {
          "timestamp": "03/15",
          "value": 65
        },
        {
          "timestamp": "03/16",
          "value": 66.3
        },
        {
          "timestamp": "03/17",
          "value": 68.6
        },
        {
          "timestamp": "03/18",
          "value": 71.1
        },
        {
          "timestamp": "03/19",
          "value": 66.1
        },
        {
          "timestamp": "03/20",
          "value": 66.3
        },
        {
          "timestamp": "03/21",
          "value": 60.1
        },
        {
          "timestamp": "03/22",
          "value": 58.9
        },
        {
          "timestamp": "03/23",
          "value": 56.1
        },
        {
          "timestamp": "03/24",
          "value": 59.1
        },
        {
          "timestamp": "03/25",
          "value": 61
        },
        {
          "timestamp": "03/26",
          "value": 59
        },
        {
          "timestamp": "03/27",
          "value": 63.7
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 371.8
        },
        {
          "timestamp": "03/15",
          "value": 421.5
        },
        {
          "timestamp": "03/16",
          "value": 448.7
        },
        {
          "timestamp": "03/17",
          "value": 421.3
        },
        {
          "timestamp": "03/18",
          "value": 406.5
        },
        {
          "timestamp": "03/19",
          "value": 439.1
        },
        {
          "timestamp": "03/20",
          "value": 391.6
        },
        {
          "timestamp": "03/21",
          "value": 380.5
        },
        {
          "timestamp": "03/22",
          "value": 376.2
        },
        {
          "timestamp": "03/23",
          "value": 350.3
        },
        {
          "timestamp": "03/24",
          "value": 337.2
        },
        {
          "timestamp": "03/25",
          "value": 343.4
        },
        {
          "timestamp": "03/26",
          "value": 365.9
        },
        {
          "timestamp": "03/27",
          "value": 410.1
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 76.7
        },
        {
          "timestamp": "03/15",
          "value": 75
        },
        {
          "timestamp": "03/16",
          "value": 77.3
        },
        {
          "timestamp": "03/17",
          "value": 73.2
        },
        {
          "timestamp": "03/18",
          "value": 76.8
        },
        {
          "timestamp": "03/19",
          "value": 79.5
        },
        {
          "timestamp": "03/20",
          "value": 69.8
        },
        {
          "timestamp": "03/21",
          "value": 76.5
        },
        {
          "timestamp": "03/22",
          "value": 60
        },
        {
          "timestamp": "03/23",
          "value": 62.1
        },
        {
          "timestamp": "03/24",
          "value": 69.4
        },
        {
          "timestamp": "03/25",
          "value": 65.8
        },
        {
          "timestamp": "03/26",
          "value": 69.3
        },
        {
          "timestamp": "03/27",
          "value": 76.6
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 48.8
        },
        {
          "timestamp": "03/15",
          "value": 50.7
        },
        {
          "timestamp": "03/16",
          "value": 52.1
        },
        {
          "timestamp": "03/17",
          "value": 54.1
        },
        {
          "timestamp": "03/18",
          "value": 55.2
        },
        {
          "timestamp": "03/19",
          "value": 55.4
        },
        {
          "timestamp": "03/20",
          "value": 54.8
        },
        {
          "timestamp": "03/21",
          "value": 51.2
        },
        {
          "timestamp": "03/22",
          "value": 50.1
        },
        {
          "timestamp": "03/23",
          "value": 44.8
        },
        {
          "timestamp": "03/24",
          "value": 44.2
        },
        {
          "timestamp": "03/25",
          "value": 43.9
        },
        {
          "timestamp": "03/26",
          "value": 48.3
        },
        {
          "timestamp": "03/27",
          "value": 52.1
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu025",
    "label": "GPU-025",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 40,
      "memUsage": 37,
      "temp": 77,
      "power": 769,
      "cpuUsage": 72,
      "cpuMemUsage": 76
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 42.9
        },
        {
          "timestamp": "03/15",
          "value": 38.4
        },
        {
          "timestamp": "03/16",
          "value": 44.8
        },
        {
          "timestamp": "03/17",
          "value": 42.5
        },
        {
          "timestamp": "03/18",
          "value": 45.2
        },
        {
          "timestamp": "03/19",
          "value": 42.6
        },
        {
          "timestamp": "03/20",
          "value": 42.9
        },
        {
          "timestamp": "03/21",
          "value": 36.1
        },
        {
          "timestamp": "03/22",
          "value": 35.4
        },
        {
          "timestamp": "03/23",
          "value": 37.3
        },
        {
          "timestamp": "03/24",
          "value": 34.5
        },
        {
          "timestamp": "03/25",
          "value": 40
        },
        {
          "timestamp": "03/26",
          "value": 41.6
        },
        {
          "timestamp": "03/27",
          "value": 39.1
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 39
        },
        {
          "timestamp": "03/15",
          "value": 37.7
        },
        {
          "timestamp": "03/16",
          "value": 39
        },
        {
          "timestamp": "03/17",
          "value": 42.7
        },
        {
          "timestamp": "03/18",
          "value": 38.8
        },
        {
          "timestamp": "03/19",
          "value": 37.5
        },
        {
          "timestamp": "03/20",
          "value": 38.4
        },
        {
          "timestamp": "03/21",
          "value": 35.6
        },
        {
          "timestamp": "03/22",
          "value": 35.9
        },
        {
          "timestamp": "03/23",
          "value": 32.4
        },
        {
          "timestamp": "03/24",
          "value": 34.5
        },
        {
          "timestamp": "03/25",
          "value": 35.6
        },
        {
          "timestamp": "03/26",
          "value": 35.6
        },
        {
          "timestamp": "03/27",
          "value": 40.5
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 77
        },
        {
          "timestamp": "03/15",
          "value": 77.8
        },
        {
          "timestamp": "03/16",
          "value": 82.6
        },
        {
          "timestamp": "03/17",
          "value": 81.8
        },
        {
          "timestamp": "03/18",
          "value": 85.9
        },
        {
          "timestamp": "03/19",
          "value": 78.6
        },
        {
          "timestamp": "03/20",
          "value": 77.2
        },
        {
          "timestamp": "03/21",
          "value": 75
        },
        {
          "timestamp": "03/22",
          "value": 71.6
        },
        {
          "timestamp": "03/23",
          "value": 70.1
        },
        {
          "timestamp": "03/24",
          "value": 71.3
        },
        {
          "timestamp": "03/25",
          "value": 71
        },
        {
          "timestamp": "03/26",
          "value": 72.6
        },
        {
          "timestamp": "03/27",
          "value": 78.3
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 754.8
        },
        {
          "timestamp": "03/15",
          "value": 780
        },
        {
          "timestamp": "03/16",
          "value": 844.2
        },
        {
          "timestamp": "03/17",
          "value": 815.4
        },
        {
          "timestamp": "03/18",
          "value": 841.5
        },
        {
          "timestamp": "03/19",
          "value": 854.8
        },
        {
          "timestamp": "03/20",
          "value": 762.8
        },
        {
          "timestamp": "03/21",
          "value": 716.7
        },
        {
          "timestamp": "03/22",
          "value": 747.3
        },
        {
          "timestamp": "03/23",
          "value": 662.7
        },
        {
          "timestamp": "03/24",
          "value": 677.6
        },
        {
          "timestamp": "03/25",
          "value": 750.1
        },
        {
          "timestamp": "03/26",
          "value": 789.3
        },
        {
          "timestamp": "03/27",
          "value": 830.8
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 72.5
        },
        {
          "timestamp": "03/15",
          "value": 77.1
        },
        {
          "timestamp": "03/16",
          "value": 77.1
        },
        {
          "timestamp": "03/17",
          "value": 86.3
        },
        {
          "timestamp": "03/18",
          "value": 83.6
        },
        {
          "timestamp": "03/19",
          "value": 78.9
        },
        {
          "timestamp": "03/20",
          "value": 78.9
        },
        {
          "timestamp": "03/21",
          "value": 65.6
        },
        {
          "timestamp": "03/22",
          "value": 60.3
        },
        {
          "timestamp": "03/23",
          "value": 59.1
        },
        {
          "timestamp": "03/24",
          "value": 71.7
        },
        {
          "timestamp": "03/25",
          "value": 63.3
        },
        {
          "timestamp": "03/26",
          "value": 65
        },
        {
          "timestamp": "03/27",
          "value": 80.1
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 72.1
        },
        {
          "timestamp": "03/15",
          "value": 83.2
        },
        {
          "timestamp": "03/16",
          "value": 83.5
        },
        {
          "timestamp": "03/17",
          "value": 86.7
        },
        {
          "timestamp": "03/18",
          "value": 83.8
        },
        {
          "timestamp": "03/19",
          "value": 80.2
        },
        {
          "timestamp": "03/20",
          "value": 76
        },
        {
          "timestamp": "03/21",
          "value": 71.9
        },
        {
          "timestamp": "03/22",
          "value": 66.4
        },
        {
          "timestamp": "03/23",
          "value": 68.4
        },
        {
          "timestamp": "03/24",
          "value": 69
        },
        {
          "timestamp": "03/25",
          "value": 73.2
        },
        {
          "timestamp": "03/26",
          "value": 71.5
        },
        {
          "timestamp": "03/27",
          "value": 77.6
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu026",
    "label": "GPU-026",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 64,
      "memUsage": 70,
      "temp": 55,
      "power": 766,
      "cpuUsage": 54,
      "cpuMemUsage": 54
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 65
        },
        {
          "timestamp": "03/15",
          "value": 72.6
        },
        {
          "timestamp": "03/16",
          "value": 71.7
        },
        {
          "timestamp": "03/17",
          "value": 72
        },
        {
          "timestamp": "03/18",
          "value": 66.3
        },
        {
          "timestamp": "03/19",
          "value": 65.9
        },
        {
          "timestamp": "03/20",
          "value": 63.9
        },
        {
          "timestamp": "03/21",
          "value": 59.4
        },
        {
          "timestamp": "03/22",
          "value": 55.2
        },
        {
          "timestamp": "03/23",
          "value": 53.7
        },
        {
          "timestamp": "03/24",
          "value": 60.6
        },
        {
          "timestamp": "03/25",
          "value": 63.4
        },
        {
          "timestamp": "03/26",
          "value": 66.2
        },
        {
          "timestamp": "03/27",
          "value": 69.4
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 74.1
        },
        {
          "timestamp": "03/15",
          "value": 74.4
        },
        {
          "timestamp": "03/16",
          "value": 73.6
        },
        {
          "timestamp": "03/17",
          "value": 79.6
        },
        {
          "timestamp": "03/18",
          "value": 71.3
        },
        {
          "timestamp": "03/19",
          "value": 72
        },
        {
          "timestamp": "03/20",
          "value": 72.5
        },
        {
          "timestamp": "03/21",
          "value": 63.5
        },
        {
          "timestamp": "03/22",
          "value": 65.8
        },
        {
          "timestamp": "03/23",
          "value": 61.1
        },
        {
          "timestamp": "03/24",
          "value": 63.1
        },
        {
          "timestamp": "03/25",
          "value": 62.4
        },
        {
          "timestamp": "03/26",
          "value": 67.6
        },
        {
          "timestamp": "03/27",
          "value": 72.9
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 54.4
        },
        {
          "timestamp": "03/15",
          "value": 59.7
        },
        {
          "timestamp": "03/16",
          "value": 57.7
        },
        {
          "timestamp": "03/17",
          "value": 59.7
        },
        {
          "timestamp": "03/18",
          "value": 59.3
        },
        {
          "timestamp": "03/19",
          "value": 57.4
        },
        {
          "timestamp": "03/20",
          "value": 53.8
        },
        {
          "timestamp": "03/21",
          "value": 55
        },
        {
          "timestamp": "03/22",
          "value": 51.1
        },
        {
          "timestamp": "03/23",
          "value": 48.8
        },
        {
          "timestamp": "03/24",
          "value": 49.9
        },
        {
          "timestamp": "03/25",
          "value": 49.5
        },
        {
          "timestamp": "03/26",
          "value": 52.8
        },
        {
          "timestamp": "03/27",
          "value": 56.2
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 735.2
        },
        {
          "timestamp": "03/15",
          "value": 767.3
        },
        {
          "timestamp": "03/16",
          "value": 841.8
        },
        {
          "timestamp": "03/17",
          "value": 843.1
        },
        {
          "timestamp": "03/18",
          "value": 849.7
        },
        {
          "timestamp": "03/19",
          "value": 781.4
        },
        {
          "timestamp": "03/20",
          "value": 770.1
        },
        {
          "timestamp": "03/21",
          "value": 699.4
        },
        {
          "timestamp": "03/22",
          "value": 716.4
        },
        {
          "timestamp": "03/23",
          "value": 712.5
        },
        {
          "timestamp": "03/24",
          "value": 652.2
        },
        {
          "timestamp": "03/25",
          "value": 694.3
        },
        {
          "timestamp": "03/26",
          "value": 765.3
        },
        {
          "timestamp": "03/27",
          "value": 774.3
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 51.7
        },
        {
          "timestamp": "03/15",
          "value": 59.9
        },
        {
          "timestamp": "03/16",
          "value": 62.7
        },
        {
          "timestamp": "03/17",
          "value": 62.6
        },
        {
          "timestamp": "03/18",
          "value": 55.1
        },
        {
          "timestamp": "03/19",
          "value": 57.8
        },
        {
          "timestamp": "03/20",
          "value": 57.7
        },
        {
          "timestamp": "03/21",
          "value": 53.2
        },
        {
          "timestamp": "03/22",
          "value": 48.5
        },
        {
          "timestamp": "03/23",
          "value": 50.1
        },
        {
          "timestamp": "03/24",
          "value": 50.7
        },
        {
          "timestamp": "03/25",
          "value": 53.3
        },
        {
          "timestamp": "03/26",
          "value": 50.8
        },
        {
          "timestamp": "03/27",
          "value": 53.3
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 51
        },
        {
          "timestamp": "03/15",
          "value": 59.6
        },
        {
          "timestamp": "03/16",
          "value": 55.9
        },
        {
          "timestamp": "03/17",
          "value": 58.9
        },
        {
          "timestamp": "03/18",
          "value": 59
        },
        {
          "timestamp": "03/19",
          "value": 59.1
        },
        {
          "timestamp": "03/20",
          "value": 54.5
        },
        {
          "timestamp": "03/21",
          "value": 52.7
        },
        {
          "timestamp": "03/22",
          "value": 50.8
        },
        {
          "timestamp": "03/23",
          "value": 46.7
        },
        {
          "timestamp": "03/24",
          "value": 52.3
        },
        {
          "timestamp": "03/25",
          "value": 53.1
        },
        {
          "timestamp": "03/26",
          "value": 53.4
        },
        {
          "timestamp": "03/27",
          "value": 56.9
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu027",
    "label": "GPU-027",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "err",
    "current": {
      "gpuUsage": 0,
      "memUsage": 0,
      "temp": 0,
      "power": 0,
      "cpuUsage": 0,
      "cpuMemUsage": 0
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu028",
    "label": "GPU-028",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 32,
      "memUsage": 77,
      "temp": 55,
      "power": 693,
      "cpuUsage": 24,
      "cpuMemUsage": 36
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 29.4
        },
        {
          "timestamp": "03/15",
          "value": 34.8
        },
        {
          "timestamp": "03/16",
          "value": 36.2
        },
        {
          "timestamp": "03/17",
          "value": 35.8
        },
        {
          "timestamp": "03/18",
          "value": 35.7
        },
        {
          "timestamp": "03/19",
          "value": 34.8
        },
        {
          "timestamp": "03/20",
          "value": 33.9
        },
        {
          "timestamp": "03/21",
          "value": 31.8
        },
        {
          "timestamp": "03/22",
          "value": 29.5
        },
        {
          "timestamp": "03/23",
          "value": 29.8
        },
        {
          "timestamp": "03/24",
          "value": 30.1
        },
        {
          "timestamp": "03/25",
          "value": 28.8
        },
        {
          "timestamp": "03/26",
          "value": 28.6
        },
        {
          "timestamp": "03/27",
          "value": 34.7
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 78
        },
        {
          "timestamp": "03/15",
          "value": 82.5
        },
        {
          "timestamp": "03/16",
          "value": 85.7
        },
        {
          "timestamp": "03/17",
          "value": 89.4
        },
        {
          "timestamp": "03/18",
          "value": 84.5
        },
        {
          "timestamp": "03/19",
          "value": 78.4
        },
        {
          "timestamp": "03/20",
          "value": 73.3
        },
        {
          "timestamp": "03/21",
          "value": 77.7
        },
        {
          "timestamp": "03/22",
          "value": 75.9
        },
        {
          "timestamp": "03/23",
          "value": 70.4
        },
        {
          "timestamp": "03/24",
          "value": 72.4
        },
        {
          "timestamp": "03/25",
          "value": 71.1
        },
        {
          "timestamp": "03/26",
          "value": 71.2
        },
        {
          "timestamp": "03/27",
          "value": 74.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 52.9
        },
        {
          "timestamp": "03/15",
          "value": 57
        },
        {
          "timestamp": "03/16",
          "value": 60.3
        },
        {
          "timestamp": "03/17",
          "value": 59.9
        },
        {
          "timestamp": "03/18",
          "value": 59.4
        },
        {
          "timestamp": "03/19",
          "value": 58.6
        },
        {
          "timestamp": "03/20",
          "value": 55.2
        },
        {
          "timestamp": "03/21",
          "value": 53.4
        },
        {
          "timestamp": "03/22",
          "value": 49.8
        },
        {
          "timestamp": "03/23",
          "value": 50.4
        },
        {
          "timestamp": "03/24",
          "value": 51.5
        },
        {
          "timestamp": "03/25",
          "value": 52.3
        },
        {
          "timestamp": "03/26",
          "value": 53.1
        },
        {
          "timestamp": "03/27",
          "value": 54.6
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 666.6
        },
        {
          "timestamp": "03/15",
          "value": 766.4
        },
        {
          "timestamp": "03/16",
          "value": 729.3
        },
        {
          "timestamp": "03/17",
          "value": 780.7
        },
        {
          "timestamp": "03/18",
          "value": 757
        },
        {
          "timestamp": "03/19",
          "value": 751.8
        },
        {
          "timestamp": "03/20",
          "value": 707.6
        },
        {
          "timestamp": "03/21",
          "value": 660.4
        },
        {
          "timestamp": "03/22",
          "value": 604.4
        },
        {
          "timestamp": "03/23",
          "value": 641.4
        },
        {
          "timestamp": "03/24",
          "value": 663.4
        },
        {
          "timestamp": "03/25",
          "value": 620.3
        },
        {
          "timestamp": "03/26",
          "value": 714.7
        },
        {
          "timestamp": "03/27",
          "value": 732.5
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 22.7
        },
        {
          "timestamp": "03/15",
          "value": 26.2
        },
        {
          "timestamp": "03/16",
          "value": 26
        },
        {
          "timestamp": "03/17",
          "value": 25
        },
        {
          "timestamp": "03/18",
          "value": 28.3
        },
        {
          "timestamp": "03/19",
          "value": 24.9
        },
        {
          "timestamp": "03/20",
          "value": 22.5
        },
        {
          "timestamp": "03/21",
          "value": 21.7
        },
        {
          "timestamp": "03/22",
          "value": 22.7
        },
        {
          "timestamp": "03/23",
          "value": 23.8
        },
        {
          "timestamp": "03/24",
          "value": 22.1
        },
        {
          "timestamp": "03/25",
          "value": 22.5
        },
        {
          "timestamp": "03/26",
          "value": 23.2
        },
        {
          "timestamp": "03/27",
          "value": 22.3
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 37.4
        },
        {
          "timestamp": "03/15",
          "value": 36.9
        },
        {
          "timestamp": "03/16",
          "value": 40.9
        },
        {
          "timestamp": "03/17",
          "value": 38.4
        },
        {
          "timestamp": "03/18",
          "value": 39
        },
        {
          "timestamp": "03/19",
          "value": 36.5
        },
        {
          "timestamp": "03/20",
          "value": 36.5
        },
        {
          "timestamp": "03/21",
          "value": 35.5
        },
        {
          "timestamp": "03/22",
          "value": 34.2
        },
        {
          "timestamp": "03/23",
          "value": 30.2
        },
        {
          "timestamp": "03/24",
          "value": 32.1
        },
        {
          "timestamp": "03/25",
          "value": 35.7
        },
        {
          "timestamp": "03/26",
          "value": 33.7
        },
        {
          "timestamp": "03/27",
          "value": 37.9
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu029",
    "label": "GPU-029",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 40,
      "memUsage": 27,
      "temp": 58,
      "power": 618,
      "cpuUsage": 64,
      "cpuMemUsage": 39
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 38.3
        },
        {
          "timestamp": "03/15",
          "value": 38.8
        },
        {
          "timestamp": "03/16",
          "value": 39.9
        },
        {
          "timestamp": "03/17",
          "value": 41
        },
        {
          "timestamp": "03/18",
          "value": 46.6
        },
        {
          "timestamp": "03/19",
          "value": 45.7
        },
        {
          "timestamp": "03/20",
          "value": 43
        },
        {
          "timestamp": "03/21",
          "value": 42.1
        },
        {
          "timestamp": "03/22",
          "value": 37.1
        },
        {
          "timestamp": "03/23",
          "value": 34.6
        },
        {
          "timestamp": "03/24",
          "value": 34
        },
        {
          "timestamp": "03/25",
          "value": 39.5
        },
        {
          "timestamp": "03/26",
          "value": 36.2
        },
        {
          "timestamp": "03/27",
          "value": 40.1
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 25.7
        },
        {
          "timestamp": "03/15",
          "value": 29.9
        },
        {
          "timestamp": "03/16",
          "value": 30.7
        },
        {
          "timestamp": "03/17",
          "value": 30.1
        },
        {
          "timestamp": "03/18",
          "value": 28
        },
        {
          "timestamp": "03/19",
          "value": 30.4
        },
        {
          "timestamp": "03/20",
          "value": 27.5
        },
        {
          "timestamp": "03/21",
          "value": 26.8
        },
        {
          "timestamp": "03/22",
          "value": 26.8
        },
        {
          "timestamp": "03/23",
          "value": 25.6
        },
        {
          "timestamp": "03/24",
          "value": 23.2
        },
        {
          "timestamp": "03/25",
          "value": 25.1
        },
        {
          "timestamp": "03/26",
          "value": 26.6
        },
        {
          "timestamp": "03/27",
          "value": 28.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 58.5
        },
        {
          "timestamp": "03/15",
          "value": 60.4
        },
        {
          "timestamp": "03/16",
          "value": 61.3
        },
        {
          "timestamp": "03/17",
          "value": 63.4
        },
        {
          "timestamp": "03/18",
          "value": 62.6
        },
        {
          "timestamp": "03/19",
          "value": 62.8
        },
        {
          "timestamp": "03/20",
          "value": 58.1
        },
        {
          "timestamp": "03/21",
          "value": 53.9
        },
        {
          "timestamp": "03/22",
          "value": 54.4
        },
        {
          "timestamp": "03/23",
          "value": 52.3
        },
        {
          "timestamp": "03/24",
          "value": 52.1
        },
        {
          "timestamp": "03/25",
          "value": 54.4
        },
        {
          "timestamp": "03/26",
          "value": 56
        },
        {
          "timestamp": "03/27",
          "value": 60.5
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 591.2
        },
        {
          "timestamp": "03/15",
          "value": 628.6
        },
        {
          "timestamp": "03/16",
          "value": 641.2
        },
        {
          "timestamp": "03/17",
          "value": 695.3
        },
        {
          "timestamp": "03/18",
          "value": 641.4
        },
        {
          "timestamp": "03/19",
          "value": 618.1
        },
        {
          "timestamp": "03/20",
          "value": 636.4
        },
        {
          "timestamp": "03/21",
          "value": 570.9
        },
        {
          "timestamp": "03/22",
          "value": 547.8
        },
        {
          "timestamp": "03/23",
          "value": 562.1
        },
        {
          "timestamp": "03/24",
          "value": 586.3
        },
        {
          "timestamp": "03/25",
          "value": 584
        },
        {
          "timestamp": "03/26",
          "value": 622.7
        },
        {
          "timestamp": "03/27",
          "value": 642.3
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 61.5
        },
        {
          "timestamp": "03/15",
          "value": 68.4
        },
        {
          "timestamp": "03/16",
          "value": 73.8
        },
        {
          "timestamp": "03/17",
          "value": 75.5
        },
        {
          "timestamp": "03/18",
          "value": 66.4
        },
        {
          "timestamp": "03/19",
          "value": 63.5
        },
        {
          "timestamp": "03/20",
          "value": 66.9
        },
        {
          "timestamp": "03/21",
          "value": 59.6
        },
        {
          "timestamp": "03/22",
          "value": 54.6
        },
        {
          "timestamp": "03/23",
          "value": 55.8
        },
        {
          "timestamp": "03/24",
          "value": 61.6
        },
        {
          "timestamp": "03/25",
          "value": 59
        },
        {
          "timestamp": "03/26",
          "value": 56
        },
        {
          "timestamp": "03/27",
          "value": 70.7
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 40.9
        },
        {
          "timestamp": "03/15",
          "value": 40.4
        },
        {
          "timestamp": "03/16",
          "value": 41.1
        },
        {
          "timestamp": "03/17",
          "value": 43.3
        },
        {
          "timestamp": "03/18",
          "value": 44
        },
        {
          "timestamp": "03/19",
          "value": 40.6
        },
        {
          "timestamp": "03/20",
          "value": 37.3
        },
        {
          "timestamp": "03/21",
          "value": 35.5
        },
        {
          "timestamp": "03/22",
          "value": 38.4
        },
        {
          "timestamp": "03/23",
          "value": 34.7
        },
        {
          "timestamp": "03/24",
          "value": 34.3
        },
        {
          "timestamp": "03/25",
          "value": 34.3
        },
        {
          "timestamp": "03/26",
          "value": 38.9
        },
        {
          "timestamp": "03/27",
          "value": 39.5
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu030",
    "label": "GPU-030",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 33,
      "memUsage": 76,
      "temp": 68,
      "power": 661,
      "cpuUsage": 62,
      "cpuMemUsage": 61
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 36
        },
        {
          "timestamp": "03/15",
          "value": 34.4
        },
        {
          "timestamp": "03/16",
          "value": 38.1
        },
        {
          "timestamp": "03/17",
          "value": 35.7
        },
        {
          "timestamp": "03/18",
          "value": 35.5
        },
        {
          "timestamp": "03/19",
          "value": 36.5
        },
        {
          "timestamp": "03/20",
          "value": 32.7
        },
        {
          "timestamp": "03/21",
          "value": 32.7
        },
        {
          "timestamp": "03/22",
          "value": 30.7
        },
        {
          "timestamp": "03/23",
          "value": 28.1
        },
        {
          "timestamp": "03/24",
          "value": 32.6
        },
        {
          "timestamp": "03/25",
          "value": 32
        },
        {
          "timestamp": "03/26",
          "value": 34.1
        },
        {
          "timestamp": "03/27",
          "value": 32.8
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 77.6
        },
        {
          "timestamp": "03/15",
          "value": 79.6
        },
        {
          "timestamp": "03/16",
          "value": 87.4
        },
        {
          "timestamp": "03/17",
          "value": 85.8
        },
        {
          "timestamp": "03/18",
          "value": 77.6
        },
        {
          "timestamp": "03/19",
          "value": 78.1
        },
        {
          "timestamp": "03/20",
          "value": 78
        },
        {
          "timestamp": "03/21",
          "value": 74.9
        },
        {
          "timestamp": "03/22",
          "value": 71.7
        },
        {
          "timestamp": "03/23",
          "value": 68.6
        },
        {
          "timestamp": "03/24",
          "value": 65.3
        },
        {
          "timestamp": "03/25",
          "value": 70.4
        },
        {
          "timestamp": "03/26",
          "value": 68.9
        },
        {
          "timestamp": "03/27",
          "value": 79.7
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 69.8
        },
        {
          "timestamp": "03/15",
          "value": 71
        },
        {
          "timestamp": "03/16",
          "value": 75.2
        },
        {
          "timestamp": "03/17",
          "value": 73.8
        },
        {
          "timestamp": "03/18",
          "value": 76.5
        },
        {
          "timestamp": "03/19",
          "value": 73.8
        },
        {
          "timestamp": "03/20",
          "value": 68.8
        },
        {
          "timestamp": "03/21",
          "value": 66.3
        },
        {
          "timestamp": "03/22",
          "value": 62.7
        },
        {
          "timestamp": "03/23",
          "value": 63.1
        },
        {
          "timestamp": "03/24",
          "value": 60.2
        },
        {
          "timestamp": "03/25",
          "value": 63.8
        },
        {
          "timestamp": "03/26",
          "value": 65
        },
        {
          "timestamp": "03/27",
          "value": 69.7
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 629.7
        },
        {
          "timestamp": "03/15",
          "value": 663.5
        },
        {
          "timestamp": "03/16",
          "value": 696.5
        },
        {
          "timestamp": "03/17",
          "value": 730.7
        },
        {
          "timestamp": "03/18",
          "value": 734.5
        },
        {
          "timestamp": "03/19",
          "value": 708.6
        },
        {
          "timestamp": "03/20",
          "value": 694.1
        },
        {
          "timestamp": "03/21",
          "value": 645.6
        },
        {
          "timestamp": "03/22",
          "value": 588.7
        },
        {
          "timestamp": "03/23",
          "value": 609.6
        },
        {
          "timestamp": "03/24",
          "value": 567
        },
        {
          "timestamp": "03/25",
          "value": 620
        },
        {
          "timestamp": "03/26",
          "value": 638.9
        },
        {
          "timestamp": "03/27",
          "value": 651.8
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 67.5
        },
        {
          "timestamp": "03/15",
          "value": 62.7
        },
        {
          "timestamp": "03/16",
          "value": 61.7
        },
        {
          "timestamp": "03/17",
          "value": 72.3
        },
        {
          "timestamp": "03/18",
          "value": 72.6
        },
        {
          "timestamp": "03/19",
          "value": 67.3
        },
        {
          "timestamp": "03/20",
          "value": 62.3
        },
        {
          "timestamp": "03/21",
          "value": 59.7
        },
        {
          "timestamp": "03/22",
          "value": 55.7
        },
        {
          "timestamp": "03/23",
          "value": 54.4
        },
        {
          "timestamp": "03/24",
          "value": 60.1
        },
        {
          "timestamp": "03/25",
          "value": 54.8
        },
        {
          "timestamp": "03/26",
          "value": 57.8
        },
        {
          "timestamp": "03/27",
          "value": 62.9
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 58.7
        },
        {
          "timestamp": "03/15",
          "value": 67.3
        },
        {
          "timestamp": "03/16",
          "value": 62.6
        },
        {
          "timestamp": "03/17",
          "value": 64.7
        },
        {
          "timestamp": "03/18",
          "value": 65.5
        },
        {
          "timestamp": "03/19",
          "value": 66.4
        },
        {
          "timestamp": "03/20",
          "value": 65.5
        },
        {
          "timestamp": "03/21",
          "value": 62.4
        },
        {
          "timestamp": "03/22",
          "value": 57.8
        },
        {
          "timestamp": "03/23",
          "value": 51.1
        },
        {
          "timestamp": "03/24",
          "value": 51.2
        },
        {
          "timestamp": "03/25",
          "value": 58.1
        },
        {
          "timestamp": "03/26",
          "value": 61.7
        },
        {
          "timestamp": "03/27",
          "value": 58.1
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu031",
    "label": "GPU-031",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 55,
      "memUsage": 45,
      "temp": 58,
      "power": 574,
      "cpuUsage": 27,
      "cpuMemUsage": 37
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 54.2
        },
        {
          "timestamp": "03/15",
          "value": 58.7
        },
        {
          "timestamp": "03/16",
          "value": 57.7
        },
        {
          "timestamp": "03/17",
          "value": 62.7
        },
        {
          "timestamp": "03/18",
          "value": 64.3
        },
        {
          "timestamp": "03/19",
          "value": 62.8
        },
        {
          "timestamp": "03/20",
          "value": 56.3
        },
        {
          "timestamp": "03/21",
          "value": 54
        },
        {
          "timestamp": "03/22",
          "value": 54.2
        },
        {
          "timestamp": "03/23",
          "value": 47
        },
        {
          "timestamp": "03/24",
          "value": 53
        },
        {
          "timestamp": "03/25",
          "value": 52.7
        },
        {
          "timestamp": "03/26",
          "value": 56.5
        },
        {
          "timestamp": "03/27",
          "value": 51.3
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 45.8
        },
        {
          "timestamp": "03/15",
          "value": 49.4
        },
        {
          "timestamp": "03/16",
          "value": 47.6
        },
        {
          "timestamp": "03/17",
          "value": 49
        },
        {
          "timestamp": "03/18",
          "value": 46.5
        },
        {
          "timestamp": "03/19",
          "value": 48.3
        },
        {
          "timestamp": "03/20",
          "value": 48.8
        },
        {
          "timestamp": "03/21",
          "value": 43.2
        },
        {
          "timestamp": "03/22",
          "value": 43.9
        },
        {
          "timestamp": "03/23",
          "value": 40.8
        },
        {
          "timestamp": "03/24",
          "value": 39.4
        },
        {
          "timestamp": "03/25",
          "value": 39.7
        },
        {
          "timestamp": "03/26",
          "value": 46.7
        },
        {
          "timestamp": "03/27",
          "value": 46.7
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 59.3
        },
        {
          "timestamp": "03/15",
          "value": 61.4
        },
        {
          "timestamp": "03/16",
          "value": 61
        },
        {
          "timestamp": "03/17",
          "value": 64.2
        },
        {
          "timestamp": "03/18",
          "value": 63.9
        },
        {
          "timestamp": "03/19",
          "value": 60.7
        },
        {
          "timestamp": "03/20",
          "value": 58.4
        },
        {
          "timestamp": "03/21",
          "value": 58.2
        },
        {
          "timestamp": "03/22",
          "value": 55.6
        },
        {
          "timestamp": "03/23",
          "value": 53.1
        },
        {
          "timestamp": "03/24",
          "value": 53.6
        },
        {
          "timestamp": "03/25",
          "value": 54.1
        },
        {
          "timestamp": "03/26",
          "value": 56.7
        },
        {
          "timestamp": "03/27",
          "value": 59.8
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 572.5
        },
        {
          "timestamp": "03/15",
          "value": 611.7
        },
        {
          "timestamp": "03/16",
          "value": 623.3
        },
        {
          "timestamp": "03/17",
          "value": 598.7
        },
        {
          "timestamp": "03/18",
          "value": 628.9
        },
        {
          "timestamp": "03/19",
          "value": 624.8
        },
        {
          "timestamp": "03/20",
          "value": 568.9
        },
        {
          "timestamp": "03/21",
          "value": 549.3
        },
        {
          "timestamp": "03/22",
          "value": 528.4
        },
        {
          "timestamp": "03/23",
          "value": 544.4
        },
        {
          "timestamp": "03/24",
          "value": 528
        },
        {
          "timestamp": "03/25",
          "value": 501.3
        },
        {
          "timestamp": "03/26",
          "value": 581.1
        },
        {
          "timestamp": "03/27",
          "value": 568.2
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 24.8
        },
        {
          "timestamp": "03/15",
          "value": 25.7
        },
        {
          "timestamp": "03/16",
          "value": 31.6
        },
        {
          "timestamp": "03/17",
          "value": 29.7
        },
        {
          "timestamp": "03/18",
          "value": 27.1
        },
        {
          "timestamp": "03/19",
          "value": 30.4
        },
        {
          "timestamp": "03/20",
          "value": 26.6
        },
        {
          "timestamp": "03/21",
          "value": 26.8
        },
        {
          "timestamp": "03/22",
          "value": 25.9
        },
        {
          "timestamp": "03/23",
          "value": 23
        },
        {
          "timestamp": "03/24",
          "value": 23
        },
        {
          "timestamp": "03/25",
          "value": 26.5
        },
        {
          "timestamp": "03/26",
          "value": 28.2
        },
        {
          "timestamp": "03/27",
          "value": 28.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 35.8
        },
        {
          "timestamp": "03/15",
          "value": 36.3
        },
        {
          "timestamp": "03/16",
          "value": 40.8
        },
        {
          "timestamp": "03/17",
          "value": 39.5
        },
        {
          "timestamp": "03/18",
          "value": 39.7
        },
        {
          "timestamp": "03/19",
          "value": 38.1
        },
        {
          "timestamp": "03/20",
          "value": 37.5
        },
        {
          "timestamp": "03/21",
          "value": 35.9
        },
        {
          "timestamp": "03/22",
          "value": 32.7
        },
        {
          "timestamp": "03/23",
          "value": 31
        },
        {
          "timestamp": "03/24",
          "value": 32.9
        },
        {
          "timestamp": "03/25",
          "value": 33.6
        },
        {
          "timestamp": "03/26",
          "value": 38.5
        },
        {
          "timestamp": "03/27",
          "value": 39.4
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu032",
    "label": "GPU-032",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 32,
      "memUsage": 69,
      "temp": 55,
      "power": 644,
      "cpuUsage": 31,
      "cpuMemUsage": 43
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 30.4
        },
        {
          "timestamp": "03/15",
          "value": 32.4
        },
        {
          "timestamp": "03/16",
          "value": 33.5
        },
        {
          "timestamp": "03/17",
          "value": 37.9
        },
        {
          "timestamp": "03/18",
          "value": 35.7
        },
        {
          "timestamp": "03/19",
          "value": 35.1
        },
        {
          "timestamp": "03/20",
          "value": 30.4
        },
        {
          "timestamp": "03/21",
          "value": 31.8
        },
        {
          "timestamp": "03/22",
          "value": 31.2
        },
        {
          "timestamp": "03/23",
          "value": 27.3
        },
        {
          "timestamp": "03/24",
          "value": 28.9
        },
        {
          "timestamp": "03/25",
          "value": 30
        },
        {
          "timestamp": "03/26",
          "value": 32.8
        },
        {
          "timestamp": "03/27",
          "value": 31.6
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 74
        },
        {
          "timestamp": "03/15",
          "value": 72.8
        },
        {
          "timestamp": "03/16",
          "value": 72
        },
        {
          "timestamp": "03/17",
          "value": 78.2
        },
        {
          "timestamp": "03/18",
          "value": 80
        },
        {
          "timestamp": "03/19",
          "value": 75.7
        },
        {
          "timestamp": "03/20",
          "value": 74.3
        },
        {
          "timestamp": "03/21",
          "value": 66.9
        },
        {
          "timestamp": "03/22",
          "value": 62.4
        },
        {
          "timestamp": "03/23",
          "value": 58.5
        },
        {
          "timestamp": "03/24",
          "value": 66.4
        },
        {
          "timestamp": "03/25",
          "value": 60.7
        },
        {
          "timestamp": "03/26",
          "value": 62.5
        },
        {
          "timestamp": "03/27",
          "value": 71
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 53.3
        },
        {
          "timestamp": "03/15",
          "value": 57.7
        },
        {
          "timestamp": "03/16",
          "value": 59.1
        },
        {
          "timestamp": "03/17",
          "value": 62
        },
        {
          "timestamp": "03/18",
          "value": 59.4
        },
        {
          "timestamp": "03/19",
          "value": 56.3
        },
        {
          "timestamp": "03/20",
          "value": 53.7
        },
        {
          "timestamp": "03/21",
          "value": 51.6
        },
        {
          "timestamp": "03/22",
          "value": 50.2
        },
        {
          "timestamp": "03/23",
          "value": 50.6
        },
        {
          "timestamp": "03/24",
          "value": 51.8
        },
        {
          "timestamp": "03/25",
          "value": 52.7
        },
        {
          "timestamp": "03/26",
          "value": 55.1
        },
        {
          "timestamp": "03/27",
          "value": 56
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 674.1
        },
        {
          "timestamp": "03/15",
          "value": 686
        },
        {
          "timestamp": "03/16",
          "value": 702.2
        },
        {
          "timestamp": "03/17",
          "value": 723.6
        },
        {
          "timestamp": "03/18",
          "value": 733.8
        },
        {
          "timestamp": "03/19",
          "value": 698.6
        },
        {
          "timestamp": "03/20",
          "value": 616.2
        },
        {
          "timestamp": "03/21",
          "value": 633.9
        },
        {
          "timestamp": "03/22",
          "value": 608.7
        },
        {
          "timestamp": "03/23",
          "value": 618.8
        },
        {
          "timestamp": "03/24",
          "value": 592
        },
        {
          "timestamp": "03/25",
          "value": 592.1
        },
        {
          "timestamp": "03/26",
          "value": 591.9
        },
        {
          "timestamp": "03/27",
          "value": 663.9
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 32.9
        },
        {
          "timestamp": "03/15",
          "value": 30.1
        },
        {
          "timestamp": "03/16",
          "value": 36.6
        },
        {
          "timestamp": "03/17",
          "value": 33.3
        },
        {
          "timestamp": "03/18",
          "value": 32.3
        },
        {
          "timestamp": "03/19",
          "value": 35.1
        },
        {
          "timestamp": "03/20",
          "value": 28.7
        },
        {
          "timestamp": "03/21",
          "value": 28.6
        },
        {
          "timestamp": "03/22",
          "value": 30.9
        },
        {
          "timestamp": "03/23",
          "value": 30.8
        },
        {
          "timestamp": "03/24",
          "value": 30.4
        },
        {
          "timestamp": "03/25",
          "value": 29.8
        },
        {
          "timestamp": "03/26",
          "value": 33.2
        },
        {
          "timestamp": "03/27",
          "value": 31.7
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 41.1
        },
        {
          "timestamp": "03/15",
          "value": 48
        },
        {
          "timestamp": "03/16",
          "value": 46.7
        },
        {
          "timestamp": "03/17",
          "value": 46.3
        },
        {
          "timestamp": "03/18",
          "value": 45.6
        },
        {
          "timestamp": "03/19",
          "value": 47.6
        },
        {
          "timestamp": "03/20",
          "value": 45.2
        },
        {
          "timestamp": "03/21",
          "value": 42
        },
        {
          "timestamp": "03/22",
          "value": 40.5
        },
        {
          "timestamp": "03/23",
          "value": 36.7
        },
        {
          "timestamp": "03/24",
          "value": 41.7
        },
        {
          "timestamp": "03/25",
          "value": 41.3
        },
        {
          "timestamp": "03/26",
          "value": 39.9
        },
        {
          "timestamp": "03/27",
          "value": 46.7
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu033",
    "label": "GPU-033",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 65,
      "memUsage": 45,
      "temp": 77,
      "power": 460,
      "cpuUsage": 30,
      "cpuMemUsage": 33
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 65
        },
        {
          "timestamp": "03/15",
          "value": 69.6
        },
        {
          "timestamp": "03/16",
          "value": 70.7
        },
        {
          "timestamp": "03/17",
          "value": 68
        },
        {
          "timestamp": "03/18",
          "value": 68.2
        },
        {
          "timestamp": "03/19",
          "value": 66.4
        },
        {
          "timestamp": "03/20",
          "value": 71.5
        },
        {
          "timestamp": "03/21",
          "value": 63.6
        },
        {
          "timestamp": "03/22",
          "value": 57.5
        },
        {
          "timestamp": "03/23",
          "value": 55.6
        },
        {
          "timestamp": "03/24",
          "value": 61.5
        },
        {
          "timestamp": "03/25",
          "value": 60.7
        },
        {
          "timestamp": "03/26",
          "value": 62.5
        },
        {
          "timestamp": "03/27",
          "value": 68.5
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 45.1
        },
        {
          "timestamp": "03/15",
          "value": 44.9
        },
        {
          "timestamp": "03/16",
          "value": 46.3
        },
        {
          "timestamp": "03/17",
          "value": 48.8
        },
        {
          "timestamp": "03/18",
          "value": 51.4
        },
        {
          "timestamp": "03/19",
          "value": 44.4
        },
        {
          "timestamp": "03/20",
          "value": 47.4
        },
        {
          "timestamp": "03/21",
          "value": 43.1
        },
        {
          "timestamp": "03/22",
          "value": 42.8
        },
        {
          "timestamp": "03/23",
          "value": 37.9
        },
        {
          "timestamp": "03/24",
          "value": 41.3
        },
        {
          "timestamp": "03/25",
          "value": 41.3
        },
        {
          "timestamp": "03/26",
          "value": 45
        },
        {
          "timestamp": "03/27",
          "value": 44.9
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 77.6
        },
        {
          "timestamp": "03/15",
          "value": 79.5
        },
        {
          "timestamp": "03/16",
          "value": 81.9
        },
        {
          "timestamp": "03/17",
          "value": 84
        },
        {
          "timestamp": "03/18",
          "value": 84.6
        },
        {
          "timestamp": "03/19",
          "value": 80.6
        },
        {
          "timestamp": "03/20",
          "value": 80
        },
        {
          "timestamp": "03/21",
          "value": 73.6
        },
        {
          "timestamp": "03/22",
          "value": 72.8
        },
        {
          "timestamp": "03/23",
          "value": 72.2
        },
        {
          "timestamp": "03/24",
          "value": 71.9
        },
        {
          "timestamp": "03/25",
          "value": 73.2
        },
        {
          "timestamp": "03/26",
          "value": 71.8
        },
        {
          "timestamp": "03/27",
          "value": 80
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 463.3
        },
        {
          "timestamp": "03/15",
          "value": 473.7
        },
        {
          "timestamp": "03/16",
          "value": 500.7
        },
        {
          "timestamp": "03/17",
          "value": 515.6
        },
        {
          "timestamp": "03/18",
          "value": 486.9
        },
        {
          "timestamp": "03/19",
          "value": 480.7
        },
        {
          "timestamp": "03/20",
          "value": 463.1
        },
        {
          "timestamp": "03/21",
          "value": 434.8
        },
        {
          "timestamp": "03/22",
          "value": 452.5
        },
        {
          "timestamp": "03/23",
          "value": 403.9
        },
        {
          "timestamp": "03/24",
          "value": 403.4
        },
        {
          "timestamp": "03/25",
          "value": 417.2
        },
        {
          "timestamp": "03/26",
          "value": 450.9
        },
        {
          "timestamp": "03/27",
          "value": 478.2
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 31.6
        },
        {
          "timestamp": "03/15",
          "value": 32.6
        },
        {
          "timestamp": "03/16",
          "value": 30.3
        },
        {
          "timestamp": "03/17",
          "value": 35
        },
        {
          "timestamp": "03/18",
          "value": 31.9
        },
        {
          "timestamp": "03/19",
          "value": 33.6
        },
        {
          "timestamp": "03/20",
          "value": 29.4
        },
        {
          "timestamp": "03/21",
          "value": 27.6
        },
        {
          "timestamp": "03/22",
          "value": 28.1
        },
        {
          "timestamp": "03/23",
          "value": 29
        },
        {
          "timestamp": "03/24",
          "value": 29
        },
        {
          "timestamp": "03/25",
          "value": 28
        },
        {
          "timestamp": "03/26",
          "value": 29.4
        },
        {
          "timestamp": "03/27",
          "value": 29.3
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 35.1
        },
        {
          "timestamp": "03/15",
          "value": 33.3
        },
        {
          "timestamp": "03/16",
          "value": 36.3
        },
        {
          "timestamp": "03/17",
          "value": 38.1
        },
        {
          "timestamp": "03/18",
          "value": 37.3
        },
        {
          "timestamp": "03/19",
          "value": 36.8
        },
        {
          "timestamp": "03/20",
          "value": 32.7
        },
        {
          "timestamp": "03/21",
          "value": 33.9
        },
        {
          "timestamp": "03/22",
          "value": 31.2
        },
        {
          "timestamp": "03/23",
          "value": 29.6
        },
        {
          "timestamp": "03/24",
          "value": 31.8
        },
        {
          "timestamp": "03/25",
          "value": 30.9
        },
        {
          "timestamp": "03/26",
          "value": 32.7
        },
        {
          "timestamp": "03/27",
          "value": 32.1
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu034",
    "label": "GPU-034",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 32,
      "memUsage": 79,
      "temp": 63,
      "power": 647,
      "cpuUsage": 50,
      "cpuMemUsage": 50
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 29.2
        },
        {
          "timestamp": "03/15",
          "value": 36.1
        },
        {
          "timestamp": "03/16",
          "value": 33.4
        },
        {
          "timestamp": "03/17",
          "value": 33.1
        },
        {
          "timestamp": "03/18",
          "value": 37.2
        },
        {
          "timestamp": "03/19",
          "value": 33.4
        },
        {
          "timestamp": "03/20",
          "value": 32.9
        },
        {
          "timestamp": "03/21",
          "value": 33.2
        },
        {
          "timestamp": "03/22",
          "value": 31.9
        },
        {
          "timestamp": "03/23",
          "value": 28.1
        },
        {
          "timestamp": "03/24",
          "value": 31.2
        },
        {
          "timestamp": "03/25",
          "value": 30.8
        },
        {
          "timestamp": "03/26",
          "value": 33.2
        },
        {
          "timestamp": "03/27",
          "value": 30
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 80.3
        },
        {
          "timestamp": "03/15",
          "value": 87.1
        },
        {
          "timestamp": "03/16",
          "value": 85.6
        },
        {
          "timestamp": "03/17",
          "value": 89.7
        },
        {
          "timestamp": "03/18",
          "value": 81.1
        },
        {
          "timestamp": "03/19",
          "value": 85.9
        },
        {
          "timestamp": "03/20",
          "value": 78.8
        },
        {
          "timestamp": "03/21",
          "value": 70.4
        },
        {
          "timestamp": "03/22",
          "value": 70.2
        },
        {
          "timestamp": "03/23",
          "value": 68.2
        },
        {
          "timestamp": "03/24",
          "value": 75.6
        },
        {
          "timestamp": "03/25",
          "value": 69.1
        },
        {
          "timestamp": "03/26",
          "value": 80.8
        },
        {
          "timestamp": "03/27",
          "value": 83.2
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 64.5
        },
        {
          "timestamp": "03/15",
          "value": 65.2
        },
        {
          "timestamp": "03/16",
          "value": 68.4
        },
        {
          "timestamp": "03/17",
          "value": 70.8
        },
        {
          "timestamp": "03/18",
          "value": 67.7
        },
        {
          "timestamp": "03/19",
          "value": 66.5
        },
        {
          "timestamp": "03/20",
          "value": 61.8
        },
        {
          "timestamp": "03/21",
          "value": 60.9
        },
        {
          "timestamp": "03/22",
          "value": 56.2
        },
        {
          "timestamp": "03/23",
          "value": 55.6
        },
        {
          "timestamp": "03/24",
          "value": 59.1
        },
        {
          "timestamp": "03/25",
          "value": 60
        },
        {
          "timestamp": "03/26",
          "value": 60.6
        },
        {
          "timestamp": "03/27",
          "value": 61.9
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 619
        },
        {
          "timestamp": "03/15",
          "value": 678.5
        },
        {
          "timestamp": "03/16",
          "value": 702.4
        },
        {
          "timestamp": "03/17",
          "value": 682
        },
        {
          "timestamp": "03/18",
          "value": 691.3
        },
        {
          "timestamp": "03/19",
          "value": 658.5
        },
        {
          "timestamp": "03/20",
          "value": 657.6
        },
        {
          "timestamp": "03/21",
          "value": 619.2
        },
        {
          "timestamp": "03/22",
          "value": 573.6
        },
        {
          "timestamp": "03/23",
          "value": 573.7
        },
        {
          "timestamp": "03/24",
          "value": 594.7
        },
        {
          "timestamp": "03/25",
          "value": 581.3
        },
        {
          "timestamp": "03/26",
          "value": 622.9
        },
        {
          "timestamp": "03/27",
          "value": 657.2
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 47.6
        },
        {
          "timestamp": "03/15",
          "value": 47.6
        },
        {
          "timestamp": "03/16",
          "value": 55.7
        },
        {
          "timestamp": "03/17",
          "value": 58.1
        },
        {
          "timestamp": "03/18",
          "value": 54.5
        },
        {
          "timestamp": "03/19",
          "value": 50.4
        },
        {
          "timestamp": "03/20",
          "value": 46.1
        },
        {
          "timestamp": "03/21",
          "value": 51.4
        },
        {
          "timestamp": "03/22",
          "value": 44.3
        },
        {
          "timestamp": "03/23",
          "value": 45.1
        },
        {
          "timestamp": "03/24",
          "value": 46.8
        },
        {
          "timestamp": "03/25",
          "value": 43.4
        },
        {
          "timestamp": "03/26",
          "value": 53.3
        },
        {
          "timestamp": "03/27",
          "value": 53.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 52
        },
        {
          "timestamp": "03/15",
          "value": 52.4
        },
        {
          "timestamp": "03/16",
          "value": 55.5
        },
        {
          "timestamp": "03/17",
          "value": 54
        },
        {
          "timestamp": "03/18",
          "value": 52.3
        },
        {
          "timestamp": "03/19",
          "value": 54.3
        },
        {
          "timestamp": "03/20",
          "value": 53.7
        },
        {
          "timestamp": "03/21",
          "value": 47.8
        },
        {
          "timestamp": "03/22",
          "value": 43.3
        },
        {
          "timestamp": "03/23",
          "value": 47.7
        },
        {
          "timestamp": "03/24",
          "value": 44.8
        },
        {
          "timestamp": "03/25",
          "value": 45.8
        },
        {
          "timestamp": "03/26",
          "value": 45.5
        },
        {
          "timestamp": "03/27",
          "value": 52.1
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu035",
    "label": "GPU-035",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 69,
      "memUsage": 46,
      "temp": 77,
      "power": 817,
      "cpuUsage": 30,
      "cpuMemUsage": 42
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 66.4
        },
        {
          "timestamp": "03/15",
          "value": 72.7
        },
        {
          "timestamp": "03/16",
          "value": 73.2
        },
        {
          "timestamp": "03/17",
          "value": 70.6
        },
        {
          "timestamp": "03/18",
          "value": 74.1
        },
        {
          "timestamp": "03/19",
          "value": 75.9
        },
        {
          "timestamp": "03/20",
          "value": 65.8
        },
        {
          "timestamp": "03/21",
          "value": 66.6
        },
        {
          "timestamp": "03/22",
          "value": 60.7
        },
        {
          "timestamp": "03/23",
          "value": 65.3
        },
        {
          "timestamp": "03/24",
          "value": 66.3
        },
        {
          "timestamp": "03/25",
          "value": 70.1
        },
        {
          "timestamp": "03/26",
          "value": 64.8
        },
        {
          "timestamp": "03/27",
          "value": 70
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 44.5
        },
        {
          "timestamp": "03/15",
          "value": 44.8
        },
        {
          "timestamp": "03/16",
          "value": 48
        },
        {
          "timestamp": "03/17",
          "value": 52.9
        },
        {
          "timestamp": "03/18",
          "value": 48.8
        },
        {
          "timestamp": "03/19",
          "value": 47.1
        },
        {
          "timestamp": "03/20",
          "value": 44.8
        },
        {
          "timestamp": "03/21",
          "value": 46.9
        },
        {
          "timestamp": "03/22",
          "value": 39.3
        },
        {
          "timestamp": "03/23",
          "value": 39.7
        },
        {
          "timestamp": "03/24",
          "value": 43.8
        },
        {
          "timestamp": "03/25",
          "value": 41.1
        },
        {
          "timestamp": "03/26",
          "value": 44.5
        },
        {
          "timestamp": "03/27",
          "value": 46.2
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 76.6
        },
        {
          "timestamp": "03/15",
          "value": 82.5
        },
        {
          "timestamp": "03/16",
          "value": 86.1
        },
        {
          "timestamp": "03/17",
          "value": 85.1
        },
        {
          "timestamp": "03/18",
          "value": 83.8
        },
        {
          "timestamp": "03/19",
          "value": 84.6
        },
        {
          "timestamp": "03/20",
          "value": 76.3
        },
        {
          "timestamp": "03/21",
          "value": 72
        },
        {
          "timestamp": "03/22",
          "value": 72.7
        },
        {
          "timestamp": "03/23",
          "value": 70.4
        },
        {
          "timestamp": "03/24",
          "value": 71.5
        },
        {
          "timestamp": "03/25",
          "value": 69.7
        },
        {
          "timestamp": "03/26",
          "value": 77.6
        },
        {
          "timestamp": "03/27",
          "value": 78.3
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 854.6
        },
        {
          "timestamp": "03/15",
          "value": 870.6
        },
        {
          "timestamp": "03/16",
          "value": 900.2
        },
        {
          "timestamp": "03/17",
          "value": 918.6
        },
        {
          "timestamp": "03/18",
          "value": 920.3
        },
        {
          "timestamp": "03/19",
          "value": 877
        },
        {
          "timestamp": "03/20",
          "value": 844.1
        },
        {
          "timestamp": "03/21",
          "value": 742.9
        },
        {
          "timestamp": "03/22",
          "value": 778.4
        },
        {
          "timestamp": "03/23",
          "value": 781.5
        },
        {
          "timestamp": "03/24",
          "value": 742.2
        },
        {
          "timestamp": "03/25",
          "value": 746.8
        },
        {
          "timestamp": "03/26",
          "value": 814.5
        },
        {
          "timestamp": "03/27",
          "value": 789.3
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 28.2
        },
        {
          "timestamp": "03/15",
          "value": 33.8
        },
        {
          "timestamp": "03/16",
          "value": 31.1
        },
        {
          "timestamp": "03/17",
          "value": 32.4
        },
        {
          "timestamp": "03/18",
          "value": 30.3
        },
        {
          "timestamp": "03/19",
          "value": 34.7
        },
        {
          "timestamp": "03/20",
          "value": 33.4
        },
        {
          "timestamp": "03/21",
          "value": 26.3
        },
        {
          "timestamp": "03/22",
          "value": 30
        },
        {
          "timestamp": "03/23",
          "value": 25.9
        },
        {
          "timestamp": "03/24",
          "value": 28
        },
        {
          "timestamp": "03/25",
          "value": 30.3
        },
        {
          "timestamp": "03/26",
          "value": 31.2
        },
        {
          "timestamp": "03/27",
          "value": 30.8
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 42.9
        },
        {
          "timestamp": "03/15",
          "value": 45.5
        },
        {
          "timestamp": "03/16",
          "value": 42.8
        },
        {
          "timestamp": "03/17",
          "value": 44.6
        },
        {
          "timestamp": "03/18",
          "value": 47.1
        },
        {
          "timestamp": "03/19",
          "value": 41.6
        },
        {
          "timestamp": "03/20",
          "value": 41.2
        },
        {
          "timestamp": "03/21",
          "value": 39
        },
        {
          "timestamp": "03/22",
          "value": 38.3
        },
        {
          "timestamp": "03/23",
          "value": 38.2
        },
        {
          "timestamp": "03/24",
          "value": 36.4
        },
        {
          "timestamp": "03/25",
          "value": 39.9
        },
        {
          "timestamp": "03/26",
          "value": 42.7
        },
        {
          "timestamp": "03/27",
          "value": 44.5
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu036",
    "label": "GPU-036",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 63,
      "memUsage": 75,
      "temp": 68,
      "power": 793,
      "cpuUsage": 69,
      "cpuMemUsage": 69
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 66.4
        },
        {
          "timestamp": "03/15",
          "value": 60.6
        },
        {
          "timestamp": "03/16",
          "value": 66.2
        },
        {
          "timestamp": "03/17",
          "value": 63.9
        },
        {
          "timestamp": "03/18",
          "value": 63.9
        },
        {
          "timestamp": "03/19",
          "value": 65.3
        },
        {
          "timestamp": "03/20",
          "value": 66.7
        },
        {
          "timestamp": "03/21",
          "value": 63.3
        },
        {
          "timestamp": "03/22",
          "value": 59.7
        },
        {
          "timestamp": "03/23",
          "value": 52.9
        },
        {
          "timestamp": "03/24",
          "value": 61
        },
        {
          "timestamp": "03/25",
          "value": 60.6
        },
        {
          "timestamp": "03/26",
          "value": 63.6
        },
        {
          "timestamp": "03/27",
          "value": 67.8
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 71
        },
        {
          "timestamp": "03/15",
          "value": 76
        },
        {
          "timestamp": "03/16",
          "value": 78.7
        },
        {
          "timestamp": "03/17",
          "value": 81.7
        },
        {
          "timestamp": "03/18",
          "value": 78.5
        },
        {
          "timestamp": "03/19",
          "value": 76.7
        },
        {
          "timestamp": "03/20",
          "value": 81.3
        },
        {
          "timestamp": "03/21",
          "value": 73.6
        },
        {
          "timestamp": "03/22",
          "value": 71.5
        },
        {
          "timestamp": "03/23",
          "value": 65.5
        },
        {
          "timestamp": "03/24",
          "value": 65.6
        },
        {
          "timestamp": "03/25",
          "value": 67.3
        },
        {
          "timestamp": "03/26",
          "value": 71
        },
        {
          "timestamp": "03/27",
          "value": 82.2
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 66.8
        },
        {
          "timestamp": "03/15",
          "value": 73.3
        },
        {
          "timestamp": "03/16",
          "value": 73.2
        },
        {
          "timestamp": "03/17",
          "value": 73.8
        },
        {
          "timestamp": "03/18",
          "value": 74.6
        },
        {
          "timestamp": "03/19",
          "value": 69.9
        },
        {
          "timestamp": "03/20",
          "value": 68.4
        },
        {
          "timestamp": "03/21",
          "value": 63.4
        },
        {
          "timestamp": "03/22",
          "value": 64.9
        },
        {
          "timestamp": "03/23",
          "value": 63.7
        },
        {
          "timestamp": "03/24",
          "value": 62.6
        },
        {
          "timestamp": "03/25",
          "value": 62.2
        },
        {
          "timestamp": "03/26",
          "value": 66.7
        },
        {
          "timestamp": "03/27",
          "value": 70.3
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 808.4
        },
        {
          "timestamp": "03/15",
          "value": 854.4
        },
        {
          "timestamp": "03/16",
          "value": 827.7
        },
        {
          "timestamp": "03/17",
          "value": 879.4
        },
        {
          "timestamp": "03/18",
          "value": 827.5
        },
        {
          "timestamp": "03/19",
          "value": 822.5
        },
        {
          "timestamp": "03/20",
          "value": 759.6
        },
        {
          "timestamp": "03/21",
          "value": 726.6
        },
        {
          "timestamp": "03/22",
          "value": 771.2
        },
        {
          "timestamp": "03/23",
          "value": 761.2
        },
        {
          "timestamp": "03/24",
          "value": 714.8
        },
        {
          "timestamp": "03/25",
          "value": 715
        },
        {
          "timestamp": "03/26",
          "value": 740.9
        },
        {
          "timestamp": "03/27",
          "value": 827.9
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 63.3
        },
        {
          "timestamp": "03/15",
          "value": 79
        },
        {
          "timestamp": "03/16",
          "value": 81.2
        },
        {
          "timestamp": "03/17",
          "value": 79.2
        },
        {
          "timestamp": "03/18",
          "value": 77.4
        },
        {
          "timestamp": "03/19",
          "value": 73.8
        },
        {
          "timestamp": "03/20",
          "value": 64
        },
        {
          "timestamp": "03/21",
          "value": 64.8
        },
        {
          "timestamp": "03/22",
          "value": 61
        },
        {
          "timestamp": "03/23",
          "value": 60.8
        },
        {
          "timestamp": "03/24",
          "value": 68.6
        },
        {
          "timestamp": "03/25",
          "value": 69.2
        },
        {
          "timestamp": "03/26",
          "value": 65
        },
        {
          "timestamp": "03/27",
          "value": 75.8
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 72.9
        },
        {
          "timestamp": "03/15",
          "value": 69.3
        },
        {
          "timestamp": "03/16",
          "value": 77.5
        },
        {
          "timestamp": "03/17",
          "value": 76.7
        },
        {
          "timestamp": "03/18",
          "value": 74
        },
        {
          "timestamp": "03/19",
          "value": 77.4
        },
        {
          "timestamp": "03/20",
          "value": 66.6
        },
        {
          "timestamp": "03/21",
          "value": 62.6
        },
        {
          "timestamp": "03/22",
          "value": 63.1
        },
        {
          "timestamp": "03/23",
          "value": 58.1
        },
        {
          "timestamp": "03/24",
          "value": 65.2
        },
        {
          "timestamp": "03/25",
          "value": 67.6
        },
        {
          "timestamp": "03/26",
          "value": 63.3
        },
        {
          "timestamp": "03/27",
          "value": 69.2
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu037",
    "label": "GPU-037",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 49,
      "memUsage": 76,
      "temp": 67,
      "power": 726,
      "cpuUsage": 35,
      "cpuMemUsage": 38
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 46.2
        },
        {
          "timestamp": "03/15",
          "value": 53.6
        },
        {
          "timestamp": "03/16",
          "value": 54
        },
        {
          "timestamp": "03/17",
          "value": 53.7
        },
        {
          "timestamp": "03/18",
          "value": 55.6
        },
        {
          "timestamp": "03/19",
          "value": 48.6
        },
        {
          "timestamp": "03/20",
          "value": 46.4
        },
        {
          "timestamp": "03/21",
          "value": 45.6
        },
        {
          "timestamp": "03/22",
          "value": 43.1
        },
        {
          "timestamp": "03/23",
          "value": 48.2
        },
        {
          "timestamp": "03/24",
          "value": 44.3
        },
        {
          "timestamp": "03/25",
          "value": 48.4
        },
        {
          "timestamp": "03/26",
          "value": 48.1
        },
        {
          "timestamp": "03/27",
          "value": 51.1
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 77.4
        },
        {
          "timestamp": "03/15",
          "value": 76.4
        },
        {
          "timestamp": "03/16",
          "value": 86.6
        },
        {
          "timestamp": "03/17",
          "value": 78.1
        },
        {
          "timestamp": "03/18",
          "value": 79.7
        },
        {
          "timestamp": "03/19",
          "value": 74.9
        },
        {
          "timestamp": "03/20",
          "value": 74
        },
        {
          "timestamp": "03/21",
          "value": 69.6
        },
        {
          "timestamp": "03/22",
          "value": 74.2
        },
        {
          "timestamp": "03/23",
          "value": 72.9
        },
        {
          "timestamp": "03/24",
          "value": 69.2
        },
        {
          "timestamp": "03/25",
          "value": 66.6
        },
        {
          "timestamp": "03/26",
          "value": 69.6
        },
        {
          "timestamp": "03/27",
          "value": 74.2
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 68.7
        },
        {
          "timestamp": "03/15",
          "value": 70.8
        },
        {
          "timestamp": "03/16",
          "value": 75
        },
        {
          "timestamp": "03/17",
          "value": 71.7
        },
        {
          "timestamp": "03/18",
          "value": 74.8
        },
        {
          "timestamp": "03/19",
          "value": 73.1
        },
        {
          "timestamp": "03/20",
          "value": 68.7
        },
        {
          "timestamp": "03/21",
          "value": 65.5
        },
        {
          "timestamp": "03/22",
          "value": 62.6
        },
        {
          "timestamp": "03/23",
          "value": 61.2
        },
        {
          "timestamp": "03/24",
          "value": 62.8
        },
        {
          "timestamp": "03/25",
          "value": 61.2
        },
        {
          "timestamp": "03/26",
          "value": 64
        },
        {
          "timestamp": "03/27",
          "value": 66.8
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 704.2
        },
        {
          "timestamp": "03/15",
          "value": 789.6
        },
        {
          "timestamp": "03/16",
          "value": 750.6
        },
        {
          "timestamp": "03/17",
          "value": 755.9
        },
        {
          "timestamp": "03/18",
          "value": 789.5
        },
        {
          "timestamp": "03/19",
          "value": 734.3
        },
        {
          "timestamp": "03/20",
          "value": 740.6
        },
        {
          "timestamp": "03/21",
          "value": 723
        },
        {
          "timestamp": "03/22",
          "value": 662.6
        },
        {
          "timestamp": "03/23",
          "value": 695.9
        },
        {
          "timestamp": "03/24",
          "value": 623.7
        },
        {
          "timestamp": "03/25",
          "value": 692
        },
        {
          "timestamp": "03/26",
          "value": 720
        },
        {
          "timestamp": "03/27",
          "value": 776.4
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 32.7
        },
        {
          "timestamp": "03/15",
          "value": 38.8
        },
        {
          "timestamp": "03/16",
          "value": 34.8
        },
        {
          "timestamp": "03/17",
          "value": 37.5
        },
        {
          "timestamp": "03/18",
          "value": 41.4
        },
        {
          "timestamp": "03/19",
          "value": 39.8
        },
        {
          "timestamp": "03/20",
          "value": 37.7
        },
        {
          "timestamp": "03/21",
          "value": 33.8
        },
        {
          "timestamp": "03/22",
          "value": 28.9
        },
        {
          "timestamp": "03/23",
          "value": 28.4
        },
        {
          "timestamp": "03/24",
          "value": 32.8
        },
        {
          "timestamp": "03/25",
          "value": 30
        },
        {
          "timestamp": "03/26",
          "value": 36
        },
        {
          "timestamp": "03/27",
          "value": 35.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 36.2
        },
        {
          "timestamp": "03/15",
          "value": 37.7
        },
        {
          "timestamp": "03/16",
          "value": 42.6
        },
        {
          "timestamp": "03/17",
          "value": 44.4
        },
        {
          "timestamp": "03/18",
          "value": 39.7
        },
        {
          "timestamp": "03/19",
          "value": 42.2
        },
        {
          "timestamp": "03/20",
          "value": 39.1
        },
        {
          "timestamp": "03/21",
          "value": 35.3
        },
        {
          "timestamp": "03/22",
          "value": 33.3
        },
        {
          "timestamp": "03/23",
          "value": 35.6
        },
        {
          "timestamp": "03/24",
          "value": 34.2
        },
        {
          "timestamp": "03/25",
          "value": 33.8
        },
        {
          "timestamp": "03/26",
          "value": 36.7
        },
        {
          "timestamp": "03/27",
          "value": 39.5
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu038",
    "label": "GPU-038",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "err",
    "current": {
      "gpuUsage": 0,
      "memUsage": 0,
      "temp": 0,
      "power": 0,
      "cpuUsage": 0,
      "cpuMemUsage": 0
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu039",
    "label": "GPU-039",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "err",
    "current": {
      "gpuUsage": 0,
      "memUsage": 0,
      "temp": 0,
      "power": 0,
      "cpuUsage": 0,
      "cpuMemUsage": 0
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu040",
    "label": "GPU-040",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 35,
      "memUsage": 80,
      "temp": 65,
      "power": 484,
      "cpuUsage": 36,
      "cpuMemUsage": 42
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 33.4
        },
        {
          "timestamp": "03/15",
          "value": 37.1
        },
        {
          "timestamp": "03/16",
          "value": 37.2
        },
        {
          "timestamp": "03/17",
          "value": 39
        },
        {
          "timestamp": "03/18",
          "value": 40.2
        },
        {
          "timestamp": "03/19",
          "value": 38.4
        },
        {
          "timestamp": "03/20",
          "value": 37.7
        },
        {
          "timestamp": "03/21",
          "value": 35.6
        },
        {
          "timestamp": "03/22",
          "value": 34
        },
        {
          "timestamp": "03/23",
          "value": 28.6
        },
        {
          "timestamp": "03/24",
          "value": 33.2
        },
        {
          "timestamp": "03/25",
          "value": 33.5
        },
        {
          "timestamp": "03/26",
          "value": 37
        },
        {
          "timestamp": "03/27",
          "value": 35.4
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 82.6
        },
        {
          "timestamp": "03/15",
          "value": 79.3
        },
        {
          "timestamp": "03/16",
          "value": 82.1
        },
        {
          "timestamp": "03/17",
          "value": 93.9
        },
        {
          "timestamp": "03/18",
          "value": 88.1
        },
        {
          "timestamp": "03/19",
          "value": 84.4
        },
        {
          "timestamp": "03/20",
          "value": 87
        },
        {
          "timestamp": "03/21",
          "value": 71.9
        },
        {
          "timestamp": "03/22",
          "value": 76.7
        },
        {
          "timestamp": "03/23",
          "value": 68.5
        },
        {
          "timestamp": "03/24",
          "value": 67.1
        },
        {
          "timestamp": "03/25",
          "value": 78.7
        },
        {
          "timestamp": "03/26",
          "value": 72.7
        },
        {
          "timestamp": "03/27",
          "value": 85
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 67.2
        },
        {
          "timestamp": "03/15",
          "value": 69.1
        },
        {
          "timestamp": "03/16",
          "value": 70.7
        },
        {
          "timestamp": "03/17",
          "value": 70
        },
        {
          "timestamp": "03/18",
          "value": 68.7
        },
        {
          "timestamp": "03/19",
          "value": 68.5
        },
        {
          "timestamp": "03/20",
          "value": 67.6
        },
        {
          "timestamp": "03/21",
          "value": 63.3
        },
        {
          "timestamp": "03/22",
          "value": 57.8
        },
        {
          "timestamp": "03/23",
          "value": 59.4
        },
        {
          "timestamp": "03/24",
          "value": 58
        },
        {
          "timestamp": "03/25",
          "value": 58.8
        },
        {
          "timestamp": "03/26",
          "value": 64.2
        },
        {
          "timestamp": "03/27",
          "value": 66.4
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 504.7
        },
        {
          "timestamp": "03/15",
          "value": 492.7
        },
        {
          "timestamp": "03/16",
          "value": 511.9
        },
        {
          "timestamp": "03/17",
          "value": 546.2
        },
        {
          "timestamp": "03/18",
          "value": 534
        },
        {
          "timestamp": "03/19",
          "value": 505.9
        },
        {
          "timestamp": "03/20",
          "value": 518
        },
        {
          "timestamp": "03/21",
          "value": 463.7
        },
        {
          "timestamp": "03/22",
          "value": 473.6
        },
        {
          "timestamp": "03/23",
          "value": 423.8
        },
        {
          "timestamp": "03/24",
          "value": 417.8
        },
        {
          "timestamp": "03/25",
          "value": 422
        },
        {
          "timestamp": "03/26",
          "value": 483.9
        },
        {
          "timestamp": "03/27",
          "value": 488.7
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 36.5
        },
        {
          "timestamp": "03/15",
          "value": 35.1
        },
        {
          "timestamp": "03/16",
          "value": 42.5
        },
        {
          "timestamp": "03/17",
          "value": 37
        },
        {
          "timestamp": "03/18",
          "value": 40.3
        },
        {
          "timestamp": "03/19",
          "value": 38.9
        },
        {
          "timestamp": "03/20",
          "value": 38.4
        },
        {
          "timestamp": "03/21",
          "value": 36.5
        },
        {
          "timestamp": "03/22",
          "value": 33.8
        },
        {
          "timestamp": "03/23",
          "value": 32.9
        },
        {
          "timestamp": "03/24",
          "value": 35.8
        },
        {
          "timestamp": "03/25",
          "value": 30
        },
        {
          "timestamp": "03/26",
          "value": 36.8
        },
        {
          "timestamp": "03/27",
          "value": 36.7
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 41.2
        },
        {
          "timestamp": "03/15",
          "value": 42.6
        },
        {
          "timestamp": "03/16",
          "value": 46.6
        },
        {
          "timestamp": "03/17",
          "value": 44.2
        },
        {
          "timestamp": "03/18",
          "value": 48.6
        },
        {
          "timestamp": "03/19",
          "value": 42.2
        },
        {
          "timestamp": "03/20",
          "value": 41.9
        },
        {
          "timestamp": "03/21",
          "value": 42.8
        },
        {
          "timestamp": "03/22",
          "value": 36.8
        },
        {
          "timestamp": "03/23",
          "value": 38.9
        },
        {
          "timestamp": "03/24",
          "value": 36.4
        },
        {
          "timestamp": "03/25",
          "value": 37
        },
        {
          "timestamp": "03/26",
          "value": 40
        },
        {
          "timestamp": "03/27",
          "value": 41
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu041",
    "label": "GPU-041",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 69,
      "memUsage": 55,
      "temp": 56,
      "power": 793,
      "cpuUsage": 66,
      "cpuMemUsage": 72
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 69.1
        },
        {
          "timestamp": "03/15",
          "value": 77.8
        },
        {
          "timestamp": "03/16",
          "value": 72.8
        },
        {
          "timestamp": "03/17",
          "value": 70.4
        },
        {
          "timestamp": "03/18",
          "value": 69.6
        },
        {
          "timestamp": "03/19",
          "value": 68.1
        },
        {
          "timestamp": "03/20",
          "value": 69.9
        },
        {
          "timestamp": "03/21",
          "value": 69.5
        },
        {
          "timestamp": "03/22",
          "value": 59.9
        },
        {
          "timestamp": "03/23",
          "value": 62
        },
        {
          "timestamp": "03/24",
          "value": 59.8
        },
        {
          "timestamp": "03/25",
          "value": 59
        },
        {
          "timestamp": "03/26",
          "value": 69.9
        },
        {
          "timestamp": "03/27",
          "value": 65
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 54.1
        },
        {
          "timestamp": "03/15",
          "value": 54.2
        },
        {
          "timestamp": "03/16",
          "value": 60.9
        },
        {
          "timestamp": "03/17",
          "value": 58.6
        },
        {
          "timestamp": "03/18",
          "value": 57.2
        },
        {
          "timestamp": "03/19",
          "value": 61.1
        },
        {
          "timestamp": "03/20",
          "value": 54.1
        },
        {
          "timestamp": "03/21",
          "value": 55.5
        },
        {
          "timestamp": "03/22",
          "value": 53.5
        },
        {
          "timestamp": "03/23",
          "value": 51.8
        },
        {
          "timestamp": "03/24",
          "value": 46.2
        },
        {
          "timestamp": "03/25",
          "value": 55.1
        },
        {
          "timestamp": "03/26",
          "value": 51.7
        },
        {
          "timestamp": "03/27",
          "value": 58.6
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 56.3
        },
        {
          "timestamp": "03/15",
          "value": 59.6
        },
        {
          "timestamp": "03/16",
          "value": 62.6
        },
        {
          "timestamp": "03/17",
          "value": 60.4
        },
        {
          "timestamp": "03/18",
          "value": 60.8
        },
        {
          "timestamp": "03/19",
          "value": 61
        },
        {
          "timestamp": "03/20",
          "value": 57.9
        },
        {
          "timestamp": "03/21",
          "value": 55.4
        },
        {
          "timestamp": "03/22",
          "value": 50.7
        },
        {
          "timestamp": "03/23",
          "value": 51.4
        },
        {
          "timestamp": "03/24",
          "value": 50.4
        },
        {
          "timestamp": "03/25",
          "value": 53.6
        },
        {
          "timestamp": "03/26",
          "value": 56.1
        },
        {
          "timestamp": "03/27",
          "value": 58.6
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 778.3
        },
        {
          "timestamp": "03/15",
          "value": 847.1
        },
        {
          "timestamp": "03/16",
          "value": 815.6
        },
        {
          "timestamp": "03/17",
          "value": 853.8
        },
        {
          "timestamp": "03/18",
          "value": 831.1
        },
        {
          "timestamp": "03/19",
          "value": 845
        },
        {
          "timestamp": "03/20",
          "value": 791.6
        },
        {
          "timestamp": "03/21",
          "value": 771.8
        },
        {
          "timestamp": "03/22",
          "value": 740.4
        },
        {
          "timestamp": "03/23",
          "value": 676.3
        },
        {
          "timestamp": "03/24",
          "value": 681
        },
        {
          "timestamp": "03/25",
          "value": 757.7
        },
        {
          "timestamp": "03/26",
          "value": 810.4
        },
        {
          "timestamp": "03/27",
          "value": 771.7
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 62.7
        },
        {
          "timestamp": "03/15",
          "value": 75.3
        },
        {
          "timestamp": "03/16",
          "value": 76.2
        },
        {
          "timestamp": "03/17",
          "value": 72.3
        },
        {
          "timestamp": "03/18",
          "value": 70.2
        },
        {
          "timestamp": "03/19",
          "value": 73.1
        },
        {
          "timestamp": "03/20",
          "value": 72.8
        },
        {
          "timestamp": "03/21",
          "value": 68.9
        },
        {
          "timestamp": "03/22",
          "value": 57.9
        },
        {
          "timestamp": "03/23",
          "value": 56
        },
        {
          "timestamp": "03/24",
          "value": 66
        },
        {
          "timestamp": "03/25",
          "value": 59.7
        },
        {
          "timestamp": "03/26",
          "value": 65.8
        },
        {
          "timestamp": "03/27",
          "value": 65.6
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 75.4
        },
        {
          "timestamp": "03/15",
          "value": 71.9
        },
        {
          "timestamp": "03/16",
          "value": 79.6
        },
        {
          "timestamp": "03/17",
          "value": 77.2
        },
        {
          "timestamp": "03/18",
          "value": 82.4
        },
        {
          "timestamp": "03/19",
          "value": 77.6
        },
        {
          "timestamp": "03/20",
          "value": 69.2
        },
        {
          "timestamp": "03/21",
          "value": 67
        },
        {
          "timestamp": "03/22",
          "value": 68.6
        },
        {
          "timestamp": "03/23",
          "value": 68.5
        },
        {
          "timestamp": "03/24",
          "value": 65.5
        },
        {
          "timestamp": "03/25",
          "value": 64.8
        },
        {
          "timestamp": "03/26",
          "value": 66.9
        },
        {
          "timestamp": "03/27",
          "value": 69.5
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu042",
    "label": "GPU-042",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 33,
      "memUsage": 54,
      "temp": 67,
      "power": 383,
      "cpuUsage": 26,
      "cpuMemUsage": 47
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 32.3
        },
        {
          "timestamp": "03/15",
          "value": 36.8
        },
        {
          "timestamp": "03/16",
          "value": 38.4
        },
        {
          "timestamp": "03/17",
          "value": 34.9
        },
        {
          "timestamp": "03/18",
          "value": 38.3
        },
        {
          "timestamp": "03/19",
          "value": 34.1
        },
        {
          "timestamp": "03/20",
          "value": 32
        },
        {
          "timestamp": "03/21",
          "value": 33.9
        },
        {
          "timestamp": "03/22",
          "value": 31.3
        },
        {
          "timestamp": "03/23",
          "value": 32.3
        },
        {
          "timestamp": "03/24",
          "value": 29.8
        },
        {
          "timestamp": "03/25",
          "value": 33
        },
        {
          "timestamp": "03/26",
          "value": 29.6
        },
        {
          "timestamp": "03/27",
          "value": 35.2
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 55.1
        },
        {
          "timestamp": "03/15",
          "value": 59.1
        },
        {
          "timestamp": "03/16",
          "value": 55.1
        },
        {
          "timestamp": "03/17",
          "value": 59.5
        },
        {
          "timestamp": "03/18",
          "value": 55.3
        },
        {
          "timestamp": "03/19",
          "value": 55.6
        },
        {
          "timestamp": "03/20",
          "value": 55.8
        },
        {
          "timestamp": "03/21",
          "value": 50.7
        },
        {
          "timestamp": "03/22",
          "value": 52.1
        },
        {
          "timestamp": "03/23",
          "value": 50.7
        },
        {
          "timestamp": "03/24",
          "value": 48.6
        },
        {
          "timestamp": "03/25",
          "value": 51
        },
        {
          "timestamp": "03/26",
          "value": 53
        },
        {
          "timestamp": "03/27",
          "value": 53.7
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 65.6
        },
        {
          "timestamp": "03/15",
          "value": 69.6
        },
        {
          "timestamp": "03/16",
          "value": 73.4
        },
        {
          "timestamp": "03/17",
          "value": 72.8
        },
        {
          "timestamp": "03/18",
          "value": 73.8
        },
        {
          "timestamp": "03/19",
          "value": 73.1
        },
        {
          "timestamp": "03/20",
          "value": 65.8
        },
        {
          "timestamp": "03/21",
          "value": 62.7
        },
        {
          "timestamp": "03/22",
          "value": 61.5
        },
        {
          "timestamp": "03/23",
          "value": 61.8
        },
        {
          "timestamp": "03/24",
          "value": 59.7
        },
        {
          "timestamp": "03/25",
          "value": 63.3
        },
        {
          "timestamp": "03/26",
          "value": 62.6
        },
        {
          "timestamp": "03/27",
          "value": 66.8
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 364.5
        },
        {
          "timestamp": "03/15",
          "value": 379.4
        },
        {
          "timestamp": "03/16",
          "value": 426.4
        },
        {
          "timestamp": "03/17",
          "value": 428.5
        },
        {
          "timestamp": "03/18",
          "value": 412.1
        },
        {
          "timestamp": "03/19",
          "value": 402.5
        },
        {
          "timestamp": "03/20",
          "value": 386.1
        },
        {
          "timestamp": "03/21",
          "value": 375.6
        },
        {
          "timestamp": "03/22",
          "value": 345.9
        },
        {
          "timestamp": "03/23",
          "value": 360.9
        },
        {
          "timestamp": "03/24",
          "value": 350.2
        },
        {
          "timestamp": "03/25",
          "value": 333.5
        },
        {
          "timestamp": "03/26",
          "value": 376.2
        },
        {
          "timestamp": "03/27",
          "value": 414
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 23.9
        },
        {
          "timestamp": "03/15",
          "value": 27.6
        },
        {
          "timestamp": "03/16",
          "value": 25.8
        },
        {
          "timestamp": "03/17",
          "value": 26.3
        },
        {
          "timestamp": "03/18",
          "value": 27.6
        },
        {
          "timestamp": "03/19",
          "value": 25
        },
        {
          "timestamp": "03/20",
          "value": 27.3
        },
        {
          "timestamp": "03/21",
          "value": 25.9
        },
        {
          "timestamp": "03/22",
          "value": 23.1
        },
        {
          "timestamp": "03/23",
          "value": 25.3
        },
        {
          "timestamp": "03/24",
          "value": 22.7
        },
        {
          "timestamp": "03/25",
          "value": 22.6
        },
        {
          "timestamp": "03/26",
          "value": 27.5
        },
        {
          "timestamp": "03/27",
          "value": 27.9
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 47.1
        },
        {
          "timestamp": "03/15",
          "value": 49.1
        },
        {
          "timestamp": "03/16",
          "value": 54.2
        },
        {
          "timestamp": "03/17",
          "value": 50
        },
        {
          "timestamp": "03/18",
          "value": 51.2
        },
        {
          "timestamp": "03/19",
          "value": 52.4
        },
        {
          "timestamp": "03/20",
          "value": 46.4
        },
        {
          "timestamp": "03/21",
          "value": 46.3
        },
        {
          "timestamp": "03/22",
          "value": 42
        },
        {
          "timestamp": "03/23",
          "value": 43.6
        },
        {
          "timestamp": "03/24",
          "value": 40.1
        },
        {
          "timestamp": "03/25",
          "value": 42.8
        },
        {
          "timestamp": "03/26",
          "value": 44
        },
        {
          "timestamp": "03/27",
          "value": 48.6
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu043",
    "label": "GPU-043",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 51,
      "memUsage": 69,
      "temp": 56,
      "power": 590,
      "cpuUsage": 24,
      "cpuMemUsage": 38
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 54.9
        },
        {
          "timestamp": "03/15",
          "value": 54.2
        },
        {
          "timestamp": "03/16",
          "value": 57.7
        },
        {
          "timestamp": "03/17",
          "value": 58.3
        },
        {
          "timestamp": "03/18",
          "value": 57.7
        },
        {
          "timestamp": "03/19",
          "value": 57.8
        },
        {
          "timestamp": "03/20",
          "value": 48.9
        },
        {
          "timestamp": "03/21",
          "value": 47.9
        },
        {
          "timestamp": "03/22",
          "value": 49.2
        },
        {
          "timestamp": "03/23",
          "value": 47.8
        },
        {
          "timestamp": "03/24",
          "value": 46.3
        },
        {
          "timestamp": "03/25",
          "value": 49
        },
        {
          "timestamp": "03/26",
          "value": 49.2
        },
        {
          "timestamp": "03/27",
          "value": 49
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 67.4
        },
        {
          "timestamp": "03/15",
          "value": 69.4
        },
        {
          "timestamp": "03/16",
          "value": 74.4
        },
        {
          "timestamp": "03/17",
          "value": 79.9
        },
        {
          "timestamp": "03/18",
          "value": 72.9
        },
        {
          "timestamp": "03/19",
          "value": 77.9
        },
        {
          "timestamp": "03/20",
          "value": 73
        },
        {
          "timestamp": "03/21",
          "value": 67.3
        },
        {
          "timestamp": "03/22",
          "value": 60.9
        },
        {
          "timestamp": "03/23",
          "value": 62.8
        },
        {
          "timestamp": "03/24",
          "value": 63.6
        },
        {
          "timestamp": "03/25",
          "value": 65
        },
        {
          "timestamp": "03/26",
          "value": 63.9
        },
        {
          "timestamp": "03/27",
          "value": 75.6
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 55.8
        },
        {
          "timestamp": "03/15",
          "value": 60.9
        },
        {
          "timestamp": "03/16",
          "value": 58.5
        },
        {
          "timestamp": "03/17",
          "value": 61.7
        },
        {
          "timestamp": "03/18",
          "value": 59.8
        },
        {
          "timestamp": "03/19",
          "value": 59.5
        },
        {
          "timestamp": "03/20",
          "value": 58
        },
        {
          "timestamp": "03/21",
          "value": 56.2
        },
        {
          "timestamp": "03/22",
          "value": 51.6
        },
        {
          "timestamp": "03/23",
          "value": 52.1
        },
        {
          "timestamp": "03/24",
          "value": 49.9
        },
        {
          "timestamp": "03/25",
          "value": 50.2
        },
        {
          "timestamp": "03/26",
          "value": 54.9
        },
        {
          "timestamp": "03/27",
          "value": 56.6
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 592.2
        },
        {
          "timestamp": "03/15",
          "value": 586.8
        },
        {
          "timestamp": "03/16",
          "value": 639
        },
        {
          "timestamp": "03/17",
          "value": 674.2
        },
        {
          "timestamp": "03/18",
          "value": 634.6
        },
        {
          "timestamp": "03/19",
          "value": 591.3
        },
        {
          "timestamp": "03/20",
          "value": 605.5
        },
        {
          "timestamp": "03/21",
          "value": 562.5
        },
        {
          "timestamp": "03/22",
          "value": 550.5
        },
        {
          "timestamp": "03/23",
          "value": 504.7
        },
        {
          "timestamp": "03/24",
          "value": 556.3
        },
        {
          "timestamp": "03/25",
          "value": 562.7
        },
        {
          "timestamp": "03/26",
          "value": 550.4
        },
        {
          "timestamp": "03/27",
          "value": 602.5
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 24.6
        },
        {
          "timestamp": "03/15",
          "value": 27
        },
        {
          "timestamp": "03/16",
          "value": 25.3
        },
        {
          "timestamp": "03/17",
          "value": 24.5
        },
        {
          "timestamp": "03/18",
          "value": 27.4
        },
        {
          "timestamp": "03/19",
          "value": 26.9
        },
        {
          "timestamp": "03/20",
          "value": 26.1
        },
        {
          "timestamp": "03/21",
          "value": 24.4
        },
        {
          "timestamp": "03/22",
          "value": 21.7
        },
        {
          "timestamp": "03/23",
          "value": 23.2
        },
        {
          "timestamp": "03/24",
          "value": 21.2
        },
        {
          "timestamp": "03/25",
          "value": 21.4
        },
        {
          "timestamp": "03/26",
          "value": 23.4
        },
        {
          "timestamp": "03/27",
          "value": 22.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 39.7
        },
        {
          "timestamp": "03/15",
          "value": 40.1
        },
        {
          "timestamp": "03/16",
          "value": 42.3
        },
        {
          "timestamp": "03/17",
          "value": 41.9
        },
        {
          "timestamp": "03/18",
          "value": 40.2
        },
        {
          "timestamp": "03/19",
          "value": 42.1
        },
        {
          "timestamp": "03/20",
          "value": 41.1
        },
        {
          "timestamp": "03/21",
          "value": 36.1
        },
        {
          "timestamp": "03/22",
          "value": 34.4
        },
        {
          "timestamp": "03/23",
          "value": 35.8
        },
        {
          "timestamp": "03/24",
          "value": 33.4
        },
        {
          "timestamp": "03/25",
          "value": 37.4
        },
        {
          "timestamp": "03/26",
          "value": 34.3
        },
        {
          "timestamp": "03/27",
          "value": 39.7
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu044",
    "label": "GPU-044",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "err",
    "current": {
      "gpuUsage": 0,
      "memUsage": 0,
      "temp": 0,
      "power": 0,
      "cpuUsage": 0,
      "cpuMemUsage": 0
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu045",
    "label": "GPU-045",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 57,
      "memUsage": 55,
      "temp": 69,
      "power": 368,
      "cpuUsage": 59,
      "cpuMemUsage": 47
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 56.2
        },
        {
          "timestamp": "03/15",
          "value": 56.5
        },
        {
          "timestamp": "03/16",
          "value": 59.2
        },
        {
          "timestamp": "03/17",
          "value": 67.2
        },
        {
          "timestamp": "03/18",
          "value": 61.1
        },
        {
          "timestamp": "03/19",
          "value": 58.6
        },
        {
          "timestamp": "03/20",
          "value": 62.1
        },
        {
          "timestamp": "03/21",
          "value": 53.3
        },
        {
          "timestamp": "03/22",
          "value": 53.4
        },
        {
          "timestamp": "03/23",
          "value": 54.3
        },
        {
          "timestamp": "03/24",
          "value": 50.3
        },
        {
          "timestamp": "03/25",
          "value": 49
        },
        {
          "timestamp": "03/26",
          "value": 57.2
        },
        {
          "timestamp": "03/27",
          "value": 62.7
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 56.4
        },
        {
          "timestamp": "03/15",
          "value": 61.1
        },
        {
          "timestamp": "03/16",
          "value": 63.1
        },
        {
          "timestamp": "03/17",
          "value": 61.6
        },
        {
          "timestamp": "03/18",
          "value": 60.8
        },
        {
          "timestamp": "03/19",
          "value": 61.3
        },
        {
          "timestamp": "03/20",
          "value": 57.9
        },
        {
          "timestamp": "03/21",
          "value": 56.4
        },
        {
          "timestamp": "03/22",
          "value": 52.6
        },
        {
          "timestamp": "03/23",
          "value": 52.8
        },
        {
          "timestamp": "03/24",
          "value": 50.9
        },
        {
          "timestamp": "03/25",
          "value": 52.3
        },
        {
          "timestamp": "03/26",
          "value": 56.2
        },
        {
          "timestamp": "03/27",
          "value": 53
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 69.5
        },
        {
          "timestamp": "03/15",
          "value": 73.7
        },
        {
          "timestamp": "03/16",
          "value": 77.5
        },
        {
          "timestamp": "03/17",
          "value": 78.2
        },
        {
          "timestamp": "03/18",
          "value": 77.7
        },
        {
          "timestamp": "03/19",
          "value": 72
        },
        {
          "timestamp": "03/20",
          "value": 72.6
        },
        {
          "timestamp": "03/21",
          "value": 64.4
        },
        {
          "timestamp": "03/22",
          "value": 61.5
        },
        {
          "timestamp": "03/23",
          "value": 60.2
        },
        {
          "timestamp": "03/24",
          "value": 61.7
        },
        {
          "timestamp": "03/25",
          "value": 64.4
        },
        {
          "timestamp": "03/26",
          "value": 68
        },
        {
          "timestamp": "03/27",
          "value": 68
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 352.6
        },
        {
          "timestamp": "03/15",
          "value": 385.3
        },
        {
          "timestamp": "03/16",
          "value": 377.2
        },
        {
          "timestamp": "03/17",
          "value": 395.6
        },
        {
          "timestamp": "03/18",
          "value": 409
        },
        {
          "timestamp": "03/19",
          "value": 388.4
        },
        {
          "timestamp": "03/20",
          "value": 354.1
        },
        {
          "timestamp": "03/21",
          "value": 372.5
        },
        {
          "timestamp": "03/22",
          "value": 331.4
        },
        {
          "timestamp": "03/23",
          "value": 346
        },
        {
          "timestamp": "03/24",
          "value": 333.7
        },
        {
          "timestamp": "03/25",
          "value": 354.7
        },
        {
          "timestamp": "03/26",
          "value": 341.5
        },
        {
          "timestamp": "03/27",
          "value": 385.3
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 55.4
        },
        {
          "timestamp": "03/15",
          "value": 57.3
        },
        {
          "timestamp": "03/16",
          "value": 62.3
        },
        {
          "timestamp": "03/17",
          "value": 70.3
        },
        {
          "timestamp": "03/18",
          "value": 69.9
        },
        {
          "timestamp": "03/19",
          "value": 66.6
        },
        {
          "timestamp": "03/20",
          "value": 55.9
        },
        {
          "timestamp": "03/21",
          "value": 62
        },
        {
          "timestamp": "03/22",
          "value": 57
        },
        {
          "timestamp": "03/23",
          "value": 54
        },
        {
          "timestamp": "03/24",
          "value": 48.6
        },
        {
          "timestamp": "03/25",
          "value": 58.3
        },
        {
          "timestamp": "03/26",
          "value": 60.4
        },
        {
          "timestamp": "03/27",
          "value": 65.1
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 49.7
        },
        {
          "timestamp": "03/15",
          "value": 47.7
        },
        {
          "timestamp": "03/16",
          "value": 54
        },
        {
          "timestamp": "03/17",
          "value": 49.3
        },
        {
          "timestamp": "03/18",
          "value": 52.5
        },
        {
          "timestamp": "03/19",
          "value": 51.3
        },
        {
          "timestamp": "03/20",
          "value": 48.9
        },
        {
          "timestamp": "03/21",
          "value": 44.4
        },
        {
          "timestamp": "03/22",
          "value": 44.5
        },
        {
          "timestamp": "03/23",
          "value": 39.8
        },
        {
          "timestamp": "03/24",
          "value": 45.5
        },
        {
          "timestamp": "03/25",
          "value": 41.1
        },
        {
          "timestamp": "03/26",
          "value": 48.8
        },
        {
          "timestamp": "03/27",
          "value": 45.9
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu046",
    "label": "GPU-046",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 47,
      "memUsage": 33,
      "temp": 62,
      "power": 555,
      "cpuUsage": 39,
      "cpuMemUsage": 34
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 50
        },
        {
          "timestamp": "03/15",
          "value": 49.7
        },
        {
          "timestamp": "03/16",
          "value": 54.2
        },
        {
          "timestamp": "03/17",
          "value": 50.9
        },
        {
          "timestamp": "03/18",
          "value": 54.5
        },
        {
          "timestamp": "03/19",
          "value": 53.4
        },
        {
          "timestamp": "03/20",
          "value": 46.2
        },
        {
          "timestamp": "03/21",
          "value": 45.2
        },
        {
          "timestamp": "03/22",
          "value": 41.3
        },
        {
          "timestamp": "03/23",
          "value": 41.1
        },
        {
          "timestamp": "03/24",
          "value": 42.6
        },
        {
          "timestamp": "03/25",
          "value": 42.1
        },
        {
          "timestamp": "03/26",
          "value": 43
        },
        {
          "timestamp": "03/27",
          "value": 44.4
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 34.4
        },
        {
          "timestamp": "03/15",
          "value": 34.3
        },
        {
          "timestamp": "03/16",
          "value": 36.9
        },
        {
          "timestamp": "03/17",
          "value": 36.8
        },
        {
          "timestamp": "03/18",
          "value": 37.2
        },
        {
          "timestamp": "03/19",
          "value": 35.1
        },
        {
          "timestamp": "03/20",
          "value": 33.3
        },
        {
          "timestamp": "03/21",
          "value": 31.2
        },
        {
          "timestamp": "03/22",
          "value": 28.3
        },
        {
          "timestamp": "03/23",
          "value": 28.5
        },
        {
          "timestamp": "03/24",
          "value": 31.7
        },
        {
          "timestamp": "03/25",
          "value": 29.3
        },
        {
          "timestamp": "03/26",
          "value": 30.2
        },
        {
          "timestamp": "03/27",
          "value": 34.3
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 63.2
        },
        {
          "timestamp": "03/15",
          "value": 63
        },
        {
          "timestamp": "03/16",
          "value": 68.4
        },
        {
          "timestamp": "03/17",
          "value": 70.4
        },
        {
          "timestamp": "03/18",
          "value": 69
        },
        {
          "timestamp": "03/19",
          "value": 66.5
        },
        {
          "timestamp": "03/20",
          "value": 64.7
        },
        {
          "timestamp": "03/21",
          "value": 57.5
        },
        {
          "timestamp": "03/22",
          "value": 55
        },
        {
          "timestamp": "03/23",
          "value": 58.2
        },
        {
          "timestamp": "03/24",
          "value": 57.5
        },
        {
          "timestamp": "03/25",
          "value": 55.9
        },
        {
          "timestamp": "03/26",
          "value": 58
        },
        {
          "timestamp": "03/27",
          "value": 65.1
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 574.5
        },
        {
          "timestamp": "03/15",
          "value": 600.6
        },
        {
          "timestamp": "03/16",
          "value": 621.8
        },
        {
          "timestamp": "03/17",
          "value": 615.6
        },
        {
          "timestamp": "03/18",
          "value": 594.9
        },
        {
          "timestamp": "03/19",
          "value": 600.9
        },
        {
          "timestamp": "03/20",
          "value": 587.6
        },
        {
          "timestamp": "03/21",
          "value": 558.9
        },
        {
          "timestamp": "03/22",
          "value": 511.5
        },
        {
          "timestamp": "03/23",
          "value": 481.4
        },
        {
          "timestamp": "03/24",
          "value": 489.4
        },
        {
          "timestamp": "03/25",
          "value": 543.3
        },
        {
          "timestamp": "03/26",
          "value": 532.4
        },
        {
          "timestamp": "03/27",
          "value": 549
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 37.8
        },
        {
          "timestamp": "03/15",
          "value": 40.1
        },
        {
          "timestamp": "03/16",
          "value": 43
        },
        {
          "timestamp": "03/17",
          "value": 42.4
        },
        {
          "timestamp": "03/18",
          "value": 45.3
        },
        {
          "timestamp": "03/19",
          "value": 38.8
        },
        {
          "timestamp": "03/20",
          "value": 38.4
        },
        {
          "timestamp": "03/21",
          "value": 37.7
        },
        {
          "timestamp": "03/22",
          "value": 33.1
        },
        {
          "timestamp": "03/23",
          "value": 35.9
        },
        {
          "timestamp": "03/24",
          "value": 36.8
        },
        {
          "timestamp": "03/25",
          "value": 37.5
        },
        {
          "timestamp": "03/26",
          "value": 39.8
        },
        {
          "timestamp": "03/27",
          "value": 40.9
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 35.2
        },
        {
          "timestamp": "03/15",
          "value": 37.2
        },
        {
          "timestamp": "03/16",
          "value": 38.7
        },
        {
          "timestamp": "03/17",
          "value": 38.7
        },
        {
          "timestamp": "03/18",
          "value": 35.2
        },
        {
          "timestamp": "03/19",
          "value": 35.2
        },
        {
          "timestamp": "03/20",
          "value": 36.4
        },
        {
          "timestamp": "03/21",
          "value": 32.8
        },
        {
          "timestamp": "03/22",
          "value": 31
        },
        {
          "timestamp": "03/23",
          "value": 29.4
        },
        {
          "timestamp": "03/24",
          "value": 30.5
        },
        {
          "timestamp": "03/25",
          "value": 29.9
        },
        {
          "timestamp": "03/26",
          "value": 30.8
        },
        {
          "timestamp": "03/27",
          "value": 35.2
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu047",
    "label": "GPU-047",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 31,
      "memUsage": 39,
      "temp": 70,
      "power": 644,
      "cpuUsage": 38,
      "cpuMemUsage": 69
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 29.1
        },
        {
          "timestamp": "03/15",
          "value": 34.5
        },
        {
          "timestamp": "03/16",
          "value": 34.8
        },
        {
          "timestamp": "03/17",
          "value": 34.9
        },
        {
          "timestamp": "03/18",
          "value": 36.6
        },
        {
          "timestamp": "03/19",
          "value": 32.4
        },
        {
          "timestamp": "03/20",
          "value": 32.2
        },
        {
          "timestamp": "03/21",
          "value": 27.3
        },
        {
          "timestamp": "03/22",
          "value": 30.3
        },
        {
          "timestamp": "03/23",
          "value": 27.6
        },
        {
          "timestamp": "03/24",
          "value": 28.3
        },
        {
          "timestamp": "03/25",
          "value": 28.6
        },
        {
          "timestamp": "03/26",
          "value": 30.9
        },
        {
          "timestamp": "03/27",
          "value": 32.8
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 38.6
        },
        {
          "timestamp": "03/15",
          "value": 41
        },
        {
          "timestamp": "03/16",
          "value": 42.1
        },
        {
          "timestamp": "03/17",
          "value": 43.7
        },
        {
          "timestamp": "03/18",
          "value": 44.3
        },
        {
          "timestamp": "03/19",
          "value": 42.8
        },
        {
          "timestamp": "03/20",
          "value": 39.1
        },
        {
          "timestamp": "03/21",
          "value": 36.1
        },
        {
          "timestamp": "03/22",
          "value": 33.9
        },
        {
          "timestamp": "03/23",
          "value": 33
        },
        {
          "timestamp": "03/24",
          "value": 34.1
        },
        {
          "timestamp": "03/25",
          "value": 35.1
        },
        {
          "timestamp": "03/26",
          "value": 37.8
        },
        {
          "timestamp": "03/27",
          "value": 41.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 69.2
        },
        {
          "timestamp": "03/15",
          "value": 73.3
        },
        {
          "timestamp": "03/16",
          "value": 75.1
        },
        {
          "timestamp": "03/17",
          "value": 78.5
        },
        {
          "timestamp": "03/18",
          "value": 76.9
        },
        {
          "timestamp": "03/19",
          "value": 76.5
        },
        {
          "timestamp": "03/20",
          "value": 69.7
        },
        {
          "timestamp": "03/21",
          "value": 68
        },
        {
          "timestamp": "03/22",
          "value": 63.5
        },
        {
          "timestamp": "03/23",
          "value": 64.2
        },
        {
          "timestamp": "03/24",
          "value": 65.6
        },
        {
          "timestamp": "03/25",
          "value": 66.3
        },
        {
          "timestamp": "03/26",
          "value": 65.5
        },
        {
          "timestamp": "03/27",
          "value": 69.2
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 670.4
        },
        {
          "timestamp": "03/15",
          "value": 688.9
        },
        {
          "timestamp": "03/16",
          "value": 721.8
        },
        {
          "timestamp": "03/17",
          "value": 702
        },
        {
          "timestamp": "03/18",
          "value": 700
        },
        {
          "timestamp": "03/19",
          "value": 694.1
        },
        {
          "timestamp": "03/20",
          "value": 676.7
        },
        {
          "timestamp": "03/21",
          "value": 598.6
        },
        {
          "timestamp": "03/22",
          "value": 585.1
        },
        {
          "timestamp": "03/23",
          "value": 615.2
        },
        {
          "timestamp": "03/24",
          "value": 545.3
        },
        {
          "timestamp": "03/25",
          "value": 588.4
        },
        {
          "timestamp": "03/26",
          "value": 613.8
        },
        {
          "timestamp": "03/27",
          "value": 649.8
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 35
        },
        {
          "timestamp": "03/15",
          "value": 36.4
        },
        {
          "timestamp": "03/16",
          "value": 41.2
        },
        {
          "timestamp": "03/17",
          "value": 39.2
        },
        {
          "timestamp": "03/18",
          "value": 39.1
        },
        {
          "timestamp": "03/19",
          "value": 38.2
        },
        {
          "timestamp": "03/20",
          "value": 37.2
        },
        {
          "timestamp": "03/21",
          "value": 38
        },
        {
          "timestamp": "03/22",
          "value": 33.5
        },
        {
          "timestamp": "03/23",
          "value": 36
        },
        {
          "timestamp": "03/24",
          "value": 37.2
        },
        {
          "timestamp": "03/25",
          "value": 33.7
        },
        {
          "timestamp": "03/26",
          "value": 35.1
        },
        {
          "timestamp": "03/27",
          "value": 36
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 64.9
        },
        {
          "timestamp": "03/15",
          "value": 73
        },
        {
          "timestamp": "03/16",
          "value": 76.7
        },
        {
          "timestamp": "03/17",
          "value": 74.3
        },
        {
          "timestamp": "03/18",
          "value": 71.9
        },
        {
          "timestamp": "03/19",
          "value": 71.3
        },
        {
          "timestamp": "03/20",
          "value": 73.4
        },
        {
          "timestamp": "03/21",
          "value": 64.3
        },
        {
          "timestamp": "03/22",
          "value": 65.5
        },
        {
          "timestamp": "03/23",
          "value": 59.8
        },
        {
          "timestamp": "03/24",
          "value": 58.1
        },
        {
          "timestamp": "03/25",
          "value": 64.2
        },
        {
          "timestamp": "03/26",
          "value": 70.1
        },
        {
          "timestamp": "03/27",
          "value": 69.5
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu048",
    "label": "GPU-048",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 55,
      "memUsage": 36,
      "temp": 78,
      "power": 470,
      "cpuUsage": 49,
      "cpuMemUsage": 49
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 53.6
        },
        {
          "timestamp": "03/15",
          "value": 53.4
        },
        {
          "timestamp": "03/16",
          "value": 58.6
        },
        {
          "timestamp": "03/17",
          "value": 65.4
        },
        {
          "timestamp": "03/18",
          "value": 58.6
        },
        {
          "timestamp": "03/19",
          "value": 62.6
        },
        {
          "timestamp": "03/20",
          "value": 59.6
        },
        {
          "timestamp": "03/21",
          "value": 49
        },
        {
          "timestamp": "03/22",
          "value": 51.5
        },
        {
          "timestamp": "03/23",
          "value": 52.4
        },
        {
          "timestamp": "03/24",
          "value": 47.1
        },
        {
          "timestamp": "03/25",
          "value": 53.8
        },
        {
          "timestamp": "03/26",
          "value": 49
        },
        {
          "timestamp": "03/27",
          "value": 55.9
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 37.5
        },
        {
          "timestamp": "03/15",
          "value": 37.4
        },
        {
          "timestamp": "03/16",
          "value": 37.2
        },
        {
          "timestamp": "03/17",
          "value": 40.6
        },
        {
          "timestamp": "03/18",
          "value": 37
        },
        {
          "timestamp": "03/19",
          "value": 37.7
        },
        {
          "timestamp": "03/20",
          "value": 39
        },
        {
          "timestamp": "03/21",
          "value": 37.1
        },
        {
          "timestamp": "03/22",
          "value": 32.5
        },
        {
          "timestamp": "03/23",
          "value": 31.7
        },
        {
          "timestamp": "03/24",
          "value": 30.1
        },
        {
          "timestamp": "03/25",
          "value": 33.5
        },
        {
          "timestamp": "03/26",
          "value": 36.6
        },
        {
          "timestamp": "03/27",
          "value": 38.4
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 79.9
        },
        {
          "timestamp": "03/15",
          "value": 82.9
        },
        {
          "timestamp": "03/16",
          "value": 85.6
        },
        {
          "timestamp": "03/17",
          "value": 83.1
        },
        {
          "timestamp": "03/18",
          "value": 82.8
        },
        {
          "timestamp": "03/19",
          "value": 80.5
        },
        {
          "timestamp": "03/20",
          "value": 80.8
        },
        {
          "timestamp": "03/21",
          "value": 73.9
        },
        {
          "timestamp": "03/22",
          "value": 73.9
        },
        {
          "timestamp": "03/23",
          "value": 70.1
        },
        {
          "timestamp": "03/24",
          "value": 73
        },
        {
          "timestamp": "03/25",
          "value": 73.5
        },
        {
          "timestamp": "03/26",
          "value": 76
        },
        {
          "timestamp": "03/27",
          "value": 78.2
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 479
        },
        {
          "timestamp": "03/15",
          "value": 469.1
        },
        {
          "timestamp": "03/16",
          "value": 482.5
        },
        {
          "timestamp": "03/17",
          "value": 541.9
        },
        {
          "timestamp": "03/18",
          "value": 497.7
        },
        {
          "timestamp": "03/19",
          "value": 524.3
        },
        {
          "timestamp": "03/20",
          "value": 469.9
        },
        {
          "timestamp": "03/21",
          "value": 462.1
        },
        {
          "timestamp": "03/22",
          "value": 414.3
        },
        {
          "timestamp": "03/23",
          "value": 399.6
        },
        {
          "timestamp": "03/24",
          "value": 407.6
        },
        {
          "timestamp": "03/25",
          "value": 460.2
        },
        {
          "timestamp": "03/26",
          "value": 461.1
        },
        {
          "timestamp": "03/27",
          "value": 502.8
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 52.7
        },
        {
          "timestamp": "03/15",
          "value": 54.4
        },
        {
          "timestamp": "03/16",
          "value": 51.8
        },
        {
          "timestamp": "03/17",
          "value": 58.8
        },
        {
          "timestamp": "03/18",
          "value": 50.7
        },
        {
          "timestamp": "03/19",
          "value": 49.6
        },
        {
          "timestamp": "03/20",
          "value": 54.4
        },
        {
          "timestamp": "03/21",
          "value": 46.8
        },
        {
          "timestamp": "03/22",
          "value": 44.7
        },
        {
          "timestamp": "03/23",
          "value": 43.8
        },
        {
          "timestamp": "03/24",
          "value": 41.9
        },
        {
          "timestamp": "03/25",
          "value": 40.7
        },
        {
          "timestamp": "03/26",
          "value": 52.5
        },
        {
          "timestamp": "03/27",
          "value": 46.3
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 49.6
        },
        {
          "timestamp": "03/15",
          "value": 52.1
        },
        {
          "timestamp": "03/16",
          "value": 54.6
        },
        {
          "timestamp": "03/17",
          "value": 50.7
        },
        {
          "timestamp": "03/18",
          "value": 50.5
        },
        {
          "timestamp": "03/19",
          "value": 53.7
        },
        {
          "timestamp": "03/20",
          "value": 51.3
        },
        {
          "timestamp": "03/21",
          "value": 44.2
        },
        {
          "timestamp": "03/22",
          "value": 46.4
        },
        {
          "timestamp": "03/23",
          "value": 42.5
        },
        {
          "timestamp": "03/24",
          "value": 42.2
        },
        {
          "timestamp": "03/25",
          "value": 44.7
        },
        {
          "timestamp": "03/26",
          "value": 45.6
        },
        {
          "timestamp": "03/27",
          "value": 47.5
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu049",
    "label": "GPU-049",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "warn",
    "current": {
      "gpuUsage": 96,
      "memUsage": 86,
      "temp": 90,
      "power": 988,
      "cpuUsage": 42,
      "cpuMemUsage": 31
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 100.7
        },
        {
          "timestamp": "03/15",
          "value": 103.9
        },
        {
          "timestamp": "03/16",
          "value": 110.5
        },
        {
          "timestamp": "03/17",
          "value": 103.9
        },
        {
          "timestamp": "03/18",
          "value": 106.8
        },
        {
          "timestamp": "03/19",
          "value": 101.6
        },
        {
          "timestamp": "03/20",
          "value": 103
        },
        {
          "timestamp": "03/21",
          "value": 86
        },
        {
          "timestamp": "03/22",
          "value": 81.4
        },
        {
          "timestamp": "03/23",
          "value": 95.1
        },
        {
          "timestamp": "03/24",
          "value": 82.8
        },
        {
          "timestamp": "03/25",
          "value": 82.9
        },
        {
          "timestamp": "03/26",
          "value": 87.2
        },
        {
          "timestamp": "03/27",
          "value": 101.4
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 83
        },
        {
          "timestamp": "03/15",
          "value": 88.6
        },
        {
          "timestamp": "03/16",
          "value": 88.3
        },
        {
          "timestamp": "03/17",
          "value": 96.2
        },
        {
          "timestamp": "03/18",
          "value": 91.4
        },
        {
          "timestamp": "03/19",
          "value": 89.4
        },
        {
          "timestamp": "03/20",
          "value": 87.7
        },
        {
          "timestamp": "03/21",
          "value": 80.5
        },
        {
          "timestamp": "03/22",
          "value": 80.5
        },
        {
          "timestamp": "03/23",
          "value": 83.5
        },
        {
          "timestamp": "03/24",
          "value": 78.9
        },
        {
          "timestamp": "03/25",
          "value": 74.4
        },
        {
          "timestamp": "03/26",
          "value": 83.2
        },
        {
          "timestamp": "03/27",
          "value": 89.3
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 89
        },
        {
          "timestamp": "03/15",
          "value": 96
        },
        {
          "timestamp": "03/16",
          "value": 97.6
        },
        {
          "timestamp": "03/17",
          "value": 101.8
        },
        {
          "timestamp": "03/18",
          "value": 98.1
        },
        {
          "timestamp": "03/19",
          "value": 97.1
        },
        {
          "timestamp": "03/20",
          "value": 90.1
        },
        {
          "timestamp": "03/21",
          "value": 88.2
        },
        {
          "timestamp": "03/22",
          "value": 82.3
        },
        {
          "timestamp": "03/23",
          "value": 82.7
        },
        {
          "timestamp": "03/24",
          "value": 84.4
        },
        {
          "timestamp": "03/25",
          "value": 83.6
        },
        {
          "timestamp": "03/26",
          "value": 84
        },
        {
          "timestamp": "03/27",
          "value": 91.8
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 981.7
        },
        {
          "timestamp": "03/15",
          "value": 1067.7
        },
        {
          "timestamp": "03/16",
          "value": 1092.1
        },
        {
          "timestamp": "03/17",
          "value": 1142.9
        },
        {
          "timestamp": "03/18",
          "value": 1071.2
        },
        {
          "timestamp": "03/19",
          "value": 1018.6
        },
        {
          "timestamp": "03/20",
          "value": 997.8
        },
        {
          "timestamp": "03/21",
          "value": 903.8
        },
        {
          "timestamp": "03/22",
          "value": 885.7
        },
        {
          "timestamp": "03/23",
          "value": 928
        },
        {
          "timestamp": "03/24",
          "value": 897.5
        },
        {
          "timestamp": "03/25",
          "value": 932.9
        },
        {
          "timestamp": "03/26",
          "value": 1006.9
        },
        {
          "timestamp": "03/27",
          "value": 1065.7
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 44.2
        },
        {
          "timestamp": "03/15",
          "value": 46.2
        },
        {
          "timestamp": "03/16",
          "value": 45.1
        },
        {
          "timestamp": "03/17",
          "value": 47.6
        },
        {
          "timestamp": "03/18",
          "value": 48.5
        },
        {
          "timestamp": "03/19",
          "value": 47.5
        },
        {
          "timestamp": "03/20",
          "value": 46
        },
        {
          "timestamp": "03/21",
          "value": 37.6
        },
        {
          "timestamp": "03/22",
          "value": 40.9
        },
        {
          "timestamp": "03/23",
          "value": 33.8
        },
        {
          "timestamp": "03/24",
          "value": 37.2
        },
        {
          "timestamp": "03/25",
          "value": 41.7
        },
        {
          "timestamp": "03/26",
          "value": 43.1
        },
        {
          "timestamp": "03/27",
          "value": 41.5
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 31
        },
        {
          "timestamp": "03/15",
          "value": 34.1
        },
        {
          "timestamp": "03/16",
          "value": 32.1
        },
        {
          "timestamp": "03/17",
          "value": 35.1
        },
        {
          "timestamp": "03/18",
          "value": 32.5
        },
        {
          "timestamp": "03/19",
          "value": 31
        },
        {
          "timestamp": "03/20",
          "value": 33.6
        },
        {
          "timestamp": "03/21",
          "value": 31
        },
        {
          "timestamp": "03/22",
          "value": 27.2
        },
        {
          "timestamp": "03/23",
          "value": 28
        },
        {
          "timestamp": "03/24",
          "value": 28.7
        },
        {
          "timestamp": "03/25",
          "value": 30.5
        },
        {
          "timestamp": "03/26",
          "value": 28.6
        },
        {
          "timestamp": "03/27",
          "value": 30.1
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu050",
    "label": "GPU-050",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 69,
      "memUsage": 44,
      "temp": 59,
      "power": 627,
      "cpuUsage": 71,
      "cpuMemUsage": 38
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 70.2
        },
        {
          "timestamp": "03/15",
          "value": 76.5
        },
        {
          "timestamp": "03/16",
          "value": 73.5
        },
        {
          "timestamp": "03/17",
          "value": 73.3
        },
        {
          "timestamp": "03/18",
          "value": 81
        },
        {
          "timestamp": "03/19",
          "value": 76.2
        },
        {
          "timestamp": "03/20",
          "value": 68.4
        },
        {
          "timestamp": "03/21",
          "value": 61.1
        },
        {
          "timestamp": "03/22",
          "value": 69.4
        },
        {
          "timestamp": "03/23",
          "value": 64.5
        },
        {
          "timestamp": "03/24",
          "value": 58.9
        },
        {
          "timestamp": "03/25",
          "value": 69.9
        },
        {
          "timestamp": "03/26",
          "value": 65.4
        },
        {
          "timestamp": "03/27",
          "value": 71.7
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 47
        },
        {
          "timestamp": "03/15",
          "value": 42.8
        },
        {
          "timestamp": "03/16",
          "value": 50.9
        },
        {
          "timestamp": "03/17",
          "value": 49.5
        },
        {
          "timestamp": "03/18",
          "value": 45
        },
        {
          "timestamp": "03/19",
          "value": 44
        },
        {
          "timestamp": "03/20",
          "value": 41.6
        },
        {
          "timestamp": "03/21",
          "value": 45.6
        },
        {
          "timestamp": "03/22",
          "value": 41.1
        },
        {
          "timestamp": "03/23",
          "value": 41.3
        },
        {
          "timestamp": "03/24",
          "value": 41.7
        },
        {
          "timestamp": "03/25",
          "value": 43.7
        },
        {
          "timestamp": "03/26",
          "value": 40.9
        },
        {
          "timestamp": "03/27",
          "value": 46.2
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 60.3
        },
        {
          "timestamp": "03/15",
          "value": 59.8
        },
        {
          "timestamp": "03/16",
          "value": 66.1
        },
        {
          "timestamp": "03/17",
          "value": 62.7
        },
        {
          "timestamp": "03/18",
          "value": 64.9
        },
        {
          "timestamp": "03/19",
          "value": 60.6
        },
        {
          "timestamp": "03/20",
          "value": 62.1
        },
        {
          "timestamp": "03/21",
          "value": 57.5
        },
        {
          "timestamp": "03/22",
          "value": 54.4
        },
        {
          "timestamp": "03/23",
          "value": 51
        },
        {
          "timestamp": "03/24",
          "value": 52
        },
        {
          "timestamp": "03/25",
          "value": 55.6
        },
        {
          "timestamp": "03/26",
          "value": 55.8
        },
        {
          "timestamp": "03/27",
          "value": 62.3
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 627.9
        },
        {
          "timestamp": "03/15",
          "value": 644.1
        },
        {
          "timestamp": "03/16",
          "value": 689.4
        },
        {
          "timestamp": "03/17",
          "value": 658.9
        },
        {
          "timestamp": "03/18",
          "value": 677.5
        },
        {
          "timestamp": "03/19",
          "value": 639.9
        },
        {
          "timestamp": "03/20",
          "value": 645.7
        },
        {
          "timestamp": "03/21",
          "value": 580.6
        },
        {
          "timestamp": "03/22",
          "value": 596.4
        },
        {
          "timestamp": "03/23",
          "value": 538.6
        },
        {
          "timestamp": "03/24",
          "value": 541.7
        },
        {
          "timestamp": "03/25",
          "value": 598.3
        },
        {
          "timestamp": "03/26",
          "value": 626.9
        },
        {
          "timestamp": "03/27",
          "value": 644.2
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 77.1
        },
        {
          "timestamp": "03/15",
          "value": 69.6
        },
        {
          "timestamp": "03/16",
          "value": 79
        },
        {
          "timestamp": "03/17",
          "value": 72.2
        },
        {
          "timestamp": "03/18",
          "value": 72.9
        },
        {
          "timestamp": "03/19",
          "value": 69.1
        },
        {
          "timestamp": "03/20",
          "value": 70.1
        },
        {
          "timestamp": "03/21",
          "value": 74.6
        },
        {
          "timestamp": "03/22",
          "value": 59.9
        },
        {
          "timestamp": "03/23",
          "value": 61.1
        },
        {
          "timestamp": "03/24",
          "value": 60.5
        },
        {
          "timestamp": "03/25",
          "value": 61.8
        },
        {
          "timestamp": "03/26",
          "value": 62.6
        },
        {
          "timestamp": "03/27",
          "value": 76.1
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 38.8
        },
        {
          "timestamp": "03/15",
          "value": 40.3
        },
        {
          "timestamp": "03/16",
          "value": 41.1
        },
        {
          "timestamp": "03/17",
          "value": 41.5
        },
        {
          "timestamp": "03/18",
          "value": 42.9
        },
        {
          "timestamp": "03/19",
          "value": 38.2
        },
        {
          "timestamp": "03/20",
          "value": 41.2
        },
        {
          "timestamp": "03/21",
          "value": 39.2
        },
        {
          "timestamp": "03/22",
          "value": 32.8
        },
        {
          "timestamp": "03/23",
          "value": 35.9
        },
        {
          "timestamp": "03/24",
          "value": 35.8
        },
        {
          "timestamp": "03/25",
          "value": 33.7
        },
        {
          "timestamp": "03/26",
          "value": 37.8
        },
        {
          "timestamp": "03/27",
          "value": 39.7
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu051",
    "label": "GPU-051",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 51,
      "memUsage": 55,
      "temp": 58,
      "power": 536,
      "cpuUsage": 55,
      "cpuMemUsage": 36
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 53.1
        },
        {
          "timestamp": "03/15",
          "value": 52.8
        },
        {
          "timestamp": "03/16",
          "value": 51.1
        },
        {
          "timestamp": "03/17",
          "value": 52
        },
        {
          "timestamp": "03/18",
          "value": 51.1
        },
        {
          "timestamp": "03/19",
          "value": 52.5
        },
        {
          "timestamp": "03/20",
          "value": 52.9
        },
        {
          "timestamp": "03/21",
          "value": 47.3
        },
        {
          "timestamp": "03/22",
          "value": 42.7
        },
        {
          "timestamp": "03/23",
          "value": 45.5
        },
        {
          "timestamp": "03/24",
          "value": 50.3
        },
        {
          "timestamp": "03/25",
          "value": 44
        },
        {
          "timestamp": "03/26",
          "value": 48.4
        },
        {
          "timestamp": "03/27",
          "value": 52
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 52.3
        },
        {
          "timestamp": "03/15",
          "value": 59.2
        },
        {
          "timestamp": "03/16",
          "value": 62
        },
        {
          "timestamp": "03/17",
          "value": 59.5
        },
        {
          "timestamp": "03/18",
          "value": 58.1
        },
        {
          "timestamp": "03/19",
          "value": 59.7
        },
        {
          "timestamp": "03/20",
          "value": 54.1
        },
        {
          "timestamp": "03/21",
          "value": 56.4
        },
        {
          "timestamp": "03/22",
          "value": 52.7
        },
        {
          "timestamp": "03/23",
          "value": 52.7
        },
        {
          "timestamp": "03/24",
          "value": 52
        },
        {
          "timestamp": "03/25",
          "value": 51.7
        },
        {
          "timestamp": "03/26",
          "value": 50.6
        },
        {
          "timestamp": "03/27",
          "value": 59.7
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 59.5
        },
        {
          "timestamp": "03/15",
          "value": 59.5
        },
        {
          "timestamp": "03/16",
          "value": 61.3
        },
        {
          "timestamp": "03/17",
          "value": 63.8
        },
        {
          "timestamp": "03/18",
          "value": 61.7
        },
        {
          "timestamp": "03/19",
          "value": 59.2
        },
        {
          "timestamp": "03/20",
          "value": 59.2
        },
        {
          "timestamp": "03/21",
          "value": 58.1
        },
        {
          "timestamp": "03/22",
          "value": 52.3
        },
        {
          "timestamp": "03/23",
          "value": 51.1
        },
        {
          "timestamp": "03/24",
          "value": 53.9
        },
        {
          "timestamp": "03/25",
          "value": 54.6
        },
        {
          "timestamp": "03/26",
          "value": 55.2
        },
        {
          "timestamp": "03/27",
          "value": 59.4
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 511.5
        },
        {
          "timestamp": "03/15",
          "value": 552.8
        },
        {
          "timestamp": "03/16",
          "value": 592.7
        },
        {
          "timestamp": "03/17",
          "value": 562.9
        },
        {
          "timestamp": "03/18",
          "value": 611.9
        },
        {
          "timestamp": "03/19",
          "value": 583.3
        },
        {
          "timestamp": "03/20",
          "value": 553.1
        },
        {
          "timestamp": "03/21",
          "value": 507.2
        },
        {
          "timestamp": "03/22",
          "value": 473
        },
        {
          "timestamp": "03/23",
          "value": 462.4
        },
        {
          "timestamp": "03/24",
          "value": 469.4
        },
        {
          "timestamp": "03/25",
          "value": 514.1
        },
        {
          "timestamp": "03/26",
          "value": 532.5
        },
        {
          "timestamp": "03/27",
          "value": 548.1
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 59.7
        },
        {
          "timestamp": "03/15",
          "value": 58.7
        },
        {
          "timestamp": "03/16",
          "value": 56
        },
        {
          "timestamp": "03/17",
          "value": 56.4
        },
        {
          "timestamp": "03/18",
          "value": 56
        },
        {
          "timestamp": "03/19",
          "value": 54.1
        },
        {
          "timestamp": "03/20",
          "value": 53.9
        },
        {
          "timestamp": "03/21",
          "value": 54.2
        },
        {
          "timestamp": "03/22",
          "value": 52.4
        },
        {
          "timestamp": "03/23",
          "value": 53.1
        },
        {
          "timestamp": "03/24",
          "value": 52.1
        },
        {
          "timestamp": "03/25",
          "value": 55.2
        },
        {
          "timestamp": "03/26",
          "value": 58
        },
        {
          "timestamp": "03/27",
          "value": 52.5
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 35.2
        },
        {
          "timestamp": "03/15",
          "value": 39.9
        },
        {
          "timestamp": "03/16",
          "value": 40.1
        },
        {
          "timestamp": "03/17",
          "value": 42.1
        },
        {
          "timestamp": "03/18",
          "value": 40.7
        },
        {
          "timestamp": "03/19",
          "value": 36.4
        },
        {
          "timestamp": "03/20",
          "value": 34.9
        },
        {
          "timestamp": "03/21",
          "value": 37.1
        },
        {
          "timestamp": "03/22",
          "value": 34.9
        },
        {
          "timestamp": "03/23",
          "value": 33.1
        },
        {
          "timestamp": "03/24",
          "value": 35
        },
        {
          "timestamp": "03/25",
          "value": 35.8
        },
        {
          "timestamp": "03/26",
          "value": 35
        },
        {
          "timestamp": "03/27",
          "value": 38.9
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu052",
    "label": "GPU-052",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "warn",
    "current": {
      "gpuUsage": 90,
      "memUsage": 80,
      "temp": 89,
      "power": 929,
      "cpuUsage": 35,
      "cpuMemUsage": 59
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 97.6
        },
        {
          "timestamp": "03/15",
          "value": 95.1
        },
        {
          "timestamp": "03/16",
          "value": 100
        },
        {
          "timestamp": "03/17",
          "value": 96.6
        },
        {
          "timestamp": "03/18",
          "value": 100.8
        },
        {
          "timestamp": "03/19",
          "value": 95.3
        },
        {
          "timestamp": "03/20",
          "value": 93.8
        },
        {
          "timestamp": "03/21",
          "value": 81.9
        },
        {
          "timestamp": "03/22",
          "value": 86.9
        },
        {
          "timestamp": "03/23",
          "value": 89
        },
        {
          "timestamp": "03/24",
          "value": 76.9
        },
        {
          "timestamp": "03/25",
          "value": 83.9
        },
        {
          "timestamp": "03/26",
          "value": 87
        },
        {
          "timestamp": "03/27",
          "value": 89
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 83.6
        },
        {
          "timestamp": "03/15",
          "value": 81.4
        },
        {
          "timestamp": "03/16",
          "value": 83.7
        },
        {
          "timestamp": "03/17",
          "value": 87.8
        },
        {
          "timestamp": "03/18",
          "value": 90.9
        },
        {
          "timestamp": "03/19",
          "value": 89.4
        },
        {
          "timestamp": "03/20",
          "value": 79.6
        },
        {
          "timestamp": "03/21",
          "value": 79.9
        },
        {
          "timestamp": "03/22",
          "value": 71.8
        },
        {
          "timestamp": "03/23",
          "value": 72.3
        },
        {
          "timestamp": "03/24",
          "value": 73.8
        },
        {
          "timestamp": "03/25",
          "value": 77.3
        },
        {
          "timestamp": "03/26",
          "value": 80.3
        },
        {
          "timestamp": "03/27",
          "value": 81.8
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 87.9
        },
        {
          "timestamp": "03/15",
          "value": 95.2
        },
        {
          "timestamp": "03/16",
          "value": 93.4
        },
        {
          "timestamp": "03/17",
          "value": 96.3
        },
        {
          "timestamp": "03/18",
          "value": 96.8
        },
        {
          "timestamp": "03/19",
          "value": 94.8
        },
        {
          "timestamp": "03/20",
          "value": 89.3
        },
        {
          "timestamp": "03/21",
          "value": 83.2
        },
        {
          "timestamp": "03/22",
          "value": 85.3
        },
        {
          "timestamp": "03/23",
          "value": 77.6
        },
        {
          "timestamp": "03/24",
          "value": 82.1
        },
        {
          "timestamp": "03/25",
          "value": 85.4
        },
        {
          "timestamp": "03/26",
          "value": 85.1
        },
        {
          "timestamp": "03/27",
          "value": 91.8
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 983.1
        },
        {
          "timestamp": "03/15",
          "value": 1022.4
        },
        {
          "timestamp": "03/16",
          "value": 1014
        },
        {
          "timestamp": "03/17",
          "value": 1025.4
        },
        {
          "timestamp": "03/18",
          "value": 1021.8
        },
        {
          "timestamp": "03/19",
          "value": 968.2
        },
        {
          "timestamp": "03/20",
          "value": 956.4
        },
        {
          "timestamp": "03/21",
          "value": 879.5
        },
        {
          "timestamp": "03/22",
          "value": 843.4
        },
        {
          "timestamp": "03/23",
          "value": 822.3
        },
        {
          "timestamp": "03/24",
          "value": 847.5
        },
        {
          "timestamp": "03/25",
          "value": 893.6
        },
        {
          "timestamp": "03/26",
          "value": 867.7
        },
        {
          "timestamp": "03/27",
          "value": 925.5
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 35.9
        },
        {
          "timestamp": "03/15",
          "value": 38.5
        },
        {
          "timestamp": "03/16",
          "value": 39.9
        },
        {
          "timestamp": "03/17",
          "value": 36
        },
        {
          "timestamp": "03/18",
          "value": 38.5
        },
        {
          "timestamp": "03/19",
          "value": 34.8
        },
        {
          "timestamp": "03/20",
          "value": 33.3
        },
        {
          "timestamp": "03/21",
          "value": 35.1
        },
        {
          "timestamp": "03/22",
          "value": 32.2
        },
        {
          "timestamp": "03/23",
          "value": 29.5
        },
        {
          "timestamp": "03/24",
          "value": 32.1
        },
        {
          "timestamp": "03/25",
          "value": 35.5
        },
        {
          "timestamp": "03/26",
          "value": 32.5
        },
        {
          "timestamp": "03/27",
          "value": 35.2
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 57.6
        },
        {
          "timestamp": "03/15",
          "value": 60.1
        },
        {
          "timestamp": "03/16",
          "value": 65.2
        },
        {
          "timestamp": "03/17",
          "value": 69
        },
        {
          "timestamp": "03/18",
          "value": 67.3
        },
        {
          "timestamp": "03/19",
          "value": 60
        },
        {
          "timestamp": "03/20",
          "value": 58.5
        },
        {
          "timestamp": "03/21",
          "value": 57.3
        },
        {
          "timestamp": "03/22",
          "value": 52
        },
        {
          "timestamp": "03/23",
          "value": 51
        },
        {
          "timestamp": "03/24",
          "value": 55.1
        },
        {
          "timestamp": "03/25",
          "value": 58.1
        },
        {
          "timestamp": "03/26",
          "value": 60.7
        },
        {
          "timestamp": "03/27",
          "value": 59.3
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu053",
    "label": "GPU-053",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 81,
      "memUsage": 28,
      "temp": 75,
      "power": 756,
      "cpuUsage": 47,
      "cpuMemUsage": 41
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 83.5
        },
        {
          "timestamp": "03/15",
          "value": 88.3
        },
        {
          "timestamp": "03/16",
          "value": 84.8
        },
        {
          "timestamp": "03/17",
          "value": 91.8
        },
        {
          "timestamp": "03/18",
          "value": 81.4
        },
        {
          "timestamp": "03/19",
          "value": 82.6
        },
        {
          "timestamp": "03/20",
          "value": 87.6
        },
        {
          "timestamp": "03/21",
          "value": 80.8
        },
        {
          "timestamp": "03/22",
          "value": 79.2
        },
        {
          "timestamp": "03/23",
          "value": 79.3
        },
        {
          "timestamp": "03/24",
          "value": 66.2
        },
        {
          "timestamp": "03/25",
          "value": 68.5
        },
        {
          "timestamp": "03/26",
          "value": 72.2
        },
        {
          "timestamp": "03/27",
          "value": 79.7
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 27.8
        },
        {
          "timestamp": "03/15",
          "value": 30.4
        },
        {
          "timestamp": "03/16",
          "value": 29
        },
        {
          "timestamp": "03/17",
          "value": 29.1
        },
        {
          "timestamp": "03/18",
          "value": 29.4
        },
        {
          "timestamp": "03/19",
          "value": 31.4
        },
        {
          "timestamp": "03/20",
          "value": 27.5
        },
        {
          "timestamp": "03/21",
          "value": 28.8
        },
        {
          "timestamp": "03/22",
          "value": 25.2
        },
        {
          "timestamp": "03/23",
          "value": 23.2
        },
        {
          "timestamp": "03/24",
          "value": 24.7
        },
        {
          "timestamp": "03/25",
          "value": 26.7
        },
        {
          "timestamp": "03/26",
          "value": 26.6
        },
        {
          "timestamp": "03/27",
          "value": 29.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 74.4
        },
        {
          "timestamp": "03/15",
          "value": 76.3
        },
        {
          "timestamp": "03/16",
          "value": 79.9
        },
        {
          "timestamp": "03/17",
          "value": 85.3
        },
        {
          "timestamp": "03/18",
          "value": 80.8
        },
        {
          "timestamp": "03/19",
          "value": 79.7
        },
        {
          "timestamp": "03/20",
          "value": 75.3
        },
        {
          "timestamp": "03/21",
          "value": 74.3
        },
        {
          "timestamp": "03/22",
          "value": 70.5
        },
        {
          "timestamp": "03/23",
          "value": 68.1
        },
        {
          "timestamp": "03/24",
          "value": 67.9
        },
        {
          "timestamp": "03/25",
          "value": 68.9
        },
        {
          "timestamp": "03/26",
          "value": 72.8
        },
        {
          "timestamp": "03/27",
          "value": 78.3
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 768
        },
        {
          "timestamp": "03/15",
          "value": 801.5
        },
        {
          "timestamp": "03/16",
          "value": 832.9
        },
        {
          "timestamp": "03/17",
          "value": 873.6
        },
        {
          "timestamp": "03/18",
          "value": 868.3
        },
        {
          "timestamp": "03/19",
          "value": 789.5
        },
        {
          "timestamp": "03/20",
          "value": 784.1
        },
        {
          "timestamp": "03/21",
          "value": 686.5
        },
        {
          "timestamp": "03/22",
          "value": 659.4
        },
        {
          "timestamp": "03/23",
          "value": 650.7
        },
        {
          "timestamp": "03/24",
          "value": 639.6
        },
        {
          "timestamp": "03/25",
          "value": 675.1
        },
        {
          "timestamp": "03/26",
          "value": 717.1
        },
        {
          "timestamp": "03/27",
          "value": 800.3
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 44.8
        },
        {
          "timestamp": "03/15",
          "value": 45.7
        },
        {
          "timestamp": "03/16",
          "value": 52.1
        },
        {
          "timestamp": "03/17",
          "value": 55.5
        },
        {
          "timestamp": "03/18",
          "value": 49.4
        },
        {
          "timestamp": "03/19",
          "value": 51.3
        },
        {
          "timestamp": "03/20",
          "value": 46.4
        },
        {
          "timestamp": "03/21",
          "value": 42
        },
        {
          "timestamp": "03/22",
          "value": 43.1
        },
        {
          "timestamp": "03/23",
          "value": 46.6
        },
        {
          "timestamp": "03/24",
          "value": 43.1
        },
        {
          "timestamp": "03/25",
          "value": 44.9
        },
        {
          "timestamp": "03/26",
          "value": 42.3
        },
        {
          "timestamp": "03/27",
          "value": 43.8
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 41.4
        },
        {
          "timestamp": "03/15",
          "value": 45.6
        },
        {
          "timestamp": "03/16",
          "value": 43.1
        },
        {
          "timestamp": "03/17",
          "value": 43.5
        },
        {
          "timestamp": "03/18",
          "value": 43.3
        },
        {
          "timestamp": "03/19",
          "value": 45.5
        },
        {
          "timestamp": "03/20",
          "value": 40
        },
        {
          "timestamp": "03/21",
          "value": 39.8
        },
        {
          "timestamp": "03/22",
          "value": 39.1
        },
        {
          "timestamp": "03/23",
          "value": 38
        },
        {
          "timestamp": "03/24",
          "value": 39.6
        },
        {
          "timestamp": "03/25",
          "value": 38.8
        },
        {
          "timestamp": "03/26",
          "value": 41.8
        },
        {
          "timestamp": "03/27",
          "value": 43.5
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu054",
    "label": "GPU-054",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 62,
      "memUsage": 61,
      "temp": 59,
      "power": 283,
      "cpuUsage": 56,
      "cpuMemUsage": 67
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 60.4
        },
        {
          "timestamp": "03/15",
          "value": 69.7
        },
        {
          "timestamp": "03/16",
          "value": 67.6
        },
        {
          "timestamp": "03/17",
          "value": 70
        },
        {
          "timestamp": "03/18",
          "value": 72.5
        },
        {
          "timestamp": "03/19",
          "value": 70.4
        },
        {
          "timestamp": "03/20",
          "value": 61.8
        },
        {
          "timestamp": "03/21",
          "value": 63.8
        },
        {
          "timestamp": "03/22",
          "value": 57.8
        },
        {
          "timestamp": "03/23",
          "value": 59.7
        },
        {
          "timestamp": "03/24",
          "value": 57.1
        },
        {
          "timestamp": "03/25",
          "value": 53.3
        },
        {
          "timestamp": "03/26",
          "value": 56.8
        },
        {
          "timestamp": "03/27",
          "value": 67.5
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 57.7
        },
        {
          "timestamp": "03/15",
          "value": 65.2
        },
        {
          "timestamp": "03/16",
          "value": 64.9
        },
        {
          "timestamp": "03/17",
          "value": 66
        },
        {
          "timestamp": "03/18",
          "value": 70.4
        },
        {
          "timestamp": "03/19",
          "value": 62.9
        },
        {
          "timestamp": "03/20",
          "value": 57.3
        },
        {
          "timestamp": "03/21",
          "value": 56.6
        },
        {
          "timestamp": "03/22",
          "value": 55.1
        },
        {
          "timestamp": "03/23",
          "value": 56.6
        },
        {
          "timestamp": "03/24",
          "value": 52.2
        },
        {
          "timestamp": "03/25",
          "value": 56.4
        },
        {
          "timestamp": "03/26",
          "value": 59
        },
        {
          "timestamp": "03/27",
          "value": 64.9
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 61.2
        },
        {
          "timestamp": "03/15",
          "value": 59.5
        },
        {
          "timestamp": "03/16",
          "value": 64.6
        },
        {
          "timestamp": "03/17",
          "value": 66.9
        },
        {
          "timestamp": "03/18",
          "value": 63.4
        },
        {
          "timestamp": "03/19",
          "value": 61.8
        },
        {
          "timestamp": "03/20",
          "value": 59.1
        },
        {
          "timestamp": "03/21",
          "value": 55
        },
        {
          "timestamp": "03/22",
          "value": 56.4
        },
        {
          "timestamp": "03/23",
          "value": 51.9
        },
        {
          "timestamp": "03/24",
          "value": 51.7
        },
        {
          "timestamp": "03/25",
          "value": 55
        },
        {
          "timestamp": "03/26",
          "value": 58
        },
        {
          "timestamp": "03/27",
          "value": 60.6
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 284.4
        },
        {
          "timestamp": "03/15",
          "value": 293.4
        },
        {
          "timestamp": "03/16",
          "value": 307.5
        },
        {
          "timestamp": "03/17",
          "value": 321.8
        },
        {
          "timestamp": "03/18",
          "value": 297
        },
        {
          "timestamp": "03/19",
          "value": 311.4
        },
        {
          "timestamp": "03/20",
          "value": 295.4
        },
        {
          "timestamp": "03/21",
          "value": 283.6
        },
        {
          "timestamp": "03/22",
          "value": 273.1
        },
        {
          "timestamp": "03/23",
          "value": 260.4
        },
        {
          "timestamp": "03/24",
          "value": 255.3
        },
        {
          "timestamp": "03/25",
          "value": 260.3
        },
        {
          "timestamp": "03/26",
          "value": 267.6
        },
        {
          "timestamp": "03/27",
          "value": 299.1
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 57.5
        },
        {
          "timestamp": "03/15",
          "value": 59.2
        },
        {
          "timestamp": "03/16",
          "value": 63.8
        },
        {
          "timestamp": "03/17",
          "value": 67.1
        },
        {
          "timestamp": "03/18",
          "value": 63.5
        },
        {
          "timestamp": "03/19",
          "value": 62
        },
        {
          "timestamp": "03/20",
          "value": 58
        },
        {
          "timestamp": "03/21",
          "value": 57.4
        },
        {
          "timestamp": "03/22",
          "value": 53.4
        },
        {
          "timestamp": "03/23",
          "value": 54.2
        },
        {
          "timestamp": "03/24",
          "value": 52.1
        },
        {
          "timestamp": "03/25",
          "value": 46.6
        },
        {
          "timestamp": "03/26",
          "value": 56.3
        },
        {
          "timestamp": "03/27",
          "value": 53.9
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 63.9
        },
        {
          "timestamp": "03/15",
          "value": 69.1
        },
        {
          "timestamp": "03/16",
          "value": 76.7
        },
        {
          "timestamp": "03/17",
          "value": 77.4
        },
        {
          "timestamp": "03/18",
          "value": 73.7
        },
        {
          "timestamp": "03/19",
          "value": 75.1
        },
        {
          "timestamp": "03/20",
          "value": 63.9
        },
        {
          "timestamp": "03/21",
          "value": 65.6
        },
        {
          "timestamp": "03/22",
          "value": 62.9
        },
        {
          "timestamp": "03/23",
          "value": 56.7
        },
        {
          "timestamp": "03/24",
          "value": 61.4
        },
        {
          "timestamp": "03/25",
          "value": 62.9
        },
        {
          "timestamp": "03/26",
          "value": 68.7
        },
        {
          "timestamp": "03/27",
          "value": 69.2
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu055",
    "label": "GPU-055",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 46,
      "memUsage": 46,
      "temp": 64,
      "power": 424,
      "cpuUsage": 48,
      "cpuMemUsage": 45
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 49.1
        },
        {
          "timestamp": "03/15",
          "value": 45.8
        },
        {
          "timestamp": "03/16",
          "value": 48.1
        },
        {
          "timestamp": "03/17",
          "value": 50.3
        },
        {
          "timestamp": "03/18",
          "value": 46.7
        },
        {
          "timestamp": "03/19",
          "value": 49.6
        },
        {
          "timestamp": "03/20",
          "value": 46.5
        },
        {
          "timestamp": "03/21",
          "value": 41.6
        },
        {
          "timestamp": "03/22",
          "value": 38.8
        },
        {
          "timestamp": "03/23",
          "value": 40.1
        },
        {
          "timestamp": "03/24",
          "value": 38.4
        },
        {
          "timestamp": "03/25",
          "value": 39.5
        },
        {
          "timestamp": "03/26",
          "value": 46.1
        },
        {
          "timestamp": "03/27",
          "value": 50
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 47.8
        },
        {
          "timestamp": "03/15",
          "value": 45.7
        },
        {
          "timestamp": "03/16",
          "value": 47.2
        },
        {
          "timestamp": "03/17",
          "value": 50.7
        },
        {
          "timestamp": "03/18",
          "value": 48.6
        },
        {
          "timestamp": "03/19",
          "value": 48.5
        },
        {
          "timestamp": "03/20",
          "value": 44.4
        },
        {
          "timestamp": "03/21",
          "value": 45.6
        },
        {
          "timestamp": "03/22",
          "value": 41.4
        },
        {
          "timestamp": "03/23",
          "value": 42.4
        },
        {
          "timestamp": "03/24",
          "value": 44.4
        },
        {
          "timestamp": "03/25",
          "value": 43.7
        },
        {
          "timestamp": "03/26",
          "value": 45.9
        },
        {
          "timestamp": "03/27",
          "value": 50.3
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 63.2
        },
        {
          "timestamp": "03/15",
          "value": 69.3
        },
        {
          "timestamp": "03/16",
          "value": 68.6
        },
        {
          "timestamp": "03/17",
          "value": 70
        },
        {
          "timestamp": "03/18",
          "value": 69.7
        },
        {
          "timestamp": "03/19",
          "value": 66.4
        },
        {
          "timestamp": "03/20",
          "value": 65.5
        },
        {
          "timestamp": "03/21",
          "value": 63.4
        },
        {
          "timestamp": "03/22",
          "value": 57.1
        },
        {
          "timestamp": "03/23",
          "value": 60.2
        },
        {
          "timestamp": "03/24",
          "value": 56.9
        },
        {
          "timestamp": "03/25",
          "value": 58
        },
        {
          "timestamp": "03/26",
          "value": 62.6
        },
        {
          "timestamp": "03/27",
          "value": 65.4
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 401.9
        },
        {
          "timestamp": "03/15",
          "value": 446.7
        },
        {
          "timestamp": "03/16",
          "value": 450.5
        },
        {
          "timestamp": "03/17",
          "value": 450.4
        },
        {
          "timestamp": "03/18",
          "value": 469.3
        },
        {
          "timestamp": "03/19",
          "value": 456.5
        },
        {
          "timestamp": "03/20",
          "value": 423.7
        },
        {
          "timestamp": "03/21",
          "value": 409.5
        },
        {
          "timestamp": "03/22",
          "value": 391.4
        },
        {
          "timestamp": "03/23",
          "value": 381.2
        },
        {
          "timestamp": "03/24",
          "value": 405.7
        },
        {
          "timestamp": "03/25",
          "value": 376.6
        },
        {
          "timestamp": "03/26",
          "value": 416.7
        },
        {
          "timestamp": "03/27",
          "value": 447.1
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 49.5
        },
        {
          "timestamp": "03/15",
          "value": 51.5
        },
        {
          "timestamp": "03/16",
          "value": 48.6
        },
        {
          "timestamp": "03/17",
          "value": 52.6
        },
        {
          "timestamp": "03/18",
          "value": 56
        },
        {
          "timestamp": "03/19",
          "value": 49.5
        },
        {
          "timestamp": "03/20",
          "value": 52.6
        },
        {
          "timestamp": "03/21",
          "value": 46.8
        },
        {
          "timestamp": "03/22",
          "value": 41.5
        },
        {
          "timestamp": "03/23",
          "value": 44.3
        },
        {
          "timestamp": "03/24",
          "value": 45.1
        },
        {
          "timestamp": "03/25",
          "value": 49.2
        },
        {
          "timestamp": "03/26",
          "value": 49.8
        },
        {
          "timestamp": "03/27",
          "value": 46.8
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 44.5
        },
        {
          "timestamp": "03/15",
          "value": 46
        },
        {
          "timestamp": "03/16",
          "value": 49.5
        },
        {
          "timestamp": "03/17",
          "value": 51.7
        },
        {
          "timestamp": "03/18",
          "value": 46.4
        },
        {
          "timestamp": "03/19",
          "value": 45.2
        },
        {
          "timestamp": "03/20",
          "value": 47.2
        },
        {
          "timestamp": "03/21",
          "value": 42.7
        },
        {
          "timestamp": "03/22",
          "value": 44.2
        },
        {
          "timestamp": "03/23",
          "value": 42.1
        },
        {
          "timestamp": "03/24",
          "value": 42.2
        },
        {
          "timestamp": "03/25",
          "value": 43.8
        },
        {
          "timestamp": "03/26",
          "value": 41.6
        },
        {
          "timestamp": "03/27",
          "value": 43.7
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu056",
    "label": "GPU-056",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 73,
      "memUsage": 59,
      "temp": 68,
      "power": 300,
      "cpuUsage": 72,
      "cpuMemUsage": 57
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 69.2
        },
        {
          "timestamp": "03/15",
          "value": 82.6
        },
        {
          "timestamp": "03/16",
          "value": 76
        },
        {
          "timestamp": "03/17",
          "value": 76.4
        },
        {
          "timestamp": "03/18",
          "value": 78.9
        },
        {
          "timestamp": "03/19",
          "value": 81.5
        },
        {
          "timestamp": "03/20",
          "value": 68.7
        },
        {
          "timestamp": "03/21",
          "value": 64.7
        },
        {
          "timestamp": "03/22",
          "value": 61.8
        },
        {
          "timestamp": "03/23",
          "value": 67.7
        },
        {
          "timestamp": "03/24",
          "value": 65.1
        },
        {
          "timestamp": "03/25",
          "value": 64.5
        },
        {
          "timestamp": "03/26",
          "value": 71.3
        },
        {
          "timestamp": "03/27",
          "value": 70.9
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 59.9
        },
        {
          "timestamp": "03/15",
          "value": 61.9
        },
        {
          "timestamp": "03/16",
          "value": 60.5
        },
        {
          "timestamp": "03/17",
          "value": 67.1
        },
        {
          "timestamp": "03/18",
          "value": 62.1
        },
        {
          "timestamp": "03/19",
          "value": 62
        },
        {
          "timestamp": "03/20",
          "value": 55.9
        },
        {
          "timestamp": "03/21",
          "value": 55.1
        },
        {
          "timestamp": "03/22",
          "value": 51.6
        },
        {
          "timestamp": "03/23",
          "value": 50
        },
        {
          "timestamp": "03/24",
          "value": 51.1
        },
        {
          "timestamp": "03/25",
          "value": 51.5
        },
        {
          "timestamp": "03/26",
          "value": 58.2
        },
        {
          "timestamp": "03/27",
          "value": 56.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 70.4
        },
        {
          "timestamp": "03/15",
          "value": 70.1
        },
        {
          "timestamp": "03/16",
          "value": 72.3
        },
        {
          "timestamp": "03/17",
          "value": 76.7
        },
        {
          "timestamp": "03/18",
          "value": 73.2
        },
        {
          "timestamp": "03/19",
          "value": 74.6
        },
        {
          "timestamp": "03/20",
          "value": 69
        },
        {
          "timestamp": "03/21",
          "value": 65.5
        },
        {
          "timestamp": "03/22",
          "value": 61
        },
        {
          "timestamp": "03/23",
          "value": 62.9
        },
        {
          "timestamp": "03/24",
          "value": 62.4
        },
        {
          "timestamp": "03/25",
          "value": 65.3
        },
        {
          "timestamp": "03/26",
          "value": 64.8
        },
        {
          "timestamp": "03/27",
          "value": 67.1
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 315.1
        },
        {
          "timestamp": "03/15",
          "value": 311.4
        },
        {
          "timestamp": "03/16",
          "value": 338.7
        },
        {
          "timestamp": "03/17",
          "value": 329.6
        },
        {
          "timestamp": "03/18",
          "value": 316.7
        },
        {
          "timestamp": "03/19",
          "value": 315.8
        },
        {
          "timestamp": "03/20",
          "value": 313.6
        },
        {
          "timestamp": "03/21",
          "value": 294
        },
        {
          "timestamp": "03/22",
          "value": 260
        },
        {
          "timestamp": "03/23",
          "value": 262.1
        },
        {
          "timestamp": "03/24",
          "value": 260.2
        },
        {
          "timestamp": "03/25",
          "value": 272.6
        },
        {
          "timestamp": "03/26",
          "value": 277.1
        },
        {
          "timestamp": "03/27",
          "value": 292.7
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 68.5
        },
        {
          "timestamp": "03/15",
          "value": 76.9
        },
        {
          "timestamp": "03/16",
          "value": 76.4
        },
        {
          "timestamp": "03/17",
          "value": 79.3
        },
        {
          "timestamp": "03/18",
          "value": 75.2
        },
        {
          "timestamp": "03/19",
          "value": 79.5
        },
        {
          "timestamp": "03/20",
          "value": 71.5
        },
        {
          "timestamp": "03/21",
          "value": 70.1
        },
        {
          "timestamp": "03/22",
          "value": 65.9
        },
        {
          "timestamp": "03/23",
          "value": 67.8
        },
        {
          "timestamp": "03/24",
          "value": 66.5
        },
        {
          "timestamp": "03/25",
          "value": 67.9
        },
        {
          "timestamp": "03/26",
          "value": 72.2
        },
        {
          "timestamp": "03/27",
          "value": 77.1
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 60.5
        },
        {
          "timestamp": "03/15",
          "value": 61.3
        },
        {
          "timestamp": "03/16",
          "value": 65.4
        },
        {
          "timestamp": "03/17",
          "value": 59.6
        },
        {
          "timestamp": "03/18",
          "value": 63.3
        },
        {
          "timestamp": "03/19",
          "value": 57.9
        },
        {
          "timestamp": "03/20",
          "value": 60.2
        },
        {
          "timestamp": "03/21",
          "value": 58.8
        },
        {
          "timestamp": "03/22",
          "value": 54.5
        },
        {
          "timestamp": "03/23",
          "value": 47.5
        },
        {
          "timestamp": "03/24",
          "value": 53.8
        },
        {
          "timestamp": "03/25",
          "value": 56.5
        },
        {
          "timestamp": "03/26",
          "value": 59.3
        },
        {
          "timestamp": "03/27",
          "value": 55.9
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu057",
    "label": "GPU-057",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 60,
      "memUsage": 65,
      "temp": 74,
      "power": 687,
      "cpuUsage": 50,
      "cpuMemUsage": 49
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 54.8
        },
        {
          "timestamp": "03/15",
          "value": 65.6
        },
        {
          "timestamp": "03/16",
          "value": 69.1
        },
        {
          "timestamp": "03/17",
          "value": 70.2
        },
        {
          "timestamp": "03/18",
          "value": 67.7
        },
        {
          "timestamp": "03/19",
          "value": 59
        },
        {
          "timestamp": "03/20",
          "value": 65.1
        },
        {
          "timestamp": "03/21",
          "value": 60.4
        },
        {
          "timestamp": "03/22",
          "value": 55.9
        },
        {
          "timestamp": "03/23",
          "value": 58.7
        },
        {
          "timestamp": "03/24",
          "value": 57.7
        },
        {
          "timestamp": "03/25",
          "value": 57.4
        },
        {
          "timestamp": "03/26",
          "value": 59.9
        },
        {
          "timestamp": "03/27",
          "value": 57.5
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 63.4
        },
        {
          "timestamp": "03/15",
          "value": 66.1
        },
        {
          "timestamp": "03/16",
          "value": 70.2
        },
        {
          "timestamp": "03/17",
          "value": 74.2
        },
        {
          "timestamp": "03/18",
          "value": 69.9
        },
        {
          "timestamp": "03/19",
          "value": 65.7
        },
        {
          "timestamp": "03/20",
          "value": 64.4
        },
        {
          "timestamp": "03/21",
          "value": 65.6
        },
        {
          "timestamp": "03/22",
          "value": 63.9
        },
        {
          "timestamp": "03/23",
          "value": 60.6
        },
        {
          "timestamp": "03/24",
          "value": 58.8
        },
        {
          "timestamp": "03/25",
          "value": 56
        },
        {
          "timestamp": "03/26",
          "value": 65.5
        },
        {
          "timestamp": "03/27",
          "value": 63.5
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 74.3
        },
        {
          "timestamp": "03/15",
          "value": 80
        },
        {
          "timestamp": "03/16",
          "value": 78.2
        },
        {
          "timestamp": "03/17",
          "value": 83.7
        },
        {
          "timestamp": "03/18",
          "value": 80
        },
        {
          "timestamp": "03/19",
          "value": 76.5
        },
        {
          "timestamp": "03/20",
          "value": 78
        },
        {
          "timestamp": "03/21",
          "value": 71.9
        },
        {
          "timestamp": "03/22",
          "value": 67.3
        },
        {
          "timestamp": "03/23",
          "value": 65.2
        },
        {
          "timestamp": "03/24",
          "value": 64.3
        },
        {
          "timestamp": "03/25",
          "value": 66.7
        },
        {
          "timestamp": "03/26",
          "value": 70.7
        },
        {
          "timestamp": "03/27",
          "value": 77.4
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 721.3
        },
        {
          "timestamp": "03/15",
          "value": 721.2
        },
        {
          "timestamp": "03/16",
          "value": 754.6
        },
        {
          "timestamp": "03/17",
          "value": 785.3
        },
        {
          "timestamp": "03/18",
          "value": 716.1
        },
        {
          "timestamp": "03/19",
          "value": 759.3
        },
        {
          "timestamp": "03/20",
          "value": 663.4
        },
        {
          "timestamp": "03/21",
          "value": 659.7
        },
        {
          "timestamp": "03/22",
          "value": 661.9
        },
        {
          "timestamp": "03/23",
          "value": 618.9
        },
        {
          "timestamp": "03/24",
          "value": 623.3
        },
        {
          "timestamp": "03/25",
          "value": 658
        },
        {
          "timestamp": "03/26",
          "value": 627.2
        },
        {
          "timestamp": "03/27",
          "value": 715
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 54.4
        },
        {
          "timestamp": "03/15",
          "value": 48.1
        },
        {
          "timestamp": "03/16",
          "value": 54.2
        },
        {
          "timestamp": "03/17",
          "value": 55
        },
        {
          "timestamp": "03/18",
          "value": 53.9
        },
        {
          "timestamp": "03/19",
          "value": 55.6
        },
        {
          "timestamp": "03/20",
          "value": 51.3
        },
        {
          "timestamp": "03/21",
          "value": 48
        },
        {
          "timestamp": "03/22",
          "value": 48.2
        },
        {
          "timestamp": "03/23",
          "value": 46.7
        },
        {
          "timestamp": "03/24",
          "value": 41.9
        },
        {
          "timestamp": "03/25",
          "value": 42.4
        },
        {
          "timestamp": "03/26",
          "value": 46.5
        },
        {
          "timestamp": "03/27",
          "value": 49.5
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 52.3
        },
        {
          "timestamp": "03/15",
          "value": 54.1
        },
        {
          "timestamp": "03/16",
          "value": 51.7
        },
        {
          "timestamp": "03/17",
          "value": 53.1
        },
        {
          "timestamp": "03/18",
          "value": 53.6
        },
        {
          "timestamp": "03/19",
          "value": 48.7
        },
        {
          "timestamp": "03/20",
          "value": 46.8
        },
        {
          "timestamp": "03/21",
          "value": 50.2
        },
        {
          "timestamp": "03/22",
          "value": 45.5
        },
        {
          "timestamp": "03/23",
          "value": 43.2
        },
        {
          "timestamp": "03/24",
          "value": 47.6
        },
        {
          "timestamp": "03/25",
          "value": 47.7
        },
        {
          "timestamp": "03/26",
          "value": 50.6
        },
        {
          "timestamp": "03/27",
          "value": 52.4
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu058",
    "label": "GPU-058",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 38,
      "memUsage": 51,
      "temp": 64,
      "power": 426,
      "cpuUsage": 63,
      "cpuMemUsage": 41
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 38
        },
        {
          "timestamp": "03/15",
          "value": 38.5
        },
        {
          "timestamp": "03/16",
          "value": 40.8
        },
        {
          "timestamp": "03/17",
          "value": 41.2
        },
        {
          "timestamp": "03/18",
          "value": 44.5
        },
        {
          "timestamp": "03/19",
          "value": 40.1
        },
        {
          "timestamp": "03/20",
          "value": 40.9
        },
        {
          "timestamp": "03/21",
          "value": 38.9
        },
        {
          "timestamp": "03/22",
          "value": 37.1
        },
        {
          "timestamp": "03/23",
          "value": 33
        },
        {
          "timestamp": "03/24",
          "value": 32.4
        },
        {
          "timestamp": "03/25",
          "value": 34.3
        },
        {
          "timestamp": "03/26",
          "value": 38.2
        },
        {
          "timestamp": "03/27",
          "value": 38.9
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 48.7
        },
        {
          "timestamp": "03/15",
          "value": 49.9
        },
        {
          "timestamp": "03/16",
          "value": 52.2
        },
        {
          "timestamp": "03/17",
          "value": 55.2
        },
        {
          "timestamp": "03/18",
          "value": 58.7
        },
        {
          "timestamp": "03/19",
          "value": 55.8
        },
        {
          "timestamp": "03/20",
          "value": 48.7
        },
        {
          "timestamp": "03/21",
          "value": 50.6
        },
        {
          "timestamp": "03/22",
          "value": 46.2
        },
        {
          "timestamp": "03/23",
          "value": 44.7
        },
        {
          "timestamp": "03/24",
          "value": 43.8
        },
        {
          "timestamp": "03/25",
          "value": 47.1
        },
        {
          "timestamp": "03/26",
          "value": 52.7
        },
        {
          "timestamp": "03/27",
          "value": 50.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 63.1
        },
        {
          "timestamp": "03/15",
          "value": 66.7
        },
        {
          "timestamp": "03/16",
          "value": 68
        },
        {
          "timestamp": "03/17",
          "value": 71
        },
        {
          "timestamp": "03/18",
          "value": 67.7
        },
        {
          "timestamp": "03/19",
          "value": 66.8
        },
        {
          "timestamp": "03/20",
          "value": 64.3
        },
        {
          "timestamp": "03/21",
          "value": 62.7
        },
        {
          "timestamp": "03/22",
          "value": 61.5
        },
        {
          "timestamp": "03/23",
          "value": 58.4
        },
        {
          "timestamp": "03/24",
          "value": 56.5
        },
        {
          "timestamp": "03/25",
          "value": 61.2
        },
        {
          "timestamp": "03/26",
          "value": 63.1
        },
        {
          "timestamp": "03/27",
          "value": 64.1
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 445
        },
        {
          "timestamp": "03/15",
          "value": 450.3
        },
        {
          "timestamp": "03/16",
          "value": 476.4
        },
        {
          "timestamp": "03/17",
          "value": 473.8
        },
        {
          "timestamp": "03/18",
          "value": 464.2
        },
        {
          "timestamp": "03/19",
          "value": 453.7
        },
        {
          "timestamp": "03/20",
          "value": 413
        },
        {
          "timestamp": "03/21",
          "value": 390.2
        },
        {
          "timestamp": "03/22",
          "value": 396.3
        },
        {
          "timestamp": "03/23",
          "value": 402.5
        },
        {
          "timestamp": "03/24",
          "value": 361.1
        },
        {
          "timestamp": "03/25",
          "value": 400.1
        },
        {
          "timestamp": "03/26",
          "value": 403.2
        },
        {
          "timestamp": "03/27",
          "value": 455
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 58.3
        },
        {
          "timestamp": "03/15",
          "value": 71.8
        },
        {
          "timestamp": "03/16",
          "value": 68.5
        },
        {
          "timestamp": "03/17",
          "value": 64
        },
        {
          "timestamp": "03/18",
          "value": 66.2
        },
        {
          "timestamp": "03/19",
          "value": 70.9
        },
        {
          "timestamp": "03/20",
          "value": 63.6
        },
        {
          "timestamp": "03/21",
          "value": 67.1
        },
        {
          "timestamp": "03/22",
          "value": 54.6
        },
        {
          "timestamp": "03/23",
          "value": 53.3
        },
        {
          "timestamp": "03/24",
          "value": 61.4
        },
        {
          "timestamp": "03/25",
          "value": 54.6
        },
        {
          "timestamp": "03/26",
          "value": 65.7
        },
        {
          "timestamp": "03/27",
          "value": 58.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 41.5
        },
        {
          "timestamp": "03/15",
          "value": 45.7
        },
        {
          "timestamp": "03/16",
          "value": 41.9
        },
        {
          "timestamp": "03/17",
          "value": 44.6
        },
        {
          "timestamp": "03/18",
          "value": 46.4
        },
        {
          "timestamp": "03/19",
          "value": 44.2
        },
        {
          "timestamp": "03/20",
          "value": 44.3
        },
        {
          "timestamp": "03/21",
          "value": 37.8
        },
        {
          "timestamp": "03/22",
          "value": 40
        },
        {
          "timestamp": "03/23",
          "value": 39.3
        },
        {
          "timestamp": "03/24",
          "value": 39.1
        },
        {
          "timestamp": "03/25",
          "value": 35.9
        },
        {
          "timestamp": "03/26",
          "value": 37.4
        },
        {
          "timestamp": "03/27",
          "value": 42.7
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu059",
    "label": "GPU-059",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 76,
      "memUsage": 71,
      "temp": 73,
      "power": 559,
      "cpuUsage": 27,
      "cpuMemUsage": 49
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 71.1
        },
        {
          "timestamp": "03/15",
          "value": 85.6
        },
        {
          "timestamp": "03/16",
          "value": 86.6
        },
        {
          "timestamp": "03/17",
          "value": 90.2
        },
        {
          "timestamp": "03/18",
          "value": 77.7
        },
        {
          "timestamp": "03/19",
          "value": 83
        },
        {
          "timestamp": "03/20",
          "value": 70.7
        },
        {
          "timestamp": "03/21",
          "value": 70.1
        },
        {
          "timestamp": "03/22",
          "value": 71
        },
        {
          "timestamp": "03/23",
          "value": 67.6
        },
        {
          "timestamp": "03/24",
          "value": 73.5
        },
        {
          "timestamp": "03/25",
          "value": 65
        },
        {
          "timestamp": "03/26",
          "value": 71.1
        },
        {
          "timestamp": "03/27",
          "value": 74.3
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 72.9
        },
        {
          "timestamp": "03/15",
          "value": 72.6
        },
        {
          "timestamp": "03/16",
          "value": 79.6
        },
        {
          "timestamp": "03/17",
          "value": 73.2
        },
        {
          "timestamp": "03/18",
          "value": 80.5
        },
        {
          "timestamp": "03/19",
          "value": 79.4
        },
        {
          "timestamp": "03/20",
          "value": 75.2
        },
        {
          "timestamp": "03/21",
          "value": 71
        },
        {
          "timestamp": "03/22",
          "value": 68.9
        },
        {
          "timestamp": "03/23",
          "value": 64
        },
        {
          "timestamp": "03/24",
          "value": 66.9
        },
        {
          "timestamp": "03/25",
          "value": 64.8
        },
        {
          "timestamp": "03/26",
          "value": 73.2
        },
        {
          "timestamp": "03/27",
          "value": 70.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 73.2
        },
        {
          "timestamp": "03/15",
          "value": 76.7
        },
        {
          "timestamp": "03/16",
          "value": 78.2
        },
        {
          "timestamp": "03/17",
          "value": 78.4
        },
        {
          "timestamp": "03/18",
          "value": 82.5
        },
        {
          "timestamp": "03/19",
          "value": 75.8
        },
        {
          "timestamp": "03/20",
          "value": 73.9
        },
        {
          "timestamp": "03/21",
          "value": 71.6
        },
        {
          "timestamp": "03/22",
          "value": 69.9
        },
        {
          "timestamp": "03/23",
          "value": 67.2
        },
        {
          "timestamp": "03/24",
          "value": 63.3
        },
        {
          "timestamp": "03/25",
          "value": 65.1
        },
        {
          "timestamp": "03/26",
          "value": 69.3
        },
        {
          "timestamp": "03/27",
          "value": 75.4
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 548.6
        },
        {
          "timestamp": "03/15",
          "value": 618.6
        },
        {
          "timestamp": "03/16",
          "value": 628.5
        },
        {
          "timestamp": "03/17",
          "value": 597
        },
        {
          "timestamp": "03/18",
          "value": 640.3
        },
        {
          "timestamp": "03/19",
          "value": 570
        },
        {
          "timestamp": "03/20",
          "value": 579.1
        },
        {
          "timestamp": "03/21",
          "value": 520.5
        },
        {
          "timestamp": "03/22",
          "value": 483.9
        },
        {
          "timestamp": "03/23",
          "value": 504.4
        },
        {
          "timestamp": "03/24",
          "value": 526.1
        },
        {
          "timestamp": "03/25",
          "value": 525.2
        },
        {
          "timestamp": "03/26",
          "value": 522.8
        },
        {
          "timestamp": "03/27",
          "value": 564.5
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 29.4
        },
        {
          "timestamp": "03/15",
          "value": 29.8
        },
        {
          "timestamp": "03/16",
          "value": 29.3
        },
        {
          "timestamp": "03/17",
          "value": 31.3
        },
        {
          "timestamp": "03/18",
          "value": 27.9
        },
        {
          "timestamp": "03/19",
          "value": 29.2
        },
        {
          "timestamp": "03/20",
          "value": 27.8
        },
        {
          "timestamp": "03/21",
          "value": 26.5
        },
        {
          "timestamp": "03/22",
          "value": 25.2
        },
        {
          "timestamp": "03/23",
          "value": 22.4
        },
        {
          "timestamp": "03/24",
          "value": 22.1
        },
        {
          "timestamp": "03/25",
          "value": 25.8
        },
        {
          "timestamp": "03/26",
          "value": 24
        },
        {
          "timestamp": "03/27",
          "value": 27
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 50.7
        },
        {
          "timestamp": "03/15",
          "value": 54
        },
        {
          "timestamp": "03/16",
          "value": 53.6
        },
        {
          "timestamp": "03/17",
          "value": 53.2
        },
        {
          "timestamp": "03/18",
          "value": 52.9
        },
        {
          "timestamp": "03/19",
          "value": 52
        },
        {
          "timestamp": "03/20",
          "value": 50.9
        },
        {
          "timestamp": "03/21",
          "value": 46.4
        },
        {
          "timestamp": "03/22",
          "value": 44.3
        },
        {
          "timestamp": "03/23",
          "value": 43.5
        },
        {
          "timestamp": "03/24",
          "value": 42.1
        },
        {
          "timestamp": "03/25",
          "value": 47.5
        },
        {
          "timestamp": "03/26",
          "value": 48.5
        },
        {
          "timestamp": "03/27",
          "value": 47.3
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu060",
    "label": "GPU-060",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 54,
      "memUsage": 76,
      "temp": 57,
      "power": 352,
      "cpuUsage": 50,
      "cpuMemUsage": 42
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 57.9
        },
        {
          "timestamp": "03/15",
          "value": 58.7
        },
        {
          "timestamp": "03/16",
          "value": 55.1
        },
        {
          "timestamp": "03/17",
          "value": 55.1
        },
        {
          "timestamp": "03/18",
          "value": 54.5
        },
        {
          "timestamp": "03/19",
          "value": 58.1
        },
        {
          "timestamp": "03/20",
          "value": 57.8
        },
        {
          "timestamp": "03/21",
          "value": 48.5
        },
        {
          "timestamp": "03/22",
          "value": 49.5
        },
        {
          "timestamp": "03/23",
          "value": 49
        },
        {
          "timestamp": "03/24",
          "value": 45.5
        },
        {
          "timestamp": "03/25",
          "value": 48.1
        },
        {
          "timestamp": "03/26",
          "value": 57.1
        },
        {
          "timestamp": "03/27",
          "value": 52.1
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 71.9
        },
        {
          "timestamp": "03/15",
          "value": 80.6
        },
        {
          "timestamp": "03/16",
          "value": 83.6
        },
        {
          "timestamp": "03/17",
          "value": 87.5
        },
        {
          "timestamp": "03/18",
          "value": 78.1
        },
        {
          "timestamp": "03/19",
          "value": 85.2
        },
        {
          "timestamp": "03/20",
          "value": 73.6
        },
        {
          "timestamp": "03/21",
          "value": 72.3
        },
        {
          "timestamp": "03/22",
          "value": 68
        },
        {
          "timestamp": "03/23",
          "value": 64.1
        },
        {
          "timestamp": "03/24",
          "value": 70.3
        },
        {
          "timestamp": "03/25",
          "value": 66.4
        },
        {
          "timestamp": "03/26",
          "value": 72
        },
        {
          "timestamp": "03/27",
          "value": 80.8
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 57.2
        },
        {
          "timestamp": "03/15",
          "value": 58.6
        },
        {
          "timestamp": "03/16",
          "value": 63.3
        },
        {
          "timestamp": "03/17",
          "value": 61.7
        },
        {
          "timestamp": "03/18",
          "value": 62.1
        },
        {
          "timestamp": "03/19",
          "value": 58.5
        },
        {
          "timestamp": "03/20",
          "value": 59.8
        },
        {
          "timestamp": "03/21",
          "value": 54.2
        },
        {
          "timestamp": "03/22",
          "value": 52
        },
        {
          "timestamp": "03/23",
          "value": 51.5
        },
        {
          "timestamp": "03/24",
          "value": 49.9
        },
        {
          "timestamp": "03/25",
          "value": 51.6
        },
        {
          "timestamp": "03/26",
          "value": 53.4
        },
        {
          "timestamp": "03/27",
          "value": 57.1
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 364.6
        },
        {
          "timestamp": "03/15",
          "value": 382.4
        },
        {
          "timestamp": "03/16",
          "value": 371.5
        },
        {
          "timestamp": "03/17",
          "value": 367.3
        },
        {
          "timestamp": "03/18",
          "value": 380.7
        },
        {
          "timestamp": "03/19",
          "value": 364.2
        },
        {
          "timestamp": "03/20",
          "value": 359.8
        },
        {
          "timestamp": "03/21",
          "value": 360.1
        },
        {
          "timestamp": "03/22",
          "value": 324
        },
        {
          "timestamp": "03/23",
          "value": 322.5
        },
        {
          "timestamp": "03/24",
          "value": 325.6
        },
        {
          "timestamp": "03/25",
          "value": 347.4
        },
        {
          "timestamp": "03/26",
          "value": 341.7
        },
        {
          "timestamp": "03/27",
          "value": 375.6
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 47
        },
        {
          "timestamp": "03/15",
          "value": 55.3
        },
        {
          "timestamp": "03/16",
          "value": 55.1
        },
        {
          "timestamp": "03/17",
          "value": 52.1
        },
        {
          "timestamp": "03/18",
          "value": 50
        },
        {
          "timestamp": "03/19",
          "value": 57.6
        },
        {
          "timestamp": "03/20",
          "value": 51.8
        },
        {
          "timestamp": "03/21",
          "value": 43.3
        },
        {
          "timestamp": "03/22",
          "value": 42.1
        },
        {
          "timestamp": "03/23",
          "value": 47.3
        },
        {
          "timestamp": "03/24",
          "value": 45.3
        },
        {
          "timestamp": "03/25",
          "value": 48.6
        },
        {
          "timestamp": "03/26",
          "value": 47.2
        },
        {
          "timestamp": "03/27",
          "value": 49.3
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 40.5
        },
        {
          "timestamp": "03/15",
          "value": 45.1
        },
        {
          "timestamp": "03/16",
          "value": 47.3
        },
        {
          "timestamp": "03/17",
          "value": 43.3
        },
        {
          "timestamp": "03/18",
          "value": 44.6
        },
        {
          "timestamp": "03/19",
          "value": 41.6
        },
        {
          "timestamp": "03/20",
          "value": 42.1
        },
        {
          "timestamp": "03/21",
          "value": 39.2
        },
        {
          "timestamp": "03/22",
          "value": 37.2
        },
        {
          "timestamp": "03/23",
          "value": 38.8
        },
        {
          "timestamp": "03/24",
          "value": 36.4
        },
        {
          "timestamp": "03/25",
          "value": 38.4
        },
        {
          "timestamp": "03/26",
          "value": 40.9
        },
        {
          "timestamp": "03/27",
          "value": 41.5
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu061",
    "label": "GPU-061",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 57,
      "memUsage": 47,
      "temp": 62,
      "power": 357,
      "cpuUsage": 58,
      "cpuMemUsage": 72
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 60.6
        },
        {
          "timestamp": "03/15",
          "value": 62.8
        },
        {
          "timestamp": "03/16",
          "value": 62
        },
        {
          "timestamp": "03/17",
          "value": 66.4
        },
        {
          "timestamp": "03/18",
          "value": 62.1
        },
        {
          "timestamp": "03/19",
          "value": 64.7
        },
        {
          "timestamp": "03/20",
          "value": 59.9
        },
        {
          "timestamp": "03/21",
          "value": 56.7
        },
        {
          "timestamp": "03/22",
          "value": 50.9
        },
        {
          "timestamp": "03/23",
          "value": 49.5
        },
        {
          "timestamp": "03/24",
          "value": 55.7
        },
        {
          "timestamp": "03/25",
          "value": 56.7
        },
        {
          "timestamp": "03/26",
          "value": 59.4
        },
        {
          "timestamp": "03/27",
          "value": 57.5
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 43.6
        },
        {
          "timestamp": "03/15",
          "value": 52.2
        },
        {
          "timestamp": "03/16",
          "value": 47.6
        },
        {
          "timestamp": "03/17",
          "value": 50.2
        },
        {
          "timestamp": "03/18",
          "value": 51.9
        },
        {
          "timestamp": "03/19",
          "value": 47
        },
        {
          "timestamp": "03/20",
          "value": 50.1
        },
        {
          "timestamp": "03/21",
          "value": 44.2
        },
        {
          "timestamp": "03/22",
          "value": 42.1
        },
        {
          "timestamp": "03/23",
          "value": 45.6
        },
        {
          "timestamp": "03/24",
          "value": 43.8
        },
        {
          "timestamp": "03/25",
          "value": 41.8
        },
        {
          "timestamp": "03/26",
          "value": 44.4
        },
        {
          "timestamp": "03/27",
          "value": 46.2
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 61.9
        },
        {
          "timestamp": "03/15",
          "value": 66.1
        },
        {
          "timestamp": "03/16",
          "value": 65.4
        },
        {
          "timestamp": "03/17",
          "value": 66.9
        },
        {
          "timestamp": "03/18",
          "value": 68.2
        },
        {
          "timestamp": "03/19",
          "value": 64.3
        },
        {
          "timestamp": "03/20",
          "value": 64.7
        },
        {
          "timestamp": "03/21",
          "value": 61.2
        },
        {
          "timestamp": "03/22",
          "value": 57.5
        },
        {
          "timestamp": "03/23",
          "value": 57.1
        },
        {
          "timestamp": "03/24",
          "value": 54
        },
        {
          "timestamp": "03/25",
          "value": 57.2
        },
        {
          "timestamp": "03/26",
          "value": 60.7
        },
        {
          "timestamp": "03/27",
          "value": 63
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 352.2
        },
        {
          "timestamp": "03/15",
          "value": 361.6
        },
        {
          "timestamp": "03/16",
          "value": 401.8
        },
        {
          "timestamp": "03/17",
          "value": 398.3
        },
        {
          "timestamp": "03/18",
          "value": 374.8
        },
        {
          "timestamp": "03/19",
          "value": 377.8
        },
        {
          "timestamp": "03/20",
          "value": 353.6
        },
        {
          "timestamp": "03/21",
          "value": 326.1
        },
        {
          "timestamp": "03/22",
          "value": 333.3
        },
        {
          "timestamp": "03/23",
          "value": 328.6
        },
        {
          "timestamp": "03/24",
          "value": 336.4
        },
        {
          "timestamp": "03/25",
          "value": 352.9
        },
        {
          "timestamp": "03/26",
          "value": 366
        },
        {
          "timestamp": "03/27",
          "value": 364
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 61.9
        },
        {
          "timestamp": "03/15",
          "value": 59.2
        },
        {
          "timestamp": "03/16",
          "value": 57.4
        },
        {
          "timestamp": "03/17",
          "value": 65.7
        },
        {
          "timestamp": "03/18",
          "value": 64.4
        },
        {
          "timestamp": "03/19",
          "value": 60.6
        },
        {
          "timestamp": "03/20",
          "value": 55.1
        },
        {
          "timestamp": "03/21",
          "value": 60.6
        },
        {
          "timestamp": "03/22",
          "value": 52.4
        },
        {
          "timestamp": "03/23",
          "value": 47.8
        },
        {
          "timestamp": "03/24",
          "value": 50.7
        },
        {
          "timestamp": "03/25",
          "value": 52.8
        },
        {
          "timestamp": "03/26",
          "value": 60.8
        },
        {
          "timestamp": "03/27",
          "value": 62.6
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 76.4
        },
        {
          "timestamp": "03/15",
          "value": 71.7
        },
        {
          "timestamp": "03/16",
          "value": 75.2
        },
        {
          "timestamp": "03/17",
          "value": 78.1
        },
        {
          "timestamp": "03/18",
          "value": 75.9
        },
        {
          "timestamp": "03/19",
          "value": 71.4
        },
        {
          "timestamp": "03/20",
          "value": 76
        },
        {
          "timestamp": "03/21",
          "value": 72.1
        },
        {
          "timestamp": "03/22",
          "value": 69.3
        },
        {
          "timestamp": "03/23",
          "value": 62.1
        },
        {
          "timestamp": "03/24",
          "value": 62.5
        },
        {
          "timestamp": "03/25",
          "value": 62.6
        },
        {
          "timestamp": "03/26",
          "value": 73.2
        },
        {
          "timestamp": "03/27",
          "value": 76.7
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu062",
    "label": "GPU-062",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 74,
      "memUsage": 30,
      "temp": 65,
      "power": 458,
      "cpuUsage": 50,
      "cpuMemUsage": 56
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 78.4
        },
        {
          "timestamp": "03/15",
          "value": 79
        },
        {
          "timestamp": "03/16",
          "value": 78.2
        },
        {
          "timestamp": "03/17",
          "value": 78.9
        },
        {
          "timestamp": "03/18",
          "value": 81.7
        },
        {
          "timestamp": "03/19",
          "value": 83
        },
        {
          "timestamp": "03/20",
          "value": 80.7
        },
        {
          "timestamp": "03/21",
          "value": 68.6
        },
        {
          "timestamp": "03/22",
          "value": 68.1
        },
        {
          "timestamp": "03/23",
          "value": 61.8
        },
        {
          "timestamp": "03/24",
          "value": 65.4
        },
        {
          "timestamp": "03/25",
          "value": 66.2
        },
        {
          "timestamp": "03/26",
          "value": 69.8
        },
        {
          "timestamp": "03/27",
          "value": 80
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 29.7
        },
        {
          "timestamp": "03/15",
          "value": 32
        },
        {
          "timestamp": "03/16",
          "value": 31.7
        },
        {
          "timestamp": "03/17",
          "value": 34.4
        },
        {
          "timestamp": "03/18",
          "value": 30.7
        },
        {
          "timestamp": "03/19",
          "value": 30.6
        },
        {
          "timestamp": "03/20",
          "value": 30.2
        },
        {
          "timestamp": "03/21",
          "value": 29.3
        },
        {
          "timestamp": "03/22",
          "value": 25.6
        },
        {
          "timestamp": "03/23",
          "value": 28.3
        },
        {
          "timestamp": "03/24",
          "value": 28.7
        },
        {
          "timestamp": "03/25",
          "value": 28.5
        },
        {
          "timestamp": "03/26",
          "value": 26.9
        },
        {
          "timestamp": "03/27",
          "value": 28.6
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 67
        },
        {
          "timestamp": "03/15",
          "value": 69.9
        },
        {
          "timestamp": "03/16",
          "value": 72.2
        },
        {
          "timestamp": "03/17",
          "value": 69.7
        },
        {
          "timestamp": "03/18",
          "value": 69
        },
        {
          "timestamp": "03/19",
          "value": 71
        },
        {
          "timestamp": "03/20",
          "value": 65.7
        },
        {
          "timestamp": "03/21",
          "value": 62.8
        },
        {
          "timestamp": "03/22",
          "value": 62.4
        },
        {
          "timestamp": "03/23",
          "value": 59.3
        },
        {
          "timestamp": "03/24",
          "value": 58.9
        },
        {
          "timestamp": "03/25",
          "value": 60.5
        },
        {
          "timestamp": "03/26",
          "value": 60.7
        },
        {
          "timestamp": "03/27",
          "value": 65.6
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 442.1
        },
        {
          "timestamp": "03/15",
          "value": 496.2
        },
        {
          "timestamp": "03/16",
          "value": 499.1
        },
        {
          "timestamp": "03/17",
          "value": 503.7
        },
        {
          "timestamp": "03/18",
          "value": 494.3
        },
        {
          "timestamp": "03/19",
          "value": 503.6
        },
        {
          "timestamp": "03/20",
          "value": 474
        },
        {
          "timestamp": "03/21",
          "value": 431.4
        },
        {
          "timestamp": "03/22",
          "value": 402.1
        },
        {
          "timestamp": "03/23",
          "value": 436.9
        },
        {
          "timestamp": "03/24",
          "value": 438.2
        },
        {
          "timestamp": "03/25",
          "value": 444
        },
        {
          "timestamp": "03/26",
          "value": 461.6
        },
        {
          "timestamp": "03/27",
          "value": 494.2
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 46.1
        },
        {
          "timestamp": "03/15",
          "value": 53.4
        },
        {
          "timestamp": "03/16",
          "value": 59
        },
        {
          "timestamp": "03/17",
          "value": 56.6
        },
        {
          "timestamp": "03/18",
          "value": 55.4
        },
        {
          "timestamp": "03/19",
          "value": 48.8
        },
        {
          "timestamp": "03/20",
          "value": 47.5
        },
        {
          "timestamp": "03/21",
          "value": 45.8
        },
        {
          "timestamp": "03/22",
          "value": 50.9
        },
        {
          "timestamp": "03/23",
          "value": 48.5
        },
        {
          "timestamp": "03/24",
          "value": 49.1
        },
        {
          "timestamp": "03/25",
          "value": 44.1
        },
        {
          "timestamp": "03/26",
          "value": 51.4
        },
        {
          "timestamp": "03/27",
          "value": 52.5
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 56.3
        },
        {
          "timestamp": "03/15",
          "value": 62.5
        },
        {
          "timestamp": "03/16",
          "value": 63.5
        },
        {
          "timestamp": "03/17",
          "value": 59.5
        },
        {
          "timestamp": "03/18",
          "value": 59.4
        },
        {
          "timestamp": "03/19",
          "value": 62.7
        },
        {
          "timestamp": "03/20",
          "value": 53.2
        },
        {
          "timestamp": "03/21",
          "value": 51
        },
        {
          "timestamp": "03/22",
          "value": 54.6
        },
        {
          "timestamp": "03/23",
          "value": 52.6
        },
        {
          "timestamp": "03/24",
          "value": 51.3
        },
        {
          "timestamp": "03/25",
          "value": 53.5
        },
        {
          "timestamp": "03/26",
          "value": 54
        },
        {
          "timestamp": "03/27",
          "value": 55.5
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu063",
    "label": "GPU-063",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 54,
      "memUsage": 65,
      "temp": 72,
      "power": 325,
      "cpuUsage": 65,
      "cpuMemUsage": 36
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 55.1
        },
        {
          "timestamp": "03/15",
          "value": 56.5
        },
        {
          "timestamp": "03/16",
          "value": 55.3
        },
        {
          "timestamp": "03/17",
          "value": 54.6
        },
        {
          "timestamp": "03/18",
          "value": 55.1
        },
        {
          "timestamp": "03/19",
          "value": 61.4
        },
        {
          "timestamp": "03/20",
          "value": 56.2
        },
        {
          "timestamp": "03/21",
          "value": 52.5
        },
        {
          "timestamp": "03/22",
          "value": 51
        },
        {
          "timestamp": "03/23",
          "value": 50.4
        },
        {
          "timestamp": "03/24",
          "value": 51.7
        },
        {
          "timestamp": "03/25",
          "value": 53.6
        },
        {
          "timestamp": "03/26",
          "value": 56.3
        },
        {
          "timestamp": "03/27",
          "value": 58.3
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 65.9
        },
        {
          "timestamp": "03/15",
          "value": 66.7
        },
        {
          "timestamp": "03/16",
          "value": 70.4
        },
        {
          "timestamp": "03/17",
          "value": 72
        },
        {
          "timestamp": "03/18",
          "value": 74.5
        },
        {
          "timestamp": "03/19",
          "value": 71.1
        },
        {
          "timestamp": "03/20",
          "value": 69.4
        },
        {
          "timestamp": "03/21",
          "value": 60.3
        },
        {
          "timestamp": "03/22",
          "value": 62.2
        },
        {
          "timestamp": "03/23",
          "value": 59.9
        },
        {
          "timestamp": "03/24",
          "value": 58.5
        },
        {
          "timestamp": "03/25",
          "value": 56.3
        },
        {
          "timestamp": "03/26",
          "value": 63.4
        },
        {
          "timestamp": "03/27",
          "value": 64.4
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 71.9
        },
        {
          "timestamp": "03/15",
          "value": 76.4
        },
        {
          "timestamp": "03/16",
          "value": 77.4
        },
        {
          "timestamp": "03/17",
          "value": 78.3
        },
        {
          "timestamp": "03/18",
          "value": 75.8
        },
        {
          "timestamp": "03/19",
          "value": 78.1
        },
        {
          "timestamp": "03/20",
          "value": 71.2
        },
        {
          "timestamp": "03/21",
          "value": 70.8
        },
        {
          "timestamp": "03/22",
          "value": 65.9
        },
        {
          "timestamp": "03/23",
          "value": 67.6
        },
        {
          "timestamp": "03/24",
          "value": 64.6
        },
        {
          "timestamp": "03/25",
          "value": 68.4
        },
        {
          "timestamp": "03/26",
          "value": 67.8
        },
        {
          "timestamp": "03/27",
          "value": 75.5
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 320.2
        },
        {
          "timestamp": "03/15",
          "value": 338.9
        },
        {
          "timestamp": "03/16",
          "value": 355.4
        },
        {
          "timestamp": "03/17",
          "value": 340.2
        },
        {
          "timestamp": "03/18",
          "value": 353.9
        },
        {
          "timestamp": "03/19",
          "value": 333.4
        },
        {
          "timestamp": "03/20",
          "value": 336
        },
        {
          "timestamp": "03/21",
          "value": 312.8
        },
        {
          "timestamp": "03/22",
          "value": 308.2
        },
        {
          "timestamp": "03/23",
          "value": 300
        },
        {
          "timestamp": "03/24",
          "value": 301.6
        },
        {
          "timestamp": "03/25",
          "value": 292.1
        },
        {
          "timestamp": "03/26",
          "value": 319.9
        },
        {
          "timestamp": "03/27",
          "value": 345
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 58.7
        },
        {
          "timestamp": "03/15",
          "value": 62
        },
        {
          "timestamp": "03/16",
          "value": 75.6
        },
        {
          "timestamp": "03/17",
          "value": 75.1
        },
        {
          "timestamp": "03/18",
          "value": 66.7
        },
        {
          "timestamp": "03/19",
          "value": 71.9
        },
        {
          "timestamp": "03/20",
          "value": 62.6
        },
        {
          "timestamp": "03/21",
          "value": 64.6
        },
        {
          "timestamp": "03/22",
          "value": 55.2
        },
        {
          "timestamp": "03/23",
          "value": 58.2
        },
        {
          "timestamp": "03/24",
          "value": 64.3
        },
        {
          "timestamp": "03/25",
          "value": 66.4
        },
        {
          "timestamp": "03/26",
          "value": 64.9
        },
        {
          "timestamp": "03/27",
          "value": 64.9
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 34.7
        },
        {
          "timestamp": "03/15",
          "value": 39.9
        },
        {
          "timestamp": "03/16",
          "value": 36.7
        },
        {
          "timestamp": "03/17",
          "value": 39.2
        },
        {
          "timestamp": "03/18",
          "value": 39.5
        },
        {
          "timestamp": "03/19",
          "value": 36.6
        },
        {
          "timestamp": "03/20",
          "value": 34.1
        },
        {
          "timestamp": "03/21",
          "value": 32.8
        },
        {
          "timestamp": "03/22",
          "value": 35.1
        },
        {
          "timestamp": "03/23",
          "value": 31.9
        },
        {
          "timestamp": "03/24",
          "value": 32.5
        },
        {
          "timestamp": "03/25",
          "value": 31.3
        },
        {
          "timestamp": "03/26",
          "value": 34.9
        },
        {
          "timestamp": "03/27",
          "value": 35.5
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu064",
    "label": "GPU-064",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "err",
    "current": {
      "gpuUsage": 0,
      "memUsage": 0,
      "temp": 0,
      "power": 0,
      "cpuUsage": 0,
      "cpuMemUsage": 0
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu065",
    "label": "GPU-065",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 69,
      "memUsage": 45,
      "temp": 65,
      "power": 328,
      "cpuUsage": 50,
      "cpuMemUsage": 39
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 67.9
        },
        {
          "timestamp": "03/15",
          "value": 66.1
        },
        {
          "timestamp": "03/16",
          "value": 69.9
        },
        {
          "timestamp": "03/17",
          "value": 72.9
        },
        {
          "timestamp": "03/18",
          "value": 79.9
        },
        {
          "timestamp": "03/19",
          "value": 68.8
        },
        {
          "timestamp": "03/20",
          "value": 74.9
        },
        {
          "timestamp": "03/21",
          "value": 72.1
        },
        {
          "timestamp": "03/22",
          "value": 62.3
        },
        {
          "timestamp": "03/23",
          "value": 61.6
        },
        {
          "timestamp": "03/24",
          "value": 68.5
        },
        {
          "timestamp": "03/25",
          "value": 64
        },
        {
          "timestamp": "03/26",
          "value": 72.3
        },
        {
          "timestamp": "03/27",
          "value": 70.1
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 42.1
        },
        {
          "timestamp": "03/15",
          "value": 48.6
        },
        {
          "timestamp": "03/16",
          "value": 51.4
        },
        {
          "timestamp": "03/17",
          "value": 49.1
        },
        {
          "timestamp": "03/18",
          "value": 49.4
        },
        {
          "timestamp": "03/19",
          "value": 48.2
        },
        {
          "timestamp": "03/20",
          "value": 43.6
        },
        {
          "timestamp": "03/21",
          "value": 45.4
        },
        {
          "timestamp": "03/22",
          "value": 44.5
        },
        {
          "timestamp": "03/23",
          "value": 40.5
        },
        {
          "timestamp": "03/24",
          "value": 39.3
        },
        {
          "timestamp": "03/25",
          "value": 44.5
        },
        {
          "timestamp": "03/26",
          "value": 40.9
        },
        {
          "timestamp": "03/27",
          "value": 44.9
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 65.9
        },
        {
          "timestamp": "03/15",
          "value": 70.6
        },
        {
          "timestamp": "03/16",
          "value": 72.6
        },
        {
          "timestamp": "03/17",
          "value": 71
        },
        {
          "timestamp": "03/18",
          "value": 71
        },
        {
          "timestamp": "03/19",
          "value": 70
        },
        {
          "timestamp": "03/20",
          "value": 63.4
        },
        {
          "timestamp": "03/21",
          "value": 65.2
        },
        {
          "timestamp": "03/22",
          "value": 62.4
        },
        {
          "timestamp": "03/23",
          "value": 56.4
        },
        {
          "timestamp": "03/24",
          "value": 58.5
        },
        {
          "timestamp": "03/25",
          "value": 59.7
        },
        {
          "timestamp": "03/26",
          "value": 61.9
        },
        {
          "timestamp": "03/27",
          "value": 68
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 322.3
        },
        {
          "timestamp": "03/15",
          "value": 334
        },
        {
          "timestamp": "03/16",
          "value": 342.2
        },
        {
          "timestamp": "03/17",
          "value": 348.5
        },
        {
          "timestamp": "03/18",
          "value": 339.8
        },
        {
          "timestamp": "03/19",
          "value": 363.6
        },
        {
          "timestamp": "03/20",
          "value": 348.5
        },
        {
          "timestamp": "03/21",
          "value": 330.5
        },
        {
          "timestamp": "03/22",
          "value": 305.4
        },
        {
          "timestamp": "03/23",
          "value": 312.6
        },
        {
          "timestamp": "03/24",
          "value": 309.1
        },
        {
          "timestamp": "03/25",
          "value": 323.9
        },
        {
          "timestamp": "03/26",
          "value": 303.9
        },
        {
          "timestamp": "03/27",
          "value": 320
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 48.2
        },
        {
          "timestamp": "03/15",
          "value": 48.6
        },
        {
          "timestamp": "03/16",
          "value": 55
        },
        {
          "timestamp": "03/17",
          "value": 59.2
        },
        {
          "timestamp": "03/18",
          "value": 54.5
        },
        {
          "timestamp": "03/19",
          "value": 51.2
        },
        {
          "timestamp": "03/20",
          "value": 51.4
        },
        {
          "timestamp": "03/21",
          "value": 48.1
        },
        {
          "timestamp": "03/22",
          "value": 42.7
        },
        {
          "timestamp": "03/23",
          "value": 48.1
        },
        {
          "timestamp": "03/24",
          "value": 47.6
        },
        {
          "timestamp": "03/25",
          "value": 50.5
        },
        {
          "timestamp": "03/26",
          "value": 52.1
        },
        {
          "timestamp": "03/27",
          "value": 49.3
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 41.7
        },
        {
          "timestamp": "03/15",
          "value": 42.6
        },
        {
          "timestamp": "03/16",
          "value": 44.2
        },
        {
          "timestamp": "03/17",
          "value": 43.1
        },
        {
          "timestamp": "03/18",
          "value": 44.9
        },
        {
          "timestamp": "03/19",
          "value": 38.9
        },
        {
          "timestamp": "03/20",
          "value": 41.7
        },
        {
          "timestamp": "03/21",
          "value": 35.9
        },
        {
          "timestamp": "03/22",
          "value": 38
        },
        {
          "timestamp": "03/23",
          "value": 34.7
        },
        {
          "timestamp": "03/24",
          "value": 36.5
        },
        {
          "timestamp": "03/25",
          "value": 37.1
        },
        {
          "timestamp": "03/26",
          "value": 38.3
        },
        {
          "timestamp": "03/27",
          "value": 40.8
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu066",
    "label": "GPU-066",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 65,
      "memUsage": 30,
      "temp": 70,
      "power": 488,
      "cpuUsage": 54,
      "cpuMemUsage": 76
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 64.5
        },
        {
          "timestamp": "03/15",
          "value": 70
        },
        {
          "timestamp": "03/16",
          "value": 66.9
        },
        {
          "timestamp": "03/17",
          "value": 68.9
        },
        {
          "timestamp": "03/18",
          "value": 66.4
        },
        {
          "timestamp": "03/19",
          "value": 71.6
        },
        {
          "timestamp": "03/20",
          "value": 60.6
        },
        {
          "timestamp": "03/21",
          "value": 63.9
        },
        {
          "timestamp": "03/22",
          "value": 55.4
        },
        {
          "timestamp": "03/23",
          "value": 60.1
        },
        {
          "timestamp": "03/24",
          "value": 56.1
        },
        {
          "timestamp": "03/25",
          "value": 66.2
        },
        {
          "timestamp": "03/26",
          "value": 63.1
        },
        {
          "timestamp": "03/27",
          "value": 61.2
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 31.4
        },
        {
          "timestamp": "03/15",
          "value": 32.1
        },
        {
          "timestamp": "03/16",
          "value": 33.3
        },
        {
          "timestamp": "03/17",
          "value": 34.4
        },
        {
          "timestamp": "03/18",
          "value": 32.6
        },
        {
          "timestamp": "03/19",
          "value": 33.1
        },
        {
          "timestamp": "03/20",
          "value": 31.6
        },
        {
          "timestamp": "03/21",
          "value": 28.5
        },
        {
          "timestamp": "03/22",
          "value": 29.2
        },
        {
          "timestamp": "03/23",
          "value": 28.7
        },
        {
          "timestamp": "03/24",
          "value": 27
        },
        {
          "timestamp": "03/25",
          "value": 29.1
        },
        {
          "timestamp": "03/26",
          "value": 29.9
        },
        {
          "timestamp": "03/27",
          "value": 31.6
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 71.4
        },
        {
          "timestamp": "03/15",
          "value": 74.2
        },
        {
          "timestamp": "03/16",
          "value": 73.7
        },
        {
          "timestamp": "03/17",
          "value": 76.7
        },
        {
          "timestamp": "03/18",
          "value": 76.7
        },
        {
          "timestamp": "03/19",
          "value": 71.5
        },
        {
          "timestamp": "03/20",
          "value": 72.6
        },
        {
          "timestamp": "03/21",
          "value": 69.8
        },
        {
          "timestamp": "03/22",
          "value": 66.1
        },
        {
          "timestamp": "03/23",
          "value": 61.2
        },
        {
          "timestamp": "03/24",
          "value": 61.5
        },
        {
          "timestamp": "03/25",
          "value": 65.1
        },
        {
          "timestamp": "03/26",
          "value": 69.4
        },
        {
          "timestamp": "03/27",
          "value": 70.1
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 488.6
        },
        {
          "timestamp": "03/15",
          "value": 532.8
        },
        {
          "timestamp": "03/16",
          "value": 554
        },
        {
          "timestamp": "03/17",
          "value": 514.5
        },
        {
          "timestamp": "03/18",
          "value": 509.9
        },
        {
          "timestamp": "03/19",
          "value": 541.2
        },
        {
          "timestamp": "03/20",
          "value": 503.1
        },
        {
          "timestamp": "03/21",
          "value": 496
        },
        {
          "timestamp": "03/22",
          "value": 427.8
        },
        {
          "timestamp": "03/23",
          "value": 466.3
        },
        {
          "timestamp": "03/24",
          "value": 455.4
        },
        {
          "timestamp": "03/25",
          "value": 432.8
        },
        {
          "timestamp": "03/26",
          "value": 445.6
        },
        {
          "timestamp": "03/27",
          "value": 498.3
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 52.7
        },
        {
          "timestamp": "03/15",
          "value": 60.2
        },
        {
          "timestamp": "03/16",
          "value": 59.5
        },
        {
          "timestamp": "03/17",
          "value": 63.4
        },
        {
          "timestamp": "03/18",
          "value": 53.8
        },
        {
          "timestamp": "03/19",
          "value": 60.1
        },
        {
          "timestamp": "03/20",
          "value": 55.2
        },
        {
          "timestamp": "03/21",
          "value": 50.8
        },
        {
          "timestamp": "03/22",
          "value": 53.9
        },
        {
          "timestamp": "03/23",
          "value": 51.2
        },
        {
          "timestamp": "03/24",
          "value": 52.1
        },
        {
          "timestamp": "03/25",
          "value": 49.5
        },
        {
          "timestamp": "03/26",
          "value": 56.6
        },
        {
          "timestamp": "03/27",
          "value": 56.9
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 70.9
        },
        {
          "timestamp": "03/15",
          "value": 80.3
        },
        {
          "timestamp": "03/16",
          "value": 77.7
        },
        {
          "timestamp": "03/17",
          "value": 78.9
        },
        {
          "timestamp": "03/18",
          "value": 86.9
        },
        {
          "timestamp": "03/19",
          "value": 82.8
        },
        {
          "timestamp": "03/20",
          "value": 78.8
        },
        {
          "timestamp": "03/21",
          "value": 74.7
        },
        {
          "timestamp": "03/22",
          "value": 70.9
        },
        {
          "timestamp": "03/23",
          "value": 72.5
        },
        {
          "timestamp": "03/24",
          "value": 71.2
        },
        {
          "timestamp": "03/25",
          "value": 65.5
        },
        {
          "timestamp": "03/26",
          "value": 77.9
        },
        {
          "timestamp": "03/27",
          "value": 80.4
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu067",
    "label": "GPU-067",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 35,
      "memUsage": 30,
      "temp": 78,
      "power": 393,
      "cpuUsage": 34,
      "cpuMemUsage": 73
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 37.5
        },
        {
          "timestamp": "03/15",
          "value": 37.7
        },
        {
          "timestamp": "03/16",
          "value": 35
        },
        {
          "timestamp": "03/17",
          "value": 36
        },
        {
          "timestamp": "03/18",
          "value": 36.7
        },
        {
          "timestamp": "03/19",
          "value": 37
        },
        {
          "timestamp": "03/20",
          "value": 37.8
        },
        {
          "timestamp": "03/21",
          "value": 31.7
        },
        {
          "timestamp": "03/22",
          "value": 29.3
        },
        {
          "timestamp": "03/23",
          "value": 32.2
        },
        {
          "timestamp": "03/24",
          "value": 31.1
        },
        {
          "timestamp": "03/25",
          "value": 32.2
        },
        {
          "timestamp": "03/26",
          "value": 36.5
        },
        {
          "timestamp": "03/27",
          "value": 35.8
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 30.7
        },
        {
          "timestamp": "03/15",
          "value": 29.9
        },
        {
          "timestamp": "03/16",
          "value": 32.2
        },
        {
          "timestamp": "03/17",
          "value": 34.2
        },
        {
          "timestamp": "03/18",
          "value": 31
        },
        {
          "timestamp": "03/19",
          "value": 33.7
        },
        {
          "timestamp": "03/20",
          "value": 31.8
        },
        {
          "timestamp": "03/21",
          "value": 27.8
        },
        {
          "timestamp": "03/22",
          "value": 26.7
        },
        {
          "timestamp": "03/23",
          "value": 24.9
        },
        {
          "timestamp": "03/24",
          "value": 26
        },
        {
          "timestamp": "03/25",
          "value": 27.4
        },
        {
          "timestamp": "03/26",
          "value": 30.8
        },
        {
          "timestamp": "03/27",
          "value": 30.9
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 76
        },
        {
          "timestamp": "03/15",
          "value": 80.3
        },
        {
          "timestamp": "03/16",
          "value": 86.3
        },
        {
          "timestamp": "03/17",
          "value": 88.7
        },
        {
          "timestamp": "03/18",
          "value": 87.3
        },
        {
          "timestamp": "03/19",
          "value": 84.2
        },
        {
          "timestamp": "03/20",
          "value": 81.8
        },
        {
          "timestamp": "03/21",
          "value": 72.9
        },
        {
          "timestamp": "03/22",
          "value": 72.7
        },
        {
          "timestamp": "03/23",
          "value": 71.2
        },
        {
          "timestamp": "03/24",
          "value": 71.6
        },
        {
          "timestamp": "03/25",
          "value": 70
        },
        {
          "timestamp": "03/26",
          "value": 78.4
        },
        {
          "timestamp": "03/27",
          "value": 78.4
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 397.9
        },
        {
          "timestamp": "03/15",
          "value": 410.9
        },
        {
          "timestamp": "03/16",
          "value": 438.6
        },
        {
          "timestamp": "03/17",
          "value": 442.2
        },
        {
          "timestamp": "03/18",
          "value": 415.4
        },
        {
          "timestamp": "03/19",
          "value": 429.1
        },
        {
          "timestamp": "03/20",
          "value": 415.2
        },
        {
          "timestamp": "03/21",
          "value": 363
        },
        {
          "timestamp": "03/22",
          "value": 348.9
        },
        {
          "timestamp": "03/23",
          "value": 333
        },
        {
          "timestamp": "03/24",
          "value": 372
        },
        {
          "timestamp": "03/25",
          "value": 349.6
        },
        {
          "timestamp": "03/26",
          "value": 366.6
        },
        {
          "timestamp": "03/27",
          "value": 410.5
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 33.6
        },
        {
          "timestamp": "03/15",
          "value": 37
        },
        {
          "timestamp": "03/16",
          "value": 39
        },
        {
          "timestamp": "03/17",
          "value": 40.7
        },
        {
          "timestamp": "03/18",
          "value": 39.1
        },
        {
          "timestamp": "03/19",
          "value": 33.2
        },
        {
          "timestamp": "03/20",
          "value": 32.2
        },
        {
          "timestamp": "03/21",
          "value": 30.9
        },
        {
          "timestamp": "03/22",
          "value": 29.7
        },
        {
          "timestamp": "03/23",
          "value": 28.5
        },
        {
          "timestamp": "03/24",
          "value": 31
        },
        {
          "timestamp": "03/25",
          "value": 32.3
        },
        {
          "timestamp": "03/26",
          "value": 32.5
        },
        {
          "timestamp": "03/27",
          "value": 32.6
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 73.8
        },
        {
          "timestamp": "03/15",
          "value": 73
        },
        {
          "timestamp": "03/16",
          "value": 76.4
        },
        {
          "timestamp": "03/17",
          "value": 78.5
        },
        {
          "timestamp": "03/18",
          "value": 83
        },
        {
          "timestamp": "03/19",
          "value": 75.5
        },
        {
          "timestamp": "03/20",
          "value": 73.7
        },
        {
          "timestamp": "03/21",
          "value": 75
        },
        {
          "timestamp": "03/22",
          "value": 66.4
        },
        {
          "timestamp": "03/23",
          "value": 61.6
        },
        {
          "timestamp": "03/24",
          "value": 64.1
        },
        {
          "timestamp": "03/25",
          "value": 65.5
        },
        {
          "timestamp": "03/26",
          "value": 72.6
        },
        {
          "timestamp": "03/27",
          "value": 79.6
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu068",
    "label": "GPU-068",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 46,
      "memUsage": 37,
      "temp": 79,
      "power": 559,
      "cpuUsage": 71,
      "cpuMemUsage": 62
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 42.2
        },
        {
          "timestamp": "03/15",
          "value": 48.3
        },
        {
          "timestamp": "03/16",
          "value": 51.1
        },
        {
          "timestamp": "03/17",
          "value": 47.5
        },
        {
          "timestamp": "03/18",
          "value": 51.7
        },
        {
          "timestamp": "03/19",
          "value": 45.3
        },
        {
          "timestamp": "03/20",
          "value": 50
        },
        {
          "timestamp": "03/21",
          "value": 43.8
        },
        {
          "timestamp": "03/22",
          "value": 39.5
        },
        {
          "timestamp": "03/23",
          "value": 45
        },
        {
          "timestamp": "03/24",
          "value": 45.7
        },
        {
          "timestamp": "03/25",
          "value": 43.7
        },
        {
          "timestamp": "03/26",
          "value": 46.1
        },
        {
          "timestamp": "03/27",
          "value": 44.1
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 38
        },
        {
          "timestamp": "03/15",
          "value": 37.9
        },
        {
          "timestamp": "03/16",
          "value": 42.1
        },
        {
          "timestamp": "03/17",
          "value": 41.5
        },
        {
          "timestamp": "03/18",
          "value": 42.5
        },
        {
          "timestamp": "03/19",
          "value": 39.2
        },
        {
          "timestamp": "03/20",
          "value": 37.4
        },
        {
          "timestamp": "03/21",
          "value": 38.4
        },
        {
          "timestamp": "03/22",
          "value": 31.9
        },
        {
          "timestamp": "03/23",
          "value": 32.6
        },
        {
          "timestamp": "03/24",
          "value": 35.4
        },
        {
          "timestamp": "03/25",
          "value": 33.9
        },
        {
          "timestamp": "03/26",
          "value": 35.8
        },
        {
          "timestamp": "03/27",
          "value": 39.3
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 78.5
        },
        {
          "timestamp": "03/15",
          "value": 80
        },
        {
          "timestamp": "03/16",
          "value": 86.2
        },
        {
          "timestamp": "03/17",
          "value": 88.5
        },
        {
          "timestamp": "03/18",
          "value": 88.1
        },
        {
          "timestamp": "03/19",
          "value": 84
        },
        {
          "timestamp": "03/20",
          "value": 81.5
        },
        {
          "timestamp": "03/21",
          "value": 74.7
        },
        {
          "timestamp": "03/22",
          "value": 70.1
        },
        {
          "timestamp": "03/23",
          "value": 73
        },
        {
          "timestamp": "03/24",
          "value": 71.3
        },
        {
          "timestamp": "03/25",
          "value": 75.4
        },
        {
          "timestamp": "03/26",
          "value": 77.1
        },
        {
          "timestamp": "03/27",
          "value": 81.1
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 567.7
        },
        {
          "timestamp": "03/15",
          "value": 600.6
        },
        {
          "timestamp": "03/16",
          "value": 629.3
        },
        {
          "timestamp": "03/17",
          "value": 622.8
        },
        {
          "timestamp": "03/18",
          "value": 600.6
        },
        {
          "timestamp": "03/19",
          "value": 577
        },
        {
          "timestamp": "03/20",
          "value": 582.1
        },
        {
          "timestamp": "03/21",
          "value": 525.3
        },
        {
          "timestamp": "03/22",
          "value": 508.3
        },
        {
          "timestamp": "03/23",
          "value": 496.6
        },
        {
          "timestamp": "03/24",
          "value": 484.4
        },
        {
          "timestamp": "03/25",
          "value": 525.9
        },
        {
          "timestamp": "03/26",
          "value": 533.7
        },
        {
          "timestamp": "03/27",
          "value": 601.6
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 67.1
        },
        {
          "timestamp": "03/15",
          "value": 74
        },
        {
          "timestamp": "03/16",
          "value": 77.3
        },
        {
          "timestamp": "03/17",
          "value": 75.3
        },
        {
          "timestamp": "03/18",
          "value": 73.6
        },
        {
          "timestamp": "03/19",
          "value": 79.6
        },
        {
          "timestamp": "03/20",
          "value": 66.8
        },
        {
          "timestamp": "03/21",
          "value": 66.4
        },
        {
          "timestamp": "03/22",
          "value": 58.9
        },
        {
          "timestamp": "03/23",
          "value": 70.2
        },
        {
          "timestamp": "03/24",
          "value": 70.9
        },
        {
          "timestamp": "03/25",
          "value": 63.2
        },
        {
          "timestamp": "03/26",
          "value": 67.3
        },
        {
          "timestamp": "03/27",
          "value": 75.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 64.2
        },
        {
          "timestamp": "03/15",
          "value": 68.1
        },
        {
          "timestamp": "03/16",
          "value": 66.4
        },
        {
          "timestamp": "03/17",
          "value": 67.6
        },
        {
          "timestamp": "03/18",
          "value": 66
        },
        {
          "timestamp": "03/19",
          "value": 68.3
        },
        {
          "timestamp": "03/20",
          "value": 66.6
        },
        {
          "timestamp": "03/21",
          "value": 58.1
        },
        {
          "timestamp": "03/22",
          "value": 55
        },
        {
          "timestamp": "03/23",
          "value": 53.8
        },
        {
          "timestamp": "03/24",
          "value": 52.9
        },
        {
          "timestamp": "03/25",
          "value": 56
        },
        {
          "timestamp": "03/26",
          "value": 58
        },
        {
          "timestamp": "03/27",
          "value": 64.6
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu069",
    "label": "GPU-069",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 73,
      "memUsage": 44,
      "temp": 78,
      "power": 484,
      "cpuUsage": 33,
      "cpuMemUsage": 77
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 78.6
        },
        {
          "timestamp": "03/15",
          "value": 76.5
        },
        {
          "timestamp": "03/16",
          "value": 83.7
        },
        {
          "timestamp": "03/17",
          "value": 76.1
        },
        {
          "timestamp": "03/18",
          "value": 78.2
        },
        {
          "timestamp": "03/19",
          "value": 73.7
        },
        {
          "timestamp": "03/20",
          "value": 71.5
        },
        {
          "timestamp": "03/21",
          "value": 65.2
        },
        {
          "timestamp": "03/22",
          "value": 68.1
        },
        {
          "timestamp": "03/23",
          "value": 72.3
        },
        {
          "timestamp": "03/24",
          "value": 68
        },
        {
          "timestamp": "03/25",
          "value": 63.5
        },
        {
          "timestamp": "03/26",
          "value": 71
        },
        {
          "timestamp": "03/27",
          "value": 79.8
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 47.1
        },
        {
          "timestamp": "03/15",
          "value": 48.1
        },
        {
          "timestamp": "03/16",
          "value": 47.6
        },
        {
          "timestamp": "03/17",
          "value": 46.1
        },
        {
          "timestamp": "03/18",
          "value": 50.3
        },
        {
          "timestamp": "03/19",
          "value": 47.8
        },
        {
          "timestamp": "03/20",
          "value": 44.1
        },
        {
          "timestamp": "03/21",
          "value": 41.8
        },
        {
          "timestamp": "03/22",
          "value": 38
        },
        {
          "timestamp": "03/23",
          "value": 41
        },
        {
          "timestamp": "03/24",
          "value": 42.6
        },
        {
          "timestamp": "03/25",
          "value": 41.7
        },
        {
          "timestamp": "03/26",
          "value": 41.8
        },
        {
          "timestamp": "03/27",
          "value": 46.6
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 77.1
        },
        {
          "timestamp": "03/15",
          "value": 78.8
        },
        {
          "timestamp": "03/16",
          "value": 82.9
        },
        {
          "timestamp": "03/17",
          "value": 84.1
        },
        {
          "timestamp": "03/18",
          "value": 88
        },
        {
          "timestamp": "03/19",
          "value": 84.4
        },
        {
          "timestamp": "03/20",
          "value": 77.2
        },
        {
          "timestamp": "03/21",
          "value": 77.8
        },
        {
          "timestamp": "03/22",
          "value": 73.2
        },
        {
          "timestamp": "03/23",
          "value": 68.1
        },
        {
          "timestamp": "03/24",
          "value": 69.1
        },
        {
          "timestamp": "03/25",
          "value": 73.2
        },
        {
          "timestamp": "03/26",
          "value": 73.4
        },
        {
          "timestamp": "03/27",
          "value": 80.9
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 470.2
        },
        {
          "timestamp": "03/15",
          "value": 528.1
        },
        {
          "timestamp": "03/16",
          "value": 532.5
        },
        {
          "timestamp": "03/17",
          "value": 543.9
        },
        {
          "timestamp": "03/18",
          "value": 536.9
        },
        {
          "timestamp": "03/19",
          "value": 533.7
        },
        {
          "timestamp": "03/20",
          "value": 507
        },
        {
          "timestamp": "03/21",
          "value": 485.2
        },
        {
          "timestamp": "03/22",
          "value": 437.9
        },
        {
          "timestamp": "03/23",
          "value": 446
        },
        {
          "timestamp": "03/24",
          "value": 429.8
        },
        {
          "timestamp": "03/25",
          "value": 470.5
        },
        {
          "timestamp": "03/26",
          "value": 492.9
        },
        {
          "timestamp": "03/27",
          "value": 486.7
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 31.4
        },
        {
          "timestamp": "03/15",
          "value": 32.2
        },
        {
          "timestamp": "03/16",
          "value": 36.3
        },
        {
          "timestamp": "03/17",
          "value": 34.1
        },
        {
          "timestamp": "03/18",
          "value": 38.6
        },
        {
          "timestamp": "03/19",
          "value": 32.7
        },
        {
          "timestamp": "03/20",
          "value": 34.3
        },
        {
          "timestamp": "03/21",
          "value": 32.1
        },
        {
          "timestamp": "03/22",
          "value": 29.7
        },
        {
          "timestamp": "03/23",
          "value": 29.4
        },
        {
          "timestamp": "03/24",
          "value": 32
        },
        {
          "timestamp": "03/25",
          "value": 31.7
        },
        {
          "timestamp": "03/26",
          "value": 31.4
        },
        {
          "timestamp": "03/27",
          "value": 33.1
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 82.3
        },
        {
          "timestamp": "03/15",
          "value": 84.5
        },
        {
          "timestamp": "03/16",
          "value": 88.4
        },
        {
          "timestamp": "03/17",
          "value": 80.5
        },
        {
          "timestamp": "03/18",
          "value": 81
        },
        {
          "timestamp": "03/19",
          "value": 80.3
        },
        {
          "timestamp": "03/20",
          "value": 76.4
        },
        {
          "timestamp": "03/21",
          "value": 69.5
        },
        {
          "timestamp": "03/22",
          "value": 73.7
        },
        {
          "timestamp": "03/23",
          "value": 65.3
        },
        {
          "timestamp": "03/24",
          "value": 75
        },
        {
          "timestamp": "03/25",
          "value": 73
        },
        {
          "timestamp": "03/26",
          "value": 78
        },
        {
          "timestamp": "03/27",
          "value": 73.3
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu070",
    "label": "GPU-070",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "err",
    "current": {
      "gpuUsage": 0,
      "memUsage": 0,
      "temp": 0,
      "power": 0,
      "cpuUsage": 0,
      "cpuMemUsage": 0
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu071",
    "label": "GPU-071",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 36,
      "memUsage": 80,
      "temp": 59,
      "power": 613,
      "cpuUsage": 61,
      "cpuMemUsage": 60
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 33
        },
        {
          "timestamp": "03/15",
          "value": 36.7
        },
        {
          "timestamp": "03/16",
          "value": 40.1
        },
        {
          "timestamp": "03/17",
          "value": 41.3
        },
        {
          "timestamp": "03/18",
          "value": 36.5
        },
        {
          "timestamp": "03/19",
          "value": 39.2
        },
        {
          "timestamp": "03/20",
          "value": 34.5
        },
        {
          "timestamp": "03/21",
          "value": 37.5
        },
        {
          "timestamp": "03/22",
          "value": 32.7
        },
        {
          "timestamp": "03/23",
          "value": 32.3
        },
        {
          "timestamp": "03/24",
          "value": 35.6
        },
        {
          "timestamp": "03/25",
          "value": 33.6
        },
        {
          "timestamp": "03/26",
          "value": 33.8
        },
        {
          "timestamp": "03/27",
          "value": 38.5
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 77.7
        },
        {
          "timestamp": "03/15",
          "value": 83.6
        },
        {
          "timestamp": "03/16",
          "value": 91
        },
        {
          "timestamp": "03/17",
          "value": 91.3
        },
        {
          "timestamp": "03/18",
          "value": 83
        },
        {
          "timestamp": "03/19",
          "value": 80
        },
        {
          "timestamp": "03/20",
          "value": 82.6
        },
        {
          "timestamp": "03/21",
          "value": 73.3
        },
        {
          "timestamp": "03/22",
          "value": 72.8
        },
        {
          "timestamp": "03/23",
          "value": 73.3
        },
        {
          "timestamp": "03/24",
          "value": 77.4
        },
        {
          "timestamp": "03/25",
          "value": 71.4
        },
        {
          "timestamp": "03/26",
          "value": 72.1
        },
        {
          "timestamp": "03/27",
          "value": 86.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 59.7
        },
        {
          "timestamp": "03/15",
          "value": 63.6
        },
        {
          "timestamp": "03/16",
          "value": 65.8
        },
        {
          "timestamp": "03/17",
          "value": 64.3
        },
        {
          "timestamp": "03/18",
          "value": 64.6
        },
        {
          "timestamp": "03/19",
          "value": 61.3
        },
        {
          "timestamp": "03/20",
          "value": 58.6
        },
        {
          "timestamp": "03/21",
          "value": 56.9
        },
        {
          "timestamp": "03/22",
          "value": 53.2
        },
        {
          "timestamp": "03/23",
          "value": 53.9
        },
        {
          "timestamp": "03/24",
          "value": 54.6
        },
        {
          "timestamp": "03/25",
          "value": 55.7
        },
        {
          "timestamp": "03/26",
          "value": 58
        },
        {
          "timestamp": "03/27",
          "value": 58.2
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 632
        },
        {
          "timestamp": "03/15",
          "value": 668.9
        },
        {
          "timestamp": "03/16",
          "value": 666
        },
        {
          "timestamp": "03/17",
          "value": 648.8
        },
        {
          "timestamp": "03/18",
          "value": 665
        },
        {
          "timestamp": "03/19",
          "value": 613.1
        },
        {
          "timestamp": "03/20",
          "value": 651.4
        },
        {
          "timestamp": "03/21",
          "value": 596.8
        },
        {
          "timestamp": "03/22",
          "value": 586.8
        },
        {
          "timestamp": "03/23",
          "value": 558.3
        },
        {
          "timestamp": "03/24",
          "value": 588.1
        },
        {
          "timestamp": "03/25",
          "value": 572.9
        },
        {
          "timestamp": "03/26",
          "value": 604.1
        },
        {
          "timestamp": "03/27",
          "value": 634.5
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 66.1
        },
        {
          "timestamp": "03/15",
          "value": 64.8
        },
        {
          "timestamp": "03/16",
          "value": 64.1
        },
        {
          "timestamp": "03/17",
          "value": 72.7
        },
        {
          "timestamp": "03/18",
          "value": 72.1
        },
        {
          "timestamp": "03/19",
          "value": 66.8
        },
        {
          "timestamp": "03/20",
          "value": 61.2
        },
        {
          "timestamp": "03/21",
          "value": 64.4
        },
        {
          "timestamp": "03/22",
          "value": 50.7
        },
        {
          "timestamp": "03/23",
          "value": 49
        },
        {
          "timestamp": "03/24",
          "value": 51.4
        },
        {
          "timestamp": "03/25",
          "value": 62.5
        },
        {
          "timestamp": "03/26",
          "value": 58
        },
        {
          "timestamp": "03/27",
          "value": 57.2
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 61.7
        },
        {
          "timestamp": "03/15",
          "value": 64.4
        },
        {
          "timestamp": "03/16",
          "value": 63.3
        },
        {
          "timestamp": "03/17",
          "value": 63.1
        },
        {
          "timestamp": "03/18",
          "value": 65
        },
        {
          "timestamp": "03/19",
          "value": 65.1
        },
        {
          "timestamp": "03/20",
          "value": 56.9
        },
        {
          "timestamp": "03/21",
          "value": 61.8
        },
        {
          "timestamp": "03/22",
          "value": 52.6
        },
        {
          "timestamp": "03/23",
          "value": 50.9
        },
        {
          "timestamp": "03/24",
          "value": 52.3
        },
        {
          "timestamp": "03/25",
          "value": 55.7
        },
        {
          "timestamp": "03/26",
          "value": 59.7
        },
        {
          "timestamp": "03/27",
          "value": 61.8
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu072",
    "label": "GPU-072",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 79,
      "memUsage": 31,
      "temp": 57,
      "power": 605,
      "cpuUsage": 24,
      "cpuMemUsage": 33
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 77.2
        },
        {
          "timestamp": "03/15",
          "value": 75.7
        },
        {
          "timestamp": "03/16",
          "value": 81.9
        },
        {
          "timestamp": "03/17",
          "value": 87.7
        },
        {
          "timestamp": "03/18",
          "value": 83.6
        },
        {
          "timestamp": "03/19",
          "value": 90
        },
        {
          "timestamp": "03/20",
          "value": 81.6
        },
        {
          "timestamp": "03/21",
          "value": 77.3
        },
        {
          "timestamp": "03/22",
          "value": 73.1
        },
        {
          "timestamp": "03/23",
          "value": 70.2
        },
        {
          "timestamp": "03/24",
          "value": 69.2
        },
        {
          "timestamp": "03/25",
          "value": 66.5
        },
        {
          "timestamp": "03/26",
          "value": 75.7
        },
        {
          "timestamp": "03/27",
          "value": 74
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 29.4
        },
        {
          "timestamp": "03/15",
          "value": 33.2
        },
        {
          "timestamp": "03/16",
          "value": 32.6
        },
        {
          "timestamp": "03/17",
          "value": 34.4
        },
        {
          "timestamp": "03/18",
          "value": 32.6
        },
        {
          "timestamp": "03/19",
          "value": 35.1
        },
        {
          "timestamp": "03/20",
          "value": 31.8
        },
        {
          "timestamp": "03/21",
          "value": 29.6
        },
        {
          "timestamp": "03/22",
          "value": 29.7
        },
        {
          "timestamp": "03/23",
          "value": 27.8
        },
        {
          "timestamp": "03/24",
          "value": 26.1
        },
        {
          "timestamp": "03/25",
          "value": 31
        },
        {
          "timestamp": "03/26",
          "value": 28.6
        },
        {
          "timestamp": "03/27",
          "value": 33.4
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 56.7
        },
        {
          "timestamp": "03/15",
          "value": 58.8
        },
        {
          "timestamp": "03/16",
          "value": 61.8
        },
        {
          "timestamp": "03/17",
          "value": 63.6
        },
        {
          "timestamp": "03/18",
          "value": 60.2
        },
        {
          "timestamp": "03/19",
          "value": 62
        },
        {
          "timestamp": "03/20",
          "value": 55.6
        },
        {
          "timestamp": "03/21",
          "value": 54.8
        },
        {
          "timestamp": "03/22",
          "value": 52.1
        },
        {
          "timestamp": "03/23",
          "value": 49.7
        },
        {
          "timestamp": "03/24",
          "value": 50.6
        },
        {
          "timestamp": "03/25",
          "value": 54
        },
        {
          "timestamp": "03/26",
          "value": 55.2
        },
        {
          "timestamp": "03/27",
          "value": 56.6
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 582.8
        },
        {
          "timestamp": "03/15",
          "value": 626.2
        },
        {
          "timestamp": "03/16",
          "value": 669.9
        },
        {
          "timestamp": "03/17",
          "value": 656.9
        },
        {
          "timestamp": "03/18",
          "value": 652.6
        },
        {
          "timestamp": "03/19",
          "value": 665
        },
        {
          "timestamp": "03/20",
          "value": 601.9
        },
        {
          "timestamp": "03/21",
          "value": 602.2
        },
        {
          "timestamp": "03/22",
          "value": 576.8
        },
        {
          "timestamp": "03/23",
          "value": 561.4
        },
        {
          "timestamp": "03/24",
          "value": 568
        },
        {
          "timestamp": "03/25",
          "value": 527
        },
        {
          "timestamp": "03/26",
          "value": 556.8
        },
        {
          "timestamp": "03/27",
          "value": 597.4
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 23
        },
        {
          "timestamp": "03/15",
          "value": 24.4
        },
        {
          "timestamp": "03/16",
          "value": 24.8
        },
        {
          "timestamp": "03/17",
          "value": 27.8
        },
        {
          "timestamp": "03/18",
          "value": 27.2
        },
        {
          "timestamp": "03/19",
          "value": 23.1
        },
        {
          "timestamp": "03/20",
          "value": 24
        },
        {
          "timestamp": "03/21",
          "value": 23.1
        },
        {
          "timestamp": "03/22",
          "value": 21.2
        },
        {
          "timestamp": "03/23",
          "value": 22.5
        },
        {
          "timestamp": "03/24",
          "value": 22
        },
        {
          "timestamp": "03/25",
          "value": 24.5
        },
        {
          "timestamp": "03/26",
          "value": 21.7
        },
        {
          "timestamp": "03/27",
          "value": 23.9
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 34.1
        },
        {
          "timestamp": "03/15",
          "value": 33.4
        },
        {
          "timestamp": "03/16",
          "value": 33.5
        },
        {
          "timestamp": "03/17",
          "value": 36.8
        },
        {
          "timestamp": "03/18",
          "value": 34.9
        },
        {
          "timestamp": "03/19",
          "value": 35.6
        },
        {
          "timestamp": "03/20",
          "value": 33.5
        },
        {
          "timestamp": "03/21",
          "value": 32.4
        },
        {
          "timestamp": "03/22",
          "value": 31
        },
        {
          "timestamp": "03/23",
          "value": 27.6
        },
        {
          "timestamp": "03/24",
          "value": 28
        },
        {
          "timestamp": "03/25",
          "value": 32.3
        },
        {
          "timestamp": "03/26",
          "value": 31.8
        },
        {
          "timestamp": "03/27",
          "value": 35.9
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu073",
    "label": "GPU-073",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 47,
      "memUsage": 30,
      "temp": 66,
      "power": 541,
      "cpuUsage": 67,
      "cpuMemUsage": 57
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 45.4
        },
        {
          "timestamp": "03/15",
          "value": 47.2
        },
        {
          "timestamp": "03/16",
          "value": 53.2
        },
        {
          "timestamp": "03/17",
          "value": 54.7
        },
        {
          "timestamp": "03/18",
          "value": 48.2
        },
        {
          "timestamp": "03/19",
          "value": 47.9
        },
        {
          "timestamp": "03/20",
          "value": 44.5
        },
        {
          "timestamp": "03/21",
          "value": 47.5
        },
        {
          "timestamp": "03/22",
          "value": 43.5
        },
        {
          "timestamp": "03/23",
          "value": 38.4
        },
        {
          "timestamp": "03/24",
          "value": 44.7
        },
        {
          "timestamp": "03/25",
          "value": 44.1
        },
        {
          "timestamp": "03/26",
          "value": 46
        },
        {
          "timestamp": "03/27",
          "value": 51.6
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 30.1
        },
        {
          "timestamp": "03/15",
          "value": 33.2
        },
        {
          "timestamp": "03/16",
          "value": 34.4
        },
        {
          "timestamp": "03/17",
          "value": 34.8
        },
        {
          "timestamp": "03/18",
          "value": 34.5
        },
        {
          "timestamp": "03/19",
          "value": 33.2
        },
        {
          "timestamp": "03/20",
          "value": 29
        },
        {
          "timestamp": "03/21",
          "value": 29.1
        },
        {
          "timestamp": "03/22",
          "value": 28.2
        },
        {
          "timestamp": "03/23",
          "value": 26.7
        },
        {
          "timestamp": "03/24",
          "value": 27.3
        },
        {
          "timestamp": "03/25",
          "value": 29.3
        },
        {
          "timestamp": "03/26",
          "value": 27.8
        },
        {
          "timestamp": "03/27",
          "value": 29.9
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 63.7
        },
        {
          "timestamp": "03/15",
          "value": 71.2
        },
        {
          "timestamp": "03/16",
          "value": 73.8
        },
        {
          "timestamp": "03/17",
          "value": 74.1
        },
        {
          "timestamp": "03/18",
          "value": 70.8
        },
        {
          "timestamp": "03/19",
          "value": 68.2
        },
        {
          "timestamp": "03/20",
          "value": 64.4
        },
        {
          "timestamp": "03/21",
          "value": 66.3
        },
        {
          "timestamp": "03/22",
          "value": 60.3
        },
        {
          "timestamp": "03/23",
          "value": 56.9
        },
        {
          "timestamp": "03/24",
          "value": 61.5
        },
        {
          "timestamp": "03/25",
          "value": 59.8
        },
        {
          "timestamp": "03/26",
          "value": 62.6
        },
        {
          "timestamp": "03/27",
          "value": 67.9
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 560.5
        },
        {
          "timestamp": "03/15",
          "value": 572.5
        },
        {
          "timestamp": "03/16",
          "value": 602.1
        },
        {
          "timestamp": "03/17",
          "value": 605.3
        },
        {
          "timestamp": "03/18",
          "value": 594.2
        },
        {
          "timestamp": "03/19",
          "value": 563.7
        },
        {
          "timestamp": "03/20",
          "value": 537
        },
        {
          "timestamp": "03/21",
          "value": 541.8
        },
        {
          "timestamp": "03/22",
          "value": 489.7
        },
        {
          "timestamp": "03/23",
          "value": 502.3
        },
        {
          "timestamp": "03/24",
          "value": 470.9
        },
        {
          "timestamp": "03/25",
          "value": 479.2
        },
        {
          "timestamp": "03/26",
          "value": 536.7
        },
        {
          "timestamp": "03/27",
          "value": 561.1
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 66
        },
        {
          "timestamp": "03/15",
          "value": 75.1
        },
        {
          "timestamp": "03/16",
          "value": 76.1
        },
        {
          "timestamp": "03/17",
          "value": 74.4
        },
        {
          "timestamp": "03/18",
          "value": 76.5
        },
        {
          "timestamp": "03/19",
          "value": 72.4
        },
        {
          "timestamp": "03/20",
          "value": 69.9
        },
        {
          "timestamp": "03/21",
          "value": 71.1
        },
        {
          "timestamp": "03/22",
          "value": 66.6
        },
        {
          "timestamp": "03/23",
          "value": 66.4
        },
        {
          "timestamp": "03/24",
          "value": 66.3
        },
        {
          "timestamp": "03/25",
          "value": 58.5
        },
        {
          "timestamp": "03/26",
          "value": 61.1
        },
        {
          "timestamp": "03/27",
          "value": 73.6
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 56.5
        },
        {
          "timestamp": "03/15",
          "value": 60.9
        },
        {
          "timestamp": "03/16",
          "value": 60.4
        },
        {
          "timestamp": "03/17",
          "value": 65.9
        },
        {
          "timestamp": "03/18",
          "value": 65.3
        },
        {
          "timestamp": "03/19",
          "value": 63.2
        },
        {
          "timestamp": "03/20",
          "value": 60.3
        },
        {
          "timestamp": "03/21",
          "value": 58.7
        },
        {
          "timestamp": "03/22",
          "value": 54.7
        },
        {
          "timestamp": "03/23",
          "value": 52.7
        },
        {
          "timestamp": "03/24",
          "value": 48
        },
        {
          "timestamp": "03/25",
          "value": 49.9
        },
        {
          "timestamp": "03/26",
          "value": 54.5
        },
        {
          "timestamp": "03/27",
          "value": 54.8
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu074",
    "label": "GPU-074",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "warn",
    "current": {
      "gpuUsage": 87,
      "memUsage": 87,
      "temp": 88,
      "power": 912,
      "cpuUsage": 40,
      "cpuMemUsage": 78
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 88.2
        },
        {
          "timestamp": "03/15",
          "value": 94.8
        },
        {
          "timestamp": "03/16",
          "value": 88.5
        },
        {
          "timestamp": "03/17",
          "value": 93
        },
        {
          "timestamp": "03/18",
          "value": 90.4
        },
        {
          "timestamp": "03/19",
          "value": 92.6
        },
        {
          "timestamp": "03/20",
          "value": 83.1
        },
        {
          "timestamp": "03/21",
          "value": 85.4
        },
        {
          "timestamp": "03/22",
          "value": 74.3
        },
        {
          "timestamp": "03/23",
          "value": 77.3
        },
        {
          "timestamp": "03/24",
          "value": 75.8
        },
        {
          "timestamp": "03/25",
          "value": 83.7
        },
        {
          "timestamp": "03/26",
          "value": 89.1
        },
        {
          "timestamp": "03/27",
          "value": 89.2
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 84.9
        },
        {
          "timestamp": "03/15",
          "value": 95.8
        },
        {
          "timestamp": "03/16",
          "value": 89
        },
        {
          "timestamp": "03/17",
          "value": 94.8
        },
        {
          "timestamp": "03/18",
          "value": 93.2
        },
        {
          "timestamp": "03/19",
          "value": 97.6
        },
        {
          "timestamp": "03/20",
          "value": 89.9
        },
        {
          "timestamp": "03/21",
          "value": 82.6
        },
        {
          "timestamp": "03/22",
          "value": 86.6
        },
        {
          "timestamp": "03/23",
          "value": 74.2
        },
        {
          "timestamp": "03/24",
          "value": 83.4
        },
        {
          "timestamp": "03/25",
          "value": 79.9
        },
        {
          "timestamp": "03/26",
          "value": 78.9
        },
        {
          "timestamp": "03/27",
          "value": 83.9
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 85.1
        },
        {
          "timestamp": "03/15",
          "value": 90.7
        },
        {
          "timestamp": "03/16",
          "value": 93.7
        },
        {
          "timestamp": "03/17",
          "value": 97.7
        },
        {
          "timestamp": "03/18",
          "value": 96.2
        },
        {
          "timestamp": "03/19",
          "value": 94.6
        },
        {
          "timestamp": "03/20",
          "value": 88.3
        },
        {
          "timestamp": "03/21",
          "value": 84
        },
        {
          "timestamp": "03/22",
          "value": 83.6
        },
        {
          "timestamp": "03/23",
          "value": 81
        },
        {
          "timestamp": "03/24",
          "value": 77.7
        },
        {
          "timestamp": "03/25",
          "value": 81.2
        },
        {
          "timestamp": "03/26",
          "value": 82.3
        },
        {
          "timestamp": "03/27",
          "value": 92.8
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 965.2
        },
        {
          "timestamp": "03/15",
          "value": 966.3
        },
        {
          "timestamp": "03/16",
          "value": 1008
        },
        {
          "timestamp": "03/17",
          "value": 1024.3
        },
        {
          "timestamp": "03/18",
          "value": 1003.9
        },
        {
          "timestamp": "03/19",
          "value": 1000.9
        },
        {
          "timestamp": "03/20",
          "value": 870.3
        },
        {
          "timestamp": "03/21",
          "value": 892
        },
        {
          "timestamp": "03/22",
          "value": 896.5
        },
        {
          "timestamp": "03/23",
          "value": 830.6
        },
        {
          "timestamp": "03/24",
          "value": 847.1
        },
        {
          "timestamp": "03/25",
          "value": 867.6
        },
        {
          "timestamp": "03/26",
          "value": 841.5
        },
        {
          "timestamp": "03/27",
          "value": 888.9
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 43.6
        },
        {
          "timestamp": "03/15",
          "value": 40.1
        },
        {
          "timestamp": "03/16",
          "value": 44.2
        },
        {
          "timestamp": "03/17",
          "value": 42.8
        },
        {
          "timestamp": "03/18",
          "value": 46.8
        },
        {
          "timestamp": "03/19",
          "value": 42.8
        },
        {
          "timestamp": "03/20",
          "value": 41.1
        },
        {
          "timestamp": "03/21",
          "value": 37.6
        },
        {
          "timestamp": "03/22",
          "value": 35.3
        },
        {
          "timestamp": "03/23",
          "value": 36.9
        },
        {
          "timestamp": "03/24",
          "value": 37.3
        },
        {
          "timestamp": "03/25",
          "value": 38.5
        },
        {
          "timestamp": "03/26",
          "value": 39.1
        },
        {
          "timestamp": "03/27",
          "value": 39.8
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 78.4
        },
        {
          "timestamp": "03/15",
          "value": 81.9
        },
        {
          "timestamp": "03/16",
          "value": 89.3
        },
        {
          "timestamp": "03/17",
          "value": 82.6
        },
        {
          "timestamp": "03/18",
          "value": 86.3
        },
        {
          "timestamp": "03/19",
          "value": 83.6
        },
        {
          "timestamp": "03/20",
          "value": 74.2
        },
        {
          "timestamp": "03/21",
          "value": 77
        },
        {
          "timestamp": "03/22",
          "value": 72.9
        },
        {
          "timestamp": "03/23",
          "value": 73.4
        },
        {
          "timestamp": "03/24",
          "value": 66.3
        },
        {
          "timestamp": "03/25",
          "value": 71.8
        },
        {
          "timestamp": "03/26",
          "value": 76.6
        },
        {
          "timestamp": "03/27",
          "value": 75.6
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu075",
    "label": "GPU-075",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 76,
      "memUsage": 73,
      "temp": 75,
      "power": 348,
      "cpuUsage": 64,
      "cpuMemUsage": 36
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 76.5
        },
        {
          "timestamp": "03/15",
          "value": 78.1
        },
        {
          "timestamp": "03/16",
          "value": 78.2
        },
        {
          "timestamp": "03/17",
          "value": 78.5
        },
        {
          "timestamp": "03/18",
          "value": 87.5
        },
        {
          "timestamp": "03/19",
          "value": 81.6
        },
        {
          "timestamp": "03/20",
          "value": 82
        },
        {
          "timestamp": "03/21",
          "value": 70.5
        },
        {
          "timestamp": "03/22",
          "value": 76.4
        },
        {
          "timestamp": "03/23",
          "value": 68.2
        },
        {
          "timestamp": "03/24",
          "value": 62.7
        },
        {
          "timestamp": "03/25",
          "value": 69.8
        },
        {
          "timestamp": "03/26",
          "value": 70.4
        },
        {
          "timestamp": "03/27",
          "value": 73.9
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 71.5
        },
        {
          "timestamp": "03/15",
          "value": 78.8
        },
        {
          "timestamp": "03/16",
          "value": 79.3
        },
        {
          "timestamp": "03/17",
          "value": 76.2
        },
        {
          "timestamp": "03/18",
          "value": 78.4
        },
        {
          "timestamp": "03/19",
          "value": 80.7
        },
        {
          "timestamp": "03/20",
          "value": 72.6
        },
        {
          "timestamp": "03/21",
          "value": 70.6
        },
        {
          "timestamp": "03/22",
          "value": 63.2
        },
        {
          "timestamp": "03/23",
          "value": 70.4
        },
        {
          "timestamp": "03/24",
          "value": 67.8
        },
        {
          "timestamp": "03/25",
          "value": 70.5
        },
        {
          "timestamp": "03/26",
          "value": 71.2
        },
        {
          "timestamp": "03/27",
          "value": 70
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 77.1
        },
        {
          "timestamp": "03/15",
          "value": 76.1
        },
        {
          "timestamp": "03/16",
          "value": 81.5
        },
        {
          "timestamp": "03/17",
          "value": 83.6
        },
        {
          "timestamp": "03/18",
          "value": 84.6
        },
        {
          "timestamp": "03/19",
          "value": 76.5
        },
        {
          "timestamp": "03/20",
          "value": 73.3
        },
        {
          "timestamp": "03/21",
          "value": 70.6
        },
        {
          "timestamp": "03/22",
          "value": 70.7
        },
        {
          "timestamp": "03/23",
          "value": 69.7
        },
        {
          "timestamp": "03/24",
          "value": 67.8
        },
        {
          "timestamp": "03/25",
          "value": 72.5
        },
        {
          "timestamp": "03/26",
          "value": 75.3
        },
        {
          "timestamp": "03/27",
          "value": 74.2
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 365.9
        },
        {
          "timestamp": "03/15",
          "value": 363.6
        },
        {
          "timestamp": "03/16",
          "value": 357.1
        },
        {
          "timestamp": "03/17",
          "value": 371.8
        },
        {
          "timestamp": "03/18",
          "value": 360.5
        },
        {
          "timestamp": "03/19",
          "value": 365.5
        },
        {
          "timestamp": "03/20",
          "value": 332.2
        },
        {
          "timestamp": "03/21",
          "value": 353.3
        },
        {
          "timestamp": "03/22",
          "value": 309
        },
        {
          "timestamp": "03/23",
          "value": 330
        },
        {
          "timestamp": "03/24",
          "value": 303
        },
        {
          "timestamp": "03/25",
          "value": 339.5
        },
        {
          "timestamp": "03/26",
          "value": 334.1
        },
        {
          "timestamp": "03/27",
          "value": 376.2
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 62.2
        },
        {
          "timestamp": "03/15",
          "value": 72.5
        },
        {
          "timestamp": "03/16",
          "value": 65.5
        },
        {
          "timestamp": "03/17",
          "value": 72
        },
        {
          "timestamp": "03/18",
          "value": 66.1
        },
        {
          "timestamp": "03/19",
          "value": 63.9
        },
        {
          "timestamp": "03/20",
          "value": 69.4
        },
        {
          "timestamp": "03/21",
          "value": 58.4
        },
        {
          "timestamp": "03/22",
          "value": 56.3
        },
        {
          "timestamp": "03/23",
          "value": 52.8
        },
        {
          "timestamp": "03/24",
          "value": 63.9
        },
        {
          "timestamp": "03/25",
          "value": 64.5
        },
        {
          "timestamp": "03/26",
          "value": 56.4
        },
        {
          "timestamp": "03/27",
          "value": 70.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 37.5
        },
        {
          "timestamp": "03/15",
          "value": 39.8
        },
        {
          "timestamp": "03/16",
          "value": 36.5
        },
        {
          "timestamp": "03/17",
          "value": 37.8
        },
        {
          "timestamp": "03/18",
          "value": 40.7
        },
        {
          "timestamp": "03/19",
          "value": 36.8
        },
        {
          "timestamp": "03/20",
          "value": 37.8
        },
        {
          "timestamp": "03/21",
          "value": 32.8
        },
        {
          "timestamp": "03/22",
          "value": 34.1
        },
        {
          "timestamp": "03/23",
          "value": 34.4
        },
        {
          "timestamp": "03/24",
          "value": 30.1
        },
        {
          "timestamp": "03/25",
          "value": 32.4
        },
        {
          "timestamp": "03/26",
          "value": 35.5
        },
        {
          "timestamp": "03/27",
          "value": 36.9
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu076",
    "label": "GPU-076",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 55,
      "memUsage": 32,
      "temp": 74,
      "power": 370,
      "cpuUsage": 48,
      "cpuMemUsage": 60
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 54.8
        },
        {
          "timestamp": "03/15",
          "value": 53.4
        },
        {
          "timestamp": "03/16",
          "value": 57.1
        },
        {
          "timestamp": "03/17",
          "value": 64.2
        },
        {
          "timestamp": "03/18",
          "value": 63.2
        },
        {
          "timestamp": "03/19",
          "value": 62
        },
        {
          "timestamp": "03/20",
          "value": 56.1
        },
        {
          "timestamp": "03/21",
          "value": 49.4
        },
        {
          "timestamp": "03/22",
          "value": 48.6
        },
        {
          "timestamp": "03/23",
          "value": 48.5
        },
        {
          "timestamp": "03/24",
          "value": 49.6
        },
        {
          "timestamp": "03/25",
          "value": 55
        },
        {
          "timestamp": "03/26",
          "value": 54.3
        },
        {
          "timestamp": "03/27",
          "value": 53
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 30.1
        },
        {
          "timestamp": "03/15",
          "value": 32.9
        },
        {
          "timestamp": "03/16",
          "value": 34.1
        },
        {
          "timestamp": "03/17",
          "value": 33.7
        },
        {
          "timestamp": "03/18",
          "value": 33.8
        },
        {
          "timestamp": "03/19",
          "value": 32
        },
        {
          "timestamp": "03/20",
          "value": 34.4
        },
        {
          "timestamp": "03/21",
          "value": 30.4
        },
        {
          "timestamp": "03/22",
          "value": 29.5
        },
        {
          "timestamp": "03/23",
          "value": 27.9
        },
        {
          "timestamp": "03/24",
          "value": 30.8
        },
        {
          "timestamp": "03/25",
          "value": 29.7
        },
        {
          "timestamp": "03/26",
          "value": 29
        },
        {
          "timestamp": "03/27",
          "value": 34.7
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 75.8
        },
        {
          "timestamp": "03/15",
          "value": 76.5
        },
        {
          "timestamp": "03/16",
          "value": 82.5
        },
        {
          "timestamp": "03/17",
          "value": 80.5
        },
        {
          "timestamp": "03/18",
          "value": 81
        },
        {
          "timestamp": "03/19",
          "value": 80.6
        },
        {
          "timestamp": "03/20",
          "value": 76.3
        },
        {
          "timestamp": "03/21",
          "value": 69.7
        },
        {
          "timestamp": "03/22",
          "value": 71.2
        },
        {
          "timestamp": "03/23",
          "value": 68.3
        },
        {
          "timestamp": "03/24",
          "value": 68.1
        },
        {
          "timestamp": "03/25",
          "value": 70.8
        },
        {
          "timestamp": "03/26",
          "value": 70.1
        },
        {
          "timestamp": "03/27",
          "value": 77.5
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 350.8
        },
        {
          "timestamp": "03/15",
          "value": 407
        },
        {
          "timestamp": "03/16",
          "value": 394.2
        },
        {
          "timestamp": "03/17",
          "value": 395.6
        },
        {
          "timestamp": "03/18",
          "value": 404
        },
        {
          "timestamp": "03/19",
          "value": 409.6
        },
        {
          "timestamp": "03/20",
          "value": 371.9
        },
        {
          "timestamp": "03/21",
          "value": 347
        },
        {
          "timestamp": "03/22",
          "value": 325.8
        },
        {
          "timestamp": "03/23",
          "value": 316.2
        },
        {
          "timestamp": "03/24",
          "value": 317.7
        },
        {
          "timestamp": "03/25",
          "value": 355.2
        },
        {
          "timestamp": "03/26",
          "value": 337.5
        },
        {
          "timestamp": "03/27",
          "value": 381.9
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 50
        },
        {
          "timestamp": "03/15",
          "value": 46
        },
        {
          "timestamp": "03/16",
          "value": 53.1
        },
        {
          "timestamp": "03/17",
          "value": 50.6
        },
        {
          "timestamp": "03/18",
          "value": 55.2
        },
        {
          "timestamp": "03/19",
          "value": 49.2
        },
        {
          "timestamp": "03/20",
          "value": 53
        },
        {
          "timestamp": "03/21",
          "value": 45
        },
        {
          "timestamp": "03/22",
          "value": 45.4
        },
        {
          "timestamp": "03/23",
          "value": 45.5
        },
        {
          "timestamp": "03/24",
          "value": 42
        },
        {
          "timestamp": "03/25",
          "value": 46.2
        },
        {
          "timestamp": "03/26",
          "value": 46.4
        },
        {
          "timestamp": "03/27",
          "value": 44.8
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 58
        },
        {
          "timestamp": "03/15",
          "value": 64.3
        },
        {
          "timestamp": "03/16",
          "value": 63.4
        },
        {
          "timestamp": "03/17",
          "value": 64.4
        },
        {
          "timestamp": "03/18",
          "value": 62.1
        },
        {
          "timestamp": "03/19",
          "value": 65
        },
        {
          "timestamp": "03/20",
          "value": 62.4
        },
        {
          "timestamp": "03/21",
          "value": 56.8
        },
        {
          "timestamp": "03/22",
          "value": 52.9
        },
        {
          "timestamp": "03/23",
          "value": 54.8
        },
        {
          "timestamp": "03/24",
          "value": 51.6
        },
        {
          "timestamp": "03/25",
          "value": 52.3
        },
        {
          "timestamp": "03/26",
          "value": 56
        },
        {
          "timestamp": "03/27",
          "value": 61.6
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu077",
    "label": "GPU-077",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "err",
    "current": {
      "gpuUsage": 0,
      "memUsage": 0,
      "temp": 0,
      "power": 0,
      "cpuUsage": 0,
      "cpuMemUsage": 0
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu078",
    "label": "GPU-078",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 48,
      "memUsage": 74,
      "temp": 62,
      "power": 319,
      "cpuUsage": 48,
      "cpuMemUsage": 69
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 46.2
        },
        {
          "timestamp": "03/15",
          "value": 54.3
        },
        {
          "timestamp": "03/16",
          "value": 53.9
        },
        {
          "timestamp": "03/17",
          "value": 48.5
        },
        {
          "timestamp": "03/18",
          "value": 51.5
        },
        {
          "timestamp": "03/19",
          "value": 49
        },
        {
          "timestamp": "03/20",
          "value": 45.4
        },
        {
          "timestamp": "03/21",
          "value": 47.3
        },
        {
          "timestamp": "03/22",
          "value": 48.6
        },
        {
          "timestamp": "03/23",
          "value": 43.9
        },
        {
          "timestamp": "03/24",
          "value": 42.2
        },
        {
          "timestamp": "03/25",
          "value": 41.8
        },
        {
          "timestamp": "03/26",
          "value": 46.2
        },
        {
          "timestamp": "03/27",
          "value": 51.1
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 73.1
        },
        {
          "timestamp": "03/15",
          "value": 77
        },
        {
          "timestamp": "03/16",
          "value": 77.3
        },
        {
          "timestamp": "03/17",
          "value": 76.3
        },
        {
          "timestamp": "03/18",
          "value": 83.9
        },
        {
          "timestamp": "03/19",
          "value": 77.7
        },
        {
          "timestamp": "03/20",
          "value": 73.8
        },
        {
          "timestamp": "03/21",
          "value": 67.8
        },
        {
          "timestamp": "03/22",
          "value": 68.4
        },
        {
          "timestamp": "03/23",
          "value": 67.3
        },
        {
          "timestamp": "03/24",
          "value": 62.8
        },
        {
          "timestamp": "03/25",
          "value": 63.6
        },
        {
          "timestamp": "03/26",
          "value": 73.8
        },
        {
          "timestamp": "03/27",
          "value": 70.5
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 63.4
        },
        {
          "timestamp": "03/15",
          "value": 65.8
        },
        {
          "timestamp": "03/16",
          "value": 65.8
        },
        {
          "timestamp": "03/17",
          "value": 67.4
        },
        {
          "timestamp": "03/18",
          "value": 68.7
        },
        {
          "timestamp": "03/19",
          "value": 65.5
        },
        {
          "timestamp": "03/20",
          "value": 64.8
        },
        {
          "timestamp": "03/21",
          "value": 60.2
        },
        {
          "timestamp": "03/22",
          "value": 59.5
        },
        {
          "timestamp": "03/23",
          "value": 53.7
        },
        {
          "timestamp": "03/24",
          "value": 54.5
        },
        {
          "timestamp": "03/25",
          "value": 59.8
        },
        {
          "timestamp": "03/26",
          "value": 60.7
        },
        {
          "timestamp": "03/27",
          "value": 61
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 325.1
        },
        {
          "timestamp": "03/15",
          "value": 352.1
        },
        {
          "timestamp": "03/16",
          "value": 332.2
        },
        {
          "timestamp": "03/17",
          "value": 366.9
        },
        {
          "timestamp": "03/18",
          "value": 333.2
        },
        {
          "timestamp": "03/19",
          "value": 351.6
        },
        {
          "timestamp": "03/20",
          "value": 330.6
        },
        {
          "timestamp": "03/21",
          "value": 297.2
        },
        {
          "timestamp": "03/22",
          "value": 302.9
        },
        {
          "timestamp": "03/23",
          "value": 283.4
        },
        {
          "timestamp": "03/24",
          "value": 275.5
        },
        {
          "timestamp": "03/25",
          "value": 285.8
        },
        {
          "timestamp": "03/26",
          "value": 326.3
        },
        {
          "timestamp": "03/27",
          "value": 317.4
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 43.3
        },
        {
          "timestamp": "03/15",
          "value": 47.6
        },
        {
          "timestamp": "03/16",
          "value": 52.3
        },
        {
          "timestamp": "03/17",
          "value": 50.5
        },
        {
          "timestamp": "03/18",
          "value": 51.7
        },
        {
          "timestamp": "03/19",
          "value": 50.5
        },
        {
          "timestamp": "03/20",
          "value": 49.6
        },
        {
          "timestamp": "03/21",
          "value": 45.9
        },
        {
          "timestamp": "03/22",
          "value": 45.2
        },
        {
          "timestamp": "03/23",
          "value": 40.6
        },
        {
          "timestamp": "03/24",
          "value": 41.8
        },
        {
          "timestamp": "03/25",
          "value": 45.5
        },
        {
          "timestamp": "03/26",
          "value": 50.2
        },
        {
          "timestamp": "03/27",
          "value": 45.6
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 71.8
        },
        {
          "timestamp": "03/15",
          "value": 74.7
        },
        {
          "timestamp": "03/16",
          "value": 73.3
        },
        {
          "timestamp": "03/17",
          "value": 77.1
        },
        {
          "timestamp": "03/18",
          "value": 79.7
        },
        {
          "timestamp": "03/19",
          "value": 75.1
        },
        {
          "timestamp": "03/20",
          "value": 70.4
        },
        {
          "timestamp": "03/21",
          "value": 64.5
        },
        {
          "timestamp": "03/22",
          "value": 64.6
        },
        {
          "timestamp": "03/23",
          "value": 66.6
        },
        {
          "timestamp": "03/24",
          "value": 67
        },
        {
          "timestamp": "03/25",
          "value": 61.1
        },
        {
          "timestamp": "03/26",
          "value": 64.8
        },
        {
          "timestamp": "03/27",
          "value": 71.5
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu079",
    "label": "GPU-079",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 64,
      "memUsage": 80,
      "temp": 68,
      "power": 584,
      "cpuUsage": 71,
      "cpuMemUsage": 39
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 62.7
        },
        {
          "timestamp": "03/15",
          "value": 68.6
        },
        {
          "timestamp": "03/16",
          "value": 65.7
        },
        {
          "timestamp": "03/17",
          "value": 67.1
        },
        {
          "timestamp": "03/18",
          "value": 71.3
        },
        {
          "timestamp": "03/19",
          "value": 62.8
        },
        {
          "timestamp": "03/20",
          "value": 59.2
        },
        {
          "timestamp": "03/21",
          "value": 58.8
        },
        {
          "timestamp": "03/22",
          "value": 61.6
        },
        {
          "timestamp": "03/23",
          "value": 58.1
        },
        {
          "timestamp": "03/24",
          "value": 59.1
        },
        {
          "timestamp": "03/25",
          "value": 61.5
        },
        {
          "timestamp": "03/26",
          "value": 57.3
        },
        {
          "timestamp": "03/27",
          "value": 69
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 74.5
        },
        {
          "timestamp": "03/15",
          "value": 86.6
        },
        {
          "timestamp": "03/16",
          "value": 80.9
        },
        {
          "timestamp": "03/17",
          "value": 91.3
        },
        {
          "timestamp": "03/18",
          "value": 88.6
        },
        {
          "timestamp": "03/19",
          "value": 90.7
        },
        {
          "timestamp": "03/20",
          "value": 77.2
        },
        {
          "timestamp": "03/21",
          "value": 81
        },
        {
          "timestamp": "03/22",
          "value": 76
        },
        {
          "timestamp": "03/23",
          "value": 68.7
        },
        {
          "timestamp": "03/24",
          "value": 71.9
        },
        {
          "timestamp": "03/25",
          "value": 76.7
        },
        {
          "timestamp": "03/26",
          "value": 80.6
        },
        {
          "timestamp": "03/27",
          "value": 76.9
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 68.6
        },
        {
          "timestamp": "03/15",
          "value": 73.7
        },
        {
          "timestamp": "03/16",
          "value": 73.6
        },
        {
          "timestamp": "03/17",
          "value": 72.3
        },
        {
          "timestamp": "03/18",
          "value": 74.9
        },
        {
          "timestamp": "03/19",
          "value": 72.3
        },
        {
          "timestamp": "03/20",
          "value": 71.3
        },
        {
          "timestamp": "03/21",
          "value": 66.4
        },
        {
          "timestamp": "03/22",
          "value": 63.5
        },
        {
          "timestamp": "03/23",
          "value": 59.4
        },
        {
          "timestamp": "03/24",
          "value": 60
        },
        {
          "timestamp": "03/25",
          "value": 62.3
        },
        {
          "timestamp": "03/26",
          "value": 68.8
        },
        {
          "timestamp": "03/27",
          "value": 68.6
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 568
        },
        {
          "timestamp": "03/15",
          "value": 582.2
        },
        {
          "timestamp": "03/16",
          "value": 618.9
        },
        {
          "timestamp": "03/17",
          "value": 654.7
        },
        {
          "timestamp": "03/18",
          "value": 650.5
        },
        {
          "timestamp": "03/19",
          "value": 623.6
        },
        {
          "timestamp": "03/20",
          "value": 609.5
        },
        {
          "timestamp": "03/21",
          "value": 566.5
        },
        {
          "timestamp": "03/22",
          "value": 544.3
        },
        {
          "timestamp": "03/23",
          "value": 545.7
        },
        {
          "timestamp": "03/24",
          "value": 506.4
        },
        {
          "timestamp": "03/25",
          "value": 545.6
        },
        {
          "timestamp": "03/26",
          "value": 534.4
        },
        {
          "timestamp": "03/27",
          "value": 625.4
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 76.1
        },
        {
          "timestamp": "03/15",
          "value": 76.4
        },
        {
          "timestamp": "03/16",
          "value": 77.9
        },
        {
          "timestamp": "03/17",
          "value": 84.8
        },
        {
          "timestamp": "03/18",
          "value": 78.3
        },
        {
          "timestamp": "03/19",
          "value": 80
        },
        {
          "timestamp": "03/20",
          "value": 68.9
        },
        {
          "timestamp": "03/21",
          "value": 62.6
        },
        {
          "timestamp": "03/22",
          "value": 71.2
        },
        {
          "timestamp": "03/23",
          "value": 62
        },
        {
          "timestamp": "03/24",
          "value": 59
        },
        {
          "timestamp": "03/25",
          "value": 66.6
        },
        {
          "timestamp": "03/26",
          "value": 64.3
        },
        {
          "timestamp": "03/27",
          "value": 71.7
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 37.5
        },
        {
          "timestamp": "03/15",
          "value": 41.4
        },
        {
          "timestamp": "03/16",
          "value": 41.3
        },
        {
          "timestamp": "03/17",
          "value": 42
        },
        {
          "timestamp": "03/18",
          "value": 43.2
        },
        {
          "timestamp": "03/19",
          "value": 40.7
        },
        {
          "timestamp": "03/20",
          "value": 37.9
        },
        {
          "timestamp": "03/21",
          "value": 37.2
        },
        {
          "timestamp": "03/22",
          "value": 33.4
        },
        {
          "timestamp": "03/23",
          "value": 34.2
        },
        {
          "timestamp": "03/24",
          "value": 36.1
        },
        {
          "timestamp": "03/25",
          "value": 36.7
        },
        {
          "timestamp": "03/26",
          "value": 38.5
        },
        {
          "timestamp": "03/27",
          "value": 40.7
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu080",
    "label": "GPU-080",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 64,
      "memUsage": 54,
      "temp": 57,
      "power": 622,
      "cpuUsage": 69,
      "cpuMemUsage": 69
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 58.6
        },
        {
          "timestamp": "03/15",
          "value": 71.5
        },
        {
          "timestamp": "03/16",
          "value": 75
        },
        {
          "timestamp": "03/17",
          "value": 69.2
        },
        {
          "timestamp": "03/18",
          "value": 73.4
        },
        {
          "timestamp": "03/19",
          "value": 72.8
        },
        {
          "timestamp": "03/20",
          "value": 61.2
        },
        {
          "timestamp": "03/21",
          "value": 65.8
        },
        {
          "timestamp": "03/22",
          "value": 58.2
        },
        {
          "timestamp": "03/23",
          "value": 54.1
        },
        {
          "timestamp": "03/24",
          "value": 56.6
        },
        {
          "timestamp": "03/25",
          "value": 64.4
        },
        {
          "timestamp": "03/26",
          "value": 67.3
        },
        {
          "timestamp": "03/27",
          "value": 62
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 50.6
        },
        {
          "timestamp": "03/15",
          "value": 53.4
        },
        {
          "timestamp": "03/16",
          "value": 55.2
        },
        {
          "timestamp": "03/17",
          "value": 57.4
        },
        {
          "timestamp": "03/18",
          "value": 56.1
        },
        {
          "timestamp": "03/19",
          "value": 58.4
        },
        {
          "timestamp": "03/20",
          "value": 51.3
        },
        {
          "timestamp": "03/21",
          "value": 56.1
        },
        {
          "timestamp": "03/22",
          "value": 51.3
        },
        {
          "timestamp": "03/23",
          "value": 52.3
        },
        {
          "timestamp": "03/24",
          "value": 49.1
        },
        {
          "timestamp": "03/25",
          "value": 48.7
        },
        {
          "timestamp": "03/26",
          "value": 52.9
        },
        {
          "timestamp": "03/27",
          "value": 55.2
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 56.3
        },
        {
          "timestamp": "03/15",
          "value": 58.5
        },
        {
          "timestamp": "03/16",
          "value": 59.8
        },
        {
          "timestamp": "03/17",
          "value": 65
        },
        {
          "timestamp": "03/18",
          "value": 63.8
        },
        {
          "timestamp": "03/19",
          "value": 60.7
        },
        {
          "timestamp": "03/20",
          "value": 59.6
        },
        {
          "timestamp": "03/21",
          "value": 56.1
        },
        {
          "timestamp": "03/22",
          "value": 53.3
        },
        {
          "timestamp": "03/23",
          "value": 50.1
        },
        {
          "timestamp": "03/24",
          "value": 52.1
        },
        {
          "timestamp": "03/25",
          "value": 52.4
        },
        {
          "timestamp": "03/26",
          "value": 56.2
        },
        {
          "timestamp": "03/27",
          "value": 57
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 653.5
        },
        {
          "timestamp": "03/15",
          "value": 662
        },
        {
          "timestamp": "03/16",
          "value": 664.6
        },
        {
          "timestamp": "03/17",
          "value": 683.6
        },
        {
          "timestamp": "03/18",
          "value": 655.1
        },
        {
          "timestamp": "03/19",
          "value": 689.6
        },
        {
          "timestamp": "03/20",
          "value": 663.1
        },
        {
          "timestamp": "03/21",
          "value": 629.9
        },
        {
          "timestamp": "03/22",
          "value": 576.3
        },
        {
          "timestamp": "03/23",
          "value": 597.7
        },
        {
          "timestamp": "03/24",
          "value": 554.4
        },
        {
          "timestamp": "03/25",
          "value": 588.6
        },
        {
          "timestamp": "03/26",
          "value": 617
        },
        {
          "timestamp": "03/27",
          "value": 643.6
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 67.1
        },
        {
          "timestamp": "03/15",
          "value": 78.9
        },
        {
          "timestamp": "03/16",
          "value": 70.6
        },
        {
          "timestamp": "03/17",
          "value": 77.7
        },
        {
          "timestamp": "03/18",
          "value": 78.2
        },
        {
          "timestamp": "03/19",
          "value": 70.7
        },
        {
          "timestamp": "03/20",
          "value": 64.9
        },
        {
          "timestamp": "03/21",
          "value": 70.9
        },
        {
          "timestamp": "03/22",
          "value": 58.5
        },
        {
          "timestamp": "03/23",
          "value": 67.9
        },
        {
          "timestamp": "03/24",
          "value": 60.5
        },
        {
          "timestamp": "03/25",
          "value": 57.3
        },
        {
          "timestamp": "03/26",
          "value": 67.3
        },
        {
          "timestamp": "03/27",
          "value": 64.6
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 70.2
        },
        {
          "timestamp": "03/15",
          "value": 74.3
        },
        {
          "timestamp": "03/16",
          "value": 74.4
        },
        {
          "timestamp": "03/17",
          "value": 71.6
        },
        {
          "timestamp": "03/18",
          "value": 75.9
        },
        {
          "timestamp": "03/19",
          "value": 74.9
        },
        {
          "timestamp": "03/20",
          "value": 72.4
        },
        {
          "timestamp": "03/21",
          "value": 64.2
        },
        {
          "timestamp": "03/22",
          "value": 64.2
        },
        {
          "timestamp": "03/23",
          "value": 66.2
        },
        {
          "timestamp": "03/24",
          "value": 58.6
        },
        {
          "timestamp": "03/25",
          "value": 64.3
        },
        {
          "timestamp": "03/26",
          "value": 69.6
        },
        {
          "timestamp": "03/27",
          "value": 68.9
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu081",
    "label": "GPU-081",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 61,
      "memUsage": 62,
      "temp": 60,
      "power": 384,
      "cpuUsage": 39,
      "cpuMemUsage": 38
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 57
        },
        {
          "timestamp": "03/15",
          "value": 68.3
        },
        {
          "timestamp": "03/16",
          "value": 61
        },
        {
          "timestamp": "03/17",
          "value": 69.7
        },
        {
          "timestamp": "03/18",
          "value": 65.3
        },
        {
          "timestamp": "03/19",
          "value": 65.2
        },
        {
          "timestamp": "03/20",
          "value": 59.7
        },
        {
          "timestamp": "03/21",
          "value": 63.1
        },
        {
          "timestamp": "03/22",
          "value": 56.9
        },
        {
          "timestamp": "03/23",
          "value": 56.5
        },
        {
          "timestamp": "03/24",
          "value": 53.7
        },
        {
          "timestamp": "03/25",
          "value": 58.2
        },
        {
          "timestamp": "03/26",
          "value": 63.2
        },
        {
          "timestamp": "03/27",
          "value": 65.4
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 60.6
        },
        {
          "timestamp": "03/15",
          "value": 61.5
        },
        {
          "timestamp": "03/16",
          "value": 63.2
        },
        {
          "timestamp": "03/17",
          "value": 67
        },
        {
          "timestamp": "03/18",
          "value": 64.7
        },
        {
          "timestamp": "03/19",
          "value": 61.3
        },
        {
          "timestamp": "03/20",
          "value": 62.5
        },
        {
          "timestamp": "03/21",
          "value": 56
        },
        {
          "timestamp": "03/22",
          "value": 53.4
        },
        {
          "timestamp": "03/23",
          "value": 58.8
        },
        {
          "timestamp": "03/24",
          "value": 59
        },
        {
          "timestamp": "03/25",
          "value": 53.5
        },
        {
          "timestamp": "03/26",
          "value": 58.5
        },
        {
          "timestamp": "03/27",
          "value": 67.2
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 61.8
        },
        {
          "timestamp": "03/15",
          "value": 60.6
        },
        {
          "timestamp": "03/16",
          "value": 66.3
        },
        {
          "timestamp": "03/17",
          "value": 66.6
        },
        {
          "timestamp": "03/18",
          "value": 64.3
        },
        {
          "timestamp": "03/19",
          "value": 65.7
        },
        {
          "timestamp": "03/20",
          "value": 59.4
        },
        {
          "timestamp": "03/21",
          "value": 57.5
        },
        {
          "timestamp": "03/22",
          "value": 57.1
        },
        {
          "timestamp": "03/23",
          "value": 53.1
        },
        {
          "timestamp": "03/24",
          "value": 52.4
        },
        {
          "timestamp": "03/25",
          "value": 57.3
        },
        {
          "timestamp": "03/26",
          "value": 59.2
        },
        {
          "timestamp": "03/27",
          "value": 61.2
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 363.6
        },
        {
          "timestamp": "03/15",
          "value": 415.6
        },
        {
          "timestamp": "03/16",
          "value": 415.1
        },
        {
          "timestamp": "03/17",
          "value": 400
        },
        {
          "timestamp": "03/18",
          "value": 408
        },
        {
          "timestamp": "03/19",
          "value": 413.5
        },
        {
          "timestamp": "03/20",
          "value": 392.5
        },
        {
          "timestamp": "03/21",
          "value": 369.3
        },
        {
          "timestamp": "03/22",
          "value": 355.2
        },
        {
          "timestamp": "03/23",
          "value": 367.3
        },
        {
          "timestamp": "03/24",
          "value": 324.2
        },
        {
          "timestamp": "03/25",
          "value": 372.8
        },
        {
          "timestamp": "03/26",
          "value": 392
        },
        {
          "timestamp": "03/27",
          "value": 374.5
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 36.2
        },
        {
          "timestamp": "03/15",
          "value": 44.7
        },
        {
          "timestamp": "03/16",
          "value": 46.1
        },
        {
          "timestamp": "03/17",
          "value": 44.1
        },
        {
          "timestamp": "03/18",
          "value": 42
        },
        {
          "timestamp": "03/19",
          "value": 39.8
        },
        {
          "timestamp": "03/20",
          "value": 43.2
        },
        {
          "timestamp": "03/21",
          "value": 40.1
        },
        {
          "timestamp": "03/22",
          "value": 35
        },
        {
          "timestamp": "03/23",
          "value": 37.3
        },
        {
          "timestamp": "03/24",
          "value": 35.7
        },
        {
          "timestamp": "03/25",
          "value": 40
        },
        {
          "timestamp": "03/26",
          "value": 38.2
        },
        {
          "timestamp": "03/27",
          "value": 42.5
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 36
        },
        {
          "timestamp": "03/15",
          "value": 41.4
        },
        {
          "timestamp": "03/16",
          "value": 39.1
        },
        {
          "timestamp": "03/17",
          "value": 39.5
        },
        {
          "timestamp": "03/18",
          "value": 38.9
        },
        {
          "timestamp": "03/19",
          "value": 40.2
        },
        {
          "timestamp": "03/20",
          "value": 37
        },
        {
          "timestamp": "03/21",
          "value": 34.6
        },
        {
          "timestamp": "03/22",
          "value": 36.9
        },
        {
          "timestamp": "03/23",
          "value": 32.2
        },
        {
          "timestamp": "03/24",
          "value": 33.5
        },
        {
          "timestamp": "03/25",
          "value": 34
        },
        {
          "timestamp": "03/26",
          "value": 36.6
        },
        {
          "timestamp": "03/27",
          "value": 40.8
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu082",
    "label": "GPU-082",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 64,
      "memUsage": 68,
      "temp": 61,
      "power": 631,
      "cpuUsage": 48,
      "cpuMemUsage": 65
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 64.5
        },
        {
          "timestamp": "03/15",
          "value": 68.1
        },
        {
          "timestamp": "03/16",
          "value": 70.6
        },
        {
          "timestamp": "03/17",
          "value": 71.8
        },
        {
          "timestamp": "03/18",
          "value": 66.3
        },
        {
          "timestamp": "03/19",
          "value": 68.9
        },
        {
          "timestamp": "03/20",
          "value": 61.5
        },
        {
          "timestamp": "03/21",
          "value": 66.2
        },
        {
          "timestamp": "03/22",
          "value": 56.5
        },
        {
          "timestamp": "03/23",
          "value": 54.2
        },
        {
          "timestamp": "03/24",
          "value": 57.4
        },
        {
          "timestamp": "03/25",
          "value": 62.1
        },
        {
          "timestamp": "03/26",
          "value": 59.4
        },
        {
          "timestamp": "03/27",
          "value": 60.4
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 68.6
        },
        {
          "timestamp": "03/15",
          "value": 72.9
        },
        {
          "timestamp": "03/16",
          "value": 74.2
        },
        {
          "timestamp": "03/17",
          "value": 76.7
        },
        {
          "timestamp": "03/18",
          "value": 72.2
        },
        {
          "timestamp": "03/19",
          "value": 74.2
        },
        {
          "timestamp": "03/20",
          "value": 67.9
        },
        {
          "timestamp": "03/21",
          "value": 68.8
        },
        {
          "timestamp": "03/22",
          "value": 64.6
        },
        {
          "timestamp": "03/23",
          "value": 63.7
        },
        {
          "timestamp": "03/24",
          "value": 62.5
        },
        {
          "timestamp": "03/25",
          "value": 65.2
        },
        {
          "timestamp": "03/26",
          "value": 64.2
        },
        {
          "timestamp": "03/27",
          "value": 68.2
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 62.8
        },
        {
          "timestamp": "03/15",
          "value": 64.1
        },
        {
          "timestamp": "03/16",
          "value": 65.1
        },
        {
          "timestamp": "03/17",
          "value": 64.8
        },
        {
          "timestamp": "03/18",
          "value": 67.9
        },
        {
          "timestamp": "03/19",
          "value": 64.5
        },
        {
          "timestamp": "03/20",
          "value": 64.1
        },
        {
          "timestamp": "03/21",
          "value": 56.7
        },
        {
          "timestamp": "03/22",
          "value": 55.1
        },
        {
          "timestamp": "03/23",
          "value": 56.6
        },
        {
          "timestamp": "03/24",
          "value": 55.2
        },
        {
          "timestamp": "03/25",
          "value": 59.1
        },
        {
          "timestamp": "03/26",
          "value": 59.5
        },
        {
          "timestamp": "03/27",
          "value": 63.2
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 662.9
        },
        {
          "timestamp": "03/15",
          "value": 650.7
        },
        {
          "timestamp": "03/16",
          "value": 719
        },
        {
          "timestamp": "03/17",
          "value": 702.6
        },
        {
          "timestamp": "03/18",
          "value": 681.4
        },
        {
          "timestamp": "03/19",
          "value": 696.3
        },
        {
          "timestamp": "03/20",
          "value": 619.2
        },
        {
          "timestamp": "03/21",
          "value": 596.6
        },
        {
          "timestamp": "03/22",
          "value": 589.5
        },
        {
          "timestamp": "03/23",
          "value": 595.3
        },
        {
          "timestamp": "03/24",
          "value": 584.5
        },
        {
          "timestamp": "03/25",
          "value": 569.9
        },
        {
          "timestamp": "03/26",
          "value": 598.1
        },
        {
          "timestamp": "03/27",
          "value": 624.1
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 48.4
        },
        {
          "timestamp": "03/15",
          "value": 54.2
        },
        {
          "timestamp": "03/16",
          "value": 55.9
        },
        {
          "timestamp": "03/17",
          "value": 56.5
        },
        {
          "timestamp": "03/18",
          "value": 48.7
        },
        {
          "timestamp": "03/19",
          "value": 51.7
        },
        {
          "timestamp": "03/20",
          "value": 49.7
        },
        {
          "timestamp": "03/21",
          "value": 48.1
        },
        {
          "timestamp": "03/22",
          "value": 43.1
        },
        {
          "timestamp": "03/23",
          "value": 42.2
        },
        {
          "timestamp": "03/24",
          "value": 38.7
        },
        {
          "timestamp": "03/25",
          "value": 47.3
        },
        {
          "timestamp": "03/26",
          "value": 50.5
        },
        {
          "timestamp": "03/27",
          "value": 51.3
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 62.5
        },
        {
          "timestamp": "03/15",
          "value": 65.8
        },
        {
          "timestamp": "03/16",
          "value": 66.7
        },
        {
          "timestamp": "03/17",
          "value": 74.4
        },
        {
          "timestamp": "03/18",
          "value": 70.9
        },
        {
          "timestamp": "03/19",
          "value": 67.8
        },
        {
          "timestamp": "03/20",
          "value": 65.7
        },
        {
          "timestamp": "03/21",
          "value": 64.1
        },
        {
          "timestamp": "03/22",
          "value": 63.3
        },
        {
          "timestamp": "03/23",
          "value": 57.8
        },
        {
          "timestamp": "03/24",
          "value": 60.5
        },
        {
          "timestamp": "03/25",
          "value": 62.4
        },
        {
          "timestamp": "03/26",
          "value": 59.2
        },
        {
          "timestamp": "03/27",
          "value": 64.6
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu083",
    "label": "GPU-083",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 46,
      "memUsage": 62,
      "temp": 77,
      "power": 770,
      "cpuUsage": 35,
      "cpuMemUsage": 55
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 48.8
        },
        {
          "timestamp": "03/15",
          "value": 49.8
        },
        {
          "timestamp": "03/16",
          "value": 50.2
        },
        {
          "timestamp": "03/17",
          "value": 50.9
        },
        {
          "timestamp": "03/18",
          "value": 47.9
        },
        {
          "timestamp": "03/19",
          "value": 45.5
        },
        {
          "timestamp": "03/20",
          "value": 44.7
        },
        {
          "timestamp": "03/21",
          "value": 42.4
        },
        {
          "timestamp": "03/22",
          "value": 43
        },
        {
          "timestamp": "03/23",
          "value": 41.2
        },
        {
          "timestamp": "03/24",
          "value": 42.8
        },
        {
          "timestamp": "03/25",
          "value": 45.9
        },
        {
          "timestamp": "03/26",
          "value": 47
        },
        {
          "timestamp": "03/27",
          "value": 45.4
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 62.6
        },
        {
          "timestamp": "03/15",
          "value": 68.2
        },
        {
          "timestamp": "03/16",
          "value": 69.1
        },
        {
          "timestamp": "03/17",
          "value": 68.8
        },
        {
          "timestamp": "03/18",
          "value": 66.6
        },
        {
          "timestamp": "03/19",
          "value": 66.8
        },
        {
          "timestamp": "03/20",
          "value": 66.8
        },
        {
          "timestamp": "03/21",
          "value": 56.1
        },
        {
          "timestamp": "03/22",
          "value": 60.2
        },
        {
          "timestamp": "03/23",
          "value": 54.1
        },
        {
          "timestamp": "03/24",
          "value": 57.6
        },
        {
          "timestamp": "03/25",
          "value": 54.5
        },
        {
          "timestamp": "03/26",
          "value": 61.5
        },
        {
          "timestamp": "03/27",
          "value": 67.5
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 79.3
        },
        {
          "timestamp": "03/15",
          "value": 78.4
        },
        {
          "timestamp": "03/16",
          "value": 86
        },
        {
          "timestamp": "03/17",
          "value": 82.3
        },
        {
          "timestamp": "03/18",
          "value": 82.8
        },
        {
          "timestamp": "03/19",
          "value": 78.9
        },
        {
          "timestamp": "03/20",
          "value": 77.8
        },
        {
          "timestamp": "03/21",
          "value": 76.1
        },
        {
          "timestamp": "03/22",
          "value": 72.7
        },
        {
          "timestamp": "03/23",
          "value": 67.7
        },
        {
          "timestamp": "03/24",
          "value": 71.5
        },
        {
          "timestamp": "03/25",
          "value": 72.1
        },
        {
          "timestamp": "03/26",
          "value": 75.2
        },
        {
          "timestamp": "03/27",
          "value": 79.1
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 814.1
        },
        {
          "timestamp": "03/15",
          "value": 791
        },
        {
          "timestamp": "03/16",
          "value": 850.2
        },
        {
          "timestamp": "03/17",
          "value": 882.8
        },
        {
          "timestamp": "03/18",
          "value": 840.2
        },
        {
          "timestamp": "03/19",
          "value": 773.1
        },
        {
          "timestamp": "03/20",
          "value": 739.2
        },
        {
          "timestamp": "03/21",
          "value": 772.3
        },
        {
          "timestamp": "03/22",
          "value": 697.8
        },
        {
          "timestamp": "03/23",
          "value": 701.5
        },
        {
          "timestamp": "03/24",
          "value": 650.6
        },
        {
          "timestamp": "03/25",
          "value": 721.2
        },
        {
          "timestamp": "03/26",
          "value": 720.9
        },
        {
          "timestamp": "03/27",
          "value": 827.1
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 32.8
        },
        {
          "timestamp": "03/15",
          "value": 35.8
        },
        {
          "timestamp": "03/16",
          "value": 38.7
        },
        {
          "timestamp": "03/17",
          "value": 37.3
        },
        {
          "timestamp": "03/18",
          "value": 34.9
        },
        {
          "timestamp": "03/19",
          "value": 38.8
        },
        {
          "timestamp": "03/20",
          "value": 35.3
        },
        {
          "timestamp": "03/21",
          "value": 33.2
        },
        {
          "timestamp": "03/22",
          "value": 31.4
        },
        {
          "timestamp": "03/23",
          "value": 34.4
        },
        {
          "timestamp": "03/24",
          "value": 30.4
        },
        {
          "timestamp": "03/25",
          "value": 34.5
        },
        {
          "timestamp": "03/26",
          "value": 33.2
        },
        {
          "timestamp": "03/27",
          "value": 37.9
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 55.6
        },
        {
          "timestamp": "03/15",
          "value": 55.1
        },
        {
          "timestamp": "03/16",
          "value": 59.7
        },
        {
          "timestamp": "03/17",
          "value": 63.7
        },
        {
          "timestamp": "03/18",
          "value": 59.3
        },
        {
          "timestamp": "03/19",
          "value": 54.9
        },
        {
          "timestamp": "03/20",
          "value": 59.3
        },
        {
          "timestamp": "03/21",
          "value": 55.7
        },
        {
          "timestamp": "03/22",
          "value": 47.2
        },
        {
          "timestamp": "03/23",
          "value": 49.2
        },
        {
          "timestamp": "03/24",
          "value": 49.2
        },
        {
          "timestamp": "03/25",
          "value": 48.6
        },
        {
          "timestamp": "03/26",
          "value": 52.6
        },
        {
          "timestamp": "03/27",
          "value": 54.2
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu084",
    "label": "GPU-084",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 43,
      "memUsage": 65,
      "temp": 62,
      "power": 358,
      "cpuUsage": 59,
      "cpuMemUsage": 72
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 41.9
        },
        {
          "timestamp": "03/15",
          "value": 47.3
        },
        {
          "timestamp": "03/16",
          "value": 45.1
        },
        {
          "timestamp": "03/17",
          "value": 47.7
        },
        {
          "timestamp": "03/18",
          "value": 45.3
        },
        {
          "timestamp": "03/19",
          "value": 47
        },
        {
          "timestamp": "03/20",
          "value": 42.6
        },
        {
          "timestamp": "03/21",
          "value": 40.5
        },
        {
          "timestamp": "03/22",
          "value": 36.7
        },
        {
          "timestamp": "03/23",
          "value": 35.7
        },
        {
          "timestamp": "03/24",
          "value": 41.5
        },
        {
          "timestamp": "03/25",
          "value": 39.4
        },
        {
          "timestamp": "03/26",
          "value": 42.3
        },
        {
          "timestamp": "03/27",
          "value": 45.3
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 62.6
        },
        {
          "timestamp": "03/15",
          "value": 70.2
        },
        {
          "timestamp": "03/16",
          "value": 69.8
        },
        {
          "timestamp": "03/17",
          "value": 71.3
        },
        {
          "timestamp": "03/18",
          "value": 70.4
        },
        {
          "timestamp": "03/19",
          "value": 69.3
        },
        {
          "timestamp": "03/20",
          "value": 64.3
        },
        {
          "timestamp": "03/21",
          "value": 58.8
        },
        {
          "timestamp": "03/22",
          "value": 57.3
        },
        {
          "timestamp": "03/23",
          "value": 58.7
        },
        {
          "timestamp": "03/24",
          "value": 61.4
        },
        {
          "timestamp": "03/25",
          "value": 65.2
        },
        {
          "timestamp": "03/26",
          "value": 62.1
        },
        {
          "timestamp": "03/27",
          "value": 64.5
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 63.1
        },
        {
          "timestamp": "03/15",
          "value": 62.7
        },
        {
          "timestamp": "03/16",
          "value": 66.6
        },
        {
          "timestamp": "03/17",
          "value": 69.6
        },
        {
          "timestamp": "03/18",
          "value": 66
        },
        {
          "timestamp": "03/19",
          "value": 65.5
        },
        {
          "timestamp": "03/20",
          "value": 63.2
        },
        {
          "timestamp": "03/21",
          "value": 58.5
        },
        {
          "timestamp": "03/22",
          "value": 59.5
        },
        {
          "timestamp": "03/23",
          "value": 57.2
        },
        {
          "timestamp": "03/24",
          "value": 53.6
        },
        {
          "timestamp": "03/25",
          "value": 57.9
        },
        {
          "timestamp": "03/26",
          "value": 61.4
        },
        {
          "timestamp": "03/27",
          "value": 63.7
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 345.9
        },
        {
          "timestamp": "03/15",
          "value": 378.6
        },
        {
          "timestamp": "03/16",
          "value": 398.6
        },
        {
          "timestamp": "03/17",
          "value": 374.7
        },
        {
          "timestamp": "03/18",
          "value": 393
        },
        {
          "timestamp": "03/19",
          "value": 372.1
        },
        {
          "timestamp": "03/20",
          "value": 376.6
        },
        {
          "timestamp": "03/21",
          "value": 342.5
        },
        {
          "timestamp": "03/22",
          "value": 336.4
        },
        {
          "timestamp": "03/23",
          "value": 308.6
        },
        {
          "timestamp": "03/24",
          "value": 304.4
        },
        {
          "timestamp": "03/25",
          "value": 340
        },
        {
          "timestamp": "03/26",
          "value": 342.3
        },
        {
          "timestamp": "03/27",
          "value": 349
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 57.2
        },
        {
          "timestamp": "03/15",
          "value": 67.3
        },
        {
          "timestamp": "03/16",
          "value": 67.8
        },
        {
          "timestamp": "03/17",
          "value": 62.1
        },
        {
          "timestamp": "03/18",
          "value": 69.8
        },
        {
          "timestamp": "03/19",
          "value": 64.3
        },
        {
          "timestamp": "03/20",
          "value": 60.4
        },
        {
          "timestamp": "03/21",
          "value": 60.2
        },
        {
          "timestamp": "03/22",
          "value": 49.2
        },
        {
          "timestamp": "03/23",
          "value": 52.3
        },
        {
          "timestamp": "03/24",
          "value": 48.5
        },
        {
          "timestamp": "03/25",
          "value": 50.5
        },
        {
          "timestamp": "03/26",
          "value": 62.9
        },
        {
          "timestamp": "03/27",
          "value": 56.9
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 67.8
        },
        {
          "timestamp": "03/15",
          "value": 77.4
        },
        {
          "timestamp": "03/16",
          "value": 82.5
        },
        {
          "timestamp": "03/17",
          "value": 76.8
        },
        {
          "timestamp": "03/18",
          "value": 81.2
        },
        {
          "timestamp": "03/19",
          "value": 80.4
        },
        {
          "timestamp": "03/20",
          "value": 76
        },
        {
          "timestamp": "03/21",
          "value": 67.7
        },
        {
          "timestamp": "03/22",
          "value": 71.1
        },
        {
          "timestamp": "03/23",
          "value": 67.5
        },
        {
          "timestamp": "03/24",
          "value": 60.5
        },
        {
          "timestamp": "03/25",
          "value": 70
        },
        {
          "timestamp": "03/26",
          "value": 74.3
        },
        {
          "timestamp": "03/27",
          "value": 73.8
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu085",
    "label": "GPU-085",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 49,
      "memUsage": 35,
      "temp": 61,
      "power": 763,
      "cpuUsage": 32,
      "cpuMemUsage": 53
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 47.2
        },
        {
          "timestamp": "03/15",
          "value": 47.1
        },
        {
          "timestamp": "03/16",
          "value": 56.7
        },
        {
          "timestamp": "03/17",
          "value": 57.3
        },
        {
          "timestamp": "03/18",
          "value": 57.8
        },
        {
          "timestamp": "03/19",
          "value": 51.4
        },
        {
          "timestamp": "03/20",
          "value": 48.1
        },
        {
          "timestamp": "03/21",
          "value": 47
        },
        {
          "timestamp": "03/22",
          "value": 44.9
        },
        {
          "timestamp": "03/23",
          "value": 48.1
        },
        {
          "timestamp": "03/24",
          "value": 39.9
        },
        {
          "timestamp": "03/25",
          "value": 49.2
        },
        {
          "timestamp": "03/26",
          "value": 44
        },
        {
          "timestamp": "03/27",
          "value": 48.9
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 33.6
        },
        {
          "timestamp": "03/15",
          "value": 36.6
        },
        {
          "timestamp": "03/16",
          "value": 39.7
        },
        {
          "timestamp": "03/17",
          "value": 40.1
        },
        {
          "timestamp": "03/18",
          "value": 37.1
        },
        {
          "timestamp": "03/19",
          "value": 38.3
        },
        {
          "timestamp": "03/20",
          "value": 36
        },
        {
          "timestamp": "03/21",
          "value": 34.5
        },
        {
          "timestamp": "03/22",
          "value": 33.9
        },
        {
          "timestamp": "03/23",
          "value": 31.4
        },
        {
          "timestamp": "03/24",
          "value": 29.9
        },
        {
          "timestamp": "03/25",
          "value": 34.8
        },
        {
          "timestamp": "03/26",
          "value": 33
        },
        {
          "timestamp": "03/27",
          "value": 36.9
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 59.9
        },
        {
          "timestamp": "03/15",
          "value": 66.1
        },
        {
          "timestamp": "03/16",
          "value": 64
        },
        {
          "timestamp": "03/17",
          "value": 66
        },
        {
          "timestamp": "03/18",
          "value": 65.8
        },
        {
          "timestamp": "03/19",
          "value": 63.2
        },
        {
          "timestamp": "03/20",
          "value": 63.2
        },
        {
          "timestamp": "03/21",
          "value": 57.1
        },
        {
          "timestamp": "03/22",
          "value": 55.1
        },
        {
          "timestamp": "03/23",
          "value": 53.9
        },
        {
          "timestamp": "03/24",
          "value": 53.8
        },
        {
          "timestamp": "03/25",
          "value": 54.9
        },
        {
          "timestamp": "03/26",
          "value": 58.1
        },
        {
          "timestamp": "03/27",
          "value": 62.3
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 770.9
        },
        {
          "timestamp": "03/15",
          "value": 754.4
        },
        {
          "timestamp": "03/16",
          "value": 811.9
        },
        {
          "timestamp": "03/17",
          "value": 815.2
        },
        {
          "timestamp": "03/18",
          "value": 861.7
        },
        {
          "timestamp": "03/19",
          "value": 787.2
        },
        {
          "timestamp": "03/20",
          "value": 800.5
        },
        {
          "timestamp": "03/21",
          "value": 694.8
        },
        {
          "timestamp": "03/22",
          "value": 692.1
        },
        {
          "timestamp": "03/23",
          "value": 677.3
        },
        {
          "timestamp": "03/24",
          "value": 649.9
        },
        {
          "timestamp": "03/25",
          "value": 705.8
        },
        {
          "timestamp": "03/26",
          "value": 781.7
        },
        {
          "timestamp": "03/27",
          "value": 802.2
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 31.5
        },
        {
          "timestamp": "03/15",
          "value": 35
        },
        {
          "timestamp": "03/16",
          "value": 34.1
        },
        {
          "timestamp": "03/17",
          "value": 32.5
        },
        {
          "timestamp": "03/18",
          "value": 33.5
        },
        {
          "timestamp": "03/19",
          "value": 34.7
        },
        {
          "timestamp": "03/20",
          "value": 34.8
        },
        {
          "timestamp": "03/21",
          "value": 29.3
        },
        {
          "timestamp": "03/22",
          "value": 27.9
        },
        {
          "timestamp": "03/23",
          "value": 31.5
        },
        {
          "timestamp": "03/24",
          "value": 30.9
        },
        {
          "timestamp": "03/25",
          "value": 27.1
        },
        {
          "timestamp": "03/26",
          "value": 30.4
        },
        {
          "timestamp": "03/27",
          "value": 31.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 53.3
        },
        {
          "timestamp": "03/15",
          "value": 55
        },
        {
          "timestamp": "03/16",
          "value": 54.5
        },
        {
          "timestamp": "03/17",
          "value": 58.8
        },
        {
          "timestamp": "03/18",
          "value": 57.8
        },
        {
          "timestamp": "03/19",
          "value": 55.1
        },
        {
          "timestamp": "03/20",
          "value": 56
        },
        {
          "timestamp": "03/21",
          "value": 48.3
        },
        {
          "timestamp": "03/22",
          "value": 51.4
        },
        {
          "timestamp": "03/23",
          "value": 45.9
        },
        {
          "timestamp": "03/24",
          "value": 51.2
        },
        {
          "timestamp": "03/25",
          "value": 48.3
        },
        {
          "timestamp": "03/26",
          "value": 52.2
        },
        {
          "timestamp": "03/27",
          "value": 53.7
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu086",
    "label": "GPU-086",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 81,
      "memUsage": 51,
      "temp": 77,
      "power": 389,
      "cpuUsage": 65,
      "cpuMemUsage": 33
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 84.7
        },
        {
          "timestamp": "03/15",
          "value": 81.6
        },
        {
          "timestamp": "03/16",
          "value": 92
        },
        {
          "timestamp": "03/17",
          "value": 82.8
        },
        {
          "timestamp": "03/18",
          "value": 92.6
        },
        {
          "timestamp": "03/19",
          "value": 84.2
        },
        {
          "timestamp": "03/20",
          "value": 76.3
        },
        {
          "timestamp": "03/21",
          "value": 72.8
        },
        {
          "timestamp": "03/22",
          "value": 68.2
        },
        {
          "timestamp": "03/23",
          "value": 70
        },
        {
          "timestamp": "03/24",
          "value": 71.8
        },
        {
          "timestamp": "03/25",
          "value": 75.3
        },
        {
          "timestamp": "03/26",
          "value": 75.5
        },
        {
          "timestamp": "03/27",
          "value": 88.6
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 47.8
        },
        {
          "timestamp": "03/15",
          "value": 50.3
        },
        {
          "timestamp": "03/16",
          "value": 54.8
        },
        {
          "timestamp": "03/17",
          "value": 58.5
        },
        {
          "timestamp": "03/18",
          "value": 57.2
        },
        {
          "timestamp": "03/19",
          "value": 53.8
        },
        {
          "timestamp": "03/20",
          "value": 51.7
        },
        {
          "timestamp": "03/21",
          "value": 49.4
        },
        {
          "timestamp": "03/22",
          "value": 47
        },
        {
          "timestamp": "03/23",
          "value": 49
        },
        {
          "timestamp": "03/24",
          "value": 44.7
        },
        {
          "timestamp": "03/25",
          "value": 48.6
        },
        {
          "timestamp": "03/26",
          "value": 51.3
        },
        {
          "timestamp": "03/27",
          "value": 55.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 74.8
        },
        {
          "timestamp": "03/15",
          "value": 78.2
        },
        {
          "timestamp": "03/16",
          "value": 85.5
        },
        {
          "timestamp": "03/17",
          "value": 85.6
        },
        {
          "timestamp": "03/18",
          "value": 85.5
        },
        {
          "timestamp": "03/19",
          "value": 83.4
        },
        {
          "timestamp": "03/20",
          "value": 80.6
        },
        {
          "timestamp": "03/21",
          "value": 71.6
        },
        {
          "timestamp": "03/22",
          "value": 70.5
        },
        {
          "timestamp": "03/23",
          "value": 70.5
        },
        {
          "timestamp": "03/24",
          "value": 68.9
        },
        {
          "timestamp": "03/25",
          "value": 72.6
        },
        {
          "timestamp": "03/26",
          "value": 75.3
        },
        {
          "timestamp": "03/27",
          "value": 78.6
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 387.6
        },
        {
          "timestamp": "03/15",
          "value": 398.8
        },
        {
          "timestamp": "03/16",
          "value": 405.2
        },
        {
          "timestamp": "03/17",
          "value": 417.1
        },
        {
          "timestamp": "03/18",
          "value": 422.4
        },
        {
          "timestamp": "03/19",
          "value": 397
        },
        {
          "timestamp": "03/20",
          "value": 378.4
        },
        {
          "timestamp": "03/21",
          "value": 389.6
        },
        {
          "timestamp": "03/22",
          "value": 369.1
        },
        {
          "timestamp": "03/23",
          "value": 340.9
        },
        {
          "timestamp": "03/24",
          "value": 337.8
        },
        {
          "timestamp": "03/25",
          "value": 356.1
        },
        {
          "timestamp": "03/26",
          "value": 399.6
        },
        {
          "timestamp": "03/27",
          "value": 415.6
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 63.4
        },
        {
          "timestamp": "03/15",
          "value": 69.3
        },
        {
          "timestamp": "03/16",
          "value": 76
        },
        {
          "timestamp": "03/17",
          "value": 68.4
        },
        {
          "timestamp": "03/18",
          "value": 67.8
        },
        {
          "timestamp": "03/19",
          "value": 63.2
        },
        {
          "timestamp": "03/20",
          "value": 66.5
        },
        {
          "timestamp": "03/21",
          "value": 67.7
        },
        {
          "timestamp": "03/22",
          "value": 55.3
        },
        {
          "timestamp": "03/23",
          "value": 55.4
        },
        {
          "timestamp": "03/24",
          "value": 58.4
        },
        {
          "timestamp": "03/25",
          "value": 55.8
        },
        {
          "timestamp": "03/26",
          "value": 62.7
        },
        {
          "timestamp": "03/27",
          "value": 68.5
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 32
        },
        {
          "timestamp": "03/15",
          "value": 32.5
        },
        {
          "timestamp": "03/16",
          "value": 38
        },
        {
          "timestamp": "03/17",
          "value": 37.4
        },
        {
          "timestamp": "03/18",
          "value": 35.4
        },
        {
          "timestamp": "03/19",
          "value": 34.4
        },
        {
          "timestamp": "03/20",
          "value": 34.3
        },
        {
          "timestamp": "03/21",
          "value": 33.9
        },
        {
          "timestamp": "03/22",
          "value": 29
        },
        {
          "timestamp": "03/23",
          "value": 29.5
        },
        {
          "timestamp": "03/24",
          "value": 30.5
        },
        {
          "timestamp": "03/25",
          "value": 32.9
        },
        {
          "timestamp": "03/26",
          "value": 32
        },
        {
          "timestamp": "03/27",
          "value": 35.1
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu087",
    "label": "GPU-087",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 41,
      "memUsage": 29,
      "temp": 69,
      "power": 502,
      "cpuUsage": 48,
      "cpuMemUsage": 35
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 37.4
        },
        {
          "timestamp": "03/15",
          "value": 44.5
        },
        {
          "timestamp": "03/16",
          "value": 41.3
        },
        {
          "timestamp": "03/17",
          "value": 47.7
        },
        {
          "timestamp": "03/18",
          "value": 41.5
        },
        {
          "timestamp": "03/19",
          "value": 43.2
        },
        {
          "timestamp": "03/20",
          "value": 38.3
        },
        {
          "timestamp": "03/21",
          "value": 40.1
        },
        {
          "timestamp": "03/22",
          "value": 39.5
        },
        {
          "timestamp": "03/23",
          "value": 34.2
        },
        {
          "timestamp": "03/24",
          "value": 35.7
        },
        {
          "timestamp": "03/25",
          "value": 38.9
        },
        {
          "timestamp": "03/26",
          "value": 39.5
        },
        {
          "timestamp": "03/27",
          "value": 42.9
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 28.8
        },
        {
          "timestamp": "03/15",
          "value": 30.3
        },
        {
          "timestamp": "03/16",
          "value": 30.4
        },
        {
          "timestamp": "03/17",
          "value": 30.5
        },
        {
          "timestamp": "03/18",
          "value": 33
        },
        {
          "timestamp": "03/19",
          "value": 30.6
        },
        {
          "timestamp": "03/20",
          "value": 31.2
        },
        {
          "timestamp": "03/21",
          "value": 29
        },
        {
          "timestamp": "03/22",
          "value": 26
        },
        {
          "timestamp": "03/23",
          "value": 25.8
        },
        {
          "timestamp": "03/24",
          "value": 24.6
        },
        {
          "timestamp": "03/25",
          "value": 28.9
        },
        {
          "timestamp": "03/26",
          "value": 30.2
        },
        {
          "timestamp": "03/27",
          "value": 27.9
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 66.9
        },
        {
          "timestamp": "03/15",
          "value": 72.5
        },
        {
          "timestamp": "03/16",
          "value": 76.4
        },
        {
          "timestamp": "03/17",
          "value": 75.1
        },
        {
          "timestamp": "03/18",
          "value": 75.9
        },
        {
          "timestamp": "03/19",
          "value": 72.8
        },
        {
          "timestamp": "03/20",
          "value": 71.8
        },
        {
          "timestamp": "03/21",
          "value": 66.9
        },
        {
          "timestamp": "03/22",
          "value": 63.4
        },
        {
          "timestamp": "03/23",
          "value": 60
        },
        {
          "timestamp": "03/24",
          "value": 63.1
        },
        {
          "timestamp": "03/25",
          "value": 62.9
        },
        {
          "timestamp": "03/26",
          "value": 65.4
        },
        {
          "timestamp": "03/27",
          "value": 70.1
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 513.5
        },
        {
          "timestamp": "03/15",
          "value": 499.4
        },
        {
          "timestamp": "03/16",
          "value": 560.4
        },
        {
          "timestamp": "03/17",
          "value": 546
        },
        {
          "timestamp": "03/18",
          "value": 543.3
        },
        {
          "timestamp": "03/19",
          "value": 551
        },
        {
          "timestamp": "03/20",
          "value": 491.9
        },
        {
          "timestamp": "03/21",
          "value": 487
        },
        {
          "timestamp": "03/22",
          "value": 442.9
        },
        {
          "timestamp": "03/23",
          "value": 477.8
        },
        {
          "timestamp": "03/24",
          "value": 481.3
        },
        {
          "timestamp": "03/25",
          "value": 437.6
        },
        {
          "timestamp": "03/26",
          "value": 469
        },
        {
          "timestamp": "03/27",
          "value": 520.5
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 43.6
        },
        {
          "timestamp": "03/15",
          "value": 45.6
        },
        {
          "timestamp": "03/16",
          "value": 53.9
        },
        {
          "timestamp": "03/17",
          "value": 52.8
        },
        {
          "timestamp": "03/18",
          "value": 53.4
        },
        {
          "timestamp": "03/19",
          "value": 46.7
        },
        {
          "timestamp": "03/20",
          "value": 44.6
        },
        {
          "timestamp": "03/21",
          "value": 48.3
        },
        {
          "timestamp": "03/22",
          "value": 40.1
        },
        {
          "timestamp": "03/23",
          "value": 40.6
        },
        {
          "timestamp": "03/24",
          "value": 41
        },
        {
          "timestamp": "03/25",
          "value": 43.5
        },
        {
          "timestamp": "03/26",
          "value": 50.4
        },
        {
          "timestamp": "03/27",
          "value": 48.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 36
        },
        {
          "timestamp": "03/15",
          "value": 35.2
        },
        {
          "timestamp": "03/16",
          "value": 35.5
        },
        {
          "timestamp": "03/17",
          "value": 40.2
        },
        {
          "timestamp": "03/18",
          "value": 36.4
        },
        {
          "timestamp": "03/19",
          "value": 36.9
        },
        {
          "timestamp": "03/20",
          "value": 37.1
        },
        {
          "timestamp": "03/21",
          "value": 33.9
        },
        {
          "timestamp": "03/22",
          "value": 33.6
        },
        {
          "timestamp": "03/23",
          "value": 32.6
        },
        {
          "timestamp": "03/24",
          "value": 30.2
        },
        {
          "timestamp": "03/25",
          "value": 32.2
        },
        {
          "timestamp": "03/26",
          "value": 36
        },
        {
          "timestamp": "03/27",
          "value": 33.4
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu088",
    "label": "GPU-088",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "warn",
    "current": {
      "gpuUsage": 87,
      "memUsage": 90,
      "temp": 88,
      "power": 984,
      "cpuUsage": 41,
      "cpuMemUsage": 44
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 85.8
        },
        {
          "timestamp": "03/15",
          "value": 87.7
        },
        {
          "timestamp": "03/16",
          "value": 91.7
        },
        {
          "timestamp": "03/17",
          "value": 102.9
        },
        {
          "timestamp": "03/18",
          "value": 101.8
        },
        {
          "timestamp": "03/19",
          "value": 85.2
        },
        {
          "timestamp": "03/20",
          "value": 88.2
        },
        {
          "timestamp": "03/21",
          "value": 90.5
        },
        {
          "timestamp": "03/22",
          "value": 78.5
        },
        {
          "timestamp": "03/23",
          "value": 78.3
        },
        {
          "timestamp": "03/24",
          "value": 86.1
        },
        {
          "timestamp": "03/25",
          "value": 78.3
        },
        {
          "timestamp": "03/26",
          "value": 83.9
        },
        {
          "timestamp": "03/27",
          "value": 86.1
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 95.3
        },
        {
          "timestamp": "03/15",
          "value": 99.6
        },
        {
          "timestamp": "03/16",
          "value": 100.4
        },
        {
          "timestamp": "03/17",
          "value": 98.3
        },
        {
          "timestamp": "03/18",
          "value": 103.4
        },
        {
          "timestamp": "03/19",
          "value": 96.8
        },
        {
          "timestamp": "03/20",
          "value": 88.5
        },
        {
          "timestamp": "03/21",
          "value": 81.7
        },
        {
          "timestamp": "03/22",
          "value": 89.9
        },
        {
          "timestamp": "03/23",
          "value": 76.1
        },
        {
          "timestamp": "03/24",
          "value": 76.6
        },
        {
          "timestamp": "03/25",
          "value": 88.3
        },
        {
          "timestamp": "03/26",
          "value": 90.1
        },
        {
          "timestamp": "03/27",
          "value": 96.6
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 84.7
        },
        {
          "timestamp": "03/15",
          "value": 93.7
        },
        {
          "timestamp": "03/16",
          "value": 93
        },
        {
          "timestamp": "03/17",
          "value": 96.5
        },
        {
          "timestamp": "03/18",
          "value": 98.9
        },
        {
          "timestamp": "03/19",
          "value": 96.1
        },
        {
          "timestamp": "03/20",
          "value": 88.3
        },
        {
          "timestamp": "03/21",
          "value": 81.6
        },
        {
          "timestamp": "03/22",
          "value": 81.6
        },
        {
          "timestamp": "03/23",
          "value": 78.2
        },
        {
          "timestamp": "03/24",
          "value": 77.8
        },
        {
          "timestamp": "03/25",
          "value": 84.6
        },
        {
          "timestamp": "03/26",
          "value": 83.4
        },
        {
          "timestamp": "03/27",
          "value": 89.2
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 1037.9
        },
        {
          "timestamp": "03/15",
          "value": 973.3
        },
        {
          "timestamp": "03/16",
          "value": 1041.5
        },
        {
          "timestamp": "03/17",
          "value": 1038.9
        },
        {
          "timestamp": "03/18",
          "value": 1063
        },
        {
          "timestamp": "03/19",
          "value": 986.4
        },
        {
          "timestamp": "03/20",
          "value": 1047.9
        },
        {
          "timestamp": "03/21",
          "value": 994.7
        },
        {
          "timestamp": "03/22",
          "value": 904.1
        },
        {
          "timestamp": "03/23",
          "value": 858.2
        },
        {
          "timestamp": "03/24",
          "value": 881.1
        },
        {
          "timestamp": "03/25",
          "value": 957.3
        },
        {
          "timestamp": "03/26",
          "value": 995.5
        },
        {
          "timestamp": "03/27",
          "value": 1054.3
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 40.5
        },
        {
          "timestamp": "03/15",
          "value": 43.3
        },
        {
          "timestamp": "03/16",
          "value": 44.4
        },
        {
          "timestamp": "03/17",
          "value": 43.7
        },
        {
          "timestamp": "03/18",
          "value": 43.3
        },
        {
          "timestamp": "03/19",
          "value": 42.5
        },
        {
          "timestamp": "03/20",
          "value": 44.4
        },
        {
          "timestamp": "03/21",
          "value": 42.3
        },
        {
          "timestamp": "03/22",
          "value": 35.3
        },
        {
          "timestamp": "03/23",
          "value": 34.2
        },
        {
          "timestamp": "03/24",
          "value": 37.8
        },
        {
          "timestamp": "03/25",
          "value": 41.5
        },
        {
          "timestamp": "03/26",
          "value": 41.1
        },
        {
          "timestamp": "03/27",
          "value": 39.5
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 42.4
        },
        {
          "timestamp": "03/15",
          "value": 47.4
        },
        {
          "timestamp": "03/16",
          "value": 49.1
        },
        {
          "timestamp": "03/17",
          "value": 48.5
        },
        {
          "timestamp": "03/18",
          "value": 48.8
        },
        {
          "timestamp": "03/19",
          "value": 46.8
        },
        {
          "timestamp": "03/20",
          "value": 42.9
        },
        {
          "timestamp": "03/21",
          "value": 40.5
        },
        {
          "timestamp": "03/22",
          "value": 40.7
        },
        {
          "timestamp": "03/23",
          "value": 39.4
        },
        {
          "timestamp": "03/24",
          "value": 41.4
        },
        {
          "timestamp": "03/25",
          "value": 41.8
        },
        {
          "timestamp": "03/26",
          "value": 42.6
        },
        {
          "timestamp": "03/27",
          "value": 47.8
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu089",
    "label": "GPU-089",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 79,
      "memUsage": 49,
      "temp": 57,
      "power": 603,
      "cpuUsage": 69,
      "cpuMemUsage": 43
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 84.2
        },
        {
          "timestamp": "03/15",
          "value": 89.5
        },
        {
          "timestamp": "03/16",
          "value": 83.5
        },
        {
          "timestamp": "03/17",
          "value": 87.9
        },
        {
          "timestamp": "03/18",
          "value": 82.1
        },
        {
          "timestamp": "03/19",
          "value": 82.5
        },
        {
          "timestamp": "03/20",
          "value": 74.5
        },
        {
          "timestamp": "03/21",
          "value": 81.3
        },
        {
          "timestamp": "03/22",
          "value": 78.4
        },
        {
          "timestamp": "03/23",
          "value": 72.6
        },
        {
          "timestamp": "03/24",
          "value": 65.1
        },
        {
          "timestamp": "03/25",
          "value": 66.4
        },
        {
          "timestamp": "03/26",
          "value": 77.6
        },
        {
          "timestamp": "03/27",
          "value": 73.8
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 49.6
        },
        {
          "timestamp": "03/15",
          "value": 50.8
        },
        {
          "timestamp": "03/16",
          "value": 51.8
        },
        {
          "timestamp": "03/17",
          "value": 53.8
        },
        {
          "timestamp": "03/18",
          "value": 55.7
        },
        {
          "timestamp": "03/19",
          "value": 52.8
        },
        {
          "timestamp": "03/20",
          "value": 47.4
        },
        {
          "timestamp": "03/21",
          "value": 44.8
        },
        {
          "timestamp": "03/22",
          "value": 43.6
        },
        {
          "timestamp": "03/23",
          "value": 45.1
        },
        {
          "timestamp": "03/24",
          "value": 47.5
        },
        {
          "timestamp": "03/25",
          "value": 48.1
        },
        {
          "timestamp": "03/26",
          "value": 45.5
        },
        {
          "timestamp": "03/27",
          "value": 50.8
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 56.5
        },
        {
          "timestamp": "03/15",
          "value": 61.9
        },
        {
          "timestamp": "03/16",
          "value": 61.1
        },
        {
          "timestamp": "03/17",
          "value": 63.8
        },
        {
          "timestamp": "03/18",
          "value": 61.8
        },
        {
          "timestamp": "03/19",
          "value": 61.3
        },
        {
          "timestamp": "03/20",
          "value": 57.9
        },
        {
          "timestamp": "03/21",
          "value": 53.2
        },
        {
          "timestamp": "03/22",
          "value": 50.6
        },
        {
          "timestamp": "03/23",
          "value": 49.5
        },
        {
          "timestamp": "03/24",
          "value": 50.6
        },
        {
          "timestamp": "03/25",
          "value": 51.2
        },
        {
          "timestamp": "03/26",
          "value": 54.7
        },
        {
          "timestamp": "03/27",
          "value": 60.5
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 584.9
        },
        {
          "timestamp": "03/15",
          "value": 646.2
        },
        {
          "timestamp": "03/16",
          "value": 671.1
        },
        {
          "timestamp": "03/17",
          "value": 628.5
        },
        {
          "timestamp": "03/18",
          "value": 632.9
        },
        {
          "timestamp": "03/19",
          "value": 674.9
        },
        {
          "timestamp": "03/20",
          "value": 620.7
        },
        {
          "timestamp": "03/21",
          "value": 597.5
        },
        {
          "timestamp": "03/22",
          "value": 574.6
        },
        {
          "timestamp": "03/23",
          "value": 574.3
        },
        {
          "timestamp": "03/24",
          "value": 557.5
        },
        {
          "timestamp": "03/25",
          "value": 591.7
        },
        {
          "timestamp": "03/26",
          "value": 580
        },
        {
          "timestamp": "03/27",
          "value": 650.8
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 72.8
        },
        {
          "timestamp": "03/15",
          "value": 68
        },
        {
          "timestamp": "03/16",
          "value": 74.4
        },
        {
          "timestamp": "03/17",
          "value": 75.8
        },
        {
          "timestamp": "03/18",
          "value": 80
        },
        {
          "timestamp": "03/19",
          "value": 67.9
        },
        {
          "timestamp": "03/20",
          "value": 72.7
        },
        {
          "timestamp": "03/21",
          "value": 73.4
        },
        {
          "timestamp": "03/22",
          "value": 61.4
        },
        {
          "timestamp": "03/23",
          "value": 64.9
        },
        {
          "timestamp": "03/24",
          "value": 64.5
        },
        {
          "timestamp": "03/25",
          "value": 59.9
        },
        {
          "timestamp": "03/26",
          "value": 73.6
        },
        {
          "timestamp": "03/27",
          "value": 69.9
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 43.2
        },
        {
          "timestamp": "03/15",
          "value": 46.5
        },
        {
          "timestamp": "03/16",
          "value": 49.6
        },
        {
          "timestamp": "03/17",
          "value": 44.8
        },
        {
          "timestamp": "03/18",
          "value": 46.6
        },
        {
          "timestamp": "03/19",
          "value": 47.9
        },
        {
          "timestamp": "03/20",
          "value": 45.9
        },
        {
          "timestamp": "03/21",
          "value": 42.9
        },
        {
          "timestamp": "03/22",
          "value": 36.8
        },
        {
          "timestamp": "03/23",
          "value": 37.7
        },
        {
          "timestamp": "03/24",
          "value": 37.6
        },
        {
          "timestamp": "03/25",
          "value": 38.4
        },
        {
          "timestamp": "03/26",
          "value": 39.6
        },
        {
          "timestamp": "03/27",
          "value": 45.8
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu090",
    "label": "GPU-090",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 37,
      "memUsage": 58,
      "temp": 77,
      "power": 284,
      "cpuUsage": 71,
      "cpuMemUsage": 39
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 40.3
        },
        {
          "timestamp": "03/15",
          "value": 35.7
        },
        {
          "timestamp": "03/16",
          "value": 37.9
        },
        {
          "timestamp": "03/17",
          "value": 37.9
        },
        {
          "timestamp": "03/18",
          "value": 42.7
        },
        {
          "timestamp": "03/19",
          "value": 37
        },
        {
          "timestamp": "03/20",
          "value": 36
        },
        {
          "timestamp": "03/21",
          "value": 37.3
        },
        {
          "timestamp": "03/22",
          "value": 34.5
        },
        {
          "timestamp": "03/23",
          "value": 35.3
        },
        {
          "timestamp": "03/24",
          "value": 31.9
        },
        {
          "timestamp": "03/25",
          "value": 32.7
        },
        {
          "timestamp": "03/26",
          "value": 38.2
        },
        {
          "timestamp": "03/27",
          "value": 40
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 58.6
        },
        {
          "timestamp": "03/15",
          "value": 56.5
        },
        {
          "timestamp": "03/16",
          "value": 60.6
        },
        {
          "timestamp": "03/17",
          "value": 65.1
        },
        {
          "timestamp": "03/18",
          "value": 66.6
        },
        {
          "timestamp": "03/19",
          "value": 64.6
        },
        {
          "timestamp": "03/20",
          "value": 54.9
        },
        {
          "timestamp": "03/21",
          "value": 52.8
        },
        {
          "timestamp": "03/22",
          "value": 57.4
        },
        {
          "timestamp": "03/23",
          "value": 52.6
        },
        {
          "timestamp": "03/24",
          "value": 52.2
        },
        {
          "timestamp": "03/25",
          "value": 51.5
        },
        {
          "timestamp": "03/26",
          "value": 56.8
        },
        {
          "timestamp": "03/27",
          "value": 62.3
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 77.6
        },
        {
          "timestamp": "03/15",
          "value": 83.4
        },
        {
          "timestamp": "03/16",
          "value": 83.3
        },
        {
          "timestamp": "03/17",
          "value": 82.9
        },
        {
          "timestamp": "03/18",
          "value": 85.2
        },
        {
          "timestamp": "03/19",
          "value": 81.8
        },
        {
          "timestamp": "03/20",
          "value": 80.9
        },
        {
          "timestamp": "03/21",
          "value": 76.6
        },
        {
          "timestamp": "03/22",
          "value": 72.8
        },
        {
          "timestamp": "03/23",
          "value": 68.8
        },
        {
          "timestamp": "03/24",
          "value": 68
        },
        {
          "timestamp": "03/25",
          "value": 74.4
        },
        {
          "timestamp": "03/26",
          "value": 74.4
        },
        {
          "timestamp": "03/27",
          "value": 78.4
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 268.4
        },
        {
          "timestamp": "03/15",
          "value": 286.5
        },
        {
          "timestamp": "03/16",
          "value": 303.8
        },
        {
          "timestamp": "03/17",
          "value": 304.7
        },
        {
          "timestamp": "03/18",
          "value": 294.8
        },
        {
          "timestamp": "03/19",
          "value": 307.5
        },
        {
          "timestamp": "03/20",
          "value": 298.5
        },
        {
          "timestamp": "03/21",
          "value": 269.9
        },
        {
          "timestamp": "03/22",
          "value": 271.2
        },
        {
          "timestamp": "03/23",
          "value": 245.8
        },
        {
          "timestamp": "03/24",
          "value": 266.2
        },
        {
          "timestamp": "03/25",
          "value": 248.3
        },
        {
          "timestamp": "03/26",
          "value": 282
        },
        {
          "timestamp": "03/27",
          "value": 281.4
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 64.5
        },
        {
          "timestamp": "03/15",
          "value": 69.1
        },
        {
          "timestamp": "03/16",
          "value": 83.8
        },
        {
          "timestamp": "03/17",
          "value": 84.3
        },
        {
          "timestamp": "03/18",
          "value": 79.7
        },
        {
          "timestamp": "03/19",
          "value": 76.1
        },
        {
          "timestamp": "03/20",
          "value": 74
        },
        {
          "timestamp": "03/21",
          "value": 70.6
        },
        {
          "timestamp": "03/22",
          "value": 64.3
        },
        {
          "timestamp": "03/23",
          "value": 62.5
        },
        {
          "timestamp": "03/24",
          "value": 61.2
        },
        {
          "timestamp": "03/25",
          "value": 70.2
        },
        {
          "timestamp": "03/26",
          "value": 75.3
        },
        {
          "timestamp": "03/27",
          "value": 70.7
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 39.6
        },
        {
          "timestamp": "03/15",
          "value": 39.8
        },
        {
          "timestamp": "03/16",
          "value": 43.3
        },
        {
          "timestamp": "03/17",
          "value": 43.4
        },
        {
          "timestamp": "03/18",
          "value": 43
        },
        {
          "timestamp": "03/19",
          "value": 41.5
        },
        {
          "timestamp": "03/20",
          "value": 41.3
        },
        {
          "timestamp": "03/21",
          "value": 36.9
        },
        {
          "timestamp": "03/22",
          "value": 33.9
        },
        {
          "timestamp": "03/23",
          "value": 37.3
        },
        {
          "timestamp": "03/24",
          "value": 36.7
        },
        {
          "timestamp": "03/25",
          "value": 36.7
        },
        {
          "timestamp": "03/26",
          "value": 35.8
        },
        {
          "timestamp": "03/27",
          "value": 38.4
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu091",
    "label": "GPU-091",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 36,
      "memUsage": 53,
      "temp": 76,
      "power": 750,
      "cpuUsage": 69,
      "cpuMemUsage": 68
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 35.4
        },
        {
          "timestamp": "03/15",
          "value": 39.1
        },
        {
          "timestamp": "03/16",
          "value": 40.9
        },
        {
          "timestamp": "03/17",
          "value": 37.5
        },
        {
          "timestamp": "03/18",
          "value": 42.1
        },
        {
          "timestamp": "03/19",
          "value": 36.6
        },
        {
          "timestamp": "03/20",
          "value": 38.6
        },
        {
          "timestamp": "03/21",
          "value": 33.3
        },
        {
          "timestamp": "03/22",
          "value": 32.8
        },
        {
          "timestamp": "03/23",
          "value": 34.7
        },
        {
          "timestamp": "03/24",
          "value": 29.7
        },
        {
          "timestamp": "03/25",
          "value": 36.4
        },
        {
          "timestamp": "03/26",
          "value": 33.9
        },
        {
          "timestamp": "03/27",
          "value": 35
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 53.3
        },
        {
          "timestamp": "03/15",
          "value": 52.8
        },
        {
          "timestamp": "03/16",
          "value": 59.3
        },
        {
          "timestamp": "03/17",
          "value": 58.2
        },
        {
          "timestamp": "03/18",
          "value": 56.1
        },
        {
          "timestamp": "03/19",
          "value": 55.9
        },
        {
          "timestamp": "03/20",
          "value": 52.3
        },
        {
          "timestamp": "03/21",
          "value": 50.7
        },
        {
          "timestamp": "03/22",
          "value": 52.7
        },
        {
          "timestamp": "03/23",
          "value": 44.1
        },
        {
          "timestamp": "03/24",
          "value": 45.3
        },
        {
          "timestamp": "03/25",
          "value": 53
        },
        {
          "timestamp": "03/26",
          "value": 51.1
        },
        {
          "timestamp": "03/27",
          "value": 53.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 73.1
        },
        {
          "timestamp": "03/15",
          "value": 81.9
        },
        {
          "timestamp": "03/16",
          "value": 80.5
        },
        {
          "timestamp": "03/17",
          "value": 84.9
        },
        {
          "timestamp": "03/18",
          "value": 82.1
        },
        {
          "timestamp": "03/19",
          "value": 77.7
        },
        {
          "timestamp": "03/20",
          "value": 76.7
        },
        {
          "timestamp": "03/21",
          "value": 70.9
        },
        {
          "timestamp": "03/22",
          "value": 72.9
        },
        {
          "timestamp": "03/23",
          "value": 67.7
        },
        {
          "timestamp": "03/24",
          "value": 67.6
        },
        {
          "timestamp": "03/25",
          "value": 72.8
        },
        {
          "timestamp": "03/26",
          "value": 76.7
        },
        {
          "timestamp": "03/27",
          "value": 79
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 720
        },
        {
          "timestamp": "03/15",
          "value": 805.3
        },
        {
          "timestamp": "03/16",
          "value": 834
        },
        {
          "timestamp": "03/17",
          "value": 856.8
        },
        {
          "timestamp": "03/18",
          "value": 776.1
        },
        {
          "timestamp": "03/19",
          "value": 799.1
        },
        {
          "timestamp": "03/20",
          "value": 794.7
        },
        {
          "timestamp": "03/21",
          "value": 702.2
        },
        {
          "timestamp": "03/22",
          "value": 683
        },
        {
          "timestamp": "03/23",
          "value": 657.1
        },
        {
          "timestamp": "03/24",
          "value": 653.2
        },
        {
          "timestamp": "03/25",
          "value": 742
        },
        {
          "timestamp": "03/26",
          "value": 709.4
        },
        {
          "timestamp": "03/27",
          "value": 781.1
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 71.5
        },
        {
          "timestamp": "03/15",
          "value": 73.2
        },
        {
          "timestamp": "03/16",
          "value": 72.3
        },
        {
          "timestamp": "03/17",
          "value": 78.1
        },
        {
          "timestamp": "03/18",
          "value": 77.4
        },
        {
          "timestamp": "03/19",
          "value": 75.8
        },
        {
          "timestamp": "03/20",
          "value": 70.9
        },
        {
          "timestamp": "03/21",
          "value": 66.6
        },
        {
          "timestamp": "03/22",
          "value": 60
        },
        {
          "timestamp": "03/23",
          "value": 65.6
        },
        {
          "timestamp": "03/24",
          "value": 59
        },
        {
          "timestamp": "03/25",
          "value": 60
        },
        {
          "timestamp": "03/26",
          "value": 64.7
        },
        {
          "timestamp": "03/27",
          "value": 64.5
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 64.7
        },
        {
          "timestamp": "03/15",
          "value": 74.6
        },
        {
          "timestamp": "03/16",
          "value": 73.9
        },
        {
          "timestamp": "03/17",
          "value": 74.1
        },
        {
          "timestamp": "03/18",
          "value": 71.1
        },
        {
          "timestamp": "03/19",
          "value": 71.5
        },
        {
          "timestamp": "03/20",
          "value": 66.4
        },
        {
          "timestamp": "03/21",
          "value": 61.8
        },
        {
          "timestamp": "03/22",
          "value": 60.5
        },
        {
          "timestamp": "03/23",
          "value": 61.1
        },
        {
          "timestamp": "03/24",
          "value": 59
        },
        {
          "timestamp": "03/25",
          "value": 58.9
        },
        {
          "timestamp": "03/26",
          "value": 69.2
        },
        {
          "timestamp": "03/27",
          "value": 66.4
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu092",
    "label": "GPU-092",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 39,
      "memUsage": 39,
      "temp": 78,
      "power": 625,
      "cpuUsage": 62,
      "cpuMemUsage": 30
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 41.1
        },
        {
          "timestamp": "03/15",
          "value": 39.2
        },
        {
          "timestamp": "03/16",
          "value": 40.7
        },
        {
          "timestamp": "03/17",
          "value": 42.7
        },
        {
          "timestamp": "03/18",
          "value": 42.1
        },
        {
          "timestamp": "03/19",
          "value": 40.5
        },
        {
          "timestamp": "03/20",
          "value": 41.8
        },
        {
          "timestamp": "03/21",
          "value": 37.3
        },
        {
          "timestamp": "03/22",
          "value": 37
        },
        {
          "timestamp": "03/23",
          "value": 33.4
        },
        {
          "timestamp": "03/24",
          "value": 36.4
        },
        {
          "timestamp": "03/25",
          "value": 34.3
        },
        {
          "timestamp": "03/26",
          "value": 35.4
        },
        {
          "timestamp": "03/27",
          "value": 37.4
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 36.9
        },
        {
          "timestamp": "03/15",
          "value": 39.2
        },
        {
          "timestamp": "03/16",
          "value": 42.7
        },
        {
          "timestamp": "03/17",
          "value": 43.9
        },
        {
          "timestamp": "03/18",
          "value": 43.6
        },
        {
          "timestamp": "03/19",
          "value": 41.2
        },
        {
          "timestamp": "03/20",
          "value": 39.4
        },
        {
          "timestamp": "03/21",
          "value": 35
        },
        {
          "timestamp": "03/22",
          "value": 33.7
        },
        {
          "timestamp": "03/23",
          "value": 37.3
        },
        {
          "timestamp": "03/24",
          "value": 36.4
        },
        {
          "timestamp": "03/25",
          "value": 34.1
        },
        {
          "timestamp": "03/26",
          "value": 40
        },
        {
          "timestamp": "03/27",
          "value": 37.6
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 75.7
        },
        {
          "timestamp": "03/15",
          "value": 80.7
        },
        {
          "timestamp": "03/16",
          "value": 81.5
        },
        {
          "timestamp": "03/17",
          "value": 88.2
        },
        {
          "timestamp": "03/18",
          "value": 84.6
        },
        {
          "timestamp": "03/19",
          "value": 81.2
        },
        {
          "timestamp": "03/20",
          "value": 81.9
        },
        {
          "timestamp": "03/21",
          "value": 73.5
        },
        {
          "timestamp": "03/22",
          "value": 71.1
        },
        {
          "timestamp": "03/23",
          "value": 68
        },
        {
          "timestamp": "03/24",
          "value": 69.4
        },
        {
          "timestamp": "03/25",
          "value": 71.7
        },
        {
          "timestamp": "03/26",
          "value": 75.2
        },
        {
          "timestamp": "03/27",
          "value": 82.7
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 651.4
        },
        {
          "timestamp": "03/15",
          "value": 641.9
        },
        {
          "timestamp": "03/16",
          "value": 690.4
        },
        {
          "timestamp": "03/17",
          "value": 660.9
        },
        {
          "timestamp": "03/18",
          "value": 718.7
        },
        {
          "timestamp": "03/19",
          "value": 646.5
        },
        {
          "timestamp": "03/20",
          "value": 658.3
        },
        {
          "timestamp": "03/21",
          "value": 601
        },
        {
          "timestamp": "03/22",
          "value": 574.1
        },
        {
          "timestamp": "03/23",
          "value": 532.6
        },
        {
          "timestamp": "03/24",
          "value": 576.5
        },
        {
          "timestamp": "03/25",
          "value": 575.3
        },
        {
          "timestamp": "03/26",
          "value": 634.4
        },
        {
          "timestamp": "03/27",
          "value": 665.8
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 61.8
        },
        {
          "timestamp": "03/15",
          "value": 59.8
        },
        {
          "timestamp": "03/16",
          "value": 67.2
        },
        {
          "timestamp": "03/17",
          "value": 73.7
        },
        {
          "timestamp": "03/18",
          "value": 65.5
        },
        {
          "timestamp": "03/19",
          "value": 64.2
        },
        {
          "timestamp": "03/20",
          "value": 62.1
        },
        {
          "timestamp": "03/21",
          "value": 63.2
        },
        {
          "timestamp": "03/22",
          "value": 55.6
        },
        {
          "timestamp": "03/23",
          "value": 58.1
        },
        {
          "timestamp": "03/24",
          "value": 52
        },
        {
          "timestamp": "03/25",
          "value": 55.8
        },
        {
          "timestamp": "03/26",
          "value": 54.2
        },
        {
          "timestamp": "03/27",
          "value": 65
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 28.6
        },
        {
          "timestamp": "03/15",
          "value": 31.5
        },
        {
          "timestamp": "03/16",
          "value": 32.5
        },
        {
          "timestamp": "03/17",
          "value": 32.5
        },
        {
          "timestamp": "03/18",
          "value": 31.8
        },
        {
          "timestamp": "03/19",
          "value": 29.7
        },
        {
          "timestamp": "03/20",
          "value": 31.1
        },
        {
          "timestamp": "03/21",
          "value": 30.3
        },
        {
          "timestamp": "03/22",
          "value": 25.7
        },
        {
          "timestamp": "03/23",
          "value": 25.5
        },
        {
          "timestamp": "03/24",
          "value": 25.5
        },
        {
          "timestamp": "03/25",
          "value": 26.5
        },
        {
          "timestamp": "03/26",
          "value": 28.6
        },
        {
          "timestamp": "03/27",
          "value": 29.8
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu093",
    "label": "GPU-093",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 72,
      "memUsage": 38,
      "temp": 68,
      "power": 631,
      "cpuUsage": 22,
      "cpuMemUsage": 49
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 78
        },
        {
          "timestamp": "03/15",
          "value": 76.9
        },
        {
          "timestamp": "03/16",
          "value": 82.9
        },
        {
          "timestamp": "03/17",
          "value": 79.3
        },
        {
          "timestamp": "03/18",
          "value": 74.8
        },
        {
          "timestamp": "03/19",
          "value": 73.3
        },
        {
          "timestamp": "03/20",
          "value": 78
        },
        {
          "timestamp": "03/21",
          "value": 75.5
        },
        {
          "timestamp": "03/22",
          "value": 68.4
        },
        {
          "timestamp": "03/23",
          "value": 58.5
        },
        {
          "timestamp": "03/24",
          "value": 62.6
        },
        {
          "timestamp": "03/25",
          "value": 64.6
        },
        {
          "timestamp": "03/26",
          "value": 65.5
        },
        {
          "timestamp": "03/27",
          "value": 78.1
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 39.6
        },
        {
          "timestamp": "03/15",
          "value": 37.7
        },
        {
          "timestamp": "03/16",
          "value": 42.2
        },
        {
          "timestamp": "03/17",
          "value": 40.1
        },
        {
          "timestamp": "03/18",
          "value": 39.7
        },
        {
          "timestamp": "03/19",
          "value": 38.8
        },
        {
          "timestamp": "03/20",
          "value": 36.8
        },
        {
          "timestamp": "03/21",
          "value": 34.2
        },
        {
          "timestamp": "03/22",
          "value": 32.8
        },
        {
          "timestamp": "03/23",
          "value": 34.8
        },
        {
          "timestamp": "03/24",
          "value": 36.6
        },
        {
          "timestamp": "03/25",
          "value": 34.2
        },
        {
          "timestamp": "03/26",
          "value": 35
        },
        {
          "timestamp": "03/27",
          "value": 37.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 70.1
        },
        {
          "timestamp": "03/15",
          "value": 73.9
        },
        {
          "timestamp": "03/16",
          "value": 71.5
        },
        {
          "timestamp": "03/17",
          "value": 72.3
        },
        {
          "timestamp": "03/18",
          "value": 75
        },
        {
          "timestamp": "03/19",
          "value": 73
        },
        {
          "timestamp": "03/20",
          "value": 68.2
        },
        {
          "timestamp": "03/21",
          "value": 64
        },
        {
          "timestamp": "03/22",
          "value": 62.5
        },
        {
          "timestamp": "03/23",
          "value": 60.9
        },
        {
          "timestamp": "03/24",
          "value": 62.3
        },
        {
          "timestamp": "03/25",
          "value": 62.6
        },
        {
          "timestamp": "03/26",
          "value": 63.8
        },
        {
          "timestamp": "03/27",
          "value": 68.4
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 666.6
        },
        {
          "timestamp": "03/15",
          "value": 646
        },
        {
          "timestamp": "03/16",
          "value": 670.3
        },
        {
          "timestamp": "03/17",
          "value": 705.2
        },
        {
          "timestamp": "03/18",
          "value": 676.6
        },
        {
          "timestamp": "03/19",
          "value": 676
        },
        {
          "timestamp": "03/20",
          "value": 602.6
        },
        {
          "timestamp": "03/21",
          "value": 640.6
        },
        {
          "timestamp": "03/22",
          "value": 580.4
        },
        {
          "timestamp": "03/23",
          "value": 558.9
        },
        {
          "timestamp": "03/24",
          "value": 563.9
        },
        {
          "timestamp": "03/25",
          "value": 573.9
        },
        {
          "timestamp": "03/26",
          "value": 589.6
        },
        {
          "timestamp": "03/27",
          "value": 617.8
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 22.5
        },
        {
          "timestamp": "03/15",
          "value": 20.9
        },
        {
          "timestamp": "03/16",
          "value": 25.9
        },
        {
          "timestamp": "03/17",
          "value": 25.1
        },
        {
          "timestamp": "03/18",
          "value": 23.5
        },
        {
          "timestamp": "03/19",
          "value": 22.9
        },
        {
          "timestamp": "03/20",
          "value": 20.8
        },
        {
          "timestamp": "03/21",
          "value": 23
        },
        {
          "timestamp": "03/22",
          "value": 18.8
        },
        {
          "timestamp": "03/23",
          "value": 20.9
        },
        {
          "timestamp": "03/24",
          "value": 21.2
        },
        {
          "timestamp": "03/25",
          "value": 19.3
        },
        {
          "timestamp": "03/26",
          "value": 23
        },
        {
          "timestamp": "03/27",
          "value": 24.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 50.3
        },
        {
          "timestamp": "03/15",
          "value": 49.9
        },
        {
          "timestamp": "03/16",
          "value": 51.7
        },
        {
          "timestamp": "03/17",
          "value": 56.9
        },
        {
          "timestamp": "03/18",
          "value": 52.9
        },
        {
          "timestamp": "03/19",
          "value": 49.8
        },
        {
          "timestamp": "03/20",
          "value": 51.7
        },
        {
          "timestamp": "03/21",
          "value": 45.5
        },
        {
          "timestamp": "03/22",
          "value": 43.4
        },
        {
          "timestamp": "03/23",
          "value": 43.5
        },
        {
          "timestamp": "03/24",
          "value": 44.8
        },
        {
          "timestamp": "03/25",
          "value": 46.6
        },
        {
          "timestamp": "03/26",
          "value": 49.4
        },
        {
          "timestamp": "03/27",
          "value": 47.1
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu094",
    "label": "GPU-094",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "err",
    "current": {
      "gpuUsage": 0,
      "memUsage": 0,
      "temp": 0,
      "power": 0,
      "cpuUsage": 0,
      "cpuMemUsage": 0
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu095",
    "label": "GPU-095",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 53,
      "memUsage": 60,
      "temp": 61,
      "power": 683,
      "cpuUsage": 30,
      "cpuMemUsage": 40
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 48.6
        },
        {
          "timestamp": "03/15",
          "value": 51.2
        },
        {
          "timestamp": "03/16",
          "value": 61.8
        },
        {
          "timestamp": "03/17",
          "value": 60.7
        },
        {
          "timestamp": "03/18",
          "value": 60
        },
        {
          "timestamp": "03/19",
          "value": 55
        },
        {
          "timestamp": "03/20",
          "value": 49.4
        },
        {
          "timestamp": "03/21",
          "value": 53.5
        },
        {
          "timestamp": "03/22",
          "value": 52.7
        },
        {
          "timestamp": "03/23",
          "value": 49
        },
        {
          "timestamp": "03/24",
          "value": 48.7
        },
        {
          "timestamp": "03/25",
          "value": 52.5
        },
        {
          "timestamp": "03/26",
          "value": 55.6
        },
        {
          "timestamp": "03/27",
          "value": 55.7
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 60
        },
        {
          "timestamp": "03/15",
          "value": 62.1
        },
        {
          "timestamp": "03/16",
          "value": 68.8
        },
        {
          "timestamp": "03/17",
          "value": 69.2
        },
        {
          "timestamp": "03/18",
          "value": 67.9
        },
        {
          "timestamp": "03/19",
          "value": 62.5
        },
        {
          "timestamp": "03/20",
          "value": 65.2
        },
        {
          "timestamp": "03/21",
          "value": 62.3
        },
        {
          "timestamp": "03/22",
          "value": 59.8
        },
        {
          "timestamp": "03/23",
          "value": 54.2
        },
        {
          "timestamp": "03/24",
          "value": 57.2
        },
        {
          "timestamp": "03/25",
          "value": 51.3
        },
        {
          "timestamp": "03/26",
          "value": 55.5
        },
        {
          "timestamp": "03/27",
          "value": 62.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 62.1
        },
        {
          "timestamp": "03/15",
          "value": 65.4
        },
        {
          "timestamp": "03/16",
          "value": 65.3
        },
        {
          "timestamp": "03/17",
          "value": 69
        },
        {
          "timestamp": "03/18",
          "value": 65.9
        },
        {
          "timestamp": "03/19",
          "value": 64.8
        },
        {
          "timestamp": "03/20",
          "value": 61.8
        },
        {
          "timestamp": "03/21",
          "value": 57.3
        },
        {
          "timestamp": "03/22",
          "value": 57
        },
        {
          "timestamp": "03/23",
          "value": 53.5
        },
        {
          "timestamp": "03/24",
          "value": 57.3
        },
        {
          "timestamp": "03/25",
          "value": 54.6
        },
        {
          "timestamp": "03/26",
          "value": 57.8
        },
        {
          "timestamp": "03/27",
          "value": 61.3
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 665.9
        },
        {
          "timestamp": "03/15",
          "value": 752.7
        },
        {
          "timestamp": "03/16",
          "value": 768.7
        },
        {
          "timestamp": "03/17",
          "value": 787.1
        },
        {
          "timestamp": "03/18",
          "value": 749.5
        },
        {
          "timestamp": "03/19",
          "value": 687
        },
        {
          "timestamp": "03/20",
          "value": 719.8
        },
        {
          "timestamp": "03/21",
          "value": 660.8
        },
        {
          "timestamp": "03/22",
          "value": 636.4
        },
        {
          "timestamp": "03/23",
          "value": 654.1
        },
        {
          "timestamp": "03/24",
          "value": 635
        },
        {
          "timestamp": "03/25",
          "value": 594.8
        },
        {
          "timestamp": "03/26",
          "value": 656.8
        },
        {
          "timestamp": "03/27",
          "value": 728.3
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 31.2
        },
        {
          "timestamp": "03/15",
          "value": 31.7
        },
        {
          "timestamp": "03/16",
          "value": 35.1
        },
        {
          "timestamp": "03/17",
          "value": 30.7
        },
        {
          "timestamp": "03/18",
          "value": 32.4
        },
        {
          "timestamp": "03/19",
          "value": 31.7
        },
        {
          "timestamp": "03/20",
          "value": 29.9
        },
        {
          "timestamp": "03/21",
          "value": 29.8
        },
        {
          "timestamp": "03/22",
          "value": 25.6
        },
        {
          "timestamp": "03/23",
          "value": 26.2
        },
        {
          "timestamp": "03/24",
          "value": 28.5
        },
        {
          "timestamp": "03/25",
          "value": 28.7
        },
        {
          "timestamp": "03/26",
          "value": 28.8
        },
        {
          "timestamp": "03/27",
          "value": 28.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 41.1
        },
        {
          "timestamp": "03/15",
          "value": 41.3
        },
        {
          "timestamp": "03/16",
          "value": 45.2
        },
        {
          "timestamp": "03/17",
          "value": 43.8
        },
        {
          "timestamp": "03/18",
          "value": 40.9
        },
        {
          "timestamp": "03/19",
          "value": 43.4
        },
        {
          "timestamp": "03/20",
          "value": 38.9
        },
        {
          "timestamp": "03/21",
          "value": 37.2
        },
        {
          "timestamp": "03/22",
          "value": 34.3
        },
        {
          "timestamp": "03/23",
          "value": 38.7
        },
        {
          "timestamp": "03/24",
          "value": 38.1
        },
        {
          "timestamp": "03/25",
          "value": 39.4
        },
        {
          "timestamp": "03/26",
          "value": 40.4
        },
        {
          "timestamp": "03/27",
          "value": 40.3
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu096",
    "label": "GPU-096",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "err",
    "current": {
      "gpuUsage": 0,
      "memUsage": 0,
      "temp": 0,
      "power": 0,
      "cpuUsage": 0,
      "cpuMemUsage": 0
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu097",
    "label": "GPU-097",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "warn",
    "current": {
      "gpuUsage": 91,
      "memUsage": 95,
      "temp": 91,
      "power": 981,
      "cpuUsage": 42,
      "cpuMemUsage": 34
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 98
        },
        {
          "timestamp": "03/15",
          "value": 97.9
        },
        {
          "timestamp": "03/16",
          "value": 97.7
        },
        {
          "timestamp": "03/17",
          "value": 96.6
        },
        {
          "timestamp": "03/18",
          "value": 102.7
        },
        {
          "timestamp": "03/19",
          "value": 102.5
        },
        {
          "timestamp": "03/20",
          "value": 92.4
        },
        {
          "timestamp": "03/21",
          "value": 91.8
        },
        {
          "timestamp": "03/22",
          "value": 90.7
        },
        {
          "timestamp": "03/23",
          "value": 77.4
        },
        {
          "timestamp": "03/24",
          "value": 76.9
        },
        {
          "timestamp": "03/25",
          "value": 78.2
        },
        {
          "timestamp": "03/26",
          "value": 96.2
        },
        {
          "timestamp": "03/27",
          "value": 96.1
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 89.3
        },
        {
          "timestamp": "03/15",
          "value": 104
        },
        {
          "timestamp": "03/16",
          "value": 102
        },
        {
          "timestamp": "03/17",
          "value": 105.8
        },
        {
          "timestamp": "03/18",
          "value": 102.8
        },
        {
          "timestamp": "03/19",
          "value": 95.4
        },
        {
          "timestamp": "03/20",
          "value": 93.6
        },
        {
          "timestamp": "03/21",
          "value": 89.5
        },
        {
          "timestamp": "03/22",
          "value": 89.2
        },
        {
          "timestamp": "03/23",
          "value": 92.3
        },
        {
          "timestamp": "03/24",
          "value": 85.2
        },
        {
          "timestamp": "03/25",
          "value": 85.2
        },
        {
          "timestamp": "03/26",
          "value": 92.7
        },
        {
          "timestamp": "03/27",
          "value": 103.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 94.4
        },
        {
          "timestamp": "03/15",
          "value": 95.8
        },
        {
          "timestamp": "03/16",
          "value": 100.1
        },
        {
          "timestamp": "03/17",
          "value": 101.1
        },
        {
          "timestamp": "03/18",
          "value": 96.6
        },
        {
          "timestamp": "03/19",
          "value": 96.9
        },
        {
          "timestamp": "03/20",
          "value": 93.3
        },
        {
          "timestamp": "03/21",
          "value": 85.2
        },
        {
          "timestamp": "03/22",
          "value": 84.1
        },
        {
          "timestamp": "03/23",
          "value": 84.6
        },
        {
          "timestamp": "03/24",
          "value": 85.2
        },
        {
          "timestamp": "03/25",
          "value": 84.2
        },
        {
          "timestamp": "03/26",
          "value": 86.8
        },
        {
          "timestamp": "03/27",
          "value": 93.7
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 955.2
        },
        {
          "timestamp": "03/15",
          "value": 995.1
        },
        {
          "timestamp": "03/16",
          "value": 1115.8
        },
        {
          "timestamp": "03/17",
          "value": 1088.6
        },
        {
          "timestamp": "03/18",
          "value": 1045.5
        },
        {
          "timestamp": "03/19",
          "value": 988.1
        },
        {
          "timestamp": "03/20",
          "value": 988.7
        },
        {
          "timestamp": "03/21",
          "value": 963.9
        },
        {
          "timestamp": "03/22",
          "value": 886.7
        },
        {
          "timestamp": "03/23",
          "value": 839.5
        },
        {
          "timestamp": "03/24",
          "value": 915.8
        },
        {
          "timestamp": "03/25",
          "value": 940.9
        },
        {
          "timestamp": "03/26",
          "value": 911.7
        },
        {
          "timestamp": "03/27",
          "value": 977.1
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 41.1
        },
        {
          "timestamp": "03/15",
          "value": 41.9
        },
        {
          "timestamp": "03/16",
          "value": 46.6
        },
        {
          "timestamp": "03/17",
          "value": 45
        },
        {
          "timestamp": "03/18",
          "value": 45.5
        },
        {
          "timestamp": "03/19",
          "value": 41.4
        },
        {
          "timestamp": "03/20",
          "value": 42.8
        },
        {
          "timestamp": "03/21",
          "value": 38.7
        },
        {
          "timestamp": "03/22",
          "value": 39.8
        },
        {
          "timestamp": "03/23",
          "value": 39.3
        },
        {
          "timestamp": "03/24",
          "value": 37.4
        },
        {
          "timestamp": "03/25",
          "value": 42.4
        },
        {
          "timestamp": "03/26",
          "value": 43.6
        },
        {
          "timestamp": "03/27",
          "value": 40.2
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 34.9
        },
        {
          "timestamp": "03/15",
          "value": 36.9
        },
        {
          "timestamp": "03/16",
          "value": 35.1
        },
        {
          "timestamp": "03/17",
          "value": 36.1
        },
        {
          "timestamp": "03/18",
          "value": 35.6
        },
        {
          "timestamp": "03/19",
          "value": 35.6
        },
        {
          "timestamp": "03/20",
          "value": 33.6
        },
        {
          "timestamp": "03/21",
          "value": 31
        },
        {
          "timestamp": "03/22",
          "value": 31.1
        },
        {
          "timestamp": "03/23",
          "value": 31.6
        },
        {
          "timestamp": "03/24",
          "value": 30
        },
        {
          "timestamp": "03/25",
          "value": 30.8
        },
        {
          "timestamp": "03/26",
          "value": 32.1
        },
        {
          "timestamp": "03/27",
          "value": 32.7
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu098",
    "label": "GPU-098",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 80,
      "memUsage": 73,
      "temp": 74,
      "power": 317,
      "cpuUsage": 52,
      "cpuMemUsage": 59
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 72.9
        },
        {
          "timestamp": "03/15",
          "value": 86
        },
        {
          "timestamp": "03/16",
          "value": 92.6
        },
        {
          "timestamp": "03/17",
          "value": 84.2
        },
        {
          "timestamp": "03/18",
          "value": 92.1
        },
        {
          "timestamp": "03/19",
          "value": 91.6
        },
        {
          "timestamp": "03/20",
          "value": 74.2
        },
        {
          "timestamp": "03/21",
          "value": 83.2
        },
        {
          "timestamp": "03/22",
          "value": 71.8
        },
        {
          "timestamp": "03/23",
          "value": 65.4
        },
        {
          "timestamp": "03/24",
          "value": 74.4
        },
        {
          "timestamp": "03/25",
          "value": 75.5
        },
        {
          "timestamp": "03/26",
          "value": 71.9
        },
        {
          "timestamp": "03/27",
          "value": 78
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 71.1
        },
        {
          "timestamp": "03/15",
          "value": 75.5
        },
        {
          "timestamp": "03/16",
          "value": 84.5
        },
        {
          "timestamp": "03/17",
          "value": 83.3
        },
        {
          "timestamp": "03/18",
          "value": 81.8
        },
        {
          "timestamp": "03/19",
          "value": 73
        },
        {
          "timestamp": "03/20",
          "value": 73.5
        },
        {
          "timestamp": "03/21",
          "value": 73
        },
        {
          "timestamp": "03/22",
          "value": 66.1
        },
        {
          "timestamp": "03/23",
          "value": 70.4
        },
        {
          "timestamp": "03/24",
          "value": 65.1
        },
        {
          "timestamp": "03/25",
          "value": 71.6
        },
        {
          "timestamp": "03/26",
          "value": 74.1
        },
        {
          "timestamp": "03/27",
          "value": 78.7
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 74.1
        },
        {
          "timestamp": "03/15",
          "value": 78.2
        },
        {
          "timestamp": "03/16",
          "value": 77.6
        },
        {
          "timestamp": "03/17",
          "value": 81.8
        },
        {
          "timestamp": "03/18",
          "value": 78.4
        },
        {
          "timestamp": "03/19",
          "value": 78.9
        },
        {
          "timestamp": "03/20",
          "value": 73.1
        },
        {
          "timestamp": "03/21",
          "value": 73.9
        },
        {
          "timestamp": "03/22",
          "value": 71.1
        },
        {
          "timestamp": "03/23",
          "value": 65.2
        },
        {
          "timestamp": "03/24",
          "value": 64.8
        },
        {
          "timestamp": "03/25",
          "value": 70.5
        },
        {
          "timestamp": "03/26",
          "value": 69.2
        },
        {
          "timestamp": "03/27",
          "value": 76.2
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 326
        },
        {
          "timestamp": "03/15",
          "value": 330.3
        },
        {
          "timestamp": "03/16",
          "value": 361.3
        },
        {
          "timestamp": "03/17",
          "value": 345.3
        },
        {
          "timestamp": "03/18",
          "value": 346.3
        },
        {
          "timestamp": "03/19",
          "value": 318.9
        },
        {
          "timestamp": "03/20",
          "value": 339.8
        },
        {
          "timestamp": "03/21",
          "value": 320.6
        },
        {
          "timestamp": "03/22",
          "value": 304
        },
        {
          "timestamp": "03/23",
          "value": 291.6
        },
        {
          "timestamp": "03/24",
          "value": 291.3
        },
        {
          "timestamp": "03/25",
          "value": 305.3
        },
        {
          "timestamp": "03/26",
          "value": 292.6
        },
        {
          "timestamp": "03/27",
          "value": 333.2
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 53.3
        },
        {
          "timestamp": "03/15",
          "value": 49.9
        },
        {
          "timestamp": "03/16",
          "value": 55.4
        },
        {
          "timestamp": "03/17",
          "value": 55
        },
        {
          "timestamp": "03/18",
          "value": 56.8
        },
        {
          "timestamp": "03/19",
          "value": 50
        },
        {
          "timestamp": "03/20",
          "value": 50
        },
        {
          "timestamp": "03/21",
          "value": 52.2
        },
        {
          "timestamp": "03/22",
          "value": 51.5
        },
        {
          "timestamp": "03/23",
          "value": 47
        },
        {
          "timestamp": "03/24",
          "value": 42.3
        },
        {
          "timestamp": "03/25",
          "value": 49
        },
        {
          "timestamp": "03/26",
          "value": 47.7
        },
        {
          "timestamp": "03/27",
          "value": 54.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 57.4
        },
        {
          "timestamp": "03/15",
          "value": 60.5
        },
        {
          "timestamp": "03/16",
          "value": 59.9
        },
        {
          "timestamp": "03/17",
          "value": 65.9
        },
        {
          "timestamp": "03/18",
          "value": 66.7
        },
        {
          "timestamp": "03/19",
          "value": 66.6
        },
        {
          "timestamp": "03/20",
          "value": 63
        },
        {
          "timestamp": "03/21",
          "value": 58.3
        },
        {
          "timestamp": "03/22",
          "value": 56.9
        },
        {
          "timestamp": "03/23",
          "value": 53.5
        },
        {
          "timestamp": "03/24",
          "value": 53.9
        },
        {
          "timestamp": "03/25",
          "value": 57.4
        },
        {
          "timestamp": "03/26",
          "value": 59.4
        },
        {
          "timestamp": "03/27",
          "value": 58.5
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu099",
    "label": "GPU-099",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 64,
      "memUsage": 35,
      "temp": 76,
      "power": 750,
      "cpuUsage": 48,
      "cpuMemUsage": 37
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 68.3
        },
        {
          "timestamp": "03/15",
          "value": 70.7
        },
        {
          "timestamp": "03/16",
          "value": 71.8
        },
        {
          "timestamp": "03/17",
          "value": 71.5
        },
        {
          "timestamp": "03/18",
          "value": 73.1
        },
        {
          "timestamp": "03/19",
          "value": 65.7
        },
        {
          "timestamp": "03/20",
          "value": 65.8
        },
        {
          "timestamp": "03/21",
          "value": 67.5
        },
        {
          "timestamp": "03/22",
          "value": 62.4
        },
        {
          "timestamp": "03/23",
          "value": 59.2
        },
        {
          "timestamp": "03/24",
          "value": 57.5
        },
        {
          "timestamp": "03/25",
          "value": 57.5
        },
        {
          "timestamp": "03/26",
          "value": 67.7
        },
        {
          "timestamp": "03/27",
          "value": 63
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 34.1
        },
        {
          "timestamp": "03/15",
          "value": 37.6
        },
        {
          "timestamp": "03/16",
          "value": 36
        },
        {
          "timestamp": "03/17",
          "value": 40.2
        },
        {
          "timestamp": "03/18",
          "value": 38.7
        },
        {
          "timestamp": "03/19",
          "value": 35
        },
        {
          "timestamp": "03/20",
          "value": 34.1
        },
        {
          "timestamp": "03/21",
          "value": 36.2
        },
        {
          "timestamp": "03/22",
          "value": 33.5
        },
        {
          "timestamp": "03/23",
          "value": 33.5
        },
        {
          "timestamp": "03/24",
          "value": 30.6
        },
        {
          "timestamp": "03/25",
          "value": 30.7
        },
        {
          "timestamp": "03/26",
          "value": 32.5
        },
        {
          "timestamp": "03/27",
          "value": 36.9
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 76.9
        },
        {
          "timestamp": "03/15",
          "value": 79.4
        },
        {
          "timestamp": "03/16",
          "value": 82
        },
        {
          "timestamp": "03/17",
          "value": 86.1
        },
        {
          "timestamp": "03/18",
          "value": 83.7
        },
        {
          "timestamp": "03/19",
          "value": 79
        },
        {
          "timestamp": "03/20",
          "value": 79.3
        },
        {
          "timestamp": "03/21",
          "value": 70.8
        },
        {
          "timestamp": "03/22",
          "value": 67.7
        },
        {
          "timestamp": "03/23",
          "value": 66.4
        },
        {
          "timestamp": "03/24",
          "value": 67.3
        },
        {
          "timestamp": "03/25",
          "value": 73.4
        },
        {
          "timestamp": "03/26",
          "value": 72.5
        },
        {
          "timestamp": "03/27",
          "value": 80.1
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 769.9
        },
        {
          "timestamp": "03/15",
          "value": 813.3
        },
        {
          "timestamp": "03/16",
          "value": 794.5
        },
        {
          "timestamp": "03/17",
          "value": 837.3
        },
        {
          "timestamp": "03/18",
          "value": 836.4
        },
        {
          "timestamp": "03/19",
          "value": 792.4
        },
        {
          "timestamp": "03/20",
          "value": 801.1
        },
        {
          "timestamp": "03/21",
          "value": 689.1
        },
        {
          "timestamp": "03/22",
          "value": 734.2
        },
        {
          "timestamp": "03/23",
          "value": 684.9
        },
        {
          "timestamp": "03/24",
          "value": 715.5
        },
        {
          "timestamp": "03/25",
          "value": 736.9
        },
        {
          "timestamp": "03/26",
          "value": 743.4
        },
        {
          "timestamp": "03/27",
          "value": 729.3
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 47.7
        },
        {
          "timestamp": "03/15",
          "value": 47.7
        },
        {
          "timestamp": "03/16",
          "value": 53.1
        },
        {
          "timestamp": "03/17",
          "value": 57
        },
        {
          "timestamp": "03/18",
          "value": 51.5
        },
        {
          "timestamp": "03/19",
          "value": 55.5
        },
        {
          "timestamp": "03/20",
          "value": 50.2
        },
        {
          "timestamp": "03/21",
          "value": 44.1
        },
        {
          "timestamp": "03/22",
          "value": 42.3
        },
        {
          "timestamp": "03/23",
          "value": 43.9
        },
        {
          "timestamp": "03/24",
          "value": 40.7
        },
        {
          "timestamp": "03/25",
          "value": 48.2
        },
        {
          "timestamp": "03/26",
          "value": 43.9
        },
        {
          "timestamp": "03/27",
          "value": 48.3
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 37
        },
        {
          "timestamp": "03/15",
          "value": 39.5
        },
        {
          "timestamp": "03/16",
          "value": 41.3
        },
        {
          "timestamp": "03/17",
          "value": 40.1
        },
        {
          "timestamp": "03/18",
          "value": 41.1
        },
        {
          "timestamp": "03/19",
          "value": 40.2
        },
        {
          "timestamp": "03/20",
          "value": 39.5
        },
        {
          "timestamp": "03/21",
          "value": 37.4
        },
        {
          "timestamp": "03/22",
          "value": 32.9
        },
        {
          "timestamp": "03/23",
          "value": 32.5
        },
        {
          "timestamp": "03/24",
          "value": 33
        },
        {
          "timestamp": "03/25",
          "value": 33.4
        },
        {
          "timestamp": "03/26",
          "value": 38.1
        },
        {
          "timestamp": "03/27",
          "value": 36.1
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu100",
    "label": "GPU-100",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 37,
      "memUsage": 78,
      "temp": 72,
      "power": 696,
      "cpuUsage": 30,
      "cpuMemUsage": 55
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 35.4
        },
        {
          "timestamp": "03/15",
          "value": 42.1
        },
        {
          "timestamp": "03/16",
          "value": 37.5
        },
        {
          "timestamp": "03/17",
          "value": 41.8
        },
        {
          "timestamp": "03/18",
          "value": 42.2
        },
        {
          "timestamp": "03/19",
          "value": 37.3
        },
        {
          "timestamp": "03/20",
          "value": 38.2
        },
        {
          "timestamp": "03/21",
          "value": 39
        },
        {
          "timestamp": "03/22",
          "value": 37.3
        },
        {
          "timestamp": "03/23",
          "value": 36.2
        },
        {
          "timestamp": "03/24",
          "value": 34.6
        },
        {
          "timestamp": "03/25",
          "value": 31.1
        },
        {
          "timestamp": "03/26",
          "value": 34.3
        },
        {
          "timestamp": "03/27",
          "value": 35.5
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 83.4
        },
        {
          "timestamp": "03/15",
          "value": 75.9
        },
        {
          "timestamp": "03/16",
          "value": 80
        },
        {
          "timestamp": "03/17",
          "value": 85.9
        },
        {
          "timestamp": "03/18",
          "value": 90.9
        },
        {
          "timestamp": "03/19",
          "value": 81.7
        },
        {
          "timestamp": "03/20",
          "value": 84.3
        },
        {
          "timestamp": "03/21",
          "value": 71.1
        },
        {
          "timestamp": "03/22",
          "value": 66.2
        },
        {
          "timestamp": "03/23",
          "value": 65.1
        },
        {
          "timestamp": "03/24",
          "value": 70.1
        },
        {
          "timestamp": "03/25",
          "value": 74.2
        },
        {
          "timestamp": "03/26",
          "value": 78.4
        },
        {
          "timestamp": "03/27",
          "value": 83.7
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 69.6
        },
        {
          "timestamp": "03/15",
          "value": 74.7
        },
        {
          "timestamp": "03/16",
          "value": 76.8
        },
        {
          "timestamp": "03/17",
          "value": 80
        },
        {
          "timestamp": "03/18",
          "value": 78.8
        },
        {
          "timestamp": "03/19",
          "value": 75.3
        },
        {
          "timestamp": "03/20",
          "value": 72.7
        },
        {
          "timestamp": "03/21",
          "value": 67.9
        },
        {
          "timestamp": "03/22",
          "value": 64.3
        },
        {
          "timestamp": "03/23",
          "value": 64.8
        },
        {
          "timestamp": "03/24",
          "value": 63
        },
        {
          "timestamp": "03/25",
          "value": 69.2
        },
        {
          "timestamp": "03/26",
          "value": 70.5
        },
        {
          "timestamp": "03/27",
          "value": 71
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 699.1
        },
        {
          "timestamp": "03/15",
          "value": 717.1
        },
        {
          "timestamp": "03/16",
          "value": 733.1
        },
        {
          "timestamp": "03/17",
          "value": 729.9
        },
        {
          "timestamp": "03/18",
          "value": 760.4
        },
        {
          "timestamp": "03/19",
          "value": 734.5
        },
        {
          "timestamp": "03/20",
          "value": 738.9
        },
        {
          "timestamp": "03/21",
          "value": 686.6
        },
        {
          "timestamp": "03/22",
          "value": 636.2
        },
        {
          "timestamp": "03/23",
          "value": 655.4
        },
        {
          "timestamp": "03/24",
          "value": 642.6
        },
        {
          "timestamp": "03/25",
          "value": 640.4
        },
        {
          "timestamp": "03/26",
          "value": 701.3
        },
        {
          "timestamp": "03/27",
          "value": 697.9
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 31.5
        },
        {
          "timestamp": "03/15",
          "value": 32.7
        },
        {
          "timestamp": "03/16",
          "value": 32.6
        },
        {
          "timestamp": "03/17",
          "value": 35.9
        },
        {
          "timestamp": "03/18",
          "value": 35.6
        },
        {
          "timestamp": "03/19",
          "value": 31.2
        },
        {
          "timestamp": "03/20",
          "value": 27.8
        },
        {
          "timestamp": "03/21",
          "value": 28.6
        },
        {
          "timestamp": "03/22",
          "value": 25.3
        },
        {
          "timestamp": "03/23",
          "value": 28
        },
        {
          "timestamp": "03/24",
          "value": 29.9
        },
        {
          "timestamp": "03/25",
          "value": 30.3
        },
        {
          "timestamp": "03/26",
          "value": 27.5
        },
        {
          "timestamp": "03/27",
          "value": 32.3
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 51.9
        },
        {
          "timestamp": "03/15",
          "value": 57
        },
        {
          "timestamp": "03/16",
          "value": 58.7
        },
        {
          "timestamp": "03/17",
          "value": 61.5
        },
        {
          "timestamp": "03/18",
          "value": 58.1
        },
        {
          "timestamp": "03/19",
          "value": 60.7
        },
        {
          "timestamp": "03/20",
          "value": 56.2
        },
        {
          "timestamp": "03/21",
          "value": 52.3
        },
        {
          "timestamp": "03/22",
          "value": 51.3
        },
        {
          "timestamp": "03/23",
          "value": 51.9
        },
        {
          "timestamp": "03/24",
          "value": 47.8
        },
        {
          "timestamp": "03/25",
          "value": 52.3
        },
        {
          "timestamp": "03/26",
          "value": 56.4
        },
        {
          "timestamp": "03/27",
          "value": 59.9
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu101",
    "label": "GPU-101",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 32,
      "memUsage": 51,
      "temp": 71,
      "power": 794,
      "cpuUsage": 57,
      "cpuMemUsage": 71
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 31
        },
        {
          "timestamp": "03/15",
          "value": 34.5
        },
        {
          "timestamp": "03/16",
          "value": 33.5
        },
        {
          "timestamp": "03/17",
          "value": 33.5
        },
        {
          "timestamp": "03/18",
          "value": 34.7
        },
        {
          "timestamp": "03/19",
          "value": 33.5
        },
        {
          "timestamp": "03/20",
          "value": 29.9
        },
        {
          "timestamp": "03/21",
          "value": 29.8
        },
        {
          "timestamp": "03/22",
          "value": 27.2
        },
        {
          "timestamp": "03/23",
          "value": 28.2
        },
        {
          "timestamp": "03/24",
          "value": 31.3
        },
        {
          "timestamp": "03/25",
          "value": 28.2
        },
        {
          "timestamp": "03/26",
          "value": 32.3
        },
        {
          "timestamp": "03/27",
          "value": 34.8
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 51.6
        },
        {
          "timestamp": "03/15",
          "value": 53.1
        },
        {
          "timestamp": "03/16",
          "value": 56.3
        },
        {
          "timestamp": "03/17",
          "value": 55.4
        },
        {
          "timestamp": "03/18",
          "value": 59.4
        },
        {
          "timestamp": "03/19",
          "value": 56.8
        },
        {
          "timestamp": "03/20",
          "value": 55.4
        },
        {
          "timestamp": "03/21",
          "value": 45.9
        },
        {
          "timestamp": "03/22",
          "value": 47.7
        },
        {
          "timestamp": "03/23",
          "value": 46.4
        },
        {
          "timestamp": "03/24",
          "value": 45.8
        },
        {
          "timestamp": "03/25",
          "value": 50.4
        },
        {
          "timestamp": "03/26",
          "value": 49.2
        },
        {
          "timestamp": "03/27",
          "value": 54.6
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 71.4
        },
        {
          "timestamp": "03/15",
          "value": 71.6
        },
        {
          "timestamp": "03/16",
          "value": 77.8
        },
        {
          "timestamp": "03/17",
          "value": 79.6
        },
        {
          "timestamp": "03/18",
          "value": 75.1
        },
        {
          "timestamp": "03/19",
          "value": 77.4
        },
        {
          "timestamp": "03/20",
          "value": 73.9
        },
        {
          "timestamp": "03/21",
          "value": 71.3
        },
        {
          "timestamp": "03/22",
          "value": 67.4
        },
        {
          "timestamp": "03/23",
          "value": 65.1
        },
        {
          "timestamp": "03/24",
          "value": 63
        },
        {
          "timestamp": "03/25",
          "value": 68.5
        },
        {
          "timestamp": "03/26",
          "value": 68.6
        },
        {
          "timestamp": "03/27",
          "value": 73
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 761.1
        },
        {
          "timestamp": "03/15",
          "value": 834.6
        },
        {
          "timestamp": "03/16",
          "value": 851.7
        },
        {
          "timestamp": "03/17",
          "value": 910.6
        },
        {
          "timestamp": "03/18",
          "value": 870.6
        },
        {
          "timestamp": "03/19",
          "value": 846.2
        },
        {
          "timestamp": "03/20",
          "value": 846.7
        },
        {
          "timestamp": "03/21",
          "value": 766.9
        },
        {
          "timestamp": "03/22",
          "value": 689.4
        },
        {
          "timestamp": "03/23",
          "value": 754.8
        },
        {
          "timestamp": "03/24",
          "value": 732.7
        },
        {
          "timestamp": "03/25",
          "value": 753.1
        },
        {
          "timestamp": "03/26",
          "value": 815.9
        },
        {
          "timestamp": "03/27",
          "value": 826.1
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 53.6
        },
        {
          "timestamp": "03/15",
          "value": 58.9
        },
        {
          "timestamp": "03/16",
          "value": 67.3
        },
        {
          "timestamp": "03/17",
          "value": 57.9
        },
        {
          "timestamp": "03/18",
          "value": 64.7
        },
        {
          "timestamp": "03/19",
          "value": 59.6
        },
        {
          "timestamp": "03/20",
          "value": 52.4
        },
        {
          "timestamp": "03/21",
          "value": 60.1
        },
        {
          "timestamp": "03/22",
          "value": 57.1
        },
        {
          "timestamp": "03/23",
          "value": 49.6
        },
        {
          "timestamp": "03/24",
          "value": 53.4
        },
        {
          "timestamp": "03/25",
          "value": 48.1
        },
        {
          "timestamp": "03/26",
          "value": 55.6
        },
        {
          "timestamp": "03/27",
          "value": 57
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 70.8
        },
        {
          "timestamp": "03/15",
          "value": 76.1
        },
        {
          "timestamp": "03/16",
          "value": 75.2
        },
        {
          "timestamp": "03/17",
          "value": 77.7
        },
        {
          "timestamp": "03/18",
          "value": 76.4
        },
        {
          "timestamp": "03/19",
          "value": 73.2
        },
        {
          "timestamp": "03/20",
          "value": 68.7
        },
        {
          "timestamp": "03/21",
          "value": 67.1
        },
        {
          "timestamp": "03/22",
          "value": 65.9
        },
        {
          "timestamp": "03/23",
          "value": 60.7
        },
        {
          "timestamp": "03/24",
          "value": 66.8
        },
        {
          "timestamp": "03/25",
          "value": 70.4
        },
        {
          "timestamp": "03/26",
          "value": 65.9
        },
        {
          "timestamp": "03/27",
          "value": 71
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu102",
    "label": "GPU-102",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 78,
      "memUsage": 55,
      "temp": 58,
      "power": 471,
      "cpuUsage": 50,
      "cpuMemUsage": 65
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 72.9
        },
        {
          "timestamp": "03/15",
          "value": 84.1
        },
        {
          "timestamp": "03/16",
          "value": 88.5
        },
        {
          "timestamp": "03/17",
          "value": 86.7
        },
        {
          "timestamp": "03/18",
          "value": 88.4
        },
        {
          "timestamp": "03/19",
          "value": 76.6
        },
        {
          "timestamp": "03/20",
          "value": 73.4
        },
        {
          "timestamp": "03/21",
          "value": 68.7
        },
        {
          "timestamp": "03/22",
          "value": 71.4
        },
        {
          "timestamp": "03/23",
          "value": 63.6
        },
        {
          "timestamp": "03/24",
          "value": 73.9
        },
        {
          "timestamp": "03/25",
          "value": 72.8
        },
        {
          "timestamp": "03/26",
          "value": 69.5
        },
        {
          "timestamp": "03/27",
          "value": 73.4
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 53.8
        },
        {
          "timestamp": "03/15",
          "value": 59.9
        },
        {
          "timestamp": "03/16",
          "value": 57.1
        },
        {
          "timestamp": "03/17",
          "value": 57.2
        },
        {
          "timestamp": "03/18",
          "value": 57.4
        },
        {
          "timestamp": "03/19",
          "value": 54.8
        },
        {
          "timestamp": "03/20",
          "value": 55.3
        },
        {
          "timestamp": "03/21",
          "value": 57.1
        },
        {
          "timestamp": "03/22",
          "value": 52.3
        },
        {
          "timestamp": "03/23",
          "value": 50.4
        },
        {
          "timestamp": "03/24",
          "value": 47.3
        },
        {
          "timestamp": "03/25",
          "value": 53
        },
        {
          "timestamp": "03/26",
          "value": 54.5
        },
        {
          "timestamp": "03/27",
          "value": 52.9
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 57.3
        },
        {
          "timestamp": "03/15",
          "value": 59
        },
        {
          "timestamp": "03/16",
          "value": 64.8
        },
        {
          "timestamp": "03/17",
          "value": 61.6
        },
        {
          "timestamp": "03/18",
          "value": 63.1
        },
        {
          "timestamp": "03/19",
          "value": 59.5
        },
        {
          "timestamp": "03/20",
          "value": 60.6
        },
        {
          "timestamp": "03/21",
          "value": 54.5
        },
        {
          "timestamp": "03/22",
          "value": 54.2
        },
        {
          "timestamp": "03/23",
          "value": 52.4
        },
        {
          "timestamp": "03/24",
          "value": 51.6
        },
        {
          "timestamp": "03/25",
          "value": 54
        },
        {
          "timestamp": "03/26",
          "value": 56
        },
        {
          "timestamp": "03/27",
          "value": 57.2
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 490.5
        },
        {
          "timestamp": "03/15",
          "value": 479.2
        },
        {
          "timestamp": "03/16",
          "value": 511.3
        },
        {
          "timestamp": "03/17",
          "value": 518.5
        },
        {
          "timestamp": "03/18",
          "value": 498.6
        },
        {
          "timestamp": "03/19",
          "value": 489.6
        },
        {
          "timestamp": "03/20",
          "value": 502
        },
        {
          "timestamp": "03/21",
          "value": 452.6
        },
        {
          "timestamp": "03/22",
          "value": 413.4
        },
        {
          "timestamp": "03/23",
          "value": 435.1
        },
        {
          "timestamp": "03/24",
          "value": 433.8
        },
        {
          "timestamp": "03/25",
          "value": 426.7
        },
        {
          "timestamp": "03/26",
          "value": 469.4
        },
        {
          "timestamp": "03/27",
          "value": 479.9
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 51.8
        },
        {
          "timestamp": "03/15",
          "value": 56.3
        },
        {
          "timestamp": "03/16",
          "value": 59.2
        },
        {
          "timestamp": "03/17",
          "value": 53.1
        },
        {
          "timestamp": "03/18",
          "value": 50.8
        },
        {
          "timestamp": "03/19",
          "value": 53.2
        },
        {
          "timestamp": "03/20",
          "value": 48.7
        },
        {
          "timestamp": "03/21",
          "value": 45.6
        },
        {
          "timestamp": "03/22",
          "value": 50.5
        },
        {
          "timestamp": "03/23",
          "value": 48
        },
        {
          "timestamp": "03/24",
          "value": 40.6
        },
        {
          "timestamp": "03/25",
          "value": 41.8
        },
        {
          "timestamp": "03/26",
          "value": 53.5
        },
        {
          "timestamp": "03/27",
          "value": 54.7
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 61.7
        },
        {
          "timestamp": "03/15",
          "value": 64.5
        },
        {
          "timestamp": "03/16",
          "value": 70.6
        },
        {
          "timestamp": "03/17",
          "value": 75.5
        },
        {
          "timestamp": "03/18",
          "value": 66.9
        },
        {
          "timestamp": "03/19",
          "value": 69.7
        },
        {
          "timestamp": "03/20",
          "value": 67.2
        },
        {
          "timestamp": "03/21",
          "value": 65.6
        },
        {
          "timestamp": "03/22",
          "value": 61.6
        },
        {
          "timestamp": "03/23",
          "value": 55.9
        },
        {
          "timestamp": "03/24",
          "value": 56.3
        },
        {
          "timestamp": "03/25",
          "value": 57.5
        },
        {
          "timestamp": "03/26",
          "value": 64.1
        },
        {
          "timestamp": "03/27",
          "value": 64.2
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu103",
    "label": "GPU-103",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 40,
      "memUsage": 35,
      "temp": 56,
      "power": 585,
      "cpuUsage": 59,
      "cpuMemUsage": 40
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 37
        },
        {
          "timestamp": "03/15",
          "value": 39.4
        },
        {
          "timestamp": "03/16",
          "value": 40.8
        },
        {
          "timestamp": "03/17",
          "value": 42.4
        },
        {
          "timestamp": "03/18",
          "value": 40.1
        },
        {
          "timestamp": "03/19",
          "value": 39.5
        },
        {
          "timestamp": "03/20",
          "value": 38.5
        },
        {
          "timestamp": "03/21",
          "value": 41.4
        },
        {
          "timestamp": "03/22",
          "value": 38.8
        },
        {
          "timestamp": "03/23",
          "value": 38.3
        },
        {
          "timestamp": "03/24",
          "value": 34.7
        },
        {
          "timestamp": "03/25",
          "value": 35.3
        },
        {
          "timestamp": "03/26",
          "value": 40.7
        },
        {
          "timestamp": "03/27",
          "value": 39
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 32.7
        },
        {
          "timestamp": "03/15",
          "value": 39
        },
        {
          "timestamp": "03/16",
          "value": 38.4
        },
        {
          "timestamp": "03/17",
          "value": 40
        },
        {
          "timestamp": "03/18",
          "value": 37.6
        },
        {
          "timestamp": "03/19",
          "value": 37.6
        },
        {
          "timestamp": "03/20",
          "value": 35
        },
        {
          "timestamp": "03/21",
          "value": 33.7
        },
        {
          "timestamp": "03/22",
          "value": 33.4
        },
        {
          "timestamp": "03/23",
          "value": 33.3
        },
        {
          "timestamp": "03/24",
          "value": 29.1
        },
        {
          "timestamp": "03/25",
          "value": 34.2
        },
        {
          "timestamp": "03/26",
          "value": 36.2
        },
        {
          "timestamp": "03/27",
          "value": 35.3
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 56.8
        },
        {
          "timestamp": "03/15",
          "value": 60.2
        },
        {
          "timestamp": "03/16",
          "value": 59.7
        },
        {
          "timestamp": "03/17",
          "value": 62.5
        },
        {
          "timestamp": "03/18",
          "value": 59.3
        },
        {
          "timestamp": "03/19",
          "value": 60.8
        },
        {
          "timestamp": "03/20",
          "value": 58.3
        },
        {
          "timestamp": "03/21",
          "value": 55.2
        },
        {
          "timestamp": "03/22",
          "value": 50.5
        },
        {
          "timestamp": "03/23",
          "value": 48.7
        },
        {
          "timestamp": "03/24",
          "value": 49.5
        },
        {
          "timestamp": "03/25",
          "value": 54
        },
        {
          "timestamp": "03/26",
          "value": 53
        },
        {
          "timestamp": "03/27",
          "value": 55.6
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 619.5
        },
        {
          "timestamp": "03/15",
          "value": 631.3
        },
        {
          "timestamp": "03/16",
          "value": 650.2
        },
        {
          "timestamp": "03/17",
          "value": 614.4
        },
        {
          "timestamp": "03/18",
          "value": 660.9
        },
        {
          "timestamp": "03/19",
          "value": 605
        },
        {
          "timestamp": "03/20",
          "value": 612.2
        },
        {
          "timestamp": "03/21",
          "value": 594.9
        },
        {
          "timestamp": "03/22",
          "value": 570.2
        },
        {
          "timestamp": "03/23",
          "value": 501.6
        },
        {
          "timestamp": "03/24",
          "value": 516.6
        },
        {
          "timestamp": "03/25",
          "value": 527.6
        },
        {
          "timestamp": "03/26",
          "value": 566.6
        },
        {
          "timestamp": "03/27",
          "value": 591.8
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 57.8
        },
        {
          "timestamp": "03/15",
          "value": 59.1
        },
        {
          "timestamp": "03/16",
          "value": 61.5
        },
        {
          "timestamp": "03/17",
          "value": 66.8
        },
        {
          "timestamp": "03/18",
          "value": 68.1
        },
        {
          "timestamp": "03/19",
          "value": 56.7
        },
        {
          "timestamp": "03/20",
          "value": 54.8
        },
        {
          "timestamp": "03/21",
          "value": 51.4
        },
        {
          "timestamp": "03/22",
          "value": 56.7
        },
        {
          "timestamp": "03/23",
          "value": 53
        },
        {
          "timestamp": "03/24",
          "value": 54.3
        },
        {
          "timestamp": "03/25",
          "value": 51.7
        },
        {
          "timestamp": "03/26",
          "value": 60.6
        },
        {
          "timestamp": "03/27",
          "value": 54.8
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 38
        },
        {
          "timestamp": "03/15",
          "value": 42.4
        },
        {
          "timestamp": "03/16",
          "value": 42.4
        },
        {
          "timestamp": "03/17",
          "value": 42
        },
        {
          "timestamp": "03/18",
          "value": 43
        },
        {
          "timestamp": "03/19",
          "value": 41.3
        },
        {
          "timestamp": "03/20",
          "value": 41.6
        },
        {
          "timestamp": "03/21",
          "value": 37.8
        },
        {
          "timestamp": "03/22",
          "value": 35
        },
        {
          "timestamp": "03/23",
          "value": 37
        },
        {
          "timestamp": "03/24",
          "value": 34.8
        },
        {
          "timestamp": "03/25",
          "value": 34.6
        },
        {
          "timestamp": "03/26",
          "value": 40.5
        },
        {
          "timestamp": "03/27",
          "value": 40.9
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu104",
    "label": "GPU-104",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 63,
      "memUsage": 51,
      "temp": 73,
      "power": 705,
      "cpuUsage": 27,
      "cpuMemUsage": 30
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 65.5
        },
        {
          "timestamp": "03/15",
          "value": 66.5
        },
        {
          "timestamp": "03/16",
          "value": 69.5
        },
        {
          "timestamp": "03/17",
          "value": 65.3
        },
        {
          "timestamp": "03/18",
          "value": 65.4
        },
        {
          "timestamp": "03/19",
          "value": 72.1
        },
        {
          "timestamp": "03/20",
          "value": 58.4
        },
        {
          "timestamp": "03/21",
          "value": 58.4
        },
        {
          "timestamp": "03/22",
          "value": 56.2
        },
        {
          "timestamp": "03/23",
          "value": 51.8
        },
        {
          "timestamp": "03/24",
          "value": 55.8
        },
        {
          "timestamp": "03/25",
          "value": 64.1
        },
        {
          "timestamp": "03/26",
          "value": 56.4
        },
        {
          "timestamp": "03/27",
          "value": 65.5
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 51.1
        },
        {
          "timestamp": "03/15",
          "value": 54.8
        },
        {
          "timestamp": "03/16",
          "value": 53.1
        },
        {
          "timestamp": "03/17",
          "value": 57.3
        },
        {
          "timestamp": "03/18",
          "value": 58.5
        },
        {
          "timestamp": "03/19",
          "value": 57
        },
        {
          "timestamp": "03/20",
          "value": 51.6
        },
        {
          "timestamp": "03/21",
          "value": 46.2
        },
        {
          "timestamp": "03/22",
          "value": 47.8
        },
        {
          "timestamp": "03/23",
          "value": 43.6
        },
        {
          "timestamp": "03/24",
          "value": 42.5
        },
        {
          "timestamp": "03/25",
          "value": 50.9
        },
        {
          "timestamp": "03/26",
          "value": 49.2
        },
        {
          "timestamp": "03/27",
          "value": 53.7
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 70.6
        },
        {
          "timestamp": "03/15",
          "value": 77.1
        },
        {
          "timestamp": "03/16",
          "value": 82
        },
        {
          "timestamp": "03/17",
          "value": 82.9
        },
        {
          "timestamp": "03/18",
          "value": 77.6
        },
        {
          "timestamp": "03/19",
          "value": 75.9
        },
        {
          "timestamp": "03/20",
          "value": 74.4
        },
        {
          "timestamp": "03/21",
          "value": 72.4
        },
        {
          "timestamp": "03/22",
          "value": 69.4
        },
        {
          "timestamp": "03/23",
          "value": 67.2
        },
        {
          "timestamp": "03/24",
          "value": 66.8
        },
        {
          "timestamp": "03/25",
          "value": 66.5
        },
        {
          "timestamp": "03/26",
          "value": 71.2
        },
        {
          "timestamp": "03/27",
          "value": 74.5
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 707.5
        },
        {
          "timestamp": "03/15",
          "value": 780
        },
        {
          "timestamp": "03/16",
          "value": 765.5
        },
        {
          "timestamp": "03/17",
          "value": 760.1
        },
        {
          "timestamp": "03/18",
          "value": 748.8
        },
        {
          "timestamp": "03/19",
          "value": 759
        },
        {
          "timestamp": "03/20",
          "value": 684
        },
        {
          "timestamp": "03/21",
          "value": 674.2
        },
        {
          "timestamp": "03/22",
          "value": 623.5
        },
        {
          "timestamp": "03/23",
          "value": 601.4
        },
        {
          "timestamp": "03/24",
          "value": 609.4
        },
        {
          "timestamp": "03/25",
          "value": 629.7
        },
        {
          "timestamp": "03/26",
          "value": 644.5
        },
        {
          "timestamp": "03/27",
          "value": 754.3
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 26.8
        },
        {
          "timestamp": "03/15",
          "value": 28.7
        },
        {
          "timestamp": "03/16",
          "value": 30.5
        },
        {
          "timestamp": "03/17",
          "value": 27.5
        },
        {
          "timestamp": "03/18",
          "value": 30.5
        },
        {
          "timestamp": "03/19",
          "value": 28.9
        },
        {
          "timestamp": "03/20",
          "value": 29
        },
        {
          "timestamp": "03/21",
          "value": 24.4
        },
        {
          "timestamp": "03/22",
          "value": 24.1
        },
        {
          "timestamp": "03/23",
          "value": 23.3
        },
        {
          "timestamp": "03/24",
          "value": 26.5
        },
        {
          "timestamp": "03/25",
          "value": 27.4
        },
        {
          "timestamp": "03/26",
          "value": 25.9
        },
        {
          "timestamp": "03/27",
          "value": 25.5
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 30.6
        },
        {
          "timestamp": "03/15",
          "value": 29.5
        },
        {
          "timestamp": "03/16",
          "value": 31.4
        },
        {
          "timestamp": "03/17",
          "value": 33.6
        },
        {
          "timestamp": "03/18",
          "value": 34.7
        },
        {
          "timestamp": "03/19",
          "value": 30.6
        },
        {
          "timestamp": "03/20",
          "value": 30
        },
        {
          "timestamp": "03/21",
          "value": 31
        },
        {
          "timestamp": "03/22",
          "value": 28.7
        },
        {
          "timestamp": "03/23",
          "value": 28.5
        },
        {
          "timestamp": "03/24",
          "value": 26.4
        },
        {
          "timestamp": "03/25",
          "value": 26.4
        },
        {
          "timestamp": "03/26",
          "value": 31.2
        },
        {
          "timestamp": "03/27",
          "value": 28.9
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu105",
    "label": "GPU-105",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 32,
      "memUsage": 53,
      "temp": 77,
      "power": 450,
      "cpuUsage": 66,
      "cpuMemUsage": 62
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 31
        },
        {
          "timestamp": "03/15",
          "value": 33.7
        },
        {
          "timestamp": "03/16",
          "value": 32.1
        },
        {
          "timestamp": "03/17",
          "value": 35
        },
        {
          "timestamp": "03/18",
          "value": 33.2
        },
        {
          "timestamp": "03/19",
          "value": 34.9
        },
        {
          "timestamp": "03/20",
          "value": 32.6
        },
        {
          "timestamp": "03/21",
          "value": 30.8
        },
        {
          "timestamp": "03/22",
          "value": 31.7
        },
        {
          "timestamp": "03/23",
          "value": 29.9
        },
        {
          "timestamp": "03/24",
          "value": 30.9
        },
        {
          "timestamp": "03/25",
          "value": 26.9
        },
        {
          "timestamp": "03/26",
          "value": 29
        },
        {
          "timestamp": "03/27",
          "value": 32.9
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 53.3
        },
        {
          "timestamp": "03/15",
          "value": 52.1
        },
        {
          "timestamp": "03/16",
          "value": 56.4
        },
        {
          "timestamp": "03/17",
          "value": 60
        },
        {
          "timestamp": "03/18",
          "value": 60.8
        },
        {
          "timestamp": "03/19",
          "value": 58.6
        },
        {
          "timestamp": "03/20",
          "value": 51.1
        },
        {
          "timestamp": "03/21",
          "value": 49.6
        },
        {
          "timestamp": "03/22",
          "value": 52.9
        },
        {
          "timestamp": "03/23",
          "value": 50.5
        },
        {
          "timestamp": "03/24",
          "value": 48.2
        },
        {
          "timestamp": "03/25",
          "value": 45.5
        },
        {
          "timestamp": "03/26",
          "value": 51.6
        },
        {
          "timestamp": "03/27",
          "value": 56.5
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 78.9
        },
        {
          "timestamp": "03/15",
          "value": 80
        },
        {
          "timestamp": "03/16",
          "value": 84.2
        },
        {
          "timestamp": "03/17",
          "value": 84.2
        },
        {
          "timestamp": "03/18",
          "value": 81
        },
        {
          "timestamp": "03/19",
          "value": 83.6
        },
        {
          "timestamp": "03/20",
          "value": 77.4
        },
        {
          "timestamp": "03/21",
          "value": 76.1
        },
        {
          "timestamp": "03/22",
          "value": 74.3
        },
        {
          "timestamp": "03/23",
          "value": 67.6
        },
        {
          "timestamp": "03/24",
          "value": 68.4
        },
        {
          "timestamp": "03/25",
          "value": 71.1
        },
        {
          "timestamp": "03/26",
          "value": 73.2
        },
        {
          "timestamp": "03/27",
          "value": 81.7
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 448.7
        },
        {
          "timestamp": "03/15",
          "value": 491.2
        },
        {
          "timestamp": "03/16",
          "value": 507.3
        },
        {
          "timestamp": "03/17",
          "value": 503.4
        },
        {
          "timestamp": "03/18",
          "value": 491.6
        },
        {
          "timestamp": "03/19",
          "value": 485.1
        },
        {
          "timestamp": "03/20",
          "value": 448.4
        },
        {
          "timestamp": "03/21",
          "value": 408.9
        },
        {
          "timestamp": "03/22",
          "value": 416.7
        },
        {
          "timestamp": "03/23",
          "value": 394.9
        },
        {
          "timestamp": "03/24",
          "value": 408.2
        },
        {
          "timestamp": "03/25",
          "value": 402.9
        },
        {
          "timestamp": "03/26",
          "value": 463.6
        },
        {
          "timestamp": "03/27",
          "value": 459.7
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 66.1
        },
        {
          "timestamp": "03/15",
          "value": 65.9
        },
        {
          "timestamp": "03/16",
          "value": 68.8
        },
        {
          "timestamp": "03/17",
          "value": 68.5
        },
        {
          "timestamp": "03/18",
          "value": 72
        },
        {
          "timestamp": "03/19",
          "value": 68.3
        },
        {
          "timestamp": "03/20",
          "value": 71.5
        },
        {
          "timestamp": "03/21",
          "value": 57.6
        },
        {
          "timestamp": "03/22",
          "value": 64
        },
        {
          "timestamp": "03/23",
          "value": 64.2
        },
        {
          "timestamp": "03/24",
          "value": 54.8
        },
        {
          "timestamp": "03/25",
          "value": 63.1
        },
        {
          "timestamp": "03/26",
          "value": 63.4
        },
        {
          "timestamp": "03/27",
          "value": 65.6
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 66
        },
        {
          "timestamp": "03/15",
          "value": 65
        },
        {
          "timestamp": "03/16",
          "value": 66.7
        },
        {
          "timestamp": "03/17",
          "value": 66.3
        },
        {
          "timestamp": "03/18",
          "value": 65.5
        },
        {
          "timestamp": "03/19",
          "value": 66.8
        },
        {
          "timestamp": "03/20",
          "value": 60.1
        },
        {
          "timestamp": "03/21",
          "value": 56.8
        },
        {
          "timestamp": "03/22",
          "value": 57.4
        },
        {
          "timestamp": "03/23",
          "value": 51.6
        },
        {
          "timestamp": "03/24",
          "value": 51.8
        },
        {
          "timestamp": "03/25",
          "value": 56.7
        },
        {
          "timestamp": "03/26",
          "value": 62
        },
        {
          "timestamp": "03/27",
          "value": 62.6
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu106",
    "label": "GPU-106",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 46,
      "memUsage": 35,
      "temp": 57,
      "power": 768,
      "cpuUsage": 40,
      "cpuMemUsage": 75
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 49.6
        },
        {
          "timestamp": "03/15",
          "value": 51.3
        },
        {
          "timestamp": "03/16",
          "value": 48.2
        },
        {
          "timestamp": "03/17",
          "value": 49.7
        },
        {
          "timestamp": "03/18",
          "value": 52.1
        },
        {
          "timestamp": "03/19",
          "value": 48.1
        },
        {
          "timestamp": "03/20",
          "value": 46.3
        },
        {
          "timestamp": "03/21",
          "value": 47.6
        },
        {
          "timestamp": "03/22",
          "value": 41.9
        },
        {
          "timestamp": "03/23",
          "value": 37.5
        },
        {
          "timestamp": "03/24",
          "value": 39.7
        },
        {
          "timestamp": "03/25",
          "value": 46.7
        },
        {
          "timestamp": "03/26",
          "value": 42.4
        },
        {
          "timestamp": "03/27",
          "value": 44.6
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 36.9
        },
        {
          "timestamp": "03/15",
          "value": 39.2
        },
        {
          "timestamp": "03/16",
          "value": 37.8
        },
        {
          "timestamp": "03/17",
          "value": 40.9
        },
        {
          "timestamp": "03/18",
          "value": 38
        },
        {
          "timestamp": "03/19",
          "value": 35.7
        },
        {
          "timestamp": "03/20",
          "value": 32.9
        },
        {
          "timestamp": "03/21",
          "value": 32.2
        },
        {
          "timestamp": "03/22",
          "value": 33.9
        },
        {
          "timestamp": "03/23",
          "value": 32.9
        },
        {
          "timestamp": "03/24",
          "value": 33.5
        },
        {
          "timestamp": "03/25",
          "value": 31
        },
        {
          "timestamp": "03/26",
          "value": 35.6
        },
        {
          "timestamp": "03/27",
          "value": 34.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 55.8
        },
        {
          "timestamp": "03/15",
          "value": 58.8
        },
        {
          "timestamp": "03/16",
          "value": 61.3
        },
        {
          "timestamp": "03/17",
          "value": 64.2
        },
        {
          "timestamp": "03/18",
          "value": 64
        },
        {
          "timestamp": "03/19",
          "value": 60.7
        },
        {
          "timestamp": "03/20",
          "value": 56.5
        },
        {
          "timestamp": "03/21",
          "value": 53.3
        },
        {
          "timestamp": "03/22",
          "value": 54.4
        },
        {
          "timestamp": "03/23",
          "value": 53.2
        },
        {
          "timestamp": "03/24",
          "value": 53.6
        },
        {
          "timestamp": "03/25",
          "value": 52.5
        },
        {
          "timestamp": "03/26",
          "value": 56.7
        },
        {
          "timestamp": "03/27",
          "value": 60.4
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 774.2
        },
        {
          "timestamp": "03/15",
          "value": 801.1
        },
        {
          "timestamp": "03/16",
          "value": 812
        },
        {
          "timestamp": "03/17",
          "value": 831.8
        },
        {
          "timestamp": "03/18",
          "value": 848.9
        },
        {
          "timestamp": "03/19",
          "value": 850.1
        },
        {
          "timestamp": "03/20",
          "value": 753.9
        },
        {
          "timestamp": "03/21",
          "value": 736.1
        },
        {
          "timestamp": "03/22",
          "value": 717.4
        },
        {
          "timestamp": "03/23",
          "value": 728
        },
        {
          "timestamp": "03/24",
          "value": 702
        },
        {
          "timestamp": "03/25",
          "value": 748.5
        },
        {
          "timestamp": "03/26",
          "value": 721.7
        },
        {
          "timestamp": "03/27",
          "value": 773.3
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 43.9
        },
        {
          "timestamp": "03/15",
          "value": 41
        },
        {
          "timestamp": "03/16",
          "value": 44.3
        },
        {
          "timestamp": "03/17",
          "value": 44
        },
        {
          "timestamp": "03/18",
          "value": 44.7
        },
        {
          "timestamp": "03/19",
          "value": 44.2
        },
        {
          "timestamp": "03/20",
          "value": 40.6
        },
        {
          "timestamp": "03/21",
          "value": 35.8
        },
        {
          "timestamp": "03/22",
          "value": 40
        },
        {
          "timestamp": "03/23",
          "value": 37.2
        },
        {
          "timestamp": "03/24",
          "value": 33.5
        },
        {
          "timestamp": "03/25",
          "value": 36.6
        },
        {
          "timestamp": "03/26",
          "value": 39.5
        },
        {
          "timestamp": "03/27",
          "value": 42
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 72.4
        },
        {
          "timestamp": "03/15",
          "value": 80.9
        },
        {
          "timestamp": "03/16",
          "value": 83.9
        },
        {
          "timestamp": "03/17",
          "value": 84.6
        },
        {
          "timestamp": "03/18",
          "value": 79.1
        },
        {
          "timestamp": "03/19",
          "value": 84.2
        },
        {
          "timestamp": "03/20",
          "value": 72.9
        },
        {
          "timestamp": "03/21",
          "value": 72.9
        },
        {
          "timestamp": "03/22",
          "value": 72
        },
        {
          "timestamp": "03/23",
          "value": 71.3
        },
        {
          "timestamp": "03/24",
          "value": 68.8
        },
        {
          "timestamp": "03/25",
          "value": 73.8
        },
        {
          "timestamp": "03/26",
          "value": 69.4
        },
        {
          "timestamp": "03/27",
          "value": 73.1
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu107",
    "label": "GPU-107",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "warn",
    "current": {
      "gpuUsage": 85,
      "memUsage": 94,
      "temp": 94,
      "power": 938,
      "cpuUsage": 65,
      "cpuMemUsage": 38
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 80.7
        },
        {
          "timestamp": "03/15",
          "value": 90.1
        },
        {
          "timestamp": "03/16",
          "value": 90.4
        },
        {
          "timestamp": "03/17",
          "value": 96.9
        },
        {
          "timestamp": "03/18",
          "value": 91.4
        },
        {
          "timestamp": "03/19",
          "value": 85.3
        },
        {
          "timestamp": "03/20",
          "value": 80.5
        },
        {
          "timestamp": "03/21",
          "value": 79.5
        },
        {
          "timestamp": "03/22",
          "value": 79.6
        },
        {
          "timestamp": "03/23",
          "value": 78.7
        },
        {
          "timestamp": "03/24",
          "value": 81.4
        },
        {
          "timestamp": "03/25",
          "value": 80.4
        },
        {
          "timestamp": "03/26",
          "value": 80.4
        },
        {
          "timestamp": "03/27",
          "value": 89.1
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 87.2
        },
        {
          "timestamp": "03/15",
          "value": 97
        },
        {
          "timestamp": "03/16",
          "value": 97.8
        },
        {
          "timestamp": "03/17",
          "value": 110.4
        },
        {
          "timestamp": "03/18",
          "value": 98.6
        },
        {
          "timestamp": "03/19",
          "value": 96.2
        },
        {
          "timestamp": "03/20",
          "value": 99.5
        },
        {
          "timestamp": "03/21",
          "value": 95.1
        },
        {
          "timestamp": "03/22",
          "value": 90
        },
        {
          "timestamp": "03/23",
          "value": 91.6
        },
        {
          "timestamp": "03/24",
          "value": 79
        },
        {
          "timestamp": "03/25",
          "value": 87
        },
        {
          "timestamp": "03/26",
          "value": 97.3
        },
        {
          "timestamp": "03/27",
          "value": 101.6
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 96.8
        },
        {
          "timestamp": "03/15",
          "value": 98.2
        },
        {
          "timestamp": "03/16",
          "value": 104.2
        },
        {
          "timestamp": "03/17",
          "value": 100.7
        },
        {
          "timestamp": "03/18",
          "value": 101.4
        },
        {
          "timestamp": "03/19",
          "value": 100.6
        },
        {
          "timestamp": "03/20",
          "value": 98.8
        },
        {
          "timestamp": "03/21",
          "value": 94.5
        },
        {
          "timestamp": "03/22",
          "value": 89.1
        },
        {
          "timestamp": "03/23",
          "value": 83.7
        },
        {
          "timestamp": "03/24",
          "value": 82
        },
        {
          "timestamp": "03/25",
          "value": 84.6
        },
        {
          "timestamp": "03/26",
          "value": 88
        },
        {
          "timestamp": "03/27",
          "value": 96.3
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 972
        },
        {
          "timestamp": "03/15",
          "value": 992.7
        },
        {
          "timestamp": "03/16",
          "value": 971.6
        },
        {
          "timestamp": "03/17",
          "value": 1077.2
        },
        {
          "timestamp": "03/18",
          "value": 984.5
        },
        {
          "timestamp": "03/19",
          "value": 955.4
        },
        {
          "timestamp": "03/20",
          "value": 969.3
        },
        {
          "timestamp": "03/21",
          "value": 953.8
        },
        {
          "timestamp": "03/22",
          "value": 878.9
        },
        {
          "timestamp": "03/23",
          "value": 872.6
        },
        {
          "timestamp": "03/24",
          "value": 895.2
        },
        {
          "timestamp": "03/25",
          "value": 863.6
        },
        {
          "timestamp": "03/26",
          "value": 867.8
        },
        {
          "timestamp": "03/27",
          "value": 952.5
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 69.1
        },
        {
          "timestamp": "03/15",
          "value": 64.3
        },
        {
          "timestamp": "03/16",
          "value": 74
        },
        {
          "timestamp": "03/17",
          "value": 65.8
        },
        {
          "timestamp": "03/18",
          "value": 71.6
        },
        {
          "timestamp": "03/19",
          "value": 67
        },
        {
          "timestamp": "03/20",
          "value": 64.7
        },
        {
          "timestamp": "03/21",
          "value": 59.3
        },
        {
          "timestamp": "03/22",
          "value": 56.3
        },
        {
          "timestamp": "03/23",
          "value": 54.2
        },
        {
          "timestamp": "03/24",
          "value": 57.4
        },
        {
          "timestamp": "03/25",
          "value": 57.1
        },
        {
          "timestamp": "03/26",
          "value": 65.6
        },
        {
          "timestamp": "03/27",
          "value": 67.5
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 38.9
        },
        {
          "timestamp": "03/15",
          "value": 39.9
        },
        {
          "timestamp": "03/16",
          "value": 40.6
        },
        {
          "timestamp": "03/17",
          "value": 40.4
        },
        {
          "timestamp": "03/18",
          "value": 43.9
        },
        {
          "timestamp": "03/19",
          "value": 42.4
        },
        {
          "timestamp": "03/20",
          "value": 36.2
        },
        {
          "timestamp": "03/21",
          "value": 38.4
        },
        {
          "timestamp": "03/22",
          "value": 36.2
        },
        {
          "timestamp": "03/23",
          "value": 36.2
        },
        {
          "timestamp": "03/24",
          "value": 33.6
        },
        {
          "timestamp": "03/25",
          "value": 36.2
        },
        {
          "timestamp": "03/26",
          "value": 36.9
        },
        {
          "timestamp": "03/27",
          "value": 38.9
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu108",
    "label": "GPU-108",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 77,
      "memUsage": 45,
      "temp": 62,
      "power": 311,
      "cpuUsage": 50,
      "cpuMemUsage": 67
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 77
        },
        {
          "timestamp": "03/15",
          "value": 74.1
        },
        {
          "timestamp": "03/16",
          "value": 83.7
        },
        {
          "timestamp": "03/17",
          "value": 88.7
        },
        {
          "timestamp": "03/18",
          "value": 85.7
        },
        {
          "timestamp": "03/19",
          "value": 77.3
        },
        {
          "timestamp": "03/20",
          "value": 71.4
        },
        {
          "timestamp": "03/21",
          "value": 80.2
        },
        {
          "timestamp": "03/22",
          "value": 66
        },
        {
          "timestamp": "03/23",
          "value": 66.4
        },
        {
          "timestamp": "03/24",
          "value": 73.2
        },
        {
          "timestamp": "03/25",
          "value": 70.6
        },
        {
          "timestamp": "03/26",
          "value": 79.1
        },
        {
          "timestamp": "03/27",
          "value": 81.4
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 43.4
        },
        {
          "timestamp": "03/15",
          "value": 47
        },
        {
          "timestamp": "03/16",
          "value": 47
        },
        {
          "timestamp": "03/17",
          "value": 47.4
        },
        {
          "timestamp": "03/18",
          "value": 47.2
        },
        {
          "timestamp": "03/19",
          "value": 46.6
        },
        {
          "timestamp": "03/20",
          "value": 46.3
        },
        {
          "timestamp": "03/21",
          "value": 45.1
        },
        {
          "timestamp": "03/22",
          "value": 38.4
        },
        {
          "timestamp": "03/23",
          "value": 39.3
        },
        {
          "timestamp": "03/24",
          "value": 43.7
        },
        {
          "timestamp": "03/25",
          "value": 45
        },
        {
          "timestamp": "03/26",
          "value": 44.6
        },
        {
          "timestamp": "03/27",
          "value": 49
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 60.9
        },
        {
          "timestamp": "03/15",
          "value": 66.1
        },
        {
          "timestamp": "03/16",
          "value": 69.2
        },
        {
          "timestamp": "03/17",
          "value": 65.8
        },
        {
          "timestamp": "03/18",
          "value": 69.8
        },
        {
          "timestamp": "03/19",
          "value": 67.9
        },
        {
          "timestamp": "03/20",
          "value": 61.2
        },
        {
          "timestamp": "03/21",
          "value": 60.3
        },
        {
          "timestamp": "03/22",
          "value": 58.4
        },
        {
          "timestamp": "03/23",
          "value": 55.8
        },
        {
          "timestamp": "03/24",
          "value": 58.1
        },
        {
          "timestamp": "03/25",
          "value": 56.4
        },
        {
          "timestamp": "03/26",
          "value": 61.7
        },
        {
          "timestamp": "03/27",
          "value": 60.9
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 327.9
        },
        {
          "timestamp": "03/15",
          "value": 323.6
        },
        {
          "timestamp": "03/16",
          "value": 319.6
        },
        {
          "timestamp": "03/17",
          "value": 353.3
        },
        {
          "timestamp": "03/18",
          "value": 346.4
        },
        {
          "timestamp": "03/19",
          "value": 338
        },
        {
          "timestamp": "03/20",
          "value": 329.7
        },
        {
          "timestamp": "03/21",
          "value": 307.1
        },
        {
          "timestamp": "03/22",
          "value": 288.9
        },
        {
          "timestamp": "03/23",
          "value": 277.4
        },
        {
          "timestamp": "03/24",
          "value": 289.9
        },
        {
          "timestamp": "03/25",
          "value": 276.5
        },
        {
          "timestamp": "03/26",
          "value": 283.9
        },
        {
          "timestamp": "03/27",
          "value": 331
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 47.6
        },
        {
          "timestamp": "03/15",
          "value": 51.5
        },
        {
          "timestamp": "03/16",
          "value": 57.6
        },
        {
          "timestamp": "03/17",
          "value": 58.3
        },
        {
          "timestamp": "03/18",
          "value": 55.1
        },
        {
          "timestamp": "03/19",
          "value": 51.5
        },
        {
          "timestamp": "03/20",
          "value": 45.8
        },
        {
          "timestamp": "03/21",
          "value": 44.5
        },
        {
          "timestamp": "03/22",
          "value": 50.9
        },
        {
          "timestamp": "03/23",
          "value": 48.8
        },
        {
          "timestamp": "03/24",
          "value": 50
        },
        {
          "timestamp": "03/25",
          "value": 44
        },
        {
          "timestamp": "03/26",
          "value": 46.4
        },
        {
          "timestamp": "03/27",
          "value": 53.9
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 65.5
        },
        {
          "timestamp": "03/15",
          "value": 73.6
        },
        {
          "timestamp": "03/16",
          "value": 75.8
        },
        {
          "timestamp": "03/17",
          "value": 69.4
        },
        {
          "timestamp": "03/18",
          "value": 72.8
        },
        {
          "timestamp": "03/19",
          "value": 70.3
        },
        {
          "timestamp": "03/20",
          "value": 70.6
        },
        {
          "timestamp": "03/21",
          "value": 62.1
        },
        {
          "timestamp": "03/22",
          "value": 64.7
        },
        {
          "timestamp": "03/23",
          "value": 58.6
        },
        {
          "timestamp": "03/24",
          "value": 59.2
        },
        {
          "timestamp": "03/25",
          "value": 64
        },
        {
          "timestamp": "03/26",
          "value": 61.2
        },
        {
          "timestamp": "03/27",
          "value": 66
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu109",
    "label": "GPU-109",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 45,
      "memUsage": 55,
      "temp": 75,
      "power": 512,
      "cpuUsage": 40,
      "cpuMemUsage": 69
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 45
        },
        {
          "timestamp": "03/15",
          "value": 49.4
        },
        {
          "timestamp": "03/16",
          "value": 51.7
        },
        {
          "timestamp": "03/17",
          "value": 45.6
        },
        {
          "timestamp": "03/18",
          "value": 49
        },
        {
          "timestamp": "03/19",
          "value": 46.5
        },
        {
          "timestamp": "03/20",
          "value": 42.8
        },
        {
          "timestamp": "03/21",
          "value": 41
        },
        {
          "timestamp": "03/22",
          "value": 45.2
        },
        {
          "timestamp": "03/23",
          "value": 39.4
        },
        {
          "timestamp": "03/24",
          "value": 37.2
        },
        {
          "timestamp": "03/25",
          "value": 43.1
        },
        {
          "timestamp": "03/26",
          "value": 43
        },
        {
          "timestamp": "03/27",
          "value": 44.2
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 56.7
        },
        {
          "timestamp": "03/15",
          "value": 59.1
        },
        {
          "timestamp": "03/16",
          "value": 60.1
        },
        {
          "timestamp": "03/17",
          "value": 56.4
        },
        {
          "timestamp": "03/18",
          "value": 56.5
        },
        {
          "timestamp": "03/19",
          "value": 55.3
        },
        {
          "timestamp": "03/20",
          "value": 57.9
        },
        {
          "timestamp": "03/21",
          "value": 52.7
        },
        {
          "timestamp": "03/22",
          "value": 53.5
        },
        {
          "timestamp": "03/23",
          "value": 51.6
        },
        {
          "timestamp": "03/24",
          "value": 48.7
        },
        {
          "timestamp": "03/25",
          "value": 50.1
        },
        {
          "timestamp": "03/26",
          "value": 50.7
        },
        {
          "timestamp": "03/27",
          "value": 56.8
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 75.8
        },
        {
          "timestamp": "03/15",
          "value": 76
        },
        {
          "timestamp": "03/16",
          "value": 79.7
        },
        {
          "timestamp": "03/17",
          "value": 80.1
        },
        {
          "timestamp": "03/18",
          "value": 84.3
        },
        {
          "timestamp": "03/19",
          "value": 76.7
        },
        {
          "timestamp": "03/20",
          "value": 74.5
        },
        {
          "timestamp": "03/21",
          "value": 72.2
        },
        {
          "timestamp": "03/22",
          "value": 67.8
        },
        {
          "timestamp": "03/23",
          "value": 66
        },
        {
          "timestamp": "03/24",
          "value": 70.3
        },
        {
          "timestamp": "03/25",
          "value": 69.9
        },
        {
          "timestamp": "03/26",
          "value": 72.9
        },
        {
          "timestamp": "03/27",
          "value": 78.6
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 503.9
        },
        {
          "timestamp": "03/15",
          "value": 540.7
        },
        {
          "timestamp": "03/16",
          "value": 563.2
        },
        {
          "timestamp": "03/17",
          "value": 582.5
        },
        {
          "timestamp": "03/18",
          "value": 572.6
        },
        {
          "timestamp": "03/19",
          "value": 538.1
        },
        {
          "timestamp": "03/20",
          "value": 505.1
        },
        {
          "timestamp": "03/21",
          "value": 489.5
        },
        {
          "timestamp": "03/22",
          "value": 496.8
        },
        {
          "timestamp": "03/23",
          "value": 446.7
        },
        {
          "timestamp": "03/24",
          "value": 483.5
        },
        {
          "timestamp": "03/25",
          "value": 475.5
        },
        {
          "timestamp": "03/26",
          "value": 474.1
        },
        {
          "timestamp": "03/27",
          "value": 543.8
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 40.3
        },
        {
          "timestamp": "03/15",
          "value": 40.1
        },
        {
          "timestamp": "03/16",
          "value": 40.6
        },
        {
          "timestamp": "03/17",
          "value": 47.6
        },
        {
          "timestamp": "03/18",
          "value": 47.5
        },
        {
          "timestamp": "03/19",
          "value": 44.7
        },
        {
          "timestamp": "03/20",
          "value": 43.1
        },
        {
          "timestamp": "03/21",
          "value": 40.7
        },
        {
          "timestamp": "03/22",
          "value": 33.1
        },
        {
          "timestamp": "03/23",
          "value": 34.1
        },
        {
          "timestamp": "03/24",
          "value": 33
        },
        {
          "timestamp": "03/25",
          "value": 41
        },
        {
          "timestamp": "03/26",
          "value": 39
        },
        {
          "timestamp": "03/27",
          "value": 41.1
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 64.2
        },
        {
          "timestamp": "03/15",
          "value": 71.8
        },
        {
          "timestamp": "03/16",
          "value": 71.5
        },
        {
          "timestamp": "03/17",
          "value": 71.1
        },
        {
          "timestamp": "03/18",
          "value": 76.5
        },
        {
          "timestamp": "03/19",
          "value": 69.4
        },
        {
          "timestamp": "03/20",
          "value": 68.4
        },
        {
          "timestamp": "03/21",
          "value": 71.3
        },
        {
          "timestamp": "03/22",
          "value": 67.4
        },
        {
          "timestamp": "03/23",
          "value": 63.3
        },
        {
          "timestamp": "03/24",
          "value": 65.6
        },
        {
          "timestamp": "03/25",
          "value": 64
        },
        {
          "timestamp": "03/26",
          "value": 66.4
        },
        {
          "timestamp": "03/27",
          "value": 68.3
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu110",
    "label": "GPU-110",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "warn",
    "current": {
      "gpuUsage": 99,
      "memUsage": 82,
      "temp": 93,
      "power": 988,
      "cpuUsage": 31,
      "cpuMemUsage": 51
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 100
        },
        {
          "timestamp": "03/15",
          "value": 105.1
        },
        {
          "timestamp": "03/16",
          "value": 101.7
        },
        {
          "timestamp": "03/17",
          "value": 116.2
        },
        {
          "timestamp": "03/18",
          "value": 114.8
        },
        {
          "timestamp": "03/19",
          "value": 110.5
        },
        {
          "timestamp": "03/20",
          "value": 108.5
        },
        {
          "timestamp": "03/21",
          "value": 99.2
        },
        {
          "timestamp": "03/22",
          "value": 95.3
        },
        {
          "timestamp": "03/23",
          "value": 95.8
        },
        {
          "timestamp": "03/24",
          "value": 90
        },
        {
          "timestamp": "03/25",
          "value": 100.5
        },
        {
          "timestamp": "03/26",
          "value": 87.3
        },
        {
          "timestamp": "03/27",
          "value": 97.3
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 79.3
        },
        {
          "timestamp": "03/15",
          "value": 91.5
        },
        {
          "timestamp": "03/16",
          "value": 84.1
        },
        {
          "timestamp": "03/17",
          "value": 90.6
        },
        {
          "timestamp": "03/18",
          "value": 95.3
        },
        {
          "timestamp": "03/19",
          "value": 85.8
        },
        {
          "timestamp": "03/20",
          "value": 81.1
        },
        {
          "timestamp": "03/21",
          "value": 81.1
        },
        {
          "timestamp": "03/22",
          "value": 75.7
        },
        {
          "timestamp": "03/23",
          "value": 69.3
        },
        {
          "timestamp": "03/24",
          "value": 77.2
        },
        {
          "timestamp": "03/25",
          "value": 70.7
        },
        {
          "timestamp": "03/26",
          "value": 85.1
        },
        {
          "timestamp": "03/27",
          "value": 89.1
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 95.4
        },
        {
          "timestamp": "03/15",
          "value": 100.8
        },
        {
          "timestamp": "03/16",
          "value": 101.5
        },
        {
          "timestamp": "03/17",
          "value": 105.9
        },
        {
          "timestamp": "03/18",
          "value": 103.9
        },
        {
          "timestamp": "03/19",
          "value": 98.7
        },
        {
          "timestamp": "03/20",
          "value": 90.9
        },
        {
          "timestamp": "03/21",
          "value": 86.3
        },
        {
          "timestamp": "03/22",
          "value": 89.6
        },
        {
          "timestamp": "03/23",
          "value": 81.1
        },
        {
          "timestamp": "03/24",
          "value": 83.8
        },
        {
          "timestamp": "03/25",
          "value": 86.3
        },
        {
          "timestamp": "03/26",
          "value": 91.6
        },
        {
          "timestamp": "03/27",
          "value": 98.5
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 961.6
        },
        {
          "timestamp": "03/15",
          "value": 1071.9
        },
        {
          "timestamp": "03/16",
          "value": 1022.4
        },
        {
          "timestamp": "03/17",
          "value": 1033.1
        },
        {
          "timestamp": "03/18",
          "value": 1109.8
        },
        {
          "timestamp": "03/19",
          "value": 1085.5
        },
        {
          "timestamp": "03/20",
          "value": 1021
        },
        {
          "timestamp": "03/21",
          "value": 965.8
        },
        {
          "timestamp": "03/22",
          "value": 954.2
        },
        {
          "timestamp": "03/23",
          "value": 944.4
        },
        {
          "timestamp": "03/24",
          "value": 918.9
        },
        {
          "timestamp": "03/25",
          "value": 873.4
        },
        {
          "timestamp": "03/26",
          "value": 992.3
        },
        {
          "timestamp": "03/27",
          "value": 1029.8
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 32.3
        },
        {
          "timestamp": "03/15",
          "value": 32
        },
        {
          "timestamp": "03/16",
          "value": 30.6
        },
        {
          "timestamp": "03/17",
          "value": 35
        },
        {
          "timestamp": "03/18",
          "value": 35.8
        },
        {
          "timestamp": "03/19",
          "value": 33.9
        },
        {
          "timestamp": "03/20",
          "value": 32
        },
        {
          "timestamp": "03/21",
          "value": 27.8
        },
        {
          "timestamp": "03/22",
          "value": 31.1
        },
        {
          "timestamp": "03/23",
          "value": 26.5
        },
        {
          "timestamp": "03/24",
          "value": 27.2
        },
        {
          "timestamp": "03/25",
          "value": 31.4
        },
        {
          "timestamp": "03/26",
          "value": 32.7
        },
        {
          "timestamp": "03/27",
          "value": 30.1
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 50.8
        },
        {
          "timestamp": "03/15",
          "value": 53.1
        },
        {
          "timestamp": "03/16",
          "value": 53.1
        },
        {
          "timestamp": "03/17",
          "value": 52.9
        },
        {
          "timestamp": "03/18",
          "value": 55.9
        },
        {
          "timestamp": "03/19",
          "value": 57
        },
        {
          "timestamp": "03/20",
          "value": 52.8
        },
        {
          "timestamp": "03/21",
          "value": 50.9
        },
        {
          "timestamp": "03/22",
          "value": 49.4
        },
        {
          "timestamp": "03/23",
          "value": 46.8
        },
        {
          "timestamp": "03/24",
          "value": 47.3
        },
        {
          "timestamp": "03/25",
          "value": 45
        },
        {
          "timestamp": "03/26",
          "value": 46.2
        },
        {
          "timestamp": "03/27",
          "value": 50.2
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu111",
    "label": "GPU-111",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 54,
      "memUsage": 77,
      "temp": 67,
      "power": 634,
      "cpuUsage": 42,
      "cpuMemUsage": 37
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 52.2
        },
        {
          "timestamp": "03/15",
          "value": 58.3
        },
        {
          "timestamp": "03/16",
          "value": 62.9
        },
        {
          "timestamp": "03/17",
          "value": 63
        },
        {
          "timestamp": "03/18",
          "value": 58.8
        },
        {
          "timestamp": "03/19",
          "value": 53
        },
        {
          "timestamp": "03/20",
          "value": 53.9
        },
        {
          "timestamp": "03/21",
          "value": 54.1
        },
        {
          "timestamp": "03/22",
          "value": 54.2
        },
        {
          "timestamp": "03/23",
          "value": 49.7
        },
        {
          "timestamp": "03/24",
          "value": 50.1
        },
        {
          "timestamp": "03/25",
          "value": 51.3
        },
        {
          "timestamp": "03/26",
          "value": 53.5
        },
        {
          "timestamp": "03/27",
          "value": 54.2
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 75.5
        },
        {
          "timestamp": "03/15",
          "value": 79.5
        },
        {
          "timestamp": "03/16",
          "value": 84.4
        },
        {
          "timestamp": "03/17",
          "value": 86.9
        },
        {
          "timestamp": "03/18",
          "value": 82.6
        },
        {
          "timestamp": "03/19",
          "value": 77.9
        },
        {
          "timestamp": "03/20",
          "value": 73
        },
        {
          "timestamp": "03/21",
          "value": 79.4
        },
        {
          "timestamp": "03/22",
          "value": 66.5
        },
        {
          "timestamp": "03/23",
          "value": 75
        },
        {
          "timestamp": "03/24",
          "value": 66.7
        },
        {
          "timestamp": "03/25",
          "value": 71.5
        },
        {
          "timestamp": "03/26",
          "value": 76.2
        },
        {
          "timestamp": "03/27",
          "value": 80.3
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 67.4
        },
        {
          "timestamp": "03/15",
          "value": 68.7
        },
        {
          "timestamp": "03/16",
          "value": 73.4
        },
        {
          "timestamp": "03/17",
          "value": 71
        },
        {
          "timestamp": "03/18",
          "value": 70.7
        },
        {
          "timestamp": "03/19",
          "value": 73.4
        },
        {
          "timestamp": "03/20",
          "value": 65.4
        },
        {
          "timestamp": "03/21",
          "value": 65.2
        },
        {
          "timestamp": "03/22",
          "value": 59.8
        },
        {
          "timestamp": "03/23",
          "value": 61
        },
        {
          "timestamp": "03/24",
          "value": 61.4
        },
        {
          "timestamp": "03/25",
          "value": 61.5
        },
        {
          "timestamp": "03/26",
          "value": 63.3
        },
        {
          "timestamp": "03/27",
          "value": 70
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 643.4
        },
        {
          "timestamp": "03/15",
          "value": 701.4
        },
        {
          "timestamp": "03/16",
          "value": 667.6
        },
        {
          "timestamp": "03/17",
          "value": 674.8
        },
        {
          "timestamp": "03/18",
          "value": 671.6
        },
        {
          "timestamp": "03/19",
          "value": 639.3
        },
        {
          "timestamp": "03/20",
          "value": 612.4
        },
        {
          "timestamp": "03/21",
          "value": 613.1
        },
        {
          "timestamp": "03/22",
          "value": 564
        },
        {
          "timestamp": "03/23",
          "value": 567.3
        },
        {
          "timestamp": "03/24",
          "value": 587.1
        },
        {
          "timestamp": "03/25",
          "value": 561.7
        },
        {
          "timestamp": "03/26",
          "value": 605.4
        },
        {
          "timestamp": "03/27",
          "value": 654.8
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 39.8
        },
        {
          "timestamp": "03/15",
          "value": 39.9
        },
        {
          "timestamp": "03/16",
          "value": 44.4
        },
        {
          "timestamp": "03/17",
          "value": 42.4
        },
        {
          "timestamp": "03/18",
          "value": 49
        },
        {
          "timestamp": "03/19",
          "value": 41.6
        },
        {
          "timestamp": "03/20",
          "value": 41.6
        },
        {
          "timestamp": "03/21",
          "value": 42.9
        },
        {
          "timestamp": "03/22",
          "value": 40.8
        },
        {
          "timestamp": "03/23",
          "value": 41.2
        },
        {
          "timestamp": "03/24",
          "value": 41.1
        },
        {
          "timestamp": "03/25",
          "value": 39.8
        },
        {
          "timestamp": "03/26",
          "value": 43.9
        },
        {
          "timestamp": "03/27",
          "value": 44.2
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 35.6
        },
        {
          "timestamp": "03/15",
          "value": 40.6
        },
        {
          "timestamp": "03/16",
          "value": 39.7
        },
        {
          "timestamp": "03/17",
          "value": 38.8
        },
        {
          "timestamp": "03/18",
          "value": 39.5
        },
        {
          "timestamp": "03/19",
          "value": 41.1
        },
        {
          "timestamp": "03/20",
          "value": 39.1
        },
        {
          "timestamp": "03/21",
          "value": 37.7
        },
        {
          "timestamp": "03/22",
          "value": 33.2
        },
        {
          "timestamp": "03/23",
          "value": 33.9
        },
        {
          "timestamp": "03/24",
          "value": 32.4
        },
        {
          "timestamp": "03/25",
          "value": 36.1
        },
        {
          "timestamp": "03/26",
          "value": 38.1
        },
        {
          "timestamp": "03/27",
          "value": 38.8
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu112",
    "label": "GPU-112",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "warn",
    "current": {
      "gpuUsage": 85,
      "memUsage": 84,
      "temp": 89,
      "power": 923,
      "cpuUsage": 52,
      "cpuMemUsage": 40
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 90.4
        },
        {
          "timestamp": "03/15",
          "value": 96.4
        },
        {
          "timestamp": "03/16",
          "value": 89.6
        },
        {
          "timestamp": "03/17",
          "value": 100.3
        },
        {
          "timestamp": "03/18",
          "value": 97.5
        },
        {
          "timestamp": "03/19",
          "value": 96.4
        },
        {
          "timestamp": "03/20",
          "value": 82
        },
        {
          "timestamp": "03/21",
          "value": 85.4
        },
        {
          "timestamp": "03/22",
          "value": 79.2
        },
        {
          "timestamp": "03/23",
          "value": 77.6
        },
        {
          "timestamp": "03/24",
          "value": 79
        },
        {
          "timestamp": "03/25",
          "value": 81.3
        },
        {
          "timestamp": "03/26",
          "value": 82.9
        },
        {
          "timestamp": "03/27",
          "value": 90.3
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 89.4
        },
        {
          "timestamp": "03/15",
          "value": 82.1
        },
        {
          "timestamp": "03/16",
          "value": 89.8
        },
        {
          "timestamp": "03/17",
          "value": 87.1
        },
        {
          "timestamp": "03/18",
          "value": 89.3
        },
        {
          "timestamp": "03/19",
          "value": 92.7
        },
        {
          "timestamp": "03/20",
          "value": 89.4
        },
        {
          "timestamp": "03/21",
          "value": 80.8
        },
        {
          "timestamp": "03/22",
          "value": 79.4
        },
        {
          "timestamp": "03/23",
          "value": 73.4
        },
        {
          "timestamp": "03/24",
          "value": 76.6
        },
        {
          "timestamp": "03/25",
          "value": 83
        },
        {
          "timestamp": "03/26",
          "value": 85
        },
        {
          "timestamp": "03/27",
          "value": 89.7
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 88
        },
        {
          "timestamp": "03/15",
          "value": 95.2
        },
        {
          "timestamp": "03/16",
          "value": 98.1
        },
        {
          "timestamp": "03/17",
          "value": 100.8
        },
        {
          "timestamp": "03/18",
          "value": 97.5
        },
        {
          "timestamp": "03/19",
          "value": 96.7
        },
        {
          "timestamp": "03/20",
          "value": 91.5
        },
        {
          "timestamp": "03/21",
          "value": 84.7
        },
        {
          "timestamp": "03/22",
          "value": 83.1
        },
        {
          "timestamp": "03/23",
          "value": 79.4
        },
        {
          "timestamp": "03/24",
          "value": 80.9
        },
        {
          "timestamp": "03/25",
          "value": 79.9
        },
        {
          "timestamp": "03/26",
          "value": 88.6
        },
        {
          "timestamp": "03/27",
          "value": 88.6
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 889.4
        },
        {
          "timestamp": "03/15",
          "value": 978.1
        },
        {
          "timestamp": "03/16",
          "value": 1000
        },
        {
          "timestamp": "03/17",
          "value": 995.6
        },
        {
          "timestamp": "03/18",
          "value": 1029
        },
        {
          "timestamp": "03/19",
          "value": 942.2
        },
        {
          "timestamp": "03/20",
          "value": 935.7
        },
        {
          "timestamp": "03/21",
          "value": 932.1
        },
        {
          "timestamp": "03/22",
          "value": 849.1
        },
        {
          "timestamp": "03/23",
          "value": 862.8
        },
        {
          "timestamp": "03/24",
          "value": 863.5
        },
        {
          "timestamp": "03/25",
          "value": 866.9
        },
        {
          "timestamp": "03/26",
          "value": 884.9
        },
        {
          "timestamp": "03/27",
          "value": 927.7
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 54.3
        },
        {
          "timestamp": "03/15",
          "value": 54
        },
        {
          "timestamp": "03/16",
          "value": 53.4
        },
        {
          "timestamp": "03/17",
          "value": 59.6
        },
        {
          "timestamp": "03/18",
          "value": 61.3
        },
        {
          "timestamp": "03/19",
          "value": 55.6
        },
        {
          "timestamp": "03/20",
          "value": 51.2
        },
        {
          "timestamp": "03/21",
          "value": 52.8
        },
        {
          "timestamp": "03/22",
          "value": 50.2
        },
        {
          "timestamp": "03/23",
          "value": 44.9
        },
        {
          "timestamp": "03/24",
          "value": 51.7
        },
        {
          "timestamp": "03/25",
          "value": 53.4
        },
        {
          "timestamp": "03/26",
          "value": 55.3
        },
        {
          "timestamp": "03/27",
          "value": 58.3
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 40.5
        },
        {
          "timestamp": "03/15",
          "value": 43.3
        },
        {
          "timestamp": "03/16",
          "value": 42.3
        },
        {
          "timestamp": "03/17",
          "value": 44.9
        },
        {
          "timestamp": "03/18",
          "value": 45.4
        },
        {
          "timestamp": "03/19",
          "value": 41.6
        },
        {
          "timestamp": "03/20",
          "value": 43
        },
        {
          "timestamp": "03/21",
          "value": 40.4
        },
        {
          "timestamp": "03/22",
          "value": 36.2
        },
        {
          "timestamp": "03/23",
          "value": 36.9
        },
        {
          "timestamp": "03/24",
          "value": 35.3
        },
        {
          "timestamp": "03/25",
          "value": 37.5
        },
        {
          "timestamp": "03/26",
          "value": 37.3
        },
        {
          "timestamp": "03/27",
          "value": 38.8
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu113",
    "label": "GPU-113",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 61,
      "memUsage": 41,
      "temp": 66,
      "power": 805,
      "cpuUsage": 36,
      "cpuMemUsage": 76
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 56.5
        },
        {
          "timestamp": "03/15",
          "value": 62.3
        },
        {
          "timestamp": "03/16",
          "value": 68
        },
        {
          "timestamp": "03/17",
          "value": 62.4
        },
        {
          "timestamp": "03/18",
          "value": 62.9
        },
        {
          "timestamp": "03/19",
          "value": 64.2
        },
        {
          "timestamp": "03/20",
          "value": 63
        },
        {
          "timestamp": "03/21",
          "value": 63.9
        },
        {
          "timestamp": "03/22",
          "value": 61.7
        },
        {
          "timestamp": "03/23",
          "value": 54.6
        },
        {
          "timestamp": "03/24",
          "value": 59.9
        },
        {
          "timestamp": "03/25",
          "value": 61.6
        },
        {
          "timestamp": "03/26",
          "value": 63.5
        },
        {
          "timestamp": "03/27",
          "value": 62.7
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 42.8
        },
        {
          "timestamp": "03/15",
          "value": 42.6
        },
        {
          "timestamp": "03/16",
          "value": 43.7
        },
        {
          "timestamp": "03/17",
          "value": 42.6
        },
        {
          "timestamp": "03/18",
          "value": 44.7
        },
        {
          "timestamp": "03/19",
          "value": 42.8
        },
        {
          "timestamp": "03/20",
          "value": 39.1
        },
        {
          "timestamp": "03/21",
          "value": 39.4
        },
        {
          "timestamp": "03/22",
          "value": 40.4
        },
        {
          "timestamp": "03/23",
          "value": 34.7
        },
        {
          "timestamp": "03/24",
          "value": 38.5
        },
        {
          "timestamp": "03/25",
          "value": 37.1
        },
        {
          "timestamp": "03/26",
          "value": 40.8
        },
        {
          "timestamp": "03/27",
          "value": 44.8
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 64
        },
        {
          "timestamp": "03/15",
          "value": 67.7
        },
        {
          "timestamp": "03/16",
          "value": 72.3
        },
        {
          "timestamp": "03/17",
          "value": 73.5
        },
        {
          "timestamp": "03/18",
          "value": 72.3
        },
        {
          "timestamp": "03/19",
          "value": 69.3
        },
        {
          "timestamp": "03/20",
          "value": 68.9
        },
        {
          "timestamp": "03/21",
          "value": 61.8
        },
        {
          "timestamp": "03/22",
          "value": 62
        },
        {
          "timestamp": "03/23",
          "value": 57.1
        },
        {
          "timestamp": "03/24",
          "value": 62
        },
        {
          "timestamp": "03/25",
          "value": 62.5
        },
        {
          "timestamp": "03/26",
          "value": 62.5
        },
        {
          "timestamp": "03/27",
          "value": 65.7
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 761
        },
        {
          "timestamp": "03/15",
          "value": 867
        },
        {
          "timestamp": "03/16",
          "value": 893.2
        },
        {
          "timestamp": "03/17",
          "value": 878.9
        },
        {
          "timestamp": "03/18",
          "value": 922.3
        },
        {
          "timestamp": "03/19",
          "value": 830.1
        },
        {
          "timestamp": "03/20",
          "value": 836.6
        },
        {
          "timestamp": "03/21",
          "value": 805.2
        },
        {
          "timestamp": "03/22",
          "value": 775
        },
        {
          "timestamp": "03/23",
          "value": 703.9
        },
        {
          "timestamp": "03/24",
          "value": 771.8
        },
        {
          "timestamp": "03/25",
          "value": 787.5
        },
        {
          "timestamp": "03/26",
          "value": 738.1
        },
        {
          "timestamp": "03/27",
          "value": 839.7
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 38.2
        },
        {
          "timestamp": "03/15",
          "value": 41
        },
        {
          "timestamp": "03/16",
          "value": 38.8
        },
        {
          "timestamp": "03/17",
          "value": 43.2
        },
        {
          "timestamp": "03/18",
          "value": 39.9
        },
        {
          "timestamp": "03/19",
          "value": 39.5
        },
        {
          "timestamp": "03/20",
          "value": 34.4
        },
        {
          "timestamp": "03/21",
          "value": 35.8
        },
        {
          "timestamp": "03/22",
          "value": 33
        },
        {
          "timestamp": "03/23",
          "value": 31.5
        },
        {
          "timestamp": "03/24",
          "value": 32.9
        },
        {
          "timestamp": "03/25",
          "value": 30.6
        },
        {
          "timestamp": "03/26",
          "value": 35.7
        },
        {
          "timestamp": "03/27",
          "value": 38.1
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 78.6
        },
        {
          "timestamp": "03/15",
          "value": 83.3
        },
        {
          "timestamp": "03/16",
          "value": 85.1
        },
        {
          "timestamp": "03/17",
          "value": 86.2
        },
        {
          "timestamp": "03/18",
          "value": 85.4
        },
        {
          "timestamp": "03/19",
          "value": 78.3
        },
        {
          "timestamp": "03/20",
          "value": 73.9
        },
        {
          "timestamp": "03/21",
          "value": 71.5
        },
        {
          "timestamp": "03/22",
          "value": 65.9
        },
        {
          "timestamp": "03/23",
          "value": 65.3
        },
        {
          "timestamp": "03/24",
          "value": 73.7
        },
        {
          "timestamp": "03/25",
          "value": 70.3
        },
        {
          "timestamp": "03/26",
          "value": 71
        },
        {
          "timestamp": "03/27",
          "value": 75.8
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu114",
    "label": "GPU-114",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 63,
      "memUsage": 55,
      "temp": 71,
      "power": 464,
      "cpuUsage": 38,
      "cpuMemUsage": 51
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 59.1
        },
        {
          "timestamp": "03/15",
          "value": 61.1
        },
        {
          "timestamp": "03/16",
          "value": 65.8
        },
        {
          "timestamp": "03/17",
          "value": 74.4
        },
        {
          "timestamp": "03/18",
          "value": 65.4
        },
        {
          "timestamp": "03/19",
          "value": 68.2
        },
        {
          "timestamp": "03/20",
          "value": 59.3
        },
        {
          "timestamp": "03/21",
          "value": 55.8
        },
        {
          "timestamp": "03/22",
          "value": 54.6
        },
        {
          "timestamp": "03/23",
          "value": 59.1
        },
        {
          "timestamp": "03/24",
          "value": 61.8
        },
        {
          "timestamp": "03/25",
          "value": 53.7
        },
        {
          "timestamp": "03/26",
          "value": 66.9
        },
        {
          "timestamp": "03/27",
          "value": 68.2
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 58.8
        },
        {
          "timestamp": "03/15",
          "value": 57.8
        },
        {
          "timestamp": "03/16",
          "value": 62.5
        },
        {
          "timestamp": "03/17",
          "value": 57.6
        },
        {
          "timestamp": "03/18",
          "value": 57.4
        },
        {
          "timestamp": "03/19",
          "value": 57.5
        },
        {
          "timestamp": "03/20",
          "value": 57.3
        },
        {
          "timestamp": "03/21",
          "value": 55.3
        },
        {
          "timestamp": "03/22",
          "value": 49.6
        },
        {
          "timestamp": "03/23",
          "value": 51.2
        },
        {
          "timestamp": "03/24",
          "value": 48.7
        },
        {
          "timestamp": "03/25",
          "value": 53
        },
        {
          "timestamp": "03/26",
          "value": 50.9
        },
        {
          "timestamp": "03/27",
          "value": 54
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 68.9
        },
        {
          "timestamp": "03/15",
          "value": 76.7
        },
        {
          "timestamp": "03/16",
          "value": 76.2
        },
        {
          "timestamp": "03/17",
          "value": 79.9
        },
        {
          "timestamp": "03/18",
          "value": 79.6
        },
        {
          "timestamp": "03/19",
          "value": 75.9
        },
        {
          "timestamp": "03/20",
          "value": 69.5
        },
        {
          "timestamp": "03/21",
          "value": 67.3
        },
        {
          "timestamp": "03/22",
          "value": 67.9
        },
        {
          "timestamp": "03/23",
          "value": 66.7
        },
        {
          "timestamp": "03/24",
          "value": 61.4
        },
        {
          "timestamp": "03/25",
          "value": 63.4
        },
        {
          "timestamp": "03/26",
          "value": 68.3
        },
        {
          "timestamp": "03/27",
          "value": 74.2
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 484.9
        },
        {
          "timestamp": "03/15",
          "value": 487.4
        },
        {
          "timestamp": "03/16",
          "value": 493.7
        },
        {
          "timestamp": "03/17",
          "value": 530.3
        },
        {
          "timestamp": "03/18",
          "value": 504.6
        },
        {
          "timestamp": "03/19",
          "value": 484.7
        },
        {
          "timestamp": "03/20",
          "value": 466.7
        },
        {
          "timestamp": "03/21",
          "value": 420.5
        },
        {
          "timestamp": "03/22",
          "value": 453.1
        },
        {
          "timestamp": "03/23",
          "value": 394.2
        },
        {
          "timestamp": "03/24",
          "value": 440.7
        },
        {
          "timestamp": "03/25",
          "value": 458.3
        },
        {
          "timestamp": "03/26",
          "value": 454.1
        },
        {
          "timestamp": "03/27",
          "value": 450.7
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 36.3
        },
        {
          "timestamp": "03/15",
          "value": 37.9
        },
        {
          "timestamp": "03/16",
          "value": 41.9
        },
        {
          "timestamp": "03/17",
          "value": 45.5
        },
        {
          "timestamp": "03/18",
          "value": 40.4
        },
        {
          "timestamp": "03/19",
          "value": 44.1
        },
        {
          "timestamp": "03/20",
          "value": 41.8
        },
        {
          "timestamp": "03/21",
          "value": 33.6
        },
        {
          "timestamp": "03/22",
          "value": 38.6
        },
        {
          "timestamp": "03/23",
          "value": 32.6
        },
        {
          "timestamp": "03/24",
          "value": 34.3
        },
        {
          "timestamp": "03/25",
          "value": 32.4
        },
        {
          "timestamp": "03/26",
          "value": 35.3
        },
        {
          "timestamp": "03/27",
          "value": 38.9
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 53.7
        },
        {
          "timestamp": "03/15",
          "value": 53
        },
        {
          "timestamp": "03/16",
          "value": 57.5
        },
        {
          "timestamp": "03/17",
          "value": 58.6
        },
        {
          "timestamp": "03/18",
          "value": 52.7
        },
        {
          "timestamp": "03/19",
          "value": 53.9
        },
        {
          "timestamp": "03/20",
          "value": 54.4
        },
        {
          "timestamp": "03/21",
          "value": 52.3
        },
        {
          "timestamp": "03/22",
          "value": 46
        },
        {
          "timestamp": "03/23",
          "value": 43.9
        },
        {
          "timestamp": "03/24",
          "value": 48.1
        },
        {
          "timestamp": "03/25",
          "value": 50.8
        },
        {
          "timestamp": "03/26",
          "value": 46
        },
        {
          "timestamp": "03/27",
          "value": 54.7
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu115",
    "label": "GPU-115",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 30,
      "memUsage": 25,
      "temp": 79,
      "power": 517,
      "cpuUsage": 48,
      "cpuMemUsage": 73
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 31.3
        },
        {
          "timestamp": "03/15",
          "value": 29.5
        },
        {
          "timestamp": "03/16",
          "value": 34.3
        },
        {
          "timestamp": "03/17",
          "value": 32.5
        },
        {
          "timestamp": "03/18",
          "value": 32.3
        },
        {
          "timestamp": "03/19",
          "value": 30.6
        },
        {
          "timestamp": "03/20",
          "value": 28.3
        },
        {
          "timestamp": "03/21",
          "value": 28.9
        },
        {
          "timestamp": "03/22",
          "value": 25.3
        },
        {
          "timestamp": "03/23",
          "value": 26.1
        },
        {
          "timestamp": "03/24",
          "value": 25.3
        },
        {
          "timestamp": "03/25",
          "value": 25.6
        },
        {
          "timestamp": "03/26",
          "value": 29.1
        },
        {
          "timestamp": "03/27",
          "value": 28.9
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 26.8
        },
        {
          "timestamp": "03/15",
          "value": 26.8
        },
        {
          "timestamp": "03/16",
          "value": 26.7
        },
        {
          "timestamp": "03/17",
          "value": 29
        },
        {
          "timestamp": "03/18",
          "value": 26.8
        },
        {
          "timestamp": "03/19",
          "value": 28.2
        },
        {
          "timestamp": "03/20",
          "value": 25.3
        },
        {
          "timestamp": "03/21",
          "value": 23.4
        },
        {
          "timestamp": "03/22",
          "value": 23.8
        },
        {
          "timestamp": "03/23",
          "value": 21.2
        },
        {
          "timestamp": "03/24",
          "value": 23.7
        },
        {
          "timestamp": "03/25",
          "value": 22.6
        },
        {
          "timestamp": "03/26",
          "value": 24.5
        },
        {
          "timestamp": "03/27",
          "value": 24
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 82.2
        },
        {
          "timestamp": "03/15",
          "value": 85.8
        },
        {
          "timestamp": "03/16",
          "value": 85.8
        },
        {
          "timestamp": "03/17",
          "value": 87.3
        },
        {
          "timestamp": "03/18",
          "value": 83.1
        },
        {
          "timestamp": "03/19",
          "value": 83.3
        },
        {
          "timestamp": "03/20",
          "value": 78.1
        },
        {
          "timestamp": "03/21",
          "value": 77.9
        },
        {
          "timestamp": "03/22",
          "value": 72.6
        },
        {
          "timestamp": "03/23",
          "value": 70.3
        },
        {
          "timestamp": "03/24",
          "value": 69.5
        },
        {
          "timestamp": "03/25",
          "value": 72.9
        },
        {
          "timestamp": "03/26",
          "value": 75.4
        },
        {
          "timestamp": "03/27",
          "value": 78.4
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 499.2
        },
        {
          "timestamp": "03/15",
          "value": 568.7
        },
        {
          "timestamp": "03/16",
          "value": 572
        },
        {
          "timestamp": "03/17",
          "value": 575.5
        },
        {
          "timestamp": "03/18",
          "value": 566.3
        },
        {
          "timestamp": "03/19",
          "value": 552.5
        },
        {
          "timestamp": "03/20",
          "value": 551.2
        },
        {
          "timestamp": "03/21",
          "value": 524.9
        },
        {
          "timestamp": "03/22",
          "value": 456.6
        },
        {
          "timestamp": "03/23",
          "value": 450.3
        },
        {
          "timestamp": "03/24",
          "value": 478.9
        },
        {
          "timestamp": "03/25",
          "value": 496.4
        },
        {
          "timestamp": "03/26",
          "value": 485
        },
        {
          "timestamp": "03/27",
          "value": 511.4
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 45.5
        },
        {
          "timestamp": "03/15",
          "value": 50.8
        },
        {
          "timestamp": "03/16",
          "value": 47.5
        },
        {
          "timestamp": "03/17",
          "value": 54.7
        },
        {
          "timestamp": "03/18",
          "value": 55.4
        },
        {
          "timestamp": "03/19",
          "value": 55.3
        },
        {
          "timestamp": "03/20",
          "value": 44
        },
        {
          "timestamp": "03/21",
          "value": 48.5
        },
        {
          "timestamp": "03/22",
          "value": 47
        },
        {
          "timestamp": "03/23",
          "value": 45.9
        },
        {
          "timestamp": "03/24",
          "value": 45.6
        },
        {
          "timestamp": "03/25",
          "value": 45
        },
        {
          "timestamp": "03/26",
          "value": 51.1
        },
        {
          "timestamp": "03/27",
          "value": 51.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 73
        },
        {
          "timestamp": "03/15",
          "value": 77.3
        },
        {
          "timestamp": "03/16",
          "value": 80.1
        },
        {
          "timestamp": "03/17",
          "value": 77.7
        },
        {
          "timestamp": "03/18",
          "value": 75.6
        },
        {
          "timestamp": "03/19",
          "value": 79.3
        },
        {
          "timestamp": "03/20",
          "value": 74.8
        },
        {
          "timestamp": "03/21",
          "value": 73
        },
        {
          "timestamp": "03/22",
          "value": 65.3
        },
        {
          "timestamp": "03/23",
          "value": 67.8
        },
        {
          "timestamp": "03/24",
          "value": 65.3
        },
        {
          "timestamp": "03/25",
          "value": 64.8
        },
        {
          "timestamp": "03/26",
          "value": 74.4
        },
        {
          "timestamp": "03/27",
          "value": 74.1
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu116",
    "label": "GPU-116",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 62,
      "memUsage": 36,
      "temp": 58,
      "power": 409,
      "cpuUsage": 36,
      "cpuMemUsage": 68
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 62.1
        },
        {
          "timestamp": "03/15",
          "value": 61.6
        },
        {
          "timestamp": "03/16",
          "value": 63.8
        },
        {
          "timestamp": "03/17",
          "value": 67.4
        },
        {
          "timestamp": "03/18",
          "value": 65.7
        },
        {
          "timestamp": "03/19",
          "value": 60.8
        },
        {
          "timestamp": "03/20",
          "value": 60.9
        },
        {
          "timestamp": "03/21",
          "value": 55.5
        },
        {
          "timestamp": "03/22",
          "value": 56.8
        },
        {
          "timestamp": "03/23",
          "value": 50.7
        },
        {
          "timestamp": "03/24",
          "value": 61.3
        },
        {
          "timestamp": "03/25",
          "value": 60.7
        },
        {
          "timestamp": "03/26",
          "value": 56.5
        },
        {
          "timestamp": "03/27",
          "value": 68.5
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 33.9
        },
        {
          "timestamp": "03/15",
          "value": 39.5
        },
        {
          "timestamp": "03/16",
          "value": 39.8
        },
        {
          "timestamp": "03/17",
          "value": 38.7
        },
        {
          "timestamp": "03/18",
          "value": 39.8
        },
        {
          "timestamp": "03/19",
          "value": 40.2
        },
        {
          "timestamp": "03/20",
          "value": 34.3
        },
        {
          "timestamp": "03/21",
          "value": 36.4
        },
        {
          "timestamp": "03/22",
          "value": 34.1
        },
        {
          "timestamp": "03/23",
          "value": 32.5
        },
        {
          "timestamp": "03/24",
          "value": 30.5
        },
        {
          "timestamp": "03/25",
          "value": 35.3
        },
        {
          "timestamp": "03/26",
          "value": 33.1
        },
        {
          "timestamp": "03/27",
          "value": 39.2
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 56.5
        },
        {
          "timestamp": "03/15",
          "value": 61.2
        },
        {
          "timestamp": "03/16",
          "value": 64.9
        },
        {
          "timestamp": "03/17",
          "value": 64.3
        },
        {
          "timestamp": "03/18",
          "value": 61.3
        },
        {
          "timestamp": "03/19",
          "value": 62.7
        },
        {
          "timestamp": "03/20",
          "value": 58.4
        },
        {
          "timestamp": "03/21",
          "value": 54.4
        },
        {
          "timestamp": "03/22",
          "value": 54.6
        },
        {
          "timestamp": "03/23",
          "value": 51.7
        },
        {
          "timestamp": "03/24",
          "value": 52.1
        },
        {
          "timestamp": "03/25",
          "value": 55.9
        },
        {
          "timestamp": "03/26",
          "value": 56.3
        },
        {
          "timestamp": "03/27",
          "value": 58.3
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 384.9
        },
        {
          "timestamp": "03/15",
          "value": 416.6
        },
        {
          "timestamp": "03/16",
          "value": 452.6
        },
        {
          "timestamp": "03/17",
          "value": 466.9
        },
        {
          "timestamp": "03/18",
          "value": 451.1
        },
        {
          "timestamp": "03/19",
          "value": 418.4
        },
        {
          "timestamp": "03/20",
          "value": 390.4
        },
        {
          "timestamp": "03/21",
          "value": 408.6
        },
        {
          "timestamp": "03/22",
          "value": 364.8
        },
        {
          "timestamp": "03/23",
          "value": 388
        },
        {
          "timestamp": "03/24",
          "value": 358.9
        },
        {
          "timestamp": "03/25",
          "value": 383.3
        },
        {
          "timestamp": "03/26",
          "value": 420.9
        },
        {
          "timestamp": "03/27",
          "value": 439.8
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 35.4
        },
        {
          "timestamp": "03/15",
          "value": 37.4
        },
        {
          "timestamp": "03/16",
          "value": 38.5
        },
        {
          "timestamp": "03/17",
          "value": 36.3
        },
        {
          "timestamp": "03/18",
          "value": 40.4
        },
        {
          "timestamp": "03/19",
          "value": 40.3
        },
        {
          "timestamp": "03/20",
          "value": 38.7
        },
        {
          "timestamp": "03/21",
          "value": 31.5
        },
        {
          "timestamp": "03/22",
          "value": 35.4
        },
        {
          "timestamp": "03/23",
          "value": 35.4
        },
        {
          "timestamp": "03/24",
          "value": 34.9
        },
        {
          "timestamp": "03/25",
          "value": 30.6
        },
        {
          "timestamp": "03/26",
          "value": 37.2
        },
        {
          "timestamp": "03/27",
          "value": 33.3
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 65.5
        },
        {
          "timestamp": "03/15",
          "value": 75.9
        },
        {
          "timestamp": "03/16",
          "value": 74.4
        },
        {
          "timestamp": "03/17",
          "value": 71.2
        },
        {
          "timestamp": "03/18",
          "value": 70.5
        },
        {
          "timestamp": "03/19",
          "value": 67.3
        },
        {
          "timestamp": "03/20",
          "value": 66.5
        },
        {
          "timestamp": "03/21",
          "value": 66.8
        },
        {
          "timestamp": "03/22",
          "value": 61
        },
        {
          "timestamp": "03/23",
          "value": 61.7
        },
        {
          "timestamp": "03/24",
          "value": 65.7
        },
        {
          "timestamp": "03/25",
          "value": 64
        },
        {
          "timestamp": "03/26",
          "value": 62.1
        },
        {
          "timestamp": "03/27",
          "value": 67.1
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu117",
    "label": "GPU-117",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 36,
      "memUsage": 49,
      "temp": 59,
      "power": 489,
      "cpuUsage": 57,
      "cpuMemUsage": 68
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 39
        },
        {
          "timestamp": "03/15",
          "value": 37.3
        },
        {
          "timestamp": "03/16",
          "value": 38.7
        },
        {
          "timestamp": "03/17",
          "value": 37.3
        },
        {
          "timestamp": "03/18",
          "value": 40.2
        },
        {
          "timestamp": "03/19",
          "value": 35.2
        },
        {
          "timestamp": "03/20",
          "value": 35.7
        },
        {
          "timestamp": "03/21",
          "value": 36.5
        },
        {
          "timestamp": "03/22",
          "value": 33.1
        },
        {
          "timestamp": "03/23",
          "value": 34.8
        },
        {
          "timestamp": "03/24",
          "value": 30.2
        },
        {
          "timestamp": "03/25",
          "value": 34.7
        },
        {
          "timestamp": "03/26",
          "value": 34.1
        },
        {
          "timestamp": "03/27",
          "value": 38.3
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 45.7
        },
        {
          "timestamp": "03/15",
          "value": 53
        },
        {
          "timestamp": "03/16",
          "value": 54.8
        },
        {
          "timestamp": "03/17",
          "value": 54
        },
        {
          "timestamp": "03/18",
          "value": 54.9
        },
        {
          "timestamp": "03/19",
          "value": 49.8
        },
        {
          "timestamp": "03/20",
          "value": 47.3
        },
        {
          "timestamp": "03/21",
          "value": 44.7
        },
        {
          "timestamp": "03/22",
          "value": 41.7
        },
        {
          "timestamp": "03/23",
          "value": 46.9
        },
        {
          "timestamp": "03/24",
          "value": 42.6
        },
        {
          "timestamp": "03/25",
          "value": 48.9
        },
        {
          "timestamp": "03/26",
          "value": 49.9
        },
        {
          "timestamp": "03/27",
          "value": 52.3
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 57.6
        },
        {
          "timestamp": "03/15",
          "value": 62
        },
        {
          "timestamp": "03/16",
          "value": 64.4
        },
        {
          "timestamp": "03/17",
          "value": 64.2
        },
        {
          "timestamp": "03/18",
          "value": 66
        },
        {
          "timestamp": "03/19",
          "value": 60.8
        },
        {
          "timestamp": "03/20",
          "value": 61.6
        },
        {
          "timestamp": "03/21",
          "value": 54.8
        },
        {
          "timestamp": "03/22",
          "value": 54.9
        },
        {
          "timestamp": "03/23",
          "value": 54.4
        },
        {
          "timestamp": "03/24",
          "value": 54.8
        },
        {
          "timestamp": "03/25",
          "value": 54.9
        },
        {
          "timestamp": "03/26",
          "value": 59.5
        },
        {
          "timestamp": "03/27",
          "value": 58.5
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 481.2
        },
        {
          "timestamp": "03/15",
          "value": 507.9
        },
        {
          "timestamp": "03/16",
          "value": 533.7
        },
        {
          "timestamp": "03/17",
          "value": 542.1
        },
        {
          "timestamp": "03/18",
          "value": 538.4
        },
        {
          "timestamp": "03/19",
          "value": 507.7
        },
        {
          "timestamp": "03/20",
          "value": 500.2
        },
        {
          "timestamp": "03/21",
          "value": 450.8
        },
        {
          "timestamp": "03/22",
          "value": 477.6
        },
        {
          "timestamp": "03/23",
          "value": 454.1
        },
        {
          "timestamp": "03/24",
          "value": 414.7
        },
        {
          "timestamp": "03/25",
          "value": 472.4
        },
        {
          "timestamp": "03/26",
          "value": 489
        },
        {
          "timestamp": "03/27",
          "value": 477.4
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 61.4
        },
        {
          "timestamp": "03/15",
          "value": 54.4
        },
        {
          "timestamp": "03/16",
          "value": 57.4
        },
        {
          "timestamp": "03/17",
          "value": 62.6
        },
        {
          "timestamp": "03/18",
          "value": 59.2
        },
        {
          "timestamp": "03/19",
          "value": 64.5
        },
        {
          "timestamp": "03/20",
          "value": 53.9
        },
        {
          "timestamp": "03/21",
          "value": 57
        },
        {
          "timestamp": "03/22",
          "value": 50.2
        },
        {
          "timestamp": "03/23",
          "value": 46.4
        },
        {
          "timestamp": "03/24",
          "value": 52.7
        },
        {
          "timestamp": "03/25",
          "value": 53.3
        },
        {
          "timestamp": "03/26",
          "value": 51.5
        },
        {
          "timestamp": "03/27",
          "value": 60.1
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 65.1
        },
        {
          "timestamp": "03/15",
          "value": 68.9
        },
        {
          "timestamp": "03/16",
          "value": 76.4
        },
        {
          "timestamp": "03/17",
          "value": 79.3
        },
        {
          "timestamp": "03/18",
          "value": 70.5
        },
        {
          "timestamp": "03/19",
          "value": 71.8
        },
        {
          "timestamp": "03/20",
          "value": 71
        },
        {
          "timestamp": "03/21",
          "value": 66.9
        },
        {
          "timestamp": "03/22",
          "value": 62.7
        },
        {
          "timestamp": "03/23",
          "value": 64.8
        },
        {
          "timestamp": "03/24",
          "value": 61.8
        },
        {
          "timestamp": "03/25",
          "value": 67.8
        },
        {
          "timestamp": "03/26",
          "value": 62
        },
        {
          "timestamp": "03/27",
          "value": 67.2
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu118",
    "label": "GPU-118",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 70,
      "memUsage": 78,
      "temp": 71,
      "power": 373,
      "cpuUsage": 43,
      "cpuMemUsage": 32
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 71.5
        },
        {
          "timestamp": "03/15",
          "value": 75.3
        },
        {
          "timestamp": "03/16",
          "value": 72
        },
        {
          "timestamp": "03/17",
          "value": 74.3
        },
        {
          "timestamp": "03/18",
          "value": 75.5
        },
        {
          "timestamp": "03/19",
          "value": 75.9
        },
        {
          "timestamp": "03/20",
          "value": 73
        },
        {
          "timestamp": "03/21",
          "value": 71.2
        },
        {
          "timestamp": "03/22",
          "value": 68.8
        },
        {
          "timestamp": "03/23",
          "value": 66.5
        },
        {
          "timestamp": "03/24",
          "value": 66
        },
        {
          "timestamp": "03/25",
          "value": 59.9
        },
        {
          "timestamp": "03/26",
          "value": 64.1
        },
        {
          "timestamp": "03/27",
          "value": 66.4
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 78.2
        },
        {
          "timestamp": "03/15",
          "value": 77.2
        },
        {
          "timestamp": "03/16",
          "value": 88.6
        },
        {
          "timestamp": "03/17",
          "value": 82.2
        },
        {
          "timestamp": "03/18",
          "value": 86.3
        },
        {
          "timestamp": "03/19",
          "value": 82
        },
        {
          "timestamp": "03/20",
          "value": 74
        },
        {
          "timestamp": "03/21",
          "value": 69.5
        },
        {
          "timestamp": "03/22",
          "value": 75.6
        },
        {
          "timestamp": "03/23",
          "value": 72.3
        },
        {
          "timestamp": "03/24",
          "value": 69.2
        },
        {
          "timestamp": "03/25",
          "value": 72.3
        },
        {
          "timestamp": "03/26",
          "value": 77.1
        },
        {
          "timestamp": "03/27",
          "value": 76.7
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 70.4
        },
        {
          "timestamp": "03/15",
          "value": 72.9
        },
        {
          "timestamp": "03/16",
          "value": 76.1
        },
        {
          "timestamp": "03/17",
          "value": 78.1
        },
        {
          "timestamp": "03/18",
          "value": 76
        },
        {
          "timestamp": "03/19",
          "value": 72.5
        },
        {
          "timestamp": "03/20",
          "value": 69.5
        },
        {
          "timestamp": "03/21",
          "value": 66.4
        },
        {
          "timestamp": "03/22",
          "value": 67
        },
        {
          "timestamp": "03/23",
          "value": 65.8
        },
        {
          "timestamp": "03/24",
          "value": 61.5
        },
        {
          "timestamp": "03/25",
          "value": 64.7
        },
        {
          "timestamp": "03/26",
          "value": 70.9
        },
        {
          "timestamp": "03/27",
          "value": 72.4
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 365.4
        },
        {
          "timestamp": "03/15",
          "value": 386.2
        },
        {
          "timestamp": "03/16",
          "value": 384.4
        },
        {
          "timestamp": "03/17",
          "value": 407.3
        },
        {
          "timestamp": "03/18",
          "value": 402.8
        },
        {
          "timestamp": "03/19",
          "value": 373.5
        },
        {
          "timestamp": "03/20",
          "value": 373.3
        },
        {
          "timestamp": "03/21",
          "value": 352.3
        },
        {
          "timestamp": "03/22",
          "value": 341.7
        },
        {
          "timestamp": "03/23",
          "value": 356.2
        },
        {
          "timestamp": "03/24",
          "value": 343.2
        },
        {
          "timestamp": "03/25",
          "value": 357.3
        },
        {
          "timestamp": "03/26",
          "value": 343.5
        },
        {
          "timestamp": "03/27",
          "value": 382.8
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 46.3
        },
        {
          "timestamp": "03/15",
          "value": 42
        },
        {
          "timestamp": "03/16",
          "value": 49.3
        },
        {
          "timestamp": "03/17",
          "value": 43.5
        },
        {
          "timestamp": "03/18",
          "value": 44.5
        },
        {
          "timestamp": "03/19",
          "value": 42.6
        },
        {
          "timestamp": "03/20",
          "value": 45.3
        },
        {
          "timestamp": "03/21",
          "value": 43.4
        },
        {
          "timestamp": "03/22",
          "value": 42.7
        },
        {
          "timestamp": "03/23",
          "value": 37
        },
        {
          "timestamp": "03/24",
          "value": 39.1
        },
        {
          "timestamp": "03/25",
          "value": 39.4
        },
        {
          "timestamp": "03/26",
          "value": 38.5
        },
        {
          "timestamp": "03/27",
          "value": 45.7
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 31.9
        },
        {
          "timestamp": "03/15",
          "value": 32.1
        },
        {
          "timestamp": "03/16",
          "value": 35.7
        },
        {
          "timestamp": "03/17",
          "value": 35.4
        },
        {
          "timestamp": "03/18",
          "value": 33.6
        },
        {
          "timestamp": "03/19",
          "value": 33.6
        },
        {
          "timestamp": "03/20",
          "value": 30.9
        },
        {
          "timestamp": "03/21",
          "value": 31.2
        },
        {
          "timestamp": "03/22",
          "value": 28
        },
        {
          "timestamp": "03/23",
          "value": 28.4
        },
        {
          "timestamp": "03/24",
          "value": 26.8
        },
        {
          "timestamp": "03/25",
          "value": 28.6
        },
        {
          "timestamp": "03/26",
          "value": 30.2
        },
        {
          "timestamp": "03/27",
          "value": 30.9
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu119",
    "label": "GPU-119",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 35,
      "memUsage": 49,
      "temp": 62,
      "power": 574,
      "cpuUsage": 25,
      "cpuMemUsage": 70
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 36.3
        },
        {
          "timestamp": "03/15",
          "value": 38.2
        },
        {
          "timestamp": "03/16",
          "value": 40.8
        },
        {
          "timestamp": "03/17",
          "value": 38.3
        },
        {
          "timestamp": "03/18",
          "value": 37.7
        },
        {
          "timestamp": "03/19",
          "value": 37.6
        },
        {
          "timestamp": "03/20",
          "value": 33.2
        },
        {
          "timestamp": "03/21",
          "value": 30.9
        },
        {
          "timestamp": "03/22",
          "value": 29.8
        },
        {
          "timestamp": "03/23",
          "value": 30
        },
        {
          "timestamp": "03/24",
          "value": 28.9
        },
        {
          "timestamp": "03/25",
          "value": 32.1
        },
        {
          "timestamp": "03/26",
          "value": 32
        },
        {
          "timestamp": "03/27",
          "value": 35.1
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 47.6
        },
        {
          "timestamp": "03/15",
          "value": 54.1
        },
        {
          "timestamp": "03/16",
          "value": 55.8
        },
        {
          "timestamp": "03/17",
          "value": 50.7
        },
        {
          "timestamp": "03/18",
          "value": 51.3
        },
        {
          "timestamp": "03/19",
          "value": 53.8
        },
        {
          "timestamp": "03/20",
          "value": 50.3
        },
        {
          "timestamp": "03/21",
          "value": 46.7
        },
        {
          "timestamp": "03/22",
          "value": 46.7
        },
        {
          "timestamp": "03/23",
          "value": 44.2
        },
        {
          "timestamp": "03/24",
          "value": 45.8
        },
        {
          "timestamp": "03/25",
          "value": 44.7
        },
        {
          "timestamp": "03/26",
          "value": 46.5
        },
        {
          "timestamp": "03/27",
          "value": 51.8
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 63.9
        },
        {
          "timestamp": "03/15",
          "value": 65.9
        },
        {
          "timestamp": "03/16",
          "value": 69
        },
        {
          "timestamp": "03/17",
          "value": 67.3
        },
        {
          "timestamp": "03/18",
          "value": 70.1
        },
        {
          "timestamp": "03/19",
          "value": 66.8
        },
        {
          "timestamp": "03/20",
          "value": 60.5
        },
        {
          "timestamp": "03/21",
          "value": 60.1
        },
        {
          "timestamp": "03/22",
          "value": 59.6
        },
        {
          "timestamp": "03/23",
          "value": 55.3
        },
        {
          "timestamp": "03/24",
          "value": 54.4
        },
        {
          "timestamp": "03/25",
          "value": 59.6
        },
        {
          "timestamp": "03/26",
          "value": 60.5
        },
        {
          "timestamp": "03/27",
          "value": 65.5
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 553.3
        },
        {
          "timestamp": "03/15",
          "value": 573.1
        },
        {
          "timestamp": "03/16",
          "value": 590.5
        },
        {
          "timestamp": "03/17",
          "value": 619
        },
        {
          "timestamp": "03/18",
          "value": 646.3
        },
        {
          "timestamp": "03/19",
          "value": 610.4
        },
        {
          "timestamp": "03/20",
          "value": 578.9
        },
        {
          "timestamp": "03/21",
          "value": 547.1
        },
        {
          "timestamp": "03/22",
          "value": 529.6
        },
        {
          "timestamp": "03/23",
          "value": 521.9
        },
        {
          "timestamp": "03/24",
          "value": 511.3
        },
        {
          "timestamp": "03/25",
          "value": 506.8
        },
        {
          "timestamp": "03/26",
          "value": 523.9
        },
        {
          "timestamp": "03/27",
          "value": 586.7
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 24.4
        },
        {
          "timestamp": "03/15",
          "value": 25.8
        },
        {
          "timestamp": "03/16",
          "value": 26.3
        },
        {
          "timestamp": "03/17",
          "value": 27.6
        },
        {
          "timestamp": "03/18",
          "value": 27.3
        },
        {
          "timestamp": "03/19",
          "value": 24
        },
        {
          "timestamp": "03/20",
          "value": 27
        },
        {
          "timestamp": "03/21",
          "value": 26.1
        },
        {
          "timestamp": "03/22",
          "value": 25.1
        },
        {
          "timestamp": "03/23",
          "value": 22.6
        },
        {
          "timestamp": "03/24",
          "value": 22.1
        },
        {
          "timestamp": "03/25",
          "value": 24.8
        },
        {
          "timestamp": "03/26",
          "value": 26
        },
        {
          "timestamp": "03/27",
          "value": 24.1
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 71.6
        },
        {
          "timestamp": "03/15",
          "value": 70.3
        },
        {
          "timestamp": "03/16",
          "value": 78.9
        },
        {
          "timestamp": "03/17",
          "value": 75.7
        },
        {
          "timestamp": "03/18",
          "value": 80.8
        },
        {
          "timestamp": "03/19",
          "value": 74.7
        },
        {
          "timestamp": "03/20",
          "value": 70.5
        },
        {
          "timestamp": "03/21",
          "value": 71.7
        },
        {
          "timestamp": "03/22",
          "value": 68.3
        },
        {
          "timestamp": "03/23",
          "value": 64.2
        },
        {
          "timestamp": "03/24",
          "value": 61.2
        },
        {
          "timestamp": "03/25",
          "value": 69.8
        },
        {
          "timestamp": "03/26",
          "value": 65.5
        },
        {
          "timestamp": "03/27",
          "value": 67.4
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu120",
    "label": "GPU-120",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 60,
      "memUsage": 73,
      "temp": 66,
      "power": 663,
      "cpuUsage": 41,
      "cpuMemUsage": 57
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 54.8
        },
        {
          "timestamp": "03/15",
          "value": 67.3
        },
        {
          "timestamp": "03/16",
          "value": 67.4
        },
        {
          "timestamp": "03/17",
          "value": 65.1
        },
        {
          "timestamp": "03/18",
          "value": 69
        },
        {
          "timestamp": "03/19",
          "value": 68.8
        },
        {
          "timestamp": "03/20",
          "value": 65.4
        },
        {
          "timestamp": "03/21",
          "value": 60.9
        },
        {
          "timestamp": "03/22",
          "value": 57.9
        },
        {
          "timestamp": "03/23",
          "value": 53.9
        },
        {
          "timestamp": "03/24",
          "value": 54.1
        },
        {
          "timestamp": "03/25",
          "value": 56.4
        },
        {
          "timestamp": "03/26",
          "value": 56.2
        },
        {
          "timestamp": "03/27",
          "value": 59.6
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 73.7
        },
        {
          "timestamp": "03/15",
          "value": 79.5
        },
        {
          "timestamp": "03/16",
          "value": 76.8
        },
        {
          "timestamp": "03/17",
          "value": 80.4
        },
        {
          "timestamp": "03/18",
          "value": 83.3
        },
        {
          "timestamp": "03/19",
          "value": 80.1
        },
        {
          "timestamp": "03/20",
          "value": 76.1
        },
        {
          "timestamp": "03/21",
          "value": 70.1
        },
        {
          "timestamp": "03/22",
          "value": 66.3
        },
        {
          "timestamp": "03/23",
          "value": 69.4
        },
        {
          "timestamp": "03/24",
          "value": 67.3
        },
        {
          "timestamp": "03/25",
          "value": 68.1
        },
        {
          "timestamp": "03/26",
          "value": 70.1
        },
        {
          "timestamp": "03/27",
          "value": 79.8
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 65.4
        },
        {
          "timestamp": "03/15",
          "value": 70.2
        },
        {
          "timestamp": "03/16",
          "value": 69.4
        },
        {
          "timestamp": "03/17",
          "value": 74.2
        },
        {
          "timestamp": "03/18",
          "value": 71.6
        },
        {
          "timestamp": "03/19",
          "value": 68.1
        },
        {
          "timestamp": "03/20",
          "value": 64.4
        },
        {
          "timestamp": "03/21",
          "value": 66.3
        },
        {
          "timestamp": "03/22",
          "value": 61.8
        },
        {
          "timestamp": "03/23",
          "value": 58.7
        },
        {
          "timestamp": "03/24",
          "value": 61.1
        },
        {
          "timestamp": "03/25",
          "value": 58.9
        },
        {
          "timestamp": "03/26",
          "value": 65.6
        },
        {
          "timestamp": "03/27",
          "value": 68.7
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 679.6
        },
        {
          "timestamp": "03/15",
          "value": 666.1
        },
        {
          "timestamp": "03/16",
          "value": 728.6
        },
        {
          "timestamp": "03/17",
          "value": 714.5
        },
        {
          "timestamp": "03/18",
          "value": 688.9
        },
        {
          "timestamp": "03/19",
          "value": 682.6
        },
        {
          "timestamp": "03/20",
          "value": 699
        },
        {
          "timestamp": "03/21",
          "value": 630
        },
        {
          "timestamp": "03/22",
          "value": 595.3
        },
        {
          "timestamp": "03/23",
          "value": 610
        },
        {
          "timestamp": "03/24",
          "value": 633.3
        },
        {
          "timestamp": "03/25",
          "value": 623.2
        },
        {
          "timestamp": "03/26",
          "value": 631.2
        },
        {
          "timestamp": "03/27",
          "value": 655.6
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 44
        },
        {
          "timestamp": "03/15",
          "value": 39.9
        },
        {
          "timestamp": "03/16",
          "value": 41.7
        },
        {
          "timestamp": "03/17",
          "value": 48.3
        },
        {
          "timestamp": "03/18",
          "value": 45.7
        },
        {
          "timestamp": "03/19",
          "value": 44.8
        },
        {
          "timestamp": "03/20",
          "value": 38.4
        },
        {
          "timestamp": "03/21",
          "value": 42.3
        },
        {
          "timestamp": "03/22",
          "value": 37
        },
        {
          "timestamp": "03/23",
          "value": 35.5
        },
        {
          "timestamp": "03/24",
          "value": 41
        },
        {
          "timestamp": "03/25",
          "value": 41.8
        },
        {
          "timestamp": "03/26",
          "value": 42.1
        },
        {
          "timestamp": "03/27",
          "value": 43.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 60.8
        },
        {
          "timestamp": "03/15",
          "value": 62.6
        },
        {
          "timestamp": "03/16",
          "value": 61.1
        },
        {
          "timestamp": "03/17",
          "value": 64.4
        },
        {
          "timestamp": "03/18",
          "value": 63.7
        },
        {
          "timestamp": "03/19",
          "value": 57.6
        },
        {
          "timestamp": "03/20",
          "value": 59.1
        },
        {
          "timestamp": "03/21",
          "value": 56.4
        },
        {
          "timestamp": "03/22",
          "value": 55.8
        },
        {
          "timestamp": "03/23",
          "value": 53.5
        },
        {
          "timestamp": "03/24",
          "value": 53
        },
        {
          "timestamp": "03/25",
          "value": 53.3
        },
        {
          "timestamp": "03/26",
          "value": 51.5
        },
        {
          "timestamp": "03/27",
          "value": 60.1
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu121",
    "label": "GPU-121",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "warn",
    "current": {
      "gpuUsage": 99,
      "memUsage": 84,
      "temp": 94,
      "power": 996,
      "cpuUsage": 51,
      "cpuMemUsage": 38
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 91
        },
        {
          "timestamp": "03/15",
          "value": 95.1
        },
        {
          "timestamp": "03/16",
          "value": 99.2
        },
        {
          "timestamp": "03/17",
          "value": 113.1
        },
        {
          "timestamp": "03/18",
          "value": 104.7
        },
        {
          "timestamp": "03/19",
          "value": 111.1
        },
        {
          "timestamp": "03/20",
          "value": 104.6
        },
        {
          "timestamp": "03/21",
          "value": 100
        },
        {
          "timestamp": "03/22",
          "value": 84
        },
        {
          "timestamp": "03/23",
          "value": 96.5
        },
        {
          "timestamp": "03/24",
          "value": 96.6
        },
        {
          "timestamp": "03/25",
          "value": 90.5
        },
        {
          "timestamp": "03/26",
          "value": 102.2
        },
        {
          "timestamp": "03/27",
          "value": 107.2
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 80.6
        },
        {
          "timestamp": "03/15",
          "value": 91.8
        },
        {
          "timestamp": "03/16",
          "value": 92.5
        },
        {
          "timestamp": "03/17",
          "value": 96
        },
        {
          "timestamp": "03/18",
          "value": 96.2
        },
        {
          "timestamp": "03/19",
          "value": 84.9
        },
        {
          "timestamp": "03/20",
          "value": 90.5
        },
        {
          "timestamp": "03/21",
          "value": 76.4
        },
        {
          "timestamp": "03/22",
          "value": 72.6
        },
        {
          "timestamp": "03/23",
          "value": 79.6
        },
        {
          "timestamp": "03/24",
          "value": 74.3
        },
        {
          "timestamp": "03/25",
          "value": 81.7
        },
        {
          "timestamp": "03/26",
          "value": 87.5
        },
        {
          "timestamp": "03/27",
          "value": 85.6
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 92
        },
        {
          "timestamp": "03/15",
          "value": 99.3
        },
        {
          "timestamp": "03/16",
          "value": 101.7
        },
        {
          "timestamp": "03/17",
          "value": 107.1
        },
        {
          "timestamp": "03/18",
          "value": 103
        },
        {
          "timestamp": "03/19",
          "value": 101
        },
        {
          "timestamp": "03/20",
          "value": 96.8
        },
        {
          "timestamp": "03/21",
          "value": 93.2
        },
        {
          "timestamp": "03/22",
          "value": 90.2
        },
        {
          "timestamp": "03/23",
          "value": 85.2
        },
        {
          "timestamp": "03/24",
          "value": 82.8
        },
        {
          "timestamp": "03/25",
          "value": 85.7
        },
        {
          "timestamp": "03/26",
          "value": 92.9
        },
        {
          "timestamp": "03/27",
          "value": 93.8
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 1046.6
        },
        {
          "timestamp": "03/15",
          "value": 1095.2
        },
        {
          "timestamp": "03/16",
          "value": 1089
        },
        {
          "timestamp": "03/17",
          "value": 1053.6
        },
        {
          "timestamp": "03/18",
          "value": 1031.5
        },
        {
          "timestamp": "03/19",
          "value": 1075.9
        },
        {
          "timestamp": "03/20",
          "value": 1006.3
        },
        {
          "timestamp": "03/21",
          "value": 914.9
        },
        {
          "timestamp": "03/22",
          "value": 875.8
        },
        {
          "timestamp": "03/23",
          "value": 851.6
        },
        {
          "timestamp": "03/24",
          "value": 893.8
        },
        {
          "timestamp": "03/25",
          "value": 975.9
        },
        {
          "timestamp": "03/26",
          "value": 1011.7
        },
        {
          "timestamp": "03/27",
          "value": 1003.7
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 53.7
        },
        {
          "timestamp": "03/15",
          "value": 55.9
        },
        {
          "timestamp": "03/16",
          "value": 55.4
        },
        {
          "timestamp": "03/17",
          "value": 52.1
        },
        {
          "timestamp": "03/18",
          "value": 55.3
        },
        {
          "timestamp": "03/19",
          "value": 51
        },
        {
          "timestamp": "03/20",
          "value": 51
        },
        {
          "timestamp": "03/21",
          "value": 52.3
        },
        {
          "timestamp": "03/22",
          "value": 45
        },
        {
          "timestamp": "03/23",
          "value": 45.1
        },
        {
          "timestamp": "03/24",
          "value": 45.4
        },
        {
          "timestamp": "03/25",
          "value": 51.8
        },
        {
          "timestamp": "03/26",
          "value": 46.3
        },
        {
          "timestamp": "03/27",
          "value": 49.3
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 38.6
        },
        {
          "timestamp": "03/15",
          "value": 38.6
        },
        {
          "timestamp": "03/16",
          "value": 43.6
        },
        {
          "timestamp": "03/17",
          "value": 39.5
        },
        {
          "timestamp": "03/18",
          "value": 39.4
        },
        {
          "timestamp": "03/19",
          "value": 41.6
        },
        {
          "timestamp": "03/20",
          "value": 37.2
        },
        {
          "timestamp": "03/21",
          "value": 38
        },
        {
          "timestamp": "03/22",
          "value": 33.5
        },
        {
          "timestamp": "03/23",
          "value": 33.8
        },
        {
          "timestamp": "03/24",
          "value": 36.8
        },
        {
          "timestamp": "03/25",
          "value": 36.9
        },
        {
          "timestamp": "03/26",
          "value": 36.3
        },
        {
          "timestamp": "03/27",
          "value": 37.6
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu122",
    "label": "GPU-122",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 55,
      "memUsage": 41,
      "temp": 74,
      "power": 544,
      "cpuUsage": 57,
      "cpuMemUsage": 59
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 59
        },
        {
          "timestamp": "03/15",
          "value": 59
        },
        {
          "timestamp": "03/16",
          "value": 62.5
        },
        {
          "timestamp": "03/17",
          "value": 61.2
        },
        {
          "timestamp": "03/18",
          "value": 64
        },
        {
          "timestamp": "03/19",
          "value": 62
        },
        {
          "timestamp": "03/20",
          "value": 59.5
        },
        {
          "timestamp": "03/21",
          "value": 57.9
        },
        {
          "timestamp": "03/22",
          "value": 51.7
        },
        {
          "timestamp": "03/23",
          "value": 45.9
        },
        {
          "timestamp": "03/24",
          "value": 47.3
        },
        {
          "timestamp": "03/25",
          "value": 54.1
        },
        {
          "timestamp": "03/26",
          "value": 51.5
        },
        {
          "timestamp": "03/27",
          "value": 58.3
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 42.5
        },
        {
          "timestamp": "03/15",
          "value": 41.6
        },
        {
          "timestamp": "03/16",
          "value": 47.4
        },
        {
          "timestamp": "03/17",
          "value": 44.3
        },
        {
          "timestamp": "03/18",
          "value": 45.3
        },
        {
          "timestamp": "03/19",
          "value": 43.1
        },
        {
          "timestamp": "03/20",
          "value": 42.7
        },
        {
          "timestamp": "03/21",
          "value": 40.8
        },
        {
          "timestamp": "03/22",
          "value": 40.4
        },
        {
          "timestamp": "03/23",
          "value": 39.8
        },
        {
          "timestamp": "03/24",
          "value": 37.1
        },
        {
          "timestamp": "03/25",
          "value": 39.7
        },
        {
          "timestamp": "03/26",
          "value": 41.4
        },
        {
          "timestamp": "03/27",
          "value": 42.4
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 74.6
        },
        {
          "timestamp": "03/15",
          "value": 77.6
        },
        {
          "timestamp": "03/16",
          "value": 82.5
        },
        {
          "timestamp": "03/17",
          "value": 82.4
        },
        {
          "timestamp": "03/18",
          "value": 81.1
        },
        {
          "timestamp": "03/19",
          "value": 80.4
        },
        {
          "timestamp": "03/20",
          "value": 73.1
        },
        {
          "timestamp": "03/21",
          "value": 70.4
        },
        {
          "timestamp": "03/22",
          "value": 70.2
        },
        {
          "timestamp": "03/23",
          "value": 63.9
        },
        {
          "timestamp": "03/24",
          "value": 68
        },
        {
          "timestamp": "03/25",
          "value": 70.3
        },
        {
          "timestamp": "03/26",
          "value": 73.6
        },
        {
          "timestamp": "03/27",
          "value": 76.8
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 520.8
        },
        {
          "timestamp": "03/15",
          "value": 580.9
        },
        {
          "timestamp": "03/16",
          "value": 605.3
        },
        {
          "timestamp": "03/17",
          "value": 595.2
        },
        {
          "timestamp": "03/18",
          "value": 594.5
        },
        {
          "timestamp": "03/19",
          "value": 584
        },
        {
          "timestamp": "03/20",
          "value": 570.9
        },
        {
          "timestamp": "03/21",
          "value": 501.3
        },
        {
          "timestamp": "03/22",
          "value": 533.7
        },
        {
          "timestamp": "03/23",
          "value": 467.8
        },
        {
          "timestamp": "03/24",
          "value": 465.7
        },
        {
          "timestamp": "03/25",
          "value": 515.6
        },
        {
          "timestamp": "03/26",
          "value": 561.2
        },
        {
          "timestamp": "03/27",
          "value": 535.1
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 55.6
        },
        {
          "timestamp": "03/15",
          "value": 65.1
        },
        {
          "timestamp": "03/16",
          "value": 58.5
        },
        {
          "timestamp": "03/17",
          "value": 62.5
        },
        {
          "timestamp": "03/18",
          "value": 61.6
        },
        {
          "timestamp": "03/19",
          "value": 57
        },
        {
          "timestamp": "03/20",
          "value": 62.1
        },
        {
          "timestamp": "03/21",
          "value": 59.1
        },
        {
          "timestamp": "03/22",
          "value": 57.6
        },
        {
          "timestamp": "03/23",
          "value": 45.8
        },
        {
          "timestamp": "03/24",
          "value": 47.8
        },
        {
          "timestamp": "03/25",
          "value": 50.8
        },
        {
          "timestamp": "03/26",
          "value": 52.1
        },
        {
          "timestamp": "03/27",
          "value": 63.2
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 58.1
        },
        {
          "timestamp": "03/15",
          "value": 65.9
        },
        {
          "timestamp": "03/16",
          "value": 62.9
        },
        {
          "timestamp": "03/17",
          "value": 60.8
        },
        {
          "timestamp": "03/18",
          "value": 63.3
        },
        {
          "timestamp": "03/19",
          "value": 59.4
        },
        {
          "timestamp": "03/20",
          "value": 56
        },
        {
          "timestamp": "03/21",
          "value": 54.4
        },
        {
          "timestamp": "03/22",
          "value": 55.5
        },
        {
          "timestamp": "03/23",
          "value": 56.8
        },
        {
          "timestamp": "03/24",
          "value": 51.5
        },
        {
          "timestamp": "03/25",
          "value": 54
        },
        {
          "timestamp": "03/26",
          "value": 55.1
        },
        {
          "timestamp": "03/27",
          "value": 59.2
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu123",
    "label": "GPU-123",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "err",
    "current": {
      "gpuUsage": 0,
      "memUsage": 0,
      "temp": 0,
      "power": 0,
      "cpuUsage": 0,
      "cpuMemUsage": 0
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 0
        },
        {
          "timestamp": "03/15",
          "value": 0
        },
        {
          "timestamp": "03/16",
          "value": 0
        },
        {
          "timestamp": "03/17",
          "value": 0
        },
        {
          "timestamp": "03/18",
          "value": 0
        },
        {
          "timestamp": "03/19",
          "value": 0
        },
        {
          "timestamp": "03/20",
          "value": 0
        },
        {
          "timestamp": "03/21",
          "value": 0
        },
        {
          "timestamp": "03/22",
          "value": 0
        },
        {
          "timestamp": "03/23",
          "value": 0
        },
        {
          "timestamp": "03/24",
          "value": 0
        },
        {
          "timestamp": "03/25",
          "value": 0
        },
        {
          "timestamp": "03/26",
          "value": 0
        },
        {
          "timestamp": "03/27",
          "value": 0
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu124",
    "label": "GPU-124",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "warn",
    "current": {
      "gpuUsage": 90,
      "memUsage": 88,
      "temp": 93,
      "power": 906,
      "cpuUsage": 65,
      "cpuMemUsage": 77
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 91.4
        },
        {
          "timestamp": "03/15",
          "value": 86.6
        },
        {
          "timestamp": "03/16",
          "value": 104
        },
        {
          "timestamp": "03/17",
          "value": 94.5
        },
        {
          "timestamp": "03/18",
          "value": 90.3
        },
        {
          "timestamp": "03/19",
          "value": 90.5
        },
        {
          "timestamp": "03/20",
          "value": 84.5
        },
        {
          "timestamp": "03/21",
          "value": 79.3
        },
        {
          "timestamp": "03/22",
          "value": 84.1
        },
        {
          "timestamp": "03/23",
          "value": 83.5
        },
        {
          "timestamp": "03/24",
          "value": 82.8
        },
        {
          "timestamp": "03/25",
          "value": 91.6
        },
        {
          "timestamp": "03/26",
          "value": 89.6
        },
        {
          "timestamp": "03/27",
          "value": 92.1
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 82.1
        },
        {
          "timestamp": "03/15",
          "value": 98.1
        },
        {
          "timestamp": "03/16",
          "value": 97.2
        },
        {
          "timestamp": "03/17",
          "value": 96.7
        },
        {
          "timestamp": "03/18",
          "value": 96.3
        },
        {
          "timestamp": "03/19",
          "value": 87.5
        },
        {
          "timestamp": "03/20",
          "value": 84.8
        },
        {
          "timestamp": "03/21",
          "value": 86.6
        },
        {
          "timestamp": "03/22",
          "value": 87.9
        },
        {
          "timestamp": "03/23",
          "value": 84.3
        },
        {
          "timestamp": "03/24",
          "value": 82.1
        },
        {
          "timestamp": "03/25",
          "value": 81.4
        },
        {
          "timestamp": "03/26",
          "value": 82.5
        },
        {
          "timestamp": "03/27",
          "value": 93.7
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 93
        },
        {
          "timestamp": "03/15",
          "value": 93.8
        },
        {
          "timestamp": "03/16",
          "value": 102.7
        },
        {
          "timestamp": "03/17",
          "value": 101.8
        },
        {
          "timestamp": "03/18",
          "value": 99.7
        },
        {
          "timestamp": "03/19",
          "value": 99.9
        },
        {
          "timestamp": "03/20",
          "value": 97.3
        },
        {
          "timestamp": "03/21",
          "value": 91.6
        },
        {
          "timestamp": "03/22",
          "value": 88.4
        },
        {
          "timestamp": "03/23",
          "value": 86
        },
        {
          "timestamp": "03/24",
          "value": 80.6
        },
        {
          "timestamp": "03/25",
          "value": 84
        },
        {
          "timestamp": "03/26",
          "value": 93.6
        },
        {
          "timestamp": "03/27",
          "value": 96.7
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 926.4
        },
        {
          "timestamp": "03/15",
          "value": 954.1
        },
        {
          "timestamp": "03/16",
          "value": 956.1
        },
        {
          "timestamp": "03/17",
          "value": 1034.3
        },
        {
          "timestamp": "03/18",
          "value": 1005
        },
        {
          "timestamp": "03/19",
          "value": 968.2
        },
        {
          "timestamp": "03/20",
          "value": 938.5
        },
        {
          "timestamp": "03/21",
          "value": 889.4
        },
        {
          "timestamp": "03/22",
          "value": 875.8
        },
        {
          "timestamp": "03/23",
          "value": 856.6
        },
        {
          "timestamp": "03/24",
          "value": 809.8
        },
        {
          "timestamp": "03/25",
          "value": 854.7
        },
        {
          "timestamp": "03/26",
          "value": 895.4
        },
        {
          "timestamp": "03/27",
          "value": 872.9
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 64.2
        },
        {
          "timestamp": "03/15",
          "value": 64.2
        },
        {
          "timestamp": "03/16",
          "value": 75.7
        },
        {
          "timestamp": "03/17",
          "value": 71.6
        },
        {
          "timestamp": "03/18",
          "value": 76.7
        },
        {
          "timestamp": "03/19",
          "value": 63.1
        },
        {
          "timestamp": "03/20",
          "value": 71.7
        },
        {
          "timestamp": "03/21",
          "value": 66.5
        },
        {
          "timestamp": "03/22",
          "value": 63.7
        },
        {
          "timestamp": "03/23",
          "value": 61.7
        },
        {
          "timestamp": "03/24",
          "value": 59.1
        },
        {
          "timestamp": "03/25",
          "value": 65.8
        },
        {
          "timestamp": "03/26",
          "value": 69.4
        },
        {
          "timestamp": "03/27",
          "value": 70.5
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 74.8
        },
        {
          "timestamp": "03/15",
          "value": 81.3
        },
        {
          "timestamp": "03/16",
          "value": 78.8
        },
        {
          "timestamp": "03/17",
          "value": 87.4
        },
        {
          "timestamp": "03/18",
          "value": 87
        },
        {
          "timestamp": "03/19",
          "value": 78.3
        },
        {
          "timestamp": "03/20",
          "value": 76.2
        },
        {
          "timestamp": "03/21",
          "value": 73
        },
        {
          "timestamp": "03/22",
          "value": 69.4
        },
        {
          "timestamp": "03/23",
          "value": 66.2
        },
        {
          "timestamp": "03/24",
          "value": 68.3
        },
        {
          "timestamp": "03/25",
          "value": 67.2
        },
        {
          "timestamp": "03/26",
          "value": 78.7
        },
        {
          "timestamp": "03/27",
          "value": 75.6
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu125",
    "label": "GPU-125",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "warn",
    "current": {
      "gpuUsage": 96,
      "memUsage": 92,
      "temp": 94,
      "power": 936,
      "cpuUsage": 32,
      "cpuMemUsage": 53
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 93.1
        },
        {
          "timestamp": "03/15",
          "value": 98.2
        },
        {
          "timestamp": "03/16",
          "value": 103.5
        },
        {
          "timestamp": "03/17",
          "value": 102.6
        },
        {
          "timestamp": "03/18",
          "value": 109.4
        },
        {
          "timestamp": "03/19",
          "value": 103.7
        },
        {
          "timestamp": "03/20",
          "value": 96.3
        },
        {
          "timestamp": "03/21",
          "value": 97
        },
        {
          "timestamp": "03/22",
          "value": 83.1
        },
        {
          "timestamp": "03/23",
          "value": 82.6
        },
        {
          "timestamp": "03/24",
          "value": 79.3
        },
        {
          "timestamp": "03/25",
          "value": 81.4
        },
        {
          "timestamp": "03/26",
          "value": 96.1
        },
        {
          "timestamp": "03/27",
          "value": 99.4
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 91.8
        },
        {
          "timestamp": "03/15",
          "value": 98.6
        },
        {
          "timestamp": "03/16",
          "value": 93
        },
        {
          "timestamp": "03/17",
          "value": 103.2
        },
        {
          "timestamp": "03/18",
          "value": 104.1
        },
        {
          "timestamp": "03/19",
          "value": 99.2
        },
        {
          "timestamp": "03/20",
          "value": 89.8
        },
        {
          "timestamp": "03/21",
          "value": 82.1
        },
        {
          "timestamp": "03/22",
          "value": 89.3
        },
        {
          "timestamp": "03/23",
          "value": 85
        },
        {
          "timestamp": "03/24",
          "value": 82.4
        },
        {
          "timestamp": "03/25",
          "value": 92
        },
        {
          "timestamp": "03/26",
          "value": 83.2
        },
        {
          "timestamp": "03/27",
          "value": 100
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 95.6
        },
        {
          "timestamp": "03/15",
          "value": 98.9
        },
        {
          "timestamp": "03/16",
          "value": 105
        },
        {
          "timestamp": "03/17",
          "value": 100.4
        },
        {
          "timestamp": "03/18",
          "value": 98.9
        },
        {
          "timestamp": "03/19",
          "value": 102.4
        },
        {
          "timestamp": "03/20",
          "value": 96.4
        },
        {
          "timestamp": "03/21",
          "value": 87.9
        },
        {
          "timestamp": "03/22",
          "value": 87.8
        },
        {
          "timestamp": "03/23",
          "value": 86.2
        },
        {
          "timestamp": "03/24",
          "value": 87.8
        },
        {
          "timestamp": "03/25",
          "value": 87.5
        },
        {
          "timestamp": "03/26",
          "value": 93.3
        },
        {
          "timestamp": "03/27",
          "value": 92.5
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 990.7
        },
        {
          "timestamp": "03/15",
          "value": 1035.3
        },
        {
          "timestamp": "03/16",
          "value": 1056.7
        },
        {
          "timestamp": "03/17",
          "value": 1029.1
        },
        {
          "timestamp": "03/18",
          "value": 1050.9
        },
        {
          "timestamp": "03/19",
          "value": 1043.2
        },
        {
          "timestamp": "03/20",
          "value": 980.8
        },
        {
          "timestamp": "03/21",
          "value": 956.3
        },
        {
          "timestamp": "03/22",
          "value": 918.1
        },
        {
          "timestamp": "03/23",
          "value": 844.6
        },
        {
          "timestamp": "03/24",
          "value": 849.6
        },
        {
          "timestamp": "03/25",
          "value": 915.5
        },
        {
          "timestamp": "03/26",
          "value": 908
        },
        {
          "timestamp": "03/27",
          "value": 1006.2
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 33.9
        },
        {
          "timestamp": "03/15",
          "value": 36.6
        },
        {
          "timestamp": "03/16",
          "value": 32.1
        },
        {
          "timestamp": "03/17",
          "value": 32.2
        },
        {
          "timestamp": "03/18",
          "value": 34.9
        },
        {
          "timestamp": "03/19",
          "value": 31.6
        },
        {
          "timestamp": "03/20",
          "value": 35.4
        },
        {
          "timestamp": "03/21",
          "value": 27.9
        },
        {
          "timestamp": "03/22",
          "value": 26.7
        },
        {
          "timestamp": "03/23",
          "value": 26.1
        },
        {
          "timestamp": "03/24",
          "value": 27.9
        },
        {
          "timestamp": "03/25",
          "value": 29
        },
        {
          "timestamp": "03/26",
          "value": 34.2
        },
        {
          "timestamp": "03/27",
          "value": 33.4
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 54.1
        },
        {
          "timestamp": "03/15",
          "value": 57.9
        },
        {
          "timestamp": "03/16",
          "value": 54.4
        },
        {
          "timestamp": "03/17",
          "value": 57.8
        },
        {
          "timestamp": "03/18",
          "value": 55.2
        },
        {
          "timestamp": "03/19",
          "value": 59.1
        },
        {
          "timestamp": "03/20",
          "value": 56.9
        },
        {
          "timestamp": "03/21",
          "value": 50.7
        },
        {
          "timestamp": "03/22",
          "value": 50.3
        },
        {
          "timestamp": "03/23",
          "value": 47.9
        },
        {
          "timestamp": "03/24",
          "value": 51
        },
        {
          "timestamp": "03/25",
          "value": 47.4
        },
        {
          "timestamp": "03/26",
          "value": 50.1
        },
        {
          "timestamp": "03/27",
          "value": 52
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu126",
    "label": "GPU-126",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 39,
      "memUsage": 44,
      "temp": 56,
      "power": 742,
      "cpuUsage": 44,
      "cpuMemUsage": 73
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 38.2
        },
        {
          "timestamp": "03/15",
          "value": 38.6
        },
        {
          "timestamp": "03/16",
          "value": 40
        },
        {
          "timestamp": "03/17",
          "value": 39.4
        },
        {
          "timestamp": "03/18",
          "value": 43.6
        },
        {
          "timestamp": "03/19",
          "value": 39.5
        },
        {
          "timestamp": "03/20",
          "value": 38.2
        },
        {
          "timestamp": "03/21",
          "value": 39.6
        },
        {
          "timestamp": "03/22",
          "value": 36.1
        },
        {
          "timestamp": "03/23",
          "value": 36.6
        },
        {
          "timestamp": "03/24",
          "value": 37.4
        },
        {
          "timestamp": "03/25",
          "value": 35.6
        },
        {
          "timestamp": "03/26",
          "value": 40.7
        },
        {
          "timestamp": "03/27",
          "value": 42.8
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 45.9
        },
        {
          "timestamp": "03/15",
          "value": 45.3
        },
        {
          "timestamp": "03/16",
          "value": 46.2
        },
        {
          "timestamp": "03/17",
          "value": 47
        },
        {
          "timestamp": "03/18",
          "value": 47.4
        },
        {
          "timestamp": "03/19",
          "value": 45.6
        },
        {
          "timestamp": "03/20",
          "value": 41.8
        },
        {
          "timestamp": "03/21",
          "value": 42.9
        },
        {
          "timestamp": "03/22",
          "value": 41.1
        },
        {
          "timestamp": "03/23",
          "value": 39.7
        },
        {
          "timestamp": "03/24",
          "value": 39.9
        },
        {
          "timestamp": "03/25",
          "value": 41.6
        },
        {
          "timestamp": "03/26",
          "value": 42.3
        },
        {
          "timestamp": "03/27",
          "value": 44.4
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 57.1
        },
        {
          "timestamp": "03/15",
          "value": 58.8
        },
        {
          "timestamp": "03/16",
          "value": 59.6
        },
        {
          "timestamp": "03/17",
          "value": 62.7
        },
        {
          "timestamp": "03/18",
          "value": 61.6
        },
        {
          "timestamp": "03/19",
          "value": 59.2
        },
        {
          "timestamp": "03/20",
          "value": 55.3
        },
        {
          "timestamp": "03/21",
          "value": 52.1
        },
        {
          "timestamp": "03/22",
          "value": 50.3
        },
        {
          "timestamp": "03/23",
          "value": 51.1
        },
        {
          "timestamp": "03/24",
          "value": 49.5
        },
        {
          "timestamp": "03/25",
          "value": 50.6
        },
        {
          "timestamp": "03/26",
          "value": 53.4
        },
        {
          "timestamp": "03/27",
          "value": 56
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 764.9
        },
        {
          "timestamp": "03/15",
          "value": 758.6
        },
        {
          "timestamp": "03/16",
          "value": 811.2
        },
        {
          "timestamp": "03/17",
          "value": 838
        },
        {
          "timestamp": "03/18",
          "value": 835.6
        },
        {
          "timestamp": "03/19",
          "value": 759.7
        },
        {
          "timestamp": "03/20",
          "value": 730.9
        },
        {
          "timestamp": "03/21",
          "value": 711.2
        },
        {
          "timestamp": "03/22",
          "value": 703.2
        },
        {
          "timestamp": "03/23",
          "value": 694.2
        },
        {
          "timestamp": "03/24",
          "value": 712
        },
        {
          "timestamp": "03/25",
          "value": 683.3
        },
        {
          "timestamp": "03/26",
          "value": 752.8
        },
        {
          "timestamp": "03/27",
          "value": 753.5
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 45.3
        },
        {
          "timestamp": "03/15",
          "value": 48.3
        },
        {
          "timestamp": "03/16",
          "value": 48.6
        },
        {
          "timestamp": "03/17",
          "value": 44.8
        },
        {
          "timestamp": "03/18",
          "value": 49.3
        },
        {
          "timestamp": "03/19",
          "value": 50
        },
        {
          "timestamp": "03/20",
          "value": 42.4
        },
        {
          "timestamp": "03/21",
          "value": 45.2
        },
        {
          "timestamp": "03/22",
          "value": 43.1
        },
        {
          "timestamp": "03/23",
          "value": 41.6
        },
        {
          "timestamp": "03/24",
          "value": 36.4
        },
        {
          "timestamp": "03/25",
          "value": 36.5
        },
        {
          "timestamp": "03/26",
          "value": 41.9
        },
        {
          "timestamp": "03/27",
          "value": 43.3
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 74.9
        },
        {
          "timestamp": "03/15",
          "value": 75.6
        },
        {
          "timestamp": "03/16",
          "value": 80.7
        },
        {
          "timestamp": "03/17",
          "value": 81.4
        },
        {
          "timestamp": "03/18",
          "value": 82.6
        },
        {
          "timestamp": "03/19",
          "value": 82.4
        },
        {
          "timestamp": "03/20",
          "value": 78.5
        },
        {
          "timestamp": "03/21",
          "value": 74.5
        },
        {
          "timestamp": "03/22",
          "value": 70.2
        },
        {
          "timestamp": "03/23",
          "value": 68.9
        },
        {
          "timestamp": "03/24",
          "value": 66.3
        },
        {
          "timestamp": "03/25",
          "value": 70.2
        },
        {
          "timestamp": "03/26",
          "value": 66.9
        },
        {
          "timestamp": "03/27",
          "value": 77.9
        }
      ]
    }
  },
  {
    "id": "gsvp-msi-gpu127",
    "label": "GPU-127",
    "spec": {
      "model": "NVIDIA B200",
      "vramGB": 192,
      "tdpW": 1000,
      "interconnect": "NVLink 5.0",
      "cudaCores": 21504
    },
    "status": "ok",
    "current": {
      "gpuUsage": 81,
      "memUsage": 45,
      "temp": 60,
      "power": 553,
      "cpuUsage": 39,
      "cpuMemUsage": 45
    },
    "series": {
      "gpuUsage": [
        {
          "timestamp": "03/14",
          "value": 79.9
        },
        {
          "timestamp": "03/15",
          "value": 88.9
        },
        {
          "timestamp": "03/16",
          "value": 81.1
        },
        {
          "timestamp": "03/17",
          "value": 93.9
        },
        {
          "timestamp": "03/18",
          "value": 82.3
        },
        {
          "timestamp": "03/19",
          "value": 80.2
        },
        {
          "timestamp": "03/20",
          "value": 74.9
        },
        {
          "timestamp": "03/21",
          "value": 77.8
        },
        {
          "timestamp": "03/22",
          "value": 72.9
        },
        {
          "timestamp": "03/23",
          "value": 75.5
        },
        {
          "timestamp": "03/24",
          "value": 69.5
        },
        {
          "timestamp": "03/25",
          "value": 71.9
        },
        {
          "timestamp": "03/26",
          "value": 72
        },
        {
          "timestamp": "03/27",
          "value": 84.3
        }
      ],
      "memUsage": [
        {
          "timestamp": "03/14",
          "value": 46.8
        },
        {
          "timestamp": "03/15",
          "value": 50.3
        },
        {
          "timestamp": "03/16",
          "value": 50.3
        },
        {
          "timestamp": "03/17",
          "value": 47.9
        },
        {
          "timestamp": "03/18",
          "value": 47.4
        },
        {
          "timestamp": "03/19",
          "value": 47
        },
        {
          "timestamp": "03/20",
          "value": 47
        },
        {
          "timestamp": "03/21",
          "value": 45.5
        },
        {
          "timestamp": "03/22",
          "value": 43.6
        },
        {
          "timestamp": "03/23",
          "value": 39.4
        },
        {
          "timestamp": "03/24",
          "value": 41.4
        },
        {
          "timestamp": "03/25",
          "value": 43.3
        },
        {
          "timestamp": "03/26",
          "value": 42.4
        },
        {
          "timestamp": "03/27",
          "value": 44.7
        }
      ],
      "temp": [
        {
          "timestamp": "03/14",
          "value": 59.2
        },
        {
          "timestamp": "03/15",
          "value": 62.4
        },
        {
          "timestamp": "03/16",
          "value": 66.8
        },
        {
          "timestamp": "03/17",
          "value": 64.9
        },
        {
          "timestamp": "03/18",
          "value": 66.3
        },
        {
          "timestamp": "03/19",
          "value": 62.9
        },
        {
          "timestamp": "03/20",
          "value": 58.5
        },
        {
          "timestamp": "03/21",
          "value": 57.7
        },
        {
          "timestamp": "03/22",
          "value": 53.1
        },
        {
          "timestamp": "03/23",
          "value": 55.9
        },
        {
          "timestamp": "03/24",
          "value": 53.4
        },
        {
          "timestamp": "03/25",
          "value": 57.2
        },
        {
          "timestamp": "03/26",
          "value": 57.9
        },
        {
          "timestamp": "03/27",
          "value": 59.1
        }
      ],
      "power": [
        {
          "timestamp": "03/14",
          "value": 564.8
        },
        {
          "timestamp": "03/15",
          "value": 585.5
        },
        {
          "timestamp": "03/16",
          "value": 597.7
        },
        {
          "timestamp": "03/17",
          "value": 596.1
        },
        {
          "timestamp": "03/18",
          "value": 608.5
        },
        {
          "timestamp": "03/19",
          "value": 592.8
        },
        {
          "timestamp": "03/20",
          "value": 584.7
        },
        {
          "timestamp": "03/21",
          "value": 559.8
        },
        {
          "timestamp": "03/22",
          "value": 538
        },
        {
          "timestamp": "03/23",
          "value": 497.5
        },
        {
          "timestamp": "03/24",
          "value": 497.5
        },
        {
          "timestamp": "03/25",
          "value": 537.8
        },
        {
          "timestamp": "03/26",
          "value": 524.6
        },
        {
          "timestamp": "03/27",
          "value": 588.8
        }
      ],
      "cpuUsage": [
        {
          "timestamp": "03/14",
          "value": 42.2
        },
        {
          "timestamp": "03/15",
          "value": 40.8
        },
        {
          "timestamp": "03/16",
          "value": 44.7
        },
        {
          "timestamp": "03/17",
          "value": 46.4
        },
        {
          "timestamp": "03/18",
          "value": 40.5
        },
        {
          "timestamp": "03/19",
          "value": 42.4
        },
        {
          "timestamp": "03/20",
          "value": 41.5
        },
        {
          "timestamp": "03/21",
          "value": 34.1
        },
        {
          "timestamp": "03/22",
          "value": 37.9
        },
        {
          "timestamp": "03/23",
          "value": 33.9
        },
        {
          "timestamp": "03/24",
          "value": 33.3
        },
        {
          "timestamp": "03/25",
          "value": 32.7
        },
        {
          "timestamp": "03/26",
          "value": 35.4
        },
        {
          "timestamp": "03/27",
          "value": 43.1
        }
      ],
      "cpuMemUsage": [
        {
          "timestamp": "03/14",
          "value": 47.1
        },
        {
          "timestamp": "03/15",
          "value": 46.7
        },
        {
          "timestamp": "03/16",
          "value": 51.7
        },
        {
          "timestamp": "03/17",
          "value": 46.6
        },
        {
          "timestamp": "03/18",
          "value": 49.4
        },
        {
          "timestamp": "03/19",
          "value": 49.7
        },
        {
          "timestamp": "03/20",
          "value": 47.8
        },
        {
          "timestamp": "03/21",
          "value": 45.7
        },
        {
          "timestamp": "03/22",
          "value": 40.1
        },
        {
          "timestamp": "03/23",
          "value": 39.7
        },
        {
          "timestamp": "03/24",
          "value": 38.2
        },
        {
          "timestamp": "03/25",
          "value": 40.5
        },
        {
          "timestamp": "03/26",
          "value": 43.4
        },
        {
          "timestamp": "03/27",
          "value": 49.1
        }
      ]
    }
  }
];

// 네트워크 메트릭 (테넌트별 기준값 — 할당 후 렌더링)
export const mockNetworkMetrics: Record<string, NetworkMetric> = {
  "tenant-lg": {
    "tenantId": "tenant-lg",
    "currentOutboundGB": 45120,
    "currentInboundGB": 8204,
    "outbound": [
      {
        "timestamp": "03/14",
        "value": 48071.2
      },
      {
        "timestamp": "03/15",
        "value": 49694.7
      },
      {
        "timestamp": "03/16",
        "value": 47515.9
      },
      {
        "timestamp": "03/17",
        "value": 45173.8
      },
      {
        "timestamp": "03/18",
        "value": 44782.1
      },
      {
        "timestamp": "03/19",
        "value": 43981
      },
      {
        "timestamp": "03/20",
        "value": 43084.9
      },
      {
        "timestamp": "03/21",
        "value": 44616.8
      },
      {
        "timestamp": "03/22",
        "value": 37356.1
      },
      {
        "timestamp": "03/23",
        "value": 38097.2
      },
      {
        "timestamp": "03/24",
        "value": 40936.9
      },
      {
        "timestamp": "03/25",
        "value": 46325.3
      },
      {
        "timestamp": "03/26",
        "value": 46477.2
      },
      {
        "timestamp": "03/27",
        "value": 43835.3
      }
    ],
    "inbound": [
      {
        "timestamp": "03/14",
        "value": 8916
      },
      {
        "timestamp": "03/15",
        "value": 8830.7
      },
      {
        "timestamp": "03/16",
        "value": 9478.4
      },
      {
        "timestamp": "03/17",
        "value": 8487.8
      },
      {
        "timestamp": "03/18",
        "value": 8648.7
      },
      {
        "timestamp": "03/19",
        "value": 9093.7
      },
      {
        "timestamp": "03/20",
        "value": 8940.4
      },
      {
        "timestamp": "03/21",
        "value": 7251.6
      },
      {
        "timestamp": "03/22",
        "value": 7016.2
      },
      {
        "timestamp": "03/23",
        "value": 7605.4
      },
      {
        "timestamp": "03/24",
        "value": 7866.1
      },
      {
        "timestamp": "03/25",
        "value": 7270.8
      },
      {
        "timestamp": "03/26",
        "value": 7633.2
      },
      {
        "timestamp": "03/27",
        "value": 9065.6
      }
    ]
  },
  "tenant-upstage": {
    "tenantId": "tenant-upstage",
    "currentOutboundGB": 28400,
    "currentInboundGB": 3100,
    "outbound": [
      {
        "timestamp": "03/14",
        "value": 27809.4
      },
      {
        "timestamp": "03/15",
        "value": 27357.4
      },
      {
        "timestamp": "03/16",
        "value": 33313.4
      },
      {
        "timestamp": "03/17",
        "value": 32667
      },
      {
        "timestamp": "03/18",
        "value": 32876
      },
      {
        "timestamp": "03/19",
        "value": 31479.1
      },
      {
        "timestamp": "03/20",
        "value": 30559.7
      },
      {
        "timestamp": "03/21",
        "value": 30199.9
      },
      {
        "timestamp": "03/22",
        "value": 23272.2
      },
      {
        "timestamp": "03/23",
        "value": 27436.5
      },
      {
        "timestamp": "03/24",
        "value": 28715.8
      },
      {
        "timestamp": "03/25",
        "value": 25146.7
      },
      {
        "timestamp": "03/26",
        "value": 26277.8
      },
      {
        "timestamp": "03/27",
        "value": 29908.8
      }
    ],
    "inbound": [
      {
        "timestamp": "03/14",
        "value": 3293.1
      },
      {
        "timestamp": "03/15",
        "value": 3385.3
      },
      {
        "timestamp": "03/16",
        "value": 3400.9
      },
      {
        "timestamp": "03/17",
        "value": 3430.7
      },
      {
        "timestamp": "03/18",
        "value": 3351.7
      },
      {
        "timestamp": "03/19",
        "value": 3362.1
      },
      {
        "timestamp": "03/20",
        "value": 3273.3
      },
      {
        "timestamp": "03/21",
        "value": 2769.7
      },
      {
        "timestamp": "03/22",
        "value": 2910.5
      },
      {
        "timestamp": "03/23",
        "value": 2698.5
      },
      {
        "timestamp": "03/24",
        "value": 2582.8
      },
      {
        "timestamp": "03/25",
        "value": 2858.1
      },
      {
        "timestamp": "03/26",
        "value": 2858.6
      },
      {
        "timestamp": "03/27",
        "value": 3103.5
      }
    ]
  },
  "tenant-samsung": {
    "tenantId": "tenant-samsung",
    "currentOutboundGB": 9800,
    "currentInboundGB": 1200,
    "outbound": [
      {
        "timestamp": "03/14",
        "value": 10028.3
      },
      {
        "timestamp": "03/15",
        "value": 9281.2
      },
      {
        "timestamp": "03/16",
        "value": 11385.3
      },
      {
        "timestamp": "03/17",
        "value": 10301.9
      },
      {
        "timestamp": "03/18",
        "value": 10370.1
      },
      {
        "timestamp": "03/19",
        "value": 10539.1
      },
      {
        "timestamp": "03/20",
        "value": 10289.5
      },
      {
        "timestamp": "03/21",
        "value": 10325.8
      },
      {
        "timestamp": "03/22",
        "value": 8803.1
      },
      {
        "timestamp": "03/23",
        "value": 9337.8
      },
      {
        "timestamp": "03/24",
        "value": 9297.3
      },
      {
        "timestamp": "03/25",
        "value": 10210.3
      },
      {
        "timestamp": "03/26",
        "value": 8791.9
      },
      {
        "timestamp": "03/27",
        "value": 10490.5
      }
    ],
    "inbound": [
      {
        "timestamp": "03/14",
        "value": 1306.5
      },
      {
        "timestamp": "03/15",
        "value": 1344.6
      },
      {
        "timestamp": "03/16",
        "value": 1352.6
      },
      {
        "timestamp": "03/17",
        "value": 1347.4
      },
      {
        "timestamp": "03/18",
        "value": 1361.3
      },
      {
        "timestamp": "03/19",
        "value": 1361.9
      },
      {
        "timestamp": "03/20",
        "value": 1216.2
      },
      {
        "timestamp": "03/21",
        "value": 1213.4
      },
      {
        "timestamp": "03/22",
        "value": 1199.5
      },
      {
        "timestamp": "03/23",
        "value": 978
      },
      {
        "timestamp": "03/24",
        "value": 980.1
      },
      {
        "timestamp": "03/25",
        "value": 1233.3
      },
      {
        "timestamp": "03/26",
        "value": 1211.7
      },
      {
        "timestamp": "03/27",
        "value": 1304.7
      }
    ]
  }
};

// AI 스토리지 메트릭 (테넌트별)
export const mockStorageMetrics: Record<string, StorageMetric> = {
  "tenant-lg": {
    "tenantId": "tenant-lg",
    "usageTB": 1248,
    "totalTB": 2048,
    "usagePercent": 61,
    "capacity": [
      {
        "timestamp": "03/14",
        "value": 1268
      },
      {
        "timestamp": "03/15",
        "value": 1322.6
      },
      {
        "timestamp": "03/16",
        "value": 1347.6
      },
      {
        "timestamp": "03/17",
        "value": 1369.2
      },
      {
        "timestamp": "03/18",
        "value": 1353.7
      },
      {
        "timestamp": "03/19",
        "value": 1301.1
      },
      {
        "timestamp": "03/20",
        "value": 1258.4
      },
      {
        "timestamp": "03/21",
        "value": 1224
      },
      {
        "timestamp": "03/22",
        "value": 1169.6
      },
      {
        "timestamp": "03/23",
        "value": 1134.3
      },
      {
        "timestamp": "03/24",
        "value": 1116.8
      },
      {
        "timestamp": "03/25",
        "value": 1174.2
      },
      {
        "timestamp": "03/26",
        "value": 1202.9
      },
      {
        "timestamp": "03/27",
        "value": 1268.8
      }
    ],
    "bw": [
      {
        "timestamp": "03/14",
        "value": 9501.9
      },
      {
        "timestamp": "03/15",
        "value": 9914.2
      },
      {
        "timestamp": "03/16",
        "value": 9719.4
      },
      {
        "timestamp": "03/17",
        "value": 10077.9
      },
      {
        "timestamp": "03/18",
        "value": 10294.3
      },
      {
        "timestamp": "03/19",
        "value": 9472.9
      },
      {
        "timestamp": "03/20",
        "value": 9573.2
      },
      {
        "timestamp": "03/21",
        "value": 7473.4
      },
      {
        "timestamp": "03/22",
        "value": 8496.8
      },
      {
        "timestamp": "03/23",
        "value": 7725.4
      },
      {
        "timestamp": "03/24",
        "value": 6745.5
      },
      {
        "timestamp": "03/25",
        "value": 8332
      },
      {
        "timestamp": "03/26",
        "value": 8103.9
      },
      {
        "timestamp": "03/27",
        "value": 9594.4
      }
    ],
    "iops": [
      {
        "timestamp": "03/14",
        "value": 108457.3
      },
      {
        "timestamp": "03/15",
        "value": 124611.2
      },
      {
        "timestamp": "03/16",
        "value": 140415.7
      },
      {
        "timestamp": "03/17",
        "value": 138783.2
      },
      {
        "timestamp": "03/18",
        "value": 122007.3
      },
      {
        "timestamp": "03/19",
        "value": 122849.9
      },
      {
        "timestamp": "03/20",
        "value": 118934.5
      },
      {
        "timestamp": "03/21",
        "value": 118364.3
      },
      {
        "timestamp": "03/22",
        "value": 120973.7
      },
      {
        "timestamp": "03/23",
        "value": 110865.3
      },
      {
        "timestamp": "03/24",
        "value": 103943.3
      },
      {
        "timestamp": "03/25",
        "value": 101175.9
      },
      {
        "timestamp": "03/26",
        "value": 127175.2
      },
      {
        "timestamp": "03/27",
        "value": 120904.6
      }
    ],
    "latency": [
      {
        "timestamp": "03/14",
        "value": 1.9
      },
      {
        "timestamp": "03/15",
        "value": 2.2
      },
      {
        "timestamp": "03/16",
        "value": 2.2
      },
      {
        "timestamp": "03/17",
        "value": 2.4
      },
      {
        "timestamp": "03/18",
        "value": 2.4
      },
      {
        "timestamp": "03/19",
        "value": 2.1
      },
      {
        "timestamp": "03/20",
        "value": 2
      },
      {
        "timestamp": "03/21",
        "value": 2.1
      },
      {
        "timestamp": "03/22",
        "value": 2
      },
      {
        "timestamp": "03/23",
        "value": 1.8
      },
      {
        "timestamp": "03/24",
        "value": 1.9
      },
      {
        "timestamp": "03/25",
        "value": 1.8
      },
      {
        "timestamp": "03/26",
        "value": 1.9
      },
      {
        "timestamp": "03/27",
        "value": 2.2
      }
    ]
  },
  "tenant-upstage": {
    "tenantId": "tenant-upstage",
    "usageTB": 820,
    "totalTB": 2048,
    "usagePercent": 40,
    "capacity": [
      {
        "timestamp": "03/14",
        "value": 821.3
      },
      {
        "timestamp": "03/15",
        "value": 861.3
      },
      {
        "timestamp": "03/16",
        "value": 884.5
      },
      {
        "timestamp": "03/17",
        "value": 915.8
      },
      {
        "timestamp": "03/18",
        "value": 907.2
      },
      {
        "timestamp": "03/19",
        "value": 860.9
      },
      {
        "timestamp": "03/20",
        "value": 842.7
      },
      {
        "timestamp": "03/21",
        "value": 793
      },
      {
        "timestamp": "03/22",
        "value": 756.7
      },
      {
        "timestamp": "03/23",
        "value": 741.1
      },
      {
        "timestamp": "03/24",
        "value": 725.6
      },
      {
        "timestamp": "03/25",
        "value": 769
      },
      {
        "timestamp": "03/26",
        "value": 792.1
      },
      {
        "timestamp": "03/27",
        "value": 823.8
      }
    ],
    "bw": [
      {
        "timestamp": "03/14",
        "value": 4960.9
      },
      {
        "timestamp": "03/15",
        "value": 5436.7
      },
      {
        "timestamp": "03/16",
        "value": 5830.7
      },
      {
        "timestamp": "03/17",
        "value": 5181.2
      },
      {
        "timestamp": "03/18",
        "value": 5258
      },
      {
        "timestamp": "03/19",
        "value": 5432.2
      },
      {
        "timestamp": "03/20",
        "value": 5597.5
      },
      {
        "timestamp": "03/21",
        "value": 5485.7
      },
      {
        "timestamp": "03/22",
        "value": 4855.6
      },
      {
        "timestamp": "03/23",
        "value": 4417
      },
      {
        "timestamp": "03/24",
        "value": 4733.1
      },
      {
        "timestamp": "03/25",
        "value": 4412.9
      },
      {
        "timestamp": "03/26",
        "value": 5203.1
      },
      {
        "timestamp": "03/27",
        "value": 5643.8
      }
    ],
    "iops": [
      {
        "timestamp": "03/14",
        "value": 70566.2
      },
      {
        "timestamp": "03/15",
        "value": 84162.6
      },
      {
        "timestamp": "03/16",
        "value": 91018.9
      },
      {
        "timestamp": "03/17",
        "value": 81913.7
      },
      {
        "timestamp": "03/18",
        "value": 91716.9
      },
      {
        "timestamp": "03/19",
        "value": 86715.3
      },
      {
        "timestamp": "03/20",
        "value": 73641.1
      },
      {
        "timestamp": "03/21",
        "value": 75930.8
      },
      {
        "timestamp": "03/22",
        "value": 77455.1
      },
      {
        "timestamp": "03/23",
        "value": 70412.3
      },
      {
        "timestamp": "03/24",
        "value": 64795.9
      },
      {
        "timestamp": "03/25",
        "value": 65588.7
      },
      {
        "timestamp": "03/26",
        "value": 80254.5
      },
      {
        "timestamp": "03/27",
        "value": 82292.8
      }
    ],
    "latency": [
      {
        "timestamp": "03/14",
        "value": 1.8
      },
      {
        "timestamp": "03/15",
        "value": 1.8
      },
      {
        "timestamp": "03/16",
        "value": 1.9
      },
      {
        "timestamp": "03/17",
        "value": 1.9
      },
      {
        "timestamp": "03/18",
        "value": 1.9
      },
      {
        "timestamp": "03/19",
        "value": 1.8
      },
      {
        "timestamp": "03/20",
        "value": 1.9
      },
      {
        "timestamp": "03/21",
        "value": 1.7
      },
      {
        "timestamp": "03/22",
        "value": 1.6
      },
      {
        "timestamp": "03/23",
        "value": 1.6
      },
      {
        "timestamp": "03/24",
        "value": 1.7
      },
      {
        "timestamp": "03/25",
        "value": 1.7
      },
      {
        "timestamp": "03/26",
        "value": 1.7
      },
      {
        "timestamp": "03/27",
        "value": 1.9
      }
    ]
  },
  "tenant-samsung": {
    "tenantId": "tenant-samsung",
    "usageTB": 340,
    "totalTB": 1024,
    "usagePercent": 33,
    "capacity": [
      {
        "timestamp": "03/14",
        "value": 337.4
      },
      {
        "timestamp": "03/15",
        "value": 361
      },
      {
        "timestamp": "03/16",
        "value": 366.2
      },
      {
        "timestamp": "03/17",
        "value": 372.4
      },
      {
        "timestamp": "03/18",
        "value": 369.9
      },
      {
        "timestamp": "03/19",
        "value": 357.8
      },
      {
        "timestamp": "03/20",
        "value": 348.1
      },
      {
        "timestamp": "03/21",
        "value": 334.3
      },
      {
        "timestamp": "03/22",
        "value": 312.3
      },
      {
        "timestamp": "03/23",
        "value": 301.7
      },
      {
        "timestamp": "03/24",
        "value": 306.8
      },
      {
        "timestamp": "03/25",
        "value": 321
      },
      {
        "timestamp": "03/26",
        "value": 330.6
      },
      {
        "timestamp": "03/27",
        "value": 347.6
      }
    ],
    "bw": [
      {
        "timestamp": "03/14",
        "value": 2144.4
      },
      {
        "timestamp": "03/15",
        "value": 2154.4
      },
      {
        "timestamp": "03/16",
        "value": 2340.6
      },
      {
        "timestamp": "03/17",
        "value": 2331.4
      },
      {
        "timestamp": "03/18",
        "value": 2427
      },
      {
        "timestamp": "03/19",
        "value": 2149.5
      },
      {
        "timestamp": "03/20",
        "value": 1959.2
      },
      {
        "timestamp": "03/21",
        "value": 2117.8
      },
      {
        "timestamp": "03/22",
        "value": 2027.4
      },
      {
        "timestamp": "03/23",
        "value": 1782.4
      },
      {
        "timestamp": "03/24",
        "value": 1915
      },
      {
        "timestamp": "03/25",
        "value": 1787.5
      },
      {
        "timestamp": "03/26",
        "value": 1935.8
      },
      {
        "timestamp": "03/27",
        "value": 2342.8
      }
    ],
    "iops": [
      {
        "timestamp": "03/14",
        "value": 30919.4
      },
      {
        "timestamp": "03/15",
        "value": 31823.7
      },
      {
        "timestamp": "03/16",
        "value": 32457
      },
      {
        "timestamp": "03/17",
        "value": 37639.7
      },
      {
        "timestamp": "03/18",
        "value": 34980.9
      },
      {
        "timestamp": "03/19",
        "value": 32118.4
      },
      {
        "timestamp": "03/20",
        "value": 34651.4
      },
      {
        "timestamp": "03/21",
        "value": 30307.2
      },
      {
        "timestamp": "03/22",
        "value": 31052.6
      },
      {
        "timestamp": "03/23",
        "value": 30708.5
      },
      {
        "timestamp": "03/24",
        "value": 28493.8
      },
      {
        "timestamp": "03/25",
        "value": 30140.5
      },
      {
        "timestamp": "03/26",
        "value": 30176.8
      },
      {
        "timestamp": "03/27",
        "value": 34373.2
      }
    ],
    "latency": [
      {
        "timestamp": "03/14",
        "value": 1.5
      },
      {
        "timestamp": "03/15",
        "value": 1.6
      },
      {
        "timestamp": "03/16",
        "value": 1.6
      },
      {
        "timestamp": "03/17",
        "value": 1.7
      },
      {
        "timestamp": "03/18",
        "value": 1.6
      },
      {
        "timestamp": "03/19",
        "value": 1.7
      },
      {
        "timestamp": "03/20",
        "value": 1.6
      },
      {
        "timestamp": "03/21",
        "value": 1.5
      },
      {
        "timestamp": "03/22",
        "value": 1.4
      },
      {
        "timestamp": "03/23",
        "value": 1.3
      },
      {
        "timestamp": "03/24",
        "value": 1.3
      },
      {
        "timestamp": "03/25",
        "value": 1.4
      },
      {
        "timestamp": "03/26",
        "value": 1.4
      },
      {
        "timestamp": "03/27",
        "value": 1.5
      }
    ]
  }
};
