//initiales Laden der im HTML definierten Standard-Diagrammvorlage
function loadStandardDiagram() {
    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
}