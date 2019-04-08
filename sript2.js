//to be worked on!!

(function () {

    var nextUrl;
    var artistOrAlbum = $(".album-or-artist").val();
    // console.log("artistOrAlbum:"+ artistOrAlbum);
    var baseUrl = "https://elegant-croissant.glitch.me/spotify";

    // no click event here; function is called with either a button or keypress ('Enter') below;

    function submitInput() {
        var userInput= $("input").val();
        // console.log("userInput:" + userInput);


        $.ajax({
            url: baseUrl,
            // method: "GET",
            data: {
                query: userInput,
                type: artistOrAlbum
            },
            success: function (data) {
                loadData(data);

                $.ajax({
                    url: nextUrl,

                    success: function (data) {
                        loadData(data);
                    }
                });
            } //end of first success data;
        });
    } //end of submit click//ajax call

    function loadData(data) {
        $("#results-container").html('');
        data=data.albums || data.artists;
        // exact the same objects, but one gives artists, one gives albums;
        nextUrl =data.next && data.next.replace('https://api.spotify.com/v1/search',
            baseUrl);
        console.log(nextUrl);


        var html ="";
        var moreButton = "<button id='more-results'>Load more results</button>";


        for (var i=0; data.items.length >i; i++) {

            //variables to get data
            var linkToPlay = data.items[i].external_urls.spotify;
            if (data.items[i].images.length >0) {
                var linkToImage = data.items[i].images[0].url;
            } else {
                linkToImage = '/default.png';
            }
            var artistsName = data.items[i].name;

            html += `<a href='${linkToPlay}' target='blank'><img class='image' src='${linkToImage}'>
            </a><div class='artist-name'><a class='link-to-result' href='${linkToPlay}' target='blank'><p>${artistsName}</p></a>`;

            // console.log('url', data.items[i].external_urls.spotify);
            // console.log('artist', data.items[i].images);
        }

        var resultsFor ="<h3 id='results-for'>Results for: '<span class='search-term'>"+ userInput +  "'</span></h3>";
        var noResults ="No results for '<span class='search-term'>"+ userInput +  "'</span>";

        try {
            (data.items[i].name == null);
        }
        catch (e) {
            $("#no-results").append(noResults);
        }
        if (html){
            $("#no-results").html('');
            $("#results-container").append(resultsFor);
            $("#results-container").append(html);

            var currentResults = $("#results-container");

            console.log(data.total);
            if(data.total >currentResults.length) {
                $("#results-container").append(moreButton);
            }

            $(document).on('click', '#more-results', function() {
                console.log('want more!');
            }

            );
        }
    }

    //Calling ajax call with ENTER
    $("#input").on("keypress", function (e) {
        if (e.which ==13) {
            console.log('enter fired');
            submitInput();
        }
    });
    //Calling ajax call with SUBMIT BUTTON
    $("#submit-button").on("click", function() {
        submitInput();
    });

})();
