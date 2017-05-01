//highlight buildings

var state = 0;
var selectedIcon = null;
var clickedIcon = null;
var mouseMoved = false;
var halfSelectedSize = 0;
var halfIconSize = 12.5;
var locations = {};
var currIcon = 0;
var oldX = 0;
var oldY = 0;
var moveClicked = false;
var gType = '';
var zoomLevel = 0;
var mouseMap = false;
var oMouseX, oMouseY, oMapLeft, oMapTop;
var locClicked = false;
var checked = {};

var icons = {
  "info": ["https://s13.postimg.org/rtyfxbsvr/info_icon.png", "Information"],
  "restroom": ["http://i.imgur.com/0S1StJM.png", "Restrooms"],
  "random": ["rando.jpg", "Random"]
}

$(document).ready(function() {
  for (key in icons) {
    checked[key] = true;
    $('#sidebar').append('<img src="' + icons[key][0] + '" class="icon" id="' + key + '" alt="icon">');
  }
});

$(document).on('click', '#new-button, #tb-new-button', function(evt) {
  $('#imgup').trigger('click');
});

$(document).on('click', '#load-button', function(evt) {
  $('#welcome').slideUp(500, function() {$('#mapapp').slideDown(500);});
  state = 1;
});

$(document).on('change', '#imgup', function(evt) {
  //taken from http://stackoverflow.com/questions/22087076/how-to-make-a-simple-image-upload-using-javascript-html

  var file    = document.getElementById('imgup').files[0]; 
  var reader  = new FileReader();

  reader.onloadend = function() {
    if (state == 0) {
      $('#welcome').slideUp(500, function() {$('#mapapp').slideDown(500);});
      $('#map').attr('src', reader.result);
      locations = {};
      state = 1;
    } else {
      $('#map').fadeOut(500, function() {$('#map').attr('src', reader.result); $('#map').fadeIn(500);});
      locations = {};
      updateLocations();
      $('.mapicon').remove();
    }
  }

  if (file) {
     reader.readAsDataURL(file);
  } else {
  }
});


$(document).on('mousedown', '.icon', function(evt) {
  if ($(this).data('hidden')) return;
  $(this).attr('draggable', 'false');
  var iden = 'ic' + currIcon;
  var cl = $(this).attr("id") + "_clone";
  var source = $(this).attr('src');
  var newImg = $("<img>", {id: iden, src: source, class: cl + " mapicon", draggable: "false"});
  newImg.css('box-shadow', '0 0 10px slategray');
  gType = $(this).attr('id');
  $("body").append(newImg);
  var cursorX = evt.pageX;
  var cursorY = evt.pageY;
  var newLeft = cursorX - halfIconSize;
  var newTop = cursorY - halfIconSize;
  $('#zoom').hide();
  newImg.css({
    left: newLeft,
    top: newTop
  });
  selectedIcon = newImg;
  halfSelectedSize = halfIconSize;
});

$(document).on('mousemove', function(evt) {
  if (selectedIcon != null) {
    mouseMoved = true;
    $('#info_entry').hide();
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

$(document).on('click', '#info_entry #ex', function(evt) {
  $('#info_entry').hide();
});

$(document).on('mouseenter', '.placed', function(evt) {
  if (moveClicked) return;

  $(this).css('box-shadow', '0 0 10px slategray');
  var that = $(this);

  var lo = $('#lo' + $(this).attr('id').substring(2));
  lo.css('box-shadow', '0 0 10px slategray');
  $('#locations').scrollTop(lo.offset().top);

  var t = setTimeout(function() {
    that.animate({
      opacity: 0.1
    }, {
      duration: 300,
      queue: 'fade'
    });
    that.dequeue('fade');
  }, 800);
  $(this).data('timeout', t); //from http://stackoverflow.com/questions/1089246/how-to-tell-hover-to-wait
});

$(document).on('mouseleave', '.placed', function(evt) {
  if (moveClicked) return;
  $(this).css('box-shadow', 'none');
  var lo = $('#lo' + $(this).attr('id').substring(2));
  lo.css('box-shadow', 'none');
  clearTimeout($(this).data('timeout'));
  $(this).stop('fade');
  $(this).queue('fade');
  $(this).css('opacity', '1.0');
});

$(document).on('click', '#info_entry #move', function(evt) {
  $('#info_entry').hide();
  moveClicked = true;
  $('#zoom').hide();
  clickedIcon.css('box-shadow', '0 0 10px slategray');
  oldX = clickedIcon.position().left;
  oldY = clickedIcon.position().top;
  clickedIcon.remove();
  $("body").append(clickedIcon);
  var cursorX = evt.pageX;
  var cursorY = evt.pageY;
  var halfIconSize = clickedIcon.width() / 2;
  var newLeft = cursorX - halfIconSize;
  var newTop = cursorY - halfIconSize;
  clickedIcon.css({
    left: newLeft,
    top: newTop
  });
  selectedIcon = clickedIcon;
  halfSelectedSize = halfIconSize;
});

$(document).on('mouseup', '.mapicon', function(evt) {
  if (selectedIcon != null) {
    selectedIcon = null;
    $(this).hide();
    var $under = $(document.elementFromPoint(evt.pageX, evt.pageY));
    $(this).show();
    if ($under.attr('id') == 'map') {
      $(this).css('z-index', '0');
      $(this).remove();
      var cont = $('#map-container');
      cont.append($(this));
      
      var tb = $("#titlebar");

      if (!$(this).hasClass('placed')) {
        var loc = {
          num: currIcon,
          type: gType,
          leftr: ($(this).position().left + halfIconSize - $('#map-container').offset().left - $('#map').position().left) / $('#map').width(),
          topr: ($(this).position().top + halfIconSize - $('#map-container').offset().top - $('#map').position().top) / $('#map').height(),
          name: 'Location ' + currIcon,
          address: '',
          desc: ''
        };
        locations[currIcon] = loc;

        clickedIcon = $(this);
        $("#info_entry").css({
          left: evt.pageX,
          top: evt.pageY - tb.height()
        });
        $('#name').attr('placeholder', 'Location ' + currIcon);
        $('#name').val('');
        $('#address').val('');
        $('#desc').val('');

        $("#info_entry").show();
        $('#name').focus();

        $(this).addClass('placed');
        currIcon++;
        updateLocations();
        $('#locations').scrollTop($('#lo' + $(this).attr('id').substring(2)).offset().top);
      } 

      moveClicked = false;

      var ide = parseInt($(this).attr('id').substring(2))
      locations[ide].leftr = ($(this).position().left + halfIconSize - $('#map-container').offset().left - $('#map').position().left) / $('#map').width();
      locations[ide].topr = ($(this).position().top + halfIconSize - $('#map-container').offset().top - $('#map').position().top) / $('#map').height();

      $(this).css({
        left: evt.pageX - cont.offset().left - halfSelectedSize - 2,
        top: evt.pageY - cont.offset().top - halfSelectedSize - 2
      });
      
      $(this).css('box-shadow', 'none');
    } else {
      if ($(this).hasClass('placed')) {
        moveClicked = false;
        $(this).animate({
          left: oldX + $('#map-container').offset().left,
          top: oldY + $('#map-container').offset().top,
        }, 500, function() {
          $(this).remove();
          $('#map-container').append($(this));
          $(this).css('box-shadow', 'none');
          $(this).css({
            left: oldX,
            top: oldY
          })
        });
        
      } else {
        $(this).remove();
      }
      
    }
  } else {
    clickedIcon = $(this);
    var tb = $("#titlebar");
    $("#info_entry").css({
      left: evt.pageX,
      top: evt.pageY - tb.height()
    });
    var loc = locations[parseInt(clickedIcon.attr('id').substring(2))];
    $('#name').val(loc.name);
    $('#address').val(loc.address);
    $('#desc').val(loc.desc);
    $("#info_entry").show();
    $('#name').focus();
  }
  evt.stopPropagation();  
  $('#zoom').show();
  //TODO: Generate a new info entry every time an icon is added so that they all have their own dedicated entry
  /*var info_entry = document.createElement("div");
  var del = document.createElement("input");
  var name_label = document.createElement("label");
  var name_text = document.createElement("input");
  var address_label = document.createElement("label");
  var address_text = document.createElement("input");
  var save = document.createElement("input");*/
});

$(document).on('keyup', '#info_entry input[type=text], #info_entry textarea', function(evt) {
  if (evt.which == 13) {
    $('#save').click();
  }
});

$(document).on('click', '#save', function(evt) {
  var loc = locations[parseInt(clickedIcon.attr('id').substring(2))];
  if ($('#name').val() != '') {
    loc.name = $('#name').val();
  } else {
    loc.name = $('#name').attr('placeholder'); 
  }
  loc.address = $('#address').val();
  loc.desc = $('#desc').val();
  locations[parseInt(clickedIcon.attr('id').substring(2))] = loc;
  updateLocations();
  $('#info_entry').hide();
});

$(document).on('click', '#delete', function(evt) {
  delete locations[parseInt(clickedIcon.attr('id').substring(2))];
  updateLocations();
  $('#info_entry').hide();
  clickedIcon.remove();
});

function updateLocations() {
  var used = {};
  $('#loclist').html('');
  $('#key').html('');
  for (var i = 0; i < currIcon; i++) {
    if (!locations[i]) continue;
    var loc = locations[i];
    if (!used[loc.type]) {
      used[loc.type] = true;
      var elt = $('<div>', {class: 'keyitem'});
      elt.append('<input type="checkbox" id="cb' + loc.type + '" ' + ((checked[loc.type]) ? 'checked' : '') + '>');
      elt.append('<label for="cb' + loc.type + '"><img src="' + icons[loc.type][0] + '" class="keyimg" alt="icon"></label>');
      $('#key').append(elt);
    }
    var elt = $('<div>', {class: 'loc', id: 'lo' + i});
    var info = $('<div>', {class: 'locinfo'});
    info.append('<h5>'+loc.name+'</h5>');
    info.append('<p class="addr">'+loc.address+'</p>');
    if (loc.desc != '') {
      info.append('<hr/>');
      info.append('<p>'+loc.desc+"</p>");
    }
    elt.append(info);
    var img = $('<img>', {alt: 'icon', src: icons[loc.type][0], class: 'locimg'});
    elt.append(img);
    $('#loclist').append(elt);
  }
}

$(document).on('click', '.loc', function(evt) { 
  var ic = $('#ic' + $(this).attr('id').substring(2));
  var map = $('#map');
  var cont = $('#map-container');
  clickedIcon = ic;
  ic.css({
    width: '25px',
    left: oldX,
    top: oldY
  });
  locClicked = true;
  if (ic.position().left + 25 > cont.width()) {
    map.css('left', map.position().left - (ic.position().left + 25 - cont.width()));
  }
  if (ic.position().left < 0) {
    map.css('left', map.position().left - (ic.position().left));
  } 
  if (ic.position().top < 0) {
    map.css('top', map.position().top - (ic.position().top));
  } 
  if (ic.position().top + 25 > cont.height()) {
    map.css('top', map.position().top - (ic.position().top + 25 - cont.height()));
  }
  redrawIcons();
  var tb = $("#titlebar");
  $("#info_entry").css({
    left: ic.offset().left + ic.width() - 3,
    top: ic.offset().top - tb.height() + ic.height() - 3
  });
  var loc = locations[parseInt(clickedIcon.attr('id').substring(2))];
  $('#name').val(loc.name);
  $('#address').val(loc.address);
  $('#desc').val(loc.desc);
  $("#info_entry").show();
  $('#name').focus();
});

$(document).on('mouseenter', '.loc', function(evt) {
  $(this).css('box-shadow', '0 0 10px slategray');
  var ic = $('#ic' + $(this).attr('id').substring(2));
  oldX = ic.position().left;
  oldY = ic.position().top;
  ic.css({
    width: ic.width() + 10,
    left: ic.position().left - 5,
    top: ic.position().top - 5
  });
});

$(document).on('mouseleave', '.loc', function(evt) {
  $(this).css('box-shadow', 'none');
  var ic = $('#ic' + $(this).attr('id').substring(2));
  if (!locClicked) {
    ic.css({
      width: '25px',
      left: oldX,
      top: oldY
    });
  }
  locClicked = false;
});

$(document).on('keyup', '#info_entry', function(evt) {
  if (evt.which == 27) {
    $('#ex').click();
  } 
});

$(window).on('resize', function() {
  redrawIcons();
});

function redrawIcons() {
  $('.mapicon').each(function() {
    var i = parseInt($(this).attr('id').substring(2));
    $(this).css({
      left: locations[i].leftr * $('#map').width() + $('#map').position().left - halfIconSize - 2,
      top: locations[i].topr * $('#map').height() + $('#map').position().top - halfIconSize - 2
    });
  });
}

$(document).on('mouseenter', '.icon', function(evt) {
  $('#information').css({
    top: evt.pageY - $('#titlebar').height(),
    left: evt.pageX + 10
  });
  $('#information').text(icons[$(this).attr('id')][1]);
  $('#information').show();
});

$(document).on('mouseenter', '.keyitem img', function(evt) {
  $('#information').css({
    top: evt.pageY - $('#titlebar').height(),
    left: evt.pageX + 10
  });
  $('#information').text(icons[$(this).parent().attr('for').substring(2)][1]);
  $('#information').show();
});

$(document).on('mousemove', '.icon, .keyitem img', function(evt) {
  $('#information').css({
    top: evt.pageY - $('#titlebar').height(),
    left: evt.pageX + 10
  });
});

$(document).on('mouseleave', '.icon, .keyitem img', function(evt) {
  $('#information').hide();
});


$(document).on('click', '#zoomin', function(evt) {
  var map = $('#map');
  if (zoomLevel == 8) return;
  zoomLevel++;
  $('#info_entry').hide();
  var ratio = map.height() / map.width();
  map.css('width', map.width() + 200);
  map.css('left', -100 * zoomLevel);
  map.css('height', map.width() * ratio);
  map.css('top', -100 * ratio * zoomLevel);
  redrawIcons();
 });

$(document).on('click', '#zoomout', function(evt) {
  var map = $('#map');
  if (zoomLevel <= 0) return;
  zoomLevel--;
  $('#info_entry').hide();
  var cont = $('#map-container');
  var ratio = map.height() / map.width();
  map.css('width', map.width() - 200);
  map.css('left', -100 * zoomLevel);
  map.css('height', map.width() * ratio);
  map.css('top', -100 * zoomLevel * ratio);
  redrawIcons();
 });

$(document).on('mousedown', '#map', function(evt) {
  mouseMap = true;
  var map = $(this);
  oMapLeft = map.position().left;
  oMapTop = map.position().top;
  oMouseX = evt.pageX;
  oMouseY = evt.pageY;
});

$(document).on('mousemove', '#map', function(evt) {
  if (mouseMap) {
    var map = $(this);
    var cont = $('#map-container');
    var newMapLeft = oMapLeft + (evt.pageX - oMouseX);
    var newMapTop = oMapTop + (evt.pageY - oMouseY);
    var newMapRight = newMapLeft + map.width();
    var newMapBottom = newMapTop + map.height();
    if (newMapLeft > 0) {
      oMouseX = evt.pageX;
      oMapLeft = map.position().left;
    } else if (newMapRight < cont.width()) {
      oMouseX = evt.pageX;
      oMapLeft = map.position().left;
    } else {
      map.css('left', newMapLeft);
    }


    if (newMapTop > 0) {
      oMouseY = evt.pageY;
      oMapTop = map.position().top;
    } else if (newMapBottom <= cont.height()) {
      oMouseY = evt.pageY;
      oMapTop = map.position().top;
    } else {
      map.css('top', newMapTop);
    }

    redrawIcons();
    
  }
});

$(document).on('mouseup', '#map', function(evt) {
  mouseMap = false;
  $('#info_entry').hide();
});

$(document).on('change', '.keyitem input', function(evt) {
  var typ = $(this).attr('id').substring(2);
  if ($(this).is(':checked')) {
    checked[typ] = true;
    $('.' + typ + '_clone').show();
    $('#' + typ).css('opacity', '1.0');
    $('#' + typ).data('hidden', false);
  } else {
    checked[typ] = false;
    $('#info_entry').hide();
    $('.' + typ + '_clone').hide();
    $('#' + typ).css('opacity', '0.4');
    $('#' + typ).data('hidden', true);

  }
}); 
