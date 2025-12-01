import { setRemoteDefinitions } from '@nx/angular/mf';

setRemoteDefinitions({
  blog: 'http://localhost:4201/remoteEntry.js',
});

import('./bootstrap').catch((err) => console.error(err));
