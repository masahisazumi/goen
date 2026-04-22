"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HelpCircle,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ArrowLeft,
  GripVertical,
  Eye,
  EyeOff,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const categoryLabels: Record<string, string> = {
  general: "一般",
  account: "アカウント",
  matching: "マッチング",
  payment: "お支払い",
  other: "その他",
};

const categoryOptions = [
  { value: "general", label: "一般" },
  { value: "account", label: "アカウント" },
  { value: "matching", label: "マッチング" },
  { value: "payment", label: "お支払い" },
  { value: "other", label: "その他" },
];

export default function AdminFaqPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [error, setError] = useState("");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formQuestion, setFormQuestion] = useState("");
  const [formAnswer, setFormAnswer] = useState("");
  const [formCategory, setFormCategory] = useState("general");
  const [formOrder, setFormOrder] = useState(0);
  const [formPublished, setFormPublished] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/faq");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "データの取得に失敗しました");
        return;
      }
      setItems(data);
    } catch {
      setError("データの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormQuestion("");
    setFormAnswer("");
    setFormCategory("general");
    setFormOrder(0);
    setFormPublished(true);
    setDialogOpen(true);
  };

  const openEditDialog = (item: FaqItem) => {
    setEditingItem(item);
    setFormQuestion(item.question);
    setFormAnswer(item.answer);
    setFormCategory(item.category);
    setFormOrder(item.order);
    setFormPublished(item.isPublished);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formQuestion.trim() || !formAnswer.trim()) {
      setError("質問と回答は必須です");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      if (editingItem) {
        // Update
        const res = await fetch("/api/admin/faq", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingItem.id,
            question: formQuestion.trim(),
            answer: formAnswer.trim(),
            category: formCategory,
            order: formOrder,
            isPublished: formPublished,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "更新に失敗しました");
          return;
        }
      } else {
        // Create
        const res = await fetch("/api/admin/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: formQuestion.trim(),
            answer: formAnswer.trim(),
            category: formCategory,
            order: formOrder,
            isPublished: formPublished,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "作成に失敗しました");
          return;
        }
      }

      setDialogOpen(false);
      fetchItems();
    } catch {
      setError(editingItem ? "更新に失敗しました" : "作成に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/faq?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "削除に失敗しました");
        return;
      }
      fetchItems();
    } catch {
      setError("削除に失敗しました");
    }
  };

  const handleTogglePublish = async (item: FaqItem) => {
    try {
      const res = await fetch("/api/admin/faq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          isPublished: !item.isPublished,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "更新に失敗しました");
        return;
      }
      fetchItems();
    } catch {
      setError("更新に失敗しました");
    }
  };

  // Filter items
  const filteredItems = filter === "all"
    ? items
    : items.filter((item) => item.category === filter);

  // Stats
  const publishedCount = items.filter((i) => i.isPublished).length;
  const draftCount = items.filter((i) => !i.isPublished).length;

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
                <Link href="/admin">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FAQ管理</h1>
                <p className="text-sm text-gray-600">管理者ダッシュボード</p>
              </div>
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              新規作成
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
                総FAQ数
              </CardTitle>
              <HelpCircle className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{items.length}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                公開中
              </CardTitle>
              <Eye className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{publishedCount}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                下書き
              </CardTitle>
              <EyeOff className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-500">{draftCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>FAQ一覧</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="カテゴリ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 mx-auto text-gray-300" />
                <p className="mt-4 text-gray-500">FAQはまだ登録されていません</p>
                <Button onClick={openCreateDialog} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  最初のFAQを作成
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">順序</TableHead>
                    <TableHead>質問</TableHead>
                    <TableHead className="w-[120px]">カテゴリ</TableHead>
                    <TableHead className="w-[80px]">状態</TableHead>
                    <TableHead className="w-[120px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-400">
                          <GripVertical className="h-4 w-4" />
                          <span className="text-sm">{item.order}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {item.question}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-1 mt-0.5">
                            {item.answer}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded-full">
                          {categoryLabels[item.category] || item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleTogglePublish(item)}
                          title={item.isPublished ? "クリックで非公開に" : "クリックで公開に"}
                        >
                          <Badge
                            variant={item.isPublished ? "default" : "outline"}
                            className="rounded-full cursor-pointer"
                          >
                            {item.isPublished ? "公開" : "下書き"}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(item)}
                            title="編集"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                                title="削除"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>削除の確認</AlertDialogTitle>
                                <AlertDialogDescription>
                                  「{item.question}」を削除しますか？この操作は取り消せません。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  削除
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Public page link */}
        <div className="mt-6 text-center">
          <Link
            href="/faq"
            className="text-sm text-gray-600 hover:text-gray-700 underline"
          >
            公開FAQページを確認する
          </Link>
        </div>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "FAQを編集" : "新規FAQ作成"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <Label htmlFor="faq-question">質問 *</Label>
              <Input
                id="faq-question"
                value={formQuestion}
                onChange={(e) => setFormQuestion(e.target.value)}
                placeholder="よくある質問を入力..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="faq-answer">回答 *</Label>
              <Textarea
                id="faq-answer"
                value={formAnswer}
                onChange={(e) => setFormAnswer(e.target.value)}
                placeholder="回答を入力..."
                rows={5}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="faq-category">カテゴリ</Label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="faq-order">表示順序</Label>
                <Input
                  id="faq-order"
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="faq-published" className="font-medium">
                  公開する
                </Label>
                <p className="text-sm text-gray-600">
                  オフにすると下書き状態になります
                </p>
              </div>
              <Switch
                id="faq-published"
                checked={formPublished}
                onCheckedChange={setFormPublished}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isSaving}
              >
                キャンセル
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingItem ? "更新" : "作成"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
