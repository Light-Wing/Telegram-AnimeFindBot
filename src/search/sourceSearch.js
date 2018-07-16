'use strict';


// function setKissToMal(malUrl) {
//     var type = malUrl.split('/')[3];
//     var uid = malUrl.split('/')[4].split("?")[0];
//     var sites = new Array();
//     var sitesName = new Array();
//     var searchLinks = 0;
//     if (type == 'anime') {
//         if (kissanimeLinks != 0) {
//             sites.push('Kissanime');
//             sitesName['Kissanime'] = 'KissAnime';
//             searchLinks = 1;
//         }
//         if (masteraniLinks != 0) {
//             sites.push('Masterani');
//             sitesName['Masterani'] = 'MasterAnime';
//             searchLinks = 1;
//         }
//         if (nineanimeLinks != 0) {
//             sites.push('9anime');
//             sitesName['9anime'] = '9anime';
//             searchLinks = 1;
//         }
//         if (crunchyrollLinks != 0) {
//             sites.push('Crunchyroll');
//             sitesName['Crunchyroll'] = 'Crunchyroll';
//             searchLinks = 1;
//         }
//         if (gogoanimeLinks != 0) {
//             sites.push('Gogoanime');
//             sitesName['Gogoanime'] = 'Gogoanime';
//             searchLinks = 1;
//         }
//     } else {
//         if (kissmangaLinks != 0) {
//             sites.push('Kissmanga');
//             sitesName['Kissmanga'] = 'KissManga';
//             searchLinks = 1;
//         }
//     }
//     if (searchLinks != 0) {
//         if (type == 'anime') {
//             if (masteraniLinks != 0) $('#siteSearch').after('<div class="mal_links"><a target="_blank" href="http://www.google.com/search?q=site:www.masterani.me/anime/info/+' + encodeURI($('#contentWrapper > div:first-child span').text()) + '">MasterAnime (Google)</a> <a target="_blank" href="https://www.masterani.me/anime?search=' + $('#contentWrapper > div:first-child span').text() + '">(Site)</a></div>');
//             if (gogoanimeLinks != 0) $('#siteSearch').after('<div class="mal_links"><a target="_blank" href="http://www.gogoanime.tv/search.html?keyword=' + $('#contentWrapper > div:first-child span').text() + '">Gogoanime</a></div>');
//             if (crunchyrollLinks != 0) $('#siteSearch').after('<div class="mal_links"><a target="_blank" href="http://www.crunchyroll.com/search?q=' + $('#contentWrapper > div:first-child span').text() + '">Crunchyroll</a></div>');
//             if (nineanimeLinks != 0) $('#siteSearch').after('<div class="mal_links"><a target="_blank" href="https://9anime.to/search?keyword=' + $('#contentWrapper > div:first-child span').text() + '">9anime</a></div>');
//             if (kissanimeLinks != 0) $('#siteSearch').after('<form class="mal_links" target="_blank" action="http://kissanime.ru/Search/Anime" id="kissanimeSearch" method="post" _lpchecked="1"><a href="#" onclick="return false;" class="submitKissanimeSearch">KissAnime</a><input type="hidden" id="keyword" name="keyword" value="' + $('#contentWrapper > div:first-child span').text() + '"/></form>');
//         } else {
//             $('#siteSearch').after('<form class="mal_links" target="_blank" action="http://kissmanga.com/Search/Manga" id="kissmangaSearch" method="post" _lpchecked="1"><a href="#" onclick="return false;" class="submitKissmangaSearch">KissManga</a><input type="hidden" id="keyword" name="keyword" value="' + $('#contentWrapper > div:first-child span').text() + '"/></form>');
//             $('.submitKissmangaSearch').click(function() {
//                 $('#kissmangaSearch').submit();
//             });
//         }
//     } else {
//         $('h2:contains("Information")').before('<div class="mal_links" id="siteSearch"></div>');
//     }
//     $.each(sites, function(index, page) {
//         var url = 'https://kissanimelist.firebaseio.com/Data2/Mal' + type + '/' + uid + '/Sites/' + page + '.json';
//         GM_xmlhttpRequest({
//             url: url,
//             method: "GET",
//             onload: function(response) {
//                 con.log('[2Kiss]', url, response.response);
//                 if (response.response != 'null') {
//                     getSites($.parseJSON(response.response), sitesName[page]);
//                 }
//             },
//             onerror: function(error) {
//                 con.log("[setKissToMal] error:", error);
//             }
//         });
//     });
// }




// function setKissToMal(malUrl){
//     $(document).ready(function() {
//         $('.mal_links').remove();
//         var type = malUrl.split('/')[3];
//         var uid = malUrl.split('/')[4].split("?")[0];
//         var sites = new Array();
//         var sitesName = new Array();
//         var searchLinks = 0;
//         if(type == 'anime'){
//             if(kissanimeLinks != 0){
//                 sites.push('Kissanime');
//                 sitesName['Kissanime'] = 'KissAnime';
//                 searchLinks = 1;
//             }
//             if(masteraniLinks != 0){
//                 sites.push('Masterani');
//                 sitesName['Masterani'] = 'MasterAnime';
//                 searchLinks = 1;
//             }
//             if(nineanimeLinks != 0){
//                 sites.push('9anime');
//                 sitesName['9anime'] = '9anime';
//                 searchLinks = 1;
//             }
//             if(crunchyrollLinks != 0){
//                 sites.push('Crunchyroll');
//                 sitesName['Crunchyroll'] = 'Crunchyroll';
//                 searchLinks = 1;
//             }
//             if(gogoanimeLinks != 0){
//                 sites.push('Gogoanime');
//                 sitesName['Gogoanime'] = 'Gogoanime';
//                 searchLinks = 1;
//             }
//         }else{
//             if(kissmangaLinks != 0){
//                 sites.push('Kissmanga');
//                 sitesName['Kissmanga'] = 'KissManga';
//                 searchLinks = 1;
//             }
//         }
//         if(searchLinks != 0){
//             $('h2:contains("Information")').before('<h2 id="siteSearch" class="mal_links">Search</h2><br class="mal_links" />');
//             if(type == 'anime'){
//                 $('#siteSearch').after('<div class="mal_links"></div>');
//                 if(masteraniLinks != 0) $('#siteSearch').after('<div class="mal_links"><a target="_blank" href="http://www.google.com/search?q=site:www.masterani.me/anime/info/+'+encodeURI($('#contentWrapper > div:first-child span').text())+'">MasterAnime (Google)</a> <a target="_blank" href="https://www.masterani.me/anime?search='+$('#contentWrapper > div:first-child span').text()+'">(Site)</a></div>');
//                 if(gogoanimeLinks != 0) $('#siteSearch').after('<div class="mal_links"><a target="_blank" href="http://www.gogoanime.tv/search.html?keyword='+$('#contentWrapper > div:first-child span').text()+'">Gogoanime</a></div>');
//                 if(crunchyrollLinks != 0) $('#siteSearch').after('<div class="mal_links"><a target="_blank" href="http://www.crunchyroll.com/search?q='+$('#contentWrapper > div:first-child span').text()+'">Crunchyroll</a></div>');
//                 if(nineanimeLinks != 0) $('#siteSearch').after('<div class="mal_links"><a target="_blank" href="https://9anime.to/search?keyword='+$('#contentWrapper > div:first-child span').text()+'">9anime</a></div>');
//                 if(kissanimeLinks != 0) $('#siteSearch').after('<form class="mal_links" target="_blank" action="http://kissanime.ru/Search/Anime" id="kissanimeSearch" method="post" _lpchecked="1"><a href="#" onclick="return false;" class="submitKissanimeSearch">KissAnime</a><input type="hidden" id="keyword" name="keyword" value="'+$('#contentWrapper > div:first-child span').text()+'"/></form>');
//                 $('.submitKissanimeSearch').click(function(){
//                   $('#kissanimeSearch').submit();
//                 });
//             }else{
//                 $('#siteSearch').after('<form class="mal_links" target="_blank" action="http://kissmanga.com/Search/Manga" id="kissmangaSearch" method="post" _lpchecked="1"><a href="#" onclick="return false;" class="submitKissmangaSearch">KissManga</a><input type="hidden" id="keyword" name="keyword" value="'+$('#contentWrapper > div:first-child span').text()+'"/></form>');
//                 $('.submitKissmangaSearch').click(function(){
//                   $('#kissmangaSearch').submit();
//                 });
//             }
//         }else{
//             $('h2:contains("Information")').before('<div class="mal_links" id="siteSearch"></div>');
//         }
//         $.each( sites, function( index, page ){
//             var url = 'https://kissanimelist.firebaseio.com/Data2/Mal'+type+'/'+uid+'/Sites/'+page+'.json';
//             GM_xmlhttpRequest({
//                 url: url,
//                 method: "GET",
//                 onload: function (response) {
//                     con.log('[2Kiss]', url, response.response);
//                     if(response.response != 'null'){
//                         getSites($.parseJSON(response.response), sitesName[page]);
//                     }
//                 },
//                 onerror: function(error) {
//                     con.log("[setKissToMal] error:",error);
//                 }
//             });
//         });
//    });
// }