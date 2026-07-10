<template>
  <view class="page">
    <view class="tabs-wrap">
      <view class="tabs">
        <view
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab', { 'tab-active': currentTab === tab.key }]"
          @tap="switchTab(tab.key)"
        >
          <text class="tab-lbl">{{ tab.label }}</text>
          <text v-if="tabBadge(tab.key) > 0" class="tab-badge">{{ tabBadge(tab.key) }}</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="task-list" :enhanced="true" :show-scrollbar="false">
      <text v-if="taskList.length > 0" class="count-tip">共找到{{ taskList.length }}个</text>
      <view v-if="taskList.length === 0" class="empty-state">暂无任务</view>

      <view
        v-for="item in taskList"
        :key="item.id"
        :class="['task-card', { readonly: currentTab === 'overdue' }]"
        @tap="onCardTap(item)"
      >
        <view class="card-title-row">
          <text class="card-green-title">{{ item.title }}</text>
          <text :class="['status-tag', item.stCls]">{{ item.stText }}</text>
        </view>
        <text class="card-shop-no">{{ item.category }}</text>
        <text class="info-line">施工证号：{{ item.certNo }}</text>
        <text class="info-line">负责部门：{{ item.department }}</text>
        <text v-if="item.dueDate" class="info-line">应检日期：{{ item.dueDate }}</text>
        <text v-if="item.abnormalText" class="info-line">异常说明：<text class="danger-text">{{ item.abnormalText }}</text></text>
        <text v-if="item.rectifyType" class="info-line">整改类型：{{ item.rectifyType }}</text>
        <text v-if="item.inspectTime" class="info-line">巡检时间：{{ item.inspectTime }}</text>
        <text v-if="item.inspectDescription" class="info-line">巡检描述：{{ item.inspectDescription }}</text>
        <view v-if="item.specialTags && item.specialTags.length" class="task-tags">
          <text v-for="t in item.specialTags" :key="t.label" :class="['task-tag', t.cls]">{{ t.label }}</text>
        </view>
        <view v-if="currentTab === 'today'" class="card-action">
          <button class="btn-fill btn-short" @tap.stop="openForm(item)">开始巡检</button>
        </view>
        <view v-else-if="currentTab === 'recheck'" class="card-action">
          <button class="btn-fill btn-short" @tap.stop="openForm(item)">开始复检</button>
        </view>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
const { INSPECT_TABS, INSPECT_DATA, getSpecialWorkTags } = require('@/utils/construction-mock.js')

export default {
  data() {
    return {
      tabs: [],
      currentTab: 'today',
      taskList: []
    }
  },

  onLoad(options) {
    this.tabs = INSPECT_TABS
    if (options.tab && INSPECT_TABS.some(t => t.key === options.tab)) {
      this.currentTab = options.tab
    }
    this.renderList()
  },

  methods: {
    tabBadge(key) {
      return (INSPECT_DATA[key] || []).length
    },

    switchTab(key) {
      if (key === this.currentTab) return
      this.currentTab = key
      this.renderList()
    },

    renderList() {
      const list = INSPECT_DATA[this.currentTab] || []
      this.taskList = list.map(item => {
        let stText = '今日待检'
        let stCls = 'status-orange'
        if (this.currentTab === 'recheck') { stText = '今日待复检'; stCls = 'status-red' }
        else if (this.currentTab === 'overdue') { stText = item.isRecheck ? '复检未检' : '初检未检'; stCls = item.isRecheck ? 'status-red' : 'status-orange' }
        else if (this.currentTab === 'done') {
          if (item.rectifyType === '停工整改') { stText = '停工整改'; stCls = 'status-red' }
          else if ((item.result || '').indexOf('异常') >= 0) { stText = item.result; stCls = 'status-red' }
          else { stText = item.result || '已巡检'; stCls = 'status-green' }
        }
        return { ...item, stText, stCls, specialTags: getSpecialWorkTags(item.applyId) }
      })
    },

    onCardTap(item) {
      if (this.currentTab === 'done') this.goDetail(item)
      else if (this.currentTab === 'recheck') this.openForm(item)
      else if (this.currentTab !== 'overdue') this.openForm(item)
    },

    openForm(item) {
      const isRecheck = this.currentTab === 'recheck' || item.isRecheck
      uni.navigateTo({ url: `/pages/inspect-form/index?inspectId=${encodeURIComponent(item.id)}&recheck=${isRecheck ? '1' : '0'}` })
    },

    goDetail(item) {
      uni.navigateTo({ url: `/pages/inspect-detail/index?id=${encodeURIComponent(item.id)}` })
    }
  }
}
</script>

<style>
.page { display: flex; flex-direction: column; height: 100vh; background: var(--color-bg-page); overflow: hidden; }

.tabs-wrap { position: relative; background: #FFFFFF; border-bottom: 2rpx solid #EDEDED; flex-shrink: 0; overflow: hidden; }
.tabs-wrap::after { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 64rpx; background: linear-gradient(to right, transparent, #fff); pointer-events: none; }
.tabs { display: flex; overflow-x: auto; padding: 0 28rpx; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab { display: inline-flex; align-items: center; gap: 6rpx; padding: 22rpx 32rpx 18rpx 0; font-size: 28rpx; color: #4C4C4C; white-space: nowrap; position: relative; flex-shrink: 0; font-weight: 400; }
.tab-active { color: #1ABA6C; font-weight: 600; }
.tab-active::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 40rpx; height: 6rpx; background: #1ABA6C; border-radius: 4rpx; }
.tab-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 28rpx; height: 28rpx; padding: 0 8rpx; border-radius: 14rpx; font-size: 20rpx; font-weight: 600; background: #FA2B2D; color: #fff; line-height: 1; }

.task-list { flex: 1; overflow: hidden; padding: 0 28rpx; }
.count-tip { display: block; font-size: 25rpx; color: #999999; padding: 28rpx 0 12rpx 0; line-height: 1.4; }
.task-card { background: #FFFFFF; border-radius: 16rpx; padding: 28rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05); }
.task-card:active { opacity: 0.9; }
.task-card.readonly:active { opacity: 1; }
.card-title-row { display: flex; align-items: flex-start; gap: 20rpx; margin-bottom: 12rpx; }
.card-green-title { font-size: 28rpx; font-weight: 600; color: #1ABA6C; line-height: 1.4; flex: 1; }
.card-shop-no { display: block; font-size: 24rpx; font-weight: 600; color: #333333; margin-bottom: 12rpx; }
.info-line { display: block; font-size: 24rpx; color: #666666; margin-bottom: 6rpx; line-height: 1.5; }
.danger-text { color: var(--color-danger); }

.status-tag { display: inline-block; padding: 4rpx 16rpx; border-radius: 8rpx; font-size: 22rpx; white-space: nowrap; flex-shrink: 0; }
.status-orange { color: var(--color-warning); background: var(--color-warning-light); }
.status-red    { color: var(--color-danger);  background: var(--color-danger-light); }
.status-green  { color: var(--color-primary); background: #E8F9F0; }

.task-tags { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 12rpx; }
.task-tag { font-size: 22rpx; padding: 4rpx 16rpx; border-radius: 8rpx; background: #fff1f0; color: var(--color-danger); }
.special-fire     { background: var(--color-warning-light); color: var(--color-warning); }
.special-height   { background: var(--color-info-light);    color: var(--color-info); }
.special-electric { background: var(--color-primary-light); color: var(--color-primary); }

.card-action { display: flex; justify-content: flex-end; align-items: center; gap: 10rpx; margin-top: 24rpx; padding-top: 20rpx; border-top: 2rpx solid #E7E7E7; }
.btn-fill { display: inline-flex; align-items: center; justify-content: center; height: 56rpx; border-radius: 12rpx; font-size: 24rpx; font-weight: 600; background: #1ABA6C; color: #fff; border: none; }
.btn-short { width: 144rpx; }

.empty-state { text-align: center; padding: 120rpx 40rpx; color: var(--color-text-hint); font-size: 26rpx; }
</style>
