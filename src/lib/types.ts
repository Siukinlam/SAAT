// ============================================================
// SAAT — Student Academic Aptitude Type
// 学格类型系统定义
// ============================================================

// ---- 四维度 ----
// 第1维: S/D — 学习节奏 (Steady / Dynamic)
// 第2维: R/C — 思维通道 (Rational / Creative)
// 第3维: T/P — 知识偏好 (Theoretical / Practical)
// 第4维: I/E — 动力来源 (Internal / External)

export type Dim1 = 'S' | 'D';
export type Dim2 = 'R' | 'C';
export type Dim3 = 'T' | 'P';
export type Dim4 = 'I' | 'E';

/** 4字母学格代号 */
export type SAATCode = `${Dim1}-${Dim2}-${Dim3}-${Dim4}`;

/** 维度分数: 0.0~1.0，越大越偏右端 */
export interface DimensionScores {
  d1: number;
  d2: number;
  d3: number;
  d4: number;
}

/** 维度定义 */
export interface DimensionInfo {
  key: 'd1' | 'd2' | 'd3' | 'd4';
  name: string;
  shortName: string;
  left: { letter: string; label: string; desc: string };
  right: { letter: string; label: string; desc: string };
}

export const DIMENSIONS: DimensionInfo[] = [
  {
    key: 'd1', name: '学习节奏', shortName: '节奏',
    left: { letter: 'S', label: '稳步型', desc: '喜欢按计划一步步来，稳扎稳打' },
    right: { letter: 'D', label: '灵动型', desc: '喜欢灵活应变，根据状态调整节奏' },
  },
  {
    key: 'd2', name: '思维通道', shortName: '思维',
    left: { letter: 'R', label: '理性型', desc: '逻辑分析、数据推理是你的舒适区' },
    right: { letter: 'C', label: '创造型', desc: '联想想象、直觉感知是你的天赋' },
  },
  {
    key: 'd3', name: '知识偏好', shortName: '偏好',
    left: { letter: 'T', label: '理论型', desc: '喜欢追问为什么，探究底层原理' },
    right: { letter: 'P', label: '实践型', desc: '喜欢动手做出来，关注实际应用' },
  },
  {
    key: 'd4', name: '动力来源', shortName: '动力',
    left: { letter: 'I', label: '内驱型', desc: '自我驱动，成就感来自内在成长' },
    right: { letter: 'E', label: '外驱型', desc: '外部激励，动力来自认可和竞争' },
  },
];

// ---- 16种学格 ----

export interface SAATType {
  code: SAATCode;
  name: string;
  tagline: string;
  strengths: string[];
  watchOut: string;
  learningStyle: string;
}

export const SAAT_TYPES: Record<SAATCode, SAATType> = {
  'S-R-T-I': { code: 'S-R-T-I', name: '数理深耕者', tagline: '稳扎稳打的逻辑型自驱者，享受深度思考的乐趣', strengths: ['专注力极强', '逻辑推理能力突出', '自我驱动无需督促'], watchOut: '偶尔需要走出舒适区，尝试跨领域思考', learningStyle: '适合体系化、层层递进的学习路径，精读+刷题效果最佳' },
  'S-R-T-E': { code: 'S-R-T-E', name: '竞赛学者', tagline: '需要目标和认可驱动的体系化学习者', strengths: ['目标感强', '善于在竞争中提升', '逻辑严谨'], watchOut: '不要让外部评价成为唯一动力来源', learningStyle: '竞赛、排名、证书等外部激励机制对你最有效' },
  'S-R-P-I': { code: 'S-R-P-I', name: '工程匠人', tagline: '喜欢把理论变成现实的实践型自驱者', strengths: ['动手能力强', '善于解决问题', '自主驱动做项目'], watchOut: '别忘了学理论可以让你走得更远', learningStyle: '项目制学习、实验、实操是最佳路径' },
  'S-R-P-E': { code: 'S-R-P-E', name: '务实执行者', tagline: '高效可靠的任务驱动型实干家', strengths: ['执行力强', '务实可靠', '善于协作完成任务'], watchOut: '留一些时间思考为什么而不只是怎么做', learningStyle: '明确的任务清单+DDL驱动，小组合作效率高' },
  'S-C-T-I': { code: 'S-C-T-I', name: '人文哲思者', tagline: '对人文艺术有深刻感受力的内在探索者', strengths: ['感受力细腻', '善于深度思考人生问题', '创造力丰富'], watchOut: '逻辑训练可以帮你的创造力落地', learningStyle: '阅读+写作+讨论，需要安静的环境沉浸思考' },
  'S-C-T-E': { code: 'S-C-T-E', name: '文艺表达者', tagline: '渴望用创作连接世界的文艺型学习者', strengths: ['表达能力强', '情感共鸣力高', '审美敏感'], watchOut: '不要让外界评价影响你的创作自信', learningStyle: '展示、表演、分享类学习方式最能激发你的潜力' },
  'S-C-P-I': { code: 'S-C-P-I', name: '生活美学家', tagline: '在日常中发现美、创造美的实践型创造者', strengths: ['审美直觉强', '善于发现日常之美', '独立创作力'], watchOut: '系统性的规划能让你的创作更持久', learningStyle: '手工艺、设计、影像等动手创作类学习方式最佳' },
  'S-C-P-E': { code: 'S-C-P-E', name: '社交连接者', tagline: '善于通过人际互动学习和成长的社交型学习者', strengths: ['社交能力强', '善于团队协作', '感染力突出'], watchOut: '独处时的深度学习也同样重要', learningStyle: '小组讨论、社团活动、项目合作是你最好的学习方式' },
  'D-R-T-I': { code: 'D-R-T-I', name: '前沿探索者', tagline: '好奇心驱动的快速学习者，热爱探索未知领域', strengths: ['学习速度快', '好奇心旺盛', '独立研究能力强'], watchOut: '注意聚焦——太多方向可能让你浅尝辄止', learningStyle: '自学+研究+挑战难题，需要不断的新刺激保持兴趣' },
  'D-R-T-E': { code: 'D-R-T-E', name: '精英竞争者', tagline: '在高压环境中越战越勇的快速逻辑型学习者', strengths: ['抗压能力强', '善于快速学习', '目标导向'], watchOut: '慢下来反思能让你走得更远', learningStyle: '高强度的挑战性任务+即时反馈最适合你' },
  'D-R-P-I': { code: 'D-R-P-I', name: '创新实干家', tagline: '快速行动、边做边学的实践派创新者', strengths: ['行动力超强', '善于快速试错', '独立创业精神'], watchOut: '偶尔慢下来做复盘能让效率翻倍', learningStyle: '创业项目、hackathon、实战演练是最佳学习方式' },
  'D-R-P-E': { code: 'D-R-P-E', name: '目标猎手', tagline: '锁定目标就全力以赴的高效执行者', strengths: ['效率极高', '结果导向', '善于资源整合'], watchOut: '过程本身也值得享受，别只盯着终点', learningStyle: '设定明确的阶段性目标+奖励机制最有效' },
  'D-C-T-I': { code: 'D-C-T-I', name: '跨界思想者', tagline: '在不同领域间自由穿梭的创意型思考者', strengths: ['思维跳跃有创造力', '善于跨界连接', '独立思想者'], watchOut: '有时需要落地——把想法变成行动', learningStyle: '跨学科阅读、头脑风暴、自由写作最能激发你' },
  'D-C-T-E': { code: 'D-C-T-E', name: '灵感传播者', tagline: '善于捕捉灵感并感染他人的创意表达者', strengths: ['感染力极强', '创意源源不断', '善于激励他人'], watchOut: '灵感需要行动来落地', learningStyle: '演讲、展示、内容创作类学习方式最匹配' },
  'D-C-P-I': { code: 'D-C-P-I', name: '自由创造者', tagline: '不受拘束的独立创作者，用作品表达自我', strengths: ['创造力自由奔放', '独立性强', '作品驱动'], watchOut: '外部反馈有时候能帮你看到盲点', learningStyle: '独立项目、自由创作、探索式学习最合适' },
  'D-C-P-E': { code: 'D-C-P-E', name: '趋势引领者', tagline: '敏锐捕捉潮流并引领方向的社交型创造者', strengths: ['趋势敏感度高', '领导力强', '善于聚合资源'], watchOut: '深度思考比广度更能建立长期优势', learningStyle: '社群运营、内容创作、活动策划类学习方式最佳' },
};

// ---- 题目 ----

/** 单条测评陈述（Likert 5级量表） */
export interface Question {
  id: number;
  /** 测评陈述 */
  statement: string;
  /** 测量哪个维度 (1-4) */
  dimension: number;
  /** 同意该陈述推向哪端: 'left'=推向左端字母, 'right'=推向右端字母 */
  direction: 'left' | 'right';
}

/** Likert 量表选项 */
export const LIKERT_OPTIONS = [
  { value: 1, label: '完全不同意' },
  { value: 2, label: '比较不同意' },
  { value: 3, label: '中立' },
  { value: 4, label: '比较同意' },
  { value: 5, label: '完全同意' },
] as const;

export type LikertValue = 1 | 2 | 3 | 4 | 5;

// ---- 学生阶段 ----

export type StudentStage = 'middle' | 'high';

// ---- 推荐 ----

export interface SubjectRecommendation {
  category: string;
  match: number;
  reason: string;
}

export interface MajorRecommendation {
  name: string;
  category: string;
  match: number;
  reason: string;
}
