import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const baseUrl = `${url.protocol}//${url.host}`;

  return NextResponse.redirect(`${baseUrl}/dashboard/payment/fail`, 303);
}
