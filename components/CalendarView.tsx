"use client";

import { useMemo, useState } from "react";
import { MONTH_NAMES, PLATFORMS, STATUSES, WEEKDAYS } from "@/lib/constants";
import type { Post } from "@/lib/types";

export function toLocalDay(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function CalendarView({
  posts,
  onEdit,
  onAdd,
}: {
  posts: Post[];
  onEdit: (post: Post) => void;
  onAdd: (dateISO: string) => void;
}) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const byDay = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const post of posts) {
      const key = toLocalDay(post.plannedDate);
      const list = map.get(key) ?? [];
      list.push(post);
      map.set(key, list);
    }
    for (const list of Array.from(map.values())) {
      list.sort((a, b) => a.plannedDate.localeCompare(b.plannedDate));
    }
    return map;
  }, [posts]);

  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const lead = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: (string | null)[] = Array(lead).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      result.push(
        `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      );
    }
    while (result.length % 7 !== 0) result.push(null);
    return result;
  }, [year, month]);

  const go = (delta: number) => {
    const m = month + delta;
    if (m < 0) {
      setMonth(11);
      setYear(year - 1);
    } else if (m > 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(m);
    }
  };

  const todayKey = toLocalDay(today.toISOString());

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">
          {MONTH_NAMES[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => go(-1)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
            aria-label="Mois précédent"
          >
            ←
          </button>
          <button
            onClick={() => {
              setYear(today.getFullYear());
              setMonth(today.getMonth());
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            Aujourd’hui
          </button>
          <button
            onClick={() => go(1)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
            aria-label="Mois suivant"
          >
            →
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((key, index) => {
            if (!key)
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-24 border-b border-r border-slate-100 bg-slate-50/50"
                />
              );
            const dayPosts = byDay.get(key) ?? [];
            const dayNumber = Number(key.slice(-2));
            const isToday = key === todayKey;
            const isWeekend = index % 7 >= 5;
            return (
              <div
                key={key}
                className={`group relative min-h-24 border-b border-r border-slate-100 p-1.5 ${
                  isWeekend ? "bg-slate-50/70" : ""
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      isToday ? "bg-indigo-600 text-white" : "text-slate-600"
                    }`}
                  >
                    {dayNumber}
                  </span>
                  <button
                    onClick={() => onAdd(`${key}T12:00:00`)}
                    className="hidden h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 group-hover:flex"
                    aria-label="Ajouter une publication"
                    title="Ajouter une publication"
                  >
                    ＋
                  </button>
                </div>
                <div className="space-y-1">
                  {dayPosts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => onEdit(post)}
                      className="block w-full truncate rounded px-1.5 py-1 text-left text-[11px] font-medium hover:opacity-80"
                      style={{
                        backgroundColor: `${PLATFORMS[post.platform].color}18`,
                        color: PLATFORMS[post.platform].color,
                        borderLeft: `3px solid ${PLATFORMS[post.platform].color}`,
                      }}
                      title={`${PLATFORMS[post.platform].label} — ${
                        STATUSES[post.status].label
                      } — ${post.title}`}
                    >
                      {post.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
