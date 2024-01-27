/**
 *  @Authors Colin Eade (ID:100329105) and Megan Clarke (ID:100881229).
 *  @Date January 26, 2024.
 *  @File app.js
 *  @Description This is the JavaScript file that contains all the functions to run the Harmony Hub Website. We utilize
 *  an IIFE to immediately invoke the site when it is launched and dynamically select which page functions to load
 *  based on the title of the page that was loaded.
 */

"use strict";

const projects = [
    {
        title: "Accessible Playground",
        description: "We are thrilled to introduce a brand-new accessible playground, " +
            "designed to ensure every child, regardless of their abilities, " +
            "can enjoy the magic of playtime together.",
        imageSrc: "img/portfolio/accessiblePlayground.png",
    },
    {
        title: "Community Splash Pad",
        description: "Get ready for refreshing fun as we embark on an exciting journey to " +
            "bring a vibrant splashpad project to our community, where families can beat the " +
            "heat, create lasting memories, and cool off in style.",
        imageSrc: "img/portfolio/splashpad.png",
    },
    {
        title: "Community Garden",
        description: "Discover the beauty of nature and the power of community " +
            "in our recently established community garden, a green oasis that not " +
            "only enriches our environment but also provides a space for shared " +
            "gardening experiences and a deeper connection to the earth.",
        imageSrc: "img/portfolio/communityGarden.png",
    },
    {
        title: "STEM Maker Space",
        description: "Step into the future of learning with our state-of-the-art STEM Maker Space, " +
            "where innovation knows no bounds. Discover a world of creativity, hands-on exploration, " +
            "and limitless possibilities for students and community members alike.",
        imageSrc: "img/portfolio/makerSpace.png",
    },
    {
        title: "Community Recycling Program",
        description: "We are thrilled to introduce our innovative Community Recycling Program, " +
            "dedicated to making a greener, more sustainable future a reality in our community. " +
            "Join us in reducing waste, conserving resources, and preserving our environment for " +
            "generations to come.",
        imageSrc: "img/portfolio/recycling.png",
    },
    {
        title: "Senior Citizens' Social Center",
        description: "Excitement fills the air as we prepare to unveil our newly completed Senior " +
            "Citizens' Social Center. This milestone marks our commitment to ensuring that our senior " +
            "residents have a vibrant space to call their own, where they can enjoy a multitude of " +
            "activities, connect with peers, and bask in the warmth of a close-knit community.",
        imageSrc: "img/portfolio/seniorsCentre.png",
    },
];

// IIFE - Immediately Invoked Functional Expression
(function(){

    /**
      Logs to the console when the home page is displayed
     */
    function DisplayHomePage(){
        console.log("Called DisplayHomePage...");
    }

    /**
        Called to display the portfolio page and dynamically create the project cards for display
     */
    function DisplayPortfolioPage(){
        console.log("Called DisplayPortfolioPage...");

        const projectContainer = document.getElementById("project-container");
        const loadMoreButton = document.getElementById("load-more-button");

        /**
            Function to create a project card
         */
        function createProjectCard(project) {

            const col = document.createElement("div");
            col.classList.add("col", "d-flex", "justify-content-center");

            const card = document.createElement("div");
            card.classList.add("card");
            // Set a maximum width for the card
            card.style.maxWidth = "500px";

            const image = document.createElement("img");
            image.classList.add("card-img-top");
            image.src = project.imageSrc;
            image.alt = project.title;

            // Set maximum width and height for the image
            image.style.maxWidth = "500px"; // Adjust the value as needed
            image.style.maxHeight = "200px"; // Adjust the value as needed

            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            const title = document.createElement("h5");
            title.classList.add("card-title");
            title.textContent = project.title;

            const description = document.createElement("p");
            description.classList.add("card-text");

            // Split the description by line breaks and create <br> elements
            const descriptionLines = project.description.split('\n');
            descriptionLines.forEach(line => {
                const lineBreak = document.createElement("br");
                description.appendChild(lineBreak);
                description.appendChild(document.createTextNode(line));
            });

            cardBody.appendChild(title);
            cardBody.appendChild(description);

            card.appendChild(image);
            card.appendChild(cardBody);

            col.appendChild(card);

            return col;
        }

        /**
         * Function to display projects on the page
         */
        function displayProjects(startIndex, endIndex) {
            for (let i = startIndex; i < endIndex && i < projects.length; i++) {
                if (!projects[i].displayed) {
                    const projectCard = createProjectCard(projects[i]);
                    projectContainer.appendChild(projectCard);
                    projects[i].displayed = true; // Mark the project as displayed
                }
            }
        }

        // Initialize the "displayed" property for all projects to false
        for (let i = 0; i < projects.length; i++) {
            projects[i].displayed = false;
        }

        let startIndex = 0;
        const projectsPerPage = 2;

        // Initial display of projects
        displayProjects(startIndex, startIndex + projectsPerPage);
        startIndex += projectsPerPage;

        // Event listener for the "Load More" button
        loadMoreButton.addEventListener("click", () => {
            if (startIndex < projects.length) { // Check if there are more projects to display
                displayProjects(startIndex, startIndex + projectsPerPage);
                startIndex += projectsPerPage;
            } else {
                loadMoreButton.disabled = true; // Disable the button if there are no more projects
            }
        });
    }

    /**
     * Called when the services page is displayed and logs to the console
     */
    function DisplayServicesPage(){
        console.log("Called DisplayServicesPage...");
    }

    /**
     * Called when the Team page is displayed and logs to the console
     */
    function DisplayTeamPage(){
        console.log("Called DisplayTeamPage...")
    }

    /**
     * Called when the Blog page is displayed, logs to the console and updates the DOM to display "Community News"
     * instead of "Community Blog"
     */
    function DisplayBlogPage(){
        console.log("Called DisplayContactListPage...");

        let blogPageHeading = document.getElementsByTagName("h1")[0]
        blogPageHeading.textContent = "Community News";

        document.title = "Harmony Hub - News"
    }

    /**
     * Displays the contact page and sets up event listeners for form submission and modal interactions.
     */
    function DisplayContactPage() {
        console.log("Called DisplayContactPage...");

        // Obtain references to form elements and modals
        let contactForm = document.getElementById('contactForm');
        let modalSubmit = document.getElementById("modalSubmit");

        // Initialize Bootstrap modals
        let contactModal = new bootstrap.Modal(document.getElementById('contactModal'));
        let redirectModal = new bootstrap.Modal(document.getElementById('redirectModal'));

        // Set up event listeners
        contactForm.addEventListener("submit", SubmitContactForm);
        modalSubmit.addEventListener("click", SubmitModalSubmitClick);

        /**
         * Handles the submission of the contact form.
         * Prevents default form submission, checks form validity, and shows the contact modal.
         * @param {Event} event - The event for the form submission.
         */
        function SubmitContactForm(event) {
            event.preventDefault();
            if (!contactForm.checkValidity())
                return;
            PopulateSubmitModal();
            contactModal.show();
        }

        /**
         * Populates the contact modal with data from the form.
         */
        function PopulateSubmitModal() {
            // Retrieve form field elements
            let formFullName = document.getElementById("fullName").value;
            let formEmailAddress = document.getElementById("emailAddress").value;
            let formSubject = document.getElementById("subject").value;
            let formMessage = document.getElementById("message").value;

            // Retrieve modal elements
            let modalFullName = document.getElementById("modalFullName");
            let modalEmailAddress = document.getElementById("modalEmailAddress");
            let modalSubject = document.getElementById("modalSubject");
            let modalMessage = document.getElementById("modalMessage");

            // Update text content of modal elements
            modalFullName.textContent = formFullName;
            modalEmailAddress.textContent = formEmailAddress;
            modalSubject.textContent = formSubject;
            modalMessage.textContent = formMessage;
        }

        /**
         * Handles the click event on the modal submit button.
         * Hides the contact modal, resets the form, and displays a redirect modal with a countdown.
         */
        function SubmitModalSubmitClick() {
            contactModal.hide();
            contactForm.reset();
            RedirectModalCountdown();
            redirectModal.show();
        }

        /**
         * Initiates the countdown for the redirect modal and hides it when the countdown reaches zero.
         * Uses Lodash's delay function to schedule the redirection.
         */
        function RedirectModalCountdown() {
            // Lodash delay for redirect
            _.delay(RedirectToHome, 5500);

            // Counter displayed on modal
            let counter = 5;
            let counterDisplay = document.getElementById("redirectCounter");
            counterDisplay.textContent = counter;

            // Update the countdown every second and hide the modal at the end
            let interval = setInterval(function() {
                counter--;
                counterDisplay.textContent = counter;
                if (counter <= 0) {
                    clearInterval(interval);
                    redirectModal.hide();
                }
            }, 1000);
        }

        /**
         * Redirects the user to the home page.
         */
        function RedirectToHome() {
            window.location.href = "index.html";
        }
    }

    /**
     * Creates and inserts a header element and navigation bar at the beginning of the body.
     */
    function CreateHeader() {

        // menu items for the navigation bar
        const menuItems = [
            { id: "navHomeLink", text: "Home", href: "index.html" },
            { id: "navPortfolioLink", text: "Portfolio", href: "portfolio.html" },
            { id: "navServicesLink", text: "Services", href: "services.html" },
            { id: "navTeamLink", text: "Team", href: "team.html" },
            { id: "navBlogLink", text: "Blog", href: "blog.html" }
        ];

        // HTML elements for header
        let header = document.createElement("header");
        let nav = document.createElement("nav");
        let container = document.createElement("div");
        let brandLink = document.createElement("a");
        let toggleButton = document.createElement("button");
        let toggleIcon = document.createElement("span");
        let collapseDiv = document.createElement("div");
        let navList = document.createElement("ul");


        // Classes and attributes for the elements
        header.setAttribute("class", "");
        nav.setAttribute("class", "navbar navbar-expand-lg bg-body-tertiary");
        container.setAttribute("class", "container");

        brandLink.setAttribute("class", "navbar-brand");
        brandLink.setAttribute("href", "index.html");
        brandLink.setAttribute("id", "navHomeLogo");

        toggleButton.setAttribute("class", "navbar-toggler");
        toggleButton.setAttribute("type", "button");
        toggleButton.setAttribute("data-bs-toggle", "collapse");
        toggleButton.setAttribute("data-bs-target", "#navbarSupportedContent");
        toggleButton.setAttribute("aria-controls", "navbarSupportedContent");
        toggleButton.setAttribute("aria-expanded", "false");
        toggleButton.setAttribute("aria-label", "Toggle navigation");

        toggleIcon.setAttribute("class", "navbar-toggler-icon");

        collapseDiv.setAttribute("class", "collapse navbar-collapse");
        collapseDiv.setAttribute("id", "navbarSupportedContent");

        navList.setAttribute("class", "navbar-nav mb-auto mb-2 mb-lg-0");
        navList.setAttribute("id", "navLinkList")

        // Create the brand link element
        brandLink.classList.add("navbar-brand");
        brandLink.href = "index.html";
        brandLink.setAttribute("id", "navHomeLogo");

        // Create a new i element for the icon
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-people-roof");

        brandLink.appendChild(icon);

        // text content for the brand link
        brandLink.appendChild(document.createTextNode(" Harmony Hub"));

        // Create header structure
        header.appendChild(nav);
        nav.appendChild(container);
        container.appendChild(brandLink);
        container.appendChild(toggleButton);
        toggleButton.appendChild(toggleIcon);
        container.appendChild(collapseDiv);
        collapseDiv.appendChild(navList);

        // List items with links for each navbar item
        for (const item of menuItems) {
            let listItem = document.createElement("li");
            listItem.setAttribute("class", "nav-item");

            let link = document.createElement("a");
            link.setAttribute("class", "nav-link");
            link.setAttribute("id", item.id);
            link.setAttribute("href", item.href);
            link.textContent = item.text;

            listItem.appendChild(link);
            navList.appendChild(listItem);
        }

        // Insert the header at the beginning
        document.body.insertBefore(header, document.body.firstChild)

        // Dynamically changes navbar as per requirements
        ChangeNavBar();
    }

    /**
     * Creates and inserts a footer element with navigation links
     */
    function CreateFooter() {

        // Array of footer links with titles
        const footerItems = [
            { text: "Privacy Policy", href: "privacy_policy.html" },
            { text: "Terms of Service", href: "terms_of_service.html" },
            { text: "Contact Us", href: "contact.html"}
        ];

        // HTML elements for the footer
        let footer = document.createElement("footer");
        let nav = document.createElement("nav");
        let container = document.createElement("div");
        let footerList = document.createElement("ul");
        let copyrightText = document.createElement("p");

        // Locate the main content tags
        let mainContent = document.querySelector("main");

        // Attributes and content for the footer elements
        nav.setAttribute("class", "py-3 mt-5 bg-body-tertiary");
        container.setAttribute("class", "container");
        footerList.setAttribute("class", "nav justify-content-center border-bottom pb-3 mb-3");
        copyrightText.setAttribute("class", "text-center text-body-secondary");
        copyrightText.textContent = "© 2024 Harmony Hub, Inc";

        // Create footer structure
        footer.appendChild(nav);
        nav.appendChild(container);
        container.appendChild(footerList);

        // List items with links for each footer link
        for(const item of footerItems) {
            let listItem = document.createElement("li");
            listItem.setAttribute("class", "nav-item");

            let listLink = document.createElement("a");
            listLink.setAttribute("class", "nav-link px-2 text-body-secondary underline-hover");
            listLink.setAttribute("href", item.href);
            listLink.textContent = item.text;

            listItem.appendChild(listLink);
            footerList.appendChild(listItem);
        }

        // Bottom text
        container.appendChild(copyrightText);

        // Insert the footer after the main content in the document
        mainContent.parentNode.insertBefore(footer, mainContent.nextSibling);
    }

    /**
     * Modifies the navigation bar in two ways:
     * 1. Adds a new 'Careers' item to the navigation list.
     * 2. Changes the text of the existing 'Blog' item to 'News'.
     */
    function ChangeNavBar() {

        // Get link list id
        let navList = document.getElementById("navLinkList")

        // Set new list item attributes
        let newItem = document.createElement("li");
        newItem.setAttribute("class", "nav-item");

        // Set new link attributes
        let newLink = document.createElement("a");
        newLink.setAttribute("class", "nav-link");
        newLink.setAttribute("href", "#");
        newLink.setAttribute("id", "navCareersLink");
        newLink.textContent = "Careers";

        // Append the new items
        newItem.appendChild(newLink);
        navList.appendChild(newItem);

        // Change Blog to News
        let blogLink = document.getElementById("navBlogLink");
        blogLink.textContent = "News";

    }

    /**
     * Called when the Privacy Policy page is displayed, logs to the console
     */
    function DisplayPrivacyPolicyPage(){
        console.log("Called DisplayPrivacyPolicyPage...");
    }

    /**
     * Called when the Display Terms Of Service Page is displayed, logs to the console
     */
    function DisplayTermsOfServicePage(){
        console.log("Called DisplayTermsOfServicePage...");
    }

    /**
     * Called when the website is launched to create the header and footer to display on the page. A switch statement
     * is used to detect which page has been loaded based on the Document Title.
     */
    function Start(){
        // Page title prefix
        const titlePrefix = "Harmony Hub - "

        console.log("App Started");

        // Generate the header and footer
        CreateHeader();
        CreateFooter();

        // Switch function depending on page
        switch (document.title) {
            case `${titlePrefix}Home`:
                DisplayHomePage();
                break;
            case `${titlePrefix}Portfolio`:
                DisplayPortfolioPage();
                break;
            case `${titlePrefix}Services`:
                DisplayServicesPage();
                break;
            case `${titlePrefix}Team`:
                DisplayTeamPage();
                break;
            case `${titlePrefix}Blog`:
                DisplayBlogPage();
                break;
            case `${titlePrefix}Privacy Policy`:
                DisplayPrivacyPolicyPage();
                break;
            case `${titlePrefix}Terms Of Service`:
                DisplayTermsOfServicePage();
                break;
            case `${titlePrefix}Contact Us`:
                DisplayContactPage();
                break;
        }
    }
    window.addEventListener("load", Start);

})();

