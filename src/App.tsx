import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Minus, Square, X, Plus, RefreshCw, Download, Settings,
  TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Activity,
  BarChart3, PieChart, LineChart, Grid3x3, Filter, Calendar,
} from 'lucide-react'
import {
  LineChart as LC, Line, BarChart as BC, Bar, PieChart as PC, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart,
} from 'recharts'
import clsx from 'clsx'
import toast from 'react-hot-toast'

declare global { interface Window { api?: any } }

// ── Sample data ──────────────────────────────────────────────────────────────
const revenueData = [
  { month:'Jan', revenue:42000, target:40000, users:1200 },
  { month:'Feb', revenue:47000, target:43000, users:1380 },
  { month:'Mar', revenue:44000, target:45000, users:1290 },
  { month:'Apr', revenue:52000, target:47000, users:1520 },
  { month:'May', revenue:61000, target:50000, users:1740 },
  { month:'Jun', revenue:58000, target:52000, users:1680 },
  { month:'Jul', revenue:67000, target:55000, users:1920 },
  { month:'Aug', revenue:72000, target:58000, users:2100 },
  { month:'Sep', revenue:69000, target:60000, users:2040 },
  { month:'Oct', revenue:78000, target:63000, users:2280 },
  { month:'Nov', revenue:84000, target:66000, users:2450 },
  { month:'Dec', revenue:91000, target:70000, users:2700 },
]

const categoryData = [
  { name:'Software',   value:38, color:'#ff8800' },
  { name:'Services',   value:27, color:'#00d4ff' },
  { name:'Hardware',   value:18, color:'#00ff88' },
  { name:'Support',    value:12, color:'#8b2fff' },
  { name:'Training',   value:5,  color:'#ff3355' },
]

const channelData = [
  { channel:'Direct',    q1:24000, q2:28000, q3:32000, q4:38000 },
  { channel:'Partner',   q1:18000, q2:21000, q3:24000, q4:27000 },
  { channel:'Online',    q1:12000, q2:16000, q3:20000, q4:26000 },
  { channel:'Reseller',  q1:8000,  q2:9000,  q3:11000, q4:14000 },
]

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, change, color, prefix = '' }: {
  icon: React.ElementType; label: string; value: number; change: number; color: string; prefix?: string
}) {
  const up = change >= 0
  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      className="bg-k-card border border-k-border rounded-xl p-4 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background:`${color}18`, border:`1px solid ${color}35` }}>
          <Icon size={16} style={{ color }}/>
        </div>
        <span className={clsx('flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full', up ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10')}>
          {up ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
          {Math.abs(change)}%
        </span>
      </div>
      <div>
        <div className="text-xl font-bold font-display text-k-text">
          {prefix}{typeof value === 'number' && value > 9999 ? `${(value/1000).toFixed(0)}K` : value.toLocaleString()}
        </div>
        <div className="text-k-muted text-xs mt-0.5">{label}</div>
      </div>
    </motion.div>
  )
}

// ── Chart Card ───────────────────────────────────────────────────────────────
function ChartCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-k-card border border-k-border rounded-xl p-4 flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <div className="text-k-text text-sm font-semibold">{title}</div>
        <button className="text-k-dim hover:text-k-muted transition-colors"><Settings size={13}/></button>
      </div>
      {children}
    </div>
  )
}

// ── App ──────────────────────────────────────────────────────────────────────
const DASHBOARDS = ['Revenue Overview', 'User Analytics', 'Sales by Channel', 'Product Performance']

export default function App() {
  const [dashboard, setDashboard] = useState(0)
  const [dateRange, setDateRange] = useState('YTD')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refresh = () => {
    setIsRefreshing(true)
    setTimeout(() => { setIsRefreshing(false); toast.success('Dashboard refreshed') }, 1200)
  }

  const tooltipStyle = { background:'#111120', border:'1px solid #1e1e38', color:'#e0e4ff', fontSize:'12px', borderRadius:'8px' }
  const gridStyle = { stroke:'#1e1e38' }

  return (
    <div className="flex flex-col h-screen bg-k-bg text-k-text">
      {/* Title bar */}
      <div className="flex items-center h-9 px-3 border-b border-k-border shrink-0 select-none" style={{ background:'rgba(7,7,15,.98)', WebkitAppRegion:'drag' } as React.CSSProperties}>
        <div style={{ WebkitAppRegion:'no-drag' } as React.CSSProperties} className="flex items-center gap-2">
          <span className="text-sm font-bold font-display" style={{ color:'#ff8800' }}>KOPPABI</span>
          <span className="text-k-dim text-xs">Business Intelligence</span>
        </div>
        <div className="flex-1"/>
        <div className="flex" style={{ WebkitAppRegion:'no-drag' } as React.CSSProperties}>
          <button onClick={() => window.api?.win.minimize()} className="w-9 h-9 flex items-center justify-center text-k-dim hover:text-k-text hover:bg-k-hover"><Minus size={12}/></button>
          <button onClick={() => window.api?.win.maximize()} className="w-9 h-9 flex items-center justify-center text-k-dim hover:text-k-text hover:bg-k-hover"><Square size={11}/></button>
          <button onClick={() => window.api?.win.close()} className="w-9 h-9 flex items-center justify-center text-k-dim hover:text-white hover:bg-red-600"><X size={12}/></button>
        </div>
      </div>

      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 h-12 border-b border-k-border bg-k-surface shrink-0">
        <div className="flex gap-1">
          {DASHBOARDS.map((d, i) => (
            <button key={d} onClick={() => setDashboard(i)}
              className={clsx('px-3 h-7 rounded text-xs font-medium transition-colors', dashboard === i ? 'text-k-text bg-k-hover' : 'text-k-muted hover:text-k-text hover:bg-k-hover')}
            >{d}</button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 h-7 rounded text-xs text-k-muted hover:text-k-text hover:bg-k-hover border border-k-border ml-2">
          <Plus size={11}/> New Dashboard
        </button>
        <div className="flex-1"/>
        <div className="flex items-center gap-1 bg-k-card border border-k-border rounded px-1">
          {['7D','MTD','YTD','1Y','All'].map(r => (
            <button key={r} onClick={() => setDateRange(r)} className={clsx('px-2 py-1 rounded text-xs transition-colors', dateRange === r ? 'bg-k-hover text-k-text' : 'text-k-muted hover:text-k-text')}>{r}</button>
          ))}
        </div>
        <button className="flex items-center gap-1 text-k-muted hover:text-k-text text-xs px-2 h-7 rounded hover:bg-k-hover border border-k-border"><Filter size={11}/> Filter</button>
        <button onClick={refresh} className={clsx('w-7 h-7 rounded flex items-center justify-center text-k-muted hover:text-k-text hover:bg-k-hover', isRefreshing && 'animate-spin text-[#ff8800]')}>
          <RefreshCw size={13}/>
        </button>
        <button className="w-7 h-7 rounded flex items-center justify-center text-k-muted hover:text-k-text hover:bg-k-hover"><Download size={13}/></button>
      </div>

      {/* Dashboard content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <KpiCard icon={DollarSign}  label="Total Revenue"   value={564000} change={18.4}  color="#ff8800" prefix="$"/>
          <KpiCard icon={Users}       label="Active Users"    value={2700}   change={12.1}  color="#00d4ff"/>
          <KpiCard icon={ShoppingCart}label="Orders"          value={3842}   change={8.7}   color="#00ff88"/>
          <KpiCard icon={Activity}    label="Conversion Rate" value={4.2}    change={-1.3}  color="#8b2fff" prefix=""/>
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <ChartCard title="Revenue vs Target" className="col-span-2">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff8800" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff8800" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" {...gridStyle}/>
                <XAxis dataKey="month" tick={{ fill:'#6b7ab5', fontSize:11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:'#6b7ab5', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={(v:number) => `$${v/1000}K`}/>
                <Tooltip contentStyle={tooltipStyle} formatter={(v:number) => [`$${v.toLocaleString()}`, '']}/>
                <Area type="monotone" dataKey="revenue" stroke="#ff8800" strokeWidth={2} fill="url(#rev)" name="Revenue"/>
                <Line type="monotone" dataKey="target" stroke="#3a4070" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Target"/>
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Revenue by Category">
            <ResponsiveContainer width="100%" height={220}>
              <PC>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {categoryData.map((c, i) => <Cell key={i} fill={c.color}/>)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v:number) => [`${v}%`, '']}/>
              </PC>
            </ResponsiveContainer>
            <div className="space-y-1 mt-1">
              {categoryData.map(c => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background:c.color }}/><span className="text-k-muted">{c.name}</span></div>
                  <span className="text-k-text font-medium">{c.value}%</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-2 gap-3">
          <ChartCard title="Sales by Channel (Quarterly)">
            <ResponsiveContainer width="100%" height={200}>
              <BC data={channelData} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" {...gridStyle}/>
                <XAxis dataKey="channel" tick={{ fill:'#6b7ab5', fontSize:11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:'#6b7ab5', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={(v:number) => `$${v/1000}K`}/>
                <Tooltip contentStyle={tooltipStyle} formatter={(v:number) => [`$${v.toLocaleString()}`, '']}/>
                <Legend wrapperStyle={{ fontSize:'11px', color:'#6b7ab5' }}/>
                <Bar dataKey="q1" fill="#ff8800" opacity={0.5} name="Q1"/>
                <Bar dataKey="q2" fill="#ff8800" opacity={0.65} name="Q2"/>
                <Bar dataKey="q3" fill="#ff8800" opacity={0.8} name="Q3"/>
                <Bar dataKey="q4" fill="#ff8800" name="Q4"/>
              </BC>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="User Growth">
            <ResponsiveContainer width="100%" height={200}>
              <LC data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" {...gridStyle}/>
                <XAxis dataKey="month" tick={{ fill:'#6b7ab5', fontSize:11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:'#6b7ab5', fontSize:11 }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={tooltipStyle}/>
                <Line type="monotone" dataKey="users" stroke="#00d4ff" strokeWidth={2} dot={{ fill:'#00d4ff', r:3 }} name="Users"/>
              </LC>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between h-6 px-4 text-xs font-mono text-k-dim border-t border-k-border shrink-0 bg-k-surface">
        <span style={{ color:'#ff8800' }}>● KOPPABI</span>
        <span>Last refreshed: just now · 12 data sources connected</span>
      </div>
    </div>
  )
}
