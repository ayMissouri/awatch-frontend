"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateProfile } from "@/hooks/use-profile";
import { t } from "@/i18n";

const MAX_DISPLAY_NAME = 50;

const DEFAULT_TRIGGER_CLASS =
  "inline-flex h-9 items-center gap-2 border border-white/40 bg-black/30 px-3 text-[13px] font-medium text-white transition-colors hover:bg-black/45";

export function EditProfileDialog({
  displayName,
  username,
  triggerClassName = DEFAULT_TRIGGER_CLASS,
}: {
  displayName: string;
  username: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(displayName);
  const update = useUpdateProfile();

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setName(displayName);
      update.reset();
    }
  };

  const save = () => {
    update.mutate(name.trim(), { onSuccess: () => setOpen(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button type="button" className={triggerClassName}>
          <Settings size={15} />
          {t.profile.editProfile}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.profile.edit.title}</DialogTitle>
          <DialogDescription>{t.profile.edit.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="display-name"
            className="font-mono text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase"
          >
            {t.profile.edit.displayNameLabel}
          </label>
          <input
            id="display-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MAX_DISPLAY_NAME}
            placeholder={username}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                save();
              }
            }}
            className="h-10 border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-white/40"
          />
          <span className="font-mono text-[10px] text-muted-foreground/70">
            {t.profile.edit.hint(username)}
          </span>
          {update.isError && (
            <span className="text-[13px] text-destructive">
              {t.profile.edit.error}
            </span>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t.profile.edit.cancel}</Button>
          </DialogClose>
          <Button onClick={save} disabled={update.isPending}>
            {update.isPending ? t.profile.edit.saving : t.profile.edit.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
