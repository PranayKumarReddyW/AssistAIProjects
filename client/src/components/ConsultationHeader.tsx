import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Menu } from 'lucide-react';

interface ConsultationHeaderProps {
  patientName: string;
  policyId: string;
}

export const ConsultationHeader: React.FC<ConsultationHeaderProps> = ({
  patientName,
  policyId
}) => {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">ACKO</span>
          </div>
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        <div>
          <h1 className="text-lg font-semibold">
            MER Session for: <span className="text-primary">{patientName}</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Policy #{policyId}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};