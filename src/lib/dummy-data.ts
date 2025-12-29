// Dummy data for the goen matching service

export interface Vendor {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  description: string;
  category: string;
}

export interface Space {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  description: string;
  capacity: string;
  price: string;
}

export interface Message {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerImage: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Cafe Maru",
    image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&q=80",
    location: "東京都渋谷区",
    rating: 4.8,
    reviewCount: 24,
    tags: ["キッチンカー", "コーヒー"],
    description: "自家焙煎のスペシャルティコーヒーを提供するキッチンカー。イベントやマルシェで人気のお店です。",
    category: "キッチンカー",
  },
  {
    id: "v2",
    name: "handmade Sora",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
    location: "神奈川県横浜市",
    rating: 4.9,
    reviewCount: 42,
    tags: ["ハンドメイド", "アクセサリー"],
    description: "天然石とビーズを使ったオリジナルアクセサリーを制作しています。一点物の作品が中心です。",
    category: "ハンドメイド",
  },
  {
    id: "v3",
    name: "たこやき屋台 なにわ",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    location: "大阪府大阪市",
    rating: 4.7,
    reviewCount: 58,
    tags: ["キッチンカー", "フード"],
    description: "本場大阪の味をお届けするたこやき屋台。外はカリッと中はトロトロの本格たこやきです。",
    category: "キッチンカー",
  },
  {
    id: "v4",
    name: "花と緑の工房 hana",
    image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80",
    location: "東京都世田谷区",
    rating: 4.6,
    reviewCount: 31,
    tags: ["雑貨", "フラワー"],
    description: "ドライフラワーやプリザーブドフラワーを使ったアレンジメントやリースを販売しています。",
    category: "雑貨",
  },
  {
    id: "v5",
    name: "革工房 crafts",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    location: "愛知県名古屋市",
    rating: 4.8,
    reviewCount: 19,
    tags: ["ハンドメイド", "レザー"],
    description: "手縫いにこだわった革小物を制作。財布、キーケース、名刺入れなど実用的なアイテムが人気です。",
    category: "ハンドメイド",
  },
  {
    id: "v6",
    name: "crepe stand Fraise",
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80",
    location: "東京都目黒区",
    rating: 4.9,
    reviewCount: 67,
    tags: ["キッチンカー", "スイーツ"],
    description: "フランス仕込みの生地で作る本格クレープ。季節のフルーツをたっぷり使った贅沢な一品。",
    category: "キッチンカー",
  },
];

export const spaces: Space[] = [
  {
    id: "s1",
    name: "代官山カフェ前スペース",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    location: "東京都渋谷区代官山",
    rating: 4.7,
    reviewCount: 15,
    tags: ["屋外", "駅近"],
    description: "人通りの多いカフェ前の空きスペース。週末のマルシェ出店に最適です。電源・水道あり。",
    capacity: "2〜3ブース",
    price: "¥8,000/日",
  },
  {
    id: "s2",
    name: "横浜赤レンガ広場",
    image: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&q=80",
    location: "神奈川県横浜市中区",
    rating: 4.9,
    reviewCount: 48,
    tags: ["イベント", "大規模"],
    description: "観光客で賑わう赤レンガ倉庫前の広場。大型イベントやマルシェの開催実績多数。",
    capacity: "10〜50ブース",
    price: "要相談",
  },
  {
    id: "s3",
    name: "中目黒ギャラリー",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    location: "東京都目黒区中目黒",
    rating: 4.6,
    reviewCount: 22,
    tags: ["屋内", "ギャラリー"],
    description: "白を基調としたおしゃれなギャラリースペース。作品展示やポップアップショップにおすすめ。",
    capacity: "1〜2ブース",
    price: "¥15,000/日",
  },
  {
    id: "s4",
    name: "名古屋栄パーキング前",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    location: "愛知県名古屋市中区",
    rating: 4.5,
    reviewCount: 12,
    tags: ["屋外", "繁華街"],
    description: "名古屋の繁華街に位置する好立地スペース。集客力抜群のロケーションです。",
    capacity: "3〜5ブース",
    price: "¥10,000/日",
  },
  {
    id: "s5",
    name: "福岡天神マルシェ会場",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    location: "福岡県福岡市中央区",
    rating: 4.8,
    reviewCount: 35,
    tags: ["定期開催", "マルシェ"],
    description: "毎週末開催の人気マルシェ会場。食品からハンドメイドまで幅広いジャンルで出店可能。",
    capacity: "20〜30ブース",
    price: "¥5,000/日",
  },
  {
    id: "s6",
    name: "吉祥寺コミュニティスペース",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
    location: "東京都武蔵野市",
    rating: 4.7,
    reviewCount: 28,
    tags: ["屋内", "ワークショップ可"],
    description: "地域に愛されるコミュニティスペース。ワークショップやミニマルシェに最適な広さです。",
    capacity: "5〜8ブース",
    price: "¥12,000/日",
  },
];

export const messages: Message[] = [
  {
    id: "m1",
    partnerId: "s1",
    partnerName: "代官山カフェ前スペース",
    partnerImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80",
    lastMessage: "来週末の出店について、ご確認いただけますでしょうか？",
    timestamp: "10分前",
    unread: true,
  },
  {
    id: "m2",
    partnerId: "v2",
    partnerName: "handmade Sora",
    partnerImage: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=200&q=80",
    lastMessage: "出店のご希望ありがとうございます！詳細をお送りします。",
    timestamp: "1時間前",
    unread: true,
  },
  {
    id: "m3",
    partnerId: "s3",
    partnerName: "中目黒ギャラリー",
    partnerImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80",
    lastMessage: "ご予約を承りました。当日お待ちしております。",
    timestamp: "昨日",
    unread: false,
  },
  {
    id: "m4",
    partnerId: "v1",
    partnerName: "Cafe Maru",
    partnerImage: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=200&q=80",
    lastMessage: "イベント当日の搬入時間について確認させてください。",
    timestamp: "2日前",
    unread: false,
  },
];

export const testimonials = [
  {
    id: "t1",
    name: "山田花子",
    role: "ハンドメイド作家",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    content: "goenを通じて素敵な出店場所に出会えました。オーナーさんとのコミュニケーションもスムーズで、安心して出店できています。",
    rating: 5,
  },
  {
    id: "t2",
    name: "佐藤太郎",
    role: "カフェオーナー",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    content: "空いているスペースを有効活用できるようになりました。素敵な出店者さんとの出会いが、お店の魅力向上にもつながっています。",
    rating: 5,
  },
  {
    id: "t3",
    name: "鈴木美咲",
    role: "キッチンカーオーナー",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    content: "新規開拓が難しかった出店場所探しが、goenのおかげで格段に楽になりました。マッチング機能も使いやすいです。",
    rating: 5,
  },
];

export const features = [
  {
    title: "かんたん登録",
    description: "プロフィールを登録するだけで、すぐにマッチング開始。写真や実績を載せてアピールできます。",
    icon: "user-plus",
  },
  {
    title: "安心のメッセージ",
    description: "プラットフォーム内でのやりとりだから安心。条件交渉からスケジュール調整まで一元管理。",
    icon: "message-circle",
  },
  {
    title: "レビューで信頼構築",
    description: "取引後のレビューシステムで、信頼できるパートナーを見つけやすくなります。",
    icon: "star",
  },
  {
    title: "本人確認済み",
    description: "本人確認を完了したユーザーには認証バッジを付与。安心してマッチングできます。",
    icon: "shield-check",
  },
];

export const stats = [
  { label: "登録出店者数", value: "2,500+", suffix: "人" },
  { label: "登録スペース数", value: "800+", suffix: "件" },
  { label: "累計マッチング", value: "15,000+", suffix: "件" },
  { label: "満足度", value: "98", suffix: "%" },
];
