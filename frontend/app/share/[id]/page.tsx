'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/hooks/use-theme';
import {
  Clock,
  DollarSign,
  TrendingUp,
  Eye,
  Zap,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface SharedConversation {
  share_id: string;
  content: string;
  response_content: string;
  confidence: number;
  execution_time: number;
  total_cost: number;
  models_used: string[];
  execution_mode: string;
  created_at: string;
  view_count: number;
}

export default function SharedConversationPage() {
  const params = useParams();
  const shareId = params.id as string;
  const [conversation, setConversation] = useState<SharedConversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchSharedConversation = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sharing/${shareId}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError('This shared conversation was not found or has been removed.');
          } else if (response.status === 403) {
            setError('This conversation is private and cannot be viewed.');
          } else {
            setError('Failed to load shared conversation.');
          }
          return;
        }

        const data = await response.json();
        setConversation(data);
      } catch (err) {
        setError('Failed to load shared conversation. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (shareId) {
      fetchSharedConversation();
    }
  }, [shareId]);

  const handleCopy = async () => {
    if (!conversation) return;

    try {
      await navigator.clipboard.writeText(conversation.response_content);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Response copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const renderContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: JSX.Element[] = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textContent = content.substring(lastIndex, match.index);
        parts.push(
          <div key={`text-${key++}`} className="whitespace-pre-wrap mb-4">
            {textContent}
          </div>
        );
      }

      const language = match[1] || 'text';
      const code = match[2];
      parts.push(
        <div key={`code-${key++}`} className="mb-4 rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 text-xs font-mono flex items-center justify-between">
            <span>{language}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(code);
                toast({ title: 'Code copied!' });
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <SyntaxHighlighter
            language={language}
            style={theme === 'dark' ? vscDarkPlus : vs}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: '0.875rem',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(
        <div key={`text-${key++}`} className="whitespace-pre-wrap">
          {content.substring(lastIndex)}
        </div>
      );
    }

    return parts.length > 0 ? parts : <div className="whitespace-pre-wrap">{content}</div>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
            <Button className="mt-4 w-full" onClick={() => (window.location.href = '/')}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Shared AI Council Conversation</h1>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {conversation.view_count} views
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Powered by AI Council Multi-Agent Orchestration
          </p>
        </div>

        {/* Query */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Query</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{conversation.content}</p>
          </CardContent>
        </Card>

        {/* Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Zap className="h-4 w-4" />
                <span className="text-xs">Mode</span>
              </div>
              <p className="text-lg font-semibold capitalize">{conversation.execution_mode}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">Confidence</span>
              </div>
              <p className="text-lg font-semibold">
                {(conversation.confidence * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Time</span>
              </div>
              <p className="text-lg font-semibold">{conversation.execution_time.toFixed(2)}s</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs">Cost</span>
              </div>
              <p className="text-lg font-semibold">${conversation.total_cost.toFixed(4)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Response */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Response</CardTitle>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              {renderContent(conversation.response_content)}
            </div>
          </CardContent>
        </Card>

        {/* Models Used */}
        {conversation.models_used && conversation.models_used.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Models Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {conversation.models_used.map((model, index) => (
                  <Badge key={index} variant="secondary">
                    {model}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-muted-foreground mb-4">
            Want to try AI Council for yourself?
          </p>
          <Button onClick={() => (window.location.href = '/')}>Get Started</Button>
        </div>
      </div>
    </div>
  );
}
