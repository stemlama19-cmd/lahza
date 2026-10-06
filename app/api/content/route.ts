import {contentPayload} from '@/lib/content-library';
export async function GET(request:Request){const review=new URL(request.url).searchParams.get('review')==='1';return Response.json(contentPayload(review),{headers:{'Cache-Control':'no-store'}});}
