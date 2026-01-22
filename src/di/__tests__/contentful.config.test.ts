import { describe, it, expect } from 'vitest';
import { container } from '../container';
import { TYPES } from '../types';
import type { ContentfulConfig } from '../../modules/blog/domain/ports/contentful.config';

describe('Contentful Configuration DI', () => {
  it('should resolve ContentfulConfig from container', () => {
    const config = container.get<ContentfulConfig>(TYPES.ContentfulConfig);
    expect(config).toBeDefined();
    // These might be empty if not set in .env.test, but it proves injection works
    expect(config.spaceId).toBeDefined();
    expect(config.accessToken).toBeDefined();
  });
});
