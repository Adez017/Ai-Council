'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CouncilResponse } from '@/types/council';
import { ExecutionMode } from '@/types/council';

interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  executionMode?: ExecutionMode;
  response?: CouncilResponse;
  timestamp: number;
}

interface SessionData {
  messages: ConversationMessage[];
  draftMessage: string;
  selectedMode: ExecutionMode;
  lastUpdated: number;
}

const SESSION_STORAGE_KEY = 'ai_council_session';
const AUTO_SAVE_INTERVAL = 2000; // 2 seconds

export function useSessionPersistence() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [draftMessage, setDraftMessage] = useState('');
  const [selectedMode, setSelectedMode] = useState<ExecutionMode>('balanced');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [sessionRestored, setSessionRestored] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSession) {
        const session: SessionData = JSON.parse(savedSession);
        setMessages(session.messages || []);
        setDraftMessage(session.draftMessage || '');
        setSelectedMode(session.selectedMode || 'balanced');
        setSessionRestored(true);
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
    }
  }, []);

  // Save session to localStorage
  const saveSession = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const session: SessionData = {
        messages,
        draftMessage,
        selectedMode,
        lastUpdated: Date.now(),
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }, [messages, draftMessage, selectedMode]);

  // Auto-save draft message every 2 seconds
  useEffect(() => {
    if (draftMessage || messages.length > 0) {
      setHasUnsavedChanges(true);

      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer
      autoSaveTimerRef.current = setTimeout(() => {
        saveSession();
      }, AUTO_SAVE_INTERVAL);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [draftMessage, messages, saveSession]);

  // Add user message
  const addUserMessage = useCallback((content: string, mode: ExecutionMode) => {
    const message: ConversationMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      executionMode: mode,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, message]);
    setDraftMessage(''); // Clear draft after sending
    setHasUnsavedChanges(true);
  }, []);

  // Add assistant response
  const addAssistantResponse = useCallback((response: CouncilResponse) => {
    const message: ConversationMessage = {
      id: `assistant-${Date.now()}`,
      type: 'assistant',
      content: response.content,
      response,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, message]);
    setHasUnsavedChanges(true);
  }, []);

  // Clear session
  const clearSession = useCallback(() => {
    if (typeof window === 'undefined') return;

    setMessages([]);
    setDraftMessage('');
    setSelectedMode('balanced');
    setHasUnsavedChanges(false);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  // Clear session on logout
  const clearSessionOnLogout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  // Check if there's a saved session
  const hasSavedSession = useCallback(() => {
    if (typeof window === 'undefined') return false;

    try {
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!savedSession) return false;

      const session: SessionData = JSON.parse(savedSession);
      return (session.messages && session.messages.length > 0) || !!session.draftMessage;
    } catch {
      return false;
    }
  }, []);

  // Restore session (for resume functionality)
  const restoreSession = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSession) {
        const session: SessionData = JSON.parse(savedSession);
        setMessages(session.messages || []);
        setDraftMessage(session.draftMessage || '');
        setSelectedMode(session.selectedMode || 'balanced');
        setSessionRestored(true);
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
    }
  }, []);

  // Update draft message
  const updateDraftMessage = useCallback((draft: string) => {
    setDraftMessage(draft);
    setHasUnsavedChanges(true);
  }, []);

  // Update selected mode
  const updateSelectedMode = useCallback((mode: ExecutionMode) => {
    setSelectedMode(mode);
    setHasUnsavedChanges(true);
  }, []);

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  return {
    messages,
    draftMessage,
    selectedMode,
    hasUnsavedChanges,
    sessionRestored,
    addUserMessage,
    addAssistantResponse,
    clearSession,
    clearSessionOnLogout,
    hasSavedSession,
    restoreSession,
    updateDraftMessage,
    updateSelectedMode,
    saveSession,
  };
}
