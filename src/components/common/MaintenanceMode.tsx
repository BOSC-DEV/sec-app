
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, RefreshCw } from "lucide-react";
import ICCLogo from "./ICCLogo";

interface MaintenanceModeProps {
  title?: string;
  message?: string;
  estimatedDowntime?: string;
  refreshButtonLabel?: string;
  showRefreshButton?: boolean;
  onRefreshClick?: () => void;
}

const MaintenanceMode: React.FC<MaintenanceModeProps> = ({
  title = "Scheduled Maintenance",
  message = "We're currently performing scheduled maintenance to improve our service. Please check back shortly.",
  estimatedDowntime = "30 minutes",
  refreshButtonLabel = "Check Again",
  showRefreshButton = true,
  onRefreshClick = () => window.location.reload(),
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100">
      <div className="max-w-md w-full">
        <div className="mb-8 flex justify-center">
          <ICCLogo className="w-20 h-20" />
        </div>
        
        <Card className="shadow-lg border-icc-blue/10">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <AlertTriangle className="h-6 w-6 text-icc-gold" />
            <CardTitle className="text-xl">{title}</CardTitle>
          </CardHeader>
          
          <CardContent>
            <CardDescription className="text-base text-gray-700 mt-2">
              {message}
            </CardDescription>
            
            <div className="flex items-center mt-6 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span>Estimated downtime: {estimatedDowntime}</span>
            </div>
          </CardContent>
          
          {showRefreshButton && (
            <CardFooter className="pt-2">
              <Button
                onClick={onRefreshClick}
                className="w-full"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {refreshButtonLabel}
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          &copy; {new Date().getFullYear()} Scams & E-crimes Commission. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default MaintenanceMode;
