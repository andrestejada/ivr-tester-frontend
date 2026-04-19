import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import type { ExecutionProgressState } from '../types';

interface RealtimeTranscriptChatProps {
  state: ExecutionProgressState;
}

const CHARS_PER_FRAME = 8;

export function RealtimeTranscriptChat({ state }: RealtimeTranscriptChatProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const targetTextRef = useRef('');
  const displayedTextRef = useRef('');
  const [displayedText, setDisplayedText] = useState('');

  const transcriptText = useMemo(() => state.accumulated_transcript.trim(), [state.accumulated_transcript]);
  const hasRunningStep = state.steps.some((step) => step.status === 'running');

  const updateDisplayedText = useCallback((value: string) => {
    displayedTextRef.current = value;
    setDisplayedText(value);
  }, []);

  const scheduleDisplayedText = useCallback(
    (value: string) => {
      Promise.resolve().then(() => {
        updateDisplayedText(value);
      });
    },
    [updateDisplayedText]
  );

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const startAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      return;
    }

    const tick = () => {
      const current = displayedTextRef.current;
      const target = targetTextRef.current;

      if (!target.startsWith(current)) {
        updateDisplayedText(target);
        animationFrameRef.current = null;
        return;
      }

      if (current.length >= target.length) {
        animationFrameRef.current = null;
        return;
      }

      const nextLength = Math.min(target.length, current.length + CHARS_PER_FRAME);
      updateDisplayedText(target.slice(0, nextLength));
      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
  }, [updateDisplayedText]);

  useEffect(() => {
    targetTextRef.current = transcriptText;

    if (!transcriptText) {
      stopAnimation();
      scheduleDisplayedText('');
      return;
    }

    const current = displayedTextRef.current;

    if (!transcriptText.startsWith(current)) {
      stopAnimation();
      scheduleDisplayedText(transcriptText);
      return;
    }

    if (transcriptText.length > current.length) {
      // Mostrar inmediatamente parte del nuevo evento y continuar tipeando sin pausas.
      const immediateLength = Math.min(transcriptText.length, current.length + 1);
      if (immediateLength > current.length) {
        scheduleDisplayedText(transcriptText.slice(0, immediateLength));
      }
      startAnimation();
      return;
    }

    stopAnimation();
  }, [scheduleDisplayedText, startAnimation, stopAnimation, transcriptText]);

  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [displayedText]);

  return (
    <div className="mt-5 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">Transcripción en vivo</p>
        <Badge
          className={
            hasRunningStep
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }
        >
          {hasRunningStep ? 'Escuchando' : 'Sin actividad'}
        </Badge>
      </div>

      <div
        ref={scrollContainerRef}
        data-testid="realtime-transcript-scroll"
        className="max-h-56 overflow-y-auto rounded-xl border bg-background/70 p-3"
        aria-live="polite"
      >
        {!displayedText && (
          <p className="text-sm text-muted-foreground italic">Aún no hay transcripción para mostrar.</p>
        )}

        {displayedText && (
          <p className="text-base text-foreground leading-relaxed wrap-break-word">
            {displayedText}
            {hasRunningStep && <span className="ml-0.5 inline-block animate-pulse">|</span>}
          </p>
        )}
      </div>
    </div>
  );
}
