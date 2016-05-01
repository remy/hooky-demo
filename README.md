# 👍🔥 aka +1 nukem

This repo will automatically remove any `+1` comments from an issue, and aggreagate them on the original issue text:

![image of thumbs up reactions](https://cloudup.com/c19bnzKpBn1+)

Note that this is a bit hacky, because we can't use the "native" Github reactions. Upshot though: no more `+1` comments.

Downshot: you get all the emails still…

## Github setup

You'll need to create a [personal access token](https://github.com/settings/tokens/new) that has the `repo:public_repo` access enabled. Keep hold of the token, you'll need this later.

You actually need to deploy your service now, and then come back to this point (but read it all, take it in, and play).

You also need to add a webhook to the repo (or repos) you want to use this on. You get there from the "Settings" tab in your repo, then "Webhooks & services", then "Add webhook".

Make sure to select the following types of events: issue comment and pull request review comment (assuming you want to nuke these too).

![event types](https://cloudup.com/i1i8GgSQM6M+)

Next, you need to host your webhook somewhere. For this, I'm using Heroku, but you can use anything really.

## Deploying to heroku

Assuming a Heroku account is active, here's what you need to do:

```bash
heroku create
heroku config set SECRET=$secret TOKEN=$token
git push heroku master
```

You'll need to swap `$secret` for some abritrary secret value and include this in the webhook config (explained next). I'm currently using a [personal access token](https://github.com/settings/tokens/new), which you need to replace `$token` with.

Then you should be done.
