
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-77692823-1', 'auto');
  ga('send', 'pageview');

  // (function() { var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true; po.src = '//api.at.getsocial.io/widget/v1/gs_async.js?id=a602d6'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s); })();


// !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');



var React = require('react');
var ReactDOM = require('react-dom');

var PlayerViz = require('./PlayerViz');

var data = require('./PlayersData.json');
var playersImages = {};
data.sort(function(a, b){
    var p1 = a.name.split(' ')[1],
    	p2 = b.name.split(' ')[1];

    if (p1 === "'Magic'")
    	p1 = "Johnson";
    if (p2 === "'Magic'")
    	p2 = "Johnson";


    if(p1 < p2) return -1;
    if(p1 > p2) return 1;
    return 0;
});

// Preloading all player images to avoid having to load them each time.
data.forEach(function(playerData) {
	var playerPics = []
	playerData.pics.forEach(function(pic) {
		var route = './img/'+pic;
		playerPics.push(require(route));
	});

	playersImages[playerData.nickname] = playerPics
});

require("./style.css");

ReactDOM.render(<PlayerViz data={data} images={playersImages}/>, document.body);