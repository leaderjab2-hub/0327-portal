CREATE TABLE tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contractor_email TEXT,
  manager_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  contract JSONB
);

CREATE TABLE subtenants (
  id TEXT PRIMARY KEY,
  tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT '대기',
  products JSONB,
  start_date TEXT,
  end_date TEXT,
  pm TEXT,
  member_count INT DEFAULT 0,
  assigned_nodes JSONB DEFAULT '[]'
);
