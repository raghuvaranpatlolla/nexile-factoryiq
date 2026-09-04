export interface User {
  id: number;
  email: string;
  full_name: string;
  job_title?: string;
  department?: string;
  role: string;
  site_id?: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Project {
  id: number;
  project_code: string;
  name: string;
  description?: string;
  customer_id: number;
  customer_name?: string;
  site_id: number;
  site_name?: string;
  status: string;
  health: string;
  priority: string;
  progress_percent: number;
  start_date: string;
  target_date?: string;
  milestones?: Milestone[];
}

export interface Milestone {
  id: number;
  title: string;
  phase: string;
  due_date: string;
  status: string;
}

export interface WorkOrder {
  id: number;
  wo_number: string;
  product_name?: string;
  site_name?: string;
  line_code?: string;
  target_quantity: number;
  produced_quantity: number;
  rework_quantity: number;
  scrap_quantity: number;
  yield_rate: number;
  shift: string;
  status: string;
  start_time: string;
}

export interface NCR {
  id: number;
  ncr_number: string;
  title: string;
  site_id: number;
  severity: string;
  status: string;
  description: string;
  containment_action?: string;
  root_cause?: string;
  created_at: string;
}

export interface CAPA {
  id: number;
  capa_number: string;
  title: string;
  corrective_action: string;
  preventive_action: string;
  owner: string;
  status: string;
  due_date: string;
}

export interface Certificate {
  id: number;
  cert_number: string;
  name: string;
  issuing_body: string;
  issue_date: string;
  expiry_date: string;
  status: string;
}

export interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_name?: string;
  total_amount: number;
  status: string;
  ordered_date: string;
  required_date: string;
}

export interface Inventory {
  id: number;
  item_part_number?: string;
  item_name?: string;
  site_name?: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  min_stock_level: number;
  reorder_point: number;
  status: string;
}

export interface RMA {
  id: number;
  rma_number: string;
  customer_name?: string;
  product_name?: string;
  serial_number: string;
  reason: string;
  status: string;
  priority: string;
  assigned_technician?: string;
}

export interface SearchResult {
  category: string;
  id: number;
  title: string;
  subtitle: string;
  link: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  category: string;
  priority: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_email?: string;
  action: string;
  entity_name: string;
  entity_id?: string;
  details?: string;
  timestamp: string;
}
