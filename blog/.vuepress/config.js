module.exports = {
  title: 'Nono',
  description: '前端工程師的紀錄',
  theme: require.resolve('../..'),
  head: [
    ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicons/favicon-32x32.png"}],
  ],
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        'ga': 'UA-153067224-1'
      }
    ],
    [
      'disqus'
    ]
  ],
  themeConfig: {
    nav: [
      {
        text: '文章列表',
        link: '/',
      },
      {
        text: 'Tags',
        link: '/tag/',
      },
    ],
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/nono1526'
        }
      ]
    }
  }
}