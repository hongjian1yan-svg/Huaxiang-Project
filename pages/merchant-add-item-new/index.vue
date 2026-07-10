<template>
  <view class="page">
    <scroll-view scroll-y class="form-scroll">

      <!-- 关联装修申请 -->
      <view class="form-card form-card-first">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">关联装修申请</text></view>

        <view class="form-field form-field-info" style="margin-bottom:0;">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">选择装修申请</text></view>
          <view class="date-row" @tap="showApplyPicker = true">
            <text :style="{ color: selectedApply ? '#000000' : '#999999', fontSize: '24rpx' }">
              {{ selectedApply ? selectedApply.merchant + ' - ' + selectedApply.shop : '请选择装修申请' }}
            </text>
            <image class="date-arrow" src="/static/images/jiantou.png" mode="scaleToFill" />
          </view>
        </view>
        <text class="field-hint" style="color:#F19204;">仅可选择施工中状态的装修申请</text>

        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="f-label">商户名称</text></view>
          <text class="f-val">{{ selectedApply ? selectedApply.merchant : '请先选择装修申请' }}</text>
        </view>

        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="f-label">商铺号</text></view>
          <text class="f-val">{{ selectedApply ? selectedApply.shop : '请先选择装修申请' }}</text>
        </view>

        <view class="form-field form-field-info form-field-last">
          <view class="f-label-row"><text class="f-label">计划装修周期</text></view>
          <text class="f-val">{{ selectedApply ? selectedApply.period : '请先选择装修申请' }}</text>
        </view>
      </view>

      <!-- 当前装修类目及项目 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">当前装修类目及项目</text></view>
        <text class="form-hint-block">绿色为原申请已选项目（不可取消）；灰色未选项目可点击增项</text>
        <view v-for="cat in displayCats" :key="cat.name" class="cat-group">
          <text class="cat-name">{{ cat.name }}</text>
          <view class="sub-tags">
            <view v-for="p in cat.projects" :key="p.name"
              :class="['sub-tag', p.current ? 'sub-tag-cur' : (isSubSelected(cat.name, p.name) ? 'sub-tag-on' : '')]"
              @tap="p.current ? null : toggleSub(cat.name, p.name)">{{ p.name }}</view>
          </view>
        </view>
      </view>

      <!-- 新增装修类目及项目 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">新增装修类目及项目</text></view>
        <text class="form-hint-block">以下为原申请未包含的装修类目，可选择类目及子项目进行增项</text>
        <view v-for="cat in newDisplayCats" :key="'add_'+cat.name" class="cat-group">
          <text class="cat-name">{{ cat.name }}</text>
          <view class="sub-tags">
            <view v-for="p in cat.projects" :key="p"
              :class="['sub-tag', isSubSelected('add_'+cat.name, p) ? 'sub-tag-on' : '']"
              @tap="toggleSub('add_'+cat.name, p)">{{ p }}</view>
          </view>
        </view>
      </view>

      <!-- 增项说明 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">增项说明</text></view>

        <view class="form-field">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">是否涉及延长工期</text></view>
          <view class="opt-group">
            <view :class="['opt-btn', { 'opt-btn-on': !needDelay }]" @tap="needDelay = false">否</view>
            <view :class="['opt-btn', { 'opt-btn-on': needDelay }]" @tap="needDelay = true">是</view>
          </view>
        </view>

        <view v-if="needDelay" class="form-field form-field-info">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">申请延至日期</text></view>
          <picker mode="date" :value="delayTo" @change="delayTo = $event.detail.value">
            <view class="date-row">
              <text :style="{ color: delayTo ? '#000000' : '#999999', fontSize: '24rpx' }">{{ delayTo || '选择延期日期' }}</text>
              <image class="date-arrow" src="/static/images/jiantou.png" mode="scaleToFill" />
            </view>
          </picker>
        </view>

        <view class="form-field form-field-last">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">增项原因</text></view>
          <view class="remark-wrap">
            <textarea class="remark-ta" v-model="reason" placeholder="请说明增项原因及施工内容" placeholder-class="ph" maxlength="200" @input="reasonLen = reason.length" />
            <text class="remark-count">{{ reasonLen }}/200</text>
          </view>
        </view>
      </view>

      <!-- 附件上传 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">附件上传</text></view>

        <view class="form-field">
          <view class="f-title-row">
            <text class="f-label"><text class="req">*</text>施工方案</text>
            <text class="view-tpl-text">查看模板</text>
          </view>
          <view v-if="attFiles.plan.length < 3" class="upload-single" @tap="openUploadSheet('plan')">
            <image class="upload-ph-img" src="/static/images/shangchuan.png" mode="scaleToFill" />
          </view>
          <view v-for="(f, i) in attFiles.plan" :key="i" class="file-row">
            <image class="file-icon" :src="isImage(f)?'/static/images/icon-file-img.png':'/static/images/icon-file-pdf.png'" mode="aspectFit" />
            <text class="file-name">{{ f }}</text>
            <image class="file-del-icon" src="/static/images/shanchu.png" mode="scaleToFill" @tap.stop="attFiles.plan.splice(i,1)" />
          </view>
          <text class="upload-rule">支持 PDF、DOC、DOCX 格式，单文件不超过 20MB，最多上传 3 个</text>
        </view>

        <view class="form-field">
          <view class="f-title-row">
            <text class="f-label">施工图纸</text>
          </view>
          <view v-if="attFiles.drawing.length < 5" class="upload-single" @tap="openUploadSheet('drawing')">
            <image class="upload-ph-img" src="/static/images/shangchuan.png" mode="scaleToFill" />
          </view>
          <view v-for="(f, i) in attFiles.drawing" :key="i" class="file-row">
            <image class="file-icon" :src="isImage(f)?'/static/images/icon-file-img.png':'/static/images/icon-file-pdf.png'" mode="aspectFit" />
            <text class="file-name">{{ f }}</text>
            <image class="file-del-icon" src="/static/images/shanchu.png" mode="scaleToFill" @tap.stop="attFiles.drawing.splice(i,1)" />
          </view>
          <text class="upload-rule">支持 PDF、DWG、DXF 格式，单文件不超过 50MB，最多上传 5 个</text>
        </view>

        <view class="form-field">
          <view class="f-title-row">
            <text class="f-label">施工方合同</text>
          </view>
          <view v-if="attFiles.contract.length < 1" class="upload-single" @tap="openUploadSheet('contract')">
            <image class="upload-ph-img" src="/static/images/shangchuan.png" mode="scaleToFill" />
          </view>
          <view v-for="(f, i) in attFiles.contract" :key="i" class="file-row">
            <image class="file-icon" :src="isImage(f)?'/static/images/icon-file-img.png':'/static/images/icon-file-pdf.png'" mode="aspectFit" />
            <text class="file-name">{{ f }}</text>
            <image class="file-del-icon" src="/static/images/shanchu.png" mode="scaleToFill" @tap.stop="attFiles.contract.splice(i,1)" />
          </view>
          <text class="upload-rule">支持 PDF 格式，单文件不超过 20MB</text>
        </view>

        <view class="form-field form-field-last">
          <view class="f-title-row">
            <text class="f-label">施工方资质</text>
          </view>
          <view v-if="attFiles.cert.length < 3" class="upload-single" @tap="openUploadSheet('cert')">
            <image class="upload-ph-img" src="/static/images/shangchuan.png" mode="scaleToFill" />
          </view>
          <view v-for="(f, i) in attFiles.cert" :key="i" class="file-row">
            <image class="file-icon" :src="isImage(f)?'/static/images/icon-file-img.png':'/static/images/icon-file-pdf.png'" mode="aspectFit" />
            <text class="file-name">{{ f }}</text>
            <image class="file-del-icon" src="/static/images/shanchu.png" mode="scaleToFill" @tap.stop="attFiles.cert.splice(i,1)" />
          </view>
          <text class="upload-rule">支持 PDF、JPG、PNG 格式，单文件不超过 10MB，最多上传 3 个</text>
        </view>
      </view>

      <!-- 备注 -->
      <view class="form-card" style="margin-bottom:0;">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">备注</text></view>
        <view class="remark-wrap">
          <textarea class="remark-ta" v-model="remark" placeholder="请输入备注信息（选填）" placeholder-class="ph" maxlength="200" @input="remarkLen = remark.length" />
          <text class="remark-count">{{ remarkLen }}/200</text>
        </view>
      </view>

      <view style="height:200rpx;"></view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <button class="btn btn-primary" @tap="onSubmit">提交增项申请</button>
    </view>

    <!-- 选择装修申请底部弹窗 -->
    <view v-if="showApplyPicker" class="upload-sheet-overlay" @tap="showApplyPicker = false">
      <view class="upload-sheet apply-picker-sheet" @tap.stop>
        <view class="upload-sheet-title">选择装修申请</view>
        <view class="sheet-title-line"></view>
        <scroll-view scroll-y style="max-height:50vh;">
          <view v-if="applyOptions.length === 0" class="picker-empty">暂无施工中装修申请</view>
          <view v-for="item in applyOptions" :key="item.key" class="apply-option" @tap="selectApply(item)">
            <text class="apply-option-title">{{ item.merchant }} - {{ item.shop }}</text>
            <text class="apply-option-sub">申请编号：{{ item.key }} · {{ item.period }}</text>
          </view>
        </scroll-view>
        <view class="apply-picker-cancel" @tap="showApplyPicker = false">取消</view>
      </view>
    </view>

    <!-- 上传方式底部弹窗 -->
    <view v-if="showUploadSheet" class="upload-sheet-overlay" @tap="showUploadSheet = false">
      <view class="upload-sheet" @tap.stop>
        <view class="upload-sheet-title">选择上传文件</view>
        <view class="sheet-title-line"></view>
        <view class="upload-sheet-item" @tap="onUploadOption('camera')">拍摄</view>
        <view class="upload-sheet-item" @tap="onUploadOption('album')">选择相册照片</view>
        <view class="upload-sheet-item" @tap="onUploadOption('chat-img')">从聊天记录选择图片</view>
        <view class="upload-sheet-item upload-sheet-item-last" @tap="onUploadOption('chat-file')">从聊天记录选择文件</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      selectedApply: null,
      applyOptions: [
        {
          key: 'RX001', merchant: '北京拿铁旧机动车', shop: 'B08', period: '2026-06-01 至 2026-06-30',
          allCats: [
            { name: '消防系统', projects: [
              { name: '消防栓移位', current: true },
              { name: '喷淋改造',   current: false },
              { name: '烟感报警',   current: false }
            ]},
            { name: '电气改造', projects: [
              { name: '电表增容',   current: false },
              { name: '线路改造',   current: true },
              { name: '水表读数确认', current: false }
            ]}
          ],
          addCats: [
            { name: '门头广告', projects: ['招牌更换', '灯箱安装', 'LED屏幕', '标识标牌'] },
            { name: '基建改造', projects: ['隔墙拆除', '地面找平', '吊顶施工', '隔断施工'] },
            { name: '给排水',   projects: ['上水改造', '下水改造', '防水施工'] }
          ]
        },
        {
          key: 'RX015', merchant: '嘉诚名车', shop: 'D07', period: '2026-05-15 至 2026-06-15',
          allCats: [
            { name: '门头广告', projects: [
              { name: '招牌安装', current: true },
              { name: '灯箱安装', current: true },
              { name: '招牌更换', current: false }
            ]},
            { name: '基建改造', projects: [
              { name: '隔墙砌筑', current: true },
              { name: '隔墙拆除', current: false },
              { name: '地面找平', current: false }
            ]}
          ],
          addCats: [
            { name: '消防系统', projects: ['消防栓移位', '喷淋改造', '烟感增设'] },
            { name: '电气改造', projects: ['线路改造', '配电箱更换', '插座增设'] },
            { name: '给排水',   projects: ['管道改造', '地漏增设', '洗手盆安装'] }
          ]
        }
      ],
      selectedSubs: {},
      needDelay: false,
      delayTo: '',
      reason: '',
      reasonLen: 0,
      remark: '',
      remarkLen: 0,
      attFiles: { plan: [], drawing: [], contract: [], cert: [] },
      showApplyPicker: false,
      showUploadSheet: false,
      uploadTarget: ''
    }
  },
  computed: {
    displayCats() {
      if (this.selectedApply) return this.selectedApply.allCats
      return [
        { name: '消防系统', projects: [{ name: '消防栓移位', current: false }, { name: '喷淋改造', current: false }, { name: '烟感报警', current: false }] },
        { name: '电气改造', projects: [{ name: '电表增容', current: false }, { name: '线路改造', current: false }, { name: '水表读数确认', current: false }] }
      ]
    },
    newDisplayCats() {
      if (this.selectedApply) return this.selectedApply.addCats
      return [
        { name: '门头广告', projects: ['招牌更换', '灯箱安装', 'LED屏幕', '标识标牌'] },
        { name: '基建改造', projects: ['隔墙拆除', '地面找平', '吊顶施工', '隔断施工'] },
        { name: '给排水',   projects: ['上水改造', '下水改造', '防水施工'] }
      ]
    }
  },
  methods: {
    selectApply(item) {
      this.selectedApply = item
      this.selectedSubs = {}
      this.showApplyPicker = false
    },
    isSubSelected(catName, sub) {
      return !!(this.selectedSubs[catName] && this.selectedSubs[catName].includes(sub))
    },
    toggleSub(catName, sub) {
      if (!this.selectedSubs[catName]) {
        this.$set(this.selectedSubs, catName, [])
      }
      const idx = this.selectedSubs[catName].indexOf(sub)
      if (idx >= 0) {
        this.selectedSubs[catName].splice(idx, 1)
      } else {
        this.selectedSubs[catName].push(sub)
      }
    },
    isImage(f) {
      return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(f)
    },
    openUploadSheet(key) {
      this.uploadTarget = key
      this.showUploadSheet = true
    },
    onUploadOption(type) {
      const key = this.uploadTarget
      const labelMap = { plan: '施工方案', drawing: '施工图纸', contract: '施工方合同', cert: '施工方资质' }
      const label = labelMap[key] || '文件'
      const count = (this.attFiles[key] || []).length
      const isImgType = ['camera', 'album', 'chat-img'].includes(type)
      const canBeImage = key === 'cert'
      const ext = (isImgType && canBeImage) ? '.jpg' : '.pdf'
      const filename = label + (count > 0 ? count + 1 : '') + ext
      if (this.attFiles[key] !== undefined) {
        this.attFiles[key].push(filename)
      }
      this.showUploadSheet = false
    },
    onSubmit() {
      if (!this.selectedApply) { uni.showToast({ title: '请选择装修申请', icon: 'none' }); return }
      const hasAnySub = Object.values(this.selectedSubs).some(arr => arr.length > 0)
      if (!hasAnySub) { uni.showToast({ title: '请选择增项装修类目', icon: 'none' }); return }
      if (!this.reason.trim()) { uni.showToast({ title: '请填写增项原因', icon: 'none' }); return }
      uni.showToast({ title: '提交成功', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 1500)
    }
  }
}
</script>

<style>
.page { display: flex; flex-direction: column; height: 100vh; background: #FFFFFF; }
.form-scroll { flex: 1; overflow: hidden; }

/* ——— 表单卡片 ——— */
.form-card { background: #fff; padding: 0 36rpx; margin-bottom: 40rpx; }
.form-card-first { margin-top: 32rpx; }
.form-card .sec-title { margin-left: -36rpx; }

/* ——— 字段容器 ——— */
.form-field { margin-bottom: 40rpx; }
.form-field.form-field-last { margin-bottom: 0; }
.form-field-info { border-bottom: 2rpx solid #F0F0F0; }

/* ——— 字段标题行 ——— */
.f-label-row { display: flex; align-items: flex-start; }
.req { color: #FA2B2D; margin-right: 4rpx; }
.f-label { display: block; font-size: 28rpx; font-weight: 500; color: #333333; margin-bottom: 24rpx; }

/* ——— 只读值 ——— */
.f-val { display: block; font-size: 24rpx; color: #666666; padding-bottom: 12rpx; line-height: 1.5; }

/* ——— 选择行（箭头） ——— */
.date-row { display: flex; align-items: center; justify-content: space-between; padding-bottom: 12rpx; }
.date-arrow { width: 32rpx; height: 32rpx; flex-shrink: 0; }

/* ——— 字段红色提示 ——— */
.field-hint { display: block; font-size: 20rpx; color: #FA2B2D; margin-top: 12rpx; margin-bottom: 40rpx; line-height: 1.5; }

/* ——— 提示文字 ——— */
.form-hint-block { display: block; font-size: 24rpx; color: #999999; margin-bottom: 20rpx; margin-top: -4rpx; }

/* ——— 装修类目（规范第八章） ——— */
.cat-group { padding: 20rpx 0; border-bottom: 1rpx solid #F0F0F0; }
.cat-group:last-child { border-bottom: none; padding-bottom: 0; }
.cat-name { display: block; font-size: 28rpx; font-weight: 600; color: #333333; margin-bottom: 16rpx; }
.sub-tags { display: flex; flex-wrap: wrap; gap: 16rpx; }
.sub-tag { padding: 12rpx 28rpx; border-radius: 10rpx; font-size: 28rpx; font-weight: 400; color: #333333; background: #F7F7F7; }
.sub-tag-on  { background: rgba(26,186,108,0.05); color: #1ABA6C; font-weight: 600; outline: 1rpx solid #1ABA6C; outline-offset: -1rpx; }
.sub-tag-cur { padding: 12rpx 28rpx; border-radius: 10rpx; font-size: 28rpx; font-weight: 600; color: #1ABA6C; background: rgba(26,186,108,0.08); outline: 1rpx solid rgba(26,186,108,0.3); outline-offset: -1rpx; }
.sub-tag-ro  { padding: 12rpx 28rpx; border-radius: 10rpx; font-size: 28rpx; color: #666666; background: #F7F7F7; }

/* ——— 是否按钮（规范第九章） ——— */
.opt-group { display: flex; gap: 20rpx; }
.opt-btn { padding: 16rpx 52rpx 17rpx; border-radius: 10rpx; font-size: 28rpx; font-weight: 400; background: #F7F7F7; color: #333333; }
.opt-btn-on { background: rgba(26,186,108,0.05); color: #1ABA6C; font-weight: 600; outline: 1rpx solid #1ABA6C; outline-offset: -1rpx; }

/* ——— 上传标题行 ——— */
.f-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24rpx; }
.f-title-row .f-label { margin-bottom: 0; }
.view-tpl-text { font-size: 28rpx; color: #1ABA6C; text-decoration: underline; }

/* ——— 上传占位 ——— */
.upload-single { width: 320rpx; height: 270rpx; border-radius: 16rpx; overflow: hidden; display: block; }
.upload-ph-img { width: 100%; height: 100%; display: block; }
.upload-rule { display: block; font-size: 22rpx; color: #999999; margin-top: 12rpx; }

/* ——— 已上传文件行 ——— */
.file-row { display: flex; align-items: center; gap: 16rpx; padding: 0 20rpx 0 26rpx; height: 100rpx; background: #F2FAFE; border: 1rpx solid #D1E2EB; border-radius: 16rpx; box-sizing: border-box; margin-top: 20rpx; }
.file-icon { width: 48rpx; height: 48rpx; flex-shrink: 0; }
.file-name { flex: 1; font-size: 25rpx; color: #000000; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-del-icon { width: 48rpx; height: 48rpx; flex-shrink: 0; }

/* ——— 备注 ——— */
.remark-wrap { position: relative; background: #fff; border: 2rpx solid #D2D6E2; border-radius: 12rpx; padding: 20rpx; box-sizing: border-box; }
.remark-ta { width: 100%; height: 200rpx; font-size: 26rpx; color: #333333; line-height: 1.6; background: transparent; border: none; outline: none; resize: none; box-sizing: border-box; }
.remark-count { position: absolute; bottom: 16rpx; right: 20rpx; font-size: 22rpx; color: #CCCCCC; }
.ph { color: #999999; }

/* ——— 装修申请选择弹窗 ——— */
.apply-picker-sheet { padding-bottom: 0 !important; }
.apply-option { padding: 24rpx 36rpx; border-bottom: 1rpx solid #F0F0F0; }
.apply-option:last-child { border-bottom: none; }
.apply-option-title { display: block; font-size: 28rpx; font-weight: 600; color: #333333; margin-bottom: 8rpx; }
.apply-option-sub { display: block; font-size: 24rpx; color: #999999; }
.apply-picker-cancel { font-size: 28rpx; color: #666666; text-align: center; padding: 40rpx 0 100rpx; border-top: 1rpx solid #EBEBEB; margin-top: 8rpx; }
.picker-empty { padding: 60rpx 0; text-align: center; font-size: 26rpx; color: #999999; }

/* ——— 上传方式底部弹窗 ——— */
.upload-sheet-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
.upload-sheet { width: 100%; background: #FFFFFF; border-radius: 24rpx 24rpx 0 0; padding-bottom: env(safe-area-inset-bottom); }
.upload-sheet-title { font-size: 32rpx; font-weight: 600; color: rgba(0,0,0,0.9); text-align: center; padding: 40rpx 32rpx; }
.sheet-title-line { height: 1rpx; background: #EBEBEB; margin: 0 36rpx; }
.upload-sheet-item { font-size: 28rpx; font-weight: 400; color: #333333; text-align: center; padding: 40rpx 0; border-bottom: 1rpx solid #EBEBEB; }
.upload-sheet-item-last { border-bottom: none; padding-bottom: 100rpx; }

/* ——— 公共：底部栏、sec-title ——— */
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 20rpx 28rpx; padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); display: flex; gap: 20rpx; border-top: 2rpx solid #F0F0F0; }
.btn { flex: 1; height: 96rpx; border-radius: 16rpx; font-size: 32rpx; font-weight: 600; display: flex; align-items: center; justify-content: center; border: none; }
.btn-primary { background: #1ABA6C; color: #fff; }
.sec-title { display: flex; align-items: center; gap: 12rpx; padding: 40rpx 0 24rpx; }
.sec-bar { width: 8rpx; height: 36rpx; background: #1ABA6C; border-radius: 0 8rpx 8rpx 0; }
.sec-label { font-size: 28rpx; font-weight: 600; color: #333333; }
</style>
