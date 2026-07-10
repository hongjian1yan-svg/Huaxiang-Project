<template>
  <view class="page">
    <scroll-view class="scroll-body" scroll-y>

      <!-- 基本信息 -->
      <view class="info-card">
        <view class="sec-title info-sec-title">
          <view class="sec-bar"></view>
          <text class="sec-label">基本信息</text>
        </view>
        <view class="detail-row">
          <text class="detail-label">申请编号</text>
          <text class="detail-value">{{ applyNo || '—' }}</text>
        </view>
        <view class="detail-row">
          <text class="detail-label">商铺号</text>
          <text class="detail-value">{{ shopNo || '—' }}</text>
        </view>
        <view class="detail-row">
          <text class="detail-label">商户名称</text>
          <text class="detail-value">{{ merchantName || '—' }}</text>
        </view>
        <view class="detail-row">
          <text class="detail-label">当前环节</text>
          <text class="detail-value">{{ currentStep || '—' }}</text>
        </view>
      </view>

      <!-- 当前施工中商户数（独立信息条） -->
      <view class="count-card">
        <view class="detail-row">
          <text class="detail-label">当前施工中商户数</text>
          <text class="detail-value count-bold">{{ underConstructionCount }}</text>
        </view>
      </view>

      <!-- 审批操作（必填） -->
      <view class="section-block">
        <view class="sec-title">
          <text class="sec-label req-label">审批操作</text>
        </view>
        <view class="action-row">
          <view :class="['action-btn', { 'action-pass': approvalAction === 'pass' }]" @tap="approvalAction = 'pass'">审批通过</view>
          <view :class="['action-btn', { 'action-reject': approvalAction === 'reject' }]" @tap="approvalAction = 'reject'">审批驳回</view>
        </view>
      </view>

      <!-- 审批意见 / 驳回原因（随操作动态切换） -->
      <view class="section-block">
        <view class="sec-title">
          <text :class="['sec-label', { 'req-label': approvalAction === 'reject' }]">
            {{ approvalAction === 'reject' ? '驳回原因' : '审批意见' }}
          </text>
        </view>
        <view :class="['textarea-wrap', { 'textarea-error': showError && approvalAction === 'reject' && !opinion.trim() }]">
          <textarea
            class="opinion-textarea"
            :placeholder="approvalAction === 'reject' ? '请输入驳回原因（必填）' : '请输入审批意见（选填）'"
            placeholder-style="color: #CCCCCC; font-size: 26rpx; font-weight: 400; font-family: PingFang SC;"
            v-model="opinion"
            :maxlength="200"
          />
          <text class="char-count">{{ opinion.length }}/200</text>
        </view>
      </view>

      <!-- 是否加签 -->
      <view class="section-block">
        <view class="sec-title">
          <text class="sec-label">是否加签</text>
        </view>
        <view class="action-row">
          <view :class="['action-btn', { 'action-pass': needSign === 'no' }]" @tap="needSign = 'no'">否</view>
          <view :class="['action-btn', { 'action-pass': needSign === 'yes' }]" @tap="needSign = 'yes'">是</view>
        </view>
      </view>

      <!-- 加签审批角色（选"是"后展开，必填） -->
      <view v-if="needSign === 'yes'" class="section-block">
        <view class="sec-title">
          <text class="sec-label req-label">加签审批角色</text>
        </view>
        <view class="action-row">
          <view :class="['action-btn', { 'action-pass': signRoles.includes('general') }]" @tap="toggleSignRole('general')">总经理</view>
        </view>
      </view>

    </scroll-view>
  </view>

  <!-- 底部确认按钮 -->
  <view class="bottom-bar">
    <button class="btn btn-primary" @tap="submit">确认</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      from: '',
      applyNo: '',
      shopNo: '',
      merchantName: '',
      currentStep: '',
      approvalAction: '',
      opinion: '',
      showError: false,
      underConstructionCount: 2,
      needSign: '',
      signRoles: []
    }
  },

  onLoad(options) {
    this.from         = options.from         || 'detail'
    this.applyNo      = decodeURIComponent(options.applyNo      || '')
    this.shopNo       = decodeURIComponent(options.shopNo       || '')
    this.merchantName = decodeURIComponent(options.merchantName || '')
    this.currentStep  = decodeURIComponent(options.currentStep  || '')
  },

  methods: {
    toggleSignRole(role) {
      const idx = this.signRoles.indexOf(role)
      if (idx === -1) { this.signRoles.push(role) } else { this.signRoles.splice(idx, 1) }
    },

    submit() {
      if (!this.approvalAction) {
        uni.showToast({ title: '请选择审批操作', icon: 'none' })
        return
      }
      if (this.approvalAction === 'reject' && !this.opinion.trim()) {
        this.showError = true
        uni.showToast({ title: '请输入驳回原因', icon: 'none' })
        return
      }
      if (this.needSign === 'yes' && this.signRoles.length === 0) {
        uni.showToast({ title: '请选择加签审批角色', icon: 'none' })
        return
      }
      const title = this.approvalAction === 'pass' ? '审批通过' : '审批驳回'
      const delta = this.from === 'list' ? 1 : 2
      uni.showToast({
        title,
        icon: 'success',
        success: () => {
          setTimeout(() => uni.navigateBack({ delta }), 1500)
        }
      })
    }
  }
}
</script>

<style>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #FFFFFF;
  overflow: hidden;
}
.scroll-body {
  flex: 1;
  padding-bottom: 200rpx;
}

/* 基本信息卡片 */
.info-card {
  background: #FAFAFA;
  border-radius: 20rpx;
  border: 2rpx solid #E6E6E6;
  margin: 32rpx 28rpx 0;
  padding: 20rpx 28rpx 12rpx;
}
.info-sec-title { margin-bottom: 8rpx; }
.info-card .detail-label,
.info-card .detail-value { line-height: 36rpx; }
.info-card .detail-label { white-space: nowrap; }

/* 当前施工中商户数独立条 */
.count-card {
  background: rgba(26, 186, 108, 0.05);
  border-radius: 20rpx;
  border: 2rpx solid #1ABA6C;
  margin: 16rpx 28rpx 0;
  padding: 0 28rpx;
}
.count-card .detail-label { white-space: nowrap; color: #333333; }
.count-bold { font-weight: 600; color: #1ABA6C; }

/* 审批操作 / 意见 区块 */
.section-block {
  padding: 0 28rpx;
  margin-top: 40rpx;
}

/* 审批操作选择按钮 */
.action-row { display: flex; gap: 20rpx; }
.action-btn {
  padding: 16rpx 52rpx 17rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  font-weight: 400;
  text-align: center;
  background: #F7F7F7;
  color: #333333;
}
.action-pass {
  background: rgba(26, 186, 108, 0.05);
  outline: 1rpx solid #1ABA6C;
  outline-offset: -1rpx;
  color: #1ABA6C;
  font-weight: 600;
}
.action-reject {
  background: rgba(250, 43, 45, 0.05);
  outline: 1rpx solid #FA2B2D;
  outline-offset: -1rpx;
  color: #FA2B2D;
  font-weight: 600;
}

/* 意见/原因输入框 */
.textarea-wrap {
  position: relative;
  height: 182rpx;
  background: #FFFFFF;
  border-radius: 10rpx;
  border: 2rpx solid #D2D6E2;
  padding: 20rpx;
  box-sizing: border-box;
  margin-top: 20rpx;
}
.textarea-error { border-color: #FA2B2D; }
.opinion-textarea {
  width: 100%;
  height: 100%;
  font-size: 26rpx;
  color: #333333;
  line-height: 1.5;
  box-sizing: border-box;
}
.char-count {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
  font-size: 24rpx;
  color: #CCCCCC;
}
</style>
