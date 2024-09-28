"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactFormProps {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const [contactForm, setContactForm] = useState<ContactFormProps>({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, message } = contactForm;
    console.log(contactForm);

    const mailToLink = `mailto:leomirandadev@gmail.com?subject=Contact Form Submission&body=Hello, I am ${name}, my Email is ${email}. %0D%0A${message}`;

    window.location.href = mailToLink;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="container py-24 sm:py-32">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="mb-4">
            <h2 className="mb-2 text-lg tracking-wider text-primary">
              Contact
            </h2>
            <h2 className="text-3xl font-bold md:text-4xl">Connect With Us</h2>
          </div>
          <p className="mb-8 text-muted-foreground lg:w-5/6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
            ipsam sint enim exercitationem ex autem corrupti quas tenetur
          </p>
          {/* Contact information can be added here */}
        </div>

        <Card className="bg-muted/60 dark:bg-card">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={contactForm.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your message..."
                  rows={5}
                  value={contactForm.message}
                  onChange={handleInputChange}
                />
              </div>

              <Button className="mt-4">Send message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
