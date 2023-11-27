(function initReferrals() {
  function getRefUrl() {
    var REFERRAL_NAME = "refUrl";
    var refUrl = readCookie(REFERRAL_NAME);
    if (!refUrl) {
      refUrl = document.referrer;
      if (!refUrl || refUrl.trim() === "") {
        refUrl = "www.getbeamer.com";
      }
      createCookie(REFERRAL_NAME, refUrl);
    }
    if (refUrl) {
      refUrl = refUrl.trim();
    }
    return refUrl;
  }
  function getLanding() {
    var LANDING_NAME = "landing";
    var landing = readCookie(LANDING_NAME);
    if (!landing) {
      landing = window.location.href;
      createCookie(LANDING_NAME, landing);
    }
    if (landing) {
      landing = landing.trim();
    }
    return landing;
  }
  function getRef() {
    var REF_NAME = "ref";
    var ref = readCookie(REF_NAME);
    if (!ref) {
      var refPattern = /.+\/.*ref=([^&]+)/;
      var url = window.location.href;
      if (refPattern.test(url)) {
        var matches = refPattern.exec(url);
        if (matches && matches.length > 0) {
          ref = matches[1];
        }
      }
    }
    if (ref) {
      createCookie(REF_NAME, ref);
      return ref.trim();
    }
  }
  function getCode() {
    var CODE_NAME = "code";
    var code = readCookie(CODE_NAME);
    if (!code) {
      var codePattern = /.+\/.*code=([^&]+)/;
      var url = window.location.href;
      if (codePattern.test(url)) {
        var matches = codePattern.exec(url);
        if (matches && matches.length > 0) {
          code = matches[1];
        }
      }
    }
    if (code) {
      createCookie(CODE_NAME, code);
      return code.trim();
    }
  }
  function getOrigin() {
    var ORIGIN_NAME = "origin";
    var origin = readCookie(ORIGIN_NAME);
    if (!origin) {
      var originPattern = /.+\/.*origin=([^&]+)/;
      var url = window.location.href;
      if (originPattern.test(url)) {
        var matches = originPattern.exec(url);
        if (matches && matches.length > 0) {
          origin = matches[1];
        }
      }
    }
    if (origin) {
      createCookie(ORIGIN_NAME, origin);
      return origin.trim();
    }
  }
  function getCta() {
    var CTA_NAME = "cta";
    var cta = readCookie(CTA_NAME);
    if (!cta) {
      var ctaPattern = /.+\/.*cta=([^&]+)/;
      var url = window.location.href;
      if (ctaPattern.test(url)) {
        var matches = ctaPattern.exec(url);
        if (matches && matches.length > 0) {
          cta = matches[1];
        }
      }
    }
    if (cta) {
      createCookie(CTA_NAME, cta);
      return cta.trim();
    }
  }
  function createCookie(name, value) {
    document.cookie = name + "=" + value + "; domain=www.getbeamer.com; path=/";
  }
  function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  var anchors = document.querySelectorAll("a.altAction");
  for (var i = 0; i < anchors.length; i++) {
    var anchor = anchors[i];
    var url = anchor.href;
    if (url && url.indexOf("/signup") >= 0) {
      var firstParam = url.indexOf("?") < 0;
      var ref = getRef();
      if (ref && ref !== "") {
        if (firstParam) {
          url += "?";
          firstParam = false;
        } else {
          url += "&";
        }
        url += "ref=" + encodeURIComponent(ref);
      }
      var refUrl = getRefUrl();
      if (refUrl && refUrl !== "") {
        if (firstParam) {
          url += "?";
          firstParam = false;
        } else {
          url += "&";
        }
        url += "refUrl=" + encodeURIComponent(refUrl);
      }
      var code = getCode();
      if (code && code !== "") {
        if (firstParam) {
          url += "?";
          firstParam = false;
        } else {
          url += "&";
        }
        url += "code=" + encodeURIComponent(code);
      }
      var landing = getLanding();
      if (landing && landing !== "") {
        if (firstParam) {
          url += "?";
          firstParam = false;
        } else {
          url += "&";
        }
        url += "landing=" + encodeURIComponent(landing);
      }
      var origin = getOrigin();
      if (origin && origin !== "") {
        if (firstParam) {
          url += "?";
          firstParam = false;
        } else {
          url += "&";
        }
        url += "origin=" + encodeURIComponent(origin);
      }
      var cta = getCta();
      if (cta && cta !== "") {
        if (firstParam) {
          url += "?";
          firstParam = false;
        } else {
          url += "&";
        }
        url += "cta=" + encodeURIComponent(cta);
      }
      anchor.href = url;
    }
  }
})();
