
var Datastore = require('nedb')
  , db = new Datastore({ filename: '/Users/dsm/code/electron/Magma/eleStorage.db' });
db.loadDatabase(function (err) {    // Callback is optional
  // Now commands will be executed
});

var _post_id = window.location.href.split("file:///Users/dsm/code/electron/Magma/comments.html?postId=")[1];
getPosts(_post_id);

function getPosts(_post_id) {
	

	var query = {_id: _post_id};
	console.log(query);

	db.find(query, function (err, docs) {
		console.log(docs);
		generateComments(docs[0]);
	});
}

function generateComments(postObj) { // TODO: Names
	postObj.replies.forEach(function(commentObj){ 
		build(commentObj.body,0);
		commentObj.replies.forEach(function(subObj){
			build(subObj.body, 1);
			subObj.replies.forEach(function(lastObj){
				build(lastObj.body, 2);
			})
		});
	});
}
function build(body, level){
  let left_margin = `margin-left:${level*20}px;`;
  let html_text = `<div class="post_wrapper">
                    <div class="added" style=${left_margin}>${body}</div>
                   </div>`;
  var ele = document.getElementById('content_box');
    ele.innerHTML += html_text;
}

//var data = {'_id':p.id, 'title':title, 'name': p.name, 'thumbnail': p.thumbnail, 'replies': replies, 'subreddit': p.subreddit_name_prefixed, 'url': p.url, 'score:' p.score};