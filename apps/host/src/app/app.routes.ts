import { Route } from '@angular/router';
import { HomeComponent } from './infrastructure/ui/pages/home/home.component';
import { AboutComponent } from './infrastructure/ui/pages/about/about.component';
import { BlogPlaceholderComponent } from './infrastructure/ui/pages/blog-placeholder/blog-placeholder.component';
import { DatabasePlaceholderComponent } from './infrastructure/ui/pages/database-placeholder/database-placeholder.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'blog',
    component: BlogPlaceholderComponent,
    // TODO: Replace with Module Federation remote when blog microfrontend is created
    // loadChildren: () => loadRemoteModule('blog', './Module').then(m => m.BlogModule)
  },
  {
    path: 'database',
    component: DatabasePlaceholderComponent,
    // TODO: Replace with Module Federation remote when database microfrontend is created
    // loadChildren: () => loadRemoteModule('database', './Module').then(m => m.DatabaseModule)
  },
  {
    path: '**',
    redirectTo: '',
  },
];
