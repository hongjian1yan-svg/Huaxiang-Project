<template>
  <view class="home">
    <view class="stats-grid">
      <view class="stat-card" @tap="goConstructionList('all')">
        <view class="stat-info">
          <text class="stat-num">{{ activeCount }}</text>
          <text class="stat-label">施工中</text>
        </view>
        <view class="stat-icon"></view>
      </view>
      <view class="stat-card" @tap="goInspectList('today')">
        <view class="stat-info">
          <text class="stat-num">{{ todayInspectCount }}</text>
          <text class="stat-label">今日待检</text>
        </view>
        <view class="stat-icon"></view>
      </view>
      <view class="stat-card" @tap="goInspectList('recheck')">
        <view class="stat-info">
          <text class="stat-num">{{ todayRecheckCount }}</text>
          <text class="stat-label">今日待复检</text>
        </view>
        <view class="stat-icon"></view>
      </view>
      <view class="stat-card" @tap="goConstructionList('stopped')">
        <view class="stat-info">
          <text class="stat-num">{{ stoppedCount }}</text>
          <text class="stat-label">停工整改</text>
        </view>
        <view class="stat-icon"></view>
      </view>
    </view>

    <view class="entrance-list">
      <view class="entrance-card" @tap="goConstructionList('all')">
        <view class="entrance-icon"></view>
        <view class="entrance-info">
          <view class="entrance-title">施工中商户</view>
          <view class="entrance-desc">共 {{ constructionTotal }} 个商户在施工期内</view>
        </view>
        <view class="entrance-arrow"><image class="arrow-img" src="/static/images/arrow-right.png" mode="aspectFit" /></view>
      </view>
      <view class="entrance-card" @tap="goInspectList()">
        <view class="entrance-icon"></view>
        <view class="entrance-info">
          <view class="entrance-title">巡检任务</view>
          <view class="entrance-desc">今日待检 {{ todayInspectCount }} 个 · 待复检 {{ todayRecheckCount }} 个</view>
        </view>
        <view class="entrance-badge" v-if="inspectBadge > 0">{{ inspectBadge }}</view>
        <view class="entrance-arrow"><image class="arrow-img" src="/static/images/arrow-right.png" mode="aspectFit" /></view>
      </view>
      <view class="entrance-card" @tap="goRectifyList">
        <view class="entrance-icon"></view>
        <view class="entrance-info">
          <view class="entrance-title">停工整改复核</view>
          <view class="entrance-desc">待处理 {{ rectifyBadge }} 个</view>
        </view>
        <view class="entrance-badge" v-if="rectifyBadge > 0">{{ rectifyBadge }}</view>
        <view class="entrance-arrow"><image class="arrow-img" src="/static/images/arrow-right.png" mode="aspectFit" /></view>
      </view>
      <view class="entrance-card" @tap="goDailyReportList">
        <view class="entrance-icon"></view>
        <view class="entrance-info">
          <view class="entrance-title">商户每日报备</view>
          <view class="entrance-desc">过期未报备 {{ reportBadge }} 个</view>
        </view>
        <view class="entrance-badge" v-if="reportBadge > 0">{{ reportBadge }}</view>
        <view class="entrance-arrow"><image class="arrow-img" src="/static/images/arrow-right.png" mode="aspectFit" /></view>
      </view>
    </view>
  </view>
</template>

<script>
const {
  CONSTRUCTION_DATA, INSPECT_DATA, RECTIFY_DATA, getDailyReportStats
} = require('@/utils/construction-mock.js')

export default {
  data() {
    return {
      constructionTotal: 0,
      activeCount: 0,
      stoppedCount: 0,
      todayInspectCount: 0,
      todayRecheckCount: 0,
      inspectBadge: 0,
      rectifyBadge: 0,
      reportBadge: 0
    }
  },

  onShow() {
    this.constructionTotal = CONSTRUCTION_DATA.length
    this.activeCount = CONSTRUCTION_DATA.filter(d => !d.stopped).length
    this.stoppedCount = CONSTRUCTION_DATA.filter(d => d.stopped).length
    this.todayInspectCount = INSPECT_DATA.today.length
    this.todayRecheckCount = INSPECT_DATA.recheck.length
    this.inspectBadge = INSPECT_DATA.today.length + INSPECT_DATA.recheck.length + INSPECT_DATA.overdue.length
    this.rectifyBadge = RECTIFY_DATA.pending.filter(r => r.needStop).length + RECTIFY_DATA.review.filter(r => r.needStop).length
    this.reportBadge = getDailyReportStats().overdue
  },

  methods: {
    goConstructionList(tab) { uni.navigateTo({ url: `/pages/construction-list/index${tab ? '?tab=' + tab : ''}` }) },
    goInspectList(tab) { uni.navigateTo({ url: `/pages/inspect-list/index${tab ? '?tab=' + tab : ''}` }) },
    goRectifyList() { uni.navigateTo({ url: '/pages/rectify-list/index' }) },
    goDailyReportList() { uni.navigateTo({ url: '/pages/daily-report-list/index' }) }
  }
}
</script>

<style>
.home {
  padding: 28rpx 28rpx 40rpx;
  min-height: 100vh;
  background: var(--color-bg-page);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 32rpx;
}
.stat-card {
  background: var(--color-bg-card);
  border-radius: var(--card-radius);
  padding: 24rpx 32rpx;
  box-shadow: 0 12rpx 16rpx rgba(222,227,240,0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}
.stat-card:active { opacity: 0.85; }
.stat-info { display: flex; flex-direction: column; gap: 8rpx; }
.stat-num { font-size: 52rpx; font-weight: 700; color: var(--color-primary); line-height: 1; }
.stat-label { font-size: 26rpx; color: var(--color-text-hint); }
.stat-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 8rpx;
  background: #DDDDDD;
  flex-shrink: 0;
}

.entrance-list { display: flex; flex-direction: column; gap: 20rpx; }
.entrance-card {
  background: #fff;
  border-radius: var(--card-radius);
  padding: 28rpx 32rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  box-shadow: 0 12rpx 16rpx rgba(222,227,240,0.4);
  position: relative;
}
.entrance-card:active { opacity: 0.85; }
.entrance-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 8rpx;
  background: #DDDDDD;
  flex-shrink: 0;
}
.entrance-info { flex: 1; min-width: 0; }
.entrance-title { font-size: 32rpx; font-weight: 600; color: #000; margin-bottom: 4rpx; }
.entrance-desc  { font-size: 24rpx; color: var(--color-text-hint); }
.entrance-badge {
  min-width: 36rpx; height: 36rpx; padding: 0 10rpx;
  border-radius: 18rpx; background: var(--color-danger); color: #fff;
  font-size: 22rpx; line-height: 36rpx; text-align: center; box-sizing: border-box;
}
.entrance-arrow { width: 32rpx; height: 32rpx; flex-shrink: 0; }
.arrow-img { width: 32rpx; height: 32rpx; display: block; }
</style>
