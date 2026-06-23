import type { Offer } from "@/types";
import { unsplash } from "./media";

export const offers: Offer[] = [
  {
    id: 1,
    title: "Раннее бронирование",
    slug: "early-booking",
    badge: "−15%",
    badgeStyle: "gold",
    description: "Скидка 15% при бронировании за 60 дней до заезда.",
    order: 1,
    image: unsplash("photo-1507525428034-b723cf961d3e", "Пляж и море"),
    body: [
      {
        id: 101,
        __component: "offer-blocks.heading",
        text: "Спланируйте отдых заранее — и сэкономьте",
        level: "h2",
      },
      {
        id: 102,
        __component: "offer-blocks.rich-text",
        content:
          "Забронируйте номер не менее чем за 60 дней до даты заезда и получите скидку 15% на проживание. Предложение действует на все категории номеров и распространяется на весь период пребывания.\n\nЧем раньше вы бронируете, тем больше выбор — лучшие номера с видом на море и парк уходят первыми.",
      },
      {
        id: 103,
        __component: "offer-blocks.card-grid",
        heading: "Как воспользоваться",
        cards: [
          {
            id: 1031,
            title: "1. Выберите даты",
            text: "Заезд не ранее чем через 60 дней от дня бронирования.",
          },
          {
            id: 1032,
            title: "2. Забронируйте номер",
            text: "Онлайн или по телефону — скидка применяется автоматически.",
          },
          {
            id: 1033,
            title: "3. Отдыхайте",
            text: "Приезжайте и наслаждайтесь отдыхом по выгодной цене.",
          },
        ],
      },
      {
        id: 104,
        __component: "offer-blocks.image",
        media: unsplash("photo-1551882547-ff40c63fe5fa", "Номер с видом на море"),
        caption: "Номера с видом на море — самые востребованные",
      },
      {
        id: 105,
        __component: "offer-blocks.carousel",
        slides: [
          {
            id: 1051,
            image: unsplash("photo-1571896349842-33c89424de2d", "Интерьер номера"),
            caption: "Просторные номера",
          },
          {
            id: 1052,
            image: unsplash("photo-1582719478250-c89cae4dc85b", "Бассейн"),
            caption: "Открытый бассейн",
          },
          {
            id: 1053,
            image: unsplash("photo-1540555700478-4be289fbecef", "Спа"),
            caption: "Спа и оздоровление",
          },
        ],
      },
      {
        id: 106,
        __component: "offer-blocks.gallery",
        images: [
          unsplash("photo-1445019980597-93fa8acb246c", "Завтрак"),
          unsplash("photo-1455587734955-081b22074882", "Территория курорта"),
          unsplash("photo-1507525428034-b723cf961d3e", "Пляж"),
        ],
      },
      {
        id: 107,
        __component: "offer-blocks.cta-button",
        label: "Забронировать со скидкой",
        href: "/booking",
        style: "primary",
      },
    ],
  },
  {
    id: 2,
    title: "Долгое пребывание",
    slug: "long-stay",
    badge: "1 ночь в подарок",
    badgeStyle: "soft",
    description: "8 ночей по цене 7 — для неспешного, долгого отдыха.",
    order: 2,
    image: unsplash("photo-1455587734955-081b22074882", "Территория курорта"),
    body: [
      {
        id: 201,
        __component: "offer-blocks.rich-text",
        content:
          "Бронируйте от 8 ночей — и одна ночь станет нашим подарком. Чем дольше вы остаётесь, тем глубже отдых: размеренные утра в парке, неспешные прогулки к морю и полноценное восстановление.\n\nПредложение суммируется с лечебными программами санатория.",
      },
      {
        id: 202,
        __component: "offer-blocks.card-grid",
        heading: "Что входит",
        cards: [
          {
            id: 2021,
            title: "8 ночей по цене 7",
            text: "Восьмая ночь проживания — бесплатно.",
          },
          {
            id: 2022,
            title: "Доступ к инфраструктуре",
            text: "Парк, бассейны и пляж — на весь период пребывания.",
          },
        ],
      },
      {
        id: 203,
        __component: "offer-blocks.cta-button",
        label: "Подобрать даты",
        href: "/booking",
        style: "primary",
      },
    ],
  },
  {
    id: 3,
    title: "Оздоровительная программа",
    slug: "health-program",
    badge: "Подарок",
    badgeStyle: "soft",
    description: "Лечебная программа в подарок при путёвке от 10 дней.",
    order: 3,
    image: unsplash("photo-1540555700478-4be289fbecef", "Спа и оздоровление"),
    body: [
      {
        id: 301,
        __component: "offer-blocks.rich-text",
        content:
          "При бронировании путёвки от 10 дней базовая оздоровительная программа — в подарок. Консультация врача, диагностика и курс процедур, подобранный индивидуально под ваше состояние.\n\nИдеально для тех, кто хочет совместить отдых с заботой о здоровье.",
      },
      {
        id: 302,
        __component: "offer-blocks.gallery",
        images: [
          unsplash("photo-1576091160550-2173dba999ef", "Медицинский кабинет"),
          unsplash("photo-1571019613454-1cb2f99b2d8b", "Лечебная физкультура"),
        ],
      },
      {
        id: 303,
        __component: "offer-blocks.cta-button",
        label: "Узнать о лечении",
        href: "/lechenie",
        style: "outline",
      },
    ],
  },
];
