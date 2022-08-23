function init() {
      // init for these samples -- you don't need to call this

    const $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram =
        $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
            {
                "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
                "LinkRelinked": showLinkLabel,
                "undoManager.isEnabled": true  // enable undo & redo
            });

    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", e => {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
            if (idx < 0) document.title += "*";
        } else {
            if (idx >= 0) document.title = document.title.substr(0, idx);
        }
    });

    // helper definitions for node templates

    function nodeStyle() {
        return [
            // The Node.location comes from the "loc" property of the node data,
            // converted by the Point.parse static method.
            // If the Node.location is changed, it updates the "loc" property of the node data,
            // converting back using the Point.stringify static method.
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {
                // the Node.location is at the center of each node
                locationSpot: go.Spot.Center
            }
        ];
    }

    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId,
    // the "align" is used to determine where to position the port relative to the body of the node,
    // the "spot" is used to control how links connect with the port and whether the port
    // stretches along the side of the node,
    // and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
    function makePort(name, align, spot, output, input) {
        var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
        // the port is basically just a transparent rectangle that stretches along the side of the node,
        // and becomes colored when the mouse passes over it
        return $(go.Shape,
            {
                fill: "transparent",  // changed to a color in the mouseEnter event handler
                strokeWidth: 0,  // no stroke
                width: horizontal ? NaN : 8,  // if zzzCxcommand stretching horizontally, just 8 wide
                height: !horizontal ? NaN : 8,  // if zzzCxcommand stretching vertically, just 8 tall
                alignment: align,  // align the port on the main Shape
                stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
                portId: name,  // declare this object to be a "port"
                fromSpot: spot,  // declare where links may connect at this port
                fromLinkable: output,  // declare whether the user may draw links from here
                toSpot: spot,  // declare where links may connect at this port
                toLinkable: input,  // declare whether the user may draw links to here
                cursor: "pointer",  // show a different cursor to indicate potential link point
                mouseEnter: (e, port) => {  // the PORT argument will be this Shape
                    if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
                },
                mouseLeave: (e, port) => port.fill = "transparent"
            });
    }

    function textStyle() {
        return {
            font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
            stroke: "#F8F8F8"
        }
    }

    // Node Template definitions

    //contextMenu
    // This is the actual HTML context menu:
    var cxElement = document.getElementById("contextMenu");

    // an HTMLInfo object is needed to invoke the code to set up the HTML cxElement
    var myContextMenu = $(go.HTMLInfo, {
        show: showContextMenu,
        hide: hideContextMenu
    });



    //region Default
    myDiagram.nodeTemplateMap.add("",  // the default category
        $(go.Node, "Table",{ contextMenu: myContextMenu }, nodeStyle(),
            {
                linkValidation: function (fromnode, fromport, tonode, toport) {
                    // total number of links connecting with all ports of a node is limited to 1:
                    console.log("TOP")
                    return checkNodeCategoryType(fromnode, fromport, tonode, toport);
                }
            },
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $(go.Panel, "Auto",
                $(go.Shape, "Rectangle",
                    { fill: "#282c34", stroke: "#00A9C9", strokeWidth: 3.5 },
                    new go.Binding("figure", "figure")),
                $(go.TextBlock, textStyle(),
                    {
                        margin: 8,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            ),
            // four named ports, one on each side:
            makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
            makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
            makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
            makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
        ));
    //endregion

    //region Entity
    myDiagram.nodeTemplateMap.add("Entity",
        $(go.Node, "Table",{contextMenu: myContextMenu}, nodeStyle(),
            {
                // Zusaetzliche Validierungsfunktion
                linkValidation: function (fromnode, fromport, tonode, toport) {
                    return checkNodeCategoryType(fromnode, fromport, tonode, toport);
                }
            },
            // Hauptobjekt ist ein Panel, dass ein beschriftetes Rechteck umschliesst
            $(go.Panel, "Auto",
                $(go.Shape, "Rectangle",
                    { desiredSize: new go.Size(120, 60),fill: "#282c34", stroke: "#00A9C9", strokeWidth: 3.5 },
                    new go.Binding("figure", "figure")),
                $(go.TextBlock, textStyle(),
                    {
                        margin: 8,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            ),
            // Erstellen der Verbindungsports fue jede Seite:
            makePort("T", go.Spot.Top, go.Spot.TopSide, true, true),
            makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
            makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
            makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, true)
        ));
    //endregion
    console.log(myDiagram.nodeTemplate.contextMenu)
    myDiagram.nodeTemplate.contextMenu = myContextMenu
    console.log(myDiagram.nodeTemplate.contextMenu)

    //region Relation
    myDiagram.nodeTemplateMap.add("Relation",
        $(go.Node, "Table",{contextMenu: myContextMenu}, nodeStyle(),
            { linkValidation: function (fromnode, fromport, tonode, toport) {
        let mykey
        let myReturn = true
        let otherkey
        let counter = 0
        if (!checkNodeCategoryType(fromnode, fromport, tonode, toport)){
            console.log("1")
            return false
        }
        if (fromnode.category === "Relation"){
            console.log("from")
            mykey = fromnode.key
            otherkey = tonode.key
        }
        if (tonode.category === "Relation"){
            console.log("to")
            mykey = tonode.key
            otherkey = fromnode.key

            console.log(mykey)
        }
        let links = myDiagram.model.linkDataArray
        let nodes = myDiagram.model.nodeDataArray
        console.log(links)
        console.log(nodes)

        links.forEach(link =>{
            if (link.from === mykey && link.to === otherkey){
                myReturn = false
                console.log("1")
            }
            if (link.to === mykey && link.from === otherkey){
                myReturn = false
                console.log("2")
            }
            if ((link.from === mykey || link.to === mykey) && (link.from === otherkey || link.to === otherkey)){
                myReturn = false
                console.log("3")
            }

            if (link.to === mykey && nodes.find(node => (node.key === link.from && node.category === "Entity")) || link.from === mykey && nodes.find(node => (node.key === link.to && node.category === "Entity")) ){
                counter++
            }
            if (counter > 1 &&  (fromnode.category === "Entity" || tonode.category === "Entity")) {
                myReturn = false
                console.log(counter)
            }
        })

        return myReturn

    }
},

            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $(go.Panel, "Auto",{contextMenu: myContextMenu},
                $(go.Shape, "Diamond",
                    {
                        portId: "",  // now the Shape is the port, zzzCxcommand the whole Node
                        desiredSize: new go.Size(120, 60),
                        fill: "#282c34",
                        stroke: "#00A9C9",
                        strokeWidth: 3.5
                    },
                    new go.Binding("figure", "figure")),
                $(go.TextBlock, textStyle(),
                    {
                        margin: 8,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            ),

            // four named ports, one on each side:
            makePort("T", go.Spot.Top, go.Spot.Top, true, true),
            makePort("L", go.Spot.Left, go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, true)
        ));
    //endregion


    function changePrimary(e, obj){
        console.log(e)
        console.log(obj)

    }
    // region Attribute
    myDiagram.nodeTemplateMap.add("Attribute",
        $(go.Node, "Table" , nodeStyle(),
            {
                linkValidation: function (fromnode, fromport, tonode, toport) {
                    // total number of links connecting with all ports of a node is limited to 1:
                    if (
                        checkNodeCategoryType(fromnode, fromport, tonode, toport) &&
                        (
                            (
                                fromnode.category === "Attribute" &&
                                fromnode.linksConnected.count < 1
                            ) ||
                            (
                                tonode.category === "Attribute" &&
                                tonode.linksConnected.count < 1
                            )
                        )
                    ){
                         return true
                    } else
                    {
                        return false
                    }
                }
            },
            $(go.Panel, "Spot",{ name: "Attribute"},
                $(go.Shape, "Ellipse",
                    {
                        portId: "",  // now the Shape is the port, zzzCxcommand the whole Node
                        desiredSize: new go.Size(120, 60),
                        fill: "#282c34",
                        stroke: "#09d3ac",
                        strokeWidth: 3.5 }),
                $(go.TextBlock, textStyle(),
                    {
                        margin: 8,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            ),
            // three named ports, one on each side except the top, all output only:
            makePort("L", go.Spot.Left, go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, true),
            makePort("T", go.Spot.Top, go.Spot.Top, true, true)
        ));
    //endregion

    //Labelvalidierung wir wollen M/m N/n oder zahlen > 0
    function validateLabel(textblock, oldstr, newstr) {
        var pattern = new RegExp('^([MmNn]{1}$|[0-9])');
        return pattern.test(newstr)
        //return newstr === "M" || newstr === "N" || newstr === "1" || newstr === "0"  ;
    }

    //region linkTemplate
    myDiagram.linkTemplate = $(go.Link,
        $(go.Shape),
        $(go.Panel, "Auto", /*{ contextMenu: myContextMenu },*/ // the link label, normally zzzCxcommand visible
            { visible: false, name: "LABEL"},
            new go.Binding("visible", "visible").makeTwoWay(),
            $(go.Shape, "RoundedRectangle",  // the label shape
                { fill: "#F8F8F8", strokeWidth: 0 }),
            $(go.TextBlock, "1",  // the label
                {
                    textAlign: "center",
                    font: "10pt helvetica, arial, sans-serif",
                    stroke: "#333333",
                    editable: true,
                    textValidation: validateLabel
                },
                new go.Binding("text").makeTwoWay())

        )
    );
    //endregion





    //TRY CATCH FÜR LABELERKENNUNG
    function showContextMenu(obj, diagram, tool) {
        function maybeShowItem(elt, pred) {
            if (pred) {
                elt.style.display = "block";
                hasMenuItem = true;
            } else {
                elt.style.display = "none";
            }
        }
        console.log(obj.name)
        let contextType = ""
        try{
            if (obj.name && obj.name === "LABEL"){
                contextType = "LINKLABEL"
                tempBuffer(obj)
            }

            if (obj.name && obj.name === "Attribute"){
                contextType = "Attribute"
                tempBuffer(obj)
            }
        }catch{}

        // Show only the relevant buttons given the current state.
        var cmd = diagram.commandHandler;
        var hasMenuItem = false;
        console.log(contextType)
        switch (contextType) {
            case "LINKLABEL":
                maybeShowItem(document.getElementById("one"), true);
                maybeShowItem(document.getElementById("two"), true);
                break;
            case "Entity":
                break;
            case "Relation":
                break;
            case "Attribute":
                maybeShowItem(document.getElementById("makePrimary"), true);
        }

        // Now show the whole context menu element
        if (hasMenuItem) {
            cxElement.classList.add("show-menu");
            // we don't bother overriding positionContextMenu, we just do it here:
            var mousePt = diagram.lastInput.viewPoint;
            cxElement.style.left = mousePt.x + 160 + "px";
            cxElement.style.top = mousePt.y + 70 + "px";
        }

        // Optional: Use a `window` pointerdown listener with event capture to
        //           remove the context menu if the user clicks elsewhere on the page
        window.addEventListener("pointerdown", hideCX, true);
    }

    function hideContextMenu() {
        cxElement.classList.remove("show-menu");
        // Optional: Use a `window` pointerdown listener with event capture to
        //           remove the context menu if the user clicks elsewhere on the page
        window.removeEventListener("pointerdown", hideCX, true);
    }





    // Make link labels visible if coming out of a "conditional" node.
    // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
    function showLinkLabel(e) {
        let label = e.subject.findObject("LABEL");
        //label.from = e.subject.fromNode.key
        //label.to = e.subject.toNode.key
        //label.mylink = e.subject

        //console.log("HALLO --->" ,  label.from, label.to)
        if (label !== null){
            label.visible = ((e.subject.fromNode.data.category === "Relation" || e.subject.toNode.data.category === "Relation") && ((e.subject.fromNode.data.category === "Entity" || e.subject.toNode.data.category === "Entity")));
        }
        //console.log(e)
    }

    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Normal;
    myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Normal;

    loadStandardDiagram();  // loadStandardDiagram an initial diagram from some JSON text

    //region Palette
    myPalette =
        $(go.Palette, "myPaletteDiv",
            {
                "animationManager.initialAnimationStyle": go.AnimationManager.None,
                "InitialAnimationStarting": animateFadeDown,
                nodeTemplateMap: myDiagram.nodeTemplateMap,
                model: new go.GraphLinksModel([ //Definieren der möglichen Elemente in der Palette
                    { category: "Entity", text: "Entity" },
                    { category: "Attribute", text: "Attribute" },
                    { category: "Relation", text: "Relation" },
                ])
            });
    //endregion

    // This is a re-implementation of the default animation, except it fades in from downwards, instead of upwards.
    function animateFadeDown(e) {
        var diagram = e.diagram;
        var animation = new go.Animation();
        animation.isViewportUnconstrained = true; // So Diagram positioning rules let the animation start off-screen
        animation.easing = go.Animation.EaseOutExpo;
        animation.duration = 900;
        // Fade "down", in other words, fade in from above
        animation.add(diagram, 'position', diagram.position.copy().offset(0, 200), diagram.position);
        animation.add(diagram, 'opacity', 0, 1);
        animation.start();
    }
} // end init

//kann evt weg
var tempBuff
function tempBuffer(myBuff){
    console.log(myBuff)
    if (myBuff){
        tempBuff = myBuff
    }else{
        return tempBuff
    }
}

window.addEventListener('DOMContentLoaded', init);