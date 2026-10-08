document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("allCardsContainer");

    const sets = [
	   {
            file: null,
            title: "SET 3 — CALL OF THE WILD",
            comingSoon: true
        }
	   {
            file: "set2.html",
            title: "SET 2 — THE DRAGON AWAKENING"
        },
        {
            file: "set1.html",
            title: "SET 1 — ANGELS & DEMONS"
        },
    ];

    const lightbox = document.getElementById("allCardLightbox");
    const lightboxImage = document.getElementById("allCardLightboxImage");
    const lightboxTitle = document.getElementById("allCardLightboxTitle");
    const lightboxClose = document.getElementById("allCardLightboxClose");

    function openCard(image, number, name) {
        lightboxImage.src = image;
        lightboxImage.alt = number + " — " + name;
        lightboxTitle.textContent = number + " — " + name;

        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeCard() {
        lightbox.classList.remove("active");
        lightboxImage.src = "";
        lightboxTitle.textContent = "";
        document.body.style.overflow = "";
    }

    lightboxClose.addEventListener("click", closeCard);

    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeCard();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            lightbox.classList.contains("active")
        ) {
            closeCard();
        }
    });

    function loadSet(set) {

        const setSection = document.createElement("section");
        setSection.className = "all-cards-set";

        const setTitle = document.createElement("h2");
        setTitle.className = "all-cards-set-title";
        setTitle.textContent = set.title;

        setSection.appendChild(setTitle);

        if (set.comingSoon) {

            const comingSoon = document.createElement("div");
            comingSoon.className = "all-card-coming-soon";
            comingSoon.textContent = "COMING SOON";

            setSection.appendChild(comingSoon);
            container.appendChild(setSection);

            return;
        }

        /*
         * Load the actual set HTML.
         *
         * Using an iframe instead of fetch() allows this to work
         * when all-cards.html is opened directly from the computer.
         */
        const iframe = document.createElement("iframe");

        iframe.src = set.file;
        iframe.style.display = "none";
        iframe.setAttribute("aria-hidden", "true");

        document.body.appendChild(iframe);

        iframe.onload = function () {

            try {

                const setDocument = iframe.contentDocument;

                if (!setDocument) {
                    throw new Error("Could not access " + set.file);
                }

                const cards = setDocument.querySelectorAll(".card-item");

                if (cards.length === 0) {

                    const error = document.createElement("div");
                    error.className = "all-card-error";
                    error.textContent = "No cards found in " + set.file;

                    setSection.appendChild(error);
                    container.appendChild(setSection);

                    iframe.remove();

                    return;
                }

                const list = document.createElement("div");
                list.className = "all-cards-list";

                cards.forEach(function (card) {

                    const number = card.dataset.number || "";
                    const name = card.dataset.name || "Unknown Card";

                    const image = card.querySelector("img");

                    if (!image) {
                        return;
                    }

                    let imagePath = image.getAttribute("src");

                    /*
                     * Keep the exact image path from set1.html/set2.html.
                     * Example:
                     * cards set 1/01.png
                     * cards set 2/01.png
                     */
                    const row = document.createElement("div");
                    row.className = "all-card-row";

                    const numberElement = document.createElement("span");
                    numberElement.className = "all-card-number";
                    numberElement.textContent = number;

                    const nameElement = document.createElement("span");
                    nameElement.className = "all-card-name";
                    nameElement.textContent = name;

                    row.appendChild(numberElement);
                    row.appendChild(nameElement);

                    row.addEventListener("click", function () {
                        openCard(imagePath, number, name);
                    });

                    list.appendChild(row);
                });

                setSection.appendChild(list);
                container.appendChild(setSection);

                iframe.remove();

            } catch (error) {

                console.error(error);

                const errorBox = document.createElement("div");
                errorBox.className = "all-card-error";
                errorBox.textContent =
                    "Unable to read cards from " + set.file;

                setSection.appendChild(errorBox);
                container.appendChild(setSection);

                iframe.remove();
            }
        };

        iframe.onerror = function () {

            const errorBox = document.createElement("div");
            errorBox.className = "all-card-error";
            errorBox.textContent =
                "Unable to load " + set.file;

            setSection.appendChild(errorBox);
            container.appendChild(setSection);

            iframe.remove();
        };
    }

    container.innerHTML = "";

    sets.forEach(function (set) {
        loadSet(set);
    });

});
