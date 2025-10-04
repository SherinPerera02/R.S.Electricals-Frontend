// Helper function to get current user ID from token
function getCurrentUserId() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  try {
    // Decode JWT token to get user info
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload.userId || payload.sub; // Different possible user ID fields
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// Helper function to get user-specific cart key
function getUserCartKey() {
  const userId = getCurrentUserId();
  if (!userId) {
    // If not logged in, use a guest cart
    return "cart_guest";
  }
  return `cart_user_${userId}`;
}

export function getCart() {
  const cartKey = getUserCartKey();
  let cart = localStorage.getItem(cartKey);

  if (cart == null) {
    cart = [];
    localStorage.setItem(cartKey, JSON.stringify(cart));
  } else {
    cart = JSON.parse(cart);
  }
  return cart;
}

// Clear cart when user logs out
export function clearUserCart() {
  const userId = getCurrentUserId();
  if (userId) {
    const cartKey = `cart_user_${userId}`;
    localStorage.removeItem(cartKey);
  }
}

// Migrate guest cart to user cart when user logs in
export function migrateGuestCartToUser() {
  const guestCart = localStorage.getItem("cart_guest");
  const userId = getCurrentUserId();

  if (guestCart && userId) {
    const userCartKey = `cart_user_${userId}`;
    const existingUserCart = localStorage.getItem(userCartKey);

    if (!existingUserCart) {
      // No existing user cart, move guest cart to user
      localStorage.setItem(userCartKey, guestCart);
    } else {
      // Merge guest cart with existing user cart
      const guestItems = JSON.parse(guestCart);
      const userItems = JSON.parse(existingUserCart);

      guestItems.forEach((guestItem) => {
        const existingIndex = userItems.findIndex(
          (item) => item.productId === guestItem.productId
        );
        if (existingIndex === -1) {
          userItems.push(guestItem);
        } else {
          // Merge quantities
          userItems[existingIndex].qty += guestItem.qty;
        }
      });

      localStorage.setItem(userCartKey, JSON.stringify(userItems));
    }

    // Clear guest cart after migration
    localStorage.removeItem("cart_guest");
  }
}

// Helper function to dispatch cart update event
function dispatchCartUpdateEvent() {
  window.dispatchEvent(new CustomEvent("cartUpdated"));
}

export function removeFromCart(productId) {
  let cart = getCart();

  const newCart = cart.filter((item) => {
    return item.productId != productId;
  });

  const cartKey = getUserCartKey();
  localStorage.setItem(cartKey, JSON.stringify(newCart));
  dispatchCartUpdateEvent();
}

export function addToCart(product, qty) {
  let cart = getCart();

  let index = cart.findIndex((item) => {
    return item.productId == product.productId;
  });

  if (index == -1) {
    cart[cart.length] = {
      productId: product.productId,
      name: product.name,
      image: product.images[0],
      price: product.price,
      labelledPrice: product.labelledPrice,
      qty: qty,
    };
  } else {
    const newQty = cart[index].qty + qty;
    if (newQty <= 0) {
      removeFromCart(product.productId);
      return;
    } else {
      cart[index].qty = newQty;
    }
  }

  const cartKey = getUserCartKey();
  localStorage.setItem(cartKey, JSON.stringify(cart));
  dispatchCartUpdateEvent();
}

export function getTotal() {
  let cart = getCart();

  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].qty;
  }
  return total;
}

// Get cart item count
export function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.qty, 0);
}

// Check if product is in cart
export function isProductInCart(productId) {
  const cart = getCart();
  return cart.some((item) => item.productId === productId);
}

// Get specific product quantity in cart
export function getProductQuantityInCart(productId) {
  const cart = getCart();
  const item = cart.find((item) => item.productId === productId);
  return item ? item.qty : 0;
}

// Clear entire cart
export function clearCart() {
  const cartKey = getUserCartKey();
  localStorage.setItem(cartKey, JSON.stringify([]));
  dispatchCartUpdateEvent();
}

// Update product quantity directly
export function updateProductQuantity(productId, newQty) {
  let cart = getCart();

  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }

  const index = cart.findIndex((item) => item.productId === productId);
  if (index !== -1) {
    cart[index].qty = newQty;
    const cartKey = getUserCartKey();
    localStorage.setItem(cartKey, JSON.stringify(cart));
    dispatchCartUpdateEvent();
  }
}
