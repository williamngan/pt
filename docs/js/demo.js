function coverDemo() {

  function mobilecheck() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

  if (mobilecheck()) {
    return;
  }

  //// 1. Define Space and Form
  var colors = {
    a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
    b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
  };
  var space = new Pt.CanvasSpace( "demo", colors.b3 ).display();
  var form = new Pt.Form( space );
  form.stroke( false );

//// 2. Create Elements
  var rects = [];
  var mouse = new Pt.Vector();
  var steps = 10;
  var gap = space.size.$subtract( 100, 100 ).divide( steps*2, steps );

// create grid of rectangles
  function init( shouldResize ) {
    if (stopped) return;

    rects = [];
    gap = space.size.$subtract( 100, 100 ).divide( steps*2, steps );

    if (shouldResize) {
      var size = space.canvas.parentNode.getBoundingClientRect();
      if (size.width && size.height) {
        space.resize( size.width, size.height );
      }
    }

    for (var i = 0; i <= (steps * 2); i++) {
      for (var j = 0; j <= (steps); j++) {
        var rect = new Pt.Rectangle().to( 10, 10 );
        rect.moveTo( 50 - 5.5 + gap.x * i, 50 - 5.5 + gap.y * j );
        rect.setCenter();
        rects.push( rect );
      }
    }
  }

  init();

//// 3. Visualize, Animate, Interact
  space.add( {
    animate: function ( time, fps, context ) {
      for (var i = 0; i < rects.length; i++) {
        var rect = rects[i];

        // find distance as well as x y differences
        var mag = 100 - Math.min( 100, rect.center.distance( mouse ) );
        var diff = rect.center.$subtract( mouse ).abs().$min( 200, 200 );

        // resize rectangles from center point based on distance and diffs
        rect.resizeCenterTo( diff.subtract( 50 ).divide( 6 ).add( mag / 2 ).$max( 5, 5 ) );
        form.fill( colors.a3 ).rect( rect );
      }
    },

    onMouseAction: function ( type, x, y, evt ) {
      if (type === "move") {
        mouse.set( x, y );
      }
    },

    onSpaceResize: function () {
      init();
    }

  } );


// 4. Start playing
  space.bindMouse();
  space.play();
  space.stop(10000000);

  var stopped = false;

  window.stopCoverDemo = function() {
    if (!stopped) {
      space.pause();
      stopped = true;
    }
  };

  window.restartCoverDemo = function() {
    if (stopped) {
      stopped = false;
      space.resume();
      //space.stop( 1000000 );
      //init(true);
    }
  };

};