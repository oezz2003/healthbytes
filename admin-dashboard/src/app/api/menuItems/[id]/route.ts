import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/firebase/adminApi';

// Helper response functions
const successResponse = (data?: any, status = 200) =>
  NextResponse.json({ success: true, data }, { status });

const errorResponse = (message: string, status = 500) =>
  NextResponse.json({ success: false, error: message }, { status });

// GET: Get a specific menu item by ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    if (!id) {
      return errorResponse("Menu item ID is required", 400);
    }

    const docRef = await db.collection("menuItems").doc(id).get();
    
    if (!docRef.exists) {
      return errorResponse("Menu item not found", 404);
    }

    const menuItem = {
      id: docRef.id,
      ...docRef.data()
    };

    return successResponse(menuItem);
  } catch (error: any) {
    console.error("Error fetching menu item:", error);
    return errorResponse(error.message || "Error fetching menu item");
  }
}

// PATCH: Update a specific menu item
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    
    if (!id) {
      return errorResponse("Menu item ID is required", 400);
    }

    const docRef = db.collection("menuItems").doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return errorResponse("Menu item not found", 404);
    }

    // Update with new data
    await docRef.update({
      ...body,
      updatedAt: Date.now()
    });

    // Get the updated document
    const updatedDoc = await docRef.get();
    const updatedMenuItem = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };

    return successResponse(updatedMenuItem);
  } catch (error: any) {
    console.error("Error updating menu item:", error);
    return errorResponse(error.message || "Error updating menu item");
  }
}

// DELETE: Delete a specific menu item
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    if (!id) {
      return errorResponse("Menu item ID is required", 400);
    }

    const docRef = db.collection("menuItems").doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return errorResponse("Menu item not found", 404);
    }

    await docRef.delete();

    return successResponse({ message: "Menu item deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting menu item:", error);
    return errorResponse(error.message || "Error deleting menu item");
  }
} 