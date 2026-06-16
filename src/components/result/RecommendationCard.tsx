import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface RecItem {
  category?: string;
  name?: string;
  match: number;
  reason: string;
}

interface RecommendationCardProps {
  title: string;
  items: RecItem[];
}

export function RecommendationCard({ title, items }: RecommendationCardProps) {
  return (
    <Card>
      <CardContent>
        <h4 className="font-bold text-slate-900 mb-3">{title}</h4>
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                {item.match}%
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-slate-800">
                    {item.category || item.name}
                  </span>
                  {item.match >= 90 && <Badge size="sm" variant="success">强推荐</Badge>}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{item.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
