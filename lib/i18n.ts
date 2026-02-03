export const locales = ['en', 'ka', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'EN',
  ka: 'KA',
  ru: 'RU',
};

const dictionary = {
  en: {
    nav: {
      home: 'Home',
      tours: 'Tours',
      gallery: 'Gallery',
      admin: 'Admin',
      logoTag: 'Georgia Tours',
    },
    hero: {
      cta: 'View Tours',
    },
    home: {
      storyEyebrow: 'Experience',
      storyTitle: 'From city alleys to alpine passes',
      storyBody:
        'We craft tours that move slowly enough to taste the wine, hear the stories, and meet the people who make Georgia unforgettable.',
    },
    sections: {
      whyTitle: 'Why ZazaGuide',
      featuredTitle: 'Featured Tours',
      featuredSubtitle: 'Handpicked experiences for unforgettable adventures',
    },
    tours: {
      title: 'All Tours',
      subtitle: 'Explore our complete collection of unforgettable experiences',
      emptyTitle: 'No tours available yet',
      emptyBody: 'Check back soon for amazing experiences!',
      back: 'Back to All Tours',
      about: 'About This Tour',
      availableTimes: 'Available Times',
      book: 'Book This Tour',
      priceLabel: 'Price',
      contactWhatsapp: 'Contact on WhatsApp',
      messageInstagram: 'Message on Instagram',
    },
    gallery: {
      title: 'Gallery',
      subtitle: 'Explore moments from our unforgettable tours',
      emptyTitle: 'No images in gallery yet',
      emptyBody: 'Check back soon for amazing photos!',
    },
    footer: {
      tagline: 'Authentic Georgia, guided by locals.',
      follow: 'Follow Us',
      rights: 'All rights reserved.',
    },
    common: {
      currency: 'GEL',
      difficulty: 'Difficulty',
      viewDetails: 'View Details',
    },
  },
  ka: {
    nav: {
      home: 'მთავარი',
      tours: 'ტურები',
      gallery: 'გალერეა',
      admin: 'ადმინი',
      logoTag: 'ტურები საქართველოში',
    },
    hero: {
      cta: 'ტურების ნახვა',
    },
    home: {
      storyEyebrow: 'გამოცდილება',
      storyTitle: 'ქალაქის ქუჩებიდან ალპურ გადასვლებამდე',
      storyBody:
        'ჩვენ ვქმნით ტურებს, რომლითაც შეძლებთ ღვინის დაგემოვნებას, ისტორიების მოსმენას და იმ ადამიანების გაცნობას, ვინც საქართველოს უნიკალურს ხდის.',
    },
    sections: {
      whyTitle: 'რატომ ZazaGuide',
      featuredTitle: 'რჩეული ტურები',
      featuredSubtitle: 'ხელით შერჩეული გამოცდილებები დაუვიწყარი თავგადასავლებისთვის',
    },
    tours: {
      title: 'ყველა ტური',
      subtitle: 'აღმოაჩინე ჩვენი დაუვიწყარი გამოცდილებები',
      emptyTitle: 'ტურები ჯერ არ არის',
      emptyBody: 'მალე დაბრუნდით ახალი გამოცდილებებისთვის!',
      back: 'უკან ტურში',
      about: 'ტურის შესახებ',
      availableTimes: 'ხელმისაწვდომი დროები',
      book: 'ტურის დაჯავშნა',
      priceLabel: 'ფასი',
      contactWhatsapp: 'WhatsApp-ზე დაკავშირება',
      messageInstagram: 'Instagram-ზე მიწერა',
    },
    gallery: {
      title: 'გალერეა',
      subtitle: 'გადახედე ჩვენს დაუვიწყარ მოგზაურობებს',
      emptyTitle: 'გალერეა ცარიელია',
      emptyBody: 'მალე დაემატება ახალი ფოტოები!',
    },
    footer: {
      tagline: 'ავთენტური საქართველო ადგილობრივებთან ერთად.',
      follow: 'გამოგვყევი',
      rights: 'ყველა უფლება დაცულია.',
    },
    common: {
      currency: 'GEL',
      difficulty: 'სირთულე',
      viewDetails: 'დეტალები',
    },
  },
  ru: {
    nav: {
      home: 'Главная',
      tours: 'Туры',
      gallery: 'Галерея',
      admin: 'Админ',
      logoTag: 'Туры по Грузии',
    },
    hero: {
      cta: 'Смотреть туры',
    },
    home: {
      storyEyebrow: 'Впечатления',
      storyTitle: 'От городских улочек до альпийских перевалов',
      storyBody:
        'Мы создаем маршруты, где есть время попробовать вино, услышать истории и встретить людей, которые делают Грузию особенной.',
    },
    sections: {
      whyTitle: 'Почему ZazaGuide',
      featuredTitle: 'Избранные туры',
      featuredSubtitle: 'Отобранные маршруты для незабываемых впечатлений',
    },
    tours: {
      title: 'Все туры',
      subtitle: 'Откройте коллекцию незабываемых впечатлений',
      emptyTitle: 'Туры пока не доступны',
      emptyBody: 'Скоро появятся новые маршруты!',
      back: 'Назад ко всем турам',
      about: 'О туре',
      availableTimes: 'Доступное время',
      book: 'Забронировать тур',
      priceLabel: 'Цена',
      contactWhatsapp: 'Связаться в WhatsApp',
      messageInstagram: 'Написать в Instagram',
    },
    gallery: {
      title: 'Галерея',
      subtitle: 'Моменты наших путешествий',
      emptyTitle: 'Галерея пока пуста',
      emptyBody: 'Скоро появятся новые фотографии!',
    },
    footer: {
      tagline: 'Аутентичная Грузия с местными гидами.',
      follow: 'Следите за нами',
      rights: 'Все права защищены.',
    },
    common: {
      currency: 'GEL',
      difficulty: 'Сложность',
      viewDetails: 'Подробнее',
    },
  },
};

export type Dictionary = typeof dictionary.en;

const difficultyLabels: Record<Locale, Record<string, string>> = {
  en: { Easy: 'Easy', Medium: 'Medium', Hard: 'Hard' },
  ka: { Easy: 'მარტივი', Medium: 'საშუალო', Hard: 'რთული' },
  ru: { Easy: 'Легко', Medium: 'Средне', Hard: 'Сложно' },
};

export function getDictionary(locale: string): Dictionary {
  if (locale === 'ka' || locale === 'ru' || locale === 'en') {
    return dictionary[locale];
  }
  return dictionary.en;
}

export function normalizeLocale(locale: string | undefined): Locale {
  if (locale === 'ka' || locale === 'ru' || locale === 'en') {
    return locale;
  }
  return defaultLocale;
}

export function getDifficultyLabel(locale: Locale, value: string): string {
  return difficultyLabels[locale][value] || value;
}
