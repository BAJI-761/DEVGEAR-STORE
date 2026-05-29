export function flyToCart(imgEl, targetSelector = '#cart-link') {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return; // avoid motion for users who prefer reduced motion
    }
    if (!imgEl) return;
    const cart = document.querySelector(targetSelector);
    if (!cart) return;

    const rect = imgEl.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();

    const clone = imgEl.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.border = '4px solid #000';
    clone.style.boxShadow = '4px 4px 0 0 #000';
    clone.style.transition = 'transform 500ms cubic-bezier(.4, 0, .2, 1), opacity 500ms ease-out';
    clone.style.zIndex = 9999;
    clone.style.pointerEvents = 'none';
    document.body.appendChild(clone);

    const translateX = cartRect.left + cartRect.width / 2 - (rect.left + rect.width / 2);
    const translateY = cartRect.top + cartRect.height / 2 - (rect.top + rect.height / 2);
    const scale = 0.1;

    requestAnimationFrame(() => {
      clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(12deg)`;
      clone.style.opacity = '0.4';
    });

    setTimeout(() => {
      clone.remove();
    }, 550);
  } catch (err) {
    // silent
  }
}
