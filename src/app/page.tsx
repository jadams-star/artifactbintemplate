"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Treemap,
} from "recharts";
import {
  ChevronRight,
  ChevronDown,
  Users,
  Building2,
  Search,
  Filter,
  LayoutGrid,
  List,
  GitBranch,
  BarChart3,
  DollarSign,
  MapPin,
  X,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface Employee {
  id: number;
  name: string;
  title: string;
  department: string;
  businessUnit: string;
  costCenter: string;
  location: string;
  managerId: number | null;
  level: number;
  salary: number;
  fte: number;
}

interface OrgNode extends Employee {
  children: OrgNode[];
  _childCount: number;
}

// ─── Color Palette ──────────────────────────────────────────────────────────────

const BU_COLORS: Record<string, string> = {
  "Technology": "#3b82f6",
  "Sales & Marketing": "#10b981",
  "Finance": "#f59e0b",
  "Operations": "#8b5cf6",
  "Human Resources": "#ec4899",
  "Legal & Compliance": "#6366f1",
  "Product": "#14b8a6",
  "Customer Success": "#f97316",
};

const DEPT_COLORS: Record<string, string> = {
  "Engineering": "#3b82f6",
  "Infrastructure": "#2563eb",
  "Data Science": "#1d4ed8",
  "Security": "#1e40af",
  "Sales": "#10b981",
  "Marketing": "#059669",
  "Brand": "#047857",
  "Demand Gen": "#065f46",
  "Accounting": "#f59e0b",
  "FP&A": "#d97706",
  "Treasury": "#b45309",
  "Tax": "#92400e",
  "Supply Chain": "#8b5cf6",
  "Facilities": "#7c3aed",
  "Manufacturing": "#6d28d9",
  "Procurement": "#5b21b6",
  "Talent Acquisition": "#ec4899",
  "Benefits": "#db2777",
  "L&D": "#be185d",
  "HRIS": "#9d174d",
  "Corporate Law": "#6366f1",
  "Compliance": "#4f46e5",
  "Risk": "#4338ca",
  "Product Management": "#14b8a6",
  "UX Design": "#0d9488",
  "Research": "#0f766e",
  "Support": "#f97316",
  "Onboarding": "#ea580c",
  "Renewals": "#c2410c",
};

// ─── Data Generation ────────────────────────────────────────────────────────────

const BUSINESS_UNITS = [
  "Technology",
  "Sales & Marketing",
  "Finance",
  "Operations",
  "Human Resources",
  "Legal & Compliance",
  "Product",
  "Customer Success",
];

const DEPARTMENTS: Record<string, string[]> = {
  "Technology": ["Engineering", "Infrastructure", "Data Science", "Security"],
  "Sales & Marketing": ["Sales", "Marketing", "Brand", "Demand Gen"],
  "Finance": ["Accounting", "FP&A", "Treasury", "Tax"],
  "Operations": ["Supply Chain", "Facilities", "Manufacturing", "Procurement"],
  "Human Resources": ["Talent Acquisition", "Benefits", "L&D", "HRIS"],
  "Legal & Compliance": ["Corporate Law", "Compliance", "Risk"],
  "Product": ["Product Management", "UX Design", "Research"],
  "Customer Success": ["Support", "Onboarding", "Renewals"],
};

const COST_CENTERS: Record<string, string> = {
  "Engineering": "CC-1001",
  "Infrastructure": "CC-1002",
  "Data Science": "CC-1003",
  "Security": "CC-1004",
  "Sales": "CC-2001",
  "Marketing": "CC-2002",
  "Brand": "CC-2003",
  "Demand Gen": "CC-2004",
  "Accounting": "CC-3001",
  "FP&A": "CC-3002",
  "Treasury": "CC-3003",
  "Tax": "CC-3004",
  "Supply Chain": "CC-4001",
  "Facilities": "CC-4002",
  "Manufacturing": "CC-4003",
  "Procurement": "CC-4004",
  "Talent Acquisition": "CC-5001",
  "Benefits": "CC-5002",
  "L&D": "CC-5003",
  "HRIS": "CC-5004",
  "Corporate Law": "CC-6001",
  "Compliance": "CC-6002",
  "Risk": "CC-6003",
  "Product Management": "CC-7001",
  "UX Design": "CC-7002",
  "Research": "CC-7003",
  "Support": "CC-8001",
  "Onboarding": "CC-8002",
  "Renewals": "CC-8003",
};

const LOCATIONS = [
  "New York, NY",
  "San Francisco, CA",
  "Austin, TX",
  "Chicago, IL",
  "Seattle, WA",
  "Boston, MA",
  "Denver, CO",
  "Atlanta, GA",
  "Los Angeles, CA",
  "Miami, FL",
];

const FIRST_NAMES = [
  "James","Mary","Robert","Patricia","John","Jennifer","Michael","Linda",
  "David","Elizabeth","William","Barbara","Richard","Susan","Joseph","Jessica",
  "Thomas","Sarah","Charles","Karen","Christopher","Lisa","Daniel","Nancy",
  "Matthew","Betty","Anthony","Margaret","Mark","Sandra","Donald","Ashley",
  "Steven","Kimberly","Paul","Emily","Andrew","Donna","Joshua","Michelle",
  "Kenneth","Carol","Kevin","Amanda","Brian","Dorothy","George","Melissa",
  "Timothy","Deborah","Ronald","Stephanie","Edward","Rebecca","Jason","Sharon",
  "Jeffrey","Laura","Ryan","Cynthia","Jacob","Kathleen","Gary","Amy",
  "Nicholas","Angela","Eric","Shirley","Jonathan","Anna","Stephen","Brenda",
  "Larry","Pamela","Justin","Emma","Scott","Nicole","Brandon","Helen",
  "Benjamin","Samantha","Samuel","Katherine","Raymond","Christine","Gregory","Debra",
  "Frank","Rachel","Alexander","Carolyn","Patrick","Janet","Jack","Catherine",
];

const LAST_NAMES = [
  "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis",
  "Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas",
  "Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White",
  "Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young",
  "Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores",
  "Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell",
  "Carter","Roberts","Gomez","Phillips","Evans","Turner","Diaz","Parker",
  "Cruz","Edwards","Collins","Reyes","Stewart","Morris","Morales","Murphy",
  "Cook","Rogers","Gutierrez","Ortiz","Morgan","Cooper","Peterson","Bailey",
  "Reed","Kelly","Howard","Ramos","Kim","Cox","Ward","Richardson",
  "Watson","Brooks","Chavez","Wood","James","Bennett","Gray","Mendoza",
  "Ruiz","Hughes","Price","Alvarez","Castillo","Sanders","Patel","Myers",
];

const TITLES_BY_LEVEL: Record<number, string[]> = {
  0: ["Chief Executive Officer"],
  1: ["Chief Technology Officer", "Chief Marketing Officer", "Chief Financial Officer",
      "Chief Operating Officer", "Chief People Officer", "General Counsel",
      "Chief Product Officer", "Chief Customer Officer"],
  2: ["SVP", "Vice President"],
  3: ["Senior Director", "Director"],
  4: ["Senior Manager", "Manager"],
  5: ["Team Lead", "Principal"],
  6: ["Senior Analyst", "Senior Engineer", "Senior Specialist", "Senior Associate"],
  7: ["Analyst", "Engineer", "Specialist", "Associate", "Coordinator"],
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateOrgData(targetSize: number): Employee[] {
  const rand = seededRandom(42);
  const employees: Employee[] = [];
  let id = 1;

  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const makeName = () => `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;

  // CEO
  employees.push({
    id: id++,
    name: makeName(),
    title: "Chief Executive Officer",
    department: "Executive",
    businessUnit: "Executive",
    costCenter: "CC-0001",
    location: "New York, NY",
    managerId: null,
    level: 0,
    salary: 450000 + Math.floor(rand() * 100000),
    fte: 1,
  });

  // C-suite for each BU
  const cSuiteIds: Record<string, number> = {};
  BUSINESS_UNITS.forEach((bu) => {
    const emp: Employee = {
      id: id++,
      name: makeName(),
      title: TITLES_BY_LEVEL[1][BUSINESS_UNITS.indexOf(bu)] || "SVP",
      department: DEPARTMENTS[bu][0],
      businessUnit: bu,
      costCenter: COST_CENTERS[DEPARTMENTS[bu][0]] || "CC-9999",
      location: pick(LOCATIONS),
      managerId: 1,
      level: 1,
      salary: 300000 + Math.floor(rand() * 80000),
      fte: 1,
    };
    cSuiteIds[bu] = emp.id;
    employees.push(emp);
  });

  // VP per department
  const deptHeadIds: Record<string, number> = {};
  BUSINESS_UNITS.forEach((bu) => {
    DEPARTMENTS[bu].forEach((dept) => {
      const emp: Employee = {
        id: id++,
        name: makeName(),
        title: pick(TITLES_BY_LEVEL[2]),
        department: dept,
        businessUnit: bu,
        costCenter: COST_CENTERS[dept] || "CC-9999",
        location: pick(LOCATIONS),
        managerId: cSuiteIds[bu],
        level: 2,
        salary: 200000 + Math.floor(rand() * 60000),
        fte: 1,
      };
      deptHeadIds[dept] = emp.id;
      employees.push(emp);
    });
  });

  // Fill remaining with hierarchical structure
  const allDepts = Object.entries(DEPARTMENTS).flatMap(([bu, depts]) =>
    depts.map((d) => ({ bu, dept: d }))
  );

  // Distribute remaining headcount across departments
  const remaining = targetSize - employees.length;
  const perDept = Math.floor(remaining / allDepts.length);
  const extra = remaining % allDepts.length;

  allDepts.forEach(({ bu, dept }, deptIdx) => {
    const count = perDept + (deptIdx < extra ? 1 : 0);
    const managersInDept: number[] = [deptHeadIds[dept]];

    for (let i = 0; i < count; i++) {
      // Determine level based on position in sequence
      let level: number;
      if (i < 2) level = 3; // Directors
      else if (i < 6) level = 4; // Managers
      else if (i < 14) level = 5; // Leads
      else if (i < Math.floor(count * 0.5)) level = 6; // Senior ICs
      else level = 7; // ICs

      // Pick a manager from the appropriate level
      const possibleManagers = managersInDept.filter((mId) => {
        const mgr = employees.find((e) => e.id === mId);
        return mgr && mgr.level < level;
      });
      const managerId = possibleManagers.length > 0
        ? possibleManagers[Math.floor(rand() * possibleManagers.length)]
        : deptHeadIds[dept];

      const emp: Employee = {
        id: id++,
        name: makeName(),
        title: pick(TITLES_BY_LEVEL[level] || TITLES_BY_LEVEL[7]),
        department: dept,
        businessUnit: bu,
        costCenter: COST_CENTERS[dept] || "CC-9999",
        location: pick(LOCATIONS),
        managerId,
        level,
        salary: Math.floor(
          (level === 3 ? 160000 : level === 4 ? 130000 : level === 5 ? 110000 : level === 6 ? 95000 : 75000)
          + rand() * 30000
        ),
        fte: rand() > 0.9 ? 0.5 : 1,
      };
      employees.push(emp);
      if (level <= 5) managersInDept.push(emp.id);
    }
  });

  return employees;
}

function buildTree(employees: Employee[]): OrgNode {
  const map = new Map<number, OrgNode>();
  employees.forEach((e) => map.set(e.id, { ...e, children: [], _childCount: 0 }));

  let root: OrgNode | null = null;
  map.forEach((node) => {
    if (node.managerId === null) {
      root = node;
    } else {
      const parent = map.get(node.managerId);
      if (parent) parent.children.push(node);
    }
  });

  // Calculate total descendant counts
  const countDescendants = (node: OrgNode): number => {
    let count = node.children.length;
    node.children.forEach((c) => (count += countDescendants(c)));
    node._childCount = count;
    return count;
  };

  if (root) countDescendants(root);
  return root || map.values().next().value!;
}

// ─── Approach 1: Collapsible Tree (Interactive Drill-Down) ──────────────────

function TreeNode({
  node,
  depth,
  expandedIds,
  toggleExpand,
  searchTerm,
  maxVisibleDepth,
}: {
  node: OrgNode;
  depth: number;
  expandedIds: Set<number>;
  toggleExpand: (id: number) => void;
  searchTerm: string;
  maxVisibleDepth: number;
}) {
  const isExpanded = expandedIds.has(node.id);
  const hasChildren = node.children.length > 0;
  const buColor = BU_COLORS[node.businessUnit] || "#6b7280";
  const isSearchMatch =
    searchTerm &&
    (node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.department.toLowerCase().includes(searchTerm.toLowerCase()));

  if (depth > maxVisibleDepth && !isExpanded) return null;

  return (
    <div className="ml-4 md:ml-6">
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer hover:bg-slate-100 transition-colors group ${
          isSearchMatch ? "bg-yellow-50 ring-1 ring-yellow-300" : ""
        }`}
        onClick={() => hasChildren && toggleExpand(node.id)}
      >
        {hasChildren ? (
          <button className="w-5 h-5 flex items-center justify-center text-slate-400 group-hover:text-slate-600">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-5" />
        )}

        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: buColor }}
        />

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="font-medium text-sm text-slate-800 truncate">
            {node.name}
          </span>
          <span className="text-xs text-slate-500 truncate hidden sm:inline">
            {node.title}
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded-full hidden md:inline"
            style={{
              backgroundColor: `${buColor}15`,
              color: buColor,
            }}
          >
            {node.department}
          </span>
        </div>

        {hasChildren && (
          <span className="text-xs text-slate-400 flex-shrink-0">
            {node._childCount} report{node._childCount !== 1 ? "s" : ""}
          </span>
        )}

        <span className="text-xs text-slate-400 flex-shrink-0 hidden lg:inline">
          {node.costCenter}
        </span>
      </div>

      {isExpanded &&
        node.children
          .sort((a, b) => b._childCount - a._childCount)
          .map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              searchTerm={searchTerm}
              maxVisibleDepth={maxVisibleDepth}
            />
          ))}
    </div>
  );
}

function CollapsibleTreeView({
  tree,
  searchTerm,
}: {
  tree: OrgNode;
  searchTerm: string;
}) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(
    () => new Set([tree.id, ...tree.children.map((c) => c.id)])
  );
  const [maxDepth, setMaxDepth] = useState(3);

  const toggleExpand = useCallback((id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    const all = new Set<number>();
    const collect = (node: OrgNode) => {
      all.add(node.id);
      node.children.forEach(collect);
    };
    collect(tree);
    setExpandedIds(all);
  }, [tree]);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set([tree.id]));
  }, [tree]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <button
          onClick={expandAll}
          className="text-xs px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600 transition-colors"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="text-xs px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600 transition-colors"
        >
          Collapse All
        </button>
        <div className="flex items-center gap-1.5 ml-auto text-xs text-slate-500">
          <span>Max depth:</span>
          <select
            value={maxDepth}
            onChange={(e) => setMaxDepth(Number(e.target.value))}
            className="border rounded px-1.5 py-0.5 text-xs"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="border rounded-lg p-3 max-h-[600px] overflow-y-auto bg-white">
        <TreeNode
          node={tree}
          depth={0}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
          searchTerm={searchTerm}
          maxVisibleDepth={maxDepth}
        />
      </div>
    </div>
  );
}

// ─── Approach 2: Grouped Cards (Business Unit / Cost Center Grouping) ───────

function GroupedCardsView({
  employees,
  groupBy,
  searchTerm,
}: {
  employees: Employee[];
  groupBy: "businessUnit" | "department" | "costCenter" | "location";
  searchTerm: string;
}) {
  const filtered = useMemo(
    () =>
      searchTerm
        ? employees.filter(
            (e) =>
              e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
              e.costCenter.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : employees,
    [employees, searchTerm]
  );

  const groups = useMemo(() => {
    const map = new Map<string, Employee[]>();
    filtered.forEach((e) => {
      const key = e[groupBy];
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return Array.from(map.entries()).sort(
      (a, b) => b[1].length - a[1].length
    );
  }, [filtered, groupBy]);

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(groups.slice(0, 3).map(([k]) => k))
  );

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      {groups.map(([groupKey, members]) => {
        const isExpanded = expandedGroups.has(groupKey);
        const headcount = members.reduce((s, e) => s + e.fte, 0);
        const totalComp = members.reduce((s, e) => s + e.salary, 0);
        const avgComp = members.length > 0 ? totalComp / members.length : 0;
        const managers = members.filter((e) => e.level <= 4).length;
        const ics = members.length - managers;
        const color =
          groupBy === "businessUnit"
            ? BU_COLORS[groupKey] || "#6b7280"
            : DEPT_COLORS[groupKey] || "#6b7280";

        return (
          <div
            key={groupKey}
            className="border rounded-lg overflow-hidden bg-white"
          >
            <button
              onClick={() => toggleGroup(groupKey)}
              className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left"
            >
              <span
                className="w-3 h-3 rounded flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              {isExpanded ? (
                <ChevronDown size={16} className="text-slate-400" />
              ) : (
                <ChevronRight size={16} className="text-slate-400" />
              )}
              <span className="font-semibold text-sm text-slate-800 flex-1">
                {groupKey}
              </span>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Users size={12} /> {members.length} ({headcount.toFixed(1)} FTE)
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <DollarSign size={12} /> Avg ${Math.round(avgComp / 1000)}k
                </span>
                <span className="hidden md:flex items-center gap-1">
                  Mgrs: {managers} | ICs: {ics}
                </span>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t">
                {/* Summary stats bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-slate-50 text-xs">
                  <div className="flex flex-col">
                    <span className="text-slate-400">Headcount</span>
                    <span className="font-semibold text-slate-700">
                      {members.length}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400">FTE</span>
                    <span className="font-semibold text-slate-700">
                      {headcount.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400">Total Comp</span>
                    <span className="font-semibold text-slate-700">
                      ${(totalComp / 1_000_000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400">Avg Salary</span>
                    <span className="font-semibold text-slate-700">
                      ${Math.round(avgComp / 1000)}k
                    </span>
                  </div>
                </div>

                {/* Level distribution */}
                <div className="px-3 py-2 border-t">
                  <div className="flex gap-1 items-end h-8">
                    {[1, 2, 3, 4, 5, 6, 7].map((lvl) => {
                      const count = members.filter((e) => e.level === lvl).length;
                      const pct = members.length > 0 ? count / members.length : 0;
                      return (
                        <div
                          key={lvl}
                          className="flex-1 rounded-t"
                          style={{
                            height: `${Math.max(pct * 100, 2)}%`,
                            backgroundColor: `${color}${Math.round(40 + pct * 60).toString(16).padStart(2, "0")}`,
                          }}
                          title={`L${lvl}: ${count} employees`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex gap-1 text-[10px] text-slate-400 mt-0.5">
                    {[1, 2, 3, 4, 5, 6, 7].map((l) => (
                      <div key={l} className="flex-1 text-center">L{l}</div>
                    ))}
                  </div>
                </div>

                {/* Employee list (virtualized — show first 20 + "show more") */}
                <EmployeeTable employees={members} color={color} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function EmployeeTable({
  employees,
  color,
}: {
  employees: Employee[];
  color: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const sorted = useMemo(
    () => [...employees].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name)),
    [employees]
  );
  const visible = showAll ? sorted : sorted.slice(0, 20);

  return (
    <div className="border-t">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-50 text-slate-500">
            <th className="text-left px-3 py-1.5 font-medium">Name</th>
            <th className="text-left px-3 py-1.5 font-medium hidden sm:table-cell">Title</th>
            <th className="text-left px-3 py-1.5 font-medium hidden md:table-cell">Cost Center</th>
            <th className="text-left px-3 py-1.5 font-medium hidden lg:table-cell">Location</th>
            <th className="text-right px-3 py-1.5 font-medium">Lvl</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((e) => (
            <tr
              key={e.id}
              className="border-t border-slate-100 hover:bg-slate-50"
            >
              <td className="px-3 py-1.5 font-medium text-slate-700">
                {e.name}
              </td>
              <td className="px-3 py-1.5 text-slate-500 hidden sm:table-cell">
                {e.title}
              </td>
              <td className="px-3 py-1.5 text-slate-500 hidden md:table-cell">
                {e.costCenter}
              </td>
              <td className="px-3 py-1.5 text-slate-500 hidden lg:table-cell">
                {e.location}
              </td>
              <td className="px-3 py-1.5 text-right">
                <span
                  className="inline-block w-5 h-5 rounded-full text-white text-center leading-5"
                  style={{ backgroundColor: color }}
                >
                  {e.level}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!showAll && employees.length > 20 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2 text-xs text-blue-600 hover:bg-blue-50 transition-colors"
        >
          Show all {employees.length} employees
        </button>
      )}
    </div>
  );
}

// ─── Approach 3: Analytics Dashboard (Aggregate Views) ──────────────────────

function AnalyticsDashboard({ employees }: { employees: Employee[] }) {
  // Headcount by BU
  const buData = useMemo(() => {
    const map = new Map<string, { hc: number; fte: number; comp: number }>();
    employees.forEach((e) => {
      const cur = map.get(e.businessUnit) || { hc: 0, fte: 0, comp: 0 };
      cur.hc++;
      cur.fte += e.fte;
      cur.comp += e.salary;
      map.set(e.businessUnit, cur);
    });
    return Array.from(map.entries())
      .map(([name, data]) => ({
        name: name.length > 15 ? name.slice(0, 13) + "…" : name,
        fullName: name,
        Headcount: data.hc,
        FTE: parseFloat(data.fte.toFixed(1)),
        "Avg Salary ($k)": Math.round(data.comp / data.hc / 1000),
        "Total Comp ($M)": parseFloat((data.comp / 1_000_000).toFixed(1)),
      }))
      .sort((a, b) => b.Headcount - a.Headcount);
  }, [employees]);

  // Cost center summary
  const ccData = useMemo(() => {
    const map = new Map<string, { hc: number; comp: number; dept: string; bu: string }>();
    employees.forEach((e) => {
      const cur = map.get(e.costCenter) || { hc: 0, comp: 0, dept: e.department, bu: e.businessUnit };
      cur.hc++;
      cur.comp += e.salary;
      map.set(e.costCenter, cur);
    });
    return Array.from(map.entries())
      .map(([cc, data]) => ({
        costCenter: cc,
        department: data.dept,
        businessUnit: data.bu,
        headcount: data.hc,
        totalComp: data.comp,
        avgSalary: Math.round(data.comp / data.hc),
      }))
      .sort((a, b) => b.headcount - a.headcount);
  }, [employees]);

  // Location summary
  const locData = useMemo(() => {
    const map = new Map<string, number>();
    employees.forEach((e) => {
      map.set(e.location, (map.get(e.location) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [employees]);

  // Span of control
  const spanData = useMemo(() => {
    const map = new Map<number, number>();
    employees.forEach((e) => {
      if (e.managerId) {
        map.set(e.managerId, (map.get(e.managerId) || 0) + 1);
      }
    });
    const spans = Array.from(map.values());
    const avg = spans.length > 0 ? spans.reduce((s, v) => s + v, 0) / spans.length : 0;
    const max = spans.length > 0 ? Math.max(...spans) : 0;
    const buckets = new Map<string, number>();
    spans.forEach((s) => {
      const key = s <= 3 ? "1-3" : s <= 6 ? "4-6" : s <= 10 ? "7-10" : "11+";
      buckets.set(key, (buckets.get(key) || 0) + 1);
    });
    return { avg: avg.toFixed(1), max, buckets: Array.from(buckets.entries()).map(([range, count]) => ({ range, count })) };
  }, [employees]);

  // Treemap data for BU / Dept hierarchy
  const treemapData = useMemo(() => {
    return buData.map((bu) => ({
      name: bu.fullName,
      size: bu.Headcount,
      fill: BU_COLORS[bu.fullName] || "#6b7280",
    }));
  }, [buData]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Headcount", value: employees.length.toLocaleString(), icon: Users },
          { label: "Business Units", value: BUSINESS_UNITS.length, icon: Building2 },
          { label: "Avg Span of Control", value: spanData.avg, icon: GitBranch },
          {
            label: "Total Compensation",
            value: `$${(employees.reduce((s, e) => s + e.salary, 0) / 1_000_000).toFixed(1)}M`,
            icon: DollarSign,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-white border rounded-lg p-3 flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5 text-slate-400">
              <Icon size={14} />
              <span className="text-xs">{label}</span>
            </div>
            <span className="text-xl font-bold text-slate-800">{value}</span>
          </div>
        ))}
      </div>

      {/* Headcount by Business Unit */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Headcount by Business Unit
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={buData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{ fontSize: 12 }}
              formatter={(value: number, name: string) => [
                name === "Total Comp ($M)" ? `$${value}M` : value,
                name,
              ]}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Headcount" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            <Bar dataKey="FTE" fill="#93c5fd" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Treemap by BU */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Headcount Proportions (Treemap)
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            content={({ x, y, width, height, name, fill }) => {
              if (width < 40 || height < 30) return null;
              return (
                <g>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={fill as string}
                    rx={4}
                    opacity={0.85}
                  />
                  <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={width > 80 ? 11 : 9}
                    fontWeight="600"
                  >
                    {name}
                  </text>
                </g>
              );
            }}
          />
        </ResponsiveContainer>
      </div>

      {/* Cost Center Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <h3 className="text-sm font-semibold text-slate-700 p-4 pb-2">
          Cost Center Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-y">
                <th className="text-left px-3 py-2 font-medium">Cost Center</th>
                <th className="text-left px-3 py-2 font-medium">Department</th>
                <th className="text-left px-3 py-2 font-medium hidden md:table-cell">Business Unit</th>
                <th className="text-right px-3 py-2 font-medium">HC</th>
                <th className="text-right px-3 py-2 font-medium hidden sm:table-cell">Total Comp</th>
                <th className="text-right px-3 py-2 font-medium">Avg Salary</th>
              </tr>
            </thead>
            <tbody>
              {ccData.map((row) => (
                <tr key={row.costCenter} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2 font-mono font-medium text-slate-700">
                    {row.costCenter}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: DEPT_COLORS[row.department] || "#6b7280" }}
                      />
                      {row.department}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-slate-500 hidden md:table-cell">
                    {row.businessUnit}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold">{row.headcount}</td>
                  <td className="px-3 py-2 text-right text-slate-500 hidden sm:table-cell">
                    ${(row.totalComp / 1_000_000).toFixed(2)}M
                  </td>
                  <td className="px-3 py-2 text-right text-slate-500">
                    ${(row.avgSalary / 1000).toFixed(0)}k
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Location Distribution */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Location Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {locData.map(({ name, count }) => (
            <div
              key={name}
              className="flex flex-col items-center p-2 rounded-lg bg-slate-50"
            >
              <MapPin size={14} className="text-slate-400 mb-1" />
              <span className="text-sm font-bold text-slate-700">{count}</span>
              <span className="text-[10px] text-slate-500 text-center">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Span of Control Distribution */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Span of Control Distribution
        </h3>
        <div className="flex items-center gap-3 mb-2 text-xs text-slate-500">
          <span>Average: <strong className="text-slate-700">{spanData.avg}</strong></span>
          <span>Max: <strong className="text-slate-700">{spanData.max}</strong></span>
        </div>
        <div className="flex gap-2 h-20">
          {spanData.buckets.map(({ range, count }) => (
            <div key={range} className="flex-1 flex flex-col items-center justify-end">
              <div
                className="w-full bg-blue-400 rounded-t"
                style={{
                  height: `${(count / Math.max(...spanData.buckets.map((b) => b.count))) * 100}%`,
                  minHeight: 4,
                }}
              />
              <span className="text-[10px] text-slate-500 mt-1">{range}</span>
              <span className="text-[10px] font-semibold text-slate-600">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Approach 4: Visual Org Map (SVG-based mini org chart) ──────────────────

function MiniOrgMap({ tree }: { tree: OrgNode }) {
  const [selectedBU, setSelectedBU] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Build layout for the top 3 levels only
  const layout = useMemo(() => {
    const nodes: { id: number; x: number; y: number; label: string; title: string; bu: string; childCount: number; level: number }[] = [];
    const links: { x1: number; y1: number; x2: number; y2: number }[] = [];

    const yStep = 100;
    let currentId = 0;

    // Level 0 — CEO
    const ceoX = 500;
    nodes.push({
      id: tree.id,
      x: ceoX,
      y: 40,
      label: tree.name,
      title: tree.title,
      bu: tree.businessUnit,
      childCount: tree._childCount,
      level: 0,
    });

    // Level 1 — C-Suite
    const l1Children = tree.children.filter(
      (c) => !selectedBU || c.businessUnit === selectedBU
    );
    const l1Width = l1Children.length * 130;
    const l1Start = ceoX - l1Width / 2 + 65;

    l1Children.forEach((child, i) => {
      const cx = l1Start + i * 130;
      const cy = 40 + yStep;
      nodes.push({
        id: child.id,
        x: cx,
        y: cy,
        label: child.name,
        title: child.title,
        bu: child.businessUnit,
        childCount: child._childCount,
        level: 1,
      });
      links.push({ x1: ceoX, y1: 40 + 20, x2: cx, y2: cy - 20 });

      // Level 2 — VPs
      const l2Children = child.children.slice(0, 6);
      const l2Width = l2Children.length * 110;
      const l2Start = cx - l2Width / 2 + 55;

      l2Children.forEach((grandchild, j) => {
        const gx = l2Start + j * 110;
        const gy = cy + yStep;
        nodes.push({
          id: grandchild.id,
          x: gx,
          y: gy,
          label: grandchild.name,
          title: grandchild.title,
          bu: grandchild.businessUnit,
          childCount: grandchild._childCount,
          level: 2,
        });
        links.push({ x1: cx, y1: cy + 20, x2: gx, y2: gy - 20 });
      });
    });

    return { nodes, links };
  }, [tree, selectedBU]);

  const svgWidth = Math.max(
    1000,
    Math.max(...layout.nodes.map((n) => n.x)) + 120
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xs text-slate-500">Filter by BU:</span>
        <button
          onClick={() => setSelectedBU(null)}
          className={`text-xs px-2 py-1 rounded-full transition-colors ${
            selectedBU === null
              ? "bg-slate-800 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All
        </button>
        {BUSINESS_UNITS.map((bu) => (
          <button
            key={bu}
            onClick={() => setSelectedBU(bu === selectedBU ? null : bu)}
            className="text-xs px-2 py-1 rounded-full transition-colors"
            style={{
              backgroundColor: bu === selectedBU ? BU_COLORS[bu] : `${BU_COLORS[bu]}15`,
              color: bu === selectedBU ? "white" : BU_COLORS[bu],
            }}
          >
            {bu}
          </button>
        ))}
      </div>
      <div className="border rounded-lg bg-white overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} 340`}
          className="w-full"
          style={{ minWidth: 600 }}
        >
          {/* Links */}
          {layout.links.map((link, i) => (
            <path
              key={i}
              d={`M${link.x1},${link.y1} C${link.x1},${(link.y1 + link.y2) / 2} ${link.x2},${(link.y1 + link.y2) / 2} ${link.x2},${link.y2}`}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth={1.5}
            />
          ))}
          {/* Nodes */}
          {layout.nodes.map((node) => {
            const color = BU_COLORS[node.bu] || "#6b7280";
            const isLevel0 = node.level === 0;
            const w = isLevel0 ? 140 : node.level === 1 ? 120 : 100;
            const h = isLevel0 ? 44 : node.level === 1 ? 40 : 36;
            return (
              <g key={node.id}>
                <rect
                  x={node.x - w / 2}
                  y={node.y - h / 2}
                  width={w}
                  height={h}
                  rx={6}
                  fill={isLevel0 ? color : `${color}15`}
                  stroke={color}
                  strokeWidth={isLevel0 ? 0 : 1.5}
                />
                <text
                  x={node.x}
                  y={node.y - 4}
                  textAnchor="middle"
                  fill={isLevel0 ? "white" : "#334155"}
                  fontSize={node.level === 0 ? 11 : 10}
                  fontWeight="600"
                >
                  {node.label.length > 16 ? node.label.slice(0, 14) + "…" : node.label}
                </text>
                <text
                  x={node.x}
                  y={node.y + 10}
                  textAnchor="middle"
                  fill={isLevel0 ? "rgba(255,255,255,0.8)" : "#94a3b8"}
                  fontSize={8}
                >
                  {node.title.length > 20 ? node.title.slice(0, 18) + "…" : node.title}
                  {node.childCount > 0 ? ` (${node.childCount})` : ""}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-xs text-slate-400 mt-2">
        Showing top 3 levels. Use the collapsible tree view for full drill-down.
      </p>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

type ViewMode = "tree" | "grouped" | "analytics" | "orgmap";

export default function Home() {
  const employees = useMemo(() => generateOrgData(1200), []);
  const tree = useMemo(() => buildTree(employees), [employees]);

  const [view, setView] = useState<ViewMode>("analytics");
  const [searchTerm, setSearchTerm] = useState("");
  const [groupBy, setGroupBy] = useState<"businessUnit" | "department" | "costCenter" | "location">("businessUnit");

  const views: { key: ViewMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: "analytics", label: "Analytics", icon: <BarChart3 size={16} />, desc: "Aggregate dashboards, KPIs, charts" },
    { key: "tree", label: "Tree", icon: <GitBranch size={16} />, desc: "Collapsible hierarchical drill-down" },
    { key: "grouped", label: "Grouped", icon: <LayoutGrid size={16} />, desc: "Cards grouped by BU / dept / cost center" },
    { key: "orgmap", label: "Org Map", icon: <List size={16} />, desc: "Visual SVG-based org chart (top levels)" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Large Org Chart Visualization
          </h1>
          <p className="text-sm text-slate-500">
            {employees.length.toLocaleString()} employees across{" "}
            {BUSINESS_UNITS.length} business units &middot; 4 approaches to
            presenting census data at scale
          </p>
        </div>

        {/* View Selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {views.map(({ key, label, icon, desc }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                view === key
                  ? "bg-slate-800 text-white shadow-sm"
                  : "bg-white text-slate-600 border hover:bg-slate-50"
              }`}
              title={desc}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Controls */}
        {(view === "tree" || view === "grouped") && (
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search name, title, department, cost center…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-8 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {view === "grouped" && (
              <div className="flex items-center gap-1.5">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={groupBy}
                  onChange={(e) =>
                    setGroupBy(e.target.value as typeof groupBy)
                  }
                  className="text-sm border rounded-lg px-2 py-2 bg-white"
                >
                  <option value="businessUnit">Business Unit</option>
                  <option value="department">Department</option>
                  <option value="costCenter">Cost Center</option>
                  <option value="location">Location</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Approach Key */}
        <div className="bg-white border rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">
              Approach {views.findIndex((v) => v.key === view) + 1} of 4:
            </span>
            <span>{views.find((v) => v.key === view)?.desc}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {BUSINESS_UNITS.map((bu) => (
              <span
                key={bu}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${BU_COLORS[bu]}15`,
                  color: BU_COLORS[bu],
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: BU_COLORS[bu] }}
                />
                {bu}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        {view === "analytics" && <AnalyticsDashboard employees={employees} />}
        {view === "tree" && (
          <CollapsibleTreeView tree={tree} searchTerm={searchTerm} />
        )}
        {view === "grouped" && (
          <GroupedCardsView
            employees={employees}
            groupBy={groupBy}
            searchTerm={searchTerm}
          />
        )}
        {view === "orgmap" && <MiniOrgMap tree={tree} />}

        {/* Best Practices Summary */}
        <div className="mt-8 bg-white border rounded-lg p-4 md:p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Best Practices for Large Org Charts (1,000+)
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">
                1. Collapsible Tree (Approach 1)
              </h3>
              <p>
                Start collapsed at top levels; let users drill down on demand.
                This is the most natural way to navigate a hierarchy. Use
                expand/collapse toggles and set a max visible depth to prevent
                overwhelming the UI. Search highlighting helps users find
                specific people quickly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">
                2. Grouped Cards with Aggregates (Approach 2)
              </h3>
              <p>
                Group employees by business unit, department, cost center, or
                location. Show summary statistics (headcount, FTE, avg salary,
                total comp) at the group level. Use progressive disclosure —
                show top 20 employees with a &quot;show more&quot; button — to avoid
                rendering 1,000+ DOM nodes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">
                3. Analytics Dashboard (Approach 3)
              </h3>
              <p>
                For executive-level views, aggregate into charts: headcount by
                BU (bar charts), proportional treemaps, cost center tables,
                location distribution, and span-of-control histograms. This
                gives macro-level insights without individual-level complexity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">
                4. Visual Org Map (Approach 4)
              </h3>
              <p>
                SVG-based node-link diagram showing top 2-3 levels. Filter by
                business unit to focus. For full interactivity at scale,
                consider React Flow (virtualized), GoJS (Canvas-based, handles
                100K+ nodes), or d3-org-chart (collapsible D3 trees).
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t">
            <h3 className="font-semibold text-slate-700 mb-2 text-sm">
              Key Performance Strategies
            </h3>
            <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside">
              <li>
                <strong>Virtualization:</strong> Only render visible nodes (React Flow, GoJS). Critical for 1,000+ nodes.
              </li>
              <li>
                <strong>Progressive disclosure:</strong> Collapse by default, paginate employee lists (20-50 at a time).
              </li>
              <li>
                <strong>Level-of-detail rendering:</strong> Show less info at zoomed-out levels; more detail when zoomed in.
              </li>
              <li>
                <strong>Canvas/WebGL rendering:</strong> SVG struggles past ~1K visible elements; Canvas handles 10K+.
              </li>
              <li>
                <strong>Memoization:</strong> Use <code>useMemo</code>/<code>useCallback</code> to avoid recomputing layouts on every render.
              </li>
              <li>
                <strong>Split into sub-charts:</strong> Break large orgs into BU-level or dept-level sub-charts.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
