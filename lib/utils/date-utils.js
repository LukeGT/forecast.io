/**
    @module
*/

module.exports = function(moment) {

    /**
        @returns {moment} the current time
    */
    function get_today() {
        return moment();
    }

    /**
        @arg {string} weekday - The day of the week
        @returns {moment} The current time forwarded to the next instance of the provided weekday.
    */
    function get_weekday(weekday) {

        var date = moment().day(weekday);

        // Ensure that this date is in the future
        if (moment().diff(date) >= 0) {
            date.add(1, 'weeks');
        }

        return date;
    }

    return {
        get_today: get_today,
        get_weekday: get_weekday,
    };
};
