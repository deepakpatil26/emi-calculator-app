import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from 'next-themes';
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RotateCcw, DownloadIcon, Share2Icon, Link2Icon, Copy, Mail } from "lucide-react";

interface HeaderActionsProps {
  onReset: () => void;
  onSave: (format: 'pdf' | 'csv') => void;
  onShare: (method: 'link' | 'copy' | 'email') => void;
}

const HeaderActions = ({ onReset, onSave, onShare }: HeaderActionsProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-4">
      <Switch
        checked={theme === "dark"}
        onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
      <Button variant="outline" size="icon" onClick={onReset}>
        <RotateCcw className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <DownloadIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onSave('pdf')}>
            Save as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSave('csv')}>
            Save as CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Share2Icon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onShare('link')}>
            <Link2Icon className="h-4 w-4 mr-2" />
            Share link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare('copy')}>
            <Copy className="h-4 w-4 mr-2" />
            Copy to clipboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare('email')}>
            <Mail className="h-4 w-4 mr-2" />
            Share via email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HeaderActions;