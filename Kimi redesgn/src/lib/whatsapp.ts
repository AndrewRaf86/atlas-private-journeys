const WHATSAPP_NUMBER = "51923493223";

export function getWhatsAppLink(message?: string): string {
  const defaultMessage =
    "Hi Fidel — I'm planning a trip to Peru/Brazil and want private support. My dates are [dates], group size is [number], and I need help with [service].";
  const text = encodeURIComponent(message || defaultMessage);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function getPackageWhatsAppLink(packageName: string): string {
  const message = `Hi Fidel — I'm interested in the "${packageName}" package. My dates are [dates] and my group size is [number]. Can you share more details?`;
  return getWhatsAppLink(message);
}
