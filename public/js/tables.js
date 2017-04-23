$('.btn-table-confirm').click(function(e) {
    console.log($(this).parent().attr("orderId"));
    /*
    var t = $(this);
    $.ajax("http://"+IP_FABI+":8000/orderings/domains/" + t.attr("restaurantId") + "/orders/" + t.attr("orderId") + "/update");
    */
});
$('.btn-table-done').click(function(e) {
    console.log($(this).parent().attr("tableNo"));
});