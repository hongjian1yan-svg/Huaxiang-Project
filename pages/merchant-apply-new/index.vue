<template>
  <view class="page-wrap">

    <!-- ① 申请须知底部弹出 -->
    <view v-if="showNotice" class="notice-overlay" @tap="onNoticeCancel">
      <view class="notice-sheet" @tap.stop>
        <view class="notice-hd">
          <text class="notice-title">装修申请须知</text>
          <text class="notice-close" @tap="onNoticeCancel">×</text>
        </view>
        <scroll-view scroll-y class="notice-scroll">
          <text class="notice-text">一、申请说明
商户在装修前应通过本系统提交装修申请，经市场管理部门踏勘审核、材料审批后方可施工。

二、材料要求
请按系统提示上传真实、完整、清晰的附件材料，材料须符合格式与大小要求。

三、施工规范
施工期间须遵守市场安全管理规定，不得擅自改变承重结构，动火、高空等特种作业须另行报批。

四、责任声明
商户对提交材料的真实性负责，因虚假材料或违规施工产生的后果由商户自行承担。

五、其他
未尽事宜以市场管理部最新管理规定为准。</text>
        </scroll-view>
        <view class="agree-row" @tap="agreed = !agreed">
          <view :class="['agree-chk', { 'agree-chk-on': agreed }]"></view>
          <text class="agree-lbl">我已阅读并同意以上《装修申请须知》</text>
        </view>
        <view class="notice-btns">
          <button class="btn btn-outline-green" @tap="onNoticeCancel">取消</button>
          <button :class="['btn', agreed ? 'btn-primary' : 'btn-primary btn-dim']" @tap="onNoticeConfirm">确认同意</button>
        </view>
      </view>
    </view>

    <!-- ② 表单主体 -->
    <scroll-view scroll-y class="form-scroll">

      <!-- 基本信息 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">基本信息</text></view>

        <view class="form-field">
          <text class="f-label"><text class="req">*</text>营业执照</text>
          <view v-if="licenseFiles.length < 1" class="upload-single" @tap="openUploadSheet('license')">
            <image class="upload-ph-img" src="/static/images/uploadedImage.png" mode="scaleToFill" />
          </view>
          <view v-for="(f, i) in licenseFiles" :key="i" class="file-row">
            <image class="file-icon" :src="isImage(f)?'/static/images/icon-file-img.png':'/static/images/icon-file-pdf.png'" mode="aspectFit" />
            <text class="file-name">{{ f }}</text>
            <image class="file-del-icon" src="/static/images/shanchu.png" mode="scaleToFill" @tap.stop="licenseFiles.splice(i,1)" />
          </view>
          <text class="upload-rule">支持 JPG、PNG、PDF 格式，单文件不超过 10MB</text>
        </view>

        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">商户名称</text></view>
          <text class="f-val">北京拿铁旧机动车经纪有限公司</text>
        </view>

        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">统一社会信用代码</text></view>
          <text class="f-val">91110105MA01XXXXX</text>
        </view>

        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">商铺号</text></view>
          <text class="f-val">B08</text>
        </view>

        <view class="form-field form-field-info">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">联系人</text></view>
          <input class="f-input" v-model="contact" placeholder="请输入联系人" placeholder-class="ph" />
        </view>

        <view class="form-field form-field-last form-field-info">
          <view class="f-label-row"><text class="req">*</text><text class="f-label">联系电话</text></view>
          <input class="f-input" v-model="phone" type="number" placeholder="请输入联系电话" placeholder-class="ph" />
        </view>
      </view>

      <!-- 装修类目选择 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">装修类目选择</text></view>
        <view v-for="cat in categories" :key="cat.name" class="cat-group">
          <text class="cat-name">{{ cat.name }}</text>
          <view class="sub-tags">
            <text
              v-for="sub in cat.items"
              :key="sub"
              :class="['sub-tag', { 'sub-tag-on': isSelected(cat.name, sub) }]"
              @tap="toggleSub(cat.name, sub)"
            >{{ sub }}</text>
          </view>
        </view>
      </view>

      <!-- 附件上传 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">附件上传</text></view>

        <!-- 门头广告附件（选中门头广告任一子项时显示） -->
        <template v-if="hasMentou">
          <view class="form-field">
            <view class="f-title-row">
              <text class="f-label"><text class="req">*</text>门头效果图</text>
              <text class="view-tpl-text">查看模板</text>
            </view>
            <view v-if="mentouFiles.length < 5" class="upload-single" @tap="mentouFiles.push('效果图'+(mentouFiles.length+1)+'.jpg')">
              <image class="upload-ph-img" src="/static/images/shangchuan.png" mode="scaleToFill" />
            </view>
            <view v-for="(f, i) in mentouFiles" :key="i" class="file-row">
              <image class="file-icon" :src="isImage(f)?'/static/images/icon-file-img.png':'/static/images/icon-file-pdf.png'" mode="aspectFit" />
              <text class="file-name">{{ f }}</text>
              <image class="file-del-icon" src="/static/images/shanchu.png" mode="scaleToFill" @tap.stop="mentouFiles.splice(i,1)" />
            </view>
            <text class="upload-rule">支持 JPG、PNG、PDF 格式，单文件不超过 20MB，最多上传 5 个</text>
          </view>
          <view class="form-field">
            <view class="f-title-row">
              <text class="f-label"><text class="req">*</text>字体侵权承诺书</text>
              <text class="view-tpl-text">查看模板</text>
            </view>
            <view v-if="fontFiles.length < 1" class="upload-single" @tap="openUploadSheet('font')">
              <image class="upload-ph-img" src="/static/images/shangchuan.png" mode="scaleToFill" />
            </view>
            <view v-for="(f, i) in fontFiles" :key="i" class="file-row">
              <image class="file-icon" :src="isImage(f)?'/static/images/icon-file-img.png':'/static/images/icon-file-pdf.png'" mode="aspectFit" />
              <text class="file-name">{{ f }}</text>
              <image class="file-del-icon" src="/static/images/shanchu.png" mode="scaleToFill" @tap.stop="fontFiles.splice(i,1)" />
            </view>
            <text class="upload-rule">支持 PDF、DOC、DOCX 格式，单文件不超过 10MB</text>
          </view>
        </template>

        <!-- 固定附件 -->
        <view v-for="att in fixedAtts" :key="att.key" class="form-field" :class="{ 'form-field-last': att.last }">
          <view class="f-title-row">
            <text class="f-label">{{ att.label }}</text>
            <text class="view-tpl-text">查看模板</text>
          </view>
          <view v-if="attFiles[att.key].length < att.max" class="upload-single" @tap="openUploadSheet(att.key)">
            <image class="upload-ph-img" src="/static/images/shangchuan.png" mode="scaleToFill" />
          </view>
          <view v-for="(f, i) in attFiles[att.key]" :key="i" class="file-row">
            <image class="file-icon" :src="isImage(f)?'/static/images/icon-file-img.png':'/static/images/icon-file-pdf.png'" mode="aspectFit" />
            <text class="file-name">{{ f }}</text>
            <image class="file-del-icon" src="/static/images/shanchu.png" mode="scaleToFill" @tap.stop="attFiles[att.key].splice(i,1)" />
          </view>
          <text class="upload-rule">{{ att.rule }}</text>
        </view>
      </view>

      <!-- 备注 -->
      <view class="form-card">
        <view class="sec-title"><view class="sec-bar"></view><text class="sec-label">备注</text></view>
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

      <view style="height: 200rpx;"></view>
    </scroll-view>

    <!-- ③ 底部按钮 -->
    <view v-if="!showNotice" class="bottom-bar">
      <button class="btn btn-outline" @tap="onSaveDraft">保存草稿</button>
      <button class="btn btn-primary" @tap="onSubmit">{{ submitLabel }}</button>
    </view>

    <!-- ④ 上传方式底部弹窗 -->
    <view v-if="showUploadSheet" class="upload-sheet-overlay" @tap="showUploadSheet = false">
      <view class="upload-sheet" @tap.stop>
        <view class="upload-sheet-title">选择上传文件</view>
        <view class="sheet-title-line"></view>
        <view class="upload-sheet-item" @tap="onUploadOption('camera')">拍摄</view>
        <view :class="['upload-sheet-item', uploadSheetImgOnly ? 'upload-sheet-item-last' : '']" @tap="onUploadOption('album')">选择相册照片</view>
        <template v-if="!uploadSheetImgOnly">
          <view class="upload-sheet-item" @tap="onUploadOption('chat-img')">从聊天记录选择图片</view>
          <view class="upload-sheet-item upload-sheet-item-last" @tap="onUploadOption('chat-file')">从聊天记录选择文件</view>
        </template>
      </view>
    </view>

  </view>
</template>

<script>
export default {
  data() {
    return {
      showNotice: false,
      showUploadSheet: false,
      currentUploadTarget: '',
      uploadSheetImgOnly: false,
      agreed: false,
      mode: 'new', // 'new' | 'edit' | 'reapply' | 'reupload'

      licenseFiles: [],
      fontFiles: [],
      mentouFiles: [],
      contact: '',
      phone: '',
      remark: '',
      remarkLen: 0,

      selectedSubs: [],

      categories: [
        { name: '门头广告', items: ['招牌更换', '灯箱安装', 'LED屏幕', '标识标牌'] },
        { name: '基建改造', items: ['隔墙拆除', '地面找平', '吊顶施工', '隔断施工'] },
        { name: '消防系统', items: ['消防栓移位', '喷淋改造', '烟感报警'] },
        { name: '电气改造', items: ['电表增容', '线路改造', '水表读数确认'] },
        { name: '给排水',   items: ['上水改造', '下水改造', '防水施工'] }
      ],

      fixedAtts: [
        { key: 'sgfa', label: '施工方案',   max: 3, rule: '支持 PDF、DOC、DOCX 格式，单文件不超过 20MB，最多上传 3 个', last: false },
        { key: 'sgtz', label: '施工图纸',   max: 5, rule: '支持 PDF、DWG、DXF 格式，单文件不超过 50MB，最多上传 5 个', last: false },
        { key: 'sght', label: '施工方合同', max: 1, rule: '支持 PDF 格式，单文件不超过 20MB',                         last: false },
        { key: 'sgzz', label: '施工方资质', max: 3, rule: '支持 PDF、JPG、PNG 格式，单文件不超过 10MB，最多上传 3 个', last: true  }
      ],
      attFiles: { sgfa: [], sgtz: [], sght: [], sgzz: [] }
    }
  },

  computed: {
    hasMentou() {
      return this.selectedSubs.some(s => s.startsWith('门头广告|'))
    },
    submitLabel() {
      return this.mode === 'reupload' ? '重新提交' : this.mode === 'reapply' ? '重新申请' : '提交申请'
    }
  },

  onLoad(options) {
    this.mode = options.mode || 'new'

    if (this.mode === 'new' || this.mode === 'reapply') {
      this.showNotice = true
    }

    uni.setNavigationBarTitle({ title: '新增装修申请' })

    if (this.mode === 'edit') {
      uni.setNavigationBarTitle({ title: '编辑申请' })
      this._prefillDraft()
    } else if (this.mode === 'reupload') {
      uni.setNavigationBarTitle({ title: '重新上传附件' })
      this._prefillDraft()
    } else if (this.mode === 'reapply') {
      uni.setNavigationBarTitle({ title: '重新申请' })
    }
  },

  methods: {
    onNoticeCancel() {
      uni.navigateBack()
    },
    onNoticeConfirm() {
      if (!this.agreed) {
        uni.showToast({ title: '请先阅读并同意申请须知', icon: 'none' })
        return
      }
      this.showNotice = false
    },

    isSelected(catName, sub) {
      return this.selectedSubs.includes(catName + '|' + sub)
    },
    toggleSub(catName, sub) {
      const key = catName + '|' + sub
      const idx = this.selectedSubs.indexOf(key)
      if (idx >= 0) {
        this.selectedSubs.splice(idx, 1)
        if (catName === '门头广告' && !this.hasMentou) {
          this.mentouCount = 0
          this.fontFile = ''
        }
      } else {
        this.selectedSubs.push(key)
      }
    },

    setAttFile(key, val) {
      if (!Array.isArray(this.attFiles[key])) this.attFiles[key] = []
      if (val) this.attFiles[key].push(val)
    },

    isImage(filename) {
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)
    },

    openUploadSheet(target) {
      this.currentUploadTarget = target
      this.uploadSheetImgOnly = (target === 'license')
      this.showUploadSheet = true
    },
    onUploadOption(type) {
      const t = this.currentUploadTarget
      const ext = (type === 'chat-file') ? '.pdf' : '.jpg'
      if (t === 'license') {
        if (this.licenseFiles.length < 1) this.licenseFiles.push('营业执照' + ext)
      } else if (t === 'font') {
        if (this.fontFiles.length < 1) this.fontFiles.push('字体侵权承诺书' + ext)
      } else if (t) {
        const att = this.fixedAtts.find(a => a.key === t)
        if (att && this.attFiles[t].length < (att.max || 1)) {
          this.attFiles[t].push((att ? att.label : t) + ext)
        }
      }
      this.showUploadSheet = false
    },

    onSaveDraft() {
      uni.showToast({ title: '草稿已保存', icon: 'success' })
      setTimeout(() => {
        uni.navigateTo({ url: '/pages/merchant-apply-list/index?tab=draft' })
      }, 1000)
    },

    onSubmit() {
      if (!this.licenseFiles.length) {
        uni.showToast({ title: '请上传营业执照', icon: 'none' }); return
      }
      if (!this.contact.trim()) {
        uni.showToast({ title: '请输入联系人', icon: 'none' }); return
      }
      if (!this.phone.trim()) {
        uni.showToast({ title: '请输入联系电话', icon: 'none' }); return
      }
      if (this.selectedSubs.length === 0) {
        uni.showToast({ title: '请选择至少一个装修项目', icon: 'none' }); return
      }
      if (this.hasMentou && this.mentouFiles.length === 0) {
        uni.showToast({ title: '请上传门头效果图', icon: 'none' }); return
      }
      uni.showToast({ title: '申请已提交', icon: 'success' })
      setTimeout(() => {
        uni.navigateTo({ url: '/pages/merchant-apply-list/index?tab=reviewing' })
      }, 1000)
    },

    _prefillDraft() {
      this.licenseFiles = ['营业执照.jpg']
      this.contact = '王经理'
      this.phone = '13812341234'
      this.selectedSubs = ['门头广告|招牌更换', '门头广告|灯箱安装', '基建改造|隔墙拆除']
      this.mentouFiles = ['效果图1.jpg']
      this.fontFiles = ['字体侵权承诺书.pdf']
    }
  }
}
</script>

<style>
.page-wrap {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #FFFFFF;
  overflow: hidden;
}

/* ——— 申请须知 ——— */
.notice-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}
.notice-sheet {
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  width: 100%;
  max-height: 85vh;
  padding: 0 36rpx calc(32rpx + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.notice-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 36rpx 0 24rpx;
  flex-shrink: 0;
}
.notice-title { font-size: 34rpx; font-weight: 600; color: var(--color-text-primary); }
.notice-close  { font-size: 40rpx; color: var(--color-text-hint); padding: 0 4rpx; }
.notice-scroll { flex: 1; min-height: 200rpx; max-height: 45vh; overflow: hidden; }
.notice-text {
  display: block;
  font-size: 26rpx;
  color: var(--color-text-secondary);
  line-height: 1.8;
  white-space: pre-wrap;
  padding: 8rpx 0 24rpx;
}
.agree-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 0 28rpx;
  flex-shrink: 0;
}
.agree-chk {
  width: 36rpx; height: 36rpx;
  border-radius: 8rpx;
  border: 2rpx solid var(--color-border);
  flex-shrink: 0;
  background: #fff;
}
.agree-chk-on {
  background: var(--color-primary);
  border-color: var(--color-primary);
  position: relative;
}
.agree-chk-on::after {
  content: '✓';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
}
.agree-lbl { font-size: 26rpx; color: var(--color-text-primary); flex: 1; }
.notice-btns {
  display: flex;
  gap: 30rpx;
  flex-shrink: 0;
  margin: 0 -36rpx;
  padding: 12rpx 36rpx 0;
  border-top: 1rpx solid #EDEDED;
  background: #FFFFFF;
}
.notice-btns .btn { flex: 1; }
.btn-dim { opacity: 0.45; }

/* ——— 表单滚动区 ——— */
.form-scroll { flex: 1; overflow: hidden; }

/* ——— 表单卡片 ——— */
.form-card {
  background: #fff;
  padding: 0 36rpx;
  margin-bottom: 40rpx;
}
.form-card:first-child {
  margin-top: 32rpx;
}

/* ——— 表单字段 ——— */
.form-field {
  padding-bottom: 0;
  margin-bottom: 40rpx;
}
.form-field.form-field-last {
  margin-bottom: 0;
  padding-bottom: 0;
}
.f-label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 24rpx;
}
.req { color: var(--color-danger); margin-right: 4rpx; }

/* ——— 信息录入字段 ——— */
.form-field-info { padding-left: 0; border-bottom: 2rpx solid var(--color-divider); }
.f-label-row { display: flex; align-items: flex-start; }

/* ——— 只读值（信息录入样式） ——— */
.f-val { display: block; font-size: 24rpx; color: #666666; padding: 0 0 12rpx; }

/* ——— 可编辑输入框（信息录入样式） ——— */
.f-input {
  width: 100%;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0 0 12rpx;
  font-size: 24rpx;
  color: #000000;
  box-sizing: border-box;
}
.ph { color: #999999; }

/* ——— 上传 ——— */
.upload-single {
  width: 320rpx; height: 270rpx;
  border-radius: 16rpx;
  overflow: hidden;
  display: block;
}
.upload-ph-img { width: 100%; height: 100%; display: block; }
.upload-rule { display: block; font-size: 22rpx; color: var(--color-text-hint); margin-top: 12rpx; }
.f-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24rpx; }
.f-title-row .f-label { margin-bottom: 0; }
.view-tpl-text { font-size: 28rpx; color: var(--color-primary); text-decoration: underline; }

/* 文件行（§五 §4.4 规范） */
.file-row {
  display: flex; align-items: center; gap: 16rpx;
  padding: 0 20rpx 0 26rpx; height: 100rpx;
  background: #F2FAFE; border: 1rpx solid #D1E2EB; border-radius: 16rpx;
  box-sizing: border-box;
  margin-top: 20rpx;
}
.file-icon     { width: 48rpx; height: 48rpx; flex-shrink: 0; }
.file-name     { flex: 1; font-size: 25rpx; color: #000000; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-del-icon { width: 48rpx; height: 48rpx; flex-shrink: 0; }

/* ——— 多图上传 ——— */
.multi-upload-row {
  display: flex; flex-wrap: wrap; gap: 16rpx;
}
.thumb-item {
  width: 160rpx; height: 160rpx; border-radius: 16rpx;
  background: #F2FAFE; border: 1rpx solid #D1E2EB;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: relative;
}
.thumb-name { font-size: 20rpx; color: var(--color-text-hint); margin-top: 8rpx; text-align: center; padding: 0 8rpx; }
.thumb-del  {
  position: absolute; top: 4rpx; right: 4rpx;
  font-size: 28rpx; color: #fff;
  background: rgba(0,0,0,0.4); border-radius: 50%;
  width: 40rpx; height: 40rpx; line-height: 40rpx; text-align: center;
}
.thumb-add {
  width: 160rpx; height: 160rpx; border-radius: 16rpx;
  border: 4rpx dashed #D9D9D9;
  display: flex; align-items: center; justify-content: center;
  font-size: 60rpx; color: #D9D9D9;
}

/* ——— 装修类目 ——— */
.cat-group { padding: 20rpx 0; border-bottom: 1rpx solid #F0F0F0; }
.cat-group:last-child { border-bottom: none; padding-bottom: 0; }
.cat-name { display: block; font-size: 28rpx; font-weight: 600; color: var(--color-text-primary); margin-bottom: 16rpx; }
.sub-tags { display: flex; flex-wrap: wrap; gap: 16rpx; }
.sub-tag {
  padding: 12rpx 28rpx; border-radius: 10rpx;
  font-size: 28rpx; font-weight: 400;
  color: #333333;
  background: #F7F7F7;
}
.sub-tag-on {
  background: rgba(26, 186, 108, 0.05);
  color: #1ABA6C;
  font-weight: 600;
  outline: 1rpx solid #1ABA6C;
  outline-offset: -1rpx;
}

/* ——— 备注 ——— */
.remark-wrap {
  position: relative;
  background: #fff;
  border: 2rpx solid var(--color-border);
  border-radius: 12rpx;
  padding: 20rpx;
  box-sizing: border-box;
}
.remark-ta {
  width: 100%;
  height: 200rpx;
  font-size: 26rpx;
  color: var(--color-text-primary);
  line-height: 1.6;
  background: transparent;
}
.remark-count {
  position: absolute; bottom: 16rpx; right: 20rpx;
  font-size: 22rpx; color: var(--color-text-hint);
}

/* ——— 上传方式底部弹窗 ——— */
.upload-sheet-overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
  display: flex; align-items: flex-end; justify-content: center;
}
.upload-sheet {
  width: 100%;
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  padding-bottom: env(safe-area-inset-bottom);
}
.upload-sheet-title {
  font-size: 32rpx; font-weight: 600;
  font-family: 'PingFang SC', sans-serif;
  color: rgba(0, 0, 0, 0.9);
  text-align: center;
  padding: 40rpx 32rpx;
}
.sheet-title-line {
  height: 1rpx;
  background: #EBEBEB;
  margin: 0 36rpx;
}
.upload-sheet-item {
  font-size: 28rpx; font-weight: 400;
  font-family: 'PingFang SC', sans-serif;
  color: #333333;
  text-align: center;
  padding: 40rpx 0;
  border-bottom: 1rpx solid #EBEBEB;
}
.upload-sheet-item-last { border-bottom: none; padding-bottom: 100rpx; }

/* ——— 上传后图片预览 ——— */
.upload-done-wrap {
  position: relative;
  width: 320rpx; height: 270rpx;
}
.upload-done-img {
  width: 320rpx; height: 270rpx;
  border-radius: 16rpx;
  display: block;
}
.upload-done-del {
  position: absolute; top: 8rpx; right: 8rpx;
  width: 44rpx; height: 44rpx; border-radius: 50%;
  background: rgba(0, 0, 0, 0.4); color: #FFFFFF;
  font-size: 28rpx; line-height: 44rpx; text-align: center;
}
</style>
