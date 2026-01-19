import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, FileQuestion } from 'lucide-react';

interface TestCardProps {
  id: string;
  title: string;
  questionCount: number;
  duration: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  onStart?: () => void;
}

const difficultyColors = {
  easy: 'bg-success text-success-foreground',
  medium: 'bg-warning text-warning-foreground',
  hard: 'bg-destructive text-destructive-foreground',
};

export function TestCard({ 
  title, 
  questionCount, 
  duration, 
  difficulty = 'medium',
  onStart 
}: TestCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-2 font-display">
            {title}
          </CardTitle>
          <Badge className={difficultyColors[difficulty]}>
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileQuestion className="h-4 w-4" />
            <span>{questionCount} câu hỏi</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration} phút</span>
          </div>
        </div>
        <Button 
          className="w-full" 
          onClick={onStart}
        >
          Bắt đầu Test
        </Button>
      </CardContent>
    </Card>
  );
}
