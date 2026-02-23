/*
 * AUTO ANNOTATION
 * File: ui/src/i18n/lib/types.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type TranslationMap = { [key: string]: string | TranslationMap };

export type Locale = "en" | "zh-CN" | "zh-TW" | "pt-BR";

export interface I18nConfig {
  locale: Locale;
  fallbackLocale: Locale;
  translations: Record<Locale, TranslationMap>;
}
