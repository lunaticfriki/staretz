import { injectable } from 'inversify';
import type { ContentfulConfig } from '../../domain/ports/contentful.config';

@injectable()
export class EnvContentfulConfig implements ContentfulConfig {
  public get spaceId(): string {
    return import.meta.env.VITE_CONTENTFUL_SPACE_ID || '';
  }

  public get accessToken(): string {
    return import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || '';
  }
}
