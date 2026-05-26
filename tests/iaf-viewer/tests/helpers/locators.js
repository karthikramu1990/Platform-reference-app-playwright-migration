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

  // ── 2D Viewer Controls ────────────────────────────────────────────────
  twoDDragArea: '(//div[@aria-label="Drag Area"])[1]',
  twoDFullScreen: '(//div[@aria-label="Full Screen"])[1]',
  twoDHalfScreen: '(//div[@aria-label="Half Screen"])[1]',
  twoDZoomIn: '(//div[@aria-label="Zoom In"])[1]',
  twoDZoomOut: '(//div[@aria-label="Zoom Out"])[1]',

  // ── Viewer Toolbar ────────────────────────────────────────────────────
  resetView: '[aria-label="Reset View"]',
  projection: '[aria-label="Projection"]',
  viewToolbar: '[aria-label="View"]',
  viewer2DToolbar: '[aria-label="2D Viewer"]',
  viewer3DToolbar: '[aria-label="3D Viewer"]',
  focusMode: '//div[@aria-label="Focus Mode"]',

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
  glassView: '//span[text()="Glass View"]',

  // ── Cutting Plane ─────────────────────────────────────────────────────
  cuttingPlaneToolbar: '[aria-label="Cutting Plane"]',

  // Standard Planes
  standardPlanes: '(//div[text()="Standard Planes"])[1]',
  standardPlanesToggle: '(//div[text()="Standard Planes"]//following::input[contains(@class,"PrivateSwitchBase-input")])[1]',
  topPlaneSlider: '(//div[text()="Top plane:"]/following::span[contains(@class,"MuiSlider-root")])[1]',
  bottomPlaneSlider: '(//div[text()="Bottom plane:"]/following::span[contains(@class,"MuiSlider-root")])[1]',
  frontPlaneSlider: '(//div[text()="Front plane:"]/following::span[contains(@class,"MuiSlider-root")])[1]',
  backPlaneSlider: '(//div[text()="Back plane:"]/following::span[contains(@class,"MuiSlider-root")])[1]',
  leftPlaneSlider: '(//div[text()="Left plane:"]/following::span[contains(@class,"MuiSlider-root")])[1]',
  rightPlaneSlider: '(//div[text()="Right plane:"]/following::span[contains(@class,"MuiSlider-root")])[1]',
  showPlanesToggle: '(//div[text()="Show planes"]//following::input[contains(@class,"PrivateSwitchBase-input")])[1]',

  // Focused Planes
  focusedPlanes: '(//div[text()="Focused Planes"])[1]',
  focusedPlanesToggle: '(//div[text()="Focused Planes"]//following::input[contains(@class,"PrivateSwitchBase-input")])[1]',
  focusedPlanesSizeSlider: '(//div[text()="Focused Planes"]/following::div[text()="Size"]/following::span[contains(@class,"MuiSlider-root")])[1]',
  changeFocusBtn: '//p[text()="Change Focus"]'
}
