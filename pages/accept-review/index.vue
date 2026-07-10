<template>
  <view class="page">
    <scroll-view class="scroll-body" scroll-y>

      <!-- 验收对象 -->
      <view class="info-card">
        <view class="sec-title info-title"><view class="sec-bar"></view><text class="sec-label">验收对象</text></view>
        <view class="detail-row"><text class="detail-label">验收编号</text><text class="detail-value">{{ id }}</text></view>
        <view class="detail-row"><text class="detail-label">商户</text><text class="detail-value">{{ merchant }} · {{ shop }}</text></view>
        <view class="detail-row"><text class="detail-label">装修类目</text><text class="detail-value">{{ categories }}</text></view>
      </view>

      <!-- 验收操作 -->
      <view class="section-block">
        <text class="sec-label req-label block-title">验收操作</text>
        <view class="action-row">
          <view :class="['action-btn', reviewAction === 'pass' ? 'action-pass' : '']" @tap="reviewAction = 'pass'">验收通过</view>
          <view :class="['action-btn', reviewAction === 'reject' ? 'action-reject' : '']" @tap="reviewAction = 'reject'">验收驳回</view>
        </view>
      </view>

      <!-- 验收意见 / 驳回原因 -->
      <view class="section-block">
        <view class="opinion-title-row">
          <text v-if="reviewAction === 'reject'" class="req-star">*</text>
          <text class="block-title">{{ reviewAction === 'reject' ? '驳回原因' : '验收意见' }}</text>
        </view>
        <view :class="['textarea-wrap', showError && reviewAction === 'reject' && !opinion.trim() ? 'textarea-error' : '']">
          <textarea
            class="opinion-ta"
            :placeholder="reviewAction === 'reject' ? '请输入驳回原因（必填）' : '请输入验收意见（选填）'"
            placeholder-style="color:#CCCCCC;font-size:26rpx;"
            v-model="opinion" :maxlength="200"
          />
          <text class="char-count">{{ opinion.length }}/200</text>
        </view>
      </view>

      <view style="height: 200rpx;"></view>
    </scroll-view>

    <view class="bottom-bar">
      <button class="btn btn-outline-green" @tap="cancel">取消</button>
      <button class="btn btn-primary" @tap="submit">提交验收</button>
    </view>
  </view>

  <!-- 提交结果弹窗 -->
  <view v-if="showResultModal" class="modal-overlay">
    <view class="dialog-card" @tap.stop>
      <view class="dialog-body">
        <text class="dialog-body-text">{{ resultMessage }}</text>
      </view>
      <view class="dialog-footer">
        <button class="btn btn-primary" @tap="confirmResult">确定</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: '', applyId: '', shop: '', merchant: '', categories: '',
      reviewAction: 'pass', opinion: '', showError: false,
      showResultModal: false, resultMessage: ''
    }
  },

  onLoad(options) {
    this.id         = decodeURIComponent(options.id || '')
    this.applyId    = decodeURIComponent(options.applyId || '')
    this.shop       = decodeURIComponent(options.shop || '')
    this.merchant   = decodeURIComponent(options.merchant || '')
    this.categories = decodeURIComponent(options.categories || '')
    uni.setNavigationBarTitle({ title: '验收审核' })
  },

  methods: {
    cancel() { uni.navigateBack() },

    submit() {
      if (this.reviewAction === 'reject' && !this.opinion.trim()) {
        this.showError = true
        uni.showToast({ title: '请输入驳回原因', icon: 'none' })
        return
      }
      this.resultMessage = this.reviewAction === 'pass'
        ? '市场经营部踏勘审核通过，已流转至其他责任部门。'
        : '验收踏勘已驳回，已通知商户整改。'
      this.showResultModal = true
    },

    confirmResult() {
      this.showResultModal = false
      uni.navigateBack({ delta: 2 })
    }
  }
}
</script>

<style>
.page { display: flex; flex-direction: column; height: 100vh; background: #FFFFFF; overflow: hidden; }
.scroll-body { flex: 1; overflow: hidden; }
.info-card { background: #FAFAFA; border-radius: 20rpx; border: 2rpx solid #E6E6E6; margin: 32rpx 28rpx 40rpx; padding: 20rpx 28rpx 12rpx; }
.info-title { margin-bottom: 8rpx; }
.sec-title { display: flex; align-items: center; gap: 12rpx; }
.sec-bar { width: 8rpx; height: 36rpx; background: var(--color-primary); border-radius: 0 8rpx 8rpx 0; flex-shrink: 0; }
.sec-label { font-size: 28rpx; font-weight: 600; color: #333333; }
.req-label::before { content: '* '; color: var(--color-danger); }

.detail-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 12rpx 0; font-size: 26rpx; }
.detail-label { color: #999999; flex-shrink: 0; margin-right: 20rpx; }
.detail-value { color: #333333; text-align: right; flex: 1; line-height: 1.5; }

.section-block { padding: 0 28rpx; margin-bottom: 40rpx; }
.opinion-title-row { display: flex; align-items: center; gap: 4rpx; margin-bottom: 20rpx; }
.req-star { font-size: 28rpx; font-weight: 600; color: #FA2B2D; line-height: 1; }
.block-title { display: block; margin-bottom: 20rpx; }
.opinion-title-row .block-title { margin-bottom: 0; }

.action-row { display: flex; gap: 20rpx; }
.action-btn { padding: 16rpx 52rpx 17rpx; border-radius: 10rpx; font-size: 28rpx; font-weight: 400; color: #333333; background: #F7F7F7; border: none; font-family: 'PingFang SC', sans-serif; }
.action-pass   { background: rgba(26,186,108,0.05); outline: 1rpx solid #1ABA6C; outline-offset: -1rpx; color: #1ABA6C; font-weight: 600; }
.action-reject { background: rgba(250,43,45,0.05);  outline: 1rpx solid #FA2B2D; outline-offset: -1rpx; color: #FA2B2D; font-weight: 600; }

.textarea-wrap { position: relative; border: 2rpx solid #D2D6E2; border-radius: 10rpx; padding: 20rpx; background: #FFFFFF; margin-top: 20rpx; box-sizing: border-box; }
.textarea-error { border-color: #FA2B2D; }
.opinion-ta { width: 100%; height: 182rpx; font-size: 26rpx; color: #333333; line-height: 1.5; background: transparent; }
.char-count { position: absolute; bottom: 20rpx; right: 20rpx; font-size: 24rpx; color: #CCCCCC; }

.bottom-bar { position: fixed; left: 0; right: 0; bottom: 0; display: flex; gap: 30rpx; padding: 12rpx 36rpx env(safe-area-inset-bottom); background: #FFFFFF; border-top: 1rpx solid #EDEDED; }
.btn { flex: 1; height: 88rpx; border-radius: 12rpx; font-size: 32rpx; font-family: PingFang SC; border: none; display: flex; align-items: center; justify-content: center; }
.btn-primary { background: var(--color-primary); color: #FFFFFF; font-weight: 600; }
.btn-outline-green { background: #FFFFFF; color: var(--color-primary); border: 1rpx solid var(--color-primary); font-weight: 400; }

/* 提交结果弹窗 */
.dialog-body-text { font-size: 28rpx; color: #333333; line-height: 1.6; text-align: center; }
</style>
