export const CATEGORY_TAG_LIST = [
  {
    value: "Education",
    label: "Education",
  },
  {
    value: "Language",
    label: "Language",
  },
  {
    value: "Technology",
    label: "Technology",
  },
  {
    value: "Cooking",
    label: "Cooking",
  },
];

type NavMenu = {
  title: string;
  href: string;
};

export const navs: NavMenu[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Courses",
    href: "/dashboard/courses",
  },
  {
    title: "FAQ",
    href: "/faq",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];
