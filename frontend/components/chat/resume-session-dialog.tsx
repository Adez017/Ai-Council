'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Clock, MessageSquare } from 'lucide-react';

interface ResumeSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResume: () => void;
  onStartNew: () => void;
  messageCount?: number;
  lastUpdated?: number;
}

export function ResumeSessionDialog({
  open,
  onOpenChange,
  onResume,
  onStartNew,
  messageCount = 0,
  lastUpdated,
}: ResumeSessionDialogProps) {
  const formatLastUpdated = (timestamp?: number) => {
    if (!timestamp) return 'recently';

    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Resume Last Session?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You have a previous conversation that was saved {formatLastUpdated(lastUpdated)}.
            </p>
            {messageCount > 0 && (
              <div className="flex items-center gap-2 text-sm bg-muted p-3 rounded-md">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>
                  <strong>{messageCount}</strong> message{messageCount !== 1 ? 's' : ''} in conversation
                </span>
              </div>
            )}
            <p className="text-sm">
              Would you like to continue where you left off, or start a new conversation?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onStartNew}>
            Start New
          </AlertDialogCancel>
          <AlertDialogAction onClick={onResume}>
            Resume Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
