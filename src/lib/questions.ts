// ============================================================
// SAAT 测评题库 — 60题 · Likert 5级量表
// 心理学陈述风格（参考 MBTI / Big Five）
// 每维度15题，左右端交替
// ============================================================

import type { Question } from './types';

export const QUESTIONS: Question[] = [

  // ===== 维度1: 学习节奏 (S-稳步 / D-灵动) — 15题 =====
  { id: 1, dimension: 1, direction: 'left', statement: '我喜欢提前规划每一天的日程安排。' },
  { id: 2, dimension: 1, direction: 'right', statement: '计划赶不上变化，我更相信临场发挥。' },
  { id: 3, dimension: 1, direction: 'left', statement: '一旦开始一件事，我会坚持按部就班地推进。' },
  { id: 4, dimension: 1, direction: 'right', statement: '我经常同时进行好几件事，在不同任务间跳来跳去。' },
  { id: 5, dimension: 1, direction: 'left', statement: '稳定的作息和固定的学习环境让我效率最高。' },
  { id: 6, dimension: 1, direction: 'right', statement: '截止日期临近时的紧迫感反而让我更专注。' },
  { id: 7, dimension: 1, direction: 'left', statement: '做重要决定前，我需要充分的时间收集信息。' },
  { id: 8, dimension: 1, direction: 'right', statement: '我经常在最后一刻改变主意，跟着当下的感觉走。' },
  { id: 9, dimension: 1, direction: 'left', statement: '我喜欢把大目标拆解成小步骤，一步步完成。' },
  { id: 10, dimension: 1, direction: 'right', statement: '重复做同样的事情会让我感到厌倦。' },
  { id: 11, dimension: 1, direction: 'left', statement: '我很少迟到，通常都会提前到达。' },
  { id: 12, dimension: 1, direction: 'right', statement: '我的桌面或房间通常不是特别整洁，但我能找到需要的东西。' },
  { id: 13, dimension: 1, direction: 'left', statement: '养成一个新习惯后，我会长期坚持下去。' },
  { id: 14, dimension: 1, direction: 'right', statement: '灵感来了我会立刻放下手头的事去追逐新想法。' },
  { id: 15, dimension: 1, direction: 'left', statement: '比起多任务并行，我更擅长一次专注做好一件事。' },

  // ===== 维度2: 思维通道 (R-理性 / C-创造) — 15题 =====
  { id: 16, dimension: 2, direction: 'left', statement: '面对复杂问题时，我倾向于列出所有可能的逻辑链条。' },
  { id: 17, dimension: 2, direction: 'right', statement: '我经常依靠直觉做判断，而且通常是对的。' },
  { id: 18, dimension: 2, direction: 'left', statement: '数据比故事更能说服我。' },
  { id: 19, dimension: 2, direction: 'right', statement: '一个好的比喻比一组数据更能让我理解问题。' },
  { id: 20, dimension: 2, direction: 'left', statement: '我注意到别人说话或写作中的逻辑漏洞。' },
  { id: 21, dimension: 2, direction: 'right', statement: '我经常在脑海中产生画面或场景，而不是文字或数字。' },
  { id: 22, dimension: 2, direction: 'left', statement: '做选择时，我会列出优缺点清单进行理性分析。' },
  { id: 23, dimension: 2, direction: 'right', statement: '有时候我自己也说不清为什么会做出某个决定。' },
  { id: 24, dimension: 2, direction: 'left', statement: '我喜欢玩需要策略和计算能力的游戏。' },
  { id: 25, dimension: 2, direction: 'right', statement: '我经常会因为一首歌、一幅画或一段文字而情绪波动。' },
  { id: 26, dimension: 2, direction: 'left', statement: '在争论中，我更关注事实和证据，而非对方的情绪。' },
  { id: 27, dimension: 2, direction: 'right', statement: '比起条理分明的讲解，故事性的叙述更容易让我记住内容。' },
  { id: 28, dimension: 2, direction: 'left', statement: '我喜欢把事物分门别类，建立起清晰的思维框架。' },
  { id: 29, dimension: 2, direction: 'right', statement: '我的想法经常跳跃，别人觉得我跟不上我的思路。' },
  { id: 30, dimension: 2, direction: 'left', statement: '我习惯用客观的标准来评价事物，而非个人感受。' },

  // ===== 维度3: 知识偏好 (T-理论 / P-实践) — 15题 =====
  { id: 31, dimension: 3, direction: 'left', statement: '我忍不住去想事情背后的原理和为什么。' },
  { id: 32, dimension: 3, direction: 'right', statement: '知道怎么用就够了，不一定需要知道为什么。' },
  { id: 33, dimension: 3, direction: 'left', statement: '我喜欢阅读深入探讨某个主题的理论性文章。' },
  { id: 34, dimension: 3, direction: 'right', statement: '动手做一遍比读十遍书记得牢。' },
  { id: 35, dimension: 3, direction: 'left', statement: '一个问题弄懂了底层逻辑，我会感到极大的满足。' },
  { id: 36, dimension: 3, direction: 'right', statement: '我更关注一个知识能帮我解决什么实际问题。' },
  { id: 37, dimension: 3, direction: 'left', statement: '我对事物的运作机制充满好奇，即使和我无关。' },
  { id: 38, dimension: 3, direction: 'right', statement: '与其花时间理解理论，我宁愿直接开始做事。' },
  { id: 39, dimension: 3, direction: 'left', statement: '抽象概念和理论讨论让我感到兴奋。' },
  { id: 40, dimension: 3, direction: 'right', statement: '我擅长把别人的想法落地成具体可执行的方案。' },
  { id: 41, dimension: 3, direction: 'left', statement: '我喜欢探索哲学、数学或科学理论中的深层问题。' },
  { id: 42, dimension: 3, direction: 'right', statement: '我更喜欢能立刻看到成果的学习或工作。' },
  { id: 43, dimension: 3, direction: 'left', statement: '对我来说，弄清楚一个概念的定义和边界很重要。' },
  { id: 44, dimension: 3, direction: 'right', statement: '我倾向于通过反复试错来学习，而不是先看说明书。' },
  { id: 45, dimension: 3, direction: 'left', statement: '花一下午思考一个理论问题，对我来说是享受。' },

  // ===== 维度4: 动力来源 (I-内驱 / E-外驱) — 15题 =====
  { id: 46, dimension: 4, direction: 'left', statement: '即使没人知道，我也会尽力把事情做好。' },
  { id: 47, dimension: 4, direction: 'right', statement: '公开的排名或评比能给我极大的动力。' },
  { id: 48, dimension: 4, direction: 'left', statement: '我学习是因为我真的想学，不是因为考试要考。' },
  { id: 49, dimension: 4, direction: 'right', statement: '获得他人的赞扬和认可对我来说非常重要。' },
  { id: 50, dimension: 4, direction: 'left', statement: '完成一个有挑战的任务后，我内心的成就感比任何奖励都重要。' },
  { id: 51, dimension: 4, direction: 'right', statement: '如果有奖学金或高薪作为回报，我的努力程度会明显提升。' },
  { id: 52, dimension: 4, direction: 'left', statement: '我不太在意别人怎么评价我的选择。' },
  { id: 53, dimension: 4, direction: 'right', statement: '看到别人比我强，会激发我更强的竞争欲。' },
  { id: 54, dimension: 4, direction: 'left', statement: '失败对我的打击主要来自于对自己的失望，而非他人的看法。' },
  { id: 55, dimension: 4, direction: 'right', statement: '我喜欢在社交媒体上分享自己的成就和进步。' },
  { id: 56, dimension: 4, direction: 'left', statement: '我选择的方向更多出于个人兴趣，而不是就业前景。' },
  { id: 57, dimension: 4, direction: 'right', statement: '清晰的奖励机制能让我更有干劲。' },
  { id: 58, dimension: 4, direction: 'left', statement: '独处思考能给我带来比社交活动更多的能量。' },
  { id: 59, dimension: 4, direction: 'right', statement: '团队协作中，别人的期待会推动我做得更好。' },
  { id: 60, dimension: 4, direction: 'left', statement: '即使没有外部压力，我也会给自己设定高标准。' },
];
