'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface ExecutionTranscriptProps {
  transcript: string | null;
}

export const ExecutionTranscript = ({ transcript }: ExecutionTranscriptProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Transcripción Completa de la Llamada
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transcript ? (
          <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 border border-border/50">
            <pre className="text-sm font-mono text-foreground whitespace-pre-wrap break-words leading-relaxed max-h-96 overflow-y-auto">
              {transcript}
            </pre>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic py-8 text-center">
            No transcript available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
