var BeamerPreview = {},
  _BEAMER_PREVIEW_DATE = "_BEAMER_PREVIEW_DATE",
  _BEAMER_PREVIEW_USER_ID = "_BEAMER_PREVIEW_USER_ID",
  _BEAMER_PREVIEW_URL = "",
  previousMenuOption;
BeamerPreview.initialized = !1;
BeamerPreview.build = function () {
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
      null != beamer_config_preview &&
        (BeamerPreview.appendStyles(),
        beamer_config_preview.alert && BeamerPreview.appendAlertPreview(),
        BeamerPreview.appendAnalytics());
    }, 200);
  });
};
BeamerPreview.hideLoader = function () {
  BeamerPreview.addClass("beamerLoaderPreview", "beamer_hideLoader");
  var a = document.getElementById("beamerLoaderPreview");
  setTimeout(function () {
    a.style.display = "none";
  }, 200);
};
BeamerPreview.show = function (a, b) {
  var c = BeamerPreview.getCookie(
    _BEAMER_PREVIEW_USER_ID + "_" + beamer_config_preview.product_id
  );
  (null != c && "" != c) ||
    BeamerPreview.setCookie(
      _BEAMER_PREVIEW_USER_ID + "_" + beamer_config_preview.product_id,
      BeamerPreview.uuidv4(),
      300
    );
  "undefined" !== typeof a && !0 === a
    ? ((a =
        _BEAMER_PREVIEW_URL +
        "standalonePreview?app_id=" +
        beamer_config_preview.product_id +
        "&user_id=" +
        c),
      "undefined" !== typeof b && 0 < b.trim().length && (a += "&" + b),
      window.open(a, "_blank"))
    : (BeamerPreview.appendIframePreview(beamer_config_preview.product_id),
      (document.getElementById("beamerOverlayPreview").style.display = "block"),
      BeamerPreview.removeClass("beamerOverlayPreview", "beamer_hide"),
      Beamer.removeClass("beamerOverlay", "beamer_hideable"),
      setTimeout(function () {
        document.getElementById("beamerOverlayPreview").className +=
          " beamer_show";
      }, 50),
      setTimeout(function () {
        BeamerPreview.addClass("beamerOverlayPreview", "beamer_hideable");
      }, 300),
      BeamerPreview.setCookie(
        _BEAMER_PREVIEW_DATE + "_" + beamer_config_preview.product_id,
        new Date().toISOString(),
        300
      ),
      BeamerPreview.clearAlert(),
      (previousMenuOption = $(".menuOption.active:not(.preview)")),
      $(".menuOption.preview").addClass("active"),
      previousMenuOption.removeClass("active"));
};
BeamerPreview.hide = function (a) {
  (null != a &&
    ($(a.target).hasClass("headerLanguages") ||
      $(a.target).hasClass("previewLanguageTitle") ||
      $(a.target).hasClass("languageSelector"))) ||
    (BeamerPreview.removeClass("beamerOverlayPreview", "beamer_show"),
    Beamer.removeClass("beamerOverlay", "beamer_hideable"),
    (document.getElementById("beamerOverlayPreview").className +=
      " beamer_hide"),
    setTimeout(function () {
      document.getElementById("beamerOverlayPreview").remove();
    }, 200),
    previousMenuOption &&
      0 < previousMenuOption.length &&
      previousMenuOption.addClass("active"),
    $(".menuOption.preview").removeClass("active"));
};
BeamerPreview.addClass = function (a, b) {
  try {
    var c = document.getElementById(a);
    0 >= c.className.indexOf(b) && (c.className += " " + b);
  } catch (d) {
    console.log("Element not found: " + a + d);
  }
};
BeamerPreview.addClick = function (a, b) {
  document.getElementById(a).onclick = b;
};
BeamerPreview.removeClass = function (a, b) {
  a = document.getElementById(a);
  null != a &&
    (a.className = a.className
      .replace(new RegExp("( |^)" + b + "( |$)", "g"), " ")
      .trim());
};
BeamerPreview.appendHtml = function (a, b) {
  var c = document.createElement("div");
  for (c.innerHTML = b; 0 < c.children.length; ) a.appendChild(c.children[0]);
};
BeamerPreview.appendStyles = function () {
  var a = document.createElement("link");
  a.type = "text/css";
  a.rel = "stylesheet";
  a.href = _BEAMER_PREVIEW_URL + "/styles/beamer-embed.css";
  document.head.appendChild(a);
};
BeamerPreview.appendAnalytics = function () {};
BeamerPreview.appendIframePreview = function (a) {
  if (!BeamerPreview.initialized) {
    var b = BeamerPreview.getCookie(
      _BEAMER_PREVIEW_DATE + "_" + beamer_config_preview.product_id
    );
    a =
      _BEAMER_PREVIEW_URL +
      "newsPreview?app_id=" +
      beamer_config_preview.product_id;
    beamer_config_preview.language &&
      (a += "&language=" + beamer_config_preview.language);
    var c = BeamerPreview.getCookie(
      _BEAMER_PREVIEW_USER_ID + "_" + beamer_config_preview.product_id
    );
    c && (a += "&user_id=" + c);
    a += "&lastView=" + encodeURI(b);
    b = beamer_config_preview.languages;
    if ("undefined" !== typeof b && 1 < b.length) {
      c = "";
      for (var d = 0; d < b.length; d++) {
        var e =
          b[d].name.charAt(0).toUpperCase() + b[d].name.slice(1).toLowerCase();
        c += "<option value='" + b[d].code + "'>" + e + "</option>";
      }
      a =
        "<div id='beamerOverlayPreview' onclick='BeamerPreview.hide(event);'><div class='iframeCointaner'><div id='beamerLoaderPreview' class='beamer_beamer right'></div><iframe allowfullscreen onload='BeamerPreview.hideLoader();' src='" +
        a +
        "' class='beamer_beamer right'></iframe></div><div class='headerLanguages' onclick='event.stopPropagation();'><div class='previewLanguageTitle'>Preview language</div><select class='languageSelector' onchange='BeamerPreview.selectPreviewLanguage(this);'>" +
        (c + "</select></div></div>");
    } else
      a =
        "<div id='beamerOverlayPreview' onclick='BeamerPreview.hide(event);'><div class='iframeCointaner'><div id='beamerLoaderPreview' class='beamer_beamer right'></div><iframe allowfullscreen onload='BeamerPreview.hideLoader();' src='" +
        a +
        "' class='beamer_beamer right'></iframe></div></div>";
    BeamerPreview.appendHtml(document.body, a);
  }
};
BeamerPreview.selectPreviewLanguage = function (a) {
  a = $(a).val().toLowerCase();
  var b = $("#beamerOverlayPreview iframe.beamer_beamer")[0].src;
  if (0 < b.indexOf("?")) {
    var c = b.indexOf("&language=");
    b =
      -1 < c
        ? b.replace(b.substr(c), "&language=" + a)
        : b + ("&language=" + a);
  }
  $("iframe.beamer_beamer")[0].src = b;
};
BeamerPreview.appendAlertPreview = function () {
  BeamerPreview.addClick(beamer_config_preview.selector, function () {
    BeamerPreview.show();
  });
  document.getElementById(beamer_config_preview.selector);
  "undefined" != typeof jQuery &&
    "static" == $("#" + beamer_config_preview.selector).css("position") &&
    BeamerPreview.addClass(
      beamer_config_preview.selector,
      "beamerSelectorRelative"
    );
  BeamerPreview.addClass(beamer_config_preview.selector, "beamerSelector");
  var a = BeamerPreview.getCookie(
      _BEAMER_PREVIEW_DATE + "_" + beamer_config_preview.product_id
    ),
    b = function (c) {
      c = JSON.parse(c);
      0 < c.number
        ? BeamerPreview.drawAlert(c.number, !0)
        : BeamerPreview.drawAlert(0, !1);
    };
  null != a && "" != a
    ? ((a =
        _BEAMER_PREVIEW_URL +
        "numberFeatures?preview=true&cache=" +
        new Date().getTime() +
        "&date=" +
        a +
        "&product=" +
        beamer_config_preview.product_id),
      BeamerPreview.ajax(a, b))
    : BeamerPreview.drawAlert(0, !0);
  b = BeamerPreview.getCookie(
    _BEAMER_PREVIEW_USER_ID + "_" + beamer_config_preview.product_id
  );
  (null != b && "" != b) ||
    BeamerPreview.setCookie(
      _BEAMER_PREVIEW_USER_ID + "_" + beamer_config_preview.product_id,
      BeamerPreview.uuidv4(),
      300
    );
};
BeamerPreview.drawAlert = function (a, b) {
  var c = "";
  null != a && 0 < a && (c = "" + a);
  a =
    "<div id='beamerIconPreview' onclick='BeamerPreview.show();'>" +
    c +
    "</div>";
  c = document.getElementById(beamer_config_preview.selector);
  BeamerPreview.appendHtml(c, a);
  BeamerPreview.setPosition("beamerIconPreview");
  b && BeamerPreview.addClass("beamerIconPreview", "active");
};
BeamerPreview.clearAlert = function () {
  BeamerPreview.removeClass("beamerIconPreview", "active");
};
BeamerPreview.setPosition = function (a) {
  a = document.getElementById(a);
  null != beamer_config_preview.right &&
    (a.style.right = beamer_config_preview.right + "px");
  null != beamer_config_preview.top &&
    (a.style.top = beamer_config_preview.top + "px");
};
BeamerPreview.setCookie = function (a, b, c) {
  var d = new Date();
  d.setTime(d.getTime() + 864e5 * c);
  c = "expires=" + d.toUTCString();
  document.cookie = a + "=" + b + ";" + c + ";path=/";
};
BeamerPreview.getCookie = function (a) {
  a += "=";
  for (
    var b = decodeURIComponent(document.cookie).split(";"), c = 0;
    c < b.length;
    c++
  ) {
    for (var d = b[c]; " " == d.charAt(0); ) d = d.substring(1);
    if (0 == d.indexOf(a)) return d.substring(a.length, d.length);
  }
  return "";
};
window.addEventListener(
  "message",
  function (a) {
    "hidePreview" == a.data
      ? BeamerPreview.hide()
      : "showUpgradePopup" == a.data &&
        (BeamerPreview.hide(), $("#globalBlock").fadeIn("fast"));
  },
  !1
);
BeamerPreview.ajax = function (a, b) {
  var c = new XMLHttpRequest();
  c.onreadystatechange = function () {
    4 == this.readyState && 200 == this.status && b(this.responseText);
  };
  c.crossDomain = !0;
  c.withCredentials = !1;
  c.open("GET", a, !0);
  c.send();
};
BeamerPreview.uuidv4 = function () {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (a) {
    var b = (16 * Math.random()) | 0;
    return ("x" == a ? b : (b & 3) | 8).toString(16);
  });
};
BeamerPreview.build();
