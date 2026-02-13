# ArtifactBin Template Project

Welcome to the ArtifactBin template project! This repository serves as a starting point for deploying React components created on [ArtifactBin.com](https://artifactbin.com) to Vercel.

## Overview

This template project is designed to work seamlessly with ArtifactBin.com, allowing you to quickly deploy your React components to Vercel with just a few clicks. The project structure is set up to accommodate the React component you create on ArtifactBin.com.

## Project Structure

```
/
├── app/
│   └── import { useState, useMemo, useClient } from “react”;
import {
LineChart, Line, BarChart, Bar, XAxis, YAxis,
CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from “recharts”;
import * as Papa from “papaparse”;

const C = {
dark: “#16181B”, darkSoft: “#1e2024”, darkMid: “#2a2d32”,
gray50: “#f9fafb”, gray100: “#f3f4f6”, gray200: “#e5e7eb”,
gray300: “#d1d5db”, gray400: “#9ca3af”, gray500: “#6b7280”,
gray600: “#4b5563”, gray700: “#374151”, gray800: “#1f2937”,
white: “#ffffff”,
green: “#16a34a”, greenDark: “#15803d”, greenBg: “#dcfce7”, greenBorder: “#86efac”,
red: “#dc2626”, redDark: “#b91c1c”, redBg: “#fee2e2”, redBorder: “#fca5a5”,
amber: “#d97706”, amberBg: “#fef3c7”, amberBorder: “#fcd34d”,
blue: “#3b82f6”,
};

const CHART_COLORS = [”#16181B”,”#6b7280”,”#3b82f6”,”#d97706”,”#16a34a”,”#7c3aed”,”#dc2626”,”#ec4899”];
const REV_TYPES = [“Local”,“National”,“Digital Core”,“DMS”,“PROG/SYN”,“Political”];
const TV_AD_TYPES = [“Local”,“National”];
const DIGITAL_TYPES = [“Digital Core”,“DMS”,“PROG/SYN”];
const MONTHS = [“Jan”,“Feb”,“Mar”,“Apr”,“May”,“Jun”,“Jul”,“Aug”,“Sep”,“Oct”,“Nov”,“Dec”];
const QUARTERS = [“Q1”,“Q2”,“Q3”,“Q4”];

const ROW_ORDER = [
{ type: “line”, key: “Local” },
{ type: “line”, key: “National” },
{ type: “subtotal”, key: “TV Ad Rev less Political”, sources: TV_AD_TYPES },
{ type: “line”, key: “Digital Core” },
{ type: “line”, key: “DMS” },
{ type: “line”, key: “PROG/SYN” },
{ type: “subtotal”, key: “Total Digital”, sources: DIGITAL_TYPES },
{ type: “line”, key: “Political” },
{ type: “total”, key: “TOTAL”, sources: REV_TYPES },
{ type: “subtotal”, key: “Total Ad Rev less Political”, sources: REV_TYPES.filter(function(r) { return r !== “Political”; }) },
];

function generateSampleData() {
var stations = [
{ name: “WABC”, market: “New York”, region: “Northeast” },
{ name: “KHOU”, market: “Houston”, region: “Southwest” },
{ name: “WFLA”, market: “Tampa”, region: “Southeast” },
{ name: “WGN”, market: “Chicago”, region: “Midwest” },
{ name: “KTLA”, market: “Los Angeles”, region: “West” },
{ name: “WDIV”, market: “Detroit”, region: “Midwest” },
{ name: “WSB”, market: “Atlanta”, region: “Southeast” },
{ name: “KXAS”, market: “Dallas”, region: “Southwest” },
];
var result = [];
var baseMap = { “Local”: 800, “National”: 500, “Digital Core”: 180, “DMS”: 90, “PROG/SYN”: 60, “Political”: 100 };
stations.forEach(function(s) {
MONTHS.forEach(function(m, mi) {
REV_TYPES.forEach(function(rt) {
var base = baseMap[rt] || 150;
var seasonal = 1 + 0.15 * Math.sin((mi / 11) * Math.PI);
var budget = Math.round(base * seasonal * (0.9 + Math.random() * 0.2));
var finalPY = Math.round(budget * (0.88 + Math.random() * 0.24));
var btdPY = Math.round(finalPY * (0.75 + Math.random() * 0.2));
var btd = mi < 2 ? Math.round(budget * (0.85 + Math.random() * 0.3)) : null;
var forecast = (mi >= 2 && mi < 3) ? Math.round(budget * (0.9 + Math.random() * 0.2)) : null;
result.push({
station: s.name, market: s.market, region: s.region,
month: m, monthIndex: mi, revType: rt,
budget: budget, finalPY: finalPY, btdPY: btdPY, btd: btd, forecast: forecast
});
});
});
});
return result;
}

function fmt(v) {
if (v == null) return “—”;
var a = Math.abs(v);
if (a >= 1e9) return “$” + (v / 1e9).toFixed(1) + “B”;
if (a >= 1e6) return “$” + (v / 1e6).toFixed(1) + “M”;
if (a >= 1e3) return “$” + (v / 1e3).toFixed(1) + “K”;
return “$” + v.toLocaleString();
}

function fmtFull(v) {
if (v == null) return “—”;
var a = Math.abs(v);
if (a >= 1e9) return “$” + (v / 1e9).toFixed(2) + “B”;
if (a >= 1e6) return “$” + (v / 1e6).toFixed(2) + “M”;
if (a >= 1e3) return “$” + (v / 1e3).toFixed(1) + “K”;
return “$” + v.toLocaleString();
}

function fmtPct(v) { return v == null ? “—” : (v * 100).toFixed(1) + “%”; }

function pctCalc(a, b) {
if (!b || b === 0) return null;
return ((a - b) / Math.abs(b) * 100).toFixed(1);
}

function getVarStyle(val) {
if (val == null) return { color: C.gray500, bg: “transparent”, border: “transparent”, icon: “” };
var n = parseFloat(val);
if (n >= 2) return { color: C.greenDark, bg: C.greenBg, border: C.greenBorder, icon: “▲” };
if (n <= -2) return { color: C.redDark, bg: C.redBg, border: C.redBorder, icon: “▼” };
return { color: C.amber, bg: C.amberBg, border: C.amberBorder, icon: “●” };
}

function varCell(val) {
if (val == null) return { style: { color: C.gray400 }, text: “—” };
var n = parseFloat(val);
if (n >= 2) return { style: { color: C.greenDark, fontWeight: 600 }, text: “▲ “ + val + “%” };
if (n <= -2) return { style: { color: C.redDark, fontWeight: 600 }, text: “▼ “ + val + “%” };
return { style: { color: C.amber, fontWeight: 600 }, text: “● “ + val + “%” };
}

function paceCell(val) {
if (val == null) return { style: { color: C.gray400 }, text: “—” };
var n = val * 100;
var txt = n.toFixed(1) + “%”;
var base = { padding: “4px 8px”, borderRadius: 4, fontWeight: 700 };
if (n >= 102) return { style: { …base, color: C.greenDark, background: C.greenBg }, text: “▲ “ + txt };
if (n <= 98) return { style: { …base, color: C.redDark, background: C.redBg }, text: “▼ “ + txt };
return { style: { …base, color: C.amber, background: C.amberBg, fontWeight: 600 }, text: “● “ + txt };
}

function calcMetrics(rows) {
var budget = rows.reduce(function(s, r) { return s + r.budget; }, 0);
var finalPY = rows.reduce(function(s, r) { return s + r.finalPY; }, 0);
var btdPYTotal = rows.reduce(function(s, r) { return s + r.btdPY; }, 0);
var btdRows = rows.filter(function(r) { return r.btd != null; });
var btd = btdRows.reduce(function(s, r) { return s + r.btd; }, 0);
var btdPYMatched = btdRows.reduce(function(s, r) { return s + r.btdPY; }, 0);
var pace = btdPYMatched > 0 ? btd / btdPYMatched : null;
var wf = finalPY - btdPYTotal + btd;
var wfPace = pace != null ? wf * pace : null;
return { budget: budget, finalPY: finalPY, btdPY: btdPYTotal, btd: btd, pace: pace, wf: wf, wfPace: wfPace };
}

function buildMatrixRows(filteredData) {
var byType = {};
REV_TYPES.forEach(function(rt) {
byType[rt] = calcMetrics(filteredData.filter(function(r) { return r.revType === rt; }));
});
return ROW_ORDER.map(function(row) {
if (row.type === “line”) return { …byType[row.key], label: row.key, rowType: “line” };
var combined = filteredData.filter(function(r) { return row.sources.indexOf(r.revType) >= 0; });
var m = calcMetrics(combined);
return { …m, label: row.key, rowType: row.type };
});
}

function KPICard(props) {
var vs = getVarStyle(props.variance);
var hasVar = props.variance != null;
return (
<div style={{ background: C.white, border: “1px solid “ + C.gray200, borderRadius: 10, padding: “20px 22px”, flex: 1, minWidth: 170, position: “relative”, overflow: “hidden” }}>
{hasVar && <div style={{ position: “absolute”, top: 0, left: 0, right: 0, height: 4, background: vs.border }} />}
<div style={{ fontSize: 11, color: C.gray500, textTransform: “uppercase”, letterSpacing: 0.8, marginBottom: 8, fontWeight: 500 }}>{props.label}</div>
<div style={{ fontSize: 28, fontWeight: 700, color: C.dark, marginBottom: hasVar ? 10 : 0 }}>{props.value}</div>
{props.sub && (
<div style={{ display: “inline-flex”, alignItems: “center”, gap: 6, padding: “5px 10px”, borderRadius: 6, background: vs.bg, border: “1px solid “ + vs.border }}>
<span style={{ fontSize: 11, color: vs.color }}>{vs.icon}</span>
<span style={{ fontSize: 13, fontWeight: 600, color: vs.color }}>{props.subVal}</span>
<span style={{ fontSize: 11, color: vs.color, opacity: 0.8 }}>{props.sub}</span>
</div>
)}
</div>
);
}

function HeaderBg() {
return (
<svg style={{ position: “absolute”, top: 0, left: 0, width: “100%”, height: “100%”, opacity: 0.07 }} preserveAspectRatio=“none” viewBox=“0 0 1200 100”>
<defs>
<linearGradient id="hg1" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
<stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
</linearGradient>
</defs>
{Array.from({ length: 20 }).map(function(*, i) {
return <line key={“v” + i} x1={i * 65} y1=“0” x2={i * 65 + 30} y2=“100” stroke=”#ffffff” strokeWidth=“0.5” />;
})}
{Array.from({ length: 5 }).map(function(*, i) {
return <line key={“h” + i} x1=“0” y1={i * 25} x2=“1200” y2={i * 25 + 5} stroke=”#ffffff” strokeWidth=“0.3” />;
})}
<circle cx="1050" cy="50" r="60" fill="none" stroke="#ffffff" strokeWidth="0.5" />
<circle cx="1050" cy="50" r="40" fill="none" stroke="#ffffff" strokeWidth="0.3" />
<path d="M0,80 Q300,20 600,60 Q900,100 1200,30" fill="none" stroke="url(#hg1)" strokeWidth="1" />
<path d="M0,90 Q400,40 800,70 Q1000,85 1200,50" fill="none" stroke="#ffffff" strokeWidth="0.3" />
</svg>
);
}

var thSt = { padding: “10px 12px”, textAlign: “right”, color: C.dark, fontWeight: 600, fontSize: 11, textTransform: “uppercase”, letterSpacing: 0.5, whiteSpace: “nowrap” };
var tdStyle = { padding: “10px 12px”, textAlign: “right”, fontSize: 13 };
var boxStyle = { background: C.white, border: “1px solid “ + C.gray200, borderRadius: 10, padding: 20, marginBottom: 24 };
var hdStyle = { fontSize: 14, fontWeight: 600, color: C.dark, marginBottom: 12 };

function MetricsMatrix(props) {
var mRows = props.rows;
return (
<div style={{ …boxStyle, overflowX: “auto” }}>
<div style={hdStyle}>{props.title}</div>
<table style={{ width: “100%”, borderCollapse: “collapse”, fontSize: 13 }}>
<thead>
<tr style={{ borderBottom: “2px solid “ + C.gray200, background: C.gray50 }}>
<th style={{ …thSt, textAlign: “left”, minWidth: 160 }}>Revenue Type</th>
<th style={thSt}>Budget</th>
<th style={thSt}>Final PY</th>
<th style={thSt}>BTD PY</th>
<th style={thSt}>BTD</th>
<th style={{ …thSt, borderLeft: “2px solid “ + C.gray300 }}>Pace %</th>
<th style={thSt}>Write Fwd</th>
<th style={thSt}>WF at Pace</th>
<th style={thSt}>vs Budget</th>
</tr>
</thead>
<tbody>
{mRows.map(function(r, i) {
var isSub = r.rowType === “subtotal”;
var isTotal = r.rowType === “total”;
var isAgg = isSub || isTotal;
var pc = paceCell(r.pace);
var bv = varCell(pctCalc(r.wfPace, r.budget));
var bg = isTotal ? C.gray50 : isSub ? “#f5f6f8” : C.white;
var fw = isAgg ? 700 : 400;
var fwLabel = isAgg ? 700 : 500;
var topBorder = isTotal ? “2px solid “ + C.dark : isSub ? “1px solid “ + C.gray300 : “1px solid “ + C.gray100;
return (
<tr key={i} style={{ borderTop: topBorder, borderBottom: “1px solid “ + C.gray100, background: bg }}>
<td style={{ padding: “10px 12px”, fontWeight: fwLabel, textAlign: “left”, color: isAgg ? C.dark : C.gray700 }}>{r.label}</td>
<td style={{ …tdStyle, fontWeight: fw }}>{fmtFull(r.budget)}</td>
<td style={{ …tdStyle, fontWeight: fw }}>{fmtFull(r.finalPY)}</td>
<td style={{ …tdStyle, fontWeight: fw }}>{fmtFull(r.btdPY)}</td>
<td style={{ …tdStyle, fontWeight: Math.max(fw, 600) }}>{fmtFull(r.btd)}</td>
<td style={{ …tdStyle, borderLeft: “2px solid “ + C.gray300, fontWeight: fw }}>
<span style={pc.style}>{pc.text}</span>
</td>
<td style={{ …tdStyle, fontWeight: Math.max(fw, 500) }}>{fmtFull(r.wf)}</td>
<td style={{ …tdStyle, fontWeight: 700, color: C.dark }}>{fmtFull(r.wfPace)}</td>
<td style={{ …tdStyle, …bv.style, fontWeight: isAgg ? 700 : 600 }}>{bv.text}</td>
</tr>
);
})}
</tbody>
</table>
</div>
);
}

function StationMatrix(props) {
var sData = props.data;
var totals = props.totals;
return (
<div style={{ …boxStyle, overflowX: “auto” }}>
<div style={hdStyle}>{props.title}</div>
<table style={{ width: “100%”, borderCollapse: “collapse”, fontSize: 13 }}>
<thead>
<tr style={{ borderBottom: “2px solid “ + C.gray200, background: C.gray50 }}>
<th style={{ …thSt, textAlign: “left”, minWidth: 100 }}>Station</th>
<th style={thSt}>Budget</th>
<th style={thSt}>Final PY</th>
<th style={thSt}>BTD PY</th>
<th style={thSt}>BTD</th>
<th style={{ …thSt, borderLeft: “2px solid “ + C.gray300 }}>Pace %</th>
<th style={thSt}>Write Fwd</th>
<th style={thSt}>WF at Pace</th>
<th style={thSt}>vs Budget</th>
</tr>
</thead>
<tbody>
{sData.map(function(r, i) {
var pc = paceCell(r.pace);
var bv = varCell(pctCalc(r.wfPace, r.budget));
return (
<tr key={i} style={{ borderBottom: “1px solid “ + C.gray100 }}>
<td style={{ padding: “10px 12px”, fontWeight: 500, textAlign: “left” }}>{r.station}</td>
<td style={tdStyle}>{fmtFull(r.budget)}</td>
<td style={tdStyle}>{fmtFull(r.finalPY)}</td>
<td style={tdStyle}>{fmtFull(r.btdPY)}</td>
<td style={{ …tdStyle, fontWeight: 600 }}>{fmtFull(r.btd)}</td>
<td style={{ …tdStyle, borderLeft: “2px solid “ + C.gray300 }}>
<span style={pc.style}>{pc.text}</span>
</td>
<td style={{ …tdStyle, fontWeight: 500 }}>{fmtFull(r.wf)}</td>
<td style={{ …tdStyle, fontWeight: 700, color: C.dark }}>{fmtFull(r.wfPace)}</td>
<td style={{ …tdStyle, …bv.style }}>{bv.text}</td>
</tr>
);
})}
{totals && (
<tr style={{ borderTop: “2px solid “ + C.dark, background: C.gray50 }}>
<td style={{ padding: “12px 12px”, fontWeight: 700, textAlign: “left”, color: C.dark }}>TOTAL</td>
<td style={{ …tdStyle, fontWeight: 700 }}>{fmtFull(totals.budget)}</td>
<td style={{ …tdStyle, fontWeight: 700 }}>{fmtFull(totals.finalPY)}</td>
<td style={{ …tdStyle, fontWeight: 700 }}>{fmtFull(totals.btdPY)}</td>
<td style={{ …tdStyle, fontWeight: 700 }}>{fmtFull(totals.btd)}</td>
<td style={{ …tdStyle, fontWeight: 700, borderLeft: “2px solid “ + C.gray300 }}>
<span style={paceCell(totals.pace).style}>{paceCell(totals.pace).text}</span>
</td>
<td style={{ …tdStyle, fontWeight: 700 }}>{fmtFull(totals.wf)}</td>
<td style={{ …tdStyle, fontWeight: 700 }}>{fmtFull(totals.wfPace)}</td>
<td style={{ …tdStyle, …varCell(pctCalc(totals.wfPace, totals.budget)).style, fontWeight: 700 }}>
{varCell(pctCalc(totals.wfPace, totals.budget)).text}
</td>
</tr>
)}
</tbody>
</table>
</div>
);
}

function FilterBar(props) {
var filters = props.filters;
var setFilters = props.setFilters;
var showStation = props.showStation;
var sel = { padding: “7px 12px”, borderRadius: 6, border: “1px solid “ + C.gray300, fontSize: 13, background: C.white, color: C.gray700, cursor: “pointer” };

var defs = [];
if (showStation) {
defs.push({ k: “station”, l: “Station”, o: props.stations });
}
defs.push({ k: “region”, l: “Region”, o: props.regions });
defs.push({ k: “revType”, l: “Revenue Type”, o: REV_TYPES });
defs.push({ k: “quarter”, l: “Quarter”, o: QUARTERS });

var countKeys = defs.map(function(d) { return d.k; }).concat([“variance”]);
var n = countKeys.filter(function(k) { return filters[k] !== “All”; }).length;

return (
<div style={{ display: “flex”, gap: 10, flexWrap: “wrap”, alignItems: “center”, padding: “12px 0” }}>
{defs.map(function(f) {
return (
<select key={f.k} style={sel} value={filters[f.k]} onChange={function(e) { setFilters(function(p) { return { …p, [f.k]: e.target.value }; }); }}>
<option value="All">{f.l + “: All”}</option>
{f.o.map(function(o) { return <option key={o} value={o}>{o}</option>; })}
</select>
);
})}
<select style={sel} value={filters.variance} onChange={function(e) { setFilters(function(p) { return { …p, variance: e.target.value }; }); }}>
<option value="All">Variance: All</option>
<option value="above">Above Budget</option>
<option value="below">Below Budget</option>
</select>
{n > 0 && (
<button
onClick={function() {
setFilters(function(p) {
var reset = { …p, region: “All”, revType: “All”, quarter: “All”, variance: “All” };
if (showStation) reset.station = “All”;
return reset;
});
}}
style={{ padding: “7px 14px”, borderRadius: 6, border: “none”, background: C.dark, color: C.white, fontSize: 12, cursor: “pointer”, fontWeight: 500 }}
>
{“Clear All (” + n + “)”}
</button>
)}
</div>
);
}

export default function Dashboard() {
var initData = useState(generateSampleData);
var data = initData[0];
var setData = initData[1];

var viewState = useState(“summary”);
var view = viewState[0];
var setView = viewState[1];

var filterState = useState({
station: “All”, market: “All”, region: “All”,
revType: “All”, quarter: “All”, variance: “All”
});
var filters = filterState[0];
var setFilters = filterState[1];

var importState = useState(null);
var importStep = importState[0];
var setImportStep = importState[1];

var csvState = useState(null);
var csvPreview = csvState[0];
var setCsvPreview = csvState[1];

var colMapState = useState({});
var colMap = colMapState[0];
var setColMap = colMapState[1];

var revTypeMapState = useState({});
var revTypeMap = revTypeMapState[0];
var setRevTypeMap = revTypeMapState[1];

var detailState = useState(null);
var detailStation = detailState[0];
var setDetailStation = detailState[1];

var compState = useState([]);
var compareStations = compState[0];
var setCompareStations = compState[1];

var stations = useMemo(function() {
return Array.from(new Set(data.map(function(d) { return d.station; }))).sort();
}, [data]);

var markets = useMemo(function() {
return Array.from(new Set(data.map(function(d) { return d.market; }))).sort();
}, [data]);

var regions = useMemo(function() {
return Array.from(new Set(data.map(function(d) { return d.region; }))).sort();
}, [data]);

var filtered = useMemo(function() {
var d = data;
if (filters.market !== “All”) d = d.filter(function(r) { return r.market === filters.market; });
if (filters.station !== “All”) d = d.filter(function(r) { return r.station === filters.station; });
if (filters.region !== “All”) d = d.filter(function(r) { return r.region === filters.region; });
if (filters.revType !== “All”) d = d.filter(function(r) { return r.revType === filters.revType; });
if (filters.quarter !== “All”) {
var qi = QUARTERS.indexOf(filters.quarter);
d = d.filter(function(r) { return Math.floor(r.monthIndex / 3) === qi; });
}
if (filters.variance !== “All”) {
d = d.filter(function(r) {
if (r.btd == null) return false;
var v = r.btd - r.budget;
return filters.variance === “above” ? v >= 0 : v < 0;
});
}
return d;
}, [data, filters]);

var filteredStations = useMemo(function() {
return Array.from(new Set(filtered.map(function(d) { return d.station; }))).sort();
}, [filtered]);

var matrixRows = useMemo(function() { return buildMatrixRows(filtered); }, [filtered]);
var totalRow = matrixRows.find(function(r) { return r.label === “TOTAL”; }) || { budget: 0, btd: 0, btdPY: 0, finalPY: 0, pace: null, wf: 0, wfPace: null };

var monthlyTrend = useMemo(function() {
return MONTHS.map(function(m, i) {
var rows = filtered.filter(function(r) { return r.monthIndex === i; });
var btdS = rows.reduce(function(s, r) { return s + (r.btd || 0); }, 0);
var fcstS = rows.reduce(function(s, r) { return s + (r.forecast || 0); }, 0);
return {
month: m,
Budget: rows.reduce(function(s, r) { return s + r.budget; }, 0),
BTD: btdS > 0 ? btdS : null,
Forecast: fcstS > 0 ? fcstS : null,
FinalPY: rows.reduce(function(s, r) { return s + r.finalPY; }, 0),
};
});
}, [filtered]);

var stationMetrics = useMemo(function() {
return filteredStations.map(function(st) {
var rows = filtered.filter(function(r) { return r.station === st; });
return { station: st, …calcMetrics(rows) };
});
}, [filtered, filteredStations]);

var stationTotals = useMemo(function() { return calcMetrics(filtered); }, [filtered]);

var showStationFilter = view === “station” || view === “forecast” || view === “compare”;

function handleFile(e) {
var f = e.target.files[0];
if (!f) return;
Papa.parse(f, {
header: true, dynamicTyping: true, skipEmptyLines: true,
complete: function(r) {
setCsvPreview({ headers: Object.keys(r.data[0] || {}), rows: r.data.slice(0, 5), all: r.data });
setColMap({});
setImportStep(“map”);
}
});
}

function applyImport() {
var req = [“station”, “month”, “revType”, “btd”];
if (!req.every(function(k) { return colMap[k]; })) {
alert(“Please map Station, Month, Revenue Type, and BTD columns.”);
return;
}
// Check all rev types are mapped
var sourceTypes = Array.from(new Set(csvPreview.all.map(function(row) { return String(row[colMap.revType] || “”).trim(); }).filter(Boolean)));
var unmapped = sourceTypes.filter(function(st) { return !revTypeMap[st]; });
if (unmapped.length > 0) {
alert(“Please map all revenue types before importing.”);
return;
}
var nd = data.slice();
csvPreview.all.forEach(function(row) {
var st = String(row[colMap.station] || “”).trim();
var mo = String(row[colMap.month] || “”).trim();
var rawRt = String(row[colMap.revType] || “”).trim();
var rt = revTypeMap[rawRt] || rawRt;
if (rt === “_skip”) return;
var val = parseFloat(row[colMap.btd]);
if (!st || !mo || !rt || isNaN(val)) return;
var mi = MONTHS.indexOf(mo.slice(0, 3));
var ex = nd.find(function(d) { return d.station === st && d.month === mo.slice(0, 3) && d.revType === rt; });
if (ex) {
ex.btd = val;
if (colMap.budget && row[colMap.budget]) ex.budget = parseFloat(row[colMap.budget]);
if (colMap.finalPY && row[colMap.finalPY]) ex.finalPY = parseFloat(row[colMap.finalPY]);
if (colMap.btdPY && row[colMap.btdPY]) ex.btdPY = parseFloat(row[colMap.btdPY]);
if (colMap.market && row[colMap.market]) ex.market = row[colMap.market];
if (colMap.region && row[colMap.region]) ex.region = row[colMap.region];
} else {
nd.push({
station: st, market: colMap.market ? (row[colMap.market] || “”) : “”,
region: colMap.region ? (row[colMap.region] || “”) : “”,
month: mo.slice(0, 3), monthIndex: mi >= 0 ? mi : 0, revType: rt,
budget: colMap.budget ? (parseFloat(row[colMap.budget]) || 0) : 0,
finalPY: colMap.finalPY ? (parseFloat(row[colMap.finalPY]) || 0) : 0,
btdPY: colMap.btdPY ? (parseFloat(row[colMap.btdPY]) || 0) : 0,
btd: val, forecast: null
});
}
});
setData(nd);
setImportStep(null);
setCsvPreview(null);
setRevTypeMap({});
}

function goToRevTypeMapping() {
var req = [“station”, “month”, “revType”, “btd”];
if (!req.every(function(k) { return colMap[k]; })) {
alert(“Please map Station, Month, Revenue Type, and BTD columns.”);
return;
}
// Extract unique revenue type values from data
var sourceTypes = Array.from(new Set(
csvPreview.all.map(function(row) { return String(row[colMap.revType] || “”).trim(); }).filter(Boolean)
)).sort();
// Auto-map exact matches
var autoMap = {};
sourceTypes.forEach(function(st) {
var match = REV_TYPES.find(function(rt) { return rt.toLowerCase() === st.toLowerCase(); });
if (match) autoMap[st] = match;
});
setRevTypeMap(autoMap);
setImportStep(“mapRevTypes”);
}

function updateFcst(st, mo, rt, val) {
setData(function(p) {
return p.map(function(r) {
if (r.station === st && r.month === mo && r.revType === rt) {
return { …r, forecast: val === “” ? null : (parseFloat(val) || 0) };
}
return r;
});
});
}

function exportCSV() {
var rows = filtered.map(function(r) {
var pace = (r.btdPY > 0 && r.btd != null) ? r.btd / r.btdPY : null;
var wf = (r.finalPY || 0) - (r.btdPY || 0) + (r.btd || 0);
return {
Station: r.station, Market: r.market, Region: r.region,
Month: r.month, RevenueType: r.revType, Budget: r.budget,
FinalPY: r.finalPY, BTDPY: r.btdPY, BTD: r.btd != null ? r.btd : “”,
WriteForward: wf,
PacePct: pace != null ? (pace * 100).toFixed(1) + “%” : “”,
WFAtPace: pace != null ? Math.round(wf * pace) : “”,
Forecast: r.forecast != null ? r.forecast : “”
};
});
var csv = Papa.unparse(rows);
var blob = new Blob([csv], { type: “text/csv” });
var url = URL.createObjectURL(blob);
var a = document.createElement(“a”);
a.href = url;
a.download = “revenue_forecast_export.csv”;
a.click();
URL.revokeObjectURL(url);
}

var tabs = [
{ id: “summary”, l: “Summary” },
{ id: “station”, l: “Station Detail” },
{ id: “revtype”, l: “Revenue Type” },
{ id: “forecast”, l: “Forecast Entry” },
{ id: “compare”, l: “Comparison” },
];

function tabStyle(active) {
return {
padding: “12px 20px”, cursor: “pointer”, fontSize: 13,
fontWeight: active ? 600 : 400,
color: active ? C.dark : C.gray500,
borderBottom: active ? “2px solid “ + C.dark : “2px solid transparent”,
background: “none”, border: “none”, borderBottomStyle: “solid”,
letterSpacing: 0.3,
};
}

var btn1 = { padding: “9px 18px”, borderRadius: 6, border: “none”, background: C.white, color: C.dark, fontSize: 13, cursor: “pointer”, fontWeight: 600 };
var btn2 = { …btn1, background: C.gray100, color: C.dark, border: “1px solid “ + C.gray300 };
var mktSel = { padding: “7px 14px”, borderRadius: 6, border: “1px solid rgba(255,255,255,0.15)”, fontSize: 13, background: “rgba(255,255,255,0.08)”, color: C.white, cursor: “pointer”, fontWeight: 500 };

var selectedMarketLabel = filters.market === “All” ? “All Markets” : filters.market;

function renderSummary() {
var k = totalRow;
return (
<div>
<div style={{ display: “flex”, gap: 16, flexWrap: “wrap”, marginBottom: 24 }}>
<KPICard label="Annual Budget" value={fmt(k.budget)} />
<KPICard label=“BTD Revenue” value={fmt(k.btd)} sub=“vs BTD PY” subVal={pctCalc(k.btd, k.btdPY) + “%”} variance={pctCalc(k.btd, k.btdPY)} />
<KPICard label=“Write Forward” value={fmt(k.wf)} sub=“vs Budget” subVal={pctCalc(k.wf, k.budget) + “%”} variance={pctCalc(k.wf, k.budget)} />
<KPICard label=“Pace %” value={k.pace != null ? fmtPct(k.pace) : “—”} sub={k.pace != null ? “YoY” : null} subVal={k.pace != null ? (k.pace >= 1 ? “Ahead” : “Behind”) : null} variance={k.pace != null ? ((k.pace - 1) * 100).toFixed(1) : null} />
<KPICard label=“WF at Pace” value={fmt(k.wfPace)} sub=“vs Budget” subVal={pctCalc(k.wfPace, k.budget) + “%”} variance={pctCalc(k.wfPace, k.budget)} />
</div>
<div style={boxStyle}>
<div style={hdStyle}>Monthly Revenue Trend</div>
<ResponsiveContainer width="100%" height={300}>
<LineChart data={monthlyTrend}>
<CartesianGrid strokeDasharray="3 3" stroke={C.gray200} />
<XAxis dataKey=“month” tick={{ fontSize: 12 }} />
<YAxis tick={{ fontSize: 12 }} tickFormatter={function(v) { return “$” + (v / 1000).toFixed(0) + “K”; }} />
<Tooltip formatter={function(v) { return fmtFull(v); }} />
<Legend />
<Line type="monotone" dataKey="Budget" stroke={C.gray400} strokeDasharray="5 5" strokeWidth={2} dot={false} />
<Line type="monotone" dataKey="FinalPY" stroke={C.blue} strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
<Line type=“monotone” dataKey=“BTD” stroke={C.dark} strokeWidth={2.5} dot={{ r: 3 }} connectNulls={false} />
<Line type=“monotone” dataKey=“Forecast” stroke={C.green} strokeWidth={2} strokeDasharray=“4 4” dot={{ r: 3 }} connectNulls={false} />
</LineChart>
</ResponsiveContainer>
</div>
<MetricsMatrix title="Performance by Revenue Type" rows={matrixRows} />
<StationMatrix title="Performance by Station" data={stationMetrics} totals={stationTotals} />
</div>
);
}

function renderStation() {
var st = detailStation || filteredStations[0] || “”;
var sd = filtered.filter(function(r) { return r.station === st; });
var mo = MONTHS.map(function(m, i) {
var rows = sd.filter(function(r) { return r.monthIndex === i; });
var btdS = rows.reduce(function(s, r) { return s + (r.btd || 0); }, 0);
var fcstS = rows.reduce(function(s, r) { return s + (r.forecast || 0); }, 0);
return { month: m, Budget: rows.reduce(function(s, r) { return s + r.budget; }, 0), BTD: btdS > 0 ? btdS : null, FinalPY: rows.reduce(function(s, r) { return s + r.finalPY; }, 0), Forecast: fcstS > 0 ? fcstS : null };
});
var stRows = buildMatrixRows(sd);
var stTotal = stRows.find(function(r) { return r.label === “TOTAL”; }) || {};
return (
<div>
<div style={{ display: “flex”, gap: 16, flexWrap: “wrap”, marginBottom: 24 }}>
<KPICard label="Budget" value={fmt(stTotal.budget)} />
<KPICard label=“BTD” value={fmt(stTotal.btd)} sub=“vs BTD PY” subVal={pctCalc(stTotal.btd, stTotal.btdPY) + “%”} variance={pctCalc(stTotal.btd, stTotal.btdPY)} />
<KPICard label=“Pace %” value={stTotal.pace != null ? fmtPct(stTotal.pace) : “—”} variance={stTotal.pace != null ? ((stTotal.pace - 1) * 100).toFixed(1) : null} />
<KPICard label=“WF at Pace” value={fmt(stTotal.wfPace)} sub=“vs Budget” subVal={pctCalc(stTotal.wfPace, stTotal.budget) + “%”} variance={pctCalc(stTotal.wfPace, stTotal.budget)} />
</div>
<div style={boxStyle}>
<div style={hdStyle}>{st + “ — Monthly Trend”}</div>
<ResponsiveContainer width="100%" height={280}>
<LineChart data={mo}>
<CartesianGrid strokeDasharray="3 3" stroke={C.gray200} />
<XAxis dataKey=“month” tick={{ fontSize: 12 }} />
<YAxis tick={{ fontSize: 12 }} tickFormatter={function(v) { return “$” + (v / 1000).toFixed(0) + “K”; }} />
<Tooltip formatter={function(v) { return fmtFull(v); }} />
<Legend />
<Line type="monotone" dataKey="Budget" stroke={C.gray400} strokeDasharray="5 5" strokeWidth={2} dot={false} />
<Line type="monotone" dataKey="FinalPY" stroke={C.blue} strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
<Line type=“monotone” dataKey=“BTD” stroke={C.dark} strokeWidth={2.5} dot={{ r: 3 }} connectNulls={false} />
<Line type=“monotone” dataKey=“Forecast” stroke={C.green} strokeWidth={2} strokeDasharray=“4 4” dot={{ r: 3 }} connectNulls={false} />
</LineChart>
</ResponsiveContainer>
</div>
<MetricsMatrix title={st + “ — Performance by Revenue Type”} rows={stRows} />
</div>
);
}

function renderRevType() {
var chartData = matrixRows.filter(function(r) { return r.rowType === “line”; });
return (
<div>
<div style={boxStyle}>
<div style={hdStyle}>Revenue Type Comparison — BTD vs Budget vs Final PY</div>
<ResponsiveContainer width="100%" height={320}>
<BarChart data={chartData} barCategoryGap="25%">
<CartesianGrid strokeDasharray="3 3" stroke={C.gray200} />
<XAxis dataKey=“label” tick={{ fontSize: 11 }} />
<YAxis tick={{ fontSize: 12 }} tickFormatter={function(v) { return “$” + (v / 1000).toFixed(0) + “K”; }} />
<Tooltip formatter={function(v) { return fmtFull(v); }} />
<Legend />
<Bar dataKey="budget" name="Budget" fill={C.gray300} radius={[4,4,0,0]} />
<Bar dataKey="finalPY" name="Final PY" fill={C.blue} radius={[4,4,0,0]} />
<Bar dataKey="btd" name="BTD" fill={C.dark} radius={[4,4,0,0]} />
<Bar dataKey="wfPace" name="WF at Pace" fill={C.green} radius={[4,4,0,0]} />
</BarChart>
</ResponsiveContainer>
</div>
<MetricsMatrix title="Full Metrics by Revenue Type" rows={matrixRows} />
</div>
);
}

function renderForecast() {
var fSt = filters.station !== “All” ? filters.station : filteredStations[0] || “”;
var qi = filters.quarter !== “All” ? QUARTERS.indexOf(filters.quarter) : 0;
var qm = MONTHS.slice(qi * 3, qi * 3 + 3);
var rows = data.filter(function(r) {
var mktMatch = filters.market === “All” || r.market === filters.market;
return r.station === fSt && qm.indexOf(r.month) >= 0 && mktMatch;
});
var g = {};
rows.forEach(function(r) { if (!g[r.revType]) g[r.revType] = {}; g[r.revType][r.month] = r; });
return (
<div>
<div style={{ display: “flex”, gap: 12, alignItems: “center”, marginBottom: 16, flexWrap: “wrap” }}>
<span style={{ fontSize: 12, color: C.gray500, fontStyle: “italic” }}>Edit forecast values in the table below</span>
</div>
<div style={{ …boxStyle, overflowX: “auto” }}>
<table style={{ width: “100%”, borderCollapse: “collapse”, fontSize: 13 }}>
<thead>
<tr style={{ borderBottom: “2px solid “ + C.gray200, background: C.gray50 }}>
<th style={{ …thSt, textAlign: “left” }}>Revenue Type</th>
{qm.map(function(m) { return <th key={m} colSpan={3} style={{ …thSt, textAlign: “center”, borderLeft: “1px solid “ + C.gray200 }}>{m}</th>; })}
<th style={{ …thSt, borderLeft: “1px solid “ + C.gray200 }}>Q Total</th>
</tr>
<tr style={{ borderBottom: “1px solid “ + C.gray200, background: C.gray50 }}>
<th />
{qm.map(function(m) {
return [“Budget”, “BTD”, “Forecast”].map(function(t) {
return <th key={m + “-” + t} style={{ padding: “4px 8px”, fontSize: 11, color: C.gray500, textAlign: “right”, fontWeight: 400, borderLeft: t === “Budget” ? “1px solid “ + C.gray200 : “none” }}>{t}</th>;
});
})}
<th style={{ borderLeft: “1px solid “ + C.gray200 }} />
</tr>
</thead>
<tbody>
{REV_TYPES.map(function(rt) {
var qt = 0;
return (
<tr key={rt} style={{ borderBottom: “1px solid “ + C.gray100 }}>
<td style={{ padding: “10px 12px”, fontWeight: 500, textAlign: “left” }}>{rt}</td>
{qm.map(function(m) {
var r = g[rt] ? g[rt][m] : null;
var fv = r ? (r.forecast != null ? r.forecast : “”) : “”;
var av = r ? r.btd : null;
var bv = av != null ? av : (fv !== “” ? (parseFloat(fv) || 0) : 0);
qt += bv || 0;
var bg = (r && r.forecast != null) ? (r.forecast >= r.budget ? C.greenBg : C.redBg) : C.white;
return [
<td key={m + “-b”} style={{ padding: “6px 8px”, textAlign: “right”, color: C.gray500, borderLeft: “1px solid “ + C.gray200 }}>{fmtFull(r ? r.budget : null)}</td>,
<td key={m + “-a”} style={{ padding: “6px 8px”, textAlign: “right”, fontWeight: 500 }}>{av != null ? fmtFull(av) : “—”}</td>,
<td key={m + “-f”} style={{ padding: “4px 4px” }}>
<input type=“number” value={fv} placeholder=”—”
onChange={function(e) { updateFcst(fSt, m, rt, e.target.value); }}
style={{ width: 76, padding: “5px 6px”, border: “1px solid “ + C.gray300, borderRadius: 4, fontSize: 13, textAlign: “right”, background: bg }}
/>
</td>
];
})}
<td style={{ padding: “10px 12px”, textAlign: “right”, fontWeight: 700, borderLeft: “1px solid “ + C.gray200, color: C.dark }}>{fmtFull(qt)}</td>
</tr>
);
})}
</tbody>
</table>
</div>
</div>
);
}

function renderCompare() {
var sel = compareStations.length >= 2 ? compareStations : filteredStations.slice(0, 3);
return (
<div>
<div style={{ marginBottom: 16, display: “flex”, gap: 8, flexWrap: “wrap”, alignItems: “center” }}>
<span style={{ fontSize: 13, color: C.gray500 }}>Select stations:</span>
{filteredStations.map(function(st) {
var isOn = sel.indexOf(st) >= 0;
return (
<button key={st}
onClick={function() {
setCompareStations(function(p) {
return p.indexOf(st) >= 0 ? p.filter(function(s) { return s !== st; }) : p.concat(st).slice(-5);
});
}}
style={{
padding: “5px 12px”, borderRadius: 20,
border: “1px solid “ + (isOn ? C.dark : C.gray300),
background: isOn ? C.dark : C.white,
color: isOn ? C.white : C.gray500,
fontSize: 12, cursor: “pointer”, fontWeight: isOn ? 600 : 400,
}}
>{st}</button>
);
})}
</div>
<StationMatrix title=“Station Comparison — Full Metrics” data={stationMetrics.filter(function(r) { return sel.indexOf(r.station) >= 0; })} />
</div>
);
}

function renderImport() {
var mapFields = [
{ k: “station”, l: “Station *” }, { k: “month”, l: “Month *” },
{ k: “revType”, l: “Revenue Type *” }, { k: “btd”, l: “BTD *” },
{ k: “budget”, l: “Budget” }, { k: “finalPY”, l: “Final PY” },
{ k: “btdPY”, l: “BTD PY” }, { k: “market”, l: “Market” }, { k: “region”, l: “Region” },
];
return (
<div style={{ position: “fixed”, top: 0, left: 0, right: 0, bottom: 0, background: “rgba(22,24,27,0.6)”, display: “flex”, alignItems: “center”, justifyContent: “center”, zIndex: 1000 }}>
<div style={{ background: C.white, borderRadius: 12, padding: 28, maxWidth: 640, width: “90%”, maxHeight: “80vh”, overflow: “auto”, boxShadow: “0 20px 60px rgba(0,0,0,0.2)” }}>
{importStep === “upload” && (
<div>
<h3 style={{ margin: “0 0 8px”, color: C.dark, fontSize: 18 }}>Import Revenue Data</h3>
<p style={{ fontSize: 13, color: C.gray500, margin: “0 0 20px” }}>Upload a CSV file. Expected columns: Station, Month, Revenue Type, BTD, and optionally Budget, Final PY, BTD PY, Market, Region.</p>
<div style={{ border: “2px dashed “ + C.gray300, borderRadius: 8, padding: 40, textAlign: “center”, cursor: “pointer”, background: C.gray50 }}
onClick={function() { document.getElementById(“fileInput”).click(); }}>
<div style={{ fontSize: 14, color: C.gray600, fontWeight: 500 }}>Click to select a file or drag and drop</div>
<div style={{ fontSize: 12, color: C.gray400, marginTop: 4 }}>CSV files supported</div>
<input id=“fileInput” type=“file” accept=”.csv,.xlsx,.xls” style={{ display: “none” }} onChange={handleFile} />
</div>
<div style={{ display: “flex”, justifyContent: “flex-end”, marginTop: 20 }}>
<button onClick={function() { setImportStep(null); }} style={btn2}>Cancel</button>
</div>
</div>
)}
{importStep === “map” && csvPreview && (
<div>
<h3 style={{ margin: “0 0 8px”, color: C.dark, fontSize: 18 }}>Map Columns</h3>
<p style={{ fontSize: 13, color: C.gray500, margin: “0 0 20px” }}>Map your file columns to the expected fields.</p>
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr”, gap: 12, marginBottom: 20 }}>
{mapFields.map(function(f) {
return (
<div key={f.k}>
<div style={{ fontSize: 12, color: C.gray500, marginBottom: 4, fontWeight: 500 }}>{f.l}</div>
<select value={colMap[f.k] || “”}
onChange={function(e) { setColMap(function(p) { return { …p, [f.k]: e.target.value }; }); }}
style={{ width: “100%”, padding: “7px 10px”, borderRadius: 4, border: “1px solid “ + C.gray300, fontSize: 13 }}>
<option value="">Select column…</option>
{csvPreview.headers.map(function(h) { return <option key={h} value={h}>{h}</option>; })}
</select>
</div>
);
})}
</div>
<div style={{ fontSize: 12, color: C.gray500, marginBottom: 8, fontWeight: 500 }}>{“Preview (” + csvPreview.all.length + “ rows total)”}</div>
<div style={{ overflowX: “auto”, marginBottom: 20, border: “1px solid “ + C.gray200, borderRadius: 6 }}>
<table style={{ borderCollapse: “collapse”, fontSize: 11, width: “100%” }}>
<thead>
<tr style={{ background: C.gray50 }}>
{csvPreview.headers.map(function(h) { return <th key={h} style={{ padding: “6px 8px”, borderBottom: “1px solid “ + C.gray200, textAlign: “left”, whiteSpace: “nowrap” }}>{h}</th>; })}
</tr>
</thead>
<tbody>
{csvPreview.rows.map(function(r, i) {
return <tr key={i}>{csvPreview.headers.map(function(h) { return <td key={h} style={{ padding: “5px 8px”, borderBottom: “1px solid “ + C.gray100 }}>{r[h]}</td>; })}</tr>;
})}
</tbody>
</table>
</div>
<div style={{ display: “flex”, justifyContent: “flex-end”, gap: 8 }}>
<button onClick={function() { setImportStep(“upload”); setCsvPreview(null); }} style={btn2}>Back</button>
<button onClick={goToRevTypeMapping} style={{ …btn1, background: C.dark, color: C.white }}>Next: Map Revenue Types</button>
</div>
</div>
)}
{importStep === “mapRevTypes” && csvPreview && (function() {
var sourceTypes = Array.from(new Set(
csvPreview.all.map(function(row) { return String(row[colMap.revType] || “”).trim(); }).filter(Boolean)
)).sort();
var allMapped = sourceTypes.every(function(st) { return revTypeMap[st]; });
return (
<div>
<h3 style={{ margin: “0 0 8px”, color: C.dark, fontSize: 18 }}>Map Revenue Types</h3>
<p style={{ fontSize: 13, color: C.gray500, margin: “0 0 20px” }}>
Map each revenue type from your file to a dashboard category. Use “Skip” to exclude a type.
</p>
<div style={{ display: “flex”, flexDirection: “column”, gap: 10, marginBottom: 20 }}>
{sourceTypes.map(function(st) {
var currentVal = revTypeMap[st] || “”;
var isMatch = REV_TYPES.indexOf(currentVal) >= 0;
var isSkip = currentVal === “_skip”;
return (
<div key={st} style={{ display: “flex”, alignItems: “center”, gap: 12, padding: “8px 12px”, background: isMatch ? C.greenBg : isSkip ? C.gray100 : C.redBg, borderRadius: 6, border: “1px solid “ + (isMatch ? C.greenBorder : isSkip ? C.gray300 : C.redBorder) }}>
<div style={{ flex: 1, fontWeight: 500, fontSize: 13, color: C.dark }}>{st}</div>
<div style={{ fontSize: 13, color: C.gray400, marginRight: 4 }}>→</div>
<select
value={currentVal}
onChange={function(e) { setRevTypeMap(function(p) { return { …p, [st]: e.target.value }; }); }}
style={{ padding: “6px 10px”, borderRadius: 4, border: “1px solid “ + C.gray300, fontSize: 13, minWidth: 160 }}
>
<option value="">Select mapping…</option>
{REV_TYPES.map(function(rt) { return <option key={rt} value={rt}>{rt}</option>; })}
<option value="_skip">— Skip (exclude) —</option>
</select>
</div>
);
})}
</div>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center” }}>
<div style={{ fontSize: 12, color: allMapped ? C.greenDark : C.red }}>
{allMapped ? “✓ All revenue types mapped” : “Map all revenue types to continue”}
</div>
<div style={{ display: “flex”, gap: 8 }}>
<button onClick={function() { setImportStep(“map”); }} style={btn2}>Back</button>
<button
onClick={allMapped ? applyImport : undefined}
style={{ …btn1, background: allMapped ? C.dark : C.gray300, color: C.white, cursor: allMapped ? “pointer” : “not-allowed” }}
>Import Data</button>
</div>
</div>
</div>
);
})()}
</div>
</div>
);
}

return (
<div style={{ fontFamily: ‘-apple-system, BlinkMacSystemFont, “Segoe UI”, Roboto, sans-serif’, background: C.gray50, minHeight: “100vh”, color: C.gray700 }}>
{/* Header with Market selector */}
<div style={{
background: “linear-gradient(135deg, “ + C.dark + “ 0%, “ + C.darkSoft + “ 40%, “ + C.darkMid + “ 100%)”,
padding: “20px 24px”, display: “flex”, justifyContent: “space-between”, alignItems: “center”,
position: “relative”, overflow: “hidden”
}}>
<HeaderBg />
<div style={{ position: “relative”, zIndex: 1, display: “flex”, alignItems: “center”, gap: 20 }}>
<div>
<div style={{ color: C.white, fontSize: 20, fontWeight: 700, letterSpacing: 0.5 }}>Revenue Performance & Forecast</div>
<div style={{ color: C.gray400, fontSize: 12, marginTop: 3, letterSpacing: 0.3 }}>Nexstar Media Group — Operational Dashboard</div>
</div>
<div style={{ width: 1, height: 32, background: “rgba(255,255,255,0.15)” }} />
<select
value={filters.market}
onChange={function(e) { setFilters(function(p) { return { …p, market: e.target.value }; }); }}
style={mktSel}
>
<option value=“All” style={{ color: C.dark }}>All Markets</option>
{markets.map(function(m) { return <option key={m} value={m} style={{ color: C.dark }}>{m}</option>; })}
</select>
</div>
<div style={{ display: “flex”, gap: 8, position: “relative”, zIndex: 1 }}>
<button onClick={function() { setImportStep(“upload”); }} style={btn1}>Import Data</button>
<button onClick={exportCSV} style={{ …btn1, background: “transparent”, border: “1px solid rgba(255,255,255,0.2)”, color: C.gray400 }}>Export CSV</button>
</div>
</div>

```
  {/* Tabs */}
  <div style={{ padding: "0 24px", background: C.white, borderBottom: "1px solid " + C.gray200 }}>
    <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
      {tabs.map(function(t) {
        return <button key={t.id} onClick={function() { setView(t.id); }} style={tabStyle(view === t.id)}>{t.l}</button>;
      })}
    </div>
  </div>

  {/* Filters */}
  <div style={{ padding: "0 24px" }}>
    <FilterBar
      filters={filters}
      setFilters={setFilters}
      stations={filteredStations}
      regions={regions}
      showStation={showStationFilter}
    />
  </div>

  {/* Content */}
  <div style={{ padding: "0 24px 24px" }}>
    {view === "summary" && renderSummary()}
    {view === "station" && renderStation()}
    {view === "revtype" && renderRevType()}
    {view === "forecast" && renderForecast()}
    {view === "compare" && renderCompare()}
  </div>

  {importStep && renderImport()}
</div>
```

);
}    # Your React component will be placed here
├── public/
│   └── ...         # Static assets
├── .gitignore
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

# Usage

1. Clone this repository or use it as a template.
2. Replace the content in src/app/page.tsx with your React component from ArtifactBin.
3. Deploy to Vercel using the button above.

For more detailed instructions, visit [ArtifactBin.com](https://artifactbin.com).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/)

## Customization

After deployment, you can further customize your project by cloning it from Vercel and making additional changes. Some ideas for customization:

- Add more pages or components
- Customize the layout in `app/layout.tsx`
- Add global styles in `app/globals.css`
- Configure Next.js options in `next.config.js`

## Requirements

This template project uses:

- [Next.js 14](https://nextjs.org/)
- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)

## Local Development

If you want to run this project locally:

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contributing

We welcome contributions to improve this template project! Please feel free to submit issues or pull requests.

## Support

If you encounter any problems or have questions, please file an issue on the [ArtifactBin GitHub repository](https://github.com/artifactbin/template-project/issues) or contact support@artifactbin.com.

## License

This template project is released under the MIT License. See the [LICENSE](LICENSE) file for details.
