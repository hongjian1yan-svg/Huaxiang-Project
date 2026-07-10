<template>
  <view class="page">
    <scroll-view scroll-y class="scroll-body" :enhanced="true" :show-scrollbar="false">
      <view class="info-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">基本信息</text></view>
        <view class="detail-row"><text class="detail-label">商户名称</text><text class="detail-value">{{ apply.merchant }}</text></view>
        <view class="detail-row"><text class="detail-label">商铺号</text><text class="detail-value">{{ apply.shop }}</text></view>
        <view class="detail-row"><text class="detail-label">申请编号</text><text class="detail-value">{{ apply.id }}</text></view>
        <view class="detail-row"><text class="detail-label">报备日期</text><text class="detail-value">{{ date }}</text></view>
        <view class="detail-row"><text class="detail-label">报备时间</text><text class="detail-value">{{ record.reportTime || '—' }}</text></view>
      </view>

      <view :class="['notice-banner', todayInfo.types.length ? 'notice-red' : 'notice-green']">
        <view class="notice-icon-wrap"><text class="notice-icon-text">!</text></view>
        <view class="notice-body">
          <template v-if="todayInfo.types.length">
            <text class="notice-title">当日特殊作业（{{ date }}）</text>
            <text class="notice-text">涉及：<text class="notice-strong">{{ typeLabelsText }}</text>；已上传对应现场拍照。</text>
          </template>
          <template v-else>
            <text class="notice-title">当日无特殊作业</text>
            <text class="notice-text">该日无已批准的特殊作业。</text>
          </template>
        </view>
      </view>

      <view class="info-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">施工内容</text></view>
        <view class="textarea-box">{{ record.content || '—' }}</view>
      </view>

      <view class="info-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">现场施工图照片</text></view>
        <text v-if="!scenePhotos.length" class="empty-tip">未上传现场照片</text>
        <view v-else class="photo-grid">
          <view v-for="(img, i) in scenePhotos" :key="i" class="photo-thumb"></view>
        </view>
      </view>

      <view v-for="type in todayInfo.types" :key="type" class="info-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">{{ typeLabel(type) }}</text></view>
        <text class="empty-tip" v-if="!(certPhotos[type] || []).length">未上传现场照片</text>
        <view v-else class="photo-grid">
          <view v-for="(img, i) in certPhotos[type]" :key="i" class="photo-thumb"></view>
        </view>
      </view>

      <view style="height: 20rpx;"></view>
    </scroll-view>

    <view class="bottom-bar">
      <button class="btn btn-outline-green" @tap="goBack">返回</button>
    </view>
  </view>
</template>

<script>
const {
  getDailyReportEligibleApply, getDailyReportRecord, getSpecialWorkInfoForDate, SPECIAL_TYPE_LABEL
} = require('@/utils/renovation-mock.js')

export default {
  data() {
    return {
      apply: {},
      date: '',
      record: {},
      todayInfo: { types: [], works: [] },
      scenePhotos: [],
      certPhotos: {}
    }
  },

  computed: {
    typeLabelsText() { return this.todayInfo.types.map(t => this.typeLabel(t)).join('、') }
  },

  onLoad(options) {
    const applyId = options.applyId || ''
    this.date = options.date || ''
    this.apply = getDailyReportEligibleApply(applyId) || {}
    if (!this.apply.id) return
    this.record = getDailyReportRecord(this.apply.id, this.date) || {}
    this.todayInfo = getSpecialWorkInfoForDate(this.apply.id, this.date)
    this.scenePhotos = this.record.scenePhotos || []
    this.certPhotos = this.record.certsByType || {}
  },

  methods: {
    typeLabel(t) { return SPECIAL_TYPE_LABEL[t] || t },
    goBack() { uni.navigateBack() }
  }
}
</script>

<style>
.page { display: flex; flex-direction: column; height: 100vh; background: #FFFFFF; overflow: hidden; }
.scroll-body { flex: 1; overflow: hidden; padding: 20rpx 0; }

.info-card { background: #FAFAFA; border-radius: 20rpx; border: 2rpx solid #E6E6E6; margin: 0 28rpx 20rpx; padding: 28rpx; }
.info-card .sec-title { margin-left: 0; }

.notice-banner { display: flex; align-items: flex-start; gap: 16rpx; border-radius: 20rpx; border: 2rpx solid transparent; padding: 24rpx; margin: 0 28rpx 20rpx; }
.notice-green  { background: rgba(26,186,108,0.06); border-color: var(--color-primary-border); }
.notice-red    { background: rgba(250,43,45,0.05); border-color: var(--color-danger-border); }
.notice-icon-wrap { width: 36rpx; height: 36rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 4rpx; }
.notice-green  .notice-icon-wrap { background: var(--color-primary); }
.notice-red    .notice-icon-wrap { background: var(--color-danger); }
.notice-icon-text { font-size: 22rpx; font-weight: 700; color: #FFFFFF; line-height: 1; }
.notice-body { flex: 1; }
.notice-title { display: block; font-size: 26rpx; font-weight: 600; margin-bottom: 8rpx; }
.notice-text  { display: block; font-size: 24rpx; line-height: 1.6; }
.notice-green  .notice-title, .notice-green  .notice-text { color: var(--color-primary); }
.notice-red    .notice-title, .notice-red    .notice-text { color: var(--color-danger); }
.notice-strong { font-weight: 600; }

.empty-tip { display: block; font-size: 24rpx; color: var(--color-text-hint); }

.textarea-box { display: block; font-size: 26rpx; color: #666666; line-height: 1.6; }

.photo-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16rpx; }
.photo-thumb { width: 100%; height: 270rpx; border-radius: 16rpx; overflow: hidden; background: #DDDDDD; }

.bottom-bar { background: #fff; border-top: 2rpx solid #EDEDED; height: 180rpx; padding: 12rpx 36rpx 0; display: flex; align-items: flex-start; gap: 30rpx; box-sizing: border-box; flex-shrink: 0; }
</style>
