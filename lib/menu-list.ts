import {
  Users,
  LayoutGrid,
  LucideIcon,
  Pen,
  List,
  Radio,
  Layers3,
  UserCog,
  Compass,
  BookOpen,
  Headset,
  UsersRound,
  MessageCircleQuestion,
  MessagesSquare,
  PlusCircle,
  BookOpenCheck,
  FileText,
  Megaphone,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin",
          label: "Dashboard",
          active: pathname === "/admin",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Main",
      menus: [
        {
          href: "",
          label: "Category",
          active: pathname.includes("/admin/category"),
          icon: Layers3,
          submenus: [
            {
              href: "/admin/category/new",
              label: "New",
              active: pathname === "/admin/category/new",
              icon: PlusCircle,
            },
            {
              href: "/admin/category",
              label: "List",
              active: pathname === "/admin/category",
              icon: List,
            },
          ],
        },
        {
          href: "",
          label: "Course",
          active: pathname.includes("/admin/course"),
          icon: BookOpen,
          submenus: [
            {
              href: "/admin/course/new",
              label: "New",
              active: pathname === "/admin/course/new",
              icon: PlusCircle,
            },
            {
              href: "/admin/course",
              label: "List",
              active: pathname === "/admin/course",
              icon: List,
            },
          ],
        },
        {
          href: "/admin/assignment",
          label: "Assignment",
          active: pathname.includes("/admin/assignment"),
          icon: FileText,
          submenus: [],
        },
        {
          href: "/admin/question",
          label: "Question",
          active: pathname.includes("/admin/question"),
          icon: MessageCircleQuestion,
          submenus: [],
        },
        {
          href: "/admin/student",
          label: "Students",
          active: pathname.includes("/admin/student"),
          icon: Users,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Support",
      menus: [
        {
          href: "/admin/chat",
          label: "Chat",
          active: pathname.includes("/admin/chat"),
          icon: MessagesSquare,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Notice",
      menus: [
        {
          href: "/admin/notice",
          label: "Notice",
          active: pathname.includes("/admin/notice"),
          icon: Megaphone,
          submenus: [],
        },
      ],
    },
  ];
}

export function getMenuListUser(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname === "/dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/dashboard/courses",
          label: "Courses",
          active: pathname.includes("/dashboard/courses"),
          icon: BookOpen,
          submenus: [],
        },
        {
          href: "/dashboard/my-courses",
          label: "My Courses",
          active: pathname === "/dashboard/my-courses",
          icon: BookOpenCheck,
          submenus: [],
        },
        {
          href: "/dashboard/assignment",
          label: "Assignment",
          active: pathname.includes("/dashboard/assignment"),
          icon: FileText,
          submenus: [],
        },
        {
          href: "/dashboard/chat",
          label: "Chat",
          active: pathname === "/dashboard/chat",
          icon: MessagesSquare,
          submenus: [],
        },
        {
          href: "/dashboard/profile",
          label: "Profile",
          active: pathname === "/dashboard/profile",
          icon: UserCog,
          submenus: [],
        },
      ],
    },
  ];
}

export function getMenuListTeacher(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/teacher",
          label: "Dashboard",
          active: pathname === "/teacher",
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/teacher/courses",
          label: "My Courses",
          active: pathname === "/teacher/courses",
          icon: BookOpen,
          submenus: [],
        },
        {
          href: "/teacher/support",
          label: "Support",
          active: pathname === "/teacher/support",
          icon: Headset,
          submenus: [],
        },
      ],
    },
  ];
}
