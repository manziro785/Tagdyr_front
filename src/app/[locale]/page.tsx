import Hero from "@/widgets/hero-banner/ui/Hero";
import { LandingSections } from "@/widgets/hero-banner/ui/LandingSections";
import { setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // включает статический рендер страницы под каждую локаль
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <LandingSections />
    </>
  );
}
