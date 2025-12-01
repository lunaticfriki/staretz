import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'host',
  /**
   * To use a remote that does not exist in your current Nx Workspace
   * You can use the tuple-syntax to define your remote
   *
   * remotes: [['my-external-remote', 'https://nx-angular-remote.netlify.app']]
   *
   * You _may_ need to add a `remotes.d.ts` file to your `src/` folder declaring the external remote for tsc, with the
   * following content:
   *
   * declare module 'my-external-remote';
   *
   */
  remotes: ['blog'],
  shared: (libraryName, defaultConfig) => {
    if (libraryName === 'inversify') {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: true,
        version: '7.10.4',
        requiredVersion: '^7.10.4',
      };
    }
    if (libraryName === 'reflect-metadata') {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: true,
        version: '0.2.2',
        requiredVersion: '^0.2.2',
      };
    }
    return defaultConfig;
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
