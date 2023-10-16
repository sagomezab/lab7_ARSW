apiclient = (function(){
var getBlueprintsByAuthor = function(author, callback){
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/blueprints/" + author,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
        callback(data);}
    });
};

var getBlueprintsByNameAndAuthor = function(author, name, callback){
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/blueprints/" + author + "/" + name,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
        callback(data);}
    });
};

var addPoints = function(pointX, pointY, author, bpName){
    var data = JSON.stringify({author:author,"points":[{"x":pointX,"y":pointY}],"name":bpName});
    $.ajax({
        type: "PUT",
        url: "http://localhost:8080/blueprints/" + author + "/" + bpName,
        contentType: "application/json; charset=utf-8",
        data:data,
        dataType: "application/json"
    });
};


var createBlueprint = function(author, blueprintName){
    var data = JSON.stringify({author:author,"points":[],"name":blueprintName});
    return new Promise(function(resolve, reject){
        resolve(
            $.ajax({
                type:"POST",
                url: "http://localhost:8080/blueprints/",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: data
            })
        )})
};

var deleteBlueprint = function(author, blueprintName){
    return new Promise(function(resolve, reject){
        resolve(
            $.ajax({
                type:"DELETE",
                url: "http://localhost:8080/blueprints/" + author + "/" + blueprintName,
            })
        )})
  }

return {
    getBlueprintsByAuthor:getBlueprintsByAuthor,
    getBlueprintsByNameAndAuthor:getBlueprintsByNameAndAuthor,
    addPoints:addPoints,
    createBlueprint:createBlueprint,
    deleteBlueprint:deleteBlueprint
}


})();