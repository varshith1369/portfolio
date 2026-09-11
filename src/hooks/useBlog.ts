import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const useBlogList = () => {
  return useQuery({
    queryKey: ["blog"],
    queryFn: async (): Promise<Tables<"blog">[]> => {
      const { data, error } = await supabase
        .from("blog")
        .select("*")
        .order("publish_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: async (): Promise<Tables<"blog"> | null> => {
      const { data, error } = await supabase
        .from("blog")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};
