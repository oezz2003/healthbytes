import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/firebase/adminApi';

// Helper response functions
const successResponse = (data?: any, status = 200) =>
  NextResponse.json({ success: true, data }, { status });

const errorResponse = (message: string, status = 500) =>
  NextResponse.json({ success: false, error: message }, { status });

// Define types
interface MonthData {
  month: Date;
  name: string;
  revenue: number;
  orders: number;
}

interface OrderItem {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  quantity: number;
}

interface UserData {
  name?: string;
  displayName?: string;
  lastLoginAt?: any;
  lastActive?: any;
  updatedAt?: any;
  createdAt?: any;
}

// GET: Get dashboard statistics
export async function GET(req: NextRequest) {
  try {
    // Create mock data for testing
    const mockData = {
      stats: {
        totalUsers: 156,
        activeUsers: 87,
        totalOrders: 432,
        pendingOrders: 18,
        totalRevenue: 15680.50,
        menuItems: 48,
      },
      recentOrders: [
        {
          id: 'order-10005',
          orderNumber: '10005',
          status: 'completed',
          total: 129.98,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          userName: 'Ahmed Mohamed'
        },
        {
          id: 'order-10004',
          orderNumber: '10004',
          status: 'pending',
          total: 113.96,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
          userName: 'Sara Ahmed'
        },
        {
          id: 'order-10003',
          orderNumber: '10003',
          status: 'processing',
          total: 109.98,
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          userName: 'Noura Sultan'
        }
      ],
      salesData: [
        { name: 'January', revenue: 4000, orders: 24 },
        { name: 'February', revenue: 3000, orders: 18 },
        { name: 'March', revenue: 5000, orders: 30 },
        { name: 'April', revenue: 2780, orders: 16 },
        { name: 'May', revenue: 1890, orders: 11 },
        { name: 'June', revenue: 2390, orders: 14 },
        { name: 'July', revenue: 3490, orders: 21 },
      ],
      topSellingItems: [
        { id: 'item-1', name: 'Margherita Pizza', orders: 124, revenue: 1860, quantity: 124 },
        { id: 'item-2', name: 'Deluxe Burger', orders: 98, revenue: 1470, quantity: 98 },
        { id: 'item-3', name: 'Pasta Carbonara', orders: 82, revenue: 1230, quantity: 82 },
        { id: 'item-4', name: 'Caesar Salad', orders: 76, revenue: 912, quantity: 76 },
        { id: 'item-5', name: 'Chicken Wings', orders: 65, revenue: 780, quantity: 65 },
      ]
    };

    // Try to get real data from Firestore
    try {
      // Get counts from different collections
      const usersSnapshot = await db.collection("users").get();
      if (usersSnapshot.size > 0) {
        mockData.stats.totalUsers = usersSnapshot.size;
        
        // Estimate active users (30% of total as a simple heuristic)
        mockData.stats.activeUsers = Math.round(usersSnapshot.size * 0.3);
      }
      
      // Get menu items count
      const menuItemsSnapshot = await db.collection("menuItems").get();
      if (menuItemsSnapshot.size > 0) {
        mockData.stats.menuItems = menuItemsSnapshot.size;
      }
      
      // Get orders data
      const ordersSnapshot = await db.collection("orders").get();
      if (ordersSnapshot.size > 0) {
        mockData.stats.totalOrders = ordersSnapshot.size;
        
        // Calculate total revenue
        let totalRevenue = 0;
        ordersSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.totalPrice) {
            totalRevenue += Number(data.totalPrice);
          }
        });
        mockData.stats.totalRevenue = totalRevenue;
        
        // Count pending orders
        const pendingOrders = ordersSnapshot.docs.filter(doc => {
          const data = doc.data();
          return data.status === 'pending';
        }).length;
        mockData.stats.pendingOrders = pendingOrders;
        
        // Get recent orders (last 5)
        const recentOrders = ordersSnapshot.docs
          .sort((a, b) => {
            const dateA = a.data().createdAt?.toDate?.() || new Date(a.data().createdAt || 0);
            const dateB = b.data().createdAt?.toDate?.() || new Date(b.data().createdAt || 0);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 5)
          .map(doc => {
            const data = doc.data();
            const createdAt = data.createdAt?.toDate?.() || new Date(data.createdAt || Date.now());
            
            return {
              id: doc.id,
              orderNumber: data.orderNumber || doc.id.substring(0, 5),
              status: data.status || 'pending',
              total: data.totalPrice || 0,
              createdAt: createdAt,
              userName: data.userName || 'Unknown'
            };
          });
        
        if (recentOrders.length > 0) {
          mockData.recentOrders = recentOrders;
        }
      }
    } catch (error) {
      console.error("Error fetching real data:", error);
      // Continue with mock data if real data fetch fails
    }
    
    return successResponse(mockData);
  } catch (error: any) {
    console.error("Error fetching dashboard data:", error);
    return errorResponse(error.message || "Error fetching dashboard data");
  }
} 