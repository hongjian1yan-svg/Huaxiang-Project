<template>
  <view class="page">
    <view class="home-body">
      <view class="home-hd">
        <text class="home-title">装修管理</text>
        <text class="home-sub">装修申请、审批、施工管理一体化</text>
      </view>
      <view class="ent-list">
        <view class="ent-card" @tap="goApplyList">
          <view class="ent-icon ei-green">📋</view>
          <view class="ent-info">
            <text class="ent-name">我的装修申请</text>
            <text class="ent-desc">待处理 3 个 · 施工中 2 个</text>
          </view>
          <text class="ent-arrow">›</text>
        </view>
        <view class="ent-card" @tap="goDailyReport">
          <view class="ent-icon ei-blue">📝</view>
          <view class="ent-info">
            <text class="ent-name">每日报备</text>
            <text class="ent-desc">{{ dailyReportDesc }}</text>
          </view>
          <text class="ent-arrow">›</text>
        </view>
        <view class="ent-card" @tap="goDelayList">
          <view class="ent-icon ei-warn">⏳</view>
          <view class="ent-info">
            <text class="ent-name">延期申请</text>
            <text class="ent-desc">申请延长装修工期</text>
          </view>
          <text class="ent-arrow">›</text>
        </view>
        <view class="ent-card" @tap="goAddItemList">
          <view class="ent-icon ei-blue">➕</view>
          <view class="ent-info">
            <text class="ent-name">增项申请</text>
            <text class="ent-desc">增加装修项目</text>
          </view>
          <text class="ent-arrow">›</text>
        </view>
        <view class="ent-card" @tap="goSpecialList">
          <view class="ent-icon ei-warn">⚠️</view>
          <view class="ent-info">
            <text class="ent-name">特殊作业申请</text>
            <text class="ent-desc">高空、动火、临时用电</text>
          </view>
          <text class="ent-arrow">›</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const { MERCHANT_UNDER_CONSTRUCTION_LIST, getDailyReportPendingCount } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return {
      dailyReportDesc: ''
    }
  },

  onShow() {
    this._updateDailyReportDesc()
  },

  methods: {
    goApplyList()   { uni.navigateTo({ url: '/pages/merchant-apply-list/index' }) },
    goDelayList()   { uni.navigateTo({ url: '/pages/merchant-delay-list/index' }) },
    goAddItemList() { uni.navigateTo({ url: '/pages/merchant-add-item-list/index' }) },
    goSpecialList() { uni.navigateTo({ url: '/pages/merchant-special-list/index' }) },

    _updateDailyReportDesc() {
      const list = MERCHANT_UNDER_CONSTRUCTION_LIST
      if (!list.length) {
        this.dailyReportDesc = '暂无施工中申请'
        return
      }
      const pending = getDailyReportPendingCount()
      this.dailyReportDesc = pending > 0 ? `今日待报备 ${pending} 项 · 填写施工内容并拍照` : '今日已全部报备'
    },

    goDailyReport() {
      if (!MERCHANT_UNDER_CONSTRUCTION_LIST.length) {
        uni.showToast({ title: '暂无施工中状态的装修申请，无法进行每日报备', icon: 'none' })
        return
      }
      uni.navigateTo({ url: '/pages/merchant-daily-report/index' })
    }
  }
}
</script>

<style>
.page { background: var(--color-bg-page); min-height: 100vh; }
.home-body { padding: 48rpx 28rpx; }
.home-hd { text-align: center; margin-bottom: 56rpx; }
.home-title { display: block; font-size: 44rpx; font-weight: 700; color: var(--color-primary); margin-bottom: 12rpx; }
.home-sub { display: block; font-size: 26rpx; color: var(--color-text-hint); }
.ent-list { display: flex; flex-direction: column; gap: 24rpx; }
.ent-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx 28rpx;
  display: flex;
  align-items: center;
  gap: 28rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
}
.ent-card:active { opacity: 0.85; transform: scale(0.99); }
.ent-icon {
  width: 88rpx; height: 88rpx;
  border-radius: 22rpx;
  display: flex; align-items: center; justify-content: center;
  font-size: 44rpx; flex-shrink: 0;
}
.ei-green { background: var(--color-primary-light); }
.ei-warn  { background: #fff7e6; }
.ei-blue  { background: var(--color-info-light); }
.ent-info { flex: 1; }
.ent-name { display: block; font-size: 30rpx; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6rpx; }
.ent-desc { display: block; font-size: 24rpx; color: var(--color-text-hint); }
.ent-arrow { font-size: 40rpx; color: var(--color-text-hint); }
</style>
