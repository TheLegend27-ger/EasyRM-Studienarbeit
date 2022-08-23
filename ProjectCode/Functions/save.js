//Speichern des Diagramms als JSON Datei
function save() {
    createJsonArrayFromModels()
    createAndDownloadFile(myDiagram.model.toJson(), 'json.EasyRM', 'text/plain');
    myDiagram.isModified = false;
}