var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/Magmadb";

var _post_id = window.location.href.split("file:///Users/dsm/code/electron/Magma/comments.html?commentId=")[1];
getPosts(_post_id);

function getPosts(_post_id) {
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("Magmadb");

	var query = {_id: _post_id};
	dbo.collection("posts").find(query).toArray(function(err, result) { // EVERYTHING!!!
	    if (err) throw err;
	    var _post = result[0];
	    _post.replies.forEach(function(comments){
	    	build(comments.body);
	    	console.log(comments.body);
	    });
	    
	    
	    //return result;
	    db.close();
	  });
	});
}
function build(body_text) {

	var element = document.createElement('div');
	element.className = "object";
	element.textContent = body_text;
	
	document.getElementsByTagName('body')[0].appendChild(element);
}


//var data = {'_id':p.id, 'title':title, 'name': p.name, 'thumbnail': p.thumbnail, 'replies': replies, 'subreddit': p.subreddit_name_prefixed, 'url': p.url, 'score:' p.score};