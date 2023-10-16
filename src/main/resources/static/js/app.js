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
        clearCanva();
        author = $("#author").val();
        point = [];
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
        point = [];
        author = $("#author").val();
        blueprintName = data.id;
        $("#titleCanva").text("Current Blueprint: " + blueprintName);
        api.getBlueprintsByNameAndAuthor(author, blueprintName, draw);
    }

    function clearCanva(){
        can = document.getElementById("canvita");
        ctx = can.getContext("2d");
        ctx.clearRect(0, 0, can.width, can.height);
    }

    function draw (blueprint){
        clearCanva();
        can = document.getElementById("canvita");
        ctx = can.getContext("2d");
        ctx.beginPath();
        var plano = blueprint.points;
        console.log(plano);
        if (blueprint && blueprint.points && blueprint.points.length > 0) {
            
            var temp = [];
            for (let i = 0; i < plano.length; i++) {
                temp[i] = plano[i];
            }
            point.forEach((element) => {
                temp.push(element);
            });
            console.log(temp);
            var blueprintsPoints = temp.slice(1, temp.length);
            var initx = blueprint.points[0].x;
            var inity = blueprint.points[0].y;
            blueprintsPoints.forEach((element) => {
                ctx.moveTo(initx, inity);
                ctx.lineTo(element.x, element.y);
                ctx.stroke();
                initx = element.x;
                inity = element.y;
            });
        } else {
            console.error("Blueprint or blueprint.points is undefined or empty.");
        }
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

    function updateNameAuthor(){
        api.getBlueprintsByAuthor(author, tableData)
    }

    async function addPoints(){
        if (author !== "" && blueprintName !== undefined && point.length > 0) {
            for (var i = 0; i < point.length; i++) {
                var x = point[i].x;
                var y = point[i].y;
                console.log(x);
                console.log(y);
                await api.addPoints(x, y, author, blueprintName);
            }
        } else {
            alert("No hay puntos para agregar o no se ha seleccionado un plano.");
        }
    }

    function createBlueprint(){
        clearCanva();
        var bpName = prompt("Name of the new blueprint.");
        api.createBlueprint(author, bpName).then(() => {
            getBlueprintsByAuthor();
        })  
        .catch(err => console.log(err))
    }

    function deleteBlueprint(){
        clearCanva();
        apiclient.deleteBlueprint(author, blueprintName).then(() => {
            getBlueprintsByAuthor();
        })
        .catch(err => console.log(err))
    }

    return {
        init:init,
        getBlueprintsByAuthor:getBlueprintsByAuthor,
        updateNameAuthor:updateNameAuthor,
        getBlueprintsByNameAndAuthor:getBlueprintsByNameAndAuthor,
        addPoints:addPoints,
        createBlueprint:createBlueprint,
        deleteBlueprint:deleteBlueprint
    }

})();