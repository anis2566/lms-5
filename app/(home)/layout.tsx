import { Metadata } from "next";

import { Header } from "./_components/navbar";
import { Footer } from "./_components/footer";

interface Props {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "LMS",
  description: "Next generatation learning platform.",
};

const HomeLayout = ({ children }: Props) => {
  return (
    <div className="w-full p-4">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default HomeLayout;
