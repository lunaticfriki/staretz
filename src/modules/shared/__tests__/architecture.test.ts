import { describe, it, expect } from 'vitest';
import { filesOfProject } from 'tsarch';
// @ts-expect-error: implicit any on path module
import path from 'path';

describe('Shared Module Architecture', () => {
  it('domain should not depend on infrastructure', async () => {
    const project = filesOfProject(path.resolve('tsconfig.app.json'));

    const rule = project
      .inFolder('src/modules/shared/domain')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/modules/shared/infrastructure');

    const violations = await rule.check();
    expect(violations).toEqual([]);
  });

  it('domain should not depend on ui', async () => {
    const project = filesOfProject(path.resolve('tsconfig.app.json'));

    const rule = project
      .inFolder('src/modules/shared/domain')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/ui');

    const violations = await rule.check();
    expect(violations).toEqual([]);
  });
});
