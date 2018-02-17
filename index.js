var snoowrap = require('snoowrap');

const r = new snoowrap({
  userAgent: 'put your user-agent string here',
  clientId: 'Fsw1_6AytBzQsw',
  clientSecret: 'ZyE2GZYI5ajnAt6XgOa0WTX0DiI',
  refreshToken: '21095216-_Mcbvg0BQoiRIogpO328rTeZjw4'
});

var Datastore = require('nedb')
  , db = new Datastore({ filename: '/Users/dsm/code/electron/Magma/eleStorage.db' });
db.loadDatabase(function (err) {    // Callback is optional
  // Now commands will be executed
});

r.getHot().then(listing => {

  var posts = listing.map(submission => submission);
  
  var content = [];

  var db = {};
  var str = "";

  posts.forEach(function(p) {

	p.expandReplies({limit: 1, depth: 1}).then(obj => {
	  	//console.log('post: ', p.id);
	  	var title = obj.title;
	  	
	  	var replies = obj.comments.map(function(comments){ // TODO: username
	  	 return {'body': comments.body};
	  	});

			var data = {
				'_id': p.id, 
				'title':title, 
				'name': p.name,
				'thumbnail': p.thumbnail, 
				'url': p.url, 
				'replies': replies, 
				'score': p.score,
				'num_comments': p.num_comments,
				'subreddit': p.subreddit_name_prefixed
			};
	  	storeDocument(data); ///////////////// 
	  	
	});
  });
  getPosts();
});

function build(_id, title_text, thumbnail_url, post_url, subreddit, num_comments) {


	let html_text = `<div class="post_wrapper">
      <img class="thumbnail" src=${thumbnail_url} alt="Smiley face">
      <div class="title">${title_text}</div>
      <div class="subreddit_tag">${subreddit}</div>
      <div class="comment_tag"> ${num_comments}</div>
      <hr class="post_hr">
    </div>`;


    var ele = document.getElementById('content_box');
    ele.innerHTML += html_text;
    //post_wrapper.appendChild(ele);
    // console.log(document.getElementById('content_box'));


}

function load(offlineContentData) {
	
	for (i = offlineContentData.length -1; i--;) {
		let post = offlineContentData[i];
		build(post._id, post.title, post.thumbnail, post.url, post.subreddit, post.num_comments);
	}



	// offlineContentData.forEach(function(post){
	// 	build(post._id, post.title, post.thumbnail, post.url, post.subreddit, post.num_comments); // TODO: NEED TO ADD KARMA SUBREDDIT ECT
	// });
	//console.log(offlineContentData);
}

function storeDocument(postObj) {
	db.insert(postObj, function (err, newDoc) {   // Callback is optional
        // newDoc is the newly inserted document, including its _id
        // newDoc has no key called notToBeSaved since its value was undefined
      });
} 

function checkDuplicate(_post_id) {
	//TODO: 
}

function getPosts(key) {
 //key?
	db.find({ }, function (err, docs) {
		load(docs);
	});
	    
}