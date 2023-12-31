(function (b) {
  b.fn.initial = function (u) {
    var l =
        "#78a4ea #9adcff #8ddfcb #f9ed7d #ffb2a6 #ff8aae #facbea #c3b9ea #acc1c1".split(
          " "
        ),
      f;
    return this.each(function () {
      try {
        var m = b(this),
          a = b.extend(
            {
              name: "Name",
              color: null,
              seed: 0,
              charCount: 1,
              textColor: "#ffffff",
              height: 100,
              width: 100,
              fontSize: 60,
              fontWeight: 400,
              fontFamily:
                "HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif",
              radius: 0,
            },
            u
          );
        a = b.extend(a, m.data());
        "undefined" !== typeof a.name && a.name
          ? ((a.name = a.name.toString()),
            "" === a.name.trim() && (a.name = "?"))
          : (a.name = "?");
        for (
          var n = a.name,
            v = a.charCount,
            p = "",
            e,
            g = 0,
            h = 0,
            w = n.length;
          g < w;

        ) {
          a: {
            var k = void 0,
              d = n,
              c = g,
              q = d.charCodeAt(c);
            if (
              55296 <= q &&
              56319 >= q &&
              d.length > c + 1 &&
              ((k = d.charCodeAt(c + 1)), 56320 <= k && 57343 >= k)
            ) {
              e = d.substring(c, c + 2);
              break a;
            }
            e = d[c];
          }
          0 <= h && h < v && (p += e);
          g += e.length;
          h += 1;
        }
        var r = p.toUpperCase(),
          x = b('<text text-anchor="middle"></text>')
            .attr({
              y: "50%",
              x: "50%",
              dy: "0.35em",
              "pointer-events": "auto",
              fill: a.textColor,
              "font-family": a.fontFamily,
            })
            .html(r)
            .css({
              "font-weight": a.fontWeight,
              "font-size": a.fontSize + "px",
            });
        if (null == a.color) {
          var y = Math.floor((r.charCodeAt(0) + a.seed) % l.length);
          f = l[y];
        } else f = a.color;
        var t = b("<svg></svg>")
          .attr({
            xmlns: "http://www.w3.org/2000/svg",
            "pointer-events": "none",
            width: a.width,
            height: a.height,
          })
          .css({
            "background-color": f,
            width: a.width + "px",
            height: a.height + "px",
            "border-radius": a.radius + "px",
            "-moz-border-radius": a.radius + "px",
          });
        t.append(x);
        var z = window.btoa(
          unescape(encodeURIComponent(b("<div>").append(t.clone()).html()))
        );
        m.attr("src", "data:image/svg+xml;base64," + z);
      } catch (A) {}
    });
  };
})(jQuery);
