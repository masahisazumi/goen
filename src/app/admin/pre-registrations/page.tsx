"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Store,
  MapPin,
  Trash2,
  Loader2,
  ArrowLeft,
  Mail,
  Calendar,
  Filter,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PreRegistration {
  id: string;
  email: string;
  userType: string;
  createdAt: string;
}

interface Stats {
  total: number;
  vendors: number;
  owners: number;
}

export default function AdminPreRegistrationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<PreRegistration[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, vendors: 0, owners: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchRegistrations();
  }, [filter]);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = filter !== "all" ? `?userType=${filter}` : "";
      const res = await fetch(`/api/admin/pre-registrations${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "データの取得に失敗しました");
        return;
      }

      setRegistrations(data.registrations);
      setStats(data.stats);
    } catch {
      setError("データの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/pre-registrations?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "削除に失敗しました");
        return;
      }

      fetchRegistrations();
    } catch {
      setError("削除に失敗しました");
    }
  };

  const handleExportCSV = () => {
    const headers = ["メールアドレス", "ユーザータイプ", "登録日時"];
    const rows = registrations.map((r) => [
      r.email,
      r.userType === "vendor" ? "出店者" : "スペースオーナー",
      new Date(r.createdAt).toLocaleString("ja-JP"),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pre-registrations-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/mypage">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">先行登録一覧</h1>
                <p className="text-sm text-gray-500">管理者ダッシュボード</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={registrations.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              CSVエクスポート
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                総登録数
              </CardTitle>
              <Users className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                出店者
              </CardTitle>
              <Store className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.vendors}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                スペースオーナー
              </CardTitle>
              <MapPin className="h-5 w-5 text-gray-700" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-700">{stats.owners}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter & Table */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>登録一覧</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="フィルター" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="vendor">出店者</SelectItem>
                  <SelectItem value="owner">スペースオーナー</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 mx-auto text-gray-300" />
                <p className="mt-4 text-gray-500">先行登録はありません</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>メールアドレス</TableHead>
                    <TableHead>ユーザータイプ</TableHead>
                    <TableHead>登録日時</TableHead>
                    <TableHead className="w-[80px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {registration.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={registration.userType === "vendor" ? "default" : "secondary"}
                          className="rounded-full"
                        >
                          {registration.userType === "vendor" ? (
                            <>
                              <Store className="h-3 w-3 mr-1" />
                              出店者
                            </>
                          ) : (
                            <>
                              <MapPin className="h-3 w-3 mr-1" />
                              スペースオーナー
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {new Date(registration.createdAt).toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>削除の確認</AlertDialogTitle>
                              <AlertDialogDescription>
                                この先行登録を削除しますか？この操作は取り消せません。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>キャンセル</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(registration.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                削除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
