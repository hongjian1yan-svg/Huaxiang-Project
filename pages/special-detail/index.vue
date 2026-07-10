<template>
  <view class="page" :style="{ paddingBottom: btnPrimary ? '200rpx' : '40rpx' }">

    <!-- 商户信息 -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">商户信息</text></view>
      <view class="detail-row"><text class="detail-label">商户名称</text><text class="detail-value">{{ item.merchant }}</text></view>
      <view class="detail-row"><text class="detail-label">商铺号</text><text class="detail-value">{{ item.shop }}</text></view>
      <view class="detail-row"><text class="detail-label">联系人</text><text class="detail-value">{{ item.contact }}</text></view>
      <view class="detail-row"><text class="detail-label">申请时间</text><text class="detail-value">{{ item.date }}</text></view>
      <view class="detail-row"><text class="detail-label">申请编号</text><text class="detail-value">{{ item.id }}</text></view>
      <view class="detail-row"><text class="detail-label">关联装修申请</text><text class="detail-value">{{ item.applyId }}</text></view>
      <view class="detail-row">
        <text class="detail-label">当前状态</text>
        <text class="detail-value" :style="{ color: statusColor }">{{ sc.text }}</text>
      </view>
      <view v-if="item.currentStep" class="detail-row">
        <text class="detail-label">当前环节</text><text class="detail-value">{{ item.currentStep }}</text>
      </view>
      <!-- 已通过：有效期 -->
      <view v-if="item.validUntil && (tab === 'approved' || tab === 'expired')" class="detail-row">
        <text class="detail-label">作业有效期至</text><text class="detail-value">{{ item.validUntil ? item.validUntil.split(' ')[0] : '—' }}</text>
      </view>
      <!-- 已驳回：驳回信息 -->
      <template v-if="tab === 'rejected'">
        <view class="detail-row"><text class="detail-label">驳回时间</text><text class="detail-value">{{ item.rejectTime }}</text></view>
        <view class="detail-row"><text class="detail-label">驳回说明</text><text class="detail-value" style="color:#FA2B2D;">{{ item.rejectReason }}</text></view>
        <view class="detail-row"><text class="detail-label">驳回人</text><text class="detail-value">{{ item.rejectPerson }}</text></view>
      </template>
    </view>

    <!-- 作业信息 -->
    <view class="cats-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">作业信息</text></view>
      <view class="cat-item" style="border-bottom:none;padding-top:0;">
        <view class="cat-hd">
          <view class="cat-left">
            <text class="cat-name">{{ typeLabel }}</text>
            <text class="dept-tag">{{ dept }}</text>
          </view>
          <text :class="['status-tag', sc.cls]">{{ sc.text }}</text>
        </view>
        <text class="cat-sub">{{ item.workContent }}</text>
        <view class="cat-dept-row">
          <text class="cat-dept-label">审批流程：</text>
          <text class="cat-dept-val">员工审核 — 主任审核</text>
        </view>
      </view>

      <!-- 公共字段 -->
      <view class="detail-row"><text class="detail-label">{{ workDateLabel }}</text><text class="detail-value">{{ workDateValue }}</text></view>
      <view v-if="item.type === 'electric' && item.electricPointCount != null" class="detail-row"><text class="detail-label">临时用电点位数</text><text class="detail-value">{{ item.electricPointCount }} 个</text></view>
      <view class="detail-row"><text class="detail-label">作业地点</text><text class="detail-value">{{ item.workLocation }}</text></view>
      <view class="detail-row"><text class="detail-label">作业负责人</text><text class="detail-value">{{ item.supervisor }}</text></view>
      <view class="detail-row"><text class="detail-label">联系电话</text><text class="detail-value">{{ item.supervisorPhone }}</text></view>
      <view class="detail-row"><text class="detail-label">作业人数</text><text class="detail-value">{{ item.workerCount }} 人</text></view>

      <!-- 高空作业专有字段 -->
      <template v-if="item.type === 'height'">
        <view v-if="item.workHeight" class="detail-row"><text class="detail-label">作业高度</text><text class="detail-value">{{ item.workHeight }}</text></view>
        <view v-if="item.heightGuards" class="detail-row"><text class="detail-label">防护措施</text><text class="detail-value">{{ item.heightGuards }}</text></view>
      </template>

      <!-- 动火作业专有字段 -->
      <template v-if="item.type === 'fire'">
        <view v-if="item.fireType" class="detail-row"><text class="detail-label">动火类型</text><text class="detail-value">{{ item.fireType }}</text></view>
        <view v-if="item.fireExtinguisher != null" class="detail-row"><text class="detail-label">灭火器数量</text><text class="detail-value">{{ item.fireExtinguisher }} 具</text></view>
        <view v-if="item.fireClear" class="detail-row"><text class="detail-label">可燃物清理</text><text class="detail-value">{{ item.fireClear }}</text></view>
      </template>

      <!-- 监护人、安全措施（所有作业类型，有值则显示） -->
      <view v-if="item.guardian" class="detail-row"><text class="detail-label">监护人</text><text class="detail-value">{{ item.guardian }}</text></view>
      <view v-if="item.safetyMeasures" class="detail-row"><text class="detail-label">安全措施</text><text class="detail-value">{{ item.safetyMeasures }}</text></view>

      <!-- 备注说明 -->
      <template v-if="item.remark">
        <text class="remark-label">备注说明</text>
        <text class="remark-text">{{ item.remark }}</text>
      </template>

      <!-- 过期说明 -->
      <template v-if="tab === 'expired' && item.expireReason">
        <text class="remark-label">过期说明</text>
        <text class="remark-text remark-danger">{{ item.expireReason }}</text>
      </template>
    </view>

    <!-- 附件资料 -->
    <view class="detail-section detail-section-attach">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">附件资料</text></view>
      <template v-for="(att, i) in attachments" :key="i">
        <view v-if="att.type === 'group-title'" class="attach-group-title">{{ att.label }}</view>
        <view v-else class="attach-cat">
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
      </template>
    </view>

    <!-- 特殊作业申请记录 -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">特殊作业申请记录</text></view>
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
    <button v-if="btnPrimary" class="btn btn-primary" @tap="onPrimary">{{ btnPrimary.text }}</button>
    <button v-else class="btn btn-outline-green" @tap="goBack">返回列表</button>
  </view>
</template>

<script>
const { SPECIAL_DATA, SPECIAL_TYPE_LABEL, SPECIAL_DEPT, buildSpecialDetailData } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return { tab:'', item:{}, sc:{}, attachments:[], timeline:[], btnPrimary:null }
  },
  computed: {
    statusColor() {
      const map = { 'status-green': '#1ABA6C', 'status-orange': '#F19204', 'status-red': '#FA2B2D', 'status-grey': '#999999' }
      return map[this.sc.cls] || '#333333'
    },
    typeLabel() { return SPECIAL_TYPE_LABEL[this.item.type] || '—' },
    dept()      { return SPECIAL_DEPT[this.item.type] || '物业部' },
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
    const tab = options.tab || 'my-review'
    const id  = decodeURIComponent(options.id || '')
    this.tab  = tab
    const list = SPECIAL_DATA[tab] || []
    const item = list.find(d => d.id === id) || {}
    this.item  = item
    const d = buildSpecialDetailData(tab, item)
    this.sc         = d.sc
    this.attachments = d.attachments
    this.timeline   = d.timeline
    this.btnPrimary = d.btnPrimary
    uni.setNavigationBarTitle({ title: d.sc.text })
  },
  methods: {
    dotCls() { return '' },
    statusCls(result) {
      if (result === 'pass')   return 'tl-pass'
      if (result === 'reject') return 'tl-reject'
      return 'tl-waiting'
    },
    goBack() { uni.navigateBack() },
    onPrimary() {
      if (!this.btnPrimary) return
      uni.navigateTo({
        url: `/pages/special-review/index?id=${encodeURIComponent(this.item.id)}&shop=${encodeURIComponent(this.item.shop)}&merchant=${encodeURIComponent(this.item.merchant)}&currentStep=${encodeURIComponent(this.item.currentStep || '')}&type=${encodeURIComponent(this.item.type)}`
      })
    }
  }
}
</script>

<style>
.page { background:#FFFFFF; min-height:100vh; padding-top:20rpx; }

/* 商户/作业信息 section */
.detail-section { background:#FFFFFF; padding:28rpx; margin-bottom:20rpx; }
.sec-title { display:flex; align-items:center; gap:12rpx; margin-bottom:24rpx; }
.sec-bar   { width:8rpx; height:36rpx; background:#1ABA6C; border-radius:0 8rpx 8rpx 0; flex-shrink:0; }
.sec-label { font-size:28rpx; font-weight:600; color:#333333; }
.detail-row { display:flex; justify-content:space-between; align-items:flex-start; padding:16rpx 0; border-bottom:2rpx solid #F0F0F0; font-size:26rpx; }
.detail-row:last-child { border-bottom:none; padding-bottom:0; }
.detail-section .sec-title + .detail-row { padding-top:0; }
.detail-label { color:#999999; flex-shrink:0; margin-right:20rpx; }
.detail-value { color:#333333; text-align:right; flex:1; line-height:1.5; }

/* 状态标签 */
.status-tag    { display:inline-flex; align-items:center; padding:4rpx 16rpx; border-radius:8rpx; font-size:22rpx; white-space:nowrap; line-height:1.4; }
.status-green  { background:#E8F9F0; color:#1ABA6C; }
.status-orange { background:rgba(241,146,4,0.1); color:#F19204; }
.status-red    { background:rgba(250,43,45,0.05); color:#FA2B2D; border:2rpx solid rgba(250,43,45,0.3); }
.status-grey   { background:#F5F5F5; color:#999999; }

/* 作业信息 cats-section */
.cats-section { background:#FAFAFA; border:2rpx solid #E6E6E6; border-radius:20rpx; padding:28rpx; margin:0 28rpx 20rpx; }
.cats-section .sec-title { margin-left:-28rpx; margin-bottom:0; }
.cat-item { padding:20rpx 0; border-bottom:2rpx solid #F0F0F0; }
.cat-item:last-child { border-bottom:none; padding-bottom:0; }
.cat-hd { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12rpx; gap:16rpx; }
.cat-left { display:flex; align-items:center; gap:16rpx; flex-wrap:wrap; flex:1; }
.cat-name { font-size:28rpx; font-weight:600; color:#333333; }
.dept-tag { font-size:20rpx; padding:4rpx 10rpx; border-radius:8rpx; background:#E8F9F0; color:#1ABA6C; border:2rpx solid rgba(26,186,108,0.3); font-weight:500; white-space:nowrap; }
.cat-sub { display:block; font-size:26rpx; color:#666666; margin-bottom:12rpx; line-height:1.5; }
.cat-dept-row { display:flex; font-size:24rpx; }
.cat-dept-label { color:#666666; flex-shrink:0; }
.cat-dept-val { color:#333333; }
.remark-label { display:block; font-size:28rpx; font-weight:600; color:#333333; margin-top:24rpx; margin-bottom:12rpx; }
.remark-text { display:block; font-size:26rpx; color:#333333; line-height:1.6; }
.remark-danger { color:#FA2B2D; }

/* 附件资料 */
.detail-section-attach { background:#FAFAFA; border:1rpx solid #E6E6E6; border-radius:10rpx; padding:20rpx 24rpx 28rpx; margin:0 28rpx 20rpx; }
.attach-group-title { font-size:28rpx; font-weight:600; color:#333333; margin-bottom:24rpx; }
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
.tl-line  { flex:1; width:2rpx; background:#E0E0E0; margin-top:16rpx; }
.tl-content { flex:1; }
.tl-hd    { display:flex; justify-content:space-between; align-items:center; }
.tl-dept  { font-size:24rpx; font-weight:600; color:#000; flex:1; }
.tl-status{ font-size:24rpx; font-weight:600; white-space:nowrap; margin-left:16rpx; }
.tl-pass    { color:#1ABA6C; }
.tl-waiting { color:#F19204; }
.tl-reject  { color:#FA2B2D; }
.tl-meta  { display:flex; gap:24rpx; font-size:24rpx; color:#666; margin-bottom:8rpx; margin-top:4rpx; }
.tl-opinion { font-size:24rpx; color:#666; line-height:1.5; display:block; }
.tl-opinion-danger { color:#FA2B2D; }
</style>
