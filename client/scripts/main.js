$( function() {

    var $body = $('body');
    var $current_location = $('#current-location');
    var $address = $('#address');
    var $check_weather = $('#check-weather');

    $current_location.click( function() {

        $current_location.addClass('loading');
        $address.val('');

        navigator.geolocation.getCurrentPosition( function(position) {

            $.ajax({
                url: '/geocode/coordinates',
                data: position.coords,

            }).then( function(data) {
                $address.val(data.address);

            }).always( function() {
                $current_location.removeClass('loading');
            });
        });
    });

    if (!$address.val()) {
        $current_location.click();
    }

    $check_weather.click( function() {
        $body.addClass('loading');
        $check_weather.addClass('loading');
        $check_weather.text('Loading...');
        window.location = '/weather/' + $address.val();
    });

    $address.keydown( function(event) {
        if (event.keyCode === 13) {
            $check_weather.click();
        }
    });

    $('.more-details').click( function() {
        var day_of_week = $(this).data('day-of-week');
        window.location = '/weather/' + $address.val() + '/' + day_of_week;
    });
});
