"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProfileCardProps {
  id: string;
  type: "vendor" | "space";
  name: string;
  image: string;
  location: string;
  rating?: number;
  reviewCount?: number;
  tags: string[];
  description: string;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
}

export function ProfileCard({
  id,
  type,
  name,
  image,
  location,
  rating,
  reviewCount,
  tags,
  description,
  isFavorite = false,
  onFavoriteClick,
}: ProfileCardProps) {
  const href = type === "vendor" ? `/store/${id}` : `/space/${id}`;

  return (
    <div className="group overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={href}>
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-3 top-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white shadow-sm",
            isFavorite && "text-primary"
          )}
          onClick={onFavoriteClick}
        >
          <Bookmark
            className={cn("h-5 w-5", isFavorite && "fill-current")}
          />
        </Button>
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              className="rounded-full bg-white/95 text-gray-700 text-xs backdrop-blur-sm border-0 shadow-sm"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="p-5">
        <Link href={href}>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            {rating && (
              <div className="flex items-center gap-1 text-sm shrink-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
                {reviewCount && (
                  <span className="text-gray-500">({reviewCount})</span>
                )}
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location}</span>
          </div>
          <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </Link>
      </div>
    </div>
  );
}
