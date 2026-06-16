import { Card, CardContent } from '@/components/ui/Card';

interface TypeBadgeProps {
  code: string;
  name: string;
  size?: 'md' | 'lg';
}

export function TypeBadge({ code, name, size = 'md' }: TypeBadgeProps) {
  const letters = code.replace(/-/g, '').split('');

  const sizes = {
    md: { letter: 'text-2xl w-10 h-12', space: 'w-1', name: 'text-sm' },
    lg: { letter: 'text-3xl w-12 h-14', space: 'w-2', name: 'text-base' },
  };
  const s = sizes[size];

  return (
    <Card className="inline-block">
      <CardContent className="p-2">
        <div className="flex items-center justify-center gap-0.5 py-1">
          {letters.map((l, i) => (
            <span
              key={i}
              className={`${s.letter} font-extrabold text-indigo-600 bg-indigo-50 rounded-xl flex items-center justify-center`}
            >
              {l}
            </span>
          ))}
        </div>
        {size === 'lg' && (
          <div className="text-center mt-2 text-slate-500 text-xs tracking-wider font-medium">
            {code.replace(/-/g, ' ')}
          </div>
        )}
        <div className={`text-center pb-1 ${s.name} font-bold text-slate-700`}>
          {name}
        </div>
      </CardContent>
    </Card>
  );
}
