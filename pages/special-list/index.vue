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

    <!-- 筛选栏（5 项横排，各宽 1/5） -->
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
      <!-- 顶部透明占位 = tabs + filter-bar 高度 -->
      <view class="filter-spacer" :style="{ height: panelTop + 'px' }"></view>
      <!-- 白色面板 -->
      <view class="filter-panel" @tap.stop>

        <!-- 类型一：文字输入 -->
        <view v-if="activeFilter === 'shop' || activeFilter === 'merchant'" class="fp-body">
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

        <!-- 类型二：选择 -->
        <view v-if="activeFilter === 'type'" class="fp-body">
          <view class="fp-options-grid">
            <view
              v-for="opt in typeOptions" :key="opt.value"
              :class="['fp-option', { 'fp-option-active': filterValues.type === opt.value }]"
              @tap.stop="selectType(opt.value)"
            >{{ opt.label }}</view>
          </view>
          <view class="fp-actions-double">
            <button class="fp-btn fp-btn-reset" @tap.stop="resetFilter">重置</button>
            <button class="fp-btn fp-btn-query" @tap.stop="doFilter">查询</button>
          </view>
        </view>

        <!-- 类型三：日期区间 -->
        <view v-if="activeFilter === 'date'" class="fp-body">
          <view class="fp-date-row">
            <picker mode="date" :value="filterValues.dateStart" @change="e => filterValues.dateStart = e.detail.value">
              <view class="fp-date-input">
                <text :class="filterValues.dateStart ? 'fp-date-val' : 'fp-ph'">
                  {{ filterValues.dateStart || '开始日期' }}
                </text>
              </view>
            </picker>
            <text class="fp-date-sep">至</text>
            <picker mode="date" :value="filterValues.dateEnd" @change="e => filterValues.dateEnd = e.detail.value">
              <view class="fp-date-input">
                <text :class="filterValues.dateEnd ? 'fp-date-val' : 'fp-ph'">
                  {{ filterValues.dateEnd || '结束日期' }}
                </text>
              </view>
            </picker>
          </view>
          <button class="fp-btn fp-btn-query fp-btn-full" @tap.stop="doFilter">查询</button>
        </view>

      </view>
      <!-- 深色背景 -->
      <view class="filter-bg"></view>
    </view>

    <!-- 列表区 -->
    <scroll-view scroll-y class="task-list" :enhanced="true" :show-scrollbar="false">
      <text v-if="taskList.length > 0" class="count-tip">共找到 {{ taskList.length }} 个</text>
      <view v-if="taskList.length === 0" class="empty-state">暂无{{ currentTabLabel }}的特殊作业申请</view>

      <view v-for="item in taskList" :key="item.id" class="task-card" @tap="goDetail(item)">
        <!-- 绿色标题：作业类型 -->
        <text class="card-green-title">{{ typeLabel(item.type) }}</text>

        <!-- 基本字段 -->
        <text class="card-shop-no">商铺号：{{ item.shop }}</text>
        <text class="info-line">商户名称：{{ item.merchant }}</text>
        <text class="info-line">申请编号：{{ item.id }}</text>
        <text class="info-line">关联装修：{{ item.applyId }}</text>
        <text class="info-line">申请时间：{{ item.date }}</text>
        <text class="info-line">{{ workTimeLabel(item) }}</text>
        <text class="info-line">作业内容：{{ item.workContent }}</text>
        <text v-if="item.currentStep && (currentTab === 'my-review' || currentTab === 'reviewing')" class="info-line">当前环节：{{ item.currentStep }}</text>

        <!-- 审核中：提示条 -->
        <view v-if="currentTab === 'reviewing'" class="card-notice cn-alert">
          <view class="notice-icon"><text>!</text></view>
          <text>审批进行中，暂无您能操作</text>
        </view>

        <!-- 已驳回：驳回原因提示条 -->
        <view v-if="currentTab === 'rejected' && item.rejectReason" class="card-notice cn-alert">
          <view class="notice-icon"><text>!</text></view>
          <text>{{ item.rejectReason }}</text>
        </view>

        <!-- 操作区 -->
        <view class="card-action" @tap.stop>
          <button v-if="currentTab === 'my-review'" class="btn-fill btn-short" @tap.stop="goReview(item)">立即审核</button>
          <button v-else class="btn-outline-green btn-short" @tap.stop="goDetail(item)">查看详情</button>
        </view>
      </view>

      <view style="height:40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
const { SPECIAL_TABS, SPECIAL_DATA, SPECIAL_TYPE_LABEL } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return {
      tabs: [],
      currentTab: 'my-review',
      taskList: [],

      // 筛选
      filterOpen: false,
      activeFilter: null,
      panelTop: 0,
      filterValues: {
        shop: '',
        merchant: '',
        type: 'all',
        dateStart: '',
        dateEnd: '',
      },

      filterDefs: [
        { key: 'shop',     label: '商铺号',   placeholder: '请输入商铺号' },
        { key: 'merchant', label: '商户名称', placeholder: '请输入商户名称' },
        { key: 'type',     label: '类型',     placeholder: '' },
        { key: 'date',     label: '时间',     placeholder: '' },
      ],
      typeOptions: [
        { value: 'all',      label: '全部' },
        { value: 'height',   label: '高空作业' },
        { value: 'fire',     label: '动火作业' },
        { value: 'electric', label: '临时用电' },
      ],
    }
  },
  computed: {
    currentTabLabel() {
      const t = this.tabs.find(t => t.key === this.currentTab)
      return t ? t.label : ''
    }
  },
  onLoad() {
    this.tabs = SPECIAL_TABS
    this._loadList('my-review')
  },
  methods: {
    switchTab(key) {
      if (key === this.currentTab) return
      this.currentTab = key
      this._loadList(key)
      this.closeFilter()
    },
    _loadList(key) { this.taskList = SPECIAL_DATA[key] || [] },

    isFilterActive(key) {
      if (key === 'shop')     return !!this.filterValues.shop
      if (key === 'merchant') return !!this.filterValues.merchant
      if (key === 'type')     return this.filterValues.type !== 'all'
      if (key === 'date')     return !!(this.filterValues.dateStart || this.filterValues.dateEnd)
      return false
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

    selectType(val) { this.filterValues.type = val },

    resetFilter() {
      const key = this.activeFilter
      if (key === 'type')     this.filterValues.type = 'all'
      if (key === 'date')     { this.filterValues.dateStart = ''; this.filterValues.dateEnd = '' }
      if (key === 'shop')     this.filterValues.shop = ''
      if (key === 'merchant') this.filterValues.merchant = ''
    },

    doFilter() {
      // 实际项目中按 filterValues 过滤列表
      this.closeFilter()
    },

    typeLabel(type) { return SPECIAL_TYPE_LABEL[type] || type },
    workTimeLabel(item) {
      if (item.type === 'electric') return `用电周期：${item.workDate || '—'}`
      const date = item.workTime ? item.workTime.split(' ')[0] : '—'
      if (item.type === 'height') return `高空作业日期：${date}`
      return `动火作业日期：${date}`
    },
    goDetail(item) {
      uni.navigateTo({ url: `/pages/special-detail/index?tab=${this.currentTab}&id=${encodeURIComponent(item.id)}` })
    },
    goReview(item) {
      const workDate = item.type === 'electric'
        ? (item.workDate || '')
        : (item.workTime ? item.workTime.split(' ')[0] : '')
      uni.navigateTo({
        url: `/pages/special-review/index?from=list&id=${encodeURIComponent(item.id)}&shop=${encodeURIComponent(item.shop)}&merchant=${encodeURIComponent(item.merchant)}&currentStep=${encodeURIComponent(item.currentStep || '')}&type=${encodeURIComponent(item.type)}&workDate=${encodeURIComponent(workDate)}&workContent=${encodeURIComponent(item.workContent || '')}`
      })
    },
  }
}
</script>

<style>
/* ── 页面 ── */
.page { display:flex; flex-direction:column; height:100vh; background:var(--color-bg-page); overflow:hidden; position:relative; }

/* ── Tab 栏 ── */
.tabs-wrap { position:relative; background:#FFFFFF; flex-shrink:0; overflow:hidden; }
.tabs-wrap::after { content:''; position:absolute; right:0; top:0; bottom:0; width:64rpx; background:linear-gradient(to right,transparent,#fff); pointer-events:none; }
.tabs { display:flex; overflow-x:auto; padding:0 28rpx; scrollbar-width:none; }
.tabs::-webkit-scrollbar { display:none; }
.tab { display:inline-flex; align-items:center; gap:6rpx; padding:22rpx 32rpx 18rpx 0; font-size:28rpx; color:#4C4C4C; white-space:nowrap; position:relative; flex-shrink:0; font-weight:400; }
.tab-active { color:#1ABA6C; font-weight:600; }
.tab-lbl { position:relative; }
.tab-active .tab-lbl::after { content:''; position:absolute; bottom:-18rpx; left:50%; transform:translateX(-50%); width:40rpx; height:6rpx; background:#1ABA6C; border-radius:4rpx; }
.tab-badge { display:inline-flex; align-items:center; justify-content:center; min-width:28rpx; height:28rpx; padding:0 8rpx; border-radius:14rpx; font-size:20rpx; font-weight:600; background:#FA2B2D; color:#fff; line-height:1; }

/* ── 筛选栏（5 等分）── */
.filter-bar { display:flex; background:#FFFFFF; border-bottom:2rpx solid #EDEDED; flex-shrink:0; }
.fb-item { flex:1; display:flex; align-items:center; justify-content:center; gap:6rpx; padding:20rpx 0; font-size:24rpx; color:#333333; }
.fb-active .fb-label { color:#1ABA6C; }
.fb-active .fb-arrow  { color:#1ABA6C; }
.fb-label { font-size:24rpx; }
.fb-arrow { font-size:20rpx; color:#999999; display:inline-block; transition:transform 0.2s; }
.fb-arrow-open { transform:rotate(180deg); }

/* ── 筛选遮罩 ── */
.filter-mask { position:fixed; left:0; right:0; top:0; bottom:0; z-index:200; display:flex; flex-direction:column; }
.filter-spacer { flex-shrink:0; }
.filter-panel { background:#FFFFFF; flex-shrink:0; box-shadow:0 8rpx 24rpx rgba(0,0,0,0.12); }
.filter-bg { flex:1; background:rgba(0,0,0,0.6); }

/* ── 筛选面板内容 ── */
.fp-body { padding:24rpx 36rpx 32rpx; }

/* 类型一：文字输入 */
.fp-search-row { display:flex; align-items:center; gap:20rpx; margin-bottom:28rpx; }
.fp-search-box { flex:1; display:flex; align-items:center; gap:16rpx; height:64rpx; padding:0 24rpx; background:#F5F7FA; border-radius:20rpx; }
.fp-search-icon { width:40rpx; height:40rpx; flex-shrink:0; }
.fp-input { flex:1; font-size:28rpx; color:#333333; }
.fp-ph { color:#9AA5B8; }
.fp-cancel { font-size:28rpx; color:#333333; flex-shrink:0; }

/* 类型二：选择 */
.fp-options-grid { display:flex; flex-wrap:wrap; gap:16rpx; margin-bottom:28rpx; }
.fp-option { width:210rpx; height:72rpx; display:inline-flex; align-items:center; justify-content:center; font-size:28rpx; color:#333333; background:#F5F7FA; border-radius:8rpx; border:2rpx solid transparent; }
.fp-option-active { background:#F0FBF5; border-color:#1ABA6C; color:#1ABA6C; font-weight:600; }

/* 类型三：日期 */
.fp-date-row { display:flex; align-items:center; margin-bottom:28rpx; }
.fp-date-input { flex:1; height:64rpx; background:#F5F7FA; border-radius:20rpx; display:flex; align-items:center; justify-content:center; }
.fp-date-val { font-size:28rpx; color:#333333; }
.fp-date-sep { font-size:28rpx; color:#333333; padding:0 20rpx; flex-shrink:0; }

/* 按钮 */
.fp-btn { height:88rpx; border-radius:24rpx; font-size:32rpx; font-weight:600; border:none; display:flex; align-items:center; justify-content:center; }
.fp-btn-query { background:#1ABA6C; color:#FFFFFF; }
.fp-btn-reset  { background:#FFFFFF; color:#1ABA6C; border:2rpx solid #1ABA6C; font-weight:400; }
.fp-btn-full   { width:100%; }
.fp-actions-double { display:flex; gap:20rpx; }
.fp-actions-double .fp-btn { flex:1; }

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

/* 提示条 */
.card-notice { display:flex; align-items:center; gap:10rpx; min-height:60rpx; padding:0 20rpx; border-radius:8rpx; font-size:24rpx; margin-top:16rpx; }
.cn-alert { background:rgba(250,43,45,0.05); color:#FA2B2D; }
.cn-green { background:#E8F9F0; color:#1ABA6C; }
.notice-icon { width:28rpx; height:28rpx; border-radius:50%; background:#FA2B2D; display:inline-flex; align-items:center; justify-content:center; font-size:18rpx; font-weight:700; color:#FFFFFF; flex-shrink:0; line-height:1; }
.cn-green .notice-icon { background:#1ABA6C; }

/* 操作区 */
.card-action { display:flex; justify-content:flex-end; align-items:center; gap:10rpx; margin-top:24rpx; padding-top:20rpx; border-top:2rpx solid #E7E7E7; }
.btn-fill, .btn-outline-green { display:inline-flex; align-items:center; justify-content:center; height:56rpx; border-radius:12rpx; font-size:24rpx; font-weight:600; }
.btn-fill { background:#1ABA6C; color:#fff; border:none; }
.btn-outline-green { background:#fff; color:#1ABA6C; border:2rpx solid #1ABA6C; }
.btn-short { width:144rpx; }
</style>
