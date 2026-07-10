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

    <!-- 列表 -->
    <scroll-view scroll-y class="task-list" :enhanced="true" :show-scrollbar="false">
      <text v-if="taskList.length > 0" class="count-tip">共{{ taskList.length }}个申请</text>
      <view v-if="taskList.length === 0" class="empty-state">
        暂无{{ currentTabLabel }}的申请
      </view>

      <view
        v-for="item in taskList"
        :key="item.id"
        class="task-card"
        @tap="goDetail(item)"
      >
        <!-- 标题行：全部 tab 及子状态会变化的 tab（停工整改/验收中）带状态标签 -->
        <view v-if="showStatusTag(item)" class="card-title-row">
          <text class="card-green-title">商铺号：{{ item.shop }}</text>
          <text :class="['status-tag', item.statusCls]">{{ item.statusText }}</text>
        </view>
        <text v-else class="card-green-title">商铺号：{{ item.shop }}</text>
        <!-- 装修类目 -->
        <text class="card-shop-no">{{ item.cats }}</text>
        <text class="info-line">商户名称：{{ item.merchant }}</text>
        <text class="info-line">申请编号：{{ item.id }}</text>
        <text class="info-line">申请时间：{{ item.date }}</text>
        <text v-if="item.materialReceived" class="info-line">材料接收：{{ item.materialReceived }}</text>
        <text v-if="item.decoratePeriod" class="info-line">施工期间：{{ item.decoratePeriod }}</text>
        <template v-if="effectiveTab(item) === 'work-stopped'">
          <text v-if="item.reinspectSubmitted" class="info-line">复检申请：{{ item.reinspectSubmit && item.reinspectSubmit.submitTime }}</text>
          <text class="info-line card-stop-tip">停工原因：{{ item.stopReason }}</text>
          <text v-if="item.reinspectRejected" class="info-line card-reject-tip">驳回原因：{{ item.reinspectRejectReason }}</text>
        </template>
        <text v-if="effectiveTab(item) === 'pending-acceptance' && item.acceptanceRejected" class="info-line card-reject-tip">驳回原因：{{ item.acceptanceRejectReason }}</text>

        <view class="card-action">
          <!-- 施工中：更多操作 + 每日报备 -->
          <template v-if="effectiveTab(item) === 'under-construction'">
            <button class="card-detail-btn" @tap.stop="goMoreActions(item)">更多操作</button>
            <button class="card-reapply-btn" @tap.stop="goDailyReport(item)">每日报备</button>
          </template>
          <!-- 停工整改：逾期停工显示"申请延期"，其余显示"更多操作" -->
          <template v-else-if="effectiveTab(item) === 'work-stopped'">
            <button v-if="item.overdueStopped" class="card-detail-btn" @tap.stop="goDelayApply(item)">申请延期</button>
            <button v-else class="card-detail-btn" @tap.stop="goWorkStoppedMoreActions(item)">更多操作</button>
            <button class="card-reapply-btn" @tap.stop="goDailyReport(item)">每日报备</button>
          </template>
          <!-- 验收中：正常仅"查看详情"；已驳回时增加"每日报备" -->
          <template v-else-if="effectiveTab(item) === 'pending-acceptance'">
            <button v-if="item.acceptanceRejected" class="card-detail-btn" @tap.stop="goDetail(item)">查看详情</button>
            <button class="card-reapply-btn" @tap.stop="item.acceptanceRejected ? goDailyReport(item) : goDetail(item)">{{ item.acceptanceRejected ? '每日报备' : '查看详情' }}</button>
          </template>
          <!-- 其他 tab -->
          <template v-else>
            <button class="card-detail-btn" @tap.stop="goDetail(item)">查看详情</button>
            <button v-if="effectiveTab(item) === 'rejected'" class="card-reapply-btn" @tap.stop="goReapply(item)">重新申请</button>
            <button v-if="effectiveTab(item) === 'pending-payment'" class="card-payment-btn" @tap.stop="goPayment(item)">提交缴费凭证</button>
          </template>
        </view>
      </view>

      <view style="height: 200rpx;"></view>
    </scroll-view>

    <!-- 底部新增按钮 -->
    <view class="new-btn-bar">
      <button class="btn btn-primary new-btn" @tap="onNew">＋ 新增装修申请</button>
    </view>

    <!-- 申请验收拦截提示（关联申请未审批通过） -->
    <view v-if="showAcceptBlockModal" class="modal-overlay" @tap="showAcceptBlockModal = false">
      <view class="dialog-card" @tap.stop>
        <view class="dialog-body">
          <text class="dialog-title">提示</text>
          <text class="dialog-body-text">您的<text class="accept-block-danger">{{ acceptBlockMessage }}</text>尚在审批中，请等待审批通过后再发起验收。如已确认无需延期或增项，可在对应列表自行取消后再发起验收。</text>
        </view>
        <view class="dialog-footer">
          <button class="btn btn-primary" @tap="showAcceptBlockModal = false">我知道了</button>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
const {
  MERCHANT_TABS, MERCHANT_STATUS_CONFIG, MERCHANT_TASK_DATA,
  getWorkStoppedCardStatus, getPendingAcceptanceCardStatus, getPendingSubApplyTypesForAcceptance
} = require('@/utils/renovation-mock.js')

const ACCEPT_BLOCK_TYPE_LABEL = { delay: '延期申请', addItem: '增项申请', special: '特殊作业申请' }

export default {
  data() {
    return {
      tabs: [],
      currentTab: 'all',
      taskList: [],
      showAcceptBlockModal: false,
      acceptBlockTypes: []
    }
  },

  computed: {
    currentTabLabel() {
      const t = this.tabs.find(t => t.key === this.currentTab)
      return t ? t.label : ''
    },
    acceptBlockMessage() {
      return this.acceptBlockTypes.map(t => ACCEPT_BLOCK_TYPE_LABEL[t] || t).join('、')
    }
  },

  onLoad(options) {
    this.tabs = MERCHANT_TABS
    const initTab = options.tab || 'all'
    this.currentTab = initTab
    this._loadList(initTab)
  },

  methods: {
    effectiveTab(item) {
      return item.sourceTab || this.currentTab
    },

    showStatusTag(item) {
      const tab = this.effectiveTab(item)
      return this.currentTab === 'all' || tab === 'work-stopped' || tab === 'pending-acceptance'
    },

    goReapply(item) {
      uni.navigateTo({ url: '/pages/merchant-apply-new/index?mode=reapply' })
    },

    goPayment(item) {
      uni.navigateTo({ url: `/pages/merchant-payment/index?itemId=${encodeURIComponent(item.id)}` })
    },

    goMoreActions(item) {
      uni.showActionSheet({
        itemList: ['申请验收', '申请增项', '申请延期', '申请特殊作业'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.tryApplyAccept(item)
          } else if (res.tapIndex === 2) {
            uni.navigateTo({ url: `/pages/merchant-delay-apply/index?applyId=${encodeURIComponent(item.id)}` })
          } else if (res.tapIndex === 3) {
            uni.navigateTo({ url: `/pages/merchant-special-apply/index?applyId=${encodeURIComponent(item.id)}` })
          } else {
            uni.showToast({ title: '申请增项', icon: 'none' })
          }
        }
      })
    },

    tryApplyAccept(item) {
      const types = getPendingSubApplyTypesForAcceptance(item.id)
      if (types.length) {
        this.acceptBlockTypes = types
        this.showAcceptBlockModal = true
        return
      }
      uni.navigateTo({ url: `/pages/merchant-accept-apply/index?applyId=${encodeURIComponent(item.id)}` })
    },

    goDailyReport(item) {
      uni.navigateTo({ url: `/pages/merchant-daily-report/index?applyId=${encodeURIComponent(item.id)}` })
    },

    goDelayApply(item) {
      uni.navigateTo({ url: `/pages/merchant-delay-apply/index?applyId=${encodeURIComponent(item.id)}` })
    },

    goWorkStoppedMoreActions(item) {
      uni.showActionSheet({
        itemList: ['申请复检', '申请增项', '申请延期', '申请特殊作业'],
        success: (res) => {
          const id = encodeURIComponent(item.id)
          if (res.tapIndex === 0) {
            uni.navigateTo({ url: `/pages/merchant-reinspect-apply/index?applyId=${id}` })
          } else if (res.tapIndex === 1) {
            uni.navigateTo({ url: `/pages/merchant-add-item-new/index?applyId=${id}` })
          } else if (res.tapIndex === 2) {
            uni.navigateTo({ url: `/pages/merchant-delay-apply/index?applyId=${id}` })
          } else if (res.tapIndex === 3) {
            uni.navigateTo({ url: `/pages/merchant-special-apply/index?applyId=${id}` })
          }
        }
      })
    },

    _cardStatus(tabKey, item) {
      if (tabKey === 'work-stopped') return getWorkStoppedCardStatus(item)
      if (tabKey === 'pending-acceptance') return getPendingAcceptanceCardStatus(item)
      return null
    },

    switchTab(key) {
      if (key === this.currentTab) return
      this.currentTab = key
      this._loadList(key)
    },

    _loadList(tabKey) {
      if (tabKey === 'all') {
        const result = []
        MERCHANT_TABS.filter(t => t.key !== 'all').forEach(tab => {
          const sc  = MERCHANT_STATUS_CONFIG[tab.key] || {}
          const raw = MERCHANT_TASK_DATA[tab.key] || []
          raw.forEach(item => {
            const cats = (item.tags || []).join(' / ')
            const dynamic = this._cardStatus(tab.key, item)
            result.push({
              ...item,
              cats,
              statusText: dynamic ? dynamic.text : (sc.text || tab.label),
              statusCls: dynamic ? dynamic.cls : (sc.cls || 'status-orange'),
              sourceTab: tab.key
            })
          })
        })
        this.taskList = result
        return
      }
      const sc  = MERCHANT_STATUS_CONFIG[tabKey] || {}
      const raw = MERCHANT_TASK_DATA[tabKey] || []
      this.taskList = raw.map(item => {
        let statusText = sc.text || ''
        let statusCls  = sc.cls  || 'status-orange'
        if (tabKey === 'rejected' && item.rejectType) {
          statusText = item.rejectType
          statusCls  = 'status-red'
        }
        const dynamic = this._cardStatus(tabKey, item)
        if (dynamic) { statusText = dynamic.text; statusCls = dynamic.cls }
        const cats = (item.tags || []).join(' / ')
        return { ...item, statusText, statusCls, cats }
      })
    },

    goDetail(item) {
      const status = this.currentTab === 'all' ? item.sourceTab : this.currentTab
      uni.navigateTo({
        url: `/pages/merchant-apply-detail/index?status=${status}&itemId=${item.id}&rejectType=${encodeURIComponent(item.rejectType || '')}`
      })
    },

    onNew() {
      uni.navigateTo({ url: '/pages/merchant-apply-new/index' })
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

/* 下划线横向滚动 Tab 栏 */
.tabs-wrap {
  position: relative;
  background: #fff;
  border-bottom: 2rpx solid var(--color-divider-h);
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
.tab-active { color: var(--color-primary); font-weight: 600; }
.tab-lbl { position: relative; }
.tab-active .tab-lbl::after {
  content: '';
  position: absolute;
  bottom: -18rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 6rpx;
  background: var(--color-primary);
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
  background: var(--color-danger);
  color: #fff;
  line-height: 1;
}

/* 列表 */
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
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
}
.task-card:active { opacity: 0.9; }

.card-title-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 28rpx;
}
.card-green-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1.4;
  margin-bottom: 28rpx;
  flex: 1;
}
.card-title-row .card-green-title { margin-bottom: 0; }
.status-tag { display: inline-flex; align-items: center; padding: 4rpx 16rpx; border-radius: 8rpx; font-size: 22rpx; white-space: nowrap; line-height: 1.4; flex-shrink: 0; }
.status-green  { background: #E8F9F0; color: #1ABA6C; }
.status-orange { background: rgba(241,146,4,0.1); color: #F19204; }
.status-red    { background: rgba(250,43,45,0.05); color: #FA2B2D; }
.status-blue   { background: rgba(24,144,255,0.1); color: #1890FF; }
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
.card-stop-tip, .card-reject-tip {
  background: rgba(250,43,45,0.05);
  color: var(--color-danger);
  border-radius: 8rpx;
  padding: 12rpx 16rpx;
  margin: 8rpx 0;
}
.card-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16rpx;
  margin-top: 24rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid var(--color-divider-h);
}
.card-detail-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 144rpx;
  height: 56rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: var(--color-primary);
  background: #fff;
  border: 1rpx solid var(--color-primary);
}
.card-reapply-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 144rpx;
  height: 56rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #fff;
  background: var(--color-primary);
  border: none;
}
.card-payment-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 56rpx;
  padding: 0 28rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #fff;
  background: var(--color-primary);
  border: none;
}

/* 底部新增按钮 */
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

/* 申请验收拦截提示弹窗 */
.accept-block-danger { color: var(--color-danger); font-weight: 500; }
</style>
