/**
 * Add Web Title
 */

function addWebTitle() {
  var webTitle = document.createElement("h1");
  webTitle.className = "web-title";
  webTitle.innerText = "Học lập trình HTML";

  var body = document.querySelector("body");
  body.append(webTitle);
}

/**
 * Add Button Go To Home
 * @param {Node} btnGoHome
 */
function addBtnGoHome(btnGoHome) {
  var imgGoHome = new Image();
  imgGoHome.src =
    "https://www.rawshorts.com/freeicons/wp-content/uploads/2017/01/blue_repicthousebase_1484336386-1.png";
  imgGoHome.onload = function () {
    btnGoHome.append(imgGoHome);
  };
  btnGoHome.addEventListener("click", function () {
    window.location.href = "/";
  });
}

/**
 * Hanlder color of Code
 */

function removeOtherIndent(code) {
  function indentSpace(codeStr) {
    var maStr = codeStr.match(/^\n\s*/);
    return maStr && maStr[0];
  }
  var indent = indentSpace(code);
  if (indent) {
    return code.replaceAll(indent, "\n").trim();
  }
  return code;
}

function addColor(
  codeStr,
  regex,
  replaceName,
  trim = true,
  currentReplace,
  replaceValue
) {
  var attrs = [...codeStr.matchAll(regex)];
  var nextCode = {
    code: codeStr,
    replaces: [],
  };

  attrs.forEach(function (attr, attrIndex) {
    var replace = attr[0].substr(
      currentReplace.subStart,
      attr[0].length - currentReplace.subEnd
    );
    var nextReplaceValue = attr[0].substr(
      replaceValue.subStart,
      attr[0].length - replaceValue.subEnd
    );
    nextCode.code = nextCode.code.replaceAll(
      replace,
      `{{${replaceName}${attrIndex}}}`
    );
    nextCode.replaces.push({
      replaceName: `{{${replaceName}${attrIndex}}}`,
      replaceValue: `${replaceValue.prefix}${
        replaceValue.value
          ? trim
            ? replaceValue.value.trim()
            : replaceValue.value
          : trim
          ? nextReplaceValue.trim()
          : nextReplaceValue
      }${replaceValue.suffix}`,
    });
  });

  return nextCode;
}


function submitStyleCode(codeObj) {
  codeObj.replaces.forEach(function (replace) {
    codeObj.code = codeObj.code.replaceAll(
      replace.replaceName,
      replace.replaceValue
    );
  });
  return codeObj.code;
}

function handleStyleCode(code) {
  var nextCode = {
    code,
    replaces: [],
  };
  nextCode.code = removeOtherIndent(nextCode.code);
  var codeAfterAddColorComment = addColor(
    nextCode.code,
    /<!--(.+?)-->/g,
    "comment",
    false,
    { subStart: 0, subEnd: 0 },
    {
      prefix: '<span class="code-comment">&lt;!--',
      suffix: "--&gt;</span>",
      subStart: 4,
      subEnd: 7,
    }
  );

  var codeAfterAddColorTagName = addColor(
    codeAfterAddColorComment.code,
    /<\/?\s*\w+/g,
    "tagName",
    true,
    { subStart: 1, subEnd: 0 },
    {
      prefix: '<span class="code-tag-name">',
      suffix: "</span>",
      subStart: 1,
      subEnd: 0,
    }
  );
  var codeAfterAddColorValueAttr = addColor(
    codeAfterAddColorTagName.code,
    /"(.+?)"/g,
    "valueAttr",
    true,
    { subStart: 0, subEnd: 0 },
    {
      prefix:
        '<span class="code-quot">&quot;</span><span class="code-value-attr">',
      suffix: '</span><span class="code-quot">&quot;</span>',
      subStart: 1,
      subEnd: 2,
    }
  );
  var codeAfterAddColorAttr = addColor(
    codeAfterAddColorValueAttr.code,
    /\w+\s*=/g,
    "attr",
    true,
    { subStart: 0, subEnd: 1 },
    {
      prefix: '<span class="code-attr">',
      suffix: "</span>",
      subStart: 0,
      subEnd: 1,
    }
  );
  var codeAfterAddColorSymbolDoctype = addColor(
    codeAfterAddColorAttr.code,
    /<!/g,
    "doctype",
    false,
    { subStart: 0, subEnd: 0 },
    {
      prefix: '<span class="code-symbol">',
      value: "&lt;!",
      suffix: "</span>",
      subStart: 0,
      subEnd: 0,
    }
  );
  var codeAfterAddColorSymbolOpenOfTagClose = addColor(
    codeAfterAddColorSymbolDoctype.code,
    /<\//g,
    "openOfCloseTag",
    false,
    { subStart: 0, subEnd: 0 },
    {
      prefix: '<span class="code-symbol">',
      value: "&lt;/",
      suffix: "</span>",
      subStart: 0,
      subEnd: 0,
    }
  );
  var codeAfterAddColorSymbolOpenTag = addColor(
    codeAfterAddColorSymbolOpenOfTagClose.code,
    /</g,
    "lt",
    false,
    { subStart: 0, subEnd: 0 },
    {
      prefix: '<span class="code-symbol">',
      value: "&lt;",
      suffix: "</span>",
      subStart: 0,
      subEnd: 0,
    }
  );
  var codeAfterAddColorSymbolCloseTag = addColor(
    codeAfterAddColorSymbolOpenTag.code,
    />/g,
    "gt",
    false,
    { subStart: 0, subEnd: 0 },
    {
      prefix: '<span class="code-symbol">',
      value: "&gt;",
      suffix: "</span>",
      subStart: 0,
      subEnd: 0,
    }
  );
  nextCode = {
    code: codeAfterAddColorSymbolCloseTag.code,
    replaces: [
      ...codeAfterAddColorComment.replaces,
      ...codeAfterAddColorTagName.replaces,
      ...codeAfterAddColorValueAttr.replaces,
      ...codeAfterAddColorAttr.replaces,
      ...codeAfterAddColorSymbolDoctype.replaces,
      ...codeAfterAddColorSymbolOpenOfTagClose.replaces,
      ...codeAfterAddColorSymbolOpenTag.replaces,
      ...codeAfterAddColorSymbolCloseTag.replaces,
    ],
  };


  return submitStyleCode(nextCode);
}

function handleRenderCode() {
  var codeBoxs = document.querySelectorAll("noscript.code");
  codeBoxs.forEach(function (codeBox) {
    var code = document.createElement("code");
    var codeParrent = document.createElement("div");
    code.innerHTML = handleStyleCode(codeBox.innerText);
    codeParrent.className = "code-group";
    codeParrent.appendChild(code);
    codeBox.parentElement.insertBefore(codeParrent, codeBox);
  });
}


function handleStyleExample() {
  var divEx = document.querySelectorAll('div.example');
  divEx.forEach(ex => {
    var viewMore = document.createElement('span');
    viewMore.className = "viewmore";
    viewMore.innerText = "Xem Thêm";
    viewMore.onclick = (e) => {
      ex.classList.add('open')
    }
    ex.append(viewMore)
  })
}

window.onload = function () {
  addWebTitle();

  var btnGoHome = document.getElementById("btn_home");
  if (btnGoHome) {
    addBtnGoHome(btnGoHome);
  }

  handleRenderCode();
  handleStyleExample();
};
