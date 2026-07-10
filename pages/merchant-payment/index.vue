<template>
  <view class="page-wrap">
    <scroll-view scroll-y class="form-scroll">
      <view class="content">

        <!-- 缴费信息标题（绿色装饰条，左侧无内边距） -->
        <view class="sec-title pay-hd">
          <view class="sec-bar"></view>
          <text class="sec-label">缴费信息</text>
        </view>

        <!-- 实际缴费日期（参照联系电话模块：info-field 下划线风格） -->
        <view class="form-field form-field-info">
          <view class="f-label-row">
            <text class="req">*</text>
            <text class="f-label">实际缴费日期</text>
          </view>
          <picker mode="date" :value="paymentDate" @change="paymentDate = $event.detail.value">
            <view class="date-row">
              <text :style="{ color: paymentDate ? '#000000' : '#999999', fontSize: '24rpx' }">{{ paymentDate || '选择缴费日期' }}</text>
              <image class="date-arrow" src="/static/images/jiantou.png" mode="scaleToFill" />
            </view>
          </picker>
        </view>

        <!-- 缴费方式 -->
        <view class="form-field">
          <view class="f-label-row">
            <text class="req">*</text>
            <text class="f-label">缴费方式</text>
          </view>
          <view class="pay-methods">
            <view
              v-for="m in payMethods"
              :key="m"
              :class="['pay-method', { 'pay-method-active': paymentMethod === m }]"
              @tap="paymentMethod = m"
            >{{ m }}</view>
          </view>
        </view>

        <!-- 缴费凭证 -->
        <view class="form-field">
          <view class="f-label-row">
            <text class="req">*</text>
            <text class="f-label">缴费凭证</text>
          </view>
          <view v-if="!voucherFile" class="upload-single" @tap="onUpload">
            <image class="upload-ph-img" src="/static/images/shangchuan.png" mode="scaleToFill" />
          </view>
          <view v-else class="upload-done-wrap">
            <image class="upload-done-img" src="/static/images/uploadedImage.png" mode="aspectFill" />
            <text class="upload-done-del" @tap.stop="voucherFile = ''">×</text>
          </view>
          <text class="upload-rule">支持 JPG、PNG、PDF 格式，单文件不超过 10MB</text>
        </view>

        <!-- 备注 -->
        <view class="form-field form-field-last">
          <text class="f-label">备注</text>
          <view class="remark-wrap">
            <textarea
              class="remark-ta"
              v-model="remark"
              placeholder="请输入备注（选填）"
              placeholder-class="ph"
              maxlength="200"
              @input="remarkLen = remark.length"
            />
            <text class="remark-count">{{ remarkLen }}/200</text>
          </view>
        </view>

      </view>
      <view style="height: 200rpx;"></view>
    </scroll-view>

    <view class="bottom-bar">
      <button class="btn btn-primary" @tap="onSubmit">提交</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      itemId: '',
      paymentDate: '',
      paymentMethod: '',
      payMethods: ['银行转账', '现金', '微信支付', '支付宝', 'POS机'],
      voucherFile: '',
      remark: '',
      remarkLen: 0
    }
  },

  onLoad(options) {
    this.itemId = decodeURIComponent(options.itemId || '')
    uni.setNavigationBarTitle({ title: '缴费信息填写' })
  },

  methods: {
    onUpload() {
      this.voucherFile = '缴费凭证.jpg'
    },

    onSubmit() {
      if (!this.paymentDate) {
        uni.showToast({ title: '请选择实际缴费日期', icon: 'none' }); return
      }
      if (!this.paymentMethod) {
        uni.showToast({ title: '请选择缴费方式', icon: 'none' }); return
      }
      if (!this.voucherFile) {
        uni.showToast({ title: '请上传缴费凭证', icon: 'none' }); return
      }
      uni.showToast({
        title: '缴费凭证已提交',
        icon: 'success',
        success: () => {
          setTimeout(() => uni.navigateBack({ delta: 2 }), 1500)
        }
      })
    }
  }
}
</script>

<style>
.page-wrap {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #FFFFFF;
  overflow: hidden;
}
.form-scroll { flex: 1; overflow: hidden; }

/* 内容区（标准页面左右边距） */
.content { padding: 0 28rpx; }

/* 缴费信息标题（绿色竖条贴左边缘，抵消 content 的 28rpx padding） */
.pay-hd { margin-top: 40rpx; margin-bottom: 32rpx; margin-left: -28rpx; }

/* 字段通用 */
.form-field { margin-bottom: 40rpx; }
.form-field-last { margin-bottom: 0; }
.form-field-info { border-bottom: 2rpx solid #F0F0F0; }

.f-label-row { display: flex; align-items: flex-start; }
.f-label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 24rpx;
}
.req { color: var(--color-danger); margin-right: 4rpx; font-size: 28rpx; }

/* 日期 picker 行 */
.date-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 12rpx;
}
.date-arrow {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

/* 缴费方式 */
.pay-methods { display: flex; flex-wrap: wrap; gap: 16rpx; }
.pay-method {
  padding: 16rpx 32rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #F7F7F7;
  color: var(--color-text-secondary);
  border: 2rpx solid transparent;
}
.pay-method-active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

/* 上传 */
.upload-single { width: 320rpx; height: 270rpx; border-radius: 16rpx; overflow: hidden; display: block; }
.upload-ph-img { width: 100%; height: 100%; display: block; }
.upload-rule { display: block; font-size: 22rpx; color: var(--color-text-hint); margin-top: 12rpx; }
.upload-done-wrap { position: relative; width: 320rpx; height: 270rpx; }
.upload-done-img  { width: 320rpx; height: 270rpx; border-radius: 16rpx; display: block; }
.upload-done-del  {
  position: absolute; top: 8rpx; right: 8rpx;
  width: 44rpx; height: 44rpx; border-radius: 50%;
  background: rgba(0,0,0,0.4); color: #FFFFFF;
  font-size: 28rpx; line-height: 44rpx; text-align: center;
}

/* 备注 */
.remark-wrap {
  position: relative;
  border: 2rpx solid var(--color-border);
  border-radius: 12rpx;
  padding: 20rpx;
  box-sizing: border-box;
}
.remark-ta {
  width: 100%;
  height: 182rpx;
  font-size: 26rpx;
  color: var(--color-text-primary);
  line-height: 1.5;
  background: transparent;
}
.remark-count {
  position: absolute; bottom: 16rpx; right: 20rpx;
  font-size: 22rpx; color: var(--color-text-hint);
}
.ph { color: #999999; }
</style>
