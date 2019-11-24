const path = require('path');
const glob = require('glob');

module.exports = {
  webpack: config => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      components: path.resolve(__dirname, 'src/components'),
      data: path.resolve(__dirname, 'src/data'),
      pages: path.resolve(__dirname, 'src/pages'),
      public: path.resolve(__dirname, 'src/public'),
      posts: path.resolve(__dirname, 'source/_posts'),
    };

    return config;
  },
  exportPathMap: async () => {
    const routes = {
      '/': { page: '/' },
      '/info': { page: '/info' },
    };
    // get all .md files in the posts dir
    const blogs = glob.sync('source/_posts/*.md');

    // remove path and extension to leave filename only
    const fileNames = blogs.map(file =>
      file
        .split('/')[2]
        .replace(/ /g, '-')
        .slice(0, -3)
        .trim(),
    );

    // add each blog to the routes obj
    fileNames.forEach(fileName => {
      const year = fileName.substr(0, 4);
      const month = fileName.substr(4, 2);
      const day = fileName.substr(6, 2);
      const slug = fileName.substr(8);
      routes[`/${year}/${month}/${day}/${slug}`] = {
        page: '/[year]/[month]/[day]/[slug]',
        query: {
          year,
          month,
          day,
          slug,
        },
      };
    });

    return routes;
  },
};
