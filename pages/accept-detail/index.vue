<template>
  <view class="page" :style="{ paddingBottom: hasBtn ? '200rpx' : '40rpx' }">

    <!-- 状态提示横幅 -->
    <view v-if="banner" :class="['notice-banner', 'notice-' + banner.type]">
      <view class="notice-icon-wrap"><text class="notice-icon-text">!</text></view>
      <view class="notice-body">
        <text class="notice-title">{{ banner.title }}</text>
        <text class="notice-text">{{ banner.desc }}</text>
      </view>
    </view>

    <!-- 验收申请信息 -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">验收申请信息</text></view>
      <view class="detail-row"><text class="detail-label">提交验收时间</text><text class="detail-value">{{ item.acceptDate }}</text></view>
      <view class="detail-row"><text class="detail-label">验收备注</text><text class="detail-value">{{ item.acceptRemark || '—' }}</text></view>
      <view v-if="(item.completionPhotos || []).length" class="detail-row photo-row">
        <text class="detail-label">竣工照片</text>
        <view class="detail-value photo-value">
          <view v-for="p in item.completionPhotos" :key="p" class="photo-thumb-item">
            <image class="photo-thumb-img" src="/static/images/uploadedImage.png" mode="aspectFill" />
          </view>
        </view>
      </view>
    </view>

    <!-- 申请基本信息 -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">申请基本信息</text></view>
      <view class="detail-row"><text class="detail-label">申请编号</text><text class="detail-value">{{ item.applyId }}</text></view>
      <view class="detail-row"><text class="detail-label">商户名称</text><text class="detail-value">{{ item.merchant }}</text></view>
      <view class="detail-row"><text class="detail-label">商铺号</text><text class="detail-value">{{ item.shop }}</text></view>
      <view class="detail-row"><text class="detail-label">计划装修周期</text><text class="detail-value">{{ item.decoratePeriod || '—' }}</text></view>
      <view class="detail-row"><text class="detail-label">申请时间</text><text class="detail-value">{{ item.applyDate }}</text></view>
      <view class="detail-row"><text class="detail-label">当前状态</text><text class="detail-value" :style="{ color: statusColor }">{{ sc.text }}</text></view>
      <view class="detail-row"><text class="detail-label">施工期间</text><text class="detail-value">{{ item.decoratePeriod || '—' }}</text></view>
      <view class="detail-row"><text class="detail-label">施工证号</text><text class="detail-value">{{ item.certNo }}</text></view>
      <view class="detail-row"><text class="detail-label">电子施工证</text><text class="detail-value cert-link-value" @tap="showCertModal = true">点击查看</text></view>
    </view>

    <!-- 装修类目及项目验收 -->
    <view class="cats-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">装修类目及项目验收</text></view>
      <view v-for="cat in categories" :key="cat.name" class="cat-item">
        <view class="cat-hd">
          <view class="cat-left">
            <text class="cat-name">{{ cat.name }}</text>
            <text v-if="cat.isMyDept" class="my-dept-tag">本部门负责</text>
          </view>
          <text :class="['status-tag', cat.statusCls]">{{ cat.statusText }}</text>
        </view>
        <text class="cat-sub">{{ cat.projectsText }}</text>
        <view class="cat-dept-row"><text class="cat-dept-label">责任部门：</text><text class="cat-dept-val">{{ cat.dept }}</text></view>
      </view>
    </view>

    <!-- 踏勘签到信息 -->
    <view v-if="showSurveyInfo" class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">踏勘签到信息</text></view>
      <view class="detail-row"><text class="detail-label">签到时间</text><text class="detail-value">{{ item.surveySignTime }}</text></view>
      <view class="detail-row"><text class="detail-label">签到人</text><text class="detail-value">{{ item.surveySignPerson || '—' }}</text></view>
      <view class="detail-row"><text class="detail-label">踏勘备注</text><text class="detail-value">{{ item.surveyRemark || '—' }}</text></view>
      <view class="detail-row photo-row">
        <text class="detail-label">现场拍照</text>
        <view class="detail-value photo-value">
          <view class="photo-thumb-item"><image class="photo-thumb-img" src="/static/images/uploadedImage.png" mode="aspectFill" /></view>
          <view class="photo-thumb-item"><image class="photo-thumb-img" src="/static/images/uploadedImage.png" mode="aspectFill" /></view>
        </view>
      </view>
    </view>

    <!-- 驳回信息 -->
    <view v-if="tab === 'rejected'" class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">驳回信息</text></view>
      <view class="detail-row"><text class="detail-label">驳回部门</text><text class="detail-value">{{ (item.rejectDept || '—') + '验收踏勘审核' }}</text></view>
      <view class="detail-row"><text class="detail-label">驳回时间</text><text class="detail-value">{{ item.rejectTime }}</text></view>
      <view class="detail-row"><text class="detail-label">审核人</text><text class="detail-value">{{ item.rejectPerson }}</text></view>
      <view class="detail-row"><text class="detail-label">驳回原因</text><text class="detail-value" style="color:var(--color-danger);">{{ item.rejectReason }}</text></view>
    </view>

    <!-- 验收流程记录 -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">验收流程记录</text></view>
      <view class="timeline">
        <view v-for="(node, idx) in timeline" :key="idx" class="tl-item">
          <view class="tl-axis">
            <view :class="['tl-dot', 'dot-' + node.result]"></view>
            <view v-if="idx < timeline.length - 1" class="tl-line"></view>
          </view>
          <view class="tl-content">
            <view class="tl-hd">
              <text class="tl-dept">{{ node.dept }}</text>
              <text :class="['tl-status', 'tl-' + node.result]">{{ node.text }}</text>
            </view>
            <view v-if="node.person || node.time" class="tl-meta">
              <text v-if="node.person">{{ node.person }}</text>
              <text v-if="node.time">{{ node.time }}</text>
            </view>
            <text v-if="node.opinion && node.result !== 'reject'" class="tl-opinion">说明：{{ node.opinion }}</text>
            <text v-if="node.opinion && node.result === 'reject'" class="tl-opinion-reject">驳回原因：{{ node.opinion }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>

  <!-- 底部操作按钮 -->
  <view v-if="hasBtn" class="bottom-bar">
    <button v-if="btnAction === 'back'"   class="btn btn-outline-green" @tap="goBack">返回列表</button>
    <button v-else-if="btnAction === 'survey'" class="btn btn-primary" @tap="goSurvey">{{ btnText }}</button>
    <button v-else-if="btnAction === 'review'" class="btn btn-primary" @tap="goReview">{{ btnText }}</button>
  </view>

  <!-- 电子施工证弹窗 -->
  <view v-if="showCertModal" class="modal-overlay" @tap="showCertModal = false">
    <view class="cert-modal-wrap" @tap.stop>
      <view class="cert-modal-hd">
        <text class="cert-modal-title">电子施工证</text>
        <text class="cert-modal-close" @tap="showCertModal = false">×</text>
      </view>
      <view class="cert-card">
        <view class="cert-card-hd">
          <text class="cert-card-main-title">装修施工证</text>
          <text class="cert-card-sub-title">RENOVATION CONSTRUCTION PERMIT</text>
        </view>
        <view class="cert-row"><text class="cert-label">装修商户</text><text class="cert-val">{{ item.merchant }}</text></view>
        <view class="cert-row"><text class="cert-label">商铺号</text><text class="cert-val">{{ item.shop }}</text></view>
        <view class="cert-row"><text class="cert-label">装修内容</text><text class="cert-val">{{ (item.tags || []).join('·') }}</text></view>
        <view class="cert-row"><text class="cert-label">有效期</text><text class="cert-val">{{ item.decoratePeriod || '—' }}</text></view>
        <view class="cert-row cert-row-last"><text class="cert-label">施工证编号</text><text class="cert-val cert-code">{{ item.certNo }}</text></view>
        <view class="cert-qr-wrap">
          <view class="cert-qr-placeholder">二维码</view>
          <text class="cert-qr-caption">微信扫描查看装修申请信息</text>
        </view>
      </view>
      <view class="cert-modal-btns">
        <button class="btn btn-primary" @tap="downloadCert">📥 下载施工证</button>
        <button class="btn btn-outline-green" @tap="showCertModal = false">关闭</button>
      </view>
    </view>
  </view>
</template>

<script>
const { ACCEPT_DATA, ACCEPT_STATUS, buildAcceptDetailData } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return {
      tab: '', item: {}, sc: {}, categories: [], banner: null, showSurveyInfo: false,
      timeline: [], btnAction: 'back', btnText: '返回列表', hasBtn: true, showCertModal: false
    }
  },

  computed: {
    statusColor() {
      if (this.tab === 'approved') return 'var(--color-primary)'
      if (this.tab === 'rejected') return 'var(--color-danger)'
      return 'var(--color-warning)'
    }
  },

  onLoad(options) {
    const tab = options.tab || 'pending-survey'
    const id = decodeURIComponent(options.id || '')
    this.tab = tab
    const list = ACCEPT_DATA[tab] || []
    this.item = list.find(d => d.id === id) || {}
    const d = buildAcceptDetailData(tab, this.item)
    this.sc = d.sc
    this.categories = d.categories
    this.banner = d.banner
    this.showSurveyInfo = d.showSurveyInfo
    this.timeline = d.timeline
    this.btnAction = d.btnPrimary ? d.btnPrimary.action : 'back'
    this.btnText = d.btnPrimary ? d.btnPrimary.text : d.btnSecondary.text
    this.hasBtn = true
    uni.setNavigationBarTitle({ title: (ACCEPT_STATUS[tab] || {}).text || '验收详情' })
  },

  methods: {
    goBack() { uni.navigateBack() },

    downloadCert() {
      uni.showToast({ title: '下载施工证功能开发中', icon: 'none' })
    },

    goSurvey() {
      uni.navigateTo({
        url: `/pages/survey-checkin/index?scene=accept&shopNo=${encodeURIComponent(this.item.shop)}&itemId=${encodeURIComponent(this.item.id)}&category=${encodeURIComponent((this.item.tags || []).join('、'))}&merchant=${encodeURIComponent(this.item.merchant)}`
      })
    },

    goReview() {
      uni.navigateTo({
        url: `/pages/accept-review/index?id=${encodeURIComponent(this.item.id)}&applyId=${encodeURIComponent(this.item.applyId)}&shop=${encodeURIComponent(this.item.shop)}&merchant=${encodeURIComponent(this.item.merchant)}&categories=${encodeURIComponent((this.item.tags || []).join('、'))}`
      })
    }
  }
}
</script>

<style>
.page { background: var(--color-bg-page); min-height: 100vh; }

.detail-section { background: #FFFFFF; padding: 28rpx; margin: 0 0 20rpx; }
.sec-title { display: flex; align-items: center; gap: 12rpx; margin-bottom: 24rpx; }
.sec-bar { width: 8rpx; height: 36rpx; background: var(--color-primary); border-radius: 0 8rpx 8rpx 0; flex-shrink: 0; }
.sec-label { font-size: 28rpx; font-weight: 600; color: #333333; }

.detail-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 16rpx 0; font-size: 26rpx; border-bottom: 2rpx solid #F0F0F0; }
.detail-section .sec-title + .detail-row { padding-top: 0; }
.detail-row:last-of-type { border-bottom: none; }
.detail-label { color: #999999; flex-shrink: 0; margin-right: 20rpx; }
.detail-value { color: #333333; text-align: right; flex: 1; line-height: 1.5; }

.cert-link-value { color: var(--color-primary); text-decoration: underline; }

.photo-row { align-items: flex-start; }
.photo-value { display: flex; flex-wrap: wrap; gap: 16rpx; justify-content: flex-end; }
.photo-thumb-item { width: calc(50% - 8rpx); height: 160rpx; border-radius: 16rpx; overflow: hidden; background: #f0f0f0; flex-shrink: 0; }
.photo-thumb-img { width: 100%; height: 100%; }

/* 装修类目及项目验收 */
.cats-section { background: #FAFAFA; border: 2rpx solid #E6E6E6; border-radius: 20rpx; padding: 28rpx; margin: 0 28rpx 20rpx; }
.cat-item { padding: 20rpx 0; border-bottom: 2rpx solid #F0F0F0; }
.cat-item:last-of-type { border-bottom: none; padding-bottom: 0; }
.cat-hd { display: flex; justify-content: space-between; align-items: flex-start; gap: 16rpx; margin-bottom: 12rpx; }
.cat-left { display: flex; align-items: center; gap: 16rpx; flex-wrap: wrap; flex: 1; }
.cat-name { font-size: 28rpx; font-weight: 600; color: #333333; }
.my-dept-tag { font-size: 20rpx; font-weight: 500; padding: 4rpx 10rpx; border-radius: 4rpx; background: #E8F9F0; color: #1ABA6C; outline: 2rpx solid rgba(26,186,108,0.3); outline-offset: -2rpx; white-space: nowrap; }
.cat-sub { display: block; font-size: 26rpx; color: #666666; line-height: 1.5; margin-bottom: 12rpx; }
.cat-dept-row { display: flex; font-size: 24rpx; }
.cat-dept-label { color: #999999; flex-shrink: 0; }
.cat-dept-val { color: #333333; }

.status-tag { display: inline-flex; align-items: center; padding: 4rpx 16rpx; border-radius: 8rpx; font-size: 22rpx; white-space: nowrap; line-height: 1.4; }
.status-green  { background: #E8F9F0; color: #1ABA6C; }
.status-orange { background: rgba(241,146,4,0.1); color: #F19204; }
.status-red    { background: rgba(250,43,45,0.05); color: #FA2B2D; }

/* 状态提示横幅 */
.notice-banner { display: flex; align-items: flex-start; gap: 16rpx; border-radius: 16rpx; padding: 24rpx; margin: 0 28rpx 20rpx; }
.notice-red    { background: rgba(250,43,45,0.05); }
.notice-orange { background: rgba(241,146,4,0.08); }
.notice-green  { background: rgba(26,186,108,0.06); }
.notice-icon-wrap { width: 36rpx; height: 36rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 4rpx; }
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

/* 验收流程记录 */
.timeline { padding-left: 26rpx; }
.tl-item { display: flex; padding-bottom: 44rpx; position: relative; }
.tl-item:last-child { padding-bottom: 0; }
.tl-axis { position: absolute; left: -26rpx; top: 0; bottom: 0; width: 10rpx; display: flex; flex-direction: column; align-items: center; }
.tl-dot { width: 10rpx; height: 10rpx; border-radius: 9999rpx; flex-shrink: 0; background: #B3B3B3; z-index: 1; margin-top: 12rpx; }
.tl-line { flex: 1; width: 2rpx; background: #E0E0E0; margin-top: 16rpx; }
.tl-content { flex: 1; }
.tl-hd { display: flex; justify-content: space-between; align-items: center; }
.tl-dept { font-size: 24rpx; font-weight: 600; color: #000000; flex: 1; }
.tl-status { font-size: 24rpx; font-weight: 600; white-space: nowrap; margin-left: 16rpx; }
.tl-pass    { color: #1ABA6C; }
.tl-reject  { color: #FA2B2D; }
.tl-waiting { color: #F19204; }
.tl-meta { display: flex; gap: 24rpx; font-size: 24rpx; color: #666666; font-weight: 400; margin-bottom: 8rpx; }
.tl-opinion { font-size: 24rpx; color: #666666; font-weight: 400; line-height: 1.5; display: block; }
.tl-opinion-reject { font-size: 24rpx; color: #FA2B2D; font-weight: 400; line-height: 1.5; display: block; }

/* 底部操作按钮 */
.bottom-bar { position: fixed; left: 0; right: 0; bottom: 0; display: flex; gap: 30rpx; padding: 12rpx 36rpx env(safe-area-inset-bottom); background: #FFFFFF; border-top: 1rpx solid #EDEDED; }
.btn { flex: 1; height: 88rpx; border-radius: 12rpx; font-size: 32rpx; font-family: PingFang SC; border: none; display: flex; align-items: center; justify-content: center; }
.btn-primary { background: var(--color-primary); color: #FFFFFF; font-weight: 600; }
.btn-outline-green { background: #FFFFFF; color: var(--color-primary); border: 1rpx solid var(--color-primary); font-weight: 400; }

/* 电子施工证弹窗 */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center; }
.cert-modal-wrap { background: #FFFFFF; border-radius: 20rpx; width: 640rpx; overflow: hidden; }
.cert-modal-hd { display: flex; align-items: center; justify-content: space-between; padding: 24rpx 32rpx; border-bottom: 2rpx solid #F0F0F0; }
.cert-modal-title { font-size: 32rpx; font-weight: 600; color: #333333; }
.cert-modal-close { font-size: 40rpx; color: #999999; line-height: 1; }
.cert-card { margin: 24rpx; padding: 32rpx; background: linear-gradient(135deg, #fff 0%, #f0f8ff 50%, #e8f4fd 100%); border: 2rpx solid #b8d4e8; border-radius: 16rpx; }
.cert-card-hd { text-align: center; padding-bottom: 20rpx; margin-bottom: 8rpx; border-bottom: 2rpx dashed #b8d4e8; }
.cert-card-main-title { display: block; font-size: 32rpx; font-weight: 700; color: #1a5276; letter-spacing: 6rpx; }
.cert-card-sub-title { display: block; font-size: 20rpx; color: #7f8c8d; margin-top: 6rpx; }
.cert-row { display: flex; justify-content: space-between; padding: 14rpx 0; font-size: 24rpx; border-bottom: 2rpx solid #eef5fa; }
.cert-row-last { border-bottom: none; }
.cert-label { color: #7f8c8d; }
.cert-val   { color: #1a1a1a; font-weight: 500; }
.cert-code  { font-family: monospace; letter-spacing: 2rpx; }
.cert-qr-wrap { text-align: center; margin-top: 20rpx; padding-top: 20rpx; border-top: 2rpx dashed #b8d4e8; }
.cert-qr-placeholder { width: 140rpx; height: 140rpx; margin: 0 auto; border: 2rpx solid #ccc; border-radius: 8rpx; display: flex; align-items: center; justify-content: center; font-size: 22rpx; color: #999999; }
.cert-qr-caption { display: block; font-size: 20rpx; color: #999999; margin-top: 8rpx; }
.cert-modal-btns { display: flex; gap: 20rpx; padding: 0 32rpx 32rpx; }
.cert-modal-btns .btn { flex: 1; height: 76rpx; font-size: 28rpx; }
</style>
