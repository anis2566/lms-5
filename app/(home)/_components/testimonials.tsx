import { Review, User } from "@prisma/client";
import { Rating } from "@smastrom/react-rating";

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


interface ReviewWithUser extends Review {
  user: User;
}

interface Props {
  reviews: ReviewWithUser[];
}

export const Testimonials = ({ reviews }: Props) => {
  return (
    <section id="testimonials" className="container py-20">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-center text-lg tracking-wider text-primary">
          Testimonials
        </h2>

        <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
          Hear What Our {reviews.length}+ Clients Say
        </h2>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="relative mx-auto w-[80%] sm:w-[90%] lg:max-w-screen-xl"
      >
        <CarouselContent>
          {reviews.map((review) => (
            <CarouselItem
              key={review.id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card className="flex h-[230px] flex-col bg-muted/50 dark:bg-card">
                <CardContent className="flex-grow pb-0 pt-6">
                  <div className="flex gap-1 pb-4">
                    <Rating
                      value={review.rating}
                      className="h-4 w-4 fill-primary text-primary"
                      readOnly
                      style={{ width: 100 }}
                    />
                  </div>
                  <p className="line-clamp-4 overflow-hidden text-ellipsis">
                    &quot;{review.content}&quot;
                  </p>
                </CardContent>

                <CardHeader>
                  <div className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={review.user.image || ""}
                        alt={`Avatar of ${review.user.name}`}
                      />
                      <AvatarFallback>{review.user.name?.slice(0, 2)}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <CardTitle className="text-lg">{review.user.name}</CardTitle>
                      <CardDescription>{review.user.email}</CardDescription>
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
