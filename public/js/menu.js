var Menu = (function () {
  var that = {},
      TABLE_ID,
      API_TOKEN,
      itemsForOrder = {},
      drinksIds = [1, 8],
      IP_Fabi = "192.168.43.118";

  function init (token, tableId) {
    API_TOKEN = token;
    TABLE_ID = tableId;
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
      itemsForOrder["pk_1"] = 100;
      $("#1 .amount").html("100");
      prepareOrderModal();
      $('#orderDetailModal').modal('open');
    });
    $("#btn_random").click(function() {
      var randomID = drinksIds[Math.floor(Math.random()*drinksIds.length)];
      itemsForOrder["pk_"+randomID] = 1;
      $("#" + randomID + " .amount").html("1");
      prepareOrderModal();
      $('#orderDetailModal').modal('open');
    });
    $("#btn_reset").click(function() {
      $(".amount").text("0");
      itemsForOrder = {};
      $('.button-collapse').sideNav('hide');
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
      "api-token": API_TOKEN,
      tableId: TABLE_ID,
      items: items
    };

    $.ajax({
      type: "POST",
      url: "http://"+IP_Fabi+":3000/makeOrder",
      data: JSON.stringify(completeOrder),
      success: function(data){alert(data);},
      failure: function(errMsg) {
          alert(errMsg);
      }
    });

    // $.ajax({
    //   type: "POST",
    //   url: "http://"+IP_FABI+":8000/orderings/domains/1/locations/1/place",
    //   data: JSON.stringify(completeOrder),
    //   success: function(data){alert(data);},
    //   failure: function(errMsg) {
    //       alert(errMsg);
    //   }
    // });

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
      var price = parseFloat($("#"+ id + " .price").html()).toFixed(2) * itemsForOrder[foodId];
      total += price;
      console.log(foodName);
      var li = document.createElement("li");
      li.className = "collection-item";
      li.innerHTML = foodName + "<span class='badge'>" + itemsForOrder[foodId] + "</span>";
      orderList.appendChild(li);
    }
    totalView.innerHTML = total.toFixed(2);
  }


  function initModal() {
    var modalName = $(".modal-name"),
        modalDesc = $(".modal-description"),
        modalPrice = $(".modal-price"),
        modalImg = document.getElementsByClassName("modal-img")[0],
        modalContent = document.getElementsByClassName("modal-content")[0];

    $('.list .collection-item').click(function(event) {
      var foodItemId,
          tagList;
      if (event.target.id == "") {
        if (event.target.tagName == "I") {
          return;
        }
        foodItemId = $(event.target).parent().attr("id");
      } else {
        foodItemId = event.target.id;
      }
      tagList = $(".tags" + foodItemId);
      console.log(tagList.children());

      for (var i = 0; i < tagList.children().length; i++) {
        var div = document.createElement("div");
        div.className = "chip";
        div.innerHTML = tagList.children()[i].innerHTML;
        modalContent.appendChild(div);
      }

      modalImg.src = "/images/" + $("#" + foodItemId + " .name").text().trim() + ".jpg";
      modalPrice.html($("#" + foodItemId + " .price").text());
      modalName.html($("#" + foodItemId + " .name").text());
      modalDesc.html($("#" + foodItemId + " .description").text());

      $('#foodDetailModal').modal('open');
    });
    $('.modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%',
      complete: function() {
        $(".chip").remove();
      } // Callback for Modal close
    });
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
