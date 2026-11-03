/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Platform Support & Community Configuration
 *
 * NOTE FOR PLATFORM OWNER:
 * Configure your official NARIVO Telegram community link below when ready for public launch.
 * When `isTelegramConfigured` is false or `telegramCommunityUrl` is empty, the interface will
 * gracefully direct members to official customer support (/contact or support@narivo.site)
 * and display a clear configuration notice rather than directing users to a broken or dead URL.
 */
export interface SupportConfig {
  /** Official NARIVO Telegram group or channel link (e.g. 'https://t.me/narivo_official') */
  telegramCommunityUrl: string;
  /** Set to true once the official Telegram group or channel URL is live */
  isTelegramConfigured: boolean;
  /** Official member support email address */
  supportEmail: string;
  /** Application route for direct customer inquiries */
  contactRoute: string;
  /** Full URL for customer support desk or help center */
  supportUrl: string;
  /** Official support response turnaround */
  responseWindow: string;
}

export const SUPPORT_CONFIG: SupportConfig = {
  // ATTENTION OWNER: Update this with your verified Telegram community link
  telegramCommunityUrl: '',
  isTelegramConfigured: false,
  supportEmail: 'support@narivo.site',
  contactRoute: '/contact',
  supportUrl: 'https://narivo.site/contact',
  responseWindow: 'Typically within 24 business hours',
};
