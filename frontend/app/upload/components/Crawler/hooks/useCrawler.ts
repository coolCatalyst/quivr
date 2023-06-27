/* eslint-disable */
import { redirect } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { useSupabase } from "@/lib/context/SupabaseProvider";
import { useAxios } from "@/lib/hooks";
import { useToast } from "@/lib/hooks/useToast";
import { useEventTracking } from "@/services/analytics/useEventTracking";


import { isValidUrl } from "../helpers/isValidUrl";

export const useCrawler = () => {
  const [isCrawling, setCrawling] = useState(false);
  const urlInputRef = useRef<HTMLInputElement | null>(null);
  const { session } = useSupabase();
  const { publish } = useToast();
  const { axiosInstance } = useAxios();
  const { track} = useEventTracking();


  if (session === null) {
    redirect("/login");
  }

  const crawlWebsite = useCallback(async () => {
    // Validate URL
    const url = urlInputRef.current ? urlInputRef.current.value : null;

    if (!url || !isValidUrl(url)) {
      // Assuming you have a function to validate URLs
      void track("URL_INVALID");
      publish({
        variant: "danger",
        text: "Invalid URL",
      });

      return;
    }

    // Configure parameters
    const config = {
      url: url,
      js: false,
      depth: 1,
      max_pages: 100,
      max_time: 60,
    };

    setCrawling(true);
    void track("URL_CRAWLED");

    try {
      const response = await axiosInstance.post(`/crawl/`, config);

      publish({
        variant: response.data.type,
        text: response.data.message,
      });
    } catch (error: unknown) {
      publish({
        variant: "danger",
        text: "Failed to crawl website: " + JSON.stringify(error),
      });
    } finally {
      setCrawling(false);
    }
  }, [session.access_token, publish]);

  return {
    isCrawling,
    urlInputRef,

    crawlWebsite,
  };
};
