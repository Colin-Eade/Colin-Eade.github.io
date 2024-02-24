"use strict";

(function (HarmonyHub) {

    /**
     * Represents a registered Harmony Hub user.
     */
    class User {

        //region Constructors
        /**
         * Constructs an instance of the User class.
         *
         * @param firstName User's first name.
         * @param lastName User's last name.
         * @param emailAddress User's email address.
         * @param phone User's phone number.
         * @param address User's physical address.
         * @param birthday User's birthday.
         * @param userName User's username.
         * @param password User's password.
         */
        constructor(firstName = "", lastName = "", emailAddress = "", phone = "",
                    address = "", birthday = "", userName = "", password = "") {
            this._firstName = firstName;
            this._lastName = lastName;
            this._emailAddress = emailAddress;
            this._phone = phone;
            this._address = address;
            this._birthday = birthday;
            this._userName = userName;
            this._password = password;
        }
        //endregion

        //region Setters and Getters
        /** Gets the first name of the user. */
        get firstName() {
            return this._firstName;
        }

        /** Sets the first name of the user. */
        set firstName(value) {
            this._firstName = value;
        }

        /** Gets the last name of the user. */
        get lastName() {
            return this._lastName;
        }

        /** Sets the last name of the user. */
        set lastName(value) {
            this._lastName = value;
        }

        /** Gets the email address of the user. */
        get emailAddress() {
            return this._emailAddress;
        }

        /** Sets the email address of the user. */
        set emailAddress(value) {
            this._emailAddress = value;
        }

        /** Gets the phone number of the user. */
        get phone() {
            return this._phone;
        }

        /** Sets the phone number of the user. */
        set phone(value) {
            this._phone = value;
        }

        /** Gets the physical address of the user. */
        get address() {
            return this._address;
        }

        /** Sets the physical address of the user. */
        set address(value) {
            this._address = value;
        }

        /** Gets the birthday of the user. */
        get birthday() {
            return this._birthday;
        }

        /** Sets the birthday of the user. */
        set birthday(value) {
            this._birthday = value;
        }

        /** Gets the username of the user. */
        get userName() {
            return this._userName;
        }

        /** Sets the username of the user. */
        set userName(value) {
            this._userName = value;
        }

        /** Gets the password of the user. */
        get password() {
            return this._password;
        }

        /** Sets the password of the user. */
        set password(value) {
            this._password = value;
        }
        //endregion

        //region Class Functions
        /**
         * Returns a string representation of the User object.
         */
        toString() {
            return `First Name: ${this._firstName}\n` +
                `Last Name: ${this._lastName}\n` +
                `Email Address: ${this._emailAddress}\n` +
                `Phone: ${this._phone}\n` +
                `Address: ${this._address}\n` +
                `Birthday: ${this._birthday}\n` +
                `Username: ${this._userName}\n` +
                `Password: ${this._password}`;
        }

        /**
         * Serializes the User object into a string.
         * @returns {string|null} A comma-separated string of user properties or null if any are invalid.
         */
        serialize() {
            if (this._firstName !== "" && this._lastName !== "" && this._userName !== "" && this._emailAddress !== "") {
                return `${this._firstName},${this._lastName},${this._userName},${this._emailAddress}`;
            }
            console.error("One or more properties of the User are empty or invalid");
            return null;
        }

        /**
         * Deserializes a string into the User object's properties.
         * @param data A comma-separated string of user properties.
         */
        deserialize(data) {
            let propertyArray = data.split(",");
            this._firstName = propertyArray[0];
            this._lastName = propertyArray[1];
            this._userName = propertyArray[2];
            this._emailAddress = propertyArray[3];
        }

        /**
         * Converts the User object into a JSON object.
         * @returns {Object} JSON representation of the user.
         */
        toJSON() {
            return {
                firstName : this._firstName,
                lastName : this._lastName,
                emailAddress : this._emailAddress,
                phone : this._phone,
                address : this._address,
                birthday : this._birthday,
                userName : this._userName,
                password : this._password
            }
        }

        /**
         * Initializes the User object's properties from a JSON object.
         * @param data JSON object containing user properties.
         */
        fromJSON(data) {
            this._firstName = data.firstName;
            this._lastName = data.lastName;
            this._emailAddress = data.emailAddress;
            this._phone = data.phone;
            this._address = data.address;
            this._birthday = data.birthday;
            this._userName = data.userName;
            this._password = data.password;
        }
        //endregion
    }
    HarmonyHub.User = User;

})(HarmonyHub || (HarmonyHub = {}) );
