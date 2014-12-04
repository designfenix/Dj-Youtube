
var djTube = {

	crossFadeSecond : '10000',
	playlist : {'items':[]},
	backgroundContainer : $('#background-container'),
	backgrounds : ['bg-1.jpg','bg-2.jpg','bg-3.jpg','bg-4.jpg','bg-5.jpg','bg-6.jpg'], 
	loaderContent : $('#overlay'),
	desk1: $('#desk-1'),
	desk2: $('#desk-2'),
	limitSearchResult : 20,
	lastSearch : '',
	startSearchResult : 20,

	init: function(){

		$(".application .playlist,#search-result .under-content").niceScroll();
 		$("html, body").scrollTop( 0 );
		/*change background*/
		this.setBackground();

		/*focus search begin*/
		$('.start-page .search-content').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$('.start-page .search-input').focus();
			$('html').css('overflow','auto');
		});
	},
	setBackground: function(){
		var image = this.backgrounds[Math.floor(Math.random()*6)];
		this.backgroundContainer.css('background-image','url(img/wallpapers/' + image + ')');
		$('.content-player .background').css('background-image','url(img/wallpapers/' + image + ')');
	},
	ajaxSearch: function(data,mount){

		var templateSource = $('#application-template').html();
		var template = Handlebars.compile(templateSource);
		$('.application .search-input').val(data)
		$.ajax({
			url: 'http://gdata.youtube.com/feeds/api/videos?q=' + data + '&max-results=' + djTube.limitSearchResult + (mount!=undefined?'&start-index='+djTube.startSearchResult:'') + '&v=2&alt=jsonc',
			success: function (response) {
				/*Scroll bottom*/
				$("html, body").animate({ scrollTop: $(document).height() }, 1000);
				data = response.data;
				$('.start-page').hide();
				$('.application').show();
				setTimeout( function() {
					if(mount==undefined){
						$('#search-result .under-content').html(template(data)+'<div class="content-load-more"><div class="clearfix"></div><div class="text-center"><span class="load-more">Load More</span></div></div>');
						djTube.startSearchResult=20;
					}else{
						$('#search-result .under-content').append(template(data));
						djTube.startSearchResult=$('#search-result .item-search').length+djTube.startSearchResult;
					}
					(mount==undefined?djTube.loader(false):djTube.buttonLoader(false));					
				},1000);
			}
		});
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
		var img = $('button[data-id-video="' + id + '"]').parents('.item-search').find('img').attr('src');

		this.playlist['items'].push({'id':id,'title':title,'src':img,'duration':duration});
		this.changeButton('add',id);
	},
	removePlaylist: function(idVal){
		$.grep(djTube.playlist['items'], function(item,i){
			if(item.id ==  idVal){
		        djTube.playlist['items'].splice(i, 1);
		        djTube.changeButton('remove',idVal);
		    }
	    });
	    
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
				/*$('.video-youtube').each(function(){
					if(!$(this).hasClass('jquery-youtube-tubeplayer')){
						$(this).tubeplayer({initialVideo:id});
					}
				})*/
		    });
			
		}else{
			$('.playlist li[data-id-video="'+id+'"]').remove();
		}
		
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
		$('.content-player .background').css("background-image",'none');
		$('.playlist li:first').addClass("play").find('.status').html("PLAYING");
		$('.start').remove();
		this.desk1.tubeplayer({initialVideo:idVideo,allowFullScreen:false,autoPlay:true});
	},
	notice: function(color,text) {
		new jBox('Notice', {
				title: 'Oops',
				content: text,
				autoClose: 5000,
				audio: 'audio/bling2',
				volume: 50,
				attributes: {x:'right',y:'top'},
				theme: 'NoticeBorder',
				color: color,
				animation: {open:'slide:top',close:'slide:right'}
    });
}

}

Handlebars.registerHelper('checkPlaylistStatus', function(id) {       
    return djTube.checkPlaylistSearch(id);    
});
Handlebars.registerHelper('convertDuration', function(val) {       
    return djTube.convertDuration(val);    
});


$(function(){

	
	djTube.init();

	/*Events*/
	$('.start-page .search-form').submit(function(e){
		e.preventDefault();
		djTube.loader(true);
		var inputSearch = $('.start-page .search-input');
		inputSearch.blur();
		djTube.ajaxSearch(inputSearch.val());
	});

	$('.application .search-form').submit(function(e){
		e.preventDefault();
		djTube.loader(true);
		var inputSearch = $('.application .search-input');
		inputSearch.blur();
		djTube.ajaxSearch(inputSearch.val());
	});

	$('#search-result').on('click','.load-more',function(e){
		var inputSearch = $('.application .search-input');
		inputSearch.blur();
		djTube.buttonLoader(true);
		djTube.ajaxSearch(inputSearch.val(),djTube.startSearchResult,e);
	});	

	$('.start').on('click', function(){
		if($('.playlist li').length>=2){
			djTube.startMix();
		}else{
			djTube.notice('red','Must select 2 minimum songs')
		}
	})

	/*Playlist*/
	$('#search-result').on('click','.button',function(){
		if($(this).hasClass('add')){
			djTube.addPlaylist($(this).attr('data-id-video'));
		}else{
			djTube.removePlaylist($(this).attr('data-id-video'));
		}
		
	});
	$('.playlist').on('click','.close',function(e){
		e.preventDefault();
		if(!$(this).hasClass('play')){
			djTube.removePlaylist($(this).parents('li').attr('data-id-video'));
		}
	});
	
	

});
