<template>
  <view class="page" :style="{ paddingBottom: hasBtn ? '200rpx' : '40rpx' }">

    <!-- 商户/基本信息 -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">{{ merchantInfo.title }}</text></view>
      <view v-for="row in merchantInfo.rows" :key="row.label" class="detail-row">
        <text class="detail-label">{{ row.label }}</text>
        <text class="detail-value" :style="{ color: row.valueColor || '' }">{{ row.value }}</text>
      </view>
      <view v-if="merchantInfo.showCertLink" class="cert-link" @tap="showCertModal = true">
        📋 查看电子施工证
      </view>
    </view>

    <!-- 装修类目及项目 -->
    <view class="cats-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">装修类目及项目</text></view>
      <view v-for="cat in categories" :key="cat.name" class="cat-item">
        <view class="cat-hd">
          <view class="cat-left">
            <text class="cat-name">{{ cat.name }}</text>
            <text v-if="cat.isMyDept" class="my-dept-tag">本部门负责</text>
          </view>
          <text :class="['status-tag', cat.statusCls]">{{ cat.statusText }}</text>
        </view>
        <view class="cat-projects">
          <view v-for="(proj, pi) in cat.projects" :key="pi" class="cat-proj-item">
            <text class="cat-proj-name">{{ proj.name }}</text>
            <text :class="['status-tag', levelCls(proj.level)]">{{ proj.level }}级</text>
          </view>
        </view>
        <view class="cat-dept-row">
          <text class="cat-dept-label">责任部门：</text>
          <text class="cat-dept-val">{{ cat.dept }}</text>
        </view>
      </view>
      <view class="cat-remark">
        <text class="cat-remark-label">装修说明</text>
        <text class="cat-remark-text">门面升级改造，更换招牌并调整消防设施位置</text>
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
    <view v-if="attachments.length" class="detail-section detail-section-attach">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">附件资料</text></view>
      <template v-for="(item, idx) in attachments" :key="idx">
        <view v-if="item.type === 'divider'" class="attach-divider"></view>
        <view v-else class="attach-cat">
          <view class="attach-cat-label">{{ item.label }}</view>
          <view class="attach-file-row">
            <image
              class="attach-file-icon"
              :src="item.type === 'pdf' ? '/static/images/icon-file-pdf.png' : '/static/images/icon-file-img.png'"
              mode="aspectFit"
            />
            <text class="attach-file-name">{{ item.name }}</text>
            <view class="attach-actions">
              <image class="attach-action-icon" src="/static/images/icon-preview.png" mode="aspectFit" />
              <image class="attach-action-icon" src="/static/images/icon-download.png" mode="aspectFit" />
            </view>
          </view>
        </view>
      </template>
    </view>

    <!-- 装修申请记录 -->
    <view class="detail-section">
      <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">装修申请记录</text></view>
      <view class="timeline">
        <view v-for="(item, index) in timeline" :key="item.dept" class="tl-item">
          <view class="tl-axis">
            <view :class="['tl-dot', item.dotCls]"></view>
            <view v-if="index < timeline.length - 1" class="tl-line"></view>
          </view>
          <view class="tl-content">
            <view class="tl-hd">
              <text class="tl-dept">{{ item.dept }}</text>
              <text :class="['tl-status', item.statusCls]">{{ item.text }}</text>
            </view>
            <view v-if="item.person || item.time" class="tl-meta">
              <text v-if="item.person" class="tl-person">{{ item.person }}</text>
              <text v-if="item.time" class="tl-time">{{ item.time }}</text>
            </view>
            <text v-if="item.opinion && item.result !== 'reject'" class="tl-opinion">说明：{{ item.opinion }}</text>
            <text v-if="item.opinion && item.result === 'reject'" class="tl-opinion-reject">驳回原因：{{ item.opinion }}</text>
            <text v-if="item.dept && item.dept.includes('踏勘签到') && item.result !== 'not-surveyed'" class="tl-survey-photo-link" @tap="viewSurveyPhotos(item)">查看签到照片</text>
          </view>
        </view>
      </view>
    </view>
  </view>

  <!-- 底部操作按钮 -->
  <view v-if="hasBtn" class="bottom-bar">
    <button v-if="btnAction === 'back'"             class="btn btn-outline-green" @tap="goBack">返回列表</button>
    <button v-else-if="btnAction === 'survey'"       class="btn btn-primary" @tap="showSurveyModal = true">{{ btnText }}</button>
    <button v-else-if="btnAction === 'review'"       class="btn btn-primary" @tap="goReview">{{ btnText }}</button>
    <button v-else-if="btnAction === 'confirm-material'" class="btn btn-primary" @tap="showConfirmMaterialModal = true">{{ btnText }}</button>
    <button v-else-if="btnAction === 'approve'"          class="btn btn-primary" @tap="goApproval">{{ btnText }}</button>
    <button v-else-if="btnAction === 'confirm-payment'"  class="btn btn-primary" @tap="onConfirmPayment">{{ btnText }}</button>
  </view>

  <!-- 确认接收材料弹窗 -->
  <view v-if="showConfirmMaterialModal" class="modal-overlay" @tap="showConfirmMaterialModal = false">
    <view class="dialog-card" @tap.stop>
      <view class="dialog-body">
        <text class="dialog-title">确认接收材料</text>
        <text class="dialog-body-text">确认后申请将进入材料审核阶段，是否确认？</text>
      </view>
      <view class="dialog-footer">
        <button class="btn btn-outline-green" @tap="showConfirmMaterialModal = false">取消</button>
        <button class="btn btn-primary" @tap="onConfirmMaterial">确认</button>
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

  <!-- 签到踏勘弹窗 -->
  <view v-if="showSurveyModal" class="modal-overlay" @tap="showSurveyModal = false">
    <view class="modal-card" @tap.stop>
      <view class="modal-title">签到踏勘</view>
      <view class="modal-info">商铺号：B08{{ '\n' }}申请编号：RX001{{ '\n' }}装修类目：门头广告{{ '\n' }}商户名称：北京拿铁旧机动车</view>
      <view class="modal-field">
        <text class="modal-label">现场拍照（必填）</text>
        <view class="photo-row">
          <view class="photo-thumb"><text class="photo-icon">📷</text></view>
          <view class="photo-add"><text>+</text></view>
        </view>
      </view>
      <view class="modal-field">
        <text class="modal-label">当前位置</text>
        <view class="location-row"><text>📍</text><text> 北京市朝阳区花虎沟甲3号</text></view>
      </view>
      <view class="modal-field">
        <text class="modal-label">踏勘备注</text>
        <textarea class="modal-textarea" placeholder="请输入踏勘备注（选填）" v-model="surveyRemark" />
      </view>
      <view class="modal-btns">
        <button class="btn btn-outline" @tap="showSurveyModal = false">取消</button>
        <button class="btn btn-primary" @tap="confirmSurvey">确认签到</button>
      </view>
    </view>
  </view>
</template>

<script>
const { buildDetailData } = require('@/utils/renovation-mock.js')

export default {
  data() {
    return {
      status: '',
      itemId: '',
      merchantInfo: {},
      categories: [],
      attachments: [],
      timeline: [],
      btnAction: 'back',
      btnText: '返回列表',
      hasBtn: true,
      showConfirmMaterialModal: false,
      showCertModal: false,
      showSurveyModal: false,
      surveyRemark: '',
      addItemRecords: []
    }
  },

  onLoad(options) {
    this.itemId = options.itemId || ''
    const status = options.status || 'pending-survey'
    const d = buildDetailData(status, this.itemId)

    const titleMap = {
      'pending-survey': '待踏勘', 'my-initial-review': '待我审核',
      'secondary-review': '踏勘审核中', 'pending-submit-materials': '待递交材料',
      'material-review': '材料审核中', 'pending-merchant-payment': '待商户缴费',
      'pending-payment': '待支付确认', 'pending-sign': '待签署',
      'pending-certificate': '待下证', 'under-construction': '施工中',
      'pending-acceptance': '待验收', 'completed': '已完成', 'rejected': '已驳回'
    }
    uni.setNavigationBarTitle({ title: titleMap[status] || '详情' })

    this.status = status
    this.merchantInfo = d.merchantInfo
    this.categories = d.categories
    this.attachments = d.attachments
    this.timeline = d.timeline
    this.btnAction = d.btnAction
    this.btnText = d.btnText
    this.addItemRecords = d.addItemRecords || []
  },

  methods: {
    levelCls(level) {
      if (level === 1) return 'status-green'
      if (level === 3) return 'status-red'
      return 'status-orange'
    },

    goBack() { uni.navigateBack() },

    goAddItemDetail(record) {
      uni.navigateTo({ url: `/pages/add-item-detail/index?tab=${record.tab}&id=${encodeURIComponent(record.id)}` })
    },

    goApproval() {
      const rows = this.merchantInfo.rows || []
      const get = label => encodeURIComponent((rows.find(r => r.label === label) || {}).value || '')
      const waitingItem = this.timeline.find(t => t.dotCls === 'dot-waiting')
      uni.navigateTo({
        url: `/pages/renovation-approval/index?from=detail&applyNo=${encodeURIComponent(this.itemId)}&merchantName=${get('商户名称')}&shopNo=${get('商铺号')}&currentStep=${encodeURIComponent(waitingItem ? waitingItem.dept : '')}`
      })
    },

    goReview() {
      const rows = this.merchantInfo.rows || []
      const get = label => encodeURIComponent((rows.find(r => r.label === label) || {}).value || '')
      uni.navigateTo({
        url: `/pages/renovation-review/index?merchantName=${get('商户名称')}&shopNo=${get('商铺号')}&contact=${get('联系人')}`
      })
    },

    onConfirmMaterial() {
      this.showConfirmMaterialModal = false
      uni.showToast({ title: '已确认接收材料', icon: 'success' })
    },
    onConfirmPayment() {
      uni.showToast({ title: '已确认收款', icon: 'success' })
    },

    confirmSurvey() {
      uni.showToast({ title: '签到踏勘成功', icon: 'success' })
      this.showSurveyModal = false
    },

    viewSurveyPhotos(item) {
      uni.previewImage({
        urls: ['/static/images/uploadedImage.png'],
        current: 0
      })
    }
  }
}
</script>

<style>
.page {
  background: var(--color-bg-page);
  min-height: 100vh;
}
.cats-section {
  background: #FAFAFA;
  border: 2rpx solid #E6E6E6;
  border-radius: 20rpx;
  padding: 28rpx;
  margin: 0 28rpx 20rpx;
}
.cats-section .sec-title { margin-left: -28rpx; }
.cat-item { padding: 20rpx 0; border-bottom: 2rpx solid #F0F0F0; }
.cat-item:last-of-type { border-bottom: none; }
.cat-hd { display: flex; justify-content: space-between; align-items: flex-start; gap: 16rpx; margin-bottom: 12rpx; }
.cat-left { display: flex; align-items: center; gap: 16rpx; flex-wrap: wrap; flex: 1; }
.cat-name { font-size: 28rpx; font-weight: 600; color: #333333; }
.my-dept-tag {
  font-size: 20rpx; font-weight: 500;
  padding: 4rpx 10rpx; border-radius: 4rpx;
  background: #E8F9F0; color: #1ABA6C;
  outline: 2rpx solid rgba(26,186,108,0.3); outline-offset: -2rpx;
  white-space: nowrap;
}
.cat-projects { display: flex; flex-direction: row; align-items: center; flex-wrap: nowrap; gap: 16rpx; margin-bottom: 12rpx; overflow: hidden; }
.cat-proj-item { display: flex; align-items: center; gap: 4rpx; flex-shrink: 0; }
.cat-proj-name { font-size: 26rpx; color: #666666; line-height: 1.5; }
.cat-proj-item .status-tag { padding-top: 0; padding-bottom: 0; }
.status-tag { display: inline-flex; align-items: center; padding: 4rpx 16rpx; border-radius: 8rpx; font-size: 22rpx; white-space: nowrap; line-height: 1.4; }
.status-green  { background: #E8F9F0; color: #1ABA6C; }
.status-orange { background: rgba(241,146,4,0.1); color: #F19204; }
.status-red    { background: rgba(250,43,45,0.05); color: #FA2B2D; }
.cat-dept-row { display: flex; font-size: 24rpx; }
.cat-dept-label { color: #999999; flex-shrink: 0; }
.cat-dept-val { color: #333333; }
.cat-remark { margin-top: 24rpx; }
.cat-remark-label { display: block; font-size: 28rpx; font-weight: 600; color: #333333; margin-bottom: 12rpx; }
.cat-remark-text { display: block; font-size: 26rpx; color: #333333; line-height: 1.6; }

/* 增项申请记录 */
.add-item-record { padding: 20rpx 0; border-bottom: 2rpx solid #F0F0F0; }
.add-item-record:last-child { border-bottom: none; padding-bottom: 0; }
.air-row { display: flex; align-items: flex-start; padding: 8rpx 0; font-size: 26rpx; }
.air-label { flex-shrink: 0; width: 120rpx; color: var(--color-text-hint); line-height: 36rpx; }
.air-value { flex: 1; color: var(--color-text-primary); line-height: 36rpx; padding-left: 4rpx; }
.air-detail-btn-row { display: flex; justify-content: flex-end; padding-top: 8rpx; }
.air-detail-btn { font-size: 24rpx; color: var(--color-primary); padding: 6rpx 20rpx; border: 2rpx solid var(--color-primary); border-radius: 8rpx; }

.detail-section-attach {
  background: #FAFAFA;
  border: 1rpx solid #E6E6E6;
  border-radius: 10rpx;
  padding: 20rpx 24rpx 28rpx;
}
.attach-divider { height: 1rpx; background: #E6E6E6; margin: 40rpx 0; }
.attach-cat { margin-bottom: 20rpx; }
.attach-cat:last-child { margin-bottom: 0; }
.attach-cat-label { font-size: 26rpx; font-weight: 600; color: #333333; margin-bottom: 16rpx; }
.attach-file-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 0 20rpx 0 26rpx;
  height: 100rpx;
  background: #F2FAFE;
  border: 1rpx solid #D1E2EB;
  border-radius: 16rpx;
  box-sizing: border-box;
}
.attach-file-icon { width: 48rpx; height: 48rpx; flex-shrink: 0; }
.attach-file-name {
  flex: 1;
  font-size: 25rpx;
  color: #000000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.attach-actions { display: flex; align-items: center; gap: 24rpx; flex-shrink: 0; }
.attach-action-icon { width: 48rpx; height: 48rpx; flex-shrink: 0; }

.timeline { padding-left: 26rpx; }
.tl-item { display: flex; padding-bottom: 44rpx; position: relative; }
.tl-item:last-child { padding-bottom: 0; }
.tl-axis {
  position: absolute;
  left: -26rpx; top: 0; bottom: 0;
  width: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tl-dot {
  width: 10rpx; height: 10rpx;
  border-radius: 9999rpx;
  flex-shrink: 0;
  background: #B3B3B3;
  z-index: 1;
  margin-top: 12rpx;
}
.dot-pass, .dot-reject, .dot-waiting, .dot-not-surveyed { background: #B3B3B3; }
.tl-line { flex: 1; width: 2rpx; background: #E0E0E0; margin-top: 16rpx; }
.tl-content { flex: 1; }
.tl-hd { display: flex; justify-content: space-between; align-items: center; }
.tl-dept { font-size: 24rpx; font-weight: 600; color: #000000; flex: 1; }
.tl-status { font-size: 24rpx; font-weight: 600; white-space: nowrap; margin-left: 16rpx; }
.tl-pass         { color: #1ABA6C; }
.tl-reject       { color: #FA2B2D; }
.tl-waiting      { color: #F19204; }
.tl-not-surveyed { color: #999999; }
.tl-meta { display: flex; gap: 24rpx; font-size: 24rpx; color: #666666; font-weight: 400; margin-bottom: 8rpx; }
.tl-opinion { font-size: 24rpx; color: #666666; font-weight: 400; line-height: 1.5; display: block; }
.tl-opinion-reject { font-size: 24rpx; color: #FA2B2D; font-weight: 400; line-height: 1.5; display: block; }
.tl-survey-photo-link { font-size: 24rpx; color: var(--color-primary); text-decoration: underline; display: block; margin-top: 8rpx; }

.cert-link { margin-top: 16rpx; font-size: 26rpx; color: var(--color-primary); }

.cert-modal {
  background: linear-gradient(135deg, #fff 0%, #f0f8ff 50%, #e8f4fd 100%);
  border: 4rpx solid #b8d4e8;
  border-radius: 24rpx;
  padding: 32rpx;
  width: 80%;
  overflow: hidden;
}
.cert-hd { text-align: center; padding-bottom: 24rpx; margin-bottom: 24rpx; border-bottom: 4rpx dashed #b8d4e8; }
.cert-main-title { font-size: 36rpx; font-weight: 700; color: #1a5276; letter-spacing: 8rpx; }
.cert-sub-title { font-size: 22rpx; color: #7f8c8d; margin-top: 8rpx; }
.cert-row { display: flex; justify-content: space-between; padding: 16rpx 0; font-size: 26rpx; border-bottom: 2rpx solid #eef5fa; }
.cert-row:last-of-type { border-bottom: none; }
.cert-label { color: #7f8c8d; }
.cert-val   { color: #1a1a1a; font-weight: 500; }
.cert-code  { font-family: monospace; letter-spacing: 2rpx; }
.cert-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24rpx; padding-top: 24rpx; border-top: 4rpx dashed #b8d4e8; }
.cert-qr-placeholder { width: 140rpx; height: 140rpx; border: 4rpx solid #ccc; border-radius: 8rpx; display: flex; align-items: center; justify-content: center; font-size: 28rpx; color: #ccc; }
.cert-stamp { width: 120rpx; height: 120rpx; border: 6rpx solid rgba(220,53,69,0.35); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: rgba(220,53,69,0.45); font-size: 22rpx; font-weight: 700; text-align: center; transform: rotate(-15deg); line-height: 1.4; }
.cert-btns { margin-top: 24rpx; }

.modal-field { margin-bottom: 20rpx; }
.modal-label { display: block; font-size: 26rpx; color: var(--color-text-secondary); margin-bottom: 12rpx; }
.photo-row { display: flex; gap: 16rpx; }
.photo-thumb { width: 120rpx; height: 120rpx; border-radius: 16rpx; background: #f0f0f0; display: flex; align-items: center; justify-content: center; }
.photo-icon { font-size: 40rpx; }
.photo-add { width: 120rpx; height: 120rpx; border-radius: 16rpx; border: 4rpx dashed #d9d9d9; display: flex; align-items: center; justify-content: center; font-size: 48rpx; color: #d9d9d9; }
.location-row { display: flex; align-items: center; gap: 8rpx; padding: 16rpx 20rpx; background: #f8f9fa; border-radius: 12rpx; font-size: 26rpx; color: var(--color-text-secondary); }
.modal-textarea { width: 100%; padding: 16rpx 20rpx; border: 2rpx solid var(--color-border); border-radius: 12rpx; font-size: 26rpx; height: 120rpx; box-sizing: border-box; line-height: 1.6; }
</style>
