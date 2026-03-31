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
import { mapActionToSpanish } from '../utils/mappers';

interface ExecutionLogsListProps {
  logs: ExecutionLogResponse[];
}

const getConfidenceColor = (confidence: number | null) => {
  if (confidence === null) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  if (confidence >= 0.9) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
};

const formatConfidence = (confidence: number | null) => {
  if (confidence === null) return '-';
  return `${confidence}%`;
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
                    <Badge className={getConfidenceColor(log.confidence_score)}>
                      {formatConfidence(log.confidence_score)}
                    </Badge>
                  </TableCell>

                  {/* Acción Ejecutada */}
                  <TableCell>
                    {log.action_taken ? (
                      <span className="text-xs bg-black/5 dark:bg-white/5 px-2 py-1 rounded block w-fit">
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
