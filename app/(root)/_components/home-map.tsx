"use client";

import { Skeleton } from "@/app/components/ui/skeleton";
import dynamic from "next/dynamic";
import { useMemo } from "react";

interface HomeMapProps {
  position: [number, number];
  zoom: number;
}

const HomeMap = (props: HomeMapProps) => {
  const Map = useMemo(() => dynamic(
    () => import('@/app/components/shared/map'),
    {
      loading: () => <Skeleton className="h-full w-full" />,
      ssr: false
    }
  ), []);

  return <Map {...props} />;
}

export default HomeMap;