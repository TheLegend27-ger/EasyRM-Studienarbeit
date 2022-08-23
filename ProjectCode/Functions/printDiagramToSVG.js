// print the diagram by opening a new window holding SVG images of the diagram contents for each page
function printDiagramToSVG() {
    let svgWindow = window.open();
    if (!svgWindow) return;  // failure to open a new Window
    let printSize = new go.Size(700, 960);
    let bnds = myDiagram.documentBounds;
    let x = bnds.x;
    let y = bnds.y;
    while (y < bnds.bottom) {
        while (x < bnds.right) {
            let svg = myDiagram.makeSvg({ scale: 1.0, position: new go.Point(x, y), size: printSize });
            svgWindow.document.body.appendChild(svg);
            x += printSize.width;
        }
        x = bnds.x;
        y += printSize.height;
    }
    setTimeout(() => svgWindow.print(), 1);
}