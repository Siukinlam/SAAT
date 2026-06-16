// ============================================================
// SAAT 测评题库 — 20题
// 每题测试主要维度，附带影响其他维度
// effects: [d1, d2, d3, d4], 范围 -1~1
// ============================================================

import type { Question } from './types';

export const QUESTIONS: Question[] = [
  // ===== 维度1: 学习节奏 (S/D) — 题1-5 =====
  {
    id: 1,
    text: '老师布置了一篇两周后交的论文，你更可能怎么做？',
    primaryDimension: 1,
    options: [
      {
        text: '列出计划，每天写一点，提前完成',
        effects: [-1, 0, 0, 0], // → S 稳步
      },
      {
        text: '前面积累素材，最后三天集中爆发完成',
        effects: [1, 0, 0.3, 0], // → D 灵动 + 微实践
      },
    ],
  },
  {
    id: 2,
    text: '复习备考时，你更喜欢哪种方式？',
    primaryDimension: 1,
    options: [
      {
        text: '按章节顺序，系统性地逐一复习',
        effects: [-1, -0.3, 0, 0], // → S + 微理性
      },
      {
        text: '从最难的或最感兴趣的章节开始，不按顺序',
        effects: [1, 0, 0, -0.3], // → D + 微内驱
      },
    ],
  },
  {
    id: 3,
    text: '面对一个新的学习任务，你的第一反应是？',
    primaryDimension: 1,
    options: [
      {
        text: '先了解整体框架，再逐步深入',
        effects: [-1, -0.2, -0.3, 0], // → S + 微理性 + 微理论
      },
      {
        text: '直接上手试试，边做边学',
        effects: [1, 0, 0.5, 0], // → D + 实践
      },
    ],
  },
  {
    id: 4,
    text: '如果明天有一场重要考试，今晚你会？',
    primaryDimension: 1,
    options: [
      {
        text: '按部就班复习重点，保证充足睡眠',
        effects: [-1, -0.3, 0, 0], // → S
      },
      {
        text: '通宵突击，把所有可能考的都过一遍',
        effects: [1, 0, 0, 0.3], // → D + 微外驱
      },
    ],
  },
  {
    id: 5,
    text: '你更喜欢哪种学习环境？',
    primaryDimension: 1,
    options: [
      {
        text: '固定的时间、固定的地点，形成规律',
        effects: [-1, 0, 0, 0],
      },
      {
        text: '随时随地去不同地方学，换换环境更有灵感',
        effects: [1, 0.3, 0, 0], // → D + 微创造
      },
    ],
  },

  // ===== 维度2: 思维通道 (R/C) — 题6-10 =====
  {
    id: 6,
    text: '解一道数学题时，你更倾向于？',
    primaryDimension: 2,
    options: [
      {
        text: '严格按照公式和步骤推导',
        effects: [0, -1, -0.2, 0], // → R + 微理论
      },
      {
        text: '凭直觉猜测答案方向，再验证',
        effects: [0, 1, 0, 0], // → C
      },
    ],
  },
  {
    id: 7,
    text: '读完一本书后，你更可能？',
    primaryDimension: 2,
    options: [
      {
        text: '梳理书中的逻辑结构和关键论点',
        effects: [0, -1, -0.3, 0], // → R + 理论
      },
      {
        text: '被书中的某个画面或情感深深打动',
        effects: [0, 1, 0, 0], // → C
      },
    ],
  },
  {
    id: 8,
    text: '课堂讨论时，你通常？',
    primaryDimension: 2,
    options: [
      {
        text: '用事实和数据支撑你的观点',
        effects: [0, -1, 0, -0.2], // → R
      },
      {
        text: '用比喻和故事来表达你的想法',
        effects: [0, 1, 0, 0], // → C
      },
    ],
  },
  {
    id: 9,
    text: '看到一道不会的题，你的第一反应是？',
    primaryDimension: 2,
    options: [
      {
        text: '拆解题干，分析已知条件，逐步推理',
        effects: [0.2, -1, 0, 0], // → R + 微稳步
      },
      {
        text: '尝试联想以前做过的类似题目，凭感觉试试',
        effects: [0, 1, 0.3, 0], // → C + 微实践
      },
    ],
  },
  {
    id: 10,
    text: '你更欣赏哪种老师？',
    primaryDimension: 2,
    options: [
      {
        text: '逻辑清晰、条理分明、推导严谨的老师',
        effects: [0, -1, -0.2, 0],
      },
      {
        text: '激情澎湃、善于用故事和例子启发学生的老师',
        effects: [0, 1, 0, 0.2],
      },
    ],
  },

  // ===== 维度3: 知识偏好 (T/P) — 题11-15 =====
  {
    id: 11,
    text: '学习一个新概念时，你最关心的是？',
    primaryDimension: 3,
    options: [
      {
        text: '这个概念背后的原理和推导过程',
        effects: [0, -0.2, -1, 0], // → T + 微理性
      },
      {
        text: '这个概念在实际中有什么用、怎么用',
        effects: [0, 0, 1, 0.2], // → P + 微外驱
      },
    ],
  },
  {
    id: 12,
    text: '物理课上做一个实验，你更感兴趣的是？',
    primaryDimension: 3,
    options: [
      {
        text: '实验验证了什么物理定律、为什么',
        effects: [0, -0.3, -1, 0], // → T
      },
      {
        text: '亲手操作仪器、观察实验现象本身',
        effects: [0, 0, 1, 0], // → P
      },
    ],
  },
  {
    id: 13,
    text: '周末有一天自由时间，你会？',
    primaryDimension: 3,
    options: [
      {
        text: '读一本能引发深度思考的书或看纪录片',
        effects: [0, 0, -1, -0.3], // → T + 微内驱
      },
      {
        text: '动手做点什么——烘焙、手工、写代码、运动',
        effects: [0.3, 0, 1, 0], // → P + 微灵动
      },
    ],
  },
  {
    id: 14,
    text: '你对"成绩排名"的看法是？',
    primaryDimension: 3,
    options: [
      {
        text: '排名只是数字，我更在意自己是否真的理解了',
        effects: [0, -0.2, -0.3, -1], // → 偏理论 + 内驱
      },
      {
        text: '排名让我知道自己在什么位置，有目标感',
        effects: [0, 0, 0, 1], // → 外驱(此题主要测d4)
      },
    ],
  },
  {
    id: 15,
    text: '如果让你选一个课外项目，你会选？',
    primaryDimension: 3,
    options: [
      {
        text: '研究一个你好奇的科学/社会问题并写报告',
        effects: [0, -0.3, -1, -0.2], // → T
      },
      {
        text: '做一个能实际用起来的作品（App/模型/手作）',
        effects: [0.2, 0.2, 1, 0], // → P
      },
    ],
  },

  // ===== 维度4: 动力来源 (I/E) — 题16-20 =====
  {
    id: 16,
    text: '什么最能激励你努力学习？',
    primaryDimension: 4,
    options: [
      {
        text: '解决难题后的成就感和自我提升',
        effects: [0, 0, -0.2, -1], // → I
      },
      {
        text: '获得好成绩、奖学金或家长老师的认可',
        effects: [0, 0, 0, 1], // → E
      },
    ],
  },
  {
    id: 17,
    text: '当你独自完成了一件很厉害的事，你会？',
    primaryDimension: 4,
    options: [
      {
        text: '自己默默开心，继续下一个目标',
        effects: [0, 0, 0, -1],
      },
      {
        text: '马上发朋友圈/告诉朋友，分享喜悦',
        effects: [0, 0.2, 0, 1],
      },
    ],
  },
  {
    id: 18,
    text: '选择未来的专业/方向时，你更看重？',
    primaryDimension: 4,
    options: [
      {
        text: '是否符合自己的兴趣和天赋',
        effects: [0, 0.2, -0.3, -1], // → I + 微创造
      },
      {
        text: '就业前景、薪资水平和社会认可度',
        effects: [0, -0.2, 0.3, 1], // → E + 偏好实践
      },
    ],
  },
  {
    id: 19,
    text: '小组合作时，你的表现更接近？',
    primaryDimension: 4,
    options: [
      {
        text: '安静做好自己负责的部分，不太需要交流',
        effects: [0, -0.3, 0, -1],
      },
      {
        text: '积极讨论，希望通过协作达到更好的结果',
        effects: [0, 0, 0, 1],
      },
    ],
  },
  {
    id: 20,
    text: '你对"竞争"的态度是？',
    primaryDimension: 4,
    options: [
      {
        text: '竞争是别人的事，我按自己的节奏来',
        effects: [-0.3, 0, 0, -1], // → I + 微稳步
      },
      {
        text: '竞争让我更有动力，我喜欢赢的感觉',
        effects: [0.3, 0, 0, 1], // → E + 微灵动
      },
    ],
  },
];
