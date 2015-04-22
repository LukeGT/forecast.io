/**
    @module
*/

module.exports = function(config, moment, icon_service) {

    /**
        A model of the weather at a particular time, as well as its forecast
        @class
        @arg {object} weather_data - See {@link https://developer.forecast.io/docs/v2} for more information.
    */
    function WeatherModel(weather_data) {

        /**
            Returns the raw weather data retrieved from Forecast.io. See {@link https://developer.forecast.io/docs/v2}
            for more information on its format
            @returns {Object} {@link https://developer.forecast.io/docs/v2}
        */
        WeatherModel.prototype.serialize = function() {
            return weather_data;
        };

        /**
            @typedef day_weather
            @type {Object}
            @property {string} day_of_week - The current day of the week, or 'today'
            @property {string} time - A formatted date for this day
            @property {string} summary - A text summary of the weather for this day
            @property {string} summary_icon - The CSS class of an icon representing this day's weather
            @property {number} temperature_min - The minimum temperature for today
            @property {number} temperature_max - The maximum temperature for toda
            @property {string} temperature_symbol - The symbol to append to each temperature
            @property {number} precipitation_chance - The percentage chance of precipitation
            @property {string} precipitation_type - The type of precipitation predicted
            @property {string} wind_speed_icon - The CSS class of an icon representing the wind speed
            @property {string} wind_direction_icon - The CSS class of an icon representing the wind direction
            @property {string} moon_icon - The CSS class of an icon representing the current moon phase
        */

        /**
            Retrieves the summarised weather information for each relevant day
            @returns {day_weather[]}
        */
        WeatherModel.prototype.get_daily_weather = function() {

            return weather_data.daily.data.map( function(daily_data) {

                var time = moment(daily_data.time * 1000);
                var time_formatted = time.format('dddd Do MMMM');
                var today_formatted = moment().format('dddd Do MMMM');
                var day_of_week = time.format('dddd').toLowerCase();
                var is_today = today_formatted === time_formatted;

                return {
                    day_of_week: is_today ? 'today' : day_of_week,
                    time: is_today ? 'Today' : time_formatted,
                    summary: daily_data.summary,
                    summary_icon: icon_service.get_summary(daily_data.icon),
                    temperature_min: Math.floor(daily_data.temperatureMin + 0.5),
                    temperature_max: Math.floor(daily_data.temperatureMax + 0.5),
                    temperature_symbol: config.temperature_symbol,
                    precipitation_chance: Math.floor( daily_data.precipProbability * 100 + 0.5 ),
                    precipitation_type: daily_data.precipType || 'rain',
                    wind_speed_icon: icon_service.get_wind_speed(daily_data.windSpeed),
                    wind_direction_icon: icon_service.get_wind_direction(daily_data.windBearing),
                    moon_icon: icon_service.get_moon(daily_data.moonPhase),
                };
            });
        };

        /**
            @typedef hour_weather
            @type {Object}
            @property {string} time - The formatted time of this hour
            @property {string} temperature - The temperature of this hour
            @property {string} summary - A brief text summary of the weather at this hour
            @property {string} summary_icon - The CSS class of an icon representing this hour's weather
            @property {string} temperature_symbol - The symbol to append to the temperature
        */

        /**
            Retrieves the summarised weather information for each hour
            @returns {hour_weather[]}
        */
        WeatherModel.prototype.get_hourly_weather = function() {

            return weather_data.hourly.data.map( function(hourly_data) {

                return {
                    time: moment(hourly_data.time * 1000).format('h a'),
                    temperature: Math.floor(hourly_data.temperature),
                    summary: hourly_data.summary,
                    summary_icon: icon_service.get_summary(hourly_data.icon),
                    temperature_symbol: config.temperature_symbol,
                };
            });
        };
    }

    return WeatherModel;
};
