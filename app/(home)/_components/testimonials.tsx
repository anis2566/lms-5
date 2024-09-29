import { Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ReviewProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
  rating: number;
}

const reviewList: ReviewProps[] = [
  {
    image: "https://i.pravatar.cc/150?img=1",
    name: "Emily Chen",
    userName: "Software Developer",
    comment:
      "The courses on this platform have been instrumental in advancing my career. The AI and Machine Learning track was particularly enlightening and helped me transition into a new role at a top tech company.",
    rating: 5.0,
  },
  {
    image: "https://i.pravatar.cc/150?img=2",
    name: "Michael Rodriguez",
    userName: "Data Scientist",
    comment:
      "I've taken several data science courses here, and I'm impressed by the depth of content and hands-on projects. The instructors are industry experts, and the community support is fantastic.",
    rating: 4.8,
  },
  {
    image: "https://i.pravatar.cc/150?img=3",
    name: "Sarah Johnson",
    userName: "UX Designer",
    comment:
      "As someone transitioning into UX design, I found the UI/UX track incredibly valuable. The courses cover both theory and practical skills, and the portfolio projects helped me land my first design job.",
    rating: 4.9,
  },
  {
    image: "https://i.pravatar.cc/150?img=4",
    name: "David Patel",
    userName: "Cybersecurity Analyst",
    comment:
      "The cybersecurity program here is top-notch. It covers the latest threats and defense strategies, and the hands-on labs gave me practical experience that I use daily in my work protecting critical infrastructure.",
    rating: 5.0,
  },
  {
    image: "https://i.pravatar.cc/150?img=5",
    name: "Lisa Thompson",
    userName: "Product Manager",
    comment:
      "The product management course exceeded my expectations. It provided a comprehensive overview of the field and equipped me with tools and frameworks that I immediately applied in my role.",
    rating: 5.0,
  },
  {
    image: "https://i.pravatar.cc/150?img=6",
    name: "Alex Kowalski",
    userName: "Full Stack Developer",
    comment:
      "I completed the full stack web development bootcamp, and it was intense but rewarding. The curriculum is up-to-date with the latest technologies, and the capstone project was a great addition to my portfolio.",
    rating: 4.9,
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="container py-20">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-center text-lg tracking-wider text-primary">
          Testimonials
        </h2>

        <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
          Hear What Our 100+ Clients Say
        </h2>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="relative mx-auto w-[80%] sm:w-[90%] lg:max-w-screen-xl"
      >
        <CarouselContent>
          {reviewList.map((review) => (
            <CarouselItem
              key={review.name}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card className="flex h-[300px] flex-col bg-muted/50 dark:bg-card">
                <CardContent className="flex-grow pb-0 pt-6">
                  <div className="flex gap-1 pb-4">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="line-clamp-4 overflow-hidden text-ellipsis">
                    &quot;{review.comment}&quot;
                  </p>
                </CardContent>

                <CardHeader>
                  <div className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={review.image}
                        alt={`Avatar of ${review.name}`}
                      />
                      <AvatarFallback>{review.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <CardDescription>{review.userName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};
