"use client";

import { useState, type FormEvent } from "react";
import { CircleAlert, Loader2, Trash2 } from "lucide-react";
import { deleteJourneyAction, saveJourneyAction } from "@/actions/journey";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { ICON_LABEL, JOURNEY_ICON_NAMES, JOURNEY_STATUSES, LAYERS, STATUS_LABEL, type JourneyStatus } from "@/lib/journey-model";
import type { JourneyMilestone } from "@/lib/types";
import JourneyBullets from "./journey-bullets";

/** The fields of one month. Its photos and badge are kept as they are. */
export default function JourneyEditForm({
  m,
  onSaved,
  onDeleted,
}: {
  m: JourneyMilestone;
  onSaved: (entry: JourneyMilestone) => void;
  onDeleted: (slug: string) => void;
}) {
  const [period, setPeriod] = useState(m.period);
  const [layer, setLayer] = useState(m.layer ? String(m.layer) : "");
  const [title, setTitle] = useState(m.title);
  const [summary, setSummary] = useState(m.summary ?? "");
  const [points, setPoints] = useState<string[]>(m.points);
  const [icon, setIcon] = useState(m.icon);
  const [status, setStatus] = useState<JourneyStatus>((m.status as JourneyStatus) ?? "completed");
  const [busy, setBusy] = useState<"save" | "delete" | null>(null);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function save(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy("save");
    const cleanPoints = points.map((p) => p.trim()).filter(Boolean);
    const layerNumber = layer ? Number(layer) : null;
    const res = await saveJourneyAction({ slug: m.slug, period, layer: layerNumber, title, summary, points: cleanPoints, icon, status });
    setBusy(null);
    if (!res.ok) return setError(res.message);
    onSaved({
      ...m,
      period: period.trim(),
      layer: layerNumber,
      title: title.trim(),
      summary: summary.trim() || null,
      points: cleanPoints,
      icon,
      status,
    });
  }

  async function remove() {
    if (!confirmDelete) return setConfirmDelete(true);
    setBusy("delete");
    const res = await deleteJourneyAction(m.slug);
    setBusy(null);
    if (!res.ok) return setError(res.message);
    onDeleted(m.slug);
  }

  return (
    <form onSubmit={save} className="grid gap-4" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor={`j-period-${m.slug}`}>Month and year</Label>
        <Input id={`j-period-${m.slug}`} value={period} onChange={(e) => setPeriod(e.target.value)} maxLength={40} placeholder="For example: June 2026" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor={`j-layer-${m.slug}`}>Layer</Label>
          <NativeSelect id={`j-layer-${m.slug}`} value={layer} onChange={(e) => setLayer(e.target.value)}>
            <option value="">None</option>
            {LAYERS.map((n) => (
              <option key={n} value={String(n)}>
                Layer {n}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`j-status-${m.slug}`}>Status</Label>
          <NativeSelect id={`j-status-${m.slug}`} value={status} onChange={(e) => setStatus(e.target.value as JourneyStatus)}>
            {JOURNEY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`j-title-${m.slug}`}>Title</Label>
        <Input id={`j-title-${m.slug}`} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={160} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`j-summary-${m.slug}`}>Description</Label>
        <Textarea id={`j-summary-${m.slug}`} value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={1200} rows={4} />
        <p className="text-xs text-muted-foreground">Use **double asterisks** around a phrase to make it bold.</p>
      </div>
      <div className="grid gap-1.5">
        <Label>Bullet points</Label>
        <JourneyBullets value={points} onChange={setPoints} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`j-icon-${m.slug}`}>Icon</Label>
        <NativeSelect id={`j-icon-${m.slug}`} value={icon} onChange={(e) => setIcon(e.target.value)}>
          {JOURNEY_ICON_NAMES.map((name) => (
            <option key={name} value={name}>
              {ICON_LABEL[name] ?? name}
            </option>
          ))}
        </NativeSelect>
      </div>
      {error && (
        <Alert variant="destructive">
          <CircleAlert aria-hidden="true" />
          <AlertDescription className="text-foreground">{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <Button type="button" variant="ghost" size="sm" onClick={remove} disabled={busy !== null} className="text-destructive">
          {busy === "delete" ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Trash2 aria-hidden="true" />}
          {confirmDelete ? "Click again to delete this month" : "Delete entry"}
        </Button>
        <Button type="submit" disabled={busy !== null}>
          {busy === "save" && <Loader2 aria-hidden="true" className="animate-spin" />}
          {busy === "save" ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
