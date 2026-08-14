import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // всё, кроме api, внутренностей Next и файлов со статикой (у них есть точка в пути)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
