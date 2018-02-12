 function unfollow(obj){
  // console.log("<<<<< OBJ >>>>>>>>>>", obj);
   $.ajax({
        method: "POST",
        url: "/follow",
        data: {friendUsername : obj.id}
       })
       .done(function( data ) {
        $("#"+obj.id).attr({onclick : "follow(this)", name : "follow"});
        obj.innerHTML = "follow";
        console.log("data.followingcount", data.followingcount)
        // console.log("<<<<< OBJ >>>>>>>>>>", obj);
        $("#followingcountSpan").text(data.followingcount-1)
       });
 }
