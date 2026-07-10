<template>
  <view class="page">
    <!-- Tab 下划线滚动栏 -->
    <view class="tabs-wrap">
      <view class="tabs">
        <view v-for="tab in tabs" :key="tab.key"
          :class="['tab', { 'tab-active': currentTab === tab.key }]"
          @tap="switchTab(tab.key)">
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
        <text class="card-green-title">商铺号：{{ item.shop }}</text>

        <text class="card-shop-no">{{ item.addCategories }}</text>
        <text class="info-line">增项编号：{{ item.id }}</text>
        <text class="info-line">关联申请：{{ item.applyId }}</text>
        <text class="info-line">增项项目：{{ item.addProjectsText }}</text>
        <text class="info-line">是否延期：{{ item.needDelay ? '是' : '否' }}</text>
        <text v-if="item.needDelay && item.delayTo" class="info-line">延至日期：{{ item.delayTo }}</text>
        <text class="info-line">申请时间：{{ item.date }}</text>
        <text v-if="currentTab === 'rejected' && item.rejectReason" class="info-line reject-reason">驳回原因：{{ item.rejectReason }}</text>
        <template v-if="currentTab === 'cancelled'">
          <text class="info-line">取消时间：{{ item.cancelTime }}</text>
          <text class="info-line">操作人：{{ item.cancelPerson }}</text>
        </template>

        <!-- 操作区 -->
        <view class="card-action" @tap.stop>
          <button v-if="currentTab === 'rejected'" class="btn-card btn-outline-green btn-short" @tap.stop="goDetail(item)">查看详情</button>
          <button v-if="currentTab === 'rejected'" class="btn-card btn-fill btn-long" @tap.stop="goNew">重新提交</button>
          <template v-else>
            <button class="btn-card btn-outline-green btn-short" @tap.stop="goDetail(item)">查看详情</button>
            <button v-if="canCancel(currentTab)" class="btn-card btn-outline-red btn-short" @tap.stop="onCancelItem(item)">取消增项</button>
          </template>
        </view>
      </view>

      <view style="height: 200rpx;"></view>
    </scroll-view>

    <!-- 取消增项确认弹窗（居中弹窗设计规范 §1） -->
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

    <!-- 底部新增按钮 -->
    <view class="new-btn-bar">
      <button class="btn btn-primary new-btn" @tap="goNew">＋ 新增增项申请</button>
    </view>
  </view>
</template>

<script>
const { MERCHANT_ADD_ITEM_TABS, MERCHANT_ADD_ITEM_DATA } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return {
      tabs: [],
      currentTab: 'survey-reviewing',
      taskList: [],
      showCancelModal: false,
      cancelTarget: null
    }
  },
  computed: {
    currentTabLabel() {
      const t = this.tabs.find(t => t.key === this.currentTab)
      return t ? t.label : ''
    }
  },
  onLoad() {
    this.tabs = MERCHANT_ADD_ITEM_TABS
    this._loadList('survey-reviewing')
  },
  methods: {
    switchTab(key) {
      if (key === this.currentTab) return
      this.currentTab = key
      this._loadList(key)
    },
    _loadList(key) { this.taskList = MERCHANT_ADD_ITEM_DATA[key] || [] },
    goDetail(item) {
      uni.navigateTo({ url: `/pages/merchant-add-item-detail/index?tab=${this.currentTab}&id=${encodeURIComponent(item.id)}` })
    },
    goNew() {
      uni.navigateTo({ url: '/pages/merchant-add-item-new/index' })
    },
    canCancel(key) {
      return ['survey-reviewing', 'pending-submit', 'material-review', 'approving', 'pending-sign'].includes(key)
    },
    onCancelItem(item) { this.cancelTarget = item; this.showCancelModal = true },
    confirmCancel() {
      this.showCancelModal = false
      this.cancelTarget = null
      uni.showToast({ title: '增项申请已取消', icon: 'success' })
    }
  }
}
</script>

<style>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-bg-page);
  overflow: hidden;
}

/* ── Tab 栏 ── */
.tabs-wrap {
  position: relative;
  background: #FFFFFF;
  border-bottom: 2rpx solid #EDEDED;
  flex-shrink: 0;
  overflow: hidden;
}
.tabs-wrap::after {
  content: '';
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 64rpx;
  background: linear-gradient(to right, transparent, #fff);
  pointer-events: none;
}
.tabs {
  display: flex;
  overflow-x: auto;
  padding: 0 28rpx;
  scrollbar-width: none;
}
.tabs::-webkit-scrollbar { display: none; }
.tab {
  display: inline-flex;
  align-items: center;
  gap: 6rpx;
  padding: 22rpx 32rpx 18rpx 0;
  font-size: 28rpx;
  color: #4C4C4C;
  white-space: nowrap;
  position: relative;
  flex-shrink: 0;
  font-weight: 400;
}
.tab-active { color: #1ABA6C; font-weight: 600; }
.tab-lbl { position: relative; }
.tab-active .tab-lbl::after {
  content: '';
  position: absolute;
  bottom: -18rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 6rpx;
  background: #1ABA6C;
  border-radius: 4rpx;
}
.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28rpx;
  height: 28rpx;
  padding: 0 8rpx;
  border-radius: 14rpx;
  font-size: 20rpx;
  font-weight: 600;
  background: #FA2B2D;
  color: #fff;
  line-height: 1;
}

/* ── 列表 ── */
.task-list {
  flex: 1;
  overflow: hidden;
  padding: 0 28rpx;
}
.count-tip {
  display: block;
  font-size: 25rpx;
  color: #999999;
  padding: 28rpx 0 12rpx 0;
  line-height: 1.4;
}
.task-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
}
.task-card:active { opacity: 0.9; }

.card-green-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #1ABA6C;
  line-height: 1.4;
  margin-bottom: 28rpx;
}
.card-shop-no {
  display: block;
  font-size: 24rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12rpx;
}
.info-line {
  display: block;
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 6rpx;
  line-height: 1.5;
}

/* ── 操作区 ── */
.card-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10rpx;
  margin-top: 24rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid #E7E7E7;
}

/* ── 底部新增按钮 ── */
.new-btn-bar {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: #fff;
  border-top: 2rpx solid var(--color-divider-h);
  height: calc(180rpx + env(safe-area-inset-bottom));
  padding: 12rpx 36rpx 0;
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
  z-index: 100;
}
.new-btn { flex: 1; height: 88rpx; font-size: 32rpx; border-radius: 12rpx; }

.empty-state {
  text-align: center;
  padding: 120rpx 40rpx;
  color: var(--color-text-hint);
  font-size: 26rpx;
}

.card-title-row { display: flex; align-items: flex-start; gap: 28rpx; margin-bottom: 28rpx; }
.card-title-row .card-green-title { margin-bottom: 0; flex: 1; }
.reject-tag { flex-shrink: 0; padding: 4rpx 10rpx; background: rgba(250,43,45,0.05); border: 2rpx solid rgba(250,43,45,0.3); border-radius: 4rpx; color: #FA2B2D; font-size: 24rpx; font-weight: 400; line-height: 1.4; }
.reject-reason { color: #FA2B2D; }
.btn-card { display: inline-flex; align-items: center; justify-content: center; height: 56rpx; border-radius: 12rpx; font-size: 24rpx; font-weight: 600; }
.btn-fill { background: #1ABA6C; color: #fff; border: none; }
.btn-outline-green { background: #fff; color: #1ABA6C; border: 2rpx solid #1ABA6C; }
.btn-outline-red { background: #fff; color: #FA2B2D; border: 2rpx solid #FA2B2D; }
.btn-short { width: 144rpx; }
.btn-long { padding: 0 24rpx; }
.card-notice { display: flex; align-items: center; gap: 10rpx; min-height: 60rpx; padding: 0 20rpx; border-radius: 8rpx; font-size: 24rpx; margin-top: 16rpx; }
.cn-alert { background: rgba(250,43,45,0.05); color: #FA2B2D; }
.cn-green { background: #E8F9F0; color: #1ABA6C; }
.notice-icon { width: 28rpx; height: 28rpx; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 18rpx; font-weight: 700; color: #fff; flex-shrink: 0; }
/* 居中弹窗（弹窗设计规范 §1） */
.cai-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1500; display: flex; justify-content: center; align-items: center; }
.cai-box { background: #FFFFFF; border-radius: 32rpx; padding: 48rpx; width: 90%; max-width: 720rpx; box-sizing: border-box; }
.cai-title { display: block; font-size: 34rpx; font-weight: 600; color: #333333; text-align: center; margin-bottom: 32rpx; }
.cai-body { display: block; font-size: 28rpx; color: #666666; line-height: 1.8; text-align: center; }
.cai-btns { display: flex; gap: 20rpx; margin-top: 28rpx; }
.cai-btn { flex: 1; font-size: 28rpx; border-radius: 12rpx; padding: 20rpx 0; text-align: center; border: none; }
.cai-btn-cancel { background: #FFFFFF; color: #1ABA6C; border: 1rpx solid #1ABA6C; font-weight: 400; }
.cai-btn-danger { background: #FA2B2D; color: #FFFFFF; font-weight: 600; }
</style>
