"use strict";

// IIFE - Immediately Invoked Functional Expression
(function (){

    function CheckLogin() {
        if (sessionStorage.getItem("user")) {
            $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-undo"></i> Logout</a>`)
        }

        $("#logout").on("click", function () {
           sessionStorage.clear();
           location.href = "index.html";
        });
    }

    function LoadHeader(htmlData) {
        $("header").html(htmlData);
        $(`li>a:contains(${document.title})`).addClass("active").attr("aria-current", "page");
        CheckLogin();
    }

    function AjaxRequest(method, url, callback) {

        let xhr = new XMLHttpRequest();

        xhr.open(method, url);

        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (typeof callback == "function") {
                    callback(xhr.responseText);
                } else {
                    console.error("ERROR: Callback not a function");
                }
            }
        });

        xhr.send();
    }

    /**
     * Validates the input fields for the Contact page and Edit page.
     */
    function ContactFormValidation() {

        // Full Name
        ValidateField("#fullName",
            /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/,
            "Please enter a valid first name and last name.");

        // Contact Number
        ValidateField("#contactNumber",
            /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/,
            "Please enter a valid phone number.");

        // Email Address
        ValidateField("#emailAddress",
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/,
            "Please enter a valid email address.")
    }

    /**
     * Validates the input field for a form.
     * @param inputFieldId The ID of the input field.
     * @param regularExpression The regular expression that the input field must match.
     * @param errorMessage The message to be thrown upon invalid entry.
     */
    function ValidateField(inputFieldId, regularExpression, errorMessage) {
        let messageArea = $("#messageArea").hide();

        $(inputFieldId).on("blur", function () {
            let inputFieldText = $(this).val();

            if (!regularExpression.test(inputFieldText)) {
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(errorMessage).show();
            } else {
                messageArea.removeClass("class").hide();
            }
        });
    }

    function AddContact(fullName, contactNumber, emailAddress) {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            let key = contact.fullName.substring(0,1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }

    function DisplayHomePage(){
        console.log("Called DisplayHomePage...");

        $("#AboutUsBtn").on("click", () => {
            location.href = "about.html";
        });

        $("main").append(`<p id="MainParagraph" class="mt-3">This is my first paragraph</p>`);

        $("body").append(`<article class="container">
                          <p id="ArticleParagraph" class="mt-3">This is my article paragraph</p></article>`)

    }

    function DisplayProductPage(){
        console.log("Called DisplayProductPage...");
    }

    function DisplayServicePage(){
        console.log("Called DisplayServicePage...");
    }

    function DisplayAboutPage(){
        console.log("Called DisplayAboutPage...");
    }

    function DisplayContactPage(){
        console.log("Called DisplayContactPage...");

        ContactFormValidation();

        let sendButton = document.getElementById("sendButton");
        let subscribeCheck = document.getElementById("subscribeCheck");

        sendButton.addEventListener("click", function() {

            if (subscribeCheck.checked) {
                AddContact(fullName.value, contactNumber.value, emailAddress.value);
            }
        });
    }

    function DisplayContactListPage(){
        console.log("Called DisplayContactListPage...");

        if(localStorage.length > 0) {

            let contactList = document.getElementById("contactList");
            let data = "";
            let index = 1;
            let keys = Object.keys(localStorage);

            for(const key of keys) {
                let contact = new core.Contact();
                let contactData = localStorage.getItem(key);
                contact.deserialize(contactData);
                data += `<tr><th scope="row" class="text-center">${index}</th>
                            <td>${contact.fullName}</td>
                            <td>${contact.contactNumber}</td>
                            <td>${contact.emailAddress}</td>
                            <td>
                                <button value="${key}" class="btn btn-primary btn-sm edit">
                                    <i class="fas fa-edit fa-sm"></i> Edit
                                </button>
                            </td>
                            <td>
                                <button value="${key}" class="btn btn-danger btn-sm delete">
                                    <i class="fas fa-trash-alt fa-sm"></i> Delete
                                </button>
                            </td>
                         </tr>`;
                index++;
            }
            contactList.innerHTML = data;
        }

        $("#addButton").on("click", () => {
            location.href = "edit.html#add";
        });

        $("button.edit").on("click", function () {
            location.href = "edit.html#" + $(this).val();
        });

        $("button.delete").on("click", function () {

            if (confirm("Confirm contact delete?")){
                localStorage.removeItem($(this).val());
            }
            location.href = "contact-list.html";
        });

    }

    function DisplayEditPage() {
        console.log("Called DisplayEditPage...")

        ContactFormValidation();

        let page = location.hash.substring(1);
        switch (page) {
            case "add":

                $("main>h1").text("Add Contact");
                $("#editButton").html(`<i class="fa fa-plus fa-sm"></i> Add`);
                $("#editButton").on("click", (event) => {
                    event.preventDefault();
                    AddContact(fullName.value, contactNumber.value, emailAddress.value);
                    location.href = "contact-list.html";
                });

                $("#cancelButton").on("click", () => {
                   location.href = "contact-list.html";
                });

                break;
            default:

                let contact = new core.Contact();
                contact.deserialize(localStorage.getItem(page))
                $("#fullName").val(contact.fullName);
                $("#contactNumber").val(contact.contactNumber);
                $("#emailAddress").val(contact.emailAddress);

                $("#editButton").on("click", () => {

                    event.preventDefault();
                    contact.fullName = $("#fullName").val();
                    contact.contactNumber = $("#contactNumber").val();
                    contact.emailAddress = $("#emailAddress").val();

                    localStorage.setItem(page, contact.serialize());
                    location.href = "contact-list.html";
                });

                $("#cancelButton").on("click", () => {
                    location.href = "contact-list.html";
                });
                break;
        }
    }

    function DisplayLoginPage() {
        console.log("Called DisplayLoginPage...");

        let messageArea = $("#messageArea");

        $("#loginButton").on("click", function () {

            let success = false;
            let newUser = new core.User();

            $.get("./data/users.json", function(data) {
                for(const user of data.users) {
                    console.log(user);
                    if (userName.value === user.Username && password.value === user.Password) {
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }
                if(success) {
                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.removeAttr("class").hide();
                    location.href = "contact-list.html";
                } else {
                    $("#userName").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("Error: Invalid Credentials").show();
                }
            });
        });
        $("#cancelButton").on("click", function () {
            document.forms[0].reset();
            location.href = "index.html";
        })
    }

    function DisplayRegisterPage() {
        console.log("Called DisplayRegisterPage...");
    }

    function Start(){
        console.log("App Started...");

        AjaxRequest("GET", "header.html", LoadHeader);

        switch(document.title) {
            case "Home":
                DisplayHomePage();
                break;
            case "Products":
                DisplayProductPage();
                break;
            case "Services":
                DisplayServicePage();
                break;
            case "About Us":
                DisplayAboutPage();
                break;
            case "Contact Us":
                DisplayContactPage();
                break;
            case "Contact List":
                DisplayContactListPage();
                break;
            case "Edit Contact":
                DisplayEditPage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Register":
                DisplayRegisterPage();
                break;

        }

    }

    window.addEventListener("load", Start);

})()
