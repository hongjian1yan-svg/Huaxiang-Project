// 装修施工期管理模块 Mock 数据（独立于 renovation-mock.js）

const CATEGORY_DEPT_MAP = {
  '门头广告': '物业部',
  '消防系统': '安保部',
  '基建改造': '物业部',
  '电气改造': '管理部',
  '给排水': '物业部'
}
const MY_INSPECT_DEPT = '物业部'

const CONSTRUCTION_TABS = [
  { key: 'all', label: '全部', badge: 4 },
  { key: 'expiring', label: '即将到期', badge: 1 },
  { key: 'stopped', label: '停工整改', badge: 2 }
]

const CONSTRUCTION_DATA = [
  {
    id: 'RX202605010001', merchant: '瑞丰汽配', shop: 'B10', certNo: 'SZ202605010015',
    period: '2026-05-01 至 2026-06-15', planPeriod: '2026-05-01 至 2026-06-30', level: 'II级',
    tags: ['门头广告', '基建改造', '消防系统', '电气改造'], daysLeft: 25, tab: 'active',
    contact: '张经理 139****5678', stopped: true, stopReason: '巡检异常-停工整改：消防通道占用', stopTime: '2026-05-20 14:00',
    categoryItems: [
      { name: '门头广告', dept: '物业部', projects: ['招牌更换 (II级)', '灯箱安装 (II级)'] },
      { name: '基建改造', dept: '物业部', projects: ['隔墙拆除 (II级)', '地面找平 (I级)'] },
      { name: '消防系统', dept: '安保部', projects: ['消防栓移位 (III级)'] },
      { name: '电气改造', dept: '管理部', projects: ['电表安装 (II级)', '水表读数确认 (I级)'] }
    ],
    decorateRemark: '门面升级改造，更换招牌并调整消防设施位置'
  },
  {
    id: 'RX202605030001', merchant: '嘉诚名车', shop: 'D07', certNo: 'SZ202605060016',
    period: '2026-05-05 至 2026-06-20', planPeriod: '2026-05-05 至 2026-07-01', level: 'III级',
    tags: ['消防系统', '电气改造'], daysLeft: 5, tab: 'expiring',
    contact: '王经理 137****9900', stopped: false,
    categoryItems: [
      { name: '消防系统', dept: '安保部', projects: ['消防栓移位 (III级)'] },
      { name: '电气改造', dept: '管理部', projects: ['电路改造 (II级)', '电表读数确认 (I级)'] }
    ],
    decorateRemark: '消防设施调整及电气线路改造，须按专项方案施工'
  },
  {
    id: 'RX202605110001', merchant: '北京拿铁旧机动车', shop: 'B08', certNo: 'SZ202605110001',
    period: '2026-05-11 至 2026-05-18', planPeriod: '2026-05-11 至 2026-06-30', level: 'II级',
    tags: ['门头广告', '基建改造', '消防系统', '电气改造'], daysLeft: -2, tab: 'active',
    contact: '王经理 138****1234', stopped: true, stopReason: '逾期停工', stopTime: '2026-05-19 00:00',
    categoryItems: [
      { name: '门头广告', dept: '物业部', projects: ['招牌更换 (II级)', '灯箱安装 (II级)'] },
      { name: '基建改造', dept: '物业部', projects: ['隔墙拆除 (II级)', '地面找平 (I级)'] },
      { name: '消防系统', dept: '安保部', projects: ['消防栓移位 (III级)'] },
      { name: '电气改造', dept: '管理部', projects: ['电表安装 (II级)', '水表读数确认 (I级)'] }
    ],
    decorateRemark: '门面升级改造，更换招牌并调整消防设施位置'
  },
  {
    id: 'RX202605120002', merchant: '红星车行', shop: 'A08', certNo: 'SZ202605100018',
    period: '2026-05-10 至 2026-06-30', planPeriod: '2026-05-10 至 2026-06-30', level: 'I级',
    tags: ['门头广告'], daysLeft: 40, tab: 'active',
    contact: '李经理 136****5566', stopped: false,
    categoryItems: [
      { name: '门头广告', dept: '物业部', projects: ['招牌更换 (I级)'] }
    ],
    decorateRemark: '户外招牌更换，须符合市场门头管理规范'
  }
]

function getConstructionById(id) {
  return CONSTRUCTION_DATA.find(d => d.id === id) || null
}

function getConstructionCategoryItems(item) {
  if (!item || !item.categoryItems) return []
  return item.categoryItems.map(cat => ({
    name: cat.name,
    dept: cat.dept || CATEGORY_DEPT_MAP[cat.name] || '—',
    isMyDept: (cat.dept || CATEGORY_DEPT_MAP[cat.name]) === MY_INSPECT_DEPT,
    projectsText: (cat.projects || []).join('、') || '—'
  }))
}

function resolveCategoryDept(applyId) {
  const c = getConstructionById(applyId)
  if (!c || !c.tags || !c.tags.length) return { category: '—', department: '—' }
  const depts = []
  c.tags.forEach(tag => {
    const dept = CATEGORY_DEPT_MAP[tag]
    if (dept && depts.indexOf(dept) < 0) depts.push(dept)
  })
  return { category: c.tags.join('、'), department: depts.length ? depts.join('、') : '—' }
}

// ── 特殊作业 ──
const SPECIAL_WORK_META = {
  fire: { label: '动火作业', cls: 'special-fire' },
  height: { label: '高空作业', cls: 'special-height' },
  electric: { label: '临时用电', cls: 'special-electric' }
}
const SPECIAL_WORK_ORDER = ['fire', 'height', 'electric']
const SPECIAL_WORK_TODAY_BY_APPLY = {
  'RX202605110001': ['fire', 'electric'],
  'RX202605010001': ['fire', 'height'],
  'RX202605030001': ['electric'],
  'RX202605120002': ['height']
}
const MERCHANT_SELF_CHECK_BY_APPLY = {
  'RX202605110001': {
    fire: { reported: true, reportTime: '2026-05-20 07:30', content: '动火点周围10米可燃物已清理，配备灭火器2具，监护人李师傅在场，动火时段 09:00~12:00', certs: ['动火作业证_王焊工.pdf', '动火点现场.jpg'] },
    electric: { reported: true, reportTime: '2026-05-20 07:45', content: '临时用电线路已穿管保护，漏电保护器检测正常，总负荷约8kW，用电点位2处', certs: ['电工操作证_张电工.pdf', '配电箱近景.jpg', '临时用电方案.pdf'] }
  },
  'RX202605010001': {
    fire: { reported: true, reportTime: '2026-05-20 08:00', content: '焊接作业区域已设警戒带，灭火器已就位，动火监护人张工已到岗', certs: ['动火作业证_李焊工.pdf', '动火方案.pdf'] },
    height: { reported: false }
  },
  'RX202605030001': {
    electric: { reported: true, reportTime: '2026-05-20 08:15', content: '施工区临时用电已验收，线路架空敷设，配电箱上锁管理', certs: ['电工操作证_孙电工.pdf'] }
  },
  'RX202605120002': {
    height: { reported: false }
  }
}

function getSpecialWorkTags(applyId) {
  const works = SPECIAL_WORK_TODAY_BY_APPLY[applyId] || []
  return SPECIAL_WORK_ORDER.filter(k => works.indexOf(k) >= 0).map(k => SPECIAL_WORK_META[k])
}

function getMerchantSelfCheckList(applyId) {
  const works = SPECIAL_WORK_TODAY_BY_APPLY[applyId] || []
  const selfCheck = MERCHANT_SELF_CHECK_BY_APPLY[applyId] || {}
  return SPECIAL_WORK_ORDER.filter(k => works.indexOf(k) >= 0).map(k => {
    const info = selfCheck[k] || { reported: false }
    const meta = SPECIAL_WORK_META[k]
    return {
      key: k, label: meta.label, cls: meta.cls,
      reported: !!info.reported,
      reportTime: info.reportTime || '',
      content: info.content || '',
      certs: info.certs || []
    }
  })
}

// ── 巡检任务 ──
const INSPECT_TABS = [
  { key: 'today', label: '今日待检', badge: 3 },
  { key: 'recheck', label: '今日待复检', badge: 1 },
  { key: 'done', label: '已巡检', badge: 0 },
  { key: 'overdue', label: '过期未检', badge: 2 }
]

const INSPECT_DATA = {
  today: [
    { id: 'IN001', applyId: 'RX202605110001', title: 'B08 - 北京拿铁旧机动车', certNo: 'SZ202605110001', category: '基建改造', department: '物业部' },
    { id: 'IN002', applyId: 'RX202605010001', title: 'B10 - 瑞丰汽配', certNo: 'SZ202605010015', category: '门头广告、基建改造', department: '物业部' },
    { id: 'IN003', applyId: 'RX202605030001', title: 'D07 - 嘉诚名车', certNo: 'SZ202605060016', category: '消防系统、电气改造', department: '管理部' }
  ],
  recheck: [
    { id: 'IN004', applyId: 'RX202605110001', title: 'B08 - 北京拿铁旧机动车', certNo: 'SZ202605110001', category: '基建改造', department: '物业部', isRecheck: true, abnormalText: '临时用电线路裸露', inspectTime: '2026-05-19 09:20', rectifyType: '现场整改', firstInspectResult: '存在异常', firstInspectDescription: '现场发现临时用电线路裸露，已要求商户立即规范敷设。', firstInspectPerson: '赵经理', firstInspectPhotos: ['初检现场1.jpg', '初检现场2.jpg'] }
  ],
  done: [
    { id: 'IN005', applyId: 'RX202605120002', title: 'A08 - 红星车行', certNo: 'SZ202605100018', category: '门头广告', department: '物业部', result: '正常', inspectDescription: '现场施工秩序良好，门头改造符合申报方案，未发现违规作业。', inspectTime: '2026-05-20 08:30', person: '赵经理' },
    { id: 'IN010', applyId: 'RX202605110001', title: 'B08 - 北京拿铁旧机动车', certNo: 'SZ202605110001', category: '基建改造', department: '物业部', result: '复检正常', inspectDescription: '临时用电线路已规范穿管保护，现场复核无异常。', inspectTime: '2026-05-20 11:15', person: '赵经理' },
    { id: 'IN008', applyId: 'RX202605010001', title: 'B10 - 瑞丰汽配', certNo: 'SZ202605010015', category: '门头广告、基建改造', department: '物业部', result: '存在异常', abnormalText: '消防通道占用', inspectDescription: '现场发现施工材料及工具占用消防通道，已要求商户立即清理并设置警示标识。', rectifyType: '停工整改', inspectTime: '2026-05-20 10:00', person: '赵经理' }
  ],
  overdue: [
    { id: 'IN006', applyId: 'RX202605120002', title: 'A08 - 红星车行', certNo: 'SZ202605100018', category: '门头广告', department: '物业部', dueDate: '2026-05-19' },
    { id: 'IN007', applyId: 'RX202605110001', title: 'B08 - 北京拿铁旧机动车', certNo: 'SZ202605110001', category: '基建改造', department: '物业部', isRecheck: true, abnormalText: '临时用电线路裸露', inspectTime: '2026-05-19 09:20', rectifyType: '现场整改', firstInspectResult: '存在异常', firstInspectDescription: '现场发现临时用电线路裸露，已要求商户立即规范敷设。', firstInspectPerson: '赵经理', firstInspectPhotos: ['初检现场1.jpg', '初检现场2.jpg'] }
  ]
}

function findInspectItem(id) {
  const keys = ['today', 'recheck', 'done', 'overdue']
  for (let i = 0; i < keys.length; i++) {
    const found = (INSPECT_DATA[keys[i]] || []).find(d => d.id === id)
    if (found) return { item: found, tab: keys[i] }
  }
  return null
}

// ── 停工整改复核 ──
const RECTIFY_TABS = [
  { key: 'pending', label: '待商户整改', badge: 2 },
  { key: 'review', label: '待复核', badge: 2 },
  { key: 'rejected', label: '复核驳回', badge: 0 },
  { key: 'closed', label: '已复工', badge: 0 }
]

const RECTIFY_DATA = {
  pending: [
    { id: 'ZG202605220001', applyId: 'RX202605110001', merchant: '北京拿铁旧机动车', shop: 'B08', type: '逾期停工', requirement: '施工证已逾期，请办理延期或申请验收后方可申请复工', deadline: '2026-05-25', issueTime: '2026-05-19 00:00', issuer: '系统（施工证逾期）', needStop: true },
    { id: 'ZG202605200001', applyId: 'RX202605010001', merchant: '瑞丰汽配', shop: 'B10', type: '巡检异常', requirement: '消防通道占用，请立即清理并设置警示标识', deadline: '2026-05-23', issueTime: '2026-05-20 10:00', issuer: '赵经理（市场经营部）', needStop: true, fromInspect: true }
  ],
  review: [
    { id: 'ZG202605180001', applyId: 'RX202605110001', merchant: '北京拿铁旧机动车', shop: 'B08', type: '巡检异常', requirement: '临时用电线路裸露，请规范敷设并设置保护', deadline: '2026-05-19', issueTime: '2026-05-18 15:00', issuer: '赵经理（市场经营部）', needStop: false, fromInspect: true, recheckApplyTime: '2026-05-19 11:00', attachmentDesc: '临时用电线路已规范穿管保护，配电箱周边杂物已清理，漏电保护器检测正常，详见附件说明。', attachments: ['用电整改说明.pdf', '电工自检记录.jpg'], rectificationPhotos: ['线路整改前.jpg', '线路整改后.jpg', '配电箱近景.jpg'] },
    { id: 'ZG202605190001', applyId: 'RX202605010001', merchant: '瑞丰汽配', shop: 'B10', type: '巡检异常', requirement: '高空作业未系安全绳，请规范佩戴防护用品', deadline: '2026-05-22', issueTime: '2026-05-19 11:00', issuer: '赵经理（市场经营部）', needStop: true, fromInspect: true, recheckApplyTime: '2026-05-21 08:45', attachmentDesc: '高空作业人员均已规范佩戴安全绳及防护用品，现场监护人到岗。', attachments: ['高空作业整改说明.pdf'], rectificationPhotos: ['整改前.jpg', '整改后.jpg'] }
  ],
  closed: [
    { id: 'ZG202605100001', applyId: 'RX202605120002', merchant: '红星车行', shop: 'A08', type: '巡检异常', requirement: '建筑垃圾未及时清运', deadline: '2026-05-12', issueTime: '2026-05-10 09:00', issuer: '赵经理（市场经营部）', needStop: false, fromInspect: true, recheckApplyTime: '2026-05-11 10:30', attachmentDesc: '建筑垃圾已全部清运完毕，现场已恢复整洁，清运前后对比见上传照片及附件说明。', attachments: ['垃圾清运记录.pdf'], rectificationPhotos: ['清运前.jpg', '清运后.jpg', '现场全景.jpg'], closeTime: '2026-05-11 16:00', reviewer: '赵经理', reviewResult: 'pass', reviewOpinion: '现场核实建筑垃圾已清运完毕，现场恢复整洁，符合整改要求。', reviewPhotos: ['复核现场1.jpg', '复核现场2.jpg'] },
    { id: 'ZG202605090001', applyId: 'RX202605110001', merchant: '北京拿铁旧机动车', shop: 'B08', type: '巡检异常', requirement: '施工材料堆放占用消防通道', deadline: '2026-05-10', issueTime: '2026-05-08 14:00', issuer: '赵经理（市场经营部）', needStop: true, fromInspect: true, recheckApplyTime: '2026-05-09 16:00', attachmentDesc: '材料已清空并移位存放，消防通道恢复畅通。', attachments: ['通道整改说明.pdf'], rectificationPhotos: ['通道整改前.jpg', '通道整改后.jpg'], closeTime: '2026-05-10 10:30', reviewer: '赵经理', reviewResult: 'pass', reviewOpinion: '消防通道已恢复畅通，材料堆放符合规范。', reviewPhotos: ['复核现场1.jpg'] }
  ],
  rejected: [
    { id: 'ZG202605150001', applyId: 'RX202605030001', merchant: '嘉诚名车', shop: 'D07', type: '巡检异常', requirement: '施工区域未设置围挡，存在安全隐患', deadline: '2026-05-18', issueTime: '2026-05-15 10:00', issuer: '赵经理（市场经营部）', needStop: true, fromInspect: true, recheckApplyTime: '2026-05-17 14:20', attachmentDesc: '已设置施工围挡，现场警示标识已补齐，详见上传照片。', attachments: ['围挡整改说明.pdf'], rectificationPhotos: ['围挡整改前.jpg', '围挡整改后.jpg'], rejectTime: '2026-05-17 16:30', reviewer: '赵经理', reviewResult: 'reject', reviewOpinion: '现场围挡高度不足，警示标识摆放位置不符合要求，请按规范重新整改后再次申请复检。', reviewPhotos: ['复核现场1.jpg'] },
    { id: 'ZG202605140001', applyId: 'RX202605120002', merchant: '红星车行', shop: 'A08', type: '巡检异常', requirement: '门头施工未办理动火审批手续', deadline: '2026-05-16', issueTime: '2026-05-13 09:30', issuer: '赵经理（市场经营部）', needStop: false, fromInspect: true, recheckApplyTime: '2026-05-15 11:00', attachmentDesc: '已补办动火审批手续，附审批单及现场照片。', attachments: ['动火审批单.pdf'], rectificationPhotos: ['审批单.jpg', '现场照片.jpg'], rejectTime: '2026-05-15 15:20', reviewer: '赵经理', reviewResult: 'reject', reviewOpinion: '动火审批手续时间覆盖范围不足，请补充有效期内的完整审批材料。', reviewPhotos: ['复核现场1.jpg', '复核现场2.jpg'] }
  ]
}

function findRectifyItem(id, tab) {
  if (tab && RECTIFY_DATA[tab]) {
    const found = RECTIFY_DATA[tab].find(d => d.id === id)
    if (found) return found
  }
  const keys = ['pending', 'review', 'rejected', 'closed']
  for (let i = 0; i < keys.length; i++) {
    const found = (RECTIFY_DATA[keys[i]] || []).find(d => d.id === id)
    if (found) return found
  }
  return null
}

// ── 商户每日报备 ──
const DAILY_REPORT_TABS = [
  { key: 'reported', label: '已报备', badge: 0 },
  { key: 'overdue', label: '过期未报备', badge: 0 }
]

const DAILY_REPORT_DATA = [
  { id: 'MR001', applyId: 'RX202605110001', merchant: '北京拿铁旧机动车', shop: 'B08', certNo: 'SZ202605110001', reportDate: '2026-05-20', status: 'reported', reportTime: '2026-05-20 07:45', works: [
    { key: 'fire', reported: true, reportTime: '2026-05-20 07:30', content: '动火点周围10米可燃物已清理，配备灭火器2具，监护人李师傅在场，动火时段 09:00~12:00', certs: ['动火作业证_王焊工.pdf', '动火点现场.jpg'] },
    { key: 'electric', reported: true, reportTime: '2026-05-20 07:45', content: '临时用电线路已穿管保护，漏电保护器检测正常，总负荷约8kW，用电点位2处', certs: ['电工操作证_张电工.pdf', '配电箱近景.jpg'] }
  ] },
  { id: 'MR002', applyId: 'RX202605110001', merchant: '北京拿铁旧机动车', shop: 'B08', certNo: 'SZ202605110001', reportDate: '2026-05-19', status: 'reported', reportTime: '2026-05-19 08:10', works: [
    { key: 'fire', reported: true, reportTime: '2026-05-19 08:00', content: '动火作业已报备，现场监护人到岗', certs: ['动火作业证_王焊工.pdf'] },
    { key: 'electric', reported: true, reportTime: '2026-05-19 08:10', content: '临时用电验收合格，线路架空敷设', certs: ['电工操作证_张电工.pdf'] }
  ] },
  { id: 'MR003', applyId: 'RX202605010001', merchant: '瑞丰汽配', shop: 'B10', certNo: 'SZ202605010015', reportDate: '2026-05-20', status: 'overdue', reportTime: '', works: [
    { key: 'fire', reported: true, reportTime: '2026-05-20 08:00', content: '焊接作业区域已设警戒带，灭火器已就位，动火监护人张工已到岗', certs: ['动火作业证_李焊工.pdf'] },
    { key: 'height', reported: false, reportTime: '', content: '', certs: [] }
  ] },
  { id: 'MR005', applyId: 'RX202605030001', merchant: '嘉诚名车', shop: 'D07', certNo: 'SZ202605060016', reportDate: '2026-05-20', status: 'reported', reportTime: '2026-05-20 08:15', works: [
    { key: 'electric', reported: true, reportTime: '2026-05-20 08:15', content: '施工区临时用电已验收，线路架空敷设，配电箱上锁管理', certs: ['电工操作证_孙电工.pdf'] }
  ] },
  { id: 'MR006', applyId: 'RX202605120002', merchant: '红星车行', shop: 'A08', certNo: 'SZ202605100018', reportDate: '2026-05-20', status: 'overdue', reportTime: '', works: [
    { key: 'height', reported: false, reportTime: '', content: '', certs: [] }
  ] }
]

function enrichDailyReport(record) {
  const works = (record.works || []).map(w => {
    const meta = SPECIAL_WORK_META[w.key] || {}
    return {
      key: w.key,
      label: meta.label || w.key,
      cls: meta.cls || '',
      reported: !!w.reported,
      reportTime: w.reportTime || '',
      content: w.content || '',
      certs: w.certs || []
    }
  })
  const overdueLabels = works.filter(w => !w.reported).map(w => w.label)
  return Object.assign({}, record, {
    title: record.shop + ' - ' + record.merchant,
    works,
    overdueLabels,
    statusText: record.status === 'reported' ? '已报备' : '过期未报备'
  })
}

function filterDailyReportList(tab, applyId) {
  let list = DAILY_REPORT_DATA.map(enrichDailyReport)
  if (applyId) list = list.filter(d => d.applyId === applyId)
  if (tab) list = list.filter(d => d.status === tab)
  return list.sort((a, b) => (b.reportDate + b.reportTime).localeCompare(a.reportDate + a.reportTime))
}

function getDailyReportStats(applyId) {
  let list = DAILY_REPORT_DATA
  if (applyId) list = list.filter(d => d.applyId === applyId)
  const reported = list.filter(d => d.status === 'reported').length
  const overdue = list.filter(d => d.status === 'overdue').length
  return { reported, overdue, total: list.length }
}

module.exports = {
  CATEGORY_DEPT_MAP, MY_INSPECT_DEPT,
  CONSTRUCTION_TABS, CONSTRUCTION_DATA,
  getConstructionById, getConstructionCategoryItems, resolveCategoryDept,
  SPECIAL_WORK_META, SPECIAL_WORK_ORDER, SPECIAL_WORK_TODAY_BY_APPLY, MERCHANT_SELF_CHECK_BY_APPLY,
  getSpecialWorkTags, getMerchantSelfCheckList,
  INSPECT_TABS, INSPECT_DATA, findInspectItem,
  RECTIFY_TABS, RECTIFY_DATA, findRectifyItem,
  DAILY_REPORT_TABS, DAILY_REPORT_DATA,
  enrichDailyReport, filterDailyReportList, getDailyReportStats
}
