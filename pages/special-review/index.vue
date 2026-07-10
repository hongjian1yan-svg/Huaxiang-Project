<template>
  <view class="page">
    <scroll-view class="scroll-body" scroll-y>

      <!-- 申请信息摘要 -->
      <view class="info-card">
        <view class="sec-title info-title"><view class="sec-bar"></view><text class="sec-label">申请信息</text></view>
        <view class="detail-row"><text class="detail-label">申请编号</text><text class="detail-value">{{ id }}</text></view>
        <view class="detail-row"><text class="detail-label">商铺号</text><text class="detail-value">{{ shop }}</text></view>
        <view class="detail-row"><text class="detail-label">商户名称</text><text class="detail-value">{{ merchant }}</text></view>
        <view v-if="workDate" class="detail-row"><text class="detail-label">{{ workDateLabel }}</text><text class="detail-value">{{ workDate }}</text></view>
        <view v-if="workContent" class="detail-row"><text class="detail-label">作业内容</text><text class="detail-value">{{ workContent }}</text></view>
        <view v-if="currentStep" class="detail-row">
          <text class="detail-label">当前环节</text><text class="detail-value">{{ currentStep }}</text>
        </view>
      </view>

      <!-- 当前施工中商户数（独立信息条，常驻显示） -->
      <view class="count-card">
        <view class="detail-row">
          <text class="detail-label cclabel">当前施工中商户数</text>
          <text class="detail-value count-bold">{{ underConstructionCount }}</text>
        </view>
      </view>

      <!-- 审核操作 -->
      <view class="section-block">
        <view class="sec-title"><text class="sec-label req-label">审核操作</text></view>
        <view class="action-row">
          <view :class="['action-btn', { 'action-pass':   reviewAction === 'pass'   }]" @tap="reviewAction = 'pass'">审核通过</view>
          <view :class="['action-btn', { 'action-reject': reviewAction === 'reject' }]" @tap="reviewAction = 'reject'">审核驳回</view>
        </view>
      </view>

      <!-- 审核意见 / 驳回原因 -->
      <view class="section-block">
        <view class="sec-title">
          <text :class="['sec-label', { 'req-label': reviewAction === 'reject' }]">
            {{ reviewAction === 'reject' ? '驳回原因' : '审核意见' }}
          </text>
        </view>
        <view :class="['textarea-wrap', { 'textarea-error': showError && reviewAction === 'reject' && !opinion.trim() }]">
          <textarea
            class="opinion-textarea"
            :placeholder="reviewAction === 'reject' ? '请输入驳回原因（必填）' : '请输入审核意见（选填）'"
            placeholder-style="color:#CCCCCC;font-size:26rpx;font-weight:400;"
            v-model="opinion"
            :maxlength="200"
          />
          <text class="char-count">{{ opinion.length }}/200</text>
        </view>
      </view>

      <!-- 是否加签 -->
      <view class="section-block">
        <view class="sec-title"><text class="sec-label">是否加签</text></view>
        <view class="action-row">
          <view :class="['action-btn', { 'action-pass': needSign === 'no'  }]" @tap="needSign = 'no'">否</view>
          <view :class="['action-btn', { 'action-pass': needSign === 'yes' }]" @tap="needSign = 'yes'">是</view>
        </view>
      </view>

      <!-- 加签审批角色 -->
      <view v-if="needSign === 'yes'" class="section-block">
        <view class="sec-title"><text class="sec-label req-label">加签审批角色</text></view>
        <view class="action-row">
          <view :class="['action-btn', { 'action-pass': signRoles.includes('deputy')  }]" @tap="toggleRole('deputy')">副总</view>
          <view :class="['action-btn', { 'action-pass': signRoles.includes('general') }]" @tap="toggleRole('general')">总经理</view>
        </view>
      </view>

      <view style="height:200rpx;"></view>
    </scroll-view>
  </view>

  <!-- 底部确认按钮 -->
  <view class="bottom-bar">
    <button class="btn btn-primary" @tap="submit">确认</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id:'', shop:'', merchant:'', currentStep:'', type:'',
      workDate:'', workContent:'',
      reviewAction:'', opinion:'', showError:false,
      needSign:'', signRoles:[],
      underConstructionCount: 5,
    }
  },
  computed: {
    workDateLabel() {
      if (this.type === 'electric') return '用电周期'
      if (this.type === 'height')   return '高空作业日期'
      return '动火作业日期'
    }
  },
  onLoad(options) {
    this.id          = decodeURIComponent(options.id          || '')
    this.shop        = decodeURIComponent(options.shop        || '')
    this.merchant    = decodeURIComponent(options.merchant    || '')
    this.currentStep = decodeURIComponent(options.currentStep || '')
    this.type        = decodeURIComponent(options.type        || '')
    this.workDate    = decodeURIComponent(options.workDate    || '')
    this.workContent = decodeURIComponent(options.workContent || '')
    uni.setNavigationBarTitle({ title: '立即审核' })
  },
  methods: {
    toggleRole(role) {
      const idx = this.signRoles.indexOf(role)
      idx === -1 ? this.signRoles.push(role) : this.signRoles.splice(idx, 1)
    },
    submit() {
      if (!this.reviewAction) {
        uni.showToast({ title: '请选择审核操作', icon: 'none' }); return
      }
      if (this.reviewAction === 'reject' && !this.opinion.trim()) {
        this.showError = true; uni.showToast({ title: '请输入驳回原因', icon: 'none' }); return
      }
      if (this.needSign === 'yes' && this.signRoles.length === 0) {
        uni.showToast({ title: '请选择加签审批角色', icon: 'none' }); return
      }
      const title = this.reviewAction === 'pass' ? '审核通过' : '审核驳回'
      const delta = this.from === 'list' ? 1 : 2
      uni.showToast({
        title, icon: 'success',
        success: () => setTimeout(() => uni.navigateBack({ delta }), 1500)
      })
    }
  }
}
</script>

<style>
.page { display:flex; flex-direction:column; height:100vh; background:#FFFFFF; overflow:hidden; }
.scroll-body { flex:1; }

.info-card { background:#FAFAFA; border-radius:20rpx; border:2rpx solid #E6E6E6; margin:32rpx 28rpx 0; padding:20rpx 28rpx 12rpx; }
.info-title { margin-bottom:8rpx; }
.sec-title  { display:flex; align-items:center; gap:12rpx; }
.sec-bar    { width:8rpx; height:36rpx; background:#1ABA6C; border-radius:0 8rpx 8rpx 0; flex-shrink:0; }
.sec-label  { font-size:28rpx; font-weight:600; color:#333333; }
.req-label::before { content:'* '; color:#FA2B2D; }
.detail-row { display:flex; justify-content:space-between; align-items:flex-start; padding:14rpx 0; border-bottom:2rpx solid #F0F0F0; font-size:26rpx; }
.detail-row:last-child { border-bottom:none; padding-bottom:0; }
.detail-label { color:#999999; flex-shrink:0; margin-right:20rpx; }
.detail-value { color:#333333; text-align:right; flex:1; }

.section-block { padding:0 28rpx; margin-top:40rpx; }
.section-block .sec-title { margin-bottom:20rpx; }

.action-row { display:flex; gap:20rpx; }
.action-btn { padding:16rpx 52rpx 17rpx; border-radius:10rpx; font-size:28rpx; font-weight:400; text-align:center; background:#F7F7F7; color:#333333; }
.action-pass   { background:rgba(26,186,108,0.05); outline:1rpx solid #1ABA6C; outline-offset:-1rpx; color:#1ABA6C; font-weight:600; }
.action-reject { background:rgba(250,43,45,0.05);  outline:1rpx solid #FA2B2D; outline-offset:-1rpx; color:#FA2B2D; font-weight:600; }

.count-card { background:rgba(26,186,108,0.05); border-radius:20rpx; border:2rpx solid #1ABA6C; margin:16rpx 28rpx 0; padding:0 28rpx; }
.count-card .detail-row { border-bottom:none; }
.cclabel { color:#333333; white-space:nowrap; }
.count-bold { font-weight:600; color:#1ABA6C; }

.textarea-wrap { position:relative; height:182rpx; background:#FFFFFF; border-radius:10rpx; border:2rpx solid #D2D6E2; padding:20rpx; box-sizing:border-box; margin-top:20rpx; }
.textarea-error { border-color:#FA2B2D; }
.opinion-textarea { width:100%; height:100%; font-size:26rpx; color:#333333; line-height:1.5; box-sizing:border-box; }
.char-count { position:absolute; bottom:20rpx; right:20rpx; font-size:24rpx; color:#CCCCCC; }
</style>
