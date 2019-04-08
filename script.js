(function () {

    var nextUrl;

    // no click event here; function is called with either a button or keypress ('Enter') below;

    function submitInput() {
        var userInput= $("input").val();
        // console.log("userInput:" + userInput);
        var artistOrAlbum = $(".album-or-artist").val();
        // console.log("artistOrAlbum:"+ artistOrAlbum);
        var baseUrl = "https://elegant-croissant.glitch.me/spotify";

        $.ajax({
            url: baseUrl,
            // method: "GET",
            data: {
                query: userInput,
                type: artistOrAlbum
            },
            success: function (data) {
                $("#results-container").html('');
                data=data.albums || data.artists;
                // exact the same objects, but one gives artists, one gives albums;
                nextUrl =data.next && data.next.replace('https://api.spotify.com/v1/search',
                    baseUrl);
                console.log(nextUrl);

                var resultsFor ="<h3 id='results-for'>Results for: '<span class='search-term'>"+ userInput +  "'</span></h3>";
                var noResults ="No results for '<span class='search-term'>"+ userInput +  "'</span>";
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


                        $.ajax({
                            url: nextUrl,
                            // method: "GET",
                            // data: {
                            //     query: userInput,
                            //     type: artistOrAlbum
                            // },
                            success: function (data) {

                                $("#results-container").html('');
                                data=data.albums || data.artists;
                                nextUrl =data.next && data.next.replace('https://api.spotify.com/v1/search',
                                    baseUrl);
                                console.log(data.items.length);

                                for (var i=0; i < data.items.length; i++) {

                                    //variables to get more data
                                    var linkToPlay = data.items[i].external_urls.spotify;
                                    if (data.items[i].images.length >0) {
                                        var linkToImage = data.items[i].images[0].url;
                                    } else {
                                        linkToImage = '/default.png';
                                    }
                                    var artistsName = data.items[i].name;

                                    html += `<a href='${linkToPlay}' target='blank'><img class='image' src='${linkToImage}'>
                                    </a><div class='artist-name'><a class='link-to-result' href='${linkToPlay}' target='blank'><p>${artistsName}</p></a>`;

                                }


                                $("#results-container").append(html);
                                if(data.total >currentResults.length) {
                                    $("#results-container").append(moreButton);
                                }
                            }
                        });
                    });
                }
            }
        });

    } //end of submit click//ajax call

    // when user clicks on more button it should use nextUrl
    // second ajax we dont need
    // data: {
    //     query: userInput,
    //     type: artistOrAlbum

    // if next has no values, that shouldnot be ore button?

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

//

//data.total counts how many results we can get;




})();
