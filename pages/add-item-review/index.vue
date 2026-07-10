<template>
  <view class="page">
    <scroll-view class="scroll-body" scroll-y>

      <!-- 增项申请信息摘要 -->
      <view class="info-card">
        <view class="sec-title info-title"><view class="sec-bar"></view><text class="sec-label">增项申请信息</text></view>
        <view class="detail-row"><text class="detail-label">增项编号</text><text class="detail-value">{{ id }}</text></view>
        <view class="detail-row"><text class="detail-label">关联申请</text><text class="detail-value">{{ applyId }}</text></view>
        <view class="detail-row"><text class="detail-label">商铺号</text><text class="detail-value">{{ shop }}</text></view>
        <view class="detail-row"><text class="detail-label">商户名称</text><text class="detail-value">{{ merchant }}</text></view>
        <view class="detail-row"><text class="detail-label">增项类目</text><text class="detail-value">{{ addCategories }}</text></view>
        <view v-if="currentStep" class="detail-row">
          <text class="detail-label">当前环节</text><text class="detail-value">{{ currentStep }}</text>
        </view>
      </view>

      <!-- 审核/审批操作 -->
      <view class="section-block">
        <text class="sec-label req-label block-title">{{ isApprove ? '审批操作' : '审核操作' }}</text>
        <view class="action-row">
          <view :class="['action-btn', reviewAction === 'pass' ? 'action-pass' : '']" @tap="reviewAction = 'pass'">
            {{ isApprove ? '审批通过' : '审核通过' }}
          </view>
          <view :class="['action-btn', reviewAction === 'reject' ? 'action-reject' : '']" @tap="reviewAction = 'reject'">
            {{ isApprove ? '审批驳回' : '审核驳回' }}
          </view>
        </view>
      </view>

      <!-- 意见/驳回原因 -->
      <view class="section-block">
        <view class="opinion-title-row">
          <text v-if="reviewAction === 'reject'" class="req-star">*</text>
          <text class="block-title">{{ reviewAction === 'reject' ? '驳回原因' : (isApprove ? '审批意见' : '审核意见') }}</text>
        </view>
        <view :class="['textarea-wrap', showError && reviewAction === 'reject' && !opinion.trim() ? 'textarea-error' : '']">
          <textarea
            class="opinion-ta"
            :placeholder="reviewAction === 'reject' ? '请输入驳回原因（必填）' : '请输入意见（选填）'"
            placeholder-style="color:#999999;font-size:26rpx;"
            v-model="opinion" :maxlength="200"
          />
          <text class="char-count">{{ opinion.length }}/200</text>
        </view>
      </view>

      <!-- 是否加签 -->
      <view class="section-block">
        <view class="sec-title">
          <text class="sec-label">是否加签</text>
        </view>
        <view class="action-row">
          <view :class="['action-btn', { 'action-pass': needSign === 'no' }]" @tap="needSign = 'no'">否</view>
          <view :class="['action-btn', { 'action-pass': needSign === 'yes' }]" @tap="needSign = 'yes'">是</view>
        </view>
      </view>

      <!-- 加签审批角色（选"是"后展开，可多选） -->
      <view v-if="needSign === 'yes'" class="section-block">
        <view class="sec-title">
          <text class="sec-label req-label">加签审批角色</text>
        </view>
        <view class="action-row">
          <view :class="['action-btn', { 'action-pass': signRoles.includes('deputy') }]" @tap="toggleSignRole('deputy')">副总</view>
          <view :class="['action-btn', { 'action-pass': signRoles.includes('general') }]" @tap="toggleSignRole('general')">总经理</view>
        </view>
      </view>

      <view style="height: 200rpx;"></view>
    </scroll-view>

    <view class="bottom-bar">
      <button class="btn btn-primary" @tap="submit">确认</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return { scene:'review', id:'', applyId:'', shop:'', merchant:'', addCategories:'', currentStep:'', reviewAction:'', opinion:'', showError:false, needSign:'', signRoles:[] }
  },
  computed: {
    isApprove() { return this.scene === 'approve' }
  },
  onLoad(options) {
    this.scene         = options.scene || 'review'
    this.id            = decodeURIComponent(options.id || '')
    this.applyId       = decodeURIComponent(options.applyId || '')
    this.shop          = decodeURIComponent(options.shop || '')
    this.merchant      = decodeURIComponent(options.merchant || '')
    this.addCategories = decodeURIComponent(options.addCategories || '')
    this.currentStep   = decodeURIComponent(options.currentStep || '')
    uni.setNavigationBarTitle({ title: this.isApprove ? '增项审批' : '增项审核' })
  },
  methods: {
    toggleSignRole(role) {
      const idx = this.signRoles.indexOf(role)
      if (idx === -1) { this.signRoles.push(role) } else { this.signRoles.splice(idx, 1) }
    },
    submit() {
      if (!this.reviewAction) { uni.showToast({ title:`请选择${this.isApprove?'审批':'审核'}操作`, icon:'none' }); return }
      if (this.reviewAction === 'reject' && !this.opinion.trim()) { this.showError=true; uni.showToast({ title:'请输入驳回原因', icon:'none' }); return }
      if (this.needSign === 'yes' && this.signRoles.length === 0) { uni.showToast({ title:'请选择加签审批角色', icon:'none' }); return }
      const msg = this.reviewAction === 'pass' ? (this.isApprove?'增项审批通过':'增项审核通过') : (this.isApprove?'增项审批驳回':'增项审核驳回')
      uni.showToast({ title: msg, icon:'success' })
      setTimeout(() => uni.navigateBack({ delta: 2 }), 1500)
    }
  }
}
</script>

<style>
.page { display:flex; flex-direction:column; height:100vh; background:#FFFFFF; overflow:hidden; }
.scroll-body { flex:1; overflow:hidden; }
.info-card { background:#FAFAFA; border:2rpx solid #E6E6E6; border-radius:20rpx; margin:32rpx 28rpx 40rpx; padding:20rpx 28rpx 12rpx; }
.info-title { margin-bottom:8rpx; }
.detail-section .detail-row:first-of-type { padding-top:0; }
.section-block { padding:0 28rpx; margin-bottom:40rpx; }
.opinion-title-row { display:flex; align-items:center; gap:4rpx; margin-bottom:20rpx; }
.req-star { font-size:28rpx; font-weight:600; color:#FA2B2D; line-height:1; }
.block-title { display:block; margin-bottom:20rpx; }
.opinion-title-row .block-title { margin-bottom:0; }
.action-row { display:flex; gap:20rpx; }
.action-btn { padding:16rpx 52rpx 17rpx; border-radius:10rpx; font-size:28rpx; font-weight:400; color:#333333; background:#F7F7F7; border:none; font-family:'PingFang SC',sans-serif; }
.action-pass   { background:rgba(26,186,108,0.05); outline:1rpx solid #1ABA6C; outline-offset:-1rpx; color:#1ABA6C; font-weight:600; }
.action-reject { background:rgba(250,43,45,0.05);  outline:1rpx solid #FA2B2D; outline-offset:-1rpx; color:#FA2B2D; font-weight:600; }
.textarea-wrap { position:relative; border:2rpx solid #D2D6E2; border-radius:10rpx; padding:20rpx; background:#FFFFFF; margin-top:20rpx; box-sizing:border-box; }
.textarea-error { border-color:#FA2B2D; }
.opinion-ta { width:100%; height:182rpx; font-size:26rpx; color:#333333; line-height:1.5; background:transparent; }
.char-count { position:absolute; bottom:20rpx; right:20rpx; font-size:24rpx; color:#CCCCCC; }
</style>
