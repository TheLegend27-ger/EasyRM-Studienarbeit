//Multiplizitäten prüfen
function checkLinkMultiplicity(text) {
    try{
        text = text.replaceAll(' ', '')
        text = text.toUpperCase()

        if (parseInt(text) > 1 || text === "M" || text === "N") {
            //Wenn Zahl für parseInt zu groß, dann evt Fehler werfen?!
            return true
        }
    }catch{
        
    }
    return
}