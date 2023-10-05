app = (function(){
    var author;
    var apic = apiclient;
    var apicm = apimock;
    var api = apic;

    function getName() {
        $("#nameTable").text(author + "'s " + "blueprints:");
    }

    function getBlueprintsByAuthor() {
        author = $("#author").val();
        api.getBlueprintsByAuthor(author,tableData);
    }

    var tableData = function(data) {
        $("#blueprintsTable tbody").empty();
        if (data == undefined){
            alert("The author doesn't exist")
        }
        getName();
        const newRow = data.map((element) => {
            return {
                authorName: element.name,
                points: element.points.length
            }
        });

        newRow.map((elements) => {
            $("#blueprintsTable > tbody:last").append($("<tr><td>" + elements.authorName + "</td><td>" + elements.points.toString() +
                "</td><td>" + "<button  id=" + elements.authorName + " onclick=app.getBlueprintsByNameAndAuthor(this)>open</button>" + "</td>"));
        });

        const total = newRow.reduce((suma, {points}) => suma + points, 0);

        $("#points").text(total);
        
    }

    function getBlueprintsByNameAndAuthor(data){
        author = $("#author").val();
        blueprintName = data.id;
        $("#titleCanva").text("Current Blueprint: " + blueprintName);
        api.getBlueprintsByNameAndAuthor(author, blueprintName, draw);
    }

    function draw (data){
        const puntos = data.points;
        var c = document.getElementById("canvita");
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.restore();
        ctx.beginPath();
        for (let i = 1; i < puntos.length; i++) {
            ctx.moveTo(puntos[i - 1].x, puntos[i - 1].y);
            ctx.lineTo(puntos[i].x, puntos[i].y);
            if (i === puntos.length - 1) {
                ctx.moveTo(puntos[i].x, puntos[i].y);
                ctx.lineTo(puntos[0].x, puntos[0].y);
            }
        }
        ctx.stroke();
    }

    return {
        getBlueprintsByAuthor:getBlueprintsByAuthor,
        getBlueprintsByNameAndAuthor:getBlueprintsByNameAndAuthor
    }

})();