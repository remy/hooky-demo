var undefsafe = require('undefsafe');
var GitHubApi = require('github');
var githubhook = require('githubhook');
var hook = githubhook({
   host: '0.0.0.0',
   port: process.env.PORT || 8082,
   path: '/',
   secret: process.env.SECRET,
});

var github = new GitHubApi({
  // required
  version: '3.0.0',
  // optional
  debug: true,
  protocol: 'https',
  host: 'api.github.com',
  timeout: 5000,
  headers: {
    'user-agent': '+1 nukem'
  }
});

github.authenticate({
  type: 'oauth',
  token: process.env.TOKEN, // personal token
});

function issueComment(repo, ref, data) {
  // read comment
  var body = undefsafe(data, 'comment.body');

  if (body && data.action === 'created') {
    body = body.trim().replace(/:/g, '');
    if (body === '👍') {
      body = '+1';
    }

    if (body === '+1') {


      github.issues.deleteComment({
        repo,
        user: data.repository.owner.login,
        id: data.comment.id,
      }, (error, res) => {
        console.log('response from deleting comment');
        console.log(error, res);
      });

      /*
        remove this entire section below if you just want to remove the comment,
        and not worry about adding a cumulative total of +1 reactions.
      */
      var issueBody = data.issue.body;
      var lines = issueBody.trim().split('\n');
      var last = lines.pop();

      if (last.indexOf('Reactions: ') === 0) {
        var count = last.replace(/\((\d+)\)/, (_, n) => `(${parseInt(n)+1})`);
        lines.push(count);
        issueBody = lines.join('\n');
      } else {
        issueBody += '\n\nReactions: :+1: (1)';
      }

      // // remove the comment, and post on behalf
      github.issues.edit({
        repo,
        user: data.repository.owner.login,
        number: data.issue.number,
        body: issueBody,
      }, (error, comments) => {
        console.log(comments);
      });
    }
  }
}

hook.on('issue_comment', issueComment);

hook.listen();

// quick litmus test
// setTimeout(_ => {
//   issueComment('hooky-demo', '', require('./plus-one.json'));
// }, 100);

