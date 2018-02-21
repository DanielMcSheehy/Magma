
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
		//console.log('here: ', docs[0].replies[0].replies[0].author.name);
		header(docs[0]);
		generateComments(docs[0]);
	});
}

function generateComments(postObj) { // TODO: Names (author.name)
	postObj.replies.forEach(function(commentObj){ 
		build(commentObj.body,commentObj.name, commentObj.score, 0);
		commentObj.replies.forEach(function(subObj){
			build(subObj.body, subObj.author.name, subObj.score, 1);
			subObj.replies.forEach(function(lastObj){
				build(lastObj.body, lastObj.author.name, lastObj.score, 2);
			})
		});
	});
}
function build(body, name, score, level){
	let left_margin = `margin-left:${level*20}px;`;
  let html_text = `<div class="post_wrapper">
                    <div class="score-tag" style=${left_margin}>${score}:</div>  
                    <div class="name-tag" style=${left_margin}>${name}</div>
                    <div class="added" style=${left_margin}>${body}</div>
                   </div>`;
  var ele = document.getElementById('content_box');
    ele.innerHTML += html_text;
}

function header(postObj) {
	let html_text = `<img class="thumbnail" src=${postObj.thumbnail} alt="Smiley face">
	<div class="post-header">${postObj.title}</div>`;
	var ele = document.getElementById('content_box');
    ele.innerHTML += html_text;
}

//var data = {'_id':p.id, 'title':title, 'name': p.name, 'thumbnail': p.thumbnail, 'replies': replies, 'subreddit': p.subreddit_name_prefixed, 'url': p.url, 'score:' p.score};