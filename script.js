/* =========================================
   NEON BACKGROUND
========================================= */

const neonElements = document.querySelectorAll(
    ".neon-dot, .neon-bar"
);

function moveNeon(element) {

    const x = Math.random() * 90 + 5;
    const y = Math.random() * 90 + 5;

    element.style.left = x + "%";
    element.style.top = y + "%";

    const nextMove = Math.random() * 2000 + 1000;

    setTimeout(() => {
        moveNeon(element);
    }, nextMove);
}

neonElements.forEach(element => {
    moveNeon(element);
});


/* =========================================
   CARD DATABASE FILTERS
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("cardSearch");
    const filterButtons = document.querySelectorAll(".card-filter");
    const cards = document.querySelectorAll(".card-item");

    if (!searchInput || !filterButtons.length || !cards.length) {
        return;
    }

    let activeFilter = "all";

    function filterCards() {

        const searchTerm =
            searchInput.value.toLowerCase().trim();

        cards.forEach(function (card) {

            const number =
                (card.dataset.number || "").toLowerCase();

            const name =
                (card.dataset.name || "").toLowerCase();

            const type =
                (card.dataset.type || "").toLowerCase();

            const matchesSearch =
                number.includes(searchTerm) ||
                name.includes(searchTerm);

            let matchesFilter = true;

            if (activeFilter !== "all") {
                matchesFilter =
                    type === activeFilter;
            }

            if (matchesSearch && matchesFilter) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });
    }


    searchInput.addEventListener("input", function () {
        filterCards();
    });


    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            filterButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            activeFilter =
                button.dataset.filter;

            filterCards();

        });

    });

});


/* =========================================
   CARD LIGHTBOX
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const lightbox =
        document.getElementById("cardLightbox");

    const lightboxImage =
        document.getElementById("cardLightboxImage");

    const closeButton =
        document.getElementById("cardLightboxClose");

    const cards =
        document.querySelectorAll(".card-item img");

    if (
        !lightbox ||
        !lightboxImage ||
        !closeButton ||
        !cards.length
    ) {
        return;
    }


    cards.forEach(function (card) {

        card.addEventListener("click", function () {

            lightboxImage.src = card.src;
            lightboxImage.alt = card.alt;

            lightbox.classList.add("active");

            document.body.style.overflow = "hidden";

        });

    });


    function closeLightbox() {

        lightbox.classList.remove("active");

        lightboxImage.src = "";

        document.body.style.overflow = "";

    }


    closeButton.addEventListener(
        "click",
        function () {
            closeLightbox();
        }
    );


    lightbox.addEventListener(
        "click",
        function (event) {

            if (event.target === lightbox) {
                closeLightbox();
            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                lightbox.classList.contains("active")
            ) {
                closeLightbox();
            }

        }
    );

});


/* =========================================
   ANGELS & DEMONS SHOPPING CART
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const CART_KEY = "angelsDemonsCart";


    /* =========================================
       GOD PACK LIMIT
    ========================================= */

    const GOD_PACK_IDS = [
        "set1-god-pack-angel-dragon-tail",
        "set1-god-pack-celia",
        "set1-god-pack-golden-claw-demon",
        "set1-god-pack-silver-shield-demon"
    ];


    function isGodPack(productId) {

        return GOD_PACK_IDS.includes(productId);

    }


    /* =========================================
       GET CART
    ========================================= */

    function getCart() {

        const savedCart =
            localStorage.getItem(CART_KEY);

        if (!savedCart) {
            return [];
        }

        try {

            const cart =
                JSON.parse(savedCart);

            return Array.isArray(cart)
                ? cart
                : [];

        } catch (error) {

            return [];

        }

    }


    /* =========================================
       UPDATE GOD PACK BUTTONS
    ========================================= */

    function updateGodPackButtons() {

        const cart = getCart();

        document.querySelectorAll(".booster-add-to-cart").forEach(function (button) {

            const productId =
                button.dataset.productId;

            if (!isGodPack(productId)) {
                return;
            }

            const inCart =
                cart.some(function (item) {

                    return (
                        item.id === productId &&
                        Number(item.quantity) > 0
                    );

                });

            button.disabled = inCart;

            if (inCart) {

                button.textContent =
                    "IN CART ✓";

            } else {

                button.textContent =
                    "ADD TO CART";

            }

        });

    }


    /* =========================================
       SAVE CART
    ========================================= */

    function saveCart(cart) {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

    }


    /* =========================================
       FORMAT PRICE
    ========================================= */

    function formatPrice(price) {

        return new Intl.NumberFormat(
            "nl-BE",
            {
                style: "currency",
                currency: "EUR"
            }
        ).format(price);

    }


    /* =========================================
       UPDATE HEADER CART
    ========================================= */

    function updateHeaderCartCount() {

        const headerCartCount =
            document.getElementById(
                "headerCartCount"
            );

        if (!headerCartCount) {
            return;
        }

        const cart = getCart();

        const totalQuantity =
            cart.reduce(
                function (total, item) {

                    return total +
                        Number(item.quantity || 0);

                },
                0
            );

        headerCartCount.textContent =
            totalQuantity;

    }


    /* =========================================
       ADD PRODUCT TO CART
    ========================================= */

    const addToCartButtons =
        document.querySelectorAll(
            ".booster-add-to-cart"
        );


    addToCartButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const productId =
                    button.dataset.productId;

                const productName =
                    button.dataset.productName;

                const productPrice =
                    parseFloat(
                        button.dataset.productPrice
                    );


                if (
                    !productId ||
                    !productName ||
                    isNaN(productPrice)
                ) {

                    console.error(
                        "Invalid product data."
                    );

                    return;

                }


                let cart = getCart();


                /* -----------------------------------------
                   CHECK IF PRODUCT ALREADY EXISTS
                ----------------------------------------- */

                const existingProduct =
                    cart.find(
                        function (item) {

                            return item.id === productId;

                        }
                    );


                if (existingProduct) {

                    /* -----------------------------------------
                       GOD PACK LIMIT
                    ----------------------------------------- */

                    if (isGodPack(productId)) {

                        existingProduct.quantity = 1;

                    } else {

                        existingProduct.quantity++;

                    }

                } else {

                    cart.push({

                        id: productId,

                        name: productName,

                        price: productPrice,

                        quantity: 1,

                        type: isGodPack(productId)
                            ? "GOD PACK"
                            : "PRODUCT",

                        image: button.dataset.productImage || ""

                    });

                }


                saveCart(cart);

                updateHeaderCartCount();

                updateGodPackButtons();


                /* -----------------------------------------
                   BUTTON FEEDBACK
                ----------------------------------------- */

                if (!isGodPack(productId)) {

                    const originalText =
                        button.textContent;

                    button.textContent =
                        "ADDED TO CART ✓";

                    button.style.borderColor =
                        "#d4af37";

                    button.style.color =
                        "#d4af37";


                    setTimeout(function () {

                        button.textContent =
                            originalText;

                        button.style.borderColor =
                            "";

                        button.style.color =
                            "";

                    }, 1500);

                }

            }
        );

    });


    /* =========================================
       RENDER CART PAGE
    ========================================= */

    function renderCart() {

        const cartItems =
            document.getElementById(
                "cartItems"
            );

        const cartEmptyMessage =
            document.getElementById(
                "cartEmptyMessage"
            );

        const cartItemCount =
            document.getElementById(
                "cartItemCount"
            );

        const cartSubtotal =
            document.getElementById(
                "cartSubtotal"
            );

        const cartTotal =
            document.getElementById(
                "cartTotal"
            );


        if (!cartItems) {

            updateHeaderCartCount();

            updateGodPackButtons();

            return;

        }


        const cart = getCart();

        cartItems.innerHTML = "";


        /* =========================================
           EMPTY CART
        ========================================= */

        if (cart.length === 0) {

            if (cartEmptyMessage) {
                cartEmptyMessage.style.display =
                    "block";
            }

        } else {

            if (cartEmptyMessage) {
                cartEmptyMessage.style.display =
                    "none";
            }


            /* =========================================
               CART PRODUCTS
            ========================================= */

            cart.forEach(
                function (item, index) {

                    const itemElement =
                        document.createElement(
                            "div"
                        );

                    itemElement.className =
                        "cart-item";


                    const itemTotal =
                        item.price *
                        item.quantity;


                    const imageHTML =
                        item.image
                            ? `
                                <img
                                    class="cart-item-image"
                                    src="${item.image}"
                                    alt="${item.name}"
                                >
                              `
                            : `
                                <div
                                    class="cart-item-image"
                                    style="
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        text-align:center;
                                        color:#3498db;
                                        font-size:10px;
                                        font-weight:700;
                                        letter-spacing:1px;
                                        padding:5px;
                                        box-sizing:border-box;
                                    "
                                >
                                    ${item.type || "PRODUCT"}
                                </div>
                              `;


                    itemElement.innerHTML = `

                        ${imageHTML}

                        <div class="cart-item-info">

                            <div class="cart-item-type">
                                ${item.type || "PRODUCT"}
                            </div>

                            <h3 class="cart-item-name">
                                ${item.name}
                            </h3>

                            <div class="cart-item-price">
                                ${formatPrice(item.price)} each
                            </div>

                            <div class="cart-item-controls">

                                <button
                                    class="quantity-button"
                                    type="button"
                                    data-action="decrease"
                                    data-index="${index}">
                                    −
                                </button>

                                <span class="cart-item-quantity">
                                    ${item.quantity}
                                </span>

                                <button
                                    class="quantity-button"
                                    type="button"
                                    data-action="increase"
                                    data-index="${index}">
                                    +
                                </button>

                            </div>

                            <button
                                class="cart-remove"
                                type="button"
                                data-action="remove"
                                data-index="${index}">
                                REMOVE
                            </button>

                        </div>

                        <div class="cart-item-total">
                            ${formatPrice(itemTotal)}
                        </div>

                    `;


                    cartItems.appendChild(
                        itemElement
                    );

                }
            );

        }


        /* =========================================
           CALCULATE TOTALS
        ========================================= */

        const totalQuantity =
            cart.reduce(
                function (total, item) {

                    return total +
                        Number(item.quantity || 0);

                },
                0
            );


        const subtotal =
            cart.reduce(
                function (total, item) {

                    return total +
                        (
                            Number(item.price) *
                            Number(item.quantity)
                        );

                },
                0
            );


        if (cartItemCount) {
            cartItemCount.textContent =
                totalQuantity;
        }


        if (cartSubtotal) {
            cartSubtotal.textContent =
                formatPrice(subtotal);
        }


        if (cartTotal) {
            cartTotal.textContent =
                formatPrice(subtotal);
        }


        updateHeaderCartCount();

        updateGodPackButtons();

    }


    /* =========================================
       QUANTITY + / − / REMOVE
    ========================================= */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-action]"
                );

            if (!button) {
                return;
            }


            const action =
                button.dataset.action;

            const index =
                Number(
                    button.dataset.index
                );


            const cart = getCart();


            if (!cart[index]) {
                return;
            }


            /* INCREASE */

            if (action === "increase") {

                if (isGodPack(cart[index].id)) {

                    cart[index].quantity = 1;

                } else {

                    cart[index].quantity++;

                }

            }


            /* DECREASE */

            if (action === "decrease") {

                cart[index].quantity--;

                if (
                    cart[index].quantity <= 0
                ) {

                    cart.splice(index, 1);

                }

            }


            /* REMOVE */

            if (action === "remove") {

                cart.splice(index, 1);

            }


            saveCart(cart);

            renderCart();

        }
    );


    /* =========================================
       EMPTY CART
    ========================================= */

    const emptyCartButton =
        document.getElementById(
            "emptyCartButton"
        );


    if (emptyCartButton) {

        emptyCartButton.addEventListener(
            "click",
            function () {

                const cart = getCart();


                if (cart.length === 0) {
                    return;
                }


                const confirmed =
                    confirm(
                        "Are you sure you want to empty your cart?"
                    );


                if (!confirmed) {
                    return;
                }


                localStorage.removeItem(
                    CART_KEY
                );


                renderCart();

            }
        );

    }


    /* =========================================
       CHECKOUT
    ========================================= */

    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );


    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            function () {

                const cart = getCart();


                if (cart.length === 0) {

                    alert(
                        "Your cart is empty."
                    );

                    return;

                }


                alert(
                    "Checkout will be available soon."
                );

            }
        );

    }


    /* =========================================
       INITIALIZE
    ========================================= */

    updateHeaderCartCount();

    renderCart();

    updateGodPackButtons();

});