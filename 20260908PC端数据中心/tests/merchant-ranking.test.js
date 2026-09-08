// #AI:dev:file
const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

const html = fs.readFileSync(__dirname + "/../preview/数据中心.html", "utf8");
const source = html.split("// #AI:dev:merchant-ranking:start")[1]?.split("// #AI:dev:merchant-ranking:end")[0];
assert.ok(source, "商户排名排序函数尚未实现");

const context = {};
vm.runInNewContext(source, context);
const rows = [
  { id: 1, market: "甲市场", merchant: "鑫源车商", inbound: 10, listed: 8, turnoverDays: 8, outbound: 5, outboundAmount: 20 },
  { id: 2, market: "乙市场", merchant: "悦达车商", inbound: 20, listed: 15, turnoverDays: 3, outbound: 15, outboundAmount: 60 }
];

assert.deepStrictEqual(Array.from(context.filterMerchantRows(rows, "", "车商"), row => row.id), [1, 2]);
assert.deepStrictEqual(Array.from(context.filterMerchantRows(rows, "", "悦达"), row => row.id), [2]);
assert.deepStrictEqual(Array.from(context.filterMerchantRows(rows, "甲市场", "鑫"), row => row.id), [1]);
assert.deepStrictEqual(Array.from(context.rankMerchantRows(rows, "all"), row => row.id), [1, 2]);
assert.deepStrictEqual(Array.from(context.rankMerchantRows(rows, "inbound"), row => row.id), [2, 1]);
assert.deepStrictEqual(Array.from(context.rankMerchantRows(rows, "inbound", "asc"), row => row.id), [1, 2]);
assert.deepStrictEqual(Array.from(context.rankMerchantRows(rows, "turnoverDays"), row => row.id), [2, 1]);
assert.deepStrictEqual(Array.from(context.rankMerchantRows(rows, "turnoverDays", "desc"), row => row.id), [1, 2]);
assert.deepStrictEqual(Array.from(context.rankMerchantRows(rows, "outbound"), row => row.id), [2, 1]);
assert.deepStrictEqual(Array.from(context.rankMerchantRows(rows, "outbound", "asc"), row => row.id), [1, 2]);
assert.deepStrictEqual(Array.from(context.rankMerchantRows(rows, "outboundAmount"), row => row.id), [2, 1]);
assert.deepStrictEqual(Array.from(context.rankMerchantRows(rows, "outboundAmount", "asc"), row => row.id), [1, 2]);
assert.deepStrictEqual(Array.from(context.merchantPodiumRows([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]), row => row.id), [1, 2, 3]);
assert.match(html, /v-if="activeMetric !== 'all'" class="merchant-podium"/);
assert.match(html, /podiumMetricValue\(row\)/);
assert.match(html, /podiumMetricDetail\(row\)/);
assert.match(html, /周转周期（新车）/);
assert.match(html, /周转周期（二手车）/);
assert.match(html, /newTurnoverDays/);
assert.match(html, /usedTurnoverDays/);
assert.match(html, /出库量（新车）/);
assert.match(html, /出库量（二手车）/);
assert.match(html, /newOutbound/);
assert.match(html, /usedOutbound/);
assert.match(html, /activeMetric === 'outboundAmount'.*出库金额（新车）/s);
assert.doesNotMatch(html, /activeMetric === 'inbound'[^\n]*>出库金额（新车）/);
assert.match(html, /placeholder="请输入商户名称"/);
assert.match(html, /el-tabs__item\.is-top:nth-child\(2\)/);
assert.deepStrictEqual(JSON.parse(JSON.stringify(context.summarizeMerchantRows(rows))), {
  merchantCount: 2,
  inbound: 30,
  listed: 23,
  outbound: 20,
  outboundAmount: 80,
  averageTurnoverDays: 4.3,
  averageOutboundAmount: 4
});
assert.strictEqual(context.formatMerchantTrend(1.32), "↑ 1.32%");
assert.strictEqual(context.formatMerchantTrend(-9.58), "↓ -9.58%");
assert.strictEqual(context.formatMerchantTrend(0), "— 0.00%");
assert.strictEqual(context.averageMerchantOutboundAmount(rows[0]), 4);
assert.strictEqual(context.averageMerchantOutboundAmount({ outbound: 0, outboundAmount: 0 }), 0);
assert.deepStrictEqual(JSON.parse(JSON.stringify(context.splitMerchantMetric(101, 0.45, 0))), { first: 45, second: 56 });
assert.deepStrictEqual(JSON.parse(JSON.stringify(context.splitMerchantMetric(100.1, 0.55, 1))), { first: 55.1, second: 45 });
console.log("merchant ranking: passed");
