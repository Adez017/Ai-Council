'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Eye, EyeOff, Globe, Link2, Code } from 'lucide-react';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
}

export function ShareDialog({ open, onOpenChange, requestId }: ShareDialogProps) {
  const [privacy, setPrivacy] = useState<'public' | 'private' | 'unlisted'>('unlisted');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [shareId, setShareId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const { toast } = useToast();

  const handleCreateShare = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/sharing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          request_id: requestId,
          privacy,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create share link');
      }

      const data = await response.json();
      const fullUrl = `${window.location.origin}/share/${data.share_id}`;
      setShareUrl(fullUrl);
      setShareId(data.share_id);
      setViewCount(data.view_count);
      setIsShared(true);

      toast({
        title: 'Share link created!',
        description: 'Your conversation is now shareable',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create share link',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePrivacy = async (newPrivacy: 'public' | 'private' | 'unlisted') => {
    if (!shareId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sharing/${shareId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            privacy: newPrivacy,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update privacy settings');
      }

      setPrivacy(newPrivacy);
      toast({
        title: 'Privacy updated',
        description: `Conversation is now ${newPrivacy}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update privacy settings',
        variant: 'destructive',
      });
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedUrl(true);
      toast({
        title: 'Copied!',
        description: 'Share link copied to clipboard',
      });
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleCopyEmbed = async () => {
    const embedCode = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0"></iframe>`;
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopiedEmbed(true);
      toast({
        title: 'Copied!',
        description: 'Embed code copied to clipboard',
      });
      setTimeout(() => setCopiedEmbed(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy embed code',
        variant: 'destructive',
      });
    }
  };

  const embedCode = shareUrl
    ? `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0"></iframe>`
    : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Conversation</DialogTitle>
          <DialogDescription>
            Create a shareable link to this conversation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Privacy Settings */}
          <div className="space-y-3">
            <Label>Privacy Settings</Label>
            <RadioGroup
              value={privacy}
              onValueChange={(value) => {
                const newPrivacy = value as 'public' | 'private' | 'unlisted';
                setPrivacy(newPrivacy);
                if (isShared) {
                  handleUpdatePrivacy(newPrivacy);
                }
              }}
            >
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="public" id="public" />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
                    <Globe className="h-4 w-4" />
                    Public
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Anyone can find and view this conversation
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="unlisted" id="unlisted" />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="unlisted" className="flex items-center gap-2 cursor-pointer">
                    <Link2 className="h-4 w-4" />
                    Unlisted
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Only people with the link can view
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="private" id="private" />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                    <EyeOff className="h-4 w-4" />
                    Private
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Only you can view this conversation
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Create Share Button */}
          {!isShared && (
            <Button onClick={handleCreateShare} disabled={isLoading} className="w-full">
              {isLoading ? 'Creating...' : 'Create Share Link'}
            </Button>
          )}

          {/* Share URL */}
          {isShared && (
            <>
              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex gap-2">
                  <Input value={shareUrl} readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyUrl}
                    title="Copy link"
                  >
                    {copiedUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* View Count */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{viewCount} views</span>
              </div>

              {/* Embed Code */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Embed Code
                </Label>
                <div className="space-y-2">
                  <Textarea value={embedCode} readOnly rows={3} className="font-mono text-xs" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyEmbed}
                    className="w-full"
                  >
                    {copiedEmbed ? (
                      <>
                        <Check className="h-3 w-3 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-2" />
                        Copy Embed Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
