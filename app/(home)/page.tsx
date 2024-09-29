import { db } from "@/lib/prisma";
import { Courses } from "./_components/courses";
import { Hero } from "./_components/hero";
import { Workflow } from "./_components/workflow";
import { Testimonials } from "./_components/testimonials";
import { Newslettr } from "./_components/newslettr";

const App = async () => {
  const courses = await db.course.findMany({
    take: 10,
    include: {
      category: true,
      chapters: {
        where: {
          isPublished: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const coursesWithProgress = courses.map((course) => ({
    ...course,
    progress: null,
  }));

  return (
    <div className="w-full space-y-8">
      <Hero />
      <Courses courses={coursesWithProgress} />
      <Workflow />
      <Testimonials />
      <Newslettr />
    </div>
  );
};

export default App;
