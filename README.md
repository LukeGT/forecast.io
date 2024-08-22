# Forecast.io frontend

[forecast.io](http://forecast.io) is a leading weather API provider delivering detailed forecast information aggregated from around the globe.  This is a simple frontend to that API which I've created to demonstrate my development ability, in particular with Node.JS

# Running the project

Before continuing, make sure you install all necessary dependencies.

    npm install

You can start the project in the normal way. 

    npm start

You can run tests in the normal way. 

    npm run test

You can run linting and style checking like so.

    npm run lint
    npm run style

You can compile the docs by running the generator. They will then be accessible at `./out/index.html`.

    npm run generate-docs

# The HTML Interface

> *Note*: The HTML interface has a few rough edges, as a result of being an aside in this project. 

Visit [http://localhost:4943/](http://localhost:4943/) in your browser to begin. Your browser may ask for permission to identify your current location. Allowing this will auto-populate the form with your current rough address. 

Click "Check the weather" to see the week's weather forecast for the location that you entered. A descriptive summary of the day's weather is written below the date of each tile. A number of other factors are displayed below this:

-   **Outlook**: An icon depicting the weather for the day
-   **Temperature**: The minimum and maxmimum temperature for the day
-   **Chance of rain**: The percentage chance of precipitation for that day
-   **Wind speed**: The wind speed for that day
-   **Wind direction**: The direction of the wind for that day
-   **Moon phase**: An icon depicting the phase of the moon for that night

For a more detailed forecast on a particular day, click the "More Details" button on the tile. The detailed view for a day will display the same summary tile as on the week view, in addition to the temperature and outlook on an hourly basis throughout the day. 

# The JSON Interface

> *Note*: In order to use the JSON interface, the `Accept` header must contain `application/json`, and must not contain `text/html` (as it takes precedence).

> *Note*: The links below only work if you are viewing this page within the generated documentation

## Weather

- [`GET /weather/:address`](module-routes_forecastio-routes.html#~at_address)
- [`GET /weather/:address/today`](module-routes_forecastio-routes.html#~at_address_today)
- [`GET /weather/:address/:weekday`](module-routes_forecastio-routes.html#~at_address_weekday)

## Geocode

- [`GET /geocode/address?q`](module-routes_geocode-routes.html#~from_address)
- [`GET /geocode/coordinates?longitude&latitude`](module-routes_geocode-routes.html#~from_coordinates)

# Implementation Notes

## Dependency Injection

Dependency injection is used throughout the project as opposed to node's native `require`. The reason for this is to allow my modules to be more reusable, to make testing easier due to the ability to mock dependencies, and to make the application more configurable. 

In the real world I would use something off the shelf, but instead for this project I have written my own minimal dependency injection library. The reason for this is to demonstrate a couple of things:

- I understand dependency injection to the point where I can implement it
- If required, I can write succinct, effective and reusable libraries for development use

## Promises

I much prefer the use of promises to that of callbacks, and as a result I have used them extensively in this project. I believe that they allow far more flexibility and expressivity than that of callbacks, and avoid the "pyramid of doom" where many callbacks become nested within one another. They also allow for much better error handling, allowing for a try/catch/finally approach that works reliably across asynchronous operations. 

# License

> Copyright (c) 2015(s), Luke Tsekouras

> Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

> THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
