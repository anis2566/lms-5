import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What courses are available?",
    answer:
      "We offer a wide range of courses including programming, data science, design, and business. Check our course catalog for the full list.",
    value: "item-1",
  },
  {
    question: "How do I enroll in a course?",
    answer:
      "To enroll, simply navigate to the course page and click the 'Enroll' button. You'll be guided through the registration process.",
    value: "item-2",
  },
  {
    question: "Are the courses self-paced or instructor-led?",
    answer:
      "We offer both self-paced and instructor-led courses. Self-paced courses allow you to learn at your own speed, while instructor-led courses follow a set schedule with live sessions.",
    value: "item-3",
  },
  {
    question: "What are the system requirements for accessing the courses?",
    answer:
      "Most courses can be accessed on any modern web browser. Some programming courses may require specific software installations, which will be detailed in the course description.",
    value: "item-4",
  },
  {
    question: "How long do I have access to a course after enrolling?",
    answer:
      "Once enrolled, you typically have lifetime access to the course materials. However, some courses may have a limited access period, which will be clearly stated in the course details.",
    value: "item-5",
  },
  {
    question: "Are there any prerequisites for the courses?",
    answer:
      "Prerequisites vary by course. Each course description includes information about any required prior knowledge or skills. We also offer beginner-friendly courses with no prerequisites.",
    value: "item-6",
  },
  {
    question: "Can I get a certificate upon completion of a course?",
    answer:
      "Yes, most courses offer a certificate of completion. Some advanced courses may also offer professional certifications, which may require passing an exam.",
    value: "item-7",
  },
  {
    question: "What is your refund policy?",
    answer:
      "We offer a 30-day money-back guarantee for most courses. If you're unsatisfied with a course, you can request a full refund within 30 days of enrollment.",
    value: "item-8",
  },
];

export default function FAQPage() {
  return (
    <section
      id="faq"
      className="container mx-auto w-full max-w-3xl py-24 sm:py-32"
    >
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-center text-lg tracking-wider text-primary">
          FAQS
        </h2>

        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Common Questions
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="mt-4 font-medium">
        Still have questions?{" "}
        <Link href="/contact" className="text-muted-foreground underline">
          Contact us
        </Link>
      </h3>
    </section>
  );
}
