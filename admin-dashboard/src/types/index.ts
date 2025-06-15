// User types
export type UserRole = 
  | 'Super Admin' 
  | 'Admin' 
  | 'Operation Manager' 
  | 'Accounting Manager' 
  | 'Sales Manager' 
  | 'Staff' 
  | 'Customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
  profileImage?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Menu Item types
export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  allergens: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  nutritionalInfo: NutritionalInfo;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// Menu Item Sales types
export interface MenuItemSales {
  itemId: string;
  totalOrders: number;
  totalRevenue: number;
  salesPercentage: number;
  rank: number;
}

export interface MonthlySalesData {
  month: string;
  orders: number;
  revenue: number;
}

export interface InventoryUsage {
  ingredientName: string;
  initial: number;
  current: number;
  unit: string;
  usagePercentage: number;
}

// Order types
export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

// Order status types
export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

export type PaymentMethod = 
  | 'cash' 
  | 'credit_card' 
  | 'debit_card' 
  | 'mobile_payment';

export interface DeliveryAddress {
  streetAddress: string;
  city: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Order {
  id: string;
  orderNumber?: number;
  customerId?: string;
  userId?: string;
  userName?: string;
  items: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    options?: Record<string, string>;
  }[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  total?: number;
  totalAmount: number;
  tax?: number;
  deliveryFee?: number;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  address?: string;
  deliveryAddress?: {
    streetAddress: string;
    city: string;
    state?: string;
    zipCode?: string;
  };
  deliveryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Activity types
export interface UserActivity {
  userId: string;
  name: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

// Dashboard types
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  averageOrderValue: number;
}

// Category types
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

// Sales and Analytics types
export interface SalesData {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface TopSellingItem {
  menuItemId: string;
  name: string;
  totalSold: number;
  revenue: number;
}

// Inventory types
export type InventoryUnit = 'kg' | 'g' | 'lbs' | 'oz' | 'l' | 'ml' | 'units' | 'boxes' | 'packages';
export type InventoryCategory = 'Meat' | 'Produce' | 'Dairy' | 'Beverages' | 'Dry Goods' | 'Frozen' | 'Spices' | 'Other';
export type InventoryStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Ordered';

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category: InventoryCategory | string;
  sku?: string;
  barcode?: string;
  quantity: number;
  unit: InventoryUnit | string;
  unitCost?: number;
  costPerUnit?: number;
  totalCost?: number;
  reorderPoint?: number;
  threshold?: number;
  reorderQuantity?: number;
  location?: string;
  supplier?: string;
  expiryDate?: string;
  lastRestocked?: string;
  image?: string;
  status: InventoryStatus | 'in-stock' | 'low-stock' | 'out-of-stock';
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  inventoryItemId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  previousQuantity: number;
  newQuantity: number;
  cost?: number;
  orderId?: string;
  performedBy: string;
  timestamp: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Report types
export interface ReportType {
  id: string;
  name: string;
  description: string;
  endpoint: string;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  status?: string;
  userId?: string;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

// Notification types
export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error';

// Chart types
export type ChartPeriod = 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'yearly';

// Table types
export type SortDirection = 'asc' | 'desc';

// Common types
export interface SelectOption {
  label: string;
  value: string | number;
}

// Layout types
export type SidebarState = 'expanded' | 'collapsed' | 'hidden'; 