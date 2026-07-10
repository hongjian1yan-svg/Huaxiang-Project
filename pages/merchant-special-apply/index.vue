<template>
  <view class="page-wrap">
    <scroll-view scroll-y class="form-scroll">

      <!-- 特殊作业选择 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">特殊作业选择</text></view>
        <view class="type-btn-group">
          <view
            v-for="t in typeOptions" :key="t.key"
            :class="['type-btn', { 'type-btn-on': workType === t.key }]"
            @tap="selectType(t.key)"
          >
            <text class="type-btn-label">{{ t.label }}</text>
          </view>
        </view>
        <text class="type-desc">{{ currentType.desc }}</text>
      </view>

      <!-- 关联装修申请 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">关联装修申请</text></view>

        <view class="form-field form-field-info has-hint">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">选择装修申请</text></view>
          <view class="date-row" @tap="showApplyPicker">
            <text :style="{ color: selectedApplyId ? '#000000' : '#999999', fontSize: '24rpx' }">{{ selectedApplyId || '请选择装修申请' }}</text>
            <image class="date-arrow" src="/static/images/jiantou.png" mode="scaleToFill" />
          </view>
        </view>
        <text class="field-hint">仅可选择施工中状态的装修申请</text>

        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="f-label">商户名称</text></view>
          <text class="f-val">{{ merchantName || '请先选择装修申请' }}</text>
        </view>
        <view class="form-field form-field-info form-field-last">
          <view class="f-label-row"><text class="f-label">商铺号</text></view>
          <text class="f-val">{{ shopNo || '请先选择装修申请' }}</text>
        </view>
      </view>

      <!-- 作业信息 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">作业信息</text></view>

        <view class="form-field form-field-info" :class="{ 'has-hint': workType === 'electric' }">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">{{ workDateLabel }}</text></view>
          <text v-if="workType === 'electric'" class="f-val">{{ workDateValue || '与关联装修申请一致' }}</text>
          <picker v-else mode="date" :value="workDate" @change="onWorkDateChange">
            <view class="date-row">
              <text :style="{ color: workDate ? '#000000' : '#999999', fontSize: '24rpx' }">{{ workDate || '请选择作业日期' }}</text>
              <image class="date-arrow" src="/static/images/jiantou.png" mode="scaleToFill" />
            </view>
          </picker>
        </view>
        <text v-if="workType === 'electric'" class="field-hint">用电周期与关联装修申请的计划装修周期一致，不可修改</text>

        <view v-if="workType === 'electric'" class="form-field form-field-info">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">临时用电点位数</text></view>
          <input class="f-input" type="number" v-model="electricPointCount" placeholder="请输入临时用电点位数量" placeholder-class="ph" />
        </view>

        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">作业地点</text></view>
          <input class="f-input" v-model="workLocation" placeholder="请填写具体作业位置" placeholder-class="ph" />
        </view>

        <view class="form-field">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">作业内容</text></view>
          <view class="remark-wrap">
            <textarea
              class="remark-ta"
              v-model="workContent"
              placeholder="请描述具体作业内容"
              placeholder-class="ph"
              maxlength="200"
              @input="workContentLen = workContent.length"
            />
            <text class="remark-count">{{ workContentLen }}/200</text>
          </view>
        </view>

        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">作业负责人</text></view>
          <input class="f-input" v-model="supervisor" placeholder="请输入负责人姓名" placeholder-class="ph" />
        </view>

        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">联系电话</text></view>
          <input class="f-input" type="number" v-model="supervisorPhone" placeholder="请输入联系电话" placeholder-class="ph" />
        </view>

        <view class="form-field form-field-info form-field-last">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">作业人数</text></view>
          <input class="f-input" type="number" v-model="workerCount" placeholder="请输入作业人数" placeholder-class="ph" />
        </view>
      </view>

      <!-- 附件上传 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">附件上传</text></view>
        <text class="upload-hint">以下附件要求与PC后台「模板预置配置」一致；已预置模板的附件可先下载模板，填写后再上传。</text>

        <view
          v-for="(att, idx) in uploadFields" :key="att.key"
          class="form-field" :class="{ 'form-field-last': idx === uploadFields.length - 1 }"
        >
          <view class="f-title-row">
            <text class="f-label"><text v-if="att.required" class="req">*</text>{{ att.label }}</text>
            <text v-if="att.template" class="view-tpl-text" @tap="viewTemplate(att.key)">查看模板</text>
          </view>
          <view v-if="!uploadedFiles[att.key]" class="upload-single" @tap="chooseFile(att.key)">
            <image class="upload-ph-img" src="/static/images/shangchuan.png" mode="scaleToFill" />
          </view>
          <view v-else class="file-row">
            <image class="file-icon" :src="isImage(uploadedFiles[att.key]) ? '/static/images/icon-file-img.png' : '/static/images/icon-file-pdf.png'" mode="aspectFit" />
            <text class="file-name">{{ uploadedFiles[att.key] }}</text>
            <image class="file-del-icon" src="/static/images/shanchu.png" mode="scaleToFill" @tap.stop="removeFile(att.key)" />
          </view>
          <text class="upload-rule">{{ att.hint }}</text>
        </view>
      </view>

      <!-- 备注 -->
      <view class="form-card form-card-last">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">备注</text></view>
        <view class="form-field form-field-last">
          <view class="remark-wrap">
            <textarea
              class="remark-ta"
              v-model="remark"
              placeholder="请输入备注信息（选填）"
              placeholder-class="ph"
              maxlength="200"
              @input="remarkLen = remark.length"
            />
            <text class="remark-count">{{ remarkLen }}/200</text>
          </view>
        </view>
      </view>

      <view style="height:200rpx;"></view>
    </scroll-view>

    <!-- 底部提交按钮 -->
    <view class="bottom-bar">
      <button class="btn btn-primary" @tap="submit">提交申请</button>
    </view>

    <!-- 选择装修申请底部弹窗 -->
    <view v-if="showPicker" class="picker-overlay" @tap.self="showPicker=false">
      <view class="picker-sheet">
        <view class="picker-header">
          <text class="picker-title">选择装修申请</text>
          <text class="picker-close" @tap="showPicker=false">×</text>
        </view>
        <scroll-view scroll-y class="picker-list">
          <view v-for="a in underConstructionList" :key="a.id" class="picker-item" @tap="selectApply(a)">
            <text class="picker-item-id">{{ a.id }}</text>
            <text class="picker-item-desc">{{ a.merchant }} · {{ a.shop }}</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
const { MERCHANT_SPECIAL_DATA } = require('@/utils/renovation-mock.js')

const UNDER_CONSTRUCTION = [
  { id:'RX001', merchant:'北京拿铁旧机动车', shop:'B08', period:'2026-04-01 至 2026-06-30' },
  { id:'RX002', merchant:'北京车天下二手车', shop:'A12', period:'2026-03-15 至 2026-05-31' },
  { id:'RX015', merchant:'嘉诚名车',         shop:'D07', period:'2026-05-01 至 2026-07-10' },
  { id:'RX035', merchant:'红星车行',         shop:'A08', period:'2026-05-10 至 2026-07-20' },
]

const TYPE_OPTIONS = [
  { key:'height',   label:'高空作业', icon:'📡', desc:'2米及以上高处作业须提前报批，作业人员须持证上岗并落实防坠落措施。' },
  { key:'fire',     label:'动火作业', icon:'🔥', desc:'明火、焊接、切割等涉及火源的作业须提前报批，现场须配备灭火器及专人监护。' },
  { key:'electric', label:'临时用电', icon:'⚡', desc:'装修期间临时使用电力需提前报批，用电周期与装修申请一致，由专业电工操作。' },
]

const UPLOAD_FIELDS = {
  height:   [
    { key:'cert',      label:'高空作业证',   required:true,  template:false, hint:'支持 JPG、PNG、PDF 格式，单文件不超过 10MB，最多上传 3 个' },
    { key:'plan',      label:'安全防护方案', required:true,  template:true,  hint:'支持 PDF、DOC、DOCX 格式，单文件不超过 20MB，最多上传 3 个' },
    { key:'insurance', label:'保险证明',     required:false, template:false, hint:'支持 JPG、PNG、PDF 格式，单文件不超过 10MB，最多上传 3 个' },
    { key:'scene',     label:'现场照片',     required:false, template:false, hint:'支持 JPG、PNG 格式，单文件不超过 10MB，最多上传 5 个' },
  ],
  fire:     [
    { key:'cert',         label:'特种作业人员操作证',    required:true,  template:false, hint:'支持 JPG、PNG、PDF 格式，单文件不超过 10MB，最多上传 3 个' },
    { key:'plan',         label:'动火方案',              required:true,  template:true,  hint:'支持 PDF 格式，单文件不超过 20MB，最多上传 3 个' },
    { key:'extinguisher', label:'灭火器配置清单（选填）', required:false, template:false, hint:'支持 JPG、PNG、PDF 格式，单文件不超过 10MB，最多上传 3 个' },
    { key:'scene',        label:'现场照片',              required:false, template:false, hint:'支持 JPG、PNG 格式，单文件不超过 10MB，最多上传 5 个' },
  ],
  electric: [
    { key:'cert',  label:'电工操作证',   required:true,  template:false, hint:'支持 JPG、PNG、PDF 格式，单文件不超过 10MB，最多上传 3 个' },
    { key:'plan',  label:'临时用电方案', required:true,  template:true,  hint:'支持 PDF、DOC、DOCX 格式，单文件不超过 20MB，最多上传 3 个' },
    { key:'scene', label:'现场照片',     required:false, template:false, hint:'支持 JPG、PNG 格式，单文件不超过 10MB，最多上传 5 个' },
  ],
}

export default {
  data() {
    return {
      workType: 'height',
      typeOptions: TYPE_OPTIONS,
      selectedApplyId: '',
      merchantName: '',
      shopNo: '',
      workDate: '',
      workDateValue: '',
      electricPointCount: '',
      workLocation: '',
      workContent: '',
      workContentLen: 0,
      supervisor: '',
      supervisorPhone: '',
      workerCount: '',
      remark: '',
      remarkLen: 0,
      uploadedFiles: {},
      showPicker: false,
      underConstructionList: UNDER_CONSTRUCTION,
    }
  },
  computed: {
    currentType() { return TYPE_OPTIONS.find(t => t.key === this.workType) || TYPE_OPTIONS[0] },
    workDateLabel() {
      if (this.workType === 'electric') return '用电周期'
      if (this.workType === 'height')   return '高空作业日期'
      return '动火作业日期'
    },
    uploadFields() { return UPLOAD_FIELDS[this.workType] || [] },
  },
  onLoad(options) {
    if (options.resubmit) {
      uni.setNavigationBarTitle({ title: '重新提交特殊作业申请' })
      if (options.id) {
        const id = decodeURIComponent(options.id)
        let item = null
        for (const key of Object.keys(MERCHANT_SPECIAL_DATA)) {
          item = (MERCHANT_SPECIAL_DATA[key] || []).find(d => d.id === id)
          if (item) break
        }
        if (item) { this._prefill(item); return }
      }
    }
    if (options.type) this.workType = decodeURIComponent(options.type)
    if (options.applyId) {
      const a = UNDER_CONSTRUCTION.find(a => a.id === decodeURIComponent(options.applyId))
      if (a) this.selectApply(a)
    }
  },
  methods: {
    _prefill(item) {
      this.workType = item.type
      const a = UNDER_CONSTRUCTION.find(a => a.id === item.applyId)
      if (a) this.selectApply(a)
      if (item.type !== 'electric') {
        this.workDate = item.workTime ? item.workTime.split(' ')[0] : ''
      }
      if (item.type === 'electric') {
        this.electricPointCount = item.electricPointCount ? String(item.electricPointCount) : ''
      }
      this.workLocation = item.workLocation || ''
      this.workContent = item.workContent || ''
      this.workContentLen = this.workContent.length
      this.supervisor = item.supervisor || ''
      this.supervisorPhone = item.supervisorPhone || ''
      this.workerCount = item.workerCount ? String(item.workerCount) : ''
      this.remark = item.remark || ''
      this.remarkLen = this.remark.length
    },
    selectType(key) {
      this.workType = key
      this.uploadedFiles = {}
    },
    showApplyPicker() { this.showPicker = true },
    selectApply(a) {
      this.selectedApplyId = a.id
      this.merchantName = a.merchant
      this.shopNo = a.shop
      if (this.workType === 'electric') this.workDateValue = a.period
      this.showPicker = false
    },
    onWorkDateChange(e) {
      this.workDate = e.detail.value
    },
    chooseFile(key) {
      this.uploadedFiles = { ...this.uploadedFiles, [key]: `附件_${key}.pdf` }
    },
    removeFile(key) {
      const f = { ...this.uploadedFiles }
      delete f[key]
      this.uploadedFiles = f
    },
    viewTemplate(key) {
      uni.showToast({ title: '模板下载（演示）', icon:'none' })
    },
    isImage(filename) {
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)
    },
    submit() {
      if (!this.selectedApplyId) {
        uni.showToast({ title: '请选择装修申请', icon:'none' }); return
      }
      if (!this.workDate && this.workType !== 'electric') {
        uni.showToast({ title: '请选择作业日期', icon:'none' }); return
      }
      if (!this.workLocation.trim()) {
        uni.showToast({ title: '请填写作业地点', icon:'none' }); return
      }
      if (!this.workContent.trim()) {
        uni.showToast({ title: '请填写作业内容', icon:'none' }); return
      }
      if (!this.supervisor.trim()) {
        uni.showToast({ title: '请填写作业负责人', icon:'none' }); return
      }
      if (!this.supervisorPhone.trim()) {
        uni.showToast({ title: '请填写联系电话', icon:'none' }); return
      }
      if (!this.workerCount) {
        uni.showToast({ title: '请填写作业人数', icon:'none' }); return
      }
      uni.showToast({
        title: '申请已提交',
        icon: 'success',
        success: () => setTimeout(() => uni.navigateBack({ delta: 1 }), 1500)
      })
    },
  }
}
</script>

<style>
.page-wrap { display:flex; flex-direction:column; height:100vh; background:#FFFFFF; overflow:hidden; }
.form-scroll { flex:1; overflow:hidden; }

/* 表单卡片 */
.form-card { background:#FFFFFF; padding:0 36rpx; margin-bottom:40rpx; }
.form-card:first-child { margin-top:32rpx; }
.form-card-last { margin-bottom:0; }

/* 表单字段 */
.form-field { margin-bottom:40rpx; }
.form-field-last { margin-bottom:0; }
.form-field-info { border-bottom:2rpx solid #F0F0F0; }
.form-field-info.has-hint { margin-bottom:0; }
.f-label-row { display:flex; align-items:flex-start; margin-bottom:24rpx; }
.f-label { font-size:28rpx; font-weight:500; color:#333333; }
.req { color:#FA2B2D; margin-right:4rpx; font-size:28rpx; }

/* 只读值 / 可编辑输入框（下划线风格） */
.f-val { display:block; font-size:24rpx; color:#666666; padding:0 0 12rpx; line-height:1.5; }
.f-input { width:100%; background:transparent; border:none; border-radius:0; padding:0 0 12rpx; font-size:24rpx; color:#000000; box-sizing:border-box; }
.ph { color:#999999; }

/* 下划线下方红色提示文字 */
.field-hint { display:block; font-size:20rpx; color:#FA2B2D; margin-top:12rpx; margin-bottom:40rpx; line-height:1.5; }

/* 选择器（picker）行 */
.date-row { display:flex; align-items:center; justify-content:space-between; padding:0 0 12rpx; }
.date-arrow { width:32rpx; height:32rpx; flex-shrink:0; }

/* 特殊作业类型按钮组 */
.type-btn-group { display:flex; gap:20rpx; }
.type-btn { flex:1; display:flex; align-items:center; justify-content:center; height:72rpx; border-radius:10rpx; background:#F7F7F7; }
.type-btn-label { font-size:28rpx; font-weight:400; color:#333333; }
.type-btn-on { background:rgba(26,186,108,0.05); outline:1rpx solid #1ABA6C; outline-offset:-1rpx; }
.type-btn-on .type-btn-label { color:#1ABA6C; font-weight:600; }
.type-desc { display:block; font-size:24rpx; color:#666666; line-height:1.6; margin-top:20rpx; }

/* 附件上传 */
.upload-hint { display:block; font-size:22rpx; color:#999999; margin-bottom:24rpx; line-height:1.5; }
.upload-rule { display:block; font-size:22rpx; color:#999999; line-height:1.5; margin-top:12rpx; }
.f-title-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:20rpx; }
.f-title-row .f-label { margin-bottom:0; }
.view-tpl-text { font-size:28rpx; color:#1ABA6C; text-decoration:underline; }
.upload-single { width:320rpx; height:270rpx; border-radius:16rpx; overflow:hidden; display:block; }
.upload-ph-img { width:100%; height:100%; display:block; }
.file-row { display:flex; align-items:center; gap:16rpx; padding:0 20rpx 0 26rpx; height:100rpx; background:#F2FAFE; border:1rpx solid #D1E2EB; border-radius:16rpx; box-sizing:border-box; }
.file-icon     { width:48rpx; height:48rpx; flex-shrink:0; }
.file-name     { flex:1; font-size:25rpx; color:#000000; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.file-del-icon { width:48rpx; height:48rpx; flex-shrink:0; }

/* 文本域（作业内容 / 备注） */
.remark-wrap { position:relative; background:#fff; border:2rpx solid #D2D6E2; border-radius:12rpx; padding:20rpx; box-sizing:border-box; }
.remark-ta { width:100%; height:182rpx; font-size:26rpx; color:#333333; line-height:1.5; background:transparent; }
.remark-count { position:absolute; bottom:16rpx; right:20rpx; font-size:22rpx; color:#CCCCCC; }

/* 底部按钮 */
.bottom-bar { position:fixed; left:0; right:0; bottom:0; padding:20rpx 28rpx calc(20rpx + env(safe-area-inset-bottom)); background:#FFFFFF; border-top:2rpx solid #EDEDED; }
.btn { display:flex; align-items:center; justify-content:center; height:88rpx; border-radius:44rpx; font-size:30rpx; font-weight:600; border:none; width:100%; }
.btn-primary { background:#1ABA6C; color:#fff; }

/* 选择弹窗 */
.picker-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:100; display:flex; align-items:flex-end; }
.picker-sheet   { width:100%; background:#fff; border-radius:32rpx 32rpx 0 0; padding:0 0 calc(env(safe-area-inset-bottom)); max-height:70vh; display:flex; flex-direction:column; }
.picker-header  { display:flex; align-items:center; justify-content:space-between; padding:32rpx 28rpx 24rpx; border-bottom:2rpx solid #EDEDED; flex-shrink:0; }
.picker-title   { font-size:30rpx; font-weight:600; color:#333; }
.picker-close   { font-size:40rpx; color:#999; }
.picker-list    { flex:1; }
.picker-item    { padding:24rpx 28rpx; border-bottom:2rpx solid #F5F5F5; }
.picker-item:active { background:#F5F5F5; }
.picker-item-id   { display:block; font-size:26rpx; font-weight:600; color:#333; margin-bottom:6rpx; }
.picker-item-desc { display:block; font-size:24rpx; color:#666; }
</style>
