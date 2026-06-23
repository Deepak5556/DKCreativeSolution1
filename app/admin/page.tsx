"use client";

import Image from "next/image";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Edit,
  LogOut,
  Loader2,
  ArrowLeft,
  LayoutDashboard,
  FolderGit2,
  Users,
  Laptop,
  Star,
  Mail,
  CheckCircle2,
  Film,
  Image as ImageIcon,
  TrendingUp,
  ListChecks,
  Shield,
  Inbox,
  Briefcase,
  ExternalLink,
  PlusCircle,
  Play,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  LayoutList,
  ChevronDown,
} from "lucide-react";
import { AVAILABLE_ICONS, resolveIcon } from "@/lib/icons";

// Admin credentials constants
const ADMIN_EMAIL = "deepak@gmail.com";

type ContentType =
  | "dashboard"
  | "services"
  | "projects"
  | "videos"
  | "posters"
  | "stats"
  | "testimonials"
  | "process"
  | "features"
  | "queries";

interface AdminItem {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  tech?: string[] | string;
  liveUrl?: string;
  githubUrl?: string;
  accent?: string;
  icon?: string;
  duration?: string;
  type?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  beforeImageUrl?: string;
  actionType?: string;
  externalLink?: string;
  email?: string;
  phone?: string;
  priority?: string;
  subCategory?: string;
  details?: string;
  createdAt?: string;
  aspect?: string;
  palette?: string;
  value?: number;
  suffix?: string;
  label?: string;
  name?: string;
  role?: string;
  company?: string;
  quote?: string;
  rating?: number;
  initials?: string;
  step?: string;
  features?: string[] | string;
}

const tabIcons: Record<ContentType, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  services: Laptop,
  projects: Briefcase,
  videos: Film,
  posters: ImageIcon,
  stats: TrendingUp,
  testimonials: Users,
  process: ListChecks,
  features: Shield,
  queries: Inbox,
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<ContentType>("dashboard");
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  // Dashboard Stats State
  const [dashboardStats, setDashboardStats] = useState({
    projectsDelivered: { value: 0, suffix: "+" },
    happyClients: { value: 0, suffix: "+" },
    coreServices: { value: 0, suffix: "+" },
    clientSatisfaction: { value: 0.0, suffix: "%" },
  });
  const [statsItems, setStatsItems] = useState<AdminItem[]>([]);
  const [recentQueries, setRecentQueries] = useState<AdminItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // Search, Sort and View Mode States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Edit / Add modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminItem | null>(null);

  // Form Fields State
  const [formFields, setFormFields] = useState<Partial<AdminItem>>({});
  const [tempFiles, setTempFiles] = useState<Record<string, { file: File; blobUrl: string }>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldKey: keyof AdminItem) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    setTempFiles((prev) => {
      if (prev[String(fieldKey)]) {
        URL.revokeObjectURL(prev[String(fieldKey)].blobUrl);
      }
      return {
        ...prev,
        [String(fieldKey)]: { file, blobUrl },
      };
    });

    handleFieldChange(fieldKey, blobUrl);
    toast.success(`${file.name} ready for saving!`);
  };

  const handleCancel = useCallback(() => {
    Object.values(tempFiles).forEach((temp) => {
      URL.revokeObjectURL(temp.blobUrl);
    });
    setTempFiles({});
    setModalOpen(false);
  }, [tempFiles]);


  const loadDashboardStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const [statsRes, queriesRes] = await Promise.all([
        fetch("/api/content/stats"),
        fetch("/api/content/queries"),
      ]);

      const statsData = await statsRes.json();
      const queriesData = await queriesRes.json();

      if (Array.isArray(statsData)) {
        setStatsItems(statsData);

        const projStat = statsData.find((s) => s.id === "projects") || { value: 0, suffix: "+" };
        const clientStat = statsData.find((s) => s.id === "clients") || { value: 0, suffix: "+" };
        const serviceStat = statsData.find((s) => s.id === "services") || { value: 0, suffix: "+" };
        const satStat = statsData.find((s) => s.id === "satisfaction") || { value: 5.0, suffix: "" };

        setDashboardStats({
          projectsDelivered: { value: Number(projStat.value) || 0, suffix: projStat.suffix || "+" },
          happyClients: { value: Number(clientStat.value) || 0, suffix: clientStat.suffix || "+" },
          coreServices: { value: Number(serviceStat.value) || 0, suffix: serviceStat.suffix || "+" },
          clientSatisfaction: { value: Number(satStat.value) || 0, suffix: satStat.suffix || "" },
        });
      }

      if (Array.isArray(queriesData)) {
        // Sort queries by date or take the first 3
        const sortedQueries = [...queriesData]
          .sort((a, b) => (b.id > a.id ? 1 : -1))
          .slice(0, 3);
        setRecentQueries(sortedQueries);
      }
    } catch (err) {
      console.error("Failed to load dashboard metrics:", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const loadItems = useCallback(async (type: ContentType) => {
    if (type === "dashboard") {
      await loadDashboardStats();
      return;
    }

    setLoadingItems(true);
    try {
      const res = await fetch(`/api/content/${type}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
      }
    } catch {
      toast.error("Failed to load items");
    } finally {
      setLoadingItems(false);
    }
  }, [loadDashboardStats]);

  useEffect(() => {
    // Check if user is already logged in
    fetch("/api/admin/login")
      .then((res) => res.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
      })
      .catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    if (authenticated) {
      const timer = setTimeout(() => {
        setSearchQuery("");
        setSortOrder("latest");
        loadItems(activeTab);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [authenticated, activeTab, loadItems]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthenticated(true);
        toast.success("Successfully logged in!");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch {
      toast.error("Login request failed");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/login", { method: "DELETE" });
      if (res.ok) {
        setAuthenticated(false);
        toast.success("Logged out");
        // Redirect to homepage after logging out
        window.location.href = "/";
      }
    } catch {
      toast.error("Logout request failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`/api/content/${activeTab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Item deleted");
        setItems(items.filter((item) => item.id !== id));
        // If deleting testimonials, projects, services, or stats, refresh dashboard stats
        if (activeTab === "projects" || activeTab === "testimonials" || activeTab === "services" || activeTab === "stats") {
          loadDashboardStats();
        }
      } else {
        toast.error(data.error || "Failed to delete item");
      }
    } catch {
      toast.error("Delete operation failed");
    }
  };

  const openAddModal = (tabOverride?: ContentType | React.MouseEvent) => {
    setEditingItem(null);
    const targetTab = typeof tabOverride === "string" ? tabOverride : activeTab;
    
    // Generate RFC 4122 compliant UUID
    const generateUUID = () => {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    // Initialize default fields based on targetTab
    const defaults: Partial<AdminItem> = {};
    if (targetTab === "services") {
      defaults.id = generateUUID();
      defaults.title = "";
      defaults.description = "";
      defaults.icon = "Code2";
      defaults.features = "";
      defaults.actionType = "popup";
      defaults.externalLink = "";
    } else if (targetTab === "projects") {
      defaults.id = generateUUID();
      defaults.title = "";
      defaults.category = "Web Development";
      defaults.description = "";
      defaults.tech = "";
      defaults.liveUrl = "";
      defaults.githubUrl = "";
      defaults.accent = "gold";
      defaults.icon = "GraduationCap";
      defaults.thumbnailUrl = "";
    } else if (targetTab === "videos") {
      defaults.id = generateUUID();
      defaults.title = "";
      defaults.category = "Reel Preview";
      defaults.duration = "0:30";
      defaults.type = "reel";
      defaults.videoUrl = "";
      defaults.thumbnailUrl = "";
    } else if (targetTab === "posters") {
      defaults.id = generateUUID();
      defaults.title = "";
      defaults.category = "Instagram Posters";
      defaults.aspect = "square";
      defaults.palette = "gold";
      defaults.imageUrl = "";
      defaults.beforeImageUrl = "";
    } else if (targetTab === "stats") {
      defaults.id = generateUUID();
      defaults.value = 0;
      defaults.suffix = "+";
      defaults.label = "";
    } else if (targetTab === "testimonials") {
      defaults.id = generateUUID();
      defaults.name = "";
      defaults.role = "";
      defaults.company = "";
      defaults.quote = "";
      defaults.rating = 5;
      defaults.initials = "";
    } else if (targetTab === "process") {
      defaults.id = generateUUID();
      defaults.step = String(items.length + 1).padStart(2, "0");
      defaults.title = "";
      defaults.description = "";
      defaults.icon = "MessageCircle";
    } else if (targetTab === "features") {
      defaults.id = generateUUID();
      defaults.title = "";
      defaults.description = "";
      defaults.icon = "Zap";
    }
    setFormFields(defaults);
    setTempFiles({});
    setIsSaving(false);
    setModalOpen(true);
  };

  const openEditModal = (item: AdminItem) => {
    setEditingItem(item);
    // Map existing fields
    const fields = { ...item };
    // Convert arrays back to comma-separated strings for forms
    if (activeTab === "services" && Array.isArray(item.features)) {
      fields.features = item.features.join(", ");
    }
    if (activeTab === "projects" && Array.isArray(item.tech)) {
      fields.tech = item.tech.join(", ");
    }
    setFormFields(fields);
    setTempFiles({});
    setIsSaving(false);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Prepare item data (clean up comma separated strings to arrays if needed)
    const payloadItem = { ...formFields };

    // Upload any pending files in tempFiles first
    try {
      for (const [fieldKey, temp] of Object.entries(tempFiles)) {
        if (payloadItem[fieldKey as keyof AdminItem] === temp.blobUrl) {
          const formData = new FormData();
          formData.append("file", temp.file);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (res.ok && data.success) {
            payloadItem[fieldKey as keyof AdminItem] = data.url;
            URL.revokeObjectURL(temp.blobUrl);
          } else {
            throw new Error(data.error || `Upload failed for ${fieldKey}`);
          }
        }
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Failed to upload files";
      toast.error(errMsg);
      setIsSaving(false);
      return;
    }

    if (activeTab === "services" && typeof payloadItem.features === "string") {
      payloadItem.features = payloadItem.features
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
    if (activeTab === "projects" && typeof payloadItem.tech === "string") {
      payloadItem.tech = payloadItem.tech
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    // Number conversion for stats/testimonials values
    if (activeTab === "stats") {
      payloadItem.value = Number(payloadItem.value) || 0;
    }
    if (activeTab === "testimonials") {
      payloadItem.rating = Number(payloadItem.rating) || 5;
    }

    const action = editingItem ? "update" : "create";

    try {
      const res = await fetch(`/api/content/${activeTab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, item: payloadItem }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(editingItem ? "Item updated!" : "Item created!");
        setTempFiles({});
        setModalOpen(false);
        loadItems(activeTab);
        if (activeTab === "projects" || activeTab === "testimonials" || activeTab === "services" || activeTab === "stats") {
          loadDashboardStats();
        }
      } else {
        toast.error(data.error || "Operation failed");
      }
    } catch {
      toast.error("Form submit failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (key: keyof AdminItem, value: unknown) => {
    setFormFields((prev) => ({ ...prev, [key]: value }));
  };

  const filteredSortedItems = (() => {
    let result = [...items];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) => {
        const fields = [
          item.title,
          item.description,
          item.category,
          item.name,
          item.email,
          item.phone,
          item.details,
          item.label,
          item.role,
          item.company,
          item.quote,
          Array.isArray(item.tech) ? item.tech.join(" ") : item.tech,
          Array.isArray(item.features) ? item.features.join(" ") : item.features,
        ].filter(Boolean).map(s => String(s).toLowerCase());
        
        return fields.some(f => f.includes(query));
      });
    }

    result.sort((a, b) => {
      const keyA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
      const keyB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
      
      if (sortOrder === "latest") {
        return keyB > keyA ? 1 : -1;
      } else {
        return keyA > keyB ? 1 : -1;
      }
    });

    return result;
  })();

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-4 text-white">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30 animate-pulse-slow" />
        <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/5 bg-black/60 p-8 backdrop-blur-md shadow-glow-md">
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">
              DK Creative <span className="text-gradient-gold">Admin</span>
            </h1>
            <p className="mt-2 text-sm text-dk-muted">
              Enter credentials to access the console
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email-input" className="text-xs font-semibold uppercase tracking-wider text-dk-muted">
                Email Address
              </label>
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ADMIN_EMAIL}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-primary/50 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password-input" className="text-xs font-semibold uppercase tracking-wider text-dk-muted">
                Password
              </label>
              <input
                id="password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-primary/50 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gold-gradient py-3 text-sm font-bold text-dk-bg shadow-glow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-[#030303] text-white">
      {/* Dynamic Grid Overlay */}
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-[0.15] pointer-events-none" />

      {/* Side Navigation panel */}
      <aside className="relative z-10 w-full lg:w-[260px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/5 bg-black/40 backdrop-blur-md flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-dk-muted hover:text-white">
            <ArrowLeft className="h-3 w-3" />
            Back to Site
          </Link>
          <div className="text-right">
            <span className="font-mono text-[9px] uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full">
              Console v2
            </span>
          </div>
        </div>

        <div className="p-6 border-b border-white/5">
          <h1 className="font-display text-lg font-bold text-white tracking-wide">
            DK <span className="text-gradient-gold">Creative</span>
          </h1>
          <p className="text-[10px] text-dk-muted uppercase tracking-[0.2em] mt-1 font-mono">
            Control Center
          </p>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 flex flex-row flex-wrap lg:flex-col gap-1 overflow-y-auto" aria-label="Sidebar Content Selector">
          {(
            [
              { id: "dashboard", label: "Overview Home" },
              { id: "services", label: "Services" },
              { id: "projects", label: "Projects" },
              { id: "videos", label: "Video Editing" },
              { id: "posters", label: "Posters" },
              { id: "stats", label: "Stats" },
              { id: "testimonials", label: "Testimonials" },
              { id: "process", label: "Process Steps" },
              { id: "features", label: "Why Us (Features)" },
              { id: "queries", label: "Inquiries / Leads" },
            ] as const
          ).map((tab) => {
            const IconComponent = tabIcons[tab.id];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left font-display text-xs font-semibold tracking-wide transition-all w-full select-none ${
                  isActive
                    ? "bg-gold-gradient text-dk-bg shadow-glow-sm transform scale-[1.02]"
                    : "border border-transparent text-dk-muted hover:border-white/5 hover:bg-white/[0.02] hover:text-white"
                }`}
              >
                <IconComponent className={`h-4 w-4 ${isActive ? "text-dk-bg" : "text-primary/70"}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-mono text-white/40 truncate">
              {ADMIN_EMAIL}
            </span>
            <span className="text-[9px] text-primary font-semibold">
              Administrator
            </span>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="rounded-full p-2.5 text-white/50 border border-white/5 bg-white/[0.01] hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-all focus:outline-none"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0 bg-transparent">
        {/* Top Header bar */}
        <header className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display tracking-tight text-white capitalize">
              {activeTab === "dashboard" ? "System Dashboard" : `${activeTab} management`}
            </h2>
            <p className="text-[10px] text-dk-muted mt-0.5">
              {activeTab === "dashboard"
                ? "Overview of website performance and dynamic content details."
                : `Modify, configure, or review your dynamic website ${activeTab} items.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab !== "dashboard" && activeTab !== "queries" && (
              <button
                onClick={openAddModal}
                className="flex items-center gap-1.5 rounded-full bg-gold-gradient px-4 py-2.5 text-xs font-bold text-dk-bg shadow-glow-sm hover:scale-105 transition-transform"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </button>
            )}
          </div>
        </header>

        {/* View Router Panel Container */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">

          {/* DASHBOARD TAB RENDERING */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              {loadingStats ? (
                <div className="flex h-60 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {/* Greeting Block */}
                  <div className="relative rounded-2xl border border-white/5 bg-[#0b0b0b]/60 p-6 backdrop-blur-md overflow-hidden">
                    <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
                    <h3 className="font-display text-lg font-bold text-white">
                      Welcome back, <span className="text-gradient-gold">Deepak</span>!
                    </h3>
                    <p className="text-xs text-dk-muted mt-1 leading-relaxed max-w-xl">
                      Here is the dynamic content summary for DK Creative Solutions. All cards below display live counts fetched directly from your website files.
                    </p>
                  </div>

                  {/* 4 Dashboard Metric Summary Cards */}
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Projects Card */}
                    <div
                      onClick={() => setActiveTab("stats")}
                      className="group relative cursor-pointer rounded-2xl border border-white/5 bg-card p-6 border-glow-hover transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-white/[0.04]"
                    >
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-b-2xl opacity-40 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                          Projects Delivered
                        </span>
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-primary group-hover:bg-primary/10 transition-colors">
                          <FolderGit2 className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="font-display text-3xl font-bold text-white">
                          {dashboardStats.projectsDelivered.value}
                          <span className="text-xs text-dk-muted font-normal ml-1">
                            {dashboardStats.projectsDelivered.suffix}
                          </span>
                        </span>
                        <p className="text-[10px] text-dk-muted mt-1">
                          Items shown in gallery
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="text-[9px] font-mono font-bold text-dk-muted group-hover:text-primary transition-colors flex items-center gap-1">
                          Manage Stats &rarr;
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const item = statsItems.find((s) => s.id === "projects");
                            if (item) {
                              setActiveTab("stats");
                              openEditModal(item);
                            } else {
                              toast.error("Projects stat not found");
                            }
                          }}
                          className="flex items-center gap-1 rounded-md bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary px-2 py-1 text-[9px] font-semibold transition-all"
                        >
                          <Edit className="h-2.5 w-2.5" />
                          Edit Count
                        </button>
                      </div>
                    </div>

                    {/* Happy Clients Card */}
                    <div
                      onClick={() => setActiveTab("stats")}
                      className="group relative cursor-pointer rounded-2xl border border-white/5 bg-card p-6 border-glow-hover transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-white/[0.04]"
                    >
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-b-2xl opacity-40 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                          Happy Clients
                        </span>
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-primary group-hover:bg-primary/10 transition-colors">
                          <Users className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="font-display text-3xl font-bold text-white">
                          {dashboardStats.happyClients.value}
                          <span className="text-xs text-dk-muted font-normal ml-1">
                            {dashboardStats.happyClients.suffix}
                          </span>
                        </span>
                        <p className="text-[10px] text-dk-muted mt-1">
                          Testimonials configured
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="text-[9px] font-mono font-bold text-dk-muted group-hover:text-primary transition-colors flex items-center gap-1">
                          Manage Stats &rarr;
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const item = statsItems.find((s) => s.id === "clients");
                            if (item) {
                              setActiveTab("stats");
                              openEditModal(item);
                            } else {
                              toast.error("Clients stat not found");
                            }
                          }}
                          className="flex items-center gap-1 rounded-md bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary px-2 py-1 text-[9px] font-semibold transition-all"
                        >
                          <Edit className="h-2.5 w-2.5" />
                          Edit Count
                        </button>
                      </div>
                    </div>

                    {/* Core Services Card */}
                    <div
                      onClick={() => setActiveTab("stats")}
                      className="group relative cursor-pointer rounded-2xl border border-white/5 bg-card p-6 border-glow-hover transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-white/[0.04]"
                    >
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-b-2xl opacity-40 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                          Core Services
                        </span>
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-primary group-hover:bg-primary/10 transition-colors">
                          <Laptop className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="font-display text-3xl font-bold text-white">
                          {dashboardStats.coreServices.value}
                          <span className="text-xs text-dk-muted font-normal ml-1">
                            {dashboardStats.coreServices.suffix}
                          </span>
                        </span>
                        <p className="text-[10px] text-dk-muted mt-1">
                          Offerings in homepage grid
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="text-[9px] font-mono font-bold text-dk-muted group-hover:text-primary transition-colors flex items-center gap-1">
                          Manage Stats &rarr;
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const item = statsItems.find((s) => s.id === "services");
                            if (item) {
                              setActiveTab("stats");
                              openEditModal(item);
                            } else {
                              toast.error("Services stat not found");
                            }
                          }}
                          className="flex items-center gap-1 rounded-md bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary px-2 py-1 text-[9px] font-semibold transition-all"
                        >
                          <Edit className="h-2.5 w-2.5" />
                          Edit Count
                        </button>
                      </div>
                    </div>

                    {/* Client Satisfaction Card */}
                    <div
                      onClick={() => setActiveTab("stats")}
                      className="group relative cursor-pointer rounded-2xl border border-white/5 bg-card p-6 border-glow-hover transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-white/[0.04]"
                    >
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-yellow-500 to-red-500 rounded-b-2xl opacity-40 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                          Client Satisfaction
                        </span>
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-primary group-hover:bg-primary/10 transition-colors">
                          <Star className="h-5 w-5 fill-primary text-primary" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="font-display text-3xl font-bold text-white">
                          {dashboardStats.clientSatisfaction.value}
                          <span className="text-xs text-dk-muted font-normal ml-1">
                            {dashboardStats.clientSatisfaction.suffix}
                          </span>
                        </span>
                        <p className="text-[10px] text-dk-muted mt-1">
                          Average testimonial review
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="text-[9px] font-mono font-bold text-dk-muted group-hover:text-primary transition-colors flex items-center gap-1">
                          Manage Stats &rarr;
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const item = statsItems.find((s) => s.id === "satisfaction");
                            if (item) {
                              setActiveTab("stats");
                              openEditModal(item);
                            } else {
                              toast.error("Satisfaction stat not found");
                            }
                          }}
                          className="flex items-center gap-1 rounded-md bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary px-2 py-1 text-[9px] font-semibold transition-all"
                        >
                          <Edit className="h-2.5 w-2.5" />
                          Edit Score
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Bottom Section */}
                  <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
                    {/* Column 1: Recent Inquiries Inbox */}
                    <div className="rounded-2xl border border-white/5 bg-[#0b0b0b]/40 p-6 backdrop-blur-md">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                        <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          Recent Customer Inquiries
                        </h4>
                        <button
                          onClick={() => setActiveTab("queries")}
                          className="text-[10px] font-semibold text-primary hover:underline"
                        >
                          View All Leads
                        </button>
                      </div>

                      {recentQueries.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center text-center">
                          <CheckCircle2 className="h-8 w-8 text-white/20 mb-2" />
                          <p className="text-xs text-dk-muted">Your inbox is clean. No new inquiries.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {recentQueries.map((query) => (
                            <div key={query.id} className="relative rounded-xl border border-white/5 bg-[#121212]/50 p-4 transition-colors hover:border-white/10">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                  <span className="text-xs font-bold text-white">{query.name}</span>
                                  <span className="text-[10px] text-dk-muted block mt-0.5 font-mono">
                                    {query.email} · {query.phone}
                                  </span>
                                </div>
                                <span className="self-start rounded-full bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 text-[9px] font-semibold">
                                  {query.category}
                                </span>
                              </div>
                              <p className="text-xs leading-relaxed text-white/70 mt-3 border-t border-white/5 pt-2.5 italic">
                                &ldquo;{query.details}&rdquo;
                              </p>
                              <div className="mt-2 text-[9px] font-mono text-white/30 text-right">
                                Submitted: {query.createdAt ? new Date(query.createdAt).toLocaleDateString() : "N/A"}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Column 2: Shortcut Actions & Server Status */}
                    <div className="space-y-6">
                      {/* ShortCut Operations */}
                      <div className="rounded-2xl border border-white/5 bg-[#0b0b0b]/40 p-6 backdrop-blur-md">
                        <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono text-primary">
                          Quick Actions
                        </h4>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              setActiveTab("projects");
                              setTimeout(() => openAddModal(), 100);
                            }}
                            className="flex items-center justify-between rounded-xl border border-white/5 bg-[#121212] px-4 py-3 text-xs font-semibold text-white hover:bg-white/[0.03] transition-colors text-left"
                          >
                            <span>Add New Project</span>
                            <PlusCircle className="h-4 w-4 text-primary" />
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab("videos");
                              setTimeout(() => openAddModal(), 100);
                            }}
                            className="flex items-center justify-between rounded-xl border border-white/5 bg-[#121212] px-4 py-3 text-xs font-semibold text-white hover:bg-white/[0.03] transition-colors text-left"
                          >
                            <span>Upload Video Item</span>
                            <PlusCircle className="h-4 w-4 text-primary" />
                          </button>
                          <Link
                            href="/"
                            target="_blank"
                            className="flex items-center justify-between rounded-xl border border-white/5 bg-[#121212] px-4 py-3 text-xs font-semibold text-white hover:bg-white/[0.03] transition-colors text-left"
                          >
                            <span>Launch Live Site</span>
                            <ExternalLink className="h-4 w-4 text-primary" />
                          </Link>
                        </div>
                      </div>

                      {/* Server Config */}
                      <div className="rounded-2xl border border-white/5 bg-[#0b0b0b]/40 p-6 backdrop-blur-md">
                        <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-2 font-mono text-primary">
                          System Status
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-medium text-emerald-500">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                          </span>
                          Server Online
                        </div>
                        <p className="text-[10px] text-dk-muted mt-2">
                          Data persistent in local json files. Next.js App Router API active.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* DYNAMIC CONTENT TABLE LISTS */}
          {activeTab !== "dashboard" && (
            <div className="relative rounded-2xl border border-white/5 bg-[#0b0b0b]/40 p-6 backdrop-blur-md">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm font-bold text-white capitalize">
                    {activeTab} Entries
                  </h3>
                  <p className="text-xs text-dk-muted mt-0.5">
                    Viewing dynamic items saved in database.
                  </p>
                </div>
              </div>

              {/* SEARCH & FILTER CONTROLS */}
              {!loadingItems && items.length > 0 && (
                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between border border-white/5 bg-white/[0.01] p-4 rounded-xl backdrop-blur-md">
                  <div className="relative w-full sm:max-w-xs">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dk-muted">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      placeholder={`Search ${activeTab}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-white/10 bg-white/[0.03] text-white focus:border-primary/50 focus:outline-none transition-colors placeholder:text-white/20"
                    />
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {/* Sort Dropdown (styled) */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
                        <SlidersHorizontal className="h-3 w-3 text-dk-muted" />
                      </div>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "latest" | "oldest")}
                        className="appearance-none pl-7 pr-7 py-2 text-xs rounded-lg border border-white/10 bg-[#111111] text-white focus:border-primary/50 focus:outline-none cursor-pointer transition-colors hover:border-white/20"
                        style={{ backgroundImage: 'none' }}
                      >
                        <option value="latest">Latest First</option>
                        <option value="oldest">Oldest First</option>
                      </select>
                      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                        <ChevronDown className="h-3 w-3 text-dk-muted" />
                      </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center rounded-lg border border-white/10 bg-[#111111] overflow-hidden">
                      <button
                        onClick={() => setViewMode("grid")}
                        title="Grid View"
                        className={`px-2.5 py-2 transition-all ${
                          viewMode === "grid"
                            ? "bg-primary/20 text-primary"
                            : "text-dk-muted hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <LayoutGrid className="h-3.5 w-3.5" />
                      </button>
                      <div className="w-px h-4 bg-white/10" />
                      <button
                        onClick={() => setViewMode("list")}
                        title="List View"
                        className={`px-2.5 py-2 transition-all ${
                          viewMode === "list"
                            ? "bg-primary/20 text-primary"
                            : "text-dk-muted hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <LayoutList className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {loadingItems ? (
                <div className="flex h-60 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 text-center p-6">
                  <p className="text-xs text-dk-muted">No items found.</p>
                  {activeTab !== "queries" && (
                    <button
                      onClick={openAddModal}
                      className="mt-3 text-xs font-semibold text-primary hover:underline"
                    >
                      Create your first item
                    </button>
                  )}
                </div>
              ) : filteredSortedItems.length === 0 ? (
                <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 text-center p-6">
                  <Search className="h-8 w-8 text-white/20 mb-2" />
                  <p className="text-xs text-dk-muted">No items match your search.</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 text-xs font-semibold text-primary hover:underline"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                /* CARD GRID / LIST VIEW FOR ALL CONTENT TYPES */
                <div className={
                  viewMode === "list"
                    ? "flex flex-col gap-2"
                    : activeTab === "stats"
                    ? "grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                    : activeTab === "testimonials" || activeTab === "queries"
                    ? "grid gap-6 grid-cols-1 md:grid-cols-2"
                    : "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }>
                  {filteredSortedItems.map((item) => (
                    <div
                      key={item.id}
                      className={`group relative flex justify-between rounded-2xl border border-white/5 bg-[#121212]/30 transition-all duration-300 hover:border-white/10 hover:bg-[#121212]/50 ${
                        viewMode === "list"
                          ? "flex-row items-center gap-4 px-5 py-3"
                          : "flex-col p-5"
                      }`}
                    >
                      {/* PROJECTS CARD */}
                      {activeTab === "projects" && (
                        <div className="flex flex-col h-full space-y-4">
                          {/* Thumbnail preview */}
                          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                            {item.thumbnailUrl ? (
                              <Image
                                src={item.thumbnailUrl}
                                alt={item.title || "Project Thumbnail"}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500/10 to-yellow-500/10 text-primary">
                                <Briefcase className="h-8 w-8 opacity-40" />
                              </div>
                            )}
                            <span className="absolute left-3 top-3 rounded-full bg-black/60 border border-white/10 px-2.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
                              {item.category}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-display text-sm font-bold text-white group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-dk-muted mt-1.5 leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                          {/* Tech Stack */}
                          {item.tech && (
                            <div className="flex flex-wrap gap-1">
                              {(Array.isArray(item.tech) ? item.tech : String(item.tech).split(",")).map((t, idx) => (
                                <span key={idx} className="rounded bg-white/[0.03] border border-white/5 px-1.5 py-0.5 text-[9px] font-mono text-white/55">
                                  {t.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                          {/* Links & Action buttons */}
                          <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-auto">
                            <div className="flex items-center gap-2">
                              {item.liveUrl && (
                                <Link
                                  href={item.liveUrl}
                                  target="_blank"
                                  className="text-[10px] font-semibold text-dk-muted hover:text-white flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" /> Live
                                </Link>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => openEditModal(item)}
                                aria-label={`Edit ${item.id}`}
                                className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-white transition-colors"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                aria-label={`Delete ${item.id}`}
                                className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-destructive transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SERVICES CARD */}
                      {activeTab === "services" && (
                        <div className="flex flex-col h-full w-full">
                          <div className="flex items-start justify-between">
                            <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5 text-primary">
                              {(() => {
                                  const IconComponent = resolveIcon(item.icon);
                                  return <IconComponent className="h-5 w-5" />;
                              })()}
                            </div>
                            <span className="rounded-full bg-white/[0.03] border border-white/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-dk-muted">
                              {item.actionType === "link" ? "External Link" : "Popup Quote"}
                            </span>
                          </div>
                          <div className="mt-4">
                            <h4 className="font-display text-sm font-bold text-white group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-dk-muted mt-1.5 leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                          {/* Features list */}
                          {item.features && (
                            <div className="mt-3.5 space-y-1.5 border-t border-white/5 pt-3.5">
                              {(Array.isArray(item.features) ? item.features : String(item.features).split(",")).slice(0, 3).map((f, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-[10px] text-white/60">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                  <span className="truncate">{f.trim()}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Actions */}
                          <div className="flex items-center justify-end gap-1.5 border-t border-white/5 pt-3.5 mt-auto">
                            <button
                              onClick={() => openEditModal(item)}
                              aria-label={`Edit ${item.id}`}
                              className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              aria-label={`Delete ${item.id}`}
                              className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* VIDEOS CARD */}
                      {activeTab === "videos" && (
                        <div className="flex flex-col h-full space-y-4">
                          {/* Thumbnail preview with play overlay */}
                          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-900 group">
                            {item.thumbnailUrl ? (
                              <Image
                                src={item.thumbnailUrl}
                                alt={item.title || "Video Thumbnail"}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-primary">
                                <Film className="h-8 w-8 opacity-40" />
                              </div>
                            )}
                            {/* Play overlay */}
                            {item.videoUrl && (
                              <Link
                                href={item.videoUrl}
                                target="_blank"
                                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              >
                                <div className="rounded-full bg-primary p-3 text-dk-bg shadow-glow-sm transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                  <Play className="h-5 w-5 fill-dk-bg text-dk-bg ml-0.5" />
                                </div>
                              </Link>
                            )}
                            <span className="absolute left-3 top-3 rounded-full bg-black/60 border border-white/10 px-2.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
                              {item.category}
                            </span>
                            {item.duration && (
                              <span className="absolute right-3 bottom-3 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-white backdrop-blur-sm">
                                {item.duration}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-display text-sm font-bold text-white group-hover:text-primary transition-colors">
                                {item.title}
                              </h4>
                              <span className="rounded-full bg-white/[0.03] border border-white/5 px-2 py-0.5 text-[8px] font-mono uppercase tracking-wider text-dk-muted">
                                {item.type}
                              </span>
                            </div>
                            {item.description && (
                              <p className="text-[11px] text-dk-muted mt-1.5 leading-relaxed line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                          {/* Actions */}
                          <div className="flex items-center justify-end gap-1.5 border-t border-white/5 pt-3.5 mt-auto">
                            <button
                              onClick={() => openEditModal(item)}
                              aria-label={`Edit ${item.id}`}
                              className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              aria-label={`Delete ${item.id}`}
                              className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* POSTERS CARD */}
                      {activeTab === "posters" && (
                        <div className="flex flex-col h-full space-y-4 w-full">
                          {/* Poster preview */}
                          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.title || "Poster Image"}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-primary">
                                <ImageIcon className="h-8 w-8 opacity-40" />
                              </div>
                            )}
                            <span className="absolute left-3 top-3 rounded-full bg-black/60 border border-white/10 px-2.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
                              {item.category}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-display text-sm font-bold text-white group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <span className="rounded bg-white/[0.03] border border-white/5 px-2 py-0.5 text-[9px] font-mono text-white/55">
                                Aspect: {item.aspect}
                              </span>
                              <span className="rounded bg-white/[0.03] border border-white/5 px-2 py-0.5 text-[9px] font-mono text-white/55">
                                Palette: {item.palette}
                              </span>
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center justify-end gap-1.5 border-t border-white/5 pt-3.5 mt-auto">
                            <button
                              onClick={() => openEditModal(item)}
                              aria-label={`Edit ${item.id}`}
                              className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              aria-label={`Delete ${item.id}`}
                              className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STATS CARD */}
                      {activeTab === "stats" && (
                        <div className="flex flex-col h-full justify-between w-full">
                          <div>
                            <span className="font-mono text-[9px] text-white/30 block uppercase tracking-wider">
                              {item.id}
                            </span>
                            <h4 className="font-display text-3xl font-bold text-white mt-2 group-hover:text-primary transition-colors">
                              {item.value}
                              <span className="text-lg text-primary ml-0.5">{item.suffix}</span>
                            </h4>
                            <p className="text-xs text-dk-muted mt-2 font-medium">
                              {item.label}
                            </p>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center justify-end gap-1.5 border-t border-white/5 pt-3 mt-4">
                            <button
                              onClick={() => openEditModal(item)}
                              aria-label={`Edit ${item.id}`}
                              className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              aria-label={`Delete ${item.id}`}
                              className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* TESTIMONIALS CARD */}
                      {activeTab === "testimonials" && (
                        <div className="flex flex-col h-full justify-between space-y-4 w-full">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase">
                                {item.initials || (item.name ? item.name.substring(0, 2) : "C")}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white leading-tight">
                                  {item.name}
                                </h4>
                                <span className="text-[10px] text-dk-muted block mt-0.5">
                                  {item.role} {item.company ? `at ${item.company}` : ""}
                                </span>
                              </div>
                            </div>
                            {/* Rating Stars */}
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: item.rating || 5 }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs italic leading-relaxed text-white/70 border-l-2 border-primary/20 pl-3">
                            &ldquo;{item.quote}&rdquo;
                          </p>
                          {/* Actions */}
                          <div className="flex items-center justify-end gap-1.5 border-t border-white/5 pt-3.5 mt-auto">
                            <button
                              onClick={() => openEditModal(item)}
                              aria-label={`Edit ${item.id}`}
                              className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              aria-label={`Delete ${item.id}`}
                              className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* PROCESS CARD */}
                      {activeTab === "process" && (
                        <div className="flex flex-col h-full w-full">
                          <div className="flex items-center justify-between">
                            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[9px] font-mono font-bold text-primary uppercase">
                              Step {item.step}
                            </span>
                            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-2 text-dk-muted">
                              {(() => {
                                const IconComponent = resolveIcon(item.icon);
                                return <IconComponent className="h-4 w-4" />;
                              })()}
                            </div>
                          </div>
                          <div className="mt-4">
                            <h4 className="font-display text-sm font-bold text-white group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-dk-muted mt-1.5 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center justify-end gap-1.5 border-t border-white/5 pt-3.5 mt-auto">
                            <button
                              onClick={() => openEditModal(item)}
                              aria-label={`Edit ${item.id}`}
                              className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              aria-label={`Delete ${item.id}`}
                              className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* FEATURES CARD */}
                      {activeTab === "features" && (
                        <div className="flex flex-col h-full w-full">
                          <div className="flex items-start">
                            <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5 text-primary">
                              {(() => {
                                const IconComponent = resolveIcon(item.icon);
                                return <IconComponent className="h-5 w-5" />;
                              })()}
                            </div>
                          </div>
                          <div className="mt-4">
                            <h4 className="font-display text-sm font-bold text-white group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-dk-muted mt-1.5 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center justify-end gap-1.5 border-t border-white/5 pt-3.5 mt-auto">
                            <button
                              onClick={() => openEditModal(item)}
                              aria-label={`Edit ${item.id}`}
                              className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              aria-label={`Delete ${item.id}`}
                              className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* INQUIRIES CARD */}
                      {activeTab === "queries" && (
                        <div className="flex flex-col h-full justify-between space-y-4 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/5 pb-3">
                            <div>
                              <h4 className="text-sm font-bold text-white">
                                {item.name}
                              </h4>
                              <span className="text-[10px] text-dk-muted font-mono block mt-0.5">
                                {item.email} · {item.phone}
                              </span>
                            </div>
                            <span className="self-start rounded-full bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 text-[9px] font-semibold uppercase">
                              {item.category}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-white/50">
                            <div className="rounded bg-white/[0.02] border border-white/5 p-2">
                              <span className="text-dk-muted block uppercase text-[8px] tracking-wider mb-0.5">Timeline</span>
                              {item.priority || "N/A"}
                            </div>
                            {item.subCategory && (
                              <div className="rounded bg-white/[0.02] border border-white/5 p-2">
                                <span className="text-dk-muted block uppercase text-[8px] tracking-wider mb-0.5">Format/Type</span>
                                {item.subCategory}
                              </div>
                            )}
                          </div>

                          <p className="text-xs leading-relaxed text-white/70 italic bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                            &ldquo;{item.details}&rdquo;
                          </p>

                          <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-auto">
                            <span className="text-[9px] font-mono text-white/30">
                              Submitted: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                            </span>
                            <button
                              onClick={() => handleDelete(item.id)}
                              aria-label={`Delete ${item.id}`}
                              className="rounded-full p-2 text-dk-muted hover:bg-white/5 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/5 bg-[#090909] p-6 shadow-glow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 font-display text-lg font-bold text-white">
              {editingItem ? "Edit Item" : "Add New Item"}
            </h3>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              {/* ID (Read-only on edit) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                  Unique ID
                </label>
                <input
                  type="text"
                  required
                  disabled={!!editingItem}
                  value={formFields.id || ""}
                  onChange={(e) => handleFieldChange("id", e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none disabled:opacity-50"
                />
              </div>

              {/* SERVICES TAB FIELDS */}
              {activeTab === "services" && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Service Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.title || ""}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Description
                    </label>
                    <textarea
                      required
                      value={formFields.description || ""}
                      onChange={(e) => handleFieldChange("description", e.target.value)}
                      rows={3}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Lucide Icon
                      </label>
                      <div className="relative">
                        <select
                          value={formFields.icon || "Code2"}
                          onChange={(e) => handleFieldChange("icon", e.target.value)}
                          className="w-full appearance-none rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 pr-8 text-sm text-white focus:border-primary/50 focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
                          style={{ backgroundImage: 'none' }}
                        >
                          {AVAILABLE_ICONS.map((ic) => (
                            <option key={ic} value={ic} className="bg-[#111111]">
                              {ic}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dk-muted" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Key Features (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formFields.features || ""}
                      onChange={(e) => handleFieldChange("features", e.target.value)}
                      placeholder="Next.js & React, APIs, responsive"
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Action Behavior
                      </label>
                      <div className="relative">
                        <select
                          value={formFields.actionType || "popup"}
                          onChange={(e) => handleFieldChange("actionType", e.target.value)}
                          className="w-full appearance-none rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 pr-8 text-sm text-white focus:border-primary/50 focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
                          style={{ backgroundImage: 'none' }}
                        >
                          <option value="popup" className="bg-[#111111]">Popup Quote Modal</option>
                          <option value="link" className="bg-[#111111]">External URL Link</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dk-muted" />
                      </div>
                    </div>
                  </div>

                  {formFields.actionType === "link" && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        External Link URL
                      </label>
                      <input
                        type="text"
                        required
                        value={formFields.externalLink || ""}
                        onChange={(e) => handleFieldChange("externalLink", e.target.value)}
                        placeholder="https://example.com/service"
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                  )}
                </>
              )}

              {/* PROJECTS TAB FIELDS */}
              {activeTab === "projects" && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Project Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.title || ""}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          value={formFields.category || "Web Development"}
                          onChange={(e) => handleFieldChange("category", e.target.value)}
                          className="w-full appearance-none rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 pr-8 text-sm text-white focus:border-primary/50 focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
                          style={{ backgroundImage: 'none' }}
                        >
                          <option value="Web Development" className="bg-[#111111]">Web Development</option>
                          <option value="Mobile Apps" className="bg-[#111111]">Mobile Apps</option>
                          <option value="Both" className="bg-[#111111]">Both</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dk-muted" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Accent Theme
                      </label>
                      <div className="relative">
                        <select
                          value={formFields.accent || "gold"}
                          onChange={(e) => handleFieldChange("accent", e.target.value)}
                          className="w-full appearance-none rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 pr-8 text-sm text-white focus:border-primary/50 focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
                          style={{ backgroundImage: 'none' }}
                        >
                          <option value="gold" className="bg-[#111111]">Gold</option>
                          <option value="silver" className="bg-[#111111]">Silver</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dk-muted" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Description
                    </label>
                    <textarea
                      required
                      value={formFields.description || ""}
                      onChange={(e) => handleFieldChange("description", e.target.value)}
                      rows={3}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Lucide Icon
                      </label>
                      <div className="relative">
                        <select
                          value={formFields.icon || "GraduationCap"}
                          onChange={(e) => handleFieldChange("icon", e.target.value)}
                          className="w-full appearance-none rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 pr-8 text-sm text-white focus:border-primary/50 focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
                          style={{ backgroundImage: 'none' }}
                        >
                          {AVAILABLE_ICONS.map((ic) => (
                            <option key={ic} value={ic} className="bg-[#111111]">
                              {ic}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dk-muted" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Tech Stack (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formFields.tech || ""}
                        onChange={(e) => handleFieldChange("tech", e.target.value)}
                        placeholder="Next.js, TypeScript, Tailwind"
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Live Demo URL
                      </label>
                      <input
                        type="text"
                        value={formFields.liveUrl || ""}
                        onChange={(e) => handleFieldChange("liveUrl", e.target.value)}
                        placeholder="#"
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        GitHub URL
                      </label>
                      <input
                        type="text"
                        value={formFields.githubUrl || ""}
                        onChange={(e) => handleFieldChange("githubUrl", e.target.value)}
                        placeholder="#"
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Project Thumbnail Image
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formFields.thumbnailUrl || ""}
                        onChange={(e) => handleFieldChange("thumbnailUrl", e.target.value)}
                        placeholder="https://images.unsplash.com/... or /uploads/..."
                        className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                      <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/[0.02] px-4 text-xs font-semibold text-white hover:bg-white/5">
                        {isSaving ? "Saving..." : tempFiles["thumbnailUrl"] ? "Ready to Save" : "Upload Image"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "thumbnailUrl")}
                          disabled={isSaving}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {formFields.thumbnailUrl && (
                      <div className="relative mt-2 aspect-[16/10] w-32 overflow-hidden rounded-lg border border-white/10 bg-neutral-900">
                        <Image
                          src={formFields.thumbnailUrl}
                          alt="Project Thumbnail Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* VIDEOS TAB FIELDS */}
              {activeTab === "videos" && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Video Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.title || ""}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Display Category
                      </label>
                      <input
                        type="text"
                        required
                        value={formFields.category || ""}
                        onChange={(e) => handleFieldChange("category", e.target.value)}
                        placeholder="Reel Preview"
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Duration
                      </label>
                      <input
                        type="text"
                        required
                        value={formFields.duration || ""}
                        onChange={(e) => handleFieldChange("duration", e.target.value)}
                        placeholder="0:30"
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Video Type (Filter)
                    </label>
                    <div className="relative">
                      <select
                        value={formFields.type || "reel"}
                        onChange={(e) => handleFieldChange("type", e.target.value)}
                        className="w-full appearance-none rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 pr-8 text-sm text-white focus:border-primary/50 focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
                        style={{ backgroundImage: 'none' }}
                      >
                        <option value="reel" className="bg-[#111111]">Reel Preview</option>
                        <option value="short" className="bg-[#111111]">YouTube Shorts</option>
                        <option value="motion-graphics" className="bg-[#111111]">Motion Graphics</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dk-muted" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Video URL (YouTube, Vimeo, or raw MP4)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formFields.videoUrl || ""}
                        onChange={(e) => handleFieldChange("videoUrl", e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... or /uploads/..."
                        className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                      <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/[0.02] px-4 text-xs font-semibold text-white hover:bg-white/5">
                        {isSaving ? "Saving..." : tempFiles["videoUrl"] ? "Ready to Save" : "Upload MP4"}
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleFileUpload(e, "videoUrl")}
                          disabled={isSaving}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Thumbnail Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formFields.thumbnailUrl || ""}
                        onChange={(e) => handleFieldChange("thumbnailUrl", e.target.value)}
                        placeholder="https://images.unsplash.com/... or /uploads/..."
                        className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                      <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/[0.02] px-4 text-xs font-semibold text-white hover:bg-white/5">
                        {isSaving ? "Saving..." : tempFiles["thumbnailUrl"] ? "Ready to Save" : "Upload Image"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "thumbnailUrl")}
                          disabled={isSaving}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {formFields.thumbnailUrl && (
                      <div className="relative mt-2 aspect-video w-32 overflow-hidden rounded-lg border border-white/10 bg-neutral-900">
                        <Image
                          src={formFields.thumbnailUrl}
                          alt="Thumbnail Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* POSTERS TAB FIELDS */}
              {activeTab === "posters" && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Poster Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.title || ""}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={formFields.category || "Instagram Posters"}
                        onChange={(e) => handleFieldChange("category", e.target.value)}
                        className="w-full appearance-none rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 pr-8 text-sm text-white focus:border-primary/50 focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
                        style={{ backgroundImage: 'none' }}
                      >
                        <option value="Instagram Posters" className="bg-[#111111]">Instagram Posters</option>
                        <option value="Event Posters" className="bg-[#111111]">Event Posters</option>
                        <option value="Promotional Posters" className="bg-[#111111]">Promotional Posters</option>
                        <option value="Business Posters" className="bg-[#111111]">Business Posters</option>
                        <option value="Before / After" className="bg-[#111111]">Before / After</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dk-muted" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Aspect Ratio
                      </label>
                      <div className="relative">
                        <select
                          value={formFields.aspect || "square"}
                          onChange={(e) => handleFieldChange("aspect", e.target.value)}
                          className="w-full appearance-none rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 pr-8 text-sm text-white focus:border-primary/50 focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
                          style={{ backgroundImage: 'none' }}
                        >
                          <option value="square" className="bg-[#111111]">Square (1:1)</option>
                          <option value="portrait" className="bg-[#111111]">Portrait (4:5)</option>
                          <option value="story" className="bg-[#111111]">Story (16:9)</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dk-muted" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Palette
                      </label>
                      <div className="relative">
                        <select
                          value={formFields.palette || "gold"}
                          onChange={(e) => handleFieldChange("palette", e.target.value)}
                          className="w-full appearance-none rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 pr-8 text-sm text-white focus:border-primary/50 focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
                          style={{ backgroundImage: 'none' }}
                        >
                          <option value="gold" className="bg-[#111111]">Gold</option>
                          <option value="silver" className="bg-[#111111]">Silver</option>
                          <option value="mixed" className="bg-[#111111]">Mixed</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dk-muted" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      {formFields.category === "Before / After" ? "After Image URL" : "Poster Image URL"}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formFields.imageUrl || ""}
                        onChange={(e) => handleFieldChange("imageUrl", e.target.value)}
                        placeholder="https://images.unsplash.com/... or /uploads/..."
                        className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                      <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/[0.02] px-4 text-xs font-semibold text-white hover:bg-white/5">
                        {isSaving ? "Saving..." : tempFiles["imageUrl"] ? "Ready to Save" : "Upload Image"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "imageUrl")}
                          disabled={isSaving}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {formFields.imageUrl && (
                      <div className="relative mt-2 aspect-video w-32 overflow-hidden rounded-lg border border-white/10 bg-neutral-900">
                        <Image
                          src={formFields.imageUrl}
                          alt="After Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {formFields.category === "Before / After" && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Before Image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formFields.beforeImageUrl || ""}
                          onChange={(e) => handleFieldChange("beforeImageUrl", e.target.value)}
                          placeholder="https://images.unsplash.com/... or /uploads/..."
                          className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                        />
                        <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/[0.02] px-4 text-xs font-semibold text-white hover:bg-white/5">
                          {isSaving ? "Saving..." : tempFiles["beforeImageUrl"] ? "Ready to Save" : "Upload Before"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, "beforeImageUrl")}
                            disabled={isSaving}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {formFields.beforeImageUrl && (
                        <div className="relative mt-2 aspect-video w-32 overflow-hidden rounded-lg border border-white/10 bg-neutral-900">
                          <Image
                            src={formFields.beforeImageUrl}
                            alt="Before Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* STATS TAB FIELDS */}
              {activeTab === "stats" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Counter Value
                      </label>
                      <input
                        type="number"
                        required
                        value={formFields.value === undefined ? "" : formFields.value}
                        onChange={(e) => handleFieldChange("value", e.target.value)}
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Suffix
                      </label>
                      <input
                        type="text"
                        required
                        value={formFields.suffix || ""}
                        onChange={(e) => handleFieldChange("suffix", e.target.value)}
                        placeholder="+"
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Label Description
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.label || ""}
                      onChange={(e) => handleFieldChange("label", e.target.value)}
                      placeholder="Projects Shipped"
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* TESTIMONIALS TAB FIELDS */}
              {activeTab === "testimonials" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Client Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formFields.name || ""}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Initials
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={3}
                        value={formFields.initials || ""}
                        onChange={(e) => handleFieldChange("initials", e.target.value.toUpperCase())}
                        placeholder="AR"
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Job Role
                      </label>
                      <input
                        type="text"
                        required
                        value={formFields.role || ""}
                        onChange={(e) => handleFieldChange("role", e.target.value)}
                        placeholder="Founder"
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Company Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formFields.company || ""}
                        onChange={(e) => handleFieldChange("company", e.target.value)}
                        placeholder="Lumen Studio"
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Rating (1-5 Stars)
                      </label>
                      <div className="relative">
                        <select
                          value={formFields.rating || 5}
                          onChange={(e) => handleFieldChange("rating", e.target.value)}
                          className="w-full appearance-none rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 pr-8 text-sm text-white focus:border-primary/50 focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
                          style={{ backgroundImage: 'none' }}
                        >
                          <option value="5" className="bg-[#111111]">5 Stars</option>
                          <option value="4" className="bg-[#111111]">4 Stars</option>
                          <option value="3" className="bg-[#111111]">3 Stars</option>
                          <option value="2" className="bg-[#111111]">2 Stars</option>
                          <option value="1" className="bg-[#111111]">1 Star</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dk-muted" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Quote
                    </label>
                    <textarea
                      required
                      value={formFields.quote || ""}
                      onChange={(e) => handleFieldChange("quote", e.target.value)}
                      rows={3}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none resize-none"
                    />
                  </div>
                </>
              )}

              {/* PROCESS TAB FIELDS */}
              {activeTab === "process" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Step Number
                      </label>
                      <input
                        type="text"
                        required
                        value={formFields.step || ""}
                        onChange={(e) => handleFieldChange("step", e.target.value)}
                        placeholder="01"
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                        Lucide Icon
                      </label>
                      <div className="relative">
                        <select
                          value={formFields.icon || "MessageCircle"}
                          onChange={(e) => handleFieldChange("icon", e.target.value)}
                          className="w-full appearance-none rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 pr-8 text-sm text-white focus:border-primary/50 focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
                          style={{ backgroundImage: 'none' }}
                        >
                          {AVAILABLE_ICONS.map((ic) => (
                            <option key={ic} value={ic} className="bg-[#111111]">
                              {ic}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dk-muted" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Step Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.title || ""}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Description
                    </label>
                    <textarea
                      required
                      value={formFields.description || ""}
                      onChange={(e) => handleFieldChange("description", e.target.value)}
                      rows={3}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none resize-none"
                    />
                  </div>
                </>
              )}

              {/* FEATURES TAB FIELDS */}
              {activeTab === "features" && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Feature Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.title || ""}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Lucide Icon
                    </label>
                    <div className="relative">
                      <select
                        value={formFields.icon || "Zap"}
                        onChange={(e) => handleFieldChange("icon", e.target.value)}
                        className="w-full appearance-none rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 pr-8 text-sm text-white focus:border-primary/50 focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
                        style={{ backgroundImage: 'none' }}
                      >
                        {AVAILABLE_ICONS.map((ic) => (
                          <option key={ic} value={ic} className="bg-[#111111]">
                            {ic}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dk-muted" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-dk-muted">
                      Description
                    </label>
                    <textarea
                      required
                      value={formFields.description || ""}
                      onChange={(e) => handleFieldChange("description", e.target.value)}
                      rows={3}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none resize-none"
                    />
                  </div>
                </>
              )}

              {/* Form Buttons */}
              <div className="mt-4 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="rounded-xl border border-white/15 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-gold-gradient px-4 py-2.5 text-xs font-bold text-dk-bg shadow-glow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
