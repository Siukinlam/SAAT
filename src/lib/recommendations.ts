// ============================================================
// SAAT 推荐系统 — 分科/专业推荐
// ============================================================

import { type SAATCode, type SubjectRecommendation, type MajorRecommendation } from './types';

// ---- 初中毕业生: 高中分科推荐 (新高考 3+1+2) ----

const SUBJECT_RECS: Record<SAATCode, SubjectRecommendation[]> = {
  // S开头(稳步型): 偏传统、体系化选科
  'S-R-T-I': [
    { category: '物理+化学+生物', match: 95, reason: '传统理科组合，体系化学习匹配你的稳步理性格' },
    { category: '物理+化学+地理', match: 82, reason: '保留理科优势，地理增加一点人文视角' },
  ],
  'S-R-T-E': [
    { category: '物理+化学+生物', match: 93, reason: '纯理科组合，排名清晰，外驱动力强' },
    { category: '物理+化学+政治', match: 78, reason: '理科为主+政治，适合有考公/军校意向' },
  ],
  'S-R-P-I': [
    { category: '物理+化学+地理', match: 91, reason: '理论+实践平衡，地理的应用性很适合你' },
    { category: '物理+生物+地理', match: 85, reason: '偏应用的理科组合，动手实践空间大' },
  ],
  'S-R-P-E': [
    { category: '物理+化学+地理', match: 90, reason: '实用理科组合，回报明确，匹配外驱' },
    { category: '历史+政治+地理', match: 75, reason: '若偏好文科则选纯文，体系完整' },
  ],
  'S-C-T-I': [
    { category: '历史+政治+地理', match: 92, reason: '传统文科，适合人文感受力强的稳步型学习者' },
    { category: '历史+地理+生物', match: 80, reason: '文理混合，保留一些科学视角' },
  ],
  'S-C-T-E': [
    { category: '历史+政治+地理', match: 90, reason: '纯文科，展示表达空间大，外驱激励' },
    { category: '历史+政治+生物', match: 77, reason: '文科为主+生物，拓宽专业选择面' },
  ],
  'S-C-P-I': [
    { category: '历史+地理+美术/音乐', match: 88, reason: '偏艺术/设计方向，充分释放创造力' },
    { category: '历史+政治+地理', match: 82, reason: '传统文科也适合，但建议加入艺术类' },
  ],
  'S-C-P-E': [
    { category: '历史+政治+地理', match: 89, reason: '文科+社交型学习，团队协作场景多' },
    { category: '历史+地理+生物', match: 76, reason: '保留一些理科元素，拓宽视野' },
  ],

  // D开头(灵动型): 偏灵活、跨学科
  'D-R-T-I': [
    { category: '物理+化学+地理', match: 93, reason: '灵活搭配，地理的应用性满足探索欲' },
    { category: '物理+化学+生物', match: 85, reason: '纯理科也适合，但可以用跨学科方式学' },
  ],
  'D-R-T-E': [
    { category: '物理+化学+生物', match: 94, reason: '纯理科高强度竞争环境最适合你' },
    { category: '物理+化学+政治', match: 80, reason: '理科+政治，精英路线' },
  ],
  'D-R-P-I': [
    { category: '物理+化学+地理', match: 90, reason: '理科混合，应用性强，可快速试错' },
    { category: '物理+生物+技术', match: 83, reason: '偏工科应用方向，动手空间大' },
  ],
  'D-R-P-E': [
    { category: '物理+化学+地理', match: 91, reason: '高效实用组合，回报清晰' },
    { category: '物理+化学+生物', match: 86, reason: '纯理科效率最高' },
  ],
  'D-C-T-I': [
    { category: '历史+地理+政治', match: 88, reason: '文科灵活探索，自由思考空间大' },
    { category: '物理+历史+地理', match: 80, reason: '文理跨界，满足跨领域好奇心' },
  ],
  'D-C-T-E': [
    { category: '历史+政治+地理', match: 87, reason: '文科表达+外驱，适合领导和传播方向' },
    { category: '历史+政治+生物', match: 79, reason: '文科为主+科学素养' },
  ],
  'D-C-P-I': [
    { category: '历史+美术+音乐', match: 86, reason: '自由创作方向，不受约束' },
    { category: '不限选科（艺考路线）', match: 90, reason: '艺术类院校/专业，充分发挥创造力' },
  ],
  'D-C-P-E': [
    { category: '历史+政治+地理', match: 88, reason: '社交型文科，团队活动多' },
    { category: '历史+地理+技术', match: 79, reason: '混合型，社会实践空间大' },
  ],
};

// ---- 高中毕业生: 大学专业推荐 (13大学科门类) ----

const MAJOR_RECS: Record<SAATCode, MajorRecommendation[]> = {
  'S-R-T-I': [
    { name: '数学与应用数学', category: '理学', match: 96, reason: '纯理论数理学科，深度思考者的天堂' },
    { name: '物理学', category: '理学', match: 93, reason: '体系化的理论物理，满足追根究底的欲望' },
    { name: '计算机科学（理论方向）', category: '工学', match: 88, reason: '算法与理论计算机，逻辑推理的极致' },
  ],
  'S-R-T-E': [
    { name: '金融学', category: '经济学', match: 94, reason: '数理+竞争+高回报，完美匹配外驱' },
    { name: '临床医学', category: '医学', match: 90, reason: '体系化学习+明确职业路径+社会地位' },
    { name: '电子信息工程', category: '工学', match: 86, reason: '硬核工科，技术壁垒高，回报明确' },
  ],
  'S-R-P-I': [
    { name: '软件工程', category: '工学', match: 93, reason: '动手写代码，自己做项目，独立驱动' },
    { name: '机械工程', category: '工学', match: 88, reason: '理论+实践结合，自己动手做东西' },
    { name: '建筑学', category: '工学', match: 85, reason: '逻辑+美感+动手的完美结合' },
  ],
  'S-R-P-E': [
    { name: '会计学', category: '管理学', match: 91, reason: '体系清晰+务实+社会认可度高' },
    { name: '土木工程', category: '工学', match: 87, reason: '传统工科，实用稳定' },
    { name: '护理学', category: '医学', match: 84, reason: '务实+稳定+社会价值明确' },
  ],
  'S-C-T-I': [
    { name: '哲学', category: '哲学', match: 95, reason: '深度思考人生与世界的本质，自驱探索' },
    { name: '中国语言文学', category: '文学', match: 92, reason: '人文深度+感受力，经典阅读与思辨' },
    { name: '历史学', category: '历史学', match: 89, reason: '对人文脉络有深刻感受力的内在探索者' },
  ],
  'S-C-T-E': [
    { name: '新闻传播学', category: '文学', match: 93, reason: '表达+传播+社会认可' },
    { name: '法学', category: '法学', match: 89, reason: '逻辑+表达+社会地位' },
    { name: '教育学', category: '教育学', match: 85, reason: '传授知识+影响他人+稳定职业' },
  ],
  'S-C-P-I': [
    { name: '设计学', category: '艺术学', match: 94, reason: '创造美+动手实践+独立创作' },
    { name: '音乐学', category: '艺术学', match: 88, reason: '独立创作表达' },
    { name: '建筑学', category: '工学', match: 83, reason: '兼具艺术与技术美感' },
  ],
  'S-C-P-E': [
    { name: '市场营销', category: '管理学', match: 90, reason: '社交+创意+务实回报' },
    { name: '广告学', category: '文学', match: 88, reason: '创意表达+团队协作' },
    { name: '旅游管理', category: '管理学', match: 83, reason: '社交型+实践型+与人连接' },
  ],
  'D-R-T-I': [
    { name: '人工智能', category: '工学', match: 95, reason: '前沿探索+快速学习+独立研究' },
    { name: '数据科学', category: '理学', match: 91, reason: '跨领域数据分析，满足好奇心' },
    { name: '生物信息学', category: '理学', match: 87, reason: '前沿交叉学科，探索未知' },
  ],
  'D-R-T-E': [
    { name: '金融工程', category: '经济学', match: 94, reason: '高压+高回报+快速学习' },
    { name: '临床医学（八年制）', category: '医学', match: 90, reason: '精英路线+高竞争+高回报' },
    { name: '计算机科学', category: '工学', match: 87, reason: '快速变化+竞争激烈+回报高' },
  ],
  'D-R-P-I': [
    { name: '软件工程/创业方向', category: '工学', match: 93, reason: '快速试错+独立项目+边做边学' },
    { name: '工业设计', category: '工学', match: 87, reason: '快速迭代+动手+创造' },
    { name: '电气工程', category: '工学', match: 84, reason: '实用工科+动手空间大' },
  ],
  'D-R-P-E': [
    { name: '工商管理', category: '管理学', match: 90, reason: '高效执行+目标导向+资源整合' },
    { name: '经济学', category: '经济学', match: 87, reason: '分析+决策+实际应用' },
    { name: '信息管理与信息系统', category: '管理学', match: 84, reason: '技术+管理结合' },
  ],
  'D-C-T-I': [
    { name: '心理学', category: '理学', match: 92, reason: '跨学科探索人类心智，满足好奇心' },
    { name: '人类学', category: '法学', match: 87, reason: '跨界理解人类文化' },
    { name: '比较文学', category: '文学', match: 84, reason: '跨文化思想碰撞' },
  ],
  'D-C-T-E': [
    { name: '传媒/新媒体', category: '文学', match: 93, reason: '创意传播+快速产出+影响他人' },
    { name: '国际关系', category: '法学', match: 87, reason: '全球视野+表达+影响力' },
    { name: '文化产业管理', category: '管理学', match: 84, reason: '创意+管理+趋势敏感' },
  ],
  'D-C-P-I': [
    { name: '数字媒体艺术', category: '艺术学', match: 93, reason: '独立创作+自由表达+技术工具' },
    { name: '动画/游戏设计', category: '艺术学', match: 90, reason: '创造力+独立项目+作品说话' },
    { name: '摄影/影视制作', category: '艺术学', match: 86, reason: '视觉创作+独立完成' },
  ],
  'D-C-P-E': [
    { name: '新媒体/自媒体运营', category: '文学', match: 91, reason: '趋势敏感+社交传播+创意落地' },
    { name: '时尚管理', category: '管理学', match: 87, reason: '潮流敏感+社交+管理' },
    { name: '会展/活动策划', category: '管理学', match: 84, reason: '创意策划+团队领导+趋势' },
  ],
};

export function getSubjectRecommendations(code: SAATCode): SubjectRecommendation[] {
  return SUBJECT_RECS[code] || [];
}

export function getMajorRecommendations(code: SAATCode): MajorRecommendation[] {
  return MAJOR_RECS[code] || [];
}
