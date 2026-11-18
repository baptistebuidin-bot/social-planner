"use client";

import { useCallback, useEffect, useState } from "react";
import CalendarView from "@/components/CalendarView";
import BoardView from "@/components/BoardView";
import PerformanceView from "@/components/PerformanceView";
import PostEditor from "@/components/PostEditor";
import { ALL_PLATFORM_KEYS, PLATFORMS } from "@/lib/constants";
import type { PlatformKey, StatusKey } from "@/lib/constants";
import type { Post } from "@/lib/types";

type Tab = "calendar" | "board" | "performance";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("calendar");
  const [editing, setEditing] = useState<Post | null>(null);
  const [creatingDate, setCreatingDate] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState<PlatformKey | "ALL">("ALL");

  const refresh = useCallback(async () => {
    const res = await fetch("/api/posts");
    setPosts(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleStatusChange(post: Post, status: StatusKey) {
    await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refresh();
  }

  const filtered =
    platformFilter === "ALL"
      ? posts
      : posts.filter((p) => p.platform === platformFilter);

  const toWriteCount = posts.filter(
    (p) => p.status === "TO_WRITE" || p.status === "IN_PROGRESS"
  ).length;

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: "calendar", label: "Calendrier" },
    { key: "board", label: "État des publications", badge: toWriteCount || undefined },
    { key: "performance", label: "Performance" },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              📅 Planning éditorial réseaux sociaux
            </h1>
            <p className="text-xs text-slate-500">
              Calendrier, suivi de production et performance — Facebook · Instagram · LinkedIn
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as PlatformKey | "ALL")}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="ALL">Toutes les plateformes</option>
              {ALL_PLATFORM_KEYS.map((key) => (
                <option key={key} value={key}>
                  {PLATFORMS[key].label}
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                setCreatingDate(`${new Date().toISOString().slice(0, 10)}T12:00:00`)
              }
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              ＋ Nouvelle publication
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 px-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium ${
                tab === t.key
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
              {t.badge !== undefined && (
                <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">
        {loading ? (
          <p className="py-20 text-center text-sm text-slate-500">Chargement…</p>
        ) : tab === "calendar" ? (
          <CalendarView
            posts={filtered}
            onEdit={setEditing}
            onAdd={(date) => setCreatingDate(date)}
          />
        ) : tab === "board" ? (
          <BoardView
            posts={filtered}
            onEdit={setEditing}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <PerformanceView posts={filtered} />
        )}
      </main>

      {(editing || creatingDate) && (
        <PostEditor
          post={editing}
          defaultDate={creatingDate ?? new Date().toISOString()}
          onClose={() => {
            setEditing(null);
            setCreatingDate(null);
          }}
          onSaved={refresh}
        />
      )}
    </div>
  );
}
