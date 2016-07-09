function search(dataQ,mount,template,templateSource) {
    q = dataQ;

    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet,id',
            q: q,
            maxResults: djTube.limitSearchResult,
            type: 'video',
            key: djTube.apikey,
            pageToken: djTube.pageTk
        },
        function(data) {

          djTube.pageTk=data.nextPageToken;
          $("html, body").animate({ scrollTop: $(document).height() }, 1000);

          console.log(data.items);
            for (var i = 0; i < data.items.length; i++) {
                var url1 = "https://www.googleapis.com/youtube/v3/videos?id=" + data.items[i].id.videoId + (mount!=undefined?'&start-index='+djTube.startSearchResult:'') + "&key=AIzaSyDYwPzLevXauI-kTSVXTLroLyHEONuF9Rw&part=contentDetails";
                
                if (data.items.length > 0) {
                    /*Scroll bottom*/
                    $('.start-page').hide();
                    $('.application').show();
                    setTimeout( function() {
                        $('#search-result .under-content').append(template(data)).find('.content-load-more').remove();
                        if(data.items.length===i){
                          $('#search-result .under-content').append('<div class="content-load-more"><div class="clearfix"></div><div class="text-center"><span class="load-more">Load More</span></div></div>')
                        }
                      djTube.loader(false);
                      djTube.buttonLoader(false);         
                    },1000);
                }
            }
        });
}

function convert_time(duration) {
    var a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
        a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    var h = Math.floor(duration / 3600);
    var m = Math.floor(duration % 3600 / 60);
    var s = Math.floor(duration % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}

function getResults(item) {
    var videoID = item.id;
    console.log(videoID);
    var title = item.snippet.title;
    var thumb = item.snippet.thumbnails.high.url;
    var duration = convert_time(item.contentDetails.duration);
    var channelTitle = item.snippet.channelTitle;

    var output = '<li>' +
        '<div class="list-left">' +
        '<img src="' + thumb + '">' +
        '</div>' +
        '<div class="list-right">' +
        '<h3><a href="http://youtube.com/embed/' + videoID + '?rel=0">' + title + '</a></h3>' +
        '<p class="cTitle">' + channelTitle + '  --->' + duration + '</p>' +
        '</div>' +
        '</li>' +
        '<div class="clearfix"></div>' +
        '';

    return output;
}