import { BOOKING_BASE_URL } from "@/lib/site";

export type TeamMember = {
  slug: string;
  bookingUrl: string;
  galleryFolder: string;
  name: string;
  initials: string;
  service: string;
  image: string | null;
  bio?: string[];
};

export const team: TeamMember[] = [
  // {
  //   name: "Violet Eliza",
  //   slug: "violet-eliza",
  //   bookingUrl: BOOKING_BASE_URL,
  //   galleryFolder: "violet-gallery",
  //   initials: "VE",
  //   service: "Hair Stylist",
  //   image: "/violet-eliza.png",
  //   bio: [
  //     "With six years behind the chair, Violet specializes in custom blonding, bridal hair and updos, special-occasion styling, and men’s precision cuts.",
  //     "Her approach is centered on creating effortlessly beautiful, personalized looks tailored to each client—whether that means customized blonde dimension, an elevated style for a special occasion, or a clean, precision cut.",
  //     "Based in Chicago’s Gold Coast, Violet brings a thoughtful, individualized approach to every appointment, helping each client leave with a look that feels polished, flattering, and uniquely their own.",
  //   ],
  // },
  {
    name: "Ruby Smizer",
    slug: "ruby-smizer",
    bookingUrl: `${BOOKING_BASE_URL}/provider/rubys`,
    galleryFolder: "ruby-gallery",
    initials: "RS",
    service: "Nail Technician",
    image: "/ruby-smizer.png",
    bio: [
      "Ruby is a talented Nail Technician at Gold Coast Beauty Salon & Spa who enjoys helping clients look and feel their best through beautiful, well-maintained nails.",
      "Offering a variety of services, including classic, gel, and Russian manicures, acrylic nail enhancements, and relaxing pedicures, Ruby is dedicated to providing a personalized experience tailored to each client's preferences.",
      "Whether you're looking for a clean, natural finish, a fresh set of acrylics, or a relaxing spa pedicure, Ruby brings care and attention to detail to every appointment. She understands that nail care is more than just a beauty service—it's an opportunity to unwind, express your personal style, and enjoy a little well-deserved self-care.",
      "Ruby looks forward to welcoming you to Gold Coast Beauty Salon & Spa and helping you leave feeling refreshed, confident, and beautifully polished.",
    ],
  },
  {
    name: "Genean Michele",
    slug: "genean-michele",
    bookingUrl: `${BOOKING_BASE_URL}/provider/geneanm`,
    galleryFolder: "genean-gallery",
    initials: "GM",
    service: "Hair Stylist",
    image: "/genean-michele.png",
    bio: [
      "With over six years in the beauty industry, Genean specializes in bridal artistry and styling, extensions, and effortless lived-in color. Chicago-based since 2023, she loves creating customized looks that feel polished, dimensional, and uniquely suited to each client.",
      "Genean is certified in K-tip, tape-in, and micro-link sew-in extensions, as well as Brazilian Blowout treatments. She also has a passion for hair health, specializing in restorative treatments and hair repair for damage caused by color services or improper extension installations. Whether creating a special-event style, adding length and dimension, or helping a client restore and maintain healthy hair, Genean brings a thoughtful, personalized approach to every service.",
    ],
  },
  {
    name: "Marija Aleksic",
    slug: "marija-aleksic",
    bookingUrl: `${BOOKING_BASE_URL}/provider/marijaa`,
    galleryFolder: "marija-gallery",
    initials: "MA",
    service: "Nail Technician",
    image: "/marija-aleksic (Nail Technician).png",
  },
  {
    name: "Melanie Ruiz",
    slug: "melanie-ruiz",
    bookingUrl: `${BOOKING_BASE_URL}/provider/melanier`,
    galleryFolder: "melanie-gallery",
    initials: "MR",
    service: "Esthetician",
    image: "/melanie-ruiz(Esthetician).png",
  },
];

// Ready for a card once the remaining profile details are supplied.
export const pendingTeam = [{ name: "Deanna W", bookingUrl: `${BOOKING_BASE_URL}/provider/deannaw` }];
