<template>
  <view class="page">
    <!-- Tab 下划线滚动栏 -->
    <view class="tabs-wrap">
      <view class="tabs">
        <view
          v-for="tab in tabs"
          :key="tab.key"
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
      <view v-if="taskList.length === 0" class="empty-state">暂无{{ currentTabLabel }}的延期申请</view>

      <view
        v-for="item in taskList"
        :key="item.id"
        class="task-card"
        @tap="goDetail(item)"
      >
        <text class="card-green-title">商铺号：{{ item.shop }}</text>
        <text class="card-shop-no">{{ item.cats }}</text>
        <text class="info-line">延期编号：{{ item.id }}</text>
        <text class="info-line">关联申请：{{ item.applyId }}</text>
        <text class="info-line">原完工日期：{{ item.originalEnd }}</text>
        <text class="info-line">申请延至：{{ item.delayTo }}</text>
        <text class="info-line">延期天数：{{ item.days }}天</text>
        <text class="info-line">申请时间：{{ item.date }}</text>
        <text v-if="currentTab === 'rejected' && item.rejectReason" class="info-line reject-reason">驳回原因：{{ item.rejectReason }}</text>
        <template v-if="currentTab === 'cancelled'">
          <text class="info-line">取消时间：{{ item.cancelTime }}</text>
        </template>

        <!-- 操作区 -->
        <view class="card-action" @tap.stop>
          <button v-if="currentTab === 'reviewing'" class="btn-outline-red btn-short" @tap.stop="onCancelItem(item)">取消延期</button>
          <button class="btn-outline-green btn-short" @tap.stop="goDetail(item)">查看详情</button>
          <button v-if="currentTab === 'rejected'" class="btn-fill btn-short" @tap.stop="goApply(item)">重新提交</button>
        </view>
      </view>

      <view style="height: 200rpx;"></view>
    </scroll-view>

    <!-- 取消延期确认弹窗（居中弹窗设计规范） -->
    <view v-if="showCancelModal" class="cld-overlay">
      <view class="cld-box" @tap.stop>
        <text class="cld-title">取消延期</text>
        <text class="cld-body">确定要取消本次延期申请吗？取消后该装修申请可重新提交延期申请。</text>
        <view class="cld-btns">
          <button class="cld-btn-cancel" @tap="showCancelModal = false">再想想</button>
          <button class="cld-btn-danger" @tap="confirmCancel">确认取消</button>
        </view>
      </view>
    </view>

    <!-- 底部新增按钮 -->
    <view class="new-btn-bar">
      <button class="btn btn-primary new-btn" @tap="goApply(null)">＋ 新增延期申请</button>
    </view>
  </view>
</template>

<script>
const { MERCHANT_DELAY_TABS, MERCHANT_DELAY_DATA } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return {
      tabs: [],
      currentTab: 'reviewing',
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
    this.tabs = MERCHANT_DELAY_TABS
    this._loadList('reviewing')
  },

  methods: {
    switchTab(key) {
      if (key === this.currentTab) return
      this.currentTab = key
      this._loadList(key)
    },

    _loadList(tabKey) {
      const raw = MERCHANT_DELAY_DATA[tabKey] || []
      this.taskList = raw.map(item => ({
        ...item,
        cats: (item.tags || []).join(' / ')
      }))
    },

    goDetail(item) {
      uni.navigateTo({
        url: `/pages/merchant-delay-detail/index?tab=${this.currentTab}&id=${encodeURIComponent(item.id)}`
      })
    },

    goApply(item) {
      uni.navigateTo({ url: '/pages/merchant-delay-apply/index' })
    },

    onCancelItem(item) {
      this.cancelTarget = item
      this.showCancelModal = true
    },
    confirmCancel() {
      this.showCancelModal = false
      this.cancelTarget = null
      uni.showToast({ title: '延期申请已取消', icon: 'success' })
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
.reject-reason { color: #FA2B2D; }

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
.btn-fill, .btn-outline-green {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 56rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
  font-weight: 600;
}
.btn-fill          { background: #1ABA6C; color: #fff; border: none; }
.btn-outline-green { background: #fff; color: #1ABA6C; border: 2rpx solid #1ABA6C; }
.btn-outline-red   { background: #fff; color: #FA2B2D; border: 2rpx solid #FA2B2D; }
.btn-short         { width: 144rpx; }

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

/* ── 居中弹窗（对齐弹窗设计规范 §1） ── */
.cld-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1500;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cld-box {
  background: #FFFFFF;
  border-radius: 32rpx;
  padding: 48rpx;
  width: 90%;
  max-width: 720rpx;
  box-sizing: border-box;
}
.cld-title {
  display: block;
  font-size: 34rpx;
  font-weight: 600;
  color: #333333;
  text-align: center;
  margin-bottom: 32rpx;
}
.cld-body {
  display: block;
  font-size: 28rpx;
  color: #666666;
  line-height: 1.8;
  text-align: center;
}
.cld-btns {
  display: flex;
  gap: 20rpx;
  margin-top: 28rpx;
}
.cld-btn-cancel, .cld-btn-danger {
  flex: 1;
  font-size: 28rpx;
  border-radius: 12rpx;
  padding: 20rpx 0;
  text-align: center;
  border: none;
}
.cld-btn-cancel { background: #FFFFFF; color: #1ABA6C; border: 1rpx solid #1ABA6C; font-weight: 400; }
.cld-btn-danger { background: #FA2B2D; color: #FFFFFF; font-weight: 600; }
</style>
