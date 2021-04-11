export const client = require('contentful').createClient({
  space: process.env.NEXT_CONTENTFUL_SPACE,
  accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN,
})
