var socket = io.connect('http://192.168.10.220:3100');
console.log('loaded');
socket.on('recMsg', function (data) {
    console.log(data)
    
});

// function myOnClick() {
//     socket.emit("msg", {comment: $('#user').val()});
//     $('#user').val('');
// }