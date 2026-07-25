import '@preact/signals'

import { Router } from 'preact-router'
import { AboutPage } from './modules/about/presentation/AboutPage.component'
import { HomeContainer } from './modules/blog/presentation/containers/Home.container'
import { PostPageContainer } from './modules/blog/presentation/containers/PostPage.container'
import { Layout } from './shared/presentation/Layout.component'
import { NotFoundPage } from './shared/presentation/NotFoundPage.component'
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
          <NotFoundPage default />
        </Router>
      </Layout>
    </>
  )
}
