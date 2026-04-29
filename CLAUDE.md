# goen / てんむすび プロジェクト運用ルール

## デプロイ環境

- **本番URL**: https://tenmusubi.net/
- **DB**: ローカル = SQLite (`prisma/dev.db`) / 本番 = Turso (libSQL)
- **ホスティング**: Vercel
- **ビルドコマンド (本番)**: `npm run build:prod`
  - 内部で `migrate:prod` → `prisma generate` → `next build` を実行

## スキーマ変更時の必須手順 ⚠️

**`prisma/schema.prisma` を変更する時は、必ず `prisma/migrate-prod.ts` も更新すること**。

本番Tursoは Prisma Migrate ではなく `prisma/migrate-prod.ts` の手動 `ALTER TABLE` 文で管理されているため、`schema.prisma` だけ変更すると本番のPrisma Clientが存在しない列を SELECT しようとして500エラーになる（過去に車両サイズ追加時に発生した本番障害の原因）。

### 標準フロー

1. `prisma/schema.prisma` を編集（列追加・テーブル追加など）
2. ローカル反映: `npx prisma db push`
3. **`prisma/migrate-prod.ts` の `alterStatements` または `createStatements` に対応する SQL を追加**
   - 列追加例: `if (!colNames.has("xxx")) alterStatements.push('ALTER TABLE "Store" ADD COLUMN "xxx" INTEGER');`
4. commit & push
5. Vercel が自動で `npm run build:prod` を実行 → 本番Tursoにマイグレーションが走る

### 手動マイグレーション

緊急時や `build:prod` を経由せずTursoだけ更新したい場合:
```bash
npm run migrate:prod
```
※ `.env` に本番用の `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` が必要。

## Prisma Client 再生成 (Next.js dev)

スキーマ変更後、ローカル dev サーバー (`npm run dev`) は **必ず再起動** すること。Prisma Client は `node_modules` 下の生成物で、Next.js のホットリロードでは再読み込みされない。再起動しないと `Unknown argument` エラーが発生する。

## 主要なAPI/設定の参照先

- 認証: `src/lib/auth.ts` (next-auth v5 + JWT)
- Prisma シングルトン: `src/lib/prisma.ts`
- メール: `src/lib/email.ts` (Resend)
- 画像ストレージ: Cloudflare R2 (`src/lib/storage.ts`)
- 決済: Stripe (`src/lib/stripe.ts`)
- 共通定数 (カテゴリ等): `src/lib/constants.ts`

## 既知の不整合

- 業種カテゴリが2箇所に分散 (`src/lib/constants.ts` の `VENDOR_CATEGORY_LABELS` 3項目 vs `src/app/stores/[id]/edit/page.tsx` ハードコード8項目)。新規登録と編集で表示項目が異なる。統一が必要。
