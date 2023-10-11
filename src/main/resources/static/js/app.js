app = (function(){
    var author;
    var point = [];
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

    function draw (blueprint){
        can = document.getElementById("canvita");
        ctx = can.getContext("2d");
        ctx.beginPath();
        var plano = blueprint.points;
        var temp =[];
        for (let i = 0; i < plano.length; i++) {
            temp[i] = plano[i]
        }
        point.forEach((element) => {
            temp.push(element);
        })
        blueprintsPoints = temp.slice(1, temp.length);
        initx = blueprint.points[0].x;
        inity = blueprint.points[0].y;
        blueprintsPoints.forEach((element) => {
        ctx.moveTo(initx, inity);
        ctx.lineTo(element.x, element.y);
        ctx.stroke();
        initx = element.x;
        inity = element.y;
        });
    }

    function mousePos(canvas, evt){
        var ClientRect = canvas.getBoundingClientRect();
        return { 
            x: Math.round(evt.clientX - ClientRect.left),
            y: Math.round(evt.clientY - ClientRect.top)
        }
    }

    function init (){
        var canvas = document.getElementById("canvita"),
            context = canvas.getContext("2d");

        if(window.PointerEvent) {
            canvas.addEventListener("pointerdown", function(event){
                if(author !== "" && blueprintName !== undefined){

                    raton = mousePos(canvas,event)
                    point.push({"x": raton.x, "y":raton.y});
                    apic.getBlueprintsByNameAndAuthor(author,blueprintName , draw);
                }else {
                    alert("No blueprint has been selected.")
                }


            });
        }
    }

    return {
        init:init,
        getBlueprintsByAuthor:getBlueprintsByAuthor,
        getBlueprintsByNameAndAuthor:getBlueprintsByNameAndAuthor
    }

})();