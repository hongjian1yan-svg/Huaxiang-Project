<template>
  <view class="page">
    <scroll-view scroll-y class="scroll-body" :enhanced="true" :show-scrollbar="false">
      <!-- 选择装修申请 -->
      <view class="form-card">
        <view class="form-field form-field-info form-field-last">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">选择装修申请</text></view>
          <view class="date-row" @tap="showPicker = true">
            <text :style="{ color: apply.id ? '#000000' : '#999999', fontSize: '24rpx' }">{{ applyDisplayText }}</text>
            <image class="date-arrow" src="/static/images/jiantou.png" mode="scaleToFill" />
          </view>
        </view>
      </view>

      <template v-if="apply.id">
        <!-- 基本信息 -->
        <view class="info-card">
          <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">基本信息</text></view>
          <view class="detail-row"><text class="detail-label">商户名称</text><text class="detail-value">{{ apply.merchant }}</text></view>
          <view class="detail-row"><text class="detail-label">商铺号</text><text class="detail-value">{{ apply.shop }}</text></view>
          <view class="detail-row"><text class="detail-label">申请编号</text><text class="detail-value">{{ apply.id }}</text></view>
          <view class="detail-row"><text class="detail-label">报备日期</text><text class="detail-value">{{ today }}</text></view>
        </view>

        <view v-if="record && record.reported" class="notice-banner notice-green">
          <view class="notice-icon-wrap"><text class="notice-icon-text">!</text></view>
          <view class="notice-body">
            <text class="notice-title">今日已完成报备</text>
            <text class="notice-text">今日已于 {{ record.reportTime || '—' }} 完成每日报备，以下为报备记录。</text>
          </view>
        </view>

        <!-- 今日特殊作业提醒 -->
        <view :class="['notice-banner', todayInfo.types.length ? 'notice-red' : 'notice-green']">
          <view class="notice-icon-wrap"><text class="notice-icon-text">!</text></view>
          <view class="notice-body">
            <template v-if="todayInfo.types.length">
              <text class="notice-title">今日特殊作业提醒（{{ today }}）</text>
              <text class="notice-text">今日涉及：<text class="notice-strong">{{ typeLabelsText }}</text>。请逐项上传对应现场照片。</text>
            </template>
            <template v-else>
              <text class="notice-title">今日无特殊作业</text>
              <text class="notice-text">根据已批准的特殊作业排期，{{ today }} 无需上传特种作业证件，请如实填写今日施工内容后完成报备。</text>
            </template>
          </view>
        </view>

        <!-- 今日施工内容 -->
        <view class="section-block">
          <view class="req-row">
            <text class="req-star">*</text>
            <text class="block-title">今日施工内容</text>
          </view>
          <view class="textarea-box">
            <textarea
              class="desc-ta"
              :class="{ 'ta-readonly': readonly }"
              v-model="content"
              :disabled="readonly"
              placeholder="请填写今日实际施工内容，如施工部位、工序、人员及安全措施落实情况等"
              placeholder-class="ta-ph"
              maxlength="200"
            />
            <text v-if="!readonly" class="char-count">{{ content.length }}/200</text>
          </view>
        </view>

        <!-- 现场施工图照片 -->
        <view class="section-block">
          <view class="req-row">
            <text class="req-star">*</text>
            <text class="block-title">现场施工图照片</text>
          </view>
          <text v-if="!readonly" class="upload-rule">请拍照或从相册选择当日施工现场照片（必填，最多可上传{{ SCENE_PHOTO_MAX }}张）。已上传 {{ scenePhotos.length }}/{{ SCENE_PHOTO_MAX }} 张。</text>

          <image v-if="scenePhotos.length === 0 && !readonly" src="/static/images/uploadedImage.png" mode="widthFix" class="upload-img" @tap="choosePhoto('scene')" />
          <text v-else-if="scenePhotos.length === 0" class="empty-tip">未上传现场照片</text>
          <view v-else class="photo-grid">
            <view v-for="(img, i) in scenePhotos" :key="i" class="photo-thumb">
              <image :src="img" mode="aspectFill" class="photo-img" />
              <view v-if="!readonly" class="photo-del" @tap.stop="scenePhotos.splice(i, 1)"><text class="del-x">×</text></view>
            </view>
            <image v-if="!readonly && scenePhotos.length < SCENE_PHOTO_MAX" src="/static/images/uploadedImage.png" mode="widthFix" class="upload-img" @tap="choosePhoto('scene')" />
          </view>
        </view>

        <!-- 特殊作业现场拍照 -->
        <view v-for="type in todayInfo.types" :key="type" class="section-block">
          <view class="req-row">
            <text v-if="!readonly" class="req-star">*</text>
            <text class="special-title">{{ typeLabel(type) }}</text>
          </view>
          <view v-if="type === 'electric' && electricWork" class="electric-meta">
            <text>用电周期：<text class="electric-strong">{{ electricWork.workDate || electricWork.workTime || '—' }}</text><text v-if="electricWork.electricPointCount != null">；用电点位：<text class="electric-strong">{{ electricWork.electricPointCount }} 个</text></text></text>
            <text v-if="electricWork.workLocation" class="electric-line">作业地点：{{ electricWork.workLocation }}</text>
          </view>
          <text v-if="!readonly" class="upload-rule">请拍照或从相册上传{{ typeLabel(type) }}现场拍照（必填，最多可上传{{ PHOTO_MAX }}张）。已上传 {{ (certPhotos[type] || []).length }}/{{ PHOTO_MAX }} 张。</text>

          <image v-if="(certPhotos[type] || []).length === 0 && !readonly" src="/static/images/uploadedImage.png" mode="widthFix" class="upload-img" @tap="choosePhoto(type)" />
          <text v-else-if="(certPhotos[type] || []).length === 0" class="empty-tip">未上传现场照片</text>
          <view v-else class="photo-grid">
            <view v-for="(img, i) in certPhotos[type]" :key="i" class="photo-thumb">
              <image :src="img" mode="aspectFill" class="photo-img" />
              <view v-if="!readonly" class="photo-del" @tap.stop="certPhotos[type].splice(i, 1)"><text class="del-x">×</text></view>
            </view>
            <image v-if="!readonly && (certPhotos[type] || []).length < PHOTO_MAX" src="/static/images/uploadedImage.png" mode="widthFix" class="upload-img" @tap="choosePhoto(type)" />
          </view>
        </view>
      </template>

      <view v-else class="empty-tip-block">请先选择装修申请，以填写每日报备信息</view>

      <view style="height: 20rpx;"></view>
    </scroll-view>

    <view v-if="apply.id" class="bottom-bar">
      <button class="btn btn-outline-green" @tap="goHistory">报备记录</button>
      <button v-if="!readonly" class="btn btn-primary" @tap="submit">完成报备</button>
    </view>

    <!-- 选择装修申请底部弹窗 -->
    <view v-if="showPicker" class="upload-sheet-overlay" @tap="showPicker = false">
      <view class="upload-sheet apply-picker-sheet" @tap.stop>
        <view class="upload-sheet-title">选择装修申请</view>
        <view class="sheet-title-line"></view>
        <scroll-view scroll-y style="max-height: 50vh;">
          <view v-if="applyOptions.length === 0" class="picker-empty">暂无施工中装修申请</view>
          <view v-for="a in applyOptions" :key="a.id" class="apply-option" @tap="selectApply(a)">
            <text class="apply-option-title">{{ a.merchant }} - {{ a.shop }}</text>
            <text class="apply-option-sub">申请编号：{{ a.id }} · {{ isReportedToday(a.id) ? '今日已报备' : '今日待报备' }}</text>
          </view>
        </scroll-view>
        <view class="apply-picker-cancel" @tap="showPicker = false">取消</view>
      </view>
    </view>
  </view>
</template>

<script>
const {
  getDailyReportEligibleApply, getTodaySpecialWorkInfo, getDailyReportRecord, submitDailyReport,
  SPECIAL_TYPE_LABEL, MERCHANT_UNDER_CONSTRUCTION_LIST, DAILY_REPORT_TODAY
} = require('@/utils/renovation-mock.js')

const PHOTO_MAX = 6
const SCENE_PHOTO_MAX = 9

export default {
  data() {
    return {
      PHOTO_MAX,
      SCENE_PHOTO_MAX,
      today: DAILY_REPORT_TODAY,
      applyOptions: [],
      showPicker: false,
      apply: {},
      todayInfo: { types: [], works: [] },
      record: null,
      content: '',
      scenePhotos: [],
      certPhotos: {}
    }
  },

  computed: {
    readonly() { return !!(this.record && this.record.reported) },
    applyDisplayText() {
      return this.apply.id ? `${this.apply.merchant} - ${this.apply.shop}（${this.apply.id}）` : '请选择装修申请'
    },
    typeLabelsText() { return this.todayInfo.types.map(t => this.typeLabel(t)).join('、') },
    electricWork() {
      return (this.todayInfo.works || []).find(w => w.type === 'electric') || null
    }
  },

  onLoad(options) {
    this.applyOptions = MERCHANT_UNDER_CONSTRUCTION_LIST
    const applyId = options.applyId || ''
    if (applyId) {
      const apply = getDailyReportEligibleApply(applyId)
      if (apply) { this.selectApply(apply); return }
    }
    if (this.applyOptions.length === 1) {
      this.selectApply(this.applyOptions[0])
    }
  },

  methods: {
    typeLabel(type) { return SPECIAL_TYPE_LABEL[type] || type },

    isReportedToday(id) {
      const r = getDailyReportRecord(id, this.today)
      return !!(r && r.reported)
    },

    selectApply(apply) {
      this.apply = apply
      this.showPicker = false
      this.todayInfo = getTodaySpecialWorkInfo(apply.id)
      this.record = getDailyReportRecord(apply.id, this.today)

      if (this.record && this.record.reported) {
        this.content = this.record.content || ''
        this.scenePhotos = (this.record.scenePhotos || []).slice()
        const certs = {}
        this.todayInfo.types.forEach(t => { certs[t] = ((this.record.certsByType || {})[t] || []).slice() })
        this.certPhotos = certs
      } else {
        this.content = ''
        this.scenePhotos = []
        const certs = {}
        this.todayInfo.types.forEach(t => { certs[t] = [] })
        this.certPhotos = certs
      }
    },

    choosePhoto(target) {
      const list = target === 'scene' ? this.scenePhotos : (this.certPhotos[target] || (this.certPhotos[target] = []))
      const max = target === 'scene' ? SCENE_PHOTO_MAX : PHOTO_MAX
      if (list.length >= max) {
        uni.showToast({ title: `最多上传${max}张`, icon: 'none' })
        return
      }
      uni.chooseMedia({
        count: max - list.length,
        mediaType: ['image'],
        sourceType: ['camera', 'album'],
        success: (res) => {
          const urls = res.tempFiles.map(f => f.tempFilePath)
          if (target === 'scene') {
            this.scenePhotos = [...this.scenePhotos, ...urls]
          } else {
            this.certPhotos = { ...this.certPhotos, [target]: [...(this.certPhotos[target] || []), ...urls] }
          }
        }
      })
    },

    goHistory() {
      uni.navigateTo({ url: `/pages/merchant-daily-report-list/index?applyId=${encodeURIComponent(this.apply.id)}` })
    },

    submit() {
      if (!this.content.trim()) {
        uni.showToast({ title: '请填写今日施工内容', icon: 'none' }); return
      }
      if (!this.scenePhotos.length) {
        uni.showToast({ title: '请上传现场施工图照片', icon: 'none' }); return
      }
      const missing = this.todayInfo.types.filter(t => !(this.certPhotos[t] || []).length)
      if (missing.length) {
        uni.showToast({ title: `请上传${missing.map(t => this.typeLabel(t)).join('、')}现场拍照`, icon: 'none' }); return
      }
      submitDailyReport(this.apply.id, {
        content: this.content.trim(),
        scenePhotos: this.scenePhotos.slice(),
        certsByType: JSON.parse(JSON.stringify(this.certPhotos))
      })
      uni.showToast({ title: '每日报备已提交', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 1200)
    }
  }
}
</script>

<style>
.page { display: flex; flex-direction: column; height: 100vh; background: #FFFFFF; overflow: hidden; }
.scroll-body { flex: 1; overflow: hidden; padding: 20rpx 0; }

/* 申请信息卡片（选择装修申请） */
.form-card { background: #FFFFFF; padding: 0 36rpx; margin-bottom: 40rpx; }
.form-card:first-child { margin-top: 0; }
.form-field { margin-bottom: 40rpx; }
.form-field-last { margin-bottom: 0; }
.form-field-info { border-bottom: 2rpx solid #F0F0F0; }
.f-label-row { display: flex; align-items: flex-start; margin-bottom: 24rpx; }
.f-label { font-size: 28rpx; font-weight: 500; color: #333333; }
.req { color: var(--color-danger); margin-right: 4rpx; font-size: 28rpx; }
.date-row { display: flex; align-items: center; justify-content: space-between; padding: 0 0 12rpx; }
.date-arrow { width: 32rpx; height: 32rpx; flex-shrink: 0; }

.empty-tip-block { padding: 120rpx 60rpx; text-align: center; color: var(--color-text-hint); font-size: 26rpx; }

/* 基本信息模块（矩形边框卡片） */
.info-card { background: #FAFAFA; border-radius: 20rpx; border: 2rpx solid #E6E6E6; margin: 0 28rpx 20rpx; padding: 20rpx 28rpx 12rpx; }
.info-card .sec-title { margin-bottom: 8rpx; margin-left: 0; }
.detail-row { display: flex; align-items: flex-start; padding: 12rpx 0; font-size: 26rpx; }
.detail-label { width: 160rpx; flex-shrink: 0; color: #666; text-align: right; line-height: 1.5; }
.detail-label::after { content: '：'; }
.detail-value { color: var(--color-text-primary); text-align: left; flex: 1; line-height: 1.5; padding-left: 4rpx; }

/* 状态提示横幅 */
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

/* section block（现场拍照类模块，对齐签到踏勘页规范） */
.section-block { padding: 0 28rpx; margin-bottom: 40rpx; }
.req-row { display: flex; align-items: center; gap: 4rpx; margin-bottom: 20rpx; }
.req-star { font-size: 28rpx; color: var(--color-danger); font-weight: 600; line-height: 1; }
.block-title { font-size: 28rpx; font-weight: 600; color: #333333; }
.upload-rule { display: block; font-size: 22rpx; color: var(--color-text-hint); margin-bottom: 20rpx; line-height: 1.5; }
.empty-tip { display: block; font-size: 24rpx; color: var(--color-text-hint); }

.special-title { font-size: 28rpx; font-weight: 500; color: #333333; }
.electric-meta { display: block; font-size: 24rpx; color: #666666; line-height: 1.6; margin: 16rpx 0; }
.electric-line { display: block; margin-top: 4rpx; }
.electric-strong { font-weight: 600; color: var(--color-text-primary); }

/* 取景框 / 新增占位 */
.upload-img { width: 320rpx; height: 270rpx; display: block; border-radius: 16rpx; }
.photo-grid { display: flex; flex-wrap: wrap; gap: 16rpx; }
.photo-thumb { position: relative; width: 320rpx; height: 270rpx; border-radius: 16rpx; overflow: hidden; flex-shrink: 0; background: #f0f0f0; }
.photo-img { width: 100%; height: 100%; }
.photo-del { position: absolute; top: 8rpx; right: 8rpx; width: 44rpx; height: 44rpx; background: rgba(0,0,0,0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.del-x { color: #fff; font-size: 30rpx; line-height: 1; }

/* 今日施工内容文本域 */
.textarea-box { position: relative; background: #fff; border: 2rpx solid #D2D6E2; border-radius: 10rpx; padding: 20rpx; height: 182rpx; box-sizing: border-box; }
.desc-ta { width: 100%; height: 100%; font-size: 26rpx; color: #333333; line-height: 1.5; background: transparent; }
.desc-ta.ta-readonly { color: #666666; }
.ta-ph { color: #CCCCCC; font-size: 26rpx; font-weight: 400; }
.char-count { position: absolute; bottom: 20rpx; right: 20rpx; font-size: 24rpx; color: #CCCCCC; }

.bottom-bar { background: #fff; border-top: 2rpx solid #EDEDED; height: 180rpx; padding: 12rpx 36rpx 0; display: flex; align-items: flex-start; gap: 30rpx; box-sizing: border-box; flex-shrink: 0; }

/* 选择装修申请弹窗（对齐「增项申请-新增增项申请」页规范） */
.upload-sheet-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
.upload-sheet { width: 100%; background: #FFFFFF; border-radius: 24rpx 24rpx 0 0; padding-bottom: env(safe-area-inset-bottom); }
.upload-sheet-title { font-size: 32rpx; font-weight: 600; color: rgba(0,0,0,0.9); text-align: center; padding: 40rpx 32rpx; }
.sheet-title-line { height: 1rpx; background: #EBEBEB; margin: 0 36rpx; }
.apply-picker-sheet { padding-bottom: 0 !important; }
.apply-option { padding: 24rpx 36rpx; border-bottom: 1rpx solid #F0F0F0; }
.apply-option:last-child { border-bottom: none; }
.apply-option-title { display: block; font-size: 28rpx; font-weight: 600; color: #333333; margin-bottom: 8rpx; }
.apply-option-sub { display: block; font-size: 24rpx; color: #999999; }
.apply-picker-cancel { font-size: 28rpx; color: #666666; text-align: center; padding: 40rpx 0 100rpx; border-top: 1rpx solid #EBEBEB; margin-top: 8rpx; }
.picker-empty { padding: 60rpx 0; text-align: center; font-size: 26rpx; color: #999999; }
</style>
