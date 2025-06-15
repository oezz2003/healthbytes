import { NextRequest, NextResponse } from "next/server";
import { db, storage, firebaseAdmin } from '@/lib/firebase/adminApi';

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
    const body = await req.json();

    const {
      name,
      description,
      price,
      ingredients,
      imageUrl = "",
      createdAt = Date.now(),
    } = body;

    if (!name || !price || !Array.isArray(ingredients)) {
      return errorResponse("Missing required fields: name, price, ingredients", 400);
    }

    const docRef = await db.collection("menuItems").add({
      name,
      description,
      price,
      ingredients,
      imageUrl,
      createdAt,
    });

    return successResponse({ id: docRef.id });
  } catch (error: any) {
    return errorResponse(error.message || "Error creating menu item");
  }
}

// ✅ PUT: Update existing menu item
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) return errorResponse("Missing menu item ID", 400);

    const docRef = db.collection("menuItems").doc(id);
    await docRef.update({ ...updates });

    return successResponse({ message: "Menu item updated" });
  } catch (error: any) {
    return errorResponse(error.message || "Error updating menu item");
  }
}

// ✅ DELETE: Delete menu item
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) return errorResponse("Missing menu item ID", 400);

    await db.collection("menuItems").doc(id).delete();

    return successResponse({ message: "Menu item deleted" });
  } catch (error: any) {
    return errorResponse(error.message || "Error deleting menu item");
  }
}
