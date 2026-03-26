import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExecutionActionsCellProps {
  executionId: string;
  architectureId: string;
  testCaseId: string;
}

export const ExecutionActionsCell = ({
  executionId,
  architectureId,
  testCaseId,
}: ExecutionActionsCellProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/executions/${architectureId}/test-cases/${testCaseId}/details/${executionId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleViewDetails}>Ver detalles</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
