/**
    @module
*/
module.exports = function(config, _) {

    /**
        A model of a location returned from the geocoding service.
        @class
    */
    function LocationModel(location) {

        var instance = this;

        /**
            Returns a human-readable address for the location. Detailed address components such as streets and house
            numbers are ommitted.
            @returns {string} Human readable address.
        */
        LocationModel.prototype.get_city = function() {

            return location.address_components.filter( function(component) {
                return _.intersection(config.irrelevant_address_components, component.types).length === 0;

            }).map( function(component) {
                return component.long_name;

            }).join(' ');
        };

        /**
            @typedef coordinates
            @type {Object}
            @property {number} longitude - The longitude coordinate.
            @property {number} latitude - The latitude coordinate.
        */

        /**
            Returns the latitude and longitude for the location.
            @returns {coordinates} The latitude and longitude of the location
        */
        LocationModel.prototype.get_coordinates = function() {
            return {
                latitude: location.geometry.location.lat,
                longitude: location.geometry.location.lng,
            };
        };

        /**
            @typedef location
            @type {Object}
            @property {string} address - The address of the location
            @property {coordinates} coordinates - The coordinates of the location
        */

        /**
            Returns a JSON serializable object containing all of the current location's available information
            @returns {location}
        */
        LocationModel.prototype.serialize = function() {
            return {
                address: instance.get_city(),
                coordinates: instance.get_coordinates(),
            };
        };
    }

    return LocationModel;
};
