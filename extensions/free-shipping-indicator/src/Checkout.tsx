import '@shopify/ui-extensions/preact';
import { render } from "preact";

export default async () => {
  render(<Extension />, document.body)
};

function Extension() {
  const i18n = shopify.i18n;

  const subtotal = shopify.cost.subtotalAmount.value.amount;

  if (!shopify.settings.value.free_shipping_threshold) {
    return null;
  }

  const freeShippingThreshold = shopify.settings.value.free_shipping_threshold as number; // this is populated from the settings page
  const remaining = Math.ceil((freeShippingThreshold - subtotal) * 100) / 100;
  // example computation for the remaining:
  // step 1: 50 - 34.999 = 15.001 - raw difference — the 0.001 is floating-point                                                        
  // step 2: 15.001 * 100 = 1500.1 - shift 2 decimal places right                                                                                 
  // step 3: Math.ceil(1500.1) = 1501 round UP to nearest integer                                                                                  
  // step 4: 1501 / 100 = 15.01 shift back → clean 2-decimal result     

  if (remaining <= 0) {
    return (
      <s-banner heading="Free shipping!" tone="success">
        <s-text>You've unlocked free shipping!</s-text>
      </s-banner>
    );
  }

  return (
    <s-banner heading="Almost there!" tone="info">
      <s-text>
        Add {i18n.formatCurrency(remaining)} more to get free shipping.
      </s-text>
    </s-banner>
  );
}