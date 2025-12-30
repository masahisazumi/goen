"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  const href = type === "vendor" ? `/vendor/${id}` : `/space/${id}`;

  return (
    <Card className="group overflow-hidden rounded-2xl border border-border shadow-sm transition-all hover:shadow-md bg-card">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={href}>
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-3 top-3 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm transition-all hover:bg-white",
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
              variant="secondary"
              className="rounded-full bg-white/90 text-xs backdrop-blur-sm"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <CardContent className="p-4">
        <Link href={href}>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            {rating && (
              <div className="flex items-center gap-1 text-sm shrink-0">
                <Star className="h-4 w-4 fill-sunny-yellow text-sunny-yellow" />
                <span className="font-medium">{rating.toFixed(1)}</span>
                {reviewCount && (
                  <span className="text-muted-foreground">({reviewCount})</span>
                )}
              </div>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </Link>
      </CardContent>
    </Card>
  );
}
