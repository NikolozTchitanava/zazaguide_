-- Enable RLS on public tables flagged by Supabase Security Advisor.
-- These policies allow public read access for content tables while keeping
-- admin and migration tables locked down.

ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tour" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TourTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TourImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TourTime" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GalleryImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GalleryImageTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HomepageSetting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- Public read access for website content.
CREATE POLICY "public_read_tour"
  ON "Tour"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_tour_translation"
  ON "TourTranslation"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_tour_image"
  ON "TourImage"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_tour_time"
  ON "TourTime"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_gallery_image"
  ON "GalleryImage"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_gallery_image_translation"
  ON "GalleryImageTranslation"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_homepage_setting"
  ON "HomepageSetting"
  FOR SELECT
  TO anon, authenticated
  USING (true);
