"use client";

import { useMemo, useState } from "react";
import { PLATFORMS } from "@/lib/constants";
import type { Post } from "@/lib/types";

function formatNumber(n: number): string {
  return n.toLocaleString("fr-FR");
}

export default function PerformanceView({ posts }: { posts: Post[] }) {
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  const published = useMemo(
    () =>
      posts
        .filter((p) => p.status === "PUBLISHED")
        .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")),
    [posts]
  );

  const totals = useMemo(() => {
    return published.reduce(
      (acc, p) => ({
        impressions: acc.impressions + p.impressions,
        reach: acc.reach + p.reach,
        likes: acc.likes + p.likes,
        comments: acc.comments + p.comments,
        shares: acc.shares + p.shares,
        clicks: acc.clicks + p.clicks,
      }),
      { impressions: 0, reach: 0, likes: 0, comments: 0, shares: 0, clicks: 0 }
    );
  }, [published]);

  const engagements = totals.likes + totals.comments + totals.shares + totals.clicks;
  const engagementRate =
    totals.impressions > 0 ? ((engagements / totals.impressions) * 100).toFixed(1) : "—";

  async function handleSync() {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/meta/sync", { method: "POST" });
      const data = await res.json();
      setSyncMessage({ ok: data.configured, text: data.message });
    } catch {
      setSyncMessage({ ok: false, text: "La synchronisation a échoué." });
    } finally {
      setSyncing(false);
    }
  }

  const maxImpressions = Math.max(1, ...published.map((p) => p.impressions));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Performance des publications</h2>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {syncing ? "Synchronisation…" : "Synchroniser avec Meta"}
        </button>
      </div>

      {!syncMessage && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          💡 La synchronisation automatique nécessite une connexion Meta. En attendant,
          vous pouvez saisir les métriques manuellement dans chaque publication marquée
          « Publiée ».
        </div>
      )}
      {syncMessage && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${
            syncMessage.ok
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {syncMessage.text}
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Publications publiées", value: formatNumber(published.length) },
          { label: "Impressions totales", value: formatNumber(totals.impressions) },
          { label: "Portée totale", value: formatNumber(totals.reach) },
          { label: "Taux d'engagement", value: `${engagementRate} %` },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {kpi.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4">
        {[
          { label: "J’aime", value: totals.likes, color: "text-pink-600" },
          { label: "Commentaires", value: totals.comments, color: "text-blue-600" },
          { label: "Partages", value: totals.shares, color: "text-violet-600" },
          { label: "Clics", value: totals.clicks, color: "text-emerald-600" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {kpi.label}
            </p>
            <p className={`mt-1 text-xl font-bold ${kpi.color}`}>
              {formatNumber(kpi.value)}
            </p>
          </div>
        ))}
      </div>

      {published.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Aucune publication marquée « Publiée » pour le moment.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2.5 text-left">Publication</th>
                <th className="px-4 py-2.5 text-left">Plateforme</th>
                <th className="px-4 py-2.5 text-right">Impressions</th>
                <th className="px-4 py-2.5 text-right">Portée</th>
                <th className="px-4 py-2.5 text-right">J’aime</th>
                <th className="px-4 py-2.5 text-right">Comm.</th>
                <th className="px-4 py-2.5 text-right">Partages</th>
                <th className="px-4 py-2.5 text-right">Clics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {published.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50">
                  <td className="max-w-56 px-4 py-2.5">
                    <p className="truncate font-medium text-slate-800">{post.title}</p>
                    <p className="truncate text-xs text-slate-400">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                          })
                        : "—"}
                    </p>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PLATFORMS[post.platform].badge}`}>
                      {PLATFORMS[post.platform].label}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    <div className="flex items-center justify-end gap-2">
                      <span
                        className="hidden h-1.5 rounded-full bg-indigo-500 lg:block"
                        style={{
                          width: `${Math.max(4, (post.impressions / maxImpressions) * 60)}px`,
                        }}
                      />
                      {formatNumber(post.impressions)}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{formatNumber(post.reach)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{formatNumber(post.likes)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{formatNumber(post.comments)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{formatNumber(post.shares)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{formatNumber(post.clicks)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
