import Image from 'next/image'
import Link from 'next/link'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import { client } from '../../contentfulClient'
import Layout from '../../components/layout'

export async function getStaticPaths() {
  let data = await client.getEntries({
    content_type: 'post',
  })
  return {
    paths: data.items.map((item) => ({
      params: {
        slug: item.fields.slug,
      },
    })),
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  let data = await client.getEntries({
    content_type: 'post',
    'fields.slug': params.slug,
  })
  return {
    props: { post: data.items[0] },
  }
}

export default function Post({ post }) {
  const { title, content } = post.fields
  return (
    <Layout>
      <h1>{title}</h1>
      <div>
        {documentToReactComponents(content, {
          renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: (node) => {
              const {
                details: {
                  image: { width, height },
                },
                url,
              } = node.data.target.fields.file
              return (
                <Image src={`https:${url}`} width={width} height={height} />
              )
            },
          },
        })}
      </div>
      <Link href="/">
        <a>Back</a>
      </Link>
    </Layout>
  )
}
