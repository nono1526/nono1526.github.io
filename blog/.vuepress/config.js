module.exports = {
  title: 'Nono\'s Blog',
  description: '前端工程師的紀錄',
  theme: '@vuepress/blog',
  themeConfig: {
    nav: [
      {
        text: '首頁',
        link: '/',
      },
      {
        text: '文章列表',
        link: '/archive/',
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