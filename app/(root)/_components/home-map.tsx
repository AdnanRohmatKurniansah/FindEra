"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { itemData } from "@/types";
import dynamic from "next/dynamic";
import { useMemo } from "react";

interface HomeMapProps {
  position: [number, number];
  zoom: number;
  items: itemData[];
}

const HomeMap = ({ position, zoom, items }: HomeMapProps) => {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/shared/map"), {
        loading: () => <Skeleton className="h-full w-full" />,
        ssr: false,
      }),
    []
  );

  return <Map position={position} zoom={zoom} items={items} />;
};

export default HomeMap;
