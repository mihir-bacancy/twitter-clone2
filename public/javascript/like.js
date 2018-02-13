function like (obj) {
  console.log(obj);
  let like = obj.id;
  let name = parseInt(obj.name) + 1;
  $.ajax({
    method: 'POST',
    url: '/like',
    data: { _id: like }
  })
    .done(function (data) {
      console.log('>>>', data);

      $('#' + like).attr({src: 'images/twitterunLike.png', onclick: 'unlike(this)'});
      $('#cnt' + like).text(data.likercount);
    });
}
