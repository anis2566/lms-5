import { PackageOpen } from "lucide-react";

interface Props {
  title: string;
}

export const EmptyData = ({ title }: Props) => {
  return (
    <div className="flex h-[40vh] w-full items-center justify-center">
      <div className="space-y-2">
        <PackageOpen className="mx-auto h-10 w-10 text-sky-700" />
        <p className="text-md italic text-muted-foreground">Opps! {title}</p>
      </div>
    </div>
  );
};
