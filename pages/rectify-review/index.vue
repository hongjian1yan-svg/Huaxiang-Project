<template>
  <view class="page">
    <scroll-view class="scroll-body" scroll-y>
      <view class="info-card">
        <view class="sec-title info-title"><view class="sec-bar"></view><text class="sec-label">基本信息</text></view>
        <view class="field-row"><text class="f-label">商户</text><text class="f-value">{{ item.merchant }} {{ item.shop }}</text></view>
        <view class="field-row"><text class="f-label">整改要求</text><text class="f-value">{{ item.requirement }}</text></view>
      </view>

      <view v-if="tab !== 'pending' && recheckApply" class="info-card">
        <view class="sec-title info-title"><view class="sec-bar"></view><text class="sec-label">申请复检</text></view>
        <view class="field-row"><text class="f-label">提交时间</text><text class="f-value">{{ recheckApply.applyTime }}</text></view>
        <text class="att-sub-label">附件说明</text>
        <text class="remark-text">{{ recheckApply.attachmentDesc }}</text>
        <view v-if="recheckApply.rectificationPhotos.length" class="att-block">
          <text class="att-cat-label">整改照片</text>
          <view class="photo-thumb-grid">
            <view v-for="p in recheckApply.rectificationPhotos" :key="p" class="photo-thumb-item">
              <image class="photo-thumb-img" src="/static/images/uploadedImage.png" mode="aspectFill" />
            </view>
          </view>
        </view>
      </view>
      <view v-else-if="tab !== 'pending'" class="info-card">
        <view class="sec-title info-title"><view class="sec-bar"></view><text class="sec-label">申请复检</text></view>
        <text class="recheck-empty">商户尚未提交申请复检内容</text>
      </view>

      <view class="section-block">
        <text class="sec-label req-label block-title">复核结果</text>
        <view class="action-row">
          <text :class="['action-btn', reviewResult === 'pass' ? 'action-pass' : '']" @tap="setResult('pass')">复核通过</text>
          <text :class="['action-btn', reviewResult === 'reject' ? 'action-reject' : '']" @tap="setResult('reject')">复核不通过</text>
        </view>
      </view>

      <view class="section-block">
        <text class="sec-label block-title">拍摄照片</text>
        <text class="form-hint">请拍照或从相册选择（必填，相册一次最多可选9张，合计最多9张）。已上传 {{ photos.length }}/9 张。</text>
        <view class="photo-grid">
          <view v-for="(p, idx) in photos" :key="idx" class="photo-box filled">
            <image class="photo-img" src="/static/images/uploadedImage.png" mode="aspectFill" />
            <text class="photo-remove" @tap.stop="removePhoto(idx)">×</text>
          </view>
          <view v-if="photos.length < 9" class="photo-box add" @tap="pickPhotos">+</view>
        </view>
      </view>

      <view class="section-block">
        <text :class="['sec-label block-title', reviewResult === 'reject' ? 'req-label' : '']">复核意见</text>
        <view :class="['textarea-wrap', showError && reviewResult === 'reject' && !opinion.trim() ? 'textarea-error' : '']">
          <textarea class="opinion-ta" :placeholder="reviewResult === 'reject' ? '请填写复核不通过原因' : '选填'" v-model="opinion" />
        </view>
      </view>

      <view style="height: 200rpx;"></view>
    </scroll-view>

    <view class="bottom-bar">
      <button class="btn btn-outline-green" @tap="goBack">取消</button>
      <button class="btn btn-primary" @tap="submit">提交复核</button>
    </view>
  </view>
</template>

<script>
const { findRectifyItem } = require('@/utils/construction-mock.js')

export default {
  data() {
    return {
      item: {},
      tab: 'review',
      reviewResult: 'pass',
      photos: [],
      opinion: '',
      showError: false
    }
  },

  computed: {
    recheckApply() {
      const item = this.item
      const photos = item.rectificationPhotos || []
      const attachmentDesc = item.attachmentDesc || ''
      const applyTime = item.recheckApplyTime || ''
      if (!applyTime && !attachmentDesc && !photos.length) return null
      return { applyTime: applyTime || '—', attachmentDesc: attachmentDesc || '—', rectificationPhotos: photos }
    }
  },

  onLoad(options) {
    this.tab = options.tab || 'review'
    this.item = findRectifyItem(options.id || '', this.tab) || {}
  },

  methods: {
    setResult(r) { this.reviewResult = r },

    pickPhotos() {
      if (this.photos.length >= 9) {
        uni.showToast({ title: '最多上传9张', icon: 'none' })
        return
      }
      this.photos.push(`复核现场照片${this.photos.length}.jpg`)
    },

    removePhoto(idx) { this.photos.splice(idx, 1) },

    goBack() { uni.navigateBack() },

    submit() {
      if (!this.photos.length) {
        uni.showToast({ title: '请上传拍摄照片', icon: 'none' }); return
      }
      if (this.reviewResult === 'reject' && !this.opinion.trim()) {
        this.showError = true
        uni.showToast({ title: '请填写复核意见', icon: 'none' }); return
      }
      uni.showToast({ title: this.reviewResult === 'pass' ? '复核通过，已确认复工' : '复核不通过，已驳回', icon: 'success' })
      setTimeout(() => uni.navigateBack({ delta: 2 }), 1200)
    }
  }
}
</script>

<style>
.page { display: flex; flex-direction: column; height: 100vh; background: #fff; overflow: hidden; }
.scroll-body { flex: 1; overflow: hidden; }

.info-card { background: #FAFAFA; border: 2rpx solid #E6E6E6; border-radius: 20rpx; margin: 32rpx 28rpx 40rpx; padding: 20rpx 28rpx 12rpx; }
.info-title { margin-bottom: 8rpx; }
.sec-title { display: flex; align-items: center; gap: 16rpx; }
.sec-bar { width: 8rpx; height: 36rpx; background: var(--color-primary); border-radius: 0 8rpx 8rpx 0; flex-shrink: 0; }
.sec-label { font-size: 28rpx; font-weight: 600; color: var(--color-text-primary); }
.req-label::before { content: '* '; color: var(--color-danger); }

.field-row { display: flex; align-items: flex-start; padding: 12rpx 0; font-size: 26rpx; }
.f-label { width: 180rpx; flex-shrink: 0; color: #666; text-align: right; line-height: 1.5; }
.f-label::after { content: '：'; }
.f-value { color: var(--color-text-primary); text-align: left; flex: 1; line-height: 1.5; padding-left: 4rpx; }

.att-block { margin-top: 20rpx; }
.att-sub-label { display: block; font-size: 26rpx; color: #999; margin-bottom: 12rpx; }
.att-cat-label { display: block; font-size: 26rpx; font-weight: 600; color: #333; margin-bottom: 16rpx; }
.remark-text { display: block; font-size: 26rpx; color: #333; line-height: 1.7; }
.recheck-empty { display: block; font-size: 26rpx; color: #999; line-height: 1.6; }
.photo-thumb-grid { display: flex; flex-wrap: wrap; gap: 16rpx; }
.photo-thumb-item { width: 144rpx; height: 144rpx; border-radius: 16rpx; overflow: hidden; background: #f0f0f0; }
.photo-thumb-img { width: 100%; height: 100%; }

.section-block { padding: 0 28rpx; margin-bottom: 40rpx; }
.block-title { display: block; margin-bottom: 20rpx; }
.action-row { display: flex; gap: 20rpx; }
.action-btn { padding: 16rpx 52rpx 17rpx; border-radius: 10rpx; font-size: 28rpx; font-weight: 400; color: #333333; background: #F7F7F7; }
.action-pass { background: rgba(26,186,108,0.05); outline: 2rpx solid #1ABA6C; outline-offset: -2rpx; color: #1ABA6C; font-weight: 600; }
.action-reject { background: rgba(250,43,45,0.05); outline: 2rpx solid #FA2B2D; outline-offset: -2rpx; color: #FA2B2D; font-weight: 600; }

.form-hint { display: block; font-size: 24rpx; color: var(--color-text-hint); line-height: 1.6; margin-bottom: 20rpx; }
.photo-grid { display: flex; gap: 16rpx; flex-wrap: wrap; }
.photo-box { width: 144rpx; height: 144rpx; border-radius: 16rpx; overflow: hidden; position: relative; }
.photo-box.add { border: 4rpx dashed #D9D9D9; display: flex; align-items: center; justify-content: center; font-size: 56rpx; color: #D9D9D9; background: #fafafa; }
.photo-box.filled { background: #f0f0f0; }
.photo-img { width: 100%; height: 100%; }
.photo-remove { position: absolute; top: 4rpx; right: 8rpx; font-size: 32rpx; color: #fff; text-shadow: 0 0 4rpx rgba(0,0,0,0.6); }

.textarea-wrap { position: relative; border: 2rpx solid #D2D6E2; border-radius: 10rpx; padding: 20rpx; background: #FFFFFF; box-sizing: border-box; }
.textarea-error { border-color: #FA2B2D; }
.opinion-ta { width: 100%; height: 182rpx; font-size: 26rpx; color: #333333; line-height: 1.5; }

.bottom-bar { background: #fff; border-top: 2rpx solid #EDEDED; height: 180rpx; padding: 12rpx 36rpx 0; display: flex; align-items: flex-start; gap: 30rpx; box-sizing: border-box; flex-shrink: 0; }
.btn { flex: 1; height: 88rpx; border-radius: 12rpx; font-size: 32rpx; font-weight: 600; border: none; display: flex; align-items: center; justify-content: center; }
.btn-primary { background: var(--color-primary); color: #fff; }
.btn-outline-green { background: #fff; color: var(--color-primary); border: 2rpx solid var(--color-primary); }
</style>
