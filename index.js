var snoowrap = require('snoowrap');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/Magmadb";

const r = new snoowrap({
  userAgent: 'put your user-agent string here',
  clientId: 'Fsw1_6AytBzQsw',
  clientSecret: 'ZyE2GZYI5ajnAt6XgOa0WTX0DiI',
  refreshToken: '21095216-_Mcbvg0BQoiRIogpO328rTeZjw4'
});
	

console.log('what');


r.getHot().then(listing => {

  var posts = listing.map(submission => submission);
  
  var content = [];

  var db = {}
  var str = "";

  posts.forEach(function(p) {
  	console.log(p);
	p.expandReplies({limit: 1, depth: 1}).then(obj => {
	  	//console.log('post: ', p.id);
	  	var title = obj.title;
	  	
	  	var replies = obj.comments.map(function(comments){ // TODO: username
	  	 return {'body': comments.body};
	  	});

	  	content.push({'_id':p.id, 'title':title, 'replies': replies});

	  	var data = {'_id':p.id, 'title':title, 'name': p.name,'thumbnail': p.thumbnail, 'url': p.url, 'replies': replies, 'score': p.score,  'subreddit': p.subreddit_name_prefixed};
	  	
	  	checkDuplicate(p.id).then(function(result) {
		  if (!result) {
	  		console.log('Storing Document: ', p.id);
	  		storeDocument(data); ///////////////// 
	  	}
	  	else {
	  		//console.log('not storing: ', p.id);
	  	}
		}, function(err) {
		  console.error('The promise was rejected', err, err.stack);
		});
		

	  	
	  	
	  	
	});
  });
  getPosts();
});

function build(_id, title_text, thumbnail_url, post_url, subreddit) {


	let html_text = `<div class="post_wrapper">
      <img class="thumbnail" src=${thumbnail_url} alt="Smiley face">
      <div class="title">${title_text}</div>
      <div class="subreddit_tag">${subreddit}</div>
      <div class="comment_tag"> 72 comments</div>
      <hr class="post_hr">
    </div>`;


    var ele = document.getElementById('content_box');
    ele.innerHTML += html_text;
    //post_wrapper.appendChild(ele);
    // console.log(document.getElementById('content_box'));


}

function load(offlineContentData) {
	offlineContentData.forEach(function(post){
		build(post._id, post.title, post.thumbnail, post.url, post.subreddit); // TODO: NEED TO ADD KARMA SUBREDDIT ECT
	});
	//console.log(offlineContentData);
}

function storeDocument(postObj) {
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("Magmadb");

	  dbo.collection("posts").insertOne(postObj, function(err, res) {
	    if (err) throw err;
	    console.log("1 document inserted");
	    db.close();
	  });
	});
} 

function checkDuplicate(_post_id) {
	var query = {'_id': _post_id};

 	
	return MongoClient.connect(url).then(function (db) {
		var dbo = db.db("Magmadb");
		return dbo.collection("posts").find(query).toArray();
	}).then(function(result) {

      if (result.length) {
	    	
	    	return true;
	  } 
	  else {
	        
	    	return false;
	       }
    });

 	console.log('shouldnt happen');

}




function getPosts(key) {
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("Magmadb");

	dbo.collection("posts").find(key).toArray(function(err, result) { // NO ID!!!!
	    if (err) throw err;
	    //console.log(result);
	    load(result);
	    //return result;
	    db.close();
	  });
	});
}
  