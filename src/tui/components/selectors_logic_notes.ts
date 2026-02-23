/*
 * AUTO ANNOTATION
 * File: src/tui/components/selectors.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { type SelectItem, SelectList, type SettingItem, SettingsList } from "@mariozechner/pi-tui";
import {
  filterableSelectListTheme,
  searchableSelectListTheme,
  selectListTheme,
  settingsListTheme,
} from "../theme/theme.js";
import { FilterableSelectList, type FilterableSelectItem } from "./filterable-select-list.js";
import { SearchableSelectList } from "./searchable-select-list.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createSelectList(items: SelectItem[], maxVisible = 7) {
  return new SelectList(items, maxVisible, selectListTheme);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createSearchableSelectList(items: SelectItem[], maxVisible = 7) {
  return new SearchableSelectList(items, maxVisible, searchableSelectListTheme);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createFilterableSelectList(items: FilterableSelectItem[], maxVisible = 7) {
  return new FilterableSelectList(items, maxVisible, filterableSelectListTheme);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createSettingsList(
  items: SettingItem[],
  onChange: (id: string, value: string) => void,
  onCancel: () => void,
  maxVisible = 7,
) {
  return new SettingsList(items, maxVisible, settingsListTheme, onChange, onCancel);
}
