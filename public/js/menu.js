var Menu = (function () {
  var that = {},
      itemsForOrder = {};

  function init () {
    initUI();
    initList();
  }

  function initUI () {
    initModal();
    $('.button-collapse').sideNav();
    $(".list .btn_plus_amount").click(function(event) {
			var foodItemId = $(event.target).parent().attr("id");
      changeAmount(foodItemId, 1);
		});
    $(".list .btn_minus_amount").click(function(event) {
			var foodItemId = $(event.target).parent().attr("id");
      changeAmount(foodItemId, -1);
		});
  }

  function initModal() {
    var modalName = $(".modal-name"),
        modalDesc = $(".modal-description");

    $('.collection-item').click(function(event) {
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
