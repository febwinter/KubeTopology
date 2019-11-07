var socket = io.connect('http://192.168.10.220:3100');
//console.log('loaded');
socket.on('recMsg', function (data) {
    //console.log(data['status']);
    if (data['status'] == 'MIGRATION_REQUEST')
    {   
        migration_request(data, graph, label);
        resetGraph_color(graphLayout,labelLayout, graph,label);
        
    } else if (data['status'] == 'MIGRATION_ACK') {
        migration_ack(data, graph, label);
        resetGraph_color(graphLayout,labelLayout, graph,label);

    } else if (data['status'] == 'MIGRATION_SELECTED') {
        migration_selected(data, graph, label);
        resetGraph_color(graphLayout,labelLayout, graph,label);
        
    } else if (data['status'] == 'MIGRATION_READY') {
        //console.log('dingdong');
        migration_ready(data, graph, label);
        resetGraph_generate(graphLayout,labelLayout, graph,label);
        
    } else if (data['status'] == 'MIGRATION_START') {
        migration_start(data, graph, label);
        resetGraph_color(graphLayout,labelLayout, graph,label);
        
    } else if (data['status'] == 'MIGRATION_COMPLETE') {
        migration_complete(data, graph, label);
        resetGraph_color(graphLayout,labelLayout, graph,label)
        
    }
    
});