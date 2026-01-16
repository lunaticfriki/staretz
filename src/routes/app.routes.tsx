import { Router, Route } from 'preact-router';
import { lazy } from 'preact/compat';
import { LazyLoad } from '../ui/lazy-load.component';
import { HomePage } from '../ui/home.component';

const BlogPage = lazy(() => import('../modules/blog/presentation/blog.page'));
const PostDetailPage = lazy(() => import('../modules/blog/presentation/postDetail.page'));
const TagPage = lazy(() => import('../modules/blog/presentation/tag.page'));
const TopicPage = lazy(() => import('../modules/blog/presentation/topic.page'));
const TagsPage = lazy(() => import('../modules/blog/presentation/tags.page'));
const TopicsPage = lazy(() => import('../modules/blog/presentation/topics.page'));
const AboutPage = lazy(() => import('../modules/about/about.page'));

export function AppRoutes() {
  return (
    <Router>
      <Route path="/" component={() => <LazyLoad component={<HomePage />} />} />
      <Route path="/about" component={() => <LazyLoad component={<AboutPage />} />} />
      <Route path="/blog" component={() => <LazyLoad component={<BlogPage />} />} />
      <Route
        path="/blog/:id"
        component={(props: { id: string }) => (
          <LazyLoad component={<PostDetailPage id={props.id} />} />
        )}
      />
      <Route path="/blog/tags" component={() => <LazyLoad component={<TagsPage />} />} />
      <Route
        path="/blog/tags/:tag"
        component={(props: { tag: string }) => <LazyLoad component={<TagPage tag={props.tag} />} />}
      />
      <Route path="/blog/topics" component={() => <LazyLoad component={<TopicsPage />} />} />
      <Route
        path="/blog/topics/:topic"
        component={(props: { topic: string }) => (
          <LazyLoad component={<TopicPage topic={props.topic} />} />
        )}
      />
    </Router>
  );
}
