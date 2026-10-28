import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Clock,
  User,
  AlertTriangle,
  Info,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Terminal
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import api from '../services/api';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/audit-logs');
      if (res.data?.success) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            CRITICAL
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            WARNING
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            SUCCESS
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-royal-500/15 text-royal-300 border border-royal-500/30">
            <Info className="w-3 h-3 text-royal-400" />
            INFO
          </span>
        );
    }
  };

  const filteredLogs = logs.filter(l => {
    const matchesSearch =
      l.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.ipAddress?.includes(searchTerm);
    const matchesSeverity = selectedSeverity === 'ALL' || l.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Institutional Audit Logs</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-royal-600/20 text-royal-300 border border-royal-500/30">
              {logs.length} Entries
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immutable system events, privileged role modifications, logins, and automated sync records.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-royal-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Trail</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by action, user, IP, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-royal-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-1" />
          {['ALL', 'info', 'success', 'warning', 'critical'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase transition-colors ${
                selectedSeverity === sev
                  ? 'bg-royal-600 text-white'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <GlassCard className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 rounded-full border-2 border-royal-500 border-t-transparent animate-spin" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <Terminal className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-300 font-medium">No audit logs matching filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Event Action</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">User & Role</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white tracking-wide">{log.action}</span>
                    </td>
                    <td className="py-3 px-4">
                      {getSeverityBadge(log.severity)}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-slate-200">{log.user}</p>
                        <p className="text-[10px] text-royal-400">{log.role}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs text-slate-300">
                      <p className="truncate" title={log.details}>{log.details}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

