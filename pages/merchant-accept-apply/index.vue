<template>
  <view class="page-wrap">
    <scroll-view scroll-y class="form-scroll">

      <!-- 状态提示横幅 -->
      <view v-if="banner" :class="['notice-banner', 'notice-' + banner.type]">
        <view class="notice-icon-wrap"><text class="notice-icon-text">!</text></view>
        <view class="notice-body">
          <text class="notice-title">{{ banner.title }}</text>
          <text class="notice-text">{{ banner.text }}</text>
        </view>
      </view>

      <!-- 申请信息 -->
      <view class="form-card form-card-first">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">申请信息</text></view>

        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="f-label">选择装修申请</text></view>
          <text class="f-val">{{ apply.merchant }} - {{ apply.shop }}（{{ apply.id }}）</text>
        </view>
        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="f-label">施工证号</text></view>
          <text class="f-val">{{ certNo }}</text>
        </view>
        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="f-label">施工期间</text></view>
          <text class="f-val">{{ apply.decoratePeriod || '—' }}</text>
        </view>
        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="f-label">装修类目</text></view>
          <view class="sub-tags">
            <text v-for="t in (apply.tags || [])" :key="t" class="sub-tag sub-tag-on">{{ t }}</text>
          </view>
        </view>
        <view class="cert-link" @tap="showCertModal = true">📋 查看电子施工证</view>
        <view v-if="prevSubmitTime" class="form-field form-field-last form-field-info">
          <view class="f-label-row"><text class="f-label">提交时间</text></view>
          <text class="f-val">{{ prevSubmitTime }}</text>
        </view>
      </view>

      <!-- 装修公司信息 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">装修公司信息</text></view>
        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">装修公司名称</text></view>
          <input class="f-input" v-model="companyName" placeholder="请输入装修公司名称" placeholder-class="ph" />
        </view>
        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">联系人</text></view>
          <input class="f-input" v-model="contactName" placeholder="请输入联系人" placeholder-class="ph" />
        </view>
        <view class="form-field form-field-last form-field-info">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">电话</text></view>
          <input class="f-input" type="tel" v-model="contactPhone" placeholder="请输入联系电话" placeholder-class="ph" />
        </view>
      </view>

      <!-- 上传竣工照片 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">上传竣工照片</text></view>
        <view class="form-field form-field-last">
          <text class="f-label"><text class="req">*</text>竣工照片</text>
          <view v-if="photos.length < PHOTO_MAX" class="upload-single" @tap="choosePhoto">
            <image class="upload-ph-img" src="/static/images/uploadedImage.png" mode="scaleToFill" />
          </view>
          <view v-for="(f, i) in photos" :key="i" class="file-row">
            <image class="file-icon" :src="isImage(f) ? '/static/images/icon-file-img.png' : '/static/images/icon-file-pdf.png'" mode="aspectFit" />
            <text class="file-name">{{ f }}</text>
            <image class="file-del-icon" src="/static/images/shanchu.png" mode="scaleToFill" @tap.stop="photos.splice(i, 1)" />
          </view>
          <text class="upload-rule">请拍照或从相册选择竣工照片（必填，相册一次最多可选{{ PHOTO_MAX }}张，合计最多{{ PHOTO_MAX }}张）。已上传 {{ photos.length }}/{{ PHOTO_MAX }} 张。</text>
        </view>
      </view>

      <!-- 验收备注 -->
      <view class="form-card form-card-last">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">验收备注</text></view>
        <view class="form-field form-field-last">
          <view class="remark-wrap">
            <textarea
              class="remark-ta"
              v-model="remark"
              placeholder="请输入验收备注（选填）"
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

    <!-- 底部提交按钮 -->
    <view class="bottom-bar">
      <button class="btn btn-primary" @tap="submit">提交验收申请</button>
    </view>

    <!-- 电子施工证弹窗 -->
    <view v-if="showCertModal" class="modal-overlay" @tap="showCertModal = false">
      <view class="cert-modal" @tap.stop>
        <view class="cert-hd">
          <view class="cert-main-title">装修施工证</view>
          <view class="cert-sub-title">RENOVATION CONSTRUCTION PERMIT</view>
        </view>
        <view class="cert-row"><text class="cert-label">装修商户</text><text class="cert-val">{{ apply.merchant }}</text></view>
        <view class="cert-row"><text class="cert-label">商铺号</text><text class="cert-val">{{ apply.shop }}</text></view>
        <view class="cert-row"><text class="cert-label">装修内容</text><text class="cert-val">{{ (apply.tags || []).join('·') }}</text></view>
        <view class="cert-row"><text class="cert-label">有效期</text><text class="cert-val">{{ apply.decoratePeriod || '—' }}</text></view>
        <view class="cert-row"><text class="cert-label">防伪码</text><text class="cert-val cert-code">{{ certNo }}</text></view>
        <view class="cert-footer">
          <view class="cert-qr-placeholder">QR</view>
          <view class="cert-stamp">市场{{ '\n' }}管理部</view>
        </view>
        <view class="cert-btns">
          <button class="btn btn-outline" @tap="showCertModal = false">关闭</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const { getAcceptanceEligibleApply, getApplyCertCode, submitAcceptance } = require('@/utils/renovation-mock.js')

const PHOTO_MAX = 9

export default {
  data() {
    return {
      PHOTO_MAX,
      applyId: '',
      apply: {},
      certNo: '',
      rejected: false,
      prevSubmitTime: '',
      companyName: '',
      contactName: '',
      contactPhone: '',
      remark: '',
      remarkLen: 0,
      photos: [],
      showCertModal: false
    }
  },

  computed: {
    banner() {
      if (!this.apply.id) return null
      if (this.rejected) {
        return { type: 'red', title: '验收驳回', text: this.apply.acceptanceRejectReason || '验收未通过，请根据驳回原因整改后重新申请验收。' }
      }
      return null
    }
  },

  onLoad(options) {
    this.applyId = options.applyId || ''
    const apply = getAcceptanceEligibleApply(this.applyId)
    if (!apply) return
    this.apply = apply
    this.certNo = getApplyCertCode(apply.id)
    this.rejected = !!apply.acceptanceRejected
    uni.setNavigationBarTitle({ title: this.rejected ? '重新申请验收' : '验收申请' })

    const sub = apply.acceptanceSubmit
    if (this.rejected && sub) {
      this.prevSubmitTime = sub.submitTime || ''
      this.companyName = sub.companyName || ''
      this.contactName = sub.contactName || ''
      this.contactPhone = sub.contactPhone || ''
      this.remark = sub.remark || ''
      this.remarkLen = this.remark.length
      this.photos = (sub.photos || []).slice()
    }
  },

  methods: {
    isImage(filename) {
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)
    },

    choosePhoto() {
      if (this.photos.length >= PHOTO_MAX) {
        uni.showToast({ title: `最多上传${PHOTO_MAX}张`, icon: 'none' })
        return
      }
      this.photos.push('竣工照片' + (this.photos.length + 1) + '.jpg')
    },

    submit() {
      if (!this.companyName.trim()) {
        uni.showToast({ title: '请输入装修公司名称', icon: 'none' }); return
      }
      if (!this.contactName.trim()) {
        uni.showToast({ title: '请输入联系人', icon: 'none' }); return
      }
      if (!this.contactPhone.trim()) {
        uni.showToast({ title: '请输入联系电话', icon: 'none' }); return
      }
      if (!this.photos.length) {
        uni.showToast({ title: '请上传竣工照片', icon: 'none' }); return
      }
      submitAcceptance(this.applyId, {
        companyName: this.companyName.trim(),
        contactName: this.contactName.trim(),
        contactPhone: this.contactPhone.trim(),
        remark: this.remark.trim(),
        photos: this.photos.slice()
      })
      uni.showToast({ title: '验收申请已提交', icon: 'success' })
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
.f-input { width: 100%; font-size: 24rpx; color: #000000; padding: 0 0 12rpx; background: transparent; border: none; box-sizing: border-box; }
.ph { color: #999999; }

/* 装修类目标签（对齐「新增装修申请」页规范） */
.sub-tags { display: flex; flex-wrap: wrap; gap: 16rpx; padding-bottom: 12rpx; }
.sub-tag { padding: 12rpx 28rpx; border-radius: 10rpx; font-size: 28rpx; font-weight: 400; color: #333333; background: #F7F7F7; }
.sub-tag-on { background: rgba(26,186,108,0.05); color: #1ABA6C; font-weight: 600; outline: 1rpx solid #1ABA6C; outline-offset: -1rpx; }

.cert-link { margin: 40rpx 0 32rpx; font-size: 26rpx; color: var(--color-primary); }

/* 状态提示横幅 */
.notice-banner { display: flex; align-items: flex-start; gap: 16rpx; border-radius: 16rpx; padding: 24rpx; margin: 32rpx 28rpx 0; }
.notice-red { background: rgba(250,43,45,0.05); }
.notice-icon-wrap { width: 36rpx; height: 36rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 4rpx; background: var(--color-danger); }
.notice-icon-text { font-size: 22rpx; font-weight: 700; color: #FFFFFF; line-height: 1; }
.notice-body { flex: 1; }
.notice-title { display: block; font-size: 26rpx; font-weight: 600; margin-bottom: 8rpx; color: var(--color-danger); }
.notice-text { display: block; font-size: 24rpx; line-height: 1.6; color: var(--color-danger); }

/* 上传竣工照片（对齐「新增装修申请」页上传规范） */
.upload-single { width: 320rpx; height: 270rpx; border-radius: 16rpx; overflow: hidden; display: block; }
.upload-ph-img { width: 100%; height: 100%; display: block; }
.upload-rule { display: block; font-size: 22rpx; color: var(--color-text-hint); margin-top: 12rpx; }
.file-row { display: flex; align-items: center; gap: 16rpx; padding: 0 20rpx 0 26rpx; height: 100rpx; background: #F2FAFE; border: 1rpx solid #D1E2EB; border-radius: 16rpx; box-sizing: border-box; margin-top: 20rpx; }
.file-icon { width: 48rpx; height: 48rpx; flex-shrink: 0; }
.file-name { flex: 1; font-size: 25rpx; color: #000000; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-del-icon { width: 48rpx; height: 48rpx; flex-shrink: 0; }

/* 验收备注 */
.remark-wrap { position: relative; background: #fff; border: 2rpx solid #D2D6E2; border-radius: 12rpx; padding: 20rpx; box-sizing: border-box; }
.remark-ta { width: 100%; height: 182rpx; font-size: 26rpx; color: #333333; line-height: 1.5; background: transparent; }
.remark-count { position: absolute; bottom: 16rpx; right: 20rpx; font-size: 22rpx; color: #CCCCCC; }

.bottom-bar { position: fixed; left: 0; right: 0; bottom: 0; padding: 20rpx 28rpx calc(20rpx + env(safe-area-inset-bottom)); background: #FFFFFF; border-top: 2rpx solid #EDEDED; }
.btn { display: flex; align-items: center; justify-content: center; height: 88rpx; border-radius: 44rpx; font-size: 30rpx; font-weight: 600; border: none; width: 100%; }
.btn-primary { background: var(--color-primary); color: #fff; }

/* 电子施工证弹窗 */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center; }
.cert-modal { background: linear-gradient(135deg, #fff 0%, #f0f8ff 50%, #e8f4fd 100%); border: 4rpx solid #b8d4e8; border-radius: 24rpx; padding: 32rpx; width: 80%; }
.cert-hd { text-align: center; padding-bottom: 24rpx; margin-bottom: 24rpx; border-bottom: 4rpx dashed #b8d4e8; }
.cert-main-title { font-size: 36rpx; font-weight: 700; color: #1a5276; letter-spacing: 8rpx; }
.cert-sub-title { font-size: 22rpx; color: #7f8c8d; margin-top: 8rpx; }
.cert-row { display: flex; justify-content: space-between; padding: 16rpx 0; font-size: 26rpx; border-bottom: 2rpx solid #eef5fa; }
.cert-row:last-of-type { border-bottom: none; }
.cert-label { color: #7f8c8d; }
.cert-val { color: #1a1a1a; font-weight: 500; }
.cert-code { font-family: monospace; letter-spacing: 2rpx; }
.cert-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24rpx; padding-top: 24rpx; border-top: 4rpx dashed #b8d4e8; }
.cert-qr-placeholder { width: 140rpx; height: 140rpx; border: 4rpx solid #ccc; border-radius: 8rpx; display: flex; align-items: center; justify-content: center; font-size: 28rpx; color: #ccc; }
.cert-stamp { width: 120rpx; height: 120rpx; border: 6rpx solid rgba(220,53,69,0.35); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: rgba(220,53,69,0.45); font-size: 22rpx; font-weight: 700; text-align: center; transform: rotate(-15deg); line-height: 1.4; }
.cert-btns { margin-top: 24rpx; }
.btn-outline { background: #fff; color: var(--color-text-primary); border: 2rpx solid var(--color-border); font-weight: 400; }
</style>
