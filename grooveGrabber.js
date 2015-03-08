javascript:(function() {
  var grabSongs = function grabSongs() {

    var identity = function(value){return value};
    var i = 0;
    var allLines = [];
    var intervalId = setInterval(function(){
      if( i < 10){
        dispatchScroll($('#page-wrapper')[0], i*1000);
        var visibleSongs = grabVisibleSongs();
        allLines = allLines.concat(visibleSongs);
      }else {
        clearInterval(intervalId);
        var allSongs = _.uniq(allLines);
        console.warn(allSongs.length + ' songs found');

        var limitedSizePageList = [];
        var size = 0;
        _.each(allSongs, function(item){
          size += item.length;
          if(size < 2000){
            limitedSizePageList.push(item);
          } else {
            var page = limitedSizePageList.join('\n');
            size = item.length;
            limitedSizePageList = [item];
            console.warn('page size', encodeURIComponent(page).length);
            window.open("data:text/plain;charset=utf-8," + encodeURIComponent(page), "");
          }
        });
      }
      i++;
    }, 200);
  };

  var grabVisibleSongs = function grabVisibleSongs(){
    var identity = function(value){return value};
    var rows = $(".collection-grid .module-row.song");
    var currentNode;
    var getChildTexts = function(){ var childTexts= $(currentNode).children().map(function(){return $(this).text();});return childTexts;};
    var lines = _.map(rows.map(function(){ currentNode = this;var songAndArtist = _.map(getChildTexts(),identity).splice(1,2).join(' - ');return songAndArtist; }),identity);
    return lines;
  };

  var dispatchScroll =  function dispatchScroll(target,newScrollTop) {
    target.scrollTop = newScrollTop;
    var e = document.createEvent("UIEvents");
    e.initUIEvent("scroll", true, true, window, 1);
    target.dispatchEvent(e);
  };

  function load() {
    var script = document.createElement("script");
    script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
    script.async = true;
    script.type = "text/javascript";
    script.onload = function() { grabSongs(); };
    document.body.appendChild(script);
  }

  if (!window.jQuery) {
    load();
  } else {
    grabSongs();
  }
})();