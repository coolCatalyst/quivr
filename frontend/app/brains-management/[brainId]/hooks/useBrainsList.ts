import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { useDevice } from "@/lib/hooks/useDevice";

import { sortBrainsByName } from "../utils/sortByName";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useBrainsList = () => {
  const { isMobile } = useDevice();
  const [open, setOpen] = useState(!isMobile);
  const [searchQuery, setSearchQuery] = useState("");
  const { allBrains } = useBrainContext();

  const pathname = usePathname();

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile, pathname]);

  const brains = allBrains.filter((brain) => {
    const query = searchQuery.toLowerCase();
    const name = brain.name.toLowerCase();

    return name.includes(query);
  });

  return {
    open,
    setOpen,
    searchQuery,
    setSearchQuery,
    brains: sortBrainsByName(brains),
  };
};
