const DOMAIN = '^src/(modules/[^/]+|shared/[^/]+)/domain(/|$)'
const APPLICATION = '^src/(modules/[^/]+|shared/[^/]+)/application(/|$)'
const INFRASTRUCTURE = '^src/(modules/[^/]+|shared/[^/]+)/infrastructure(/|$)'
const PRESENTATION = '^src/(modules/[^/]+/presentation|shared/presentation|shared/[^/]+/presentation)(/|$)'

module.exports = {
  forbidden: [
    {
      name: 'domain-no-outward-deps',
      comment: 'Domain must not depend on application, infrastructure, or presentation — see docs/02-hexagonal-architecture.md',
      severity: 'error',
      from: { path: DOMAIN },
      to: { path: `${APPLICATION}|${INFRASTRUCTURE}|${PRESENTATION}` },
    },
    {
      name: 'application-only-depends-on-domain',
      comment: 'Application must only depend on domain, never infrastructure or presentation — see docs/02-hexagonal-architecture.md',
      severity: 'error',
      from: { path: APPLICATION },
      to: { path: `${INFRASTRUCTURE}|${PRESENTATION}` },
    },
    {
      name: 'infrastructure-no-presentation',
      comment: 'Infrastructure must not depend on presentation — see docs/02-hexagonal-architecture.md',
      severity: 'error',
      from: { path: INFRASTRUCTURE },
      to: { path: PRESENTATION },
    },
    {
      name: 'presentation-no-infrastructure',
      comment: 'Presentation must not import infrastructure directly — wire concrete adapters through the composition root instead — see docs/02-hexagonal-architecture.md',
      severity: 'error',
      from: { path: PRESENTATION },
      to: { path: INFRASTRUCTURE },
    },
  ],
  options: {
    // Test code (integration tests wiring a real repository, Object Mothers
    // crossing a domain __tests__/ boundary, ...) is exempt from the
    // production import-boundary rules above — see
    // docs/07-testing-strategy.md#object-mothers-once-more.
    exclude: { path: '(^|/)__tests__/' },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.app.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
  },
}
