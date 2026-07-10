<template>
  <view class="page" :style="{ paddingBottom: showResubmit ? '200rpx' : '40rpx' }">

    <!-- 状态提示横幅 -->
    <view v-if="banner" class="notice-banner" :style="{ background: banner.bg }">
      <view class="notice-icon-wrap" :style="{ background: banner.ic }">
        <text class="notice-icon-text">!</text>
      </view>
      <view class="notice-body">
        <text class="notice-title" :style="{ color: banner.ic }">{{ banner.title }}</text>
        <text class="notice-text" :style="{ color: banner.ic }">{{ banner.text }}</text>
      </view>
    </view>

    <!-- 基本信息 -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">基本信息</text></view>
      <view class="detail-row"><text class="detail-label">增项编号</text><text class="detail-value">{{ item.id }}</text></view>
      <view class="detail-row"><text class="detail-label">关联装修申请</text><text class="detail-value">{{ item.applyId }}</text></view>
      <view class="detail-row"><text class="detail-label">商铺号</text><text class="detail-value">{{ item.shop }}</text></view>
      <view class="detail-row"><text class="detail-label">申请时间</text><text class="detail-value">{{ item.date }}</text></view>
      <view class="detail-row">
        <text class="detail-label">当前状态</text>
        <text class="detail-value" :style="{ color: statusColor }">{{ sc.text }}</text>
      </view>
      <view v-if="tab === 'approving' && item.currentStep" class="detail-row">
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
        <text class="cat-name">{{ cat.name }}</text>
        <text class="cat-sub">{{ cat.projects.map(p => p.name || p).join('、') }}</text>
      </view>
    </view>

    <!-- 增项装修类目及项目 -->
    <view v-if="newCategories.length" class="cats-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">增项装修类目及项目</text></view>
      <view v-for="cat in newCategories" :key="cat.name" class="cat-item">
        <text class="cat-name">{{ cat.name }}</text>
        <text class="cat-sub">{{ cat.projects.map(p => p.name || p).join('、') }}</text>
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
      <view class="attach-cat">
        <view class="attach-cat-label">施工方案</view>
        <view class="attach-file-row">
          <image class="attach-file-icon" src="/static/images/icon-file-pdf.png" mode="aspectFit" />
          <text class="attach-file-name">施工方案.pdf</text>
        </view>
      </view>
      <view class="attach-cat">
        <view class="attach-cat-label">施工图纸</view>
        <view class="attach-file-row">
          <image class="attach-file-icon" src="/static/images/icon-file-pdf.png" mode="aspectFit" />
          <text class="attach-file-name">施工图纸.pdf</text>
        </view>
      </view>
      <view class="attach-cat">
        <view class="attach-cat-label">施工方资质</view>
        <view class="attach-file-row">
          <image class="attach-file-icon" src="/static/images/icon-file-pdf.png" mode="aspectFit" />
          <text class="attach-file-name">施工方资质.pdf</text>
        </view>
      </view>
    </view>

    <!-- 取消信息（已取消） -->
    <view v-if="tab === 'cancelled'" class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">取消信息</text></view>
      <view class="detail-row"><text class="detail-label">取消时间</text><text class="detail-value">{{ item.cancelTime }}</text></view>
      <view class="detail-row"><text class="detail-label">操作人</text><text class="detail-value">{{ item.cancelPerson }}</text></view>
      <view class="detail-row"><text class="detail-label">取消说明</text><text class="detail-value">{{ item.cancelReason }}</text></view>
    </view>

    <!-- 审核信息（已通过） -->
    <view v-if="tab === 'approved'" class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">审核信息</text></view>
      <view class="detail-row"><text class="detail-label">通过时间</text><text class="detail-value">{{ item.approveTime }}</text></view>
      <view class="detail-row"><text class="detail-label">审核人</text><text class="detail-value">{{ item.approvePerson }}</text></view>
    </view>

    <!-- 驳回信息（已驳回） -->
    <view v-if="tab === 'rejected'" class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">驳回信息</text></view>
      <view class="detail-row">
        <text class="detail-label">驳回类型</text>
        <text class="detail-value" style="color:var(--color-danger);">{{ item.rejectType }}</text>
      </view>
      <view class="detail-row">
        <text class="detail-label">驳回原因</text>
        <text class="detail-value">{{ item.rejectReason }}</text>
      </view>
    </view>

    <!-- 增项申请记录（简单时间线） -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">增项申请记录</text></view>
      <view class="timeline">
        <view v-for="(node, idx) in timeline" :key="idx" class="tl-item">
          <view class="tl-axis">
            <view :class="['tl-dot', node.result === 'pass' ? 'dot-pass' : node.result === 'cancel' ? 'dot-cancel' : 'dot-waiting']"></view>
            <view v-if="idx < timeline.length - 1" class="tl-line"></view>
          </view>
          <view class="tl-content">
            <view class="tl-hd">
              <text class="tl-dept">{{ node.dept }}</text>
              <text :class="['tl-status', node.result === 'pass' ? 'tl-pass' : node.result === 'cancel' ? 'tl-cancel' : 'tl-waiting']">{{ node.text }}</text>
            </view>
            <view v-if="node.person || node.time" class="tl-meta">
              <text v-if="node.person">{{ node.person }}</text>
              <text v-if="node.time">{{ node.time }}</text>
            </view>
            <text v-if="node.opinion" :class="node.result === 'cancel' ? 'tl-opinion-reject' : 'tl-opinion'">{{ node.opinion }}</text>
          </view>
        </view>
      </view>
    </view>

  </view>

  <!-- 底部操作栏 -->
  <view class="bottom-bar">
    <button class="btn btn-outline-green" @tap="goBack">返回列表</button>
    <button v-if="showResubmit" class="btn btn-primary" @tap="goNew">重新提交</button>
    <button v-if="showCancel" class="btn btn-outline-red" @tap="showCancelModal = true">取消增项</button>
  </view>

  <!-- 取消增项确认弹窗（居中弹窗设计规范） -->
  <view v-if="showCancelModal" class="cai-overlay">
    <view class="cai-box" @tap.stop>
      <text class="cai-title">取消增项</text>
      <text class="cai-body">确定要取消本次增项申请吗？取消后该申请将不再进入审核流程，如需增项可重新提交。</text>
      <view class="cai-btns">
        <button class="cai-btn cai-btn-cancel" @tap="showCancelModal = false">再想想</button>
        <button class="cai-btn cai-btn-danger" @tap="confirmCancel">确认取消</button>
      </view>
    </view>
  </view>
</template>

<script>
const { MERCHANT_ADD_ITEM_DATA, MERCHANT_ADD_ITEM_STATUS, ADD_ITEM_APPLY_CATS, MERCHANT_ADD_ITEM_TIMELINE } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return { tab: '', item: {}, sc: { text: '' }, showCancelModal: false }
  },
  computed: {
    statusColor() {
      if (this.tab === 'approved') return 'var(--color-primary)'
      if (['rejected', 'pending-submit', 'pending-sign'].includes(this.tab)) return 'var(--color-danger)'
      if (this.tab === 'cancelled') return '#999999'
      return 'var(--color-warning)'
    },
    banner() {
      const cfg = {
        'survey-reviewing': { bg: 'rgba(241,146,4,0.08)', ic: '#F19204', title: '踏勘审核中', text: '您的增项申请正在踏勘核查中，请保持联系方式畅通。' },
        'pending-submit':   { bg: 'rgba(241,146,4,0.08)', ic: '#F19204', title: '待递交材料', text: '踏勘审核已通过，请将纸质增项材料递交至物业前台，逾期将影响审批进度。' },
        'material-review':  { bg: 'rgba(241,146,4,0.08)', ic: '#F19204', title: '材料审核中', text: '物业部正在审核您的增项材料，请耐心等待。' }
      }
      return cfg[this.tab] || null
    },
    showResubmit() { return this.tab === 'rejected' },
    showCancel() {
      return ['survey-reviewing', 'pending-submit', 'material-review', 'approving', 'pending-sign'].includes(this.tab)
    },
    currentCategories() {
      const cats = ADD_ITEM_APPLY_CATS[this.item.applyId] || ADD_ITEM_APPLY_CATS['RX001'] || []
      return cats
    },
    newCategories() {
      if (this.item.addCategoryItems && this.item.addCategoryItems.length) {
        return this.item.addCategoryItems
      }
      if (this.item.addCategories) {
        const projs = (this.item.addProjectsText || '').split(/[、,]/).map(s => s.trim()).filter(Boolean)
        return [{ name: this.item.addCategories, projects: projs.map(p => ({ name: p })) }]
      }
      return []
    },
    timeline() {
      const t = this.tab
      const item = this.item
      // 已取消：使用 item 中的取消记录（由 cancelled 的弹窗写入）
      if (t === 'cancelled') {
        return [
          { dept: '商户取消申请', result: 'cancel', text: '已取消', person: item.cancelPerson || '', time: item.cancelTime || '' },
          { dept: '商户提交增项申请', result: 'pass', text: '已完成', person: '', time: item.date }
        ]
      }
      const template = MERCHANT_ADD_ITEM_TIMELINE[t]
      if (!template) return []
      // 深拷贝模板，填入动态值
      return template.map((node, idx) => {
        const n = Object.assign({}, node)
        // 最后一个节点（商户提交增项申请）时间用 item.date
        if (idx === template.length - 1) n.time = item.date
        // approved: 第一个节点注入 person/time
        if (t === 'approved' && idx === 0) {
          n.person = item.approvePerson || ''
          n.time   = item.approveTime  || ''
        }
        // rejected: 第一个节点注入 person/time/opinion
        if (t === 'rejected' && idx === 0) {
          n.person  = item.rejectPerson  || ''
          n.time    = item.rejectTime    || ''
          n.opinion = item.rejectReason  || ''
        }
        return n
      })
    }
  },
  onLoad(options) {
    const tab = options.tab || 'survey-reviewing'
    const id = decodeURIComponent(options.id || '')
    this.tab = tab
    const sc = MERCHANT_ADD_ITEM_STATUS[tab] || { text: '—', color: '#999' }
    this.sc = sc
    const list = MERCHANT_ADD_ITEM_DATA[tab] || []
    this.item = list.find(d => d.id === id) || {}
    uni.setNavigationBarTitle({ title: sc.text + '详情' })
  },
  methods: {
    goBack() { uni.navigateBack() },
    goNew() { uni.navigateTo({ url: '/pages/merchant-add-item-new/index' }) },
    confirmCancel() {
      this.showCancelModal = false
      uni.navigateBack()
    }
  }
}
</script>

<style>
.page { background: #FFFFFF; min-height: 100vh; padding-top: 40rpx; }

/* 状态提示横幅 */
.notice-banner { display: flex; align-items: flex-start; gap: 16rpx; border-radius: 16rpx; padding: 24rpx; margin: 0 28rpx 20rpx; }
.notice-icon-wrap { width: 36rpx; height: 36rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 4rpx; }
.notice-icon-text { font-size: 22rpx; font-weight: 700; color: #FFFFFF; line-height: 1; }
.notice-body { flex: 1; }
.notice-title { display: block; font-size: 26rpx; font-weight: 600; margin-bottom: 8rpx; }
.notice-text { display: block; font-size: 24rpx; line-height: 1.6; }

.detail-section .sec-title + .detail-row { padding-top: 0; }
.detail-section .detail-row:last-child { padding-bottom: 0; }

/* ── 附件资料 ── */
.detail-section-attach {
  background: #FAFAFA;
  border: 1rpx solid #E6E6E6;
  border-radius: 10rpx;
  padding: 20rpx 24rpx 28rpx;
}
.attach-cat { margin-bottom: 20rpx; }
.attach-cat:last-child { margin-bottom: 0; }
.attach-cat-label { font-size: 26rpx; font-weight: 600; color: #333333; margin-bottom: 16rpx; }
.attach-file-row {
  display: flex; align-items: center; gap: 16rpx;
  padding: 0 20rpx 0 26rpx; height: 100rpx;
  background: #F2FAFE; border: 1rpx solid #D1E2EB; border-radius: 16rpx;
  box-sizing: border-box;
}
.attach-file-icon { width: 48rpx; height: 48rpx; flex-shrink: 0; }
.attach-file-name { flex: 1; font-size: 25rpx; color: #000000; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ── 装修类目区块 ── */
.cats-section {
  background: #FAFAFA;
  border: 2rpx solid #E6E6E6;
  border-radius: 20rpx;
  padding: 28rpx;
  margin: 0 28rpx 20rpx;
}
.cat-item { padding: 20rpx 0; border-bottom: 2rpx solid #F0F0F0; }
.cat-item:last-child { border-bottom: none; padding-bottom: 0; }
.cat-name { display: block; font-size: 28rpx; font-weight: 600; color: #333333; margin-bottom: 12rpx; }
.cat-sub { display: block; font-size: 26rpx; color: #666666; line-height: 1.5; }

/* ── 时间线 ── */
.timeline { padding: 8rpx 0; }
.tl-item { display: flex; gap: 20rpx; }
.tl-axis { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 28rpx; }
.tl-dot { width: 20rpx; height: 20rpx; border-radius: 50%; flex-shrink: 0; margin-top: 8rpx; }
.dot-pass { background: #1ABA6C; }
.dot-cancel { background: #FA2B2D; }
.dot-waiting { background: #F19204; }
.tl-line { flex: 1; width: 2rpx; background: #E7E7E7; margin: 6rpx 0; min-height: 32rpx; }
.tl-content { flex: 1; padding-bottom: 28rpx; }
.tl-hd { display: flex; align-items: center; justify-content: space-between; margin-top: 4rpx; }
.tl-dept { font-size: 28rpx; color: #333333; font-weight: 500; }
.tl-status { font-size: 24rpx; font-weight: 600; }
.tl-pass { color: #1ABA6C; }
.tl-cancel { color: #FA2B2D; }
.tl-waiting { color: #F19204; }
.tl-meta { display: flex; gap: 20rpx; margin-top: 8rpx; }
.tl-meta text { font-size: 22rpx; color: #999999; }
.tl-opinion { display: block; font-size: 24rpx; color: #666666; line-height: 1.5; margin-top: 6rpx; }
.tl-opinion-reject { display: block; font-size: 24rpx; color: var(--color-danger); line-height: 1.5; margin-top: 6rpx; }

/* ── 红色描边按钮 ── */
.btn-outline-red { background: #FFFFFF; color: #FA2B2D; border: 2rpx solid #FA2B2D; }

/* ── 取消增项弹窗 ── */
.cai-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1500; display: flex; justify-content: center; align-items: center; }
.cai-box { background: #FFFFFF; border-radius: 32rpx; padding: 48rpx; width: 90%; max-width: 720rpx; box-sizing: border-box; }
.cai-title { display: block; font-size: 34rpx; font-weight: 600; color: #333333; text-align: center; margin-bottom: 32rpx; }
.cai-body { display: block; font-size: 28rpx; color: #666666; line-height: 1.8; text-align: center; }
.cai-btns { display: flex; gap: 20rpx; margin-top: 28rpx; }
.cai-btn { flex: 1; font-size: 28rpx; border-radius: 12rpx; padding: 20rpx 0; text-align: center; border: none; }
.cai-btn-cancel { background: #FFFFFF; color: #1ABA6C; border: 1rpx solid #1ABA6C; font-weight: 400; }
.cai-btn-danger { background: #FA2B2D; color: #FFFFFF; font-weight: 600; }
</style>
