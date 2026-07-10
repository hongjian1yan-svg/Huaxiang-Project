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
      <text v-if="taskList.length > 0" class="count-tip">共找到 {{ taskList.length }} 个</text>
      <view v-if="taskList.length === 0" class="empty-state">暂无{{ currentTabLabel }}的特殊作业申请</view>

      <view v-for="item in taskList" :key="item.id" class="task-card" @tap="goDetail(item)">
        <!-- 绿色标题：商铺号 -->
        <text class="card-green-title">商铺号：{{ item.shop }}</text>

        <!-- 黑色副标题：特殊作业类型 -->
        <text class="card-shop-no">{{ typeLabel(item.type) }}</text>
        <text class="info-line">申请编号：{{ item.id }}</text>
        <text class="info-line">关联申请：{{ item.applyId }}</text>
        <text class="info-line">{{ workTimeLabel(item) }}</text>
        <text class="info-line">作业内容：{{ item.workContent }}</text>
        <text class="info-line">申请时间：{{ item.date }}</text>
        <text v-if="currentTab === 'rejected' && item.rejectReason" class="info-line reject-reason">驳回原因：{{ item.rejectReason }}</text>

        <!-- 已过期：有效至 / 过期时间 -->
        <template v-if="currentTab === 'expired'">
          <text v-if="item.validUntil"  class="info-line">有效至：{{ item.validUntil }}</text>
          <text v-if="item.expiredTime" class="info-line">过期时间：{{ item.expiredTime.split(' ')[0] }}</text>
        </template>

        <!-- 操作区：次要（查看详情）居左，主要（重新申请）居右 -->
        <view class="card-action" @tap.stop>
          <button class="btn-outline-green btn-short" @tap.stop="goDetail(item)">查看详情</button>
          <button
            v-if="currentTab === 'rejected'"
            class="btn-fill btn-short"
            @tap.stop="goResubmit(item)"
          >重新申请</button>
        </view>
      </view>

      <view style="height:160rpx;"></view>
    </scroll-view>

    <!-- 底部固定按钮 -->
    <view class="bottom-bar">
      <button class="btn btn-primary" @tap="goApply">＋ 新增特殊作业申请</button>
    </view>
  </view>
</template>

<script>
const { MERCHANT_SPECIAL_TABS, MERCHANT_SPECIAL_DATA, SPECIAL_TYPE_LABEL } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return {
      tabs: [],
      currentTab: 'reviewing',
      taskList: [],
    }
  },
  computed: {
    currentTabLabel() { const t = this.tabs.find(t => t.key === this.currentTab); return t ? t.label : '' },
  },
  onLoad() {
    this.tabs = MERCHANT_SPECIAL_TABS
    this._loadList('reviewing')
  },
  methods: {
    switchTab(key) {
      if (key === this.currentTab) return
      this.currentTab = key
      this._loadList(key)
    },
    _loadList(key) { this.taskList = MERCHANT_SPECIAL_DATA[key] || [] },

    typeLabel(type) { return SPECIAL_TYPE_LABEL[type] || type },
    workTimeLabel(item) {
      if (item.type === 'electric') return `用电周期：${item.workDate || '—'}`
      const date = item.workTime ? item.workTime.split(' ')[0] : '—'
      if (item.type === 'height') return `高空作业日期：${date}`
      return `动火作业日期：${date}`
    },
    goDetail(item) {
      uni.navigateTo({ url: `/pages/merchant-special-detail/index?tab=${this.currentTab}&id=${encodeURIComponent(item.id)}` })
    },
    goResubmit(item) {
      uni.navigateTo({ url: `/pages/merchant-special-apply/index?resubmit=1&id=${encodeURIComponent(item.id)}&type=${encodeURIComponent(item.type)}&applyId=${encodeURIComponent(item.applyId)}` })
    },
    goApply() {
      uni.navigateTo({ url: '/pages/merchant-special-apply/index' })
    },
  }
}
</script>

<style>
/* ── 页面 ── */
.page { display:flex; flex-direction:column; height:100vh; background:var(--color-bg-page); overflow:hidden; position:relative; }

/* ── Tab 栏 ── */
.tabs-wrap { position:relative; background:#FFFFFF; border-bottom:2rpx solid #EDEDED; flex-shrink:0; overflow:hidden; }
.tabs-wrap::after { content:''; position:absolute; right:0; top:0; bottom:0; width:64rpx; background:linear-gradient(to right,transparent,#fff); pointer-events:none; }
.tabs { display:flex; overflow-x:auto; padding:0 28rpx; scrollbar-width:none; }
.tabs::-webkit-scrollbar { display:none; }
.tab { display:inline-flex; align-items:center; gap:6rpx; padding:22rpx 32rpx 18rpx 0; font-size:28rpx; color:#4C4C4C; white-space:nowrap; position:relative; flex-shrink:0; font-weight:400; }
.tab-active { color:#1ABA6C; font-weight:600; }
.tab-lbl { position:relative; }
.tab-active .tab-lbl::after { content:''; position:absolute; bottom:-18rpx; left:50%; transform:translateX(-50%); width:40rpx; height:6rpx; background:#1ABA6C; border-radius:4rpx; }
.tab-badge { display:inline-flex; align-items:center; justify-content:center; min-width:28rpx; height:28rpx; padding:0 8rpx; border-radius:14rpx; font-size:20rpx; font-weight:600; background:#FA2B2D; color:#fff; line-height:1; }

/* ── 列表区 ── */
.task-list { flex:1; overflow:hidden; padding:0 28rpx; }
.count-tip { display:block; font-size:25rpx; color:#999999; padding:28rpx 0 12rpx 0; line-height:1.4; }
.empty-state { text-align:center; padding:120rpx 40rpx; color:var(--color-text-hint); font-size:26rpx; }

/* ── 卡片 ── */
.task-card { background:#FFFFFF; border-radius:16rpx; padding:28rpx; margin-bottom:20rpx; box-shadow:0 2rpx 12rpx rgba(0,0,0,0.05); }
.task-card:active { opacity:0.9; }
.card-green-title { display:block; font-size:28rpx; font-weight:600; color:#1ABA6C; line-height:1.4; margin-bottom:28rpx; }
.card-shop-no { display:block; font-size:24rpx; font-weight:600; color:#333333; margin-bottom:12rpx; }
.info-line { display:block; font-size:24rpx; color:#666666; margin-bottom:6rpx; line-height:1.5; }
.expired-tip { color:#999999; }
.reject-reason { color:#FA2B2D; }

/* 操作区 */
.card-action { display:flex; justify-content:flex-end; align-items:center; gap:10rpx; margin-top:24rpx; padding-top:20rpx; border-top:2rpx solid #E7E7E7; }
.btn-fill, .btn-outline-green { display:inline-flex; align-items:center; justify-content:center; height:56rpx; border-radius:12rpx; font-size:24rpx; font-weight:600; }
.btn-fill { background:#1ABA6C; color:#FFFFFF; border:none; }
.btn-outline-green { background:#FFFFFF; color:#1ABA6C; border:2rpx solid #1ABA6C; }
.btn-short { width:144rpx; }

/* ── 底部固定按钮 ── */
.bottom-bar { position:fixed; left:0; right:0; bottom:0; padding:20rpx 28rpx calc(20rpx + env(safe-area-inset-bottom)); background:#FFFFFF; border-top:2rpx solid #EDEDED; }
.btn.btn-primary { width:100%; height:88rpx; background:#1ABA6C; color:#FFFFFF; border-radius:44rpx; font-size:32rpx; font-weight:600; border:none; display:flex; align-items:center; justify-content:center; }
</style>
