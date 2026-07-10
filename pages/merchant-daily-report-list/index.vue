<template>
  <view class="page">
    <view class="tabs-wrap">
      <view class="tabs">
        <view
          v-for="tab in tabs" :key="tab.key"
          :class="['tab', { 'tab-active': currentTab === tab.key }]"
          @tap="switchTab(tab.key)"
        >
          <text class="tab-lbl">{{ tab.label }}</text>
          <text v-if="tabBadge(tab.key) > 0" class="tab-badge">{{ tabBadge(tab.key) }}</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="task-list" :enhanced="true" :show-scrollbar="false">
      <text v-if="rows.length > 0" class="count-tip">共{{ rows.length }}个记录</text>
      <view v-if="rows.length === 0" class="empty-state">{{ currentTab === 'missed' ? '暂无过期未报备记录' : '暂无已报备记录' }}</view>

      <template v-if="currentTab === 'reported'">
        <view v-for="row in rows" :key="row.date" class="task-card" @tap="goDetail(row.date)">
          <view class="card-title-row">
            <text class="card-green-title">{{ row.date }}</text>
            <text class="status-tag status-green">已报备</text>
          </view>
          <text class="info-line">报备时间：{{ row.record.reportTime || '—' }}</text>
          <text class="content-preview">{{ preview(row.record.content) }}</text>
          <view class="task-tags">
            <text v-if="specialTypes(row).length === 0" class="task-tag task-tag-grey">无特殊作业</text>
            <text v-for="t in specialTypes(row)" :key="t" :class="['task-tag', 'special-' + t]">{{ typeLabel(t) }}</text>
          </view>
          <view class="card-action">
            <button class="card-detail-btn" @tap.stop="goDetail(row.date)">查看详情</button>
          </view>
        </view>
      </template>

      <template v-else>
        <view v-for="row in rows" :key="row.date" class="task-card readonly-card">
          <view class="card-title-row">
            <text class="card-green-title">{{ row.date }}</text>
            <text class="status-tag status-red">过期未报备</text>
          </view>
          <text class="info-line">说明：<text class="danger-text">已超过当日报备时限</text></text>
          <text class="missed-tip">该日未提交每日报备，仅作记录展示，不支持补报。</text>
        </view>
      </template>

      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
const {
  getDailyReportEligibleApply, getDailyReportHistoryBuckets, getSpecialWorkInfoForDate,
  SPECIAL_TYPE_LABEL
} = require('@/utils/renovation-mock.js')

export default {
  data() {
    return {
      apply: {},
      tabs: [
        { key: 'reported', label: '已报备' },
        { key: 'missed', label: '过期未报备' }
      ],
      currentTab: 'reported',
      buckets: { reported: [], missed: [] },
      range: {}
    }
  },

  computed: {
    rows() { return this.currentTab === 'missed' ? this.buckets.missed : this.buckets.reported }
  },

  onLoad(options) {
    const applyId = options.applyId || ''
    this.apply = getDailyReportEligibleApply(applyId) || {}
    if (!this.apply.id) return
    this.buckets = getDailyReportHistoryBuckets(this.apply.id)
    this.range = this.buckets.range || {}
  },

  methods: {
    tabBadge(key) { return (this.buckets[key] || []).length },

    switchTab(key) {
      if (key === this.currentTab) return
      this.currentTab = key
    },

    typeLabel(t) { return SPECIAL_TYPE_LABEL[t] || t },

    specialTypes(row) {
      const certs = row.record.certsByType || {}
      const keys = Object.keys(certs).filter(k => certs[k] && certs[k].length)
      if (keys.length) return ['fire', 'height', 'electric'].filter(t => keys.indexOf(t) >= 0)
      return getSpecialWorkInfoForDate(this.apply.id, row.date).types
    },

    preview(content) {
      const c = content || '—'
      return c.length > 48 ? c.slice(0, 48) + '…' : c
    },

    goDetail(date) {
      uni.navigateTo({ url: `/pages/merchant-daily-report-detail/index?applyId=${encodeURIComponent(this.apply.id)}&date=${date}` })
    }
  }
}
</script>

<style>
.page { display: flex; flex-direction: column; height: 100vh; background: var(--color-bg-page); overflow: hidden; }

.tabs-wrap { position: relative; background: #FFFFFF; border-bottom: 2rpx solid #EDEDED; flex-shrink: 0; overflow: hidden; }
.tabs { display: flex; padding: 0 28rpx; }
.tab { display: inline-flex; align-items: center; gap: 6rpx; padding: 22rpx 32rpx 18rpx 0; font-size: 28rpx; color: #4C4C4C; white-space: nowrap; position: relative; flex-shrink: 0; font-weight: 400; }
.tab-active { color: var(--color-primary); font-weight: 600; }
.tab-lbl { position: relative; }
.tab-active .tab-lbl::after { content: ''; position: absolute; bottom: -18rpx; left: 50%; transform: translateX(-50%); width: 40rpx; height: 6rpx; background: var(--color-primary); border-radius: 4rpx; }
.tab-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 28rpx; height: 28rpx; padding: 0 8rpx; border-radius: 14rpx; font-size: 20rpx; font-weight: 600; background: var(--color-danger); color: #fff; line-height: 1; }

.task-list { flex: 1; overflow: hidden; padding: 0 28rpx; }
.count-tip { display: block; font-size: 25rpx; color: #999999; padding: 28rpx 0 12rpx 0; line-height: 1.4; }
.task-card { background: #FFFFFF; border-radius: 16rpx; padding: 28rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05); }
.task-card:active { opacity: 0.9; }
.readonly-card:active { opacity: 1; }
.card-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12rpx; }
.card-green-title { font-size: 28rpx; font-weight: 600; color: var(--color-primary); line-height: 1.4; }
.info-line { display: block; font-size: 24rpx; color: #666666; margin-bottom: 6rpx; line-height: 1.5; }
.danger-text { color: var(--color-danger); }
.content-preview { display: block; font-size: 24rpx; color: var(--color-text-primary); line-height: 1.6; margin: 8rpx 0; }
.missed-tip { display: block; font-size: 22rpx; color: var(--color-text-hint); line-height: 1.5; margin-top: 12rpx; }

.task-tags { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 8rpx; }
.task-tag { font-size: 22rpx; padding: 4rpx 16rpx; border-radius: 8rpx; background: #fff1f0; color: var(--color-danger); }
.task-tag-grey  { background: #F5F5F5; color: var(--color-text-hint); }
.special-fire     { background: var(--color-warning-light); color: var(--color-warning); }
.special-height   { background: var(--color-info-light);    color: var(--color-info); }
.special-electric { background: var(--color-primary-light); color: var(--color-primary); }

.card-action { display: flex; justify-content: flex-end; align-items: center; gap: 16rpx; margin-top: 24rpx; padding-top: 20rpx; border-top: 2rpx solid var(--color-divider-h); }
.card-detail-btn { display: inline-flex; align-items: center; justify-content: center; width: 144rpx; height: 56rpx; border-radius: 12rpx; font-size: 24rpx; font-weight: 600; color: var(--color-primary); background: #fff; border: 1rpx solid var(--color-primary); }

.empty-state { text-align: center; padding: 120rpx 40rpx; color: var(--color-text-hint); font-size: 26rpx; }
</style>
