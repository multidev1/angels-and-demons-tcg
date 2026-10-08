document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("allCardsContainer");

    const sets = [
        {
            file: "set2.html",
            title: "SET 2 — THE DRAGON AWAKENING"
        },
        {
            file: "set1.html",
            title: "SET 1 — ANGELS & DEMONS"
        }
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
       2 CM SPACING
    ========================================= */

    const navigationGap = 2 * 96 / 2.54;

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

        const imageCenterY =
            imageRect.top +
            (imageRect.height / 2);

        const buttonTop =
            imageCenterY -
            (previousButton.offsetHeight / 2);

        /* BACK = 2 cm LEFT of image */

        previousButton.style.left =
            (
                imageRect.left -
                lightboxRect.left -
                previousButton.offsetWidth -
                navigationGap
            ) + "px";

        previousButton.style.top =
            (
                buttonTop -
                lightboxRect.top
            ) + "px";

        /* NEXT = 2 cm RIGHT of image */

        nextButton.style.left =
            (
                imageRect.right -
                lightboxRect.left +
                navigationGap
            ) + "px";

        nextButton.style.top =
            (
                imageCenterY -
                lightboxRect.top -
                (nextButton.offsetHeight / 2)
            ) + "px";
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

        const card =
            allCards[currentCardIndex];

        lightboxImage.src =
            card.image;

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
         * Wait until the image has its real
         * displayed dimensions.
         */

        if (lightboxImage.complete) {

            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    positionNavigation();
                });
            });

        } else {

            lightboxImage.onload =
                function () {
                    positionNavigation();
                };
        }
    }

    /* =========================================
       PREVIOUS / NEXT
    ========================================= */

    function previousCard() {

        if (currentCardIndex > 0) {

            openCard(
                currentCardIndex - 1
            );
        }
    }

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
       CLOSE LIGHTBOX
    ========================================= */

    function closeCard() {

        lightbox.classList.remove("active");

        lightboxImage.src = "";

        lightboxTitle.textContent = "";

        document.body.style.overflow = "";

        currentCardIndex = -1;

        previousButton.style.left = "";
        previousButton.style.top = "";

        nextButton.style.left = "";
        nextButton.style.top = "";
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

            if (
                event.target === lightbox
            ) {
                closeCard();
            }
        }
    );

    /* =========================================
       KEYBOARD CONTROLS
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
       LOAD SET
       READS THE ACTUAL HTML FILE
    ========================================= */

    async function loadSet(set) {

        const response =
            await fetch(
                set.file,
                {
                    cache: "default"
                }
            );

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

        cards.forEach(
            function (card) {

                const number =
                    card.dataset.number ||
                    "";

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
            }
        );

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

        setData.cards.forEach(
            function (card) {

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

                        openCard(
                            cardIndex
                        );
                    }
                );

                list.appendChild(row);
            }
        );

        setSection.appendChild(
            list
        );

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

            /*
             * SET 1 + SET 2 load simultaneously.
             */

            const results =
                await Promise.all(
                    sets.map(
                        function (set) {

                            return loadSet(set);
                        }
                    )
                );

            results.forEach(
                function (result) {

                    renderSet(result);
                }
            );

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
       KEEP BUTTONS CORRECT ON RESIZE
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