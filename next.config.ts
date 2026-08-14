import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

// плагин подхватывает src/i18n/request.ts и отдаёт словарь серверным компонентам
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
