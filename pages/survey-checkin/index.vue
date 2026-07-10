<template>
  <view class="page">
    <scroll-view scroll-y class="scroll-body" :enhanced="true" :show-scrollbar="false">

      <!-- 基本信息卡片 -->
      <view class="info-card">
        <view class="sec-title">
          <view class="sec-bar"></view>
          <text class="sec-label">基本信息</text>
        </view>
        <view class="detail-row">
          <text class="detail-label">商铺号</text>
          <text class="detail-value">{{ shopNo }}</text>
        </view>
        <view class="detail-row">
          <text class="detail-label">{{ idLabel }}</text>
          <text class="detail-value">{{ itemId }}</text>
        </view>
        <view class="detail-row">
          <text class="detail-label">{{ catLabel }}</text>
          <text class="detail-value">{{ category }}</text>
        </view>
        <view class="detail-row">
          <text class="detail-label">商户名称</text>
          <text class="detail-value">{{ merchant }}</text>
        </view>
      </view>

      <!-- 现场拍照 -->
      <view class="section-block">
        <view class="req-row">
          <text class="req-star">*</text>
          <text class="block-title">现场拍照</text>
        </view>

        <!-- 未上传：切图 -->
        <image
          v-if="photos.length === 0"
          src="/static/images/uploadedImage.png"
          mode="widthFix"
          class="upload-img"
          @tap="choosePhoto"
        />

        <!-- 已上传：2列网格 -->
        <view v-else class="photo-grid">
          <view v-for="(img, i) in photos" :key="i" class="photo-thumb" @tap="previewPhoto(i)">
            <image :src="img" mode="aspectFill" class="photo-img" />
            <view class="photo-del" @tap.stop="deletePhoto(i)">
              <text class="del-x">×</text>
            </view>
          </view>
          <image
            v-if="photos.length < 6"
            src="/static/images/uploadedImage.png"
            mode="widthFix"
            class="upload-img"
            @tap="choosePhoto"
          />
        </view>

        <text v-if="photoError" class="error-tip">请至少上传1张现场照片</text>
      </view>

      <!-- 踏勘描述 -->
      <view class="section-block">
        <text class="block-title">踏勘描述</text>
        <view class="textarea-box">
          <textarea
            class="desc-ta"
            placeholder="请输入踏勘备注"
            placeholder-class="ta-ph"
            v-model="remark"
            maxlength="200"
          />
          <text class="char-count">{{ remark.length }}/200</text>
        </view>
      </view>

      <view style="height: 200rpx;"></view>
    </scroll-view>

    <!-- 底部操作区 -->
    <view class="bottom-bar">
      <button class="btn btn-primary" @tap="confirm">确认签到</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      scene: '',
      shopNo: '',
      itemId: '',
      category: '',
      merchant: '',
      photos: [],
      photoError: false,
      remark: ''
    }
  },

  computed: {
    idLabel()  { return this.scene === 'add-item' ? '增项编号' : (this.scene === 'accept' ? '验收编号' : '申请编号') },
    catLabel() { return this.scene === 'add-item' ? '增项类目' : '装修类目' }
  },

  onLoad(options) {
    this.scene    = options.scene || ''
    this.shopNo   = decodeURIComponent(options.shopNo   || '')
    this.itemId   = decodeURIComponent(options.itemId   || '')
    this.category = decodeURIComponent(options.category || '')
    this.merchant = decodeURIComponent(options.merchant || '')
  },

  methods: {
    choosePhoto() {
      uni.chooseMedia({
        count: 6 - this.photos.length,
        mediaType: ['image'],
        sourceType: ['camera', 'album'],
        success: (res) => {
          const urls = res.tempFiles.map(f => f.tempFilePath)
          this.photos = [...this.photos, ...urls]
          this.photoError = false
        }
      })
    },

    previewPhoto(index) {
      uni.previewImage({ current: this.photos[index], urls: this.photos })
    },

    deletePhoto(index) {
      this.photos.splice(index, 1)
    },

    confirm() {
      if (this.photos.length === 0) {
        this.photoError = true
        uni.showToast({ title: '请上传现场照片', icon: 'none' })
        return
      }
      uni.showToast({ title: '签到踏勘成功', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 1500)
    }
  }
}
</script>

<style>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #FFFFFF;
  overflow: hidden;
}
/* sec-title / sec-bar / sec-label / detail-row / detail-label / detail-value
   均由 App.vue 全局定义，此处不重复。                                          */

.scroll-body { flex: 1; }

/* 基本信息卡片：独立视觉规格
   padding-top 20rpx（标题距顶）
   padding-bottom 12rpx = 28rpx目标 - 16rpx(detail-row padding-bottom)
   .info-card .sec-title margin-bottom 8rpx = 24rpx目标 - 16rpx(detail-row padding-top) */
.info-card {
  background: #FAFAFA;
  border-radius: 20rpx;
  border: 2rpx solid #E6E6E6;
  margin: 32rpx 28rpx 40rpx;
  padding: 20rpx 28rpx 12rpx;
}
.info-card .sec-title {
  margin-bottom: 8rpx;
}
.info-card .detail-label,
.info-card .detail-value {
  line-height: 36rpx;
}

/* ── section block（现场拍照 / 踏勘描述）── */
.section-block {
  padding: 0 28rpx;
  margin-bottom: 40rpx;
}
.req-row {
  display: flex;
  align-items: center;
  gap: 4rpx;
  margin-bottom: 20rpx;
}
.req-star {
  font-size: 28rpx;
  color: #FA2B2D;
  font-weight: 600;
  line-height: 1;
}
.block-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

/* ── 取景框 / 新增占位 ── */
.upload-img {
  width: 320rpx;
  height: 270rpx;
  display: block;
  border-radius: 16rpx;
}

/* ── 已上传 2列网格 ── */
.photo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.photo-thumb {
  position: relative;
  width: 320rpx;
  height: 270rpx;
  border-radius: 16rpx;
  overflow: hidden;
  flex-shrink: 0;
}
.photo-img {
  width: 100%;
  height: 100%;
}
.photo-del {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 44rpx;
  height: 44rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.del-x {
  color: #fff;
  font-size: 30rpx;
  line-height: 1;
}
.add-plus {
  font-size: 56rpx;
  color: #ccc;
  line-height: 1;
}
.error-tip {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #FA2B2D;
}

/* ── 踏勘描述 ── */
.textarea-box {
  position: relative;
  background: #fff;
  border: 2rpx solid #D2D6E2;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-top: 20rpx;
  height: 182rpx;
  box-sizing: border-box;
}
.desc-ta {
  width: 100%;
  height: 100%;
  font-size: 26rpx;
  color: #333;
  line-height: 1.5;
  background: transparent;
}
.ta-ph {
  color: #CCCCCC;
  font-size: 26rpx;
  font-weight: 400;
}
.char-count {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
  font-size: 24rpx;
  color: #ccc;
  line-height: 1;
}

/* ── 底部操作区 ── */
</style>
