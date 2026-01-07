import { Router, Route } from 'preact-router';
import { lazy } from 'preact/compat';
import { LazyLoad } from '../ui/lazy-load.component';
import { HomePage } from '../ui/home.component';

const BlogPage = lazy(() => import('../modules/blog/presentation/blog.page'));
const MusicPage = lazy(() => import('../modules/music/music.page'));
const ProgrammingPage = lazy(() => import('../modules/programming/programming.page'));
const AboutPage = lazy(() => import('../modules/about/about.page'));

export function AppRoutes() {
  return (
    <Router>
      <Route path="/" component={() => <LazyLoad component={<HomePage />} />} />
      <Route path="/about" component={() => <LazyLoad component={<AboutPage />} />} />
      <Route path="/blog" component={() => <LazyLoad component={<BlogPage />} />} />
      <Route path="/music" component={() => <LazyLoad component={<MusicPage />} />} />
      <Route path="/programming" component={() => <LazyLoad component={<ProgrammingPage />} />} />
    </Router>
  );
}
