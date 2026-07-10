<template>
  <view class="page" :style="{ paddingBottom: canResubmit ? '200rpx' : '136rpx' }">

    <!-- 状态提示横幅 -->
    <view v-if="banner" :class="['notice-banner', 'notice-' + banner.type]">
      <view class="notice-icon-wrap">
        <text class="notice-icon-text">!</text>
      </view>
      <view class="notice-body">
        <text class="notice-title">{{ banner.title }}</text>
        <text class="notice-text">{{ banner.text }}</text>
      </view>
    </view>

    <!-- 基本信息 -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">基本信息</text></view>
      <view class="detail-row"><text class="detail-label">申请编号</text><text class="detail-value">{{ item.id }}</text></view>
      <view class="detail-row"><text class="detail-label">作业类型</text><text class="detail-value">{{ typeLabel }}</text></view>
      <view class="detail-row"><text class="detail-label">关联装修申请</text><text class="detail-value">{{ item.applyId }}</text></view>
      <view class="detail-row"><text class="detail-label">商户名称</text><text class="detail-value">{{ item.merchant }}</text></view>
      <view class="detail-row"><text class="detail-label">商铺号</text><text class="detail-value">{{ item.shop }}</text></view>
      <view class="detail-row"><text class="detail-label">申请时间</text><text class="detail-value">{{ item.date }}</text></view>
      <view class="detail-row">
        <text class="detail-label">当前状态</text>
        <text class="detail-value" :style="{ color: statusColor }">{{ sc.text }}</text>
      </view>
    </view>

    <!-- 作业信息 -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">作业信息</text></view>
      <view class="detail-row"><text class="detail-label">{{ workDateLabel }}</text><text class="detail-value">{{ workDateValue }}</text></view>
      <view v-if="item.type === 'electric'" class="detail-row">
        <text class="detail-label">临时用电点位数</text>
        <text class="detail-value">{{ item.electricPointCount != null ? item.electricPointCount + ' 个' : '—' }}</text>
      </view>
      <view class="detail-row"><text class="detail-label">作业地点</text><text class="detail-value">{{ item.workLocation }}</text></view>
      <view class="detail-row"><text class="detail-label">作业内容</text><text class="detail-value">{{ item.workContent }}</text></view>
      <view class="detail-row"><text class="detail-label">作业负责人</text><text class="detail-value">{{ item.supervisor }}</text></view>
      <view class="detail-row"><text class="detail-label">联系电话</text><text class="detail-value">{{ item.supervisorPhone }}</text></view>
      <view class="detail-row"><text class="detail-label">作业人数</text><text class="detail-value">{{ item.workerCount }} 人</text></view>
    </view>

    <!-- 附件资料 -->
    <view class="detail-section detail-section-attach">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">附件资料</text></view>
      <view v-for="(att, i) in attachments" :key="i" class="attach-cat">
        <view class="attach-cat-label">{{ att.label }}</view>
        <view class="attach-file-row">
          <image class="attach-file-icon"
            :src="att.type === 'pdf' ? '/static/images/icon-file-pdf.png' : '/static/images/icon-file-img.png'"
            mode="aspectFit" />
          <text class="attach-file-name">{{ att.name }}</text>
          <view class="attach-actions">
            <image class="attach-action-icon" src="/static/images/icon-preview.png" mode="aspectFit" />
            <image class="attach-action-icon" src="/static/images/icon-download.png" mode="aspectFit" />
          </view>
        </view>
      </view>
    </view>

    <!-- 申请记录时间线 -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">申请记录</text></view>
      <view class="timeline">
        <view v-for="(node, idx) in timeline" :key="idx" class="tl-item">
          <view class="tl-axis">
            <view :class="['tl-dot', dotCls(node.result)]"></view>
            <view v-if="idx < timeline.length - 1" class="tl-line"></view>
          </view>
          <view class="tl-content">
            <view class="tl-hd">
              <text class="tl-dept">{{ node.dept }}</text>
              <text :class="['tl-status', statusCls(node.result)]">{{ node.text }}</text>
            </view>
            <view v-if="node.person || node.time" class="tl-meta">
              <text v-if="node.person">{{ node.person }}</text>
              <text v-if="node.time">{{ node.time }}</text>
            </view>
            <text v-if="node.opinion" :class="['tl-opinion', node.result === 'reject' ? 'tl-opinion-danger' : '']">{{ node.opinion }}</text>
          </view>
        </view>
      </view>
    </view>

  </view>

  <!-- 底部操作栏 -->
  <view class="bottom-bar">
    <button v-if="canResubmit" class="btn btn-outline-green" @tap="goBack">返回列表</button>
    <button v-if="canResubmit" class="btn btn-primary" @tap="goResubmit">重新申请</button>
    <button v-if="!canResubmit" class="btn btn-outline-green full" @tap="goBack">返回列表</button>
  </view>
</template>

<script>
const { MERCHANT_SPECIAL_DATA, MERCHANT_SPECIAL_STATUS, SPECIAL_TYPE_LABEL, buildMerchantSpecialDetailData } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return { tab:'', item:{}, sc:{}, banner:null, attachments:[], timeline:[], canResubmit:false }
  },
  computed: {
    typeLabel() { return SPECIAL_TYPE_LABEL[this.item.type] || '—' },
    statusColor() {
      const map = { 'status-green': '#1ABA6C', 'status-orange': '#FA8C16', 'status-red': '#FA2B2D', 'status-grey': '#999999' }
      return map[this.sc.cls] || '#333333'
    },
    workDateLabel() {
      if (this.item.type === 'electric') return '用电周期'
      if (this.item.type === 'height')   return '高空作业日期'
      return '动火作业日期'
    },
    workDateValue() {
      if (this.item.type === 'electric') return this.item.workDate || '—'
      return this.item.workTime ? this.item.workTime.split(' ')[0] : '—'
    },
  },
  onLoad(options) {
    const tab = options.tab || 'reviewing'
    const id  = decodeURIComponent(options.id || '')
    this.tab  = tab
    const list = MERCHANT_SPECIAL_DATA[tab] || []
    const item = list.find(d => d.id === id) || {}
    this.item  = item

    const bannerMap = {
      reviewing: { type: 'orange', title: '审核中',  text: '当前审批环节：' + (item.currentStep || '审批中') + '，预计1-3个工作日完成审核。' },
      rejected:  { type: 'red',    title: '已驳回',  text: '请查看驳回原因后修改并重新提交。' },
      expired:   { type: 'grey',   title: '已过期',  text: '该申请曾审核通过，但已超过批准作业时间，无法继续作业，请重新提交申请。' },
      approved:  { type: 'green',  title: '已通过',  text: '特殊作业申请已审核通过，请按批准时间作业并落实安全措施。' }
    }
    this.banner = bannerMap[tab] || null

    const d = buildMerchantSpecialDetailData(tab, item)
    this.sc           = d.sc
    this.attachments  = d.attachments
    this.timeline     = d.timeline
    this.canResubmit  = d.canResubmit
    uni.setNavigationBarTitle({ title: (SPECIAL_TYPE_LABEL[item.type] || '特殊作业') + '详情' })
  },
  methods: {
    dotCls(result) {
      if (result === 'pass')    return 'dot-pass'
      if (result === 'reject')  return 'dot-reject'
      if (result === 'expired') return 'dot-expired'
      return 'dot-waiting'
    },
    statusCls(result) {
      if (result === 'pass')    return 'tl-pass'
      if (result === 'reject')  return 'tl-reject'
      if (result === 'expired') return 'tl-expired'
      return 'tl-waiting'
    },
    goBack() { uni.navigateBack() },
    goResubmit() {
      uni.navigateTo({ url: `/pages/merchant-special-apply/index?resubmit=1&id=${encodeURIComponent(this.item.id)}&type=${encodeURIComponent(this.item.type)}&applyId=${encodeURIComponent(this.item.applyId)}` })
    },
  }
}
</script>

<style>
.page { background:#FFFFFF; min-height:100vh; padding-top:20rpx; }

/* 状态提示横幅 */
.notice-banner { display:flex; align-items:flex-start; gap:16rpx; border-radius:16rpx; padding:24rpx; margin:0 28rpx 20rpx; }
.notice-red    { background:rgba(250,43,45,0.05); }
.notice-orange { background:rgba(241,146,4,0.08); }
.notice-green  { background:rgba(26,186,108,0.06); }
.notice-grey   { background:#F5F5F5; }
.notice-icon-wrap { width:36rpx; height:36rpx; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:4rpx; }
.notice-red    .notice-icon-wrap { background:#FA2B2D; }
.notice-orange .notice-icon-wrap { background:#F19204; }
.notice-green  .notice-icon-wrap { background:#1ABA6C; }
.notice-grey   .notice-icon-wrap { background:#999999; }
.notice-icon-text { font-size:22rpx; font-weight:700; color:#FFFFFF; line-height:1; }
.notice-body { flex:1; }
.notice-title { display:block; font-size:26rpx; font-weight:600; margin-bottom:8rpx; }
.notice-text  { display:block; font-size:24rpx; line-height:1.6; }
.notice-red    .notice-title, .notice-red    .notice-text { color:#FA2B2D; }
.notice-orange .notice-title, .notice-orange .notice-text { color:#F19204; }
.notice-green  .notice-title, .notice-green  .notice-text { color:#1ABA6C; }
.notice-grey   .notice-title, .notice-grey   .notice-text { color:#999999; }

/* section */
.detail-section { background:#FFFFFF; padding:28rpx; margin-bottom:20rpx; }
.sec-title { display:flex; align-items:center; gap:12rpx; margin-bottom:24rpx; }
.sec-bar   { width:8rpx; height:36rpx; background:#1ABA6C; border-radius:0 8rpx 8rpx 0; flex-shrink:0; }
.sec-label { font-size:28rpx; font-weight:600; color:#333333; }
.detail-row { display:flex; justify-content:space-between; align-items:flex-start; padding:16rpx 0; border-bottom:2rpx solid #F0F0F0; font-size:26rpx; }
.detail-row:last-child { border-bottom:none; padding-bottom:0; }
.detail-section .sec-title + .detail-row { padding-top:0; }
.detail-label { color:#999999; flex-shrink:0; margin-right:20rpx; }
.detail-value { color:#333333; text-align:right; flex:1; line-height:1.5; }

/* 附件 */
.detail-section-attach { background:#FAFAFA; border:1rpx solid #E6E6E6; border-radius:10rpx; padding:20rpx 24rpx 28rpx; margin:0 28rpx 20rpx; }
.attach-cat { margin-bottom:20rpx; }
.attach-cat:last-child { margin-bottom:0; }
.attach-cat-label { font-size:26rpx; font-weight:600; color:#333333; margin-bottom:16rpx; }
.attach-file-row { display:flex; align-items:center; gap:16rpx; padding:0 20rpx 0 26rpx; height:100rpx; background:#F2FAFE; border:1rpx solid #D1E2EB; border-radius:16rpx; box-sizing:border-box; }
.attach-file-icon { width:48rpx; height:48rpx; flex-shrink:0; }
.attach-file-name { flex:1; font-size:25rpx; color:#000; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.attach-actions   { display:flex; align-items:center; gap:24rpx; flex-shrink:0; }
.attach-action-icon { width:48rpx; height:48rpx; flex-shrink:0; }

/* 时间线 */
.timeline { padding-left:26rpx; }
.tl-item  { display:flex; padding-bottom:44rpx; position:relative; }
.tl-item:last-child { padding-bottom:0; }
.tl-axis  { position:absolute; left:-26rpx; top:0; bottom:0; width:10rpx; display:flex; flex-direction:column; align-items:center; }
.tl-dot   { width:10rpx; height:10rpx; border-radius:9999rpx; flex-shrink:0; background:#B3B3B3; z-index:1; margin-top:12rpx; }
.dot-pass   { background:#1ABA6C; }
.dot-waiting{ background:#F19204; }
.dot-reject { background:#FA2B2D; }
.dot-expired{ background:#D9D9D9; }
.tl-line  { flex:1; width:2rpx; background:#E0E0E0; margin-top:16rpx; }
.tl-content { flex:1; }
.tl-hd    { display:flex; justify-content:space-between; align-items:center; }
.tl-dept  { font-size:24rpx; font-weight:600; color:#000; flex:1; }
.tl-status{ font-size:24rpx; font-weight:600; white-space:nowrap; margin-left:16rpx; }
.tl-pass    { color:#1ABA6C; }
.tl-waiting { color:#F19204; }
.tl-reject  { color:#FA2B2D; }
.tl-expired { color:#999999; }
.tl-meta  { display:flex; gap:24rpx; font-size:24rpx; color:#666; margin-bottom:8rpx; margin-top:4rpx; }
.tl-opinion { font-size:24rpx; color:#666; line-height:1.5; display:block; }
.tl-opinion-danger { color:#FA2B2D; }

/* 底部操作栏 */
.bottom-bar { position:fixed; left:0; right:0; bottom:0; display:flex; gap:24rpx; padding:20rpx 28rpx calc(20rpx + env(safe-area-inset-bottom)); background:#FFFFFF; border-top:2rpx solid #EDEDED; }
.btn { display:flex; align-items:center; justify-content:center; height:88rpx; border-radius:44rpx; font-size:30rpx; font-weight:600; flex:1; border:none; }
.btn-primary       { background:#1ABA6C; color:#fff; }
.btn-outline-green { background:#fff; color:#1ABA6C; border:2rpx solid #1ABA6C; }
.btn.full { flex:1; }
</style>
