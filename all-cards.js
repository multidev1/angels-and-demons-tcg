document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("allCardsContainer");

    const sets = [
        {
            file: "set1.html",
            title: "SET 1 — ANGELS & DEMONS"
        }	
        {
            file: "set2.html",
            title: "SET 2 — THE DRAGON AWAKENING"
        },
    ];

    const lightbox = document.getElementById("allCardLightbox");
    const lightboxImage = document.getElementById("allCardLightboxImage");
    const lightboxTitle = document.getElementById("allCardLightboxTitle");
    const lightboxClose = document.getElementById("allCardLightboxClose");

    /* =========================================
       NAVIGATION BUTTONS
    ========================================= */

    const previousButton = document.createElement("button");

    previousButton.type = "button";
    previousButton.className = "all-card-nav all-card-prev";
    previousButton.textContent = "← BACK";

    const nextButton = document.createElement("button");

    nextButton.type = "button";
    nextButton.className = "all-card-nav all-card-next";
    nextButton.textContent = "NEXT →";

    lightbox.appendChild(previousButton);
    lightbox.appendChild(nextButton);

    /* =========================================
       CARD DATA
    ========================================= */

    const allCards = [];
    let currentCardIndex = -1;

    /* =========================================
       NAVIGATION POSITION
       2 CM FROM IMAGE
    ========================================= */

    const navigationGap = 75.6;

    function positionNavigation() {

        if (!lightbox.classList.contains("active")) {
            return;
        }

        const imageRect =
            lightboxImage.getBoundingClientRect();

        const lightboxRect =
            lightbox.getBoundingClientRect();

        if (
            imageRect.width === 0 ||
            imageRect.height === 0
        ) {
            return;
        }

        /*
         * BACK
         * 2 cm LEFT of image
         */

        const backLeft =
            imageRect.left -
            lightboxRect.left -
            previousButton.offsetWidth -
            navigationGap;

        const backTop =
            imageRect.top -
            lightboxRect.top +
            (imageRect.height / 2) -
            (previousButton.offsetHeight / 2);

        previousButton.style.setProperty(
            "position",
            "absolute",
            "important"
        );

        previousButton.style.setProperty(
            "left",
            backLeft + "px",
            "important"
        );

        previousButton.style.setProperty(
            "right",
            "auto",
            "important"
        );

        previousButton.style.setProperty(
            "top",
            backTop + "px",
            "important"
        );

        previousButton.style.setProperty(
            "transform",
            "none",
            "important"
        );

        /*
         * NEXT
         * 2 cm RIGHT of image
         */

        const nextLeft =
            imageRect.right -
            lightboxRect.left +
            navigationGap;

        const nextTop =
            imageRect.top -
            lightboxRect.top +
            (imageRect.height / 2) -
            (nextButton.offsetHeight / 2);

        nextButton.style.setProperty(
            "position",
            "absolute",
            "important"
        );

        nextButton.style.setProperty(
            "left",
            nextLeft + "px",
            "important"
        );

        nextButton.style.setProperty(
            "right",
            "auto",
            "important"
        );

        nextButton.style.setProperty(
            "top",
            nextTop + "px",
            "important"
        );

        nextButton.style.setProperty(
            "transform",
            "none",
            "important"
        );
    }

    /* =========================================
       OPEN CARD
    ========================================= */

    function openCard(index) {

        if (
            index < 0 ||
            index >= allCards.length
        ) {
            return;
        }

        currentCardIndex = index;

        const card = allCards[index];

        lightboxImage.src = card.image;

        lightboxImage.alt =
            card.number +
            " — " +
            card.name;

        lightboxTitle.textContent =
            card.number +
            " — " +
            card.name;

        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";

        updateNavigation();

        /*
         * Position after image has been rendered.
         */

        if (lightboxImage.complete) {

            requestAnimationFrame(function () {

                positionNavigation();

            });

        } else {

            lightboxImage.onload =
                function () {

                    positionNavigation();

                };
        }
    }

    /* =========================================
       PREVIOUS
    ========================================= */

    function previousCard() {

        if (currentCardIndex > 0) {

            openCard(
                currentCardIndex - 1
            );
        }
    }

    /* =========================================
       NEXT
    ========================================= */

    function nextCard() {

        if (
            currentCardIndex <
            allCards.length - 1
        ) {

            openCard(
                currentCardIndex + 1
            );
        }
    }

    /* =========================================
       BUTTON STATE
    ========================================= */

    function updateNavigation() {

        previousButton.disabled =
            currentCardIndex <= 0;

        nextButton.disabled =
            currentCardIndex >=
            allCards.length - 1;
    }

    previousButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            previousCard();
        }
    );

    nextButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            nextCard();
        }
    );

    /* =========================================
       CLOSE
    ========================================= */

    function closeCard() {

        lightbox.classList.remove("active");

        lightboxImage.src = "";

        lightboxTitle.textContent = "";

        document.body.style.overflow = "";

        currentCardIndex = -1;
    }

    lightboxClose.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            closeCard();
        }
    );

    lightbox.addEventListener(
        "click",
        function (event) {

            if (event.target === lightbox) {

                closeCard();
            }
        }
    );

    /* =========================================
       KEYBOARD
    ========================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) {
                return;
            }

            if (event.key === "Escape") {

                closeCard();

                return;
            }

            if (event.key === "ArrowLeft") {

                previousCard();

                return;
            }

            if (event.key === "ArrowRight") {

                nextCard();

                return;
            }
        }
    );

    /* =========================================
       LOAD SET FROM ACTUAL HTML FILE
    ========================================= */

    async function loadSet(set) {

        const response =
            await fetch(set.file, {
                cache: "default"
            });

        if (!response.ok) {

            throw new Error(
                "Could not load " +
                set.file
            );
        }

        const html =
            await response.text();

        const parser =
            new DOMParser();

        const setDocument =
            parser.parseFromString(
                html,
                "text/html"
            );

        const cards =
            setDocument.querySelectorAll(
                ".card-item"
            );

        if (cards.length === 0) {

            throw new Error(
                "No cards found in " +
                set.file
            );
        }

        const setCards = [];

        cards.forEach(function (card) {

            const number =
                card.dataset.number || "";

            const name =
                card.dataset.name ||
                "Unknown Card";

            const image =
                card.querySelector("img");

            if (!image) {
                return;
            }

            const imagePath =
                image.getAttribute("src");

            setCards.push({

                number: number,

                name: name,

                image: imagePath,

                set: set.title

            });
        });

        return {
            set: set,
            cards: setCards
        };
    }

    /* =========================================
       RENDER SET
    ========================================= */

    function renderSet(setData) {

        const setSection =
            document.createElement("section");

        setSection.className =
            "all-cards-set";

        const setTitle =
            document.createElement("h2");

        setTitle.className =
            "all-cards-set-title";

        setTitle.textContent =
            setData.set.title;

        setSection.appendChild(
            setTitle
        );

        const list =
            document.createElement("div");

        list.className =
            "all-cards-list";

        setData.cards.forEach(function (card) {

            const cardIndex =
                allCards.length;

            allCards.push(card);

            const row =
                document.createElement("div");

            row.className =
                "all-card-row";

            const numberElement =
                document.createElement("span");

            numberElement.className =
                "all-card-number";

            numberElement.textContent =
                card.number;

            const nameElement =
                document.createElement("span");

            nameElement.className =
                "all-card-name";

            nameElement.textContent =
                card.name;

            row.appendChild(
                numberElement
            );

            row.appendChild(
                nameElement
            );

            row.addEventListener(
                "click",
                function () {

                    openCard(cardIndex);

                }
            );

            list.appendChild(row);
        });

        setSection.appendChild(list);

        container.appendChild(
            setSection
        );
    }

    /* =========================================
       LOAD EVERYTHING
    ========================================= */

    async function loadEverything() {

        container.innerHTML = "";

        try {

            const results =
                await Promise.all(
                    sets.map(function (set) {

                        return loadSet(set);

                    })
                );

            results.forEach(function (result) {

                renderSet(result);

            });

            updateNavigation();

        } catch (error) {

            console.error(error);

            const errorBox =
                document.createElement("div");

            errorBox.className =
                "all-card-error";

            errorBox.textContent =
                "Unable to load the card list.";

            container.appendChild(
                errorBox
            );
        }
    }

    /* =========================================
       RECALCULATE ON WINDOW RESIZE
    ========================================= */

    window.addEventListener(
        "resize",
        function () {

            positionNavigation();

        }
    );

    /* =========================================
       START
    ========================================= */

    loadEverything();

});