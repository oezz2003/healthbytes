import { NextRequest, NextResponse } from "next/server";
import { db, storage, firebaseAdmin } from '@/lib/firebase/adminApi';
import { MenuItem } from "@/types";

// ✅ Helper response functions
const successResponse = (data?: any, status = 200) =>
  NextResponse.json({ success: true, data }, { status });

const errorResponse = (message: string, status = 500) =>
  NextResponse.json({ success: false, error: message }, { status });

// ✅ GET: Get all menu items
export async function GET(req: NextRequest) {
  try {
    const snapshot = await db.collection("menuItems").get();
    const menuItems = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return successResponse(menuItems);
  } catch (error: any) {
    return errorResponse(error.message || "Error fetching menu items");
  }
}

// ✅ POST: Create a new menu item
export async function POST(req: NextRequest) {
  try {
    const menuItem: Partial<MenuItem> = await req.json();

    // Validate required fields
    if (!menuItem.name || !menuItem.price || !menuItem.category) {
      return errorResponse("Missing required fields: name, price, category", 400);
    }

    // Create a new menu item with proper structure
    const newMenuItem = {
      name: menuItem.name,
      description: menuItem.description || "",
      price: menuItem.price,
      image: menuItem.image || "",
      category: menuItem.category,
      nutritionalInfo: menuItem.nutritionalInfo || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        ingredients: [],
        allergens: []
      },
      isAvailable: menuItem.isAvailable !== undefined ? menuItem.isAvailable : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection("menuItems").add(newMenuItem);
    
    // Return the created item with its ID
    return successResponse({
      id: docRef.id,
      ...newMenuItem
    });
  } catch (error: any) {
    return errorResponse(error.message || "Error creating menu item");
  }
}

// ✅ PUT: Update existing menu item
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const updates: Partial<MenuItem> = await req.json();

    if (!id) return errorResponse("Missing menu item ID", 400);

    // Validate the menu item exists
    const docRef = db.collection("menuItems").doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return errorResponse("Menu item not found", 404);
    }

    // Add updated timestamp
    updates.updatedAt = new Date().toISOString();

    await docRef.update(updates);

    // Get the updated document
    const updatedDoc = await docRef.get();
    const updatedMenuItem = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };

    return successResponse(updatedMenuItem);
  } catch (error: any) {
    return errorResponse(error.message || "Error updating menu item");
  }
}

// ✅ DELETE: Delete menu item
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return errorResponse("Missing menu item ID", 400);

    // Validate the menu item exists
    const docRef = db.collection("menuItems").doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return errorResponse("Menu item not found", 404);
    }

    await docRef.delete();

    return successResponse({ message: "Menu item deleted successfully", id });
  } catch (error: any) {
    return errorResponse(error.message || "Error deleting menu item");
  }
}
