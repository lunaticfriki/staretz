import Link from 'next/link'
import Layout from '../components/layout'
import { client } from '../contentfulClient'

export async function getStaticProps() {
  let data = await client.getEntries({
    content_type: 'post',
  })

  return {
    props: {
      posts: data.items,
    },
  }
}

export default function Home({ posts }) {
  return (
    <Layout>
      <h1>Staretz</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.sys.id}>
            <Link href={`/posts/${post.fields.slug}`}>
              <a>{post.fields.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
