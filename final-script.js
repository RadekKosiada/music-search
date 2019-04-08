(function () {

    var nextUrl;
    var baseUrl = "https://elegant-croissant.glitch.me/spotify";
    var infiniteScroll = location.search.indexOf('?scroll=infinite')>-1;
    var moreButton = "<button id='more-results'>Load more results</button>";
    // console.log(infiniteScroll);

    //call the function to check if the user scrolled;

    // no click event here; function is called with either a button or keypress ('Enter') below;

    function submitInput() {
        var userInput= $("input").val();
        // console.log("userInput:" + userInput);
        var artistOrAlbum = $(".album-or-artist").val();
        // console.log("artistOrAlbum:"+ artistOrAlbum);


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
                console.log("DATA", data);

                var resultsFor ="<h3 id='results-for'>Results for: '<span class='search-term'>"+ userInput +  "'</span></h3>";
                var noResults ="No results for '<span class='search-term'>"+ userInput +  "'</span>";
                var html ="";

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
                    // if(data.total >currentResults.length) {
                    //     $("#results-container").append(moreButton);
                    // }


                    if(data.total >currentResults.length) {
                        if (infiniteScroll) {
                            console.log("scroll=infinite yeah!");
                            //call the function to check if the user scrolled; apart of the cilck handler; in the highest scope;
                            //and if the condition is true; call more data;
                            checkScrollPostion();
                        } else {
                            $("#results-container").append(moreButton);
                        }
                    }

                    //

                }
            }
        });

    } //end of submit click//ajax call


    $(document).on('click', '#more-results', function (e) {
        console.log('loading more!');
        callMoreData();
        $(e.target).remove();

    });

    function callMoreData() {
        $.ajax({
            url: nextUrl,
            // method: "GET",
            // data: {
            //     query: userInput,
            //     type: artistOrAlbum
            // },
            success: function (data) {
                var html ="";
                // $("#results-container").html('');
                data=data.albums || data.artists;
                nextUrl =data.next && data.next.replace('https://api.spotify.com/v1/search',
                    baseUrl);
                console.log("DATA", data, data.items.length);

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
                // if(data.total >currentResults.length) {
                //     $("#results-container").append(moreButton);

                if(data.next) {
                    if (infiniteScroll) {
                        console.log("scroll=infinite yeah!");
                        //call the function to check if the user scrolled; apart of the cilck handler; in the highest scope;
                        //and if the condition is true; call more data;
                        checkScrollPostion();
                    } else {
                        $("#results-container").append(moreButton);
                    }
                }

                // }
            }
        });
    }
    // var hasReachedBottom = $(document).scrollTop() +$(window).height() >= $(document).height();
    // 1372 + 579 >= 1951
    console.log('scrollTop:' , $(document).scrollTop());
    console.log('doc height:', $(document).height());
    console.log('window height:', $(window).height());

    function checkScrollPostion() {
        console.log('checkScrollPostion fired');

        var hasReachedBottom = $(document).scrollTop() +$(window).height() >= $(document).height()-100;

        if(hasReachedBottom) {
            console.log("reached bottom:" , hasReachedBottom, $(document).scrollTop() +$(window).height(),$(document).height()-100 );
            callMoreData();
        } else {
            setTimeout(checkScrollPostion, 500);
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

//

//data.total counts how many results we can get;



})();
