export const site = {
  name: 'Kosa Tomoro',
  title: 'Kosa Tomoro · 记录与思考',
  description: '记录技术实践、阅读与生活。在这里，让想法慢慢长成文字。',
  intro: '这里收集技术实践中的发现，也留下一些关于阅读、生活和自己的思考。写下来，让走过的路有迹可循。',
  motto: 'Read, reflect and contemplate.',
  url: 'https://kosatomoro.github.io',
  avatar: '/images/avatar.jpg',
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  github: 'https://github.com/KosaTomoro',
  rss: '/rss.xml',
} as const;

export const projects = [
  {
    name: 'fku-raft-kv',
    label: '分布式存储',
    description: '分布式 kv 存储器，基于 Raft 实现。',
    language: 'Go',
    url: 'https://github.com/KosaTomoro/fku-raft-kv',
  },
  {
    name: 'fku-balancer',
    label: '网络与基础设施',
    description: '一个负载均衡器，支持多种负载均衡算法。',
    language: 'Go',
    url: 'https://github.com/KosaTomoro/fku-balancer',
  },
];
