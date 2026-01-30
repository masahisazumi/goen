import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold">特定商取引法に基づく表記</h1>
          </div>

          <Card className="border-0 shadow-md rounded-2xl">
            <CardContent className="py-8 space-y-6">
              {/* 事業者名 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="font-medium text-muted-foreground">事業者名</div>
                <div className="md:col-span-2">いいこと</div>
              </div>
              <Separator />

              {/* 代表者名 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="font-medium text-muted-foreground">代表者名</div>
                <div className="md:col-span-2">富永愛理</div>
              </div>
              <Separator />

              {/* 所在地 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="font-medium text-muted-foreground">所在地</div>
                <div className="md:col-span-2">&nbsp;</div>
              </div>
              <Separator />

              {/* 電話番号 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="font-medium text-muted-foreground">電話番号</div>
                <div className="md:col-span-2">&nbsp;</div>
              </div>
              <Separator />

              {/* お問い合わせ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="font-medium text-muted-foreground">お問い合わせ</div>
                <div className="md:col-span-2">&nbsp;</div>
              </div>
              <Separator />

              {/* 役務の対価 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="font-medium text-muted-foreground">役務の対価</div>
                <div className="md:col-span-2">使用料2,980円（税込）</div>
              </div>
              <Separator />

              {/* 役務の対価以外の必要料金 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="font-medium text-muted-foreground">役務の対価以外の必要料金</div>
                <div className="md:col-span-2">
                  インターネット接続には、別途ご契約の通信事業者への通信料等の費用が発生します
                </div>
              </div>
              <Separator />

              {/* 営業時間 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="font-medium text-muted-foreground">営業時間</div>
                <div className="md:col-span-2">平日10:00〜18:00</div>
              </div>
              <Separator />

              {/* 役務の提供時期 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="font-medium text-muted-foreground">役務の提供時期</div>
                <div className="md:col-span-2">決済完了後、速やかに役務の提供を開始します</div>
              </div>
              <Separator />

              {/* 返品について */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="font-medium text-muted-foreground">返品について</div>
                <div className="md:col-span-2">返品または交換は一切お受けできません</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
