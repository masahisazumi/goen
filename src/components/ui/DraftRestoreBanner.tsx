"use client";

import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  show: boolean;
  savedAt?: number | null;
  onDiscard: () => void;
};

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "たった今";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}分前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}時間前`;
  const day = Math.floor(hour / 24);
  return `${day}日前`;
}

export function DraftRestoreBanner({ show, savedAt, onDiscard }: Props) {
  if (!show) return null;
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100 text-sm">
      <div className="flex items-center gap-2 text-blue-900 min-w-0">
        <FileText className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">
          入力途中のデータを復元しました
          {savedAt && (
            <span className="ml-1 text-blue-700/70">
              （{formatRelative(savedAt)}）
            </span>
          )}
        </span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-blue-900 hover:bg-blue-100 h-7 flex-shrink-0"
        onClick={onDiscard}
      >
        <X className="h-3.5 w-3.5 mr-1" />
        破棄
      </Button>
    </div>
  );
}
