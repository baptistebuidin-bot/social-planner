"use client";

import { PLATFORMS, STATUSES, STATUS_ORDER } from "@/lib/constants";
import type { StatusKey } from "@/lib/constants";
import type { Post } from "@/lib/types";

export default function BoardView({
  posts,
  onEdit,
  onStatusChange,
}: {
  posts: Post[];
  onEdit: (post: Post) => void;
  onStatusChange: (post: Post, status: StatusKey) => void;
}) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-slate-800">
        Suivi des publications
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {STATUS_ORDER.map((status) => {
          const columnPosts = posts
            .filter((p) => p.status === status)
            .sort((a, b) => a.plannedDate.localeCompare(b.plannedDate));
          return (
            <div
              key={status}
              className={`flex min-h-48 flex-col rounded-xl p-2 ${STATUSES[status].column}`}
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-sm font-semibold text-slate-700">
                  {STATUSES[status].label}
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500">
                  {columnPosts.length}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                {columnPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm"
                  >
                    <button onClick={() => onEdit(post)} className="w-full text-left">
                      <div className="mb-1 flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${PLATFORMS[post.platform].dot}`}
                        />
                        <span className="text-[11px] font-medium text-slate-500">
                          {PLATFORMS[post.platform].label}
                        </span>
                        <span className="ml-auto text-[11px] text-slate-400">
                          {new Date(post.plannedDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                      <p className="text-sm font-semibold leading-snug text-slate-800">
                        {post.title}
                      </p>
                      {post.mediaNote && (
                        <p className="mt-1 truncate text-[11px] text-slate-500">
                          🎨 {post.mediaNote}
                        </p>
                      )}
                    </button>
                    <select
                      value={post.status}
                      onChange={(e) =>
                        onStatusChange(post, e.target.value as StatusKey)
                      }
                      className="mt-2 w-full rounded border border-slate-200 bg-slate-50 px-1.5 py-1 text-[11px] text-slate-600"
                    >
                      {STATUS_ORDER.map((key) => (
                        <option key={key} value={key}>
                          {STATUSES[key].label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                {columnPosts.length === 0 && (
                  <p className="px-1 py-3 text-center text-xs text-slate-400">
                    Aucune publication
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
