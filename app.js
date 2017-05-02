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
var zoomLevel = 1;
var mouseMap = false;
var oMouseX, oMouseY, oMapLeft, oMapTop;
var locClicked = false;
var checked = {};
var highlighted = null;
var mouseWheeled = false;

var icons = {
  "info": ["https://s13.postimg.org/rtyfxbsvr/info_icon.png", "Information"],
  "restroom": ["http://i.imgur.com/0S1StJM.png", "Restrooms"],
  "random": ["rando.jpg", "Random"],
  "upset": ["upsetemoji.png", "Side Eyes"],
  "money": ['money.png', "Bills Bills Bills!"],
  "nerd": ['nerd.png', "Beta"],
  "poop": ['poop.jpg', "Excretion"],
  "thinkn": ['thinkin.png', "Something about this isn't right"],
  "halo": ['halo.png', "Angle"],
  "wink": ['wink.png', 'Suggestive']
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
      $('#welcome').slideUp(500, function() {
        $('#mapapp').slideDown(500, function() {
          var imag = new Image(); //from http://stackoverflow.com/questions/623172/how-to-get-image-size-height-width-using-javascript
          imag.onload = function() {
            var cont = $('#map-container');
            var rent = cont.parent();
            cont.css({
              width: '74%',
              height: '90%',
            });
            var contRatio = cont.width() / cont.height();
            var ratio = this.width / this.height;
            if (ratio < contRatio) {
              var newHeight = 90;
              var newWidth = newHeight * ratio * (rent.height() / rent.width());
              var newLeft = 46 - (newWidth / 2);
              var newTop = 5;
              cont.css({
                width: newWidth + '%',
                height: newHeight + '%',
                left: newLeft + '%',
                top: newTop + '%'
              });
              $('#sidebar').css('left', (newLeft - 8) + '%');
              $('#locations').css('left', (newLeft + newWidth + 1) + '%');
            } else {
              var newWidth = 74;
              var newHeight = newWidth * (1/ratio) * (rent.width() / rent.height());
              var newLeft = 9;
              var newTop = 50 - (newHeight / 2);
              cont.css({
                width: newWidth + '%',
                height: newHeight + '%',
                left: newLeft + '%',
                top: newTop + '%'
              });
              $('#sidebar').css('left', '1%');
              $('#locations').css('left', '84%');
            }
        };
        imag.src = reader.result;
        $('#map').css({
          height: '100%',
          width: '100%',
          top: 0,
          left: 0
        });
        });
      });
      $('#map').attr('src', reader.result);
      zoomLevel = 1;
      locations = {};
      state = 1;
    } else {
      $('#map').fadeOut(500, function() {
        $('#map').attr('src', reader.result);
        var imag = new Image(); //from http://stackoverflow.com/questions/623172/how-to-get-image-size-height-width-using-javascript
        imag.onload = function() {
          var cont = $('#map-container');
          var rent = cont.parent();
          cont.css({
            width: '74%',
            height: '90%',
          });
          var contRatio = cont.width() / cont.height();
          var ratio = this.width / this.height;
          if (ratio < contRatio) {
            var newHeight = 90;
            var newWidth = newHeight * ratio * (rent.height() / rent.width());
            var newLeft = 46 - (newWidth / 2);
            var newTop = 5;
            cont.css({
              width: newWidth + '%',
              height: newHeight + '%',
              left: newLeft + '%',
              top: newTop + '%'
            });
            $('#sidebar').css('left', (newLeft - 8) + '%');
            $('#locations').css('left', (newLeft + newWidth + 1) + '%');
          } else {
            var newWidth = 74;
            var newHeight = newWidth * (1/ratio) * (rent.width() / rent.height());
            var newLeft = 9;
            var newTop = 50 - (newHeight / 2);
            cont.css({
              width: newWidth + '%',
              height: newHeight + '%',
              left: newLeft + '%',
              top: newTop + '%'
            });
            $('#sidebar').css('left', '1%');
            $('#locations').css('left', '84%');
          }
        };
        imag.src = reader.result;
        $('#map').css({
          height: '100%',
          width: '100%',
          top: 0,
          left: 0
        });
        zoomLevel = 1;
        $('#map').fadeIn(500);
      });
      locations = {};
      var ex = $('#ex2');
      ex.hide();
      ex.remove();
      $('body').append(ex);
      updateLocations();
      currIcon = 0;
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
  if (highlighted != lo.attr('id')) {
    highlighted = lo.attr('id');
    $('#locations').scrollTop(lo.position().top);
  }
  

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
          leftr: ($(this).position().left + halfIconSize - 2 - $('#map-container').offset().left - $('#map').position().left) / $('#map').width(),
          topr: ($(this).position().top + halfIconSize - 2 - $('#map-container').offset().top - $('#map').position().top) / $('#map').height(),
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
        $('#name').select();

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
    $('#name').select();
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

$(document).on('keydown', '#info_entry textarea', function(evt) {
  if (evt.which == 13)
    evt.preventDefault();
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

$(document).on('click', '#ex2', function(evt) {
  var ide = parseInt($(this).parent().attr('id').substring(2));
  delete locations[ide];
  $(this).hide();
  $(this).remove();
  $('body').append($(this));
  updateLocations();
  $('#info_entry').hide();
  $('#ic' + ide).remove();
  evt.stopPropagation();
});

function updateLocations() {
  var ex = $('#ex2');
  ex.hide();
  ex.remove();
  $('body').append(ex);
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
    if (!checked[loc.type]) continue; 
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
    top: oldY,
    border: '1px solid black'
  });
  locClicked = true;
  var newLeft = map.position().left - 1;
  var newTop = map.position().top - 1;
  var redr = true;
  if (ic.position().left + 25 > cont.width()) {
    newLeft = map.position().left - (ic.position().left + 25 - cont.width());
    map.animate({left: newLeft}, 200);
    setTimeout(function() {showInfoEntry(ic)}, 300);
    redr = false;
  }
  if (ic.position().left < 0) {
    newLeft = map.position().left - (ic.position().left);
    map.animate({left: newLeft}, 200);
    setTimeout(function() {showInfoEntry(ic)}, 300);
    redr = false;
  } 
  if (ic.position().top < 0) {
    newTop = map.position().top - (ic.position().top);
    map.animate({top: newTop}, 200);
    setTimeout(function() {showInfoEntry(ic)}, 300);
    redr = false;
  } 
  if (ic.position().top + 25 > cont.height()) {
    newTop = map.position().top - (ic.position().top + 25 - cont.height());
    map.animate({top: newTop}, 200);
    setTimeout(function() {showInfoEntry(ic)}, 300);
    redr= false;
  } 
  if (redr) {
    showInfoEntry(ic);
  } else {
    redrawIcons(true, map.width(), map.height(), newLeft, newTop);
  }
});

function showInfoEntry(ic) {
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
  $('#name').select();
}

$(document).on('mouseenter', '.loc', function(evt) {
  if (moveClicked) return;
  var ex = $('#ex2');
  ex.remove();
  $(this).append(ex);
  ex.show();
  $(this).css('box-shadow', '0 0 10px slategray');
  var ic = $('#ic' + $(this).attr('id').substring(2));
  oldX = ic.position().left;
  oldY = ic.position().top;
  ic.css({
    border: '3px solid black',
    width: ic.width() + 20,
    left: ic.position().left - 13,
    top: ic.position().top - 13
  });
});

$(document).on('mouseleave', '.loc', function(evt) {
  if (moveClicked) return;
  var ex = $('#ex2');
  ex.hide();
  $(this).css('box-shadow', 'none');
  var ic = $('#ic' + $(this).attr('id').substring(2));
  if (!locClicked) {
    ic.css({
      border: '1px solid black',
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
  $('#map').css({
    width: '100%',
    height: '100%',
    left: 0,
    top: 0
  });
  zoomLevel = 1;
  redrawIcons();
});

function redrawIcons(anim=false, newWidth=-1, newHeight, newLeft, newTop) {

  if (newWidth == -1) {
    $('.mapicon').each(function() {
      var i = parseInt($(this).attr('id').substring(2));
      if (anim) {
        $(this).animate({
          left: locations[i].leftr * $('#map').width() + $('#map').position().left - halfIconSize - 2,
          top: locations[i].topr * $('#map').height() + $('#map').position().top - halfIconSize - 2
        }, 200);
      } else {
        $(this).css({
          left: locations[i].leftr * $('#map').width() + $('#map').position().left - halfIconSize - 2,
          top: locations[i].topr * $('#map').height() + $('#map').position().top - halfIconSize - 2
        });
      }
    });
  } else {
    $('.mapicon').each(function() {
      var i = parseInt($(this).attr('id').substring(2));
      if (anim) {
        $(this).animate({
          left: locations[i].leftr * newWidth + newLeft - halfIconSize - 2,
          top: locations[i].topr * newHeight + newTop - halfIconSize - 2
        }, 200);
      } else {
        $(this).css({
          left: locations[i].leftr * newWidth + newLeft - halfIconSize - 2,
          top: locations[i].topr * newHeight + newTop - halfIconSize - 2
        });
      }
    });
  }
}

$(document).on('mouseenter', '.icon', function(evt) {
  if (moveClicked) return;
  $('#information').text(icons[$(this).attr('id')][1]);
  $('#information').css({
    top: evt.pageY - $('#titlebar').height(),
    left: evt.pageX - $('#information').width() - 10
  });
  $('#information').show();
});

$(document).on('mouseenter', '.keyitem img', function(evt) {
  if (moveClicked) return;
  $('#information').text(icons[$(this).parent().attr('for').substring(2)][1]);
  $('#information').css({
    top: evt.pageY - $('#titlebar').height(),
    left: evt.pageX - $('#information').width() - 10
  });
  $('#information').show();
});

$(document).on('mousemove', '.icon, .keyitem img', function(evt) {
  $('#information').css({
    top: evt.pageY - $('#titlebar').height(),
    left: evt.pageX - $('#information').width() - 10
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
  var cont = $('#map-container');
  var ratio = map.height() / map.width();
  var leftRatio = (cont.width() / 2 - map.position().left) / map.width();
  var topRatio = (cont.height() / 2 - map.position().top) / map.height();
  var newHeight = map.height() * 2;
  var newWidth = map.width() * 2;
  var newLeft = map.position().left - map.width()*leftRatio;
  var newTop = map.position().top - map.height()*topRatio;
  map.animate({
    width: newWidth,
    left: newLeft,
    height: newHeight,
    top: newTop
  }, 200);
  redrawIcons(true, newWidth, newHeight, newLeft, newTop);

  
 });

$(document).on('click', '#zoomout', function(evt) {
  var map = $('#map');
  if (zoomLevel == 1) return;
  $('#info_entry').hide();
  var cont = $('#map-container');
  var ratio = map.height() / map.width();
  var leftRatio = (cont.width() / 2 - map.position().left) / map.width();
  var topRatio = (cont.height() / 2 - map.position().top) / map.height();
  var newHeight = map.height() / 2;
  var newWidth = map.width() / 2;
  var newLeft = Math.max(Math.min(map.position().left + newWidth*leftRatio, 0), cont.width() - newWidth);
  var newTop = Math.max(Math.min(map.position().top + newHeight*topRatio, 0), cont.height() - newHeight);
  map.animate({
    width: newWidth,
    left: newLeft,
    height: newHeight,
    top: newTop
  }, 200);
  redrawIcons(true, newWidth, newHeight, newLeft, newTop);
  zoomLevel--;
 });

$(document).on('DOMMouseScroll mousewheel', '#map', function(evt) {
  evt.preventDefault();
  if (mouseWheeled) return;

  if (evt.originalEvent.wheelDelta > 50) {

    var map = $('#map');
    if (zoomLevel == 8) return;
    zoomLevel++;
    $('#info_entry').hide();
    var cont = $('#map-container');
    var ratio = map.height() / map.width();
    var leftRatio = (evt.pageX - cont.offset().left - map.position().left) / map.width();
    var topRatio = (evt.pageY - cont.offset().top - map.position().top) / map.height();
    var newHeight = map.height() * 2;
    var newWidth = map.width() * 2;
    var newLeft = map.position().left - map.width()*leftRatio;
    var newTop = map.position().top - map.height()*topRatio;
    map.animate({
      width: newWidth,
      left: newLeft,
      height: newHeight,
      top: newTop
    }, 200);
    redrawIcons(true, newWidth, newHeight, newLeft, newTop);
    

  } else if (evt.originalEvent.wheelDelta < -50) {

    var map = $('#map');
    if (zoomLevel == 1) return;
    $('#info_entry').hide();
    var cont = $('#map-container');
    var ratio = map.height() / map.width();
    var leftRatio = (cont.width() / 2 - map.position().left) / map.width();
    var topRatio = (cont.height() / 2 - map.position().top) / map.height();
    var newHeight = map.height() / 2;
    var newWidth = map.width() / 2;
    var newLeft = Math.max(Math.min(map.position().left + newWidth*leftRatio, 0), cont.width() - newWidth);
    var newTop = Math.max(Math.min(map.position().top + newHeight*topRatio, 0), cont.height() - newHeight);
    map.animate({
      width: newWidth,
      left: newLeft,
      height: newHeight,
      top: newTop
    }, 200);
    redrawIcons(true, newWidth, newHeight, newLeft, newTop);
    zoomLevel--;
  } else {
    return;
  }

  mouseWheeled = true;
  setTimeout(function() {
    mouseWheeled = false;
  }, 500);

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

$(document).on('mouseup', 'body', function(evt) {
  mouseMap = false;
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
  updateLocations();
}); 
