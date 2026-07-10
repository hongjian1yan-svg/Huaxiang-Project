<template>
  <view class="page" :style="{ paddingBottom: (hasPrimaryBtn || showCancelBtn) ? '200rpx' : '40rpx' }">

    <!-- 状态提示横幅 -->
    <view v-if="banner" :class="['notice-banner', 'notice-' + banner.type]">
      <view class="notice-icon-wrap">
        <text class="notice-icon-text">!</text>
      </view>
      <view class="notice-body">
        <text class="notice-title">{{ banner.title }}</text>
        <text class="notice-text">{{ banner.text }}</text>
      </view>
    </view>

    <!-- 基本信息 -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">基本信息</text></view>
      <view class="detail-row"><text class="detail-label">延期编号</text><text class="detail-value">{{ item.id }}</text></view>
      <view class="detail-row"><text class="detail-label">关联装修申请</text><text class="detail-value">{{ item.applyId }}</text></view>
      <view class="detail-row"><text class="detail-label">商户名称</text><text class="detail-value">{{ item.merchant }}</text></view>
      <view class="detail-row"><text class="detail-label">商铺号</text><text class="detail-value">{{ item.shop }}</text></view>
      <view class="detail-row"><text class="detail-label">申请时间</text><text class="detail-value">{{ item.date }}</text></view>
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
        <text class="cat-name">{{ cat.name }}</text>
        <text class="cat-sub">{{ cat.projects.join('、') }}</text>
      </view>
    </view>

    <!-- 审批进度（审核中） -->
    <view v-if="tab === 'reviewing'" class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">审批进度</text></view>
      <view class="detail-row"><text class="detail-label">当前环节</text><text class="detail-value">{{ item.currentStep }}</text></view>
      <view class="detail-row"><text class="detail-label">提交时间</text><text class="detail-value">{{ item.date }}</text></view>
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

    <!-- 审核信息（已通过） -->
    <view v-if="tab === 'approved'" class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">审核信息</text></view>
      <view class="detail-row"><text class="detail-label">通过时间</text><text class="detail-value">{{ item.approveTime }}</text></view>
      <view class="detail-row"><text class="detail-label">审核人</text><text class="detail-value">{{ item.approvePerson }}</text></view>
    </view>

  </view>

  <!-- 底部操作栏 -->
  <view class="bottom-bar">
    <button v-if="showCancelBtn" class="btn btn-outline-red" @tap="showCancelModal = true">取消延期</button>
    <button class="btn btn-outline-green" @tap="goBack">返回列表</button>
    <button v-if="hasPrimaryBtn" class="btn btn-primary" @tap="goReapply">重新提交</button>
  </view>

  <!-- 取消延期确认弹窗 -->
  <view v-if="showCancelModal" class="modal-overlay" @tap="showCancelModal = false">
    <view class="dialog-card" @tap.stop>
      <view class="dialog-body">
        <text class="dialog-title">取消延期申请</text>
        <text class="dialog-body-text">确认后该延期申请将被撤销，是否继续？</text>
      </view>
      <view class="dialog-footer">
        <button class="btn btn-outline-green" @tap="showCancelModal = false">返回</button>
        <button class="btn btn-danger" @tap="confirmCancel">确认取消</button>
      </view>
    </view>
  </view>
</template>

<script>
const { MERCHANT_DELAY_DATA } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return {
      tab: 'reviewing',
      item: {},
      categories: [],
      banner: null,
      showCancelModal: false
    }
  },

  computed: {
    hasPrimaryBtn()  { return this.tab === 'rejected' },
    showCancelBtn()  { return this.tab === 'reviewing' },
    statusText() {
      return { reviewing: '审核中', rejected: '已驳回', approved: '已通过' }[this.tab] || ''
    },
    statusColor() {
      if (this.tab === 'approved') return 'var(--color-primary)'
      if (this.tab === 'rejected') return 'var(--color-danger)'
      return 'var(--color-warning)'
    }
  },

  onLoad(options) {
    const tab = options.tab || 'reviewing'
    const id  = decodeURIComponent(options.id || '')
    this.tab  = tab

    const titleMap = { reviewing: '审核中详情', rejected: '已驳回详情', approved: '已通过详情' }
    uni.setNavigationBarTitle({ title: titleMap[tab] || '延期申请详情' })

    const list = MERCHANT_DELAY_DATA[tab] || []
    const found = list.find(d => d.id === id) || {}
    this.item       = found
    this.categories = found.categories || []

    const bannerMap = {
      reviewing: { type: 'orange', title: '审核中',  text: '当前审批环节：' + (found.currentStep || '审批中') + '，预计1-3个工作日完成审核，请耐心等待。' },
      rejected:  { type: 'red',    title: '已驳回',  text: '您的延期申请未通过审核，请查看驳回原因后修改并重新提交。' },
      approved:  { type: 'green',  title: '已通过',  text: '延期申请已审核通过，装修完工日期将按申请延至日期更新。' }
    }
    this.banner = bannerMap[tab] || null
  },

  methods: {
    goBack()    { uni.navigateBack() },
    goReapply() { uni.navigateTo({ url: '/pages/merchant-delay-apply/index' }) },
    confirmCancel() {
      this.showCancelModal = false
      uni.showToast({ title: '延期申请已取消', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 1200)
    }
  }
}
</script>

<style>
.page { background: #FFFFFF; min-height: 100vh; }
/* sec-title 紧接的第一行去掉顶部 padding，使标题到内容间距恰好为 24rpx */
.detail-section .sec-title + .detail-row { padding-top: 0; }
/* 末行去掉底部 padding，由 section 自身 28rpx 底部间距提供留白 */
.detail-section .detail-row:last-child { padding-bottom: 0; }

/* ── 状态提示横幅 ── */
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
.notice-green  { background: rgba(26,186,108,0.06); }
.notice-icon-wrap {
  width: 36rpx; height: 36rpx;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 4rpx;
}
.notice-red    .notice-icon-wrap { background: #FA2B2D; }
.notice-orange .notice-icon-wrap { background: #F19204; }
.notice-green  .notice-icon-wrap { background: #1ABA6C; }
.notice-icon-text { font-size: 22rpx; font-weight: 700; color: #FFFFFF; line-height: 1; }
.notice-body { flex: 1; }
.notice-title {
  display: block; font-size: 26rpx; font-weight: 600; margin-bottom: 8rpx;
}
.notice-text  { display: block; font-size: 24rpx; line-height: 1.6; }
.notice-red    .notice-title, .notice-red    .notice-text  { color: #FA2B2D; }
.notice-orange .notice-title, .notice-orange .notice-text  { color: #F19204; }
.notice-green  .notice-title, .notice-green  .notice-text  { color: #1ABA6C; }

/* ── 装修类目 ── */
.cats-section {
  background: #FAFAFA;
  border: 2rpx solid #E6E6E6;
  border-radius: 20rpx;
  padding: 28rpx;
  margin: 0 28rpx 20rpx;
}
.cats-section .sec-title { margin-left: -28rpx; }
.cat-item { padding: 20rpx 0; border-bottom: 2rpx solid #F0F0F0; }
.cat-item:last-child { border-bottom: none; padding-bottom: 0; }
.cat-name { display: block; font-size: 28rpx; font-weight: 600; color: #333333; margin-bottom: 12rpx; }
.cat-sub  { display: block; font-size: 26rpx; color: #666666; line-height: 1.5; }
</style>
