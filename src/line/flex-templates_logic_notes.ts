/*
 * AUTO ANNOTATION
 * File: src/line/flex-templates.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export {
  createActionCard,
  createCarousel,
  createImageCard,
  createInfoCard,
  createListCard,
  createNotificationBubble,
} from "./flex-templates/basic-cards.js";
export {
  createAgendaCard,
  createEventCard,
  createReceiptCard,
} from "./flex-templates/schedule-cards.js";
export {
  createAppleTvRemoteCard,
  createDeviceControlCard,
  createMediaPlayerCard,
} from "./flex-templates/media-control-cards.js";
export { toFlexMessage } from "./flex-templates/message.js";

export type {
  Action,
  CardAction,
  FlexBox,
  FlexBubble,
  FlexButton,
  FlexCarousel,
  FlexComponent,
  FlexContainer,
  FlexImage,
  FlexText,
  ListItem,
} from "./flex-templates/types.js";
