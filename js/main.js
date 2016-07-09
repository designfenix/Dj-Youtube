var djTube = {
	apikey: 'AIzaSyDYwPzLevXauI-kTSVXTLroLyHEONuF9Rw',
	crossFadeSecond : '60', //seconds
	playlist : {'items':[]}, //array songs
	backgroundContainer : $('#background-container'),
	backgrounds : ['bg-1.jpg','bg-2.jpg','bg-3.jpg','bg-4.jpg','bg-5.jpg','bg-6.jpg','bg-7.jpg','bg-8.jpg','bg-9.jpg','bg-10.jpg','bg-11.jpg'], //array backgrounds
	combinationCode  : [], //combination code dedicated site
	combinationShow  : '100,97,110,105,101,108,97,45,45,102,97,108,108,97,33,33', //combination code dedicated site
	loaderContent : $('#overlay'), //overlay loading site
	desk1: $('#desk-1'), //desk player 1
	desk2: $('#desk-2'), //desk player 2
	limitSearchResult : 20, //limit item result search
	lastSearch : '', //save last search query
	siteTitle: '', //set title on the site
	titlePos: 0, //title position for marquee
	startSearchResult : 20, //start search result for pagination search
	inMixFlag: false, //flag to mix tracks

	init: function(){

		$(".application .playlist,#search-result .under-content").niceScroll();
 		$("html, body").scrollTop( 0 );

		
		/*special actions for holiday's*/
		this.holidayAction();

		/*animated Logo and Search*/
		$('.start-page .logo-b').addClass('fadeIn');
		$('.start-page .search-content').addClass('fadeInUpBig');
		
		/*focus search begin*/
		$('.start-page .search-content').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$('.start-page .search-input').focus();
			$('html').css('overflow','auto');
		});
		/*set youtube players for both desk's*/
		this.desk1.tubeplayer({allowFullScreen:false,autoPlay:false,onPlayerBuffering: function(){clearInterval(djTube.intervalProgressBar);},onPlayerPlaying: function(id){djTube.moveProgressBar();}});
		this.desk2.tubeplayer({allowFullScreen:false,autoPlay:false,onPlayerBuffering: function(){clearInterval(djTube.intervalProgressBar);},onPlayerPlaying: function(id){djTube.moveProgressBar();}});

	},
	combinationDedicated: function(obj){
	    this.combinationCode.push( obj );
	    if ( this.combinationCode.toString().indexOf( this.combinationShow ) >= 0 ){
	        this.notice('pink','Dedicated to Dani Falla, ia tu sabes','Yeeah!')
	        this.combinationCode = [];
	    }
	},
	holidayAction: function(){
		var now = new Date();
		var Christmas = new Date("December 24, 2015");
		var NewYear = new Date("January 01, 2016");

		if(now == Christmas) // today is after Christmas
		{
		     $('#background-container').snowfall({flakeCount : 100, maxSpeed : 10});
		}
		if(now == NewYear) // today is after New Year
		{
		     alert("Happy New Year!");
		}
	},
	setBackground: function(){
		var image = this.backgrounds[Math.floor(Math.random()*11)];
		$('body').css({
			height: $(window).height(),
			width: '100%'
		});
		$('<img/>').attr('src','img/wallpapers/' + image ).on('load',function(){
			$(this).remove();
			djTube.backgroundContainer.css('background-image','url(img/wallpapers/' + image + ')');
			djTube.init();
		})
		$('.container-player .background').css('background-image','url(img/wallpapers/' + image + ')');
	},
	ajaxAutoComplete: function(data) {
		if(data!=""){
			$('.search-form:visible .auto-complete').show();
			$.ajax({
				url: 'http://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q='+data,
				type: 'GET',
			    crossDomain: true,
			    dataType: 'jsonp'
			})
			.done(function(data) {
				var html = "";
				$.each(data[1],function(i,k){
					$.each(data[1][i],function(i2,k2){
						if(i<5){
							if(k2!=0 && k2!=10){
								html += "<div class='item'>"+k2+"</div>";
							}
						}
					});
				});
				$('.search-form:visible .auto-complete').html(html);
			})
		}else{
			$('.search-form:visible .auto-complete').html("").hide();
		};
	},
	setAutoComplete: function (data) {
		$('.search-input:visible').val(data);
	},
	ajaxSearch: function(dataQ,mount){
		var templateSource = $('#application-template').html();
		var template = Handlebars.compile(templateSource);
		$('.application .search-input').val(dataQ)

		search(dataQ,mount,template,templateSource);

		/*SC.initialize({
		  client_id: '4229ff224631d557accb7c8ae1b3bfdd'
		});
		// find all sounds of buskers licensed under 'creative commons share alike'
		SC.get('/tracks', { q: data, license: 'cc-by-sa' }, function(tracks) {
		  $("html, body").animate({ scrollTop: $(document).height() }, 1000);
			console.log(tracks);
			$('.start-page').hide();
			$('.application').show();
			setTimeout( function() {
				if(mount==undefined){
					$('#search-result .under-content').html(template(data[0])+'<div class="content-load-more"><div class="clearfix"></div><div class="text-center"><span class="load-more">Load More</span></div></div>');
					djTube.startSearchResult=20;
				}else{
					$('#search-result .under-content').append(template(data[0]));
					djTube.startSearchResult=$('#search-result .item-search').length+djTube.startSearchResult;
				}
				(mount==undefined?djTube.loader(false):djTube.buttonLoader(false));					
			},1000);
		});*/
	},
	loader: function(show){
		if(show){
			this.loaderContent.addClass('animated fadeIn').show();
		}else{
			this.loaderContent.addClass('animated fadeOut');
			this.loaderContent.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				djTube.loaderContent.removeClass().hide();
			});
		}
	},
	buttonLoader: function(show){
		if(show){
			$('.content-load-more .load-more').html('Loading...').addClass('init');
		}else{
			$('.content-load-more').appendTo($('#search-result .under-content'));
			$('.content-load-more .load-more').html('Load More').removeClass('init').parents('.content-load-more').appendTo($('#search-result .under-content'));
		}
	},
	addPlaylist: function(id){
		var title = $('button[data-id-video="' + id + '"]').parents('.column').find('h4').html();
		var duration = $('button[data-id-video="' + id + '"]').parents('.column').find('.time').html();
		var uploader = $('button[data-id-video="' + id + '"]').parents('.column').find('.user').html();
		var views = $('button[data-id-video="' + id + '"]').parents('.column').find('.views').html();
		var img = $('button[data-id-video="' + id + '"]').parents('.item-search').find('img').attr('src');

		this.playlist['items'].push({'id':id,'title':title,'src':img,'duration':duration,'views':views,'user':uploader});
		this.changeButton('add',id);
	},
	removePlaylist: function(idVal){
		if(this.playingSong(idVal)=="queued" && this.inMixFlag==false){
			$.grep(djTube.playlist['items'], function(item,i){
				if(item.id ==  idVal){
			        djTube.playlist['items'].splice(i, 1);
			        djTube.changeButton('remove',idVal);
			    }
		    });
	    }else{
	    	djTube.notice('red','You cant remove playing song','Oops');
	    }
	    
	},
	changeButton: function(action,idVal){
		if(action=="remove"){
	    	$('button[data-id-video="' + idVal + '"]').text("Add to Playlist").removeClass('remove').addClass('add');
        	djTube.updatePlaylist('delete',idVal);
	    }else{
	    	$('button[data-id-video="' + idVal + '"]').text("Remove to Playlist").removeClass('add').addClass('remove');
		    djTube.updatePlaylist('add',idVal);
    	}
	},
	checkPlaylistSearch: function(idVal){
		var text = "add";
		$.grep(djTube.playlist['items'], function(item){
			if ( item.id ==  idVal) {
		        text = "remove";
		    }
	    });
	    
	    return text;
	},
	updatePlaylist: function(action,id){
		if(action=="add"){
			var templateSource = $('#playlist-template').html();
			var template = Handlebars.compile(templateSource);

			$('.playlist ul').html(template(this.playlist)).promise().done(function(){
		    	$('.application .playlist').getNiceScroll().resize();
		    });
		    var templateSource2 = $('#list-cover-template').html();
			var template2 = Handlebars.compile(templateSource2);
			$('.list-cover').html(template2(this.playlist)).promise().done(function(){

			});
			
		}else{
			$('.playlist li[data-id-video="'+id+'"],.list-cover li[data-id-video="'+id+'"]').remove();
		}
		this.updateNextTrack();
		
	},
	progressSongPercent: function(){
		var percent = "";
		if(this.desk1.tubeplayer('player').getPlayerState()==1){
			percent = this.desk1.tubeplayer('player').getCurrentTime()*100/this.desk1.tubeplayer('player').getDuration();
		}else if(this.desk2.tubeplayer('player').getPlayerState()==1){
			percent = this.desk2.tubeplayer('player').getCurrentTime()*100/this.desk2.tubeplayer('player').getDuration();
		}
		return percent;
	},
	progressSongTimeLapse: function(){
		var time = "";
		if(this.desk1.tubeplayer('player').getPlayerState()==1){
			time = this.desk1.tubeplayer('player').getCurrentTime()
		}else if(this.desk2.tubeplayer('player').getPlayerState()==1){
			time = this.desk2.tubeplayer('player').getCurrentTime()
		}
		return time;
	},
	progressSongTime: function(){
		var time = "";
		if(this.desk1.tubeplayer('player').getPlayerState()==1){
			time = this.desk1.tubeplayer('player').getDuration()
		}else if(this.desk2.tubeplayer('player').getPlayerState()==1){
			time = this.desk2.tubeplayer('player').getDuration()
		}
		return time;
	},
	detectCrossFade: function(){
		var remaningTime = this.progressSongTime() - this.progressSongTimeLapse();
		if(this.crossFadeSecond>=remaningTime){
			if(this.inMixFlag==false){
				this.mixSongs();
			}
		}
	},
	titleMarquee: function(){
		document.title = this.titleSite.substring(this.titlePos, this.titleSite.length) + this.titleSite.substring(0,this.titlePos);
		this.titlePos++;
		if (this.titlePos > this.titleSite.length) this.titlePos = 0;
			window.setTimeout("djTube.titleMarquee()", 100);
	},
	mixSongs: function(){
		var _this = this;
		clearInterval(_this.intervalProgressBar);
		$.each(_this.playlist['items'],function(i){
			_this.playingSong(_this.playlist['items'][i]['id']);
		});
		this.playingSong();
		this.crossFade();
		this.changeDiscCover();
		this.updateInfoCover();
		
	},
	getNextVideoId: function(){
		if($('.playlist li.playing').next()!=undefined){
			return $('.playlist li.playing').next().attr('data-id-video');
		}
		return $('.playlist li:first').attr('data-id-video');
	},
	crossFade: function(){
		var _this = this;
		_this.inMixFlag=true;
		var playerActive = _this.getActivePlayer();
		var playerInactive = _this.getInactivePlayer();
		var volumeActive = 100;
		var volumeInactive = 0;
		if(this.inMixFlag){
			playerInactive.tubeplayer('play',djTube.getNextVideoId());
			playerInactive.tubeplayer("volume", 0);
			_this.intervalMixSong = setInterval(function(){
				if(volumeActive!=0){
					volumeActive=volumeActive-10;
					playerActive.animate({'opacity':volumeActive},500);
					playerActive.tubeplayer("volume", volumeActive);
				}
				if(volumeInactive!=100){
					volumeInactive=volumeInactive+10;
					playerInactive.animate({'opacity':volumeInactive},500);
					playerInactive.tubeplayer("volume", volumeInactive);
				}
				if(volumeInactive==100){
					_this.inMixFlag=false;
					clearInterval(_this.intervalMixSong);
					playerActive.tubeplayer("pause");
				}
			},1000);
		}
	},
	mixVolume: function(){

	},
	changeDiscCover: function(){
		$list = $('.list-cover');
		if($list.find('li.playing').index()!=$list.length){
			$list.find('li.playing').removeClass('playing').next().addClass('playing');
			$('.playlist li.playing').removeClass('playing').find('.status').html("queued").parents('li').next().addClass('playing').find('.status').html('playing');
				$list.animate({'margin-top':'-'+(340*$list.find('li.playing').index())+'px'},1000);
		}
	},
	updateInfoCover: function(){
		if($('.playlist li.playing').find('.title').html()!=undefined){
			this.titleSite = "DJ Youtube | "+$('.playlist li.playing').find('.title').html()+" - ";
	    	this.titleMarquee();
    	}
		$('.playing-detail h3').html($('.playlist li.playing').find('.title').html());
		$('.playing-detail .user').html($('.playlist li.playing').find('.user').html());
		$('.playing-detail .views').html($('.playlist li.playing').find('.views').html());
		this.updateNextTrack();
	},
	updateNextTrack: function(){
		if($('.start').length===0){
			var nexTrack = $('.playlist li.playing').next().find('.title').html();
			if(nexTrack!=undefined){
				$('.playing-detail .next-track').html("Next Track... <span>"+nexTrack+"</span>");
			}else{
				$('.playing-detail .next-track').html("Next Track... <span>-- No more Song --</span>");
			}
			$('.playing-detail .next-track span').marquee({
			    duration: 5000,
			    gap: 50,
			    delayBeforeStart: 0,
			    direction: 'left',
			    duplicated: true
			});
		}
	},
	moveProgressBar: function(){
		this.intervalProgressBar = setInterval(function(){
			var percent = djTube.progressSongPercent();
			$('.progress-bg .bar').css('width',percent+"%");
			$('.progress-bg .dot').css('left',percent+"%");
			if(djTube.progressSongTimeLapse()!=""){
				$('.progress-content .column-number.text-left').html(djTube.convertDuration(djTube.progressSongTimeLapse()));
			}
			if(djTube.progressSongTime()!=""){
				$('.progress-content .column-number.text-right').html(djTube.convertDuration(djTube.progressSongTime()));
			}
			djTube.detectCrossFade();
		},1000);
	},
	convertDuration: function(val){
		var sec_num = parseInt(val, 10); // don't forget the second param
	    var hours   = Math.floor(sec_num / 3600);
	    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	    var seconds = sec_num - (hours * 3600) - (minutes * 60);

	    if (hours   < 10) {hours   = "0"+hours;}
	    if (minutes < 10) {minutes = "0"+minutes;}
	    if (seconds < 10) {seconds = "0"+seconds;}
	    if(hours!=00){
	    	var time    = hours+':'+minutes+':'+seconds;
	    }else{
	    	var time    = minutes+':'+seconds;
	    }
	    return time;
	    
	},
	startMix: function(){
		var idVideo = $('.playlist li:first').attr('data-id-video');
		$('.container-player .background').css("background-image",'none');
		$('.playlist li:first').addClass("playing").find('.status').html("PLAYING");
		$('.list-cover li:first').addClass("playing");
		$('.start').remove();
		$('#background-container').snowfall('clear');

		$('.playing-detail .progress-content').addClass('animated fadeIn');
		this.desk1.tubeplayer('play',idVideo).tubeplayer("volume", 15);
		this.desk1.tubeplayer("volume", 100);
		this.desk1.animate({'opacity':'1'},1000);
		/*SET PLAYING*/
		this.updateInfoCover();
	},
	notice: function(color,text,title) {
		new jBox('Notice', {
				title: title,
				content: text,
				autoClose: 5000,
				audio: 'audio/bling2',
				volume: 50,
				attributes: {x:'right',y:'top'},
				theme: 'NoticeBorder',
				color: color,
				animation: {open:'slide:top',close:'slide:right'}
   		});
	},
	getActivePlayer: function(){
		if(this.desk1.tubeplayer("player").getPlayerState()==1){
			return this.desk1;
		}
		return this.desk2;
	},
	getInactivePlayer: function(){
		if(this.desk1.tubeplayer("player").getPlayerState()==1){
			return this.desk2;
		}
		return this.desk1;
	},
	playingSong: function(id){
		if($('.container-player .start').length<=0){
			var result="";
			if(typeof this.desk1.tubeplayer("player")!== "undefined"){
				if(this.desk1.tubeplayer("player").getVideoData()['video_id']==id && this.desk1.tubeplayer("player").getPlayerState()==1){
					result= "playing";
				}else{
					result= "queued";
				} 
			}
			if(typeof this.desk2.tubeplayer("player")!== "undefined" && result!="playing"){
				if( this.desk2.tubeplayer("player").getVideoData()['video_id']==id && this.desk2.tubeplayer("player").getPlayerState()==1){
					result= "playing";
				}else{
					result= "queued";
				} 
			}
			return result;
		}
		this.updateInfoCover();
		this.changeDiscCover();
		return "queued";
	},
	expandPlayer: function(){
		var $player = $('.container-player');
	    var docElement = document.documentElement;
	    var request = docElement.requestFullScreen || docElement.webkitRequestFullScreen || docElement.mozRequestFullScreen || docElement.msRequestFullScreen;
		
		$player.toggleClass('expand');

	    if(typeof request!="undefined" && request){
	        request.call(docElement);
	    }
	    if($player.hasClass('expand')){
	    	$('html').css('overflow','hidden');
	    }else{
	    	$('html').css('overflow','auto');
	    }
	},
	blurPlayer: function(){
		var filterVal = 'blur(35px)';
		if($('#desk-1').css('webkitFilter')==filterVal){
			$('#desk-1,#desk-2')
			  .css('filter','blur(0px)')
			  .css('webkitFilter','blur(0px)')
			  .css('mozFilter','blur(0px)')
			  .css('oFilter','blur(0px)')
			  .css('msFilter','blur(0px)');
		}else{
			$('#desk-1,#desk-2')
			  .css('filter',filterVal)
			  .css('webkitFilter',filterVal)
			  .css('mozFilter',filterVal)
			  .css('oFilter',filterVal)
			  .css('msFilter',filterVal);
		}
	}

}

Handlebars.registerHelper('checkPlaylistStatus', function(id) {       
    return djTube.checkPlaylistSearch(id);    
});
Handlebars.registerHelper('convertDuration', function(val) {       
    return djTube.convertDuration(val);    
});
Handlebars.registerHelper('playingSong', function(val) {       
    return djTube.playingSong(val);    
});



$(function(){

	
	djTube.setBackground();

	/*Events*/
	$('.start-page .search-form').submit(function(e){
		e.preventDefault();
		djTube.loader(true);
		var inputSearch = $('.start-page .search-input');
		inputSearch.blur();
		djTube.ajaxSearch(inputSearch.val());
		$('.auto-complete').hide();
	});

	$('.application .search-form').submit(function(e){
		e.preventDefault();
		djTube.loader(true);
		var inputSearch = $('.application .search-input');
		inputSearch.blur();
		djTube.ajaxSearch(inputSearch.val());
		$('.auto-complete').hide();
	});

	$('#search-result').on('click','.load-more',function(e){
		var inputSearch = $('.application .search-input');
		inputSearch.blur();
		djTube.buttonLoader(true);
		djTube.ajaxSearch(inputSearch.val(),djTube.startSearchResult,e);
	});	

	$('.search-input').keyup(function(event) {
		event.preventDefault();
		djTube.ajaxAutoComplete($(this).val());
		/* Act on the event */
	});

	$('.start').on('click', function(){
		if($('.playlist li').length>=2){
			djTube.startMix();
		}else{
			djTube.notice('red','Must select 2 minimum songs','Oops')
		}
	})

	$('.expand-player').on('click',function(){
		djTube.expandPlayer();
	})

	$('.blur-player').on('click',function(){
		djTube.blurPlayer();
	})

	/*Playlist*/
	$('#search-result').on('click','.button',function(){
		if($(this).hasClass('add')){
			djTube.addPlaylist($(this).attr('data-id-video'));
		}else{
			djTube.removePlaylist($(this).attr('data-id-video'));
		}
		
	});
	$('.auto-complete').on('click', '.item', function(event) {
		event.preventDefault();
		djTube.setAutoComplete($(this).html());
		$('.auto-complete').hide();
		$(this).parents('form').submit();
		/* Act on the event */
	});
	$('.playlist').on('click','.close',function(e){
		e.preventDefault();
		if(!$(this).hasClass('play')){
			djTube.removePlaylist($(this).parents('li').attr('data-id-video'));
		}
	});
	
	$('body').on('click',function(){
		$('.auto-complete').hide();
	});

	$(document).keypress(function(e){
        djTube.combinationDedicated(e.keyCode);
    });

});

	/*ajaxSearch: function(data,mount){
		var templateSource = $('#application-template').html();
		var template = Handlebars.compile(templateSource);
		$('.application .search-input').val(data);
		search(data,mount,template,templateSource);
	}*/
