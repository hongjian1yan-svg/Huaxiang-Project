<template>
  <view class="page" :style="{ paddingBottom: btnPrimary ? '200rpx' : '40rpx' }">

    <!-- 商户信息 -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">商户信息</text></view>
      <view class="detail-row"><text class="detail-label">商户名称</text><text class="detail-value">{{ item.merchant }}</text></view>
      <view class="detail-row"><text class="detail-label">商铺号</text><text class="detail-value">{{ item.shop }}</text></view>
      <view class="detail-row"><text class="detail-label">联系人</text><text class="detail-value">{{ item.contact }}</text></view>
      <view class="detail-row"><text class="detail-label">申请时间</text><text class="detail-value">{{ item.date }}</text></view>
      <view class="detail-row"><text class="detail-label">增项编号</text><text class="detail-value">{{ item.id }}</text></view>
      <view class="detail-row"><text class="detail-label">关联装修申请</text><text class="detail-value">{{ item.applyId }}</text></view>
      <view class="detail-row"><text class="detail-label">当前状态</text><text class="detail-value" :style="{ color: statusColor }">{{ sc.text }}</text></view>
      <view v-if="tab === 'approval-in-progress' && item.currentStep" class="detail-row">
        <text class="detail-label">当前环节</text><text class="detail-value">{{ item.currentStep }}</text>
      </view>
      <view class="detail-row"><text class="detail-label">是否申请延期</text><text class="detail-value">{{ item.needDelay ? '是' : '否' }}</text></view>
      <view v-if="item.needDelay && item.delayTo" class="detail-row">
        <text class="detail-label">申请延至</text><text class="detail-value">{{ item.delayTo }}</text>
      </view>
    </view>

    <!-- 当前装修类目及项目 -->
    <view v-if="currentCategories.length" class="cats-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">当前装修类目及项目</text></view>
      <view v-for="cat in currentCategories" :key="cat.name" class="cat-item">
        <view class="cat-hd">
          <view class="cat-left">
            <text class="cat-name">{{ cat.name }}</text>
            <text v-if="cat.isMyDept" class="my-dept-tag">本部门负责</text>
          </view>
          <text :class="['status-tag', cat.statusCls]">{{ cat.statusText }}</text>
        </view>
        <view class="cat-projects">
          <view v-for="proj in cat.projects" :key="proj.name" class="cat-proj-item">
            <text class="cat-proj-name">{{ proj.name }}</text>
            <text :class="['status-tag', levelCls(proj.level)]">{{ proj.level }}级</text>
          </view>
        </view>
        <view class="cat-dept-row"><text class="cat-dept-label">责任部门：</text><text class="cat-dept-val">{{ cat.dept }}</text></view>
      </view>
    </view>

    <!-- 增项装修类目及项目 -->
    <view v-if="newCategories.length" class="cats-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">增项装修类目及项目</text></view>
      <view v-for="cat in newCategories" :key="cat.name" class="cat-item">
        <view class="cat-hd">
          <view class="cat-left">
            <text class="cat-name">{{ cat.name }}</text>
            <text v-if="cat.isMyDept" class="my-dept-tag">本部门负责</text>
          </view>
          <text :class="['status-tag', cat.statusCls]">{{ cat.statusText }}</text>
        </view>
        <view class="cat-projects">
          <view v-for="proj in cat.projects" :key="proj.name" class="cat-proj-item">
            <text class="cat-proj-name">{{ proj.name }}</text>
            <text :class="['status-tag', levelCls(proj.level)]">{{ proj.level }}级</text>
          </view>
        </view>
        <view class="cat-dept-row"><text class="cat-dept-label">责任部门：</text><text class="cat-dept-val">{{ cat.dept }}</text></view>
      </view>
    </view>

    <!-- 增项说明 -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">增项说明</text></view>
      <view class="detail-row"><text class="detail-label">增项原因</text><text class="detail-value">{{ item.reason }}</text></view>
    </view>

    <!-- 附件资料（已取消不展示） -->
    <view v-if="tab !== 'cancelled'" class="detail-section detail-section-attach">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">附件资料</text></view>
      <template v-for="(att, i) in attachments" :key="i">
        <view v-if="att.type === 'divider'" class="attach-divider" />
        <view v-else-if="att.type === 'group-title'" class="attach-group-title">{{ att.label }}</view>
        <view v-else class="attach-cat">
          <view class="attach-cat-label">{{ att.label }}</view>
          <view class="attach-file-row">
            <image class="attach-file-icon"
              :src="att.type==='pdf'?'/static/images/icon-file-pdf.png':'/static/images/icon-file-img.png'"
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

    <!-- 驳回信息（已驳回） -->
    <view v-if="tab === 'rejected'" class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">驳回信息</text></view>
      <view class="detail-row"><text class="detail-label">驳回类型</text><text class="detail-value" style="color:var(--color-danger);">{{ item.rejectType }}</text></view>
      <view class="detail-row"><text class="detail-label">驳回时间</text><text class="detail-value">{{ item.rejectTime }}</text></view>
      <view class="detail-row"><text class="detail-label">审核人</text><text class="detail-value">{{ item.rejectPerson }}</text></view>
      <view class="detail-row"><text class="detail-label">驳回原因</text><text class="detail-value" style="color:var(--color-danger);">{{ item.rejectReason }}</text></view>
    </view>

    <!-- 取消信息（已取消） -->
    <view v-if="tab === 'cancelled'" class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">取消信息</text></view>
      <view class="detail-row"><text class="detail-label">取消时间</text><text class="detail-value">{{ item.cancelTime }}</text></view>
      <view class="detail-row"><text class="detail-label">操作人</text><text class="detail-value">{{ item.cancelPerson }}</text></view>
      <view class="detail-row"><text class="detail-label">取消说明</text><text class="detail-value">{{ item.cancelReason }}</text></view>
    </view>

    <!-- 审核信息（已通过） -->
    <view v-if="auditInfo" class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">审核信息</text></view>
      <view class="detail-row"><text class="detail-label">通过时间</text><text class="detail-value">{{ auditInfo.approveTime }}</text></view>
      <view class="detail-row"><text class="detail-label">审核人</text><text class="detail-value">{{ auditInfo.approvePerson }}</text></view>
    </view>

    <!-- 增项申请记录（时间线） -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">增项申请记录</text></view>
      <view class="timeline">
        <view v-for="(node, idx) in timeline" :key="idx" class="tl-item">
          <view class="tl-axis">
            <view :class="['tl-dot', node.result==='pass'?'dot-pass':node.result==='waiting'?'dot-waiting':node.result==='cancel'?'dot-cancel':node.result==='reject'?'dot-reject':'dot-pass']"></view>
            <view v-if="idx < timeline.length - 1" class="tl-line"></view>
          </view>
          <view class="tl-content">
            <view class="tl-hd">
              <text class="tl-dept">{{ node.dept }}</text>
              <text :class="['tl-status', node.result==='pass'?'tl-pass':node.result==='waiting'?'tl-waiting':node.result==='cancel'?'tl-cancel':node.result==='reject'?'tl-reject':'tl-pass']">{{ node.text }}</text>
            </view>
            <view v-if="node.person || node.time" class="tl-meta">
              <text v-if="node.person">{{ node.person }}</text>
              <text v-if="node.time">{{ node.time }}</text>
            </view>
            <text v-if="node.opinion" class="tl-opinion">{{ node.opinion }}</text>
          </view>
        </view>
      </view>
    </view>

  </view>

  <!-- 底部操作栏 -->
  <view class="bottom-bar">
    <button v-if="btnPrimary" class="btn btn-primary" @tap="onPrimary">{{ btnPrimary.text }}</button>
    <button class="btn btn-outline-green" @tap="goBack">返回列表</button>
  </view>
</template>

<script>
const { ADD_ITEM_DATA, buildAddItemDetailData } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return { tab:'', item:{}, sc:{}, currentCategories:[], newCategories:[], attachments:[], auditInfo:null, timeline:[], btnPrimary:null, btnSecondary:null }
  },
  computed: {
    statusColor() {
      if (this.tab === 'completed')  return 'var(--color-primary)'
      if (this.tab === 'rejected')   return 'var(--color-danger)'
      if (this.tab === 'cancelled')  return 'var(--color-text-secondary, #999999)'
      return 'var(--color-warning)'
    }
  },
  onLoad(options) {
    const tab = options.tab || 'pending-survey'
    const id  = decodeURIComponent(options.id || '')
    this.tab  = tab
    const list = ADD_ITEM_DATA[tab] || []
    const item = list.find(d => d.id === id) || {}
    this.item  = item
    const d = buildAddItemDetailData(tab, item)
    this.sc = d.sc
    this.currentCategories = d.currentCategories
    this.newCategories     = d.newCategories
    this.attachments       = d.attachments
    this.auditInfo         = d.auditInfo
    this.timeline          = d.timeline
    this.btnPrimary        = d.btnPrimary
    this.btnSecondary      = d.btnSecondary
    uni.setNavigationBarTitle({ title: d.sc.text + '详情' })
  },
  methods: {
    levelCls(level) {
      if (level === 1) return 'status-green'
      if (level === 3) return 'status-red'
      return 'status-orange'
    },

    goBack() { uni.navigateBack() },
    onPrimary() {
      const a = this.btnPrimary && this.btnPrimary.action
      if (a === 'survey') { uni.showToast({ title:'签到踏勘功能开发中', icon:'none' }); return }
      if (a === 'review' || a === 'approve') {
        uni.navigateTo({ url:`/pages/add-item-review/index?scene=${a}&id=${encodeURIComponent(this.item.id)}&shop=${encodeURIComponent(this.item.shop)}&merchant=${encodeURIComponent(this.item.merchant)}&addCategories=${encodeURIComponent(this.item.addCategories)}&currentStep=${encodeURIComponent(this.item.currentStep||'')}` })
        return
      }
      if (a === 'confirm-material') { uni.showToast({ title:'已确认接收材料', icon:'success' }); return }
      uni.navigateBack()
    }
  }
}
</script>

<style>
.page { background: var(--color-bg-page); min-height: 100vh; }
/* ── 装修类目及项目（§四 规范） ── */
.cats-section { background:#FAFAFA; border:2rpx solid #E6E6E6; border-radius:20rpx; padding:28rpx; margin:0 28rpx 20rpx; }
.cats-section .sec-title { margin-left:-28rpx; }
.cat-item { padding:20rpx 0; border-bottom:2rpx solid #F0F0F0; }
.cat-item:last-child { border-bottom:none; padding-bottom:0; }
/* 行头部 §3.3 */
.cat-hd   { display:flex; justify-content:space-between; align-items:flex-start; gap:16rpx; margin-bottom:12rpx; }
.cat-left { display:flex; align-items:center; gap:16rpx; flex-wrap:wrap; flex:1; }
/* 类目名称 §3.3 */
.cat-name { font-size:28rpx; font-weight:600; color:#333333; }
/* 本部门负责 Tag §3.3 */
.my-dept-tag { font-size:20rpx; font-weight:500; padding:4rpx 10rpx; border-radius:4rpx; background:#E8F9F0; color:#1ABA6C; outline:2rpx solid rgba(26,186,108,0.3); outline-offset:-2rpx; white-space:nowrap; }
/* 状态标签 §3.7 */
.status-tag    { display:inline-flex; align-items:center; padding:4rpx 16rpx; border-radius:8rpx; font-size:22rpx; white-space:nowrap; line-height:1.4; }
.status-green  { background:#E8F9F0; color:#1ABA6C; }
.status-orange { background:rgba(241,146,4,0.1); color:#F19204; }
.status-red    { background:rgba(250,43,45,0.05); color:#FA2B2D; }
/* 施工项目行 §3.4（与 renovation-detail 一致） */
.cat-projects  { display:flex; flex-direction:row; align-items:center; flex-wrap:nowrap; gap:16rpx; margin-bottom:12rpx; overflow:hidden; }
.cat-proj-item { display:flex; align-items:center; gap:4rpx; flex-shrink:0; }
.cat-proj-name { font-size:26rpx; color:#666666; line-height:1.5; }
.cat-proj-item .status-tag { padding-top:0; padding-bottom:0; }
/* 责任部门行 §3.5 */
.cat-dept-row   { display:flex; font-size:24rpx; }
.cat-dept-label { color:#999999; flex-shrink:0; }
.cat-dept-val   { color:#333333; }
/* §2.3 首行：sec-title 紧跟的第一行去掉顶部 padding */
.detail-section .sec-title + .detail-row { padding-top: 0; }
/* §2.3 末行：去掉底部 padding，由 section 自身 28rpx 底部间距提供留白 */
.detail-section .detail-row:last-child   { padding-bottom: 0; }
/* 附件资料容器（§4.1） */
.detail-section-attach { background:#FAFAFA; border:1rpx solid #E6E6E6; border-radius:10rpx; padding:20rpx 24rpx 28rpx; margin:0 28rpx 20rpx; }
/* 分组间距（§4.1 分组间距 40rpx） */
.attach-divider { height:1rpx; background:#E6E6E6; margin:40rpx 0; }
/* 分组标题（§4.2） */
.attach-group-title { font-size:28rpx; font-weight:600; color:#333333; margin-bottom:24rpx; }
/* 文件条目 */
.attach-cat { margin-bottom:20rpx; }
.attach-cat:last-child { margin-bottom:0; }
/* 类目标签（§4.3） */
.attach-cat-label { font-size:26rpx; font-weight:600; color:#333333; margin-bottom:16rpx; }
.attach-file-row { display:flex; align-items:center; gap:16rpx; padding:0 20rpx 0 26rpx; height:100rpx; background:#F2FAFE; border:1rpx solid #D1E2EB; border-radius:16rpx; box-sizing:border-box; }
.attach-file-icon { width:48rpx; height:48rpx; flex-shrink:0; }
.attach-file-name { flex:1; font-size:25rpx; color:#000; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.attach-actions   { display:flex; align-items:center; gap:24rpx; flex-shrink:0; }
.attach-action-icon { width:48rpx; height:48rpx; flex-shrink:0; }
.timeline { padding-left:26rpx; }
.tl-item  { display:flex; padding-bottom:44rpx; position:relative; }
.tl-item:last-child { padding-bottom:0; }
.tl-axis  { position:absolute; left:-26rpx; top:0; bottom:0; width:10rpx; display:flex; flex-direction:column; align-items:center; }
.tl-dot   { width:10rpx; height:10rpx; border-radius:9999rpx; flex-shrink:0; background:#B3B3B3; z-index:1; margin-top:12rpx; }
.tl-line  { flex:1; width:2rpx; background:#E0E0E0; margin-top:16rpx; }
.tl-content { flex:1; }
.tl-hd    { display:flex; justify-content:space-between; align-items:center; }
.tl-dept  { font-size:24rpx; font-weight:600; color:#000; flex:1; }
.tl-status{ font-size:24rpx; font-weight:600; white-space:nowrap; margin-left:16rpx; }
.tl-pass    { color:#1ABA6C; }
.tl-waiting { color:#F19204; }
.tl-cancel  { color:#999999; }
.tl-reject  { color:#FA2B2D; }
.dot-pass   { background:#1ABA6C; }
.dot-waiting{ background:#F19204; }
.dot-cancel { background:#999999; }
.dot-reject { background:#FA2B2D; }
.tl-meta  { display:flex; gap:24rpx; font-size:24rpx; color:#666; font-weight:400; margin-bottom:8rpx; }
.tl-opinion { font-size:24rpx; color:#666; line-height:1.5; display:block; }
</style>
