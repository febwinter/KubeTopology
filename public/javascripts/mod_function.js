// 1. request
function migration_request(data, graph, label) {
    var startNode = data.sender["node"];
    sourceNode_global = startNode;
    for (var i of graph.nodes) {
        if (i.id == startNode) {
            i.group = 3;
        }
    }
}
// 2. ack
function migration_ack(data, graph, label) {
    //var targetNode = data
    var migratePods = Object.keys(data.msg);
    for (var i of migratePods) {
        for (var j of graph.nodes) {
            if (j.id == i) {
                j.group = 4;
            }
        }
    }
}
// 3. select
function migration_selected(data, graph, label) {

    var endNode = data.msg["selected_node"];
    targetNode_global = endNode;
    for (var i of graph.nodes) {
        if (i.id == endNode) {
            i.group = 5;
        }
    }
}
// 4. ready
function migration_ready(data, graph, label) {

    origin_global = data.msg['origin_name'];
    var migratePod = data.msg['name'];
    var migrateNode = data.msg['node'];

    graph.nodes.push({
        "id": migratePod,
        "group": 6,
        "size": 10
    });
    graph.links.push({
        "source": migratePod,
        "target": migrateNode
    });
    migratePod_global = migratePod;
}
// 5. start
function migration_start(data, graph, label) {

    for (var i of graph.nodes) {
        if (i.id == sourceNode_global || i.id == targetNode_global) {
            i.group = 7;
        }
    }

}
// 6. complete
function migration_complete(data, graph, label) {
    for (var i of graph.nodes) {
        if (i.id == targetNode_global) {
            i.group = 1;
        } else if (i.id == sourceNode_global) {
            i.group = 1;
        } else if (i.id == migratePod_global) {
            i.group = 2;
        }
    }
    for (var i of graph.nodes) {
        if (i.id == origin_global) {
            var idx = graph.nodes.indexOf(i);
            graph.nodes.splice(idx, 1);
        }
    }
    for (var i of graph.links) {
        if (i.source.id == origin_global || i.target.id == origin_global) {
            var idx = graph.links.indexOf(i);
            graph.links.splice(idx, 1);
        }

    }

    for (var i of label.nodes) {
        if (i.node.id == origin_global) {
            var idx = label.nodes.indexOf(i);
            label.nodes.splice(idx, 2);
        }
    }

    for (var i of label.links) {
        if (i.source.node.id == origin_global || i.target.node.id == origin_global) {
            var idx = label.links.indexOf(i);
            label.links.splice(idx, 1);
        }
    }

}

function resetGraph_generate(graphLayout, labelLayout, graph, label) {

    // Apply the general update pattern to the nodes.
    node = node.data(graph.nodes, function (d) {
        return d.id;
    });
    node.exit().remove();
    node = node.enter().append("circle").attr("r", function (d) {
        return d.size
    }).merge(node).attr("fill", function (d) {
        return color(d.group);
    });

    // Apply the general update pattern to the links.
    link = link.data(graph.links, function (d) {
        return d.source.id + "-" + d.target.id;
    });
    link.exit().remove();
    link = link.enter().append("line").attr("stroke", "#aaa").attr("stroke-width", "1px").merge(link);




    // Update and restart the simulation.

    graphLayout.nodes(graph.nodes);
    graphLayout.force("link").links(graph.links); // added
    graphLayout.alpha(0.1).restart();

    adjlist = [];

    graph.links.forEach(function (d) {
        adjlist[d.source.index + "-" + d.target.index] = true;
        adjlist[d.target.index + "-" + d.source.index] = true;
    });

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
        }

    });

    node.on("mouseover", focus).on("mouseout", unfocus);


    labelNode = labelNode.data(label.nodes, function (d) {
        return d.id;
    });
    labelNode.exit().remove();
    labelNode = labelNode.enter().append("text")
        .text(function (d, i) {
            return i % 2 == 0 ? "" : d.node.id; // name
        })
        .style("fill", "#F6F6F6")
        .style("font-family", "Arial")
        .style("font-size", 10)
        .style("font-weight", "lighter")
        .style("pointer-events", "none").merge(labelNode);

    labelLayout.nodes(label.nodes);
    labelLayout.force("link").links(label.links);
    labelLayout.alpha(0.1).restart();

    node.on("mouseover", focus).on("mouseout", unfocus);

    node.call(
        d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );
}

function resetGraph_color(graphLayout, labelLayout, graph, label) {

    // Apply the general update pattern to the nodes.
    node = node.data(graph.nodes, function (d) {
        return d.id;
    });
    node.exit().remove();
    node = node.enter().append("circle").attr("r", function (d) {
        return d.size
    }).merge(node).attr("fill", function (d) {
        return color(d.group);
    });

    // Apply the general update pattern to the links.
    link = link.data(graph.links, function (d) {
        return d.source.id + "-" + d.target.id;
    });
    link.exit().remove();
    link = link.enter().append("line").attr("stroke", "#aaa").attr("stroke-width", "1px").merge(link);




    // Update and restart the simulation.

    graphLayout.nodes(graph.nodes);
    graphLayout.force("link").links(graph.links); // added
    graphLayout.alpha(0.1).restart();

    adjlist = [];

    graph.links.forEach(function (d) {
        adjlist[d.source.index + "-" + d.target.index] = true;
        adjlist[d.target.index + "-" + d.source.index] = true;
    });

    node.on("mouseover", focus).on("mouseout", unfocus);


    labelNode = labelNode.data(label.nodes, function (d) {
        return d.id;
    });
    labelNode.exit().remove();
    labelNode = labelNode.enter().append("text")
        .text(function (d, i) {
            return i % 2 == 0 ? "" : d.node.id; // name
        })
        .style("fill", "#F6F6F6")
        .style("font-family", "Arial")
        .style("font-size", 10)
        .style("font-weight", "lighter")                                                                                             
        .style("pointer-events", "none").merge(labelNode);

    labelLayout.nodes(label.nodes);
    labelLayout.force("link").links(label.links);
    labelLayout.alpha(0.1).restart();

    node.on("mouseover", focus).on("mouseout", unfocus);

    node.call(
        d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );
}