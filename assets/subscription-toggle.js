/**
 * Syncs a standalone subscription checkbox with the nearest product form's `selling_plan`
 * field. Lives outside the buy-buttons form, so it manages its own hidden input instead of
 * relying on native form inclusion.
 */
class SubscriptionToggle extends HTMLElement {
  connectedCallback() {
    this.checkbox = this.querySelector('input[type="checkbox"]');
    this.checkbox?.addEventListener('change', this.sync);
    this.sync();
    this.#bindSubmitGuard();
  }

  disconnectedCallback() {
    this.checkbox?.removeEventListener('change', this.sync);
    this.#form?.removeEventListener('submit', this.sync, true);
  }

  #form = null;

  // The hidden input lives outside the buy-buttons form's own render cycle, so re-sync it
  // right before submission (capture phase, ahead of product-form's own submit handling) —
  // cheap insurance against any DOM update between checking the box and clicking add to cart.
  #bindSubmitGuard() {
    const form = this.#findForm();
    if (!form) return;
    this.#form = form;
    form.addEventListener('submit', this.sync, true);
  }

  #findForm() {
    return (
      this.closest('.shopify-section, dialog, product-card')?.querySelector('product-form-component form') ||
      document.querySelector('product-form-component form')
    );
  }

  sync = () => {
    const sellingPlanId = this.dataset.sellingPlanId;
    const form = this.#form || this.#findForm();

    if (!form) return;

    let input = form.querySelector('input[name="selling_plan"]');

    if (this.checkbox?.checked && sellingPlanId) {
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'selling_plan';
        form.appendChild(input);
      }
      input.value = sellingPlanId;
    } else {
      input?.remove();
    }
  };
}

if (!customElements.get('subscription-toggle-component')) {
  customElements.define('subscription-toggle-component', SubscriptionToggle);
}
