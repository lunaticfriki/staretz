module.exports = {
  default: {
    paths: ['e2e/features/**/*.feature'],
    import: ['e2e/support/**/*.ts', 'e2e/step-definitions/**/*.ts'],
    format: ['progress-bar', 'html:e2e/reports/cucumber-report.html'],
    publishQuiet: true,
  },
}
