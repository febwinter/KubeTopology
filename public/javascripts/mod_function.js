function migration_request(data, graph, label) {
    var startNode = data.sender["node"];
    //console.log(graph);
    for (var i of graph.nodes) {
        if (i.id == startNode) {
            i.group = 3;
        }
    }

}

function migration_ack(data, graph, label) {

}

function migration_selected(data, graph, label) {


}

function migration_ready(data, graph, label) {

    var migratePod = data.msg['name'];
    var migrateNode = data.msg['node'];

    graph.nodes.push({
        "id": migratePod,
        "group": 5,
        "size": 10
    });
    graph.links.push({
        "source": migratePod,
        "target": migrateNode
    });
    migratePod_global = migratePod;
    //console.log(label.nodes);
    //console.log(label.links);
}

function migration_start(data, graph, label) {

}

function migration_complete(data, graph, label) {

}

function resetGraph(graphLayout, labelLayout, graph, label) {

    // Apply the general update pattern to the nodes.
    node = node.data(graph.nodes, function (d) {
        return d.id;
    });
    node.exit().remove();
    node = node.enter().append("circle").attr("fill", function (d) {
        return color(d.group);
    }).attr("r", function (d) {
        return d.size
    }).merge(node);

    // Apply the general update pattern to the links.
    link = link.data(graph.links, function (d) {
        return d.source.id + "-" + d.target.id;
    });
    link.exit().remove();
    link = link.enter().append("line").attr("stroke", "#aaa").attr("stroke-width", "1px").merge(link);




    // Update and restart the simulation.

    graphLayout.nodes(graph.nodes);
    graphLayout.force("charge", d3.forceManyBody().strength(-3000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(1))
        .force("y", d3.forceY(height / 2).strength(1))
        .force("link", d3.forceLink(graph.links).id(function (d) {
            return d.id;
        }).distance(function (i, d) {
            if (i.source.id.indexOf('edge') !== -1) {
                return 150;
            } else {
                // console.log(i.source.id)
                return 50;
            }
        }).strength(1))
        .on("tick", ticked);

    graphLayout.alpha(1).restart();
    //graphLayout.on("tick", ticked);

    graph.links.forEach(function (d) {
        adjlist[d.source.index + "-" + d.target.index] = true;
        adjlist[d.target.index + "-" + d.source.index] = true;
    });

    node.call(
        d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

    graph.nodes.forEach(function (d, i) {
        if (d['id'] == migratePod_global) {
            label.nodes.push({
                node: d
            });
            label.nodes.push({
                node: d
            });
            label.links.push({
                source: i * 2,
                target: i * 2 + 1
            });
            console.log(d['id']);
        }

    });

    labelNode = labelNode.data(label.nodes, function (d) {
        return d.id;
    });
    labelNode.exit().remove();
    labelNode = labelNode.enter().append("text")
        .text(function (d, i) {
            return i % 2 == 0 ? "" : d.node.id; // name
        })
        .style("fill", "#555")
        .style("font-family", "Arial")
        .style("font-size", 12)
        .style("pointer-events", "none");

    labelLayout.nodes(label.nodes);
    labelLayout.force("charge", d3.forceManyBody().strength(-50))
        .force("link", d3.forceLink(label.links).distance(0).strength(2));
    labelLayout.restart();

    node.on("mouseover", focus).on("mouseout", unfocus);

    //console.log(label.nodes);
}