function modal(obj){
    console.log(obj.childNodes)
    console.log("Tweet  >>", obj.childNodes[1].value);
    console.log("ID  >>", obj.childNodes[3].value);
    $("#EditTweet").val (obj.childNodes[1].value);
    $("#id").val (obj.childNodes[3].value);
  }
