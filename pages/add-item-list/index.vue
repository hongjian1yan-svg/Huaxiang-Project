<template>
  <view class="page">
    <!-- Tab 下划线滚动栏 -->
    <view class="tabs-wrap">
      <view class="tabs">
        <view
          v-for="tab in tabs" :key="tab.key"
          :class="['tab', { 'tab-active': currentTab === tab.key }]"
          @tap="switchTab(tab.key)"
        >
          <text class="tab-lbl">{{ tab.label }}</text>
          <text v-if="tab.badge > 0" class="tab-badge">{{ tab.badge }}</text>
        </view>
      </view>
    </view>

    <!-- 列表区 -->
    <scroll-view scroll-y class="task-list" :enhanced="true" :show-scrollbar="false">
      <text v-if="taskList.length > 0" class="count-tip">共{{ taskList.length }}个申请</text>
      <view v-if="taskList.length === 0" class="empty-state">暂无{{ currentTabLabel }}的增项申请</view>

      <view v-for="item in taskList" :key="item.id" class="task-card" @tap="goDetail(item)">
        <view v-if="currentTab === 'rejected' && item.rejectType" class="card-title-row">
          <text class="card-green-title-inline">{{ item.addCategories }}</text>
          <text class="reject-tag">{{ item.rejectType }}</text>
        </view>
        <text v-else class="card-green-title">{{ item.addCategories }}</text>
        <text class="card-shop-no">商铺号：{{ item.shop }}</text>
        <text class="info-line">商户名称：{{ item.merchant }}</text>
        <text class="info-line">增项编号：{{ item.id }}</text>
        <text class="info-line">关联申请：{{ item.applyId }}</text>
        <text class="info-line">增项项目：{{ item.addProjectsText }}</text>
        <text class="info-line">是否延期：{{ item.needDelay ? '是' : '否' }}</text>
        <text v-if="item.needDelay && item.delayTo" class="info-line">延至日期：{{ item.delayTo }}</text>
        <text class="info-line">申请时间：{{ item.date }}</text>
        <template v-if="currentTab === 'cancelled'">
          <text class="info-line">取消时间：{{ item.cancelTime }}</text>
          <text class="info-line">操作人：{{ item.cancelPerson }}</text>
        </template>

        <!-- 待签署：提示条 -->
        <view v-if="currentTab === 'pending-sign'" class="card-notice cn-alert" @tap.stop>
          <text class="notice-icon">!</text>
          <text>请到安保部线下签署增项安全协议</text>
        </view>

        <!-- 操作区（所有 tab 均显示） -->
        <view class="card-action" @tap.stop>
          <button v-if="currentTab === 'pending-survey'" class="btn-fill btn-short" @tap.stop="goSurvey(item)">签到踏勘</button>
          <button v-else-if="currentTab === 'my-initial-review' && item.needMyReview" class="btn-fill btn-short" @tap.stop="goReview(item)">立即审核</button>
          <button v-else-if="currentTab === 'pending-submit-materials'" class="btn-fill btn-long" @tap.stop="onConfirmMaterial(item)">确认接收材料</button>
          <button v-else-if="currentTab === 'approval-in-progress'" class="btn-fill btn-short" @tap.stop="goApprove(item)">立即审批</button>
          <button v-else class="btn-outline-green btn-short" @tap.stop="goDetail(item)">查看详情</button>
        </view>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>

    <!-- 确认接收材料弹窗 -->
    <view v-if="showConfirmModal" class="modal-overlay">
      <view class="modal-box">
        <text class="modal-title">确认接收材料</text>
        <text class="modal-body-text">确认后申请将进入材料审核阶段，是否确认？</text>
        <view class="modal-btns">
          <button class="modal-btn-cancel" @tap="showConfirmModal = false">取消</button>
          <button class="modal-btn-primary" @tap="confirmMaterial">确认接收</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const { ADD_ITEM_TABS, ADD_ITEM_DATA } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return { tabs: [], currentTab: 'pending-survey', taskList: [], showConfirmModal: false }
  },
  computed: {
    currentTabLabel() {
      const t = this.tabs.find(t => t.key === this.currentTab)
      return t ? t.label : ''
    }
  },
  onLoad() {
    this.tabs = ADD_ITEM_TABS
    this._loadList('pending-survey')
  },
  methods: {
    switchTab(key) { if (key === this.currentTab) return; this.currentTab = key; this._loadList(key) },
    _loadList(key) { this.taskList = ADD_ITEM_DATA[key] || [] },
    goDetail(item) {
      uni.navigateTo({ url: `/pages/add-item-detail/index?tab=${this.currentTab}&id=${encodeURIComponent(item.id)}` })
    },
    goSurvey(item) {
      uni.navigateTo({
        url: `/pages/survey-checkin/index?scene=add-item&shopNo=${encodeURIComponent(item.shop)}&itemId=${encodeURIComponent(item.id)}&category=${encodeURIComponent(item.addCategories)}&merchant=${encodeURIComponent(item.merchant)}`
      })
    },
    goReview(item) {
      uni.navigateTo({ url: `/pages/add-item-review/index?scene=review&id=${encodeURIComponent(item.id)}&applyId=${encodeURIComponent(item.applyId)}&shop=${encodeURIComponent(item.shop)}&merchant=${encodeURIComponent(item.merchant)}&addCategories=${encodeURIComponent(item.addCategories)}` })
    },
    goApprove(item) {
      uni.navigateTo({ url: `/pages/add-item-review/index?scene=approve&id=${encodeURIComponent(item.id)}&shop=${encodeURIComponent(item.shop)}&merchant=${encodeURIComponent(item.merchant)}&currentStep=${encodeURIComponent(item.currentStep||'')}` })
    },
    onConfirmMaterial() { this.showConfirmModal = true },
    confirmMaterial() { this.showConfirmModal = false; uni.showToast({ title: '已确认接收材料', icon: 'success' }) }
  }
}
</script>

<style>
.page { display: flex; flex-direction: column; height: 100vh; background: var(--color-bg-page); overflow: hidden; }
.tabs-wrap { position: relative; background: #FFFFFF; border-bottom: 2rpx solid #EDEDED; flex-shrink: 0; overflow: hidden; }
.tabs-wrap::after { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 64rpx; background: linear-gradient(to right,transparent,#fff); pointer-events: none; }
.tabs { display: flex; overflow-x: auto; padding: 0 28rpx; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab { display: inline-flex; align-items: center; gap: 6rpx; padding: 22rpx 32rpx 18rpx 0; font-size: 28rpx; color: #4C4C4C; white-space: nowrap; position: relative; flex-shrink: 0; font-weight: 400; }
.tab-active { color: #1ABA6C; font-weight: 600; }
.tab-lbl { position: relative; }
.tab-active .tab-lbl::after { content: ''; position: absolute; bottom: -18rpx; left: 50%; transform: translateX(-50%); width: 40rpx; height: 6rpx; background: #1ABA6C; border-radius: 4rpx; }
.tab-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 28rpx; height: 28rpx; padding: 0 8rpx; border-radius: 14rpx; font-size: 20rpx; font-weight: 600; background: #FA2B2D; color: #fff; line-height: 1; }
.task-list { flex: 1; overflow: hidden; padding: 0 28rpx; }
.count-tip { display: block; font-size: 25rpx; color: #999999; padding: 28rpx 0 12rpx 0; line-height: 1.4; }
.task-card { background: #FFFFFF; border-radius: 16rpx; padding: 28rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05); }
.task-card:active { opacity: 0.9; }
.card-title-row { display: flex; align-items: flex-start; gap: 14rpx; margin-bottom: 28rpx; }
.card-green-title { display: block; font-size: 28rpx; font-weight: 600; color: #1ABA6C; line-height: 1.4; margin-bottom: 28rpx; }
.card-green-title-inline { font-size: 28rpx; font-weight: 600; color: #1ABA6C; line-height: 1.4; flex: 1; }
.reject-tag { flex-shrink: 0; display: inline-flex; align-items: center; padding: 6rpx 16rpx; background: rgba(250,43,45,0.05); border-radius: 4rpx; color: #FA2B2D; font-size: 20rpx; font-weight: 500; line-height: 1.4; }
.info-line-danger { color: #FA2B2D; }
.card-shop-no { display: block; font-size: 24rpx; font-weight: 600; color: #333333; margin-bottom: 12rpx; }
.info-line { display: block; font-size: 24rpx; color: #666666; margin-bottom: 6rpx; line-height: 1.5; }
.card-notice { display: flex; align-items: center; gap: 10rpx; min-height: 60rpx; padding: 0 20rpx; border-radius: 8rpx; font-size: 24rpx; margin-top: 16rpx; }
.cn-alert { background: rgba(250,43,45,0.05); color: #FA2B2D; }
.notice-icon { width: 28rpx; height: 28rpx; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 18rpx; font-weight: 700; color: #fff; flex-shrink: 0; background: #FA2B2D; }
.card-action { display: flex; justify-content: flex-end; align-items: center; gap: 10rpx; margin-top: 24rpx; padding-top: 20rpx; border-top: 2rpx solid #E7E7E7; }
.btn-fill, .btn-outline-green { display: inline-flex; align-items: center; justify-content: center; height: 56rpx; border-radius: 12rpx; font-size: 24rpx; font-weight: 600; }
.btn-fill          { background: #1ABA6C; color: #fff; border: none; }
.btn-outline-green { background: #fff; color: #1ABA6C; border: 2rpx solid #1ABA6C; }
.btn-short { width: 144rpx; }
.btn-long  { padding: 0 24rpx; }
.empty-state { text-align: center; padding: 120rpx 40rpx; color: var(--color-text-hint); font-size: 26rpx; }

/* ── 确认接收材料弹窗 ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1500; display: flex; justify-content: center; align-items: center; }
.modal-box { background: #FFFFFF; border-radius: 32rpx; padding: 48rpx; width: 90%; max-width: 720rpx; box-sizing: border-box; }
.modal-title { display: block; font-size: 34rpx; font-weight: 600; color: #333333; text-align: center; margin-bottom: 32rpx; }
.modal-body-text { display: block; font-size: 28rpx; color: #666666; line-height: 1.6; text-align: center; }
.modal-btns { display: flex; gap: 20rpx; margin-top: 28rpx; }
.modal-btn-cancel  { flex: 1; font-size: 28rpx; font-weight: 400; color: #1ABA6C; background: #FFFFFF; border: 1rpx solid #1ABA6C; border-radius: 12rpx; padding: 20rpx 0; text-align: center; }
.modal-btn-primary { flex: 1; font-size: 28rpx; font-weight: 600; color: #FFFFFF; background: #1ABA6C; border-radius: 12rpx; padding: 20rpx 0; text-align: center; }
</style>
