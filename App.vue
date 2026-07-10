<script>
export default {
  onLaunch() {}
}
</script>

<style>
/* 全局 CSS 变量 */
page {
  --color-primary: #1ABA6C;
  --color-primary-light: #E8F9F0;
  --color-primary-border: rgba(26, 186, 108, 0.3);
  --color-danger: #FA2B2D;
  --color-danger-light: rgba(250, 43, 45, 0.05);
  --color-danger-border: rgba(250, 43, 45, 0.3);
  --color-warning: #FA8C16;
  --color-warning-light: rgba(250, 140, 22, 0.1);
  --color-info: #1890FF;
  --color-info-light: rgba(24, 144, 255, 0.1);
  --color-success: #00A73B;
  --color-bg-page: #F7F8FC;
  --color-bg-card: #FFFFFF;
  --color-text-primary: #333333;
  --color-text-secondary: #666666;
  --color-text-hint: #999999;
  --color-text-placeholder: #CCCCCC;
  --color-border: #E7E7E7;
  --color-divider: #F0F0F0;
  --color-divider-h: #EDEDED;
  --page-padding: 28rpx;
  --card-radius: 16rpx;
  --btn-radius: 12rpx;
  font-family: -apple-system, 'PingFang SC', sans-serif;
  background-color: var(--color-bg-page);
  font-size: 28rpx;
  color: var(--color-text-primary);
}

/* 通用状态标签 */
.status-tag {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  white-space: nowrap;
}
.status-orange { color: var(--color-warning); background: var(--color-warning-light); }
.status-green  { color: var(--color-primary); background: var(--color-primary-light); }
.status-red    { color: var(--color-danger);  background: var(--color-danger-light);  border: 2rpx solid var(--color-danger-border); }
.status-blue   { color: var(--color-info);    background: var(--color-info-light); }
.status-gray   { color: var(--color-text-hint); background: rgba(0,0,0,0.04); }

/* 段落标题 */
.sec-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 24rpx;
}
.sec-bar {
  width: 8rpx;
  height: 36rpx;
  background: var(--color-primary);
  border-radius: 0 8rpx 8rpx 0;
  flex-shrink: 0;
}
.sec-label {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--color-text-primary);
}
.req-label::before {
  content: '* ';
  color: var(--color-danger);
}

/* 通用按钮 */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  line-height: 1;
  box-sizing: border-box;
}
.btn::after { border: none; }
.btn-primary       { background: var(--color-primary); color: #fff; }
.btn-outline-green { background: #fff; color: var(--color-primary); border: 1rpx solid var(--color-primary); font-weight: 400; }
.btn-outline       { background: #fff; color: var(--color-text-primary); border: 2rpx solid var(--color-border); font-weight: 400; }
.btn-outline-red   { background: #fff; color: var(--color-danger); border: 2rpx solid var(--color-danger); font-weight: 400; }
.btn-danger        { background: var(--color-danger); color: #fff; }

/* 底部操作区 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-top: 1rpx solid #EDEDED;
  height: calc(180rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: flex-start;
  padding: 12rpx 36rpx 0;
  gap: 30rpx;
  box-sizing: border-box;
  z-index: 100;
}
.bottom-bar .btn { flex: 1; }

/* 通用 Modal 遮罩 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 标准确认对话框（Figma 规范） */
.dialog-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  width: 622rpx;
  overflow: hidden;
}
.dialog-body {
  padding: 40rpx 48rpx 0;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  text-align: center;
}
.dialog-title {
  font-size: 32rpx;
  font-weight: 600;
  line-height: 52rpx;
  color: rgba(0,0,0,0.9);
}
.dialog-body-text {
  font-size: 28rpx;
  color: rgba(0,0,0,0.6);
  line-height: 48rpx;
}
.dialog-footer {
  display: flex;
  gap: 24rpx;
  padding: 48rpx 48rpx 40rpx;
}
.dialog-footer .btn { flex: 1; }
.modal-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  width: 82%;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-title {
  font-size: 34rpx;
  font-weight: 600;
  text-align: center;
  margin-bottom: 28rpx;
}
.modal-info {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: 28rpx;
  padding: 20rpx;
  background: var(--color-bg-page);
  border-radius: 12rpx;
}
.modal-btns { display: flex; gap: 20rpx; margin-top: 28rpx; }
.modal-btns .btn { flex: 1; }

/* 详情页 section */
.detail-section {
  background: #fff;
  padding: 28rpx;
  margin-bottom: 20rpx;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16rpx 0;
  font-size: 26rpx;
  border-bottom: 2rpx solid var(--color-divider);
}
.detail-row:last-child { border-bottom: none; }
.detail-label { color: var(--color-text-hint); flex-shrink: 0; margin-right: 20rpx; }
.detail-value { color: var(--color-text-primary); text-align: right; flex: 1; }

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 120rpx 40rpx;
  color: var(--color-text-hint);
  font-size: 26rpx;
}
</style>
