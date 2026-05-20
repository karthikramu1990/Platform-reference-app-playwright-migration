export const Locator = {
  modelcomposerBtn: '[aria-label="Model Composer"]',
  annotationsBtn: '[id*="annotations-submenu"]',
  displayAccuracyBtn: 'xpath=//div[text()="Display Accuracy"]/ancestor::div[2]//input',
  annotationPanel: "annotations-panel",
  viewer3D: 'div[id^="view3d"] canvas',
  viewer2D: 'div[id^="view2d"] canvas',
  disciplines: 'div:has-text("Disciplines")',
  designerView: 'div[class^="SidePanel-module_sidePanelContent"] > div:nth-child(2)',
  designerMenu: 'button:has([data-testid="MoreVertIcon"])',
  autoCompose: 'input[name="enableAutoComposeTitle"]',
  helpers: '//div[text()="Helpers"]',

  // ── Panel Title ───────────────────────────────────────────────────────
  federatedPanelTitle: '(//div[contains(@class,"IafHeading-module_list-item-title")])[2]',

  // ── Search ────────────────────────────────────────────────────────────
  searchPhysicalModels: '.MuiInputBase-input.MuiInput-input',

  // ── 3-dot (MoreVert) buttons ──────────────────────────────────────────
  federatedThreeDots: 'li:has(p[withsubtext="Federated"]) button',
  federatedSThreeDots: 'li:has(p[withsubtext*="-S-"]) button',
  federatedAThreeDots: 'li:has(p[withsubtext*="-A-"]) button',
  federatedHThreeDots: 'xpath=//p[contains(@withsubtext,"-H")]/ancestor::li//button',
  federatedEThreeDots: 'xpath=//p[contains(@withsubtext,"-E")]/ancestor::li//button',
  federatedPThreeDots: 'li:has(p[withsubtext*="-P"]) button',
  federatedFThreeDots: 'xpath=//p[contains(@withsubtext,"-F")]/ancestor::li//button',

  // ── Federated parent dropdown menu items ─────────────────────────────
  menuRename: '//li[@role="menuitem" and contains(.,"Rename")]',
  menuSwitchToLoadEverything: '//li[@role="menuitem" and contains(.,"Switch to Load Everything")]',
  menuShowAll: '//li[@role="menuitem" and contains(.,"Show All")]',
  menuHideAll: '//li[@role="menuitem" and contains(.,"Hide All")]',

  // ── Sub-item dropdown menu items ──────────────────────────────────────
  menuLoad: '//li[@role="menuitem" and contains(.,"Load")]',
  menuShow: '//li[@role="menuitem" and contains(.,"Show")]',
  menuHide: '//li[@role="menuitem" and contains(.,"Hide")]',
  menuRenameSubItem: '//li[@role="menuitem" and contains(.,"Rename")]',

  // ── Viewer Toolbar ────────────────────────────────────────────────────
  resetView: '[aria-label="Reset View"]',
  projection: '[aria-label="Projection"]',
  viewToolbar: '[aria-label="View"]',

  // ── View Options ──────────────────────────────────────────────────────
  topView: '//span[text()="Top View"]',
  bottomView: '//span[text()="Bottom View"]',
  leftView: '//span[text()="Left View"]',
  rightView: '//span[text()="Right View"]',
  frontView: '//span[text()="Front View"]',
  backView: '//span[text()="Back View"]',

  // ── Shading Options ───────────────────────────────────────────────────
  shadingToolbar: '[aria-label="Shading"]',
  fullShadingWithLines: '//span[text()="Full Shading, with Lines"]',
  fullShadingNoLines: '//span[text()="Full Shading, no Lines"]',
  edgesAndLines: '//span[text()="Edges & Lines"]',
  glassView: '//span[text()="Glass View"]'
}
