function follow (obj) {
  console.log('OBJ >>>>>', obj)
  $.ajax({
    method: 'POST',
    url: '/unfollow',
    data: {friendUsername: obj.id}
  })
    .done(function (data) {
      $('#' + obj.id).attr({onclick: 'unfollow(this)', name: 'unfollow'})
      obj.innerHTML = 'unfollow'
      // console.log("followingcount", data.followingcount)
      $('#followingcountSpan').text(data.followingcount - 1)
    })
}
