import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'blog',
  exposes: {
    './Module': './src/remote-entry.ts',
  },
  shared: (libraryName, defaultConfig) => {
    if (libraryName === 'inversify') {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: true,
        requiredVersion: '^7.10.4',
      };
    }
    if (libraryName === 'reflect-metadata') {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: true,
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
