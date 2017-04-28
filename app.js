//highlight buildings

var selectedIcon = null;
var halfSelectedSize = 0;
var locations = {};
var currIcon = 0;

$(document).ready(function() {
  $(".info_entry").hide();
})

$(document).on('click', "#show_sidebar", function(evt) {
  $("#sidebar").animate({left: 0}, 100);
  setTimeout(function() {
    document.getElementById("show_sidebar").value = "<<<";
    $("#show_sidebar").attr("id", "close_sidebar");
  }, 100);
  
});

$(document).on('click', '#delete', function(evt) {
	$("#iden").remove();
});

$(document).on('click', '#info_check', function(evt) {
	if ($("#info_check").prop("checked")) {
  	$(".info_clone").show();
  } else {
    $(".info_clone").hide();
  }
});

$(document).on('click', '#restroom_check', function(evt) {
	if ($("#restroom_check").prop("checked")) {
  	$(".restroom_clone").show();
  } else {
    $(".restroom_clone").hide();
  }
});

$(document).on('click', "#close_sidebar", function(evt) {
  $("#sidebar").animate({left: "-18%"}, 100);
  setTimeout(function() {
    document.getElementById("close_sidebar").value = ">>>";
    $("#close_sidebar").attr("id", "show_sidebar");
  }, 100);
});

$(document).on('mousedown', '.icon', function(evt) {
  $(this).attr('draggable', 'false');
  var iden = $(this).attr("id") + currIcon;
  var cl = $(this).attr("id") + "_clone";
  var source = $(this).attr('src');
  var newImg = $("<img>", {id: iden, src: source, class: cl + " mapicon", draggable: "false"});
  $("body").append(newImg);
  var cursorX = evt.pageX;
  var cursorY = evt.pageY;
  var halfIconSize = newImg.width() / 2;
  var newLeft = cursorX - halfIconSize;
  var newTop = cursorY - halfIconSize;
  newImg.css({
    left: newLeft,
    top: newTop
  });
  selectedIcon = newImg;
  halfSelectedSize = halfIconSize;
});

$(document).on('mousemove', function(evt) {
  if (selectedIcon != null) {
    var cursorX = evt.pageX;
    var cursorY = evt.pageY;
    var newLeft = cursorX - halfSelectedSize;
    var newTop = cursorY - halfSelectedSize;
    selectedIcon.css({
      left: newLeft,
      top: newTop
    });
  }
});

$(document).on('mouseup', '.mapicon', function(evt) {
  selectedIcon = null;
  $(this).hide();
  var $under = $(document.elementFromPoint(evt.pageX, evt.pageY));
  $(this).show();
  if ($under.hasClass("bkg")) {
    $(this).css('z-index', '3');
    $(".info_entry").css({
      left: evt.pageX,
      top: evt.pageY
    })
    $(".info_entry").show();
  } else {
    $(this).remove();
  }
  evt.stopPropagation();
  //TODO: Generate a new info entry every time an icon is added so that they all have their own dedicated entry
  /*var info_entry = document.createElement("div");
  var del = document.createElement("input");
  var name_label = document.createElement("label");
  var name_text = document.createElement("input");
  var address_label = document.createElement("label");
  var address_text = document.createElement("input");
  var save = document.createElement("input");*/
});

$(document).on('mouseup', '#sidebar, .info_entry', function(evt) {
  evt.stopPropagation();
});

$(document).on('mouseup', '.bkg', function(evt) {
  $('.info_entry').hide();
});
