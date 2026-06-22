import type { PosterItem } from "@/types";

export const posters: PosterItem[] = [
  { id: "ig-01", title: "Festive Sale Carousel", category: "Instagram Posters", aspect: "square", palette: "gold", imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop" },
  { id: "ig-02", title: "Minimal Quote Post", category: "Instagram Posters", aspect: "square", palette: "silver", imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop" },
  { id: "ig-03", title: "Product Drop Teaser", category: "Instagram Posters", aspect: "story", palette: "mixed", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop" },
  { id: "ig-04", title: "Brand Anniversary Post", category: "Instagram Posters", aspect: "square", palette: "gold", imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop" },
  { id: "event-01", title: "Music Night Poster", category: "Event Posters", aspect: "portrait", palette: "mixed", imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop" },
  { id: "event-02", title: "Tech Meetup Poster", category: "Event Posters", aspect: "portrait", palette: "gold", imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop" },
  { id: "event-03", title: "Wedding Invite Poster", category: "Event Posters", aspect: "portrait", palette: "silver", imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop" },
  { id: "promo-01", title: "Flash Sale Banner", category: "Promotional Posters", aspect: "square", palette: "gold", imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format&fit=crop" },
  { id: "promo-02", title: "App Launch Promo", category: "Promotional Posters", aspect: "story", palette: "mixed", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" },
  { id: "promo-03", title: "Festival Offer Poster", category: "Promotional Posters", aspect: "square", palette: "gold", imageUrl: "https://images.unsplash.com/photo-1512813583145-ac554ac61090?q=80&w=600&auto=format&fit=crop" },
  { id: "biz-01", title: "Corporate Profile Card", category: "Business Posters", aspect: "square", palette: "silver", imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop" },
  { id: "biz-02", title: "Service Rate Card", category: "Business Posters", aspect: "portrait", palette: "silver", imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop" },
  { id: "biz-03", title: "Hiring Announcement", category: "Business Posters", aspect: "square", palette: "mixed", imageUrl: "https://images.unsplash.com/photo-1521791136368-1a851900d141?q=80&w=600&auto=format&fit=crop" },
  { id: "event-04", title: "Workshop Poster", category: "Event Posters", aspect: "portrait", palette: "gold", imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop" },
  { id: "ig-05", title: "Testimonial Highlight", category: "Instagram Posters", aspect: "square", palette: "mixed", imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop" },
  { id: "promo-04", title: "Black Friday Poster", category: "Promotional Posters", aspect: "square", palette: "silver", imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop" },
];

export const posterCategories = [
  "All",
  "Instagram Posters",
  "Event Posters",
  "Promotional Posters",
  "Business Posters",
] as const;
