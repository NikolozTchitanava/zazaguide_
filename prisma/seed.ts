import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@zazaguide.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.admin.findFirst({
    orderBy: { createdAt: 'asc' },
  });

  if (existingAdmin) {
    if (existingAdmin.email === adminEmail) {
      await prisma.admin.update({
        where: { id: existingAdmin.id },
        data: { password: hashedPassword },
      });
    } else {
      const targetAdmin = await prisma.admin.findUnique({
        where: { email: adminEmail },
      });

      if (targetAdmin) {
        await prisma.admin.update({
          where: { id: targetAdmin.id },
          data: { password: hashedPassword },
        });

        if (targetAdmin.id !== existingAdmin.id) {
          await prisma.admin.delete({
            where: { id: existingAdmin.id },
          });
        }
      } else {
        await prisma.admin.update({
          where: { id: existingAdmin.id },
          data: { email: adminEmail, password: hashedPassword },
        });
      }
    }
  } else {
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
      },
    });
  }

  // Create homepage settings for each locale
  const settingsByLocale: Record<string, { key: string; value: string }[]> = {
    en: [
      { key: 'heroEyebrow', value: 'ZazaGuide' },
      { key: 'heroTagline', value: "Georgia, but deeper." },
      { key: 'heroSubtitle', value: 'Mountains, monasteries, wine — led by local guides.' },
      { key: 'location', value: 'Tbilisi, Georgia' },
      { key: 'tourTypes', value: 'Hiking, city walks, cultural routes, wine tasting, road trips' },
      { key: 'whyChooseUs1', value: 'Local guides with deep knowledge' },
      { key: 'whyChooseUs2', value: 'Small groups and a personal touch' },
      { key: 'whyChooseUs3', value: 'Flexible schedules and custom routes' },
      { key: 'whyChooseUs4', value: 'Best value for authentic experiences' },
      { key: 'whyChooseUs5', value: 'Safety-first approach and quality gear' },
      { key: 'whyChooseUs6', value: 'Responsible, sustainable tourism' },
    ],
    ka: [
      { key: 'heroEyebrow', value: 'ZazaGuide' },
      { key: 'heroTagline', value: 'აღმოაჩინე საქართველო სხვა კუთხით' },
      { key: 'heroSubtitle', value: 'მთები, მონასტრები, ღვინო — ადგილობრივი გიდებით' },
      { key: 'location', value: 'თბილისი, საქართველო' },
      { key: 'tourTypes', value: 'ლაშქრობა, ქალაქის ტური, კულტურული მარშრუტები, ღვინის დეგუსტაცია, საგზაო ტურები' },
      { key: 'whyChooseUs1', value: 'ადგილობრივი გიდები ღრმა ცოდნით' },
      { key: 'whyChooseUs2', value: 'პატარა ჯგუფები, პერსონალური გამოცდილება' },
      { key: 'whyChooseUs3', value: 'მოქნილი გრაფიკი და ინდივიდუალური ტური' },
      { key: 'whyChooseUs4', value: 'საუკეთესო ფასი ავთენტური გამოცდილებისთვის' },
      { key: 'whyChooseUs5', value: 'უსაფრთხოებაზე ორიენტირებული მიდგომა' },
      { key: 'whyChooseUs6', value: 'პასუხისმგებელი და მდგრადი ტურიზმი' },
    ],
    ru: [
      { key: 'heroEyebrow', value: 'ZazaGuide' },
      { key: 'heroTagline', value: 'Грузия глубже, чем вы думали' },
      { key: 'heroSubtitle', value: 'Горы, монастыри, вино — с местными гидами' },
      { key: 'location', value: 'Тбилиси, Грузия' },
      { key: 'tourTypes', value: 'Пешие маршруты, городские туры, культурные маршруты, винные дегустации, автопутешествия' },
      { key: 'whyChooseUs1', value: 'Местные гиды с глубокими знаниями' },
      { key: 'whyChooseUs2', value: 'Небольшие группы и личный подход' },
      { key: 'whyChooseUs3', value: 'Гибкий график и индивидуальные туры' },
      { key: 'whyChooseUs4', value: 'Лучшее соотношение цены и впечатлений' },
      { key: 'whyChooseUs5', value: 'Безопасность и качественное снаряжение' },
      { key: 'whyChooseUs6', value: 'Ответственный и устойчивый туризм' },
    ],
  };

  for (const [locale, settings] of Object.entries(settingsByLocale)) {
    for (const setting of settings) {
      await prisma.homepageSetting.upsert({
        where: { key_locale: { key: setting.key, locale } },
        update: { value: setting.value },
        create: { ...setting, locale },
      });
    }
  }

  console.log('Database seeded successfully!');
  console.log(`Admin credentials: email=${adminEmail}, password=${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
