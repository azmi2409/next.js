import { nextTestSetup } from 'e2e-utils'

describe('cachelife-stale-freeze', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  async function getValue(path: string): Promise<string> {
    const res = await next.fetch(path)
    const html = await res.text()
    const match = html.match(/data-v="([^"]+)"/)
    expect(match).not.toBeNull()
    return match![1]
  }

  it('should refresh a use cache value with stale < 30 and expire >= 300 after revalidateTag', async () => {
    const v1 = await getValue('/frozen')
    // The value is cached across requests (not recomputed every time).
    expect(await getValue('/frozen')).toBe(v1)

    await next.fetch('/api/revalidate?tag=frozen', { method: 'POST' })
    // The first request after revalidateTag starts the refresh.
    await getValue('/frozen')
    const v2 = await getValue('/frozen')
    expect(v2).not.toBe(v1)
  })
})
