<template>
  <view class="page">
    <scroll-view class="scroll-body" scroll-y>
      <view class="cats-section">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">巡检对象</text></view>
        <view class="detail-row"><text class="detail-label">商户</text><text class="detail-value">{{ item.title }}</text></view>
        <view class="detail-row"><text class="detail-label">施工证号</text><text class="detail-value">{{ item.certNo }}</text></view>
        <view v-if="item.dueDate" class="detail-row"><text class="detail-label">应检日期</text><text class="detail-value">{{ item.dueDate }}</text></view>
      </view>

      <view v-if="isRecheckFlow && initialInfo" class="detail-section">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">初检结果</text></view>
        <view class="detail-row"><text class="detail-label">结果</text><text class="detail-value danger-text">{{ initialInfo.result }}</text></view>
        <view class="detail-row"><text class="detail-label">异常说明</text><text class="detail-value danger-text">{{ initialInfo.abnormalText }}</text></view>
        <view class="detail-row"><text class="detail-label">整改类型</text><text class="detail-value">{{ initialInfo.rectifyType }}</text></view>
        <view class="detail-row"><text class="detail-label">巡检时间</text><text class="detail-value">{{ initialInfo.inspectTime }}</text></view>
        <view class="detail-row"><text class="detail-label">巡检人</text><text class="detail-value">{{ initialInfo.person }}</text></view>
        <view v-if="initialInfo.inspectDescription" class="detail-row"><text class="detail-label">巡检描述</text><text class="detail-value">{{ initialInfo.inspectDescription }}</text></view>
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

      <view v-if="selfChecks.length" class="cats-section">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">今日商户报备</text></view>
        <text class="section-tip">以下为商户当日有效特殊作业的报备情况，巡检时请现场核对。</text>
        <view v-for="(sc, idx) in selfChecks" :key="sc.key" :class="['cat-item', { 'no-border': idx === selfChecks.length - 1 }]">
          <view class="cat-hd">
            <text class="cat-name">{{ sc.label }}</text>
            <text :class="['stag', sc.reported ? 'stag-green' : 'stag-warn']">{{ sc.reported ? '已报备' : '未报备' }}</text>
          </view>
          <template v-if="sc.reported">
            <text class="cat-sub">{{ sc.content }}</text>
            <text class="report-time-row">报备时间：{{ sc.reportTime }}</text>
            <view v-if="sc.certs && sc.certs.length" class="cert-file-list">
              <view v-for="f in sc.certs" :key="f" class="file-item">
                <image class="file-icon" :src="isImage(f) ? '/static/images/icon-file-img.png' : '/static/images/icon-file-pdf.png'" mode="aspectFit" />
                <text class="file-name">{{ f }}</text>
                <view class="file-actions">
                  <image class="file-action-icon" src="/static/images/icon-preview.png" mode="aspectFit" />
                  <image class="file-action-icon" src="/static/images/icon-download.png" mode="aspectFit" />
                </view>
              </view>
            </view>
          </template>
          <text v-else class="cat-sub warn-text">商户尚未提交当日报备，请督促现场补报后再作业。</text>
        </view>
      </view>

      <view class="detail-section">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label req-label">巡检结果</text></view>
        <view class="rev-row">
          <text :class="['rev-btn', inspectResult === 'normal' ? 'rev-pass' : '']" @tap="setResult('normal')">正常</text>
          <text :class="['rev-btn', inspectResult === 'abnormal' ? 'rev-reject' : '']" @tap="setResult('abnormal')">存在异常</text>
        </view>

        <view v-if="inspectResult === 'abnormal'" class="abnormal-area">
          <text class="form-label"><text class="req">*</text> 异常描述</text>
          <textarea class="reject-ta" v-model="abnormalText" placeholder="请描述现场异常情况" />
          <text class="form-label" style="margin-top:24rpx;"><text class="req">*</text> 整改类型</text>
          <view class="rev-row">
            <text :class="['rev-btn', rectifyType === 'onsite' ? 'rev-pass' : '']" @tap="rectifyType = 'onsite'">现场整改</text>
            <text :class="['rev-btn', rectifyType === 'stop' ? 'rev-pass' : '']" @tap="rectifyType = 'stop'">停工整改</text>
          </view>
          <text class="form-hint">{{ rectifyHint }}</text>
        </view>

        <text class="form-label" style="margin-top:24rpx;">巡检描述</text>
        <textarea class="reject-ta" v-model="inspectDescription" placeholder="请填写现场巡检情况说明" />

        <text class="form-label" style="margin-top:24rpx;"><text class="req">*</text> {{ isRecheckFlow ? '复检现场照片' : '现场照片' }}</text>
        <text class="form-hint">请拍照或从相册选择（必填，相册一次最多可选9张，合计最多9张）。已上传 {{ photos.length }}/9 张。</text>
        <view class="photo-grid">
          <view v-for="(p, idx) in photos" :key="idx" class="photo-box filled"></view>
          <image v-if="photos.length < 9" class="photo-box add" src="/static/images/uploadedImage.png" mode="aspectFill" @tap="pickPhotos" />
        </view>
      </view>

      <view style="height: 20rpx;"></view>
    </scroll-view>

    <view class="bottom-bar">
      <button class="btn btn-outline-green" @tap="goBack">取消</button>
      <button class="btn btn-primary" @tap="submit">提交巡检</button>
    </view>
  </view>
</template>

<script>
const { INSPECT_DATA, findInspectItem, getConstructionCategoryItems, getConstructionById, getMerchantSelfCheckList } = require('@/utils/construction-mock.js')

export default {
  data() {
    return {
      item: {},
      isRecheckFlow: false,
      categoryItems: [],
      selfChecks: [],
      inspectResult: 'normal',
      abnormalText: '',
      rectifyType: 'onsite',
      inspectDescription: '',
      photos: []
    }
  },

  computed: {
    rectifyHint() {
      return this.rectifyType === 'onsite'
        ? '提交后将生成待复检任务，整改完成后需再次现场巡检确认。'
        : '提交后该商户将由「施工中」转为「停工整改」，复工前须完成停工整改复核。'
    },
    initialInfo() {
      const item = this.item
      if (!item || (!item.isRecheck && !item.abnormalText)) return null
      return {
        result: item.firstInspectResult || '存在异常',
        abnormalText: item.abnormalText || '—',
        rectifyType: item.rectifyType || '—',
        inspectDescription: item.firstInspectDescription || '',
        inspectTime: item.inspectTime || '—',
        person: item.firstInspectPerson || '—'
      }
    }
  },

  onLoad(options) {
    const inspectId = options.inspectId || ''
    const applyId = options.applyId || ''
    const recheck = options.recheck === '1'
    let found = null
    if (inspectId) {
      found = findInspectItem(inspectId)
    } else if (applyId) {
      const task = INSPECT_DATA.today.find(d => d.applyId === applyId)
      found = task ? { item: task, tab: 'today' } : null
      if (!found) {
        const c = getConstructionById(applyId)
        found = { item: { id: 'IN' + Date.now(), applyId, title: `${c ? c.shop : ''} - ${c ? c.merchant : ''}`, certNo: c ? c.certNo : '', category: c ? c.tags.join('、') : '' }, tab: 'today' }
      }
    }
    this.item = found ? found.item : (INSPECT_DATA.today[0] || {})
    this.isRecheckFlow = recheck || !!this.item.isRecheck
    this.categoryItems = getConstructionCategoryItems(getConstructionById(this.item.applyId))
    this.selfChecks = getMerchantSelfCheckList(this.item.applyId)
    uni.setNavigationBarTitle({ title: this.isRecheckFlow ? '开始复检' : '开始巡检' })
  },

  methods: {
    setResult(r) {
      this.inspectResult = r
      if (r === 'abnormal' && !this.rectifyType) this.rectifyType = 'onsite'
    },

    pickPhotos() {
      if (this.photos.length >= 9) {
        uni.showToast({ title: '最多上传9张', icon: 'none' })
        return
      }
      this.photos.push(`现场照片${this.photos.length}.jpg`)
    },

    isImage(name) { return /\.(jpg|jpeg|png|gif|webp)$/i.test(name || '') },

    goBack() { uni.navigateBack() },

    submit() {
      if (!this.photos.length) {
        uni.showToast({ title: '请上传现场照片', icon: 'none' }); return
      }
      if (this.inspectResult === 'abnormal') {
        if (!this.abnormalText.trim()) {
          uni.showToast({ title: '请填写异常描述', icon: 'none' }); return
        }
        if (this.rectifyType === 'stop') {
          uni.showToast({ title: '已提交，商户已转为停工整改', icon: 'none' })
        } else {
          uni.showToast({ title: '已提交，已生成待复检任务', icon: 'none' })
        }
      } else {
        uni.showToast({ title: this.isRecheckFlow ? '复检通过，任务已关闭' : '巡检提交成功', icon: 'success' })
      }
      setTimeout(() => uni.navigateBack(), 1200)
    }
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
.req-label::before { content: '* '; color: var(--color-danger); }

.detail-row { display: flex; align-items: flex-start; padding: 12rpx 0; font-size: 26rpx; }
.detail-label { width: 180rpx; flex-shrink: 0; color: #666; text-align: right; line-height: 1.5; }
.detail-label::after { content: '：'; }
.detail-value { color: var(--color-text-primary); text-align: left; flex: 1; line-height: 1.5; padding-left: 4rpx; }
.danger-text { color: var(--color-danger); }
.warn-text { color: var(--color-warning); }

.cat-item { padding: 20rpx 0; border-bottom: 2rpx solid #F0F0F0; }
.cat-item:last-child, .cat-item.no-border { border-bottom: none; padding-bottom: 0; }
.cat-hd { display: flex; justify-content: space-between; align-items: flex-start; gap: 16rpx; margin-bottom: 12rpx; }
.cat-name { font-size: 28rpx; font-weight: 600; color: var(--color-text-primary); }
.my-dept-tag { font-size: 20rpx; padding: 4rpx 10rpx; border-radius: 4rpx; background: var(--color-primary-light); color: var(--color-primary); border: 2rpx solid var(--color-primary-border); font-weight: 500; }
.cat-sub { display: block; font-size: 26rpx; color: #666; line-height: 1.5; margin-bottom: 12rpx; }
.report-time-row { display: block; font-size: 24rpx; color: #999; line-height: 1.5; margin-bottom: 12rpx; }
.cat-dept-row { font-size: 24rpx; color: #999; }
.cat-dept-val { color: var(--color-text-primary); }

.section-tip { display: block; font-size: 24rpx; color: var(--color-text-hint); margin: -16rpx 0 24rpx; line-height: 1.6; }
.section-tip + .cat-item { padding-top: 0; }

.stag { font-size: 22rpx; padding: 4rpx 16rpx; border-radius: 8rpx; white-space: nowrap; flex-shrink: 0; }
.stag-green { color: var(--color-primary); background: var(--color-primary-light); }
.stag-warn  { color: var(--color-warning); background: var(--color-warning-light); }

.cert-file-list { display: flex; flex-direction: column; gap: 12rpx; margin-top: 8rpx; }
.file-item { display: flex; align-items: center; gap: 16rpx; height: 100rpx; padding: 0 20rpx 0 26rpx; background: #F2FAFE; border-radius: 16rpx; border: 2rpx solid #D1E2EB; box-sizing: border-box; }
.file-icon { width: 48rpx; height: 48rpx; flex-shrink: 0; }
.file-name { flex: 1; font-size: 25rpx; color: #000; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-actions { display: flex; align-items: center; gap: 24rpx; flex-shrink: 0; }
.file-action-icon { width: 48rpx; height: 48rpx; flex-shrink: 0; }

.rev-row { display: flex; flex-wrap: wrap; gap: 20rpx; }
.rev-btn { padding: 16rpx 52rpx 17rpx; text-align: center; border-radius: 10rpx; font-size: 28rpx; font-weight: 400; background: #F7F7F7; color: #333; }
.rev-pass { background: rgba(26,186,108,0.05); outline: 2rpx solid var(--color-primary); outline-offset: -2rpx; color: var(--color-primary); font-weight: 600; }
.rev-reject { background: rgba(250,43,45,0.05); outline: 2rpx solid var(--color-danger); outline-offset: -2rpx; color: var(--color-danger); font-weight: 600; }

.abnormal-area { margin-top: 24rpx; }
.form-label { display: block; font-size: 28rpx; font-weight: 500; color: var(--color-text-primary); margin-bottom: 16rpx; }
.req { color: var(--color-danger); margin-right: 4rpx; }
.reject-ta { width: 100%; padding: 20rpx 24rpx; border: 2rpx solid var(--color-border); border-radius: 12rpx; font-size: 26rpx; height: 160rpx; background: #fff; box-sizing: border-box; }
.form-hint { display: block; font-size: 24rpx; color: var(--color-text-hint); line-height: 1.6; margin: 16rpx 0 24rpx; }

.photo-grid { display: flex; gap: 16rpx; flex-wrap: wrap; }
.photo-box { width: 144rpx; height: 144rpx; border-radius: 16rpx; overflow: hidden; }
.photo-box.filled { background: #f0f0f0; }
.photo-box.add { width: 320rpx; height: 270rpx; }

.bottom-bar { background: #fff; border-top: 2rpx solid #EDEDED; height: 180rpx; padding: 12rpx 36rpx 0; display: flex; align-items: flex-start; gap: 30rpx; box-sizing: border-box; flex-shrink: 0; }
.btn { flex: 1; height: 88rpx; border-radius: 12rpx; font-size: 32rpx; font-weight: 600; border: none; display: flex; align-items: center; justify-content: center; }
.btn-primary { background: var(--color-primary); color: #fff; }
.btn-outline-green { background: #fff; color: var(--color-primary); border: 2rpx solid var(--color-primary); }
</style>
