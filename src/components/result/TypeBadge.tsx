import { Card, CardContent } from '@/components/ui/Card';

interface TypeBadgeProps {
  code: string;
  name: string;
  size?: 'md' | 'lg';
}

export function TypeBadge({ code, name, size = 'md' }: TypeBadgeProps) {
  const sizeClass = size === 'lg'
    ? 'text-2xl px-6 py-3'
    : 'text-lg px-4 py-2';

  return (
    <Card className="inline-block">
      <CardContent className="p-0">
        <div className={`${sizeClass} font-mono font-bold text-indigo-600 tracking-wider`}>
          {code}
        </div>
        <div className="text-center pb-3 text-sm font-bold text-slate-700">
          {name}
        </div>
      </CardContent>
    </Card>
  );
}
