<template>
  <view class="home">
    <view class="home-header">
      <view class="home-title">装修管理</view>
      <view class="home-subtitle">市场员工端</view>
    </view>
    <view class="entrance-list">
      <view class="entrance-card" @tap="goRenovation">
        <view class="entrance-icon icon-primary">📋</view>
        <view class="entrance-info">
          <view class="entrance-title">装修申请</view>
          <view class="entrance-desc">待我审核 2 个 · 待踏勘 3 个</view>
        </view>
        <view class="entrance-arrow">›</view>
      </view>
      <view class="entrance-card" @tap="goDelayList">
        <view class="entrance-icon icon-warning">📅</view>
        <view class="entrance-info">
          <view class="entrance-title">装修延期申请</view>
          <view class="entrance-desc">待审核 2 个</view>
        </view>
        <view class="entrance-arrow">›</view>
      </view>
      <view class="entrance-card" @tap="goAddItemList">
        <view class="entrance-icon icon-primary">➕</view>
        <view class="entrance-info">
          <view class="entrance-title">装修增项申请</view>
          <view class="entrance-desc">待我审核 1 个 · 待踏勘 1 个</view>
        </view>
        <view class="entrance-arrow">›</view>
      </view>
      <view class="entrance-card entrance-disabled">
        <view class="entrance-icon icon-warning">🔍</view>
        <view class="entrance-info">
          <view class="entrance-title">巡检任务</view>
          <view class="entrance-desc">敬请期待</view>
        </view>
        <view class="entrance-arrow">›</view>
      </view>
      <view class="entrance-card" @tap="goAcceptList">
        <view class="entrance-icon icon-success">✅</view>
        <view class="entrance-info">
          <view class="entrance-title">验收审核</view>
          <view class="entrance-desc">待踏勘 2 个 · 待我审核 1 个 · 踏勘审核中 1 个</view>
        </view>
        <view class="entrance-arrow">›</view>
      </view>
      <view class="entrance-card" @tap="goSpecialList">
        <view class="entrance-icon icon-danger">⚠️</view>
        <view class="entrance-info">
          <view class="entrance-title">特殊作业申请</view>
          <view class="entrance-desc">待我审核 3 个 · 审核中 3 个</view>
        </view>
        <view class="entrance-arrow">›</view>
      </view>
      <view class="entrance-card" @tap="goConstructionHome">
        <view class="entrance-icon icon-primary">🏗️</view>
        <view class="entrance-info">
          <view class="entrance-title">装修施工期管理</view>
          <view class="entrance-desc">施工中巡检、停工整改复核、商户每日报备</view>
        </view>
        <view class="entrance-arrow">›</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    goRenovation() {
      uni.navigateTo({ url: '/pages/renovation/index' })
    },
    goDelayList() {
      uni.navigateTo({ url: '/pages/delay-list/index' })
    },
    goAddItemList() {
      uni.navigateTo({ url: '/pages/add-item-list/index' })
    },
    goSpecialList() {
      uni.navigateTo({ url: '/pages/special-list/index' })
    },
    goConstructionHome() {
      uni.navigateTo({ url: '/pages/construction-home/index' })
    },
    goAcceptList() {
      uni.navigateTo({ url: '/pages/accept-list/index' })
    }
  }
}
</script>

<style>
.home {
  padding: 40rpx 28rpx;
  min-height: 100vh;
  background: var(--color-bg-page);
}
.home-header {
  text-align: center;
  margin-bottom: 48rpx;
}
.home-title {
  font-size: 48rpx;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 12rpx;
}
.home-subtitle {
  font-size: 26rpx;
  color: var(--color-text-hint);
}
.entrance-list { display: flex; flex-direction: column; gap: 24rpx; }
.entrance-card {
  background: #fff;
  border-radius: var(--card-radius);
  padding: 32rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  box-shadow: 0 2rpx 16rpx rgba(0,0,0,0.06);
}
.entrance-card:active { opacity: 0.85; }
.entrance-disabled { opacity: 0.45; }
.entrance-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  flex-shrink: 0;
}
.icon-primary { background: var(--color-primary-light); }
.icon-warning { background: #fff7e6; }
.icon-success { background: #f6ffed; }
.icon-danger  { background: #fff1f0; }
.entrance-info { flex: 1; }
.entrance-title { font-size: 30rpx; font-weight: 500; margin-bottom: 8rpx; }
.entrance-desc  { font-size: 24rpx; color: var(--color-text-hint); }
.entrance-arrow { font-size: 36rpx; color: var(--color-text-hint); }
</style>
