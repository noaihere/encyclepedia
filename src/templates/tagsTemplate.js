import React from 'react'
import { Link } from 'gatsby'
import get from 'lodash/get'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'

import Bio from '../components/Bio'
import Layout from '../components/layout'
import { rhythm } from '../utils/typography'

class TagIndex extends React.Component {
  render() {
    const siteTitle = get(
      this,
      'props.data.cosmicjsSettings.metadata.site_title'
    )
    const posts = get(this, 'props.data.allCosmicjsPosts.edges')
    const author = get(this, 'props.data.cosmicjsSettings.metadata')
    const location = get(this, 'props.location')
    const tag =  get(this, 'props.data.allCosmicjsPosts.edges[0].node.metadata.category')
    return (
      <Layout location={location}>
        <Helmet title={siteTitle} />
        <Bio settings={author} />
        <p>Displaying category {tag}</p>
        {posts.map(({ node }) => {
          const title = get(node, 'title') || node.slug
          return (
            <div key={node.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: 'none' }} to={`posts/${node.slug}`}>
                  {title}
                </Link>
              </h3>
              <small>{node.created}</small>
              <p
                dangerouslySetInnerHTML={{ __html: node.metadata.description }}
              />
            </div>
          )
        })}
        <div
          style={{
            marginTop: rhythm(1.4),
          }}
        >
          <Link to="/">← Back to Posts</Link>
        </div>
      </Layout>
    )
  }
}
export default TagIndex;
export const pageQuery = graphql`
  query TagQuery($tag: String!) {
    allCosmicjsPosts(filter: {metadata: { category: { in: [$tag] } }}, sort: { fields: [created], order: DESC }, limit: 1000) {
      edges {
        node {
          metadata {
            description
            category
          }
          slug
          title
          created(formatString: "DD MMMM, YYYY")
        }
      }
    }
    cosmicjsSettings(slug: { eq: "general" }) {
      metadata {
        site_title
        author_name
        author_bio
        author_avatar {
          imgix_url
        }
      }
    }
  }
`
