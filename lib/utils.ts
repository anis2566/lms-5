import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function saltAndHashPassword(password: any) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
  }).format(price);
};

// a utility function to get the video length to hours
export const getVideoLength = (videoLength: number) => {
  const hours = Math.floor(videoLength / 3600);
  const minutes = Math.floor((videoLength % 3600) / 60);
  const seconds = videoLength % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};
