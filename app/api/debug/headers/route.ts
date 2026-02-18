import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const h = await headers()
  const all = Object.fromEntries(h.entries())
  return NextResponse.json(all)
}
