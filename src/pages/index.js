import React from 'react'
import { Link } from 'gatsby'
import get from 'lodash/get'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
const _ = require('lodash');

import Bio from '../components/Bio'
import Layout from '../components/layout'
import Tags from '../components/layout'
import { rhythm } from '../utils/typography'

class BlogIndex extends React.Component {
  render() {
    const siteTitle = get(
      this,
      'props.data.cosmicjsSettings.metadata.site_title'
    )
    const posts = get(this, 'props.data.allCosmicjsPosts.edges')
    const author = get(this, 'props.data.cosmicjsSettings.metadata')
    const location = get(this, 'props.location')

    let tags = [];
     // Iterate through each post, putting all found category into `tags`
    _.each(posts, edge => {
      if (_.get(edge, 'node.metadata.category')) {
         tags = tags.concat([edge.node.metadata.category]);
          }
    });
    // Eliminate duplicate tags
    tags = _.uniq(tags);    
    
    return (
      <Layout location={location}>
        <Helmet title={siteTitle} />
        <Bio settings={author} />
        <p>pick a topic </p>
        {tags.map((cat) => (
            <ul style={{ marginBottom: 0, marginLeft: 0, display: "inline-block" }}>
            <li 
            key={cat} style = {{ listStyle: "none"}}>
            <Link style = {{
            borderRadius: `4px`,
            border: `1px solid grey`,
            padding: `2px 6px`,
            marginRight: `5px`,
            fontSize: `80%`,
            backgroundColor: "#000000",
            color: "white",
            listStyle: "none"
            }} 
          to={`/tags/${cat}/`}>
          {cat}
          </Link>
          </li></ul>
          ))}
        <p>or read a post below </p>  
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
            <ul style={{ marginBottom: 0, marginLeft: 0, display: "inline-flex" }}>
            <li 
            key={node.metadata.category} style = {{ listStyle: "none"}}>
            <Link style = {{
            borderRadius: `4px`,
            border: `1px solid grey`,
            padding: `2px 6px`,
            marginRight: `5px`,
            fontSize: `80%`,
            backgroundColor: "#000000",
            color: "white",
            listStyle: "none"
            }} 
            to={`/tags/${node.metadata.category}/`}>
            {node.metadata.category}
            </Link>
            </li></ul>
            </div>
          )
        })}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query IndexQuery {
    allCosmicjsPosts(sort: { fields: [created], order: DESC }, limit: 1000) {
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
