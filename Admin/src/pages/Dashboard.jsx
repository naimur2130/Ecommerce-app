import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";

/* ---------- theme (validated wine ramp — see dataviz palette) ---------- */
const SERIES = "#a6285c"; // single-hue wine, >=3:1 on white
const RAMP = ["#e79ab7", "#d16f97", "#b44873", "#8c2b54", "#5f1636"]; // ordinal, light->dark
const INK = "#0b0b0b";
const MUTED = "#898781";
const GRID = "#e1e0d9";

const STATUSES = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
];

/* ---------- formatters ---------- */
const nf = new Intl.NumberFormat("en-US");
const cf = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const fmtNum = (n) => nf.format(n || 0);
const fmtMoney = (n) => currency + nf.format(Math.round(n || 0));
const fmtMoneyCompact = (n) => currency + cf.format(n || 0);

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const niceCeil = (x) => {
  if (!x || x <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(x)));
  const n = x / p;
  const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return m * p;
};
const pctChange = (cur, prev) => {
  if (prev === 0) return cur === 0 ? null : 100;
  return ((cur - prev) / prev) * 100;
};

/* ---------- icons ---------- */
const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {path}
  </svg>
);
const IconRevenue = (
  <>
    <path d="M12 1v22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </>
);
const IconOrders = (
  <>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </>
);
const IconProducts = (
  <>
    <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </>
);
const IconPending = (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>
);

/* ---------- delta chip ---------- */
const Delta = ({ value }) => {
  if (value === null || value === undefined) {
    return <span className="text-xs text-gray-400">no prior data</span>;
  }
  const up = value >= 0;
  const color = up ? "#006300" : "#c0392b";
  const bg = up ? "#e8f3e8" : "#fbeaea";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ color, backgroundColor: bg }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path
          d={up ? "M5 1.5 8.5 6H1.5Z" : "M5 8.5 1.5 4h7Z"}
          fill={color}
        />
      </svg>
      {Math.abs(value).toFixed(0)}%
    </span>
  );
};

/* ---------- stat tile ---------- */
const StatCard = ({ label, value, icon, delta, foot, loading }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <p className="text-[13px] font-medium tracking-wide text-gray-500">
        {label}
      </p>
      <span
        className="grid h-9 w-9 place-items-center rounded-xl"
        style={{ backgroundColor: "#fbeef4", color: SERIES }}
      >
        <Icon path={icon} />
      </span>
    </div>
    {loading ? (
      <div className="mt-3 h-8 w-24 animate-pulse rounded bg-gray-100" />
    ) : (
      <p
        className="mt-2 text-3xl font-semibold"
        style={{ color: INK }}
      >
        {value}
      </p>
    )}
    <div className="mt-2 flex items-center gap-2">
      {delta !== undefined && <Delta value={delta} />}
      {foot && <span className="text-xs text-gray-400">{foot}</span>}
    </div>
  </div>
);

/* ---------- card shell ---------- */
const Card = ({ title, subtitle, right, children, className = "" }) => (
  <div
    className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}
  >
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-[15px] font-semibold" style={{ color: INK }}>
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
    {children}
  </div>
);

/* ---------- revenue column chart ---------- */
const RevenueChart = ({ data }) => {
  const max = niceCeil(Math.max(1, ...data.map((d) => d.value)));
  const ticks = [max, max / 2, 0];
  return (
    <div className="flex gap-3">
      {/* y axis */}
      <div
        className="flex flex-col justify-between py-1 text-right text-[11px] tabular-nums"
        style={{ color: MUTED, height: 180 }}
      >
        {ticks.map((t) => (
          <span key={t}>{fmtMoneyCompact(t)}</span>
        ))}
      </div>
      {/* plot */}
      <div className="relative flex-1">
        {/* gridlines */}
        <div className="absolute inset-0" style={{ height: 180 }}>
          {ticks.map((t, i) => (
            <div
              key={i}
              className="absolute left-0 right-0"
              style={{
                top: `${(i / (ticks.length - 1)) * 100}%`,
                borderTop: `1px solid ${GRID}`,
              }}
            />
          ))}
        </div>
        {/* columns */}
        <div
          className="relative flex items-end justify-between gap-2"
          style={{ height: 180 }}
        >
          {data.map((d, i) => {
            const h = max ? (d.value / max) * 100 : 0;
            return (
              <div
                key={i}
                className="group relative flex h-full flex-1 items-end justify-center"
              >
                <div
                  className="w-full max-w-[26px] rounded-t-[4px] transition-[filter] group-hover:brightness-110"
                  style={{
                    height: `${h}%`,
                    minHeight: d.value > 0 ? 3 : 0,
                    backgroundColor: SERIES,
                  }}
                />
                {/* tooltip */}
                <div
                  className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                  style={{ backgroundColor: INK }}
                >
                  <span className="font-medium">{fmtMoney(d.value)}</span>
                  <span className="ml-1 text-gray-300">{d.full}</span>
                </div>
              </div>
            );
          })}
        </div>
        {/* x labels */}
        <div className="mt-2 flex justify-between gap-2">
          {data.map((d, i) => (
            <span
              key={i}
              className="flex-1 text-center text-[11px]"
              style={{ color: MUTED }}
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------- horizontal bar list ---------- */
const BarList = ({ rows, colorFor, valueFmt, empty }) => {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length)
    return <p className="py-8 text-center text-sm text-gray-400">{empty}</p>;
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <div key={r.label} className="group">
          <div className="mb-1 flex items-center justify-between text-[13px]">
            <span className="truncate" style={{ color: "#52514e" }}>
              {r.label}
            </span>
            <span className="tabular-nums font-medium" style={{ color: INK }}>
              {valueFmt ? valueFmt(r.value) : fmtNum(r.value)}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-r-[4px] transition-[width] duration-500"
              style={{
                width: `${(r.value / max) * 100}%`,
                backgroundColor: colorFor ? colorFor(i) : SERIES,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ---------- status pill ---------- */
const StatusPill = ({ status }) => {
  const idx = Math.max(0, STATUSES.indexOf(status));
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: RAMP[idx] }}
      />
      {status}
    </span>
  );
};

/* ---------- skeleton ---------- */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded bg-gray-100 ${className}`} />
);

const Dashboard = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.allSettled([
        axios.get(backendUrl + "/api/product/total"),
        axios.post(
          backendUrl + "/api/order/list",
          {},
          { headers: { token } },
        ),
      ]);
      if (
        prodRes.status === "fulfilled" &&
        prodRes.value.data?.success
      )
        setProducts(prodRes.value.data.products || []);
      if (
        orderRes.status === "fulfilled" &&
        orderRes.value.data?.success
      )
        setOrders(orderRes.value.data.orders || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const stats = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now).getTime();
    const dayMs = 86400000;
    const weekAgo = today - 6 * dayMs; // last 7 calendar days incl. today
    const prevWeekStart = today - 13 * dayMs;

    const revenue = orders.reduce((s, o) => s + (o.amount || 0), 0);
    const pending = orders.filter((o) => o.status !== "Delivered").length;

    // 7-day buckets
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today - i * dayMs);
      days.push({
        key: startOfDay(d).getTime(),
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        full: d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        value: 0,
      });
    }
    const byKey = new Map(days.map((d) => [d.key, d]));

    let curRev = 0,
      prevRev = 0,
      curOrders = 0,
      prevOrders = 0;
    for (const o of orders) {
      const day = startOfDay(o.date).getTime();
      if (byKey.has(day)) byKey.get(day).value += o.amount || 0;
      if (day >= weekAgo) {
        curRev += o.amount || 0;
        curOrders += 1;
      } else if (day >= prevWeekStart && day < weekAgo) {
        prevRev += o.amount || 0;
        prevOrders += 1;
      }
    }

    // status breakdown
    const statusRows = STATUSES.map((s) => ({
      label: s,
      value: orders.filter((o) => o.status === s).length,
    }));

    // top categories
    const catMap = new Map();
    for (const p of products)
      catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
    const topCategories = [...catMap.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const recent = [...orders]
      .sort((a, b) => (b.date || 0) - (a.date || 0))
      .slice(0, 6);

    return {
      revenue,
      orderCount: orders.length,
      productCount: products.length,
      pending,
      revByDay: days,
      revDelta: pctChange(curRev, prevRev),
      orderDelta: pctChange(curOrders, prevOrders),
      statusRows,
      topCategories,
      recent,
    };
  }, [orders, products]);

  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="text-gray-800">
      {/* header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: INK }}>
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">{dateLabel}</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
        >
          <svg
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-2.6-6.4" />
            <path d="M21 3v6h-6" />
          </svg>
          Refresh
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={fmtMoney(stats.revenue)}
          icon={IconRevenue}
          delta={stats.revDelta}
          loading={loading}
        />
        <StatCard
          label="Total orders"
          value={fmtNum(stats.orderCount)}
          icon={IconOrders}
          delta={stats.orderDelta}
          loading={loading}
        />
        <StatCard
          label="Products"
          value={fmtNum(stats.productCount)}
          icon={IconProducts}
          foot="in catalog"
          loading={loading}
        />
        <StatCard
          label="Pending orders"
          value={fmtNum(stats.pending)}
          icon={IconPending}
          foot="awaiting delivery"
          loading={loading}
        />
      </div>

      {/* charts row */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          title="Revenue"
          subtitle="Last 7 days"
          className="lg:col-span-2"
        >
          {loading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <RevenueChart data={stats.revByDay} />
          )}
        </Card>
        <Card title="Order status" subtitle="All time">
          {loading ? (
            <div className="flex flex-col gap-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            <BarList
              rows={stats.statusRows}
              colorFor={(i) => RAMP[i % RAMP.length]}
              empty="No orders yet"
            />
          )}
        </Card>
      </div>

      {/* bottom row */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          title="Recent orders"
          subtitle="Latest activity"
          className="lg:col-span-2"
        >
          {loading ? (
            <div className="flex flex-col gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : stats.recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No orders yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-gray-400">
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Items</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 text-right font-medium">Amount</th>
                    <th className="pb-2 text-right font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map((o, i) => {
                    const a = o.address || {};
                    return (
                      <tr
                        key={o._id || i}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-2.5 pr-2 font-medium text-gray-800">
                          {(a.firstName || "") + " " + (a.lastName || "") ||
                            "—"}
                        </td>
                        <td className="py-2.5 pr-2 text-gray-500">
                          {o.items?.length ?? 0}
                        </td>
                        <td className="py-2.5 pr-2">
                          <StatusPill status={o.status} />
                        </td>
                        <td className="py-2.5 pl-2 text-right tabular-nums font-medium text-gray-800">
                          {fmtMoney(o.amount)}
                        </td>
                        <td className="py-2.5 pl-2 text-right tabular-nums text-gray-500">
                          {o.date
                            ? new Date(o.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        <Card title="Top categories" subtitle="By product count">
          {loading ? (
            <div className="flex flex-col gap-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            <BarList rows={stats.topCategories} empty="No products yet" />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
