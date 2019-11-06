exports.test = function () {
    const k8s = require('@kubernetes/client-node');
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    const v1 = kc.makeApiClient(k8s.CoreV1Api);

    var data1 = v1.listNode('default').then((res) => res.body);
    var data2 = v1.listPodForAllNamespaces('default').then((res) => res.body);

    var data = Promise.all([data1, data2]).then((res) => {
        Nodes = res[0];
        Pods = res[1];
        //console.log(Pods.items);

        var dataTotal = new Object();
        var nodeList = new Array();
        var linkList = new Array();
        var tempNode = new Array();
        var masterName = "";

        for (var i of Nodes.items) {
            if (i.metadata.labels['nodetype'] == 'master') {
                nodeList.push({
                    "id": i.metadata.name,
                    "group": 0,
                    "size": 40
                });
                masterName = i.metadata.name;
            } else {
                if (i.spec.taints != null && i.spec.taints[0].key.includes('unreachable') != false) {
                    continue;
                } else {
                    nodeList.push({
                        "id": i.metadata.name,
                        "group": 1,
                        "size": 30
                    });
                    linkList.push({
                        "source": i.metadata.name,
                        "target": masterName
                    });
                }
            }
            tempNode.push(i.metadata.name);
        }

        for (var i of Pods.items) {
            if (tempNode.indexOf(i.spec.nodeName) == -1) {
                continue;
            } else {
                nodeList.push({
                    "id": i.metadata.name,
                    "group": 2,
                    "size": 10
                });
                linkList.push({
                    "source": i.metadata.name,
                    "target": i.spec.nodeName
                });
                //console.log('active');
            }
        }

        dataTotal.nodes = nodeList;
        dataTotal.links = linkList;

        return JSON.stringify(dataTotal,null,4);
    });

    return data;
}