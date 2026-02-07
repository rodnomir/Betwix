import { Link, useParams, Navigate } from "react-router-dom";
import PageContainer from "@/components/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getNewsBySlug, type NewsCategory } from "@/data/news";

const CATEGORY_LABELS_MAP: Record<NewsCategory, string> = {
  updates: "Обновления Betwix",
  market: "Новости рынка",
  events: "События",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderContent(content: string) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean);
  return (
    <div className="space-y-3">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-sm text-slate-600 leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  );
}

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? getNewsBySlug(slug) : undefined;

  if (!slug || !item) {
    return <Navigate to="/news" replace />;
  }

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-6 py-10 sm:py-12 pb-12">
        <Link
          to="/news"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6"
        >
          ← Назад к новостям
        </Link>

        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
            <time dateTime={item.date}>{formatDate(item.date)}</time>
            <Badge variant="secondary">{CATEGORY_LABELS_MAP[item.category]}</Badge>
            {item.tags.map((t) => (
              <Badge key={t} variant="outline" className="font-normal">
                {t}
              </Badge>
            ))}
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            {item.title}
          </h1>
        </header>

        <div className="prose prose-slate max-w-none mb-8">
          {renderContent(item.content)}
        </div>

        <Card className="border border-slate-200 bg-slate-50/50">
          <CardContent className="py-6 space-y-3">
            <p className="text-sm font-medium text-slate-800">
              Подписаться на обновления
            </p>
            <p className="text-sm text-slate-600">
              Чтобы получать уведомления о новых материалах, напишите нам — укажите в теме «Подписка на новости».
            </p>
            <div className="flex flex-wrap gap-2">
              <Link to="/contacts">
                <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                  Написать в поддержку
                </Button>
              </Link>
            </div>
            <p className="text-sm text-slate-600 pt-2 border-t border-slate-200">
              Есть вопрос?{" "}
              <Link to="/contacts" className="text-blue-600 hover:underline">
                Связаться с нами
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
