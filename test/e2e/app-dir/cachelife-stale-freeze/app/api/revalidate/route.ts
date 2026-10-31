import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get('tag') ?? ''
  revalidateTag(tag, 'max')
  return Response.json({ tag })
}
