<template>
  <view class="page">
    <scroll-view class="scroll-body" scroll-y>

      <!-- 延期申请信息（信息卡片，规范第二节） -->
      <view class="info-card">
        <view class="sec-title info-title"><view class="sec-bar"></view><text class="sec-label">延期申请信息</text></view>
        <view class="detail-row"><text class="detail-label">延期编号</text><text class="detail-value">{{ id }}</text></view>
        <view class="detail-row"><text class="detail-label">关联申请</text><text class="detail-value">{{ applyId }}</text></view>
        <view class="detail-row"><text class="detail-label">商铺号</text><text class="detail-value">{{ shop }}</text></view>
        <view class="detail-row"><text class="detail-label">商户名称</text><text class="detail-value">{{ merchant }}</text></view>
        <view class="detail-row"><text class="detail-label">原完工日期</text><text class="detail-value">{{ originalEnd }}</text></view>
        <view class="detail-row"><text class="detail-label">申请延至</text><text class="detail-value">{{ delayTo }}</text></view>
        <view class="detail-row"><text class="detail-label">延期天数</text><text class="detail-value">{{ days }}天</text></view>
        <view class="detail-row"><text class="detail-label">延期原因</text><text class="detail-value">{{ reason }}</text></view>
      </view>

      <!-- 审核操作（规范第五节：自然宽度，不撑满） -->
      <view class="section-block">
        <text class="sec-label req-label block-title">审核操作</text>
        <view class="action-row">
          <view
            :class="['action-btn', reviewAction === 'pass' ? 'action-pass' : '', reviewAction === 'reject' ? '' : '']"
            @tap="reviewAction = 'pass'"
          >审核通过</view>
          <view
            :class="['action-btn', reviewAction === 'reject' ? 'action-reject' : '']"
            @tap="reviewAction = 'reject'"
          >审核驳回</view>
        </view>
      </view>

      <!-- 审核意见 / 驳回原因（规范第四节） -->
      <view class="section-block">
        <text :class="['sec-label block-title', reviewAction === 'reject' ? 'req-label' : '']">
          {{ reviewAction === 'reject' ? '驳回原因' : '审核意见' }}
        </text>
        <view :class="['textarea-wrap', showError && reviewAction === 'reject' && !opinion.trim() ? 'textarea-error' : '']">
          <textarea
            class="opinion-ta"
            :placeholder="reviewAction === 'reject' ? '请输入驳回原因（必填）' : '请输入审核意见（选填）'"
            placeholder-style="color:#999999;font-size:26rpx;font-weight:400;font-family:PingFang SC;"
            v-model="opinion"
            :maxlength="200"
          />
          <text class="char-count">{{ opinion.length }}/200</text>
        </view>
      </view>

      <view style="height:200rpx;"></view>
    </scroll-view>

    <view class="bottom-bar">
      <button class="btn btn-primary" @tap="submit">确认</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: '', applyId: '', shop: '', merchant: '',
      originalEnd: '', delayTo: '', days: '', reason: '',
      reviewAction: '',
      opinion: '',
      showError: false
    }
  },

  onLoad(options) {
    this.id          = decodeURIComponent(options.id || '')
    this.applyId     = decodeURIComponent(options.applyId || '')
    this.shop        = decodeURIComponent(options.shop || '')
    this.merchant    = decodeURIComponent(options.merchant || '')
    this.originalEnd = decodeURIComponent(options.originalEnd || '')
    this.delayTo     = decodeURIComponent(options.delayTo || '')
    this.days        = options.days || ''
    this.reason      = decodeURIComponent(options.reason || '')
  },

  methods: {
    goBack() { uni.navigateBack() },

    submit() {
      if (!this.reviewAction) {
        uni.showToast({ title: '请选择审核操作', icon: 'none' }); return
      }
      if (this.reviewAction === 'reject' && !this.opinion.trim()) {
        this.showError = true
        uni.showToast({ title: '请输入驳回原因', icon: 'none' }); return
      }
      uni.showToast({ title: this.reviewAction === 'pass' ? '延期审核通过' : '延期审核驳回', icon: 'success' })
      setTimeout(() => uni.navigateBack({ delta: 2 }), 1500)
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
.scroll-body { flex: 1; overflow: hidden; }

/* ── 信息卡片（规范§2） ── */
.info-card {
  background: #FAFAFA;
  border: 2rpx solid #E6E6E6;
  border-radius: 20rpx;
  margin: 32rpx 28rpx 40rpx;
  padding: 20rpx 28rpx 12rpx;
}
.info-title { margin-bottom: 8rpx; }

/* ── section 模块块（规范§3.1/4.1） ── */
.section-block {
  padding: 0 28rpx;
  margin-bottom: 40rpx;
}
.block-title {
  display: block;
  margin-bottom: 20rpx;
}

/* ── 审核操作按钮（规范§5） ── */
.action-row { display: flex; gap: 20rpx; }
.action-btn {
  padding: 16rpx 52rpx 17rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #333333;
  background: #F7F7F7;
  border: none;
  font-family: PingFang SC, sans-serif;
}
.action-pass {
  background: rgba(26,186,108,0.05);
  outline: 1rpx solid #1ABA6C;
  outline-offset: -1rpx;
  color: #1ABA6C;
  font-weight: 600;
}
.action-reject {
  background: rgba(250,43,45,0.05);
  outline: 1rpx solid #FA2B2D;
  outline-offset: -1rpx;
  color: #FA2B2D;
  font-weight: 600;
}

/* ── 意见输入框（规范§4） ── */
.textarea-wrap {
  position: relative;
  border: 2rpx solid #D2D6E2;
  border-radius: 10rpx;
  padding: 20rpx;
  background: #FFFFFF;
  margin-top: 20rpx;
  box-sizing: border-box;
}
.textarea-error { border-color: #FA2B2D; }
.opinion-ta {
  width: 100%;
  height: 182rpx;
  font-size: 26rpx;
  color: #333333;
  line-height: 1.5;
  background: transparent;
}
.char-count {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
  font-size: 24rpx;
  color: #CCCCCC;
}
</style>
