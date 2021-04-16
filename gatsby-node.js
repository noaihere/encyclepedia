const each = require('lodash/each')
const Promise = require('bluebird')
const path = require('path')
const _ = require('lodash');

exports.createPages = ({ graphql, actions }) => {
  const tagTemplate = path.resolve('./src/templates/tagsTemplate.js')  
  const { createPage } = actions
  const indexPage = path.resolve('./src/pages/index.js')
  createPage({
    path: `posts`,
    component: indexPage,
  })

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    resolve(
      graphql(
        `
          {
            allCosmicjsPosts(sort: { fields: [created], order: DESC }, limit: 1000) {
              edges {
                node {
                  slug,
                  title,
                 metadata {
                 category
                 }				  
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create blog posts pages.
        const posts = result.data.allCosmicjsPosts.edges;

        each(posts, (post, index) => {
          const next = index === posts.length - 1 ? null : posts[index + 1].node;
          const previous = index === 0 ? null : posts[index - 1].node;

          createPage({
            path: `posts/${post.node.slug}`,
            component: blogPost,
            context: {
              slug: post.node.slug,
              previous,
              next,
            },
          })
        })
        let tags = [];
        // Iterate through each post, putting all found tags into `tags`
        _.each(posts, edge => {
          if (_.get(edge, 'node.metadata.category')) {
           tags = tags.concat(edge.node.metadata.category);
          }
        });
        // Eliminate duplicate tags
        tags = _.uniq(tags);
        // Make tag pages
        tags.forEach(tag => {
          createPage({
        path: `tags/${tag}/`,
        component: tagTemplate,  
           context: {
                  tag,
                  }    
         });        
        })		
      })
    )
  })
}
