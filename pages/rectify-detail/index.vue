<template>
  <view class="page">
    <scroll-view class="scroll-body" scroll-y>
      <view v-if="banner" :class="['notice-banner', 'notice-' + banner.type]">
        <view class="notice-icon-wrap">
          <text class="notice-icon-text">!</text>
        </view>
        <view class="notice-body">
          <text class="notice-title">{{ banner.title }}</text>
          <text class="notice-text">{{ banner.desc }}</text>
        </view>
      </view>

      <view class="detail-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">整改信息</text></view>
        <view class="detail-row"><text class="detail-label">整改单号</text><text class="detail-value">{{ item.id }}</text></view>
        <view class="detail-row"><text class="detail-label">关联申请</text><text class="detail-value">{{ item.applyId }}</text></view>
        <view class="detail-row"><text class="detail-label">商户/商铺</text><text class="detail-value">{{ item.merchant }} {{ item.shop }}</text></view>
        <view class="detail-row"><text class="detail-label">问题类型</text><text class="detail-value">{{ item.type }}</text></view>
        <view class="detail-row"><text class="detail-label">整改要求</text><text class="detail-value">{{ item.requirement }}</text></view>
        <view class="detail-row"><text class="detail-label">整改期限</text><text class="detail-value">{{ item.deadline }}</text></view>
        <view class="detail-row"><text class="detail-label">下发时间</text><text class="detail-value">{{ item.issueTime }}</text></view>
        <view class="detail-row"><text class="detail-label">下发人</text><text class="detail-value">{{ item.issuer }}</text></view>
        <view v-if="item.fromInspect" class="detail-row"><text class="detail-label">来源</text><text class="detail-value">现场巡检异常</text></view>
        <view v-if="item.needStop" class="detail-row"><text class="detail-label">整改类型</text><text class="detail-value danger-text">停工整改</text></view>
      </view>

      <view v-if="tab !== 'pending' && recheckApply" class="detail-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">申请复检</text></view>
        <view class="field-row"><text class="f-label">提交时间</text><text class="f-value">{{ recheckApply.applyTime }}</text></view>
        <text class="att-sub-label">附件说明</text>
        <text class="remark-text">{{ recheckApply.attachmentDesc }}</text>
        <view v-if="recheckApply.attachments.length" class="att-block">
          <text class="att-cat-label">附件</text>
          <view v-for="f in recheckApply.attachments" :key="f" class="file-item">
            <image class="file-icon" :src="isImage(f) ? '/static/images/icon-file-img.png' : '/static/images/icon-file-pdf.png'" mode="aspectFit" />
            <text class="file-name">{{ f }}</text>
          </view>
        </view>
        <view v-if="recheckApply.rectificationPhotos.length" class="att-block">
          <text class="att-cat-label">整改照片</text>
          <view class="photo-thumb-grid">
            <view v-for="p in recheckApply.rectificationPhotos" :key="p" class="photo-thumb-item">
              <image class="photo-thumb-img" src="/static/images/uploadedImage.png" mode="aspectFill" />
            </view>
          </view>
        </view>
      </view>
      <view v-else-if="tab === 'closed' || tab === 'rejected'" class="detail-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">申请复检</text></view>
        <text class="recheck-empty">暂无申请复检记录</text>
      </view>

      <view v-if="(tab === 'closed' || tab === 'rejected') && reviewInfo" class="detail-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">复检信息</text></view>
        <view class="field-row"><text class="f-label">复核结果</text><text class="f-value" :class="reviewInfo.resultPass ? 'primary-text' : 'danger-text'">{{ reviewInfo.result }}</text></view>
        <view class="field-row"><text class="f-label">复核时间</text><text class="f-value">{{ reviewInfo.reviewTime }}</text></view>
        <view class="field-row"><text class="f-label">复核人</text><text class="f-value">{{ reviewInfo.reviewer }}</text></view>
        <template v-if="reviewInfo.opinion">
          <text class="att-sub-label">复核意见</text>
          <text class="remark-text">{{ reviewInfo.opinion }}</text>
        </template>
        <view v-if="reviewInfo.photos.length" class="att-block">
          <text class="att-cat-label">拍摄照片</text>
          <view class="photo-thumb-grid">
            <view v-for="p in reviewInfo.photos" :key="p" class="photo-thumb-item">
              <image class="photo-thumb-img" src="/static/images/uploadedImage.png" mode="aspectFill" />
            </view>
          </view>
        </view>
      </view>

      <view class="detail-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">流程记录</text></view>
        <view class="timeline">
          <view class="timeline-item">
            <text class="tl-dept">系统自动下发整改通知</text>
            <text class="tl-meta">{{ item.issueTime }} · {{ item.issuer || '—' }}</text>
          </view>
          <view v-if="tab !== 'pending' && recheckApply" class="timeline-item">
            <text class="tl-dept">商户提交申请复检</text>
            <text class="tl-meta">{{ recheckApply.applyTime }}</text>
          </view>
          <view v-if="item.rejectTime" class="timeline-item">
            <view class="tl-hd"><text class="tl-dept">部门复核驳回</text><text class="tl-status tl-status-reject">已驳回</text></view>
            <text class="tl-meta">{{ item.rejectTime }} · {{ item.reviewer }}</text>
          </view>
          <view v-if="item.closeTime" class="timeline-item">
            <text class="tl-dept">复核通过并复工</text>
            <text class="tl-meta">{{ item.closeTime }} · {{ item.reviewer }}</text>
          </view>
          <view v-else-if="tab === 'review'" class="timeline-item wait">
            <view class="tl-hd"><text class="tl-dept">待部门复核</text><text class="tl-status tl-status-wait">待处理</text></view>
            <text class="tl-meta">请现场核实后提交复核结果</text>
          </view>
        </view>
      </view>

      <view style="height: 20rpx;"></view>
    </scroll-view>

    <view class="bottom-bar">
      <button class="btn btn-outline-green" @tap="goBack">返回</button>
      <button v-if="tab === 'review' || tab === 'pending'" class="btn btn-primary" @tap="goReview">立即复核</button>
    </view>
  </view>
</template>

<script>
const { findRectifyItem } = require('@/utils/construction-mock.js')

export default {
  data() {
    return { item: {}, tab: 'pending' }
  },

  computed: {
    banner() {
      const item = this.item
      if (!item.id) return null
      if (this.tab === 'pending') return { type: 'orange', title: '待商户整改', desc: `巡检异常已自动生成整改通知，请督促商户在 ${item.deadline} 前完成整改并提交申请复检。` }
      if (this.tab === 'review') return { type: 'orange', title: '待复核', desc: '商户已提交申请复检，请核实附件说明及整改照片后提交复核结果。' }
      if (this.tab === 'rejected') return { type: 'red', title: '复核驳回', desc: `复核不通过，已于 ${item.rejectTime || '—'} 驳回。请督促商户按复核意见整改后重新提交申请复检。` }
      return { type: 'green', title: '已复工', desc: `停工整改复核通过，已于 ${item.closeTime} 确认复工。` }
    },

    recheckApply() {
      const item = this.item
      const photos = item.rectificationPhotos || []
      const attachments = item.attachments || []
      const attachmentDesc = item.attachmentDesc || ''
      const applyTime = item.recheckApplyTime || ''
      if (!applyTime && !attachmentDesc && !photos.length && !attachments.length) return null
      return { applyTime: applyTime || '—', attachmentDesc: attachmentDesc || '—', attachments, rectificationPhotos: photos }
    },

    reviewInfo() {
      const item = this.item
      const reviewTime = item.closeTime || item.rejectTime || ''
      if (!reviewTime && !item.reviewResult) return null
      const pass = item.reviewResult !== 'reject'
      return {
        result: pass ? '复核通过' : '复核不通过',
        resultPass: pass,
        reviewTime: reviewTime || '—',
        reviewer: item.reviewer || '—',
        opinion: item.reviewOpinion || '',
        photos: item.reviewPhotos || []
      }
    }
  },

  onLoad(options) {
    this.tab = options.tab || 'pending'
    this.item = findRectifyItem(options.id || '', this.tab) || {}
  },

  methods: {
    isImage(name) { return /\.(jpg|jpeg|png|gif|webp)$/i.test(name || '') },
    goBack() { uni.navigateBack() },
    goReview() {
      uni.navigateTo({ url: `/pages/rectify-review/index?id=${encodeURIComponent(this.item.id)}&tab=${this.tab}` })
    }
  }
}
</script>

<style>
.page { display: flex; flex-direction: column; height: 100vh; background: #FFFFFF; overflow: hidden; }
.scroll-body { flex: 1; overflow: hidden; padding: 20rpx 0; }

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
.notice-title { display: block; font-size: 26rpx; font-weight: 600; margin-bottom: 8rpx; }
.notice-text  { display: block; font-size: 24rpx; line-height: 1.6; }
.notice-red    .notice-title, .notice-red    .notice-text { color: #FA2B2D; }
.notice-orange .notice-title, .notice-orange .notice-text { color: #F19204; }
.notice-green  .notice-title, .notice-green  .notice-text { color: #1ABA6C; }

.detail-card { background: #FAFAFA; padding: 28rpx; margin: 0 28rpx 20rpx; border-radius: 20rpx; border: 2rpx solid #E6E6E6; }
.sec-title { display: flex; align-items: center; gap: 16rpx; margin-bottom: 24rpx; }
.sec-bar { width: 8rpx; height: 36rpx; background: var(--color-primary); border-radius: 0 8rpx 8rpx 0; flex-shrink: 0; }
.sec-label { font-size: 28rpx; font-weight: 600; color: var(--color-text-primary); }

.detail-row { display: flex; align-items: flex-start; padding: 12rpx 0; font-size: 26rpx; }
.detail-label { width: 180rpx; flex-shrink: 0; color: #666; text-align: right; line-height: 1.5; }
.detail-label::after { content: '：'; }
.detail-value { color: var(--color-text-primary); text-align: left; flex: 1; line-height: 1.5; padding-left: 4rpx; }
.danger-text { color: var(--color-danger); }
.primary-text { color: var(--color-primary); }

.field-row { display: flex; align-items: flex-start; padding: 12rpx 0; font-size: 26rpx; }
.f-label { width: 180rpx; flex-shrink: 0; color: #666; text-align: right; line-height: 1.5; }
.f-label::after { content: '：'; }
.f-value { color: var(--color-text-primary); text-align: left; flex: 1; line-height: 1.5; padding-left: 4rpx; }

.att-block { margin-top: 20rpx; }
.att-sub-label { display: block; font-size: 26rpx; color: #666666; margin-bottom: 12rpx; }
.att-cat-label { display: block; font-size: 26rpx; font-weight: 600; color: #333; margin-bottom: 16rpx; }
.remark-text { display: block; font-size: 26rpx; color: #333; line-height: 1.7; }
.recheck-empty { display: block; font-size: 26rpx; color: #999; line-height: 1.6; }

.file-item { display: flex; align-items: center; gap: 16rpx; height: 100rpx; padding: 0 20rpx; background: #F2FAFE; border-radius: 16rpx; border: 2rpx solid #D1E2EB; margin-bottom: 12rpx; }
.file-icon { width: 48rpx; height: 48rpx; flex-shrink: 0; }
.file-name { flex: 1; font-size: 25rpx; color: #000; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.photo-thumb-grid { display: flex; flex-wrap: wrap; gap: 16rpx; }
.photo-thumb-item { width: 144rpx; height: 144rpx; border-radius: 16rpx; overflow: hidden; background: #f0f0f0; }
.photo-thumb-img { width: 100%; height: 100%; }

.timeline { padding-left: 26rpx; padding-top: 4rpx; }
.timeline-item { position: relative; padding-bottom: 44rpx; }
.timeline-item:last-child { padding-bottom: 0; }
.timeline-item::before { content: ''; position: absolute; left: -26rpx; top: 12rpx; width: 10rpx; height: 10rpx; border-radius: 50%; background: #B3B3B3; }
.timeline-item:not(:last-child)::after { content: ''; position: absolute; left: -22rpx; top: 38rpx; bottom: 4rpx; width: 4rpx; background: #E0E0E0; }
.timeline-item.wait::before { background: #d9d9d9; }
.tl-dept { display: block; font-size: 24rpx; font-weight: 600; color: #000; line-height: 1.4; }
.tl-meta { display: block; font-size: 24rpx; color: #666; margin-top: 8rpx; }
.tl-hd { display: flex; justify-content: space-between; align-items: center; }
.tl-status { font-size: 24rpx; font-weight: 600; flex-shrink: 0; margin-left: 16rpx; }
.tl-status-wait { color: #F19204; }
.tl-status-reject { color: #FA2B2D; }

.bottom-bar { background: #fff; border-top: 2rpx solid #EDEDED; height: 180rpx; padding: 12rpx 36rpx 0; display: flex; align-items: flex-start; gap: 30rpx; box-sizing: border-box; flex-shrink: 0; }
.btn { flex: 1; height: 88rpx; border-radius: 12rpx; font-size: 32rpx; font-weight: 600; border: none; display: flex; align-items: center; justify-content: center; }
.btn-primary { background: var(--color-primary); color: #fff; }
.btn-outline-green { background: #fff; color: var(--color-primary); border: 2rpx solid var(--color-primary); }
</style>
