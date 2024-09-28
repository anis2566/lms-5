"use client";

import { GENERATE_PLAYER } from "@/app/admin/action";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface VideoPlayerProps {
  videoId: string;
  className?: string;
}

export const VideoPlayer = ({ videoId, className }: VideoPlayerProps) => {
  const { data } = useQuery({
    queryKey: ["generate-video", videoId],
    queryFn: async () => {
      const res = await GENERATE_PLAYER(videoId);
      return res;
    },
  });

  return (
    <div className={cn("relative aspect-video rounded-md")}>
      <iframe
        src={`https://player.vdocipher.com/v2/?otp=${data?.otp}&playbackInfo=${data?.playbackInfo}&player=${process.env.NEXT_PUBLIC_VIDEO_CIPHER_PLAYER_ID}`}
        allowFullScreen={true}
        allow="encrypted-media"
        className={cn("h-full w-full rounded-md border-none", className)}
      ></iframe>
    </div>
  );
};
