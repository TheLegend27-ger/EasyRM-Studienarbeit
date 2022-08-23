//Laden des Diagramms aus JSON Datei
function loadJsonFromFile(files) {
    let reader = new FileReader();
    reader.onload = function() {
        console.log(reader.result)
        document.getElementById("mySavedModel").value = reader.result;
        //myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
        const myJSON = JSON.parse(reader.result);
        myDiagram.model.nodeDataArray = myJSON.nodeDataArray
        myDiagram.model.linkDataArray = myJSON.linkDataArray
        console.log(myDiagram.model.linkDataArray)
    };
    reader.readAsText(files[0])
}