import db from "../../../db";
import { advocates } from "../../../db/schema";
import { NextRequest } from "next/server";
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const limitParam = params.get("limit");
  const rows = await db.select().from(advocates);

  const data = rows.slice(0, parseInt(limitParam ?? "10"));

  return Response.json({ data });
}
