"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2, History, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryLog {
  id: string;
  contentType: string;
  action: string;
  itemTitle: string;
  createdAt: string;
}

export function ChangeHistoryPanel() {
  const [logs, setLogs] = useState<HistoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  async function loadLogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/content/change_history");
      if (!res.ok) throw new Error("Failed to load change history logs");
      const data = await res.json();
      if (Array.isArray(data)) {
        // Sort by date descending
        const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLogs(sorted);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load change history logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLogs();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleClearLogs = async () => {
    if (!window.confirm("Are you sure you want to permanently clear all change logs?")) return;
    setClearing(true);
    try {
      const res = await fetch("/api/content/change_history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "overwrite",
          data: [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to clear logs");
      setLogs([]);
      toast.success("Change history logs cleared successfully!");
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to clear logs");
    } finally {
      setClearing(false);
    }
  };

  const getActionBadge = (action: string) => {
    const act = action.toLowerCase();
    let classes = "bg-white/5 border-white/10 text-white";
    if (act === "create") {
      classes = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    } else if (act === "update") {
      classes = "bg-amber-500/10 border-amber-500/20 text-primary"; // Gold / Primary
    } else if (act === "delete") {
      classes = "bg-rose-500/10 border-rose-500/20 text-rose-400";
    } else if (act === "overwrite") {
      classes = "bg-purple-500/10 border-purple-500/20 text-purple-400";
    }
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider ${classes}`}>
        {action}
      </span>
    );
  };

  const formatContentType = (type: string) => {
    if (type === "site_settings") return "Site Settings";
    if (type === "process") return "Process Steps";
    if (type === "features") return "Features";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl animate-fadeIn">
      {/* HEADER ACTIONS */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-gradient text-dk-bg">
            <History className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-sm font-bold text-white">System Logs</h3>
            <p className="text-[10px] text-dk-muted">Chronological history of admin content additions, edits and deletes.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadLogs}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-white"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
          {logs.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearLogs}
              disabled={clearing}
              className="flex items-center gap-1.5 rounded-xl bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 border border-rose-500/20 text-xs"
            >
              <Trash2 className="h-3 w-3" />
              Clear Logs
            </Button>
          )}
        </div>
      </div>

      {/* LOGS TABLE / LIST */}
      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#0b0b0b]/30 p-12 text-center backdrop-blur-sm">
          <AlertCircle className="h-10 w-10 text-dk-muted opacity-40 mb-3" />
          <h4 className="text-sm font-bold text-white">No history found</h4>
          <p className="mt-1 text-xs text-dk-muted max-w-xs">
            Any future changes you make to services, projects, videos, or settings will appear here in chronological order.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-[#0b0b0b]/60 backdrop-blur-md overflow-hidden shadow-glow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01] text-dk-muted font-mono text-[9px] uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Time &amp; Date</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                  <th className="px-6 py-4 font-semibold">Content Area</th>
                  <th className="px-6 py-4 font-semibold">Modified Item Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-6 py-4 text-dk-muted font-mono whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                      {formatContentType(log.contentType)}
                    </td>
                    <td className="px-6 py-4 text-dk-muted max-w-md truncate group-hover:text-white transition-colors">
                      {log.itemTitle}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
