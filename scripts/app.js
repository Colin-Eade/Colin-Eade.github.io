/**
 *  @Authors Colin Eade (ID:100329105) and Megan Clarke (ID:100881229).
 *  @Date January 26, 2024.
 *  @File app.js
 *  @Description This is the JavaScript file that contains all the functions to run the Harmony Hub Website. We utilize
 *  an IIFE to immediately invoke the site when it is launched and dynamically select which page functions to load
 *  based on the title of the page that was loaded.
 */

"use strict";

//region Globals
const titlePrefix = "Harmony Hub - "
//endregion

//region Format Functions
function formatDate(dateString) {
    const dateParts = dateString.split('-'); // Split the date string into parts
    const year = dateParts[0];
    const month = parseInt(dateParts[1], 10); // Parse month as integer (base 10)
    const day = parseInt(dateParts[2], 10); // Parse day as integer (base 10)

    // Create a Date object
    const date = new Date(year, month - 1, day); // Note: Months are zero-based in JavaScript Date object

    // Array of month names
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Get the month name from the array using the month index
    const monthName = monthNames[date.getMonth()];

    // Format the date as "Month Day, Year"
    const formattedDate = monthName + ' ' + day + ', ' + year;

    return formattedDate;
}
//endregion

// IIFE - Immediately Invoked Functional Expression
(function(){

    //region Login Session Functions
    /**
     * Checks if the user is currently logged in by looking for user data in sessionStorage.
     *
     * @returns {boolean} True if user data is found, otherwise, false.
     */
    function CheckLogin() {
        return !!sessionStorage.getItem("user");
    }

    /**
     * Checks if the logout action has been triggered by looking for a logout flag in sessionStorage.
     *
     * @returns {boolean} True if the logout flag is found, otherwise, false.
     */
    function CheckLogout() {
        return !!sessionStorage.getItem("logout");
    }
    //endregion

    //region Input Field Functions
    /**
     * Checks if there are any input fields currently marked as invalid within the form.
     * This is determined by checking if there are any elements with the class 'invalid-field'.
     * A return value of true indicates that no invalid fields are present, and the form can be submitted.
     *
     * @returns {boolean} Returns true if no elements have the 'invalid-field' class, and false otherwise.
     */
    function CheckSubmissionValidity() {
        return $(".invalid-field").length <= 0;
    }

    /**
     * Validates the value of an input field against a provided regular expression. If no regular expression is provided,
     * it checks if the input field value is not empty after trimming whitespace.
     *
     * @param inputFieldId The ID of the input field to be validated.
     * @param regEx Optional. The regular expression to test against the input field value.
     * @returns {boolean} True if the input field value passes the regex test or is not empty; otherwise, false.
     */
    function ValidateField(inputFieldId, regEx) {
        return regEx ? regEx.test($(inputFieldId).val()) : $(inputFieldId).val().trim() !== "";
    }

    /**
     * Checks if the values of the password and confirm password fields match.
     *
     * @param passwordFieldId The ID of the password input field.
     * @param confirmPasswordFieldId The ID of the confirm password input field.
     * @returns {boolean} True if the values of both fields match; otherwise, false.
     */
    function ConfirmPassword (passwordFieldId, confirmPasswordFieldId) {
        return $(passwordFieldId).val() === $(confirmPasswordFieldId).val();
    }

    /**
     * Validates if the input date from a given field is a valid date and not in the future compared to today's date.
     *
     * @param dateFieldId The ID of the input field containing the date.
     * @returns {boolean} Returns true if the date is valid and not in the future; otherwise, returns false.
     */
    function ValidateDate(dateFieldId) {
        let date = new Date($(dateFieldId).val());
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        return !(isNaN(date.getTime()) || date > today);
    }

    /**
     * Attaches validation logic to both an input field event and the click event of a submit button.
     * It removes any existing validation feedback, then validates the input field's value against a regular expression.
     * If validation fails, it sets an invalid field and an error message.
     *
     * @param inputFieldId The ID of the input field to validate.
     * @param inputFieldEvent The event type to listen for on the input field.
     * @param submitButtonId The ID of the submit button.
     * @param regEx The regular expression to test against the input field value.
     * @param errorMessage The error message to display if validation fails.
     */
    function ValidateOnEvent(inputFieldId, inputFieldEvent, submitButtonId, regEx, errorMessage) {

        $(inputFieldId).on(inputFieldEvent, () => {
            RemoveInvalidField(inputFieldId);

            if (!ValidateField(inputFieldId, regEx)) {
                SetInvalidField(inputFieldId, errorMessage);
            }
        });
        $(submitButtonId).on('click', () => {
            RemoveInvalidField(inputFieldId);

            if (!ValidateField(inputFieldId, regEx)) {
                SetInvalidField(inputFieldId, errorMessage);
            }
        });
    }

    /**
     * Validates that two password fields match both on a specific event of the confirmation password field
     * and on the click event of a submit button. It sets an invalid field and shows an error message if the
     * passwords do not match.
     *
     * @param passwordFieldId The ID of the password field.
     * @param passwordFieldEvent The event type to listen for on the password field.
     * @param submitButtonId The ID of the submit button.
     * @param confirmPasswordFieldId The ID of the confirmation password field.
     * @param errorMessage The error message to display if the passwords do not match.
     */
    function ConfirmPwOnEvent(passwordFieldId, passwordFieldEvent, submitButtonId, confirmPasswordFieldId, errorMessage) {
        $(confirmPasswordFieldId).on(passwordFieldEvent, () => {
            RemoveInvalidField(confirmPasswordFieldId);

            if (!ConfirmPassword(passwordFieldId, confirmPasswordFieldId)) {
                SetInvalidField(confirmPasswordFieldId, errorMessage);
            }
        });
        $(submitButtonId).on('click', () => {
            RemoveInvalidField(confirmPasswordFieldId);

            if (!ConfirmPassword(passwordFieldId, confirmPasswordFieldId)) {
                SetInvalidField(confirmPasswordFieldId, errorMessage);
            }
        });
    }

    /**
     * Attaches validation logic to both a date input field event and the click event of a submit button.
     * It checks if the date is valid and not in the future. If validation fails, it sets and invalid field
     * and an error message.
     *
     * @param dateFieldId The ID of the date input field to validate.
     * @param dateFieldEvent The event type to listen for on the date input field.
     * @param submitButtonId The ID of the submit button.
     * @param errorMessage The error message to display if the date validation fails.
     */
    function ValidateDateOnEvent(dateFieldId, dateFieldEvent, submitButtonId, errorMessage) {
        $(dateFieldId).on(dateFieldEvent, () => {
            RemoveInvalidField(dateFieldId);

            if (!ValidateDate(dateFieldId)) {
                SetInvalidField(dateFieldId, errorMessage);
            }
        });
        $(submitButtonId).on('click', () => {
            RemoveInvalidField(dateFieldId);

            if (!ValidateDate(dateFieldId)) {
                SetInvalidField(dateFieldId, errorMessage);
            }
        });
    }

    /**
     * Removes visual indicators of validation error from the specified input field.
     *
     * @param inputFieldId The ID of the input field from which to remove validation error indicators.
     */
    function RemoveInvalidField(inputFieldId) {
        $(inputFieldId).removeClass("invalid-field");
        $(inputFieldId).popover("dispose");
        $(inputFieldId).next("span").remove();
    }

    /**
     * Adds visual indicators of validation error to the specified input field.
     *
     * @param inputFieldId The ID of the input field to mark as invalid.
     * @param errorMessage The error message to display within the popover when the user hovers over the input field.
     */
    function SetInvalidField(inputFieldId, errorMessage) {
        $(inputFieldId).addClass("invalid-field")
        $(inputFieldId).popover({
            content: errorMessage,
            placement: "right",
            trigger: "hover",
            template: '<div class="popover popover-invalid bs-popover-auto fade show">' +
                          '<div class="popover-body popover-body-invalid"></div>' +
                      '</div>'
        })
        $(inputFieldId).after('<span class="input-group-text bg-danger text-white">' +
                                            '<i class="fa-regular fa-circle-xmark"></i>' +
                                        '</span>');
    }
    //endregion

    //region Header and Footer Functions
    /**
     * Loads the website's header from an HTML file and performs various initializations.
     * It updates the header based on the user's login status and adjusts navigation links to reflect the current page.
     */
    function LoadHeader() {
        $.get("./includes/header.html", (data) => {
            let noPrefixTitle =  document.title.replace(titlePrefix, "");
            $("header").html(data);
            ChangeNavBar();
            NavBarSearch();

            if(CheckLogin()) {
                SetLoggedInNavBar();
                SetWelcomeMessage();

            } else if (CheckLogout()) {
                SetLogoutMessage();
            }
            $(`li>a:contains(${noPrefixTitle})`).addClass("active").attr("aria-current", "page");
        });
    }

    /**
     * Dynamically loads the footer content into the page.
     * This function makes an AJAX GET request to retrieve the contents of the 'footer.html' file.
     */
    function LoaderFooter() {
        $.get("./includes/footer.html", (data) => {
            $("footer").html(data);
        });
    }

    /**
     * Modifies the navigation bar in two ways:
     * 1. Adds a new 'Careers' item to the navigation list.
     * 2. Changes the text of the existing 'Blog' item to 'News'.
     */
    function ChangeNavBar() {

        // Create new list item and link
        let $newItem = $('<li class="nav-item"></li>');
        let $newLink = $('<a class="nav-link" href="careers.html" id="navCareersLink">Careers</a>');

        // Append the new link to the new list item
        $newItem.append($newLink);

        // Insert the new item after the gallery link
        $('#navGalleryLink').closest('li').after($newItem);

        // Change Blog to News
        $('#navBlogLink').text('News');

    }

    /**
     * Implements a search feature in the navigation bar.
     * This function listens for key events on the search input and dynamically populates a dropdown with search results.
     * It fetches search data from a local JSON file and filters results based on the user's input.
     */
    function NavBarSearch() {
        let navSearchInput = $("#navSearchInput");
        let navSearchDropdown = $("#navSearchDropdown");
        let navSearchButton = ($("#navSearchButton"));
        let firstResultUrl = null;

        // Navigate to the first search result when the search button is clicked
        navSearchButton.on("click", () => {
            if (firstResultUrl) {
                window.location.href = firstResultUrl;
            }
        });

        // Prevent form submission on 'Enter' key
        navSearchInput.on("keydown", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });

        // Search on keystrokes
        navSearchInput.on("keyup", function() {

            let searchTerm = $(this).val().toLowerCase();
            navSearchDropdown.empty();

            // Show dropdown only if search term is longer than 2 characters
            if (searchTerm.length <= 2) {
                navSearchDropdown.hide();

            } else {
                navSearchDropdown.show();

                // Fetch search data from JSON file
                $.get('./data/data_dump.json', function(data) {

                    let matchFound = false;

                    // Iterate through each object in JSON
                    for (const page of data.pages) {

                        // Store text data
                        let textContent = page.content
                        let lowerCaseContent = textContent.toLowerCase();
                        let index = lowerCaseContent.indexOf(searchTerm);

                        // Check if the search term is found in the page content
                        if (index !== -1) {
                            matchFound = true;

                            // Set the URL for search button click
                            if (firstResultUrl === null) {
                                firstResultUrl = page.URL;
                            }

                            // Create a string snippet to display in the search dropdown
                            let start = Math.max(index - 20, 0);
                            let end = Math.min(index + searchTerm.length + 20, textContent.length);

                            let snippetStart = start > 0 ? "..." : "";
                            let snippetEnd = end < textContent.length ? "..." : "";
                            let searchSnippet = snippetStart + textContent.substring(start, end).trim() + snippetEnd;

                            // Make a dropdown list of the search snippets and URL links they are from
                            if (navSearchDropdown.children().length < 5) {
                                let filename = page.URL.split('/').pop();
                                let listItem = `<a class="dropdown-item d-flex justify-content-between align-items-center me-5" href="${page.URL}">
                                                <span>${searchSnippet}</span>
                                                <span class="small text-secondary">${filename}</span>
                                            </a>`;
                                navSearchDropdown.append(listItem).show();
                            }
                        }
                    }
                    // Display "No results found" in dropdown if there are no matches to user input
                    if (!matchFound) {
                        navSearchDropdown.append('<span class="dropdown-item">No results found</span>').show();
                    }
                });
            }
        });
    }

    /**
     * Updates the navigation bar to reflect the user's logged-in state.
     * This function modifies the login link and transforms it into a dropdown toggle.
     * The dropdown toggle contains the user's name, email, and a link to logout.
     * The logout action clears the session storage, redirects to the login page, and sets a 'logout' flag to indicate
     * a successful logout.
     */
    function SetLoggedInNavBar() {
        $("#navLoginLink").html('<i class="fa-solid fa-user"></i> Account').attr({
            "id": "navUserButton",
            "class": "nav-link dropdown-toggle",
            "href": "#",
            "role": "button",
            "data-bs-toggle": "dropdown",
            "aria-expanded": "false"
        }).parent().addClass("dropdown");

        let userData = sessionStorage.getItem("user");

        if (userData) {
            let user = new HarmonyHub.User();
            user.deserialize(userData);
            $("#navUserButton").after(`<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navUserButton">
                                           <li class="px-3 py-1">${user.firstName} ${user.lastName}</li>
                                           <li class="px-3 py-1">${user.emailAddress}</li>
                                           <div class="dropdown-divider"></div>
                                           <li><a id="navLogoutLink" class="dropdown-item" href="#">Logout</a></li>
                                       </ul>`);
        } else {
            $("#navUserButton").after(`<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navUserButton">
                                       <li><a id="navLogoutLink" class="dropdown-item" href="#">Logout</a></li>
                                   </ul>`);
        }

        $("#navLogoutLink").on("click", () => {
            sessionStorage.clear();
            location.href = "login.html";
            sessionStorage.setItem("logout", "true");
        });
    }

    /**
     * Displays a temporary welcome message to the user if they haven't been welcomed already.
     * This function checks the session storage for a 'welcomed' flag to avoid repeating the welcome message.
     * If the user data is found in the session storage, it deserializes this data to greet the user by name.
     */
    function SetWelcomeMessage() {
        if(!sessionStorage.getItem("welcomed")) {

            let userData = sessionStorage.getItem("user");

            if (userData) {

                let user = new HarmonyHub.User();
                user.deserialize(userData);

                $("#navUserButton").closest("li")
                    .before(`<li class="nav-item" id="navMessageWrapper">
                                <span id="navMessage" class="nav-link">
                                    Welcome back, ${user.firstName}!
                                </span>
                            </li>`);

                sessionStorage.setItem("welcomed", "true");

                setTimeout(() => {
                    $("#navMessageWrapper").remove();
                }, 6000);
            }
        }
    }

    /**
     * Displays a temporary logout message upon user logout.
     * It confirms to the user that they have successfully logged out.
     * Additionally, this function handles the cleanup of the 'logout' flag from the session storage.
     */
    function SetLogoutMessage() {
        $("#navLoginLink").closest("li")
            .before(`<li class="nav-item" id="navMessageWrapper">
                         <span id="navMessage" class="nav-link">
                             Logout successful!
                         </span>
                     </li>`);
        
        sessionStorage.removeItem("logout");

        setTimeout(() => {
            $("#navMessageWrapper").remove();
        }, 6000);
    }
    //endregion

    //region Home Page Functions
    /**
     * Initializes the home page by setting up event listeners for search and scrolling actions.
     * This function sets up the behavior for the search input, search button, and scroll buttons
     * for navigating through news articles fetched from NewsAPI
     */
    function DisplayHomePage(){
        console.log("Called DisplayHomePage...");
        let page = 1;
        let searchInput = "Durham Region Ontario";

        $("#newsSearchInput").on('keydown', function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });

        NewsAPIFetch(searchInput, page);

        $("#newsSearchButton").on("click", () => {
            searchInput = $("#newsSearchInput").val();
            page = 1;

            $("#homeArticleArea").empty();

            NewsAPIFetch(searchInput, page);
        });

        $("#newsScrollDownButton").on("click", () => {
            page ++;

            $("#homeArticleArea").empty();

            NewsAPIFetch(searchInput, page);
        });

        $("#newsScrollUpButton").on("click", () => {
            page --;

            $("#homeArticleArea").empty();

            NewsAPIFetch(searchInput, page);
        });
    }

    /**
     * Fetches news articles based on the specified keywords and page number using the NewsAPI.
     * @param keywords The search keywords used to fetch relevant news articles.
     * @param page The current page number of the API fetch.
     */
    function NewsAPIFetch(keywords, page) {
        const pageSize = 5
        const key = "18c00679c61248edbdf53cfaeee600c0";
        let url =  `https://newsapi.org/v2/everything?q=${keywords}&pageSize=${pageSize}&page=${page}&apiKey=${key}`;

        // Performs the GET request to the NewsAPI
        $.get(url, function(data) {
            NewsAPIFetchSuccess(data, page, pageSize);
        }).fail(NewsAPIFail)
    }

    /**
     * Handles the successful fetch of news articles from the NewsAPI, and populates the UI with articles.
     * @param data The JSON response from NewsAPI containing the articles and metadata.
     * @param page The current page number of the API fetch.
     * @param pageSize The number of articles per API fetch.
     */
    function NewsAPIFetchSuccess(data, page, pageSize) {

        let scrollDownButton = $("#newsScrollDownButton");
        let scrollUpButton = $("#newsScrollUpButton");

        // Check is NewsAPI JSON returned "ok" status
        if (data.status === "ok") {

            // Check if any results returned
            if (data.totalResults) {

                // Enable scroll buttons
                scrollDownButton.removeClass("disabled");
                scrollUpButton.removeClass("disabled");

                // Calculate the max amount of pages based on total results
                let maxPages = Math.ceil(data.totalResults / pageSize);

                // Disable scroll up on first page
                if (page <= 1) {
                    scrollUpButton.addClass("disabled");
                }

                // Disable scroll down on last page
                if (page >= maxPages) {
                    scrollDownButton.addClass("disabled");
                }

                // Iterate through each article in the response and construct an HTML display
                for (const article of data.articles) {
                    let articleHtml = `
                        <a href="${article.url}" class="list-group-item list-group-item-action mt-1 border-top"
                        target="_blank" rel="noopener noreferrer">
                            <h5 class="mb-1">${article.title || "No title"}</h5>
                            <p class="mb-1 text-muted small">
                                ${new Date(article.publishedAt).toLocaleDateString() || "No date"}
                                 | ${article.source.name || "No source name"} 
                                 | ${article.author || "No author"}
                            </p>
                            <p class="mb-1">${article.description || "No description"}</p>
                        </a>`;

                    // Add the article data to the home page article area
                    $('#homeArticleArea').append(articleHtml);

                }
            } else {

                // Disable scroll buttons if no results are found
                scrollDownButton.addClass("disabled");
                scrollUpButton.addClass("disabled");

                // Display a message to the user in the articles area
                let articleHtml = `
                        <div class="list-group-item mt-1">
                            <p class="mb-1">No articles to display. Please try another search.</p>
                        </div>`;

                $('#homeArticleArea').append(articleHtml);
            }
        }
    }

    /**
     * Handles failures when fetching news articles from the NewsAPI.
     * @param data The error response from the News API containing the error details or status.
     */
    function NewsAPIFail(data) {

        // Disable scroll buttons
        $("#newsScrollDownButton").addClass("disabled");
        $("#newsScrollUpButton").addClass("disabled");

        // Construct error message
        let errorHtml = `
                        <div class="list-group-item mt-1 border-top">
                            <div class="d-flex justify-content-center align-items-center text-center">
                                <h3 class="mb-1" >
                                    <i class="fas fa-exclamation-triangle"></i><br>
                                    Error
                                </h3>       
                            </div>`;

        // Error message for empty search
        if (!$("#newsSearchInput").val()) {
            errorHtml += `<p class="mb-1">
                              Search field is empty. Please enter a topic to search. 
                              For example, you can search for 'technology', 'politics', 
                              'sports', or any specific event or topic you're interested in. 
                              Make sure to use keywords that are likely to produce relevant results.
                          </p>`;

            // Error message if the API returned a specific one
        } else if (data.responseJSON && data.responseJSON.message) {
            errorHtml += `<p class="mb-1">${data.responseJSON.message}</p>`;

            // Error message for any other error
        } else {
            `<p class="mb-1">An unexpected error occurred. Please try again later.</p>`
        }
        errorHtml += `</div>`;
        $('#homeArticleArea').append(errorHtml);
    }

    //endregion

    //region Portfolio Page Functions
    /**
     * Called to display the portfolio page and dynamically create the project cards for display
     */
    function DisplayPortfolioPage() {
        console.log("Called DisplayPortfolioPage...");

        const projectContainer = document.getElementById("project-container");
        const loadMoreButton = document.getElementById("load-more-button");


        /**
         * Checks if the project card has been displayed
         * @param projects
         * @param startIndex
         * @param endIndex
         */
        function displayProjects(projects, startIndex, endIndex) {
            for (let i = startIndex; i < endIndex && i < projects.length; i++) {
                if (!projects[i].displayed) {
                    const projectCard = createProjectCard(projects[i]);
                    projectContainer.appendChild(projectCard);
                    projects[i].displayed = true; // Mark the project as displayed
                }
            }
        }

        /**
         * Function to load projects to the page with Ajax
         */
        function loadProjects() {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'data/projects.json', true);

            xhr.onload = function() {
                if (this.status === 200) {
                    // Parse the JSON response
                    const response = JSON.parse(this.responseText);

                    // Access the 'projects' array within the parsed object
                    const projects = response.projects;

                    // Proceed with the rest of your code, now that `projects` correctly references the array
                    projects.forEach(project => project.displayed = false);

                    let startIndex = 0;
                    const projectsPerPage = 2;

                    // Initial display of projects
                    displayProjects(projects, startIndex, startIndex + projectsPerPage);
                    startIndex += projectsPerPage;

                    // Event listener for the "Load More" button
                    loadMoreButton.addEventListener("click", function handleLoadMore() {
                        if (startIndex < projects.length) {
                            displayProjects(projects, startIndex, startIndex + projectsPerPage);
                            startIndex += projectsPerPage;
                        } else {
                            loadMoreButton.disabled = true;
                        }
                    });
                } else {
                    console.error("Failed to load projects:", this.statusText);
                }
            };

            xhr.onerror = function() {
                console.error("Request failed");
            };

            xhr.send();
        }

        // Call loadProjects to initiate the AJAX request
        loadProjects();
    }

    /**
     * Creates a project card with the project details and image
     * @param project
     * @returns {HTMLDivElement}
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
    //endregion

    //region Services Page Functions
    /**
     * Called when the services page is displayed and logs to the console
     */
    function DisplayServicesPage(){
        console.log("Called DisplayServicesPage...");
    }
    //endregion

    //region Team Page Functions
    /**
     * Called when the Team page is displayed and logs to the console
     */
    function DisplayTeamPage(){
        console.log("Called DisplayTeamPage...")
    }
    //endregion

    //region Blog Page Functions
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
    //endregion

    //region Contact Page Functions
    /**
     * Displays the contact page and sets up event listeners for form submission and modal interactions.
     */
    function DisplayContactPage() {
        console.log("Called DisplayContactPage...");

        FeedbackCard();
        ContactFormValidation();

        // Obtain references to form elements and modals
        let submitButton = document.getElementById('formSubmit');
        let modalSubmit = document.getElementById("modalSubmit");

        // Initialize Bootstrap modals
        let contactModal = new bootstrap.Modal(document.getElementById('contactModal'));
        let redirectModal = new bootstrap.Modal(document.getElementById('redirectModal'));

        // Set up event listeners
        submitButton.addEventListener("click", (event) => {
           if (CheckSubmissionValidity()) {
               SubmitContactForm(event);
           }
        });
        modalSubmit.addEventListener("click", SubmitModalSubmitClick);


        /**
         * Handles the submission of the contact form.
         * Prevents default form submission, checks form validity, and shows the contact modal.
         * @param {Event} event - The event for the form submission.
         */
        function SubmitContactForm(event) {
            event.preventDefault();
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
     * Validates the contact form input fields on blur and submission events.
     */
    function ContactFormValidation() {
        let fullNameError = "Please enter your full name, starting each part with a capital letter. " +
            "You can include spaces, hyphens, and apostrophes if necessary.";
        let emailAddressError = "Please enter a valid email address in the format: yourname@example.com.";
        let messageError = "Your message cannot be empty. Please provide details so we can assist you better.";

        ValidateOnEvent("#fullName", "blur", "#formSubmit",
                            /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+)+$/, fullNameError);
        ValidateOnEvent("#emailAddress", "blur", "#formSubmit",
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, emailAddressError);
        ValidateOnEvent("#message", "blur", "#formSubmit",
                            null, messageError);
    }

    /**
     * Initializes and manages the feedback card UI.
     *
     * This function sets up the behavior for a feedback card component, including event listeners for form submission
     * and input validation.
     */
    function FeedbackCard() {

        let feedbackMessage = $("#feedBackMessage");
        let feedbackDropdown =  $("#feedBackDropdown");
        let feedbackForm = $("#feedBackForm");
        let feedbackBody = $("#feedBackBody");

        // Show the feedback form and hide the message element initially
        feedbackForm.show();
        feedbackMessage.hide();
        feedbackDropdown.remove("invalid-field");

        // Prevent form submission with the Enter key
        feedbackForm.on('keydown', function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });

        // Submit Button Click
        $("#feedbackSubmit").on("click", ()=> {

            // Make sure a valid rating was selected
           if (feedbackDropdown.val() === "0") {

               // Return an invalid field on the rating if invalid
               feedbackDropdown.addClass("invalid-field");
               feedbackMessage.addClass("alert alert-danger")
                   .text("Please select a rating before submitting your feedback.").show();

           } else {

               // On valid submission Grab a response from JSON
               $.get("./data/feedback_responses.json", function(data) {

                   // Get specific response based user rating
                   let response = data[feedbackDropdown.val()];

                   // Add to response if user left a comment
                   if($("#feedBackComment").val().trim() !== "") {
                       response += " " + data.commentResponse;
                   }

                   // Fade out and fade back in the feedback card to display "Thank you" response
                   feedbackBody.fadeOut("slow", function() {

                       feedbackForm.hide();
                       feedbackMessage.removeClass("alert-danger").addClass("alert alert-success")
                           .text(response).show();

                       feedbackBody.fadeIn("slow");
                   });
               }).fail(()=> {
                   // Generic response if JSON fetch fails
                   let genericResponse = "Thank you for your feedback.";

                   feedbackBody.fadeOut("slow", function() {

                       feedbackForm.hide();
                       feedbackMessage.removeClass("alert-danger").addClass("alert alert-success")
                           .text(genericResponse).show();

                       feedbackBody.fadeIn("slow");
                   });
               });
           }
        });
    }
    //endregion

    //region Privacy Policy Page Functions
    /**
     * Called when the Privacy Policy page is displayed, logs to the console
     */
    function DisplayPrivacyPolicyPage(){
        console.log("Called DisplayPrivacyPolicyPage...");
    }
    //endregion

    //region Terms of Service Page Functions
    /**
     * Called when the Display Terms Of Service Page is displayed, logs to the console
     */
    function DisplayTermsOfServicePage(){
        console.log("Called DisplayTermsOfServicePage...");
    }
    //endregion

    //region Events Page Functions
    /**
     * Function called to display the events page
     */
    function DisplayEventsPage() {
        console.log("Called DisplayEventsPage...");

        $(document).ready(function() {
            // Event listener for dropdown items
            $('.dropdown-item').on('click', function() {
                let filterOption = $(this).text().toLowerCase().trim();
                displayEventCards(filterOption);
            });

            // Initial display of events with default filter option
            displayEventCards('upcoming');
        });

    }

    /**
     * Function to filter the events by the selected filter option
     * @param filterOption
     */
    function displayEventCards(filterOption) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', './data/events.json', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                let eventsData = JSON.parse(xhr.responseText).events;

                // Filter events based on the selected option
                let filteredEvents = filterEvents(eventsData, filterOption);

                // Sort filtered events by event date
                filteredEvents.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

                const eventsContainer = $("#events-container");
                eventsContainer.empty(); // Clear existing events before adding filtered events

                // Create cards for filtered events
                filteredEvents.forEach(event => {
                    const eventCard = createEventCard(event);
                    eventCard.hide();
                    eventsContainer.append(eventCard);
                    eventCard.fadeIn('slow');
                });
            } else {
                console.error('Error fetching JSON data:', xhr.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Error fetching JSON data:', xhr.statusText);
        };
        xhr.send();
    }

    /**
     * Creates a card for an event with the event details and image
     * @param event
     * @returns card
     */
    function createEventCard(event) {
        const colDiv = $("<div>").addClass("col-xl-3 col-lg-4 col-md-6 col-sm-12 d-flex");

        const card = $("<div>").addClass("card").css("margin", "5px");

        // Create an image element for the event
        const cardImage = $("<img>").addClass("card-img-top").attr("src", event.eventImage).attr("alt", event.eventName);

        const cardBody = $("<div>").addClass("card-body");

        const title = $("<h5>").addClass("card-title").text(event.eventName);
        const date = $("<p>").addClass("card-text").text("Date: " + formatDate(event.eventDate));
        const location = $("<p>").addClass("card-text").text("Location: " + event.eventLocation);
        const description = $("<p>").addClass("card-text").text(event.eventDescription);

        // Append the image and body to the card
        card.append(cardImage, cardBody);
        cardBody.append(title, date, location, description);

        // Append the card to the column div
        colDiv.append(card);

        return colDiv;
    }

    /**
     * Receives an array of events to sort according to the filter option selected.
     * Returns a sorted list based on date.
     * @param events
     * @param filterOption
     * @returns events
     */
    function filterEvents(events, filterOption) {
        if (filterOption === 'upcoming') {
            return events.filter(event => new Date(event.eventDate) > new Date());
        } else if (filterOption === 'past') {
            return events.filter(event => new Date(event.eventDate) < new Date());
        } else {
            return events; // Return all events if filter option is 'all'
        }
    }
    //endregion

    //region Gallery Page Functions
    /**
     * Function called to display the Gallery Page
     */
    function DisplayGalleryPage() {
        console.log("Called DisplayGalleryPage...");

        // Initial loading of thumbnails with default sorting option (newest)
        loadGalleryThumbnails('newest first');

        // Event listener for dropdown items
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', function () {
                const sortOption = this.textContent.toLowerCase().trim(); // Get the text content of the clicked item
                loadGalleryThumbnails(sortOption);
            });
        });
    }

    /**
     * Function to load thumbnails based on sorting option selected
     * @param sortOption
     */
    function loadGalleryThumbnails(sortOption) {
        // Fetch events data from JSON file
        let xhr = new XMLHttpRequest();
        xhr.open('GET', './data/events.json', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                let eventsData = JSON.parse(xhr.responseText).events;

                // Sort events based on selected option
                if (sortOption === 'newest first') {
                    eventsData.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
                } else if (sortOption === 'oldest first') {
                    eventsData.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
                }

                // Create thumbnails based on sorted events data
                createGalleryThumbnails(eventsData);
            } else {
                console.error('Error fetching JSON data:', xhr.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Error fetching JSON data:', xhr.statusText);
        };
        xhr.send();
    }

    /**
     * Receives the event data and creates an event card and calls the modal creator function to create
     * the matching modal.
     * @param eventsData
     */
    function createGalleryThumbnails(eventsData) {
        const thumbnailsContainer = $('#thumbnails');
        thumbnailsContainer.empty(); // Clear existing thumbnails

        const currentDate = new Date(); // Get current date

        eventsData.forEach(event => {

            // Parse event date from string to Date object
            const eventDate = new Date(event.eventDate);

            // Check if event date is before the current date
            if (eventDate < currentDate) {

                const colDiv = $("<div>").addClass("col-xl-3 col-lg-4 col-md-6 col-sm-12");
                const thumbnailDiv = $('<div>').addClass('thumbnail-container').css('padding', '10px');
                const thumbnailLink = $('<a>').attr('href', '#').addClass('thumbnail')
                    .attr('data-bs-toggle', 'modal')
                    .attr('data-bs-target', `#lightboxModal${event.eventId}`);
                const thumbnailImg = $('<img>').attr('src', event.eventImage)
                    .addClass('img-fluid')
                    .attr('alt', event.eventName);

                thumbnailLink.append(thumbnailImg);
                thumbnailDiv.append(thumbnailLink);
                colDiv.append(thumbnailDiv);

                colDiv.hide().appendTo(thumbnailsContainer).fadeIn('slow');

                createGalleryModal(event);
            }
        });
    }

    /**
     * Function to create modal for each event.
     * @param event
     */
    function createGalleryModal(event) {
        const modalId = 'lightboxModal' + event.eventId;
        const modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        modal.id = modalId;
        modal.tabIndex = '-1';
        modal.role = 'dialog';
        modal.setAttribute('aria-labelledby', 'lightboxModalLabel' + event.eventId);
        modal.setAttribute('aria-hidden', 'true');

        const modalDialog = document.createElement('div');
        modalDialog.classList.add('modal-dialog', 'modal-dialog-centered', 'modal-lg');
        modalDialog.role = 'document';

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        // Modal Header
        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');
        const modalTitle = document.createElement('h5');
        modalTitle.classList.add('modal-title');
        modalTitle.textContent = event.eventName;
        modalHeader.appendChild(modalTitle);
        modalContent.appendChild(modalHeader);

        // Modal Body
        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');
        const eventDate = document.createElement('p');
        eventDate.textContent = 'Date: ' + formatDate(event.eventDate);
        modalBody.appendChild(eventDate);
        const modalImage = document.createElement('img');
        modalImage.src = event.eventImage;
        modalImage.classList.add('img-fluid');
        modalImage.alt = 'Large Image';
        modalBody.appendChild(modalImage);

        modalContent.appendChild(modalBody);

        // Modal Footer
        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.classList.add('btn', 'btn-secondary');
        closeButton.setAttribute('data-bs-dismiss', 'modal');
        closeButton.textContent = 'Close';
        modalFooter.appendChild(closeButton);
        modalContent.appendChild(modalFooter);

        modalDialog.appendChild(modalContent);
        modal.appendChild(modalDialog);

        // Append the modal to the modal container
        const modalContainer = document.getElementById('modalContainer');
        modalContainer.appendChild(modal);
    }
    //endregion

    //region Login Page Functions
    /**
     * Initializes and manages the login page functionality.
     * This function sets up event listeners for the login form, validates user input,
     * and handles the login process by checking against a list of registered users.
     * It displays messages for successful registration, input errors, or invalid credentials.
     */
    function DisplayLoginPage() {
        console.log("Called DisplayLoginPage...");

        let userNameField = $("#userName");
        let passwordField = $("#password");

        // Display a success message if coming from a successful registration
        if(sessionStorage.getItem("registered")) {
            $("#messageArea").addClass("alert alert-success").text("Registration successful!").show();
            sessionStorage.removeItem("registered");
        } else {
            $("#messageArea").hide();
        }

        // Login Button Click
        $("#loginButton").on("click", function () {

            let validInputs = false;

            // Reset fields and remove any messages initially
            $("#messageArea").hide();
            RemoveInvalidField(userNameField)
            RemoveInvalidField(passwordField);

            // Validate input fields
            if (ValidateField(userNameField) && ValidateField(passwordField)) {
                validInputs = true

            } else {

                // Display errors for invalid inputs
                if(!ValidateField(userNameField, null)) {
                    SetInvalidField(userNameField, "Please enter your username.");
                }
                if(!ValidateField(passwordField, null)) {
                    SetInvalidField(passwordField, "Please enter your password.");
                }
            }
            // Proceed if inputs are valid
            if (validInputs) {

                let success = false;
                let newUser = new HarmonyHub.User();

                // Attempt to find the user in the registered users list
                $.get("./data/users.json", function(data) {

                    for (const user of data.users) {

                        if (userName.value === user.userName && password.value === user.password) {

                            newUser.fromJSON(user);
                            success = true;
                            break;
                        }
                    }
                    // If credentials are valid, log the user in and redirect
                    if (success) {
                        sessionStorage.setItem("user", newUser.serialize());
                        location.href = "index.html";
                    } else {
                        // Reset form and display error message if credentials are invalid
                        $("#loginForm")[0].reset();
                        $("#messageArea").addClass("alert alert-danger")
                            .text("Invalid credentials. Please try again.").show();
                    }
                });
            }
        });
    }
    //endregion

    //region Register Page Functions
    /**
     * Initializes and manages the behavior of the Register Page.
     * It sets up the form validation for the registration process and handles the registration button click event.
     * Upon successful form validation, it stores a registration flag in the sessionStorage and redirects the user
     * to the login page.
     */
    function DisplayRegisterPage() {
        console.log("Called DisplayRegisterPage...");

        RegisterFormValidation();

        $("#registerButton").on("click", () => {
            if (CheckSubmissionValidity()) {
                sessionStorage.setItem("registered", "true");
                location.href = "login.html";
            }
        });
    }

    /**
     * Validates the register form input fields on blur and submission events.
     */
    function RegisterFormValidation() {

        let firstNameError = "First name should start with a capital letter and can include hyphens, " +
            "apostrophes, or spaces for compound names.";
        let lastNameError = "Last name should start with a capital letter and can include hyphens, " +
            "apostrophes, or spaces for compound names.";
        let emailAddressError = "Please enter a valid email address in the format: yourname@example.com.";
        let phoneError = "Please enter a valid 10-digit phone number, with or without the country code.";
        let addressError = "Please enter a valid address in the format: street number, street name, and " +
            "optional unit number (e.g., Apt, Suite, Unit). Include only letters, numbers, spaces, hyphens, or periods.";
        let birthdayError = "Please enter a valid birth date in the format: YYYY-MM-DD. The date must be a " +
            "past date.";
        let userNameError = "Username should start with a letter and can include letters, numbers, " +
            "underscores, or hyphens, 3 to 16 characters long.";
        let passwordError = "Password must be at least 8 characters long, including an uppercase letter, a " +
            "lowercase letter, a number, and a special character.";
        let confirmPasswordError = "The password confirmation does not match the password entered.";

        ValidateOnEvent("#firstName", "blur", "#registerButton",
                            /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+)*$/, firstNameError);
        ValidateOnEvent("#lastName", "blur", "#registerButton",
                            /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+)*$/, lastNameError);
        ValidateOnEvent("#emailAddress", "blur", "#registerButton",
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, emailAddressError);
        ValidateOnEvent("#phone", "blur", "#registerButton",
                            /^\+?1?\d{10}$/, phoneError);
        ValidateOnEvent("#address", "blur", "#registerButton",
                            /^\d+\s[\w\s.-]+(?:\s?(Apt|Suite|Unit)\s?\d+)?$/, addressError);
        ValidateDateOnEvent("#birthday", "blur", "#registerButton", birthdayError);
        ValidateOnEvent("#userName", "blur", "#registerButton",
                            /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/, userNameError);
        ValidateOnEvent("#password", "blur", "#registerButton",
                            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, passwordError);
        ConfirmPwOnEvent("#password", "blur", "#registerButton",
                    "#confirmPassword", confirmPasswordError);
    }
    //endregion

    //region Careers Page Functions
    /**
     * Called when the Careers page is displayed.
     */
    function DisplayCareersPage() {
        console.log("Called DisplayCareersPage...");
    }
    //endregion

    //region Start Function
    /**
     * Called when the website is launched to create the header and footer to display on the page. A switch statement
     * is used to detect which page has been loaded based on the Document Title.
     */
    function Start(){

        console.log("App Started");

        // Generate the header and footer
        LoadHeader();
        LoaderFooter();

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
            case `${titlePrefix}Events`:
                DisplayEventsPage();
                break;
            case `${titlePrefix}Gallery`:
                DisplayGalleryPage();
                break;
            case `${titlePrefix}Login`:
                DisplayLoginPage();
                break;
            case `${titlePrefix}Register`:
                DisplayRegisterPage();
                break;
            case `${titlePrefix}Careers`:
                DisplayCareersPage();
                break;
        }
    }
    //endregion

    window.addEventListener("load", Start);

})();

