var _optionSeenCookie = "_BEAMER_MENU_OPTION_SEEN";
initResponsiveness();
$(document).ready(function () {
  initInitials();
  initFloatingMenu();
  initMobileMenu();
  initUnseenOptionMarkers();
  initInsights();
  showTopAlert();
  var alert = $(".alert:not(.hiding)");
  if (alert.length > 0) {
    setTimeout(function () {
      alert.each(function () {
        var sticky = $(this).attr("data-sticky");
        if (typeof sticky === undefined || sticky != "true") {
          hideTopAlert($(this));
        }
      });
    }, 10000);
  }
});
function initResponsiveness() {
  if (isMobile()) {
    $("body").attr("data-menu", "off").addClass("mobile");
    if (isSafari()) {
      $("body").addClass("safari");
    }
  }
}
function initFloatingMenu() {
  var showOnHover = $(window).outerWidth() > 900;
  var menuCard = $(".menu .menuCard");
  if (showOnHover) {
    var menuHoverTimeout;
    $(".menu .menuCard, .menu .user .account")
      .unbind("mouseenter")
      .on("mouseenter", function () {
        if (menuHoverTimeout) {
          clearTimeout(menuHoverTimeout);
          menuHoverTimeout = null;
        }
        showFloatingMenu();
      })
      .unbind("mouseleave")
      .on("mouseleave", function () {
        menuHoverTimeout = setTimeout(function () {
          hideFloatingMenu();
          menuHoverTimeout = null;
        }, 1000);
      });
    var workspaceHoverTimeout;
    menuCard
      .find(".account, .workspace")
      .unbind("mouseenter")
      .on("mouseenter", function () {
        if (workspaceHoverTimeout) {
          clearTimeout(workspaceHoverTimeout);
          workspaceHoverTimeout = null;
        }
        showFloatingMenuWorkspace();
      })
      .unbind("mouseleave")
      .on("mouseleave", function () {
        workspaceHoverTimeout = setTimeout(function () {
          hideFloatingMenuWorkspace();
          workspaceHoverTimeout = null;
        }, 1000);
      });
  } else {
    $(".menu .menuCard, .menu .user .account")
      .unbind("click")
      .on("click", function (event) {
        var target = $(event.target);
        if (
          !target.is(".action.close") &&
          target.closest(".action.close").length === 0
        ) {
          showFloatingMenu();
        }
      });
    menuCard
      .find(".account, .workspace")
      .unbind("click")
      .on("click", function () {
        showFloatingMenuWorkspace();
      });
  }
  menuCard
    .find(".workspace .options li.option:not(current)")
    .click(function () {
      var id = $(this).attr("data-id");
      if (typeof id !== "undefined") {
        selectAccount(id);
      }
    });
  menuCard.find(".workspace .options .action").click(function () {
    var action = $(this).attr("data-action");
    if (action === "create-new") {
      var id = $(this).attr("data-id");
      if (typeof id !== "undefined") {
        createAccount(id);
      }
    } else if (action === "merge") {
      showMergeModal();
    } else if (action === "back") {
      hideFloatingMenuWorkspace();
    }
  });
  menuCard.find(".userinfo").click(function () {
    window.location = "/settings#user";
  });
  menuCard.find(".nav.actions").click(function () {
    var action = $(this).attr("data-action");
    if (action === "close") {
      hideFloatingMenu();
    }
  });
}
function showFloatingMenu() {
  var menuCard = $(".menu .menuCard");
  menuCard.addClass("ready");
  setTimeout(function () {
    menuCard.addClass("active");
    $("body").addClass("menuActive");
  }, 10);
  setTimeout(function () {
    $("html")
      .unbind("click.menu")
      .on("click.menu", function (event) {
        var target = $(event.target);
        if (
          !target.is(".workspace, .account") &&
          target.closest(".workspace, .account").length === 0
        ) {
          hideFloatingMenu();
        }
      });
  }, 300);
}
function hideFloatingMenu() {
  var menuCard = $(".menu .menuCard");
  menuCard.removeClass("active");
  setTimeout(function () {
    menuCard.removeClass("ready");
    $("body").removeClass("menuActive");
    hideFloatingMenuWorkspace();
  }, 300);
  $("html").unbind("click.menu");
}
function showFloatingMenuWorkspace() {
  var menuCard = $(".menu .menuCard");
  var workspace = menuCard.find(".workspace");
  menuCard.find(".account").addClass("active");
  workspace.addClass("ready");
  setTimeout(function () {
    workspace.addClass("active");
  }, 10);
  setTimeout(function () {
    $("html")
      .unbind("click.menuWorkspace")
      .on("click.menuWorkspace", function (event) {
        var target = $(event.target);
        if (
          !target.is(".workspace, .account") &&
          target.closest(".workspace, .account").length === 0
        ) {
          hideFloatingMenuWorkspace();
        }
      });
  }, 300);
}
function hideFloatingMenuWorkspace() {
  var menuCard = $(".menu .menuCard");
  menuCard.find(".account, .workspace").removeClass("active");
  setTimeout(function () {
    menuCard.find(".account, .workspace").removeClass("ready");
  }, 300);
  $("html").unbind("click.menuWorkspace");
}
function selectAccount(id) {
  submitAsForm("selectUser", { id: id });
}
function createAccount(productId) {
  var actions = [
    { label: "Cancel", action: closeModals },
    {
      label: "Create",
      primary: true,
      action: function () {
        closeModals();
        window.location = "/create?cta=dashboard_menu&ref=multi_" + productId;
      },
    },
  ];
  showModal(
    "",
    "Are you sure you want to create a <b>new account</b>?",
    actions
  );
}
function isMobile() {
  var check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
function displayStartupBlock(customFeature, type) {
  var block = $("#globalBlock");
  if (customFeature && customFeature.trim() !== "") {
    block.find(".modalTitle.default").hide();
    block
      .find(".modalTitle.custom")
      .show()
      .find(".customFeature")
      .text(customFeature);
    try {
      var refUpgrade =
        window.location.pathname.replace("/", "") +
        "_" +
        customFeature.toLowerCase().replace(/\s+/g, "-");
      var anchor = block.find("a.action.primary");
      var href = anchor.attr("href");
      if (href.indexOf("refUpgrade=") >= 0) {
        href = href.replace(/[?&]refUpgrade=[^&]+/, "");
      }
      if (href.indexOf("?") >= 0) {
        href += "&";
      } else {
        href += "?";
      }
      href += "refUpgrade=" + encodeURIComponent(refUpgrade);
      anchor.attr("href", href);
    } catch (e) {}
  } else {
    block.find(".modalTitle.custom").hide();
    block.find(".modalTitle.default").show();
  }
  if (type && type.trim() !== "") {
    block.find(".popUpgrade").attr("data-feature", type);
  } else {
    block.find(".popUpgrade").attr("data-feature", "");
  }
  block.fadeIn("fast");
  $(".news").addClass("blocked");
  if (block.find(".modalClose:visible").length > 0) {
    setTimeout(function () {
      $("html").one("click.hidePlanBlock", hidePlanBlock);
    }, 100);
  }
}
function displayProPlanBlock(customFeature, type) {
  var block = $("#globalProBlock");
  if (customFeature && customFeature.trim() !== "") {
    block.find(".modalTitle.default").hide();
    block
      .find(".modalTitle.custom")
      .show()
      .find(".customFeature")
      .text(customFeature);
    try {
      var refUpgrade =
        window.location.pathname.replace("/", "") +
        "_" +
        customFeature.toLowerCase().replace(/\s+/g, "-");
      var anchor = block.find("a.action.primary");
      var href = anchor.attr("href");
      if (href.indexOf("refUpgrade=") >= 0) {
        href = href.replace(/[?&]refUpgrade=[^&]+/, "");
      }
      if (href.indexOf("?") >= 0) {
        href += "&";
      } else {
        href += "?";
      }
      href += "refUpgrade=" + encodeURIComponent(refUpgrade);
      anchor.attr("href", href);
    } catch (e) {}
  } else {
    block.find(".modalTitle.custom").hide();
    block.find(".modalTitle.default").show();
  }
  if (type && type.trim() !== "") {
    block.find(".popUpgrade").attr("data-feature", type);
  } else {
    block.find(".popUpgrade").attr("data-feature", "");
  }
  block.fadeIn("fast");
  $(".news").addClass("blocked");
  if (block.find(".modalClose:visible").length > 0) {
    setTimeout(function () {
      $("html").one("click.hidePlanBlock", hidePlanBlock);
    }, 100);
  }
}
function hidePlanBlock() {
  $("#globalBlock, .cardLock").hide();
  $(".news").removeClass("blocked");
}
function initInitials(retrieveGravatar) {
  if (
    (typeof intercomSettings !== "undefined" &&
      intercomSettings.code === "mZXqptmd65") ||
    (typeof retrieveGravatar !== "undefined" && retrieveGravatar)
  ) {
    $(".js-initial:not(.initialized), .feedbackInfo .initial:not(.initialized)")
      .addClass("initialized")
      .initial()
      .each(function () {
        var element = $(this);
        var email = element.attr("data-email");
        if (typeof email !== "undefined" && email !== "") {
          var url =
            "https://gravatar.com/avatar/" + md5(email) + "?d=blank&s=40";
          $.ajax({
            url: url,
            type: "GET",
            crossDomain: true,
            success: function (data, status, xhr) {
              try {
                if (parseInt(xhr.getResponseHeader("Content-Length")) > 140) {
                  element.attr("src", url);
                }
              } catch (e) {}
            },
          });
        }
      });
  } else {
    $(".js-initial:not(.initialized), .feedbackInfo .initial:not(.initialized)")
      .addClass("initialized")
      .initial();
  }
}
function showHeaderTitle(text, dataName, id, beta) {
  hideHeaderTitle();
  var title = $("<div>").addClass("vistaTitle").append($("<span>").text(text));
  if (typeof beta !== "undefined" && beta) {
    title.append($("<div>").addClass("beta").text("Beta"));
  }
  if (typeof dataName !== "undefined" && dataName.trim() !== "") {
    title.attr("data-content", dataName);
  }
  if (typeof id !== "undefined" && !!id && id.trim() !== "") {
    var id = $("<div>")
      .addClass("vistaId")
      .append("ID: ")
      .append($("<span>").text(id));
    title.append(id);
  }
  $(".contentHeader")
    .attr("data-content", dataName)
    .find(".contentTitle")
    .after(title);
}
function hideHeaderTitle() {
  $(".contentHeader .vistaTitle").remove();
}
function renderTopAlert(message, isError) {
  hideTopAlert();
  var alert = $("<div>")
    .addClass("alert")
    .append(
      $("<span>")
        .addClass("closebtn")
        .click(function () {
          hideTopAlert(alert);
        })
        .append(
          $("<i>")
            .addClass("material-icons")
            .attr("title", "close")
            .text("close")
        )
    )
    .append(message);
  if (typeof isError !== "undefined" && isError) {
    alert.addClass("red");
  }
  $("body").append(alert);
  showTopAlert(alert);
}
function showTopAlert(element, onClick) {
  if (typeof element === "undefined") {
    element = $(".alert:not(.hiding)");
  } else {
    element = $(element);
    if (!element.is(".alert")) {
      element = element.closest(".alert");
    }
  }
  if (element.length > 0) {
    element.addClass("ready");
    setTimeout(function () {
      element.addClass("active");
    }, 10);
  }
  if (typeof onClick !== "undefined") {
    element.click(onClick);
  }
}
function hideTopAlert(element) {
  if (typeof element === "undefined") {
    element = $(".alert");
  } else {
    element = $(element);
    if (!element.is(".alert")) {
      element = element.closest(".alert");
    }
  }
  if (element.length > 0) {
    element.addClass("hiding").removeClass("active");
    setTimeout(function () {
      element.removeClass("ready").remove();
      $(".container").removeClass("alerted");
    }, 500);
  }
}
function renderLoader(size) {
  var loaderContainer = $("<div>").addClass("loaderContainer");
  var loaderElement = $("<div>").addClass("loaderElement");
  if (
    typeof size !== "undefined" &&
    (typeof size === "string" || size instanceof String)
  ) {
    loaderElement.attr("data-size", size);
  }
  var loaderSubelement = $("<div>").addClass("loaderSubelement");
  loaderElement.append(loaderSubelement);
  loaderContainer.append(loaderElement);
  return loaderContainer;
}
function renderMenuMarker(menuOption, number) {
  var newMarker = $("<div>").addClass("newMarker");
  if (typeof number !== "undefined" && number > 0) {
    var label = number;
    if (number > 99) {
      label = "99+";
    }
    newMarker.addClass("hasText").text(label);
  }
  menuOption.append(newMarker);
}
function renderFaviconCounter(number) {
  if (number === 0) {
    return;
  }
  Beamer.appendFaviconScript();
  var interval = setInterval(function () {
    if (!("Favico" in window)) {
      return;
    }
    clearInterval(interval);
    var badge = Math.min(number, 99);
    var links = document
      .getElementsByTagName("head")[0]
      .getElementsByTagName("link");
    for (var i = 0; i < links.length; i++) {
      if (/(^|\s)icon(\s|$)/i.test(links[i].getAttribute("rel"))) {
        new Favico({
          animation: "fade",
          bgColor: "#5f6fe6",
          element: links[i],
        }).badge(badge);
      }
    }
  }, 500);
}
function upgradeEnterprise() {
  if (window.Intercom) {
    Intercom("showNewMessage", "Hi, please upgrade my account to Scale");
  }
}
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  var cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  document.cookie = cookie;
}
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  var value = null;
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    try {
      c = decodeURIComponent(c);
    } catch (e) {}
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      value = c.substring(name.length, c.length);
    }
  }
  if (value != null) {
    return value;
  }
  return "";
}
function logout() {
  EventLogger.getInstance().logout();
  setTimeout(function () {
    window.location = "/logout";
  }, 100);
}
function initSwitches() {
  $(".switchbox:not(.checked):not(.readMore):not(.disabled):not(.binded)")
    .addClass("binded")
    .find(".switch")
    .click(function () {
      var switchbox = $(this).closest(".switchbox");
      if (switchbox.hasClass("on")) {
        turnOffSwitch(switchbox);
      } else {
        turnOnSwitch(switchbox);
      }
    });
  $(".switchbox:not(.checked).readMore:not(.disabled):not(.binded)")
    .addClass("binded")
    .find(".switch")
    .click(function () {
      var switchbox = $(this).closest(".switchbox");
      if (!switchbox.hasClass("on")) {
        var standaloneSwitch = $(".switchbox.standalone");
        if (standaloneSwitch.hasClass("on")) {
          turnOnSwitch(switchbox);
        } else {
          showModalAlert(
            "The <b>read more</b> button will redirect your users to the standalone view of the post.<br>Your standalone page option should be enabled for this!"
          );
        }
      } else {
        turnOffSwitch(switchbox);
      }
    });
  $(".switchbox.checked:not(.binded)")
    .addClass("binded")
    .click(function () {
      var switchbox = $(this);
      if (switchbox.hasClass("on")) {
        turnOffSwitch(switchbox);
      } else {
        turnOnSwitch(switchbox);
      }
    });
}
function turnOnSwitch(switchbox) {
  switchbox.addClass("on").removeClass("off").find("input").val(true);
  switchbox.trigger("on");
}
function turnOffSwitch(switchbox) {
  switchbox.addClass("off").removeClass("on").find("input").val(false);
  switchbox.trigger("off");
}
function initUnseenOptionMarkers() {
  countUnseenNpsResponses();
  countUnseenFeedbackResponses();
  countUnseenInboxResponses();
  countUnseenRoadmapResponses();
}
function countUnseenNpsResponses() {
  var menuOption = $('.menu a[href="nps"] .menuOption');
  if (menuOption.length > 0 && !menuOption.is(".active")) {
    $.ajax({
      url: "npsUnseenResponses",
      type: "GET",
      success: function (count) {
        if (count > 0) {
          renderMenuMarker(menuOption, count);
        } else if (count === -1) {
          renderMenuMarker(menuOption);
        }
      },
    });
  }
}
function countUnseenFeedbackResponses() {
  var menuOption = $(
    '.menu a[href="comments"][data-enabled="true"] .menuOption'
  );
  if (menuOption.length > 0 && !menuOption.is(".active")) {
    $.ajax({
      url: "feedbackUnseenResponses",
      type: "GET",
      success: function (count) {
        if (count > 0) {
          renderMenuMarker(menuOption, count);
        }
      },
    });
  }
}
function countUnseenInboxResponses() {
  var menuOption = $('.menu a[href="inbox"][data-enabled="true"] .menuOption');
  if (menuOption.length > 0 && !menuOption.is(".active")) {
    $.ajax({
      url: "inboxUnseenResponses",
      type: "GET",
      success: function (count) {
        if (count > 0) {
          renderMenuMarker(menuOption, count);
          renderFaviconCounter(count);
        }
      },
    });
  }
}
function countUnseenRoadmapResponses() {
  var menuOption = $(
    '.menu a[href="feedback"][data-enabled="true"] .menuOption'
  );
  if (menuOption.length > 0) {
    $.ajax({
      url: "inboxUnseenResponses",
      type: "GET",
      data: { type: "allRequests", menu: true },
      success: function (count) {
        if (count > 0) {
          if (!menuOption.is(".active")) {
            renderMenuMarker(menuOption, count);
          } else {
            $(
              '.sidebarListElement[data-option="roadmapInbox"]:not(.open)'
            ).append($("<div>").addClass("notificationDot").text(count));
          }
        } else if (count === -1) {
          renderMenuMarker(menuOption);
        }
      },
    });
  }
}
function initMobileMenu() {
  var mobileMenu = $(".mobileMenu");
  mobileMenu.click(function () {
    var dataMenu = $("body").attr("data-menu");
    if (dataMenu == "on") {
      $("body").attr("data-menu", "off");
    }
    if (dataMenu == "off") {
      $("body").attr("data-menu", "on");
    }
  });
}
function initInitialsForError(element) {
  $(element).initial();
}
function submitAsForm(action, parameters) {
  var form = $("<form>")
    .hide()
    .attr("action", action)
    .attr("method", "POST")
    .append(
      $("<input>")
        .attr("type", "hidden")
        .attr("name", "_csrfToken")
        .val(_csrfToken)
    );
  if (typeof parameters !== "undefined") {
    for (var name in parameters) {
      form.append(
        $("<input>")
          .attr("type", "hidden")
          .attr("name", name)
          .val(parameters[name])
      );
    }
  }
  $("body").append(form);
  form.submit();
}
function dismissOnboarding(action) {
  $.ajax({
    url: action,
    type: "POST",
    data: { _csrfToken: _csrfToken },
    success: function () {
      $(".feature.checklist").slideUp();
    },
  });
}
function initInsights() {
  $('.insights:not([data-binded="true"])')
    .attr("data-binded", true)
    .each(function () {
      var insights = $(this);
      insights.find(".navDot").on("click", function () {
        showInsight(this);
        if (typeof insightsInterval !== "undefined") {
          clearInterval(insightsInterval);
        }
      });
      var insightsInterval = setInterval(function () {
        var activeNavDot = insights.find(".navDot.active");
        var nextNavDot = activeNavDot.next(".navDot");
        if (nextNavDot.length === 0) {
          nextNavDot = activeNavDot.siblings(".navDot").first();
        }
        if (nextNavDot.length === 1 && !nextNavDot.is(activeNavDot)) {
          showInsight(nextNavDot);
        }
      }, 10000);
    });
}
function showInsight(navDot) {
  navDot = $(navDot);
  if (!navDot.hasClass("active")) {
    navDot.addClass("active");
    navDot.siblings().removeClass("active");
    var currentNotice = navDot.index() + 1;
    navDot
      .closest(".insights")
      .find(".noticeRail .notice:nth-child(" + currentNotice + ")")
      .addClass("in")
      .siblings()
      .removeClass("in");
  }
}
