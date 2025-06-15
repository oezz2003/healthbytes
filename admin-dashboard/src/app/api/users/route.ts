import { NextRequest, NextResponse } from "next/server";
import { db, storage, firebaseAdmin }from '@/lib/firebase/adminApi';


// ✅ Helper response functions
const successResponse = (data?: any, status = 200) =>
  NextResponse.json({ success: true, data }, { status });

const errorResponse = (message: string, status = 500) =>
  NextResponse.json({ success: false, error: message }, { status });

// ✅ GET: Get all users
export async function GET(req: NextRequest) {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return successResponse(users);
  } catch (error: any) {
    return errorResponse(error.message || "Error fetching users");
  }
}

// ✅ POST: Create a new user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, age, type = "Customer", createdAt = Date.now() } = body;

    if (!name || !email || !age) {
      return errorResponse("Missing required fields: name, email, age", 400);
    }

    const docRef = await db.collection("users").add({
      name,
      email,
      age,
      type,
      createdAt,
    });

    return successResponse({ id: docRef.id });
  } catch (error: any) {
    return errorResponse(error.message || "Error creating user");
  }
}

// ✅ PUT: Update existing user
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) return errorResponse("Missing user ID", 400);

    const docRef = db.collection("users").doc(id);
    await docRef.update({ ...updates });

    return successResponse({ message: "User updated" });
  } catch (error: any) {
    return errorResponse(error.message || "Error updating user");
  }
}

// ✅ DELETE: Delete user
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) return errorResponse("Missing user ID", 400);

    await db.collection("users").doc(id).delete();

    return successResponse({ message: "User deleted" });
  } catch (error: any) {
    return errorResponse(error.message || "Error deleting user");
  }
}
