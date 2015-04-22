/**
    Provides a number of methods that take weather information and return CSS classes representing that information.
    @module
*/

module.exports = function(config) {

    /**
        Takes in a weather summary code and provides an icon class.
        @arg {string} code - Weather summary code
        @returns {string} Icon class
    */
    function get_summary(code) {
        return config.summary_icons[code];
    }

    /**
        Takes in a wind speed measurement, and provides an icon class.
        @arg {number} wind_speed - Wind speed, measured in ms<sup>-1</sup>
        @returns {string} Icon class, referring to a Beaufort Scale measurement
    */
    function get_wind_speed(wind_speed) {

        var beaufort_scale = Math.pow(wind_speed / config.beaufort_constant, 2 / 3);
        beaufort_scale = Math.min(config.wind_speed_max, Math.floor(beaufort_scale));

        return config.wind_speed_icon.replace(/%d/, beaufort_scale);
    }

    /**
        Takes in a wind bearing, and provides an icon class.
        @arg {number} wind_bearing - Wind bearing, measured in degrees from North
        @returns {string} Icon class
    */
    function get_wind_direction(wind_bearing) {

        var granularity = 360 / config.wind_direction_num;
        var bearing = Math.floor(wind_bearing / granularity + 0.5) * granularity;
        bearing %= 360;

        return config.wind_direction_icon.replace(/%d/, bearing);
    }

    /**
        Takes in the proportion of the moon's phase that is complete, and provides an icon class.
        @arg {number} moon_phase - A number between 0 (inclusive) and 1 (exclusive)
        @returns {string} Icon class
    */
    function get_moon(moon_phase) {

        var phase_num = Math.floor(moon_phase * config.moon_phase_num + 0.5) % config.moon_phase_num;
        var phases_per_quarter = Math.floor(config.moon_phase_num / 4);
        var phase_num_mod = phase_num % phases_per_quarter;

        var phase_text;
        if (phase_num_mod === 0) {
            phase_text = config.moon_perfect_phases[ Math.floor(phase_num / phases_per_quarter + 0.5) ];
        } else {
            phase_text = config.moon_intermediate_phases[ Math.floor(phase_num / phases_per_quarter) ];
        }

        return config.moon_icon.replace(/%s/, phase_text).replace(/%d/, phase_num_mod);
    }

    return {
        get_summary: get_summary,
        get_wind_speed: get_wind_speed,
        get_wind_direction: get_wind_direction,
        get_moon: get_moon,
    };
};
