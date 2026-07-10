<template>
  <view class="page">
    <scroll-view class="scroll-body" scroll-y>
      <view class="detail-section cats-section">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">巡检对象</text></view>
        <view class="detail-row"><text class="detail-label">商户</text><text class="detail-value">{{ item.title }}</text></view>
        <view class="detail-row"><text class="detail-label">施工证号</text><text class="detail-value">{{ item.certNo }}</text></view>
      </view>

      <view class="detail-section cats-section">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">装修类目及项目</text></view>
        <view v-for="cat in categoryItems" :key="cat.name" class="cat-item">
          <view class="cat-hd">
            <text class="cat-name">{{ cat.name }}</text>
            <text v-if="cat.isMyDept" class="my-dept-tag">本部门负责</text>
          </view>
          <text class="cat-sub">{{ cat.projectsText }}</text>
          <view class="cat-dept-row"><text class="cat-dept-label">责任部门：</text><text class="cat-dept-val">{{ cat.dept }}</text></view>
        </view>
      </view>

      <view v-if="selfChecks.length" class="detail-section">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">今日商户报备</text></view>
        <view v-for="sc in selfChecks" :key="sc.key" class="self-check-block">
          <view class="self-check-head">
            <text :class="['task-tag', sc.cls]">{{ sc.label }}</text>
            <text :class="['self-check-status', sc.reported ? 'done' : 'pending']">{{ sc.reported ? '已报备' : '未报备' }}</text>
          </view>
          <template v-if="sc.reported">
            <text class="self-check-row"><text class="sc-label">报备时间：</text>{{ sc.reportTime }}</text>
            <text class="self-check-row"><text class="sc-label">报备内容：</text>{{ sc.content }}</text>
          </template>
        </view>
      </view>

      <view class="detail-section cats-section">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">巡检结果</text></view>
        <view class="detail-row"><text class="detail-label">结果</text><text class="detail-value" :class="resultColorCls">{{ item.result || '正常' }}</text></view>
        <view v-if="item.inspectDescription" class="detail-row"><text class="detail-label">巡检描述</text><text class="detail-value">{{ item.inspectDescription }}</text></view>
        <view v-if="item.abnormalText" class="detail-row"><text class="detail-label">异常说明</text><text class="detail-value danger-text">{{ item.abnormalText }}</text></view>
        <view v-if="item.rectifyType" class="detail-row"><text class="detail-label">整改类型</text><text class="detail-value">{{ item.rectifyType }}</text></view>
        <view class="detail-row"><text class="detail-label">巡检时间</text><text class="detail-value">{{ item.inspectTime }}</text></view>
        <view class="detail-row"><text class="detail-label">巡检人</text><text class="detail-value">{{ item.person }}</text></view>
      </view>

      <view style="height: 20rpx;"></view>
    </scroll-view>

    <view class="bottom-bar">
      <button class="btn btn-outline-green" @tap="goBack">返回</button>
    </view>
  </view>
</template>

<script>
const { INSPECT_DATA, findInspectItem, getConstructionCategoryItems, getConstructionById, getMerchantSelfCheckList } = require('@/utils/construction-mock.js')

export default {
  data() {
    return { item: {}, categoryItems: [], selfChecks: [] }
  },

  computed: {
    resultColorCls() {
      const r = this.item.result || '正常'
      const isNormal = r.indexOf('正常') >= 0 && r.indexOf('异常') < 0
      return isNormal ? 'primary-text' : 'danger-text'
    }
  },

  onLoad(options) {
    const id = options.id || ''
    const found = findInspectItem(id)
    this.item = found ? found.item : (INSPECT_DATA.done[0] || {})
    this.categoryItems = getConstructionCategoryItems(getConstructionById(this.item.applyId))
    this.selfChecks = getMerchantSelfCheckList(this.item.applyId)
  },

  methods: {
    goBack() { uni.navigateBack() }
  }
}
</script>

<style>
.page { display: flex; flex-direction: column; height: 100vh; background: #fff; overflow: hidden; }
.scroll-body { flex: 1; overflow: hidden; padding: 20rpx 0; }

.detail-section { background: #FFFFFF; padding: 28rpx; margin-bottom: 20rpx; }
.cats-section { background: #FAFAFA; margin: 0 28rpx 20rpx; border-radius: 20rpx; border: 2rpx solid #E6E6E6; }
.sec-title { display: flex; align-items: center; gap: 16rpx; margin-bottom: 24rpx; }
.sec-bar { width: 8rpx; height: 36rpx; background: var(--color-primary); border-radius: 0 8rpx 8rpx 0; flex-shrink: 0; }
.sec-label { font-size: 28rpx; font-weight: 600; color: var(--color-text-primary); }

.detail-row { display: flex; align-items: flex-start; padding: 12rpx 0; font-size: 26rpx; }
.detail-label { width: 180rpx; flex-shrink: 0; color: #666; text-align: right; line-height: 1.5; }
.detail-label::after { content: '：'; }
.detail-value { color: var(--color-text-primary); text-align: left; flex: 1; line-height: 1.5; padding-left: 4rpx; }
.danger-text { color: var(--color-danger); }
.primary-text { color: var(--color-primary); }

.cat-item { padding: 20rpx 0; border-bottom: 2rpx solid #F0F0F0; }
.cat-item:last-child { border-bottom: none; padding-bottom: 0; }
.cat-hd { display: flex; justify-content: space-between; align-items: flex-start; gap: 16rpx; margin-bottom: 12rpx; }
.cat-name { font-size: 28rpx; font-weight: 600; color: var(--color-text-primary); }
.my-dept-tag { font-size: 20rpx; padding: 4rpx 10rpx; border-radius: 4rpx; background: var(--color-primary-light); color: var(--color-primary); border: 2rpx solid var(--color-primary-border); font-weight: 500; }
.cat-sub { display: block; font-size: 26rpx; color: #666; line-height: 1.5; margin-bottom: 12rpx; }
.cat-dept-row { font-size: 24rpx; color: #999; }
.cat-dept-val { color: var(--color-text-primary); }

.self-check-block { background: #fff; border-radius: 16rpx; padding: 24rpx; margin-bottom: 20rpx; border: 2rpx solid var(--color-divider); }
.self-check-block:last-child { margin-bottom: 0; }
.self-check-head { display: flex; justify-content: space-between; align-items: center; gap: 16rpx; margin-bottom: 16rpx; }
.self-check-status { font-size: 24rpx; padding: 4rpx 16rpx; border-radius: 8rpx; flex-shrink: 0; }
.self-check-status.done { background: var(--color-primary-light); color: var(--color-primary); }
.self-check-status.pending { background: var(--color-warning-light); color: var(--color-warning); }
.self-check-row { display: block; font-size: 24rpx; color: #666; line-height: 1.6; margin-bottom: 12rpx; }
.sc-label { color: #999; }
.task-tag { font-size: 22rpx; padding: 4rpx 16rpx; border-radius: 8rpx; background: #fff1f0; color: var(--color-danger); }
.special-fire, .special-height, .special-electric { background: #fff1f0; color: var(--color-danger); }

.bottom-bar { background: #fff; border-top: 2rpx solid #EDEDED; height: 180rpx; padding: 12rpx 36rpx 0; display: flex; align-items: flex-start; gap: 30rpx; box-sizing: border-box; flex-shrink: 0; }
.btn { flex: 1; height: 88rpx; border-radius: 12rpx; font-size: 32rpx; font-weight: 600; border: none; display: flex; align-items: center; justify-content: center; }
.btn-outline-green { background: #fff; color: var(--color-primary); border: 2rpx solid var(--color-primary); }
</style>
