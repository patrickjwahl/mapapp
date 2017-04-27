//highlight buildings

var selectedIcon = null;
var halfSelectedSize = 0;
var locations = {};
var currIcon = 0;

$(document).ready(function() {
  $(".info_entry").hide();
})

$(document).on('click', "#highlight", function(evt) {
  document.body.style.backgroundImage = "url('https://s3.postimg.org/maatu7dib/mit_campus_buildings_1_and_2_highlight.png')";

});

$(document).on('click', "#show_sidebar", function(evt) {
  $("#sidebar").animate({left: 0}, 100);
  setTimeout(function() {
    document.getElementById("show_sidebar").value = "<<<";
    $("#show_sidebar").attr("id", "close_sidebar");
  }, 100);
  
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
  var iden = "ic" + currIcon;
  var source = $(this).attr('src');
  var newImg = $("<img>", {id: iden, src: source, class: "mapicon", draggable: "false"});
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
});

$(document).on('mouseup', '#sidebar, .info_entry', function(evt) {
  stopPropagation();
});

$(document).on('mouseup', '.bkg', function(evt) {
  $('.info_entry').hide();
});


