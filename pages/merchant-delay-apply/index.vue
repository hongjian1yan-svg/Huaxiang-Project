<template>
  <view class="page-wrap">
    <scroll-view scroll-y class="form-scroll">

      <!-- 申请信息 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">申请信息</text></view>

        <!-- 选择装修申请：margin-bottom 由下方 field-hint 统一控制 -->
        <view class="form-field form-field-info" style="margin-bottom: 0;">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">选择装修申请</text></view>
          <picker :range="applyOptions" range-key="label" @change="onApplyChange">
            <view class="date-row">
              <text :style="{ color: selectedApply ? '#000000' : '#999999', fontSize: '24rpx' }">
                {{ selectedApply ? selectedApply.label : '请选择装修申请' }}
              </text>
              <image class="date-arrow" src="/static/images/jiantou.png" mode="scaleToFill" />
            </view>
          </picker>
        </view>
        <!-- 提示文字在下划线下方 -->
        <text class="field-hint">仅可选择施工中且未提交延期申请的装修申请</text>

        <!-- 当前完工时间（只读） -->
        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="f-label">当前完工时间</text></view>
          <text class="f-val">{{ selectedApply ? selectedApply.currentEnd : defaultCurrentEnd }}</text>
        </view>

        <!-- 申请延至日期 -->
        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">申请延至日期</text></view>
          <picker mode="date" :value="delayTo" @change="onDelayToChange">
            <view class="date-row">
              <text :style="{ color: delayTo ? '#000000' : '#999999', fontSize: '24rpx' }">
                {{ delayTo || '选择延至日期' }}
              </text>
              <image class="date-arrow" src="/static/images/jiantou.png" mode="scaleToFill" />
            </view>
          </picker>
        </view>

        <!-- 延期天数（只读，自动计算） -->
        <view class="form-field form-field-last form-field-info">
          <view class="f-label-row"><text class="f-label">延期天数</text></view>
          <text class="f-val">{{ delayDays !== null ? delayDays + '天' : '—' }}</text>
        </view>
      </view>

      <!-- 延期原因 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">延期原因</text></view>
        <view class="form-field form-field-last">
          <view class="remark-wrap">
            <textarea
              class="remark-ta"
              v-model="reason"
              placeholder="请输入延期原因"
              placeholder-class="ph"
              maxlength="200"
              @input="reasonLen = reason.length"
            />
            <text class="remark-count">{{ reasonLen }}/200</text>
          </view>
        </view>
      </view>

      <!-- 附件 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">附件</text></view>
        <view class="form-field form-field-last">
          <!-- 占位图始终在上方，未达上限时可继续上传 -->
          <view v-if="attachFiles.length < 3" class="upload-single" @tap="onUpload">
            <image class="upload-ph-img" src="/static/images/shangchuan.png" mode="scaleToFill" />
          </view>
          <!-- 已上传文件列表（file-row 格式） -->
          <view v-for="(f, i) in attachFiles" :key="i" class="file-row">
            <image class="file-icon" :src="isImage(f)?'/static/images/icon-file-img.png':'/static/images/icon-file-pdf.png'" mode="aspectFit" />
            <text class="file-name">{{ f }}</text>
            <image class="file-del-icon" src="/static/images/shanchu.png" mode="scaleToFill" @tap.stop="attachFiles.splice(i,1)" />
          </view>
          <text class="upload-rule">支持 JPG、PNG、PDF 格式，单文件不超过 10MB，最多上传 3 个</text>
        </view>
      </view>

      <view style="height: 200rpx;"></view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <button class="btn btn-primary" @tap="onSubmit">提交延期申请</button>
    </view>
  </view>
</template>

<script>
const { MERCHANT_UNDER_CONSTRUCTION_LIST, getDelayEligibleApply } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return {
      applyOptions: [],
      selectedApply: null,
      defaultCurrentEnd: '2026-06-30',
      delayTo: '',
      delayDays: null,
      reason: '',
      reasonLen: 0,
      attachFiles: []
    }
  },

  onLoad(options) {
    this.applyOptions = MERCHANT_UNDER_CONSTRUCTION_LIST.map(a => ({
      ...a,
      label: a.merchant + ' - ' + a.shop + '（' + a.id + '）'
    }))

    const applyId = options.applyId || ''
    if (applyId) {
      let apply = this.applyOptions.find(a => a.id === applyId)
      if (!apply) {
        const found = getDelayEligibleApply(applyId)
        if (found) {
          apply = { ...found, label: found.merchant + ' - ' + found.shop + '（' + found.id + '）' }
          this.applyOptions = [...this.applyOptions, apply]
        }
      }
      if (apply) {
        this.selectedApply = apply
        this._calcDays()
      }
    }
  },

  methods: {
    onApplyChange(e) {
      this.selectedApply = this.applyOptions[e.detail.value]
      this._calcDays()
    },

    onDelayToChange(e) {
      this.delayTo = e.detail.value
      this._calcDays()
    },

    _calcDays() {
      const baseDate = this.selectedApply ? this.selectedApply.currentEnd : this.defaultCurrentEnd
      if (!baseDate || !this.delayTo) { this.delayDays = null; return }
      const diff = Math.round((new Date(this.delayTo) - new Date(baseDate)) / (1000 * 60 * 60 * 24))
      this.delayDays = diff > 0 ? diff : null
    },

    isImage(filename) {
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)
    },

    onUpload() {
      if (this.attachFiles.length < 3) {
        const ext = this.attachFiles.length % 2 === 0 ? '.jpg' : '.pdf'
        this.attachFiles.push('附件' + (this.attachFiles.length + 1) + ext)
      }
    },

    onSubmit() {
      if (!this.delayTo) {
        uni.showToast({ title: '请选择申请延至日期', icon: 'none' }); return
      }
      if (!this.delayDays || this.delayDays <= 0) {
        uni.showToast({ title: '延至日期须晚于当前完工时间', icon: 'none' }); return
      }
      if (!this.reason.trim()) {
        uni.showToast({ title: '请输入延期原因', icon: 'none' }); return
      }
      uni.showToast({ title: '延期申请已提交', icon: 'success' })
      setTimeout(() => uni.navigateBack({ delta: 1 }), 1500)
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

/* ── 表单卡片（规范§三.1） ── */
.form-card {
  background: #FFFFFF;
  padding: 0 36rpx;
  margin-bottom: 40rpx;
}
.form-card:first-child { margin-top: 32rpx; }

/* ── 字段通用（规范§三.2） ── */
.form-field { margin-bottom: 40rpx; }
.form-field-last { margin-bottom: 0; }
.form-field-info { border-bottom: 2rpx solid #F0F0F0; }

/* ── 标题行（规范§四.3） ── */
.f-label-row { display: flex; align-items: flex-start; }
.f-label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 24rpx;
}
.req { color: var(--color-danger); margin-right: 4rpx; font-size: 28rpx; }

/* ── 提示文字（下划线下方，红色） ── */
.field-hint {
  display: block;
  font-size: 20rpx;
  color: #FA2B2D;
  margin-top: 12rpx;
  margin-bottom: 40rpx;
  line-height: 1.5;
}

/* ── 只读值（规范§四.4） ── */
.f-val {
  display: block;
  font-size: 24rpx;
  color: #666666;
  padding-bottom: 12rpx;
  line-height: 1.5;
}

/* ── 选择器行（规范§五.3） ── */
.date-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12rpx;
}
.date-arrow { width: 32rpx; height: 32rpx; flex-shrink: 0; }

/* ── 延期原因文本域（规范§七.3） ── */
.remark-wrap {
  position: relative;
  border: 2rpx solid #D2D6E2;
  border-radius: 10rpx;
  padding: 20rpx;
  box-sizing: border-box;
}
.remark-ta {
  width: 100%;
  height: 182rpx;
  font-size: 26rpx;
  color: #333333;
  line-height: 1.5;
  background: transparent;
}
.remark-count {
  position: absolute; bottom: 20rpx; right: 20rpx;
  font-size: 24rpx; color: #CCCCCC;
}
.ph { color: #999999; }

/* ── 附件上传（§五 §4.4 规范） ── */
.upload-single {
  width: 320rpx; height: 270rpx;
  border-radius: 16rpx;
  overflow: hidden;
  display: block;
}
.upload-ph-img { width: 100%; height: 100%; display: block; }
.upload-rule { display: block; font-size: 22rpx; color: #999999; margin-top: 12rpx; }
/* 文件行 */
.file-row {
  display: flex; align-items: center; gap: 16rpx;
  padding: 0 20rpx 0 26rpx; height: 100rpx;
  background: #F2FAFE; border: 1rpx solid #D1E2EB; border-radius: 16rpx;
  box-sizing: border-box;
  margin-top: 20rpx;
}
.file-icon     { width: 48rpx; height: 48rpx; flex-shrink: 0; }
.file-name     { flex: 1; font-size: 25rpx; color: #000000; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-del-icon { width: 48rpx; height: 48rpx; flex-shrink: 0; }
</style>
