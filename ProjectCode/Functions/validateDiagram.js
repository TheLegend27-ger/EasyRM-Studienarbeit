function validateDiagram(validationType, specificValidationData, externalValidationEvent) {
    /*
    Erwartete Struktur für ExternalValidationEvent
    externalValidationEvent = {
        ValidationStatus: $STRING$,
        ErrorMessage: $STRING$
    }
     */

    if (externalValidationEvent && externalValidationEvent.ValidationStatus === "Invalid"){
        throwGenericAlert(externalValidationEvent.ErrorMessage)
    }

    var nodes = myDiagram.model.nodeDataArray;
    var links = myDiagram.model.linkDataArray;

    let validationEvent = {
        ValidationStatus: "Valid",
        ErrorMessage: ""
    }

    switch (validationType) {
        case "Entity": {
            validationEvent = validateEntities(specificValidationData)
        } break;
        case "Relation": {
            validationEvent= validateRelations(specificValidationData)
        } break;
        case "Attribute": {
            validationEvent = validateAttributes(specificValidationData)
        } break;

    }
    console.log(validationEvent)


    if (validationEvent.ValidationStatus === "Invalid"){
        throwGenericAlert(validationEvent.ErrorMessage)
    } else {
        return validationEvent.ValidationStatus
    }
}

// Keine doppelt --- Wird oben über das Switch case getriggert
function validateEntities(tables) {
    //Zieh dir am Besten die Tables aus jsontosimple table. da stehen alle Entities drinne. dann müssen wir nicht doppel drüberiterieren
    //Du kannst aus jsontosimple diese Funktion hier Triggern und die Tabellen dann hier für die Validierung nutzen


    //Bitte Return dieses Objektes mit Vaild/Invalid und entsprechender NAchricht. Bei Invalid wird dann automatisch ein Error getriggert
    let myEntities = []
    let validationEvent = {
        ValidationStatus: "Valid",
        ErrorMessage: "Entitätenfehler"
    }
    tables.forEach(table =>{
        if(myEntities.includes(table.name)){
                validationEvent.ValidationStatus = "Invalid"
                validationEvent.ErrorMessage +=  ": Entität mit dem Namen " + table.name +" ist doppelt vorhanden."
            }else{
                myEntities.push(table.name)
            }
        }
        
    )

    return validationEvent
}

// Keine doppelt
function validateRelations(nodes) {
    //Return "Valid" oder "Invalid"

    //Bitte Return dieses Objektes mit Vaild/Invalid und entsprechender NAchricht. Bei Invalid wird dann automatisch ein Error getriggert
    let myRelations = []
    let validationEvent = {
        ValidationStatus: "Valid",
        ErrorMessage: "Relationfehler"
    }
    nodes.forEach(node =>{
        if(myRelations.includes(node.text) && node.category === "Relation"){
            validationEvent.ValidationStatus = "Invalid"
            validationEvent.ErrorMessage += ": Relation mit dem Namen " + node.text + " ist doppelt vorhanden."
        }else{
            myRelations.push(node.text)
        }
    })


    return validationEvent
}

// Keine doppelt pro Entity
function validateAttributes(tables) {

    let validationEvent = {
        ValidationStatus: "Valid",
        ErrorMessage: ""
    }
    tables.forEach(table =>{
        let myColumns = []
        table.columns.forEach(column =>{
            if (myColumns.includes(column.name)){
                validationEvent.ValidationStatus = "Invalid"
                validationEvent.ErrorMessage += table.name + ": Attribut mit dem Namen " +  column.name + " doppelt vorhanden!"
            }else{
                myColumns.push(column.name)
            }
        })
    })
    return validationEvent
}
