import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface WorkflowItem {
  badgeTitle: string;
  title: string;
  description: string;
  image: string;
}

const HowItWorksList: WorkflowItem[] = [
  {
    badgeTitle: "Learn",
    title: "Access Interactive Course Content",
    description:
      "Engage with rich, multimedia course materials. Watch videos, read articles, and complete interactive exercises to enhance your learning experience.",
    image: "/step-1.png",
  },
  {
    badgeTitle: "Ask",
    title: "Get Answers to Your Questions",
    description:
      "Use our integrated Q&A system to ask questions about the course material. Get responses from instructors and fellow learners to deepen your understanding.",
    image: "/step-2.png",
  },
  {
    badgeTitle: "Share",
    title: "Collaborate with Attachments",
    description:
      "Easily share documents, images, and other files with your instructors and peers. Attach relevant materials to your questions or assignments for better context.",
    image: "/step-3.png",
  },
  {
    badgeTitle: "Assignment",
    title: "Complete Hands-On Assignments",
    description:
      "Apply what you've learned by completing practical assignments. These tasks help reinforce your knowledge and give you real-world experience.",
    image: "/step-5.png",
  },
  {
    badgeTitle: "Support",
    title: "Access Help When You Need It",
    description:
      "Get technical and academic support throughout your learning journey. Our dedicated support team is here to assist you with any issues or concerns.",
    image: "/step-4.png",
  },
];

export const Workflow: React.FC = () => {
  return (
    <section className="container py-20">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-center text-lg tracking-wider text-primary">
          How It Works
        </h2>

        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Your Learning Journey
        </h2>
      </div>

      <div className="relative mx-auto lg:w-[80%]">
        {HowItWorksList.map((item, index) => (
          <div
            key={item.title}
            className={`mb-8 flex items-center ${
              index % 2 !== 0 ? "flex-row-reverse" : ""
            }`}
          >
            <Card className="h-full border-0 bg-transparent shadow-none">
              <CardHeader>
                <div className="pb-4">
                  <Badge>{item.badgeTitle}</Badge>
                </div>

                <CardTitle>{item.title}</CardTitle>
              </CardHeader>

              <CardContent className="w-[80%] text-muted-foreground">
                {item.description}
              </CardContent>
            </Card>

            <img
              src={item.image}
              alt={`Image illustrating ${item.title}`}
              className="mx-auto w-[150px] -scale-x-100 md:w-[250px] lg:w-[300px]"
            />
            <div
              className={`absolute -z-10 ${
                index % 2 !== 0 ? "left-0" : "right-0"
              } h-72 w-44 rounded-full bg-primary/15 blur-3xl dark:bg-primary/10 lg:h-80 lg:w-64`}
            ></div>
          </div>
        ))}
      </div>
    </section>
  );
};
