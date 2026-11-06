import { BOOKING_BASE_URL } from "@/lib/site";

export type Service = {
  id: string;
  title: string;
  description: string;
  tagline: string;
  image: string | null;
  url: string;
};

export const services: Service[] = [
  {
    id: "01",
    image: "/images/hair-care.webp",
    title: "Hair",
    description:
      "A thoughtful cut, a fresh shape, a style that feels like you. Hair care for every member of the family.",
    url: `${BOOKING_BASE_URL}/category/services/Haircatgeory`,
    tagline: "Shape. Movement. You.",
  },
  {
    id: "02",
    image: "/images/rainbow-nails.webp",
    title: "Nails",
    description:
      "Careful shaping, considered colour, and a polished finish. Personal nail care with attention to the smallest details.",
    url: `${BOOKING_BASE_URL}/category/services/Nailservice`,
    tagline: "Care in every detail.",
  },
  {
    id: "03",
    image: "/images/treatment-room.webp",
    title: "Waxing",
    description:
      "Attentive waxing in a calm, private space. We take time to explain the process and put your comfort first.",
    url: `${BOOKING_BASE_URL}/category/services/Waxingservice`,
    tagline: "A softer kind of care.",
  },
  {
    id: "04",
    image: "/images/brows-n-lashes.png",
    title: "Brows & Lashes",
    description:
      "Thoughtful shaping and soft definition to frame your natural beauty.",
    tagline: "A little definition. All you.",
    url: `${BOOKING_BASE_URL}/category/services/BrowsLashes`,
  },
  // {
  //   id: "05",
  //   image: null,
  //   title: "Makeup",
  //   description:
  //     "A fresh glow or a special occasion, with a look that feels beautifully yours.",
  //   tagline: "Your moment to shine.",
  //   url: `${BOOKING_BASE_URL}/category/services/Makeup`,
  // },
  // {
  //   id: "06",
  //   image: "/images/treatment-room.webp",
  //   title: "Body Treatments",
  //   description:
  //     "Unwind with restorative care that leaves your body feeling refreshed.",
  //   tagline: "Pause. Breathe. Renew.",
  //   url: `${BOOKING_BASE_URL}/category/services/BodyTreatments`,
  // },
  // {
  //   id: "07",
  //   image: "/images/treatment-room.webp",
  //   title: "Facials",
  //   description:
  //     "Personalized skin care for a healthy glow and a little time to yourself.",
  //   tagline: "Fresh skin. A softer glow.",
  //   url: `${BOOKING_BASE_URL}/category/services/Facials`,
  // },
];