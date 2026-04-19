import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { defaultLocale, isLocale, locales } from "./lib/i18n"

function getPreferredLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language")?.toLowerCase() ?? ""

  for (const locale of locales) {
    if (acceptLanguage.includes(locale)) {
      return locale
    }
  }

  return defaultLocale
}

function withLocaleHeader(request: NextRequest, locale: string) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-forge-locale", locale)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean)
  const routeLocale = segments.length > 0 && isLocale(segments[0]) ? segments[0] : null

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(`/${getPreferredLocale(request)}`, request.url))
  }

  if (routeLocale) {
    return withLocaleHeader(request, routeLocale)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/(en|ar)/:path*"],
}
