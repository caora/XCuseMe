var Menu = (function () {
  var that = {},
      TABLE_ID = "1337",
      itemsForOrder = {};

  function init () {
    initButtons();
    initModal();
    initList();
  }

  function initButtons () {
    $('.button-collapse').sideNav();
    $(".list .btn_plus_amount").click(function(event) {
			var foodItemId = $(event.target).parent().attr("id");
      changeAmount(foodItemId, 1);
		});
    $(".list .btn_minus_amount").click(function(event) {
			var foodItemId = $(event.target).parent().attr("id");
      changeAmount(foodItemId, -1);
		});
    $("#btn_order").click(function() {
      prepareOrderModal();
      $('#orderDetailModal').modal('open');
    });
    $("#btn_lucky").click(function() {
      itemsForOrder["pk_7"] = 100;
      prepareOrderModal();
      $('#orderDetailModal').modal('open');
    });


    $("#btn-complete-order").click(function() {
      if (isEmpty(itemsForOrder)) {
        return;
      } else {
        sendOrder();
      }
    });
  }

  function sendOrder() {
    var items = [];
    for (foodId in itemsForOrder) {
      items.push({
        pk: foodId.slice(3),
        amount: itemsForOrder[foodId]
      });
    }
    var completeOrder = {
      tableId: TABLE_ID,
      items: items
    };

    $.ajax({
      type: "POST",
      url: "http://192.168.43.22:8000/orderings/domains/1/locations/1/place",
      data: JSON.stringify(completeOrder),
      success: function(data){alert(data);},
      failure: function(errMsg) {
          alert(errMsg);
      }
    });

  }

  function isEmpty(map) {
   for(var key in map) {
      return !map.hasOwnProperty(key);
   }
   return true;
  }

  function prepareOrderModal() {
    var orderList = document.getElementById("orderList"),
        totalView = document.getElementById("totalPrice"),
        total = 0;

    for (foodId in itemsForOrder) {
      var id = foodId.slice(3);
      var foodName = $("#"+ id + " .name").html();
      var price = parseFloat($("#"+ id + " .price").html()) * itemsForOrder[foodId];
      total += price;
      console.log(foodName);
      var li = document.createElement("li");
      li.className = "collection-item";
      li.innerHTML = foodName + "<span class='badge'>" + itemsForOrder[foodId] + "</span>";
      orderList.appendChild(li);
    }
    totalView.innerHTML = total;
  }


  function initModal() {
    var modalName = $(".modal-name"),
        modalDesc = $(".modal-description");

    $('.list .collection-item').click(function(event) {
      var foodItemId;
      if (event.target.id == "") {
        if (event.target.tagName == "I") {
          return;
        }
        foodItemId = $(event.target).parent().attr("id");
      } else {
        foodItemId = event.target.id;
      }

      modalName.html($("#" + foodItemId + " .name").text());
      modalDesc.html($("#" + foodItemId + " .description").text())
      $('#foodDetailModal').modal('open');
    });
    $('.modal').modal();
    $('.orderModal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%',
      complete: function() {
        $(".modal-orderList").empty();
      } // Callback for Modal close
    });
  }

  function changeAmount(foodItemId, newAmount) {
    var amountView = $("#"+foodItemId + " .amount")[0];
    var oldAmount = parseInt(amountView.innerHTML);
    if (oldAmount === 0 && newAmount === -1) {
      return;
    } else {
      oldAmount += newAmount;
      var updatedAmount = oldAmount;
      amountView.innerHTML = updatedAmount;
    }
    if (itemsForOrder["pk_" + foodItemId]) {
      if (updatedAmount == 0) {
        delete itemsForOrder["pk_" + foodItemId];
      } else {
        itemsForOrder["pk_" + foodItemId] = updatedAmount;
      }
    } else {
      itemsForOrder["pk_" + foodItemId] = updatedAmount;
    }

    console.log(itemsForOrder);
  }

  function initList () {
    var options = {
      valueNames: [ 'name', 'description', 'price' ]
    };

    var menuList = new List('menu', options);
  }

  that.init = init;
  return that;
}());
