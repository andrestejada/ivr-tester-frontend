'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle, ListChecks } from 'lucide-react';
import type { ExecutionLogResponse } from '../types';
import {
  formatConfidencePercentage,
  getConfidenceBadgeColor,
  mapActionToSpanish,
} from '../utils/mappers';

interface ExecutionLogsListProps {
  logs: ExecutionLogResponse[];
}

const getActionTone = (actionTaken: string | null) => {
  if (!actionTaken) return 'text-muted-foreground';

  if (actionTaken === 'No action (passive step)' || actionTaken.startsWith('Sent DTMF:')) {
    return 'text-green-900 bg-green-100 dark:bg-green-950 dark:text-green-200';
  }

  if (
    actionTaken.includes('error') ||
    actionTaken.includes('Error') ||
    actionTaken.includes('timeout') ||
    actionTaken.includes('Timeout') ||
    actionTaken.includes('Failed') ||
    actionTaken.includes('stagnated') ||
    actionTaken.includes('silence')
  ) {
    return 'text-red-900 bg-red-100 dark:bg-red-950 dark:text-red-200';
  }

  return 'text-foreground bg-black/5 dark:bg-white/5';
};

export const ExecutionLogsList = ({ logs }: ExecutionLogsListProps) => {
  if (logs.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3 text-muted-foreground py-8">
            <AlertCircle className="h-5 w-5" />
            <p>No hay logs registrados para esta ejecución</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5" />
          Bitácora de Ejecución ({logs.length} pasos)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">Paso</TableHead>
                <TableHead>Texto Esperado</TableHead>
                <TableHead>Transcripción Real</TableHead>
                <TableHead className="w-24 text-center">Confianza</TableHead>
                <TableHead>Acción Ejecutada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/50">
                  {/* Paso */}
                  <TableCell className="text-center font-semibold text-muted-foreground">
                    {log.step_number}
                  </TableCell>

                  {/* Texto Esperado */}
                  <TableCell>
                    {log.expected_text ? (
                      <span className="text-sm font-mono text-foreground">
                        {log.expected_text}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">-</span>
                    )}
                  </TableCell>

                  {/* Transcripción Real */}
                  <TableCell>
                    {log.actual_transcription ? (
                      <span className="text-sm font-mono text-foreground">
                        "{log.actual_transcription}"
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">-</span>
                    )}
                  </TableCell>

                  {/* Confianza */}
                  <TableCell className="text-center">
                    <Badge className={getConfidenceBadgeColor(log.confidence_score)}>
                      {formatConfidencePercentage(log.confidence_score)}
                    </Badge>
                  </TableCell>

                  {/* Acción Ejecutada */}
                  <TableCell>
                    {log.action_taken ? (
                      <span
                        className={`text-xs px-2 py-1 rounded block w-fit ${getActionTone(log.action_taken)}`}
                      >
                        {mapActionToSpanish(log.action_taken)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
