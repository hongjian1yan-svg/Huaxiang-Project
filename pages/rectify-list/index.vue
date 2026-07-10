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
      <text v-if="taskList.length > 0" class="count-tip">共找到{{ taskList.length }}个</text>
      <view v-if="taskList.length === 0" class="empty-state">暂无记录</view>

      <view v-for="item in taskList" :key="item.id" class="task-card" @tap="goDetail(item)">
        <view class="card-title-row">
          <text class="card-green-title">{{ item.shop }} · {{ item.merchant }}</text>
        </view>
        <text class="info-line">整改单号：{{ item.id }}</text>
        <text class="info-line">问题类型：{{ item.type }}</text>
        <text class="info-line">整改期限：{{ item.deadline }}</text>
        <template v-if="currentTab === 'rejected'">
          <text class="info-line">驳回时间：{{ item.rejectTime || '—' }}</text>
          <text v-if="item.reviewOpinion" class="info-line">驳回原因：<text class="danger-text">{{ item.reviewOpinion }}</text></text>
        </template>
        <view v-if="currentTab === 'review' || currentTab === 'pending'" class="card-action">
          <button class="btn-fill btn-short" @tap.stop="goReview(item)">立即复核</button>
        </view>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
const { RECTIFY_TABS, RECTIFY_DATA } = require('@/utils/construction-mock.js')

export default {
  data() {
    return {
      tabs: [],
      currentTab: 'pending',
      taskList: []
    }
  },

  onLoad() {
    this.tabs = RECTIFY_TABS
    this.renderList()
  },

  methods: {
    filterStop(list) {
      return (list || []).filter(item => item.needStop)
    },

    tabBadge(key) {
      return this.filterStop(RECTIFY_DATA[key]).length
    },

    switchTab(key) {
      if (key === this.currentTab) return
      this.currentTab = key
      this.renderList()
    },

    renderList() {
      this.taskList = this.filterStop(RECTIFY_DATA[this.currentTab])
    },

    goDetail(item) {
      uni.navigateTo({ url: `/pages/rectify-detail/index?id=${encodeURIComponent(item.id)}&tab=${this.currentTab}` })
    },

    goReview(item) {
      uni.navigateTo({ url: `/pages/rectify-review/index?id=${encodeURIComponent(item.id)}&tab=${this.currentTab}` })
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
.card-title-row { display: flex; align-items: flex-start; gap: 20rpx; margin-bottom: 12rpx; }
.card-green-title { font-size: 28rpx; font-weight: 600; color: #1ABA6C; line-height: 1.4; flex: 1; }
.info-line { display: block; font-size: 24rpx; color: #666666; margin-bottom: 6rpx; line-height: 1.5; }
.danger-text { color: var(--color-danger); }

.card-action { display: flex; justify-content: flex-end; align-items: center; gap: 10rpx; margin-top: 24rpx; padding-top: 20rpx; border-top: 2rpx solid #E7E7E7; }
.btn-fill { display: inline-flex; align-items: center; justify-content: center; height: 56rpx; border-radius: 12rpx; font-size: 24rpx; font-weight: 600; background: #1ABA6C; color: #fff; border: none; }
.btn-short { width: 144rpx; }

.empty-state { text-align: center; padding: 120rpx 40rpx; color: var(--color-text-hint); font-size: 26rpx; }
</style>
