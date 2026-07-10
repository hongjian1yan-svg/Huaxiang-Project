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
          <text class="detail-label">商户名称</text>
          <text class="detail-value">{{ merchantName || '北京拿铁旧机动车经纪有限公司' }}</text>
        </view>
        <view class="detail-row">
          <text class="detail-label">商铺号</text>
          <text class="detail-value">{{ shopNo || 'B08' }}</text>
        </view>
        <view class="detail-row">
          <text class="detail-label">联系人</text>
          <text class="detail-value">{{ contact || '王经理 138****1234' }}</text>
        </view>
      </view>

      <!-- 审核操作（必填） -->
      <view class="section-block">
        <view class="sec-title">
          <text class="sec-label req-label">审核操作</text>
        </view>
        <view class="action-row">
          <view :class="['action-btn', { 'action-pass': reviewAction === 'pass' }]" @tap="reviewAction = 'pass'">审核通过</view>
          <view :class="['action-btn', { 'action-reject': reviewAction === 'reject' }]" @tap="reviewAction = 'reject'">审核驳回</view>
        </view>
      </view>

      <!-- 审核意见 / 驳回原因（随审核操作动态切换） -->
      <view class="section-block">
        <view class="sec-title">
          <text :class="['sec-label', { 'req-label': reviewAction === 'reject' }]">
            {{ reviewAction === 'reject' ? '驳回原因' : '审核意见' }}
          </text>
        </view>
        <view :class="['textarea-wrap', { 'textarea-error': showError && reviewAction === 'reject' && !opinion.trim() }]">
          <textarea
            class="opinion-textarea"
            :placeholder="reviewAction === 'reject' ? '请输入驳回原因（必填）' : '请输入审核意见（选填）'"
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

      <!-- 加签审批角色（选"是"后展开，可多选） -->
      <view v-if="needSign === 'yes'" class="section-block">
        <view class="sec-title">
          <text class="sec-label req-label">加签审批角色</text>
        </view>
        <view class="action-row">
          <view :class="['action-btn', { 'action-pass': signRoles.includes('deputy') }]" @tap="toggleSignRole('deputy')">副总</view>
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
      merchantName: '',
      shopNo: '',
      contact: '',
      reviewAction: '',
      opinion: '',
      showError: false,
      needSign: '',
      signRoles: []
    }
  },

  onLoad(options) {
    this.from         = options.from || 'detail'
    this.merchantName = decodeURIComponent(options.merchantName || '')
    this.shopNo       = decodeURIComponent(options.shopNo       || '')
    this.contact      = decodeURIComponent(options.contact      || '')
  },

  methods: {
    toggleSignRole(role) {
      const idx = this.signRoles.indexOf(role)
      if (idx === -1) {
        this.signRoles.push(role)
      } else {
        this.signRoles.splice(idx, 1)
      }
    },

    submit() {
      if (!this.reviewAction) {
        uni.showToast({ title: '请选择审核操作', icon: 'none' })
        return
      }
      if (this.reviewAction === 'reject' && !this.opinion.trim()) {
        this.showError = true
        uni.showToast({ title: '请输入驳回原因', icon: 'none' })
        return
      }
      if (this.needSign === 'yes' && this.signRoles.length === 0) {
        uni.showToast({ title: '请选择加签审批角色', icon: 'none' })
        return
      }
      const title = this.reviewAction === 'pass' ? '审核通过' : '审核驳回'
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
.info-sec-title {
  margin-bottom: 8rpx;
}
.info-card .detail-label,
.info-card .detail-value {
  line-height: 36rpx;
}

/* 审核操作 / 审核意见 区块 */
.section-block {
  padding: 0 28rpx;
  margin-top: 40rpx;
}

/* 审核操作选择按钮 */
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

/* 审核意见输入框 */
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
