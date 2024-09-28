"use client";

import { useState } from "react";
import Link from "next/link";
import { Attachment } from "@prisma/client";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  attachments: Attachment[];
}

export const Attachments = ({ attachments }: Props) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (url: string, filename: string, id: string) => {
    setDownloadingId(id);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="mt-2 space-y-3">
      {attachments?.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-md border p-2"
        >
          <p className="text-muted-foreground">{item.title}</p>
          <div className="flex items-center gap-x-3">
            <Button variant="outline" asChild>
              <Link href={item.url} target="_blank">
                View
              </Link>
            </Button>
            <Button
              onClick={() => handleDownload(item.url, item.title, item.id)}
              disabled={downloadingId === item.id}
            >
              {downloadingId === item.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                "Download"
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

const FileSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between">
          <Skeleton className="h-8 w-2/6" />
          <div className="flex items-center gap-x-3">
            <Skeleton className="h-8 w-[80px]" />
            <Skeleton className="h-8 w-[80px]" />
          </div>
        </div>
      ))}
    </div>
  );
};
