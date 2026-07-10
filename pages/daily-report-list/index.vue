<template>
  <view class="page">
    <view class="tabs-wrap">
      <view class="tabs">
        <view
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab', { 'tab-active': currentTab === tab.key }]"
          @tap="switchTab(tab.key)"
        >
          <text class="tab-lbl">{{ tab.label }}</text>
          <text v-if="tabBadge(tab.key) > 0" class="tab-badge">{{ tabBadge(tab.key) }}</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="task-list" :enhanced="true" :show-scrollbar="false">
      <text v-if="taskList.length > 0" class="count-tip">共找到{{ taskList.length }}条</text>
      <view v-if="taskList.length === 0" class="empty-state">暂无报备记录</view>

      <view
        v-for="item in taskList"
        :key="item.id"
        :class="['task-card', { readonly: currentTab === 'overdue' }]"
        @tap="currentTab === 'reported' && goDetail(item)"
      >
        <view class="card-title-row">
          <text class="card-green-title">{{ item.title }}</text>
        </view>
        <text class="info-line">申请编号：{{ item.applyId }}</text>
        <text class="info-line">施工证号：{{ item.certNo }}</text>
        <text class="info-line">报备日期：{{ item.reportDate }}</text>
        <text v-if="item.status === 'reported'" class="info-line">报备时间：{{ item.reportTime || '—' }}</text>
        <view v-if="item.works.length" class="task-tags">
          <text v-for="w in item.works" :key="w.key" :class="['task-tag', w.cls]">{{ w.label }}</text>
        </view>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
const { DAILY_REPORT_TABS, filterDailyReportList, getDailyReportStats } = require('@/utils/construction-mock.js')

export default {
  data() {
    return {
      tabs: [],
      currentTab: 'reported',
      applyId: '',
      taskList: []
    }
  },

  onLoad(options) {
    this.applyId = options.applyId || ''
    this.tabs = DAILY_REPORT_TABS
    this.renderList()
  },

  methods: {
    tabBadge(key) {
      return getDailyReportStats(this.applyId || undefined)[key === 'reported' ? 'reported' : 'overdue']
    },

    switchTab(key) {
      if (key === this.currentTab) return
      this.currentTab = key
      this.renderList()
    },

    renderList() {
      this.taskList = filterDailyReportList(this.currentTab, this.applyId || undefined)
    },

    goDetail(item) {
      uni.navigateTo({ url: `/pages/daily-report-detail/index?id=${encodeURIComponent(item.id)}` })
    }
  }
}
</script>

<style>
.page { display: flex; flex-direction: column; height: 100vh; background: var(--color-bg-page); overflow: hidden; }

.tabs-wrap { position: relative; background: #FFFFFF; border-bottom: 2rpx solid #EDEDED; flex-shrink: 0; overflow: hidden; }
.tabs-wrap::after { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 64rpx; background: linear-gradient(to right, transparent, #fff); pointer-events: none; }
.tabs { display: flex; overflow-x: auto; padding: 0 28rpx; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab { display: inline-flex; align-items: center; gap: 6rpx; padding: 22rpx 32rpx 18rpx 0; font-size: 28rpx; color: #4C4C4C; white-space: nowrap; position: relative; flex-shrink: 0; font-weight: 400; }
.tab-active { color: #1ABA6C; font-weight: 600; }
.tab-active::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 40rpx; height: 6rpx; background: #1ABA6C; border-radius: 4rpx; }
.tab-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 28rpx; height: 28rpx; padding: 0 8rpx; border-radius: 14rpx; font-size: 20rpx; font-weight: 600; background: #FA2B2D; color: #fff; line-height: 1; }

.task-list { flex: 1; overflow: hidden; padding: 0 28rpx; }
.count-tip { display: block; font-size: 25rpx; color: #999999; padding: 28rpx 0 12rpx 0; line-height: 1.4; }
.task-card { background: #FFFFFF; border-radius: 16rpx; padding: 28rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05); }
.task-card:active { opacity: 0.9; }
.task-card.readonly:active { opacity: 1; }
.card-title-row { display: flex; align-items: flex-start; gap: 20rpx; margin-bottom: 12rpx; }
.card-green-title { font-size: 28rpx; font-weight: 600; color: #1ABA6C; line-height: 1.4; flex: 1; }
.info-line { display: block; font-size: 24rpx; color: #666666; margin-bottom: 6rpx; line-height: 1.5; }

.task-tags { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 12rpx; }
.task-tag { font-size: 22rpx; padding: 4rpx 16rpx; border-radius: 8rpx; background: #fff1f0; color: var(--color-danger); }
.special-fire     { background: var(--color-warning-light); color: var(--color-warning); }
.special-height   { background: var(--color-info-light);    color: var(--color-info); }
.special-electric { background: var(--color-primary-light); color: var(--color-primary); }

.empty-state { text-align: center; padding: 120rpx 40rpx; color: var(--color-text-hint); font-size: 26rpx; }
</style>
