var setup_dependencies = require('../../setup-dependencies');
var sinon = require('sinon');
var expect = require('chai').expect;

var moment = require('moment');

// jshint expr:true

describe('The weather model', function() {

    var dependencies;
    var WeatherModel;
    var weather_data;

    beforeEach( function() {

        dependencies = setup_dependencies();

        dependencies.declare({
            config_forecastio_mock: {
                module: function() {
                    return {
                        temperature_symbol: 'temperature_symbol',
                    };
                },
            },
            icon_service_mock: {
                module: function() {
                    return {
                        get_summary: sinon.stub().returnsArg(0),
                        get_wind_speed: sinon.stub().returnsArg(0),
                        get_wind_direction: sinon.stub().returnsArg(0),
                        get_moon: sinon.stub().returnsArg(0),
                    };
                },
            },
        });

        dependencies.mock('WeatherModel', [ 'config_forecastio_mock', 'moment', 'icon_service_mock' ]);

        weather_data = {
            daily: {
                data: [
                    {
                        time: moment('Friday 13th November 2015', 'dddd Do MMMM yyyy').format('X'),
                        summary: 'daily_summary',
                        icon: 'daily_icon',
                        temperatureMin: 3.141592,
                        temperatureMax: 41.5,
                        precipProbability: 2 / 3,
                        precipType: 'precip_type',
                        windSpeed: 'wind_speed',
                        windBearing: 'wind_direction',
                        moonPhase: 'moon',
                    },
                ],
            },
            hourly: {
                data: [
                    {
                        time: moment('4:20 pm', 'h:mm a').format('X'),
                        temperature: 12.3,
                        summary: 'hourly_summary',
                        icon: 'hourly_icon',
                    },
                ],
            },
        };

        WeatherModel = dependencies.inject('WeatherModel');
    });

    it('correctly constructs the daily weather', function() {

        var weather_model = new WeatherModel(weather_data);

        expect( weather_model.get_daily_weather() ).to.deep.equal([
            {
                day_of_week: 'friday',
                time: 'Friday 13th November',
                summary: 'daily_summary',
                summary_icon: 'daily_icon',
                temperature_min: 3,
                temperature_max: 42,
                temperature_symbol: 'temperature_symbol',
                precipitation_chance: 67,
                precipitation_type: 'precip_type',
                wind_speed_icon: 'wind_speed',
                wind_direction_icon: 'wind_direction',
                moon_icon: 'moon',
            },
        ]);
    });

    it('defaults the precipitation type to "rain"', function() {

        delete weather_data.daily.data[0].precipType;

        var weather_model = new WeatherModel(weather_data);

        expect( weather_model.get_daily_weather()[0].precipitation_type ).to.equal('rain');
    });

    it('identifies today', function() {

        weather_data.daily.data[0].time = moment().format('X');

        var weather_model = new WeatherModel(weather_data);

        expect( weather_model.get_daily_weather()[0].day_of_week ).to.equal('today');
        expect( weather_model.get_daily_weather()[0].time ).to.equal('Today');
    });

    it('correctly constructs the hourly weather', function() {

        var weather_model = new WeatherModel(weather_data);

        expect( weather_model.get_hourly_weather() ).to.deep.equal([
            {
                time: '4 pm',
                temperature: 12,
                summary: 'hourly_summary',
                summary_icon: 'hourly_icon',
                temperature_symbol: 'temperature_symbol',
            },
        ]);
    });

    afterEach( function() {
        dependencies.unmock('WeatherModel');
    });
});
