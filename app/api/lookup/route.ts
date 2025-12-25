import { NextRequest, NextResponse } from 'next/server';
import { lookupIP } from '@/lib/ip-lookup';
import { IPLookupResponse } from '@/types/ip-info';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || undefined;
    
    const data = await lookupIP(query);
    
    const response: IPLookupResponse = {
      success: true,
      data,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const response: IPLookupResponse = {
      success: false,
      error: error instanceof Error ? error.message : '查询失败',
    };
    
    return NextResponse.json(response, { status: 400 });
  }
}
