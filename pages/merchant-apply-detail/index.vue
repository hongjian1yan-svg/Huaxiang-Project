<template>
  <view class="page" :style="{ paddingBottom: hasPrimaryBtn ? '200rpx' : '40rpx' }">

    <!-- 状态提示横幅 -->
    <view v-if="banner" :class="['notice-banner', 'notice-' + banner.type]">
      <view class="notice-icon-wrap">
        <text class="notice-icon-text">!</text>
      </view>
      <view class="notice-body">
        <text class="notice-title">{{ banner.title }}</text>
        <text class="notice-text">{{ banner.text }}</text>
      </view>
    </view>

    <!-- 驳回信息 -->
    <view v-if="rejectInfo" class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">驳回信息</text></view>
      <view class="detail-row">
        <text class="detail-label">驳回类型</text>
        <text class="detail-value" style="color: var(--color-danger);">{{ rejectInfo.type }}</text>
      </view>
      <view class="detail-row">
        <text class="detail-label">驳回原因</text>
        <text class="detail-value">{{ rejectInfo.reason }}</text>
      </view>
    </view>

    <!-- 申请基本信息 -->
    <view class="info-card">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">申请基本信息</text></view>
      <view class="info-row"><text class="i-label">申请编号：</text><text class="i-value">{{ itemId }}</text></view>
      <view class="info-row"><text class="i-label">商户名称：</text><text class="i-value">{{ merchant }}</text></view>
      <view class="info-row"><text class="i-label">商铺号：</text><text class="i-value">{{ shop }}</text></view>
      <view class="info-row"><text class="i-label">计划装修周期：</text><text class="i-value">{{ decoratePeriod || '—' }}</text></view>
      <view class="info-row"><text class="i-label">申请时间：</text><text class="i-value">{{ applyDate }}</text></view>
      <view class="info-row">
        <text class="i-label">当前状态：</text>
        <text :class="['i-value', statusColorCls]">{{ sc.text }}</text>
      </view>
      <template v-if="showConstruction">
        <view class="info-row"><text class="i-label">施工期间：</text><text class="i-value">{{ constructionPeriod }}</text></view>
        <view class="info-row"><text class="i-label">施工证号：</text><text class="i-value">{{ certNo }}</text></view>
        <view class="cert-link" @tap="showCertModal = true">📋 查看电子施工证</view>
      </template>
    </view>

    <!-- 停工信息（停工整改） -->
    <view v-if="stopInfo" class="info-card">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">停工信息</text></view>
      <view class="info-row"><text class="i-label">停工时间：</text><text class="i-value">{{ stopInfo.time }}</text></view>
      <view class="info-row"><text class="i-label">停工部门：</text><text class="i-value">{{ stopInfo.dept }}</text></view>
      <view class="info-row"><text class="i-label">执行人：</text><text class="i-value">{{ stopInfo.person }}</text></view>
      <view class="info-row"><text class="i-label">停工原因：</text><text class="i-value status-cur-red">{{ stopInfo.reason }}</text></view>
    </view>

    <!-- 复检申请信息（停工整改） -->
    <view v-if="reinspectSubmit" class="info-card">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">复检申请信息</text></view>
      <view class="info-row"><text class="i-label">提交时间：</text><text class="i-value">{{ reinspectSubmit.time }}</text></view>
      <view class="info-row"><text class="i-label">复检说明：</text><text class="i-value">{{ reinspectSubmit.remark }}</text></view>
      <view v-if="reinspectSubmit.photos.length" class="info-row">
        <text class="i-label">整改照片：</text>
        <view class="photo-grid">
          <view v-for="p in reinspectSubmit.photos" :key="p" class="photo-thumb"></view>
        </view>
      </view>
    </view>

    <!-- 复检驳回信息（停工整改） -->
    <view v-if="reinspectReject" class="info-card">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">复检驳回信息</text></view>
      <view class="info-row"><text class="i-label">驳回时间：</text><text class="i-value">{{ reinspectReject.time }}</text></view>
      <view class="info-row"><text class="i-label">驳回人员：</text><text class="i-value">{{ reinspectReject.person }}</text></view>
      <view class="info-row"><text class="i-label">驳回原因：</text><text class="i-value status-cur-red">{{ reinspectReject.reason }}</text></view>
    </view>

    <!-- 验收申请信息（验收中） -->
    <view v-if="acceptanceSubmit" class="info-card">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">验收申请信息</text></view>
      <view class="info-row"><text class="i-label">提交验收时间：</text><text class="i-value">{{ acceptanceSubmit.time }}</text></view>
      <view class="info-row"><text class="i-label">装修公司名称：</text><text class="i-value">{{ acceptanceSubmit.companyName }}</text></view>
      <view class="info-row"><text class="i-label">联系人：</text><text class="i-value">{{ acceptanceSubmit.contactName }}</text></view>
      <view class="info-row"><text class="i-label">电话：</text><text class="i-value">{{ acceptanceSubmit.contactPhone }}</text></view>
      <view class="info-row"><text class="i-label">验收备注：</text><text class="i-value">{{ acceptanceSubmit.remark }}</text></view>
      <view v-if="acceptanceSubmit.photos.length" class="info-row">
        <text class="i-label">竣工照片：</text>
        <view class="photo-grid">
          <view v-for="p in acceptanceSubmit.photos" :key="p" class="photo-thumb"></view>
        </view>
      </view>
    </view>

    <!-- 验收驳回信息（验收中） -->
    <view v-if="acceptanceReject" class="info-card">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">驳回信息</text></view>
      <view class="info-row"><text class="i-label">驳回类型：</text><text class="i-value status-cur-red">验收驳回</text></view>
      <view class="info-row"><text class="i-label">驳回时间：</text><text class="i-value">{{ acceptanceReject.time }}</text></view>
      <view class="info-row"><text class="i-label">驳回原因：</text><text class="i-value">{{ acceptanceReject.reason }}</text></view>
    </view>

    <!-- 装修类目及项目 -->
    <view class="cats-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">装修类目及项目</text></view>
      <view v-for="cat in categories" :key="cat.name" class="cat-item">
        <text class="cat-name">{{ cat.name }}</text>
        <text class="cat-sub">{{ cat.projects.join('、') }}</text>
      </view>
    </view>

    <!-- 增项申请记录 -->
    <view v-if="addItemRecords.length > 0" class="cats-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">增项申请记录</text></view>
      <view v-for="record in addItemRecords" :key="record.id" class="add-item-record">
        <view class="air-row">
          <text class="air-label">增项类目</text>
          <text class="air-value">{{ record.categories }}</text>
        </view>
        <view class="air-row">
          <text class="air-label">增项编号</text>
          <text class="air-value">{{ record.id }}</text>
        </view>
        <view class="air-row">
          <text class="air-label">申请时间</text>
          <text class="air-value">{{ record.date }}</text>
        </view>
        <view class="air-detail-btn-row">
          <text class="air-detail-btn" @tap="goAddItemDetail(record)">查看详情</text>
        </view>
      </view>
    </view>

    <!-- 附件资料 -->
    <view class="detail-section detail-section-attach">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">附件资料</text></view>
      <template v-for="(att, index) in attachments" :key="index">
        <view v-if="att.type === 'divider'" class="attach-divider" />
        <view v-else class="attach-cat">
          <view class="attach-cat-label">{{ att.label }}</view>
          <view class="attach-file-row">
            <image
              class="attach-file-icon"
              :src="att.type === 'pdf' ? '/static/images/icon-file-pdf.png' : '/static/images/icon-file-img.png'"
              mode="aspectFit"
            />
            <text class="attach-file-name">{{ att.name }}</text>
            <view class="attach-actions">
              <image class="attach-action-icon" src="/static/images/icon-preview.png" mode="aspectFit" />
              <image class="attach-action-icon" src="/static/images/icon-download.png" mode="aspectFit" />
            </view>
          </view>
        </view>
      </template>
    </view>


    <!-- 申请记录（时间线） -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">申请记录</text></view>
      <view class="timeline">
        <view v-for="(item, index) in timeline" :key="index" class="tl-item">
          <view class="tl-axis">
            <view :class="['tl-dot', item.dotCls]"></view>
            <view v-if="index < timeline.length - 1" class="tl-line"></view>
          </view>
          <view class="tl-content">
            <view class="tl-hd">
              <text class="tl-dept">{{ item.node }}</text>
              <text :class="['tl-status', item.statusCls]">{{ item.text }}</text>
            </view>
            <view v-if="item.person || item.time" class="tl-meta">
              <text v-if="item.person && item.person !== '—'" class="tl-person">{{ item.person }}</text>
              <text v-if="item.time && item.time !== '—'" class="tl-time">{{ item.time }}</text>
            </view>
            <text v-if="item.opinion" :class="item.result === 'reject' ? 'tl-opinion-reject' : 'tl-opinion'">
              {{ item.result === 'reject' ? '驳回原因：' : '说明：' }}{{ item.opinion }}
            </text>
            <text v-if="item.node && item.node.includes('踏勘签到') && item.result !== 'not-surveyed'" class="tl-survey-photo-link" @tap="viewSurveyPhotos(item)">查看签到照片</text>
          </view>
        </view>
      </view>
    </view>

  </view>

  <!-- 底部操作栏 -->
  <view v-if="hasPrimaryBtn || hasSecondaryBtn" class="bottom-bar">
    <button v-if="hasSecondaryBtn" :class="['btn', btnSecondary.action === 'cancel-accept' ? 'btn-outline-red' : 'btn-outline-green']" @tap="onSecondary">{{ btnSecondary.text }}</button>
    <button v-if="hasPrimaryBtn"   class="btn btn-primary"       @tap="onPrimary">{{ btnPrimary.text }}</button>
  </view>

  <!-- 取消验收确认弹窗 -->
  <view v-if="showCancelAcceptModal" class="modal-overlay" @tap="showCancelAcceptModal = false">
    <view class="dialog-card" @tap.stop>
      <view class="dialog-body">
        <text class="dialog-title">取消验收</text>
        <text class="dialog-body-text">确定要取消本次验收申请吗？取消后该装修申请将退回「施工中」状态，可重新提交验收申请。</text>
      </view>
      <view class="dialog-footer">
        <button class="btn btn-outline-green" @tap="showCancelAcceptModal = false">再想想</button>
        <button class="btn btn-danger" @tap="confirmCancelAccept">确认取消</button>
      </view>
    </view>
  </view>

  <!-- 电子施工证弹窗 -->
  <view v-if="showCertModal" class="modal-overlay" @tap="showCertModal = false">
    <view class="cert-modal" @tap.stop>
      <view class="cert-hd">
        <view class="cert-main-title">装修施工证</view>
        <view class="cert-sub-title">RENOVATION CONSTRUCTION PERMIT</view>
      </view>
      <view class="cert-row"><text class="cert-label">装修商户</text><text class="cert-val">北京拿铁旧机动车</text></view>
      <view class="cert-row"><text class="cert-label">商铺号</text><text class="cert-val">B08</text></view>
      <view class="cert-row"><text class="cert-label">装修内容</text><text class="cert-val">门头广告·基建改造</text></view>
      <view class="cert-row"><text class="cert-label">有效期</text><text class="cert-val">2026-05-01 至 2026-06-30</text></view>
      <view class="cert-row"><text class="cert-label">防伪码</text><text class="cert-val cert-code">SZ202605010001</text></view>
      <view class="cert-footer">
        <view class="cert-qr-placeholder">QR</view>
        <view class="cert-stamp">市场{{ '\n' }}管理部</view>
      </view>
      <view class="cert-btns">
        <button class="btn btn-outline" @tap="showCertModal = false">关闭</button>
      </view>
    </view>
  </view>
</template>

<script>
const { buildMerchantDetailData } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return {
      status: '',
      itemId: '',
      rejectType: '',
      merchant: '',
      shop: '',
      decoratePeriod: '',
      applyDate: '',
      sc: {},
      stepIndex: 0,
      banner: null,
      rejectInfo: null,
      showConstruction: false,
      constructionPeriod: '',
      certNo: '',
      stopInfo: null,
      reinspectSubmit: null,
      reinspectReject: null,
      acceptanceSubmit: null,
      acceptanceReject: null,
      attachments: [],
      showPaymentForm: false,
      categories: [],
      timeline: [],
      btnPrimary: null,
      btnSecondary: null,
      showCertModal: false,
      showCancelAcceptModal: false,
      addItemRecords: []
    }
  },

  computed: {
    hasPrimaryBtn()   { return !!this.btnPrimary },
    hasSecondaryBtn() { return !!this.btnSecondary },
    statusColorCls() {
      const map = { 'status-green': 'status-cur-green', 'status-red': 'status-cur-red', 'status-orange': 'status-cur-orange', 'status-blue': 'status-cur-blue' }
      return map[this.sc.cls] || ''
    }
  },

  onLoad(options) {
    this.status     = options.status    || 'draft'
    this.itemId     = options.itemId    || ''
    this.rejectType = decodeURIComponent(options.rejectType || '')

    const d = buildMerchantDetailData(this.status, this.rejectType, this.itemId)
    this.sc                  = d.sc
    this.merchant             = d.merchant
    this.shop                 = d.shop
    this.decoratePeriod       = d.decoratePeriod
    this.applyDate            = d.applyDate
    this.stepIndex           = d.stepIndex
    this.banner              = d.banner
    this.rejectInfo          = d.rejectInfo
    this.showConstruction    = d.showConstruction
    this.constructionPeriod  = d.constructionPeriod
    this.certNo              = d.certNo
    this.stopInfo            = d.stopInfo
    this.reinspectSubmit     = d.reinspectSubmit
    this.reinspectReject     = d.reinspectReject
    this.acceptanceSubmit    = d.acceptanceSubmit
    this.acceptanceReject    = d.acceptanceReject
    this.attachments         = d.attachments
    this.showPaymentForm     = d.showPaymentForm
    this.categories          = d.categories || []
    this.timeline            = d.timeline
    this.btnPrimary          = d.btnPrimary
    this.btnSecondary        = d.btnSecondary
    this.addItemRecords      = d.addItemRecords || []

    uni.setNavigationBarTitle({ title: this.sc.text + '详情' })
  },

  methods: {
    goAddItemDetail(record) {
      uni.navigateTo({ url: `/pages/merchant-add-item-detail/index?tab=${record.tab}&id=${encodeURIComponent(record.id)}` })
    },
    viewSurveyPhotos(item) {
      uni.previewImage({
        urls: ['/static/images/uploadedImage.png'],
        current: 0
      })
    },

    onSecondary() {
      const a = this.btnSecondary && this.btnSecondary.action
      if (a === 'more-actions') {
        uni.showActionSheet({
          itemList: ['申请验收', '申请增项', '申请延期', '申请特殊作业'],
          success: (res) => {
            uni.showToast({ title: ['申请验收', '申请增项', '申请延期', '申请特殊作业'][res.tapIndex], icon: 'none' })
          }
        })
        return
      }
      if (a === 'reinspect-menu') {
        uni.showActionSheet({
          itemList: ['申请复检', '申请增项', '申请延期', '申请特殊作业'],
          success: (res) => {
            const id = encodeURIComponent(this.itemId)
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
        return
      }
      if (a === 'delay-apply') {
        uni.navigateTo({ url: `/pages/merchant-delay-apply/index?applyId=${encodeURIComponent(this.itemId)}` })
        return
      }
      if (a === 'cancel-accept') {
        this.showCancelAcceptModal = true
        return
      }
      uni.navigateBack()
    },

    confirmCancelAccept() {
      this.showCancelAcceptModal = false
      uni.showToast({ title: '验收申请已取消', icon: 'none' })
      setTimeout(() => uni.navigateBack(), 1000)
    },

    onPrimary() {
      const a = this.btnPrimary && this.btnPrimary.action
      if (a === 'daily-report') {
        uni.navigateTo({ url: `/pages/merchant-daily-report/index?applyId=${encodeURIComponent(this.itemId)}` }); return
      }
      if (a === 'back')           { uni.navigateBack(); return }
      if (a === 'submit-payment') {
        uni.navigateTo({ url: `/pages/merchant-payment/index?itemId=${encodeURIComponent(this.itemId)}` }); return
      }
      if (a === 'reaccept') {
        uni.navigateTo({ url: `/pages/merchant-accept-apply/index?applyId=${encodeURIComponent(this.itemId)}` })
        return
      }
      if (a === 'reapply') {
        uni.navigateTo({ url: '/pages/merchant-apply-new/index?mode=reapply' }); return
      }
      if (a === 'reupload') {
        uni.navigateTo({ url: '/pages/merchant-apply-new/index?mode=reupload' }); return
      }
      if (a === 'edit-draft') {
        uni.navigateTo({ url: '/pages/merchant-apply-new/index?mode=edit&itemId=' + this.itemId }); return
      }
    }
  }
}
</script>

<style>
.page { background: var(--color-bg-page); min-height: 100vh; }

/* 基本信息卡片（审核中样式）*/
.info-card {
  background: #FAFAFA;
  border-radius: 20rpx;
  border: 2rpx solid #E6E6E6;
  padding: 28rpx;
  margin: 0 28rpx 20rpx;
}
.info-card .sec-title { margin-left: -28rpx; }
.info-row {
  display: flex;
  align-items: flex-start;
  padding: 12rpx 0;
  font-size: 26rpx;
}
.info-row:last-child { padding-bottom: 0; }
.i-label {
  flex-shrink: 0;
  color: var(--color-text-hint);
  line-height: 36rpx;
}
.i-value {
  color: var(--color-text-primary);
  flex: 1;
  line-height: 36rpx;
  padding-left: 4rpx;
}
.status-cur-green  { color: var(--color-primary); }
.status-cur-red    { color: var(--color-danger); }
.status-cur-orange { color: var(--color-warning); }
.status-cur-blue   { color: var(--color-info); }

.photo-grid { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 8rpx; }
.photo-thumb { width: 160rpx; height: 135rpx; border-radius: 12rpx; background: #EDEDED; flex-shrink: 0; }

/* 装修类目及项目模块 */
.cats-section {
  background: #FAFAFA;
  border: 2rpx solid #E6E6E6;
  border-radius: 20rpx;
  padding: 28rpx;
  margin: 0 28rpx 20rpx;
}
.cats-section .sec-title { margin-left: -28rpx; }
.cat-item { padding: 20rpx 0; border-bottom: 2rpx solid #F0F0F0; }
.cat-item:last-child { border-bottom: none; padding-bottom: 0; }
.cat-name { display: block; font-size: 28rpx; font-weight: 600; color: #333333; margin-bottom: 12rpx; }
.cat-sub { display: block; font-size: 26rpx; color: #666666; line-height: 1.5; }

/* 增项申请记录 */
.add-item-record {
  padding: 20rpx 0;
  border-bottom: 2rpx solid #F0F0F0;
}
.add-item-record:last-child { border-bottom: none; padding-bottom: 0; }
.air-row {
  display: flex;
  align-items: flex-start;
  padding: 8rpx 0;
  font-size: 26rpx;
}
.air-label {
  flex-shrink: 0;
  width: 120rpx;
  color: var(--color-text-hint);
  line-height: 36rpx;
}
.air-value {
  flex: 1;
  color: var(--color-text-primary);
  line-height: 36rpx;
  padding-left: 4rpx;
}
.air-detail-btn-row { display: flex; justify-content: flex-end; padding-top: 8rpx; }
.air-detail-btn { font-size: 24rpx; color: var(--color-primary); padding: 6rpx 20rpx; border: 2rpx solid var(--color-primary); border-radius: 8rpx; }

/* 状态提示横幅 */
.notice-banner {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  margin: 0 28rpx 20rpx;
}
.notice-red { background: rgba(250,43,45,0.05); }
.notice-icon-wrap {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4rpx;
  background: var(--color-danger);
}
.notice-icon-text { font-size: 22rpx; font-weight: 700; color: #FFFFFF; line-height: 1; }
.notice-body { flex: 1; }
.notice-title { display: block; font-size: 26rpx; font-weight: 600; margin-bottom: 8rpx; color: var(--color-danger); }
.notice-text { display: block; font-size: 24rpx; line-height: 1.6; color: var(--color-danger); }

/* 附件资料 */
.detail-section-attach {
  background: #FAFAFA;
  border: 1rpx solid #E6E6E6;
  border-radius: 10rpx;
  padding: 20rpx 24rpx 28rpx;
}
.attach-divider { height: 1rpx; background: #E6E6E6; margin: 20rpx 0; }
.attach-cat { margin-bottom: 20rpx; }
.attach-cat:last-child { margin-bottom: 0; }
.attach-cat-label { font-size: 26rpx; font-weight: 600; color: #333333; margin-bottom: 16rpx; }
.attach-file-row {
  display: flex; align-items: center; gap: 16rpx;
  padding: 0 20rpx 0 26rpx; height: 100rpx;
  background: #F2FAFE; border: 1rpx solid #D1E2EB; border-radius: 16rpx;
  box-sizing: border-box;
}
.attach-file-icon  { width: 48rpx; height: 48rpx; flex-shrink: 0; }
.attach-file-name  { flex: 1; font-size: 25rpx; color: #000; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.attach-actions    { display: flex; align-items: center; gap: 24rpx; flex-shrink: 0; }
.attach-action-icon{ width: 48rpx; height: 48rpx; flex-shrink: 0; }

/* 缴费表单 */
.form-field { margin-bottom: 32rpx; }
.form-field:last-child { margin-bottom: 0; }
.form-label { display: block; font-size: 28rpx; color: #333333; font-weight: 500; font-family: 'PingFang SC', sans-serif; margin-bottom: 16rpx; }
.req-star { color: var(--color-danger); margin-right: 4rpx; }
.date-picker {
  padding: 20rpx 24rpx; background: var(--color-bg-page);
  border-radius: 12rpx; font-size: 28rpx; color: var(--color-text-primary);
  border: 1rpx solid var(--color-border);
}
.picker-placeholder { color: var(--color-text-placeholder); }
.pay-methods { display: flex; flex-wrap: wrap; gap: 16rpx; }
.pay-method {
  padding: 16rpx 32rpx; border-radius: 8rpx; font-size: 28rpx;
  background: #F7F7F7; color: var(--color-text-secondary);
  border: 2rpx solid transparent;
}
.pay-method-active {
  background: var(--color-primary-light); color: var(--color-primary);
  border-color: var(--color-primary);
}
.upload-preview-img { width: 320rpx; height: 270rpx; border-radius: 16rpx; display: block; }

/* 时间线 */
.timeline { padding-left: 26rpx; }
.tl-item  { display: flex; padding-bottom: 44rpx; position: relative; }
.tl-item:last-child { padding-bottom: 0; }
.tl-axis  { position: absolute; left: -26rpx; top: 0; bottom: 0; width: 10rpx; display: flex; flex-direction: column; align-items: center; }
.tl-dot   { width: 10rpx; height: 10rpx; border-radius: 9999rpx; flex-shrink: 0; background: #B3B3B3; z-index: 1; margin-top: 12rpx; }
.dot-pass, .dot-reject, .dot-waiting { background: #B3B3B3; }
.tl-line  { flex: 1; width: 2rpx; background: #E0E0E0; margin-top: 16rpx; }
.tl-content { flex: 1; }
.tl-hd    { display: flex; justify-content: space-between; align-items: center; }
.tl-dept  { font-size: 24rpx; font-weight: 600; color: #000; flex: 1; }
.tl-status{ font-size: 24rpx; font-weight: 600; white-space: nowrap; margin-left: 16rpx; }
.tl-pass       { color: #1ABA6C; }
.tl-reject     { color: #FA2B2D; }
.tl-waiting    { color: #F19204; }
.tl-processing { color: #F19204; }
.tl-meta   { display: flex; gap: 24rpx; font-size: 24rpx; color: #666; font-weight: 400; margin-bottom: 8rpx; }
.tl-person, .tl-time { font-size: 24rpx; color: #666; }
.tl-opinion        { font-size: 24rpx; color: #666;    line-height: 1.5; display: block; }
.tl-opinion-reject { font-size: 24rpx; color: #FA2B2D; line-height: 1.5; display: block; }
.tl-survey-photo-link { font-size: 24rpx; color: var(--color-primary); text-decoration: underline; display: block; margin-top: 8rpx; }

/* 电子施工证链接 */
.cert-link { margin-top: 16rpx; font-size: 26rpx; color: var(--color-primary); }

/* 电子施工证弹窗 */
.cert-modal {
  background: linear-gradient(135deg, #fff 0%, #f0f8ff 50%, #e8f4fd 100%);
  border: 4rpx solid #b8d4e8; border-radius: 24rpx; padding: 32rpx; width: 80%;
}
.cert-hd { text-align: center; padding-bottom: 24rpx; margin-bottom: 24rpx; border-bottom: 4rpx dashed #b8d4e8; }
.cert-main-title { font-size: 36rpx; font-weight: 700; color: #1a5276; letter-spacing: 8rpx; }
.cert-sub-title  { font-size: 22rpx; color: #7f8c8d; margin-top: 8rpx; }
.cert-row  { display: flex; justify-content: space-between; padding: 16rpx 0; font-size: 26rpx; border-bottom: 2rpx solid #eef5fa; }
.cert-row:last-of-type { border-bottom: none; }
.cert-label{ color: #7f8c8d; }
.cert-val  { color: #1a1a1a; font-weight: 500; }
.cert-code { font-family: monospace; letter-spacing: 2rpx; }
.cert-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24rpx; padding-top: 24rpx; border-top: 4rpx dashed #b8d4e8; }
.cert-qr-placeholder { width: 140rpx; height: 140rpx; border: 4rpx solid #ccc; border-radius: 8rpx; display: flex; align-items: center; justify-content: center; font-size: 28rpx; color: #ccc; }
.cert-stamp { width: 120rpx; height: 120rpx; border: 6rpx solid rgba(220,53,69,0.35); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: rgba(220,53,69,0.45); font-size: 22rpx; font-weight: 700; text-align: center; transform: rotate(-15deg); line-height: 1.4; }
.cert-btns { margin-top: 24rpx; }
</style>
