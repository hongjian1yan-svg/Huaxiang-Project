<template>
  <view class="page" :style="{ paddingBottom: hasReviewBtn ? '200rpx' : '40rpx' }">

    <!-- 商户信息 -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">商户信息</text></view>
      <view class="detail-row"><text class="detail-label">商户名称</text><text class="detail-value">{{ item.merchant }}</text></view>
      <view class="detail-row"><text class="detail-label">商铺号</text><text class="detail-value">{{ item.shop }}</text></view>
      <view class="detail-row"><text class="detail-label">联系人</text><text class="detail-value">{{ item.contact }}</text></view>
      <view class="detail-row"><text class="detail-label">申请时间</text><text class="detail-value">{{ item.date }}</text></view>
      <view class="detail-row"><text class="detail-label">延期编号</text><text class="detail-value">{{ item.id }}</text></view>
      <view class="detail-row"><text class="detail-label">关联装修申请</text><text class="detail-value">{{ item.applyId }}</text></view>
      <view class="detail-row">
        <text class="detail-label">当前状态</text>
        <text class="detail-value" :style="{ color: statusColor }">{{ statusText }}</text>
      </view>
    </view>

    <!-- 延期信息 -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">延期信息</text></view>
      <view class="detail-row"><text class="detail-label">原完工日期</text><text class="detail-value">{{ item.originalEnd }}</text></view>
      <view class="detail-row"><text class="detail-label">申请延至</text><text class="detail-value">{{ item.delayTo }}</text></view>
      <view class="detail-row"><text class="detail-label">延期天数</text><text class="detail-value">{{ item.days }}天</text></view>
      <view class="detail-row"><text class="detail-label">延期原因</text><text class="detail-value">{{ item.reason }}</text></view>
    </view>

    <!-- 装修类目及项目 -->
    <view v-if="categories.length" class="cats-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">装修类目及项目</text></view>
      <view v-for="cat in categories" :key="cat.name" class="cat-item">
        <view class="cat-hd">
          <view class="cat-left">
            <text class="cat-name">{{ cat.name }}</text>
          </view>
        </view>
        <view class="cat-projects">
          <view v-for="proj in cat.projects" :key="proj.name" class="cat-proj-item">
            <text class="cat-proj-name">{{ proj.name }}</text>
            <text :class="['status-tag', levelCls(proj.level)]">{{ proj.level }}级</text>
          </view>
        </view>
        <view class="cat-dept-row">
          <text class="cat-dept-label">责任部门：</text>
          <text class="cat-dept-val">{{ cat.dept }}</text>
        </view>
      </view>
    </view>

    <!-- 审核信息（已通过） -->
    <view v-if="tab === 'approved'" class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">审核信息</text></view>
      <view class="detail-row"><text class="detail-label">通过时间</text><text class="detail-value">{{ item.approveTime }}</text></view>
      <view class="detail-row"><text class="detail-label">审核人</text><text class="detail-value">{{ item.approvePerson }}</text></view>
    </view>

    <!-- 驳回信息（已驳回） -->
    <view v-if="tab === 'rejected'" class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">驳回信息</text></view>
      <view class="detail-row"><text class="detail-label">驳回时间</text><text class="detail-value">{{ item.rejectTime }}</text></view>
      <view class="detail-row"><text class="detail-label">审核人</text><text class="detail-value">{{ item.rejectPerson }}</text></view>
      <view class="detail-row">
        <text class="detail-label">驳回原因</text>
        <text class="detail-value" style="color: var(--color-danger);">{{ item.rejectReason }}</text>
      </view>
    </view>

    <!-- 取消信息（已取消） -->
    <view v-if="tab === 'cancelled'" class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">取消信息</text></view>
      <view class="detail-row"><text class="detail-label">取消时间</text><text class="detail-value">{{ item.cancelTime }}</text></view>
      <view class="detail-row"><text class="detail-label">操作人</text><text class="detail-value">{{ item.cancelPerson }}</text></view>
      <view class="detail-row"><text class="detail-label">取消说明</text><text class="detail-value">{{ item.cancelReason }}</text></view>
    </view>

  </view>

  <!-- 底部按钮 -->
  <view class="bottom-bar">
    <button v-if="hasReviewBtn" class="btn btn-primary" @tap="goReview">立即审核</button>
    <button v-else class="btn btn-outline-green" @tap="goBack">返回列表</button>
  </view>
</template>

<script>
const { DELAY_DATA } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return {
      tab: 'pending',
      item: {},
      categories: []
    }
  },

  computed: {
    hasReviewBtn() {
      return this.tab === 'pending' && this.item.needMyReview
    },
    statusText() {
      return { pending: '待审核', approved: '已通过', rejected: '已驳回', cancelled: '已取消' }[this.tab] || ''
    },
    statusColor() {
      if (this.tab === 'approved')  return 'var(--color-primary)'
      if (this.tab === 'rejected')  return 'var(--color-danger)'
      if (this.tab === 'cancelled') return 'var(--color-text-secondary, #999999)'
      return 'var(--color-warning)'
    }
  },

  onLoad(options) {
    const tab = options.tab || 'pending'
    const id  = decodeURIComponent(options.id || '')
    this.tab = tab
    uni.setNavigationBarTitle({ title: { pending: '待审核详情', approved: '已通过详情', rejected: '已驳回详情', cancelled: '已取消详情' }[tab] || '延期申请详情' })
    const list = DELAY_DATA[tab] || []
    const found = list.find(d => d.id === id) || {}
    this.item = found
    this.categories = found.categories || []
  },

  methods: {
    levelCls(level) {
      if (level === 1) return 'status-green'
      if (level === 3) return 'status-red'
      return 'status-orange'
    },

    goBack() { uni.navigateBack() },

    goReview() {
      const item = this.item
      uni.navigateTo({
        url: `/pages/delay-review/index?id=${encodeURIComponent(item.id)}&applyId=${encodeURIComponent(item.applyId)}&shop=${encodeURIComponent(item.shop)}&merchant=${encodeURIComponent(item.merchant)}&originalEnd=${encodeURIComponent(item.originalEnd)}&delayTo=${encodeURIComponent(item.delayTo)}&days=${item.days}&reason=${encodeURIComponent(item.reason || '')}`
      })
    }
  }
}
</script>

<style>
.page {
  background: #FFFFFF;
  min-height: 100vh;
}
/* 每个 section 最后一行去掉底部 padding，由 section 自身的 28rpx padding 提供间距 */
.detail-section .detail-row:last-child { padding-bottom: 0; }
/* 装修类目最后一个子项去掉底部 padding，由 cats-section 的 28rpx padding 提供间距 */
.cats-section .cat-item:last-child { padding-bottom: 0; }

/* 装修类目及项目（与装修申请详情页保持一致） */
.cats-section {
  background: #FAFAFA;
  border: 2rpx solid #E6E6E6;
  border-radius: 20rpx;
  padding: 28rpx;
  margin: 0 28rpx 20rpx;
}
.cats-section .sec-title { margin-left: -28rpx; }
.cat-item { padding: 20rpx 0; border-bottom: 2rpx solid #F0F0F0; }
.cat-item:last-of-type { border-bottom: none; }
.cat-hd { display: flex; justify-content: space-between; align-items: flex-start; gap: 16rpx; margin-bottom: 12rpx; }
.cat-left { display: flex; align-items: center; gap: 16rpx; flex-wrap: wrap; flex: 1; }
.cat-name { font-size: 28rpx; font-weight: 600; color: #333333; }
.my-dept-tag {
  font-size: 20rpx; font-weight: 500;
  padding: 4rpx 10rpx; border-radius: 4rpx;
  background: #E8F9F0; color: #1ABA6C;
  outline: 2rpx solid rgba(26,186,108,0.3); outline-offset: -2rpx;
  white-space: nowrap;
}
.cat-projects { display: flex; flex-direction: row; align-items: center; flex-wrap: nowrap; gap: 16rpx; margin-bottom: 12rpx; overflow: hidden; }
.cat-proj-item { display: flex; align-items: center; gap: 4rpx; flex-shrink: 0; }
.cat-proj-name { font-size: 26rpx; color: #666666; line-height: 1.5; }
.cat-proj-item .status-tag { padding-top: 0; padding-bottom: 0; }
.status-tag { display: inline-flex; align-items: center; padding: 4rpx 16rpx; border-radius: 8rpx; font-size: 22rpx; white-space: nowrap; line-height: 1.4; }
.status-green  { background: #E8F9F0; color: #1ABA6C; }
.status-orange { background: rgba(241,146,4,0.1); color: #F19204; }
.status-red    { background: rgba(250,43,45,0.05); color: #FA2B2D; }
.cat-dept-row { display: flex; font-size: 24rpx; }
.cat-dept-label { color: #999999; flex-shrink: 0; }
.cat-dept-val { color: #333333; }
</style>
