import { NextRequest, NextResponse } from "next/server";
import { db, storage, firebaseAdmin } from '@/lib/firebase/adminApi';

// ✅ Helper response functions
const successResponse = (data?: any, status = 200) =>
  NextResponse.json({ success: true, data }, { status });

const errorResponse = (message: string, status = 500) =>
  NextResponse.json({ success: false, error: message }, { status });

// ✅ GET: Get all inventory items
export async function GET(req: NextRequest) {
  try {
    const snapshot = await db.collection("inventory").get();
    const inventoryItems = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return successResponse(inventoryItems);
  } catch (error: any) {
    return errorResponse(error.message || "Error fetching inventory items");
  }
}

// ✅ POST: Create a new inventory item
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      quantity,
      unit,
      supplier,
      location,
      threshold = 5,
      createdAt = Date.now(),
    } = body;

    if (!name || quantity === undefined || !unit) {
      return errorResponse("Missing required fields: name, quantity, unit", 400);
    }

    const docRef = await db.collection("inventory").add({
      name,
      quantity,
      unit,
      supplier,
      location,
      threshold,
      createdAt,
    });

    return successResponse({ id: docRef.id });
  } catch (error: any) {
    return errorResponse(error.message || "Error creating inventory item");
  }
}

// ✅ PUT: Update existing inventory item
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) return errorResponse("Missing inventory item ID", 400);

    const docRef = db.collection("inventory").doc(id);
    await docRef.update({ ...updates });

    // Return the updated data along with success message
    return successResponse({ 
      message: "Inventory item updated",
      id,
      ...updates
    });
  } catch (error: any) {
    return errorResponse(error.message || "Error updating inventory item");
  }
}

// ✅ DELETE: Delete inventory item
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) return errorResponse("Missing inventory item ID", 400);

    await db.collection("inventory").doc(id).delete();

    return successResponse({ message: "Inventory item deleted" });
  } catch (error: any) {
    return errorResponse(error.message || "Error deleting inventory item");
  }
}
