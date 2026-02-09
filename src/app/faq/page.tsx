"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Loader2, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const categoryLabels: Record<string, string> = {
  general: "一般",
  account: "アカウント",
  matching: "マッチング",
  payment: "お支払い",
  other: "その他",
};

const categoryOrder = ["general", "account", "matching", "payment", "other"];

export default function FaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await fetch("/api/faq");
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (error) {
        console.error("Failed to fetch FAQ:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaq();
  }, []);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // フィルタリング
  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // カテゴリ別にグループ化
  const groupedItems = categoryOrder.reduce<Record<string, FaqItem[]>>((acc, cat) => {
    const catItems = filteredItems.filter((item) => item.category === cat);
    if (catItems.length > 0) {
      acc[cat] = catItems;
    }
    return acc;
  }, {});

  // 存在するカテゴリのみタブに表示
  const availableCategories = categoryOrder.filter((cat) =>
    items.some((item) => item.category === cat)
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">よくある質問</h1>
            <p className="mt-2 text-gray-600">
              お困りのことがあれば、まずはこちらをご確認ください
            </p>
          </div>

          {/* 検索 */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="キーワードで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full bg-white"
            />
          </div>

          {/* カテゴリタブ */}
          {availableCategories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                  activeCategory === "all"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                )}
              >
                すべて
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                    activeCategory === cat
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  )}
                >
                  {categoryLabels[cat] || cat}
                </button>
              ))}
            </div>
          )}

          {/* FAQ一覧 */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <HelpCircle className="h-12 w-12 mx-auto text-gray-300" />
              <p className="mt-4 text-gray-500">
                {searchQuery ? "該当するFAQが見つかりませんでした" : "FAQはまだ登録されていません"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([category, catItems]) => (
                <div key={category}>
                  {activeCategory === "all" && (
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Badge variant="secondary" className="rounded-full">
                        {categoryLabels[category] || category}
                      </Badge>
                    </h2>
                  )}
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
                    {catItems.map((item) => (
                      <div key={item.id}>
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 text-gray-400 shrink-0 transition-transform",
                              openItems.has(item.id) && "rotate-180"
                            )}
                          />
                        </button>
                        {openItems.has(item.id) && (
                          <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* お問い合わせへの導線 */}
          <div className="mt-8 text-center bg-white rounded-2xl shadow-sm p-8">
            <p className="text-gray-600 mb-4">
              解決しない場合は、お気軽にお問い合わせください
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
