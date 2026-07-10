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

    <!-- 筛选栏（3 项横排，各宽 1/3） -->
    <view class="filter-bar">
      <view
        v-for="f in filterDefs" :key="f.key"
        :class="['fb-item', { 'fb-active': isFilterActive(f.key) }]"
        @tap="openFilter(f.key)"
      >
        <text class="fb-label">{{ f.label }}</text>
        <text :class="['fb-arrow', { 'fb-arrow-open': activeFilter === f.key }]">▾</text>
      </view>
    </view>

    <!-- 筛选面板遮罩（点击空白关闭） -->
    <view v-if="filterOpen" class="filter-mask" @tap="closeFilter">
      <view class="filter-spacer" :style="{ height: panelTop + 'px' }"></view>
      <view class="filter-panel" @tap.stop>
        <view class="fp-body">
          <view class="fp-search-row">
            <view class="fp-search-box">
              <image src="/static/images/search.png" class="fp-search-icon" mode="aspectFit" />
              <input
                class="fp-input"
                v-model="filterValues[activeFilter]"
                :placeholder="filterDefs.find(f=>f.key===activeFilter).placeholder"
                placeholder-class="fp-ph"
                confirm-type="search"
                @confirm="doFilter"
              />
            </view>
            <text class="fp-cancel" @tap.stop="closeFilter">取消</text>
          </view>
          <button class="fp-btn fp-btn-query fp-btn-full" @tap.stop="doFilter">查询</button>
        </view>
      </view>
      <view class="filter-bg"></view>
    </view>

    <!-- 列表区 -->
    <scroll-view scroll-y class="task-list" :enhanced="true" :show-scrollbar="false">
      <text v-if="taskList.length > 0" class="count-tip">共找到{{ taskList.length }}个</text>
      <view v-if="taskList.length === 0" class="empty-state">暂无数据</view>

      <view v-for="item in taskList" :key="item.id" class="task-card" @tap="goDetail(item)">
        <view class="card-title-row">
          <text class="card-green-title">{{ item.shop }} · {{ item.merchant }}</text>
          <text v-if="item.showTag" :class="['status-tag', item.statusCls]">{{ item.statusText }}</text>
        </view>
        <text class="card-shop-no">{{ item.tags.join(' / ') }}</text>
        <text class="info-line">施工证号：{{ item.certNo }}</text>
        <text class="info-line">施工期间：{{ item.period }}</text>
        <text v-if="item.stopped" class="info-line">停工原因：<text class="danger-text">{{ item.stopReason || '—' }}</text></text>
        <text class="info-line">剩余天数：<text :class="item.daysCls">{{ item.daysText }}</text></text>

        <view class="card-action" @tap.stop>
          <button class="btn-outline-green btn-short" @tap.stop="goDetail(item)">查看详情</button>
          <button class="btn-fill btn-short" @tap.stop="goInspect(item)">发起巡检</button>
        </view>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
const { CONSTRUCTION_TABS, CONSTRUCTION_DATA } = require('@/utils/construction-mock.js')

export default {
  data() {
    return {
      tabs: [],
      currentTab: 'all',
      taskList: [],

      // 筛选
      filterOpen: false,
      activeFilter: null,
      panelTop: 0,
      filterValues: {
        shop: '',
        merchant: '',
        cert: ''
      },
      filterDefs: [
        { key: 'shop',     label: '商铺号',   placeholder: '请输入商铺号' },
        { key: 'merchant', label: '商户名称', placeholder: '请输入商户名称' },
        { key: 'cert',     label: '施工证号', placeholder: '请输入施工证号' }
      ]
    }
  },

  onLoad(options) {
    this.tabs = CONSTRUCTION_TABS
    if (options.tab && CONSTRUCTION_TABS.some(t => t.key === options.tab)) {
      this.currentTab = options.tab
    }
    this.renderList()
  },

  methods: {
    switchTab(key) {
      if (key === this.currentTab) return
      this.currentTab = key
      this.renderList()
      this.closeFilter()
    },

    isFilterActive(key) {
      return !!this.filterValues[key]
    },

    openFilter(key) {
      if (this.activeFilter === key && this.filterOpen) {
        this.closeFilter()
        return
      }
      this.activeFilter = key
      const query = uni.createSelectorQuery().in(this)
      query.select('.filter-bar').boundingClientRect(res => {
        this.panelTop = res ? res.bottom : 160
        this.filterOpen = true
      }).exec()
    },

    closeFilter() {
      this.filterOpen = false
      this.activeFilter = null
    },

    doFilter() {
      this.renderList()
      this.closeFilter()
    },

    renderList() {
      const shop = this.filterValues.shop.trim()
      const merchant = this.filterValues.merchant.trim()
      const cert = this.filterValues.cert.trim()
      let list = CONSTRUCTION_DATA.filter(item => {
        if (this.currentTab === 'stopped') {
          if (!item.stopped) return false
        } else if (this.currentTab !== 'all') {
          if (item.tab !== this.currentTab || item.stopped) return false
        }
        if (shop && item.shop.indexOf(shop) < 0) return false
        if (merchant && item.merchant.indexOf(merchant) < 0) return false
        if (cert && item.certNo.indexOf(cert) < 0) return false
        return true
      })
      this.taskList = list.map(item => {
        let statusText = item.tab === 'expiring' ? '即将到期' : '施工中'
        let statusCls = item.tab === 'expiring' ? 'status-orange' : 'status-blue'
        if (item.stopped) { statusText = '停工整改'; statusCls = 'status-red' }
        const showTag = this.currentTab === 'all'
        const daysText = item.daysLeft < 0 ? `已逾期 ${Math.abs(item.daysLeft)} 天` : `${item.daysLeft} 天`
        const daysCls = item.daysLeft < 0 ? 'danger-text' : ''
        return { ...item, statusText, statusCls, showTag, daysText, daysCls }
      })
    },

    goDetail(item) {
      uni.navigateTo({ url: `/pages/construction-detail/index?id=${encodeURIComponent(item.id)}` })
    },

    goInspect(item) {
      uni.navigateTo({ url: `/pages/inspect-form/index?applyId=${encodeURIComponent(item.id)}&from=construction` })
    }
  }
}
</script>

<style>
/* ── 页面 ── */
.page { display: flex; flex-direction: column; height: 100vh; background: var(--color-bg-page); overflow: hidden; position: relative; }

/* ── Tab 栏 ── */
.tabs-wrap { position: relative; background: #FFFFFF; flex-shrink: 0; overflow: hidden; }
.tabs-wrap::after { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 64rpx; background: linear-gradient(to right, transparent, #fff); pointer-events: none; }
.tabs { display: flex; overflow-x: auto; padding: 0 28rpx; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab { display: inline-flex; align-items: center; gap: 6rpx; padding: 22rpx 32rpx 18rpx 0; font-size: 28rpx; color: #4C4C4C; white-space: nowrap; position: relative; flex-shrink: 0; font-weight: 400; }
.tab-active { color: #1ABA6C; font-weight: 600; }
.tab-lbl { position: relative; }
.tab-active .tab-lbl::after { content: ''; position: absolute; bottom: -18rpx; left: 50%; transform: translateX(-50%); width: 40rpx; height: 6rpx; background: #1ABA6C; border-radius: 4rpx; }
.tab-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 28rpx; height: 28rpx; padding: 0 8rpx; border-radius: 14rpx; font-size: 20rpx; font-weight: 600; background: #FA2B2D; color: #fff; line-height: 1; }

/* ── 筛选栏（3 等分）── */
.filter-bar { display: flex; background: #FFFFFF; border-bottom: 2rpx solid #EDEDED; flex-shrink: 0; }
.fb-item { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6rpx; padding: 20rpx 0; font-size: 24rpx; color: #333333; }
.fb-active .fb-label { color: #1ABA6C; }
.fb-active .fb-arrow  { color: #1ABA6C; }
.fb-label { font-size: 24rpx; }
.fb-arrow { font-size: 20rpx; color: #999999; display: inline-block; transition: transform 0.2s; }
.fb-arrow-open { transform: rotate(180deg); }

/* ── 筛选遮罩 ── */
.filter-mask { position: fixed; left: 0; right: 0; top: 0; bottom: 0; z-index: 200; display: flex; flex-direction: column; }
.filter-spacer { flex-shrink: 0; }
.filter-panel { background: #FFFFFF; flex-shrink: 0; box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.12); }
.filter-bg { flex: 1; background: rgba(0,0,0,0.6); }

/* ── 筛选面板内容 ── */
.fp-body { padding: 24rpx 36rpx 32rpx; }
.fp-search-row { display: flex; align-items: center; gap: 20rpx; margin-bottom: 28rpx; }
.fp-search-box { flex: 1; display: flex; align-items: center; gap: 16rpx; height: 64rpx; padding: 0 24rpx; background: #F5F7FA; border-radius: 20rpx; }
.fp-search-icon { width: 40rpx; height: 40rpx; flex-shrink: 0; }
.fp-input { flex: 1; font-size: 28rpx; color: #333333; }
.fp-ph { color: #9AA5B8; }
.fp-cancel { font-size: 28rpx; color: #333333; flex-shrink: 0; }
.fp-btn { height: 88rpx; border-radius: 24rpx; font-size: 32rpx; font-weight: 600; border: none; display: flex; align-items: center; justify-content: center; }
.fp-btn-query { background: #1ABA6C; color: #FFFFFF; }
.fp-btn-full  { width: 100%; }

/* ── 列表区 ── */
.task-list { flex: 1; overflow: hidden; padding: 0 28rpx; }
.count-tip { display: block; font-size: 25rpx; color: #999999; padding: 28rpx 0 12rpx 0; line-height: 1.4; }
.task-card { background: #FFFFFF; border-radius: 16rpx; padding: 28rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05); }
.task-card:active { opacity: 0.9; }
.card-title-row { display: flex; align-items: flex-start; gap: 20rpx; margin-bottom: 12rpx; }
.card-green-title { font-size: 28rpx; font-weight: 600; color: #1ABA6C; line-height: 1.4; flex: 1; }
.card-shop-no { display: block; font-size: 24rpx; font-weight: 600; color: #333333; margin-bottom: 12rpx; }
.info-line { display: block; font-size: 24rpx; color: #666666; margin-bottom: 6rpx; line-height: 1.5; }
.danger-text { color: var(--color-danger); }
.warn-text { color: var(--color-warning); }

.status-tag { display: inline-block; padding: 4rpx 16rpx; border-radius: 8rpx; font-size: 22rpx; white-space: nowrap; flex-shrink: 0; }
.status-orange { color: var(--color-warning); background: var(--color-warning-light); }
.status-blue   { color: var(--color-info);    background: var(--color-info-light); }
.status-red    { color: var(--color-danger);  background: var(--color-danger-light); }

/* ── 操作区 ── */
.card-action { display: flex; justify-content: flex-end; align-items: center; gap: 10rpx; margin-top: 24rpx; padding-top: 20rpx; border-top: 2rpx solid #E7E7E7; }
.btn-outline-green { display: inline-flex; align-items: center; justify-content: center; height: 56rpx; border-radius: 12rpx; font-size: 24rpx; font-weight: 600; background: #fff; color: #1ABA6C; border: 2rpx solid #1ABA6C; }
.btn-fill { display: inline-flex; align-items: center; justify-content: center; height: 56rpx; border-radius: 12rpx; font-size: 24rpx; font-weight: 600; background: #1ABA6C; color: #fff; border: none; }
.btn-short { width: 144rpx; }

.empty-state { text-align: center; padding: 120rpx 40rpx; color: var(--color-text-hint); font-size: 26rpx; }
</style>
