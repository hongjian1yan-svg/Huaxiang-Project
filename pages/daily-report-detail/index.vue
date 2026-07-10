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
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">基本信息</text></view>
        <view class="detail-row"><text class="detail-label">商户名称</text><text class="detail-value">{{ record.merchant }}</text></view>
        <view class="detail-row"><text class="detail-label">商铺号</text><text class="detail-value">{{ record.shop }}</text></view>
        <view class="detail-row"><text class="detail-label">申请编号</text><text class="detail-value">{{ record.applyId }}</text></view>
        <view class="detail-row"><text class="detail-label">施工证号</text><text class="detail-value">{{ record.certNo }}</text></view>
        <view class="detail-row"><text class="detail-label">报备日期</text><text class="detail-value">{{ record.reportDate }}</text></view>
        <view v-if="record.status === 'reported'" class="detail-row"><text class="detail-label">报备时间</text><text class="detail-value">{{ record.reportTime || '—' }}</text></view>
      </view>

      <view class="detail-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">特殊作业报备明细</text></view>
        <text class="section-tip">以下为该商户当日各特殊作业的报备情况。</text>
        <view v-for="(w, idx) in record.works" :key="w.key" :class="['work-item', { 'no-border': idx === record.works.length - 1 }]">
          <view class="work-hd">
            <text class="work-name">{{ w.label }}</text>
            <text :class="['report-status', w.reported ? 'done' : 'pending']">{{ w.reported ? '已报备' : '未报备' }}</text>
          </view>
          <template v-if="w.reported">
            <view class="work-field"><text class="work-field-label">报备时间：</text><text class="work-field-value">{{ w.reportTime || '—' }}</text></view>
            <view class="work-field"><text class="work-field-label">报备内容：</text><text class="work-field-value">{{ w.content || '—' }}</text></view>
            <view v-if="w.certs.length" class="work-cert-block">
              <text class="work-field-label">上传证件：</text>
              <view class="cert-file-col">
                <view v-for="f in w.certs" :key="f" class="file-item">
                  <image class="file-icon" :src="isImage(f) ? '/static/images/icon-file-img.png' : '/static/images/icon-file-pdf.png'" mode="aspectFit" />
                  <text class="file-name">{{ f }}</text>
                </view>
              </view>
            </view>
          </template>
          <text v-else class="report-warn">商户未在当日报备该作业，已计入过期未报备。</text>
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
const { DAILY_REPORT_DATA, enrichDailyReport } = require('@/utils/construction-mock.js')

export default {
  data() {
    return { record: { works: [] } }
  },

  computed: {
    banner() {
      const r = this.record
      if (!r.id) return null
      if (r.status === 'reported') {
        return { type: 'green', title: r.statusText, desc: '商户已在当日报备全部有效特殊作业。' }
      }
      return { type: 'red', title: r.statusText, desc: `以下作业未在当日报备：${(r.overdueLabels || []).join('、')}。请督促商户补报。` }
    }
  },

  onLoad(options) {
    const raw = DAILY_REPORT_DATA.find(d => d.id === options.id) || DAILY_REPORT_DATA[0]
    this.record = enrichDailyReport(raw)
  },

  methods: {
    isImage(name) { return /\.(jpg|jpeg|png|gif|webp)$/i.test(name || '') },
    goBack() { uni.navigateBack() }
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
.notice-red   { background: rgba(250,43,45,0.05); }
.notice-green { background: rgba(26,186,108,0.06); }
.notice-icon-wrap {
  width: 36rpx; height: 36rpx;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 4rpx;
}
.notice-red   .notice-icon-wrap { background: #FA2B2D; }
.notice-green .notice-icon-wrap { background: #1ABA6C; }
.notice-icon-text { font-size: 22rpx; font-weight: 700; color: #FFFFFF; line-height: 1; }
.notice-body { flex: 1; }
.notice-title { display: block; font-size: 26rpx; font-weight: 600; margin-bottom: 8rpx; }
.notice-text  { display: block; font-size: 24rpx; line-height: 1.6; }
.notice-red   .notice-title, .notice-red   .notice-text { color: #FA2B2D; }
.notice-green .notice-title, .notice-green .notice-text { color: #1ABA6C; }

.detail-card { background: #FAFAFA; border: 2rpx solid #E6E6E6; border-radius: 20rpx; padding: 28rpx; margin: 0 28rpx 20rpx; }
.sec-title { display: flex; align-items: center; gap: 16rpx; margin-bottom: 24rpx; }
.sec-bar { width: 8rpx; height: 36rpx; background: var(--color-primary); border-radius: 0 8rpx 8rpx 0; flex-shrink: 0; }
.sec-label { font-size: 28rpx; font-weight: 600; color: var(--color-text-primary); }

.detail-row { display: flex; align-items: flex-start; padding: 12rpx 0; font-size: 26rpx; }
.detail-label { width: 180rpx; flex-shrink: 0; color: #666; text-align: right; line-height: 1.5; }
.detail-label::after { content: '：'; }
.detail-value { color: var(--color-text-primary); text-align: left; flex: 1; line-height: 1.5; padding-left: 4rpx; }

.section-tip { display: block; font-size: 24rpx; color: var(--color-text-hint); margin-bottom: 20rpx; }
.work-item { padding: 20rpx 0; border-bottom: 2rpx solid #F0F0F0; }
.work-item:last-child, .work-item.no-border { border-bottom: none; padding-bottom: 0; }
.work-hd { display: flex; justify-content: space-between; align-items: flex-start; gap: 16rpx; margin-bottom: 12rpx; }
.work-name { font-size: 28rpx; font-weight: 600; color: var(--color-text-primary); }
.report-status { font-size: 24rpx; padding: 4rpx 16rpx; border-radius: 8rpx; flex-shrink: 0; }
.report-status.done { background: var(--color-primary-light); color: var(--color-primary); }
.report-status.pending { background: var(--color-warning-light); color: var(--color-warning); }
.report-warn { display: block; font-size: 24rpx; color: var(--color-warning); line-height: 1.6; }

.work-field { display: flex; align-items: flex-start; padding: 8rpx 0; font-size: 26rpx; }
.work-field-label { flex-shrink: 0; color: #666; line-height: 1.5; }
.work-field-value { color: var(--color-text-primary); flex: 1; line-height: 1.5; }

.work-cert-block { padding: 8rpx 0; font-size: 26rpx; }
.work-cert-block .work-field-label { display: block; margin-bottom: 12rpx; }

.cert-file-col { display: flex; flex-direction: column; gap: 12rpx; }
.file-item { display: flex; align-items: center; gap: 16rpx; height: 100rpx; padding: 0 20rpx; background: #F2FAFE; border-radius: 16rpx; border: 2rpx solid #D1E2EB; }
.file-icon { width: 48rpx; height: 48rpx; flex-shrink: 0; }
.file-name { flex: 1; font-size: 25rpx; color: #000; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.bottom-bar { background: #fff; border-top: 2rpx solid #EDEDED; height: 180rpx; padding: 12rpx 36rpx 0; display: flex; align-items: flex-start; gap: 30rpx; box-sizing: border-box; flex-shrink: 0; }
.btn { flex: 1; height: 88rpx; border-radius: 12rpx; font-size: 32rpx; font-weight: 600; border: none; display: flex; align-items: center; justify-content: center; }
.btn-outline-green { background: #fff; color: var(--color-primary); border: 2rpx solid var(--color-primary); }
</style>
