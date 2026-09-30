// #AI:dev:file
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync(new URL('../preview/客户线索管理.html', `file://${__filename}`), 'utf8');
const reclickMatch = html.match(/function intentReclick\(id,event\) \{[^\n]+\}/);
const recordsMatch = html.match(/function consultationRows\(row\) \{[\s\S]*?\n    \}/);
assert.ok(reclickMatch, '预览中应存在意向线索重复咨询处理函数');
assert.ok(recordsMatch, '预览中应存在咨询记录整理函数');

const fixedNow = '2026-09-29 12:34:56';
class FixedDate extends Date {
  constructor() { super(fixedNow.replace(' ', 'T') + '+08:00'); }
}
const fmt = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
function invokeRecords(row) {
  const context = { row };
  vm.runInNewContext(`${recordsMatch[0]}; result=consultationRows(row)`, context);
  return context.result;
}
function invokeIntentReclick(row) {
  const data = { intent: [row] };
  const context = { DATA: data, Date: FixedDate, fmt, render() {}, consultationRows };
  vm.runInNewContext(`${recordsMatch[0]}; ${reclickMatch[0]}; intentReclick(${row.id})`, context);
  return data.intent;
}
function consultationRows(row) {
  const context = { row };
  vm.runInNewContext(`${recordsMatch[0]}; result=consultationRows(row)`, context);
  return context.result;
}
function lead(status, extra = {}) {
  return {
    id: 21, phone: '13100131000', vin: 'LBVNR31010K123456', vehicle: '宝马 X3', clicks: 4,
    date: '2026-09-01 08:20:00', status, owner: '销售-李然',
    records: [{ type: '创建客户', time: '2026-09-01 08:20:00' }], ...extra
  };
}

{
  const row = lead('待跟进', { clickRecords: ['2026-09-10 10:00:00'] });
  const before = structuredClone(row.records);
  const list = invokeIntentReclick(row);
  assert.equal(list.length, 1, '待跟进重复咨询不新增线索');
  assert.equal(row.clicks, 5);
  assert.equal(row.date, '2026-09-01 08:20:00', '待跟进创建时间保持首次咨询时间');
  assert.deepEqual(row.records, before, '待跟进跟进记录不变');
  const consultations = consultationRows(row);
  assert.equal(consultations.length, row.clicks, '咨询记录数始终等于点击次数');
  assert.equal(consultations[0].vehicle, '宝马 X3');
  assert.equal(consultations[0].time, fixedNow);
  assert.equal(consultations[1].time, '2026-09-10 10:00:00');
}

{
  const row = lead('跟进中');
  const list = invokeIntentReclick(row);
  assert.equal(list.length, 1, '跟进中重复咨询不新增线索');
  assert.equal(row.clicks, 5);
  assert.equal(row.status, '跟进中');
  assert.equal(row.date, '2026-09-01 08:20:00', '跟进中创建时间不更新');
  assert.equal(consultationRows(row).length, row.clicks);
}

for (const status of ['完成跟进', '跟进失败']) {
  const row = lead(status, { records: [
    { type: '创建客户', time: '2026-09-01 08:20:00' },
    { type: '新增跟进', time: '2026-09-05 11:20:00', content: '历史操作' }
  ] });
  const before = structuredClone(row.records);
  const list = invokeIntentReclick(row);
  assert.equal(list.length, 1, `${status}重复咨询不新增线索`);
  assert.equal(row.clicks, 5);
  assert.equal(row.status, '待跟进');
  assert.equal(row.date, fixedNow, `${status}恢复待跟进时创建时间更新为本次咨询时间`);
  assert.deepEqual(row.records, before, `${status}跟进操作记录保留`);
  assert.equal(consultationRows(row).length, row.clicks);
}

{
  const source = html.match(/intent: \[([\s\S]*?)\n      \]/)?.[1];
  assert.ok(source, '应能读取所有意向线索样例');
  const samples = [...source.matchAll(/\{([^{}]+)\}/g)].map(([, item]) => ({
    clicks: Number(item.match(/clicks:(\d+)/)?.[1]),
    date: item.match(/date:'([^']+)'/)?.[1] || '',
    vehicle: item.match(/vehicle:'([^']+)'/)?.[1] || '',
    previewConsultationTimes: [...(item.match(/previewConsultationTimes:\[([^\]]*)\]/)?.[1] || '').matchAll(/'([^']+)'/g)].map(([, time]) => time)
  }));
  assert.ok(samples.length > 0);
  for (const row of samples) {
    const rows = invokeRecords(row);
    assert.equal(rows.length, row.clicks, '每条存量样例的咨询记录条数应等于点击次数');
    assert.ok(rows.every(record => record.vehicle === row.vehicle), '存量咨询记录应展示已知车辆');
    assert.equal(row.previewConsultationTimes.length, row.clicks, '每条静态样例都应提供与点击次数一致的示例时间');
    assert.ok(rows.every(record => record.time), '静态预览样例的每条咨询时间均非空');
    const times = Array.from(rows, record => record.time);
    assert.deepEqual(times, times.slice().sort((a, b) => b.localeCompare(a)), '所有示例时间倒序排列');
  }
  assert.match(html, /意向线索样例咨询时间仅用于静态预览，不代表真实历史记录/, '样例时间须明确标注为静态预览数据');
  assert.match(html, /<h3>咨询记录<\/h3>/, '详情模块标题应为咨询记录');
  assert.match(html, /咨询车辆[\s\S]*咨询时间/, '咨询记录应展示咨询车辆和咨询时间');
}

{
  const rows = consultationRows({ vehicle: '测试车辆', clicks: 2, date: '' });
  assert.equal(rows.length, 2);
  assert.ok(rows.every(record => record.time === ''), '真实存量时间无法追溯时仍允许留空');
}

console.log('customer-leads: all assertions passed');
