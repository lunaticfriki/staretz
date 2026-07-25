import '@preact/signals'

import { Router } from 'preact-router'
import { AboutPage } from './modules/about/presentation/AboutPage.component'
import { CategoryPageContainer } from './modules/blog/presentation/containers/CategoryPage.container'
import { HomeContainer } from './modules/blog/presentation/containers/Home.container'
import { PostPageContainer } from './modules/blog/presentation/containers/PostPage.container'
import { DASHBOARD_ACCESS_POLICY } from './modules/dashboard/dashboardPolicy'
import { EditPostContainer } from './modules/dashboard/presentation/containers/EditPost.container'
import { NewPostContainer } from './modules/dashboard/presentation/containers/NewPost.container'
import { PostsListContainer } from './modules/dashboard/presentation/containers/PostsList.container'
import { Layout } from './shared/presentation/Layout.component'
import { LoginPage } from './shared/presentation/LoginPage.component'
import { NotFoundPage } from './shared/presentation/NotFoundPage.component'
import { RequirePolicy } from './shared/presentation/RequirePolicy.component'
import { SplashScreen } from './shared/presentation/SplashScreen.component'

export function App() {
  return (
    <>
      <SplashScreen />
      <Layout>
        <Router>
          <HomeContainer path="/" />
          <AboutPage path="/about" />
          <PostPageContainer path="/blog/:slug" />
          <CategoryPageContainer path="/category/:term" />
          <LoginPage path="/login" />
          <RequirePolicy path="/dashboard" policy={DASHBOARD_ACCESS_POLICY} component={PostsListContainer} />
          <RequirePolicy path="/dashboard/new" policy={DASHBOARD_ACCESS_POLICY} component={NewPostContainer} />
          <RequirePolicy
            path="/dashboard/edit/:slug"
            policy={DASHBOARD_ACCESS_POLICY}
            component={EditPostContainer}
          />
          <NotFoundPage default />
        </Router>
      </Layout>
    </>
  )
}
