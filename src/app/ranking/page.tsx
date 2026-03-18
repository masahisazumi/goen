"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  MapPin,
  Loader2,
  Store,
  ChevronDown,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ALL_PREFECTURES } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RankingItem {
  rank: number;
  id: string;
  name: string;
  area: string | null;
  category: string | null;
  image: string | null;
  checkInCount: number;
}

export default function RankingPage() {
  const [prefecture, setPrefecture] = useState("すべて");
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ limit: "20" });
        if (prefecture !== "すべて") {
          params.set("prefecture", prefecture);
        }
        const res = await fetch(`/api/rankings?${params}`);
        if (res.ok) {
          const data = await res.json();
          setRankings(data.rankings);
        }
      } catch (error) {
        console.error("Ranking fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRankings();
  }, [prefecture]);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-400 text-white";
    if (rank === 2) return "bg-gray-300 text-white";
    if (rank === 3) return "bg-amber-600 text-white";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
              <Trophy className="h-8 w-8 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">人気店舗ランキング</h1>
            <p className="text-gray-600 mt-2">チェックイン数で人気の店舗をチェック!</p>
          </div>

          {/* Prefecture Selector */}
          <div className="mb-6">
            <Select value={prefecture} onValueChange={setPrefecture}>
              <SelectTrigger className="w-full rounded-xl bg-white">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="すべて">すべての地域</SelectItem>
                {ALL_PREFECTURES.map((pref) => (
                  <SelectItem key={pref} value={pref}>
                    {pref}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rankings List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : rankings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <Store className="h-12 w-12 mx-auto text-gray-300" />
              <p className="mt-4 text-gray-500">
                {prefecture === "すべて"
                  ? "まだランキングデータがありません"
                  : `${prefecture}にはまだチェックインデータがありません`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rankings.map((item) => (
                <Link key={item.id} href={`/store/${item.id}`}>
                  <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getRankStyle(item.rank)}`}
                        >
                          {item.rank}
                        </div>

                        {/* Image */}
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Store className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {item.category && (
                              <Badge variant="secondary" className="rounded-full text-xs">
                                {item.category}
                              </Badge>
                            )}
                            {item.area && (
                              <span className="text-xs text-gray-500 flex items-center gap-0.5">
                                <MapPin className="h-3 w-3" />
                                {item.area}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Check-in count */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-primary">{item.checkInCount}</p>
                          <p className="text-xs text-gray-500">チェックイン</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
