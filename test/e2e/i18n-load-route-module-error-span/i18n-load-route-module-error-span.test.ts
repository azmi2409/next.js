import { nextTestSetup } from 'e2e-utils'

describe('i18n load route module error span', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    dependencies: require('./package.json').dependencies,
    // Spans are collected in the server process's memory and read back via
    // an API route, which only works when pages and API routes share one
    // self-hosted server process.
    skipDeployment: true,
  })

  it('should not record ERROR load route module spans for successful i18n requests', async () => {
    const home = await next.render('/')
    expect(home).toContain('Home')

    // A normal page requested under a non-default locale: the
    // locale-prefixed manifest candidate (`/sk/about`) does not exist, so
    // resolving it must not surface as an ERROR span.
    const about = await next.render('/sk/about')
    expect(about).toContain('About')

    // NOTE: the fixture pages use getServerSideProps on purpose, so page
    // components resolve on every request. Fully static pages would be
    // served from the prerender cache and never exercise
    // findPageComponents at request time.
    // NOTE: a page that only exists under a locale prefix (e.g.
    // `pages/sk/only-sk.js`) is NOT covered here: it 404s on stock canary
    // too (verified against the unfixed build), so it is out of scope for
    // this regression test.

    const res = await next.fetch('/api/spans')
    const spans = await res.json()
    const loadRouteModuleSpans = spans.filter(
      (span) => span.name === 'load route module'
    )
    // Guard against a vacuous pass: spans must actually be captured.
    expect(loadRouteModuleSpans.length).toBeGreaterThan(0)
    const errorSpans = loadRouteModuleSpans.filter((span) => span.status === 2)
    expect(errorSpans).toEqual([])
  })
})
