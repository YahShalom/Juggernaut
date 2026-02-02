export type EsaRole = "tech" | "owner" | "admin" | "staff" | "viewer";

export type Tenant = {
  id: string;
  slug: string;
  name?: string | null;
  status?: string | null; // 'active'
};

export type Membership = {
  tenant_id: string;
  user_id: string;
  role: EsaRole;
};

export type EsaContext = {
  tenant: Tenant;
  role: EsaRole;
  userId: string;
};
