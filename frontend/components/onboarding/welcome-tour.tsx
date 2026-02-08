'use client';

import { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface WelcomeTourProps {
  run?: boolean;
  onComplete?: () => void;
}

const TOUR_STORAGE_KEY = 'ai-council-tour-completed';

export function WelcomeTour({ run = false, onComplete }: WelcomeTourProps) {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    // Check if tour has been completed before
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    
    // Only run tour if explicitly requested or if it's the first visit
    if (run || (!tourCompleted && !run)) {
      // Small delay to ensure DOM elements are rendered
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [run]);

  const steps: Step[] = [
    {
      target: '[data-tour="chat-input"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Welcome to AI Council! 🎉</h3>
          <p className="text-sm text-muted-foreground">
            This is where you submit your queries. AI Council will intelligently decompose 
            complex tasks and distribute them across multiple specialized AI models for better results.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="execution-mode"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Choose Your Execution Mode</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Select how you want your query processed:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li><strong>Fast:</strong> Quick responses with minimal decomposition</li>
            <li><strong>Balanced:</strong> Good balance of speed and quality</li>
            <li><strong>Best Quality:</strong> Maximum decomposition with premium models</li>
          </ul>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="settings-link"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Configure Your API Keys</h3>
          <p className="text-sm text-muted-foreground">
            Visit Settings to configure your AI provider API keys. You can use providers like 
            OpenAI, Groq, Together.ai, and more. The more providers you configure, the better 
            AI Council can optimize your requests!
          </p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="history-link"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Access Your History</h3>
          <p className="text-sm text-muted-foreground">
            All your past conversations are saved here. You can search, filter, and review 
            previous responses anytime. Click the history icon or use <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Ctrl+B</kbd> to toggle the sidebar.
          </p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: 'body',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">You're All Set! 🚀</h3>
          <p className="text-sm text-muted-foreground mb-3">
            You're ready to experience the power of multi-agent AI orchestration. 
            Start by submitting your first query!
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Tip:</strong> Press <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Ctrl+?</kbd> anytime 
            to see all keyboard shortcuts.
          </p>
        </div>
      ),
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      // Mark tour as completed
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
      onComplete?.();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: 'hsl(var(--primary))',
          textColor: 'hsl(var(--foreground))',
          backgroundColor: 'hsl(var(--background))',
          arrowColor: 'hsl(var(--background))',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 8,
          padding: 20,
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: 'hsl(var(--primary))',
          borderRadius: 6,
          padding: '8px 16px',
        },
        buttonBack: {
          color: 'hsl(var(--muted-foreground))',
          marginRight: 10,
        },
        buttonSkip: {
          color: 'hsl(var(--muted-foreground))',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
}

// Hook to manage tour state
export function useWelcomeTour() {
  const [shouldShowTour, setShouldShowTour] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    setShouldShowTour(!tourCompleted);
  }, []);

  const restartTour = () => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    setShouldShowTour(true);
  };

  const completeTour = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    setShouldShowTour(false);
  };

  return {
    shouldShowTour,
    restartTour,
    completeTour,
  };
}
