
$('#followingcount').click(function () {
  $('#tweetAreaHome').hide();
  $('#followingA').show();
  $('#followingA').empty();
  // $("following?").show();
  $.ajax({
    method: 'POST',
    url: '/following'
  })
    .done(function (data) {
      for (let i = data.length - 1; i >= 1; i--) {
        $('#followingA')
          .prepend(`<div class="twPc-div col-md-4 col-sm-6 col-xm-12">
           <a class="twPc-bg twPc-block" style="width=100%;background : url('/images/cover.jpg')"></a><div>
             <div class="twPc-button" >
              <a href="" class="twitter-follow-button" data-show-count="false" data-size="large" data-show-screen-name="false" data-dnt="true">@` + data[i].following + `</a>
             </div>
             <a title="Mert Salih Kaplan" href="/showFriendProfile?id=` + data[i].following + `" class="twPc-avatarLink">
              <img alt="Mert Salih Kaplan" src="` + data[i].img + `" class="twPc-avatarImg">
             </a>
             <div class="twPc-divUser">
              <div class="twPc-divName">
               <a href="/showFriendProfile?id=` + data[i].following + `">` + data[i].name + `</a>
              </div>
              <span>
               <a href="/showFriendProfile?id=` + data[i].following + `">
                <span>@` + data[i].following + `</span>
               </a>
              </span>
              <input type="hidden" value="` + data[i].following + `" id="friendUsername` + data[i]._id + `" name="friendUsername">
              <button class="btn btn-primary pull-right" onclick="` + data[i].statusbtn + `(this)" name="` + data[i].statusbtn + `" id="` + data[i].following + `" style="width : 80px;height:30px;border-radius: 50px;border-color:#29a1f2;color:#29a1f2;background-color: #fff;line-height: 10px">` + data[i].statusbtn + `</button>
             </div>
            </div>
          </div>`);
      }
    });
});
