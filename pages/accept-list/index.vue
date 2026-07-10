<template>
  <view class="page">
    <!-- Tab 下划线滚动栏 -->
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

    <!-- 列表区 -->
    <scroll-view scroll-y class="task-list" :enhanced="true" :show-scrollbar="false">
      <text v-if="taskList.length > 0" class="count-tip">共找到{{ taskList.length }}个</text>
      <view v-if="taskList.length === 0" class="empty-state">暂无{{ currentTabLabel }}的验收申请</view>

      <view v-for="item in taskList" :key="item.id" class="task-card" @tap="goDetail(item)">
        <view v-if="currentTab === 'rejected'" class="card-title-row">
          <text class="card-green-title-inline">{{ (item.tags || []).join(' / ') }}</text>
          <text class="reject-tag">已驳回</text>
        </view>
        <text v-else class="card-green-title">{{ (item.tags || []).join(' / ') }}</text>
        <text class="card-shop-no">商铺号：{{ item.shop }}</text>
        <text class="info-line">商户名称：{{ item.merchant }}</text>
        <text class="info-line">验收编号：{{ item.id }}</text>
        <text class="info-line">申请编号：{{ item.applyId }}</text>
        <text class="info-line">申请验收时间：{{ item.acceptDate }}</text>
        <text v-if="item.currentStep" class="info-line">当前环节：{{ item.currentStep }}</text>
        <text v-if="currentTab === 'my-initial-review' && item.surveySignTime" class="info-line">踏勘签到：{{ item.surveySignTime }}</text>
        <text v-if="currentTab === 'rejected' && item.rejectReason" class="info-line info-line-danger">驳回原因：{{ item.rejectReason }}</text>
        <text v-if="currentTab === 'approved' && item.finishTime" class="info-line">完成时间：{{ item.finishTime }}</text>

        <view class="card-action" @tap.stop>
          <button
            v-if="currentTab === 'pending-survey' || (currentTab === 'my-initial-review' && item.needMyReview)"
            class="btn-outline-green btn-short" @tap.stop="goDetail(item)">查看详情</button>
          <button v-if="currentTab === 'pending-survey'" class="btn-fill btn-short" @tap.stop="goSurvey(item)">签到踏勘</button>
          <button v-else-if="currentTab === 'my-initial-review' && item.needMyReview" class="btn-fill btn-short" @tap.stop="goReview(item)">立即审核</button>
          <button v-else class="btn-outline-green btn-short" @tap.stop="goDetail(item)">查看详情</button>
        </view>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
const { ACCEPT_TABS, ACCEPT_DATA } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return { tabs: [], currentTab: 'pending-survey', taskList: [] }
  },
  computed: {
    currentTabLabel() {
      const t = this.tabs.find(t => t.key === this.currentTab)
      return t ? t.label : ''
    }
  },
  onLoad(options) {
    this.tabs = ACCEPT_TABS
    const tab = options.tab && ACCEPT_TABS.some(t => t.key === options.tab) ? options.tab : 'pending-survey'
    this.currentTab = tab
    this._loadList(tab)
  },
  methods: {
    tabBadge(key) { return (ACCEPT_DATA[key] || []).length },
    switchTab(key) { if (key === this.currentTab) return; this.currentTab = key; this._loadList(key) },
    _loadList(key) { this.taskList = ACCEPT_DATA[key] || [] },

    goDetail(item) {
      uni.navigateTo({ url: `/pages/accept-detail/index?tab=${this.currentTab}&id=${encodeURIComponent(item.id)}` })
    },
    goSurvey(item) {
      uni.navigateTo({
        url: `/pages/survey-checkin/index?scene=accept&shopNo=${encodeURIComponent(item.shop)}&itemId=${encodeURIComponent(item.id)}&category=${encodeURIComponent((item.tags || []).join('、'))}&merchant=${encodeURIComponent(item.merchant)}`
      })
    },
    goReview(item) {
      uni.navigateTo({
        url: `/pages/accept-review/index?id=${encodeURIComponent(item.id)}&applyId=${encodeURIComponent(item.applyId)}&shop=${encodeURIComponent(item.shop)}&merchant=${encodeURIComponent(item.merchant)}&categories=${encodeURIComponent((item.tags || []).join('、'))}`
      })
    }
  }
}
</script>

<style>
.page { display: flex; flex-direction: column; height: 100vh; background: var(--color-bg-page); overflow: hidden; }
.tabs-wrap { position: relative; background: #FFFFFF; border-bottom: 2rpx solid #EDEDED; flex-shrink: 0; overflow: hidden; }
.tabs-wrap::after { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 64rpx; background: linear-gradient(to right,transparent,#fff); pointer-events: none; }
.tabs { display: flex; overflow-x: auto; padding: 0 28rpx; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab { display: inline-flex; align-items: center; gap: 6rpx; padding: 22rpx 32rpx 18rpx 0; font-size: 28rpx; color: #4C4C4C; white-space: nowrap; position: relative; flex-shrink: 0; font-weight: 400; }
.tab-active { color: #1ABA6C; font-weight: 600; }
.tab-lbl { position: relative; }
.tab-active .tab-lbl::after { content: ''; position: absolute; bottom: -18rpx; left: 50%; transform: translateX(-50%); width: 40rpx; height: 6rpx; background: #1ABA6C; border-radius: 4rpx; }
.tab-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 28rpx; height: 28rpx; padding: 0 8rpx; border-radius: 14rpx; font-size: 20rpx; font-weight: 600; background: #FA2B2D; color: #fff; line-height: 1; }
.task-list { flex: 1; overflow: hidden; padding: 0 28rpx; }
.count-tip { display: block; font-size: 25rpx; color: #999999; padding: 28rpx 0 12rpx 0; line-height: 1.4; }
.task-card { background: #FFFFFF; border-radius: 16rpx; padding: 28rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05); }
.task-card:active { opacity: 0.9; }
.card-title-row { display: flex; align-items: flex-start; gap: 14rpx; margin-bottom: 28rpx; }
.card-green-title { display: block; font-size: 28rpx; font-weight: 600; color: #1ABA6C; line-height: 1.4; margin-bottom: 28rpx; }
.card-green-title-inline { font-size: 28rpx; font-weight: 600; color: #1ABA6C; line-height: 1.4; flex: 1; }
.reject-tag { flex-shrink: 0; display: inline-flex; align-items: center; padding: 4rpx 10rpx; background: rgba(250,43,45,0.05); border: 2rpx solid rgba(250,43,45,0.3); border-radius: 4rpx; color: #FA2B2D; font-size: 24rpx; font-weight: 400; }
.card-shop-no { display: block; font-size: 24rpx; font-weight: 600; color: #333333; margin-bottom: 12rpx; }
.info-line { display: block; font-size: 24rpx; color: #666666; margin-bottom: 6rpx; line-height: 1.5; }
.info-line-danger { color: #FA2B2D; }
.card-action { display: flex; justify-content: flex-end; align-items: center; gap: 10rpx; margin-top: 24rpx; padding-top: 20rpx; border-top: 2rpx solid #E7E7E7; }
.btn-fill, .btn-outline-green { display: inline-flex; align-items: center; justify-content: center; height: 56rpx; border-radius: 12rpx; font-size: 24rpx; font-weight: 600; }
.btn-fill          { background: #1ABA6C; color: #fff; border: none; }
.btn-outline-green { background: #fff; color: #1ABA6C; border: 2rpx solid #1ABA6C; }
.btn-short { width: 144rpx; }
.empty-state { text-align: center; padding: 120rpx 40rpx; color: var(--color-text-hint); font-size: 26rpx; }
</style>
