function checkNodeCategoryType(fromnode, fromport, tonode, toport) {
    //console.log(fromnode +"   "+  tonode)
    return fromnode.category !== tonode.category;
}