var _verified = !1,
  _showPublicUrlCookie = "_BEAMER_SHOW_PUBLIC_URL",
  _showPushSettingsCookie = "_BEAMER_SHOW_PUSH_SETTINGS",
  _introSeenCookie = "_BEAMER_INTRO_SEEN",
  _homeHashCookie = "_BEAMER_HOME_HASH",
  _dateFormat = "MM/DD/YYYY hh:mmA",
  _categorySearch,
  Creator = {
    init: function () {
      document.addEventListener("DOMContentLoaded", function () {
        isMobile() ||
          $('li.sidebarListElement[data-option="notifications"]').addClass(
            "open"
          );
        initRouting();
        initNews();
        initSubmenu();
        initSearch();
        updateTimezone();
        showPublicUrl();
        showPushSettings();
        initSubmenuNotifications();
        populateSearchParameters();
        EventLogger.getInstance().log("home");
        setTimeout(function () {
          window.location.hash ||
            (retrieveHomePosts(), setCookie(_homeHashCookie, "", 3));
        }, 100);
      });
    },
  };
function initRouting() {
  routie({
    "updateTimezone*": function () {
      updateTimezone(!0);
      hideTopAlert();
      $("body").prepend(
        "<div class='alert green'><span class='closebtn' onclick='hideTopAlert(this);'><i class='material-icons' title='close'>close</i></span><strong><a href='settings#user'>Timezone updated!</a></strong></div>"
      );
      showTopAlert();
    },
    "posts*": routeDashboardSearch,
  });
  var a = window.location.href,
    b = getCookie(_homeHashCookie);
  "undefined" !== typeof b &&
    0 < b.indexOf("?") &&
    (0 < a.indexOf("pinned=true") ||
      0 < a.indexOf("created=true") ||
      0 < a.indexOf("edited=true")) &&
    routie(b);
}
function getRoutingParameter(a) {
  var b = window.location.hash;
  if ("undefined" !== typeof b && b && 0 < b.indexOf("?")) {
    b = b.substr(b.indexOf("?") + 1).split("&");
    for (var c = 0; c < b.length; c++) {
      var d = b[c];
      if (d.startsWith(a + "="))
        return (a = d.substr(d.indexOf("=") + 1)), decodeURIComponent(a);
    }
  }
}
function setRoutingParameters(a) {
  var b = window.location.hash;
  if ("undefined" !== typeof b && b) {
    var c = 0 < b.indexOf("?") ? b.split("?")[1] : "";
    b = "posts?";
    var d = c.split("&");
    for (c = 0; c < d.length; c++) {
      for (var e = !1, f = 0; f < a.length; f++)
        if (d[c].startsWith(a[f].name + "=")) {
          e = !0;
          break;
        }
      e || (0 < c && (b += "&"), (b += d[c]));
    }
    d = -1 === b.indexOf("&");
    c = 0;
  } else (b = "posts?"), (d = !0), (c = 0);
  for (; c < a.length; c++)
    "undefined" !== typeof a[c].value &&
      a[c].value &&
      (d || (b += "&"),
      (b += a[c].name + "=" + encodeURIComponent(a[c].value)),
      (d = !1));
  routie(b);
}
function retrieveHomePosts(a, b, c, d, e, f, k, l, m, q, r, p, t) {
  var u = $(".news");
  u.unbind(".scrollLoad");
  var g = "loadMoreHome",
    h = !0;
  "undefined" !== typeof a &&
    "" !== a &&
    ((h = !1), (g += "?search=" + encodeURIComponent(a)));
  "undefined" !== typeof b &&
    "" !== b &&
    (h ? ((g += "?"), (h = !1)) : (g += "&"),
    (g += "category=" + encodeURIComponent(b)));
  "undefined" !== typeof c &&
    "" !== c &&
    (h ? ((g += "?"), (h = !1)) : (g += "&"),
    (g += "role=" + encodeURIComponent(c)));
  "undefined" !== typeof d &&
    "" !== d &&
    (h ? ((g += "?"), (h = !1)) : (g += "&"),
    (g += "filterUserId=" + encodeURIComponent(d)));
  "undefined" !== typeof e &&
    "" !== e &&
    (h ? ((g += "?"), (h = !1)) : (g += "&"),
    (g += "dateFrom=" + encodeURIComponent(e)));
  "undefined" !== typeof f &&
    "" !== f &&
    (h ? ((g += "?"), (h = !1)) : (g += "&"),
    (g += "dateTo=" + encodeURIComponent(f)));
  "undefined" !== typeof k &&
    (h ? ((g += "?"), (h = !1)) : (g += "&"), (g += "published=" + k));
  "undefined" !== typeof l &&
    (h ? ((g += "?"), (h = !1)) : (g += "&"), (g += "draft=" + l));
  "undefined" !== typeof m &&
    (h ? ((g += "?"), (h = !1)) : (g += "&"), (g += "expired=" + m));
  "undefined" !== typeof q &&
    (h ? ((g += "?"), (h = !1)) : (g += "&"), (g += "archived=" + q));
  "undefined" !== typeof r &&
    (h ? ((g += "?"), (h = !1)) : (g += "&"), (g += "filterByUserId=" + r));
  "undefined" !== typeof p &&
    "" !== p &&
    (h ? ((g += "?"), (h = !1)) : (g += "&"), (g += "language=" + p));
  a = $("#firstResults").height();
  $(".news").height() - 40 > a &&
    ((a = g),
    t && (a += (h ? "?" : "&") + "searching=true"),
    getResultsHome(a, function (n) {
      if ("" === n.trim()) {
        if (!h) {
          n = $("<div>").attr("class", "noFeatures search");
          var v = $("<div>")
            .attr("class", "noFeaturesTitle")
            .text("No results for this search");
          n.append(v);
          $("#firstResults").append(n);
        }
      } else $("#firstResults").append(n);
      $(".loaderContainer").remove();
      initNews();
    }));
  setTimeout(function () {
    u.scrollLoad({
      url: g,
      getData: function () {},
      start: function () {
        $(this).append(renderLoader());
        $(".news").perfectScrollbar("update");
      },
      ScrollAfterHeight: 55,
      onload: function (n) {
        $(this).append(n);
        $(".loaderContainer").remove();
        initNews();
      },
      continueWhile: function (n) {
        return 100 > n.trim().length ? !1 : !0;
      },
    });
  }, 300);
}
function getResultsHome(a, b) {
  $("#firstResults").append(renderLoader());
  $(".news").perfectScrollbar("update");
  $.ajax({ type: "POST", url: a, success: b });
}
Element.prototype.getElementById = function (a) {
  var b = this.childNodes,
    c;
  var d = 0;
  for (c = b.length; d < c; d++) {
    var e = b[d];
    if (1 === e.nodeType) {
      var f = e.id || e.getAttribute("id");
      if (f === a) return e;
      if ((f = e.getElementById(a))) return f;
    }
  }
  return null;
};
var initNews = function () {
    for (
      var a = document.getElementsByName("initDisplay"), b = 0;
      b < a.length;
      b++
    )
      (parameters = a[b].value.split(";")),
        displayLanguageEditor(parameters[1], parameters[2]);
    $(".userName").initial();
    initTwitterEmbeds();
    highlightCode();
    initEmojis();
  },
  initSubmenu = function () {
    $('li.sidebarListElement[data-option="preview"]').click(BeamerPreview.show);
    $('li.sidebarListElement[data-option="embed"]').click(showEmbedSection);
    $(
      'li.sidebarSubListElement[data-option="all"], li.sidebarSubListElement[data-option="published"], li.sidebarSubListElement[data-option="draft"], li.sidebarSubListElement[data-option="single-user"], li.sidebarSubListElement[data-option="expired"], li.sidebarSubListElement[data-option="archived"]'
    ).click(function () {
      $(this).hasClass("selected") ||
        (clearDashboardSearchInputs(), routie($(this).attr("data-route")));
    });
  },
  initTwitterEmbeds = function (a) {
    0 === $("twitterwidget, twitter-widget").length ||
      (a && 5 < a) ||
      (window.twttr && window.twttr.widgets
        ? $(
            "div:not(.embedded)>twitterwidget, div:not(.embedded)>twitter-widget"
          ).each(function () {
            var b = $(this).attr("data-tweet-id");
            twttr.widgets.createTweet(b, $(this).parent()[0]);
            $(this).parent().addClass("embedded");
            $(this).remove();
          })
        : (a || (a = 0),
          setTimeout(function () {
            a++;
            initTwitterEmbeds(a);
          }, 1e3)));
  },
  displayLanguageEditor = function (a, b) {
    for (
      var c = document.getElementById("feature" + b),
        d = c.getElementsByClassName("featureForm"),
        e = 0;
      e < d.length;
      e++
    )
      (d[e].style.display = "none"),
        c.getElementsByClassName("languageTab")[e].classList.remove("active");
    d = c.getElementById(a + b + "Tab");
    d.classList.add("active");
    c.getElementById(a + b).style.display = "block";
    a = $(d).closest(".feature");
    $(d).attr("data-rtl") && "true" == $(d).attr("data-rtl")
      ? a.hasClass("rtl") || a.addClass("rtl")
      : a.removeClass("rtl");
  };
function confirmDelete(a) {
  showModalConfirm(
    "Delete post",
    "Are you sure you want to <strong>delete</strong> this post?",
    function () {
      EventLogger.getInstance().log("posts:delete", { id: a });
      $.ajax({
        url: "deleteFeature",
        type: "POST",
        data: { id: a, _csrfToken: _csrfToken },
      });
      $("#feature" + a).slideUp("fast", function () {
        var b = $("<div>")
          .addClass("alert")
          .append(
            $("<span>")
              .addClass("closebtn")
              .click(hideTopAlert.bind(null, b))
              .append(
                $("<i>")
                  .addClass("material-icons")
                  .attr("title", "close")
                  .text("close")
              )
          )
          .append($("<strong>").text("Success!"))
          .append(" Post deleted! ")
          .append($("<a>").click(cancelDelete.bind(null, a)).text("Cancel"));
        hideTopAlert();
        $("body").prepend(b);
        showTopAlert(b);
      });
    }
  );
}
function cancelDelete(a) {
  hideTopAlert();
  $.ajax({
    url: "cancelDeletion",
    type: "POST",
    data: { id: a, _csrfToken: _csrfToken },
  });
  $("#feature" + a).slideDown("fast");
}
function confirmArchive(a) {
  showModalConfirm(
    "Archive post",
    "Are you sure you want to <strong>archive</strong> this post?<br>It will no longer be visible in your feed.",
    function () {
      EventLogger.getInstance().log("posts:archive", { id: a });
      $.ajax({
        url: "archiveFeature",
        type: "POST",
        data: { id: a, _csrfToken: _csrfToken },
      });
      $("#feature" + a).slideUp("fast", function () {
        var b = $("<div>")
          .addClass("alert")
          .append(
            $("<span>")
              .addClass("closebtn")
              .click(hideTopAlert.bind(null, b))
              .append(
                $("<i>")
                  .addClass("material-icons")
                  .attr("title", "close")
                  .text("close")
              )
          )
          .append($("<strong>").text("Success!"))
          .append(" Post archived! ")
          .append($("<a>").click(cancelArchive.bind(null, a)).text("Cancel"));
        hideTopAlert();
        $("body").prepend(b);
        showTopAlert(b);
      });
    }
  );
}
function cancelArchive(a) {
  hideTopAlert();
  $.ajax({
    url: "cancelArchive",
    type: "POST",
    data: { id: a, _csrfToken: _csrfToken },
  });
  $("#feature" + a).slideDown("fast");
}
function confirmUnarchive(a) {
  showModalConfirm(
    "Unarchive post",
    "Are you sure you want to <strong>unarchive</strong> this post?<br>It will be visible in your feed if published.",
    function () {
      EventLogger.getInstance().log("posts:unarchive", { id: a });
      $.ajax({
        url: "cancelArchive",
        type: "POST",
        data: { id: a, _csrfToken: _csrfToken },
      });
      $("#feature" + a).slideUp("fast", function () {
        var b = $("<div>")
          .addClass("alert")
          .append(
            $("<span>")
              .addClass("closebtn")
              .click(hideTopAlert.bind(null, b))
              .append(
                $("<i>")
                  .addClass("material-icons")
                  .attr("title", "close")
                  .text("close")
              )
          )
          .append($("<strong>").text("Success!"))
          .append(" Post unarchived! ")
          .append($("<a>").click(cancelUnarchive.bind(null, a)).text("Cancel"));
        hideTopAlert();
        $("body").prepend(b);
        showTopAlert(b);
      });
    }
  );
}
function cancelUnarchive(a) {
  hideTopAlert();
  $.ajax({
    url: "archiveFeature",
    type: "POST",
    data: { id: a, _csrfToken: _csrfToken },
  });
  $("#feature" + a).slideDown("fast");
}
function confirmClone(a) {
  showModalConfirm(
    "Copy post",
    "Are you sure you want to copy this post?",
    function () {
      EventLogger.getInstance().log("posts:clone", { id: a });
      submitAsForm("clone", { id: a });
    }
  );
}
function confirmUnpin(a) {
  showModalConfirm(
    "Unpin post",
    "Are you sure you want to unpin this post?",
    function () {
      EventLogger.getInstance().log("posts:unpin", { id: a });
      $.ajax({
        url: "/cancelPin",
        type: "POST",
        data: { id: a, _csrfToken: _csrfToken },
        success: function () {
          $(".feature.pinnedFeature").slideUp("fast", function () {
            $(this).remove();
          });
          $("#feature" + a).removeClass("pinned");
          "undefined" !== typeof _currentPinnedFeature &&
            (_currentPinnedFeature = null);
        },
      });
    }
  );
}
function confirmPin(a) {
  var b = $("<span>")
    .text("This will pin the post ")
    .append($("<strong>").text("on top of your feed"))
    .append(". We recommend using this option only for important posts.");
  "undefined" !== typeof _currentPinnedFeature &&
    _currentPinnedFeature &&
    b
      .append("<br>Doing so will unpin the post ")
      .append($("<strong>").text(_currentPinnedFeature));
  showModalConfirm("You are about to pin this post", b.html(), function () {
    EventLogger.getInstance().log("posts:pin", { id: a });
    submitAsForm("pinFeature", { id: a });
  });
}
function deleteFeedback(a, b) {
  $.ajax({
    type: "POST",
    url: "deleteFeedback",
    data: { feedbackId: a, undo: b, _csrfToken: _csrfToken },
    success: function () {},
  });
  b
    ? b &&
      (hideTopAlert(),
      $("body").prepend(
        "<div class='alert green'><span class='closebtn' onclick='hideTopAlert(this);'><i class='material-icons' title='close'>close</i></span><strong> Feedback restored.</strong></div>"
      ),
      showTopAlert(),
      $("#feedback" + a).show("slow"),
      EventLogger.getInstance().log("comments:reactivate", { id: a }))
    : (hideTopAlert(),
      $("body").prepend(
        "<div class='alert green'><span class='closebtn' onclick='hideTopAlert(this);'><i class='material-icons' title='close'>close</i></span><strong> Feedback deleted. <a onclick='deleteFeedback(" +
          a +
          ", true)'>Cancel</a></strong></div>"
      ),
      showTopAlert(),
      $("#feedback" + a).hide("slow"),
      EventLogger.getInstance().log("comments:delete", { id: a }));
}
function showOnboardingStep(a) {
  var b = a.split(",");
  a = [];
  for (var c = 99, d = -1, e = 0; e < b.length; e++) {
    var f = $("#" + b[e]),
      k = f.attr("data-step");
    k < c && (c = k);
    k > d && (d = k);
    a.push(f);
  }
  0 < a.length &&
    $(".checklist-step:not(.checklist-status)").each(function () {
      var l = $(this),
        m = l.attr("data-step");
      m < c
        ? l.show().addClass("done").removeClass("active")
        : m <= d
        ? -1 < b.indexOf(l.attr("id"))
          ? l.show().addClass("active").removeClass("done")
          : l.removeClass("done active").hide()
        : l.removeClass("done active");
    });
  updateProgress();
}
function copyToClipboard(a, b) {
  document.getElementById(b).select();
  document.execCommand("copy");
  a.innerHTML = "Copied !";
}
function verifyInstallation(a) {
  $.ajax({
    url: "verifyInstallation",
    data: { _csrfToken: _csrfToken },
    type: "POST",
    statusCode: {
      200: function () {
        _verified = !0;
        var b = function () {
            $(".checklist-step").removeClass("active").addClass("done");
            updateProgress();
            $(".checklist-step:first")
              .addClass("verified")
              .find(".checklist-instructions")
              .slideUp("fast");
            $(".checklist-step:not(:first)").slideUp(500);
          },
          c = $(".checklist-step.checklist-status");
        0 < c.length
          ? c.slideUp("fast", function () {
              c.remove();
              b();
            })
          : b();
      },
      204: function () {
        if (!a) {
          var b = function () {
              var d = $("<div>")
                .attr("class", "checklist-step checklist-status error")
                .append(
                  $("<div>")
                    .attr("class", "note error")
                    .text(
                      "It seems Beamer wasn't installed yet. Make sure you followed the instructions correctly!"
                    )
                );
              $(".checklist-step").last().after(d.hide());
              d.slideDown("fast");
            },
            c = $(".checklist-step.checklist-status");
          0 < c.length
            ? c.slideUp("fast", function () {
                c.remove();
                b();
              })
            : b();
        }
      },
      205: function () {
        window.location = "/home";
      },
    },
  });
}
function startVerification() {
  _verified || (verifyInstallation(!0), setTimeout(startVerification, 6e4));
}
function updateProgress() {
  var a = $(".checklist-step:not(.checklist-status).done")
    .last()
    .attr("data-step");
  if (a) {
    var b = ((parseInt(a) + 1) / 4) * 100 + "%";
    $(".checklist-progress-bar").attr("data-step", a);
    $(".checklist-progress-number").text(b);
  }
}
function updateTimezone(a) {
  var b = {
    timezoneOffset: -new Date().getTimezoneOffset(),
    _csrfToken: _csrfToken,
  };
  try {
    b.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (c) {
    console.error(c);
  }
  "undefined" !== typeof a && a && (b.force = !0);
  $.ajax({ url: "updateTimezone", data: b, type: "POST" });
}
function useCustomDomain() {
  window.Intercom
    ? sendIntercomMessage(
        "I want to use a custom domain for my public newsfeed"
      )
    : (window.location = "/settings#account");
}
function showPublicUrl() {
  var a = getCookie(_showPublicUrlCookie);
  (void 0 !== a && "" !== a && "true" !== a) || $(".feature.publicUrl").show();
}
function hidePublicUrl() {
  setCookie(_showPublicUrlCookie, !1, 3);
  $(".feature.publicUrl").slideUp("fast", function () {
    $(this).remove();
  });
}
function showPushSettings() {
  var a = getCookie(_showPushSettingsCookie);
  (void 0 !== a && "" !== a && "true" !== a) ||
    $(".feature.pushSettings").show();
  initSwitches();
}
function hidePushSettings() {
  setCookie(_showPushSettingsCookie, !1, 3);
  $(".feature.pushSettings").slideUp("fast", function () {
    $(this).remove();
  });
}
function sendIntercomMessage(a) {
  Intercom("showNewMessage", a);
}
function initSlideshow() {
  var a = getCookie(_introSeenCookie);
  if (void 0 === a || null === a || "true" != a) {
    var b = $("#slideshowContainer");
    0 < b.length &&
      setTimeout(function () {
        b.fadeIn("fast");
        var c = b.find(".slider"),
          d = b.find(".slideControls");
        c.find(".button.sliderAction.next").click(function () {
          var e = $(this).closest(".slide").data("slide");
          c.css("left", "-" + 100 * e + "%").attr("data-stage", e);
          d.find(".slidePagination.active").removeClass("active");
          d.children().eq(e).addClass("active");
        });
        c.find(".button.sliderAction.end").click(removeSlideshow);
        b.find(".sliderClose").click(removeSlideshow);
        b.find(".modalOverlay").click(removeSlideshow);
      }, 2e3);
  }
}
function removeSlideshow() {
  $("#slideshowContainer").fadeOut("fast", function () {
    $(this).remove();
  });
  setCookie(_introSeenCookie, !0, 7);
}
function initSearch() {
  var a = $(".dashboardSearch");
  a.find(".dashboardSearchInputContainer").click(function (b) {
    $(event.target).is(".clearDashboardSearch") ||
      $(this).find("input").focus();
  });
  a.find(".dashboardSearchInput")
    .focus(function () {
      a.addClass("active");
      $("html")
        .unbind("click.dashboardSearch")
        .on("click.dashboardSearch", function (b) {
          b = $(b.target);
          b.is(a) ||
            0 !== b.closest(".dashboardSearch").length ||
            b.is(".ui-datepicker") ||
            0 !== b.closest(".ui-datepicker").length ||
            b.is(".ui-icon, .ui-datepicker-current") ||
            (a.removeClass("active"),
            $("html").unbind("click.dashboardSearch"),
            populateSearchParameters());
        });
    })
    .keyup(function (b) {
      "" === $(this).val().trim()
        ? a.addClass("empty")
        : a.removeClass("empty");
      13 == ("which" in b ? b.which : b.keyCode) &&
        ($(this).blur(), populateSearchParameters());
    });
  a.find(".dashboardExtendedSearchInput.date svg").click(function () {
    $(this).prev(".dateInput").datetimepicker("show");
  });
  a.find('input[name="filterByUser"]')
    .closest(".switchbox")
    .click(function () {
      var b = $(this);
      setTimeout(function () {
        b.hasClass("on")
          ? a.find('input[name="filterByUserId"]').addClass("active")
          : a
              .find('input[name="filterByUserId"]')
              .removeClass("active")
              .val("");
      }, 100);
    });
  a.find(".clearDashboardSearch").click(function () {
    routie("posts?published=true&draft=true");
  });
  initSearchDatepicker();
  initSearchFiltersAutocomplete();
  initSearchCategoriesAutocomplete();
  initSwitches();
}
function initSearchDatepicker() {
  var a = $('.dashboardSearch input[name="dateFrom"]'),
    b = $('.dashboardSearch input[name="dateTo"]');
  a.datetimepicker({
    controlType: "select",
    oneLine: !0,
    timeFormat: "hh:mmTT",
    onSelect: function (c) {
      c = a.val();
      "" !== c
        ? ((c = c.split(" ")),
          b.datetimepicker("option", { minDate: c[0], minTime: c[1] }))
        : b.datetimepicker("option", { minDate: !1, minTime: !1 });
    },
  });
  b.datetimepicker({
    controlType: "select",
    oneLine: !0,
    timeFormat: "hh:mmTT",
    onSelect: function (c) {
      c = b.val();
      "" !== c
        ? ((c = c.split(" ")),
          a.datetimepicker("option", { maxDate: c[0], maxTime: c[1] }))
        : a.datetimepicker("option", { maxDate: !1, maxTime: !1 });
    },
  });
}
function initSearchFiltersAutocomplete() {
  var a = $("#dashboardFilterSearch"),
    b = a.find("#filterSearch");
  b &&
    0 !== b.length &&
    ((a = a.find('input[name="role"]')),
    initFiltersAutocomplete(b, a, "#dashboardFilterSearch"));
}
function initSearchCategoriesAutocomplete() {
  var a = $("#categorySearch");
  a &&
    0 !== a.length &&
    (a
      .autocomplete({
        minLength: 0,
        autoFocus: !0,
        appendTo: ".dashboardExtendedSearch",
        source: function (b, c) {
          _categorySearch = null;
          var d = "retrieveCategories",
            e = !0;
          if (b.term) {
            e = b.term.split(";");
            _categorySearch = b = e[e.length - 1].trim();
            d += "?search=" + encodeURIComponent(b);
            if (1 < e.length) {
              b = "";
              for (var f = 0; f < e.length - 1; f++)
                0 < f && (b += ";"), (b += e[f]);
              d += "&current=" + encodeURIComponent(b);
            }
            e = !1;
          }
          b = $('.dashboardSearch input[name="role"]').val().trim();
          "" !== b &&
            (e ? ((d += "?"), (e = !1)) : (d += "&"),
            (d += "role=" + encodeURIComponent(b)));
          b = $('.dashboardSearch input[name="filterByUserId"]').val().trim();
          "" !== b &&
            (e ? ((d += "?"), (e = !1)) : (d += "&"),
            (d += "filterUserId=" + encodeURIComponent(b)));
          $.ajax({
            type: "GET",
            url: d,
            success: function (k) {
              for (var l = [], m = 0; m < k.length; m++)
                (k[m].label = k[m].name),
                  (k[m].value = k[m].category),
                  l.push(k[m]);
              c(l);
            },
          });
        },
        select: function (b, c) {
          b.preventDefault();
          b = c.item.value + ";";
          (c = a.val().trim()) &&
            "" !== c &&
            (_categorySearch &&
              c.endsWith(_categorySearch) &&
              (c = c.substring(0, c.length - _categorySearch.length)),
            "" !== c && (c.endsWith(";") || (c += ";"), (b = c + b)));
          a.val(b);
          return !1;
        },
        focus: function (b, c) {
          b.preventDefault();
          return !1;
        },
      })
      .focus(function () {
        a.data("uiAutocomplete").search(a.val());
      })
      .data("uiAutocomplete")._renderItem = function (b, c) {
      var d = c.label;
      _categorySearch &&
        (d = d
          .replace(
            _categorySearch.toLowerCase(),
            "<b>" + _categorySearch.toLowerCase() + "</b>"
          )
          .replace(
            _categorySearch.toUpperCase(),
            "<b>" + _categorySearch.toUpperCase() + "</b>"
          ));
      var e = c.value;
      e =
        e === d
          ? "Custom"
          : 0 < e.length
          ? e[0].toUpperCase() + e.substr(1).toLowerCase()
          : e.toUpperCase();
      e = "<span>(" + e + ")</span>";
      return $("<li></li>")
        .data("item.autocomplete", c)
        .append("<a>" + d + " " + e + "</a>")
        .appendTo(b);
    });
}
function clearSearch(a) {
  clearDashboardSearchTags();
  clearDashboardSearchInputs();
  routie(a);
}
function clearDashboardSearchInputs() {
  var a = $(".dashboardSearch");
  a.find('input[type="text"], input[type="hidden"]').val("");
  a.find(".languageSelector").val("").attr("selectedIndex", 0);
  a.find(".switchbox").each(function () {
    turnOffSwitch($(this));
  });
  a.find(".selectedFilterContainer .selectedFilter").remove();
  a.find('input[name="filterByUserId"]').removeClass("active");
  a.addClass("empty").removeClass("active");
}
function populateDashboardSearchInputs() {
  $(".dashboardSearch")
    .find('input[type="text"], input[type="hidden"]')
    .each(function () {
      var a = $(this),
        b = getRoutingParameter(a.attr("name"));
      0 < a.closest(".switchbox").length
        ? "true" === b
          ? turnOnSwitch(a.closest(".switchbox"))
          : turnOffSwitch(a.closest(".switchbox"))
        : (b || (b = ""),
          a.val(b),
          "filterByUserId" === a.attr("name") &&
            ("" !== b ? a.addClass("active") : a.removeClass("active")));
    });
}
function routeDashboardSearch() {
  "true" === getRoutingParameter("published")
    ? selectSubmenuOption("published")
    : "true" === getRoutingParameter("draft")
    ? selectSubmenuOption("draft")
    : "true" === getRoutingParameter("filterByUser")
    ? selectSubmenuOption("single-user")
    : "true" === getRoutingParameter("expired")
    ? selectSubmenuOption("expired")
    : "true" === getRoutingParameter("archived")
    ? selectSubmenuOption("archived")
    : selectSubmenuOption("all");
  populateDashboardSearchInputs();
  showSearch();
  doDashboardSearch();
  setCookie(_homeHashCookie, window.location.hash, 3);
}
function doDashboardSearch() {
  var a = getRoutingParameter("search"),
    b = getRoutingParameter("category"),
    c = getRoutingParameter("role"),
    d = getRoutingParameter("filterByUserId"),
    e = getRoutingParameter("dateFrom"),
    f = getRoutingParameter("dateTo"),
    k = getRoutingParameter("published"),
    l = getRoutingParameter("draft"),
    m = getRoutingParameter("expired"),
    q = getRoutingParameter("archived"),
    r = getRoutingParameter("filterByUser"),
    p = getRoutingParameter("language");
  clearDashboardSearchTags();
  "undefined" !== typeof b &&
    "" !== b &&
    addDashboardSearchTag("Category: " + b);
  "undefined" !== typeof c &&
    "" !== c &&
    addDashboardSearchTag("Filters: " + c);
  "undefined" !== typeof d &&
    "" !== d &&
    addDashboardSearchTag("User ID: " + d);
  "undefined" !== typeof e && "" !== e && addDashboardSearchTag("From date");
  "undefined" !== typeof f && "" !== f && addDashboardSearchTag("To date");
  "undefined" !== typeof k && "true" == k && addDashboardSearchTag("Published");
  "undefined" !== typeof l && "true" == l && addDashboardSearchTag("Draft");
  "undefined" !== typeof m && "true" == m && addDashboardSearchTag("Expired");
  "undefined" !== typeof q && "true" == q && addDashboardSearchTag("Archived");
  "undefined" !== typeof r &&
    "true" == r &&
    addDashboardSearchTag("Single-user");
  "undefined" !== typeof p &&
    "" !== p &&
    addDashboardSearchTag("Language: " + p);
  var t = $("#firstResults");
  t.find(".feature, .noFeatures").remove();
  t.nextAll(".feature, .noFeatures").remove();
  retrieveHomePosts(a, b, c, d, e, f, k, l, m, q, r, p, !0);
}
function populateSearchParameters() {
  var a = $(".dashboardSearch"),
    b = [];
  b.push({
    name: "search",
    value: a.find(".dashboardSearchInput").val().trim(),
  });
  a.find(
    'input[name="category"],input[name="role"],input[name="filterByUserId"],input[name="dateFrom"],input[name="dateTo"],input[name="published"],input[name="draft"],input[name="expired"],input[name="archived"],input[name="filterByUser"], select.languageSelector'
  ).each(function () {
    var d = $(this);
    b.push({ name: d.attr("name"), value: d.val().trim() });
  });
  a = !0;
  for (var c = 0; c < b.length; c++)
    if ("" !== b[c].value && "false" !== b[c].value) {
      a = !1;
      break;
    }
  a || setRoutingParameters(b);
}
function addDashboardSearchTag(a) {
  a = $("<div>").addClass("dashboardSearchTag").text(a);
  $(".dashboardSearchTagContainer").removeClass("empty").append(a);
}
function clearDashboardSearchTags() {
  $(".dashboardSearchTagContainer").empty().addClass("empty");
}
function showDeleteMenu(a) {
  var b = $(a).next(".social");
  a = function (e, f, k, l) {
    e.attr("data-direction", k).attr("data-side", l);
    e.find(".socialOverlay, .dropList")
      .css({ display: "block", opacity: 0 })
      .animate({ opacity: 1, height: "auto", display: "block" }, f);
    e.closest(".feature").css("overflow", "initial");
  };
  b = $(b);
  if (!b.hasClass("active")) {
    var c = $(window).scrollTop() + $(window).innerHeight() - 160,
      d = 160 > $(window).outerWidth() - b.offset().left ? "left" : "right";
    b.offset().top > c ? a(b, 300, "upward", d) : a(b, 200, "downward", d);
    b.addClass("active");
    b.siblings(".socialOverlay")
      .unbind("click")
      .one("click", function () {
        hideDeleteMenu(b);
      });
    b.parent()
      .find("a")
      .unbind("click")
      .one("click", function () {
        hideDeleteMenu(b);
      });
    setTimeout(function () {
      $(document).on("click.socialOverlay", function (e) {
        $(e.target).is(".socialLink") ||
          0 !== $(e.target).closest(".socialLink").length ||
          hideDeleteMenu(b);
      });
    }, 50);
  }
}
function hideDeleteMenu(a) {
  $(document).unbind("click.socialOverlay");
  a.find(".dropList").fadeOut(function () {
    a.find(".copiedLink").hide();
    a.find(".copyLink").show();
  });
  a.find(".socialOverlay").hide();
  a.removeClass("active");
  a.closest(".feature").css("overflow", "");
}
function selectSubmenuOption(a) {
  $(".sidebarList>li:not(.hasSublist), .sidebarList>li>ul>li").each(
    function () {
      var b = $(this),
        c = b.attr("data-option");
      "undefined" !== typeof c && c === a
        ? (b.addClass("selected"), showHeaderTitle(b.attr("data-name"), a))
        : b.removeClass("selected");
    }
  );
}
function enablePushNotifications(a, b) {
  b = $(b);
  if (b.hasClass("off"))
    return (
      a.preventDefault(),
      showModalConfirm(
        "Do you want to activate push notifications?",
        "Your users will be shown a prompt, which you can configure later in <strong>Settings</strong>.",
        function () {
          b.unbind("click");
          $.ajax({
            url: "enablePush",
            data: { _csrfToken: _csrfToken },
            type: "POST",
            success: function () {
              turnOnSwitch(b);
              setTimeout(hidePushSettings, 3e3);
            },
          });
          closeModals();
          EventLogger.getInstance().log("settings/push:enable");
        }
      ),
      !1
    );
}
function showEmbedSection() {
  window.location.href = "/embed";
}
function showSearch() {
  0 < $("#firstResults .feature").length && $(".dashboardSearch").show();
}
function hideSearch() {
  $(".dashboardSearch").hide();
}
function highlightCode() {
  "undefined" !== typeof hljs &&
    $(".featureContent pre:not(.highlighted) code").each(function () {
      var a = $(this).parent();
      hljs.highlightBlock(a[0]);
      a.addClass("highlighted");
    });
}
function initEmojis() {
  emojify(
    $(".feature").find(".featureTitle, .featureContent, featureActionLink"),
    "emojified",
    !0,
    ["2122", "a9", "ae"]
  );
}
function enableNps(a) {
  showModalConfirm(
    "Are you sure you want to enable NPS in your account?",
    function () {
      turnOnSwitch($("#enableNps").closest(".switchbox"));
      EventLogger.getInstance().log("nps/settings:enable");
      $.ajax({
        url: "enableNps",
        type: "POST",
        data: { _csrfToken: _csrfToken },
        success: function () {
          window.location.href = "/nps";
        },
      });
    }
  );
}
function hideNpsPrompt() {
  $(".feature.npsPrompt").slideUp("fast", function () {
    $(this).closest(".chartContainer").remove();
  });
  $.ajax({
    url: "closeNpsEnablePrompt",
    type: "POST",
    data: { _csrfToken: _csrfToken },
  });
}
function showReactions(a, b) {
  0 != b &&
    (showModal(
      "Reactions",
      '<iframe src="/reducedAnalytics?featureId=' +
        a +
        '#reactions-positive"></iframe>',
      null,
      "reactionsModal"
    ),
    showHeaderExport(a));
}
var showHeaderExport = function (a) {
    var b = $(".modalHeader");
    b.find(".exportButton, .loaderContainer.export").remove();
    var c = renderLoader().addClass("export").hide(),
      d = $("<div>")
        .addClass("exportButton")
        .append($("<i>").addClass("material-icons").text("import_export"))
        .append($("<span>").addClass("text").text("Export to CSV"))
        .click(function () {
          $(this).hasClass("disabled") || exportReactions(a);
        });
    d.append(c);
    b.find(".modalTitle").before(d);
  },
  exportReactions = function (a) {
    var b = {};
    "undefined" !== typeof a && a && (b.featureId = a);
    var c = $(".modalHeader").find(".exportButton");
    c.addClass("disabled").find(".text").text("Exporting...");
    _exportRequest = $.ajax({
      url: "exportReaction",
      type: "GET",
      xhrFields: { responseType: "blob" },
      data: b,
      success: function (d, e, f) {
        e = "";
        (f = f.getResponseHeader("Content-Disposition")) &&
          -1 !== f.indexOf("attachment") &&
          ((f = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(f)),
          null != f && f[1] && (e = f[1]));
        0 === e.indexOf("UTF-8''") && (e = e.substr(7));
        f = document.createElement("a");
        d = window.URL.createObjectURL(d);
        f.href = d;
        f.download = e;
        document.body.append(f);
        f.click();
        f.remove();
        window.URL.revokeObjectURL(d);
      },
      complete: function () {
        _exportRequest = null;
        c.removeClass("disabled").find(".text").text("Export to CSV");
      },
    });
  };
function initSubmenuNotifications() {
  $("li.sidebarListElement.hasSublist").click(function (a) {
    0 === $(a.target).closest(".sidebarSubList").length &&
      ((a = $(this)),
      a.hasClass("open")
        ? a.removeClass("open")
        : a.addClass("open").find("li.sidebarSubListElement").first().click());
  });
  $(".sidebarList li[data-tab]").click(function () {
    var a = $(this);
    goToTab(a.attr("data-tab"));
    $(".sidebar").addClass("active");
    $("body").attr("data-back", "true");
  });
}
function dismissChangelogOnboarding() {
  showModalConfirm(
    "Are you sure you want to dismiss the <strong>onboarding</strong>?",
    function () {
      dismissOnboarding("dismissChangelogOnboarding");
    }
  );
}
