<template>
  <view class="page-wrap">
    <scroll-view scroll-y class="form-scroll">

      <!-- 关联装修申请 -->
      <view class="form-card form-card-first">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">关联装修申请</text></view>

        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="f-label">装修申请</text></view>
          <text class="f-val">{{ apply.merchant }} - {{ apply.shop }}（{{ apply.id }}）</text>
        </view>
        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="f-label">商户名称</text></view>
          <text class="f-val">{{ apply.merchant }}</text>
        </view>
        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="f-label">商铺号</text></view>
          <text class="f-val">{{ apply.shop }}</text>
        </view>
        <view class="form-field form-field-last">
          <view class="f-label-row"><text class="f-label">停工原因</text></view>
          <view class="stop-reason-box">{{ apply.stopReason }}</view>
        </view>
      </view>

      <!-- 申请复检说明 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">申请复检说明</text></view>
        <view class="form-field form-field-last">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">复检说明</text></view>
          <view class="remark-wrap">
            <textarea
              class="remark-ta"
              v-model="remark"
              placeholder="请说明整改完成情况，便于市场现场复验"
              placeholder-class="ph"
              maxlength="200"
              @input="remarkLen = remark.length"
            />
            <text class="remark-count">{{ remarkLen }}/200</text>
          </view>
        </view>
      </view>

      <!-- 上传整改照片 -->
      <view class="form-card form-card-last">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">上传整改照片</text></view>
        <text class="upload-rule">选填，可上传现场整改照片</text>
        <view v-if="photos.length === 0" class="upload-single" @tap="choosePhoto">
          <image class="upload-ph-img" src="/static/images/uploadedImage.png" mode="scaleToFill" />
        </view>
        <view v-else class="photo-grid">
          <view v-for="(img, i) in photos" :key="i" class="photo-thumb">
            <image :src="img" mode="aspectFill" class="photo-img" />
            <view class="photo-del" @tap.stop="photos.splice(i, 1)"><text class="del-x">×</text></view>
          </view>
          <image v-if="photos.length < 6" src="/static/images/uploadedImage.png" mode="widthFix" class="upload-img" @tap="choosePhoto" />
        </view>
      </view>

      <view style="height: 200rpx;"></view>
    </scroll-view>

    <!-- 底部提交按钮 -->
    <view class="bottom-bar">
      <button class="btn btn-primary" @tap="submit">提交复检申请</button>
    </view>
  </view>
</template>

<script>
const { findWorkStoppedApply, submitReinspect } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return {
      applyId: '',
      apply: {},
      remark: '',
      remarkLen: 0,
      photos: []
    }
  },

  onLoad(options) {
    this.applyId = options.applyId || ''
    this.apply = findWorkStoppedApply(this.applyId) || {}
  },

  methods: {
    choosePhoto() {
      if (this.photos.length >= 6) {
        uni.showToast({ title: '最多上传6张', icon: 'none' })
        return
      }
      uni.chooseMedia({
        count: 6 - this.photos.length,
        mediaType: ['image'],
        sourceType: ['camera', 'album'],
        success: (res) => {
          this.photos = [...this.photos, ...res.tempFiles.map(f => f.tempFilePath)]
        }
      })
    },

    submit() {
      if (!this.remark.trim()) {
        uni.showToast({ title: '请填写复检说明', icon: 'none' }); return
      }
      submitReinspect(this.applyId, {
        remark: this.remark.trim(),
        photos: this.photos.slice()
      })
      uni.showToast({ title: '复检申请已提交', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 1200)
    }
  }
}
</script>

<style>
.page-wrap { display: flex; flex-direction: column; height: 100vh; background: #FFFFFF; overflow: hidden; }
.form-scroll { flex: 1; overflow: hidden; }

.form-card { background: #FFFFFF; padding: 0 36rpx; margin-bottom: 40rpx; }
.form-card-first { margin-top: 32rpx; }
.form-card-last { margin-bottom: 0; }

.form-field { margin-bottom: 40rpx; }
.form-field-last { margin-bottom: 0; }
.form-field-info { border-bottom: 2rpx solid #F0F0F0; }
.f-label-row { display: flex; align-items: flex-start; margin-bottom: 24rpx; }
.f-label { font-size: 28rpx; font-weight: 500; color: #333333; }
.req { color: var(--color-danger); margin-right: 4rpx; font-size: 28rpx; }
.f-val { display: block; font-size: 24rpx; color: #666666; padding: 0 0 12rpx; line-height: 1.5; }

.stop-reason-box {
  background: rgba(250,43,45,0.05);
  border: 2rpx solid #FFCCC7;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 26rpx;
  color: var(--color-danger);
  line-height: 1.5;
  box-sizing: border-box;
}

.remark-wrap { position: relative; background: #fff; border: 2rpx solid #D2D6E2; border-radius: 12rpx; padding: 20rpx; box-sizing: border-box; }
.remark-ta { width: 100%; height: 182rpx; font-size: 26rpx; color: #333333; line-height: 1.5; background: transparent; }
.remark-count { position: absolute; bottom: 16rpx; right: 20rpx; font-size: 22rpx; color: #CCCCCC; }
.ph { color: #999999; }

.upload-rule { display: block; font-size: 22rpx; color: #999999; margin-bottom: 20rpx; }
.upload-single { width: 320rpx; height: 270rpx; border-radius: 16rpx; overflow: hidden; display: block; }
.upload-ph-img { width: 100%; height: 100%; display: block; }
.upload-img { width: 320rpx; height: 270rpx; display: block; border-radius: 16rpx; }
.photo-grid { display: flex; flex-wrap: wrap; gap: 16rpx; }
.photo-thumb { position: relative; width: 320rpx; height: 270rpx; border-radius: 16rpx; overflow: hidden; flex-shrink: 0; background: #f0f0f0; }
.photo-img { width: 100%; height: 100%; }
.photo-del { position: absolute; top: 8rpx; right: 8rpx; width: 44rpx; height: 44rpx; background: rgba(0,0,0,0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.del-x { color: #fff; font-size: 30rpx; line-height: 1; }

.bottom-bar { position: fixed; left: 0; right: 0; bottom: 0; padding: 20rpx 28rpx calc(20rpx + env(safe-area-inset-bottom)); background: #FFFFFF; border-top: 2rpx solid #EDEDED; }
.btn { display: flex; align-items: center; justify-content: center; height: 88rpx; border-radius: 44rpx; font-size: 30rpx; font-weight: 600; border: none; width: 100%; }
.btn-primary { background: var(--color-primary); color: #fff; }
</style>
