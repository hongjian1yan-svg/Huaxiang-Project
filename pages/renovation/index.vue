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
      <text v-if="taskList.length > 0" class="count-tip">共找到{{ taskList.length }}个</text>
      <view v-if="taskList.length === 0" class="empty-state">暂无任务</view>

      <view
        v-for="(item, index) in taskList"
        :key="item.id"
        class="task-card"
        @tap="goDetail(index)"
      >
        <!-- 标题行 -->
        <!-- 全部 tab：始终显示类目标题 + 右上角状态标签 -->
        <template v-if="currentTab === 'all'">
          <view class="card-title-row">
            <text class="card-green-title">{{ item.cats }}</text>
            <text :class="['status-tag', item.statusCls]">{{ item.statusText }}</text>
          </view>
          <text class="card-shop-no">商铺号：{{ item.shopNo }}</text>
        </template>
        <!-- 踏勘审核中及以后：商铺号↔类目互换位置，样式不变 -->
        <template v-else-if="isSwappedTab">
          <view v-if="item.rejectTag" class="card-title-row">
            <text class="card-green-title">商铺号：{{ item.shopNo }}</text>
            <text class="reject-tag">{{ item.rejectTag }}</text>
          </view>
          <text v-else class="card-green-title">商铺号：{{ item.shopNo }}</text>
          <text class="card-shop-no">{{ item.cats }}</text>
        </template>
        <template v-else>
          <view v-if="item.rejectTag" class="card-title-row">
            <text class="card-green-title">{{ item.cats }}</text>
            <text class="reject-tag">{{ item.rejectTag }}</text>
          </view>
          <text v-else class="card-green-title">{{ item.cats }}</text>
          <text class="card-shop-no">商铺号：{{ item.shopNo }}</text>
        </template>
        <text class="info-line">商户名称：{{ item.merchant }}</text>
        <text class="info-line">申请编号：{{ item.id }}</text>
        <text class="info-line">申请时间：{{ item.date }}</text>
        <view class="level-row">
          <text class="info-label">最高审批级别：</text>
          <text :class="['status-tag', levelCls(item.level)]">{{ item.level }}级</text>
        </view>

        <!-- 操作区（按 item 所属的实际 tab 决定按钮，全部 tab 同样适用） -->
        <view v-if="effectiveTab(item) === 'pending-survey'" class="card-action" @tap.stop>
          <button class="btn-fill btn-short" @tap.stop="goSurveyCheckin(index)">签到踏勘</button>
        </view>
        <view v-else-if="effectiveTab(item) === 'my-initial-review'" class="card-action" @tap.stop>
          <button class="btn-fill btn-short" @tap.stop="goReview(index)">立即审核</button>
        </view>
        <view v-else-if="effectiveTab(item) === 'approval-in-progress'" class="card-action" @tap.stop>
          <button class="btn-fill btn-short" @tap.stop="goApproval(index)">立即审批</button>
        </view>
        <view v-else-if="effectiveTab(item) === 'pending-submit-materials'" class="card-action" @tap.stop>
          <button class="btn-fill btn-long" @tap.stop="openConfirmMaterialModal(index)">确认接收材料</button>
        </view>
        <view v-else-if="effectiveTab(item) === 'pending-payment'" class="card-action" @tap.stop>
          <button class="btn-fill btn-short" @tap.stop="goDetail(index)">确认收款</button>
        </view>
        <view v-else-if="effectiveTab(item) === 'pending-sign'">
          <view class="card-notice cn-alert">
            <text class="notice-icon">!</text>
            <text>请到安保部线下签署安全协议</text>
          </view>
          <view class="card-action" @tap.stop>
            <button class="btn-outline-green btn-short" @tap.stop="goDetail(index)">查看详情</button>
          </view>
        </view>
        <view v-else-if="effectiveTab(item) === 'pending-certificate'">
          <view class="card-notice cn-green">
            <text class="notice-icon notice-icon-green">!</text>
            <text>请等管理部生成施工证</text>
          </view>
          <view class="card-action" @tap.stop>
            <button class="btn-outline-green btn-short" @tap.stop="goDetail(index)">查看详情</button>
          </view>
        </view>
        <view v-else class="card-action" @tap.stop>
          <button class="btn-outline-green btn-short" @tap.stop="goDetail(index)">查看详情</button>
        </view>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>


  <!-- 确认接收材料弹窗 -->
  <view v-if="showConfirmMaterialModal" class="modal-overlay" @tap="closeConfirmMaterialModal">
    <view class="dialog-card" @tap.stop>
      <view class="dialog-body">
        <text class="dialog-title">确认接收材料</text>
        <text class="dialog-body-text">确认后申请将进入材料审核阶段，是否确认？</text>
      </view>
      <view class="dialog-footer">
        <button class="btn btn-outline-green" @tap="closeConfirmMaterialModal">取消</button>
        <button class="btn btn-primary" @tap="confirmMaterial">确认</button>
      </view>
    </view>
  </view>
</template>

<script>
const { TABS, TASK_DATA, STATUS_MAP } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return {
      tabs: [],
      currentTab: 'all',
      taskList: [],
      showConfirmMaterialModal: false
    }
  },

  onLoad() {
    this.tabs = TABS
    this._loadList('all')
  },

  computed: {
    isSwappedTab() {
      const nonAll = this.tabs.filter(t => t.key !== 'all')
      const idx = nonAll.findIndex(t => t.key === this.currentTab)
      return idx >= 2
    }
  },

  methods: {
    effectiveTab(item) {
      return item.sourceTab || this.currentTab
    },

    levelCls(level) {
      if (level === 1) return 'status-green'
      if (level === 3) return 'status-red'
      return 'status-orange'
    },

    switchTab(key) {
      if (key === this.currentTab) return
      this.currentTab = key
      this._loadList(key)
    },

    _loadList(tabKey) {
      if (tabKey === 'all') {
        const result = []
        TABS.filter(t => t.key !== 'all').forEach(tab => {
          const raw = TASK_DATA[tab.key] || []
          raw.forEach(item => {
            const cats = (item.tags || []).join(' / ')
            const parts = (item.title || '').split(' - ')
            const merchant = parts[0] || item.title
            const shopNo = parts[1] || ''
            const statusInfo = STATUS_MAP[tab.key] || { text: tab.label, cls: 'status-orange' }
            result.push({ ...item, cats, merchant, shopNo, rejectTag: '', statusText: statusInfo.text, statusCls: statusInfo.cls, sourceTab: tab.key })
          })
        })
        this.taskList = result
        return
      }
      const raw = TASK_DATA[tabKey] || []
      this.taskList = raw.map(item => {
        const cats = (item.tags || []).join(' / ')
        const parts = (item.title || '').split(' - ')
        const merchant = parts[0] || item.title
        const shopNo   = parts[1] || ''
        const rejectTag = tabKey === 'rejected' ? (item.rejectTag || '') : ''
        return { ...item, cats, merchant, shopNo, rejectTag }
      })
    },

    goDetail(index) {
      const item = this.taskList[index]
      const status = this.currentTab === 'all' ? item.sourceTab : this.currentTab
      uni.navigateTo({
        url: `/pages/renovation-detail/index?status=${status}&itemId=${item.id}`
      })
    },

    goSurveyCheckin(index) {
      const item = this.taskList[index]
      const parts = item.title.split(' - ')
      const category = (item.tags || []).join(' / ') + ' II级'
      uni.navigateTo({
        url: `/pages/survey-checkin/index?shopNo=${encodeURIComponent(parts[1] || '')}&itemId=${encodeURIComponent(item.id || '')}&category=${encodeURIComponent(category)}&merchant=${encodeURIComponent(parts[0] || '')}`
      })
    },

    goApproval(index) {
      const item = this.taskList[index]
      const parts = item.title.split(' - ')
      uni.navigateTo({
        url: `/pages/renovation-approval/index?from=list&applyNo=${encodeURIComponent(item.id || '')}&merchantName=${encodeURIComponent(parts[0] || '')}&shopNo=${encodeURIComponent(parts[1] || '')}&currentStep=${encodeURIComponent('营运部副总审批')}`
      })
    },

    goReview(index) {
      const item = this.taskList[index]
      const parts = item.title.split(' - ')
      uni.navigateTo({
        url: `/pages/renovation-review/index?from=list&merchantName=${encodeURIComponent(parts[0] || '')}&shopNo=${encodeURIComponent(parts[1] || '')}&contact=${encodeURIComponent('')}`
      })
    },

    openConfirmMaterialModal() {
      this.showConfirmMaterialModal = true
    },
    closeConfirmMaterialModal() { this.showConfirmMaterialModal = false },
    confirmMaterial() {
      uni.showToast({ title: '已确认接收材料', icon: 'success' })
      this.showConfirmMaterialModal = false
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
  gap: 28rpx;
  margin-bottom: 28rpx;
}
.card-green-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1.4;
  flex: 1;
}
text.card-green-title { display: block; margin-bottom: 28rpx; }
.card-title-row .card-green-title { margin-bottom: 0; }
.reject-tag {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 8rpx 16rpx;
  background: rgba(250,43,45,0.05);
  outline: 1rpx rgba(250,43,45,0.30) solid;
  outline-offset: -1rpx;
  border-radius: 4rpx;
  color: #FA2B2D;
  font-size: 20rpx;
  font-weight: 500;
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
.card-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10rpx;
  margin-top: 24rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid var(--color-border);
}
.btn-short { width: 144rpx; }
.btn-long  { padding: 0 24rpx; }
.btn-fill, .btn-outline-green {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 56rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
  font-weight: 600;
  border: none;
  line-height: 1;
}
.btn-fill::after, .btn-outline-green::after { border: none; }
.btn-fill { background: var(--color-primary); color: #fff; }
.btn-outline-green {
  background: #fff;
  color: var(--color-primary);
  border: 2rpx solid var(--color-primary) !important;
}
.card-notice {
  display: flex;
  align-items: center;
  gap: 10rpx;
  min-height: 60rpx;
  padding: 0 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  margin-top: 16rpx;
  line-height: 1.4;
}
.cn-alert { background: rgba(250,43,45,0.05); color: #FA2B2D; }
.cn-green  { background: var(--color-primary-light); color: var(--color-primary); }
.notice-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  background: #FA2B2D;
  color: #fff;
  font-size: 18rpx;
  font-weight: 700;
  line-height: 1;
}
.notice-icon-green { background: var(--color-primary); }
/* 审批级别行 */
.level-row {
  display: flex;
  align-items: center;
  margin-bottom: 6rpx;
}
.info-label {
  font-size: 24rpx;
  color: #666666;
  line-height: 1.5;
}
.level-row .status-tag {
  padding-top: 0;
  padding-bottom: 0;
}
/* 状态标签（2.5节规范） */
.status-tag {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  white-space: nowrap;
  line-height: 1.4;
}
.status-green  { background: #E8F9F0; color: #1ABA6C; }
.status-orange { background: rgba(241,146,4,0.1); color: #F19204; }
.status-red    { background: rgba(250,43,45,0.05); color: #FA2B2D; }
.modal-field { margin-bottom: 20rpx; }
.modal-label {
  display: block;
  font-size: 26rpx;
  color: var(--color-text-secondary);
  margin-bottom: 12rpx;
}
.photo-row { display: flex; gap: 16rpx; flex-wrap: wrap; }
.photo-thumb {
  width: 120rpx; height: 120rpx;
  border-radius: 16rpx; background: #f0f0f0;
  display: flex; align-items: center; justify-content: center;
}
.photo-icon { font-size: 40rpx; }
.photo-add {
  width: 120rpx; height: 120rpx;
  border-radius: 16rpx;
  border: 4rpx dashed #d9d9d9;
  display: flex; align-items: center; justify-content: center;
  font-size: 48rpx; color: #d9d9d9;
}
.location-row {
  display: flex; align-items: center; gap: 12rpx;
  padding: 16rpx 20rpx; background: #f8f9fa;
  border-radius: 12rpx; font-size: 26rpx;
  color: var(--color-text-secondary);
}
.loc-icon { font-size: 28rpx; }
.modal-textarea {
  width: 100%; padding: 16rpx 20rpx;
  border: 2rpx solid var(--color-border);
  border-radius: 12rpx; font-size: 26rpx;
  height: 120rpx; box-sizing: border-box; line-height: 1.6;
}
.textarea-danger { border-color: var(--color-danger); }
.review-action-row { display: flex; gap: 20rpx; margin-bottom: 24rpx; }
.review-btn {
  flex: 1; padding: 20rpx;
  border-radius: var(--btn-radius);
  font-size: 28rpx; font-weight: 500; text-align: center;
  border: 4rpx solid var(--color-border);
  background: #fff; color: var(--color-text-secondary);
}
.review-btn-pass   { border-color: var(--color-primary); color: var(--color-primary); background: var(--color-primary-light); }
.review-btn-reject { border-color: var(--color-danger);  color: var(--color-danger);  background: var(--color-danger-light); }
.confirm-tip {
  font-size: 26rpx; color: var(--color-text-primary);
  padding: 24rpx; background: #f8f9fa;
  border-radius: 12rpx; text-align: center; line-height: 1.6;
}
</style>
