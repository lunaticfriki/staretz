import { describe, it, expect } from 'vitest';
import { filesOfProject } from 'tsarch';

import path from 'path';

describe('Blog Module Architecture', () => {
  const project = filesOfProject(path.resolve('tsconfig.app.json'));

  it('domain should not depend on infrastructure', async () => {
    const rule = project
      .inFolder('src/modules/blog/domain')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/modules/blog/infrastructure');

    const violations = await rule.check();
    expect(violations).toEqual([]);
  });

  it('application should not depend on infrastructure', async () => {
    const rule = project
      .inFolder('src/modules/blog/application')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/modules/blog/infrastructure');

    const violations = await rule.check();
    expect(violations).toEqual([]);
  });

  it('domain should not depend on application', async () => {
    const rule = project
      .inFolder('src/modules/blog/domain')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/modules/blog/application');

    const violations = await rule.check();
    expect(violations).toEqual([]);
  });
});
