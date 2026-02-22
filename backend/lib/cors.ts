import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "http://localhost:8080",
  "http://localhost:3000",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:3000",
];

export function corsHeaders(request: NextRequest) {
  const origin = request.headers.get("origin");
  const isAllowed = ALLOWED_ORIGINS.includes(origin || "");

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "http://localhost:8080",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export function handleCors(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders(request),
    });
  }
}
