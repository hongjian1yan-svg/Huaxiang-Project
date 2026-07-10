<template>
  <view class="page">
    <scroll-view class="scroll-body" scroll-y>
      <!-- 状态提示横幅 -->
      <view v-if="banner" :class="['notice-banner', 'notice-' + banner.type]">
        <view class="notice-icon-wrap">
          <text class="notice-icon-text">!</text>
        </view>
        <view class="notice-body">
          <text class="notice-title">{{ banner.title }}</text>
          <text class="notice-text">{{ banner.desc }}</text>
        </view>
      </view>

      <!-- 基本信息 -->
      <view class="info-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">基本信息</text></view>
        <view class="detail-row"><text class="detail-label">申请编号</text><text class="detail-value">{{ item.id }}</text></view>
        <view class="detail-row"><text class="detail-label">商户名称</text><text class="detail-value">{{ item.merchant }}</text></view>
        <view class="detail-row"><text class="detail-label">商铺号</text><text class="detail-value">{{ item.shop }}</text></view>
        <view class="detail-row"><text class="detail-label">联系人</text><text class="detail-value">{{ item.contact }}</text></view>
        <view class="detail-row"><text class="detail-label">计划装修周期</text><text class="detail-value">{{ item.planPeriod }}</text></view>
        <view class="detail-row"><text class="detail-label">施工期间</text><text class="detail-value">{{ item.period }}</text></view>
        <view class="detail-row">
          <text class="detail-label">施工证号</text>
          <text class="detail-value cert-link" @tap="showCertModal = true">{{ item.certNo }}</text>
        </view>
      </view>

      <!-- 装修类目及项目 -->
      <view class="info-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">装修类目及项目</text></view>
        <view v-for="cat in categoryItems" :key="cat.name" class="cat-item">
          <view class="cat-hd">
            <text class="cat-name">{{ cat.name }}</text>
            <text v-if="cat.isMyDept" class="my-dept-tag">本部门负责</text>
          </view>
          <text class="cat-sub">{{ cat.projectsText }}</text>
          <view class="cat-dept-row"><text class="cat-dept-label">责任部门：</text><text class="cat-dept-val">{{ cat.dept }}</text></view>
        </view>
        <text class="cat-remark-label">装修说明</text>
        <text class="cat-remark-text">{{ item.decorateRemark || '按申报方案组织施工，现场须符合审批范围及安全措施要求' }}</text>
      </view>

      <!-- 施工期关联业务 -->
      <view class="info-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">施工期关联业务</text></view>
        <view class="link-row" @tap="goPlaceholder('装修延期申请')"><text>装修延期申请</text><text class="arrow">查看 ›</text></view>
        <view class="link-row" @tap="goPlaceholder('装修增项申请')"><text>装修增项申请</text><text class="arrow">查看 ›</text></view>
        <view class="link-row" @tap="goPlaceholder('特殊作业申请')"><text>特殊作业申请</text><text class="arrow">查看 ›</text></view>
        <view class="link-row" @tap="goPlaceholder('验收审核')"><text>验收审核</text><text class="arrow">未提交 ›</text></view>
        <view class="link-row" @tap="goDailyReport"><text>商户每日报备</text><text class="arrow">{{ reportSummary }} ›</text></view>
      </view>

      <!-- 施工期流程记录 -->
      <view class="info-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">施工期流程记录</text></view>
        <view class="timeline">
          <view v-for="(t, idx) in timelineList" :key="idx" class="tl-item">
            <view class="tl-axis">
              <view :class="['tl-dot', t.dotCls]"></view>
              <view v-if="idx < timelineList.length - 1" class="tl-line"></view>
            </view>
            <view class="tl-content">
              <text class="tl-dept">{{ t.dept }}</text>
              <text class="tl-meta">{{ t.meta }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 近期巡检 / 整改 -->
      <view class="info-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">近期巡检 / 整改</text></view>
        <view class="detail-row"><text class="detail-label">最近巡检</text><text class="detail-value">2026-05-19 正常</text></view>
        <view class="detail-row"><text class="detail-label">待整改单</text><text class="detail-value" style="color:var(--color-warning);">{{ pendingRectifyCount }} 条</text></view>
        <view class="detail-row"><text class="detail-label">累计巡检</text><text class="detail-value">12 次</text></view>
      </view>

      <view style="height: 20rpx;"></view>
    </scroll-view>

    <view class="bottom-bar">
      <button class="btn btn-primary" @tap="startInspect">发起巡检</button>
    </view>

    <view v-if="showCertModal" class="modal-overlay" @tap="showCertModal = false">
      <view class="modal-sheet" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">电子施工证</text>
          <text class="modal-close" @tap="showCertModal = false">×</text>
        </view>
        <view class="modal-body">
          <view class="cert-preview">
            <text class="cert-h">装修施工证</text>
            <text class="cert-sub">RENOVATION CONSTRUCTION PERMIT</text>
            <view class="cert-row"><text>装修商户</text><text>{{ item.merchant }}</text></view>
            <view class="cert-row"><text>商铺号</text><text>{{ item.shop }}</text></view>
            <view class="cert-row"><text>装修内容</text><text>{{ (item.tags || []).join('·') }}</text></view>
            <view class="cert-row"><text>有效期</text><text>{{ (item.period || '').replace(' 至 ', ' ~ ') }}</text></view>
            <view class="cert-row"><text>施工证编号</text><text class="mono">{{ item.certNo }}</text></view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="btn btn-outline-green" @tap="showCertModal = false">关闭</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const { getConstructionById, getConstructionCategoryItems, getDailyReportStats, RECTIFY_DATA } = require('@/utils/construction-mock.js')

export default {
  data() {
    return {
      item: {},
      categoryItems: [],
      showCertModal: false,
      reportSummary: '暂无记录',
      pendingRectifyCount: 0
    }
  },

  computed: {
    banner() {
      const item = this.item
      if (!item.id) return null
      if (item.tab === 'expiring' && !item.stopped) {
        return { type: 'orange', title: `即将到期（剩余${item.daysLeft}天）`, desc: '请提醒商户关注施工证有效期，如需延期请引导提交装修延期申请。' }
      }
      if (item.stopped) {
        return { type: 'red', title: '停工整改', desc: (item.stopReason || '巡检异常-停工整改') + '。停工整改复核通过后将自动恢复施工。' }
      }
      return { type: 'blue', title: '施工中', desc: '施工证有效期内，请按计划开展日常巡检。' }
    },

    timelineList() {
      const item = this.item
      const list = [
        { dept: '系统生成施工证', meta: '2026-05-01 08:30 · 进入施工期', dotCls: 'dot-pass' },
        { dept: '日常巡检', meta: '2026-05-19 正常 · 赵经理', dotCls: 'dot-pass' }
      ]
      if (item.stopped) {
        list.push({ dept: '停工整改', meta: `${item.stopTime || '—'} · ${item.stopReason || '—'}`, dotCls: 'dot-reject' })
      }
      list.push({ dept: '商户申请验收', meta: '未提交 · 跳转既有验收模块', dotCls: 'dot-waiting' })
      return list
    }
  },

  onLoad(options) {
    const id = options.id || ''
    this.item = getConstructionById(id) || {}
    this.categoryItems = getConstructionCategoryItems(this.item)
    const drs = getDailyReportStats(this.item.id)
    this.reportSummary = drs.total ? `已报备 ${drs.reported} · 过期 ${drs.overdue}` : '暂无记录'
    this.pendingRectifyCount = (RECTIFY_DATA.pending || []).filter(r => r.applyId === this.item.id).length
  },

  methods: {
    goPlaceholder(name) {
      uni.showToast({ title: `${name}（跳转既有模块，演示占位）`, icon: 'none' })
    },
    goDailyReport() {
      uni.navigateTo({ url: `/pages/daily-report-list/index?applyId=${encodeURIComponent(this.item.id)}` })
    },
    startInspect() {
      uni.navigateTo({ url: `/pages/inspect-form/index?applyId=${encodeURIComponent(this.item.id)}&from=construction` })
    }
  }
}
</script>

<style>
.page { display: flex; flex-direction: column; height: 100vh; background: #FFFFFF; overflow: hidden; }
.scroll-body { flex: 1; overflow: hidden; padding: 20rpx 0; }

/* 基本信息类模块字段行：对齐「装修管理」详情页样式 —— 固定宽度标签 + 冒号，无下划线 */
.info-card .sec-title + .detail-row { padding-top: 0; }
.info-card .detail-row:last-child { padding-bottom: 0; }
.info-card .detail-row {
  display: flex; align-items: flex-start; padding: 12rpx 0; font-size: 26rpx;
  border-bottom: none;
}
.info-card .detail-label {
  width: 220rpx; flex-shrink: 0; color: #666666; text-align: right; line-height: 1.5;
  margin-right: 0;
}
.info-card .detail-label::after { content: '：'; }
.info-card .detail-value { color: var(--color-text-primary); text-align: left; flex: 1; line-height: 1.5; padding-left: 4rpx; }

/* ── 状态提示横幅（对齐「装修管理-延期申请」详情页）── */
.notice-banner {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  margin: 0 28rpx 20rpx;
}
.notice-red    { background: rgba(250,43,45,0.05); }
.notice-orange { background: rgba(241,146,4,0.08); }
.notice-blue   { background: rgba(24,144,255,0.08); }
.notice-green  { background: rgba(26,186,108,0.06); }
.notice-icon-wrap {
  width: 36rpx; height: 36rpx;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 4rpx;
}
.notice-red    .notice-icon-wrap { background: #FA2B2D; }
.notice-orange .notice-icon-wrap { background: #F19204; }
.notice-blue   .notice-icon-wrap { background: #1890FF; }
.notice-green  .notice-icon-wrap { background: #1ABA6C; }
.notice-icon-text { font-size: 22rpx; font-weight: 700; color: #FFFFFF; line-height: 1; }
.notice-body { flex: 1; }
.notice-title { display: block; font-size: 26rpx; font-weight: 600; margin-bottom: 8rpx; }
.notice-text  { display: block; font-size: 24rpx; line-height: 1.6; }
.notice-red    .notice-title, .notice-red    .notice-text { color: #FA2B2D; }
.notice-orange .notice-title, .notice-orange .notice-text { color: #F19204; }
.notice-blue   .notice-title, .notice-blue   .notice-text { color: #1890FF; }
.notice-green  .notice-title, .notice-green  .notice-text { color: #1ABA6C; }

/* ── 信息模块矩形背景框（对齐「装修管理-延期申请」详情页 .detail-card）── */
.info-card {
  background: #FAFAFA;
  border: 2rpx solid #E6E6E6;
  border-radius: 20rpx;
  padding: 28rpx;
  margin: 0 28rpx 20rpx;
}
.info-card .sec-title { margin-left: -28rpx; }
.cat-item { padding: 20rpx 0; border-bottom: 2rpx solid #F0F0F0; }
.cat-item:last-child { border-bottom: none; padding-bottom: 0; }
.cat-hd { display: flex; justify-content: space-between; align-items: flex-start; gap: 16rpx; margin-bottom: 12rpx; }
.cat-name { font-size: 28rpx; font-weight: 600; color: #333333; }
.my-dept-tag {
  font-size: 20rpx; padding: 4rpx 10rpx; border-radius: 4rpx;
  background: var(--color-primary-light); color: var(--color-primary);
  border: 2rpx solid var(--color-primary-border); font-weight: 500;
}
.cat-sub { display: block; font-size: 26rpx; color: #666666; line-height: 1.5; margin-bottom: 12rpx; }
.cat-dept-row { font-size: 24rpx; color: #999; }
.cat-dept-val { color: var(--color-text-primary); }
.cat-remark-label { display: block; font-size: 28rpx; font-weight: 600; color: var(--color-text-primary); margin-top: 24rpx; margin-bottom: 12rpx; }
.cat-remark-text { display: block; font-size: 26rpx; color: var(--color-text-primary); line-height: 1.6; }

.cert-link { color: var(--color-info); text-decoration: underline; }

/* ── 施工期关联业务 ── */
.link-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20rpx 0; border-bottom: none;
  font-size: 26rpx; color: var(--color-text-primary);
}
.link-row .arrow { color: var(--color-text-hint); }

/* ── 施工期流程记录（对齐「装修申请」详情页时间轴）── */
.timeline { padding-left: 26rpx; }
.tl-item { display: flex; padding-bottom: 44rpx; position: relative; }
.tl-item:last-child { padding-bottom: 0; }
.tl-axis {
  position: absolute;
  left: -26rpx; top: 0; bottom: 0;
  width: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tl-dot { width: 10rpx; height: 10rpx; border-radius: 9999rpx; flex-shrink: 0; background: #B3B3B3; z-index: 1; margin-top: 12rpx; }
.dot-pass    { background: #1ABA6C; }
.dot-reject  { background: #FA2B2D; }
.dot-waiting { background: #B3B3B3; }
.tl-line { flex: 1; width: 2rpx; background: #E0E0E0; margin-top: 16rpx; }
.tl-content { flex: 1; }
.tl-dept { display: block; font-size: 24rpx; font-weight: 600; color: #000000; }
.tl-meta { display: block; font-size: 24rpx; color: #666666; font-weight: 400; margin-top: 8rpx; }

/* ── 底部操作栏（沿用页面内嵌 scroll-view 结构，非全局 fixed）── */
.bottom-bar {
  position: static;
  background: #fff; border-top: 2rpx solid #EDEDED;
  height: 180rpx; padding: 12rpx 36rpx 0;
  display: flex; align-items: flex-start; gap: 30rpx;
  box-sizing: border-box; flex-shrink: 0;
}

/* ── 电子施工证弹窗 ── */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  z-index: 2000; display: flex; align-items: flex-end; justify-content: center;
}
.modal-sheet { width: 100%; max-height: 85vh; background: #fff; border-radius: 24rpx 24rpx 0 0; overflow: hidden; display: flex; flex-direction: column; }
.modal-header { padding: 32rpx; border-bottom: 2rpx solid var(--color-border); display: flex; justify-content: space-between; align-items: center; }
.modal-title { font-size: 32rpx; font-weight: 600; }
.modal-close { font-size: 44rpx; color: var(--color-text-hint); line-height: 1; }
.modal-body { padding: 32rpx; overflow-y: auto; flex: 1; }
.modal-footer { padding: 24rpx 36rpx; border-top: 2rpx solid var(--color-border); display: flex; gap: 30rpx; }
.cert-preview {
  background: linear-gradient(135deg, #fff 0%, #f0f8ff 50%, #e8f4fd 100%);
  border: 4rpx solid #B8D4E8; border-radius: 24rpx; padding: 40rpx;
}
.cert-h { display: block; text-align: center; color: #1A5276; font-size: 36rpx; font-weight: 700; letter-spacing: 8rpx; margin-bottom: 8rpx; }
.cert-sub { display: block; text-align: center; font-size: 22rpx; color: #7F8C8D; margin-bottom: 32rpx; }
.cert-row { display: flex; justify-content: space-between; padding: 16rpx 0; font-size: 26rpx; border-bottom: 2rpx solid #EEF5FA; }
.cert-row text:first-child { color: #7F8C8D; }
.cert-row text:last-child { color: #1A1A1A; font-weight: 500; }
.mono { font-family: monospace; }
</style>
