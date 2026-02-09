"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Loader2,
  ArrowLeft,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubscriptionItem {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: string;
  status: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface Stats {
  total: number;
  active: number;
  canceled: number;
  pastDue: number;
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  active: { label: "有効", variant: "default" },
  canceled: { label: "解約済み", variant: "secondary" },
  past_due: { label: "支払い遅延", variant: "destructive" },
  unpaid: { label: "未払い", variant: "destructive" },
};

export default function AdminSubscriptionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, canceled: 0, pastDue: 0 });
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/subscriptions");
        if (res.ok) {
          const data = await res.json();
          setSubscriptions(data.subscriptions);
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const filteredSubscriptions =
    statusFilter === "all"
      ? subscriptions
      : subscriptions.filter((s) => s.status === statusFilter);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">サブスクリプション管理</h1>
                <p className="text-sm text-gray-500">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 text-center">
              <Crown className="h-6 w-6 text-purple-500 mx-auto" />
              <p className="text-2xl font-bold mt-2">{stats.total}</p>
              <p className="text-xs text-muted-foreground">合計</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
              <p className="text-2xl font-bold mt-2">{stats.active}</p>
              <p className="text-xs text-muted-foreground">有効</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 text-center">
              <XCircle className="h-6 w-6 text-gray-400 mx-auto" />
              <p className="text-2xl font-bold mt-2">{stats.canceled}</p>
              <p className="text-xs text-muted-foreground">解約済み</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mx-auto" />
              <p className="text-2xl font-bold mt-2">{stats.pastDue}</p>
              <p className="text-xs text-muted-foreground">支払い遅延</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-6">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] rounded-full">
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="active">有効</SelectItem>
              <SelectItem value="canceled">解約済み</SelectItem>
              <SelectItem value="past_due">支払い遅延</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ユーザー</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>開始日</TableHead>
                <TableHead>次回請求日</TableHead>
                <TableHead>解約予定</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    サブスクリプションはありません
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscriptions.map((sub) => {
                  const statusInfo = statusLabels[sub.status] || {
                    label: sub.status,
                    variant: "outline" as const,
                  };
                  return (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={sub.user.image || ""} />
                            <AvatarFallback className="bg-gray-100 text-xs">
                              {sub.user.name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{sub.user.name || "名前未設定"}</p>
                            <p className="text-xs text-muted-foreground">{sub.user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant} className="rounded-full">
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(sub.createdAt).toLocaleDateString("ja-JP")}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(sub.stripeCurrentPeriodEnd).toLocaleDateString("ja-JP")}
                      </TableCell>
                      <TableCell>
                        {sub.cancelAtPeriodEnd ? (
                          <Badge variant="outline" className="rounded-full text-amber-600 border-amber-300">
                            解約予定
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
