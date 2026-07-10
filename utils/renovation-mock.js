// 装修申请模块 Mock 数据

const TABS = [
  { key: 'all',                        label: '全部',          badge: 0 }, // 下方自动求和
  { key: 'pending-survey',            label: '待踏勘',        badge: 3 },
  { key: 'my-initial-review',         label: '待我审核',      badge: 2 },
  { key: 'secondary-review',          label: '踏勘审核中',    badge: 1 },
  { key: 'pending-submit-materials',  label: '待递交材料',    badge: 2 },
  { key: 'material-review',           label: '材料审核中',    badge: 1 },
  { key: 'approval-in-progress',      label: '审批中',        badge: 2 },
  { key: 'pending-merchant-payment',  label: '待商户缴费',    badge: 2 },
  { key: 'pending-payment',           label: '待支付确认',    badge: 1 },
  { key: 'pending-sign',              label: '待签署',        badge: 2 },
  { key: 'pending-certificate',       label: '待下证',        badge: 2 },
  { key: 'under-construction',        label: '施工中',        badge: 2 },
  { key: 'pending-acceptance',        label: '待验收',        badge: 1 },
  { key: 'completed',                 label: '已完成',        badge: 3 },
  { key: 'rejected',                  label: '已驳回',        badge: 1 }
]
TABS[0].badge = TABS.slice(1).reduce((sum, t) => sum + t.badge, 0)

// 每个 Tab 对应的状态文字和样式
const STATUS_MAP = {
  'pending-survey':           { text: '待踏勘',        cls: 'status-orange' },
  'my-initial-review':        { text: '待我审核',      cls: 'status-orange' },
  'secondary-review':         { text: '踏勘审核中',    cls: 'status-orange' },
  'pending-submit-materials': { text: '待递交材料',    cls: 'status-orange' },
  'material-review':          { text: '材料审核中',    cls: 'status-orange' },
  'approval-in-progress':     { text: '审批中',        cls: 'status-orange' },
  'pending-merchant-payment': { text: '待商户缴费',    cls: 'status-orange' },
  'pending-payment':          { text: '待支付确认',    cls: 'status-orange' },
  'pending-sign':             { text: '待签署',        cls: 'status-orange' },
  'pending-certificate':      { text: '待下证',        cls: 'status-orange' },
  'under-construction':       { text: '施工中',        cls: 'status-orange' },
  'pending-acceptance':       { text: '待验收',        cls: 'status-orange' },
  'completed':                { text: '已完成',        cls: 'status-green'  },
  'rejected':                 { text: '已驳回',        cls: 'status-red'    }
}

const TASK_DATA = {
  'pending-survey': [
    { id: 'RX003', title: '优车之家 - C05',  tags: ['电气改造'],              date: '2026-05-13 09:00', level: 1 },
    { id: 'RX010', title: '盛达车业 - A09',  tags: ['门头广告', '给排水'],    date: '2026-05-13 14:20', level: 2 },
    { id: 'RX011', title: '华晨名车 - D11',  tags: ['基建改造'],              date: '2026-05-14 08:30', level: 2 }
  ],
  'my-initial-review': [
    { id: 'RX001', title: '北京拿铁旧机动车 - B08', tags: ['门头广告', '基建改造'], date: '2026-05-11 10:30', level: 3 },
    { id: 'RX012', title: '天宇车行 - B06',         tags: ['消防系统'],            date: '2026-05-12 15:00', level: 2 }
  ],
  'secondary-review': [
    { id: 'RX002', title: '北京车天下 - A12', tags: ['消防系统'], date: '2026-05-08 11:00', level: 2 }
  ],
  'pending-submit-materials': [
    { id: 'RX005', title: '驰骋车行 - B15',  tags: ['基建改造', '消防系统'], rejectTag: '踏勘审核驳回', date: '2026-05-06 09:30', level: 3 },
    { id: 'RX013', title: '鼎盛汽贸 - C03',  tags: ['门头广告'],             date: '2026-05-07 10:00', level: 1 }
  ],
  'material-review': [
    { id: 'RX004', title: '鑫达名车 - D03', tags: ['门头广告'], date: '2026-05-05 14:00', level: 1 }
  ],
  'approval-in-progress': [
    { id: 'RX027', title: '红星车行 - A08', tags: ['门头广告', '基建改造'], date: '2026-05-08 11:00', level: 3 },
    { id: 'RX028', title: '金鹏汽贸 - B02', tags: ['电气改造'],             date: '2026-05-07 15:30', level: 1 }
  ],
  'pending-merchant-payment': [
    { id: 'RX024', title: '中联车行 - A15',  tags: ['基建改造', '电气改造'], date: '2026-05-09 16:00', level: 3 },
    { id: 'RX025', title: '鼎盛汽贸 - C03',  tags: ['门头广告', '消防系统'], date: '2026-05-08 16:30', level: 3 }
  ],
  'pending-payment': [
    { id: 'RX014', title: '宏远车城 - A03', tags: ['基建改造'], date: '2026-05-09 16:00', level: 2 }
  ],
  'pending-sign': [
    { id: 'RX024', title: '中联车行 - A15',  tags: ['基建改造', '电气改造'], date: '2026-05-12 15:00', level: 3 },
    { id: 'RX025', title: '鼎盛汽贸 - C03',  tags: ['门头广告', '消防系统'], date: '2026-05-12 14:30', level: 3 }
  ],
  'pending-certificate': [
    { id: 'RX024', title: '中联车行 - A15',  tags: ['基建改造', '电气改造'], date: '2026-05-13 09:00', level: 3 },
    { id: 'RX025', title: '鼎盛汽贸 - C03',  tags: ['门头广告', '消防系统'], date: '2026-05-12 16:00', level: 3 }
  ],
  'under-construction': [
    { id: 'RX015', title: '瑞丰汽配 - B10',  tags: ['门头广告', '基建改造'], date: '2026-05-01 08:00', level: 3 },
    { id: 'RX016', title: '嘉诚名车 - D07',  tags: ['消防系统', '电气改造'], date: '2026-05-03 09:00', level: 3 }
  ],
  'pending-acceptance': [
    { id: 'RX017', title: '鹏达车业 - C12', tags: ['门头广告'], date: '2026-04-25 10:00', level: 1 }
  ],
  'completed': [
    { id: 'RX004', title: '鑫达名车 - D03',  tags: ['门头广告'],             date: '2026-04-20 10:00', level: 1 },
    { id: 'RX018', title: '宏远车城 - A03',  tags: ['基建改造'],             date: '2026-04-15 14:00', level: 2 },
    { id: 'RX019', title: '金鹏汽贸 - B02',  tags: ['门头广告', '电气改造'], date: '2026-04-10 09:30', level: 2 }
  ],
  'rejected': [
    { id: 'RX005', title: '驰骋车行 - B15',  tags: ['基建改造', '消防系统'], rejectTag: '踏勘审核驳回', date: '2026-05-06 09:30', level: 3 },
    { id: 'RX026', title: '华晨名车 - D11',  tags: ['门头广告', '电气改造'], rejectTag: '材料审核驳回', date: '2026-05-05 14:00', level: 2 }
  ]
}

// 详情页：步骤索引（用于判断显示哪些附件）
const STEP_INDEX = {
  'pending-survey': 0,
  'my-initial-review': 1,
  'secondary-review': 2,
  'pending-submit-materials': 3,
  'material-review': 4,
  'approval-in-progress': 5,
  'pending-merchant-payment': 6,
  'pending-payment': 7,
  'pending-sign': 8,
  'pending-certificate': 9,
  'under-construction': 10,
  'pending-acceptance': 11,
  'completed': 12,
  'rejected': 3
}

// 详情页：底部按钮配置
const BTN_CONFIG = {
  'pending-survey':           { action: 'survey',           text: '签到踏勘'   },
  'my-initial-review':        { action: 'review',           text: '立即审核'   },
  'secondary-review':         { action: 'back',             text: '返回列表'   },
  'pending-submit-materials': { action: 'confirm-material', text: '确认接收材料' },
  'material-review':          { action: 'back',             text: '返回列表'   },
  'approval-in-progress':     { action: 'approve',          text: '立即审批'   },
  'pending-merchant-payment': { action: 'back',             text: '返回列表'   },
  'pending-payment':          { action: 'confirm-payment',  text: '确认收款'   },
  'pending-sign':             { action: 'back',             text: '返回列表'   },
  'pending-certificate':      { action: 'back',             text: '返回列表'   },
  'under-construction':       { action: 'back',             text: '返回列表'   },
  'pending-acceptance':       { action: 'back',             text: '返回列表'   },
  'completed':                { action: 'back',             text: '返回列表'   },
  'rejected':                 { action: 'back',             text: '返回列表'   }
}

// 装修类目（固定，每个申请都有这4类）
const BASE_CATEGORIES = [
  { name: '门头广告',  dept: '市场经营部', isMyDept: true,  projects: [
    { name: '招牌更换',    level: 2 },
    { name: '灯箱安装',    level: 1 }
  ]},
  { name: '基建改造',  dept: '管理部',     isMyDept: false, projects: [
    { name: '隔墙拆除',    level: 3 },
    { name: '地面找平',    level: 2 }
  ]},
  { name: '消防系统',  dept: '安保部',     isMyDept: false, projects: [
    { name: '消防栓移位',  level: 3 }
  ]},
  { name: '电气改造',  dept: '管理部',     isMyDept: false, projects: [
    { name: '电表',        level: 1 },
    { name: '水表读数确认', level: 1 }
  ]}
]

function getCategoryStatus(isMyDept, globalStatus, catName) {
  const map = {
    'pending-survey':           () => ({ text: '待踏勘',    cls: 'status-orange' }),
    'my-initial-review':        () => isMyDept ? { text: '待我审核', cls: 'status-orange' } : { text: '已审核', cls: 'status-green' },
    'secondary-review':         () => isMyDept ? { text: '已审核', cls: 'status-green' } : { text: '踏勘审核中', cls: 'status-orange' },
    'pending-submit-materials': () => ({ text: '已审核',    cls: 'status-green'  }),
    'material-review':          () => ({ text: '已审核',    cls: 'status-green'  }),
    'approval-in-progress':     () => ({ text: '已审核',    cls: 'status-green'  }),
    'pending-merchant-payment': () => ({ text: '已审核',    cls: 'status-green'  }),
    'pending-payment':          () => ({ text: '已审核',    cls: 'status-green'  }),
    'pending-sign':             () => ({ text: '已审核',    cls: 'status-green'  }),
    'pending-certificate':      () => ({ text: '已审核',    cls: 'status-green'  }),
    'under-construction':       () => ({ text: '施工中',    cls: 'status-orange' }),
    'pending-acceptance':       () => ({ text: '待验收',    cls: 'status-orange' }),
    'completed':                () => ({ text: '已完成',    cls: 'status-green'  }),
    'rejected':                 () => catName === '基建改造' ? { text: '已驳回', cls: 'status-red' } : { text: '已通过', cls: 'status-green' }
  }
  const fn = map[globalStatus]
  return fn ? fn() : { text: '未知', cls: 'status-gray' }
}

// 时间线数据（与新版产品原型 20260518 同步）
// result 值：'pass' | 'reject' | 'waiting' | 'not-surveyed'
const TIMELINES = {
  'pending-survey': [
    { dept: '工程部初审',             result: 'waiting',      text: '审核中', person: '周工程', time: '' },
    { dept: '安保部初审',             result: 'waiting',      text: '审核中', person: '李安保', time: '' },
    { dept: '物业部踏勘签到',         result: 'not-surveyed', text: '待踏勘', person: '赵经理', time: '—' },
    { dept: '工程部踏勘签到',         result: 'pass',         text: '已签到', person: '周工程', time: '2026-05-12 09:15' },
    { dept: '安保部踏勘签到',         result: 'pass',         text: '已签到', person: '李安保', time: '2026-05-12 09:30' },
    { dept: '商户提交申请',           result: 'pass',         text: '已完成', person: '王经理', time: '2026-05-11 10:30', opinion: '已提交装修申请' }
  ],
  'my-initial-review': [
    { dept: '工程部初审',             result: 'waiting', text: '审核中', person: '周工程', time: '' },
    { dept: '物业部初审',             result: 'pass',    text: '已通过', person: '赵经理', time: '2026-05-13 11:00' },
    { dept: '安保部踏勘签到',         result: 'pass',    text: '已签到', person: '李安保', time: '2026-05-12 09:30' },
    { dept: '工程部踏勘签到',         result: 'pass',    text: '已签到', person: '周工程', time: '2026-05-12 09:15' },
    { dept: '物业部踏勘签到',         result: 'pass',    text: '已签到', person: '赵经理', time: '2026-05-12 09:00' },
    { dept: '商户提交申请',           result: 'pass',    text: '已完成', person: '王经理', time: '2026-05-11 10:30', opinion: '已提交装修申请' }
  ],
  'secondary-review': [
    { dept: '物业部主任审核',         result: 'waiting', text: '审核中', person: '赵主任', time: '' },
    { dept: '工程部初审',             result: 'pass',    text: '已通过', person: '周工程', time: '2026-05-13 14:00' },
    { dept: '安保部初审',             result: 'pass',    text: '已通过', person: '李安保', time: '2026-05-13 09:30' },
    { dept: '物业部初审',             result: 'pass',    text: '已通过', person: '赵经理', time: '2026-05-13 11:00' },
    { dept: '安保部踏勘签到',         result: 'pass',    text: '已签到', person: '李安保', time: '2026-05-12 09:30' },
    { dept: '工程部踏勘签到',         result: 'pass',    text: '已签到', person: '周工程', time: '2026-05-12 09:15' },
    { dept: '物业部踏勘签到',         result: 'pass',    text: '已签到', person: '赵经理', time: '2026-05-12 09:00' },
    { dept: '商户提交申请',           result: 'pass',    text: '已完成', person: '王经理', time: '2026-05-11 10:30', opinion: '已提交装修申请' }
  ],
  'pending-submit-materials': [
    { dept: '市场物业部提醒递交材料', result: 'waiting', text: '待递交', person: '', time: '', opinion: '请将材料递交至物业前台' },
    { dept: '物业部主任审核',         result: 'pass',    text: '已通过', person: '赵主任', time: '2026-05-10 16:00' },
    { dept: '工程部主任审核',         result: 'pass',    text: '已通过', person: '周主任', time: '2026-05-10 15:30' },
    { dept: '安保部主任审核',         result: 'pass',    text: '已通过', person: '李主任', time: '2026-05-10 15:00' },
    { dept: '物业部员工初审',         result: 'pass',    text: '已通过', person: '赵经理', time: '2026-05-10 14:30' },
    { dept: '工程部员工初审',         result: 'pass',    text: '已通过', person: '周工程', time: '2026-05-10 14:00' },
    { dept: '安保部员工初审',         result: 'pass',    text: '已通过', person: '李安保', time: '2026-05-10 11:30' },
    { dept: '安保部踏勘签到',         result: 'pass',    text: '已签到', person: '李安保', time: '2026-05-10 10:30' },
    { dept: '工程部踏勘签到',         result: 'pass',    text: '已签到', person: '周工程', time: '2026-05-10 10:15' },
    { dept: '物业部踏勘签到',         result: 'pass',    text: '已签到', person: '赵经理', time: '2026-05-10 10:00' },
    { dept: '商户提交申请',           result: 'pass',    text: '已完成', person: '王经理', time: '2026-05-10 09:00', opinion: '已提交装修申请' }
  ],
  'material-review': [
    { dept: '物业部审核材料',         result: 'waiting', text: '审核中', person: '李工',   time: '' },
    { dept: '物业部接收材料',         result: 'pass',    text: '已接收', person: '赵经理', time: '2026-05-11 09:00' },
    { dept: '市场物业部提醒递交材料', result: 'pass',    text: '已提醒', person: '赵经理', time: '2026-05-10 16:30' },
    { dept: '物业部主任审核',         result: 'pass',    text: '已通过', person: '赵主任', time: '2026-05-10 16:00' },
    { dept: '工程部主任审核',         result: 'pass',    text: '已通过', person: '周主任', time: '2026-05-10 15:30' },
    { dept: '安保部主任审核',         result: 'pass',    text: '已通过', person: '李主任', time: '2026-05-10 15:00' },
    { dept: '物业部员工初审',         result: 'pass',    text: '已通过', person: '赵经理', time: '2026-05-10 14:30' },
    { dept: '工程部员工初审',         result: 'pass',    text: '已通过', person: '周工程', time: '2026-05-10 14:00' },
    { dept: '安保部员工初审',         result: 'pass',    text: '已通过', person: '李安保', time: '2026-05-10 11:30' },
    { dept: '安保部踏勘签到',         result: 'pass',    text: '已签到', person: '李安保', time: '2026-05-10 10:30' },
    { dept: '工程部踏勘签到',         result: 'pass',    text: '已签到', person: '周工程', time: '2026-05-10 10:15' },
    { dept: '物业部踏勘签到',         result: 'pass',    text: '已签到', person: '赵经理', time: '2026-05-10 10:00' },
    { dept: '商户提交申请',           result: 'pass',    text: '已完成', person: '王经理', time: '2026-05-10 09:00', opinion: '已提交装修申请' }
  ],
  'approval-in-progress': [
    { dept: '营运部副总审批',         result: 'waiting', text: '审批中', person: '刘副总', time: '' },
    { dept: '安保部副总审批',         result: 'pass',    text: '已通过', person: '钱副总', time: '2026-05-12 11:00' },
    { dept: '工程部副总审批',         result: 'pass',    text: '已通过', person: '孙副总', time: '2026-05-12 10:30' },
    { dept: '物业部副总审批',         result: 'pass',    text: '已通过', person: '吴副总', time: '2026-05-12 10:00' },
    { dept: '物业部审核材料',         result: 'pass',    text: '已通过', person: '李工',   time: '2026-05-11 16:00', opinion: '材料齐全，审核通过' },
    { dept: '物业部接收材料',         result: 'pass',    text: '已接收', person: '赵经理', time: '2026-05-11 09:00' },
    { dept: '市场物业部提醒递交材料', result: 'pass',    text: '已提醒', person: '赵经理', time: '2026-05-10 16:30' },
    { dept: '物业部主任审核',         result: 'pass',    text: '已通过', person: '赵主任', time: '2026-05-10 16:00' },
    { dept: '工程部主任审核',         result: 'pass',    text: '已通过', person: '周主任', time: '2026-05-10 15:30' },
    { dept: '安保部主任审核',         result: 'pass',    text: '已通过', person: '李主任', time: '2026-05-10 15:00' },
    { dept: '物业部员工初审',         result: 'pass',    text: '已通过', person: '赵经理', time: '2026-05-10 14:30' },
    { dept: '工程部员工初审',         result: 'pass',    text: '已通过', person: '周工程', time: '2026-05-10 14:00' },
    { dept: '安保部员工初审',         result: 'pass',    text: '已通过', person: '李安保', time: '2026-05-10 11:30' },
    { dept: '安保部踏勘签到',         result: 'pass',    text: '已签到', person: '李安保', time: '2026-05-10 10:30' },
    { dept: '工程部踏勘签到',         result: 'pass',    text: '已签到', person: '周工程', time: '2026-05-10 10:15' },
    { dept: '物业部踏勘签到',         result: 'pass',    text: '已签到', person: '赵经理', time: '2026-05-10 10:00' },
    { dept: '商户提交申请',           result: 'pass',    text: '已完成', person: '王经理', time: '2026-05-10 09:00', opinion: '已提交装修申请' }
  ],
  'pending-merchant-payment': [
    { dept: '待商户缴纳装修保证金',   result: 'waiting', text: '待缴费', person: '', time: '', opinion: '等待商户缴纳装修保证金' },
    { dept: '营运部副总审批',         result: 'pass',    text: '已通过', person: '刘副总', time: '2026-05-12 11:30' },
    { dept: '安保部副总审批',         result: 'pass',    text: '已通过', person: '钱副总', time: '2026-05-12 11:00' },
    { dept: '工程部副总审批',         result: 'pass',    text: '已通过', person: '孙副总', time: '2026-05-12 09:30' },
    { dept: '物业部副总审批',         result: 'pass',    text: '已通过', person: '吴副总', time: '2026-05-12 09:00' },
    { dept: '物业部审核材料',         result: 'pass',    text: '已通过', person: '李工',   time: '2026-05-11 16:00', opinion: '材料齐全，审核通过' },
    { dept: '物业部接收材料',         result: 'pass',    text: '已接收', person: '赵经理', time: '2026-05-11 09:00' },
    { dept: '市场物业部提醒递交材料', result: 'pass',    text: '已提醒', person: '赵经理', time: '2026-05-10 16:30' },
    { dept: '物业部主任审核',         result: 'pass',    text: '已通过', person: '赵主任', time: '2026-05-10 16:00' },
    { dept: '工程部主任审核',         result: 'pass',    text: '已通过', person: '周主任', time: '2026-05-10 15:30' },
    { dept: '安保部主任审核',         result: 'pass',    text: '已通过', person: '李主任', time: '2026-05-10 15:00' },
    { dept: '物业部员工初审',         result: 'pass',    text: '已通过', person: '赵经理', time: '2026-05-10 14:30' },
    { dept: '工程部员工初审',         result: 'pass',    text: '已通过', person: '周工程', time: '2026-05-10 14:00' },
    { dept: '安保部员工初审',         result: 'pass',    text: '已通过', person: '李安保', time: '2026-05-10 11:30' },
    { dept: '安保部踏勘签到',         result: 'pass',    text: '已签到', person: '李安保', time: '2026-05-10 10:30' },
    { dept: '工程部踏勘签到',         result: 'pass',    text: '已签到', person: '周工程', time: '2026-05-10 10:15' },
    { dept: '物业部踏勘签到',         result: 'pass',    text: '已签到', person: '赵经理', time: '2026-05-10 10:00' },
    { dept: '商户提交申请',           result: 'pass',    text: '已完成', person: '王经理', time: '2026-05-10 09:00', opinion: '已提交装修申请' }
  ],
  'pending-payment': [
    { dept: '待支付确认',             result: 'waiting', text: '待确认', person: '', time: '', opinion: '等待财务确认收款' },
    { dept: '商户上传缴费凭证',       result: 'pass',    text: '已上传', person: '王经理', time: '2026-05-12 14:00', opinion: '已缴纳装修保证金' },
    { dept: '待商户缴纳装修保证金',   result: 'pass',    text: '已缴费', person: '王经理', time: '2026-05-12 13:30' },
    { dept: '安保部副总审批',         result: 'pass',    text: '已通过', person: '钱副总', time: '2026-05-12 10:00' },
    { dept: '工程部副总审批',         result: 'pass',    text: '已通过', person: '孙副总', time: '2026-05-12 09:30' },
    { dept: '物业部副总审批',         result: 'pass',    text: '已通过', person: '吴副总', time: '2026-05-12 09:00' },
    { dept: '物业部审核材料',         result: 'pass',    text: '已通过', person: '李工',   time: '2026-05-11 16:00', opinion: '材料齐全，审核通过' },
    { dept: '物业部接收材料',         result: 'pass',    text: '已接收', person: '赵经理', time: '2026-05-11 09:00' },
    { dept: '市场物业部提醒递交材料', result: 'pass',    text: '已提醒', person: '赵经理', time: '2026-05-10 16:30' },
    { dept: '物业部主任审核',         result: 'pass',    text: '已通过', person: '赵主任', time: '2026-05-10 16:00' },
    { dept: '工程部主任审核',         result: 'pass',    text: '已通过', person: '周主任', time: '2026-05-10 15:30' },
    { dept: '安保部主任审核',         result: 'pass',    text: '已通过', person: '李主任', time: '2026-05-10 15:00' },
    { dept: '物业部员工初审',         result: 'pass',    text: '已通过', person: '赵经理', time: '2026-05-10 14:30' },
    { dept: '工程部员工初审',         result: 'pass',    text: '已通过', person: '周工程', time: '2026-05-10 14:00' },
    { dept: '安保部员工初审',         result: 'pass',    text: '已通过', person: '李安保', time: '2026-05-10 11:30' },
    { dept: '安保部踏勘签到',         result: 'pass',    text: '已签到', person: '李安保', time: '2026-05-10 10:30' },
    { dept: '工程部踏勘签到',         result: 'pass',    text: '已签到', person: '周工程', time: '2026-05-10 10:15' },
    { dept: '物业部踏勘签到',         result: 'pass',    text: '已签到', person: '赵经理', time: '2026-05-10 10:00' },
    { dept: '商户提交申请',           result: 'pass',    text: '已完成', person: '王经理', time: '2026-05-10 09:00', opinion: '已提交装修申请' }
  ],
  'pending-sign': [
    { dept: '待签署安全协议',         result: 'waiting', text: '待签署', person: '', time: '', opinion: '请通知商户到安保部签署安全协议' },
    { dept: '财务确认收款',           result: 'pass',    text: '已确认', person: '陈财务', time: '2026-05-12 16:00' },
    { dept: '商户上传缴费凭证',       result: 'pass',    text: '已上传', person: '王经理', time: '2026-05-12 14:00', opinion: '已缴纳装修保证金' },
    { dept: '待商户缴纳装修保证金',   result: 'pass',    text: '已缴费', person: '王经理', time: '2026-05-12 13:30' },
    { dept: '安保部副总审批',         result: 'pass',    text: '已通过', person: '钱副总', time: '2026-05-12 10:00' },
    { dept: '工程部副总审批',         result: 'pass',    text: '已通过', person: '孙副总', time: '2026-05-12 09:30' },
    { dept: '物业部副总审批',         result: 'pass',    text: '已通过', person: '吴副总', time: '2026-05-12 09:00' },
    { dept: '物业部审核材料',         result: 'pass',    text: '已通过', person: '李工',   time: '2026-05-11 16:00', opinion: '材料齐全，审核通过' },
    { dept: '物业部接收材料',         result: 'pass',    text: '已接收', person: '赵经理', time: '2026-05-11 09:00' },
    { dept: '市场物业部提醒递交材料', result: 'pass',    text: '已提醒', person: '赵经理', time: '2026-05-10 16:30' },
    { dept: '物业部主任审核',         result: 'pass',    text: '已通过', person: '赵主任', time: '2026-05-10 16:00' },
    { dept: '工程部主任审核',         result: 'pass',    text: '已通过', person: '周主任', time: '2026-05-10 15:30' },
    { dept: '安保部主任审核',         result: 'pass',    text: '已通过', person: '李主任', time: '2026-05-10 15:00' },
    { dept: '物业部员工初审',         result: 'pass',    text: '已通过', person: '赵经理', time: '2026-05-10 14:30' },
    { dept: '工程部员工初审',         result: 'pass',    text: '已通过', person: '周工程', time: '2026-05-10 14:00' },
    { dept: '安保部员工初审',         result: 'pass',    text: '已通过', person: '李安保', time: '2026-05-10 11:30' },
    { dept: '安保部踏勘签到',         result: 'pass',    text: '已签到', person: '李安保', time: '2026-05-10 10:30' },
    { dept: '工程部踏勘签到',         result: 'pass',    text: '已签到', person: '周工程', time: '2026-05-10 10:15' },
    { dept: '物业部踏勘签到',         result: 'pass',    text: '已签到', person: '赵经理', time: '2026-05-10 10:00' },
    { dept: '商户提交申请',           result: 'pass',    text: '已完成', person: '王经理', time: '2026-05-10 09:00', opinion: '已提交装修申请' }
  ],
  'pending-certificate': [
    { dept: '待下证',                 result: 'waiting', text: '待下证', person: '', time: '', opinion: '请等管理部生成施工证' },
    { dept: '安保部上传安全协议',     result: 'pass',    text: '已上传', person: '李安保', time: '2026-05-13 10:00' },
    { dept: '商户签署安全协议',       result: 'pass',    text: '已签署', person: '王经理', time: '2026-05-13 09:30', opinion: '已在安保部签署安全协议' },
    { dept: '财务确认收款',           result: 'pass',    text: '已确认', person: '陈财务', time: '2026-05-12 16:00' },
    { dept: '商户上传缴费凭证',       result: 'pass',    text: '已上传', person: '王经理', time: '2026-05-12 14:00', opinion: '已缴纳装修保证金' },
    { dept: '待商户缴纳装修保证金',   result: 'pass',    text: '已缴费', person: '王经理', time: '2026-05-12 13:30' },
    { dept: '安保部副总审批',         result: 'pass',    text: '已通过', person: '钱副总', time: '2026-05-12 10:00' },
    { dept: '工程部副总审批',         result: 'pass',    text: '已通过', person: '孙副总', time: '2026-05-12 09:30' },
    { dept: '物业部副总审批',         result: 'pass',    text: '已通过', person: '吴副总', time: '2026-05-12 09:00' },
    { dept: '物业部审核材料',         result: 'pass',    text: '已通过', person: '李工',   time: '2026-05-11 16:00', opinion: '材料齐全，审核通过' },
    { dept: '物业部接收材料',         result: 'pass',    text: '已接收', person: '赵经理', time: '2026-05-11 09:00' },
    { dept: '市场物业部提醒递交材料', result: 'pass',    text: '已提醒', person: '赵经理', time: '2026-05-10 16:30' },
    { dept: '物业部主任审核',         result: 'pass',    text: '已通过', person: '赵主任', time: '2026-05-10 16:00' },
    { dept: '工程部主任审核',         result: 'pass',    text: '已通过', person: '周主任', time: '2026-05-10 15:30' },
    { dept: '安保部主任审核',         result: 'pass',    text: '已通过', person: '李主任', time: '2026-05-10 15:00' },
    { dept: '物业部员工初审',         result: 'pass',    text: '已通过', person: '赵经理', time: '2026-05-10 14:30' },
    { dept: '工程部员工初审',         result: 'pass',    text: '已通过', person: '周工程', time: '2026-05-10 14:00' },
    { dept: '安保部员工初审',         result: 'pass',    text: '已通过', person: '李安保', time: '2026-05-10 11:30' },
    { dept: '安保部踏勘签到',         result: 'pass',    text: '已签到', person: '李安保', time: '2026-05-10 10:30' },
    { dept: '工程部踏勘签到',         result: 'pass',    text: '已签到', person: '周工程', time: '2026-05-10 10:15' },
    { dept: '物业部踏勘签到',         result: 'pass',    text: '已签到', person: '赵经理', time: '2026-05-10 10:00' },
    { dept: '商户提交申请',           result: 'pass',    text: '已完成', person: '王经理', time: '2026-05-10 09:00', opinion: '已提交装修申请' }
  ],
  'under-construction': [
    { dept: '系统生成施工证',         result: 'pass', text: '已生成', person: '系统',   time: '2026-05-01 08:30' },
    { dept: '安保部上传安全协议',     result: 'pass', text: '已上传', person: '李安保', time: '2026-05-13 10:00' },
    { dept: '商户签署安全协议',       result: 'pass', text: '已签署', person: '王经理', time: '2026-05-13 09:30', opinion: '已在安保部签署安全协议' },
    { dept: '财务确认收款',           result: 'pass', text: '已确认', person: '陈财务', time: '2026-05-12 16:00' },
    { dept: '商户上传缴费凭证',       result: 'pass', text: '已上传', person: '王经理', time: '2026-05-12 14:00', opinion: '已缴纳装修保证金' },
    { dept: '待商户缴纳装修保证金',   result: 'pass', text: '已缴费', person: '王经理', time: '2026-05-12 13:30' },
    { dept: '安保部副总审批',         result: 'pass', text: '已通过', person: '钱副总', time: '2026-05-12 10:00' },
    { dept: '工程部副总审批',         result: 'pass', text: '已通过', person: '孙副总', time: '2026-05-12 09:30' },
    { dept: '物业部副总审批',         result: 'pass', text: '已通过', person: '吴副总', time: '2026-05-12 09:00' },
    { dept: '物业部审核材料',         result: 'pass', text: '已通过', person: '李工',   time: '2026-05-11 16:00', opinion: '材料齐全，审核通过' },
    { dept: '物业部接收材料',         result: 'pass', text: '已接收', person: '赵经理', time: '2026-05-11 09:00' },
    { dept: '市场物业部提醒递交材料', result: 'pass', text: '已提醒', person: '赵经理', time: '2026-05-10 16:30' },
    { dept: '物业部主任审核',         result: 'pass', text: '已通过', person: '赵主任', time: '2026-05-10 16:00' },
    { dept: '工程部主任审核',         result: 'pass', text: '已通过', person: '周主任', time: '2026-05-10 15:30' },
    { dept: '安保部主任审核',         result: 'pass', text: '已通过', person: '李主任', time: '2026-05-10 15:00' },
    { dept: '物业部员工初审',         result: 'pass', text: '已通过', person: '赵经理', time: '2026-05-10 14:30' },
    { dept: '工程部员工初审',         result: 'pass', text: '已通过', person: '周工程', time: '2026-05-10 14:00' },
    { dept: '安保部员工初审',         result: 'pass', text: '已通过', person: '李安保', time: '2026-05-10 11:30' },
    { dept: '安保部踏勘签到',         result: 'pass', text: '已签到', person: '李安保', time: '2026-05-10 10:30' },
    { dept: '工程部踏勘签到',         result: 'pass', text: '已签到', person: '周工程', time: '2026-05-10 10:15' },
    { dept: '物业部踏勘签到',         result: 'pass', text: '已签到', person: '赵经理', time: '2026-05-10 10:00' },
    { dept: '商户提交申请',           result: 'pass', text: '已完成', person: '王经理', time: '2026-05-10 09:00', opinion: '已提交装修申请' }
  ],
  'pending-acceptance': [
    { dept: '物业部',     result: 'pass', text: '已审核', person: '李工',   time: '2026-05-13 15:00', opinion: '同意' },
    { dept: '安保部',     result: 'pass', text: '已审核', person: '刘经理', time: '2026-05-13 09:15', opinion: '消防方案合格' },
    { dept: '市场经营部', result: 'pass', text: '已审核', person: '赵经理', time: '2026-05-12 14:30', opinion: '踏勘完毕，方案可行' },
    { dept: '管理部',     result: 'pass', text: '已审核', person: '张主任', time: '2026-05-12 10:00', opinion: '同意' }
  ],
  'completed': [
    { dept: '物业部',     result: 'pass', text: '已审核', person: '李工',   time: '2026-05-13 15:00', opinion: '同意' },
    { dept: '安保部',     result: 'pass', text: '已审核', person: '刘经理', time: '2026-05-13 09:15', opinion: '消防方案合格' },
    { dept: '市场经营部', result: 'pass', text: '已审核', person: '赵经理', time: '2026-05-12 14:30', opinion: '踏勘完毕，方案可行' },
    { dept: '管理部',     result: 'pass', text: '已审核', person: '张主任', time: '2026-05-12 10:00', opinion: '同意' }
  ],
  'rejected': [
    { dept: '物业部主任审核', result: 'reject', text: '已驳回', person: '赵主任', time: '2026-05-13 10:00', opinion: '装修方案不符合规范，需修改后重新提交' },
    { dept: '工程部初审',     result: 'pass',   text: '已通过', person: '周工程', time: '2026-05-13 14:00' },
    { dept: '安保部初审',     result: 'pass',   text: '已通过', person: '李安保', time: '2026-05-13 09:30' },
    { dept: '物业部初审',     result: 'pass',   text: '已通过', person: '赵经理', time: '2026-05-13 11:00' },
    { dept: '安保部踏勘签到', result: 'pass',   text: '已签到', person: '李安保', time: '2026-05-12 09:30' },
    { dept: '工程部踏勘签到', result: 'pass',   text: '已签到', person: '周工程', time: '2026-05-12 09:15' },
    { dept: '物业部踏勘签到', result: 'pass',   text: '已签到', person: '赵经理', time: '2026-05-12 09:00' },
    { dept: '商户提交申请',   result: 'pass',   text: '已完成', person: '王经理', time: '2026-05-11 11:30', opinion: '已提交装修申请' }
  ]
}

// 构建详情页完整数据
function buildDetailData(status, applyId) {
  const stepIndex = STEP_INDEX[status] || 0
  const isConstruction = status === 'under-construction'

  // 商户信息
  const merchantInfo = isConstruction ? {
    title: '基本信息',
    rows: [
      { label: '申请编号', value: 'RX001' },
      { label: '商户名称', value: '北京拿铁旧机动车' },
      { label: '商铺号',   value: 'B08' },
      { label: '申请时间', value: '2026-05-01 08:00' },
      { label: '当前状态', value: '施工中', valueColor: '#1890FF' },
      { label: '施工期间', value: '2026-05-01 至 2026-06-30' },
      { label: '施工证号', value: 'SZ202605010001' }
    ],
    showCertLink: true
  } : {
    title: '商户信息',
    rows: [
      { label: '商户名称', value: '北京拿铁旧机动车经纪有限公司' },
      { label: '商铺号',   value: 'B08' },
      { label: '联系人',   value: '王经理 138****1234' },
      { label: '申请时间', value: '2026-05-11 10:30' }
    ],
    showCertLink: false
  }

  // 类目卡片
  const categories = BASE_CATEGORIES.map(cat => {
    const s = getCategoryStatus(cat.isMyDept, status, cat.name)
    return { ...cat, statusText: s.text, statusCls: s.cls }
  })

  // 附件资料（扁平列表，type:'divider' 为分割线）
  // 顺序：营业执照 → 分割线 → 施工材料 → (分割线 → 付款凭证) → (分割线 → 安全协议)
  const attachments = []

  if (stepIndex >= 3) {
    attachments.push({ label: '营业执照', type: 'pdf', name: '营业执照.pdf' })
    attachments.push({ type: 'divider' })
  }

  attachments.push(
    { label: '施工方案', type: 'pdf', name: '装修平面图.pdf' },
    { label: '施工图纸', type: 'img', name: '装修效果图.jpg' },
    { label: '施工合同', type: 'pdf', name: '施工合同.pdf' },
    { label: '施工资质', type: 'pdf', name: '施工资质证书.pdf' }
  )
  if (stepIndex >= 5 || status === 'rejected') {
    attachments.push({ label: '门头效果图', type: 'img', name: '门头效果图.jpg' })
  }

  if (stepIndex >= 7) {
    attachments.push({ type: 'divider' })
    attachments.push({ label: '付款凭证', type: 'img', name: '付款凭证.jpg' })
  }

  if (stepIndex >= 8) {
    attachments.push({ type: 'divider' })
    attachments.push({ label: '安全协议', type: 'pdf', name: '安全协议.pdf' })
  }

  // 时间线
  const timeline = (TIMELINES[status] || []).map(item => ({
    ...item,
    dotCls: item.result === 'pass' ? 'dot-pass' : item.result === 'reject' ? 'dot-reject' : item.result === 'not-surveyed' ? 'dot-not-surveyed' : 'dot-waiting',
    statusCls: item.result === 'pass' ? 'tl-pass' : item.result === 'reject' ? 'tl-reject' : item.result === 'not-surveyed' ? 'tl-not-surveyed' : 'tl-waiting'
  }))

  // 底部按钮
  const btnCfg = BTN_CONFIG[status] || { action: 'back', text: '返回列表' }

  // 增项申请记录（施工中及以后显示）
  let addItemRecords = []
  if (stepIndex >= 10) {
    const targetId = applyId || (TASK_DATA[status] && TASK_DATA[status][0] ? TASK_DATA[status][0].id : '')
    if (targetId) {
      Object.keys(ADD_ITEM_DATA).forEach(tabKey => {
        (ADD_ITEM_DATA[tabKey] || []).forEach(item => {
          if (item.applyId === targetId) {
            addItemRecords.push({ id: item.id, categories: item.addCategories, date: item.date, tab: tabKey })
          }
        })
      })
    }
  }

  return {
    merchantInfo,
    categories,
    attachments,
    timeline,
    btnAction: btnCfg.action,
    btnText: btnCfg.text,
    addItemRecords
  }
}

// =========================================================
// 商户端 — 我的装修申请
// =========================================================

const MERCHANT_TABS = [
  { key: 'all',                 label: '全部',        badge: 0 }, // 下方自动求和
  { key: 'draft',               label: '草稿',       badge: 0 },
  { key: 'reviewing',           label: '踏勘审核中', badge: 2 },
  { key: 'pending-submit',      label: '待递交材料', badge: 1 },
  { key: 'material-review',     label: '材料审核中', badge: 2 },
  { key: 'approving',           label: '审批中',     badge: 1 },
  { key: 'pending-payment',     label: '待缴费',     badge: 2 },
  { key: 'pending-confirm',     label: '待支付确认', badge: 1 },
  { key: 'pending-sign',        label: '待签署',     badge: 2 },
  { key: 'pending-certificate', label: '待下证',     badge: 2 },
  { key: 'under-construction',  label: '施工中',     badge: 2 },
  { key: 'work-stopped',        label: '停工整改',   badge: 2 },
  { key: 'pending-acceptance',  label: '验收中',     badge: 2 },
  { key: 'completed',           label: '已验收',     badge: 3 },
  { key: 'rejected',            label: '已驳回',     badge: 2 }
]
MERCHANT_TABS[0].badge = MERCHANT_TABS.slice(1).reduce((sum, t) => sum + t.badge, 0)

const MERCHANT_STATUS_CONFIG = {
  'draft':               { text: '草稿',       cls: 'status-orange', stepIndex: 0  },
  'reviewing':           { text: '踏勘审核中', cls: 'status-orange', stepIndex: 1  },
  'pending-submit':      { text: '待递交材料', cls: 'status-orange', stepIndex: 2  },
  'material-review':     { text: '材料审核中', cls: 'status-orange', stepIndex: 3  },
  'approving':           { text: '审批中',     cls: 'status-orange', stepIndex: 4  },
  'pending-payment':     { text: '待缴费',     cls: 'status-orange', stepIndex: 5  },
  'pending-confirm':     { text: '待支付确认', cls: 'status-orange', stepIndex: 6  },
  'pending-sign':        { text: '待签署',     cls: 'status-orange', stepIndex: 7  },
  'pending-certificate': { text: '待下证',     cls: 'status-orange', stepIndex: 8  },
  'under-construction':  { text: '施工中',     cls: 'status-blue',   stepIndex: 9  },
  'work-stopped':        { text: '停工整改',   cls: 'status-red',    stepIndex: 9  },
  'pending-acceptance':  { text: '验收中',     cls: 'status-orange', stepIndex: 10 },
  'completed':           { text: '已验收',     cls: 'status-green',  stepIndex: 11 },
  'rejected':            { text: '已驳回',     cls: 'status-red',    stepIndex: -1 }
}

// 停工整改 / 验收中 两个 tab 内，卡片状态标签会随子状态变化，故提供独立取值函数
function getWorkStoppedCardStatus(item) {
  if (item.reinspectRejected) return { text: '复检驳回', cls: 'status-red' }
  if (item.reinspectSubmitted) return { text: '复检审核中', cls: 'status-orange' }
  return { text: '停工整改', cls: 'status-red' }
}

function getPendingAcceptanceCardStatus(item) {
  if (item.acceptanceRejected) return { text: '验收驳回', cls: 'status-red' }
  return { text: '验收中', cls: 'status-orange' }
}

const MERCHANT_TASK_DATA = {
  'draft': [
    { id: 'RX030', shop: 'A06', merchant: '盛达车业',   date: '2026-05-14 16:00', tags: ['门头广告'] },
    { id: 'RX031', shop: 'C09', merchant: '华晨名车',   date: '2026-05-15 09:30', tags: ['基建改造', '电气改造'] }
  ],
  'reviewing': [
    { id: 'RX020', shop: 'B08', merchant: '北京拿铁旧机动车', date: '2026-05-11 10:30', tags: ['门头广告', '基建改造'] },
    { id: 'RX021', shop: 'A12', merchant: '北京车天下二手车', date: '2026-05-12 15:00', tags: ['消防系统'] }
  ],
  'pending-submit': [
    { id: 'RX022', shop: 'B15', merchant: '驰骋车行', date: '2026-05-10 09:00', tags: ['基建改造', '消防系统'] }
  ],
  'material-review': [
    { id: 'RX032', shop: 'D03', merchant: '鑫达名车', date: '2026-05-09 11:00', tags: ['门头广告'],            materialReceived: '2026-05-11 09:00' },
    { id: 'RX033', shop: 'B10', merchant: '瑞丰汽配', date: '2026-05-08 14:00', tags: ['门头广告', '基建改造'], materialReceived: '2026-05-10 15:30' }
  ],
  'approving': [
    { id: 'RX023', shop: 'D03', merchant: '鑫达名车', date: '2026-05-09 11:00', tags: ['门头广告'] }
  ],
  'pending-payment': [
    { id: 'RX024', shop: 'A15', merchant: '中联车行', date: '2026-05-08 14:00', tags: ['基建改造', '电气改造'] },
    { id: 'RX025', shop: 'C03', merchant: '鼎盛汽贸', date: '2026-05-08 16:30', tags: ['门头广告', '消防系统'] }
  ],
  'pending-confirm': [
    { id: 'RX026', shop: 'B10', merchant: '瑞丰汽配', date: '2026-05-07 10:00', tags: ['门头广告'] }
  ],
  'pending-sign': [
    { id: 'RX027', shop: 'C06', merchant: '骏驰车行', date: '2026-05-06 15:00', tags: ['门头广告', '电气改造'] },
    { id: 'RX028', shop: 'A09', merchant: '恒通汽贸', date: '2026-05-05 10:30', tags: ['基建改造'] }
  ],
  'pending-certificate': [
    { id: 'RX029', shop: 'D08', merchant: '顺达名车', date: '2026-05-05 14:30', tags: ['门头广告', '消防系统'] },
    { id: 'RX030', shop: 'B12', merchant: '盛达车业', date: '2026-05-04 09:00', tags: ['基建改造', '给排水'] }
  ],
  'under-construction': [
    { id: 'RX015', shop: 'D07', merchant: '嘉诚名车',   date: '2026-05-03 09:00', tags: ['消防系统', '电气改造'], projects: { '消防系统': ['消防栓移位'], '电气改造': ['线路改造'] }, decoratePeriod: '2026-05-20 至 2026-07-10', dailyReportStart: '2026-05-11', currentEnd: '2026-06-20', delaySubmitted: false, noValidSpecialWork: true },
    { id: 'RX035', shop: 'A08', merchant: '红星车行',   date: '2026-05-12 10:00', tags: ['门头广告', '基建改造'], projects: { '门头广告': ['招牌更换'], '基建改造': ['隔墙拆除'] }, decoratePeriod: '2026-05-18 至 2026-06-30', dailyReportStart: '2026-05-13', currentEnd: '2026-06-30', delaySubmitted: false },
    { id: 'RX036', shop: 'B15', merchant: '驰骋车行',   date: '2026-04-28 10:00', tags: ['门头广告'], projects: { '门头广告': ['招牌更换'] }, decoratePeriod: '2026-05-01 至 2026-05-19', dailyReportStart: '2026-05-02', currentEnd: '2026-05-19', delaySubmitted: false }
  ],
  'work-stopped': [
    { id: 'RX040', shop: 'E03', merchant: '顺达二手车', date: '2026-05-11 15:20', tags: ['基建改造'], decoratePeriod: '2026-05-12 至 2026-07-15', stopTime: '2026-05-20 09:00', stopReason: '高空作业未系安全带，现场安全管理不到位，责令停工整改', stopDept: '安保部', stopPerson: '王安保（安保部）', overdueStopped: true },
    { id: 'RX038', shop: 'C05', merchant: '万通车行',   date: '2026-05-08 11:00', tags: ['门头广告', '基建改造'], decoratePeriod: '2026-05-10 至 2026-06-30', stopTime: '2026-05-19 14:00', stopReason: '施工现场未设围挡，存在安全隐患，责令立即停工整改', stopDept: '物业部', stopPerson: '赵经理（物业部）', reinspectSubmitted: true, reinspectRejected: true, reinspectRejectReason: '现场围挡高度不足，警示标识缺失，整改不到位，请按标准重新设置围挡后再次申请复检', reinspectRejectTime: '2026-05-20 16:00', reinspectRejectPerson: '赵经理（物业部）', reinspectSubmit: { submitTime: '2026-05-20 09:00', remark: '已设置施工围挡，现场安全隐患已排除，申请复检验收。', photos: ['围挡整改.jpg'] } },
    { id: 'RX039', shop: 'D11', merchant: '盛世名车',   date: '2026-05-06 09:30', tags: ['消防系统'], decoratePeriod: '2026-05-15 至 2026-07-01', stopTime: '2026-05-20 10:30', stopReason: '动火作业未提前申报，违反市场装修管理规定', stopDept: '安保部', stopPerson: '李安保（安保部）', reinspectSubmitted: true, reinspectSubmit: { submitTime: '2026-05-21 09:30', remark: '已按要求补办动火作业申报手续，现场配备灭火器并设专人监护，申请复检验收。', photos: ['整改现场1.jpg', '灭火器配置.jpg'] } }
  ],
  'pending-acceptance': [
    { id: 'RX001', shop: 'B08', merchant: '北京拿铁旧机动车', date: '2026-05-01 08:00', tags: ['门头广告', '基建改造'], decoratePeriod: '2026-06-01 至 2026-06-30', acceptanceSubmit: { submitTime: '2026-05-16 10:30', photos: ['门头全景.jpg', '室内1.jpg', '消防通道.jpg'], remark: '装修已完工，现场已清理，申请验收。', companyName: '北京嘉美装饰工程有限公司', contactName: '张工', contactPhone: '13800138001' } },
    { id: 'RX017', shop: 'C12', merchant: '鹏达车业',       date: '2026-04-25 10:00', tags: ['门头广告'], decoratePeriod: '2026-04-26 至 2026-05-25', acceptanceSubmit: { submitTime: '2026-05-14 15:20', photos: ['门头正面.jpg', '店内全景.jpg'], remark: '', companyName: '鹏达装修队', contactName: '李师傅', contactPhone: '13911223344' } },
    { id: 'RX034', shop: 'A08', merchant: '伯乐二手车',     date: '2026-05-10 14:00', tags: ['门头广告', '基建改造'], decoratePeriod: '2026-05-15 至 2026-06-15', acceptanceRejected: true, acceptanceRejectReason: '竣工照片不清晰，消防设施现场与申报不符，请整改后重新申请验收', acceptanceRejectTime: '2026-05-18 11:00', acceptanceSubmit: { submitTime: '2026-05-17 09:00', photos: ['门头全景.jpg', '室内1.jpg'], remark: '申请验收', companyName: '伯乐装潢公司', contactName: '王经理', contactPhone: '13699887766' } },
    { id: 'RX023b', shop: 'D03', merchant: '鑫达名车',      date: '2026-05-09 11:00', tags: ['门头广告'], decoratePeriod: '2026-05-10 至 2026-06-10', acceptanceRejected: true, acceptanceRejectReason: '安全出口堆放杂物，疏散指示标识不符合要求，请整改后重新申请验收', acceptanceRejectTime: '2026-05-19 15:30', acceptanceSubmit: { submitTime: '2026-05-18 14:00', photos: ['门头全景.jpg', '安全通道.jpg'], remark: '申请竣工验收', companyName: '鑫达装饰工程部', contactName: '赵工', contactPhone: '13766554433' } }
  ],
  'completed': [
    { id: 'RX004', shop: 'D03', merchant: '鑫达名车', date: '2026-04-20 10:00', tags: ['门头广告'] },
    { id: 'RX018', shop: 'A03', merchant: '宏远车城', date: '2026-04-15 14:00', tags: ['基建改造'] },
    { id: 'RX019', shop: 'B02', merchant: '金鹏汽贸', date: '2026-04-10 09:30', tags: ['门头广告', '电气改造'] }
  ],
  'rejected': [
    { id: 'RX005', shop: 'B15', merchant: '驰骋车行', date: '2026-05-06 09:30', tags: ['基建改造', '消防系统'], rejectType: '踏勘审核驳回' },
    { id: 'RX028', shop: 'A09', merchant: '盛达车业', date: '2026-05-05 11:00', tags: ['电气改造'],             rejectType: '材料审核驳回' }
  ]
}

const MERCHANT_TIMELINES = {
  'draft': [
    { node: '创建申请', result: 'pass', text: '已完成', person: '王经理', time: '2026-05-14 16:00', opinion: '已填写申请信息' }
  ],
  'reviewing': [
    { node: '物业部初审',    result: 'waiting', text: '审核中', person: '赵经理', time: '—' },
    { node: '工程部初审',    result: 'waiting', text: '审核中', person: '周工程', time: '—' },
    { node: '安保部初审',    result: 'waiting', text: '审核中', person: '李安保', time: '—' },
    { node: '安保部踏勘签到', result: 'pass',    text: '已签到', person: '李安保', time: '2026-05-12 09:30' },
    { node: '工程部踏勘签到', result: 'pass',    text: '已签到', person: '周工程', time: '2026-05-12 09:15' },
    { node: '物业部踏勘签到', result: 'pass',    text: '已签到', person: '赵经理', time: '2026-05-12 09:00' },
    { node: '商户提交申请',  result: 'pass',    text: '已完成', person: '王经理', time: '2026-05-11 10:30', opinion: '已提交装修申请' }
  ],
  'pending-submit': [
    { node: '市场物业部提醒递交材料', result: 'waiting', text: '待递交', person: '—', time: '—', opinion: '请将材料递交至物业前台' },
    { node: '物业部主任审核', result: 'pass', text: '已通过', person: '赵主任', time: '2026-05-10 16:00' },
    { node: '工程部主任审核', result: 'pass', text: '已通过', person: '周主任', time: '2026-05-10 15:30' },
    { node: '安保部主任审核', result: 'pass', text: '已通过', person: '李主任', time: '2026-05-10 15:00' },
    { node: '物业部员工初审', result: 'pass', text: '已通过', person: '赵经理', time: '2026-05-10 14:30' },
    { node: '工程部员工初审', result: 'pass', text: '已通过', person: '周工程', time: '2026-05-10 14:00' },
    { node: '安保部员工初审', result: 'pass', text: '已通过', person: '李安保', time: '2026-05-10 11:30' },
    { node: '安保部踏勘签到', result: 'pass', text: '已签到', person: '李安保', time: '2026-05-10 10:30' },
    { node: '工程部踏勘签到', result: 'pass', text: '已签到', person: '周工程', time: '2026-05-10 10:15' },
    { node: '物业部踏勘签到', result: 'pass', text: '已签到', person: '赵经理', time: '2026-05-10 10:00' },
    { node: '商户提交申请',  result: 'pass', text: '已完成', person: '王经理', time: '2026-05-10 09:00' }
  ],
  'material-review': [
    { node: '物业部审核材料',         result: 'waiting', text: '审核中', person: '李工',   time: '—', opinion: '正在核对线下递交材料，预计1-3个工作日' },
    { node: '物业部接收材料',         result: 'pass',    text: '已接收', person: '赵经理', time: '2026-05-11 09:00', opinion: '材料已接收并录入系统' },
    { node: '市场物业部提醒递交材料', result: 'pass',    text: '已提醒', person: '赵经理', time: '2026-05-10 16:30' },
    { node: '物业部主任审核',         result: 'pass',    text: '已通过', person: '赵主任', time: '2026-05-10 16:00' },
    { node: '工程部主任审核',         result: 'pass',    text: '已通过', person: '周主任', time: '2026-05-10 15:30' },
    { node: '安保部主任审核',         result: 'pass',    text: '已通过', person: '李主任', time: '2026-05-10 15:00' },
    { node: '物业部员工初审',         result: 'pass',    text: '已通过', person: '赵经理', time: '2026-05-10 14:30' },
    { node: '工程部员工初审',         result: 'pass',    text: '已通过', person: '周工程', time: '2026-05-10 14:00' },
    { node: '安保部员工初审',         result: 'pass',    text: '已通过', person: '李安保', time: '2026-05-10 11:30' },
    { node: '安保部踏勘签到',         result: 'pass',    text: '已签到', person: '李安保', time: '2026-05-10 10:30' },
    { node: '工程部踏勘签到',         result: 'pass',    text: '已签到', person: '周工程', time: '2026-05-10 10:15' },
    { node: '物业部踏勘签到',         result: 'pass',    text: '已签到', person: '赵经理', time: '2026-05-10 10:00' },
    { node: '商户提交申请',           result: 'pass',    text: '已完成', person: '王经理', time: '2026-05-10 09:00' }
  ],
  'approving': [
    { node: '营运副总审批', result: 'waiting', text: '审批中', person: '刘副总', time: '—' },
    { node: '工程副总审批', result: 'pass',    text: '已通过', person: '陈副总', time: '2026-05-09 16:30' },
    { node: '物业副总审批', result: 'pass',    text: '已通过', person: '张副总', time: '2026-05-09 15:00' },
    { node: '物业部审核材料',         result: 'pass', text: '已通过', person: '李工',   time: '2026-05-09 14:45', opinion: '材料齐全，审核通过' },
    { node: '物业部接收材料',         result: 'pass', text: '已接收', person: '赵经理', time: '2026-05-09 14:30', opinion: '材料已接收并录入' },
    { node: '市场物业部提醒递交材料', result: 'pass', text: '已提醒', person: '赵经理', time: '2026-05-09 13:00' },
    { node: '物业部主任审核', result: 'pass', text: '已通过', person: '赵主任', time: '2026-05-09 11:30' },
    { node: '工程部主任审核', result: 'pass', text: '已通过', person: '周主任', time: '2026-05-09 11:15' },
    { node: '安保部主任审核', result: 'pass', text: '已通过', person: '李主任', time: '2026-05-09 11:00' },
    { node: '物业部员工初审', result: 'pass', text: '已通过', person: '赵经理', time: '2026-05-09 10:30' },
    { node: '工程部员工初审', result: 'pass', text: '已通过', person: '周工程', time: '2026-05-09 10:15' },
    { node: '安保部员工初审', result: 'pass', text: '已通过', person: '李安保', time: '2026-05-09 10:00' },
    { node: '安保部踏勘签到', result: 'pass', text: '已签到', person: '李安保', time: '2026-05-09 09:45' },
    { node: '工程部踏勘签到', result: 'pass', text: '已签到', person: '周工程', time: '2026-05-09 09:30' },
    { node: '物业部踏勘签到', result: 'pass', text: '已签到', person: '赵经理', time: '2026-05-09 09:15' },
    { node: '商户提交申请',   result: 'pass', text: '已完成', person: '王经理', time: '2026-05-09 09:00' }
  ],
  'pending-payment': [
    { node: '缴纳保证金', result: 'waiting', text: '待缴费', person: '—', time: '—', opinion: '请缴纳装修保证金' },
    { node: '营运副总审批', result: 'pass', text: '已通过', person: '刘副总', time: '2026-05-08 16:30' },
    { node: '工程副总审批', result: 'pass', text: '已通过', person: '陈副总', time: '2026-05-08 16:00' },
    { node: '物业副总审批', result: 'pass', text: '已通过', person: '张副总', time: '2026-05-08 15:30' },
    { node: '物业部接收材料',         result: 'pass', text: '已接收', person: '赵经理', time: '2026-05-08 14:30' },
    { node: '市场物业部提醒递交材料', result: 'pass', text: '已提醒', person: '赵经理', time: '2026-05-08 13:00' },
    { node: '物业部主任审核', result: 'pass', text: '已通过', person: '赵主任', time: '2026-05-08 11:30' },
    { node: '工程部主任审核', result: 'pass', text: '已通过', person: '周主任', time: '2026-05-08 11:15' },
    { node: '安保部主任审核', result: 'pass', text: '已通过', person: '李主任', time: '2026-05-08 11:00' },
    { node: '物业部员工初审', result: 'pass', text: '已通过', person: '赵经理', time: '2026-05-08 10:30' },
    { node: '工程部员工初审', result: 'pass', text: '已通过', person: '周工程', time: '2026-05-08 10:15' },
    { node: '安保部员工初审', result: 'pass', text: '已通过', person: '李安保', time: '2026-05-08 10:00' },
    { node: '安保部踏勘签到', result: 'pass', text: '已签到', person: '李安保', time: '2026-05-08 09:45' },
    { node: '工程部踏勘签到', result: 'pass', text: '已签到', person: '周工程', time: '2026-05-08 09:30' },
    { node: '物业部踏勘签到', result: 'pass', text: '已签到', person: '赵经理', time: '2026-05-08 09:15' },
    { node: '商户提交申请',   result: 'pass', text: '已完成', person: '王经理', time: '2026-05-08 09:00' }
  ],
  'pending-confirm': [
    { node: '财务确认缴费', result: 'waiting', text: '待支付确认', person: '李会计', time: '—', opinion: '缴费凭证已提交，等待财务确认' },
    { node: '上传缴费凭证', result: 'pass',    text: '已上传',     person: '王经理', time: '2026-05-07 14:00', opinion: '银行转账，保证金5000元' },
    { node: '营运副总审批', result: 'pass', text: '已通过', person: '刘副总', time: '2026-05-07 11:30' },
    { node: '工程副总审批', result: 'pass', text: '已通过', person: '陈副总', time: '2026-05-07 11:00' },
    { node: '物业副总审批', result: 'pass', text: '已通过', person: '张副总', time: '2026-05-07 10:30' },
    { node: '物业部接收材料',         result: 'pass', text: '已接收', person: '赵经理', time: '2026-05-07 09:45' },
    { node: '市场物业部提醒递交材料', result: 'pass', text: '已提醒', person: '赵经理', time: '2026-05-07 09:00' },
    { node: '商户提交申请', result: 'pass', text: '已完成', person: '王经理', time: '2026-05-06 15:00' }
  ],
  'pending-sign': [
    { node: '签署安全协议', result: 'waiting', text: '待签署', person: '—', time: '—', opinion: '请到安保部签署安全协议' },
    { node: '财务确认缴费', result: 'pass', text: '已确认', person: '李会计', time: '2026-05-06 15:00', opinion: '缴费凭证已核实' },
    { node: '上传缴费凭证', result: 'pass', text: '已上传', person: '王经理', time: '2026-05-06 14:00', opinion: '银行转账，保证金5000元' },
    { node: '营运副总审批', result: 'pass', text: '已通过', person: '刘副总', time: '2026-05-06 11:30' },
    { node: '工程副总审批', result: 'pass', text: '已通过', person: '陈副总', time: '2026-05-06 11:00' },
    { node: '物业副总审批', result: 'pass', text: '已通过', person: '张副总', time: '2026-05-06 10:30' },
    { node: '物业部接收材料',         result: 'pass', text: '已接收', person: '赵经理', time: '2026-05-06 09:45' },
    { node: '市场物业部提醒递交材料', result: 'pass', text: '已提醒', person: '赵经理', time: '2026-05-06 09:00' },
    { node: '商户提交申请', result: 'pass', text: '已完成', person: '王经理', time: '2026-05-05 15:00' }
  ],
  'pending-certificate': [
    { node: '系统生成施工证', result: 'waiting', text: '待下证', person: '—', time: '—', opinion: '系统正在生成施工证' },
    { node: '上传安全协议',  result: 'pass',    text: '已上传', person: '王经理', time: '2026-05-05 14:30', opinion: '已到安保部签署并上传' },
    { node: '财务确认缴费',  result: 'pass',    text: '已确认', person: '李会计', time: '2026-05-05 10:00', opinion: '缴费凭证已核实' },
    { node: '上传缴费凭证',  result: 'pass',    text: '已上传', person: '王经理', time: '2026-05-05 09:30', opinion: '银行转账，保证金5000元' },
    { node: '营运副总审批', result: 'pass', text: '已通过', person: '刘副总', time: '2026-05-04 11:30' },
    { node: '工程副总审批', result: 'pass', text: '已通过', person: '陈副总', time: '2026-05-04 11:00' },
    { node: '物业副总审批', result: 'pass', text: '已通过', person: '张副总', time: '2026-05-04 10:30' },
    { node: '物业部接收材料',         result: 'pass', text: '已接收', person: '赵经理', time: '2026-05-04 09:45' },
    { node: '市场物业部提醒递交材料', result: 'pass', text: '已提醒', person: '赵经理', time: '2026-05-04 09:00' },
    { node: '商户提交申请', result: 'pass', text: '已完成', person: '王经理', time: '2026-05-03 15:00' }
  ],
  'under-construction': [
    { node: '持证施工',       result: 'processing', text: '施工中', person: '王经理', time: '2026-05-01 08:00', opinion: '施工证已下发，开始施工' },
    { node: '系统生成施工证', result: 'pass', text: '已下证', person: '系统',   time: '2026-04-30 17:00', opinion: '施工证号：SZ202605010001' },
    { node: '上传安全协议',   result: 'pass', text: '已上传', person: '王经理', time: '2026-04-30 14:30' },
    { node: '财务确认缴费',   result: 'pass', text: '已确认', person: '李会计', time: '2026-04-30 10:00', opinion: '缴费凭证已核实' },
    { node: '上传缴费凭证',   result: 'pass', text: '已上传', person: '王经理', time: '2026-04-30 09:30', opinion: '银行转账，保证金5000元' },
    { node: '营运副总审批', result: 'pass', text: '已通过', person: '刘副总', time: '2026-04-29 11:30' },
    { node: '工程副总审批', result: 'pass', text: '已通过', person: '陈副总', time: '2026-04-29 11:00' },
    { node: '物业副总审批', result: 'pass', text: '已通过', person: '张副总', time: '2026-04-29 10:30' },
    { node: '物业部接收材料',         result: 'pass', text: '已接收', person: '赵经理', time: '2026-04-29 09:45' },
    { node: '市场物业部提醒递交材料', result: 'pass', text: '已提醒', person: '赵经理', time: '2026-04-29 09:00' },
    { node: '物业部主任审核',         result: 'pass', text: '已通过', person: '赵主任', time: '2026-04-29 08:30' },
    { node: '工程部主任审核',         result: 'pass', text: '已通过', person: '周主任', time: '2026-04-29 08:15' },
    { node: '安保部主任审核',         result: 'pass', text: '已通过', person: '李主任', time: '2026-04-29 08:00' },
    { node: '物业部员工初审',         result: 'pass', text: '已通过', person: '赵经理', time: '2026-04-28 16:30' },
    { node: '工程部员工初审',         result: 'pass', text: '已通过', person: '周工程', time: '2026-04-28 16:15' },
    { node: '安保部员工初审',         result: 'pass', text: '已通过', person: '李安保', time: '2026-04-28 16:00' },
    { node: '安保部踏勘签到',         result: 'pass', text: '已签到', person: '李安保', time: '2026-04-28 15:45' },
    { node: '工程部踏勘签到',         result: 'pass', text: '已签到', person: '周工程', time: '2026-04-28 15:30' },
    { node: '物业部踏勘签到',         result: 'pass', text: '已签到', person: '赵经理', time: '2026-04-28 15:15' },
    { node: '商户提交申请',           result: 'pass', text: '已完成', person: '王经理', time: '2026-04-28 15:00' }
  ],
  'work-stopped': [
    { node: '持证施工',       result: 'pass', text: '施工中', person: '王经理', time: '2026-05-01 08:00', opinion: '施工证已下发，开始施工' },
    { node: '系统生成施工证', result: 'pass', text: '已下证', person: '系统',   time: '2026-04-30 17:00' },
    { node: '商户提交申请',   result: 'pass', text: '已完成', person: '王经理', time: '2026-04-28 15:00' }
  ],
  'pending-acceptance': [
    { node: '持证施工',       result: 'pass',    text: '已完成', person: '王经理', time: '2026-04-20 08:00', opinion: '施工已完成' },
    { node: '系统生成施工证', result: 'pass',    text: '已下证', person: '系统',   time: '2026-04-15 17:00' },
    { node: '签署安全协议',   result: 'pass',    text: '已签署', person: '王经理', time: '2026-04-15 14:00' },
    { node: '提交申请',       result: 'pass',    text: '已完成', person: '王经理', time: '2026-04-10 08:00' }
  ],
  'completed': [
    { node: '验收通过退款', result: 'pass', text: '已完成', person: '李会计', time: '2026-04-22 15:00', opinion: '验收通过，保证金已退还' },
    { node: '申请验收',     result: 'pass', text: '验收通过', person: '赵经理', time: '2026-04-21 10:00', opinion: '验收合格' },
    { node: '持证施工',     result: 'pass', text: '已完成', person: '王经理', time: '2026-04-15 08:00' },
    { node: '系统生成施工证', result: 'pass', text: '已下证', person: '系统', time: '2026-04-10 17:00' },
    { node: '提交申请',     result: 'pass', text: '已完成', person: '王经理', time: '2026-04-01 08:00' }
  ],
  'rejected': [
    { node: '物业部主任审核', result: 'reject', text: '已驳回', person: '赵主任', time: '2026-05-06 11:00', opinion: '装修方案不符合规范，需修改后重新提交' },
    { node: '工程部初审',     result: 'pass',   text: '已通过', person: '周工程', time: '2026-05-06 10:30' },
    { node: '安保部初审',     result: 'pass',   text: '已通过', person: '李安保', time: '2026-05-06 10:00' },
    { node: '物业部初审',     result: 'pass',   text: '已通过', person: '赵经理', time: '2026-05-06 09:30' },
    { node: '安保部踏勘签到', result: 'pass',   text: '已签到', person: '李安保', time: '2026-05-05 09:30' },
    { node: '工程部踏勘签到', result: 'pass',   text: '已签到', person: '周工程', time: '2026-05-05 09:15' },
    { node: '物业部踏勘签到', result: 'pass',   text: '已签到', person: '赵经理', time: '2026-05-05 09:00' },
    { node: '商户提交申请',   result: 'pass',   text: '已完成', person: '王经理', time: '2026-05-04 10:00', opinion: '已提交装修申请' }
  ],
  'rejected-material': [
    { node: '物业部审核材料', result: 'reject', text: '已驳回', person: '李工',   time: '2026-05-05 10:00', opinion: '提交材料不完整，缺少消防审批文件' },
    { node: '物业部接收材料', result: 'pass',   text: '已接收', person: '赵经理', time: '2026-05-04 09:00' },
    { node: '市场物业部提醒递交材料', result: 'pass', text: '已提醒', person: '赵经理', time: '2026-05-03 16:30' },
    { node: '物业部主任审核', result: 'pass', text: '已通过', person: '赵主任', time: '2026-05-03 16:00' },
    { node: '工程部主任审核', result: 'pass', text: '已通过', person: '周主任', time: '2026-05-03 15:30' },
    { node: '安保部主任审核', result: 'pass', text: '已通过', person: '李主任', time: '2026-05-03 15:00' },
    { node: '物业部员工初审', result: 'pass', text: '已通过', person: '赵经理', time: '2026-05-03 14:30' },
    { node: '工程部员工初审', result: 'pass', text: '已通过', person: '周工程', time: '2026-05-03 14:00' },
    { node: '安保部员工初审', result: 'pass', text: '已通过', person: '李安保', time: '2026-05-03 11:30' },
    { node: '安保部踏勘签到', result: 'pass', text: '已签到', person: '李安保', time: '2026-05-03 10:30' },
    { node: '工程部踏勘签到', result: 'pass', text: '已签到', person: '周工程', time: '2026-05-03 10:15' },
    { node: '物业部踏勘签到', result: 'pass', text: '已签到', person: '赵经理', time: '2026-05-03 10:00' },
    { node: '商户提交申请',   result: 'pass', text: '已完成', person: '王经理', time: '2026-05-02 09:00', opinion: '已提交装修申请' }
  ]
}

const MERCHANT_CATS = [
  { name: '门头广告', dept: '市场经营部', items: [
    { name: '招牌更换',    level: 2 },
    { name: '灯箱安装',    level: 1 },
    { name: 'LED屏幕',     level: 2 },
    { name: '标识标牌',    level: 1 }
  ]},
  { name: '基建改造', dept: '管理部', items: [
    { name: '隔墙拆除',    level: 3 },
    { name: '地面找平',    level: 2 },
    { name: '吊顶施工',    level: 2 },
    { name: '隔断施工',    level: 2 }
  ]},
  { name: '消防系统', dept: '安保部', items: [
    { name: '消防栓移位',  level: 3 },
    { name: '喷淋改造',    level: 3 },
    { name: '烟感报警',    level: 2 }
  ]},
  { name: '电气改造', dept: '管理部', items: [
    { name: '电表增容',    level: 2 },
    { name: '线路改造',    level: 2 },
    { name: '水表读数确认', level: 1 }
  ]},
  { name: '给排水',   dept: '工程部', items: [
    { name: '上水改造',    level: 2 },
    { name: '下水改造',    level: 2 },
    { name: '防水施工',    level: 2 }
  ]}
]

function getMerchantCategoryStatus(globalStatus) {
  const map = {
    'draft':               { text: '草稿',   cls: 'status-gray'   },
    'reviewing':           { text: '审核中', cls: 'status-orange' },
    'pending-submit':      { text: '已通过', cls: 'status-green'  },
    'material-review':     { text: '已通过', cls: 'status-green'  },
    'approving':           { text: '已通过', cls: 'status-green'  },
    'pending-payment':     { text: '已通过', cls: 'status-green'  },
    'pending-confirm':     { text: '已通过', cls: 'status-green'  },
    'pending-sign':        { text: '已通过', cls: 'status-green'  },
    'pending-certificate': { text: '已通过', cls: 'status-green'  },
    'under-construction':  { text: '施工中', cls: 'status-blue'   },
    'work-stopped':        { text: '施工中', cls: 'status-blue'   },
    'pending-acceptance':  { text: '已完成', cls: 'status-green'  },
    'completed':           { text: '已完成', cls: 'status-green'  },
    'rejected':            { text: '已驳回', cls: 'status-red'    }
  }
  return map[globalStatus] || { text: '—', cls: 'status-gray' }
}

function buildMerchantDetailData(status, rejectType, applyId) {
  let sc = MERCHANT_STATUS_CONFIG[status] || MERCHANT_STATUS_CONFIG['draft']
  const stepIndex = sc.stepIndex

  // 装修类目（按 applyId 查找当前状态下的具体条目，找不到时兜底取第一条）
  const mItems = MERCHANT_TASK_DATA[status] || []
  const mItem = (applyId && mItems.find(d => d.id === applyId)) || mItems[0] || {}

  // 停工整改 / 验收中：状态标签随子状态变化
  if (status === 'work-stopped') sc = getWorkStoppedCardStatus(mItem)
  if (status === 'pending-acceptance') sc = getPendingAcceptanceCardStatus(mItem)

  // 状态提示横幅
  const bannerMap = {
    'pending-submit':  { type: 'red', title: '待递交材料', text: '踏勘审核已通过，请将纸质材料递交至市场物业前台，物业部确认接收后将进入材料审核阶段。' },
    'material-review': { type: 'red', title: '材料审核中', text: '物业部已接收您递交的线下材料，正在核对审核，预计1-3个工作日，请耐心等待。审核通过后将进入审批流程。' }
  }
  let banner = bannerMap[status] || null
  if (status === 'work-stopped') {
    if (sc.text === '复检驳回') {
      banner = { type: 'red', title: '复检驳回', text: mItem.reinspectRejectReason || '复检未通过，请根据驳回原因重新整改后再次申请复检。' }
    } else if (sc.text === '复检审核中') {
      banner = { type: 'orange', title: '复检审核中', text: '您已提交复检申请，请等待市场现场复验；复验通过后方可恢复施工。' }
    } else {
      banner = { type: 'red', title: '停工整改', text: (mItem.stopReason || '') + '。请按要求完成整改后提交复检申请，待市场复验通过后方可恢复施工。' }
    }
  } else if (status === 'pending-acceptance') {
    banner = mItem.acceptanceRejected
      ? { type: 'red', title: '验收驳回', text: mItem.acceptanceRejectReason || '验收未通过，请根据驳回原因整改后重新申请验收。' }
      : { type: 'orange', title: '验收中', text: '您已提交验收申请，请等待市场各部门完成验收。' }
  }

  // 驳回信息（踏勘/材料驳回）
  const rejectInfo = status === 'rejected' ? {
    type:   rejectType || '踏勘审核驳回',
    reason: rejectType === '材料审核驳回'
      ? '提交材料不完整，缺少消防审批文件'
      : '装修方案不符合规范，需修改后重新提交'
  } : null

  // 计划装修周期（各状态详情页均展示）
  const decoratePeriod = mItem.decoratePeriod || ''

  // 施工期间 / 施工证号（施工中、停工整改、验收中均展示）
  const showConstruction = status === 'under-construction' || status === 'work-stopped' || status === 'pending-acceptance'
  const constructionPeriod = mItem.decoratePeriod || ''
  const certNo = getApplyCertCode(mItem.id)

  // 停工信息（停工整改）
  const stopInfo = status === 'work-stopped' ? {
    time: mItem.stopTime || '—',
    dept: mItem.stopDept || '—',
    person: mItem.stopPerson || '—',
    reason: mItem.stopReason || '—'
  } : null

  // 复检申请信息 / 复检驳回信息（停工整改）
  const reinspectSubmit = (status === 'work-stopped' && mItem.reinspectSubmitted && mItem.reinspectSubmit) ? {
    time: mItem.reinspectSubmit.submitTime || '—',
    remark: mItem.reinspectSubmit.remark || '—',
    photos: mItem.reinspectSubmit.photos || []
  } : null
  const reinspectReject = (status === 'work-stopped' && mItem.reinspectRejected) ? {
    time: mItem.reinspectRejectTime || '—',
    person: mItem.reinspectRejectPerson || '—',
    reason: mItem.reinspectRejectReason || '—'
  } : null

  // 验收申请信息 / 验收驳回信息（验收中）
  const acceptanceSubmit = (status === 'pending-acceptance' && mItem.acceptanceSubmit) ? {
    time: mItem.acceptanceSubmit.submitTime || '—',
    companyName: mItem.acceptanceSubmit.companyName || '—',
    contactName: mItem.acceptanceSubmit.contactName || '—',
    contactPhone: mItem.acceptanceSubmit.contactPhone || '—',
    remark: mItem.acceptanceSubmit.remark || '—',
    photos: mItem.acceptanceSubmit.photos || []
  } : null
  const acceptanceReject = (status === 'pending-acceptance' && mItem.acceptanceRejected) ? {
    time: mItem.acceptanceRejectTime || '—',
    reason: mItem.acceptanceRejectReason || '—'
  } : null

  // 附件（随进度累积，divider 为分组分割线）
  const attachments = [
    { label: '营业执照', type: 'pdf', name: '营业执照.pdf' },
    { type: 'divider' },
    { label: '施工方案', type: 'pdf', name: '施工方案.pdf' },
    { label: '施工图纸', type: 'img', name: '施工图纸.jpg' }
  ]
  if (stepIndex >= 5) {
    attachments.push({ type: 'divider' })
    attachments.push({ label: '缴费凭证', type: 'img', name: '缴费凭证.jpg' })
  }
  if (stepIndex >= 7) {
    attachments.push({ type: 'divider' })
    attachments.push({ label: '安全协议', type: 'pdf', name: '安全协议.pdf' })
  }

  // 时间线（已驳回时区分两种驳回来源；停工整改/验收中在基础链路上动态拼接当前进展）
  const tlKey = (status === 'rejected' && rejectType === '材料审核驳回') ? 'rejected-material' : status
  let rawTimeline = MERCHANT_TIMELINES[tlKey] || []
  if (status === 'work-stopped') {
    const head = [{ node: '下达停工通知', result: 'reject', text: sc.text, person: mItem.stopPerson, time: mItem.stopTime, opinion: mItem.stopReason }]
    if (reinspectReject) {
      head.unshift({ node: '复检审核', result: 'reject', text: '复检驳回', person: reinspectReject.person, time: reinspectReject.time, opinion: reinspectReject.reason })
      head.unshift({ node: '申请复检', result: 'pass', text: '已提交', person: '商户', time: reinspectSubmit ? reinspectSubmit.time : '', opinion: reinspectSubmit ? reinspectSubmit.remark : '' })
    } else if (reinspectSubmit) {
      head.unshift({ node: '申请复检', result: 'waiting', text: '复检审核中', person: '商户', time: reinspectSubmit.time, opinion: reinspectSubmit.remark })
    }
    rawTimeline = head.concat(rawTimeline)
  } else if (status === 'pending-acceptance') {
    const head = acceptanceReject
      ? [
          { node: '验收审核', result: 'reject', text: '验收驳回', person: '赵经理', time: acceptanceReject.time, opinion: acceptanceReject.reason },
          { node: '申请验收', result: 'pass', text: '已提交', person: '商户', time: acceptanceSubmit ? acceptanceSubmit.time : '', opinion: '商户提交验收申请' }
        ]
      : [{ node: '申请验收', result: 'waiting', text: '验收中', person: '商户', time: acceptanceSubmit ? acceptanceSubmit.time : '', opinion: '验收申请已提交，请等待市场各部门完成验收' }]
    rawTimeline = head.concat(rawTimeline)
  }
  const timeline = rawTimeline.map(item => ({
    ...item,
    dotCls:    item.result === 'pass' ? 'dot-pass' : item.result === 'reject' ? 'dot-reject' : item.result === 'processing' ? 'dot-processing' : 'dot-waiting',
    statusCls: item.result === 'pass' ? 'tl-pass'  : item.result === 'reject' ? 'tl-reject'  : item.result === 'processing' ? 'tl-processing'  : 'tl-waiting'
  }))

  // 底部按钮
  let btnPrimary   = null
  let btnSecondary = null
  if (status === 'draft') {
    btnPrimary   = { action: 'edit-draft', text: '编辑申请' }
    btnSecondary = { action: 'back',       text: '返回列表' }
  } else if (status === 'pending-payment') {
    btnPrimary = { action: 'submit-payment', text: '提交缴费凭证' }
  } else if (status === 'under-construction') {
    btnSecondary = { action: 'more-actions', text: '更多操作' }
    btnPrimary   = { action: 'daily-report', text: '每日报备' }
  } else if (status === 'work-stopped') {
    btnSecondary = mItem.overdueStopped
      ? { action: 'delay-apply', text: '申请延期' }
      : { action: 'reinspect-menu', text: '更多操作' }
    btnPrimary   = { action: 'daily-report', text: '每日报备' }
  } else if (status === 'pending-acceptance') {
    btnSecondary = { action: 'cancel-accept', text: '取消验收' }
    if (mItem.acceptanceRejected) {
      btnPrimary = { action: 'reaccept', text: '重新申请验收' }
    }
  } else if (status === 'rejected') {
    btnSecondary = { action: 'back', text: '返回列表' }
    btnPrimary   = rejectType === '材料审核驳回'
      ? { action: 'reupload', text: '重新上传附件' }
      : { action: 'reapply',  text: '重新申请' }
  } else {
    btnSecondary = { action: 'back', text: '返回列表' }
  }

  const catStatus = getMerchantCategoryStatus(status)
  const categories = (mItem.tags || []).map(tagName => {
    const cat = MERCHANT_CATS.find(c => c.name === tagName) || { name: tagName, dept: '', items: [] }
    return {
      name: cat.name,
      dept: cat.dept,
      projects: cat.items,
      statusText: catStatus.text,
      statusCls: catStatus.cls
    }
  })

  // 增项申请记录（施工中及以后显示）
  let addItemRecords = []
  if (stepIndex >= 9) {
    const targetApplyId = applyId || 'RX001'
    Object.keys(MERCHANT_ADD_ITEM_DATA).forEach(tabKey => {
      const items = MERCHANT_ADD_ITEM_DATA[tabKey] || []
      items.forEach(item => {
        if (item.applyId === targetApplyId) {
          addItemRecords.push({
            id: item.id,
            categories: item.addCategories,
            date: item.date,
            tab: tabKey
          })
        }
      })
    })
  }

  return {
    sc,
    merchant: mItem.merchant || '—',
    shop: mItem.shop || '—',
    applyDate: mItem.date || '—',
    stepIndex,
    banner,
    rejectInfo,
    showOfflineMaterial: false,
    decoratePeriod,
    showConstruction,
    constructionPeriod,
    certNo,
    stopInfo,
    reinspectSubmit,
    reinspectReject,
    acceptanceSubmit,
    acceptanceReject,
    attachments,
    showPaymentForm: status === 'pending-payment',
    timeline,
    categories,
    btnPrimary,
    btnSecondary,
    addItemRecords
  }
}

// 商户提交「申请复检」（停工整改）
function submitReinspect(applyId, payload) {
  const item = (MERCHANT_TASK_DATA['work-stopped'] || []).find(d => d.id === applyId)
  if (!item) return
  item.reinspectSubmitted = true
  item.reinspectRejected = false
  item.reinspectSubmit = Object.assign({
    submitTime: new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5)
  }, payload)
}

function findWorkStoppedApply(applyId) {
  return (MERCHANT_TASK_DATA['work-stopped'] || []).find(d => d.id === applyId) || null
}

// ================================================================
// 装修延期申请 Mock 数据
// ================================================================
const DELAY_TABS = [
  { key: 'pending',   label: '待审核', badge: 2 },
  { key: 'approved',  label: '已通过', badge: 1 },
  { key: 'rejected',  label: '已驳回', badge: 1 },
  { key: 'cancelled', label: '已取消', badge: 1 }
]

const DELAY_DATA = {
  pending: [
    {
      id: 'DQ202605130001', applyId: 'RX015', merchant: '瑞丰汽配', shop: 'B10',
      tags: ['门头广告', '基建改造'], contact: '张经理 139****5678',
      originalEnd: '2026-06-15', delayTo: '2026-07-15', days: 30,
      reason: '施工进度滞后，需延长工期', date: '2026-05-13 09:00',
      currentStep: '物业部主任审批', needMyReview: false,
      categories: [
        { name: '门头广告', dept: '市场经营部', isMyDept: true,  projects: [{ name: '招牌更换', level: 2 }, { name: '灯箱安装', level: 2 }] },
        { name: '基建改造', dept: '物业部',     isMyDept: false, projects: [{ name: '隔墙拆除', level: 2 }, { name: '地面找平', level: 1 }] }
      ]
    },
    {
      id: 'DQ202605120001', applyId: 'RX016', merchant: '嘉诚名车', shop: 'D07',
      tags: ['消防系统', '电气改造'], contact: '李经理 136****8899',
      originalEnd: '2026-06-20', delayTo: '2026-07-10', days: 20,
      reason: '增项施工后需延长工期', date: '2026-05-12 14:30',
      currentStep: '待我审核', needMyReview: true,
      categories: [
        { name: '消防系统', dept: '安保部', isMyDept: false, projects: [{ name: '消防栓移位', level: 3 }] },
        { name: '电气改造', dept: '管理部', isMyDept: false, projects: [{ name: '电表安装', level: 2 }, { name: '水表读数确认', level: 1 }] }
      ]
    }
  ],
  approved: [
    {
      id: 'DQ202605100001', applyId: 'RX002', merchant: '北京车天下', shop: 'A12',
      tags: ['消防系统'], contact: '赵经理 138****2233',
      originalEnd: '2026-05-30', delayTo: '2026-06-15', days: 16,
      reason: '材料到位延迟', date: '2026-05-10 09:00',
      approveTime: '2026-05-11 10:30', approvePerson: '赵主任（物业部）',
      approveOpinion: '同意延期，请按新工期组织施工',
      categories: [
        { name: '消防系统', dept: '安保部', isMyDept: false, projects: [{ name: '消防栓移位', level: 3 }] }
      ]
    }
  ],
  rejected: [
    {
      id: 'DQ202605080001', applyId: 'RX001', merchant: '北京拿铁旧机动车', shop: 'B08',
      tags: ['门头广告', '基建改造'], contact: '王经理 138****1234',
      originalEnd: '2026-06-30', delayTo: '2026-08-15', days: 46,
      reason: '天气原因停工', date: '2026-05-08 11:00',
      rejectTime: '2026-05-09 16:00', rejectPerson: '赵主任（物业部）',
      rejectReason: '延期理由不充分，请补充施工进度说明后由商户重新提交',
      categories: [
        { name: '门头广告', dept: '市场经营部', isMyDept: true,  projects: [{ name: '招牌更换', level: 2 }, { name: '灯箱安装', level: 2 }] },
        { name: '基建改造', dept: '物业部',     isMyDept: false, projects: [{ name: '隔墙拆除', level: 2 }, { name: '地面找平', level: 1 }] }
      ]
    }
  ],
  cancelled: [
    {
      id: 'DQ202605070001', applyId: 'RX015', merchant: '嘉诚名车', shop: 'D07',
      tags: ['消防系统', '电气改造'], contact: '李经理 136****8899',
      originalEnd: '2026-06-20', delayTo: '2026-07-10', days: 20,
      reason: '增项施工后需延长工期', date: '2026-05-07 09:30',
      cancelTime: '2026-05-08 15:20', cancelPerson: '李经理（商户）', cancelReason: '商户主动取消延期申请',
      categories: [
        { name: '消防系统', dept: '安保部',  isMyDept: false, projects: [{ name: '消防栓移位', level: 3 }] },
        { name: '电气改造', dept: '管理部',  isMyDept: false, projects: [{ name: '电表安装', level: 2 }, { name: '水表读数确认', level: 1 }] }
      ]
    },
    {
      id: 'DQ202605060001', applyId: 'RX018', merchant: '盛达车业', shop: 'A09',
      tags: ['门头广告'], contact: '周经理 137****5566',
      originalEnd: '2026-06-10', delayTo: '2026-06-25', days: 15,
      reason: '材料采购周期延长', date: '2026-05-06 10:00',
      cancelTime: '2026-05-07 11:45', cancelPerson: '周经理（商户）', cancelReason: '商户主动取消延期申请',
      categories: [
        { name: '门头广告', dept: '市场经营部', isMyDept: true, projects: [{ name: '招牌更换', level: 2 }, { name: '灯箱安装', level: 2 }] }
      ]
    }
  ]
}

// ================================================================
// 商户端 — 延期申请 Mock 数据
// ================================================================
const MERCHANT_DELAY_TABS = [
  { key: 'reviewing', label: '审核中', badge: 1 },
  { key: 'approved',  label: '已通过', badge: 1 },
  { key: 'rejected',  label: '已驳回', badge: 1 },
  { key: 'cancelled', label: '已取消', badge: 2 }
]

const MERCHANT_DELAY_DATA = {
  reviewing: [
    {
      id: 'DQ202605120001', applyId: 'RX001', merchant: '北京拿铁旧机动车', shop: 'B08',
      tags: ['门头广告', '基建改造'],
      originalEnd: '2026-06-30', delayTo: '2026-07-15', days: 15,
      reason: '施工进度滞后，需延长工期', date: '2026-05-12 10:00',
      currentStep: '物业部主任审批',
      categories: [
        { name: '门头广告', projects: ['招牌更换', '灯箱安装'] },
        { name: '基建改造', projects: ['隔墙拆除', '地面找平'] }
      ]
    }
  ],
  rejected: [
    {
      id: 'DQ202605100001', applyId: 'RX020', merchant: '北京拿铁旧机动车', shop: 'A12',
      tags: ['门头广告', '电气改造'],
      originalEnd: '2026-06-15', delayTo: '2026-07-01', days: 16,
      reason: '材料未到位', date: '2026-05-10 14:00',
      rejectTime: '2026-05-11 16:30', rejectPerson: '赵经理（物业部）',
      rejectReason: '延期理由不充分，请补充说明后重新提交',
      categories: [
        { name: '门头广告', projects: ['招牌更换', '灯箱安装'] },
        { name: '电气改造', projects: ['线路改造'] }
      ]
    }
  ],
  approved: [
    {
      id: 'DQ202605050001', applyId: 'RX004', merchant: '北京拿铁旧机动车', shop: 'D03',
      tags: ['门头广告'],
      originalEnd: '2026-05-20', delayTo: '2026-06-05', days: 16,
      reason: '天气原因停工', date: '2026-05-05 09:30',
      approveTime: '2026-05-06 14:00', approvePerson: '王经理（物业部）',
      categories: [
        { name: '门头广告', projects: ['招牌更换'] }
      ]
    }
  ],
  cancelled: [
    {
      id: 'DQ202605070001', applyId: 'RX015', merchant: '嘉诚名车', shop: 'D07',
      tags: ['消防系统', '电气改造'],
      originalEnd: '2026-06-20', delayTo: '2026-07-10', days: 20,
      reason: '增项施工后需延长工期', date: '2026-05-07 09:30',
      cancelTime: '2026-05-08 15:20', cancelPerson: '李经理（商户）',
      categories: [
        { name: '消防系统', projects: ['消防栓移位'] },
        { name: '电气改造', projects: ['电表安装', '水表读数确认'] }
      ]
    },
    {
      id: 'DQ202605140001', applyId: 'RX035', merchant: '红星车行', shop: 'A08',
      tags: ['门头广告', '基建改造'],
      originalEnd: '2026-06-30', delayTo: '2026-07-20', days: 20,
      reason: '门头施工遇雨天停工', date: '2026-05-14 11:00',
      cancelTime: '2026-05-15 09:10', cancelPerson: '刘经理（商户）',
      categories: [
        { name: '门头广告', projects: ['招牌更换'] },
        { name: '基建改造', projects: ['隔墙拆除'] }
      ]
    }
  ]
}

// 可选的施工中申请（用于新增延期申请表单）
const MERCHANT_UNDER_CONSTRUCTION_LIST = [
  { id: 'RX015', merchant: '嘉诚名车',   shop: 'D07', cats: '消防系统 / 电气改造', currentEnd: '2026-06-20' },
  { id: 'RX035', merchant: '红星车行',   shop: 'A08', cats: '门头广告 / 基建改造', currentEnd: '2026-06-30' },
  { id: 'RX036', merchant: '驰骋车行',   shop: 'B15', cats: '门头广告',           currentEnd: '2026-05-19' }
]

// ================================================================
// 装修增项申请 Mock 数据
// ================================================================
const ADD_ITEM_TABS = [
  { key: 'pending-survey',           label: '待踏勘',    badge: 1 },
  { key: 'my-initial-review',        label: '待我审核',  badge: 1 },
  { key: 'secondary-review',         label: '踏勘审核中',badge: 1 },
  { key: 'pending-submit-materials', label: '待递交材料',badge: 1 },
  { key: 'material-review',          label: '材料审核中',badge: 1 },
  { key: 'approval-in-progress',     label: '审批中',    badge: 1 },
  { key: 'pending-sign',             label: '待签署',    badge: 1 },
  { key: 'completed',                label: '已通过',    badge: 1 },
  { key: 'rejected',                 label: '已驳回',    badge: 2 },
  { key: 'cancelled',                label: '已取消',    badge: 1 }
]

const ADD_ITEM_STATUS = {
  'pending-survey':           { text: '待踏勘',    cls: 'status-orange' },
  'my-initial-review':        { text: '待我审核',  cls: 'status-orange' },
  'secondary-review':         { text: '踏勘审核中',cls: 'status-orange' },
  'pending-submit-materials': { text: '待递交材料',cls: 'status-orange' },
  'material-review':          { text: '材料审核中',cls: 'status-orange' },
  'approval-in-progress':     { text: '审批中',    cls: 'status-orange' },
  'pending-sign':             { text: '待签署',    cls: 'status-orange' },
  'completed':                { text: '已通过',    cls: 'status-green'  },
  'rejected':                 { text: '已驳回',    cls: 'status-red'    },
  'cancelled':                { text: '已取消',    cls: 'status-gray'   }
}

const ADD_ITEM_DATA = {
  'pending-survey': [{
    id:'ZX202605130001', applyId:'RX015', merchant:'瑞丰汽配', shop:'B10',
    contact:'张经理 139****5678', date:'2026-05-13 09:00',
    reason:'施工过程中需增加消防喷淋改造',
    needDelay:true, delayTo:'2026-07-15',
    addProjectsText:'喷淋改造、烟感增设', addCategories:'消防系统',
    addCategoryItems:[{ name:'消防系统', dept:'安保部', isMyDept:false, projects:[{name:'喷淋改造',level:3},{name:'烟感增设',level:2}] }]
  }],
  'my-initial-review': [{
    id:'ZX202605120002', applyId:'RX001', merchant:'北京拿铁旧机动车', shop:'B08',
    contact:'王经理 138****1234', date:'2026-05-12 10:00',
    reason:'需增设门头灯箱',
    needDelay:false, delayTo:'',
    addProjectsText:'灯箱安装', addCategories:'门头广告',
    addCategoryItems:[{ name:'门头广告', dept:'市场经营部', isMyDept:true, projects:[{name:'灯箱安装',level:2}] }],
    needMyReview:true
  }],
  'secondary-review': [{
    id:'ZX202605120001', applyId:'RX001', merchant:'北京拿铁旧机动车', shop:'B08',
    contact:'王经理 138****1234', date:'2026-05-12 10:00',
    reason:'施工过程中需增加消防喷淋改造',
    needDelay:true, delayTo:'2026-07-15',
    addProjectsText:'喷淋改造、烟感增设', addCategories:'消防系统',
    addCategoryItems:[{ name:'消防系统', dept:'安保部', isMyDept:false, projects:[{name:'喷淋改造',level:3},{name:'烟感增设',level:2}] }]
  }],
  'pending-submit-materials': [{
    id:'ZX202605110002', applyId:'RX015', merchant:'嘉诚名车', shop:'D07',
    contact:'李经理 136****8899', date:'2026-05-11 14:30',
    reason:'需增设门头灯箱',
    needDelay:false, delayTo:'',
    addProjectsText:'灯箱安装', addCategories:'门头广告',
    addCategoryItems:[{ name:'门头广告', dept:'市场经营部', isMyDept:true, projects:[{name:'灯箱安装',level:2}] }]
  }],
  'material-review': [{
    id:'ZX202605100003', applyId:'RX001', merchant:'北京拿铁旧机动车', shop:'B08',
    contact:'王经理 138****1234', date:'2026-05-10 09:00',
    reason:'电气线路增项改造',
    needDelay:false, delayTo:'',
    addProjectsText:'线路改造、配电箱更换', addCategories:'电气改造',
    addCategoryItems:[{ name:'电气改造', dept:'管理部', isMyDept:false, projects:[{name:'线路改造',level:2},{name:'配电箱更换',level:2}] }],
    materialReceived:'2026-05-11 10:30'
  }],
  'approval-in-progress': [{
    id:'ZX202605090004', applyId:'RX015', merchant:'嘉诚名车', shop:'D07',
    contact:'李经理 136****8899', date:'2026-05-09 16:00',
    reason:'给排水管道改造增项',
    needDelay:true, delayTo:'2026-07-01',
    addProjectsText:'管道改造', addCategories:'给排水',
    addCategoryItems:[{ name:'给排水', dept:'物业部', isMyDept:false, projects:[{name:'管道改造',level:2}] }],
    currentStep:'物业部副总审批'
  }],
  'pending-sign': [{
    id:'ZX202605080005', applyId:'RX001', merchant:'北京拿铁旧机动车', shop:'B08',
    contact:'王经理 138****1234', date:'2026-05-08 11:00',
    reason:'基建隔墙局部调整',
    needDelay:false, delayTo:'',
    addProjectsText:'隔墙砌筑', addCategories:'基建改造',
    addCategoryItems:[{ name:'基建改造', dept:'管理部', isMyDept:false, projects:[{name:'隔墙砌筑',level:2}] }]
  }],
  'completed': [{
    id:'ZX202605050007', applyId:'RX004', merchant:'鑫达名车', shop:'D03',
    contact:'赵经理 138****2233', date:'2026-05-05 09:30',
    reason:'招牌字体升级增项',
    needDelay:false, delayTo:'',
    addProjectsText:'招牌更换', addCategories:'门头广告',
    addCategoryItems:[{ name:'门头广告', dept:'市场经营部', isMyDept:true, projects:[{name:'招牌更换',level:2}] }],
    approveTime:'2026-05-06 14:00', approvePerson:'王经理（物业部）'
  }],
  'rejected': [
    {
      id:'ZX202605060008', applyId:'RX035', merchant:'红星车行', shop:'A08',
      contact:'刘经理 139****7788', date:'2026-05-04 10:00',
      reason:'基建隔墙局部调整增项',
      needDelay:false, delayTo:'',
      addProjectsText:'隔墙拆除', addCategories:'基建改造',
      addCategoryItems:[{ name:'基建改造', dept:'管理部', isMyDept:false, projects:[{name:'隔墙拆除',level:2}] }],
      rejectTime:'2026-05-06 11:00', rejectPerson:'周主任（管理部）', rejectType:'踏勘审核驳回',
      rejectReason:'现场踏勘发现隔墙属于承重结构，无法实施拆除，驳回申请',
      addItemReviewRecords:[
        { dept:'管理部主任审核',   result:'reject', resultText:'已驳回', person:'周主任', time:'2026-05-06 11:00', opinion:'现场踏勘发现隔墙属于承重结构，无法实施拆除，驳回申请' },
        { dept:'管理部踏勘签到',   result:'pass',   resultText:'已签到', person:'周工程', time:'2026-05-05 10:30', opinion:'' },
        { dept:'商户提交增项申请', result:'pass',   resultText:'已完成', person:'刘经理', time:'2026-05-04 10:00', opinion:'已提交增项申请' }
      ]
    },
    {
      id:'ZX202605050009', applyId:'RX001', merchant:'北京拿铁旧机动车', shop:'B08',
      contact:'王经理 138****1234', date:'2026-05-02 14:00',
      reason:'电气线路老化需增项改造',
      needDelay:true, delayTo:'2026-07-20',
      addProjectsText:'线路改造、配电箱更换', addCategories:'电气改造',
      addCategoryItems:[{ name:'电气改造', dept:'管理部', isMyDept:false, projects:[{name:'线路改造',level:2},{name:'配电箱更换',level:2}] }],
      rejectTime:'2026-05-05 15:30', rejectPerson:'李工（物业部）', rejectType:'材料审核驳回',
      rejectReason:'提交材料不完整，缺少施工方资质证书及消防审批文件',
      addItemReviewRecords:[
        { dept:'物业部审核材料',       result:'reject', resultText:'已驳回', person:'李工',   time:'2026-05-05 15:30', opinion:'提交材料不完整，缺少施工方资质证书及消防审批文件' },
        { dept:'物业部接收材料',       result:'pass',   resultText:'已接收', person:'赵经理', time:'2026-05-04 09:00', opinion:'' },
        { dept:'市场物业部提醒递交材料',result:'pass',   resultText:'已提醒', person:'赵经理', time:'2026-05-03 16:00', opinion:'' },
        { dept:'管理部主任审核',       result:'pass',   resultText:'已通过', person:'周主任', time:'2026-05-03 14:00', opinion:'电气改造增项主任审核通过' },
        { dept:'管理部员工初审',       result:'pass',   resultText:'已通过', person:'周工程', time:'2026-05-03 11:00', opinion:'电气改造增项初审通过' },
        { dept:'管理部踏勘签到',       result:'pass',   resultText:'已签到', person:'周工程', time:'2026-05-02 16:00', opinion:'' },
        { dept:'商户提交增项申请',     result:'pass',   resultText:'已完成', person:'王经理', time:'2026-05-02 14:00', opinion:'已提交增项申请' }
      ]
    }
  ],
  'cancelled': [{
    id:'ZX202605130002', applyId:'RX035', merchant:'红星车行', shop:'A08',
    contact:'刘经理 139****7788', date:'2026-05-13 09:00',
    reason:'门头灯箱尺寸调整增项',
    needDelay:false, delayTo:'',
    addProjectsText:'灯箱安装', addCategories:'门头广告',
    addCategoryItems:[{ name:'门头广告', dept:'市场经营部', isMyDept:true, projects:[{name:'灯箱安装',level:2}] }],
    cancelTime:'2026-05-14 16:30', cancelPerson:'红星车行（商户）', cancelReason:'商户主动取消增项申请',
    addItemReviewRecords:[
      { dept:'商户取消增项申请', result:'cancel', resultText:'已取消', person:'刘经理', time:'2026-05-14 16:30', opinion:'商户主动取消增项申请' },
      { dept:'工程部员工初审',   result:'pass',   resultText:'已通过', person:'周工程', time:'2026-05-13 16:00', opinion:'' },
      { dept:'物业部员工初审',   result:'pass',   resultText:'已通过', person:'赵经理', time:'2026-05-13 15:30', opinion:'' },
      { dept:'安保部踏勘签到',   result:'pass',   resultText:'已签到', person:'李安保', time:'2026-05-13 11:00', opinion:'' },
      { dept:'工程部踏勘签到',   result:'pass',   resultText:'已签到', person:'周工程', time:'2026-05-13 10:45', opinion:'' },
      { dept:'物业部踏勘签到',   result:'pass',   resultText:'已签到', person:'赵经理', time:'2026-05-13 10:30', opinion:'' },
      { dept:'商户提交增项申请', result:'pass',   resultText:'已完成', person:'刘经理', time:'2026-05-13 09:00', opinion:'已提交增项申请' }
    ]
  }]
}

// 关联申请的已有装修类目（当前装修类目）
const ADD_ITEM_APPLY_CATS = {
  'RX001': [
    { name:'门头广告', dept:'市场经营部', isMyDept:true,  projects:[{name:'招牌更换',level:2},{name:'灯箱安装',level:2}] },
    { name:'基建改造', dept:'管理部',     isMyDept:false, projects:[{name:'隔墙拆除',level:2},{name:'地面找平',level:1}] },
    { name:'消防系统', dept:'安保部',     isMyDept:false, projects:[{name:'消防栓移位',level:3}] }
  ],
  'RX015': [
    { name:'门头广告', dept:'市场经营部', isMyDept:true,  projects:[{name:'招牌安装',level:2},{name:'灯箱安装',level:2}] },
    { name:'基建改造', dept:'管理部',     isMyDept:false, projects:[{name:'隔墙砌筑',level:2}] }
  ],
  'RX004': [
    { name:'门头广告', dept:'市场经营部', isMyDept:true,  projects:[{name:'招牌制作',level:2}] }
  ],
  'RX035': [
    { name:'门头广告', dept:'市场经营部', isMyDept:true,  projects:[{name:'招牌安装',level:2},{name:'灯箱安装',level:2}] }
  ]
}

const ADD_ITEM_TAB_RANK = {
  'pending-survey':0,'my-initial-review':1,'secondary-review':2,
  'pending-submit-materials':3,'material-review':4,'approval-in-progress':5,
  'pending-sign':6,'completed':7,'rejected':8,'cancelled':9
}

// 按责任部门查人员信息
const ADD_ITEM_DEPT_META = {
  '市场经营部': { staff:'赵经理', director:'赵主任', vpDept:'营运部副总审批', vpPerson:'刘副总' },
  '管理部':     { staff:'周工程', director:'周主任', vpDept:'工程部副总审批',  vpPerson:'孙副总' },
  '安保部':     { staff:'李安保', director:'李主任', vpDept:'安保部副总审批',  vpPerson:'钱副总' },
  '物业部':     { staff:'赵经理', director:'赵主任', vpDept:'物业部副总审批',  vpPerson:'吴副总' }
}
const ADD_ITEM_VP_ORDER = ['营运部副总审批','安保部副总审批','工程部副总审批','物业部副总审批']

function buildAddItemTimeline(tab, item) {
  const rank = ADD_ITEM_TAB_RANK[tab] !== undefined ? ADD_ITEM_TAB_RANK[tab] : 7
  const cat = (item.addCategoryItems && item.addCategoryItems[0]) || {}
  const dept = cat.dept || '物业部'
  const catLabel = cat.name || item.addCategories || '增项'
  const isMyDept = dept === '市场经营部'
  const meta = ADD_ITEM_DEPT_META[dept] || ADD_ITEM_DEPT_META['物业部']
  const contact = (item.contact || '王经理').split(' ')[0]
  const timeline = []

  // 安保部上传安全协议
  if (rank >= 6) {
    timeline.push({ dept:'安保部上传安全协议', result: rank>=7?'pass':'waiting',
      text: rank>=7?'已上传':'待上传', person:'李安保',
      time: rank>=7?'2026-05-06 13:00':'',
      opinion: rank>=7?'已上传增项安全协议':'请安保部上传增项安全协议' })
  }

  // VP 审批（始终包含物业部副总）
  if (rank >= 5) {
    const vpSet = [meta.vpDept]
    if (!vpSet.includes('物业部副总审批')) vpSet.push('物业部副总审批')
    ADD_ITEM_VP_ORDER.forEach(vpDept => {
      if (!vpSet.includes(vpDept)) return
      const vpMeta = Object.values(ADD_ITEM_DEPT_META).find(m => m.vpDept === vpDept)
      const vpPerson = vpMeta ? vpMeta.vpPerson : '吴副总'
      if (rank === 5) {
        const isCurrentStep = item.currentStep === vpDept
        const curIdx = ADD_ITEM_VP_ORDER.indexOf(item.currentStep)
        const thisIdx = ADD_ITEM_VP_ORDER.indexOf(vpDept)
        if (isCurrentStep) {
          timeline.push({ dept:vpDept, result:'waiting', text:'审批中', person:vpPerson, time:'—' })
        } else if (curIdx >= 0 && thisIdx > curIdx) {
          timeline.push({ dept:vpDept, result:'waiting', text:'待审批', person:vpPerson, time:'—' })
        } else {
          timeline.push({ dept:vpDept, result:'pass', text:'已通过', person:vpPerson, time:'2026-05-06 11:00' })
        }
      } else {
        timeline.push({ dept:vpDept, result:'pass', text:'已通过', person:vpPerson, time:'2026-05-06 11:00' })
      }
    })
  }

  // 材料审核
  if (rank >= 4) {
    timeline.push({ dept:'物业部审核材料', result:rank>=5?'pass':'waiting',
      text:rank>=5?'已通过':'审核中', person:'李工',
      time:rank>=5?'2026-05-06 09:30':'—',
      opinion:rank>=5?'增项材料齐全，审核通过':'正在审核增项线下材料' })
  }
  if (rank >= 3) {
    const received = item.materialReceived || '2026-05-06 09:00'
    timeline.push({ dept:'物业部接收材料', result:'pass', text:'已接收', person:'赵经理', time:received })
    timeline.push({ dept:'市场物业部提醒递交材料', result: rank===3?'waiting':'pass',
      text:rank===3?'待递交':'已提醒', person:rank===3?'赵经理':'赵经理',
      time:rank===3?'—':'2026-05-05 16:30',
      opinion:rank===3?'请将增项材料递交至物业前台':'' })
  }

  // 部门主任审核
  if (rank >= 2) {
    const dirSt = rank >= 3 ? 'pass' : (tab === 'secondary-review' && !isMyDept ? 'waiting' : (rank >= 3 ? 'pass' : 'waiting'))
    const isWaiting = tab === 'secondary-review' && !isMyDept
    timeline.push({ dept: dept+'主任审核', result: isWaiting?'waiting':'pass',
      text: isWaiting?'审核中':'已通过',
      person: meta.director, time: isWaiting?'—':'2026-05-05 16:00',
      opinion: catLabel+'增项主任审核'+(isWaiting?'进行中':'通过') })
  }

  // 部门员工初审
  if (rank >= 1) {
    const isInitialWaiting = tab === 'my-initial-review' && isMyDept
    timeline.push({ dept: dept+'员工初审', result: isInitialWaiting?'waiting':'pass',
      text: isInitialWaiting?'审核中':'已通过',
      person: meta.staff, time: isInitialWaiting?'—':'2026-05-05 14:30',
      opinion: catLabel+'增项初审'+(isInitialWaiting?'进行中':'通过') })
  }

  // 踏勘签到
  const isSurveyWaiting = rank < 1
  timeline.push({ dept: dept+'踏勘签到', result: isSurveyWaiting?'waiting':'pass',
    text: isSurveyWaiting?'待踏勘':'已签到',
    person: meta.staff, time: isSurveyWaiting?'—':'2026-05-05 10:00',
    opinion: catLabel+'现场踏勘'+(isSurveyWaiting?'待完成':'已完成') })

  // 商户提交
  timeline.push({ dept:'商户提交增项申请', result:'pass', text:'已完成',
    person:contact, time:item.date, opinion:'已提交增项申请' })

  return timeline
}

function buildAddItemDetailData(tab, item) {
  const sc = ADD_ITEM_STATUS[tab] || { text:'—', cls:'status-orange' }
  const rank = ADD_ITEM_TAB_RANK[tab] !== undefined ? ADD_ITEM_TAB_RANK[tab] : 0

  // 当前装修类目状态：关联申请处于施工中
  const curCatStatus = { text:'施工中', cls:'status-orange' }
  const currentCategories = (ADD_ITEM_APPLY_CATS[item.applyId] || ADD_ITEM_APPLY_CATS['RX001']).map(c => ({
    ...c, statusText: curCatStatus.text, statusCls: curCatStatus.cls
  }))

  // 增项装修类目状态：依据当前 tab 和 isMyDept
  function getNewCatStatus(isMyDept) {
    if (tab === 'pending-survey') return { text:'待踏勘', cls:'status-orange' }
    if (tab === 'my-initial-review') return isMyDept ? { text:'待我审核', cls:'status-orange' } : { text:'已审核', cls:'status-green' }
    if (tab === 'secondary-review')  return isMyDept ? { text:'已审核', cls:'status-green' }  : { text:'踏勘审核中', cls:'status-orange' }
    if (tab === 'completed')  return { text:'已通过', cls:'status-green' }
    if (tab === 'rejected')   return { text:'已驳回', cls:'status-red'   }
    if (tab === 'cancelled')  return { text:'已取消', cls:'status-orange' }
    return { text:'已审核', cls:'status-green' }
  }
  const rawNewCats = item.addCategoryItems || [{ name: item.addCategories||'增项', dept:'物业部', isMyDept:false, projects: (item.addProjectsText||'').split(/[、,]/).map(s=>({name:s.trim(),level:2})).filter(p=>p.name) }]
  const newCategories = rawNewCats.map(c => {
    const st = getNewCatStatus(c.isMyDept)
    return { ...c, statusText: st.text, statusCls: st.cls }
  })

  // 附件（已取消不展示）
  const attachments = []
  if (tab !== 'cancelled') {
    attachments.push({ label:'增项施工方案', name:'增项施工方案.pdf', type:'pdf' })
    attachments.push({ label:'施工方合同',   name:'施工方合同.pdf',   type:'pdf' })
    attachments.push({ label:'施工方资质',   name:'施工方资质.pdf',   type:'pdf' })
    if (tab === 'material-review' || tab === 'approval-in-progress' || tab === 'completed' || tab === 'pending-sign') {
      const received = item.materialReceived || '2026-05-11 09:00'
      attachments.push({ type:'divider' })
      attachments.push({ type:'group-title', label:'线下递交材料' })
      attachments.push({ label:'接收时间 '+received+'（赵经理·物业部）', name:'增项施工方案（纸质）.pdf', type:'pdf' })
      attachments.push({ label:'施工方合同（纸质）', name:'施工方合同（纸质）.pdf', type:'pdf' })
    }
    if (rank >= 6 && tab !== 'rejected' && tab !== 'cancelled') {
      attachments.push({ type:'divider' })
      attachments.push({ type:'group-title', label:'安全协议' })
      attachments.push({ label:'增项安全协议', name:'增项安全协议.pdf', type:'pdf' })
    }
  }

  // 审核信息
  const auditInfo = tab === 'completed' ? { approveTime: item.approveTime, approvePerson: item.approvePerson } : null

  // 时间线：已取消/已驳回使用数据中的 addItemReviewRecords
  const timeline = (tab === 'cancelled' || tab === 'rejected')
    ? (item.addItemReviewRecords || []).map(r => ({
        dept: r.dept, result: r.result, text: r.resultText,
        person: r.person, time: r.time, opinion: r.opinion
      }))
    : buildAddItemTimeline(tab, item)

  // 底部按钮
  const btnMap = {
    'pending-survey':           { action:'survey',           text:'签到踏勘' },
    'my-initial-review':        { action:'review',           text:'立即审核' },
    'pending-submit-materials': { action:'confirm-material', text:'确认接收材料' },
    'approval-in-progress':     { action:'approve',          text:'立即审批' }
  }
  const btnPrimary   = btnMap[tab] || null
  const btnSecondary = { action:'back', text:'返回列表' }

  return { sc, currentCategories, newCategories, attachments, auditInfo,
    timeline, btnPrimary, btnSecondary }
}

// ================================================================
// 商户端 - 增项申请
// ================================================================
const MERCHANT_ADD_ITEM_TABS = [
  { key: 'survey-reviewing', label: '踏勘审核中', badge: 1 },
  { key: 'pending-submit',   label: '待递交材料', badge: 1 },
  { key: 'material-review',  label: '材料审核中', badge: 1 },
  { key: 'approving',        label: '审批中',     badge: 1 },
  { key: 'pending-sign',     label: '待签署',     badge: 1 },
  { key: 'approved',         label: '已通过',     badge: 1 },
  { key: 'rejected',         label: '已驳回',     badge: 1 },
  { key: 'cancelled',        label: '已取消',     badge: 1 }
]

const MERCHANT_ADD_ITEM_STATUS = {
  'survey-reviewing': { text: '踏勘审核中', color: 'var(--color-warning)'  },
  'pending-submit':   { text: '待递交材料', color: 'var(--color-danger)'   },
  'material-review':  { text: '材料审核中', color: 'var(--color-warning)'  },
  'approving':        { text: '审批中',     color: 'var(--color-warning)'  },
  'pending-sign':     { text: '待签署',     color: 'var(--color-danger)'   },
  'approved':         { text: '已通过',     color: 'var(--color-primary)'  },
  'rejected':         { text: '已驳回',     color: 'var(--color-danger)'   },
  'cancelled':        { text: '已取消',     color: '#999999'               }
}

const MERCHANT_ADD_ITEM_DATA = {
  'survey-reviewing': [{
    id:'ZX202605120001', applyId:'RX001', shop:'B08',
    date:'2026-05-12 10:00', reason:'施工过程中需增加消防喷淋改造',
    needDelay:true, delayTo:'2026-07-15',
    addProjectsText:'喷淋改造、烟感增设', addCategories:'消防系统',
    addCategoryItems:[{ name:'消防系统', projects:[{name:'喷淋改造'},{name:'烟感增设'}] }],
    currentStep:'多部门协同踏勘'
  }],
  'pending-submit': [{
    id:'ZX202605110002', applyId:'RX015', shop:'D07',
    date:'2026-05-11 14:30', reason:'需增设门头灯箱',
    needDelay:false, delayTo:'',
    addProjectsText:'灯箱安装', addCategories:'门头广告',
    materialTip:'踏勘已通过，请尽快将纸质材料递交至物业前台'
  }],
  'material-review': [{
    id:'ZX202605100003', applyId:'RX001', shop:'B08',
    date:'2026-05-10 09:00', reason:'电气线路增项改造',
    needDelay:false, delayTo:'',
    addProjectsText:'线路改造、配电箱更换', addCategories:'电气改造',
    materialReceived:'2026-05-11 10:30'
  }],
  'approving': [{
    id:'ZX202605090004', applyId:'RX015', shop:'D07',
    date:'2026-05-09 16:00', reason:'给排水管道改造增项',
    needDelay:true, delayTo:'2026-07-01',
    addProjectsText:'管道改造', addCategories:'给排水',
    currentStep:'市场部主任审批'
  }],
  'pending-sign': [{
    id:'ZX202605080005', applyId:'RX001', shop:'B08',
    date:'2026-05-08 11:00', reason:'基建隔墙局部调整',
    needDelay:false, delayTo:'',
    addProjectsText:'隔墙砌筑', addCategories:'基建改造'
  }],
  'approved': [{
    id:'ZX202605050007', applyId:'RX004', shop:'D03',
    date:'2026-05-05 09:30', reason:'招牌字体升级增项',
    needDelay:false, delayTo:'',
    addProjectsText:'招牌更换', addCategories:'门头广告',
    approveTime:'2026-05-06 14:00', approvePerson:'王经理（物业部）'
  }],
  'rejected': [{
    id:'ZX202605040008', applyId:'RX020', shop:'A12',
    date:'2026-05-04 10:00', reason:'大面积结构改造',
    needDelay:true, delayTo:'2026-08-01',
    addProjectsText:'承重墙拆除', addCategories:'基建改造',
    rejectReason:'增项涉及结构改动，需补充结构安全鉴定报告',
    rejectTime:'2026-05-05 16:30', rejectPerson:'赵经理（工程部）',
    rejectType:'踏勘审核驳回'
  }],
  'cancelled': [{
    id:'ZX202605130002', applyId:'RX035', shop:'A08',
    date:'2026-05-13 09:00', reason:'门头灯箱尺寸调整增项',
    needDelay:false, delayTo:'',
    addProjectsText:'灯箱安装', addCategories:'门头广告',
    cancelTime:'2026-05-14 16:30', cancelPerson:'红星车行（商户）',
    cancelReason:'商户主动取消增项申请'
  }]
}

// 商户端增项申请记录时间线模板
// 最后一个节点的 time 用空字符串占位，由 Vue 在运行时替换为 item.date
const MERCHANT_ADD_ITEM_TIMELINE = {
  'survey-reviewing': [
    { dept:'物业部初审',    result:'waiting', text:'审核中', person:'赵经理', time:'—' },
    { dept:'工程部初审',    result:'waiting', text:'审核中', person:'周工程', time:'—' },
    { dept:'安保部初审',    result:'waiting', text:'审核中', person:'李安保', time:'—' },
    { dept:'安保部踏勘签到', result:'pass',   text:'已签到', person:'李安保', time:'2026-05-12 09:30' },
    { dept:'工程部踏勘签到', result:'pass',   text:'已签到', person:'周工程', time:'2026-05-12 09:15' },
    { dept:'物业部踏勘签到', result:'pass',   text:'已签到', person:'赵经理', time:'2026-05-12 09:00' },
    { dept:'商户提交增项申请', result:'pass', text:'已完成', person:'', time:'' }
  ],
  'pending-submit': [
    { dept:'市场物业部提醒递交材料', result:'waiting', text:'待递交', person:'—', time:'—' },
    { dept:'物业部主任审核', result:'pass', text:'已通过', person:'赵主任', time:'2026-05-10 16:00' },
    { dept:'工程部主任审核', result:'pass', text:'已通过', person:'周主任', time:'2026-05-10 15:30' },
    { dept:'安保部主任审核', result:'pass', text:'已通过', person:'李主任', time:'2026-05-10 15:00' },
    { dept:'物业部员工初审', result:'pass', text:'已通过', person:'赵经理', time:'2026-05-10 14:30' },
    { dept:'工程部员工初审', result:'pass', text:'已通过', person:'周工程', time:'2026-05-10 14:00' },
    { dept:'安保部员工初审', result:'pass', text:'已通过', person:'李安保', time:'2026-05-10 11:30' },
    { dept:'安保部踏勘签到', result:'pass', text:'已签到', person:'李安保', time:'2026-05-10 10:30' },
    { dept:'工程部踏勘签到', result:'pass', text:'已签到', person:'周工程', time:'2026-05-10 10:15' },
    { dept:'物业部踏勘签到', result:'pass', text:'已签到', person:'赵经理', time:'2026-05-10 10:00' },
    { dept:'商户提交增项申请', result:'pass', text:'已完成', person:'', time:'' }
  ],
  'material-review': [
    { dept:'物业部审核材料', result:'waiting', text:'审核中', person:'李工', time:'—' },
    { dept:'物业部接收材料', result:'pass', text:'已接收', person:'赵经理', time:'2026-05-11 09:00' },
    { dept:'市场物业部提醒递交材料', result:'pass', text:'已提醒', person:'赵经理', time:'2026-05-10 16:30' },
    { dept:'物业部主任审核', result:'pass', text:'已通过', person:'赵主任', time:'2026-05-10 16:00' },
    { dept:'工程部主任审核', result:'pass', text:'已通过', person:'周主任', time:'2026-05-10 15:30' },
    { dept:'安保部主任审核', result:'pass', text:'已通过', person:'李主任', time:'2026-05-10 15:00' },
    { dept:'物业部员工初审', result:'pass', text:'已通过', person:'赵经理', time:'2026-05-10 14:30' },
    { dept:'工程部员工初审', result:'pass', text:'已通过', person:'周工程', time:'2026-05-10 14:00' },
    { dept:'安保部员工初审', result:'pass', text:'已通过', person:'李安保', time:'2026-05-10 11:30' },
    { dept:'安保部踏勘签到', result:'pass', text:'已签到', person:'李安保', time:'2026-05-10 10:30' },
    { dept:'工程部踏勘签到', result:'pass', text:'已签到', person:'周工程', time:'2026-05-10 10:15' },
    { dept:'物业部踏勘签到', result:'pass', text:'已签到', person:'赵经理', time:'2026-05-10 10:00' },
    { dept:'商户提交增项申请', result:'pass', text:'已完成', person:'', time:'' }
  ],
  'approving': [
    { dept:'营运副总审批', result:'waiting', text:'审批中', person:'刘副总', time:'—' },
    { dept:'工程副总审批', result:'pass', text:'已通过', person:'陈副总', time:'2026-05-09 16:30' },
    { dept:'物业副总审批', result:'pass', text:'已通过', person:'张副总', time:'2026-05-09 15:00' },
    { dept:'物业部审核材料', result:'pass', text:'已通过', person:'李工',   time:'2026-05-09 14:45' },
    { dept:'物业部接收材料', result:'pass', text:'已接收', person:'赵经理', time:'2026-05-09 14:30' },
    { dept:'市场物业部提醒递交材料', result:'pass', text:'已提醒', person:'赵经理', time:'2026-05-09 13:00' },
    { dept:'物业部主任审核', result:'pass', text:'已通过', person:'赵主任', time:'2026-05-09 11:30' },
    { dept:'工程部主任审核', result:'pass', text:'已通过', person:'周主任', time:'2026-05-09 11:15' },
    { dept:'安保部主任审核', result:'pass', text:'已通过', person:'李主任', time:'2026-05-09 11:00' },
    { dept:'物业部员工初审', result:'pass', text:'已通过', person:'赵经理', time:'2026-05-09 10:30' },
    { dept:'工程部员工初审', result:'pass', text:'已通过', person:'周工程', time:'2026-05-09 10:15' },
    { dept:'安保部员工初审', result:'pass', text:'已通过', person:'李安保', time:'2026-05-09 10:00' },
    { dept:'安保部踏勘签到', result:'pass', text:'已签到', person:'李安保', time:'2026-05-09 09:45' },
    { dept:'工程部踏勘签到', result:'pass', text:'已签到', person:'周工程', time:'2026-05-09 09:30' },
    { dept:'物业部踏勘签到', result:'pass', text:'已签到', person:'赵经理', time:'2026-05-09 09:15' },
    { dept:'商户提交增项申请', result:'pass', text:'已完成', person:'', time:'' }
  ],
  'pending-sign': [
    { dept:'等待签署安全协议', result:'waiting', text:'待签署', person:'—', time:'—' },
    { dept:'营运副总审批', result:'pass', text:'已通过', person:'刘副总', time:'2026-05-06 11:30' },
    { dept:'工程副总审批', result:'pass', text:'已通过', person:'陈副总', time:'2026-05-06 11:00' },
    { dept:'物业副总审批', result:'pass', text:'已通过', person:'张副总', time:'2026-05-06 10:30' },
    { dept:'物业部审核材料', result:'pass', text:'已通过', person:'李工',   time:'2026-05-06 10:00' },
    { dept:'物业部接收材料', result:'pass', text:'已接收', person:'赵经理', time:'2026-05-06 09:45' },
    { dept:'市场物业部提醒递交材料', result:'pass', text:'已提醒', person:'赵经理', time:'2026-05-06 09:00' },
    { dept:'物业部主任审核', result:'pass', text:'已通过', person:'赵主任', time:'2026-05-05 16:30' },
    { dept:'工程部主任审核', result:'pass', text:'已通过', person:'周主任', time:'2026-05-05 16:15' },
    { dept:'安保部主任审核', result:'pass', text:'已通过', person:'李主任', time:'2026-05-05 16:00' },
    { dept:'物业部员工初审', result:'pass', text:'已通过', person:'赵经理', time:'2026-05-05 15:30' },
    { dept:'工程部员工初审', result:'pass', text:'已通过', person:'周工程', time:'2026-05-05 15:15' },
    { dept:'安保部员工初审', result:'pass', text:'已通过', person:'李安保', time:'2026-05-05 15:00' },
    { dept:'安保部踏勘签到', result:'pass', text:'已签到', person:'李安保', time:'2026-05-05 14:45' },
    { dept:'工程部踏勘签到', result:'pass', text:'已签到', person:'周工程', time:'2026-05-05 14:30' },
    { dept:'物业部踏勘签到', result:'pass', text:'已签到', person:'赵经理', time:'2026-05-05 14:15' },
    { dept:'商户提交增项申请', result:'pass', text:'已完成', person:'', time:'' }
  ],
  'approved': [
    { dept:'审批完成', result:'pass', text:'已通过', person:'', time:'' },
    { dept:'营运副总审批', result:'pass', text:'已通过', person:'刘副总', time:'2026-05-06 11:30' },
    { dept:'工程副总审批', result:'pass', text:'已通过', person:'陈副总', time:'2026-05-06 11:00' },
    { dept:'物业副总审批', result:'pass', text:'已通过', person:'张副总', time:'2026-05-06 10:30' },
    { dept:'物业部审核材料', result:'pass', text:'已通过', person:'李工',   time:'2026-05-06 09:45' },
    { dept:'物业部接收材料', result:'pass', text:'已接收', person:'赵经理', time:'2026-05-06 09:30' },
    { dept:'市场物业部提醒递交材料', result:'pass', text:'已提醒', person:'赵经理', time:'2026-05-06 09:00' },
    { dept:'物业部主任审核', result:'pass', text:'已通过', person:'赵主任', time:'2026-05-05 16:30' },
    { dept:'工程部主任审核', result:'pass', text:'已通过', person:'周主任', time:'2026-05-05 16:15' },
    { dept:'安保部主任审核', result:'pass', text:'已通过', person:'李主任', time:'2026-05-05 16:00' },
    { dept:'物业部员工初审', result:'pass', text:'已通过', person:'赵经理', time:'2026-05-05 15:30' },
    { dept:'工程部员工初审', result:'pass', text:'已通过', person:'周工程', time:'2026-05-05 15:15' },
    { dept:'安保部员工初审', result:'pass', text:'已通过', person:'李安保', time:'2026-05-05 15:00' },
    { dept:'安保部踏勘签到', result:'pass', text:'已签到', person:'李安保', time:'2026-05-05 14:45' },
    { dept:'工程部踏勘签到', result:'pass', text:'已签到', person:'周工程', time:'2026-05-05 14:30' },
    { dept:'物业部踏勘签到', result:'pass', text:'已签到', person:'赵经理', time:'2026-05-05 14:15' },
    { dept:'商户提交增项申请', result:'pass', text:'已完成', person:'', time:'' }
  ],
  'rejected': [
    { dept:'踏勘审核驳回', result:'cancel', text:'已驳回', person:'', time:'' },
    { dept:'工程部初审', result:'pass', text:'已通过', person:'周工程', time:'2026-05-06 10:30' },
    { dept:'安保部初审', result:'pass', text:'已通过', person:'李安保', time:'2026-05-06 10:00' },
    { dept:'物业部初审', result:'pass', text:'已通过', person:'赵经理', time:'2026-05-06 09:30' },
    { dept:'安保部踏勘签到', result:'pass', text:'已签到', person:'李安保', time:'2026-05-05 09:30' },
    { dept:'工程部踏勘签到', result:'pass', text:'已签到', person:'周工程', time:'2026-05-05 09:15' },
    { dept:'物业部踏勘签到', result:'pass', text:'已签到', person:'赵经理', time:'2026-05-05 09:00' },
    { dept:'商户提交增项申请', result:'pass', text:'已完成', person:'', time:'' }
  ]
}

// ─── 市场端：特殊作业申请 ────────────────────────────────────────────────────

const SPECIAL_TABS = [
  { key: 'my-review', label: '待我审核', badge: 3 },
  { key: 'reviewing', label: '审核中',   badge: 3 },
  { key: 'approved',  label: '已通过',   badge: 3 },
  { key: 'rejected',  label: '已驳回',   badge: 2 },
  { key: 'expired',   label: '已过期',   badge: 3 },
]

const SPECIAL_STATUS = {
  'my-review': { text: '待我审核', cls: 'status-orange' },
  'reviewing':  { text: '审核中',   cls: 'status-orange' },
  'rejected':   { text: '已驳回',   cls: 'status-red'    },
  'approved':   { text: '已通过',   cls: 'status-green'  },
  'expired':    { text: '已过期',   cls: 'status-grey'   },
}

const SPECIAL_DATA = {
  'my-review': [
    { id:'TS202605150001', type:'fire',     applyId:'RX001', merchant:'北京拿铁旧机动车', shop:'B08', contact:'王经理 138****1234', workTime:'2026-05-15 09:00~17:00', workLocation:'B08室内',    workContent:'焊接门框支架',       supervisor:'王工', supervisorPhone:'136****8888', workerCount:2, fireType:'焊接', fireExtinguisher:2, fireClear:'已清理', guardian:'赵监护 137****9999', safetyMeasures:'配备灭火器2具，专人监护',        date:'2026-05-14 10:30', currentStep:'安保部员工审核', timelineStage:'employee' },
    { id:'TS202605140007', type:'height',   applyId:'RX002', merchant:'北京车天下二手车',  shop:'A12', contact:'赵经理 138****2233', workTime:'2026-05-18 08:00~12:00', workLocation:'A12门头',    workContent:'外墙灯箱检修',       supervisor:'李工', supervisorPhone:'139****5678', workerCount:2, workHeight:'3米以上', heightGuards:'安全带、警戒围挡', guardian:'周监护 131****5555', safetyMeasures:'持证上岗，设专人监护',           date:'2026-05-14 09:00', currentStep:'物业部主任审核', timelineStage:'director' },
    { id:'TS202605140008', type:'electric', applyId:'RX015', merchant:'嘉诚名车',         shop:'D07', contact:'李经理 136****8899', workDate:'2026-06-01 至 2026-08-01',               workLocation:'D07施工区',  workContent:'装修期间临时施工用电', supervisor:'刘工', supervisorPhone:'135****2222', workerCount:5, electricPointCount:3,                                                          safetyMeasures:'线路穿管保护，漏电保护已检测',   date:'2026-05-14 11:00', currentStep:'物业部员工审核', timelineStage:'employee' },
  ],
  'reviewing': [
    { id:'TS202605160002', type:'height',   applyId:'RX002', merchant:'北京车天下二手车',  shop:'A12', contact:'赵经理 138****2233', workTime:'2026-05-20 08:00~17:00', workLocation:'A12门头',    workContent:'门头钢架安装',       supervisor:'李工', supervisorPhone:'139****5678', workerCount:3, workHeight:'5米以上', heightGuards:'安全带及安全绳、安全网', guardian:'周监护 131****5555', safetyMeasures:'已设置警戒区域，持证上岗', date:'2026-05-15 10:30', currentStep:'物业部主任审核', timelineStage:'director' },
    { id:'TS202605170007', type:'electric', applyId:'RX001', merchant:'北京拿铁旧机动车', shop:'B08', contact:'王经理 138****1234', workDate:'2026-06-01 至 2026-06-30',               workLocation:'B08施工区',  workContent:'装修期间临时施工用电', supervisor:'赵工', supervisorPhone:'139****6666', workerCount:5, electricPointCount:3,                                                          safetyMeasures:'线路穿管保护，漏电保护已检测',   date:'2026-05-17 11:20', currentStep:'物业部员工审核', timelineStage:'employee' },
    { id:'TS202605180003', type:'fire',     applyId:'RX015', merchant:'嘉诚名车',         shop:'D11', contact:'李经理 136****8899', workTime:'2026-05-19 14:00~18:00', workLocation:'D11施工区',  workContent:'初装回场焊接',       supervisor:'周工', supervisorPhone:'137****7788', workerCount:2, fireType:'气焊', fireExtinguisher:1, fireClear:'已清理', guardian:'张监护 138****5566', safetyMeasures:'配备灭火器，全程监护',          date:'2026-05-17 14:20', currentStep:'安保部主任审核', timelineStage:'director' },
  ],
  'rejected': [
    { id:'TS202605100003', type:'electric', applyId:'RX015', merchant:'嘉诚名车',  shop:'D07', contact:'李经理 136****8899', workDate:'2026-05-20 至 2026-07-10', workLocation:'D07施工区', workContent:'临时施工用电', supervisor:'刘工', supervisorPhone:'135****2222', workerCount:4, electricPointCount:2, safetyMeasures:'线路穿管保护，漏电保护已检测', date:'2026-05-10 14:00', rejectAtStep:'employee', rejectReason:'电工证复印件不清晰，请重新上传',                        rejectTime:'2026-05-11 11:00', rejectPerson:'赵经理（物业部）' },
    { id:'TS202605110009', type:'fire',     applyId:'RX004', merchant:'鑫达名车',  shop:'D03', contact:'赵经理 138****2233', workTime:'2026-05-12 09:00~16:00',   workLocation:'D03商铺',    workContent:'气焊管道接口', supervisor:'陈工', supervisorPhone:'133****4444', workerCount:2, fireType:'气焊', fireExtinguisher:2, fireClear:'已清理', guardian:'周监护 131****5555', safetyMeasures:'配备灭火器，专人监护', date:'2026-05-10 16:00', rejectAtStep:'director', rejectReason:'动火点距可燃物不足安全距离，请调整方案后重新申请', rejectTime:'2026-05-11 16:30', rejectPerson:'李主任（安保部）' },
  ],
  'approved': [
    { id:'TS202605080004', type:'fire',     applyId:'RX004', merchant:'鑫达名车',         shop:'D03', contact:'赵经理 138****2233', workTime:'2026-05-10 09:00~16:00', workLocation:'D03商铺',    workContent:'焊接货架',       supervisor:'陈工', supervisorPhone:'133****4444', workerCount:2, fireType:'焊接', fireExtinguisher:2, fireClear:'已清理', guardian:'周监护 131****5555', safetyMeasures:'配备灭火器2具，专人监护', date:'2026-05-08 09:30', approveTime:'2026-05-09 10:00', approvePerson:'李主任（安保部）', approveOpinion:'同意动火，请按批准时段作业', validUntil:'2026-05-10 16:00' },
    { id:'TS202605070010', type:'height',   applyId:'RX001', merchant:'北京拿铁旧机动车', shop:'B08', contact:'王经理 138****1234', workTime:'2026-05-08 08:00~12:00', workLocation:'B08门头',    workContent:'门头钢架安装固定', supervisor:'张工', supervisorPhone:'138****1122', workerCount:3, workHeight:'5米以上', heightGuards:'安全带及安全绳、安全网', guardian:'李监护 139****5678', safetyMeasures:'已设置警戒区域，持证上岗', date:'2026-05-07 10:00', approveTime:'2026-05-07 16:00', approvePerson:'赵主任（物业部）', approveOpinion:'同意高空作业，请做好防坠落措施', validUntil:'2026-05-08 12:00' },
    { id:'TS202605080005', type:'electric', applyId:'RX015', merchant:'嘉诚名车',         shop:'C05', contact:'张经理 139****5678', workDate:'2026-05-10 至 2026-05-10',               workLocation:'C05施工区',  workContent:'电切断机临时用电', supervisor:'孙工', supervisorPhone:'137****1111', workerCount:3, electricPointCount:1,                                                          safetyMeasures:'线路穿管保护，漏电保护已检测',   date:'2026-05-09 09:00', approveTime:'2026-05-09 16:30', approvePerson:'赵主任（物业部）', approveOpinion:'同意临时用电，请确保线路安全', validUntil:'2026-05-10 18:00' },
  ],
  'expired': [
    { id:'TS202605010005', type:'height',   applyId:'RX004', merchant:'鑫达名车', shop:'D03', contact:'赵经理 138****2233', workTime:'2026-05-05 09:00~16:00', workLocation:'D03商铺门前', workContent:'门头广告牌维护',       supervisor:'陈工', supervisorPhone:'133****4444', workerCount:2, workHeight:'2~5米', heightGuards:'安全带及安全绳、警示围挡', guardian:'周监护 131****5555', safetyMeasures:'已落实防坠落措施', date:'2026-05-01 10:00', approveTime:'2026-05-02 14:00', approvePerson:'赵主任（物业部）', validUntil:'2026-05-05 16:00', expiredTime:'2026-05-06 00:00', expireReason:'已超过批准作业截止时间，如需继续作业请重新申请' },
    { id:'TS202604280006', type:'electric', applyId:'RX015', merchant:'嘉诚名车', shop:'D07', contact:'李经理 136****8899', workDate:'2026-05-20 至 2026-07-10',               workLocation:'D07施工区',   workContent:'临时施工用电',           supervisor:'刘工', supervisorPhone:'135****2222', workerCount:3, electricPointCount:1,                                                        safetyMeasures:'线路穿管保护，漏电保护已检测',   date:'2026-04-26 09:30', approveTime:'2026-04-27 11:00', approvePerson:'赵主任（物业部）', validUntil:'2026-04-28 18:00', expiredTime:'2026-04-29 00:00', expireReason:'批准作业时段已结束，审批资格自动失效' },
    { id:'TS202605200001', type:'fire',     applyId:'RX015', merchant:'优车之家', shop:'C05', contact:'张经理 139****5678', workTime:'2026-05-20 09:00~15:00', workLocation:'C05施工区',   workContent:'焊接货架支撑加固',     supervisor:'刘工', supervisorPhone:'135****2222', workerCount:2, fireType:'气焊', fireExtinguisher:2, fireClear:'已清理', guardian:'张监护 138****5566', safetyMeasures:'配备灭火器，专人监护',          date:'2026-04-25 11:00', approveTime:'2026-04-25 15:00', approvePerson:'李主任（安保部）',  validUntil:'2026-05-20 15:00', expiredTime:'2026-05-21 00:00', expireReason:'已超过批准作业日期' },
  ],
}

const SPECIAL_TYPE_LABEL = { fire:'动火作业', height:'高空作业', electric:'临时用电' }
const SPECIAL_DEPT       = { fire:'安保部',   height:'物业部',   electric:'物业部'   }

const SP_DEPT_META = {
  property: { deptName:'物业部', emp:{ dept:'物业部员工审核', person:'赵经理' }, dir:{ dept:'物业部主任审核', person:'赵主任' } },
  security: { deptName:'安保部', emp:{ dept:'安保部员工审核', person:'李安保' }, dir:{ dept:'安保部主任审核', person:'李主任' } }
}

function buildSpecialDetailData(tab, item) {
  const sc        = SPECIAL_STATUS[tab] || { text:'—', cls:'' }
  const typeLabel = SPECIAL_TYPE_LABEL[item.type] || '特殊作业'
  const meta      = item.type === 'fire' ? SP_DEPT_META.security : SP_DEPT_META.property
  const emp = meta.emp, dir = meta.dir
  const stage    = item.timelineStage || 'employee'
  const merchant = item.contact ? String(item.contact).split(/\s+/)[0] : '商户'

  // 附件
  const attachments = [{ type:'group-title', label:'作业材料' }]
  if (item.type === 'fire') {
    attachments.push({ type:'pdf', label:'特种作业人员操作证', name:'焊接操作证_王工.pdf' })
    attachments.push({ type:'pdf', label:'动火方案',           name:'B08动火方案.pdf' })
    attachments.push({ type:'pdf', label:'灭火器配置清单（选填）', name:'灭火器配置清单.pdf', optional:true })
  } else if (item.type === 'height') {
    attachments.push({ type:'pdf', label:'特种作业人员操作证', name:'高空作业证_李工.pdf' })
    attachments.push({ type:'pdf', label:'高空作业方案',       name:'高空作业方案.pdf' })
  } else {
    attachments.push({ type:'pdf', label:'电工操作证',         name:'电工操作证.pdf' })
    attachments.push({ type:'pdf', label:'临时用电方案',       name:'临时用电方案.pdf' })
  }
  attachments.push({ type:'img', label:'现场照片', name:'现场照片.jpg' })

  // 时间线（对齐原型 buildSpecialReviewRecords 逻辑）
  const submitNode = {
    dept:'商户提交申请', result:'pass', text:'已完成',
    person: merchant, time: item.date || '—',
    opinion: '说明：已提交' + typeLabel + '申请'
  }
  let timeline = []

  if (tab === 'my-review' || tab === 'reviewing') {
    const reviewText = tab === 'my-review' ? '待我审核' : '审核中'
    if (stage === 'director') {
      timeline = [
        { dept:dir.dept, result:'waiting', text:reviewText,
          person: item.directorApprover || dir.person, time: '',
          opinion: '说明：' + typeLabel + '申请待' + meta.deptName + '主任审核' },
        { dept:emp.dept, result:'pass', text:'已通过',
          person: item.employeeApprover || emp.person, time: item.employeeApproveTime || '—',
          opinion: '审核意见：' + (item.employeeApproveOpinion || meta.deptName + '员工审核通过') },
        submitNode,
      ]
    } else {
      timeline = [
        { dept:dir.dept, result:'pending', text:'待审核',
          person: item.directorApprover || dir.person, time: '—',
          opinion: '说明：待' + meta.deptName + '主任审核' },
        { dept:emp.dept, result:'waiting', text:reviewText,
          person: item.employeeApprover || emp.person, time: '',
          opinion: '说明：' + typeLabel + '申请待' + meta.deptName + '员工审核' },
        submitNode,
      ]
    }
  } else if (tab === 'rejected') {
    const atEmployee = item.rejectAtStep === 'employee'
    if (atEmployee) {
      timeline = [
        { dept:dir.dept, result:'pending', text:'待审核',
          person: item.directorApprover || dir.person, time: '—',
          opinion: '说明：待' + meta.deptName + '主任审核' },
        { dept:emp.dept, result:'reject', text:'已驳回',
          person: item.rejectPerson || (emp.person + '（' + meta.deptName + '）'), time: item.rejectTime || '—',
          opinion: '驳回原因：' + (item.rejectReason || '') },
        submitNode,
      ]
    } else {
      timeline = [
        { dept:dir.dept, result:'reject', text:'已驳回',
          person: item.rejectPerson || (dir.person + '（' + meta.deptName + '）'), time: item.rejectTime || '—',
          opinion: '驳回原因：' + (item.rejectReason || '') },
        { dept:emp.dept, result:'pass', text:'已通过',
          person: item.employeeApprover || emp.person, time: item.employeeApproveTime || '—',
          opinion: '审核意见：' + (item.employeeApproveOpinion || meta.deptName + '员工审核通过') },
        submitNode,
      ]
    }
  } else {
    // approved / expired
    if (tab === 'expired') {
      timeline.push({ dept:'作业资格', result:'pending', text:'已过期',
        person: '', time: item.expiredTime || '—',
        opinion: '说明：' + (item.expireReason || '已超过批准作业时间') })
    }
    timeline.push(
      { dept:dir.dept, result:'pass', text:'已通过',
        person: item.directorApprover || dir.person, time: item.approveTime || '—',
        opinion: item.approveOpinion ? '审核意见：' + item.approveOpinion : '' },
      { dept:emp.dept, result:'pass', text:'已通过',
        person: item.employeeApprover || emp.person, time: item.employeeApproveTime || '—',
        opinion: '' },
      submitNode
    )
  }

  const btnPrimary = tab === 'my-review' ? { text:'立即审核', action:'review' } : null
  return { sc, attachments, timeline, btnPrimary }
}

// ─── 商户端：特殊作业申请 ────────────────────────────────────────────────────

const MERCHANT_SPECIAL_TABS = [
  { key: 'reviewing', label: '审核中', badge: 3 },
  { key: 'approved',  label: '已通过', badge: 6 },
  { key: 'rejected',  label: '已驳回', badge: 1 },
  { key: 'expired',   label: '已过期', badge: 5 },
]

const MERCHANT_SPECIAL_STATUS = {
  reviewing: { text: '审核中', cls: 'status-orange' },
  rejected:  { text: '已驳回', cls: 'status-red'    },
  approved:  { text: '已通过', cls: 'status-green'  },
  expired:   { text: '已过期', cls: 'status-grey'   },
}

const MERCHANT_SPECIAL_DATA = {
  reviewing: [
    { id:'TS202605150001', type:'height',   applyId:'RX001', merchant:'北京拿铁旧机动车', shop:'B08', workTime:'2026-05-20 08:00~17:00', workLocation:'B08商铺门前', workContent:'门头招牌安装',       supervisor:'张工', supervisorPhone:'138****1234', workerCount:3, workHeight:'5米以上', heightGuards:'安全带及安全绳、安全网/防坠网', guardian:'李监护 139****5678', safetyMeasures:'已设置警戒区域，作业人员持证上岗', date:'2026-05-15 10:30', timelineStage:'director', currentStep:'物业部主任审核', employeeApprover:'赵经理', employeeApproveTime:'2026-05-16 10:00', employeeApproveOpinion:'高空作业方案符合要求', directorApprover:'赵主任' },
    { id:'TS202605160002', type:'fire',     applyId:'RX001', merchant:'北京拿铁旧机动车', shop:'B08', workTime:'2026-05-18 09:00~12:00', workLocation:'B08室内',     workContent:'焊接门框支架',       supervisor:'王工', supervisorPhone:'136****8888', workerCount:2, fireType:'焊接', fireExtinguisher:2, fireClear:'已清理', guardian:'赵监护 137****9999', safetyMeasures:'配备灭火器2具，专人监护', date:'2026-05-16 09:00', timelineStage:'employee', currentStep:'安保部员工审核', employeeApprover:'李安保', directorApprover:'李主任' },
    { id:'TS202605170007', type:'electric', applyId:'RX001', merchant:'北京拿铁旧机动车', shop:'B08', workDate:'2026-06-01 至 2026-06-30', electricPointCount:3, workLocation:'B08施工区', workContent:'装修期间临时施工用电', supervisor:'赵工', supervisorPhone:'139****6666', workerCount:5, date:'2026-05-17 11:20', timelineStage:'employee', currentStep:'物业部员工审核', employeeApprover:'赵经理', directorApprover:'赵主任' },
  ],
  rejected: [
    { id:'TS202605100003', type:'electric', applyId:'RX015', merchant:'嘉诚名车', shop:'D07', workDate:'2026-05-20 至 2026-07-10', electricPointCount:2, workLocation:'D07施工区', workContent:'临时施工用电', supervisor:'刘工', supervisorPhone:'135****2222', workerCount:4, remark:'施工用电负荷约15kW', date:'2026-05-10 14:00', rejectAtStep:'employee', rejectReason:'电工证复印件不清晰，请重新上传', rejectTime:'2026-05-11 11:00', rejectPerson:'赵经理（物业部）', directorApprover:'赵主任' },
  ],
  approved: [
    { id:'TS202605080004', type:'fire',     applyId:'RX004', merchant:'鑫达名车', shop:'D03', workTime:'2026-05-10 09:00~16:00', workLocation:'D03商铺',  workContent:'焊接货架',   supervisor:'陈工', supervisorPhone:'133****4444', workerCount:2, fireType:'焊接', fireExtinguisher:2, fireClear:'已清理', guardian:'周监护 131****5555', safetyMeasures:'动火点周围可燃物已清理，配备灭火器', date:'2026-05-08 09:30', employeeApprover:'李安保', employeeApproveTime:'2026-05-08 16:00', employeeApproveOpinion:'动火方案及现场措施符合要求', directorApprover:'李主任', directorApproveTime:'2026-05-09 10:00', approveTime:'2026-05-09 10:00', approvePerson:'李主任（安保部）', approveOpinion:'同意动火，请按批准时段作业', validUntil:'2026-05-10 16:00' },
    { id:'TS202605200010', type:'fire',     applyId:'RX035', merchant:'红星车行', shop:'A08', workTime:'2026-05-20 10:00~15:00', workLocation:'A08商铺室内', workContent:'门头钢架焊接', supervisor:'孙工', supervisorPhone:'137****5566', workerCount:2, fireType:'焊接', fireExtinguisher:2, fireClear:'已清理', guardian:'周监护 131****5555', safetyMeasures:'动火点已清理可燃物，配备灭火器', date:'2026-05-19 09:00', employeeApprover:'李安保', employeeApproveTime:'2026-05-19 15:00', directorApprover:'李主任', directorApproveTime:'2026-05-19 17:00', approveTime:'2026-05-19 17:00', approvePerson:'李主任（安保部）', approveOpinion:'同意动火', validUntil:'2026-05-20 15:00' },
    { id:'TS202605200011', type:'height',   applyId:'RX035', merchant:'红星车行', shop:'A08', workTime:'2026-05-20 08:00~12:00', workLocation:'A08门头',    workContent:'招牌骨架安装',   supervisor:'孙工', supervisorPhone:'137****5566', workerCount:2, workHeight:'2~5米', heightGuards:'安全带及安全绳、警示围挡', guardian:'李监护 138****1111', safetyMeasures:'高处作业措施已落实', date:'2026-05-19 10:00', employeeApprover:'赵经理', employeeApproveTime:'2026-05-19 14:00', directorApprover:'赵主任', directorApproveTime:'2026-05-19 16:00', approveTime:'2026-05-19 16:00', approvePerson:'赵主任（物业部）', approveOpinion:'同意高空作业', validUntil:'2026-05-20 12:00' },
    { id:'TS202605200012', type:'electric', applyId:'RX035', merchant:'红星车行', shop:'A08', workDate:'2026-05-20 至 2026-06-30', electricPointCount:1, workLocation:'A08施工区', workContent:'装修临时用电', supervisor:'孙工', supervisorPhone:'137****5566', workerCount:3, safetyMeasures:'漏电保护器检测合格', date:'2026-05-19 11:00', employeeApprover:'赵经理', employeeApproveTime:'2026-05-19 15:30', directorApprover:'赵主任', directorApproveTime:'2026-05-19 17:30', approveTime:'2026-05-19 17:30', approvePerson:'赵主任（物业部）', approveOpinion:'同意临时用电', validUntil:'2026-06-30 18:00' },
    { id:'TS202605160020', type:'fire',     applyId:'RX015', merchant:'嘉诚名车', shop:'D07', workTime:'2026-05-16 09:00~16:00', workLocation:'D07消防管道区', workContent:'消防管道焊接安装', supervisor:'刘工', supervisorPhone:'135****2222', workerCount:2, fireType:'焊接', fireExtinguisher:2, fireClear:'已清理', guardian:'周监护 131****5555', safetyMeasures:'动火点周围可燃物已清理，配备灭火器', date:'2026-05-15 10:00', employeeApprover:'李安保', employeeApproveTime:'2026-05-15 16:00', directorApprover:'李主任', directorApproveTime:'2026-05-15 18:00', approveTime:'2026-05-15 18:00', approvePerson:'李主任（安保部）', approveOpinion:'同意动火', validUntil:'2026-05-16 16:00' },
    { id:'TS202605160021', type:'height',   applyId:'RX015', merchant:'嘉诚名车', shop:'D07', workTime:'2026-05-16 08:00~17:00', workLocation:'D07商铺二层', workContent:'脚手架搭设及高处管线安装', supervisor:'刘工', supervisorPhone:'135****2222', workerCount:3, workHeight:'2~5米', heightGuards:'安全带及安全绳、作业区域警示围挡', guardian:'李监护 138****1111', safetyMeasures:'已设置警戒区域，持证上岗', date:'2026-05-15 09:00', employeeApprover:'赵经理', employeeApproveTime:'2026-05-15 15:00', directorApprover:'赵主任', directorApproveTime:'2026-05-15 17:00', approveTime:'2026-05-15 17:00', approvePerson:'赵主任（物业部）', approveOpinion:'同意高空作业', validUntil:'2026-05-16 17:00' },
  ],
  expired: [
    { id:'TS202605010005', type:'height',   applyId:'RX004', merchant:'鑫达名车', shop:'D03', workTime:'2026-05-05 09:00~16:00', workLocation:'D03商铺门前', workContent:'门头招牌维护', supervisor:'陈工', supervisorPhone:'133****4444', workerCount:2, workHeight:'2~5米', heightGuards:'安全带及安全绳、作业区域警示围挡', guardian:'周监护 131****5555', safetyMeasures:'已落实防坠落措施', date:'2026-05-01 10:00', employeeApprover:'赵经理', employeeApproveTime:'2026-05-02 10:00', directorApprover:'赵主任', directorApproveTime:'2026-05-02 14:00', approveTime:'2026-05-02 14:00', approvePerson:'赵主任（物业部）', approveOpinion:'同意高空作业', validUntil:'2026-05-05 16:00', expiredTime:'2026-05-06 00:00', expireReason:'已超过批准作业截止时间，如需继续作业请重新申请' },
    { id:'TS202604280006', type:'electric', applyId:'RX015', merchant:'嘉诚名车', shop:'D07', workDate:'2026-05-20 至 2026-07-10', electricPointCount:1, workLocation:'D07施工区', workContent:'临时施工用电', supervisor:'刘工', supervisorPhone:'135****2222', workerCount:3, safetyMeasures:'线路穿管保护，漏电保护已检测', date:'2026-04-26 09:30', employeeApprover:'赵经理', employeeApproveTime:'2026-04-27 09:00', directorApprover:'赵主任', directorApproveTime:'2026-04-27 11:00', approveTime:'2026-04-27 11:00', approvePerson:'赵主任（物业部）', approveOpinion:'同意临时用电', validUntil:'2026-04-28 18:00', expiredTime:'2026-04-29 00:00', expireReason:'批准作业时段已结束，审批资格自动失效' },
    { id:'TS202605200001', type:'fire',     applyId:'RX015', merchant:'嘉诚名车', shop:'D07', workTime:'2026-05-20 09:00~16:00', workLocation:'D07施工区',   workContent:'消防管道焊接',       supervisor:'刘工', supervisorPhone:'135****2222', workerCount:2, date:'2026-05-18 10:00', approveTime:'2026-05-19 09:00', validUntil:'2026-05-20 16:00', expiredTime:'2026-05-21 00:00', expireReason:'已超过批准作业日期' },
    { id:'TS202605200002', type:'height',   applyId:'RX015', merchant:'嘉诚名车', shop:'D07', workTime:'2026-05-20 08:00~17:00', workLocation:'D07门头',     workContent:'门头钢架安装',       supervisor:'刘工', supervisorPhone:'135****2222', workerCount:3, date:'2026-05-18 11:00', approveTime:'2026-05-19 10:00', validUntil:'2026-05-20 17:00', expiredTime:'2026-05-21 00:00', expireReason:'已超过批准作业日期' },
    { id:'TS202605200003', type:'electric', applyId:'RX015', merchant:'嘉诚名车', shop:'D07', workDate:'2026-05-19 至 2026-07-10', electricPointCount:2, workLocation:'D07施工区', workContent:'装修期间临时施工用电', supervisor:'刘工', supervisorPhone:'135****2222', workerCount:4, date:'2026-05-17 14:00', approveTime:'2026-05-18 11:00', validUntil:'2026-07-10 18:00', expiredTime:'2026-05-21 00:00', expireReason:'用电审批已撤销，不再计入有效期' },
  ],
}

function buildMerchantSpecialDetailData(tab, item) {
  const sc   = MERCHANT_SPECIAL_STATUS[tab] || { text:'—', cls:'' }
  const dept = SPECIAL_DEPT[item.type] || '物业部'

  // 附件（分类与必填项对齐商户端原型 specialTemplateConfig）
  const attachments = []
  if (item.type === 'fire') {
    attachments.push({ type:'pdf', label:'特种作业人员操作证', name:'焊接操作证.pdf' })
    attachments.push({ type:'pdf', label:'动火方案', name:'动火方案.pdf' })
    attachments.push({ type:'pdf', label:'灭火器配置清单', name:'灭火器配置清单.pdf' })
  } else if (item.type === 'height') {
    attachments.push({ type:'pdf', label:'高空作业证', name:'高空作业证.pdf' })
    attachments.push({ type:'pdf', label:'安全防护方案', name:'安全防护方案.pdf' })
    attachments.push({ type:'pdf', label:'保险证明', name:'保险证明.pdf' })
  } else {
    attachments.push({ type:'pdf', label:'电工操作证', name:'电工操作证.pdf' })
    attachments.push({ type:'pdf', label:'临时用电方案', name:'临时用电方案.pdf' })
  }
  attachments.push({ type:'img', label:'现场照片', name:'现场照片.jpg' })

  // 时间线
  let timeline = []
  if (tab === 'reviewing') {
    const atDirector = item.timelineStage === 'director'
    timeline = [
      { dept:`${dept}主任审核`, result:'waiting', text:'待审核' },
      { dept:`${dept}员工审核`, result:atDirector ? 'pass' : 'waiting', text:atDirector ? '已通过' : '待审核', person:atDirector ? item.employeeApprover : undefined, time:atDirector ? item.employeeApproveTime : undefined, opinion:atDirector ? item.employeeApproveOpinion : undefined },
      { dept:'商户提交', result:'pass', text:'已完成', time:item.date, opinion:`已提交${SPECIAL_TYPE_LABEL[item.type] || '特殊作业'}申请` },
    ]
  } else if (tab === 'rejected') {
    const atEmployee = item.rejectAtStep === 'employee'
    timeline = [
      { dept:`${dept}主任审核`, result:atEmployee ? 'waiting' : 'reject', text:atEmployee ? '待审核' : '已驳回', person:atEmployee ? undefined : item.rejectPerson, time:atEmployee ? undefined : item.rejectTime, opinion:atEmployee ? undefined : item.rejectReason },
      { dept:`${dept}员工审核`, result:atEmployee ? 'reject' : 'pass', text:atEmployee ? '已驳回' : '已通过', person:atEmployee ? item.rejectPerson : item.employeeApprover, time:atEmployee ? item.rejectTime : item.employeeApproveTime, opinion:atEmployee ? item.rejectReason : undefined },
      { dept:'商户提交', result:'pass', text:'已完成', time:item.date, opinion:`已提交${SPECIAL_TYPE_LABEL[item.type] || '特殊作业'}申请` },
    ]
  } else {
    timeline = [
      { dept:`${dept}主任审核`, result:'pass', text:'已通过', person:item.approvePerson, time:item.directorApproveTime || item.approveTime, opinion:item.approveOpinion || '' },
      { dept:`${dept}员工审核`, result:'pass', text:'已通过', person:item.employeeApprover, time:item.employeeApproveTime },
      { dept:'商户提交', result:'pass', text:'已完成', time:item.date, opinion:`已提交${SPECIAL_TYPE_LABEL[item.type] || '特殊作业'}申请` },
    ]
    if (tab === 'expired') {
      timeline.unshift({ dept:'作业资格', result:'expired', text:'已过期', time:item.expiredTime, opinion:item.expireReason })
    }
  }

  const canResubmit = tab === 'rejected'
  return { sc, attachments, timeline, canResubmit }
}

// 申请验收前置校验：延期/增项/特殊作业申请是否仍在审批中
const ADD_ITEM_PENDING_TABS_FOR_ACCEPTANCE = ['survey-reviewing', 'pending-submit', 'material-review', 'approving', 'pending-sign']

function getPendingSubApplyTypesForAcceptance(applyId) {
  const types = []
  if (!applyId) return types
  if ((MERCHANT_DELAY_DATA.reviewing || []).some(d => d.applyId === applyId)) types.push('delay')
  const hasPendingAddItem = ADD_ITEM_PENDING_TABS_FOR_ACCEPTANCE.some(tab => (MERCHANT_ADD_ITEM_DATA[tab] || []).some(d => d.applyId === applyId))
  if (hasPendingAddItem) types.push('addItem')
  if ((MERCHANT_SPECIAL_DATA.reviewing || []).some(d => d.applyId === applyId)) types.push('special')
  return types
}

// ================================================================
// 商户每日报备 Mock 数据
// ================================================================
const DAILY_REPORT_TODAY = '2026-05-20'

const DAILY_REPORT_APPLY_META = {
  RX001: { dailyReportStart: '2026-05-02' },
  RX015: { dailyReportStart: '2026-05-11' },
  RX035: { dailyReportStart: '2026-05-13' }
}

function parseYmd(s) {
  const m = String(s || '').match(/(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : ''
}

function splitDateRangeText(text) {
  const s = String(text || '').trim()
  const m = s.match(/(\d{4}-\d{2}-\d{2})\s*(?:至|~|－)\s*(\d{4}-\d{2}-\d{2})/)
  if (m) return [m[1], m[2]]
  const single = parseYmd(s)
  return single ? [single] : []
}

function addDaysToYmd(ymd, delta) {
  const p = ymd.split('-').map(Number)
  const d = new Date(p[0], p[1] - 1, p[2])
  d.setDate(d.getDate() + delta)
  const m = d.getMonth() + 1
  return d.getFullYear() + '-' + String(m).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

function enumerateYmdRange(start, end) {
  const list = []
  if (!start || !end || start > end) return list
  let cur = start
  while (cur <= end) { list.push(cur); cur = addDaysToYmd(cur, 1) }
  return list
}

function isSpecialWorkActiveOnDate(item, day) {
  if (!item || !day) return false
  if (item.type === 'electric') {
    const parts = splitDateRangeText(item.workDate || item.workTime || '')
    if (parts.length >= 2) return day >= parts[0] && day <= parts[1]
    return parts[0] === day
  }
  return parseYmd(item.workTime || item.workDate || '') === day
}

/** 当日已批准且生效的特殊作业类型（动火 / 高空 / 临时用电），用于每日报备需逐项拍照的项目 */
function getSpecialWorkInfoForDate(applyId, day) {
  const works = (MERCHANT_SPECIAL_DATA.approved || [])
    .filter(d => d.applyId === applyId)
    .filter(item => isSpecialWorkActiveOnDate(item, day))
  const order = ['fire', 'height', 'electric']
  const types = order.filter(t => works.some(w => w.type === t))
  return { date: day, types, works }
}

function getTodaySpecialWorkInfo(applyId) {
  const info = getSpecialWorkInfoForDate(applyId, DAILY_REPORT_TODAY)
  info.today = DAILY_REPORT_TODAY
  return info
}

// { applyId: { 'YYYY-MM-DD': { reported, reportTime, content, scenePhotos, certsByType } } }
const DAILY_REPORT_RECORDS = {
  RX015: {
    '2026-05-14': { reported: true, reportTime: '2026-05-14 08:10', content: '当日进行施工现场围挡检查及材料进场验收，完成消防栓移位前期测量放线，未涉及特种作业。', scenePhotos: ['现场照片1.jpg'], certsByType: {} },
    '2026-05-15': { reported: true, reportTime: '2026-05-15 07:55', content: '当日进行电气线路预埋及消防管道支架安装准备，现场安全文明施工，无动火、高处、临时用电等特殊作业。', scenePhotos: ['现场照片1.jpg', '现场照片2.jpg'], certsByType: {} },
    '2026-05-16': { reported: true, reportTime: '2026-05-16 07:45', content: '上午进行消防管道动火焊接，下午二层脚手架高处作业；临时用电配电箱巡检正常，动火与高处作业分区进行，监护人员全程在岗。', scenePhotos: ['现场照片1.jpg', '现场照片2.jpg'], certsByType: { fire: ['动火现场1.jpg', '动火现场2.jpg'], height: ['高空现场1.jpg'], electric: ['配电箱近景.jpg'] } },
    '2026-05-17': { reported: true, reportTime: '2026-05-17 08:20', content: '当日进行消防栓移位基础开挖及管线预埋，现场文明施工，未涉及特种作业。', scenePhotos: ['现场照片1.jpg'], certsByType: {} },
    '2026-05-18': { reported: true, reportTime: '2026-05-18 08:05', content: '当日为常规装修施工：墙面抹灰、地面找平及材料整理，未涉及特殊作业，无需上传特种作业证件。', scenePhotos: [], certsByType: {} },
    '2026-05-19': { reported: true, reportTime: '2026-05-19 07:50', content: '当日进行室内隔墙砌筑及线管敷设，常规装修工序，无特殊作业。', scenePhotos: ['现场照片1.jpg', '现场照片2.jpg', '现场照片3.jpg', '现场照片4.jpg', '现场照片5.jpg'], certsByType: {} }
  },
  RX035: {
    '2026-05-16': { reported: true, reportTime: '2026-05-16 08:15', content: '当日完成施工现场围挡布置及门头材料进场验收，开展隔墙拆除前期放线，未涉及特种作业。', scenePhotos: ['现场照片1.jpg'], certsByType: {} },
    '2026-05-17': { reported: true, reportTime: '2026-05-17 07:40', content: '当日进行隔墙拆除及建筑垃圾清运，常规装修工序，无特殊作业。', scenePhotos: ['现场照片1.jpg', '现场照片2.jpg'], certsByType: {} },
    '2026-05-18': { reported: true, reportTime: '2026-05-18 08:30', content: '当日进行招牌龙骨安装前期筹备及门头基层处理，现场文明施工，未涉及已批准的特殊作业时段。', scenePhotos: ['现场照片1.jpg'], certsByType: {} },
    '2026-05-19': { reported: true, reportTime: '2026-05-19 08:00', content: '当日完成门头基层加固及店内线路整理，为次日动火、高处作业做准备，当日无特种作业。', scenePhotos: ['现场照片1.jpg'], certsByType: {} }
  }
}

function getDailyReportRecord(applyId, day) {
  const byApply = DAILY_REPORT_RECORDS[applyId] || {}
  return byApply[day || DAILY_REPORT_TODAY] || null
}

function submitDailyReport(applyId, payload) {
  if (!DAILY_REPORT_RECORDS[applyId]) DAILY_REPORT_RECORDS[applyId] = {}
  DAILY_REPORT_RECORDS[applyId][DAILY_REPORT_TODAY] = Object.assign({
    reported: true,
    reportTime: DAILY_REPORT_TODAY + ' ' + new Date().toTimeString().slice(0, 5)
  }, payload)
}

function getDailyReportRange(applyId) {
  const meta = DAILY_REPORT_APPLY_META[applyId] || {}
  const start = meta.dailyReportStart || DAILY_REPORT_TODAY
  const end = addDaysToYmd(DAILY_REPORT_TODAY, -1)
  return { start, end }
}

function getDailyReportHistoryBuckets(applyId) {
  const range = getDailyReportRange(applyId)
  const days = enumerateYmdRange(range.start, range.end)
  const reported = []
  const missed = []
  days.forEach(day => {
    const record = getDailyReportRecord(applyId, day)
    if (record && record.reported) reported.push({ date: day, record })
    else missed.push({ date: day })
  })
  reported.sort((a, b) => b.date.localeCompare(a.date))
  missed.sort((a, b) => b.date.localeCompare(a.date))
  return { reported, missed, range }
}

function getDailyReportPendingCount() {
  return MERCHANT_UNDER_CONSTRUCTION_LIST.filter(item => {
    const r = getDailyReportRecord(item.id, DAILY_REPORT_TODAY)
    return !(r && r.reported)
  }).length
}

/** 装修申请卡片进入每日报备时，兼容「施工中」列表数据未收录进 MERCHANT_UNDER_CONSTRUCTION_LIST 的情况 */
function getDailyReportEligibleApply(applyId) {
  const fromList = MERCHANT_UNDER_CONSTRUCTION_LIST.find(a => a.id === applyId)
  if (fromList) return fromList
  const fromTask = (MERCHANT_TASK_DATA['under-construction'] || []).find(a => a.id === applyId)
  if (fromTask) return { id: fromTask.id, merchant: fromTask.merchant, shop: fromTask.shop }
  const fromStopped = (MERCHANT_TASK_DATA['work-stopped'] || []).find(a => a.id === applyId)
  if (fromStopped) return { id: fromStopped.id, merchant: fromStopped.merchant, shop: fromStopped.shop }
  const fromAcceptance = (MERCHANT_TASK_DATA['pending-acceptance'] || []).find(a => a.id === applyId)
  if (fromAcceptance) return { id: fromAcceptance.id, merchant: fromAcceptance.merchant, shop: fromAcceptance.shop }
  return null
}

/** 从"停工整改"卡片发起延期申请时，把商户数据带入延期申请表单回显 */
function getDelayEligibleApply(applyId) {
  const fromList = MERCHANT_UNDER_CONSTRUCTION_LIST.find(a => a.id === applyId)
  if (fromList) return fromList
  const fromStopped = (MERCHANT_TASK_DATA['work-stopped'] || []).find(a => a.id === applyId)
  if (fromStopped) {
    const currentEnd = (fromStopped.decoratePeriod || '').split(' 至 ')[1] || ''
    return {
      id: fromStopped.id,
      merchant: fromStopped.merchant,
      shop: fromStopped.shop,
      cats: (fromStopped.tags || []).join(' / '),
      currentEnd
    }
  }
  return null
}

/** 施工证号：与装修管理各详情页保持一致的推导规则 */
function getApplyCertCode(applyId) {
  return applyId ? ('SZ' + String(applyId).replace(/^RX/i, '2026')) : ''
}

/** 验收申请（含"重新申请验收"）表单回显：优先取"验收中"数据，兼容仍在"施工中"但已提交验收的情况 */
function getAcceptanceEligibleApply(applyId) {
  const fromAcceptance = (MERCHANT_TASK_DATA['pending-acceptance'] || []).find(a => a.id === applyId)
  if (fromAcceptance) return fromAcceptance
  const fromConstruction = (MERCHANT_TASK_DATA['under-construction'] || []).find(a => a.id === applyId)
  if (fromConstruction) return fromConstruction
  return null
}

/** 提交 / 重新提交验收申请：更新"验收中"列表对应条目 */
function submitAcceptance(applyId, payload) {
  const list = MERCHANT_TASK_DATA['pending-acceptance'] || []
  const item = list.find(d => d.id === applyId)
  if (!item) return
  item.acceptanceRejected = false
  delete item.acceptanceRejectReason
  delete item.acceptanceRejectTime
  item.acceptanceSubmit = Object.assign({
    submitTime: new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5)
  }, payload)
}

// ================================================================
// 市场端 - 验收审核
// ================================================================
const ACCEPT_TABS = [
  { key: 'pending-survey',    label: '待踏勘',     badge: 2 },
  { key: 'my-initial-review', label: '待我审核',   badge: 1 },
  { key: 'secondary-review',  label: '踏勘审核中', badge: 1 },
  { key: 'approved',          label: '已通过',     badge: 1 },
  { key: 'rejected',          label: '已驳回',     badge: 1 }
]

const ACCEPT_STATUS = {
  'pending-survey':    { text: '待踏勘',     cls: 'status-orange' },
  'my-initial-review': { text: '待我审核',   cls: 'status-orange' },
  'secondary-review':  { text: '踏勘审核中', cls: 'status-orange' },
  approved:            { text: '已通过',     cls: 'status-green'  },
  rejected:            { text: '已驳回',     cls: 'status-red'    }
}

const ACCEPT_DEPT_ORDER = ['市场经营部', '物业部', '安保部', '管理部']
const ACCEPT_MY_DEPT = '市场经营部'

const ACCEPT_CATEGORY_MAP = {
  default: [
    { name: '门头广告', dept: '市场经营部', projects: ['招牌更换', '灯箱安装'] },
    { name: '基建改造', dept: '物业部',     projects: ['隔墙拆除', '地面找平'] },
    { name: '消防系统', dept: '安保部',     projects: ['消防栓移位'] },
    { name: '电气改造', dept: '管理部',     projects: ['电表安装', '水表读数确认'] }
  ],
  'RX012': [
    { name: '消防系统', dept: '安保部', projects: ['消防栓移位'] }
  ],
  'RX002': [
    { name: '消防系统', dept: '安保部', projects: ['消防栓移位'] },
    { name: '电气改造', dept: '管理部', projects: ['电表安装', '水表读数确认'] }
  ]
}

const ACCEPT_DATA = {
  'pending-survey': [
    {
      id: 'YS202605140001', applyId: 'RX015', merchant: '瑞丰汽配', shop: 'B10',
      tags: ['门头广告', '基建改造'], contact: '张经理 139****5678',
      certNo: 'SZ202605010015', decoratePeriod: '2026-05-01 至 2026-06-15',
      applyDate: '2026-05-03 09:00', acceptDate: '2026-05-14 10:00', needMySurvey: true,
      currentStep: '待市场经营部踏勘签到',
      deptReviews: { '市场经营部': 'waiting', '物业部': 'waiting', '安保部': 'waiting', '管理部': 'waiting' },
      acceptRemark: '门头已完工，请各部门现场验收踏勘',
      completionPhotos: ['门头全景.jpg', '室内1.jpg', '消防通道.jpg', '施工现场.jpg']
    },
    {
      id: 'YS202605120001', applyId: 'RX012', merchant: '天宇车行', shop: 'B06',
      tags: ['消防系统'], contact: '李经理 136****7788',
      certNo: 'SZ202605080012', decoratePeriod: '2026-04-20 至 2026-06-10',
      applyDate: '2026-05-08 14:00', acceptDate: '2026-05-12 15:00', needMySurvey: false,
      currentStep: '待物业部踏勘签到',
      deptReviews: { '市场经营部': 'waiting', '物业部': 'waiting', '安保部': 'waiting', '管理部': 'waiting' },
      acceptRemark: '消防设施已恢复，申请验收',
      completionPhotos: ['消防设施.jpg', '现场全景.jpg']
    }
  ],
  'my-initial-review': [
    {
      id: 'YS202605150001', applyId: 'RX018', merchant: '红星车行', shop: 'A08',
      tags: ['门头广告'], contact: '王经理 138****5566',
      certNo: 'SZ202605100018', decoratePeriod: '2026-05-10 至 2026-06-30',
      applyDate: '2026-05-12 10:00', acceptDate: '2026-05-15 09:00', needMyReview: true,
      currentStep: '市场经营部验收审核（待您审核）',
      surveySignTime: '2026-05-20 10:30', surveySignPerson: '赵经理（市场经营部）',
      surveyRemark: '现场门头已完工，与申报方案基本一致',
      acceptRemark: '申请竣工验收，请安排踏勘审核',
      completionPhotos: ['门头效果.jpg', '施工现场.jpg'],
      deptReviews: { '市场经营部': 'waiting', '物业部': 'waiting', '安保部': 'waiting', '管理部': 'waiting' }
    }
  ],
  'secondary-review': [
    {
      id: 'YS202605130001', applyId: 'RX016', merchant: '嘉诚名车', shop: 'D07',
      tags: ['消防系统', '电气改造'], contact: '王经理 137****9900',
      certNo: 'SZ202605060016', decoratePeriod: '2026-05-05 至 2026-06-20',
      applyDate: '2026-05-03 09:00', acceptDate: '2026-05-13 14:30', currentStep: '安保部踏勘审核中',
      acceptRemark: '消防及电气改造已完工，请安排后续部门验收',
      completionPhotos: ['消防设施.jpg', '配电箱.jpg', '施工现场.jpg'],
      deptReviews: { '市场经营部': 'pass', '物业部': 'pass', '安保部': 'waiting', '管理部': 'waiting' },
      deptReviewMeta: {
        '市场经营部': { person: '赵经理', time: '2026-05-13 16:00', opinion: '现场踏勘与方案一致，验收审核通过' },
        '物业部': { person: '李工', time: '2026-05-13 15:20', opinion: '现场清理完毕' }
      },
      surveySignRecords: [
        { dept: '市场经营部踏勘签到', person: '赵经理', time: '2026-05-13 14:00', opinion: '现场门头与申报方案核对完成' },
        { dept: '物业部踏勘签到', person: '李工', time: '2026-05-13 14:30', opinion: '施工现场清理完毕，已完成签到' }
      ]
    }
  ],
  approved: [
    {
      id: 'YS202605100001', applyId: 'RX002', merchant: '北京车天下', shop: 'A12',
      tags: ['消防系统'], contact: '赵经理 138****2233',
      certNo: 'SZ202604200002', decoratePeriod: '2026-04-01 至 2026-05-20',
      applyDate: '2026-04-20 10:00', acceptDate: '2026-05-10 09:00', finishTime: '2026-05-15 10:00',
      refundAmount: '¥5,000.00',
      acceptRemark: '消防设施已恢复正常，申请验收退款',
      completionPhotos: ['消防设施.jpg', '现场全景.jpg'],
      deptReviews: { '市场经营部': 'pass', '物业部': 'pass', '安保部': 'pass', '管理部': 'pass' },
      deptReviewMeta: {
        '市场经营部': { person: '赵经理', time: '2026-05-12 14:30', opinion: '验收合格' },
        '物业部': { person: '李工', time: '2026-05-13 15:00', opinion: '同意' },
        '安保部': { person: '刘经理', time: '2026-05-13 09:15', opinion: '消防恢复到位' },
        '管理部': { person: '张主任', time: '2026-05-13 11:00', opinion: '电气验收合格' }
      },
      surveySignRecords: [
        { dept: '市场经营部踏勘签到', person: '赵经理', time: '2026-05-12 10:00', opinion: '验收踏勘签到完成' },
        { dept: '物业部踏勘签到', person: '李工', time: '2026-05-12 10:30', opinion: '现场清理情况已拍照留存' },
        { dept: '安保部踏勘签到', person: '刘经理', time: '2026-05-12 11:00', opinion: '消防设施恢复情况已核对' },
        { dept: '管理部踏勘签到', person: '张主任', time: '2026-05-12 11:30', opinion: '电气设施验收踏勘完成' }
      ]
    }
  ],
  rejected: [
    {
      id: 'YS202605080001', applyId: 'RX034', merchant: '伯乐二手车', shop: 'A08',
      tags: ['门头广告', '基建改造'], contact: '陈经理 135****6677',
      certNo: 'SZ202605100034', decoratePeriod: '2026-05-15 至 2026-06-15',
      applyDate: '2026-05-10 14:00', acceptDate: '2026-05-17 09:00',
      acceptRemark: '门头及基建改造已完工，申请验收',
      completionPhotos: ['门头全景.jpg', '基建现场.jpg'],
      rejectTime: '2026-05-18 11:00', rejectDept: '安保部', rejectPerson: '刘经理',
      rejectReason: '竣工照片不清晰，消防设施现场与申报不符，请整改后重新申请验收',
      deptReviews: { '市场经营部': 'pass', '物业部': 'pass', '安保部': 'reject', '管理部': 'waiting' },
      deptReviewMeta: {
        '市场经营部': { person: '赵经理', time: '2026-05-17 10:00', opinion: '门头效果符合申报' },
        '物业部': { person: '李工', time: '2026-05-17 14:00', opinion: '现场已清理' },
        '安保部': { person: '刘经理', time: '2026-05-18 11:00', opinion: '竣工照片不清晰，消防设施现场与申报不符，请整改后重新申请验收' }
      },
      surveySignRecords: [
        { dept: '市场经营部踏勘签到', person: '赵经理', time: '2026-05-17 09:00', opinion: '门头现场踏勘签到' },
        { dept: '物业部踏勘签到', person: '李工', time: '2026-05-17 10:00', opinion: '现场清理踏勘签到' }
      ]
    }
  ]
}

function getAcceptCategories(applyId) {
  return ACCEPT_CATEGORY_MAP[applyId] || ACCEPT_CATEGORY_MAP.default
}

function getAcceptCategoryStatus(tab, dept, item) {
  const isMyDept = dept === ACCEPT_MY_DEPT
  const st = (item.deptReviews || {})[dept] || 'waiting'
  if (tab === 'pending-survey') return { text: '待踏勘', cls: 'status-orange' }
  if (tab === 'my-initial-review') {
    if (st === 'pass') return { text: '已审核', cls: 'status-green' }
    return isMyDept ? { text: '待我审核', cls: 'status-orange' } : { text: '待踏勘', cls: 'status-orange' }
  }
  if (tab === 'secondary-review') {
    if (st === 'pass') return { text: '已审核', cls: 'status-green' }
    if (st === 'reject') return { text: '已驳回', cls: 'status-red' }
    return { text: '踏勘审核中', cls: 'status-orange' }
  }
  if (tab === 'approved') return { text: '已审核', cls: 'status-green' }
  if (tab === 'rejected') {
    if (st === 'reject') return { text: '已驳回', cls: 'status-red' }
    if (st === 'pass') return { text: '已审核', cls: 'status-green' }
    return { text: '待审核', cls: 'status-orange' }
  }
  return { text: '待踏勘', cls: 'status-orange' }
}

function buildAcceptTimeline(tab, item) {
  const records = []
  const reviews = item.deptReviews || {}
  const meta = item.deptReviewMeta || {}

  if (tab === 'approved') {
    records.push({ dept: '验收通过 · 退款完成', result: 'pass', text: '已完成', person: '系统', time: item.finishTime || '—', opinion: '保证金已原路退回 ' + (item.refundAmount || '') })
  } else if (tab === 'rejected') {
    records.push({ dept: (item.rejectDept || '') + '验收踏勘审核', result: 'reject', text: '已驳回', person: item.rejectPerson || '—', time: item.rejectTime || '—', opinion: item.rejectReason || '—' })
  } else if (item.currentStep) {
    records.push({ dept: item.currentStep, result: 'waiting', text: (ACCEPT_STATUS[tab] || {}).text || '进行中', person: '', time: '', opinion: '' })
  }

  ACCEPT_DEPT_ORDER.slice().reverse().forEach(dept => {
    const st = reviews[dept]
    if (!st || st === 'waiting') return
    if (tab === 'rejected' && dept === item.rejectDept) return
    const m = meta[dept] || {}
    records.push({ dept: dept + '验收踏勘审核', result: st, text: st === 'pass' ? '已审核' : '已驳回', person: m.person || '—', time: m.time || '—', opinion: m.opinion || '' })
  })

  const signRecords = (item.surveySignRecords && item.surveySignRecords.length)
    ? item.surveySignRecords
    : (item.surveySignTime ? [{ dept: '市场经营部踏勘签到', person: item.surveySignPerson, time: item.surveySignTime, opinion: item.surveyRemark }] : [])
  signRecords.forEach(r => {
    records.push({ dept: r.dept, result: 'pass', text: '已签到', person: r.person || '—', time: r.time || '—', opinion: r.opinion || '' })
  })

  records.push({
    dept: '商户提交验收申请', result: 'pass', text: '已提交',
    person: (item.contact || '').split(' ')[0] || '商户',
    time: item.acceptDate || '—', opinion: item.acceptRemark || '已提交竣工验收申请'
  })

  return records
}

function buildAcceptDetailData(tab, item) {
  const sc = ACCEPT_STATUS[tab] || { text: '—', cls: 'status-orange' }
  const categories = getAcceptCategories(item.applyId).map(cat => {
    const st = getAcceptCategoryStatus(tab, cat.dept, item)
    return {
      ...cat,
      isMyDept: cat.dept === ACCEPT_MY_DEPT,
      statusText: st.text,
      statusCls: st.cls,
      projectsText: (cat.projects || []).join('、')
    }
  })

  const bannerMap = {
    'secondary-review': { type: 'orange', title: '踏勘审核中', desc: '各部门验收踏勘审核进行中，待全部通过后系统将办理保证金退款。' },
    rejected: { type: 'red', title: '验收驳回', desc: '已向商户反馈驳回原因，商户整改后可重新提交验收申请。' },
    approved: { type: 'green', title: '验收通过', desc: '全部部门验收踏勘审核已通过，保证金（' + (item.refundAmount || '—') + '）已原路退还。' }
  }
  const banner = bannerMap[tab] || null

  const showSurveyInfo = !!item.surveySignTime

  const btnMap = {
    'pending-survey': { action: 'survey', text: '签到踏勘' },
    'my-initial-review': item.needMyReview ? { action: 'review', text: '立即审核' } : null
  }
  const btnPrimary = btnMap[tab] || null

  return {
    sc,
    categories,
    banner,
    showSurveyInfo,
    timeline: buildAcceptTimeline(tab, item),
    btnPrimary,
    btnSecondary: { action: 'back', text: '返回列表' }
  }
}

module.exports = {
  TABS,
  STATUS_MAP,
  TASK_DATA,
  buildDetailData,
  MERCHANT_TABS,
  MERCHANT_STATUS_CONFIG,
  MERCHANT_TASK_DATA,
  getWorkStoppedCardStatus,
  getPendingAcceptanceCardStatus,
  buildMerchantDetailData,
  submitReinspect,
  findWorkStoppedApply,
  DELAY_TABS,
  DELAY_DATA,
  MERCHANT_DELAY_TABS,
  MERCHANT_DELAY_DATA,
  MERCHANT_UNDER_CONSTRUCTION_LIST,
  ADD_ITEM_TABS,
  ADD_ITEM_STATUS,
  ADD_ITEM_DATA,
  ADD_ITEM_APPLY_CATS,
  buildAddItemDetailData,
  MERCHANT_ADD_ITEM_TABS,
  MERCHANT_ADD_ITEM_STATUS,
  MERCHANT_ADD_ITEM_DATA,
  MERCHANT_ADD_ITEM_TIMELINE,
  SPECIAL_TABS,
  SPECIAL_STATUS,
  SPECIAL_DATA,
  SPECIAL_TYPE_LABEL,
  SPECIAL_DEPT,
  buildSpecialDetailData,
  MERCHANT_SPECIAL_TABS,
  MERCHANT_SPECIAL_STATUS,
  MERCHANT_SPECIAL_DATA,
  buildMerchantSpecialDetailData,
  DAILY_REPORT_TODAY,
  getTodaySpecialWorkInfo,
  getSpecialWorkInfoForDate,
  getDailyReportRecord,
  submitDailyReport,
  getDailyReportRange,
  getDailyReportHistoryBuckets,
  getDailyReportPendingCount,
  getDailyReportEligibleApply,
  getDelayEligibleApply,
  getApplyCertCode,
  getAcceptanceEligibleApply,
  submitAcceptance,
  getPendingSubApplyTypesForAcceptance,
  ACCEPT_TABS,
  ACCEPT_STATUS,
  ACCEPT_DATA,
  buildAcceptDetailData,
}
