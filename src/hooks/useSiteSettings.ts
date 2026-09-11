import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string | null;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;
      return data as SiteSetting[];
    },
  });
};

export const useSiteSetting = (key: string, defaultValue: string = "") => {
  const { data: settings, isLoading, error } = useSiteSettings();

  const value = settings?.find((s) => s.setting_key === key)?.setting_value ?? defaultValue;

  return { value, isLoading, error };
};

// Specific hook for Cal.com URL
export const useCalComUrl = () => {
  return useSiteSetting("cal_com_url", "demo");
};
