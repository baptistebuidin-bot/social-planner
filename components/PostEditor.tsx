"use client";

import { useState } from "react";
import {
  ALL_PLATFORM_KEYS,
  ALL_STATUS_KEYS,
 PLATFORMS,
  STATUSES,
} from "@/lib/constants";
import type { PlatformKey, StatusKey } from "@/lib/constants";
import type { Post, PostForm } from "@/lib/types";

function emptyForm(dateISO: string): PostForm {
  return {
    title: "",
    content: "",
    platform: "INSTAGRAM",
    status: "TO_WRITE",
    plannedDate: dateISO.slice(0, 10),
    mediaNote: "",
    metaPostId: "",
    impressions: 0,
    reach: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    clicks: 0,
  };
}

function postToForm(post: Post): PostForm {
  return {
    title: post.title,
    content: post.content,
    platform: post.platform,
    status: post.status,
    plannedDate: post.plannedDate.slice(0, 10),
    mediaNote: post.mediaNote,
    metaPostId: post.metaPostId ?? "",
    impressions: post.impressions,
    reach: post.reach,
    likes: post.likes,
    comments: post.comments,
    shares: post.shares,
    clicks: post.clicks,
  };
}

export default function PostEditor({
  post,
  defaultDate,
  onClose,
  onSaved,
}: {
  post: Post | null;
  defaultDate: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<PostForm>(() =>
    post ? postToForm(post) : emptyForm(defaultDate)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof PostForm>(key: K, value: PostForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function handleSave() {
    if (!form.title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        plannedDate: `${form.plannedDate}T12:00:00`,
        metaPostId: form.metaPostId || undefined,
      };
      const res = await fetch(
        post ? `/api/posts/${post.id}` : "/api/posts",
        {
          method: post ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur lors de l'enregistrement.");
      }
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!post || !confirm("Supprimer définitivement cette publication ?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Suppression impossible.");
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue.");
      setSaving(false);
    }
  }

  const isPublished = form.status === "PUBLISHED";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            {post ? "Modifier la publication" : "Nouvelle publication"}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Titre *</span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            placeholder="Ex : Portrait du nouvel arrivant"
          />
        </label>

        <div className="mb-3 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Plateforme</span>
            <select
              value={form.platform}
              onChange={(e) => set("platform", e.target.value as PlatformKey)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              {ALL_PLATFORM_KEYS.map((key) => (
                <option key={key} value={key}>
                  {PLATFORMS[key].label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Date planifiée</span>
            <input
              type="date"
              value={form.plannedDate}
              onChange={(e) => set("plannedDate", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Statut</span>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value as StatusKey)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {ALL_STATUS_KEYS.map((key) => (
              <option key={key} value={key}>
                {STATUSES[key].label}
              </option>
            ))}
          </select>
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Texte du post</span>
          <textarea
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            rows={4}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Rédigez la légende, les hashtags…"
          />
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Notes visuel / média
          </span>
          <input
            type="text"
            value={form.mediaNote}
            onChange={(e) => set("mediaNote", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Ex : photo équipe, format carré 1080×1080"
          />
        </label>

        {isPublished && (
          <div className="mb-3 rounded-lg bg-slate-50 p-3">
            <p className="mb-2 text-sm font-medium text-slate-700">
              Performance (saisie manuelle ou synchronisée depuis Meta)
            </p>
            <div className="mb-2 grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-xs text-slate-500">ID du post Meta</span>
                <input
                  type="text"
                  value={form.metaPostId}
                  onChange={(e) => set("metaPostId", e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                  placeholder="Ex : 1234567890_98765432"
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-500">Portée</span>
                <input
                  type="number"
                  min={0}
                  value={form.reach}
                  onChange={(e) => set("reach", Number(e.target.value))}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-500">J’aime / réactions</span>
                <input
                  type="number"
                  min={0}
                  value={form.likes}
                  onChange={(e) => set("likes", Number(e.target.value))}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-500">Commentaires</span>
                <input
                  type="number"
                  min={0}
                  value={form.comments}
                  onChange={(e) => set("comments", Number(e.target.value))}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-500">Partages</span>
                <input
                  type="number"
                  min={0}
                  value={form.shares}
                  onChange={(e) => set("shares", Number(e.target.value))}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-500">Clics</span>
                <input
                  type="number"
                  min={0}
                  value={form.clicks}
                  onChange={(e) => set("clicks", Number(e.target.value))}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                />
              </label>
            </div>
          </div>
        )}

        {error && (
          <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <div className="mt-4 flex items-center justify-between">
          {post ? (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Supprimer
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
